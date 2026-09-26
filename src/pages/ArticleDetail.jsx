import { CalendarDays, Clock3, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { BookmarkButton, ShareButton } from '../components/common/Actions';
import { ArticleCard } from '../components/cards/Cards';
import { Spinner } from '../components/common/Loading';
export default function ArticleDetail(){
 const {id}=useParams();const [item,setItem]=useState(null);const [related,setRelated]=useState([]);const [loading,setLoading]=useState(true);
 useEffect(()=>{api.get(`/articles/${id}`).then(({data})=>{setItem(data.data);setRelated(data.related||[])}).finally(()=>setLoading(false));},[id]);
 if(loading)return <div className="page-loader"><Spinner/></div>;if(!item)return <section className="section container"><h1>Article not found</h1></section>;
 return <PageTransition><article className="article-detail"><div className="container article-head"><Breadcrumbs items={[{label:'Articles',to:'/articles'},{label:item.title}]}/><span className="eyebrow">{item.category?.name||item.fandom}</span><h1>{item.title}</h1><p className="article-summary">{item.summary}</p><div className="article-byline"><img src={item.authorAvatar} alt=""/><div><strong>{item.authorName}</strong><span>{item.authorRole}</span></div><span><Clock3 size={15}/>{item.readTime}</span><span><CalendarDays size={15}/>{new Date(item.publishedAt).toLocaleDateString()}</span><span><Eye size={15}/>{item.viewCount}</span><BookmarkButton targetType="article" item={item}/><ShareButton title={item.title}/></div></div><div className="article-cover"><img src={item.coverImage} alt={item.title}/></div><div className="container article-body"><div className="prose-card article-prose">{String(item.content).split(/\n{2,}/).map((p,i)=><p key={i}>{p}</p>)}{item.eventTimelineHighlights?.length>0&&<div className="timeline"><h2>Timeline highlights</h2>{item.eventTimelineHighlights.map((t,i)=><div className="timeline-item" key={i}><span>{t.year}</span><div><h3>{t.title}</h3><p>{t.description}</p></div></div>)}</div>}</div></div></article>{related.length>0&&<section className="section container"><div className="section-heading"><div><span className="eyebrow">READ NEXT</span><h2>More from this universe</h2></div></div><div className="article-grid">{related.map(x=><ArticleCard key={x._id} item={x}/>)}</div></section>}</PageTransition>;
}
