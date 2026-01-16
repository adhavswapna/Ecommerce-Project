import { Request, Response } from 'express';
import { createUser } from './service';

export async function register(req: Request, res: Response) {
  const user = await createUser(req.body.email);
  res.json(user);
}

