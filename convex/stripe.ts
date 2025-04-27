import { ConvexError,v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import stripe from "../src/lib/stripe";
import ratelimit from "../src/lib/ratelimit";




export const createCheckoutSession = action({
	args: { courseId: v.id("courses") },
	handler: async (ctx, args): Promise<{ checkoutUrl: string | null }> => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.runQuery(api.users.getUserByClerkId, {
			clerkId: identity.subject,
		});

		if (!user) {
			throw new ConvexError("User not found");
		}

		const rateLimitKey = `checkout-rate-limit:${user._id}`;
		const { success } = await ratelimit.limit(rateLimitKey);

		if (!success) {
			throw new Error(`Rate limit exceeded.`);
		}

        const course = await ctx.runQuery(api.courses.getCourseById, {
			courseId: args.courseId,
		});

		if (!course) {
			throw new ConvexError("Course not found");
		}

        const session = await stripe.checkout.sessions.create({
			customer: user.stripeCustomerId,
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: course.title,
							images: [course.imageUrl],
						},
						unit_amount: Math.round(course.price * 100),
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${args.courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses`,

			metadata: {
				courseId: args.courseId,
				userId: user._id,
				courseTitle: course.title,
				courseImageUrl: course.imageUrl,
			},
		});

        return { checkoutUrl: session.url };
	},
});