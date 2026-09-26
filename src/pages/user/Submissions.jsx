import { FileCheck2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageTransition from '../../components/common/PageTransition';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EmptyState from '../../components/common/EmptyState';
export default function Submissions(){const[items,setItems]=useState([]);useEffect(()=>{api.get('/submissions/my').then(({data})=>setItems(data.data||[]));},[]);return <PageTransition><div className="page-hero compact"><div className="container"><Breadcrumbs items={[{label:'My submissions'}]}/><span className="eyebrow">COMMUNITY CONTRIBUTIONS</span><h1>Track your fan submissions.</h1><p>Content remains private until a curator approves it.</p><Link className="button primary" to="/submit-content"><Plus size={16}/>New submission</Link></div></div><section className="section container">{items.length?<div className="submission-list">{items.map(x=><article key={x._id}><span className="submission-icon"><FileCheck2/></span><div><span className="eyebrow">{x.submissionType?.replace('_',' ')} · {x.fandom}</span><h3>{x.title}</h3><p>{x.summary}</p>{x.adminFeedback&&<blockquote>Curator note: {x.adminFeedback}</blockquote>}</div><span className={`status-badge ${x.status}`}>{x.status}</span></article>)}</div>:<EmptyState title="No submissions yet" text="Share an article, cosplay photo, fan art, review or guide with the community."/>}</section></PageTransition>}
