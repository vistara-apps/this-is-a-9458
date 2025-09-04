import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Platform fee percentage (5-10% as specified in PRD)
const PLATFORM_FEE_PERCENTAGE = 0.08; // 8%

export const paymentsService = {
  // Create payment intent for task/gig completion
  createPaymentIntent: async (paymentData) => {
    try {
      const { amount, currency = 'USD', taskId, gigId, payeeId } = paymentData;
      
      // Calculate platform fee
      const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100); // Convert to cents
      const totalAmount = Math.round(amount * 100); // Convert to cents

      // Create payment intent via Supabase Edge Function (you'll need to create this)
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: totalAmount,
          currency,
          platformFee,
          taskId,
          gigId,
          payeeId,
          metadata: {
            taskId: taskId || '',
            gigId: gigId || '',
            payeeId
          }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Process payment
  processPayment: async (paymentIntentId, paymentMethodId) => {
    try {
      const stripe = await stripePromise;
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        payment_method: paymentMethodId,
        client_secret: paymentIntentId,
        return_url: `${window.location.origin}/payment-success`
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Create setup intent for saving payment methods
  createSetupIntent: async (customerId) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-setup-intent', {
        body: { customerId }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  },

  // Get user's payment methods
  getPaymentMethods: async (customerId) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-methods', {
        body: { customerId }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Create Stripe customer
  createCustomer: async (userData) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-customer', {
        body: {
          email: userData.email,
          name: userData.full_name,
          metadata: {
            userId: userData.id
          }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Record payment in database
  recordPayment: async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (paymentId, status) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', paymentId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Get user's payment history
  getPaymentHistory: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          payer:payer_id(id, username, full_name),
          payee:payee_id(id, username, full_name),
          task:task_id(id, title),
          gig:gig_id(id, title)
        `)
        .or(`payer_id.eq.${userId},payee_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Calculate platform fee
  calculatePlatformFee: (amount) => {
    return Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
  },

  // Format currency
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
};

// Stripe webhook handler (for backend integration)
export const handleStripeWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentsService.updatePaymentStatus(
          event.data.object.id,
          'succeeded'
        );
        break;
      
      case 'payment_intent.payment_failed':
        await paymentsService.updatePaymentStatus(
          event.data.object.id,
          'failed'
        );
        break;
      
      case 'payment_intent.canceled':
        await paymentsService.updatePaymentStatus(
          event.data.object.id,
          'cancelled'
        );
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};
