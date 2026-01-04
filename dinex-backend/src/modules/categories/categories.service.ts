import { prisma } from '../../config/database';

export class CategoriesService {
  async create(name: string, restaurantId: string) {
    // Gera um slug a partir do nome (ex: "Entradas Frias" -> "entradas-frias")
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return await prisma.category.create({
      data: {
        name,
        slug,
        restaurantId
      }
    });
  }

  async listByRestaurant(restaurantId: string) {
    return await prisma.category.findMany({
      where: { restaurantId },
      include: { products: true }
    });
  }
}