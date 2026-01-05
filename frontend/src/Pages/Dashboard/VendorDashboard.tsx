import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { getCarColumns, type Car } from "@/components/car-columns";
import { CarDialog } from "@/components/CarDialog";
import { ENDPOINT_URL, useUser } from "@/hooks/user";
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
  const { user, role,permissions } = useUser();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const params = useParams();
  console.log(params.userCarsId);
  
  const fetchCars = async () => {
    if (!user?.id) return;
    setError(null);
    setLoading(true);
    try {
      let data;
      if (role === "vendor" || params.userCarsId) {
        const res = await axios.get(
          `${ENDPOINT_URL}/v1/vendor/cars/${params.userCarsId ? params.userCarsId : user?.id}`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization") as string,
            },
          }
        );
        console.log("vendor", res.data);
        data = res.data;
      } else if (role === "admin") {
        const res = await axios.get(
          `${ENDPOINT_URL}/v1/cars`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization") as string,
            },
          }
        );
        console.log("admin", res.data);
        data = res.data;
      } else {
        throw new Error("Unauthorized role");
      }
      console.log("data", data);
      if (data.success && Array.isArray(data.cars)) {
        setCars(data.cars);
      } else {
        throw new Error(data.message || "Unexpected response");
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
      toast.error("Unable to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [user?.id]);

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
      fetchCars();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete car");
    } finally {
      setCarToDelete(null);
    }
  };

  const columns = getCarColumns({
    onEdit: handleEditCar,
    onDelete: handleDeleteCar,
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Cars</h2>
        {permissions.includes("cars.create") && <Button className="cursor-pointer" onClick={handleAddCar}>
          Add New Car
        </Button>}
      </div>
      {loading && (
        <div className="flex justify-center items-center h-64">
          <LoaderOneDemo />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <DataTable columns={columns} data={cars} onRefresh={fetchCars} />
      )}

      <CarDialog
        open={isCarDialogOpen}
        onOpenChange={setIsCarDialogOpen}
        onCarSaved={fetchCars}
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
