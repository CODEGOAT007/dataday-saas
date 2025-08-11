import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, User, Bell, Shield, Smartphone } from 'lucide-react'
import { ResetGoalsSection } from '@/components/settings/reset-goals-section'
import { UserProfileSection } from '@/components/settings/user-profile-section'
import { ResetSupportCircleSection } from '@/components/settings/reset-support-circle-section'

export const metadata: Metadata = {
  title: 'Settings - MyDataday',
  description: 'Manage your MyDataday app settings and preferences.',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your account settings and app preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Account Settings */}
        <UserProfileSection />

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="support-circle-alerts" className="text-sm font-normal">Support Circle Alerts</Label>
              <Switch id="support-circle-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminders" className="text-sm font-normal">Daily Check-in Reminders</Label>
              <Switch id="daily-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="milestone-celebrations" className="text-sm font-normal">Goal Milestone Celebrations</Label>
              <Switch id="milestone-celebrations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="progress-reports" className="text-sm font-normal">Weekly Progress Reports</Label>
              <Switch id="progress-reports" />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-goals" className="text-sm font-normal">Make goals public</Label>
              <Switch id="public-goals" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="friend-requests" className="text-sm font-normal">Allow friend requests</Label>
              <Switch id="friend-requests" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Export</Label>
              <Button variant="outline" className="w-full">
                Download My Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="System Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Default</SelectItem>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="offline-mode" className="text-sm font-normal">Offline Mode</Label>
              <Switch id="offline-mode" defaultChecked />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Danger Zone */}
      <Card className="mt-8 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResetGoalsSection />

          <div className="border-t pt-6">
            <ResetSupportCircleSection />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
