import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  User,
  Mail,
  Phone,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  const { data, updateData } = useData();
  const [settings, setSettings] = useState(data.settings || {
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: 'en-US'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleDirectSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = {
        ...data,
        settings: settings
      };
      
      updateData(updatedData);
      setSaveMessage('Settings saved successfully!');
      
      // Apply theme change immediately
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'light',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      language: 'en-US'
    };
    setSettings(defaultSettings);
    setSaveMessage('Settings reset to defaults');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your application preferences and configurations</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {settings.theme === 'dark' ? (
              <Moon className="mr-2 h-5 w-5" />
            ) : (
              <Sun className="mr-2 h-5 w-5" />
            )}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle" className="text-sm font-medium">
                Dark Mode
              </Label>
              <p className="text-sm text-gray-500">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={settings.theme === 'dark'}
              onCheckedChange={(checked) => 
                handleDirectSettingChange('theme', checked ? 'dark' : 'light')
              }
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="language-select">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleDirectSettingChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-IN">English (India)</SelectItem>
                <SelectItem value="hi-IN">हिंदी (Hindi)</SelectItem>
                <SelectItem value="te-IN">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Receive appointment reminders and updates via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications?.email || false}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'email', checked)
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications" className="text-sm font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Get text messages for urgent updates
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.notifications?.sms || false}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'sms', checked)
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-sm font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-gray-500">
                Show desktop notifications for real-time updates
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.notifications?.push || false}
              onCheckedChange={(checked) => 
                handleSettingChange('notifications', 'push', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                placeholder="Enter your display name"
                defaultValue="Dr. Charan Reddy"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                defaultValue="charan2456@dentalcare.in"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                defaultValue="+91 98765 43210"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clinic-name">Clinic Name</Label>
              <Input
                id="clinic-name"
                placeholder="Enter clinic name"
                defaultValue="Smile Care Dental Center"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Change Password
              </Label>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Session Management
              </Label>
              <p className="text-sm text-gray-500">
                View and manage active sessions
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, backup, and manage your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Export Data
              </Label>
              <p className="text-sm text-gray-500">
                Download all your patient and appointment data
              </p>
            </div>
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Backup Settings
              </Label>
              <p className="text-sm text-gray-500">
                Configure automatic data backups
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-red-600">
                Delete All Data
              </Label>
              <p className="text-sm text-gray-500">
                Permanently remove all data (cannot be undone)
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

