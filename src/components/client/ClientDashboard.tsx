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


  return (
    <Layout 
      title={getPageTitle()}
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      <div className={activeTab === 'assets' ? 'h-[calc(100vh-140px)] -mx-4 lg:-mx-6 -my-6' : ''}>
        {renderActivePanel()}
      </div>
    </Layout>
  );
};