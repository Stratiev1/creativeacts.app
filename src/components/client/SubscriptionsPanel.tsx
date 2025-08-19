import React from 'react';
import { CreditCard, Calendar, DollarSign, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { products } from '../../stripe-config';
import { useStripe } from '../../hooks/useStripe';

export const SubscriptionsPanel: React.FC = () => {
  const { subscription, isLoading, error, hasActiveSubscription, isSubscriptionCanceled, getSubscriptionEndDate } = useSubscription();
  const { purchaseProduct, isLoading: isCheckoutLoading } = useStripe();

  const subscriptionProducts = products.filter(product => product.mode === 'subscription');

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'canceled':
      case 'unpaid':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled':
      case 'unpaid':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">Subscriptions</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">Subscriptions</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error Loading Subscription</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Subscriptions</h2>
      </div>

      {/* Current Subscription */}
      {subscription && subscription.subscription_status !== 'not_started' ? (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(subscription.subscription_status)}
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {subscription.product_name || 'Current Subscription'}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border capitalize ${getStatusColor(subscription.subscription_status)}`}>
                  {subscription.subscription_status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {subscription.current_period_end && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    {subscription.cancel_at_period_end ? 'Expires' : 'Next billing'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {subscription.payment_method_last4 && (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Payment method</p>
                  <p className="font-medium text-gray-900">
                    {subscription.payment_method_brand?.toUpperCase()} •••• {subscription.payment_method_last4}
                  </p>
                </div>
              </div>
            )}
          </div>

          {subscription.cancel_at_period_end && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800">
                Your subscription will end on {getSubscriptionEndDate()?.toLocaleDateString()}. 
                You'll continue to have access until then.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-500 mb-4">Choose a subscription plan to get started</p>
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionProducts.map((product) => {
            const isCurrentPlan = subscription?.price_id === product.priceId;
            
            return (
              <div
                key={product.id}
                className={`border-2 rounded-lg p-6 ${
                  isCurrentPlan
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } transition-colors`}
              >
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-black mb-2">{product.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-black">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>

                <button
                  onClick={() => purchaseProduct(product)}
                  disabled={isCurrentPlan || isCheckoutLoading}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};