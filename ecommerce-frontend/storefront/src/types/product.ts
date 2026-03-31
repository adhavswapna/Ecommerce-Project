export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  vendorId: string;
  createdAt: string;
  updatedAt: string;

  // ✅ NEW FIELD (supports multiple images)
  images?: string[];

  // ✅ OPTIONAL: fallback support (old data compatibility)
  image?: string;
}
