import { useState } from 'react';
import { Key } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccessRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPublic?: boolean;
}

export const AccessRequestForm = ({ onSubmit, onCancel, isPublic = false }: AccessRequestFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cdsid: '',
    systems: [] as string[],
    justification: ''
  });

  const systems = [
    { id: 'email', name: 'Correo Electrónico' },
    { id: 'vpn', name: 'VPN' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'sharepoint', name: 'SharePoint' },
    { id: 'sap', name: 'SAP' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-200">
          Nombre Completo
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          CDSID
        </label>
        <input
          type="text"
          required
          value={formData.cdsid}
          onChange={(e) => setFormData({ ...formData, cdsid: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Sistemas Requeridos
        </label>
        <div className="space-y-2">
          {systems.map((system) => (
            <label key={system.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.systems.includes(system.id)}
                onChange={(e) => {
                  const newSystems = e.target.checked
                    ? [...formData.systems, system.id]
                    : formData.systems.filter(s => s !== system.id);
                  setFormData({ ...formData, systems: newSystems });
                }}
                className="rounded border-gray-600 bg-gray-700 text-indigo-600"
              />
              <span className="ml-2 text-gray-200">{system.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Justificación
        </label>
        <textarea
          required
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
          placeholder="Explique por qué necesita acceso a estos sistemas"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Enviar Solicitud
        </button>
      </div>
    </motion.form>
  );
};

export default AccessRequestForm;