import prisma from "../db/prisma/prisma";


export async function searchProducts(query: string) {
return prisma.product.findMany({
where: {
OR: [
{ name: { contains: query, mode: "insensitive" } },
{ description: { contains: query, mode: "insensitive" } }
]
},
take: 20
});
}
