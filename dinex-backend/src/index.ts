import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Importação das Rotas
import { handleStripeWebhook } from './modules/orders/orders.webhook';
import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { restaurantsRouter } from './modules/restaurants/restaurants.routes';
import { productsRouter } from './modules/products/products.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { ordersRouter } from './modules/orders/orders.routes';

const app = express();

// Middlewares de Segurança e Log
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Webhook do Stripe (Deve vir antes do express.json)
app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// Middleware para Parsing de JSON
app.use(express.json());

// Registro das Rotas da API
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 DineX Server rodando na porta ${PORT}`);
});