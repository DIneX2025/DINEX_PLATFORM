import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class ProductsService {
  async create(data: {
    name: string;
    description?: string;
    price: number;
    restaurantId: string;
    categoryId: string;
  }) {
    // 1. Verifica se a categoria pertence ao restaurante informado
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, restaurantId: data.restaurantId }
    });

    if (!category) {
      throw new Error('Category not found or does not belong to this restaurant.');
    }

    // 2. Cria o produto com o tipo Decimal do Prisma
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        restaurantId: data.restaurantId,
        categoryId: data.categoryId
      }
    });
  }

  async listByRestaurant(restaurantId: string) {
    return await prisma.product.findMany({
      where: { restaurantId, isAvailable: true },
      include: { category: true }
    });
  }
}