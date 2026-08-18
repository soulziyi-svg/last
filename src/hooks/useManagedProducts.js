import { useCallback, useEffect, useState } from 'react';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

const STORAGE_KEY = 'ibubom-managed-products-v1';
const EVENT_NAME = 'ibubom-products-changed';

export const readManagedProducts = (fallback) => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
};

const fromRow = (row) => ({ id: row.id, contentKey: row.content_key, category: row.category, name: row.name, thumbnail: row.thumbnail, images: row.images || [], history: row.history, description: row.description, shortDesc: row.short_desc, composition: row.composition, sizes: row.sizes || ['S', 'M', 'L'], rentalPeriod: row.rental_period, price: row.price, rating: Number(row.rating), reviewCount: row.review_count, hot: row.hot, deleted: row.deleted });
const toRow = (product) => ({ id: product.id, content_key: product.contentKey, category: product.category, name: product.name, thumbnail: product.thumbnail || '', images: product.images || [], history: product.history || '', description: product.description || '', short_desc: product.shortDesc || '', composition: product.composition || '', sizes: product.sizes || ['S', 'M', 'L'], rental_period: product.rentalPeriod || '2박 3일', price: Number(product.price) || 0, rating: Number(product.rating) || 5, review_count: Number(product.reviewCount) || 0, hot: Boolean(product.hot), deleted: Boolean(product.deleted), updated_at: new Date().toISOString() });

export const saveManagedProducts = async (products, changedProduct) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
  if (hasSupabaseConfig && changedProduct) {
    const { error } = await supabase.from('products').upsert(toRow(changedProduct));
    if (error) throw error;
  }
};

export const deleteManagedProduct = async (product) => {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from('products').upsert(toRow({ ...product, deleted: true }));
  if (error) throw error;
};

export const resetManagedProducts = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export default function useManagedProducts(fallbackProducts, contentKey) {
  const select = useCallback(() => readManagedProducts(fallbackProducts).filter((product) => !contentKey || product.contentKey === contentKey), [fallbackProducts, contentKey]);
  const [products, setProducts] = useState(select);

  useEffect(() => {
    const update = () => setProducts(select());
    if (hasSupabaseConfig) {
      supabase.from('products').select('*').order('id').then(({ data }) => {
        if (data?.length) {
          const remote = data.map(fromRow);
          const remoteIds = new Set(remote.map((product) => product.id));
          const merged = [...remote, ...fallbackProducts.filter((product) => !remoteIds.has(product.id))];
          setProducts(merged.filter((product) => !product.deleted && (!contentKey || product.contentKey === contentKey)));
        }
      });
    }
    window.addEventListener(EVENT_NAME, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(EVENT_NAME, update);
      window.removeEventListener('storage', update);
    };
  }, [select, fallbackProducts, contentKey]);

  return products;
}
