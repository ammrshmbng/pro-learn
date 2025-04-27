"use client"

import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import {  useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast"




const PurchaseButton = ({ courseId }: { courseId: Id<"courses"> }) => {

    const { user } = useUser();
	const userData = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip");
    const [isLoading, setIsLoading] = useState(false);
	const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

	const { toast } = useToast()

    const userAccess = useQuery(
		api.users.getUserAccess,
		userData
			? {
					userId: userData?._id,
					courseId,
				}
			: "skip"
	) || { hasAccess: false };

    const handlePurchase = async () => {
		if (!user) return alert("Please log in to purchase");
		setIsLoading(true);
		try {
			const { checkoutUrl } = await createCheckoutSession({ courseId });
			if (checkoutUrl) {
				window.location.href = checkoutUrl;
			} else {
				throw new Error("Failed to create checkout session");
			}
		} catch (error: any) {
			if (error.message.includes("Rate limit exceeded")) {
				toast({
					title: "You've tried too many times. Please try again later.",
					description: "Friday, February 10, 2023 at 5:57 PM",
				  })
			} else {
				toast({
					title: "You've tried too many times. Please try again later.",
					description: "Friday, February 10, 2023 at 5:57 PM",
				  })
			}
			console.log(error);
		} finally {
			setIsLoading(false);
		}
    }

    if (!userAccess.hasAccess) {
		return (
			<Button variant={"outline"} onClick={handlePurchase} disabled={isLoading}>
				Enroll Now
			</Button>
		);
	}

    if (userAccess.hasAccess) {
		return <Button variant={"outline"}>Enrolled</Button>;
	}

    if (isLoading) {
		return (
			<Button>
				<Loader2Icon className='mr-2 size-4 animate-spin' />
				Processing...
			</Button>
		);
	}

 
}

export default PurchaseButton