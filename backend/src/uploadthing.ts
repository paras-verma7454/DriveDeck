import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter: FileRouter= {

  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
      */
     maxFileSize: "4MB",
     maxFileCount: 1,
    },
  })
  .onUploadComplete((file) => {
    console.log("upload completed", file);
  }),
} satisfies FileRouter;


export const uploadRouter2: FileRouter= {

  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
      */
     maxFileSize: "4MB",
     maxFileCount: 5,
    },
  })
  .onUploadComplete((file) => {
    console.log("upload completed", file);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
