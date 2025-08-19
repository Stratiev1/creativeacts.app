import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Plus, 
  Download, 
  Trash2, 
  CheckSquare, 
  Square,
  Search,
  Filter,
  Grid3X3,
  List,
  File,
  Image,
  FileText,
  X,
  Eye
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: string;
  uploadDate: string;
  category: string;
  url?: string;
}

interface Category {
  id: string;
  name: string;
  type: 'common' | 'custom';
  count: number;
}

const mockCategories: Category[] = [
  { id: 'logotypes', name: 'Logotypes', type: 'common', count: 12 },
  { id: 'typography', name: 'Typography', type: 'common', count: 8 },
  { id: 'colors', name: 'Colors', type: 'common', count: 5 },
  { id: 'style-guides', name: 'Style guides', type: 'common', count: 3 },
  { id: 'illustrations', name: 'Illustrations', type: 'common', count: 15 },
  { id: 'images', name: 'Images', type: 'common', count: 24 },
  { id: 'icons', name: 'Icons', type: 'common', count: 45 },
  { id: 'animations', name: 'Animations', type: 'common', count: 7 },
  { id: 'templates', name: 'Templates', type: 'common', count: 11 },
  { id: 'artwork', name: 'Artwork', type: 'common', count: 9 },
  { id: 'other', name: 'Other', type: 'common', count: 6 }
];

const mockAssets: Asset[] = [
  { id: '1', name: 'logo-primary.svg', type: 'image', size: '24 KB', uploadDate: '2024-01-15', category: 'logotypes' },
  { id: '2', name: 'brand-guidelines.pdf', type: 'document', size: '2.1 MB', uploadDate: '2024-01-14', category: 'style-guides' },
  { id: '3', name: 'hero-image.jpg', type: 'image', size: '856 KB', uploadDate: '2024-01-13', category: 'images' },
  { id: '4', name: 'icon-set.zip', type: 'other', size: '145 KB', uploadDate: '2024-01-12', category: 'icons' },
  { id: '5', name: 'color-palette.png', type: 'image', size: '45 KB', uploadDate: '2024-01-11', category: 'colors' },
  { id: '6', name: 'font-specimen.pdf', type: 'document', size: '1.2 MB', uploadDate: '2024-01-10', category: 'typography' }
];

export const AssetsPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('logotypes');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const filteredAssets = assets.filter(asset => 
    asset.category === selectedCategory && 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const getFileIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileType = (fileName: string): Asset['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) return 'image';
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) return 'document';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const newAssets: Asset[] = [];
      
      for (const file of Array.from(files)) {
        const newAsset: Asset = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: getFileType(file.name),
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          category: selectedCategory,
          url: URL.createObjectURL(file)
        };
        newAssets.push(newAsset);
      }

      setAssets(prev => [...newAssets, ...prev]);
      
      // Update category count
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory 
          ? { ...cat, count: cat.count + newAssets.length }
          : cat
      ));

      // Clear selection
      setSelectedAssets([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedCategory]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedAssets.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedAssets.length} selected asset(s)?`)) {
      const deletedCount = selectedAssets.length;
      setAssets(prev => prev.filter(asset => !selectedAssets.includes(asset.id)));
      
      // Update category count
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory 
          ? { ...cat, count: Math.max(0, cat.count - deletedCount) }
          : cat
      ));
      
      setSelectedAssets([]);
    }
  };

  const handleDownloadSelected = () => {
    selectedAssets.forEach(assetId => {
      const asset = assets.find(a => a.id === assetId);
      if (asset?.url) {
        const link = document.createElement('a');
        link.href = asset.url;
        link.download = asset.name;
        link.click();
      }
    });
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        name: newCategoryName,
        type: 'custom',
        count: 0
      };
      
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setShowCreateCategory(false);
      setSelectedCategory(newCategory.id);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? All assets in this category will be moved to "Other".')) {
      // Move assets to "other" category
      setAssets(prev => prev.map(asset => 
        asset.category === categoryId 
          ? { ...asset, category: 'other' }
          : asset
      ));
      
      // Remove category
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      // Switch to "other" category if current category was deleted
      if (selectedCategory === categoryId) {
        setSelectedCategory('other');
      }
    }
  };

  const handlePreviewAsset = (asset: Asset) => {
    if (asset.url) {
      window.open(asset.url, '_blank');
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Client Assets</h2>
            <button 
              onClick={() => setShowCreateCategory(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Create new category"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="group">
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{category.count}</span>
                      {category.type === 'custom' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {selectedCategoryData?.name || 'Assets'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Client Assets / {selectedCategoryData?.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {selectedAssets.length === filteredAssets.length && filteredAssets.length > 0 ? (
                  <CheckSquare className="h-4 w-4 mr-2" />
                ) : (
                  <Square className="h-4 w-4 mr-2" />
                )}
                Select all
              </button>
              {selectedAssets.length > 0 && (
                <>
                  <button 
                    onClick={handleDownloadSelected}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download ({selectedAssets.length})
                  </button>
                  <button 
                    onClick={handleDeleteSelected}
                    className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedAssets.length})
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          className={`flex-1 p-6 ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragOver ? 'Drop files here to upload' : 'No assets in this category'}
              </h3>
              <p className="text-gray-600 mb-4">
                {isDragOver ? 'Release to upload files' : 'Upload files or drag and drop them here'}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className={`${
                    viewMode === 'grid'
                      ? 'p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer group'
                      : 'flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group'
                  } ${selectedAssets.includes(asset.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                  onClick={() => handleAssetSelect(asset.id)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-center justify-center h-16 mb-3 relative">
                        {getFileIcon(asset.type)}
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewAsset(asset);
                            }}
                            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{asset.size}</p>
                      <p className="text-xs text-gray-400">{asset.uploadDate}</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mr-3">
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => handleAssetSelect(asset.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="mr-3">
                        {getFileIcon(asset.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h4>
                        <p className="text-xs text-gray-500">{asset.uploadDate}</p>
                      </div>
                      <div className="text-sm text-gray-500 mr-3">{asset.size}</div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewAsset(asset);
                          }}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Drop files to upload</p>
          </div>
        </div>
      )}
    </div>
  );
};