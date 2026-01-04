import { Request, Response } from 'express';
import Stripe from 'stripe';
import { OrdersService } from './orders.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-18' as any,
});

const ordersService = new OrdersService();

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret as string);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await ordersService.updateStatus(orderId, 'PAID');
      console.log(`✅ Pedido ${orderId} marcado como PAGO.`);
    }
  }

  return res.status(200).json({ received: true });
}