import initialProductsData from './initial-products.json';
import type { Product } from './product-types';

const STORAGE_KEY = 'foundry_marketplace_products';

export const INITIAL_PRODUCTS: Product[] = initialProductsData as Product[];

export function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') {
    return INITIAL_PRODUCTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  } catch (e) {
    console.error('Error reading local products:', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveLocalProduct(data: Omit<Product, 'id'> & { id?: string }): Product {
  const current = getLocalProducts();
  const id = data.id || 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const newProduct: Product = {
    id,
    title: data.title,
    type: data.type,
    category: data.category,
    price: Number(data.price),
    image: data.image,
    description: data.description,
    badge: data.badge || null,
    free: Boolean(data.free),
    liveUrl: data.liveUrl ? data.liveUrl.trim() : null,
    imageFit: data.imageFit || 'cover',
    imageScale: typeof data.imageScale === 'number' ? data.imageScale : 100,
    imagePosition: data.imagePosition || 'center',
  };

  let updated: Product[];
  if (data.id && current.some((p) => p.id === data.id)) {
    updated = current.map((p) => (p.id === data.id ? newProduct : p));
  } else {
    updated = [newProduct, ...current];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('products_updated'));
  }

  return newProduct;
}

export function deleteLocalProduct(id: string): void {
  const current = getLocalProducts();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('products_updated'));
  }
}

export function resetLocalProducts(): Product[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    window.dispatchEvent(new Event('products_updated'));
  }
  return INITIAL_PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  const products = getLocalProducts();
  return products.find((p) => p.id === id);
}

