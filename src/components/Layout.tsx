import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { LogOut, User, Menu, X, MessageSquare, FileText, Users, FolderOpen, CreditCard, Settings, ShoppingBag, Receipt, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  activeTab, 
  onTabChange,
  showSidebar = true 
}) => {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.user_metadata?.role === 'admin';

  const adminTabs = [
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare }
  ];

  const clientTabs = [
    { id: 'requests', label: 'Requests', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'assets', label: 'Assets', icon: FolderOpen },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'buy', label: 'Buy Product', icon: ShoppingBag },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setMobileMenuOpen(false);
  };

  const getSubscriptionDisplay = () => {
    if (!subscription || subscription.subscription_status === 'not_started') {
      return 'No active plan';
    }
    
    if (subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing') {
      return subscription.product_name || 'Active subscription';
    }
    
    return `${subscription.subscription_status.replace('_', ' ')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className={`hidden lg:flex flex-col bg-primary-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Creative Acts" className="h-8" />
                <span className="font-semibold text-primary-black">Creative Acts</span>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-md hover:bg-primary-grey transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-orange text-primary-white shadow-lg'
                          : 'text-gray-700 hover:bg-primary-grey'
                      } ${sidebarCollapsed ? 'justify-center px-2 py-2' : ''}`}
                      title={sidebarCollapsed ? tab.label : undefined}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="ml-3">{tab.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-black truncate">
                    {user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {getSubscriptionDisplay()}
                  </p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={signOut}
                className="w-full mt-3 flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-primary-grey rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-primary-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-primary-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Creative Acts" className="h-8" />
                <span className="font-semibold text-primary-black">Creative Acts</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-primary-grey transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-orange text-primary-white shadow-lg'
                            : 'text-gray-700 hover:bg-primary-grey'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mr-3" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Mobile User Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-black">
                    {user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getSubscriptionDisplay()}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-primary-grey rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-primary-white border-b border-gray-200 px-4 py-3 lg:px-6 shadow-sm">
          <div className="w-full max-w-[1300px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showSidebar && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-md hover:bg-primary-grey transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <h1 className="text-lg font-semibold text-primary-black">{title}</h1>
            </div>
            
            {/* Mobile User Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          <div className="w-full max-w-[1300px] mx-auto px-4 py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Floating Navigation */}
      {showSidebar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary-white border-t border-gray-200 px-4 py-2 z-40 shadow-lg">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {tabs.slice(0, 5).map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 ${
                    isActive
                      ? 'bg-primary-orange text-primary-white shadow-md'
                      : 'text-gray-500'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 mb-1 ${isActive ? 'text-primary-white' : 'text-gray-500'}`} />
                  <span className={`text-xs font-medium truncate ${isActive ? 'text-primary-white' : 'text-gray-500'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};