import { ENDPOINT_URL, useUser } from "@/hooks/user";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import axios from "axios";
import { toast } from "sonner";

export function Upload() {
  const { user } = useUser();

  return (
    <main className="">
      <UploadDropzone
        className="h-50 flex gap-2 border-none ut-button:bg-primary ut-button:px-2 ut-button:mt-2"
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          // Do something with the response
          console.log("Files: ", res[0].ufsUrl);
          const url = res[0].ufsUrl.split("f/")[1];

          console.log("url id:", url);
          const userId = user?.id;
          console.log("user id:", userId);
          try {
            const response = await axios.post(
              `${ENDPOINT_URL}/v1/image`,
              {
                image: url,
                userId: userId,
              },
              {
                headers: {
                  Authorization: localStorage.getItem("Authorization"),
                },
              }
            );
            console.log("response:", response.data.resp.Image);
            toast.success("Upload Completed");
            window.location.reload();
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}

export function Upload2({
  onUploadComplete,
}: {
  onUploadComplete?: (url: string) => void;
}) {
  const { user } = useUser();

  return (
    <main className="">
      <UploadButton
        endpoint="imageUploader"
        className="ut-button:bg-blue-400 ut-button:px-2 ut-button:mt-2"
        onClientUploadComplete={async (res) => {
          // Do something with the response
          console.log("Files: ", res[0].ufsUrl);
          const url = res[0].ufsUrl.split("f/")[1];

          console.log("url id:", url);
          const userId = user?.id;
          console.log("user id:", userId);
          if (onUploadComplete) {
            onUploadComplete(url);
          }
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
