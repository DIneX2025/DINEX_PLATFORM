import { prisma } from '../../config/database';
import { stripe } from '../../config/stripe';

export class OrdersService {
  async createOrderAndSession(data: { customerId: string; restaurantId: string; items: any[] }) {
    // 1. Busca os produtos no banco para garantir o preço correto (Segurança Financeira)
    const productIds = data.items.map((item) => item.productId);
    
    const dbProducts = await prisma.product.findMany({
      where: { 
        id: { in: productIds },
        restaurantId: data.restaurantId // Garante que o produto é deste restaurante
      }
    });

    // 2. Calcula o total real e monta os itens do pedido
    let calculatedTotal = 0;
    const finalItems = data.items.map((item) => {
      const product = dbProducts.find((p) => p.id === item.productId);
      
      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado ou inválido.`);
      }

      const price = Number(product.price);
      const quantity = item.quantity;
      
      calculatedTotal += price * quantity;

      return {
        productId: product.id,
        quantity: quantity,
        price: price, // Preço oficial do banco
        name: product.name // Nome oficial para o Stripe
      };
    });

    // 3. Cria o pedido com o total calculado e seguro
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        restaurantId: data.restaurantId,
        total: calculatedTotal,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: finalItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    // 4. Cria a sessão do Stripe com os valores validados
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: finalItems.map((item) => ({
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
      include: { items: { include: { product: true } }, customer: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCustomerOrders(customerId: string) {
    return await prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { product: true } }, restaurant: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}