import React from 'react';
import { Receipt, Download, Eye, Calendar, DollarSign } from 'lucide-react';

// Mock billing data
const billingHistory = [
  {
    id: 'inv_001',
    date: '2024-01-15',
    description: 'Pro Plan - Monthly Subscription',
    amount: 99.00,
    status: 'paid',
    invoiceUrl: '#'
  },
  {
    id: 'inv_002',
    date: '2024-01-10',
    description: 'Logo Design - One-time Purchase',
    amount: 299.00,
    status: 'paid',
    invoiceUrl: '#'
  },
  {
    id: 'inv_003',
    date: '2023-12-15',
    description: 'Pro Plan - Monthly Subscription',
    amount: 99.00,
    status: 'paid',
    invoiceUrl: '#'
  },
  {
    id: 'inv_004',
    date: '2023-12-01',
    description: 'Website Design - One-time Purchase',
    amount: 899.00,
    status: 'paid',
    invoiceUrl: '#'
  }
];

export const BillingPanel: React.FC = () => {
  const totalSpent = billingHistory.reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleViewInvoice = (invoiceId: string) => {
    alert(`This would open invoice ${invoiceId} in a new tab`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`This would download invoice ${invoiceId} as PDF`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xl sm:text-2xl font-bold text-black">${totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-xl sm:text-2xl font-bold text-black">{billingHistory.length}</p>
            </div>
            <Receipt className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Payment</p>
              <p className="text-xl sm:text-2xl font-bold text-black">
                {new Date(billingHistory[0]?.date).toLocaleDateString()}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Billing History</h3>
        
        {billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No billing history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-black">{invoice.description}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()} • Invoice #{invoice.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-black">${invoice.amount.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Payment Method</h3>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Update
          </button>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium text-black">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};