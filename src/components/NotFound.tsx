import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-muted mb-4">404</h1>
            <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};