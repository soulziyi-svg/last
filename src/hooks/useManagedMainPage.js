import { useEffect, useState } from 'react';
import { mainPageDefaults } from '../data/mainPageDefaults';

const KEY='ibubom-main-page-v1';
const EVENT='ibubom-main-page-changed';
export const readMainPage=()=>{try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');return {...mainPageDefaults,...saved,hero:{...mainPageDefaults.hero,...saved.hero},timeline:{...mainPageDefaults.timeline,...saved.timeline},sections:Object.fromEntries(Object.entries(mainPageDefaults.sections).map(([key,value])=>[key,{...value,...saved.sections?.[key]}]))};}catch{return mainPageDefaults;}};
export const saveMainPage=(value)=>{localStorage.setItem(KEY,JSON.stringify(value));window.dispatchEvent(new Event(EVENT));};
export const resetMainPage=()=>{localStorage.removeItem(KEY);window.dispatchEvent(new Event(EVENT));};
export default function useManagedMainPage(){const [value,setValue]=useState(readMainPage);useEffect(()=>{const update=()=>setValue(readMainPage());window.addEventListener(EVENT,update);window.addEventListener('storage',update);return()=>{window.removeEventListener(EVENT,update);window.removeEventListener('storage',update);};},[]);return value;}
