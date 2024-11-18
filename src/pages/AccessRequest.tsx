import React, { useState } from 'react';

interface AccessSystem {
  id: string;
  name: string;
  description?: string;
}

const AccessRequest = () => {
  const [formData, setFormData] = useState({
    cdsid: '',
    market: '',
    observations: '',
  });

  const systems: AccessSystem[] = [
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'finesse', name: 'FINESSE' },
    { id: 'jabber', name: 'Cisco Jabber' },
    { id: 'dealis', name: 'DEALIS' },
    { id: 'verint', name: 'VERINT' },
    { id: 'gcct', name: 'GCCT' },
    { id: 'litmos', name: 'LITMOS' },
    { id: 'smartit', name: 'SMART IT' },
    { id: 'stars', name: 'Stars' },
    { id: 'ows', name: 'OWS' },
    { id: 'cvbop_triage', name: 'CVBOP TRIAGE' },
    { id: 'cvbop_paak', name: 'CVBOP PAAK' },
    { id: 'wallbox', name: 'Wallbox Dashboard' },
    { id: 'gtac', name: 'GTAC' },
    { id: 'data_explorer', name: 'Data Explorer' },
    { id: 'app_store', name: 'APP STORE' },
    { id: 'play_store', name: 'PLAY STORE' },
    { id: 'globaluptime', name: 'GLOBALUPTIME' },
    { id: 'mobility', name: 'MOBILITY' },
    { id: 'cafex', name: 'CaféX' },
    { id: 'askford', name: 'Ask Ford' },
    { id: 'owa', name: 'OWA' },
    { id: 'microcat', name: 'Microcat' },
    { id: 'salesforce_live', name: 'SalesForce Live (TH)' },
    { id: 'salesforce_mlp', name: 'SalesForce MLP' },
  ];

  const markets = ['Italy', 'France', 'Spain', 'Portugal'];
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, selectedSystems });
  };

  const handleSystemToggle = (systemId: string) => {
    setSelectedSystems(prev =>
      prev.includes(systemId)
        ? prev.filter(id => id !== systemId)
        : [...prev, systemId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Access Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">CDSID</label>
            <input
              type="text"
              value={formData.cdsid}
              onChange={(e) => setFormData({ ...formData, cdsid: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Market</label>
            <select
              value={formData.market}
              onChange={(e) => setFormData({ ...formData, market: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Market</option>
              {markets.map(market => (
                <option key={market} value={market}>{market}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Access Required
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {systems.map((system) => (
              <label key={system.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSystems.includes(system.id)}
                  onChange={() => handleSystemToggle(system.id)}
                  className="form-checkbox h-4 w-4 text-indigo-600"
                />
                <span className="text-sm text-gray-700">{system.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Observations</label>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Access Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccessRequest;