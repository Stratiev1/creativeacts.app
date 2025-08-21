import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getProductByPriceId } from '../config/stripe';
import type { Subscription } from '../types';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        const product = data.price_id ? getProductByPriceId(data.price_id) : null;
        setSubscription({
          ...data,
          product_name: product?.name || 'Unknown Product'
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription';
      setError(errorMessage);
      console.error('Subscription fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const hasActiveSubscription = () => {
    return subscription?.subscription_status === 'active' || subscription?.subscription_status === 'trialing';
  };

  const isSubscriptionCanceled = () => {
    return subscription?.subscription_status === 'canceled';
  };

  const getSubscriptionEndDate = () => {
    if (subscription?.current_period_end) {
      return new Date(subscription.current_period_end * 1000);
    }
    return null;
  };

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    hasActiveSubscription,
    isSubscriptionCanceled,
    getSubscriptionEndDate,
  };
};