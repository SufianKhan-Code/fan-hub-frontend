import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';

const sameDay=(a,b)=>a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
export default function Calendar(){
 const [events,setEvents]=useState([]);const [cursor,setCursor]=useState(new Date());const [city,setCity]=useState('');
 useEffect(()=>{api.get('/events',{params:{limit:100}}).then(({data})=>setEvents(data.data||[])).catch(()=>{});},[]);
 const cities=[...new Set(events.map(x=>x.city))].sort();
 const filtered=city?events.filter(x=>x.city===city):events;
 const days=useMemo(()=>{const y=cursor.getFullYear(),m=cursor.getMonth(),first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d;});},[cursor]);
 const move=(n)=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+n,1));
 return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'Events',to:'/events'},{label:'Calendar'}]}/><span className="eyebrow"><CalendarDays size={14}/> EVENT CALENDAR</span><h1>Plan the next fandom moment.</h1><p>Browse upcoming conventions, meetups, screenings and premieres by date and city.</p></div></div><section className="section container"><div className="calendar-toolbar"><button className="icon-button" onClick={()=>move(-1)}><ChevronLeft/></button><h2>{cursor.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</h2><button className="icon-button" onClick={()=>move(1)}><ChevronRight/></button><select value={city} onChange={(e)=>setCity(e.target.value)}><option value="">All cities</option>{cities.map(c=><option key={c}>{c}</option>)}</select></div><div className="calendar-grid calendar-weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d}>{d}</div>)}</div><div className="calendar-grid">{days.map((d,i)=>{const dayEvents=filtered.filter(x=>sameDay(new Date(x.startDate),d));const muted=d.getMonth()!==cursor.getMonth();return <div className={`calendar-day ${muted?'muted':''}`} key={i}><span className="calendar-number">{d.getDate()}</span>{dayEvents.slice(0,3).map(e=><Link key={e._id} to={`/events/${e._id}`} className="calendar-event"><strong>{e.title}</strong><span><MapPin size={11}/>{e.city}</span></Link>)}{dayEvents.length>3&&<small>+{dayEvents.length-3} more</small>}</div>})}</div></section></PageTransition>;
}
