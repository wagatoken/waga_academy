"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Lock, User, Globe, Shield, Key, Mail, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const { profile, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Update Failed",
          description: error,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Profile Updated 🥂",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Update Failed 💔",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold web3-gradient-text">Admin Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-3xl mb-4 md:mb-8 bg-background border border-purple-500/20 overflow-x-auto">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500 text-xs md:text-sm"
          >
            <User className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500 text-xs md:text-sm"
          >
            <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500 text-xs md:text-sm"
          >
            <Lock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="site"
            className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500 text-xs md:text-sm"
          >
            <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Site</span>
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-500 text-xs md:text-sm"
          >
            <Shield className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border border-purple-500/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>Update your admin profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="border-purple-500/20 focus-visible:ring-purple-500/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="border-purple-500/20 focus-visible:ring-purple-500/30"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-purple-500/20 focus-visible:ring-purple-500/30"
                    />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="border-purple-500/20 focus-visible:ring-purple-500/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button type="submit" disabled={isUpdating} className="web3-button-purple">
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border border-purple-500/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
              <CardTitle className="text-xl">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <Label htmlFor="emailNotifs">Email Notifications</Label>
                  </div>
                  <Switch id="emailNotifs" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-teal-400" />
                    <Label htmlFor="pushNotifs">Push Notifications</Label>
                  </div>
                  <Switch id="pushNotifs" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-purple-400" />
                    <Label htmlFor="newUser">New User Registrations</Label>
                  </div>
                  <Switch id="newUser" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-pink-400" />
                    <Label htmlFor="newContent">New Content Submissions</Label>
                  </div>
                  <Switch id="newContent" defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="web3-button-purple">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border border-purple-500/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="border-purple-500/20 focus-visible:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="border-purple-500/20 focus-visible:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="border-purple-500/20 focus-visible:ring-purple-500/30"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button className="border-purple-600/30 hover:border-purple-600/60 transition">Enable</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="web3-button-purple">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="site" className="space-y-6">
          <Card className="border border-purple-500/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
              <CardTitle className="text-xl">Site Settings</CardTitle>
              <CardDescription>Manage global site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    defaultValue="WAGA Academy"
                    className="border-purple-500/20 focus-visible:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    defaultValue="Web3 and Gaming Academy"
                    className="border-purple-500/20 focus-visible:ring-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenanceMode" />
                    <Label htmlFor="maintenanceMode">Enable maintenance mode</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="web3-button-purple">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card className="border border-purple-500/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
              <CardTitle className="text-xl">Role Permissions</CardTitle>
              <CardDescription>Manage access levels for different user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Administrator</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="adminContent" defaultChecked disabled />
                      <Label htmlFor="adminContent" className="text-sm">
                        Manage Content
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="adminUsers" defaultChecked disabled />
                      <Label htmlFor="adminUsers" className="text-sm">
                        Manage Users
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="adminSettings" defaultChecked disabled />
                      <Label htmlFor="adminSettings" className="text-sm">
                        Manage Settings
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="adminRoles" defaultChecked disabled />
                      <Label htmlFor="adminRoles" className="text-sm">
                        Manage Roles
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Moderator</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="modContent" defaultChecked />
                      <Label htmlFor="modContent">Manage Content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="modUsers" />
                      <Label htmlFor="modUsers">Manage Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="modSettings" />
                      <Label htmlFor="modSettings">Manage Settings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="modRoles" />
                      <Label htmlFor="modRoles">Manage Roles</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Content Editor</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="editorContent" defaultChecked />
                      <Label htmlFor="editorContent">Manage Content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="editorUsers" />
                      <Label htmlFor="editorUsers">Manage Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="editorSettings" />
                      <Label htmlFor="editorSettings">Manage Settings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="editorRoles" />
                      <Label htmlFor="editorRoles">Manage Roles</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="web3-button-purple">Save Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
