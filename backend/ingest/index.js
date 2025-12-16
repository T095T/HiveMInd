import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "HiveMInd" });

/**
 * Sync user on creation from Clerk
 */
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email_addresses[0]?.email_address,
        name:
          `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User",
        image: data.image_url ?? "",
      },
      create: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        name:
          `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User",
        image: data.image_url ?? "",
      },
    });
  }
);

/**
 * Sync user deletion from Clerk
 */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);

/**
 * Sync user updates from Clerk
 */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email_addresses[0]?.email_address,
        name:
          `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User",
        image: data.image_url ?? "",
      },
      create: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        name:
          `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User",
        image: data.image_url ?? "",
      },
    });
  }
);

// Export all Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];
