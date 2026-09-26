import { CalendarDays, ExternalLink, MapPin, Navigation2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { BookmarkButton, ShareButton } from '../components/common/Actions';
import { EventCard } from '../components/cards/Cards';
import { Spinner } from '../components/common/Loading';
export default function EventDetail(){
 const {id}=useParams();const [item,setItem]=useState(null);const [related,setRelated]=useState([]);const [loading,setLoading]=useState(true);
 useEffect(()=>{api.get(`/events/${id}`).then(({data})=>{setItem(data.data);setRelated(data.nearbyOrUpcoming||[])}).finally(()=>setLoading(false));},[id]);
 if(loading)return <div className="page-loader"><Spinner/></div>;if(!item)return <section className="section container"><h1>Event not found</h1></section>;
 const pos=[item.coordinates?.lat||34.0522,item.coordinates?.lng||-118.2437];
 return <PageTransition><section className="event-detail-hero"><img src={item.bannerImage} alt=""/><div className="detail-shade"/><div className="container detail-hero-copy"><Breadcrumbs items={[{label:'Events',to:'/events'},{label:item.title}]}/><span className="eyebrow">{item.type} · {item.fandom}</span><h1>{item.title}</h1><p>{item.description}</p><div className="event-detail-meta"><span><CalendarDays/>{new Date(item.startDate).toLocaleString()}</span><span><MapPin/>{item.venue}, {item.city}</span><span><Users/>{item.attendeesCount?.toLocaleString()} interested</span></div><div className="detail-actions"><a className="button primary" href={item.ticketLink} target="_blank" rel="noreferrer">Ticket link <ExternalLink size={16}/></a><BookmarkButton targetType="event" item={item}/><ShareButton title={item.title}/></div></div></section><section className="section container detail-layout"><article className="prose-card"><h2>Event details</h2><p>{item.description}</p><h3>Venue</h3><p>{item.venue}<br/>{item.address}<br/>{item.city}, {item.country}</p><div className="event-map"><MapContainer center={pos} zoom={13} scrollWheelZoom={false}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Marker position={pos}><Popup>{item.title}<br/>{item.venue}</Popup></Marker></MapContainer></div></article><aside className="detail-aside"><div className="panel"><h3><Navigation2 size={18}/> Schedule</h3><dl><div><dt>Starts</dt><dd>{new Date(item.startDate).toLocaleString()}</dd></div><div><dt>Ends</dt><dd>{new Date(item.endDate).toLocaleString()}</dd></div><div><dt>City</dt><dd>{item.city}</dd></div><div><dt>Category</dt><dd>{item.category?.name}</dd></div></dl></div></aside></section>{related.length>0&&<section className="section soft-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">DISCOVER MORE</span><h2>Other upcoming events</h2></div><Link className="text-link" to="/events">All events</Link></div><div className="card-grid three">{related.map(x=><EventCard key={x._id} item={x}/>)}</div></div></section>}</PageTransition>;
}
