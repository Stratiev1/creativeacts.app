export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    phone?: string;
    company?: string;
    country?: string;
    role?: 'admin' | 'client';
  };
}

export interface Request {
  id: string;
  title: string;
  description: string;
  status: 'current' | 'finished' | 'pending';
  createdAt: string;
  files: string[];
  clientId: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  message: string;
  timestamp: string;
  attachments?: string[];
  chatId: string;
}

export interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  lastMessage?: string;
  lastActivity: string;
  unread: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscriptions: any[];
  totalRequests: number;
  totalOrders: number;
  joinedAt: string;
}

export interface DesignEnhancerCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface DesignEnhancerOption {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: 'not_started' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  product_name?: string;
}

export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}