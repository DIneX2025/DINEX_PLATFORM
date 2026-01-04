import { Request, Response } from 'express';
import { ProductsService } from './products.service';

export class ProductsController {
  private productsService: ProductsService;

  constructor() {
    this.productsService = new ProductsService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const product = await this.productsService.create(req.body);
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getByRestaurant = async (req: Request, res: Response) => {
    try {
      const { restaurantId } = req.params;
      const products = await this.productsService.listByRestaurant(restaurantId);
      return res.json(products);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}