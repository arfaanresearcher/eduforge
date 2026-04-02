import Stripe from "stripe";
import { db } from "./db";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_placeholder") {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(key, {
    apiVersion: "2025-03-31.basil" as Stripe.LatestApiVersion,
  });
}

export async function createCheckoutSession(
  userId: string,
  courseId: string,
  productId: string,
): Promise<string> {
  const stripe = getStripe();
  const [user, product] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: userId } }),
    db.product.findUniqueOrThrow({
      where: { id: productId },
      include: { course: true },
    }),
  ]);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      courseId,
      productId,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/learn/${product.course.slug}?enrolled=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/learn/${product.course.slug}`,
  });

  return session.url!;
}

export async function handleWebhookEvent(
  body: string,
  signature: string,
): Promise<Stripe.Event> {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}

export async function createRefund(paymentId: string): Promise<Stripe.Refund> {
  const stripe = getStripe();
  const payment = await db.payment.findUniqueOrThrow({
    where: { id: paymentId },
  });

  return stripe.refunds.create({
    payment_intent: payment.stripePaymentId,
  });
}

export async function getCustomerPortalUrl(
  stripeCustomerId: string,
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/learn`,
  });

  return session.url;
}
