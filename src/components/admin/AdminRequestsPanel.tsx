import React, { useState } from 'react';
import { useData, Request } from '../../contexts/DataContext';
import { RequestDetailPage } from './RequestDetailPage';
import { FileText, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ViewMode = 'current' | 'finished';

export const AdminRequestsPanel: React.FC = () => {
  const { requests, updateRequestStatus, clients } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('current');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const filteredRequests = requests.filter(req => req.status === viewMode);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getStatusIcon = (status: Request['status']) => {
    switch (status) {
      case 'current':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'finished':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
    updateRequestStatus(requestId, newStatus);
  };

  if (selectedRequest) {
    return <RequestDetailPage request={selectedRequest} onBack={() => setSelectedRequest(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <TabsList className="grid w-full grid-cols-2">
          {(['current', 'finished'] as ViewMode[]).map((mode) => (
            <TabsTrigger key={mode} value={mode} className="capitalize">
              {mode} ({requests.filter(req => req.status === mode).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">
                No {viewMode} requests
              </CardTitle>
              <p className="text-muted-foreground">
                {viewMode === 'current' && "No active requests to work on."}
                {viewMode === 'finished' && "No completed requests yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card 
              key={request.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge 
                          variant={
                            request.status === 'finished' ? 'default' : 
                            request.status === 'current' ? 'secondary' : 
                            'outline'
                          } 
                          className="capitalize"
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {getClientName(request.clientId)}
                      </div>
                    </div>
                    
                    <CardTitle className="mb-2">
                      {request.title}
                    </CardTitle>
                    <p className="text-muted-foreground mb-3">
                      {request.description}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Notes:</span> {request.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                    {request.files.length > 0 && (
                      <span>{request.files.length} file(s) attached</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {request.status === 'pending' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(request.id, 'current'); }}
                      >
                        Start Working
                      </Button>
                    )}
                    {request.status === 'current' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(request.id, 'finished'); }}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {request.status === 'finished' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(request.id, 'current'); }}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mt-2">
                  Click to view details • REQ-{request.id.padStart(4, '0')}
                </div>

                {request.files.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-foreground mb-2">Attached Files:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.files.map((file, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};