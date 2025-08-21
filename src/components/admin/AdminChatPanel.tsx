import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Paperclip, X, User, ArrowLeft } from 'lucide-react';

export const AdminChatPanel: React.FC = () => {
  const { messages, sendMessage, chats, clients } = useData();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  const chatMessages = messages.filter(msg => msg.chatId === selectedChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!user || !selectedChat) return;

    sendMessage(
      selectedChat,
      newMessage,
      user.id,
      user.name,
      'admin',
      selectedFiles.length > 0 ? selectedFiles : undefined
    );

    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map(file => file.name);
    setSelectedFiles(prev => [...prev, ...fileNames]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getClientAvatar = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.avatar;
  };

  if (!selectedChat) {
    return (
      <div className="h-full bg-white">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
          <p className="text-gray-600 mt-1">Select a conversation to start chatting</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {getClientAvatar(chat.clientId) ? (
                    <img 
                      src={getClientAvatar(chat.clientId)} 
                      alt={chat.clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{chat.clientName}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(chat.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
                
                {chat.unread > 0 && (
                  <div className="ml-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setSelectedChat(null)}
          className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          {getClientAvatar(selectedChatData?.clientId || '') ? (
            <img 
              src={getClientAvatar(selectedChatData?.clientId || '')} 
              alt={selectedChatData?.clientName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          )}
        </div>
        <div className="ml-3">
          <h2 className="font-medium text-gray-900">{selectedChatData?.clientName}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500">Start the conversation</p>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${message.senderRole === 'admin' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.senderRole === 'admin' ? 'ml-3 bg-gray-900' : 'mr-3 bg-gray-200'
                }`}>
                  {message.senderRole === 'admin' ? (
                    <span className="text-white text-sm font-medium">
                      {message.senderName.charAt(0)}
                    </span>
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col">
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.senderRole === 'admin'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((file, index) => (
                          <div
                            key={index}
                            className={`text-xs p-2 rounded-lg ${
                              message.senderRole === 'admin'
                                ? 'bg-gray-800'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            📎 {file}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className={`text-xs mt-1 px-1 ${
                    message.senderRole === 'admin' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="w-full max-w-4xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <span className="text-gray-700">{file}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      
      {/* Floating Input Area */}
      <div className="absolute bottom-20 lg:bottom-4 left-4 right-4 z-10">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message..."
                  className="w-full px-4 py-3 border-0 rounded-full focus:outline-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() && selectedFiles.length === 0}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};