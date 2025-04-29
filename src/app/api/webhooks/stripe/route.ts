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
	console.log('Received session:', JSON.stringify(session, null, 2));

	if (session.mode === 'subscription') {
		console.log('Subscription payment - skipping checkout handler');
		return;
	}

	const courseId = session.metadata?.courseId;
	const stripeCustomerId = session.customer as string;

	if (!courseId || !stripeCustomerId) {
		console.error('Missing data:', { courseId, stripeCustomerId });
		throw new Error("Missing courseId or stripeCustomerId");
	}

	try {
		const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId });

		if (!user) {
			console.error('User not found for stripeCustomerId:', stripeCustomerId);
			throw new Error("User not found");
		}

		await convex.mutation(api.purchases.recordPurchase, {
			userId: user._id,
			courseId: courseId as Id<"courses">,
			amount: session.amount_total as number,
			stripePurchaseId: session.id,
		});

		console.log('Purchase recorded successfully');
	} catch (error) {
		console.error('Error in handleCheckoutSessionCompleted:', error);
		throw error;
	}
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription, eventType: string) {
    console.log('=== START SUBSCRIPTION UPSERT ===');
    console.log('Event Type:', eventType);
    console.log('Full subscription object:', JSON.stringify(subscription, null, 2));
    
    // Cek kondisi sebelum proses
    if (!["active", "trialing", "past_due"].includes(subscription.status)) {
        console.error(`Skipping subscription with status: ${subscription.status}`);
        return;
    }

    try {
        const stripeCustomerId = subscription.customer as string;
        console.log('Looking for user with Stripe Customer ID:', stripeCustomerId);
        
        const user = await convex.query(api.users.getUserByStripeCustomerId, { stripeCustomerId });
        console.log('User found?', !!user);
        
        if (!user) {
            console.error(`No user found for Stripe Customer ID: ${stripeCustomerId}`);
            return;
        }

        // Pastikan kita mengambil nilai yang benar dari objek subscription
        const subscriptionData = {
            userId: user._id,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            planType: subscription.items.data[0]?.plan.interval as "month" | "year",
            // Konversi ke number untuk memastikan tipe data yang benar
            currentPeriodStart: Math.floor(subscription.current_period_start || Date.now() / 1000),
            currentPeriodEnd: Math.floor(subscription.current_period_end || (Date.now() / 1000 + 30 * 24 * 60 * 60)), // default 30 hari
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        };
        
        console.log('Attempting to upsert subscription with data:', subscriptionData);

        const result = await convex.mutation(api.subscriptions.upsertSubscription, subscriptionData);
        console.log('Upsert completed successfully:', result);
        
    } catch (error) {
        console.error('=== ERROR IN SUBSCRIPTION UPSERT ===');
        console.error('Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        throw error;
    } finally {
        console.log('=== END SUBSCRIPTION UPSERT ===');
    }
}