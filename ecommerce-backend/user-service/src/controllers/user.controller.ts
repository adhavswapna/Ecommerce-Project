import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

type GetUserParams = {
  id: string;
};

export class UserController {
  static me = async (req: Request, res: Response) => {
    const user = await UserService.getMe(req.user!.userId);
    res.json(user);
  };

  static getById = async (
    req: Request<GetUserParams>,
    res: Response
  ) => {
    const user = await UserService.getById(req.params.id);
    res.json(user);
  };
}
