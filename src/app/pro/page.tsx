"use client"

import { useUser } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PRO_PLANS } from "@/constants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"




const Page = () => {

	const { user, isLoaded: isUserLoaded } = useUser();
	const [loadingPlan, setLoadingPlan] = useState("");

  const { toast } = useToast()
	const createProPlanCheckoutSession = useAction(api.stripe.createProPlanCheckoutSession);


  const handlePlanSelection = async (planId: "month" | "year") => {
		if (!user) {
			
      toast({
        title: "Please log in to select a plan.",
				duration: 3000,
      })
			return;
		}

		setLoadingPlan(planId);
		try {
			const result = await createProPlanCheckoutSession({ planId });
			if (result.checkoutUrl) {
				window.location.href = result.checkoutUrl;
			}
		}  catch (error: any) {
			if (error.message.includes("Rate limit exceeded")) {
        toast({
          title: "You've tried too many times. Please try again later.",
          duration: 3000,
        })
			} else {
				
        toast({
          title: "There was an error initiating your purchase. Please try again.",
          duration: 3000,
        })
			}
			console.log(error);
		} finally {
			setLoadingPlan("");
		}
	};


	const userData = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip");
  const userSubscription = useQuery(
		api.subscriptions.getUserSubscription,
		userData ? { userId: userData?._id } : "skip"
	);

  const isYearlySubscriptionActive = userSubscription?.status === "active" && userSubscription.planType === "year";
 

  return (
       <div className='container mx-auto px-4 py-16 max-w-6xl h-screen'>
         <h1 className='text-4xl font-bold text-center mb-4 text-gray-800'>Choose Your Pro Journey</h1>
          <p className='text-xl text-center mb-12 text-gray-600'>
            Unlock premium features and accelerate your learning
          </p>

           {isUserLoaded && userSubscription?.status === "active" && (
              <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md'>
                <p className='text-blue-700'>
                  You have an active <span className='font-semibold'>{userSubscription.planType}</span>{" "}
                  subscription.
                </p>
				      </div>
			      )} 

            <div className='grid md:grid-cols-2 gap-8 items-stretch'>
              {PRO_PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`
                    flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-purple-400 shadow-lg hover:shadow-xl"
                  : "hover:border-purple-200 hover:shadow-md"
              }
                `}
                >
                  <CardHeader className='flex-grow'>
                    <CardTitle className={`text-2xl ${plan.highlighted ? "text-purple-600" : "text-gray-800"}`}>
                      {plan.title}
                    </CardTitle>

                    <CardDescription className='mt-2'>
                      <span className='text-3xl font-bold text-gray-900'>{plan.price}</span>
                      <span className='text-gray-600 ml-1'>{plan.period}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className='space-y-3'>
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className='flex items-center'>
                          <Check
                            className={`h-5 w-5 ${plan.highlighted ? "text-purple-500" : "text-green-500"} mr-2 flex-shrink-0`}
                          />
                          <span className='text-gray-700'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className='mt-auto'>
                    <Button
                      className={`w-full py-6 text-lg ${
                        plan.highlighted
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
                      }`}
                      onClick={() => handlePlanSelection(plan.id as "month" | "year")}
                      disabled={
                        userSubscription?.status === "active" &&
                        (userSubscription.planType === plan.id || isYearlySubscriptionActive)
                      }
                    >
                      {loadingPlan === plan.id ? (
                        <>
                          <Loader2Icon className='mr-2 size-4 animate-spin' />
                          Processing...
                        </>
                      ) : isUserLoaded &&
                        userSubscription?.status === "active" &&
                        userSubscription.planType === plan.id ? (
                        "Current Plan"
                      ) : isUserLoaded && plan.id === "month" && isYearlySubscriptionActive ? (
                        "Yearly Plan Active"
                      ) : (
                        plan.ctaText
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

       </div>

  );
}

export default Page