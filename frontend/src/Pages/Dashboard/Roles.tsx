/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ENDPOINT_URL } from "@/hooks/user"; // Reusing ENDPOINT_URL from user hook
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Trash } from "lucide-react"; // Added Pencil, Trash
import { toast } from "sonner";
// import { useUser } from "@/context/UserContext"; // Import useUser from context
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Added AlertDialog components


interface Permission {
  id: string;
  key: string;
}

interface Role {
  id: string;
  roleName: string;
  permissions: string[]; // Array of permission keys
}

const Roles = () => {
 // const { permissions: userPermissions } = useUser(); // Get user permissions
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, Record<string, boolean>>>({}); // roleId -> permissionKey -> boolean
  const [isAddPermissionDialogOpen, setIsAddPermissionDialogOpen] = useState(false); // State for Add Permission Dialog
  const [newPermissionKey, setNewPermissionKey] = useState(""); // State for new permission key

  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] = useState(false); // State for Edit Permission Dialog
  const [editingPermissionId, setEditingPermissionId] = useState<string | null>(null);
  const [editingPermissionKey, setEditingPermissionKey] = useState("");

  const [isDeletePermissionDialogOpen, setIsDeletePermissionDialogOpen] = useState(false); // State for Delete Permission Dialog
  const [deletingPermissionId, setDeletingPermissionId] = useState<string | null>(null);
  const [deletingPermissionKey, setDeletingPermissionKey] = useState("");


  // Permissions to exclude from the frontend display
  const permissionsToExclude = ['roles.view', 'roles.manage', 'permissions.view','permissions.edit', 'users.view','users.delete'];


  const fetchRolesAndPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        throw new Error("Authorization token not found.");
      }

      const headers = { Authorization: token };

      // Fetch all roles and filter out 'admin' role (defense-in-depth)
      const rolesResponse = await axios.get(`${ENDPOINT_URL}/v1/roles`, { headers });
      const fetchedRoles: Role[] = rolesResponse.data.roles.filter((role: Role) => role.roleName !== 'admin');
      setRoles(fetchedRoles);

      // Fetch all available permissions and filter out excluded ones
      const permissionsResponse = await axios.get(`${ENDPOINT_URL}/v1/permissions`, { headers });
      const fetchedAllPermissions: Permission[] = permissionsResponse.data.permissions;
      const filteredPermissions = fetchedAllPermissions.filter(p => !permissionsToExclude.includes(p.key));
      
      setAllPermissions(filteredPermissions);

      // Initialize selected permissions state
      const initialSelectedPermissions: Record<string, Record<string, boolean>> = {};
      fetchedRoles.forEach(role => {
        initialSelectedPermissions[role.id] = {};
        filteredPermissions.forEach(perm => { // Use filteredPermissions here
          initialSelectedPermissions[role.id][perm.key] = role.permissions.includes(perm.key);
        });
      });
      setSelectedPermissions(initialSelectedPermissions);

    } catch (err:any) {
      console.error("Failed to fetch roles or permissions:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [fetchRolesAndPermissions]);

  const handlePermissionChange = (roleId: string, permissionKey: string, checked: boolean) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionKey]: checked,
      },
    }));
  };

  const handleSave = async (roleId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        throw new Error("Authorization token not found.");
      }
      const headers = { Authorization: token };

      const permissionsToSave = Object.keys(selectedPermissions[roleId]).filter(
        permissionKey => selectedPermissions[roleId][permissionKey]
      );

      await axios.put(`${ENDPOINT_URL}/v1/roles/${roleId}/permissions`, { permissions: permissionsToSave }, { headers });
      // Re-fetch data to ensure UI is in sync with backend
      toast.success(`Permissions for role ${roles.find(r => r.id === roleId)?.roleName} saved successfully!`);
      // Re-fetch data after a short delay to allow toast to be seen
      setLoading(false);
      setTimeout(async () => {
        await fetchRolesAndPermissions();
      }, 500); // 500ms delay

    } catch (err:any) {
      console.error("Failed to save permissions:", err);
      // Use toast for error message
      toast.error(`Failed to save permissions: ${err.message || "An error occurred."}`);
    }
  };

  const handleAddPermission = async () => {
    if (!newPermissionKey.trim()) {
      toast.error("Permission key cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        throw new Error("Authorization token not found.");
      }
      const headers = { Authorization: token };

      await axios.post(`${ENDPOINT_URL}/v1/permissions`, { key: newPermissionKey.trim() }, { headers });
      toast.success(`Permission '${newPermissionKey}' added successfully!`);
      setNewPermissionKey("");
      setIsAddPermissionDialogOpen(false);
      setTimeout(async () => {
        await fetchRolesAndPermissions();
      }, 500);
    } catch (err: any) {
      console.error("Failed to add permission:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
      toast.error(`Failed to add permission: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPermission = async () => {
    if (!editingPermissionKey.trim() || !editingPermissionId) {
      toast.error("Permission key or ID cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        throw new Error("Authorization token not found.");
      }
      const headers = { Authorization: token };

      await axios.put(`${ENDPOINT_URL}/v1/permissions/${editingPermissionId}`, { key: editingPermissionKey.trim() }, { headers });
      toast.success(`Permission '${editingPermissionKey}' updated successfully!`);
      setEditingPermissionId(null);
      setEditingPermissionKey("");
      setIsEditPermissionDialogOpen(false);
      setTimeout(async () => {
        await fetchRolesAndPermissions();
      }, 500);
    } catch (err: any) {
      console.error("Failed to edit permission:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
      toast.error(`Failed to edit permission: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermission = async () => {
    if (!deletingPermissionId) {
      toast.error("Permission ID not found for deletion.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        throw new Error("Authorization token not found.");
      }
      const headers = { Authorization: token };

      await axios.delete(`${ENDPOINT_URL}/v1/permissions/${deletingPermissionId}`, { headers });
      toast.success(`Permission '${deletingPermissionKey}' deleted successfully!`);
      setDeletingPermissionId(null);
      setDeletingPermissionKey("");
      setIsDeletePermissionDialogOpen(false);
      setTimeout(async () => {
        await fetchRolesAndPermissions();
      }, 500);
    } catch (err: any) {
      console.error("Failed to delete permission:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
      toast.error(`Failed to delete permission: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Manage permissions for different roles.</CardDescription>
        </div>
        
          <Button className="cursor-pointer" onClick={() => setIsAddPermissionDialogOpen(true)}>
            Add New Permission
          </Button>
        
      </CardHeader>
      <CardContent>
        {roles.length === 0 ? (
          <p>No roles found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Role Name</TableHead>
                {allPermissions.map(perm => {
                    const parts = perm.key.split('.');
                    const action = parts.length > 1 
                      ? parts.slice().reverse().join(' ')  // Reverse parts, join with ' '
                      : parts[0];
                    const displayName = action 
                      ? action.charAt(0).toUpperCase() + action.slice(1) 
                      : 'N/A';
                    
                    return (
                      <TableHead key={perm.id} className="text-center">
                        <div className="flex items-center justify-center">
                          <span>{displayName}</span>
                         
                            <Button variant="ghost" size="icon" className="ml-2 h-6 w-6"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent checkbox toggle if any
                                    setEditingPermissionId(perm.id);
                                    setEditingPermissionKey(perm.key);
                                    setIsEditPermissionDialogOpen(true);
                                }}
                            >
                                <Pencil className="h-3 w-3" />
                            </Button>
                         
                         
                            <Button variant="ghost" size="icon" className="ml-1 h-6 w-6 text-red-500 hover:text-red-600"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent checkbox toggle if any
                                    setDeletingPermissionId(perm.id);
                                    setDeletingPermissionKey(perm.key);
                                    setIsDeletePermissionDialogOpen(true);
                                }}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                         
                      </div>
                    </TableHead>
                  );
                })}

                <TableHead className="text-center">Role Actions</TableHead> {/* Renamed for clarity */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.roleName}</TableCell>
                  {allPermissions.map(perm => (
                    <TableCell key={perm.id} className="text-center">
                      <Checkbox
                        checked={selectedPermissions[role.id]?.[perm.key] || false}
                        onCheckedChange={(checked: boolean) =>
                          handlePermissionChange(role.id, perm.key, checked)
                        }
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Button className="cursor-pointer" onClick={() => handleSave(role.id)}>Save</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Permission Dialog */}
      <Dialog open={isAddPermissionDialogOpen} onOpenChange={setIsAddPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Permission</DialogTitle>
            <DialogDescription>Enter the key for the new permission.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="permissionKey" className="text-right">
                Key
              </Label>
              <Input
                id="permissionKey"
                value={newPermissionKey}
                onChange={(e) => setNewPermissionKey(e.target.value)}
                className="col-span-3"
                placeholder="e.g., cars.create, users.delete"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button className="cursor-pointer" onClick={handleAddPermission} disabled={loading}>
              {loading ? "Adding..." : "Add Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditPermissionDialogOpen} onOpenChange={setIsEditPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>Update the key for the permission.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editPermissionKey" className="text-right">
                Key
              </Label>
              <Input
                id="editPermissionKey"
                value={editingPermissionKey}
                onChange={(e) => setEditingPermissionKey(e.target.value)}
                className="col-span-3"
                placeholder="e.g., cars.create, users.delete"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button className="cursor-pointer" onClick={handleEditPermission} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permission Confirmation Dialog */}
      <AlertDialog open={isDeletePermissionDialogOpen} onOpenChange={setIsDeletePermissionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the permission
              <span className="font-bold"> "{deletingPermissionKey}"</span> and remove it from all roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeletePermission} disabled={loading}>
              {loading ? "Deleting..." : "Delete Permission"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default Roles;

// export default Roles;