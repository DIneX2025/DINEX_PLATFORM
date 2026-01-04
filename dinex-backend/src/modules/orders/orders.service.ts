import { prisma } from '../../config/database';
import { stripe } from '../../config/stripe'; // Usando a instância centralizada

export class OrdersService {
  async createOrderAndSession(data: any) {
    // 1. Cria o pedido e os itens vinculados em uma única transação atômica
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        restaurantId: data.restaurantId,
        total: data.total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        // Aqui corrigimos a criação dos itens que estava faltando
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    // 2. Cria a sessão de Checkout na Stripe com os dados reais
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: data.items.map((item: any) => ({
        price_data: {
          currency: 'brl',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // Converte para centavos
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

    // 3. Salva o ID da sessão no pedido para validação futura no webhook
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return { order, checkoutUrl: session.url };
  }

  async updateStatus(orderId: string, status: any) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }

  async updatePaymentStatus(orderId: string, paymentStatus: any) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus }
    });
  }

  async getRestaurantOrders(restaurantId: string) {
    return await prisma.order.findMany({
      where: { restaurantId },
      include: { items: { include: { product: true } }, customer: true }
    });
  }

  async getCustomerOrders(customerId: string) {
    return await prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { product: true } }, restaurant: true }
    });
  }
}