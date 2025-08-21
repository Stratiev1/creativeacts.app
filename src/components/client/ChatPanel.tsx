import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Paperclip, X, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ChatPanel: React.FC = () => {
  const { messages, sendMessage, chats, clients } = useData();
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
      user.user_metadata?.name || user.email || 'User',
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
    <div className="h-[calc(100vh-140px)] flex flex-col bg-background">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
                  <p className="text-muted-foreground">Start a conversation with our team</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${message.senderRole === 'client' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <Avatar className={`w-8 h-8 ${message.senderRole === 'client' ? 'ml-3' : 'mr-3'}`}>
                    <AvatarFallback className={message.senderRole === 'client' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                      {message.senderName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message Bubble */}
                  <div className="flex flex-col">
                    <Card className={`${
                      message.senderRole === 'client'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <CardContent className="p-3">
                        <p className="text-sm">{message.message}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((file, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs block w-fit"
                              >
                                📎 {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <p className={`text-xs mt-1 px-1 text-muted-foreground ${
                      message.senderRole === 'client' ? 'text-right' : 'text-left'
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
        <div className="border-t bg-card">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <span>{file}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};