import { Request, Response } from 'express';
import { OrdersService } from './orders.service';

const ordersService = new OrdersService();

export class OrdersController {
  async create(req: Request, res: Response) {
    try {
      const result = await ordersService.createOrderAndSession(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await ordersService.updateStatus(id, status);
      return res.json(order);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getRestaurantOrders(req: Request, res: Response) {
    try {
      const { restaurantId } = req.params;
      const orders = await ordersService.getRestaurantOrders(restaurantId);
      return res.json(orders);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getCustomerOrders(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const orders = await ordersService.getCustomerOrders(customerId);
      return res.json(orders);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}