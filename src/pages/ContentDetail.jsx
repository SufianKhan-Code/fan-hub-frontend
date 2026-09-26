import { Eye, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { BookmarkButton, RatingControl, ShareButton } from '../components/common/Actions';
import { ContentCard } from '../components/cards/Cards';
import { Spinner } from '../components/common/Loading';

export default function ContentDetail(){
  const {id}=useParams(); const [item,setItem]=useState(null); const [related,setRelated]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api.get(`/content/${id}`).then(({data})=>{setItem(data.data);setRelated(data.related||[])}).finally(()=>setLoading(false));},[id]);
  if(loading) return <div className="page-loader"><Spinner/></div>; if(!item) return <section className="section container"><h1>Content not found</h1></section>;
  return <PageTransition><section className="detail-hero"><img src={item.bannerUrl || item.thumbnailUrl} alt=""/><div className="detail-shade"/><div className="container detail-hero-copy"><Breadcrumbs items={[{label:'Explore',to:'/explore'},{label:item.category?.name,to:`/category/${item.category?.slug}`},{label:item.title}]}/><div className="detail-pills"><span>{item.type}</span><span>{item.fandom}</span><span>{item.releaseYear}</span></div><h1>{item.title}</h1><p>{item.description}</p><div className="detail-actions"><BookmarkButton targetType="content" item={item}/><ShareButton title={item.title}/><span><Eye size={17}/>{item.viewCount} views</span></div></div></section><section className="section container detail-layout"><article className="prose-card"><h2>About this story</h2><p>{item.fullContent || item.description}</p>{item.genre?.length>0&&<div className="tag-row">{item.genre.map(g=><span key={g}><Tag size={13}/>{g}</span>)}</div>}</article><aside className="detail-aside"><div className="panel"><h3>Fan rating</h3><RatingControl targetType="content" targetId={item._id} initialAverage={item.ratingAverage} initialCount={item.ratingCount}/></div><div className="panel"><h3>Quick facts</h3><dl><div><dt>Fandom</dt><dd>{item.fandom}</dd></div><div><dt>Category</dt><dd>{item.category?.name}</dd></div><div><dt>Popularity</dt><dd>{item.popularityScore}/100</dd></div><div><dt>Released</dt><dd>{new Date(item.releaseDate).toLocaleDateString()}</dd></div></dl></div></aside></section>{related.length>0&&<section className="section container"><div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Related discoveries</h2></div></div><div className="card-grid four">{related.map(x=><ContentCard key={x._id} item={x}/>)}</div></section>}</PageTransition>;
}
