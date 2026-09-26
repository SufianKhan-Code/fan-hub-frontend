import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { ContentCard } from '../components/cards/Cards';
import { SkeletonGrid } from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({page:1,pages:1,total:0});
  const [mobileFilters, setMobileFilters] = useState(false);
  const query = useMemo(() => Object.fromEntries(params.entries()), [params]);

  useEffect(() => { api.get('/categories').then(({data})=>setCategories(data.data || [])).catch(()=>{}); }, []);
  useEffect(() => {
    setLoading(true);
    api.get('/content',{params:{...query,limit:12}}).then(({data})=>{setItems(data.data || []);setMeta({page:data.page||1,pages:data.pages||1,total:data.total||0});}).finally(()=>setLoading(false));
  }, [query]);

  const update = (key, value) => { const next = new URLSearchParams(params); if(value) next.set(key,value); else next.delete(key); if(key!=='page') next.set('page','1'); setParams(next); };
  const clear = () => setParams({});
  const filters = <div className="filters-card">
    <div className="filter-title"><strong><SlidersHorizontal size={17}/> Filters</strong><button onClick={clear}>Clear</button></div>
    <label>Search<input value={params.get('search')||''} onChange={(e)=>update('search',e.target.value)} placeholder="Title, fandom, tag…"/></label>
    <label>Category<select value={params.get('category')||''} onChange={(e)=>update('category',e.target.value)}><option value="">All fandoms</option>{categories.map(c=><option key={c._id} value={c.slug}>{c.name}</option>)}</select></label>
    <label>Content type<select value={params.get('type')||''} onChange={(e)=>update('type',e.target.value)}><option value="">All types</option><option>article</option><option>video</option><option>audio</option><option>image</option><option>profile</option></select></label>
    <label>Genre<input value={params.get('genre')||''} onChange={(e)=>update('genre',e.target.value)} placeholder="Action, drama…"/></label>
    <label>Release year<input type="number" min="1950" max="2100" value={params.get('releaseYear')||''} onChange={(e)=>update('releaseYear',e.target.value)} placeholder="2026"/></label>
    <label>Popularity<select value={params.get('minPopularity')||''} onChange={(e)=>update('minPopularity',e.target.value)}><option value="">Any popularity</option><option value="70">70+</option><option value="80">80+</option><option value="90">90+</option></select></label>
  </div>;

  return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'Explore'}]}/><span className="eyebrow">CONTENT EXPLORER</span><h1>Discover your next obsession.</h1><p>Search, filter and sort curated content across all eight fandom universes.</p></div></div><section className="section container explore-layout"><aside className="desktop-filters">{filters}</aside><div className="explore-main"><div className="results-toolbar"><div><strong>{meta.total}</strong> results</div><div className="toolbar-actions"><button className="button ghost mobile-filter-button" onClick={()=>setMobileFilters(true)}><Filter size={17}/> Filters</button><select value={params.get('sort')||'latest'} onChange={(e)=>update('sort',e.target.value)} aria-label="Sort results"><option value="latest">Latest</option><option value="most-popular">Most popular</option><option value="alphabetical">Alphabetical</option><option value="rating">Top rated</option></select></div></div>{loading ? <SkeletonGrid count={6}/> : items.length ? <div className="card-grid three">{items.map(x=><ContentCard key={x._id} item={x}/>)}</div> : <EmptyState title="No matches found"/>}<Pagination page={meta.page} pages={meta.pages} onChange={(p)=>update('page',String(p))}/></div></section>{mobileFilters && <div className="filter-drawer-backdrop" onClick={()=>setMobileFilters(false)}><aside className="filter-drawer" onClick={(e)=>e.stopPropagation()}><button className="drawer-close" onClick={()=>setMobileFilters(false)}><X/></button>{filters}</aside></div>}</PageTransition>;
}
