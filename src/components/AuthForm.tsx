import React, { useState } from 'react';
import { useData, Request } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DesignEnhancer } from './DesignEnhancer';
import { useDesignEnhancer } from '../../hooks/useDesignEnhancer';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type ViewMode = 'current' | 'finished' | 'pending';

export const RequestsPanel: React.FC = () => {
  const { requests, addRequest } = useData();
  const { user } = useAuth();
  const { saveSelections } = useDesignEnhancer();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('current');
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [enhancerSelections, setEnhancerSelections] = useState<{ [categoryId: string]: string }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    files: [] as string[]
  });

  const userRequests = requests.filter(req => req.clientId === user?.id);
  const filteredRequests = userRequests.filter(req => req.status === viewMode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newRequest = {
      ...formData,
      clientId: user.id,
      status: 'pending'
    };

    addRequest(newRequest);

    // Save design enhancer selections if any
    if (Object.keys(enhancerSelections).length > 0) {
      const requestId = Date.now().toString(); // This should match the ID generated in addRequest
      saveSelections(requestId, enhancerSelections);
    }

    setFormData({ title: '', description: '', notes: '', files: [] });
    setEnhancerSelections({});
    setShowEnhancer(false);
    setShowCreateForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...fileNames]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Request
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-2 bg-primary-grey p-2 rounded-xl overflow-x-auto">
        {(['current', 'finished', 'pending'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 capitalize whitespace-nowrap ${
              viewMode === mode
                ? 'bg-primary-white text-primary-black shadow-md'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {mode} ({userRequests.filter(req => req.status === mode).length})
          </button>
        ))}
      </div>

      {/* Create Request Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateForm(false)}>
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-primary-black">Create New Request</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-primary-black"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Logo Design for Tech Startup"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  placeholder="Describe your project requirements..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  placeholder="Any additional notes or preferences..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, JPG, PNG up to 10MB each
                    </span>
                  </label>
                </div>

                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Design Enhancer Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Design Request Enhancer
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Help us understand your design preferences (optional)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEnhancer(!showEnhancer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    showEnhancer ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      showEnhancer ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Design Enhancer */}
              {showEnhancer && (
                <DesignEnhancer
                  onSelectionsChange={setEnhancerSelections}
                  initialSelections={enhancerSelections}
                />
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEnhancer(false);
                    setEnhancerSelections({});
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-primary-grey transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {viewMode} requests
            </h3>
            <p className="text-gray-500">
              {viewMode === 'current' && "You don't have any active requests at the moment."}
              {viewMode === 'finished' && "No completed requests yet."}
              {viewMode === 'pending' && "No pending requests at the moment."}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(request.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
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

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  {request.files.length > 0 && (
                    <span>{request.files.length} file(s) attached</span>
                  )}
                </div>
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