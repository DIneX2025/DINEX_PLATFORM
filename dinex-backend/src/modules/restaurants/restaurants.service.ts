import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class RestaurantsService {
  async create(data: Prisma.RestaurantCreateInput) {
    const vatExists = await prisma.restaurant.findUnique({
      where: { vatNumber: data.vatNumber }
    });

    if (vatExists) {
      throw new Error('A restaurant with this VAT number already exists.');
    }

    // Gera o slug a partir do nome
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return await prisma.restaurant.create({
      data: {
        ...data,
        slug
      }
    });
  }

  async listAll() {
    return await prisma.restaurant.findMany({
      where: { isActive: true },
      include: { categories: true }
    });
  }
}