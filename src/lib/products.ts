import bed1 from "@/assets/product-bed-1.jpg";
import bed2 from "@/assets/product-bed-2.jpg";
import mattress1 from "@/assets/product-mattress-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Beds" | "Mattresses" | "Bedding";
  collection: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  material: string;
  materials: string[];
  shortDescription: string;
  rating: number;
  reviewCount: number;
  description: string;
  tag?: "New" | "Best Seller";
};

export const products: Product[] = [
  {
    id: "aera-platform-bed",
    name: "Aera Platform Bed",
    category: "Beds",
    collection: "Aera Collection",
    price: 3480,
    originalPrice: 3980,
    image: bed1,
    hoverImage: bed2,
    material: "Belgian linen upholstery, kiln-dried oak frame",
    materials: ["Belgian Linen", "Kiln-dried Ash"],
    shortDescription: "Channel-tufted headboard in Belgian linen.",
    rating: 4.9,
    reviewCount: 128,
    description:
      "A low, softly upholstered platform bed shaped for quiet rooms. Hand-tailored in Belgian linen with a solid oak base engineered to last a lifetime.",
    tag: "Best Seller",
  },
  {
    id: "sori-oak-bed",
    name: "Sori Oak Bed",
    category: "Beds",
    collection: "Sori Collection",
    price: 2980,
    image: bed2,
    hoverImage: bed1,
    material: "Solid white oak, natural oil finish",
    materials: ["FSC Solid Walnut"],
    shortDescription: "Low-profile solid walnut, Japanese-inspired.",
    rating: 4.8,
    reviewCount: 84,
    description:
      "Japanese-inflected joinery in solid white oak. A grounded, floor-close silhouette that lets the room breathe.",
    tag: "New",
  },
  {
    id: "cirrus-signature-mattress",
    name: "Cirrus Signature Mattress",
    category: "Mattresses",
    collection: "Cirrus Series",
    price: 2650,
    image: mattress1,
    material: "Individually-nested pocket springs, natural latex, wool, cotton",
    materials: ["Pocket Springs", "Talalay Latex", "Organic Latex", "Wool"],
    shortDescription: "Fifteen layers of quiet, breathable support.",
    rating: 4.9,
    reviewCount: 212,
    description:
      "Fifteen layers, one purpose: a horizon-flat sleep surface with quiet support and breathable natural fills.",
    tag: "Best Seller",
  },
  {
    id: "linen-bedding-set",
    name: "Stonewashed Linen Set",
    category: "Bedding",
    collection: "Everyday Essentials",
    price: 460,
    image: gallery2,
    material: "100% stonewashed European flax linen",
    materials: ["Linen", "Cashmere"],
    shortDescription: "Stonewashed European flax, softer with time.",
    rating: 4.7,
    reviewCount: 96,
    description:
      "A duvet, flat sheet, and two pillowcases in soft-washed linen that only improves with time.",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}