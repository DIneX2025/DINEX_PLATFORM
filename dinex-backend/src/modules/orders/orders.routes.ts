import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(authMiddleware);

// Rotas do Cliente
ordersRouter.post('/', ordersController.create);
ordersRouter.get('/my-orders', ordersController.index);

// Rotas do Restaurante (Painel do Dono)
ordersRouter.get('/restaurant-panel', ordersController.listForRestaurant);
ordersRouter.patch('/:orderId/status', ordersController.updateStatus);

export { ordersRouter };