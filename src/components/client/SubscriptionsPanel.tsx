import React from 'react';
import { CreditCard, Calendar, DollarSign, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { products } from '../../config/stripe';
import { useStripe } from '../../hooks/useStripe';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error Loading Subscription:</strong> {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {subscription && subscription.subscription_status !== 'not_started' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              {getStatusIcon(subscription.subscription_status)}
              <div>
                <CardTitle className="text-lg">
                  {subscription.product_name || 'Current Subscription'}
                </CardTitle>
                <Badge variant={subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing' ? 'default' : 'destructive'} className="capitalize">
                  {subscription.subscription_status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {subscription.current_period_end && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {subscription.cancel_at_period_end ? 'Expires' : 'Next billing'}
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {subscription.payment_method_last4 && (
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Payment method</p>
                    <p className="font-medium text-foreground">
                      {subscription.payment_method_brand?.toUpperCase()} •••• {subscription.payment_method_last4}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {subscription.cancel_at_period_end && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription will end on {getSubscriptionEndDate()?.toLocaleDateString()}. 
                  You'll continue to have access until then.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No Active Subscription</CardTitle>
            <p className="text-muted-foreground mb-4">Choose a subscription plan to get started</p>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <CardTitle>Available Plans</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionProducts.map((product) => {
            const isCurrentPlan = subscription?.price_id === product.priceId;
            
            return (
              <Card
                key={product.id}
                className={`transition-all duration-200 ${
                  isCurrentPlan
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button
                    onClick={() => purchaseProduct(product)}
                    disabled={isCurrentPlan || isCheckoutLoading}
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : "default"}
                    size="lg"
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
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};