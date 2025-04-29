import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";


const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {

    const body = await req.text();
	const signature = req.headers.get("Stripe-Signature") as string;

	let event: Stripe.Event;

    try {
		event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
	} catch (err: any) {
		console.log(`Webhook signature verification failed.`, err.message);
		return new Response("Webhook signature verification failed.", { status: 400 });
	}

    try {
		switch (event.type) {
			case "checkout.session.completed":
				await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
				break;
			case "customer.subscription.created":
			case "customer.subscription.updated":
				await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, event.type);
				break;
			default:
				console.log(`Unhandled event type: ${event.type}`);
				break;
		}
	} catch (error: any) {
		console.error(`Error processing webhook (${event.type}):`, error);
		return new Response("Error processing webhook", { status: 400 });
	}

    return new Response(null, { status: 200 });

}


async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
	const courseId = session.metadata?.courseId;
	const stripeCustomerId = session.customer as string;

	if (!courseId || !stripeCustomerId) {
		throw new Error("Missing courseId or stripeCustomerId");
	}

	const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId });

	if (!user) {
		throw new Error("User not found");
	}

	await convex.mutation(api.purchases.recordPurchase, {
		userId: user._id,
		courseId: courseId as Id<"courses">,
		amount: session.amount_total as number,
		stripePurchaseId: session.id,
	});

	
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription, eventType: string) {
	if (subscription.status !== "active" || !subscription.latest_invoice) {
		console.log(`Skipping subscription ${subscription.id} - Status: ${subscription.status}`);
		return;
	}

	const stripeCustomerId = subscription.customer as string;
	const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId });

	if (!user) {
		throw new Error(`User not found for stripe customer id: ${stripeCustomerId}`);
	}

	try {
		await convex.mutation(api.subscriptions.upsertSubscription, {
			userId: user._id,
			stripeSubscriptionId: subscription.id,
			status: subscription.status,
			planType: subscription.items.data[0].plan.interval as "month" | "year",
			currentPeriodStart: subscription.current_period_start,
			currentPeriodEnd: subscription.current_period_end,
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
		});
		console.log(`Successfully processed ${eventType} for subscription ${subscription.id}`);

		// const isCreation = eventType === "customer.subscription.created";

		// if (isCreation && process.env.NODE_ENV === "development") {
		// 	await resend.emails.send({
		// 		from: "MasterClass <onboarding@resend.dev>",
		// 		to: user.email,
		// 		subject: "Welcome to MasterClass Pro!",
		// 		react: ProPlanActivatedEmail({
		// 			name: user.name,
		// 			planType: subscription.items.data[0].plan.interval,
		// 			currentPeriodStart: subscription.current_period_start,
		// 			currentPeriodEnd: subscription.current_period_end,
		// 			url: process.env.NEXT_PUBLIC_APP_URL!,
		// 		}),
		// 	});
		// }
	} catch (error) {
		console.error(`Error processing ${eventType} for subscription ${subscription.id}:`, error);
	}
}