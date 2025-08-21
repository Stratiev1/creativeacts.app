import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const CancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Payment Cancelled</h1>
            <p className="text-muted-foreground mb-6">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
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
            <h3 className="text-sm font-medium text-foreground mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you experienced any issues during checkout, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};