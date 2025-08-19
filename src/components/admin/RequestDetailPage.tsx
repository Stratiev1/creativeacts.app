import React, { useState } from 'react';
import { useData, Request } from '../../contexts/DataContext';
import { ArrowLeft, Upload, X, FileText, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

interface RequestDetailPageProps {
  request: Request;
  onBack: () => void;
}

export const RequestDetailPage: React.FC<RequestDetailPageProps> = ({ request, onBack }) => {
  const { updateRequestStatus, clients } = useData();
  const [notes, setNotes] = useState(request.notes || '');
  const [newFiles, setNewFiles] = useState<string[]>([]);
  const [showAddFiles, setShowAddFiles] = useState(false);

  const client = clients.find(c => c.id === request.clientId);

  const getStatusIcon = (status: Request['status']) => {
    switch (status) {
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'finished':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
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

  const handleStatusChange = (newStatus: Request['status']) => {
    updateRequestStatus(request.id, newStatus);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => file.name);
    setNewFiles(prev => [...prev, ...fileNames]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveNotes = () => {
    // In a real app, this would update the request notes
    alert('Notes saved successfully');
  };

  const generateRequestId = (id: string) => {
    return `REQ-${id.padStart(4, '0')}`;
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Requests
          </button>
          <div className="flex items-center space-x-3">
            {request.status === 'current' && (
              <button
                onClick={() => handleStatusChange('finished')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
            {request.status === 'pending' && (
              <button
                onClick={() => handleStatusChange('current')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Working
              </button>
            )}
            {request.status === 'finished' && (
              <button
                onClick={() => handleStatusChange('current')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reopen
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(request.status)}
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border capitalize ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {generateRequestId(request.id)}
          </span>
          {client && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              {client.name}
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{request.title}</h1>
        <p className="text-gray-600">
          Created: {new Date(request.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{request.description}</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about this request..."
            />
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>

        {/* Attached Files */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Attached Files</h2>
            <button
              onClick={() => setShowAddFiles(true)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Add Files
            </button>
          </div>

          <div className="space-y-3">
            {/* Original Files */}
            {request.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{file}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Download
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* New Files */}
            {newFiles.map((file, index) => (
              <div key={`new-${index}`} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-blue-700">{file}</span>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">New</span>
                </div>
                <button
                  onClick={() => removeNewFile(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {request.files.length === 0 && newFiles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No files attached to this request
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Files Modal */}
      {showAddFiles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Files</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <input
                type="file"
                onChange={handleFileUpload}
                multiple
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Click to upload files</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB each</p>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddFiles(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // In a real app, this would save the files
                  setShowAddFiles(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};