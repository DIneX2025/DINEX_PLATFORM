import { Request, Response } from 'express';
import Stripe from 'stripe';
import { stripe } from '../../config/stripe'; // Usando a config centralizada
import { OrdersService } from './orders.service';

const ordersService = new OrdersService();

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    // Construção do evento usando a instância global e o secret do .env
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig as string, 
      endpointSecret as string
    );
  } catch (err: any) {
    console.error(`⚠️ Erro no Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lógica de sucesso no pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      // CORREÇÃO CRÍTICA: Atualizamos o paymentStatus e não o status do pedido
      // conforme definido no seu schema.prisma
      await ordersService.updatePaymentStatus(orderId, 'PAID');
      
      // Opcional: Mover o status do pedido para PREPARING após o pagamento
      await ordersService.updateStatus(orderId, 'PREPARING');
      
      console.log(`✅ Pedido ${orderId} processado e marcado como PAGO.`);
    }
  }

  return res.status(200).json({ received: true });
}