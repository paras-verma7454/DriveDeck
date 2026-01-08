import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react"; // useUser import removed
import type { Car } from "./car-columns";

interface ActionCellProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  userPermissions: string[]; // New prop
  userLoading: boolean;      // New prop
  role: string;
}

const ActionCell = ({ car, onEdit, onDelete, userPermissions, userLoading, role }: ActionCellProps) => { // New props

  if (userLoading) return null; // Use userLoading

  return (
    <div className="flex items-center space-x-2">
      {((userPermissions && userPermissions.includes("cars.edit")) || role === "admin") && ( // Use userPermissions
        <Button
          className="cursor-pointer hover:text-blue-400"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(car)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit car</span>
        </Button>
      )}
      {((userPermissions && userPermissions.includes("cars.delete")) || role === "admin") && ( // Use userPermissions
        <Button
          className="cursor-pointer text-red-600 hover:text-red-700"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(car)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete car</span>
        </Button>
      )}
    </div>
  );
};

export default ActionCell;