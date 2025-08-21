import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Paperclip, X, User } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { messages, sendMessage, chats } = useData();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the client's chat (assuming one chat per client for demo)
  const clientChat = chats.find(chat => chat.clientId === user?.id);
  const chatMessages = messages.filter(msg => msg.chatId === clientChat?.id || '1');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!user || !clientChat) return;

    sendMessage(
      clientChat.id,
      newMessage,
      user.id,
      user.name,
      'client',
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

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-gray-50">
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
              <p className="text-gray-500">Start a conversation with our team</p>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${message.senderRole === 'client' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.senderRole === 'client' ? 'ml-3 bg-gray-900' : 'mr-3 bg-gray-200'
                }`}>
                  {message.senderRole === 'client' ? (
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
                    message.senderRole === 'client'
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
                              message.senderRole === 'client'
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
                    message.senderRole === 'client' ? 'text-right text-gray-500' : 'text-left text-gray-500'
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