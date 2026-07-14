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
  image: string;
  hoverImage?: string;
  material: string;
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
    image: bed1,
    hoverImage: bed2,
    material: "Belgian linen upholstery, kiln-dried oak frame",
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
    description:
      "A duvet, flat sheet, and two pillowcases in soft-washed linen that only improves with time.",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}