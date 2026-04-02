import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const headerPayload = req.headers;
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: {
    type: string;
    data: {
      id: string;
      email_addresses: Array<{ email_address: string }>;
      first_name: string | null;
      last_name: string | null;
      image_url: string | null;
    };
  };

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = evt;
  const email = data.email_addresses?.[0]?.email_address;
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "User";

  switch (type) {
    case "user.created":
      if (email) {
        await db.user.create({
          data: {
            clerkId: data.id,
            email,
            name,
            avatarUrl: data.image_url,
          },
        });
      }
      break;

    case "user.updated":
      if (email) {
        await db.user.update({
          where: { clerkId: data.id },
          data: { email, name, avatarUrl: data.image_url },
        });
      }
      break;

    case "user.deleted":
      await db.user.update({
        where: { clerkId: data.id },
        data: { email: `deleted-${data.id}@deleted.com`, name: "Deleted User" },
      }).catch(() => {});
      break;
  }

  return NextResponse.json({ received: true });
}
