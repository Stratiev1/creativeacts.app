import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, Home } from 'lucide-react';

export const CancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-primary-grey transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-primary-black mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600">
            If you experienced any issues during checkout, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};