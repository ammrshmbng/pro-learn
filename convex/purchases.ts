import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const recordPurchase = mutation({
	args: {
		userId: v.id("users"),
		courseId: v.id("courses"),
		amount: v.number(),
		stripePurchaseId: v.string(),
	},
	handler: async (ctx, args) => {
		const { userId, amount, courseId, stripePurchaseId } = args;

		const purchaseId = await ctx.db.insert("purchases", {
			userId,
			amount,
			courseId,
			stripePurchaseId,
			purchaseDate: Date.now(),
		});

		return purchaseId;
	},
});
