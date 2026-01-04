import { Request, Response } from 'express';
import { CategoriesService } from './categories.service';

export class CategoriesController {
  private categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name, restaurantId } = req.body;
      
      if (!name || !restaurantId) {
        return res.status(400).json({ error: 'Name and restaurantId are required.' });
      }

      const category = await this.categoriesService.create(name, restaurantId);
      return res.status(201).json(category);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getByRestaurant = async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      const categories = await this.categoriesService.listByRestaurant(restaurantId);
      return res.json(categories);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}