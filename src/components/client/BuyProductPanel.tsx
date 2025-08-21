import React, { useState } from 'react';
import { ShoppingBag, CreditCard, AlertCircle, Loader2, FileText, ArrowRight, Upload, X } from 'lucide-react';
import { products } from '../../stripe-config';
import { useStripe } from '../../hooks/useStripe';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DesignEnhancer } from './DesignEnhancer';
import { useDesignEnhancer } from '../../hooks/useDesignEnhancer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const handleBuyClick = async (productId: string) => {
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Payment Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="hover:shadow-lg transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant={product.mode === 'subscription' ? 'default' : 'secondary'}>
                  {getProductTypeLabel(product.mode)}
                </Badge>
              </div>
              
              <CardDescription className="min-h-[2.5rem]">
                {product.description}
              </CardDescription>
              
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.mode === 'subscription' && (
                  <span className="text-sm text-muted-foreground">/month</span>
                )}
              </div>
            </CardHeader>

            <CardContent>
            <Button
              onClick={() => handleBuyClick(product.id)}
              disabled={isLoading && selectedProduct === product.id}
              className="w-full"
              size="lg"
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
                  {product.mode === 'subscription' ? 'Subscribe Now' : 'Create Request & Buy'}
                </>
              )}
            </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <ShoppingBag className="h-4 w-4" />
        <AlertDescription>
          <strong>Secure Payment:</strong>{' '}
          All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.
        </AlertDescription>
      </Alert>

      {/* Request Form Modal */}
      {showRequestForm && currentProduct && (
        <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Request for {currentProduct.name}</DialogTitle>
              <DialogDescription>
                Tell us about your requirements before proceeding to payment
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Logo Design for Tech Startup"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your project requirements..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any additional notes or preferences..."
                />
              </div>

              <div>
                <Label>
                  Upload Files
                </Label>
                <div className="border-2 border-dashed border-border rounded-md p-4">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG up to 10MB each
                    </span>
                  </label>
                </div>

                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm text-foreground">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Design Enhancer Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    Design Request Enhancer
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Help us understand your design preferences (optional)
                  </p>
                </div>
                <Switch
                  checked={showEnhancer}
                  onCheckedChange={setShowEnhancer}
                />
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
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(currentProduct.price, currentProduct.currency)}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRequestForm(false);
                      setShowEnhancer(false);
                      setEnhancerSelections({});
                      setCurrentProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
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
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};