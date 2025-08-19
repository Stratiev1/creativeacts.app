import React, { useState } from 'react';
import { useData, Request } from '../../contexts/DataContext';
import { RequestDetailPage } from './RequestDetailPage';
import { FileText, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

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

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'current':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'finished':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
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
      <h2 className="text-2xl font-bold text-black">Requests</h2>

      {/* View Mode Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {(['current', 'finished'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 min-w-[120px] px-3 py-2 text-sm font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
              viewMode === mode
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {mode} ({requests.filter(req => req.status === mode).length})
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {viewMode} requests
            </h3>
            <p className="text-gray-500">
              {viewMode === 'current' && "No active requests to work on."}
              {viewMode === 'finished' && "No completed requests yet."}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      {getClientName(request.clientId)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {request.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {request.description}
                  </p>
                  {request.notes && (
                    <p className="text-sm text-gray-500 mb-3">
                      <strong>Notes:</strong> {request.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  {request.files.length > 0 && (
                    <span>{request.files.length} file(s) attached</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {request.status === 'pending' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(request.id, 'current'); }}
                      onClick={() => handleStatusChange(request.id, 'current')}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Start Working
                    </button>
                  )}
                  {request.status === 'current' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(request.id, 'finished'); }}
                      onClick={() => handleStatusChange(request.id, 'finished')}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                  {request.status === 'finished' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(request.id, 'current'); }}
                      onClick={() => handleStatusChange(request.id, 'current')}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                Click to view details • REQ-{request.id.padStart(4, '0')}
              </div>

              {request.files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.files.map((file, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};