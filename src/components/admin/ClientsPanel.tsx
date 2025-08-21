import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ClientDetailPage } from './ClientDetailPage';
import { User, MessageSquare, FileText, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
          <Card 
            key={client.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedClient(client.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
                    <p className="text-muted-foreground">{client.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{client.totalRequests} requests</span>
                      <span>{client.totalOrders} orders</span>
                      <span>Joined {new Date(client.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); handleStartChat(client.id, client.name); }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {client.subscriptions.length > 0 && (
                      <Badge variant="secondary">
                        {client.subscriptions[0]}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Last activity: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Click to view details
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};