import React, { useState } from 'react';
import { Calendar, MapPin, Phone, Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppStore } from '../lib/store';

interface EquipmentType {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const equipmentTypes: EquipmentType[] = [
  { id: 'laptop', label: 'Portátil' },
  { id: 'docking', label: 'Docking Station' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'headset', label: 'Auriculares' },
  { id: 'keyboard', label: 'Teclado' },
  { id: 'mouse', label: 'Ratón' },
  { id: 'other', label: 'Otros' }
];

const EmployeeOffboarding = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cdsid: '',
    startDate: '',
    address: '',
    phone: '',
    equipment: {} as Record<string, boolean>,
    otherEquipment: '',
    comments: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para procesar la baja
    toast.success('Solicitud de baja enviada correctamente');
    
    // Resetear formulario
    setFormData({
      firstName: '',
      lastName: '',
      cdsid: '',
      startDate: '',
      address: '',
      phone: '',
      equipment: {},
      otherEquipment: '',
      comments: ''
    });
  };

  const handleEquipmentChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [id]: checked
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Baja de Empleado</h2>
          <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Proceso Irreversible
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Nombre
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Apellidos
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                CDSID
              </label>
              <input
                type="text"
                value={formData.cdsid}
                onChange={(e) => setFormData({ ...formData, cdsid: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Fecha de Baja
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Teléfono de Contacto
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white pl-10"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-200">
                Dirección de Recogida
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Equipamiento a Devolver
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {equipmentTypes.map((item) => (
                <label key={item.id} className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.equipment[item.id] || false}
                    onChange={(e) => handleEquipmentChange(item.id, e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-200">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.equipment.other && (
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Especificar Otros Equipos
              </label>
              <textarea
                value={formData.otherEquipment}
                onChange={(e) => setFormData({ ...formData, otherEquipment: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Describa otros equipos a devolver..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Comentarios Adicionales
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              placeholder="Información adicional relevante..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setFormData({
                firstName: '',
                lastName: '',
                cdsid: '',
                startDate: '',
                address: '',
                phone: '',
                equipment: {},
                otherEquipment: '',
                comments: ''
              })}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EmployeeOffboarding;