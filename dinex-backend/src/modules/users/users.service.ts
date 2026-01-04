import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { User, Prisma } from '@prisma/client';

export class UsersService {
  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    // O erro 'undefined' acontecia aqui porque o prisma não estava a ser lido
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (emailExists) {
      throw new Error('This email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}