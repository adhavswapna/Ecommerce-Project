import { Request, Response, NextFunction } from "express";
import { searchProducts } from "../services/search.service";

export async function search(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { query, minPrice, maxPrice } = req.body;

    // ✅ validation
    if (!query) {
      return res.status(400).json({
        message: "Field 'query' is required in request body",
      });
    }

    const results = await searchProducts(query, {
      minPrice,
      maxPrice,
    });

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
}
