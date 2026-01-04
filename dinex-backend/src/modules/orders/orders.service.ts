import { prisma } from '../../config/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-12-18' as any,
});

export class OrdersService {
  async createOrderAndSession(data: any) {
    // 1. Cria o pedido no banco de dados
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        restaurantId: data.restaurantId,
        total: data.total,
        status: 'PENDING',
      }
    });

    // 2. Cria a sessão de Checkout na Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: data.items.map((item: any) => ({
        price_data: {
          currency: 'brl',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        orderId: order.id 
      },
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/cancel`,
    });

    return { order, checkoutUrl: session.url };
  }

  async updateStatus(orderId: string, status: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }

  async getRestaurantOrders(restaurantId: string) {
    return await prisma.order.findMany({
      where: { restaurantId }
    });
  }

  async getCustomerOrders(customerId: string) {
    return await prisma.order.findMany({
      where: { customerId }
    });
  }
}