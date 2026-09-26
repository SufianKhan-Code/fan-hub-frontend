import { LocateFixed, MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { EventCard } from '../components/cards/Cards';
import { SkeletonGrid } from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

const km=(a,b,c,d)=>{const R=6371,toRad=(x)=>x*Math.PI/180;const dLat=toRad(c-a),dLon=toRad(d-b);const q=Math.sin(dLat/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));};
export default function Events(){
 const [params,setParams]=useSearchParams();const [items,setItems]=useState([]);const [cats,setCats]=useState([]);const [cities,setCities]=useState([]);const [loading,setLoading]=useState(true);const [meta,setMeta]=useState({page:1,pages:1,total:0});const [geo,setGeo]=useState(null);const [geoMsg,setGeoMsg]=useState('');
 useEffect(()=>{api.get('/categories').then(({data})=>setCats(data.data||[])).catch(()=>{});},[]);
 useEffect(()=>{setLoading(true);api.get('/events',{params:{...Object.fromEntries(params.entries()),limit:12}}).then(({data})=>{setItems(data.data||[]);setCities(data.cities||[]);setMeta({page:data.page||1,pages:data.pages||1,total:data.total||0})}).finally(()=>setLoading(false));},[params]);
 const update=(k,v)=>{const n=new URLSearchParams(params);v?n.set(k,v):n.delete(k);if(k!=='page')n.set('page','1');setParams(n)};
 const locate=()=>{if(!navigator.geolocation){setGeoMsg('Location is not supported in this browser.');return;}setGeoMsg('Locating…');navigator.geolocation.getCurrentPosition(p=>{setGeo({lat:p.coords.latitude,lng:p.coords.longitude});setGeoMsg('Sorted by distance from your location.');},()=>setGeoMsg('Location permission was not granted.'));};
 const shown=useMemo(()=>geo?[...items].sort((x,y)=>km(geo.lat,geo.lng,x.coordinates?.lat||0,x.coordinates?.lng||0)-km(geo.lat,geo.lng,y.coordinates?.lat||0,y.coordinates?.lng||0)):items,[items,geo]);
 return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'Events'}]}/><span className="eyebrow"><MapPin size={14}/> LOCATION-AWARE EVENT DISCOVERY</span><h1>Find your fandom in the real world.</h1><p>Conventions, cosplay meetups, screenings, premieres and tournaments with city filters, maps and ticket links.</p><button className="button primary" onClick={locate}><LocateFixed size={17}/> Use my location</button>{geoMsg&&<small className="geo-message">{geoMsg}</small>}</div></div><section className="section container"><div className="inline-filters"><label className="search-field"><Search size={17}/><input placeholder="Search events…" value={params.get('search')||''} onChange={(e)=>update('search',e.target.value)}/></label><select value={params.get('city')||''} onChange={(e)=>update('city',e.target.value)}><option value="">All cities</option>{cities.map(c=><option key={c}>{c}</option>)}</select><select value={params.get('category')||''} onChange={(e)=>update('category',e.target.value)}><option value="">All fandoms</option>{cats.map(c=><option key={c._id} value={c.slug}>{c.name}</option>)}</select><select value={params.get('type')||''} onChange={(e)=>update('type',e.target.value)}><option value="">All event types</option>{['Convention','Cosplay Meetup','Screening','Premiere','Release Event','Tournament'].map(v=><option key={v}>{v}</option>)}</select></div>{loading?<SkeletonGrid/>:shown.length?<div className="card-grid three">{shown.map(x=><EventCard key={x._id} item={x}/>)}</div>:<EmptyState/>}<Pagination page={meta.page} pages={meta.pages} onChange={(p)=>update('page',String(p))}/></section></PageTransition>;
}
