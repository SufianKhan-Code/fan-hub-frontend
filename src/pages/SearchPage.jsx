import { Search as SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';

const sources = [
  ['Content','/content','title','thumbnailUrl',(x)=>`/content/${x._id}`],
  ['Characters','/characters','name','imageUrl',(x)=>`/characters/${x._id}`],
  ['Articles','/articles','title','coverImage',(x)=>`/articles/${x._id}`],
  ['Media','/media','title','thumbnailUrl',()=>'/media'],
  ['Merchandise','/merchandise','name','imageUrl',(x)=>`/merchandise/${x._id}`],
  ['Events','/events','title','bannerImage',(x)=>`/events/${x._id}`]
];

export default function SearchPage(){
  const [params,setParams]=useSearchParams(); const [q,setQ]=useState(params.get('q')||''); const [results,setResults]=useState([]); const [loading,setLoading]=useState(false);
  const search=params.get('q')||'';
  useEffect(()=>{ if(!search){setResults([]);return;} setLoading(true); Promise.allSettled(sources.map(([,url])=>api.get(url,{params:{search,limit:6}}))).then((responses)=>setResults(responses.map((r,i)=>({source:sources[i],items:r.status==='fulfilled'?(r.value.data.data||[]):[]})))).finally(()=>setLoading(false));},[search]);
  const submit=(e)=>{e.preventDefault(); if(q.trim()) setParams({q:q.trim()});};
  const total=results.reduce((s,r)=>s+r.items.length,0);
  return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'Search'}]}/><span className="eyebrow">GLOBAL SEARCH</span><h1>Search the entire universe.</h1><form className="search-page-form" onSubmit={submit}><SearchIcon/><input autoFocus value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Try ‘anime’, ‘cosplay’, ‘gaming’…"/><button className="button primary">Search</button></form></div></div><section className="section container">{loading?<div className="search-loading">Searching across stories, characters, media and events…</div>:search && total===0?<EmptyState title={`No results for “${search}”`}/>:<>{search&&<p className="search-count">Showing <strong>{total}</strong> matches for “{search}”</p>}{results.filter(r=>r.items.length).map(({source,items})=>{const [label,,titleKey,imageKey,linkFor]=source; return <div className="search-group" key={label}><div className="section-heading mini"><h2>{label}</h2></div><div className="search-result-grid">{items.map((x)=><Link key={x._id} to={linkFor(x)} className="search-result"><img src={x[imageKey] || x.bannerUrl} alt=""/><div><span>{x.fandom || x.category?.name || label}</span><h3>{x[titleKey]}</h3><p>{x.description || x.summary || x.bio}</p></div></Link>)}</div></div>})}</>}</section></PageTransition>;
}
