import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-primary-black mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          
          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-primary-grey transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
};