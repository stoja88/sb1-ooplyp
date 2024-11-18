import { useState, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Ticket, 
  Key, 
  UserMinus,
  Activity,
  Clock,
  AlertTriangle,
  ChevronRight,
  Package,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

const NavigationCard = ({ 
  title, 
  description,
  icon: Icon, 
  to,
  color = 'bg-indigo-600'
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
  color?: string;
}) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer h-full"
      >
        <div className="flex items-start space-x-4">
          <div className={`rounded-lg p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-200">{title}</h3>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = 0,
  color = 'bg-indigo-600',
  link = ''
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  color?: string;
  link?: string;
}) => {
  const Card = motion.div;
  const content = (
    <Card
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`rounded-lg p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-200">{title}</h3>
            <p className="text-2xl font-semibold text-white">{value}</p>
          </div>
        </div>
        {trend !== 0 && (
          <div className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </Card>
  );

  return link ? (
    <Link to={link}>{content}</Link>
  ) : content;
};

const Dashboard = () => {
  const { user, tickets = [], fordUsers = [] } = useAppStore();
  const [stats, setStats] = useState({
    activeUsers: 0,
    openTickets: 0,
    pendingAccess: 0,
    pendingOffboarding: 0
  });

  useEffect(() => {
    const activeUsers = fordUsers.filter(u => u.status === 'Active').length;
    const openTickets = tickets.filter(t => t.status !== 'closed').length;
    
    setStats({
      activeUsers,
      openTickets,
      pendingAccess: 5,
      pendingOffboarding: 2
    });
  }, [fordUsers, tickets]);

  const navigation = [
    {
      title: 'Estado de Empleados',
      description: 'Gestiona los usuarios Ford y sus accesos',
      to: '/employee-status',
      icon: Users,
      color: 'bg-blue-600'
    },
    {
      title: 'Baja de Empleados',
      description: 'Proceso de offboarding de empleados',
      to: '/employee-offboarding',
      icon: UserMinus,
      color: 'bg-red-600'
    },
    {
      title: 'Solicitud de Accesos',
      description: 'Gestiona las solicitudes de acceso a sistemas',
      to: '/access-request',
      icon: Key,
      color: 'bg-yellow-600'
    },
    {
      title: 'Tickets de Soporte',
      description: 'Sistema de tickets y seguimiento',
      to: '/ticketing',
      icon: Ticket,
      color: 'bg-green-600'
    },
    {
      title: 'Recogida de Equipos',
      description: 'Gestión de devolución de activos',
      to: '/asset-collection',
      icon: Package,
      color: 'bg-purple-600'
    },
    ...(user?.role === 'admin' ? [{
      title: 'Administración',
      description: 'Panel de control administrativo',
      to: '/admin',
      icon: Shield,
      color: 'bg-orange-600'
    }] : []),
  ];

  const expiringUsers = fordUsers.filter(user => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return isAfter(thirtyDaysFromNow, user.expirationDate) && user.status === 'Active';
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-400 mt-1">
            Panel de Control de Soporte IT
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Empleados Activos"
          value={stats.activeUsers}
          icon={Users}
          color="bg-blue-600"
          link="/employee-status"
        />
        <StatCard
          title="Tickets Abiertos"
          value={stats.openTickets}
          icon={Ticket}
          color="bg-green-600"
          link="/ticketing"
        />
        <StatCard
          title="Solicitudes de Acceso"
          value={stats.pendingAccess}
          icon={Key}
          color="bg-yellow-600"
          link="/access-request"
        />
        <StatCard
          title="Bajas Pendientes"
          value={stats.pendingOffboarding}
          icon={UserMinus}
          color="bg-red-600"
          link="/employee-offboarding"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigation.map((item) => (
          <NavigationCard
            key={item.to}
            title={item.title}
            description={item.description}
            icon={item.icon}
            to={item.to}
            color={item.color}
          />
        ))}
      </div>

      {expiringUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-yellow-400 flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Accesos Próximos a Expirar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringUsers.map(user => (
              <div
                key={user.id}
                className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.cdsid}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm">
                    {format(new Date(user.expirationDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Tickets Recientes
            </h2>
            <Link
              to="/ticketing"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {tickets.slice(0, 5).map(ticket => (
              <div key={ticket.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">{ticket.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    ticket.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status === 'pending' ? 'Pendiente' :
                     ticket.status === 'in-progress' ? 'En Proceso' :
                     'Completado'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{ticket.description.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Usuarios Recientes
            </h2>
            <Link
              to="/employee-status"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Ver todos <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {fordUsers.slice(0, 5).map(user => (
              <div key={user.id} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.cdsid}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    user.status === 'Hold' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;