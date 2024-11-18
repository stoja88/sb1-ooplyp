import { useState } from 'react';
import { Calendar, Phone, MapPin, Package, Trash2, CheckCircle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface AssetCollectionForm {
  fullName: string;
  cdsid: string;
  collectionDate: string;
  phone: string;
  address: string;
  assets: {
    laptop: boolean;
    dockingStation: boolean;
    monitor: boolean;
    phone: boolean;
  };
  otherAssets: string;
}

const initialForm: AssetCollectionForm = {
  fullName: '',
  cdsid: '',
  collectionDate: '',
  phone: '',
  address: '',
  assets: {
    laptop: false,
    dockingStation: false,
    monitor: false,
    phone: false,
  },
  otherAssets: '',
};

const AssetCollection = () => {
  const [form, setForm] = useState<AssetCollectionForm>(initialForm);
  const { 
    addAssetCollection, 
    assetCollections = [], 
    cancelAssetCollection,
    completeAssetCollection 
  } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const collection = {
      id: `COL-${Date.now()}`,
      employeeName: form.fullName,
      employeeId: form.cdsid,
      collectionDate: form.collectionDate,
      status: 'scheduled' as const,
      address: form.address,
      contactPhone: form.phone,
      items: [
        ...(form.assets.laptop ? [{ type: 'Portátil' }] : []),
        ...(form.assets.dockingStation ? [{ type: 'Docking Station' }] : []),
        ...(form.assets.monitor ? [{ type: 'Monitor' }] : []),
        ...(form.assets.phone ? [{ type: 'Teléfono' }] : []),
        ...(form.otherAssets ? [{ type: form.otherAssets }] : []),
      ],
    };

    addAssetCollection(collection);
    setForm(initialForm);
    toast.success('Recogida programada correctamente');
  };

  const handleCancel = (id: string) => {
    cancelAssetCollection(id);
    toast.success('Recogida cancelada');
  };

  const handleComplete = (id: string) => {
    completeAssetCollection(id);
    toast.success('Recogida marcada como completada');
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Package className="mr-2 h-6 w-6" />
          Recogida de Activos
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Nombre Completo
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                CDSID
              </label>
              <input
                type="text"
                value={form.cdsid}
                onChange={(e) => setForm({ ...form, cdsid: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Fecha de Recogida
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={form.collectionDate}
                  onChange={(e) => setForm({ ...form, collectionDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Teléfono de Contacto
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Dirección de Recogida
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Equipos a Recoger
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries({
                laptop: 'Portátil',
                dockingStation: 'Docking Station',
                monitor: 'Monitor',
                phone: 'Teléfono',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={form.assets[key as keyof typeof form.assets]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        assets: {
                          ...form.assets,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-200">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Otros equipos o materiales
            </label>
            <textarea
              value={form.otherAssets}
              onChange={(e) => setForm({ ...form, otherAssets: e.target.value })}
              placeholder="Especifique otros equipos..."
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setForm(initialForm)}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Programar Recogida
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Recogidas Programadas
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Equipos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {assetCollections.map((collection) => (
                <tr key={collection.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {collection.employeeName}
                    <div className="text-xs text-gray-400">{collection.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {format(new Date(collection.collectionDate), 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      collection.status === 'scheduled'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : collection.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {collection.status === 'scheduled' ? 'Programada' : 
                       collection.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {collection.items.map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-700 rounded-full"
                        >
                          {item.type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <div className="flex space-x-2">
                      {collection.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleComplete(collection.id)}
                            className="text-green-400 hover:text-green-300"
                            title="Marcar como completada"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleCancel(collection.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Cancelar recogida"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetCollection;