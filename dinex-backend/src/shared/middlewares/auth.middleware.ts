import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extensão profissional da interface Request do Express para incluir o usuário logado
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do Token' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  // Segurança Sênior: Se o segredo não existir no .env, o sistema deve falhar imediatamente
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('ERRO CRÍTICO: JWT_SECRET não definido no ficheiro .env');
    return res.status(500).json({ error: 'Erro interno de configuração de segurança' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    
    // Injeção do usuário tipada (sem @ts-ignore)
    req.user = decoded;
    
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};