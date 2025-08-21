import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using Creative Acts services, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Services</h2>
              <p className="text-muted-foreground mb-4">
                Creative Acts provides design services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Logo design and branding</li>
                <li>Web design and development</li>
                <li>Graphic design services</li>
                <li>User-generated content creation</li>
                <li>Brand asset management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Payment Terms</h2>
              <p className="text-muted-foreground mb-4">
                Payment terms vary by service type:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Subscription services are billed monthly or annually</li>
                <li>One-time services require payment before work begins</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                Upon full payment, you will own the rights to the final delivered designs. 
                We retain the right to showcase completed work in our portfolio unless 
                otherwise agreed upon.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Revisions and Approval</h2>
              <p className="text-muted-foreground mb-4">
                Each project includes a specified number of revisions. Additional revisions 
                may incur extra charges. Final approval is required before project completion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                Creative Acts shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Termination</h2>
              <p className="text-muted-foreground mb-4">
                Either party may terminate services with appropriate notice. 
                Subscriptions can be cancelled at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@creativeacts.app" className="text-primary hover:underline">
                  legal@creativeacts.app
                </a>
              </p>
            </section>
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};