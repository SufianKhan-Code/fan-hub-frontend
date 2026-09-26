import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { CharacterCard } from '../components/cards/Cards';
import { SkeletonGrid } from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

export default function Characters(){
  const [params,setParams]=useSearchParams(); const [items,setItems]=useState([]); const [cats,setCats]=useState([]); const [loading,setLoading]=useState(true); const [meta,setMeta]=useState({page:1,pages:1,total:0});
  useEffect(()=>{api.get('/categories').then(({data})=>setCats(data.data||[])).catch(()=>{});},[]);
  useEffect(()=>{setLoading(true);api.get('/characters',{params:{...Object.fromEntries(params.entries()),limit:12}}).then(({data})=>{setItems(data.data||[]);setMeta({page:data.page||1,pages:data.pages||1,total:data.total||0})}).finally(()=>setLoading(false));},[params]);
  const update=(k,v)=>{const n=new URLSearchParams(params);v?n.set(k,v):n.delete(k);if(k!=='page')n.set('page','1');setParams(n)};
  return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'Characters'}]}/><span className="eyebrow">CHARACTER PROFILES</span><h1>Meet the icons behind the fandoms.</h1><p>Explore card-based character dossiers, backstories, abilities and appearances across every universe.</p></div></div><section className="section container"><div className="inline-filters"><label className="search-field"><Search size={17}/><input placeholder="Search characters…" value={params.get('search')||''} onChange={(e)=>update('search',e.target.value)}/></label><select value={params.get('category')||''} onChange={(e)=>update('category',e.target.value)}><option value="">All fandoms</option>{cats.map(c=><option key={c._id} value={c.slug}>{c.name}</option>)}</select><label className="check-filter"><input type="checkbox" checked={params.get('isFeatured')==='true'} onChange={(e)=>update('isFeatured',e.target.checked?'true':'')}/> Featured only</label></div>{loading?<SkeletonGrid/>:items.length?<div className="character-grid">{items.map(x=><CharacterCard key={x._id} item={x}/>)}</div>:<EmptyState/>}<Pagination page={meta.page} pages={meta.pages} onChange={(p)=>update('page',String(p))}/></section></PageTransition>;
}
