import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { prisma } from '../../config/database';

const ordersService = new OrdersService();

export class OrdersController {
  async create(req: Request, res: Response) {
    try {
      // Pega o ID do cliente direto do Token para ninguém pedir em nome de outro
      const customerId = req.user.id;
      
      const result = await ordersService.createOrderAndSession({
        ...req.body,
        customerId
      });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params; // Ajustado para bater com a rota :orderId
      const { status } = req.body;
      const order = await ordersService.updateStatus(orderId, status);
      return res.json(order);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getRestaurantOrders(req: Request, res: Response) {
    try {
      const ownerId = req.user.id;

      // Descobre automaticamente qual restaurante é deste dono
      const restaurant = await prisma.restaurant.findFirst({
        where: { ownerId }
      });

      if (!restaurant) {
        return res.status(404).json({ error: 'Nenhum restaurante encontrado para este usuário.' });
      }

      const orders = await ordersService.getRestaurantOrders(restaurant.id);
      return res.json(orders);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getCustomerOrders(req: Request, res: Response) {
    try {
      const customerId = req.user.id;
      const orders = await ordersService.getCustomerOrders(customerId);
      return res.json(orders);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}