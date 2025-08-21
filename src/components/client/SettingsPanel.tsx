import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Camera, Bell, MessageSquare, FileText, CreditCard, Shield } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    company: user?.user_metadata?.company || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    requestUpdates: true,
    chatMessages: true,
    billingAlerts: true,
    marketingEmails: false,
    weeklyDigest: true,
    projectDeadlines: true
  });
  
  const [success, setSuccess] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setSuccess('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSuccess('Notification preferences updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleAvatarUpload = () => {
    alert('This would open a file picker to upload a new profile picture');
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-primary-grey rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <User className="h-5 w-5 text-primary-orange" />
          <h3 className="text-lg font-semibold text-primary-black">Profile Information</h3>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-600" />
              )}
            </div>
            <button
              type="button"
              onClick={handleAvatarUpload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-primary-white hover:bg-primary-grey transition-colors"
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-primary-grey rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="h-5 w-5 text-primary-orange" />
          <h3 className="text-lg font-semibold text-primary-black">Security Settings</h3>
        </div>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-primary-grey rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="h-5 w-5 text-primary-orange" />
          <h3 className="text-lg font-semibold text-primary-black">Notification Preferences</h3>
        </div>
        
        <form onSubmit={handleNotificationUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Notifications */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-black">General</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.emailNotifications ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive browser notifications</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('pushNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.pushNotifications ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weekly Digest</p>
                    <p className="text-xs text-gray-500">Weekly summary of your activity</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('weeklyDigest')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.weeklyDigest ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-xs text-gray-500">Product updates and promotions</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('marketingEmails')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.marketingEmails ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Project Notifications */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-black">Project Updates</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Request Updates</p>
                    <p className="text-xs text-gray-500">Status changes on your requests</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('requestUpdates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.requestUpdates ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.requestUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chat Messages</p>
                    <p className="text-xs text-gray-500">New messages from our team</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('chatMessages')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.chatMessages ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.chatMessages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Project Deadlines</p>
                    <p className="text-xs text-gray-500">Reminders about project milestones</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('projectDeadlines')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.projectDeadlines ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.projectDeadlines ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Billing Alerts</p>
                    <p className="text-xs text-gray-500">Payment and subscription updates</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange('billingAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                    notifications.billingAlerts ? 'bg-primary-orange' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-white transition-transform ${
                      notifications.billingAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200"
            >
              Update Notifications
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-primary-grey rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Lock className="h-5 w-5 text-primary-orange" />
          <h3 className="text-lg font-semibold text-primary-black">Change Password</h3>
        </div>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword2" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="currentPassword2"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword2" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="newPassword2"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword2" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="confirmPassword2"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-black text-primary-white rounded-xl shadow-lg hover:bg-opacity-90 transition-all duration-200"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};