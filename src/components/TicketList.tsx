import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { Ticket } from '../lib/types';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-500/20 text-red-400';
    case 'media':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'baja':
      return 'bg-green-500/20 text-green-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-400" />;
    case 'in-progress':
      return <MessageSquare className="h-5 w-5 text-blue-400" />;
    case 'closed':
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
};

export const TicketList = ({ tickets, onTicketClick }: TicketListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Prioridad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Creado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Actualizado
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              onClick={() => onTicketClick?.(ticket)}
              className="hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                #{ticket.id.slice(0, 8)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                <div className="flex flex-col">
                  <span className="font-medium">{ticket.title}</span>
                  <span className="text-gray-400 text-xs">{ticket.category}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(ticket.status)}
                  <span className="ml-2 text-sm text-gray-300">
                    {ticket.status === 'pending' ? 'Pendiente' :
                     ticket.status === 'in-progress' ? 'En Proceso' :
                     'Cerrado'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {ticket.updates.length > 0
                  ? format(new Date(ticket.updates[ticket.updates.length - 1].createdAt), 'dd/MM/yyyy HH:mm', { locale: es })
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;