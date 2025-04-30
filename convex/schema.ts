import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
		stripeCustomerId: v.string(),
		currentSubscriptionId: v.optional(v.id("subscriptions")),
  }).index("by_clerkId", ["clerkId"])
  .index("by_stripeCustomerId", ["stripeCustomerId"])
  .index("by_currentSubscriptionId", ["currentSubscriptionId"]),

  courses: defineTable({
		title: v.string(),
		description: v.string(),
		imageUrl: v.string(),
		price: v.number(),
	}),

  purchases: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		amount: v.number(),
		purchaseDate: v.number(), // unix timestamp
		stripePurchaseId: v.string(),
	}).index("by_userId_and_courseId", ["userId", "courseId"]),

  subscriptions: defineTable({
		userId: v.id("users"),
		planType: v.union(v.literal("month"), v.literal("year")),
		currentPeriodStart: v.number(),
		currentPeriodEnd: v.number(),
		stripeSubscriptionId: v.string(),
		status: v.string(),
		cancelAtPeriodEnd: v.boolean(),
	}).index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),

});
