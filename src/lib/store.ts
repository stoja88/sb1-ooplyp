import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AssetCollection, Ticket, AdminUser, Notification, AccessRequest, FordUser } from './types';
import { generateId } from './utils';

const defaultAdminUser: AdminUser = {
  id: 'admin-1',
  username: 'ivan',
  password: 'admin123@@',
  name: 'Iván',
  email: 'admin@msxinternational.com',
  role: 'admin',
  permissions: ['all'],
  createdAt: new Date().toISOString(),
  status: 'active'
};

interface AppState {
  version: number;
  isAuthenticated: boolean;
  user: User | null;
  adminUsers: AdminUser[];
  tickets: Ticket[];
  notifications: Notification[];
  accessRequests: AccessRequest[];
  assetCollections: AssetCollection[];
  fordUsers: FordUser[];
  theme: 'light' | 'dark';

  // Acciones de autenticación
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Acciones para usuarios Ford
  addFordUsers: (users: FordUser[]) => void;
  updateFordUser: (cdsid: string, updates: Partial<FordUser>) => void;
  deleteFordUser: (cdsid: string) => void;
  updateFordUserStatus: (cdsid: string, status: 'Active' | 'Hold' | 'Inactive') => void;
  extendFordUserExpiration: (cdsid: string, newDate: Date) => void;

  // Acciones para notificaciones
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const initialState: Partial<AppState> = {
  version: 1,
  isAuthenticated: false,
  user: null,
  adminUsers: [defaultAdminUser],
  tickets: [],
  notifications: [],
  accessRequests: [],
  assetCollections: [],
  fordUsers: [],
  theme: 'dark'
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState as AppState,

      login: (username, password) => {
        const adminUsers = get().adminUsers;
        const user = adminUsers.find(
          u => u.username === username && u.password === password && u.status === 'active'
        );

        if (user) {
          set({
            isAuthenticated: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              permissions: user.permissions
            }
          });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false, user: null }),

      addFordUsers: (users) => {
        set((state) => {
          const existingUserMap = new Map(
            state.fordUsers.map(user => [user.cdsid, user])
          );

          users.forEach(newUser => {
            const existingUser = existingUserMap.get(newUser.cdsid);
            if (existingUser) {
              existingUserMap.set(newUser.cdsid, {
                ...existingUser,
                ...newUser,
                lastModified: new Date().toISOString()
              });
            } else {
              existingUserMap.set(newUser.cdsid, {
                ...newUser,
                id: generateId(),
                lastModified: new Date().toISOString(),
                modifiedBy: state.user?.name || 'System'
              });
            }
          });

          const updatedUsers = Array.from(existingUserMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));

          return { fordUsers: updatedUsers };
        });
      },

      updateFordUser: (cdsid, updates) => {
        set((state) => ({
          fordUsers: state.fordUsers.map((user) =>
            user.cdsid === cdsid
              ? {
                  ...user,
                  ...updates,
                  lastModified: new Date().toISOString(),
                  modifiedBy: state.user?.name || 'System'
                }
              : user
          )
        }));
      },

      deleteFordUser: (cdsid) => {
        set((state) => ({
          fordUsers: state.fordUsers.filter((user) => user.cdsid !== cdsid)
        }));
      },

      updateFordUserStatus: (cdsid, status) => {
        set((state) => ({
          fordUsers: state.fordUsers.map((user) =>
            user.cdsid === cdsid
              ? {
                  ...user,
                  status,
                  lastModified: new Date().toISOString(),
                  modifiedBy: state.user?.name || 'System'
                }
              : user
          )
        }));

        const user = get().fordUsers.find(u => u.cdsid === cdsid);
        if (user) {
          get().addNotification({
            title: 'Estado de Usuario Actualizado',
            message: `${user.name} (${cdsid}) - Nuevo estado: ${status}`,
            type: status === 'Active' ? 'success' : status === 'Hold' ? 'warning' : 'error'
          });
        }
      },

      extendFordUserExpiration: (cdsid, newDate) => {
        set((state) => ({
          fordUsers: state.fordUsers.map((user) =>
            user.cdsid === cdsid
              ? {
                  ...user,
                  expirationDate: newDate,
                  lastModified: new Date().toISOString(),
                  modifiedBy: state.user?.name || 'System'
                }
              : user
          )
        }));

        const user = get().fordUsers.find(u => u.cdsid === cdsid);
        if (user) {
          get().addNotification({
            title: 'Fecha de Expiración Actualizada',
            message: `${user.name} (${cdsid}) - Nueva fecha: ${newDate.toLocaleDateString()}`,
            type: 'info'
          });
        }
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            {
              id: generateId(),
              ...notification,
              createdAt: new Date().toISOString(),
              read: false
            },
            ...state.notifications
          ]
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      }
    }),
    {
      name: 'it-portal-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        adminUsers: state.adminUsers,
        tickets: state.tickets,
        notifications: state.notifications,
        accessRequests: state.accessRequests,
        assetCollections: state.assetCollections,
        fordUsers: state.fordUsers,
        theme: state.theme
      })
    }
  )
);