import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { EditUserDialog } from "./EditUserDialog";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { DeleteDialog } from "./DeleteDialog";
import { VITE_IMG_URL } from "@/hooks/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export type User = {
  id: string;
  FirstName: string;
  LastName: string;
  UserName: string;
  PhoneNumber: string;
  Email: string;
  Password: string;
  Image: string | null;
  createdAt: Date;
  updatedAt: Date;
  City: string;
  State: string;
  Country: string;
  Pincode: string;
  role: {
    id: string;
    roleName: string;
  };
};

export const UserActions = ({
  user,
  onRefresh,
}: {
  user: User;
  onRefresh?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center gap-2 w-full cursor-pointer"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </div>
      <EditUserDialog
        open={open}
        onOpenChange={setOpen}
        user={user}
        onUserUpdated={() => {
          if (onRefresh) {
            onRefresh();
          } else {
            window.location.reload();
          }
        }}
      />
    </>
  );
};

export const userColumns: ColumnDef<User, any>[] = [
  //   { accessorKey: "id", header: "ID", size: 80 },
  //   { accessorKey: "Password", header: "Password", size: 100 },
  {
    accessorKey: "Image",
    header: "Image",
    size: 10,
    cell: ({ row }) => {
      const profileImage = row.getValue("Image") as string | null;
      const firstName = row.getValue("FirstName") as string;
      const firstNameInitial = firstName
        ? firstName.charAt(0).toUpperCase()
        : "";

      return (
        <Button
          variant="outline"
          className="rounded-full cursor-pointer overflow-hidden"
          size="icon"
        >
          <Avatar>
            {profileImage ? (
              <AvatarImage src={`${VITE_IMG_URL}${profileImage}`} />
            ) : null}
            <AvatarFallback>{firstNameInitial}</AvatarFallback>
          </Avatar>
        </Button>
      );
    },
  },
  { accessorKey: "FirstName", header: "First Name", size: 120 },
  { accessorKey: "LastName", header: "Last Name", size: 120 },
  { accessorKey: "UserName", header: "Username", size: 120 },
  { accessorKey: "role.roleName", id: "roleName", header: "Role", size: 120 },
  { accessorKey: "PhoneNumber", header: "Phone", size: 130 },
  { accessorKey: "Email", header: "Email", size: 200 },
  { accessorKey: "City", header: "City", size: 100 },
  { accessorKey: "State", header: "State", size: 100 },
  { accessorKey: "Country", header: "Country", size: 100 },
  //   { accessorKey: "Pincode", header: "Pincode", size: 100 },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onRefresh?: () => void } | undefined;
      const navigate = useNavigate();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className="cursor-pointer">
              <button
                onClick={() => {
                  navigate(`/dashboard/cars/${row.original.id}`);
                }}
              >
                See user cars
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UserActions user={row.original} onRefresh={meta?.onRefresh} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteDialog id={row.original.id} onRefresh={meta?.onRefresh} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
