import { Router } from 'express';
import { ProductsController } from './products.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const productsRouter = Router();
const productsController = new ProductsController();

// Listar produtos de um restaurante (Público)
productsRouter.get('/restaurant/:restaurantId', productsController.getByRestaurant);

// Criar produto (Protegido - Apenas donos logados)
productsRouter.post('/', authMiddleware, (req, res) => productsController.create(req, res));

export { productsRouter };