import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-primary-black transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-primary-black mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-gray max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Creative Acts services, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">2. Services</h2>
              <p className="text-gray-700 mb-4">
                Creative Acts provides design services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Logo design and branding</li>
                <li>Web design and development</li>
                <li>Graphic design services</li>
                <li>User-generated content creation</li>
                <li>Brand asset management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">3. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Payment terms vary by service type:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Subscription services are billed monthly or annually</li>
                <li>One-time services require payment before work begins</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                Upon full payment, you will own the rights to the final delivered designs. 
                We retain the right to showcase completed work in our portfolio unless 
                otherwise agreed upon.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">5. Revisions and Approval</h2>
              <p className="text-gray-700 mb-4">
                Each project includes a specified number of revisions. Additional revisions 
                may incur extra charges. Final approval is required before project completion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Creative Acts shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">7. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate services with appropriate notice. 
                Subscriptions can be cancelled at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary-black mb-4">8. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@creativeacts.app" className="text-primary-orange hover:underline">
                  legal@creativeacts.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};