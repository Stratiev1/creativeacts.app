import React, { useState } from 'react';
import { Layout } from '../Layout';
import { ClientsPanel } from './ClientsPanel';
import { AdminRequestsPanel } from './AdminRequestsPanel';
import { AdminChatPanel } from './AdminChatPanel';

type ActiveTab = 'clients' | 'requests' | 'chat';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('clients');

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