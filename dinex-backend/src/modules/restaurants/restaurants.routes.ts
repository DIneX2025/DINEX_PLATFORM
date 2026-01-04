import { Router } from 'express';
import { RestaurantsController } from './restaurants.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const restaurantsRouter = Router();
const restaurantsController = new RestaurantsController();

// Rota pública: Qualquer um pode ver a lista de restaurantes
restaurantsRouter.get('/', restaurantsController.index);

// Rota protegida: Apenas usuários logados podem criar restaurantes
restaurantsRouter.post('/', authMiddleware, (req, res) => restaurantsController.create(req, res));

export { restaurantsRouter };