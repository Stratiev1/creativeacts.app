import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { LogOut, User, Menu, X, MessageSquare, FileText, Users, FolderOpen, CreditCard, Settings, ShoppingBag, Receipt, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className={cn(
          "hidden lg:flex flex-col bg-card border-r transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          {/* Sidebar Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center",
                sidebarCollapsed ? "justify-center" : "space-x-3"
              )}>
                <img src="/logo.svg" alt="Creative Acts" className="h-8 w-8 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-semibold text-foreground">Creative Acts</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarCollapsed(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            </div>
          </div>

          {/* Expand button when collapsed */}
          {sidebarCollapsed && (
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(false)}
                className="w-full"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                    onClick={() => handleTabClick(tab.id)}
                    title={sidebarCollapsed ? tab.label : undefined}
                  >
                    <IconComponent className="h-4 w-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="ml-3">{tab.label}</span>}
                  </Button>
                );
              })}
            </div>
          </nav>

          <Separator />

          {/* User Section */}
          <div className="p-4">
            <div className={cn(
              "flex items-center",
              sidebarCollapsed ? "justify-center" : "space-x-3 mb-3"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getSubscriptionDisplay()}
                  </p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {showSidebar && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-lg">
            {/* Mobile Sidebar Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="/logo.svg" alt="Creative Acts" className="h-8 w-8 flex-shrink-0" />
                  <span className="font-semibold text-foreground">Creative Acts</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {tab.label}
                    </Button>
                  );
                })}
              </div>
            </nav>

            <Separator />

            {/* Mobile User Section */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.user_metadata?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getSubscriptionDisplay()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b px-4 py-3 lg:px-6">
          <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            </div>
            
            {/* Mobile User Menu */}
            <div className="lg:hidden">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 h-full overflow-auto">
          <div className="w-full h-full max-w-[1400px] mx-auto px-4 py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {showSidebar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t px-2 py-2 z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {tabs.slice(0, 5).map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center justify-center h-auto py-2 px-3 min-w-0 space-y-1",
                    isActive && "text-primary bg-secondary"
                  )}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs font-medium truncate max-w-[60px]">
                    {tab.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};