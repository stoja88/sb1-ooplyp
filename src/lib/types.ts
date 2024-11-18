export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support';
  permissions: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'support';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface FordUser {
  id: string;
  name: string;
  cdsid: string;
  expirationDate: Date;
  status: 'Active' | 'Hold' | 'Inactive';
  employeeType: string;
  company: string;
  lastModified?: string;
  modifiedBy?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  category: string;
  createdBy?: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'closed';
  createdAt: string;
  closedAt?: string;
  updates: TicketUpdate[];
  attachments?: string[];
}

export interface TicketUpdate {
  id: string;
  comment: string;
  author: string;
  createdAt: string;
  status?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface AccessRequest {
  id: string;
  userId: string;
  systems: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  rejectedBy?: string;
  comments?: string;
}

export interface AssetCollection {
  id: string;
  employeeName: string;
  employeeId: string;
  collectionDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  address: string;
  contactPhone: string;
  items: Array<{ type: string }>;
}