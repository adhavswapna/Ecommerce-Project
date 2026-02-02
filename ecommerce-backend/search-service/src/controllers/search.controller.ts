import { Request, Response, NextFunction } from "express";
import { searchProducts } from "../services/search.service";


export async function search(req: Request, res: Response, next: NextFunction) {
try {
const query = req.query.q as string;


if (!query) {
return res.status(400).json({ message: "Query param 'q' is required" });
}


const results = await searchProducts(query);
res.json(results);
} catch (err) {
next(err);
}
}