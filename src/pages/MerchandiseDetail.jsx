import { ExternalLink, Eye, ShieldCheck, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { BookmarkButton, ShareButton } from '../components/common/Actions';
import { MerchCard } from '../components/cards/Cards';
import { Spinner } from '../components/common/Loading';
export default function MerchandiseDetail(){
 const {id}=useParams();const [item,setItem]=useState(null);const [related,setRelated]=useState([]);const [loading,setLoading]=useState(true);
 useEffect(()=>{api.get(`/merchandise/${id}`).then(({data})=>{setItem(data.data);setRelated(data.related||[])}).finally(()=>setLoading(false));},[id]);
 if(loading)return <div className="page-loader"><Spinner/></div>;if(!item)return <section className="section container"><h1>Merchandise not found</h1></section>;
 return <PageTransition><section className="section container"><Breadcrumbs items={[{label:'Merchandise',to:'/merchandise'},{label:item.name}]}/><div className="product-detail"><div className="product-gallery"><img className="product-main-image" src={item.imageUrl} alt={item.name}/>{item.galleryImages?.length>0&&<div className="product-thumbs">{item.galleryImages.map((g,i)=><img src={g} alt="" key={i}/>)}</div>}</div><div className="product-copy"><span className="eyebrow">{item.fandom}</span><h1>{item.name}</h1><span className="merch-tag inline"><Tag size={14}/>{item.tag}</span><p>{item.description}</p><dl className="product-facts"><div><dt>Release</dt><dd>{item.releaseDate}</dd></div><div><dt>Manufacturer</dt><dd>{item.manufacturer}</dd></div><div><dt>Edition</dt><dd>{item.scaleOrSize}</dd></div><div><dt>Popularity</dt><dd>{item.popularityScore}/100</dd></div><div><dt>Views</dt><dd><Eye size={15}/>{item.viewCount}</dd></div></dl><div className="notice-card"><ShieldCheck/><div><strong>Showcase & discovery only</strong><p>Fan Hub Plus does not sell merchandise or process payments. External links lead to third-party official/representative sources.</p></div></div><div className="hero-actions"><a className="button primary" href={item.officialStoreUrl} target="_blank" rel="noreferrer">Official source <ExternalLink size={16}/></a><BookmarkButton targetType="merchandise" item={item}/><ShareButton title={item.name}/></div></div></div></section>{related.length>0&&<section className="section soft-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">RELATED COLLECTIBLES</span><h2>More from this universe</h2></div><Link className="text-link" to="/merchandise">View showcase</Link></div><div className="card-grid four">{related.map(x=><MerchCard key={x._id} item={x}/>)}</div></div></section>}</PageTransition>;
}
