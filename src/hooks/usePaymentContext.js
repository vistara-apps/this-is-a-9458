import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { paymentsService } from "../services/payments";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function usePaymentContext() {
  const createSession = useCallback(async (amount, description = "LocalGigs Payment") => {
    try {
      // Create payment intent on the server
      const { clientSecret } = await paymentsService.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        description,
      });

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      return {
        stripe,
        clientSecret,
        amount,
        description,
      };
    } catch (error) {
      console.error("Payment session creation failed:", error);
      throw error;
    }
  }, []);

  const confirmPayment = useCallback(async (stripe, clientSecret, paymentMethod) => {
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      throw error;
    }
  }, []);

  return { 
    createSession,
    confirmPayment,
  };
}

