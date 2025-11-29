import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";

export type Car = {
  id: string;
  // Basic Car Details
  title?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  registrationYear?: number;
  vehicleType?: string;

  // Pricing
  price: number;
  discountPrice?: number;
  isNegotiable: boolean;
  originalPrice?: number;

  // Ownership & Documents
  ownerNumber?: number;
  registrationNumber?: string;
  rcAvailable: boolean;
  insuranceType?: string;
  insuranceValidity?: string; // ISO Date string
  pucValidTill?: string; // ISO Date string
  serviceHistoryAvailable: boolean;

  // Car Condition / Specs
  kmDriven?: number;
  fuelType?: string;
  transmission?: string;
  engineCapacity?: string;
  mileage: number;
  color: string;
  seatingCapacity?: number;
  doors?: number;
  topSpeed?: number;
  accidental: boolean;
  floodDamage: boolean;

  // Features
  features?: any; // JSON object

  // Seller Details
  sellerAddress?: string;

  // Media
  mainImage?: string;
  images: string[];
  videoUrl?: string;

  // Status & Admin Fields
  status: string;
  featured: boolean;
  viewsCount: number;

  description?: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
};

interface CarColumnsProps {
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export const getCarColumns = ({
  onEdit,
  onDelete,
}: CarColumnsProps): ColumnDef<Car>[] => [
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Brand
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  // {
  //   accessorKey: "variant",
  //   header: "Variant",
  // },
  // {
  //   accessorKey: "registrationYear",
  //   header: "Registration Year",
  // },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Manufacture Year
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "originalPrice",
    header: ({ column }) => {
      return (
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Original
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("originalPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "mileage",
    header: "Mileage",
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
    cell: ({ row }) => {
      const fuel = row.getValue("fuelType") as string;
      return <div className="font-medium capitalize">{fuel}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const car = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button
            className="cursor-pointer hover:text-blue-400"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(car)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit car</span>
          </Button>
          <Button
            className="cursor-pointer text-red-600 hover:text-red-700"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(car)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete car</span>
          </Button>
        </div>
      );
    },
  },
];
