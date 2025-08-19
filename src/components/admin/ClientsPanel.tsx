import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ClientDetailPage } from './ClientDetailPage';
import { User, MessageSquare, FileText, ShoppingBag, Calendar } from 'lucide-react';

export const ClientsPanel: React.FC = () => {
  const { clients } = useData();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const selectedClientData = clients.find(client => client.id === selectedClient);

  const handleStartChat = (clientId: string, clientName: string) => {
    alert(`This would start a chat with ${clientName}`);
  };

  if (selectedClient && selectedClientData) {
    return <ClientDetailPage client={selectedClientData} onBack={() => setSelectedClient(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Clients List */}
      <div className="grid gap-4">
        {clients.map((client) => (
          <div 
            key={client.id} 
            className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setSelectedClient(client.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {client.avatar ? (
                    <img 
                      src={client.avatar} 
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black">{client.name}</h3>
                  <p className="text-gray-600">{client.email}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>{client.totalRequests} requests</span>
                    <span>{client.totalOrders} orders</span>
                    <span>Joined {new Date(client.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartChat(client.id, client.name); }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {client.subscriptions.length > 0 && (
                  <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {client.subscriptions[0]}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  Last activity: {new Date().toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                  Click to view details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};