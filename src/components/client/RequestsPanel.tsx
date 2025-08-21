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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

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
        <Button
          onClick={() => setShowCreateForm(true)}
          className="w-full sm:w-auto"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Request
        </Button>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <TabsList className="grid w-full grid-cols-3">
          {(['current', 'finished', 'pending'] as ViewMode[]).map((mode) => (
            <TabsTrigger key={mode} value={mode} className="capitalize">
              {mode} ({userRequests.filter(req => req.status === mode).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Create Request Form */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
            <DialogDescription>
              Provide details about your design requirements
            </DialogDescription>
          </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Logo Design for Tech Startup"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your project requirements..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any additional notes or preferences..."
                />
              </div>

              <div>
                <Label>
                  Upload Files
                </Label>
                <div className="border-2 border-dashed border-border rounded-md p-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG up to 10MB each
                    </span>
                  </label>
                </div>

                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm text-foreground">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Design Enhancer Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    Design Request Enhancer
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Help us understand your design preferences (optional)
                  </p>
                </div>
                <Switch
                  checked={showEnhancer}
                  onCheckedChange={setShowEnhancer}
                />
              </div>

              {/* Design Enhancer */}
              {showEnhancer && (
                <DesignEnhancer
                  onSelectionsChange={setEnhancerSelections}
                  initialSelections={enhancerSelections}
                />
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEnhancer(false);
                    setEnhancerSelections({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Create Request
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No {viewMode} requests
            </h3>
            <p className="text-muted-foreground">
              {viewMode === 'current' && "You don't have any active requests at the moment."}
              {viewMode === 'finished' && "No completed requests yet."}
              {viewMode === 'pending' && "No pending requests at the moment."}
            </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(request.status)}
                    <Badge variant={request.status === 'finished' ? 'default' : request.status === 'current' ? 'secondary' : 'outline'} className="capitalize">
                      {request.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {request.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {request.description}
                  </p>
                  {request.notes && (
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Notes:</strong> {request.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  {request.files.length > 0 && (
                    <span>{request.files.length} file(s) attached</span>
                  )}
                </div>
              </div>

              {request.files.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
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