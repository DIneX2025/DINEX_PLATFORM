import 'dotenv/config';
import express from 'express';
import { handleStripeWebhook } from './modules/orders/orders.webhook';

const app = express();

// Webhook DEVE vir antes do express.json()
app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});