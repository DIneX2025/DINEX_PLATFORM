import request from 'supertest';
import { app } from '../../index';
import { prisma, pool } from '../../config/database';

describe('Auth Module Integration', () => {
  
  // Hook Profissional: Fecha o Prisma e o Pool de conexões do Postgres
  // Isso elimina completamente o aviso de "open handles" no Jest
  afterAll(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

  it('should return 401 for non-existent user', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'usuario_fantasma@dinex.be',
      password: '123'
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 if password is missing', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'admin@dinex.be'
    });

    expect(response.status).toBe(401);
  });
});