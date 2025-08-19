import React, { createContext, useContext, useState } from 'react';

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

interface DataContextType {
  requests: Request[];
  addRequest: (request: Omit<Request, 'id' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: Request['status']) => void;
  
  chats: Chat[];
  messages: ChatMessage[];
  sendMessage: (chatId: string, message: string, senderId: string, senderName: string, senderRole: 'client' | 'admin', attachments?: string[]) => void;
  
  clients: Client[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockRequests: Request[] = [
  {
    id: '1',
    title: 'Logo Design for Tech Startup',
    description: 'Need a modern, minimalist logo for our new tech startup. Looking for something that conveys innovation and trust.',
    status: 'current',
    createdAt: '2024-01-15T10:00:00Z',
    files: ['logo-brief.pdf'],
    clientId: '1',
    notes: 'Prefer blue and grey colors'
  },
  {
    id: '2',
    title: 'Website Banner Design',
    description: 'Homepage banner design for e-commerce website. Should be eye-catching and promote our winter sale.',
    status: 'finished',
    createdAt: '2024-01-10T14:30:00Z',
    files: ['banner-specs.jpg', 'brand-colors.png'],
    clientId: '1'
  },
  {
    id: '3',
    title: 'Business Card Design',
    description: 'Professional business cards for the leadership team. Need to match our brand guidelines.',
    status: 'pending',
    createdAt: '2024-01-20T09:15:00Z',
    files: ['brand-guidelines.pdf'],
    clientId: '1'
  }
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'client@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    subscriptions: ['Pro Plan'],
    totalRequests: 12,
    totalOrders: 8,
    joinedAt: '2023-12-01'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    subscriptions: ['Basic Plan'],
    totalRequests: 5,
    totalOrders: 3,
    joinedAt: '2024-01-10'
  }
];

const mockChats: Chat[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Doe',
    lastMessage: 'Thanks for the quick response!',
    lastActivity: '2024-01-22T15:30:00Z',
    unread: 2
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Sarah Wilson',
    lastMessage: 'Looking forward to the designs',
    lastActivity: '2024-01-22T12:00:00Z',
    unread: 0
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'John Doe',
    senderRole: 'client',
    message: 'Hi, I wanted to check on the progress of my logo design request.',
    timestamp: '2024-01-22T14:30:00Z',
    chatId: '1'
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Jane Smith',
    senderRole: 'admin',
    message: 'Hi John! Your logo design is progressing well. We should have the first concepts ready by tomorrow.',
    timestamp: '2024-01-22T15:00:00Z',
    chatId: '1'
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'John Doe',
    senderRole: 'client',
    message: 'Thanks for the quick response!',
    timestamp: '2024-01-22T15:30:00Z',
    chatId: '1'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [clients] = useState<Client[]>(mockClients);

  const addRequest = (newRequest: Omit<Request, 'id' | 'createdAt'>) => {
    const request: Request = {
      ...newRequest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (id: string, status: Request['status']) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const sendMessage = (
    chatId: string, 
    message: string, 
    senderId: string, 
    senderName: string, 
    senderRole: 'client' | 'admin',
    attachments?: string[]
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      senderName,
      senderRole,
      message,
      timestamp: new Date().toISOString(),
      attachments,
      chatId
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update chat last activity
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            lastMessage: message, 
            lastActivity: new Date().toISOString(),
            unread: senderRole === 'client' ? chat.unread + 1 : 0
          }
        : chat
    ));
  };

  const value = {
    requests,
    addRequest,
    updateRequestStatus,
    chats,
    messages,
    sendMessage,
    clients
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};