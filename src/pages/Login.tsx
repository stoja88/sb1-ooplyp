import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Ticket, Key, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import TicketForm from '../components/TicketForm';
import AccessRequestForm from '../components/AccessRequestForm';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showGuestTicket, setShowGuestTicket] = useState(false);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, createGuestTicket, createGuestAccessRequest } = useAppStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = login(username, password);
      if (success) {
        toast.success('¡Bienvenido al Portal de Soporte!');
      } else {
        toast.error('Credenciales inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestTicket = (data: any) => {
    createGuestTicket(data);
    toast.success('Ticket creado exitosamente');
    setShowGuestTicket(false);
  };

  const handleAccessRequest = (data: any) => {
    createGuestAccessRequest(data);
    toast.success('Solicitud de acceso enviada exitosamente');
    setShowAccessRequest(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size="large" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            IT MSX Valencia Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Gestión centralizada de soporte técnico y recursos
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={showGuestTicket ? 'ticket' : showAccessRequest ? 'access' : 'login'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-700"
          >
            {!showGuestTicket && !showAccessRequest ? (
              <>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                      Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      placeholder="Ingresa tu usuario"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? <LoadingSpinner size="small" className="mr-2" /> : null}
                      Iniciar sesión
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-800 text-gray-400">
                        Acceso rápido
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowGuestTicket(true)}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                    >
                      <Ticket className="h-5 w-5 mb-1" />
                      <span>Crear Ticket</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAccessRequest(true)}
                      className="flex flex-col items-center justify-center px-4 py-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                    >
                      <Key className="h-5 w-5 mb-1" />
                      <span>Solicitar Acceso</span>
                    </motion.button>
                  </div>
                </div>
              </>
            ) : showGuestTicket ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Crear Ticket de Soporte</h3>
                  <button
                    onClick={() => setShowGuestTicket(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
                <TicketForm
                  onSubmit={handleGuestTicket}
                  onCancel={() => setShowGuestTicket(false)}
                  isPublic
                />
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Solicitar Acceso</h3>
                  <button
                    onClick={() => setShowAccessRequest(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
                <AccessRequestForm
                  onSubmit={handleAccessRequest}
                  onCancel={() => setShowAccessRequest(false)}
                  isPublic
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;