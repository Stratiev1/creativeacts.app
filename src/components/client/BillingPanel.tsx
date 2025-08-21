import React from 'react';
import { Receipt, Download, Eye, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{billingHistory.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Payment</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                {new Date(billingHistory[0]?.date).toLocaleDateString()}
              </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
        
        {billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No billing history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">{invoice.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.date).toLocaleDateString()} • Invoice #{invoice.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${invoice.amount.toFixed(2)}</p>
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewInvoice(invoice.id)}
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      title="Download Invoice"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Payment Method</CardTitle>
            <Button variant="outline">
            Update
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
        <Card>
          <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
              VISA
            </div>
            <div>
              <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          </CardContent>
        </Card>
        </CardContent>
      </Card>
    </div>
  );
};