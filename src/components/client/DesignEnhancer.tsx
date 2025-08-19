import React, { useState, useEffect } from 'react';
import { useDesignEnhancer } from '../../hooks/useDesignEnhancer';
import { Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface DesignEnhancerProps {
  onSelectionsChange: (selections: { [categoryId: string]: string }) => void;
  initialSelections?: { [categoryId: string]: string };
}

export const DesignEnhancer: React.FC<DesignEnhancerProps> = ({ 
  onSelectionsChange, 
  initialSelections = {} 
}) => {
  const { categories, options, isLoading, error, getOptionsByCategory } = useDesignEnhancer();
  const [selections, setSelections] = useState<{ [categoryId: string]: string }>(initialSelections);
  const [expandedCategories, setExpandedCategories] = useState<{ [categoryId: string]: boolean }>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // Auto-expand first category on load
    if (categories.length > 0 && Object.keys(expandedCategories).length === 0) {
      setExpandedCategories({ [categories[0].id]: true });
    }
  }, [categories]);

  useEffect(() => {
    onSelectionsChange(selections);
  }, [selections, onSelectionsChange]);

  const handleOptionSelect = (categoryId: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === optionId ? '' : optionId
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleViewAll = (categoryId: string) => {
    const categoryOptions = getOptionsByCategory(categoryId);
    if (categoryOptions.length > 0) {
      setPreviewImage(categoryOptions[0].image_url || null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Design Request Enhancer</h3>
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Design Request Enhancer</h3>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Design Request Enhancer</h3>
        <span className="text-sm text-gray-500">(Optional)</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Help us create the perfect design by selecting your preferences below. This is optional but helps us deliver exactly what you're looking for.
      </p>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryOptions = getOptionsByCategory(category.id);
          const isExpanded = expandedCategories[category.id];
          const selectedOption = selections[category.id];
          const selectedOptionData = categoryOptions.find(opt => opt.id === selectedOption);

          return (
            <div key={category.id} className="border border-gray-200 rounded-lg bg-white">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  {selectedOptionData && (
                    <p className="text-sm text-purple-600 mt-1">
                      Selected: {selectedOptionData.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAll(category.id);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    View all
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {categoryOptions.map((option) => {
                      const isSelected = selections[category.id] === option.id;
                      
                      return (
                        <div
                          key={option.id}
                          onClick={() => handleOptionSelect(category.id, option.id)}
                          className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          {option.image_url ? (
                            <div className="aspect-square rounded-t-lg overflow-hidden">
                              <img
                                src={option.image_url}
                                alt={option.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                              <span className="text-2xl font-bold text-gray-400">
                                {option.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          <div className="p-3">
                            <h5 className="font-medium text-gray-900 text-sm">{option.name}</h5>
                            {option.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {option.description}
                              </p>
                            )}
                          </div>

                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {Object.keys(selections).length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Your Design Preferences</h4>
          <div className="space-y-1">
            {Object.entries(selections).map(([categoryId, optionId]) => {
              const category = categories.find(c => c.id === categoryId);
              const option = options.find(o => o.id === optionId);
              
              if (!category || !option) return null;
              
              return (
                <p key={categoryId} className="text-sm text-purple-800">
                  <strong>{category.name}:</strong> {option.name}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};