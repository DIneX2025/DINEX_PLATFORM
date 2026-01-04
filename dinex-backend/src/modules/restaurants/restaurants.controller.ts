import { Request, Response } from 'express';
import { RestaurantsService } from './restaurants.service';

export class RestaurantsController {
  private restaurantsService: RestaurantsService;

  constructor() {
    this.restaurantsService = new RestaurantsService();
  }

  create = async (req: Request, res: Response) => {
    try {
      // Tipagem corrigida globalmente, não precisa mais de @ts-ignore
      const ownerId = req.user.id;
      
      const restaurant = await this.restaurantsService.create({
        ...req.body,
        owner: { connect: { id: ownerId } }
      });

      return res.status(201).json(restaurant);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  index = async (_req: Request, res: Response) => {
    const restaurants = await this.restaurantsService.listAll();
    return res.json(restaurants);
  };
}