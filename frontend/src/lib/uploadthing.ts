import { ENDPOINT_URL } from "@/hooks/user";
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  url: `${ENDPOINT_URL}/v1/api/uploadthing/vendor`,
});
// ...
export const UploadDropzone = generateUploadDropzone({
  url: `${ENDPOINT_URL}/v1/api/uploadthing`,
});