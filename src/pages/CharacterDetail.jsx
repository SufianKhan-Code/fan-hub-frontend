import { Quote, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { BookmarkButton, ShareButton } from '../components/common/Actions';
import { ContentCard } from '../components/cards/Cards';
import { Spinner } from '../components/common/Loading';

export default function CharacterDetail(){
  const {id}=useParams(); const [item,setItem]=useState(null); const [related,setRelated]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{api.get(`/characters/${id}`).then(({data})=>{setItem(data.data);setRelated(data.relatedContent||[])}).finally(()=>setLoading(false));},[id]);
  if(loading)return <div className="page-loader"><Spinner/></div>; if(!item)return <section className="section container"><h1>Character not found</h1></section>;
  return <PageTransition><section className="character-detail-hero"><div className="character-detail-bg" style={{backgroundImage:`url(${item.bannerUrl||item.imageUrl})`}}/><div className="container character-detail-layout"><div className="character-portrait"><img src={item.imageUrl} alt={item.name}/></div><div className="character-detail-copy"><Breadcrumbs items={[{label:'Characters',to:'/characters'},{label:item.name}]}/><span className="eyebrow">{item.fandom} · {item.role}</span><h1>{item.name}</h1>{item.japaneseName&&<h2>{item.japaneseName}</h2>}<p>{item.bio}</p><div className="detail-actions"><BookmarkButton targetType="character" item={item}/><ShareButton title={item.name}/><span className="popularity-score"><Sparkles size={16}/>{item.popularityScore}/100 popularity</span></div></div></div></section><section className="section container detail-layout"><article className="prose-card"><h2>Backstory</h2><p>{item.backstory||item.bio}</p>{item.abilities?.length>0&&<><h3>Abilities</h3><div className="tag-row">{item.abilities.map(a=><span key={a}>{a}</span>)}</div></>}{item.quotes?.length>0&&<div className="quote-card"><Quote/><p>“{item.quotes[0]}”</p></div>}</article><aside className="detail-aside"><div className="panel"><h3>Dossier</h3><dl><div><dt>Fandom</dt><dd>{item.fandom}</dd></div><div><dt>Role</dt><dd>{item.role}</dd></div><div><dt>Voice actor</dt><dd>{item.voiceActor||'—'}</dd></div><div><dt>Category</dt><dd>{item.category?.name}</dd></div></dl></div></aside></section>{related.length>0&&<section className="section container"><div className="section-heading"><div><span className="eyebrow">RELATED</span><h2>From the same fandom</h2></div><Link className="text-link" to={`/search?q=${encodeURIComponent(item.fandom)}`}>See more</Link></div><div className="card-grid four">{related.map(x=><ContentCard key={x._id} item={x}/>)}</div></section>}</PageTransition>;
}
