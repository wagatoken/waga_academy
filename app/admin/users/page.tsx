"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  Sun,
  Settings,
  Search,
  ChevronDown,
  Edit,
  Trash,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Error fetching users:", data.error);
        }
      } catch (error) {
        console.error("Unexpected error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        console.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Unexpected error updating user status:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>

          <div className="bg-card p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-8 border border-input focus:ring focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

            </div>

            <div className="overflow-x-auto">
              <Table className="w-full border border-border">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted">
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-foreground text-background"
                              : "bg-destructive text-white"
                          }`}
                        >
                          {user.status || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                      <Switch
                          checked={user.status === "Active"}
                          onCheckedChange={() => toggleUserStatus(user.id, user.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <div>
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
