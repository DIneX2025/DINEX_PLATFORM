import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(authMiddleware);

// Cliente: Criar Pedido e Ver Meus Pedidos
ordersRouter.post('/', (req, res) => ordersController.create(req, res));
ordersRouter.get('/my-orders', (req, res) => ordersController.getCustomerOrders(req, res));

// Restaurante: Painel de Controle e Atualização de Status
ordersRouter.get('/restaurant-panel', (req, res) => ordersController.getRestaurantOrders(req, res));
ordersRouter.patch('/:orderId/status', (req, res) => ordersController.updateStatus(req, res));

export { ordersRouter };