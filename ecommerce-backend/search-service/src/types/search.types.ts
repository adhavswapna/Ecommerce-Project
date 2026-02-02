// src/types/search.types.ts

export interface SearchQuery {
  q: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  name: string;
  description?: string;
  price?: number;
  vendorId?: string;
  createdAt?: Date;
}

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  data: SearchResult[];
}

