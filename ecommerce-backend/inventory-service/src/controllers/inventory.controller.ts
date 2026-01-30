import { Request, Response } from "express";
import * as inventoryService from "../services/inventory.service";

export const createInventory = async (req: Request, res: Response) => {
  const inventory = await inventoryService.createInventory(req.body);
  res.status(201).json(inventory);
};

export const getInventoryByProduct = async (
  req: Request,
  res: Response
) => {
  const inventory = await inventoryService.getByProductId(
    req.params.productId
  );
  res.json(inventory);
};

export const updateStock = async (req: Request, res: Response) => {
  const inventory = await inventoryService.updateStock(
    req.params.productId,
    req.body.quantity
  );
  res.json(inventory);
};
