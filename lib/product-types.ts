export type Product = {
  id: string;
  title: string;
  type: string;
  category: string;
  price: number;
  image: string;
  description: string;
  badge?: string | null;
  free?: boolean;
  liveUrl?: string | null;
  imageFit?: 'cover' | 'contain' | 'fill';
  imageScale?: number;
  imagePosition?: string;
};

export type CartItem = { product: Product; quantity: number };

export const CATEGORY_LIST = ['Tiles', 'Real Estate', 'Furniture', 'Industrial', 'Cars & Bikes'] as const;
export type Category = typeof CATEGORY_LIST[number];
