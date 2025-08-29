"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
  Mail,
  Calendar,
  Activity,
  Download,
  Upload,
  UserCheck,
  UserX,
  Settings,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  lastActive: string;
  verificationsCount: number;
  avatar?: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@veritas.org",
    role: "admin",
    status: "active",
    joinDate: "2023-01-15",
    lastActive: "5 minutes ago",
    verificationsCount: 2341,
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@veritas.org",
    role: "moderator",
    status: "active",
    joinDate: "2023-03-22",
    lastActive: "1 hour ago",
    verificationsCount: 1876,
    permissions: ["moderate", "verify"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@veritas.org",
    role: "user",
    status: "active",
    joinDate: "2023-05-10",
    lastActive: "2 days ago",
    verificationsCount: 342,
    permissions: ["basic"],
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@veritas.org",
    role: "moderator",
    status: "suspended",
    joinDate: "2023-04-18",
    lastActive: "1 week ago",
    verificationsCount: 924,
    permissions: ["moderate"],
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa@veritas.org",
    role: "user",
    status: "pending",
    joinDate: "2024-01-08",
    lastActive: "Never",
    verificationsCount: 0,
    permissions: ["basic"],
  },
  {
    id: "6",
    name: "Alex Rivera",
    email: "alex@veritas.org",
    role: "user",
    status: "active",
    joinDate: "2023-08-15",
    lastActive: "3 hours ago",
    verificationsCount: 156,
    permissions: ["basic"],
  },
];

const userStats = {
  total: mockUsers.length,
  active: mockUsers.filter((u) => u.status === "active").length,
  suspended: mockUsers.filter((u) => u.status === "suspended").length,
  pending: mockUsers.filter((u) => u.status === "pending").length,
  admins: mockUsers.filter((u) => u.role === "admin").length,
  moderators: mockUsers.filter((u) => u.role === "moderator").length,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: "user",
    status: "pending",
    permissions: ["basic"],
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "moderator":
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs`}>
        {status}
      </Badge>
    );
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditDialog(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? selectedUser : u)),
      );
      setEditDialog(false);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setDeleteDialog(false);
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) return;

    const userId = `new-${Date.now()}`;
    const userToCreate: User = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as User["role"],
      status: "pending",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      verificationsCount: 0,
      permissions: newUser.permissions || ["basic"],
    };

    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers([...users, userToCreate]);
      setCreateDialog(false);
      setNewUser({ role: "user", status: "pending", permissions: ["basic"] });
      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setBulkActionDialog(true);
  };

  const executeBulkAction = async () => {
    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state based on action
      let updatedUsers = [...users];

      selectedUsers.forEach((userId) => {
        const userIndex = updatedUsers.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          switch (bulkAction) {
            case "activate":
              updatedUsers[userIndex].status = "active";
              break;
            case "suspend":
              updatedUsers[userIndex].status = "suspended";
              break;
            case "delete":
              updatedUsers = updatedUsers.filter((u) => u.id !== userId);
              break;
            case "promote":
              updatedUsers[userIndex].role = "moderator";
              break;
            case "demote":
              updatedUsers[userIndex].role = "user";
              break;
          }
        }
      });

      setUsers(updatedUsers);
      setSelectedUsers([]);
      setBulkActionDialog(false);
      console.log(`Bulk ${bulkAction} completed successfully`);
    } catch (error) {
      console.error(`Error executing bulk ${bulkAction}:`, error);
    }
  };

  const exportUsers = async () => {
    try {
      // Simulate export for static export - create CSV data from current users
      const csvHeaders = "id,name,email,role,status,joinDate,lastActive,verificationsCount\n";
      const csvData = users.map(user => 
        `${user.id},${user.name},${user.email},${user.role},${user.status},${user.joinDate},${user.lastActive},${user.verificationsCount}`
      ).join('\n');
      const fullCsv = csvHeaders + csvData;
      
      const blob = new Blob([fullCsv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting users:", error);
    }
  };

  const getBulkActionTitle = (action: string) => {
    switch (action) {
      case "activate":
        return "Activate Users";
      case "suspend":
        return "Suspend Users";
      case "delete":
        return "Delete Users";
      case "promote":
        return "Promote to Moderators";
      case "demote":
        return "Demote to Regular Users";
      default:
        return "Bulk Action";
    }
  };

  const getBulkActionDescription = (action: string, count: number) => {
    switch (action) {
      case "activate":
        return `Are you sure you want to activate ${count} selected user${count > 1 ? "s" : ""}? They will be able to access the platform.`;
      case "suspend":
        return `Are you sure you want to suspend ${count} selected user${count > 1 ? "s" : ""}? They will lose access to the platform.`;
      case "delete":
        return `Are you sure you want to permanently delete ${count} selected user${count > 1 ? "s" : ""}? This action cannot be undone.`;
      case "promote":
        return `Are you sure you want to promote ${count} selected user${count > 1 ? "s" : ""} to moderator${count > 1 ? "s" : ""}? They will gain additional privileges.`;
      case "demote":
        return `Are you sure you want to demote ${count} selected user${count > 1 ? "s" : ""} to regular user${count > 1 ? "s" : ""}? They will lose moderator privileges.`;
      default:
        return `Are you sure you want to perform this action on ${count} selected user${count > 1 ? "s" : ""}?`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Button
            onClick={exportUsers}
            variant="outline"
            size="sm"
            className="h-9 tap-target"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setCreateDialog(true)}
            size="sm"
            className="h-9 tap-target"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total Users
              </p>
              <p className="text-lg sm:text-2xl font-bold">{userStats.total}</p>
            </div>
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {userStats.active}
              </p>
            </div>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Suspended
              </p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">
                {userStats.suspended}
              </p>
            </div>
            <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Pending
              </p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {userStats.pending}
              </p>
            </div>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Admins</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">
                {userStats.admins}
              </p>
            </div>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Moderators
              </p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                {userStats.moderators}
              </p>
            </div>
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48 h-9">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
                selected
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("activate")}
                  className="h-8 text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("suspend")}
                  className="h-8 text-xs"
                >
                  <Ban className="w-3 h-3 mr-1" />
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("promote")}
                  className="h-8 text-xs"
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  Promote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("demote")}
                  className="h-8 text-xs"
                >
                  <UserX className="w-3 h-3 mr-1" />
                  Demote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                  className="h-8 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">
                      <Checkbox
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Verifications</th>
                    <th className="text-left p-3 font-medium">Last Active</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleSelectUser(user.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </td>
                      <td className="p-3">{getStatusBadge(user.status)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <span>{user.verificationsCount}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-muted-foreground">
                          {user.lastActive}
                        </span>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="w-4 h-4 mr-2" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-yellow-600">
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Checkbox
              checked={
                selectedUsers.length === filteredUsers.length &&
                filteredUsers.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              Select all users
            </span>
          </div>

          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) =>
                      handleSelectUser(user.id, checked as boolean)
                    }
                  />
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-sm">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Activity className="w-4 h-4 mr-2" />
                      View Activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === "active" ? (
                      <DropdownMenuItem className="text-yellow-600">
                        <Ban className="w-4 h-4 mr-2" />
                        Suspend User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activate User
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {getRoleIcon(user.role)}
                  <span className="capitalize">{user.role}</span>
                </div>
                <div className="flex items-center justify-end">
                  {getStatusBadge(user.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span>{user.verificationsCount} verifications</span>
                </div>
                <div className="text-right text-muted-foreground">
                  {user.lastActive}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Joined {user.joinDate}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Create New User</DialogTitle>
            <DialogDescription className="text-base">
              Add a new user to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                value={newUser.name || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="Enter full name"
                className="h-10 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="Enter email address"
                className="h-10 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value as User["role"] })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setCreateDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!newUser.name || !newUser.email}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Edit User</DialogTitle>
            <DialogDescription className="text-base">
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="h-10 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="h-10 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: value as User["role"],
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium">
                  Status
                </Label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: value as User["status"],
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <Edit className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl text-red-600">
              Delete User
            </DialogTitle>
            <DialogDescription className="text-base">
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm md:text-base leading-relaxed text-red-700 dark:text-red-300">
                  <strong>{selectedUser.name}</strong> ({selectedUser.email})
                  will be permanently deleted along with all their data and
                  verification history.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUser}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {getBulkActionTitle(bulkAction)}
            </DialogTitle>
            <DialogDescription className="text-base">
              Confirm bulk action on selected users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert
              className={
                bulkAction === "delete"
                  ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                  : ""
              }
            >
              <AlertTriangle
                className={`h-4 w-4 ${bulkAction === "delete" ? "text-red-600" : "text-yellow-600"}`}
              />
              <AlertDescription
                className={`text-sm md:text-base leading-relaxed ${bulkAction === "delete" ? "text-red-700 dark:text-red-300" : "text-yellow-700 dark:text-yellow-300"}`}
              >
                {getBulkActionDescription(bulkAction, selectedUsers.length)}
              </AlertDescription>
            </Alert>
            {selectedUsers.length > 0 && (
              <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-sm font-medium mb-2">Selected users:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedUsers.slice(0, 5).map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    return user ? (
                      <li key={userId}>
                        • {user.name} ({user.email})
                      </li>
                    ) : null;
                  })}
                  {selectedUsers.length > 5 && (
                    <li className="text-xs">
                      ... and {selectedUsers.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setBulkActionDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              variant={bulkAction === "delete" ? "destructive" : "default"}
              onClick={executeBulkAction}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Confirm {bulkAction === "delete" ? "Delete" : "Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
