import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { refetch } = useSubscription();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
            {sessionId && (
              <p className="text-sm text-muted-foreground mb-6">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">What's Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your email for a receipt</li>
              <li>• Access your new features in the dashboard</li>
              <li>• Contact support if you have any questions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};