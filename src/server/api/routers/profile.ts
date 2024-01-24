import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  credentials: {
    client_email: "cloudstorage@sortable-ai.iam.gserviceaccount.com",
    private_key: process.env.SECRET_FOR_LONG,
  },
  projectId: "sortable-ai",
});
const bucketName = "medium-blog-project"; // Replace with your GCP bucket name

export const profileRouter = createTRPCRouter({
  getinforProfilebyUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          name: true,
          image: true,
          email: true,
        },
      });
    }),
  createBio: publicProcedure
    .input(z.object({ userId: z.string(), bio: z.string() }))
    .mutation(({ ctx, input }) => {
      const bioData = ctx.db.bio.findUnique({
        where: {
          userId: input.userId,
        },
      });
      if (!bioData ) {
        return ctx.db.bio.create({
          data: {
            userId: input.userId,
            bio: input.bio,
          },
        });
      } else {
        return ctx.db.bio.update({
          where: {
            userId: input.userId,
          },
          data: {
            bio: input.bio,
          },
        });
      }
    }),
  getBio: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.bio.findUnique({
        where: {
          userId: input.userId,
        },
        select: {
          bio: true,
          user: {
            select: {
              email: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),
});

// Helper function to upload an image to GCP Storage
// async function uploadImageToGCP(imagePath: string): Promise<string> {
//   const bucket = storage.bucket(bucketName);
//   const uniqueFileName = `${Date.now()}_${Math.floor(
//     Math.random() * 1000,
//   )}_${imagePath}`;
//   const file = bucket.file(uniqueFileName);

//   await file.save(imagePath, {
//     metadata: {
//       contentType: "image/jpeg", // Set the appropriate content type for your image
//     },
//   });

//   // Make the file publicly accessible
//   await file.makePublic();

//   // Get the public URL of the uploaded file
//   const imageUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;

//   return imageUrl;
// }