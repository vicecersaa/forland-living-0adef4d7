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

  price: number | null;

  minPrice: number;

  maxPrice: number;

  totalStock: number;

  variants: any[];

  isActive: boolean;
}