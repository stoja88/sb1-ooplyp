import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Plus } from 'lucide-react';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import type { Ticket } from '../lib/types';

const Ticketing = () => {
  const { tickets, createTicket, addTicketComment } = useAppStore();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleNewTicket = (data: any) => {
    createTicket(data);
    setShowNewTicket(false);
  };

  const handleAddComment = (ticketId: string, comment: string) => {
    addTicketComment(ticketId, comment, 'Usuario');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Tickets de Soporte</h2>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Ticket
        </button>
      </div>

      {showNewTicket ? (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">Crear Nuevo Ticket</h3>
          <TicketForm
            onSubmit={handleNewTicket}
            onCancel={() => setShowNewTicket(false)}
          />
        </div>
      ) : selectedTicket ? (
        <TicketDetail
          ticket={selectedTicket}
          onAddComment={handleAddComment}
          onClose={() => setSelectedTicket(null)}
        />
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <TicketList
            tickets={tickets}
            onTicketClick={setSelectedTicket}
          />
        </div>
      )}
    </div>
  );
};

export default Ticketing;