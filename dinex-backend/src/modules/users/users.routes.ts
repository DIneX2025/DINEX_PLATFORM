import { Router } from 'express';
import { UsersController } from './users.controller';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);

export { usersRouter };