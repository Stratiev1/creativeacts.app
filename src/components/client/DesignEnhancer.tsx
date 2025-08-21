import React, { useState, useEffect } from 'react';
import { useDesignEnhancer } from '../../hooks/useDesignEnhancer';
import { Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Design Request Enhancer</span>
            <Badge variant="secondary">Optional</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Design Request Enhancer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Design Request Enhancer</span>
          <Badge variant="secondary">Optional</Badge>
        </CardTitle>
        <CardDescription>
          Help us create the perfect design by selecting your preferences below. This is optional but helps us deliver exactly what you're looking for.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const categoryOptions = getOptionsByCategory(category.id);
          const isExpanded = expandedCategories[category.id];
          const selectedOption = selections[category.id];
          const selectedOptionData = categoryOptions.find(opt => opt.id === selectedOption);

          return (
            <Collapsible
              key={category.id}
              open={isExpanded}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto p-4"
                  >
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">{category.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      {selectedOptionData && (
                        <p className="text-sm text-primary mt-1">
                          Selected: {selectedOptionData.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAll(category.id);
                        }}
                      >
                        View all
                      </Button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {categoryOptions.map((option) => {
                        const isSelected = selections[category.id] === option.id;
                        
                        return (
                          <Card
                            key={option.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected
                                ? 'ring-2 ring-primary bg-primary/5'
                                : 'hover:ring-1 hover:ring-primary/50'
                            }`}
                            onClick={() => handleOptionSelect(category.id, option.id)}
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
                              <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                                <span className="text-2xl font-bold text-muted-foreground">
                                  {option.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            
                            <CardContent className="p-3">
                              <h5 className="font-medium text-foreground text-sm">{option.name}</h5>
                              {option.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {option.description}
                                </p>
                              )}
                            </CardContent>

                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}

        {/* Preview Modal */}
        {previewImage && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
          <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">Your Design Preferences:</span>
              <div className="space-y-1 mt-2">
                {Object.entries(selections).map(([categoryId, optionId]) => {
                  const category = categories.find(c => c.id === categoryId);
                  const option = options.find(o => o.id === optionId);
                  
                  if (!category || !option) return null;
                  
                  return (
                    <p key={categoryId} className="text-sm">
                      <span className="font-medium">{category.name}:</span> {option.name}
                    </p>
                  );
                })}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};