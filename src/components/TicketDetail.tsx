import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Paperclip, Send } from 'lucide-react';
import { useState } from 'react';
import type { Ticket } from '../lib/types';

interface TicketDetailProps {
  ticket: Ticket;
  onAddComment: (ticketId: string, comment: string) => void;
  onClose: () => void;
}

export const TicketDetail = ({ ticket, onAddComment, onClose }: TicketDetailProps) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(ticket.id, comment);
      setComment('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">{ticket.title}</h2>
          <p className="text-gray-400 text-sm">#{ticket.id.slice(0, 8)}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="text-gray-400 text-sm">Estado</span>
          <p className="text-white">
            {ticket.status === 'pending' ? 'Pendiente' :
             ticket.status === 'in-progress' ? 'En Proceso' :
             'Cerrado'}
          </p>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Prioridad</span>
          <p className="text-white capitalize">{ticket.priority}</p>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Categoría</span>
          <p className="text-white capitalize">{ticket.category}</p>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Creado</span>
          <p className="text-white">
            {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-medium mb-2">Descripción</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-white font-medium mb-4">Actualizaciones</h3>
        <div className="space-y-4">
          {ticket.updates.map((update) => (
            <div key={update.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-gray-300 font-medium">{update.author}</span>
                <span className="text-gray-400 text-sm">
                  {format(new Date(update.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                </span>
              </div>
              <p className="text-gray-300">{update.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex items-start space-x-4">
          <div className="min-w-0 flex-1">
            <div className="relative">
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="block w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Añade un comentario..."
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              type="submit"
              disabled={!comment.trim()}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketDetail;