import { useEffect, useRef, useState } from 'react';
import { nezukoDetailDefaults } from '../data/nezukoDetailDefaults';

const KEY = 'ibubom-detail-pages-v2';
const LEGACY_KEY = 'ibubom-nezuko-detail-v1';
const EVENT = 'ibubom-detail-changed';
const readAll = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
export const readDetailPage = (productId='cosplay-38', fallback=nezukoDetailDefaults) => {
  const saved = readAll()[productId] || (productId === 'cosplay-38' ? (()=>{ try{return JSON.parse(localStorage.getItem(LEGACY_KEY)||'null');}catch{return null;} })() : null);
  const merged = { ...fallback, ...(saved || {}), images:{...fallback.images,...(saved?.images||{})}, rental:{...fallback.rental,...(saved?.rental||{})} };
  if (productId === 'cosplay-38') {
    if (!merged.images.thumbnail || merged.images.thumbnail === merged.images.main || merged.images.thumbnail.includes('cosplay-38-product')) merged.images.thumbnail = nezukoDetailDefaults.images.thumbnail;
    if (!merged.images.accessories || merged.images.accessories.includes('nezuko-accessories')) merged.images.accessories = nezukoDetailDefaults.images.accessories;
    merged.images.video ||= nezukoDetailDefaults.images.video;
    merged.images.videoPoster ||= nezukoDetailDefaults.images.videoPoster;
  }
  return merged;
};
export const saveDetailPage = (productId, value) => {
  const id = typeof productId === 'string' ? productId : 'cosplay-38';
  const data = typeof productId === 'string' ? value : productId;
  localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [id]:data }));
  window.dispatchEvent(new Event(EVENT));
};
export const resetDetailPage = (productId='cosplay-38') => { const all=readAll(); delete all[productId]; localStorage.setItem(KEY,JSON.stringify(all)); window.dispatchEvent(new Event(EVENT)); };
export default function useManagedDetailPage(productId='cosplay-38', fallback=nezukoDetailDefaults) {
  const fallbackRef=useRef(fallback);
  fallbackRef.current=fallback;
  const [value,setValue]=useState(()=>readDetailPage(productId,fallback));
  useEffect(()=>{ const update=()=>setValue(readDetailPage(productId,fallbackRef.current)); update(); window.addEventListener(EVENT,update); window.addEventListener('storage',update); return()=>{window.removeEventListener(EVENT,update);window.removeEventListener('storage',update);}; },[productId]);
  return value;
}
