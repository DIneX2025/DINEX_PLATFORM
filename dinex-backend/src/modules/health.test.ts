import request from 'supertest';
import express from 'express';

const app = express();
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});