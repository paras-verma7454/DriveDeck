import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionCell from "./ActionCell";



export type Car = {
  id: string;
  // Basic Car Details
  title: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  userPermissions: string[];
  userLoading: boolean;
}

export const getCarColumns = ({
  onEdit,
  onDelete,
  userPermissions,
  userLoading,
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
  {
    accessorKey: "title",
    header: "Title",
  },
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
    accessorKey: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const car = row.original;
      return <ActionCell car={car} onEdit={onEdit} onDelete={onDelete} userPermissions={userPermissions} userLoading={userLoading} />;
    },
  },
];
