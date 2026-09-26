import { BarChart3, BookOpen, Bot, Boxes, CalendarDays, Film, Gauge, Home, Images, LayoutDashboard, MessageSquare, PackageSearch, Sparkles, Tags, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

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

export default function AdminLayout(){
 const[open,setOpen]=useState(false);
 return <div className="admin-shell reference-admin-shell">
   <button className="admin-menu-toggle" onClick={()=>setOpen(true)}>Admin menu</button>
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
