import React, { useState } from 'react';
import { Layout } from '../Layout';
import { RequestsPanel } from './RequestsPanel';
import { ChatPanel } from './ChatPanel';
import { SubscriptionsPanel } from './SubscriptionsPanel';
import { SettingsPanel } from './SettingsPanel';
import { BuyProductPanel } from './BuyProductPanel';
import { BillingPanel } from './BillingPanel';
import { AssetsPanel } from './AssetsPanel';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

type ActiveTab = 'requests' | 'chat' | 'assets' | 'subscriptions' | 'settings' | 'buy' | 'billing';

export const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('requests');
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'requests':
        return <RequestsPanel />;
      case 'chat':
        return <ChatPanel />;
      case 'assets':
        return <AssetsPanel />;
      case 'subscriptions':
        return <SubscriptionsPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'buy':
        return <BuyProductPanel />;
      case 'billing':
        return <BillingPanel />;
      default:
        return <RequestsPanel />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'requests':
        return 'Requests';
      case 'chat':
        return 'Chat';
      case 'assets':
        return 'Assets';
      case 'subscriptions':
        return 'Subscriptions';
      case 'settings':
        return 'Settings';
      case 'buy':
        return 'Buy Products';
      case 'billing':
        return 'Billing';
      default:
        return 'Dashboard';
    }
  };

  // Special handling for assets page - render full screen
  if (activeTab === 'assets') {
    return (
      <div className="min-h-screen bg-white">
        {/* Top Header for Assets */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 lg:px-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Creative Acts" className="h-8" />
                <span className="font-semibold text-black">Creative Acts</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-black">
                  {user?.user_metadata?.name || user?.email}
                </span>
                <button
                  onClick={signOut}
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
              
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <img src="/logo.svg" alt="Creative Acts" className="h-8" />
                  <span className="font-semibold text-black">Creative Acts</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <nav className="p-4">
                {['requests', 'chat', 'assets', 'subscriptions', 'buy', 'billing', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab as ActiveTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-2 capitalize ${
                      activeTab === tab
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">
                      {user?.user_metadata?.name || user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Screen Assets Panel */}
        <div className="h-[calc(100vh-73px)]">
          <AssetsPanel />
        </div>
      </div>
    );
  }

  return (
    <Layout 
      title={getPageTitle()}
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderActivePanel()}
    </Layout>
  );
};