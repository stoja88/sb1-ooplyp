import React, { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, Search, Filter, FileSpreadsheet, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../lib/store';
import { parseExcelData, formatExpirationDate } from '../lib/utils';
import { AnimatedTransition } from '../components/AnimatedTransition';
import type { FordUser } from '../lib/types';

const EmployeeStatus = () => {
  const { fordUsers, addFordUsers, updateFordUserStatus, extendFordUserExpiration } = useAppStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        const users = await parseExcelData(file);
        addFordUsers(users);
        toast.success(`${users.length} usuarios importados correctamente`);
      } catch (error) {
        console.error('Error importing users:', error);
        toast.error('Error al importar el archivo');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = (cdsid: string, newStatus: 'Active' | 'Hold' | 'Inactive') => {
    updateFordUserStatus(cdsid, newStatus);
    toast.success('Estado actualizado correctamente');
  };

  const handleExtendExpiration = (cdsid: string) => {
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + 6);
    extendFordUserExpiration(cdsid, newDate);
    toast.success('Fecha de expiración extendida correctamente');
  };

  const filteredUsers = fordUsers.filter(user => {
    const matchesFilter = filter === 'all' || user.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cdsid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getExpirationWarning = (expirationDate: Date) => {
    const now = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const expDate = new Date(expirationDate);

    if (expDate < now) {
      return { type: 'error', message: 'Expirado' };
    } else if (expDate < thirtyDays) {
      return { type: 'warning', message: 'Próximo a expirar' };
    }
    return null;
  };

  return (
    <AnimatedTransition>
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Usuarios Ford</h2>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm cursor-pointer hover:bg-gray-600 transition-colors">
                <Upload className="h-5 w-5 mr-2 text-gray-300" />
                <span className="text-sm font-medium text-gray-300">
                  {isLoading ? 'Importando...' : 'Importar Excel'}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".xlsx,.xls" 
                  onChange={handleFileImport}
                  disabled={isLoading}
                />
              </label>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className={`h-5 w-5 mr-2 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-gray-300">Actualizar</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, CDSID, tipo o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 rounded-md border-gray-600 bg-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="hold">En espera</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    CDSID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Expiración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.map((user) => {
                  const expirationWarning = getExpirationWarning(user.expirationDate);
                  return (
                    <tr key={user.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.cdsid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.cdsid, e.target.value as 'Active' | 'Hold' | 'Inactive')}
                          className="bg-gray-700 border-gray-600 rounded-md text-sm text-white"
                        >
                          <option value="Active">Activo</option>
                          <option value="Hold">En Espera</option>
                          <option value="Inactive">Inactivo</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.employeeType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300">
                            {formatExpirationDate(user.expirationDate)}
                          </span>
                          {expirationWarning && (
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                              expirationWarning.type === 'error' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {expirationWarning.message}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => handleExtendExpiration(user.cdsid)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Extender
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Mostrando {filteredUsers.length} de {fordUsers.length} usuarios
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default EmployeeStatus;