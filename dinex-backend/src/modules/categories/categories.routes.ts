import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

// Listar categorias de um restaurante específico (Público)
categoriesRouter.get('/restaurant/:restaurantId', categoriesController.getByRestaurant);

// Criar nova categoria (Protegido)
categoriesRouter.post('/', authMiddleware, (req, res) => categoriesController.create(req, res));

export { categoriesRouter };