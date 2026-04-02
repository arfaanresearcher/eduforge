import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) throw new Error("User not found in database");

  return dbUser;
}

export async function requireRole(role: Role) {
  const user = await getCurrentUser();
  if (user.role !== role && user.role !== Role.ADMIN) {
    throw new Error(`Forbidden: requires ${role} role`);
  }
  return user;
}

export async function syncUserToDatabase(clerkUser: {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}) {
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("No email found for user");

  const name = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ") || "User";

  return db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      name,
      avatarUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name,
      avatarUrl: clerkUser.imageUrl,
    },
  });
}
