import React, { useState } from 'react';
import { Layout } from '../Layout';
import { ClientsPanel } from './ClientsPanel';
import { AdminRequestsPanel } from './AdminRequestsPanel';
import { AdminChatPanel } from './AdminChatPanel';
import { AssetsPanel } from './AssetsPanel';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

type ActiveTab = 'clients' | 'requests' | 'chat';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('clients');
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'clients':
        return <ClientsPanel />;
      case 'requests':
        return <AdminRequestsPanel />;
      case 'chat':
        return <AdminChatPanel />;
      default:
        return <ClientsPanel />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'clients':
        return 'Clients';
      case 'requests':
        return 'Requests';
      case 'chat':
        return 'Chat';
      default:
        return 'Admin Dashboard';
    }
  };

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