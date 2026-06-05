export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  stock: number;
  vendorId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
