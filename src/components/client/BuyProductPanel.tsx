import React, { useState } from 'react';
import { ShoppingBag, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { products } from '../../stripe-config';
import { useStripe } from '../../hooks/useStripe';

export const BuyProductPanel: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { purchaseProduct, isLoading, error } = useStripe();

  const handlePurchase = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    await purchaseProduct(product);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getProductTypeLabel = (mode: 'payment' | 'subscription') => {
    return mode === 'subscription' ? 'Subscription' : 'One-time Payment';
  };

  const getProductTypeColor = (mode: 'payment' | 'subscription') => {
    return mode === 'subscription' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Products & Services</h2>
          <p className="text-gray-600 mt-1">Choose from our professional design services</p>
        </div>
        <ShoppingBag className="h-8 w-8 text-gray-400" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProductTypeColor(product.mode)}`}>
                  {getProductTypeLabel(product.mode)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 min-h-[2.5rem]">
                {product.description}
              </p>
              
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-2xl font-bold text-black">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.mode === 'subscription' && (
                  <span className="text-sm text-gray-500">/month</span>
                )}
              </div>
            </div>

            <button
              onClick={() => handlePurchase(product.id)}
              disabled={isLoading && selectedProduct === product.id}
              className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onMouseDown={() => setSelectedProduct(product.id)}
            >
              {isLoading && selectedProduct === product.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {product.mode === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure Payment</h3>
        <p className="text-blue-800 text-sm">
          All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.
        </p>
      </div>
    </div>
  );
};