import { api } from "../axios";

const BASE = process.env.NEXT_PUBLIC_SEARCH_API_URL;

export const searchProducts = async (q: string) =>
  api.get(`${BASE}/search?q=${q}`);

