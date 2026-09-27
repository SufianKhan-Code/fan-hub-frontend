import { BarChart3, BookOpen, Bot, Boxes, CalendarDays, Film, Gauge, Home, Images, LayoutDashboard, MessageSquare, PackageSearch, Sparkles, Tags, Users, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const links = [
  ['/admin', 'Dashboard', LayoutDashboard, true],
  ['/admin/categories', 'Categories', Tags],
  ['/admin/content', 'Content', Boxes],
  ['/admin/media', 'Media', Film],
  ['/admin/characters', 'Characters', Users],
  ['/admin/articles', 'Articles', BookOpen],
  ['/admin/merchandise', 'Merchandise', PackageSearch],
  ['/admin/releases', 'Releases', Sparkles],
  ['/admin/events', 'Events', CalendarDays],
  ['/admin/users', 'Users', Users],
  ['/admin/submissions', 'Submissions', Images],
  ['/admin/feedback', 'Feedback', MessageSquare],
  ['/admin/chatbot', 'Chatbot KB', Bot],
  ['/admin/analytics', 'Analytics', BarChart3]
];

function resetAdminScroll() {
  const html = document.documentElement;
  const body = document.body;
  const oldHtmlBehavior = html.style.scrollBehavior;
  const oldBodyBehavior = body.style.scrollBehavior;

  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  const reset = () => {
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    body.scrollTop = 0;
    document.querySelectorAll('.admin-content, .reference-admin-shell').forEach((el) => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    });
  };

  reset();
  const frame = requestAnimationFrame(reset);
  const timer = setTimeout(reset, 80);
  const restore = setTimeout(() => {
    html.style.scrollBehavior = oldHtmlBehavior;
    body.style.scrollBehavior = oldBodyBehavior;
  }, 160);

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    clearTimeout(restore);
    html.style.scrollBehavior = oldHtmlBehavior;
    body.style.scrollBehavior = oldBodyBehavior;
  };
}

export default function AdminLayout(){
 const[open,setOpen]=useState(false);
 const location=useLocation();

 useLayoutEffect(()=>{
   if('scrollRestoration' in window.history) window.history.scrollRestoration='manual';
   return resetAdminScroll();
 },[location.pathname,location.search,location.key]);

 useEffect(()=>{
   if(!open) return undefined;
   const previousOverflow=document.body.style.overflow;
   document.body.style.overflow='hidden';
   const onKeyDown=(event)=>{ if(event.key==='Escape') setOpen(false); };
   window.addEventListener('keydown',onKeyDown);
   return ()=>{
     document.body.style.overflow=previousOverflow;
     window.removeEventListener('keydown',onKeyDown);
   };
 },[open]);

 useEffect(()=>{
   const onResize=()=>{ if(window.innerWidth>860) setOpen(false); };
   window.addEventListener('resize',onResize);
   return ()=>window.removeEventListener('resize',onResize);
 },[]);

 return <div className="admin-shell reference-admin-shell">
   <button className="admin-menu-toggle" onClick={()=>setOpen(true)} aria-expanded={open}>Admin menu</button>
   <aside className={`admin-sidebar ${open?'open':''}`}>
     <div className="admin-sidebar-head">
       <div><span className="admin-brand-mark"><Gauge size={19}/></span><span><strong>Fan Hub Plus</strong><small>Curator Console</small></span></div>
       <button onClick={()=>setOpen(false)}><X/></button>
     </div>
     <Link className="admin-back-home" to="/"><Home size={16}/> Back to Fan Hub</Link>
     <nav>{links.map(([to,label,Icon,end])=><NavLink end={end} key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}><Icon size={17}/><span>{label}</span></NavLink>)}</nav>
     <div className="admin-sidebar-note"><Sparkles size={16}/><div><strong>Fandom Universe</strong><small>Manage content, users and community safely.</small></div></div>
   </aside>
   {open&&<div className="admin-overlay" onClick={()=>setOpen(false)}/>}<div className="admin-content"><Outlet/></div>
 </div>;
}
