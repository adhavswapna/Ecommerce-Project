import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_RATING_API_URL;

export const getRatings = async (productId: string) =>
  api.get(`${BASE}/ratings/${productId}`);

