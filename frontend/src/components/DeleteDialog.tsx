import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINT_URL } from "@/hooks/user";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteDialogProps {
  id: string;
  onRefresh?: () => void;
}

export function DeleteDialog({ id, onRefresh }: DeleteDialogProps) {
  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${ENDPOINT_URL}/v1/delete/user/${id}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("User deleted successfully");
        if (onRefresh) onRefresh();
      } else {
        toast.error("Unable to delete user");
      }
    } catch (e) {
      console.error(e);
      toast.error("Unable to delete user");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-center gap-2 w-full cursor-pointer text-destructive hover:text-destructive/90">
          <Trash2 className="h-4 w-4" />
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
