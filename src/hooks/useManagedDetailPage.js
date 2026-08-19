import { useEffect, useState } from 'react';
import { nezukoDetailDefaults } from '../data/nezukoDetailDefaults';

const KEY = 'ibubom-nezuko-detail-v1';
const EVENT = 'ibubom-detail-changed';
export const readDetailPage = () => { try { return { ...nezukoDetailDefaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return nezukoDetailDefaults; } };
export const saveDetailPage = (value) => { localStorage.setItem(KEY, JSON.stringify(value)); window.dispatchEvent(new Event(EVENT)); };
export const resetDetailPage = () => { localStorage.removeItem(KEY); window.dispatchEvent(new Event(EVENT)); };
export default function useManagedDetailPage() {
  const [value, setValue] = useState(readDetailPage);
  useEffect(() => { const update = () => setValue(readDetailPage()); window.addEventListener(EVENT, update); window.addEventListener('storage', update); return () => { window.removeEventListener(EVENT, update); window.removeEventListener('storage', update); }; }, []);
  return value;
}
