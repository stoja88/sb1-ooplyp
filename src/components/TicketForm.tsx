import { useState } from 'react';
import { AlertCircle, Paperclip } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => void;
  onCancel?: () => void;
  isPublic?: boolean;
}

export interface TicketFormData {
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  category: string;
  name?: string;
  email?: string;
  attachments?: File[];
}

const categories = [
  { id: 'hardware', label: 'Hardware' },
  { id: 'software', label: 'Software' },
  { id: 'accesos', label: 'Accesos' },
  { id: 'red', label: 'Red' },
  { id: 'otros', label: 'Otros' }
];

export const TicketForm = ({ onSubmit, onCancel, isPublic = false }: TicketFormProps) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    priority: 'media',
    category: '',
    name: '',
    email: '',
    attachments: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isPublic && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-200">Nombre</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-200">Título</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
          placeholder="Resumen breve del problema"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Categoría</label>
        <select
          required
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Descripción</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
          rows={4}
          placeholder="Describe el problema detalladamente"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Prioridad</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value as 'alta' | 'media' | 'baja'})}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Adjuntos
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-400">
              <label className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300">
                <span>Subir archivos</span>
                <input
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">
              PDF, DOC, PNG, JPG hasta 10MB
            </p>
          </div>
        </div>
        {formData.attachments && formData.attachments.length > 0 && (
          <ul className="mt-4 space-y-2">
            {formData.attachments.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-gray-300">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-600 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Enviar Ticket
        </button>
      </div>
    </form>
  );
};

export default TicketForm;