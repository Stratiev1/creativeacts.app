import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MoreVertical,
  File,
  Image,
  FileText,
  Video
} from 'lucide-react';

export const AssetsPanel: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for assets
  const assets = [
    {
      id: '1',
      name: 'Brand Guidelines.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      category: 'branding'
    },
    {
      id: '2',
      name: 'Logo Variations.zip',
      type: 'archive',
      size: '15.2 MB',
      uploadedAt: '2024-01-14',
      category: 'branding'
    },
    {
      id: '3',
      name: 'Website Mockup.fig',
      type: 'design',
      size: '8.7 MB',
      uploadedAt: '2024-01-12',
      category: 'design'
    },
    {
      id: '4',
      name: 'Product Photos.zip',
      type: 'images',
      size: '45.1 MB',
      uploadedAt: '2024-01-10',
      category: 'photography'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Assets' },
    { value: 'branding', label: 'Branding' },
    { value: 'design', label: 'Design' },
    { value: 'photography', label: 'Photography' },
    { value: 'documents', label: 'Documents' }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'images':
        return <Image className="h-8 w-8 text-blue-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'design':
        return <File className="h-8 w-8 text-purple-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-green-500" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const filteredAssets = selectedCategory === 'all' 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assets</h2>
          <p className="text-muted-foreground">
            Manage and organize your project assets
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Upload className="h-4 w-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter - Mobile Dropdown */}
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex-1 sm:flex-none"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex-1 sm:flex-none"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid/List */}
      <div className="flex-1 overflow-auto">
        {filteredAssets.length === 0 ? (
          <Card className="h-full">
            <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assets found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Upload your first asset to get started with organizing your project files.
              </p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Asset
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
              : "space-y-3"
          }>
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="group hover:shadow-md transition-shadow">
                {viewMode === 'grid' ? (
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      {getFileIcon(asset.type)}
                      <div className="w-full">
                        <h4 className="font-medium text-sm truncate" title={asset.name}>
                          {asset.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {asset.size}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {asset.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{asset.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">{asset.size}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <Badge variant="secondary" className="text-xs">
                            {asset.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded {asset.uploadedAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};