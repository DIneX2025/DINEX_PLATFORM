import { Router, Request, Response } from 'express';
import { AuthController } from './auth.controller';

const authRouter = Router();
const authController = new AuthController();

// Usamos arrow function para preservar o contexto da classe
authRouter.post('/login', (req: Request, res: Response) => authController.login(req, res));

export { authRouter };