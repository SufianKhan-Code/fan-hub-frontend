import { CalendarClock, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { ReleaseCard } from '../components/cards/Cards';
import EmptyState from '../components/common/EmptyState';
export default function Releases(){
 const [params,setParams]=useSearchParams();const [items,setItems]=useState([]);const [cats,setCats]=useState([]);const [loading,setLoading]=useState(true);
 useEffect(()=>{api.get('/categories').then(({data})=>setCats(data.data||[])).catch(()=>{});},[]);
 useEffect(()=>{setLoading(true);api.get('/releases',{params:Object.fromEntries(params.entries())}).then(({data})=>setItems(data.data||[])).finally(()=>setLoading(false));},[params]);
 const update=(k,v)=>{const n=new URLSearchParams(params);v?n.set(k,v):n.delete(k);setParams(n)};
 const grouped=items.reduce((acc,x)=>{const d=new Date(x.releaseDate);const key=d.toLocaleDateString(undefined,{month:'long',year:'numeric'});(acc[key]??=[]).push(x);return acc;},{});
 return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'Upcoming Releases'}]}/><span className="eyebrow"><CalendarClock size={14}/> RELEASE CALENDAR</span><h1>What’s next in every universe.</h1><p>Track anticipated anime, games, movies, TV shows, comics, manga and merchandise drops.</p></div></div><section className="section container"><div className="inline-filters"><label className="search-field"><Search size={17}/><input placeholder="Search releases…" value={params.get('search')||''} onChange={(e)=>update('search',e.target.value)}/></label><select value={params.get('category')||''} onChange={(e)=>update('category',e.target.value)}><option value="">All fandoms</option>{cats.map(c=><option key={c._id} value={c.slug}>{c.name}</option>)}</select><select value={params.get('releaseType')||''} onChange={(e)=>update('releaseType',e.target.value)}><option value="">All release types</option>{['Anime','Game','Movie','TV Show','Comic','Manga','Merchandise Drop'].map(v=><option key={v}>{v}</option>)}</select></div>{loading?<div className="search-loading">Loading release timeline…</div>:!items.length?<EmptyState/>:<div className="release-timeline">{Object.entries(grouped).map(([month,list])=><section key={month}><div className="timeline-month"><span/><h2>{month}</h2></div><div className="card-grid three">{list.map(x=><ReleaseCard key={x._id} item={x}/>)}</div></section>)}</div>}</section></PageTransition>;
}
