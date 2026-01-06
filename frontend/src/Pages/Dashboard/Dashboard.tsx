import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { userColumns } from "@/components/user-columns";
import type { User } from "@/components/user-columns";
import { ENDPOINT_URL } from "@/hooks/user";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import axios from "axios";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { LoaderOneDemo } from "@/components/LoaderOne";
// import { VendorDashboard } from "./VendorDashboard";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const { role, user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Pagination states
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const fetchUsers = async (pageIndex: number, pageSize: number) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`${ENDPOINT_URL}/v1/all/users?page=${pageIndex + 1}&pageSize=${pageSize}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization") as string,
        },
      });
      const data = response.data;
      if (data.success && Array.isArray(data.users)) {
        const filteredUsers = data.users.filter(
          (u: User) => u.Email !== user?.Email
        );
        setUsers(filteredUsers);
        setRowCount(data.totalUsers);
        setPageCount(Math.ceil(data.totalUsers / pageSize));
      } else {
        throw new Error(data.message || "Unexpected response");
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
      toast.error("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      fetchUsers(pagination.pageIndex, pagination.pageSize); // Pass pagination states
    } else if (role === "user") {
      setLoading(false);
    }
  }, [role, user?.Email, pagination.pageIndex, pagination.pageSize]); // Add pagination to dependencies

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true);
  };

  if (role === "admin") {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <Button className="cursor-pointer" onClick={handleCreateUser}>
            Create New User
          </Button>
        </div>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <LoaderOneDemo />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <DataTable
            columns={userColumns}
            data={users}
            onRefresh={() => fetchUsers(pagination.pageIndex, pagination.pageSize)}
            loading={loading} // Pass local loading to DataTable
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            pageCount={pageCount}
            rowCount={rowCount}
            onPaginationChange={setPagination}
          />
        )}
        <CreateUserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onUserCreated={() => fetchUsers(pagination.pageIndex, pagination.pageSize)}
        />
      </div>
    );
  } else if (role === "vendor") {
    // return <VendorDashboard />;
    navigate("/dashboard/cars");
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderOneDemo />
      </div>
    );
  }
};

export default Dashboard;
