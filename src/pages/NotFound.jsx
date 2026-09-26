import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
export default function NotFound(){return <PageTransition><section className="not-found"><div className="not-found-orbit"><Sparkles/></div><span className="eyebrow">404 · LOST BETWEEN UNIVERSES</span><h1>This portal doesn’t exist.</h1><p>The page may have moved, or you found a timeline our curators have not indexed yet.</p><div className="hero-actions"><Link className="button primary" to="/"><ArrowLeft size={17}/>Back home</Link><Link className="button ghost" to="/explore">Explore fandoms</Link></div></section></PageTransition>}
