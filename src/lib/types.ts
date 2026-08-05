export interface Size {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Variant {
  name: string;
  sku: string;
  thumbnail?: string;
  price?: number; // kalau ada variant tanpa size
  stock?: number;
  sizes: Size[];
}

export interface Product {
  _id: string;

  name: string;

  slug: string;

  category: {
    _id: string;
    name: string;
    slug: string;
  };

  description: string;

  images: string[];

  thumbnail: string;

  video?: string;

  price: number | null;

  minPrice: number;

  maxPrice: number;

  totalStock: number;

  variants: Variant[];

  isActive: boolean;
}