import { Outlet } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { LogOut, User } from 'lucide-react';
import Logo from './Logo';

const Layout = () => {
  const { user, logout } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Logo size="small" />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="ml-2 p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                    title="Cerrar sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;