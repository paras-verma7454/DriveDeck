import { useEffect, useState, useMemo } from "react"; // Added useMemo
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { getCarColumns, type Car } from "@/components/car-columns";
import { CarDialog } from "@/components/CarDialog";
import { ENDPOINT_URL } from "@/hooks/user";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import axios from "axios";
import { LoaderOneDemo } from "@/components/LoaderOne";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useParams } from "react-router-dom";

export const VendorDashboard = () => {
  const { user, role, permissions: userPermissions, loading: userLoading } = useUser();
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const params = useParams();

  // Pagination states
  const [pagination, setPagination] = useState({
    pageIndex: 0, // TanStack table uses 0-based index
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0); // Total number of pages
  const [rowCount, setRowCount] = useState(0); // Total number of items

  const fetchCars = async (pageIndex: number, pageSize: number) => {
    // Only fetch cars if user data is loaded and available
    if (!user?.id) return;

    setError(null);
    try {
      let data;
      if (role === "vendor" || params.userCarsId) {
        const res = await axios.get(
          `${ENDPOINT_URL}/v1/vendor/cars/${params.userCarsId ? params.userCarsId : user?.id}`,
          {
            headers: { Authorization: localStorage.getItem("Authorization") as string },
          }
        );
        data = res.data;
        setRowCount(data.cars.length); // For vendor, rowCount is just the fetched length
        setPageCount(1); // For vendor, assuming no pagination on this endpoint yet
      } else if (role === "admin") {
        const res = await axios.get(
          `${ENDPOINT_URL}/v1/cars?page=${pageIndex + 1}&pageSize=${pageSize}`, // Send pagination params
          {
            headers: { Authorization: localStorage.getItem("Authorization") as string },
          }
        );
        data = res.data;
        setRowCount(data.totalCars); // Set total count from backend
        setPageCount(Math.ceil(data.totalCars / pageSize)); // Calculate pageCount
      } else {
        throw new Error("Unauthorized role");
      }
      if (data.success && Array.isArray(data.cars)) {
        setCars(data.cars);
      } else {
        throw new Error(data.message || "Unexpected response");
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
      toast.error("Unable to load cars");
    }
  };

  useEffect(() => {
    // Only attempt to fetch cars if user data has loaded and user is available
    if (!userLoading && user?.id) {
      fetchCars(pagination.pageIndex, pagination.pageSize); // Pass pagination states
    }
  }, [user?.id, userLoading, pagination.pageIndex, pagination.pageSize]); // Depend on user.id, userLoading, and pagination

  const handleAddCar = () => {
    setCarToEdit(null);
    setIsCarDialogOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setCarToEdit(car);
    setIsCarDialogOpen(true);
  };

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
  };

  const confirmDeleteCar = async () => {
    if (!carToDelete) return;
    try {
      await axios.delete(`${ENDPOINT_URL}/v1/vendor/car/${carToDelete.id}`);
      toast.success("Car deleted successfully");
      // After delete, re-fetch data for the current page
      fetchCars(pagination.pageIndex, pagination.pageSize);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete car");
    } finally {
      setCarToDelete(null);
    }
  };

  const columns = useMemo(() => getCarColumns({
    onEdit: handleEditCar,
    onDelete: handleDeleteCar,
    userPermissions: userPermissions,
    userLoading: userLoading,
  }), [handleEditCar, handleDeleteCar, userPermissions, userLoading]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Cars</h2>
        {userPermissions.includes("cars.create") && <Button className="cursor-pointer" onClick={handleAddCar}>
          Add New Car
        </Button>}
      </div>
      {userLoading && ( // Use userLoading for the main loader
        <div className="flex justify-center items-center h-64">
          <LoaderOneDemo />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!userLoading && !error && ( // Render DataTable when user data is not loading and no error
        <DataTable
          columns={columns}
          data={cars}
          onRefresh={() => fetchCars(pagination.pageIndex, pagination.pageSize)} // Pass refresh with current page
          loading={userLoading} // Pass userLoading to DataTable
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={pageCount}
          rowCount={rowCount}
          onPaginationChange={setPagination}
        />
      )}

      <CarDialog
        open={isCarDialogOpen}
        onOpenChange={setIsCarDialogOpen}
        onCarSaved={() => fetchCars(pagination.pageIndex, pagination.pageSize)} // Re-fetch current page on save
        carToEdit={carToEdit}
      />

      <AlertDialog
        open={!!carToDelete}
        onOpenChange={(open) => !open && setCarToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the car
              from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCar}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
