import React, { useState } from 'react';
import { ShoppingBag, CreditCard, AlertCircle, Loader2, FileText, ArrowRight, Upload, X } from 'lucide-react';
import { products } from '../../stripe-config';
import { useStripe } from '../../hooks/useStripe';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DesignEnhancer } from './DesignEnhancer';
import { useDesignEnhancer } from '../../hooks/useDesignEnhancer';

export const BuyProductPanel: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { purchaseProduct, isLoading, error } = useStripe();
  const { addRequest } = useData();
  const { user } = useAuth();
  const { saveSelections } = useDesignEnhancer();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [enhancerSelections, setEnhancerSelections] = useState<{ [categoryId: string]: string }>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    files: [] as string[]
  });

  const handleBuyClick = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.mode === 'payment') {
      // For one-time payments, show request form first
      setCurrentProduct(product);
      setFormData(prev => ({
        ...prev,
        title: `${product.name} Request`,
        description: `Request for ${product.name} - ${product.description}`
      }));
      setShowRequestForm(true);
    } else {
      // For subscriptions, proceed directly to payment
      await purchaseProduct(product);
    }
  };

  const handlePurchase = async () => {
    if (!currentProduct || !user) return;

    // First create the request
    const newRequest = {
      ...formData,
      clientId: user.id,
      status: 'pending'
    };

    addRequest(newRequest);

    // Save design enhancer selections if any
    if (Object.keys(enhancerSelections).length > 0) {
      const requestId = Date.now().toString();
      await saveSelections(requestId, enhancerSelections);
    }

    // Then proceed to payment
    await purchaseProduct(currentProduct);

    // Reset form
    setFormData({ title: '', description: '', notes: '', files: [] });
    setEnhancerSelections({});
    setShowEnhancer(false);
    setShowRequestForm(false);
    setCurrentProduct(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...fileNames]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
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
            className="bg-primary-grey rounded-xl p-6 hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary-black">{product.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProductTypeColor(product.mode)}`}>
                  {getProductTypeLabel(product.mode)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 min-h-[2.5rem]">
                {product.description}
              </p>
              
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-2xl font-bold text-primary-black">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.mode === 'subscription' && (
                  <span className="text-sm text-gray-500">/month</span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleBuyClick(product.id)}
              disabled={isLoading && selectedProduct === product.id}
              className="w-full py-3 px-6 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onMouseDown={() => setSelectedProduct(product.id)}
            >
              {isLoading && selectedProduct === product.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary-white" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {product.mode === 'subscription' ? 'Subscribe Now' : 'Create Request & Buy'}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary-black mb-2">Secure Payment</h3>
        <p className="text-blue-800 text-sm">
          All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.
        </p>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && currentProduct && (
        <div className="fixed inset-0 bg-primary-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowRequestForm(false)}>
          <div className="bg-primary-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary-black">Create Request for {currentProduct.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Tell us about your requirements before proceeding to payment</p>
              </div>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-gray-400 hover:text-primary-black"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  placeholder="e.g., Logo Design for Tech Startup"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  placeholder="Describe your project requirements..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  placeholder="Any additional notes or preferences..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, JPG, PNG up to 10MB each
                    </span>
                  </label>
                </div>

                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Design Enhancer Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Design Request Enhancer
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Help us understand your design preferences (optional)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEnhancer(!showEnhancer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    showEnhancer ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      showEnhancer ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Design Enhancer */}
              {showEnhancer && (
                <DesignEnhancer
                  onSelectionsChange={setEnhancerSelections}
                  initialSelections={enhancerSelections}
                />
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-primary-black">
                    {formatPrice(currentProduct.price, currentProduct.currency)}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestForm(false);
                      setShowEnhancer(false);
                      setEnhancerSelections({});
                      setCurrentProduct(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-primary-grey transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Create Request & Pay
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};