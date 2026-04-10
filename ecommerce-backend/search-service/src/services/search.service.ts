import prisma from "../db/prisma/prisma";

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
}

export async function searchProducts(
  query: string,
  filters: SearchFilters = {}
) {
  const { minPrice, maxPrice } = filters;

  return prisma.searchProduct.findMany({
    where: {
      AND: [
        // ✅ Apply text search only if query exists
        query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        // ✅ Price filters
        minPrice !== undefined
          ? { price: { gte: Number(minPrice) } }
          : {},

        maxPrice !== undefined
          ? { price: { lte: Number(maxPrice) } }
          : {},
      ],
    },
    take: 20,
  });
}
