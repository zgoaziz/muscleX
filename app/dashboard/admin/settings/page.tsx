"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-balance">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">Configure platform settings and integrations</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Platform Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
            <CardDescription>Manage core platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" defaultValue="MuscleX" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="max-users">Max Users per Subscription</Label>
              <Input id="max-users" type="number" defaultValue="10" className="mt-2" />
            </div>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90">Save Settings</Button>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>Set up email notifications and SMTP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input id="smtp-server" placeholder="smtp.example.com" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" placeholder="587" className="mt-2" />
            </div>
            <Button className="bg-sidebar-primary hover:bg-sidebar-primary/90">Test Connection</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage platform security options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm font-medium">Enable Two-Factor Authentication</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium">Require Strong Passwords</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-medium">Enable Rate Limiting</span>
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
