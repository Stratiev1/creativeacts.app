import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Request } from '../../types';
import { ArrowLeft, Upload, X, FileText, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    alert('Notes saved successfully');
  };

  const generateRequestId = (id: string) => {
    return `REQ-${id.padStart(4, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Request Details</h1>
            <p className="text-muted-foreground">{generateRequestId(request.id)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {request.status === 'current' && (
            <Button onClick={() => handleStatusChange('finished')}>
              Mark Complete
            </Button>
          )}
          {request.status === 'pending' && (
            <Button onClick={() => handleStatusChange('current')}>
              Start Working
            </Button>
          )}
          {request.status === 'finished' && (
            <Button variant="outline" onClick={() => handleStatusChange('current')}>
              Reopen
            </Button>
          )}
        </div>
      </div>

      {/* Request Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(request.status)}
              <Badge variant={
                request.status === 'finished' ? 'default' : 
                request.status === 'current' ? 'secondary' : 
                'outline'
              } className="capitalize">
                {request.status}
              </Badge>
            </div>
            {client && (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-1" />
                {client.name}
              </div>
            )}
          </div>
          <CardTitle className="text-xl">{request.title}</CardTitle>
          <p className="text-muted-foreground">
            Created: {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{request.description}</p>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Add notes about this request</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes about this request..."
            />
          </div>
          <Button onClick={handleSaveNotes}>
            Save Notes
          </Button>
        </CardContent>
      </Card>

      {/* Attached Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attached Files</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddFiles(true)}
            >
              Add Files
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Original Files */}
            {request.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                  <span className="text-foreground">{file}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            {/* New Files */}
            {newFiles.map((file, index) => (
              <div key={`new-${index}`} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-blue-700">{file}</span>
                  <Badge variant="secondary" className="ml-2">New</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeNewFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {request.files.length === 0 && newFiles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No files attached to this request
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Files Modal */}
      {showAddFiles && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Click to upload files</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB each</p>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddFiles(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowAddFiles(false)}>
                  Add Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};