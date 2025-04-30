import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";
import stripe from "@/lib/stripe";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
	const { userId } = auth();

	if (!userId) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const user = await convex.query(api.users.getUserByClerkId, { clerkId: userId });

		if (!user || !user.stripeCustomerId) {
			return NextResponse.json({ error: "User not found or no Stripe customer ID" }, { status: 404 });
		}

		const session = await stripe.billingPortal.sessions.create({
			customer: user.stripeCustomerId,
			return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
		});

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Error creating billing portal session:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
