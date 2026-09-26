import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SectionHeader from '../components/common/SectionHeader';
import { ArticleCard, CharacterCard, ContentCard, EventCard, MediaCard, MerchCard, ReleaseCard } from '../components/cards/Cards';
import { SkeletonGrid } from '../components/common/Loading';

export default function CategoryPage(){
  const {slug}=useParams(); const [bundle,setBundle]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api.get(`/categories/${slug}`).then(({data})=>setBundle(data.data)).catch(()=>setBundle(null)).finally(()=>setLoading(false));},[slug]);
  if(loading) return <div className="section container"><SkeletonGrid/></div>;
  if(!bundle) return <PageTransition><section className="section container"><h1>Category not found</h1><Link className="button primary" to="/explore">Explore all fandoms</Link></section></PageTransition>;
  const {category,trendingContent,latestContent,characters,mediaItems,articles,upcomingReleases,events,merchandise}=bundle;
  const section=(title,subtitle,items,render,link)=>items?.length?<section className="section container"><SectionHeader title={title} subtitle={subtitle} link={link}/><div className="card-grid three">{items.map(render)}</div></section>:null;
  return <PageTransition><section className="category-hero" style={{'--accent':category.color}}><img src={category.bannerImage} alt=""/><div className="category-hero-shade"/><div className="container category-hero-copy"><Breadcrumbs items={[{label:'Fandoms',to:'/explore'},{label:category.name}]}/><span className="eyebrow"><Sparkles size={14}/> {category.name.toUpperCase()} UNIVERSE</span><h1>{category.name}</h1><h2>{category.tagline}</h2><p>{category.description}</p><div className="hero-actions"><Link className="button primary" to={`/explore?category=${category.slug}`}>Browse all {category.name}<ArrowRight size={16}/></Link><Link className="button glass" to={`/search?q=${encodeURIComponent(category.name)}`}>Search universe</Link></div></div></section>{section('Trending now',`The most talked-about ${category.name} stories right now.`,trendingContent,(x)=><ContentCard key={x._id} item={x}/>,`/explore?category=${category.slug}&sort=most-popular`)}{section('Latest discoveries',`Fresh additions from the ${category.name} universe.`,latestContent,(x)=><ContentCard key={x._id} item={x}/>,`/explore?category=${category.slug}`)}{section('Character dossiers','Profiles, abilities, backstories and fandom lore.',characters,(x)=><CharacterCard key={x._id} item={x}/>,`/characters?category=${category.slug}`)}{section('Multimedia','Trailers, audio, galleries and explainers.',mediaItems,(x)=><MediaCard key={x._id} item={x}/>,`/media?category=${category.slug}`)}{section('Featured stories','Deep reads from the editorial desk.',articles,(x)=><ArticleCard key={x._id} item={x}/>,`/articles?category=${category.slug}`)}{section('Upcoming releases','Dates worth adding to your calendar.',upcomingReleases,(x)=><ReleaseCard key={x._id} item={x}/>,`/releases?category=${category.slug}`)}{section('Events','Meet the community in real life.',events,(x)=><EventCard key={x._id} item={x}/>,`/events?category=${category.slug}`)}{section('Collector showcase','Display and discovery only — no checkout.',merchandise,(x)=><MerchCard key={x._id} item={x}/>,`/merchandise?category=${category.slug}`)}</PageTransition>;
}
