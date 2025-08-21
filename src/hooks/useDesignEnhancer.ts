import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DesignEnhancerCategory, DesignEnhancerOption } from '../types';

export interface RequestEnhancerSelection {
  id: string;
  request_id: string;
  category_id: string;
  option_id: string;
  category?: DesignEnhancerCategory;
  option?: DesignEnhancerOption;
}

export const useDesignEnhancer = () => {
  const [categories, setCategories] = useState<DesignEnhancerCategory[]>([]);
  const [options, setOptions] = useState<DesignEnhancerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('design_enhancer_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load design categories');
    }
  };

  const fetchOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('design_enhancer_options')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setOptions(data || []);
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to load design options');
    }
  };

  const saveSelections = async (requestId: string, selections: { [categoryId: string]: string }) => {
    try {
      // First, delete existing selections for this request
      await supabase
        .from('request_enhancer_selections')
        .delete()
        .eq('request_id', requestId);

      // Insert new selections
      const selectionsToInsert = Object.entries(selections).map(([categoryId, optionId]) => ({
        request_id: requestId,
        category_id: categoryId,
        option_id: optionId
      }));

      if (selectionsToInsert.length > 0) {
        const { error } = await supabase
          .from('request_enhancer_selections')
          .insert(selectionsToInsert);

        if (error) throw error;
      }

      return { success: true };
    } catch (err) {
      console.error('Error saving selections:', err);
      return { success: false, error: 'Failed to save design preferences' };
    }
  };

  const getSelections = async (requestId: string): Promise<RequestEnhancerSelection[]> => {
    try {
      const { data, error } = await supabase
        .from('request_enhancer_selections')
        .select(`
          *,
          category:design_enhancer_categories(*),
          option:design_enhancer_options(*)
        `)
        .eq('request_id', requestId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching selections:', err);
      return [];
    }
  };

  const getOptionsByCategory = (categoryId: string) => {
    return options.filter(option => option.category_id === categoryId);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCategories(), fetchOptions()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    categories,
    options,
    isLoading,
    error,
    getOptionsByCategory,
    saveSelections,
    getSelections,
    refetch: () => Promise.all([fetchCategories(), fetchOptions()])
  };
};