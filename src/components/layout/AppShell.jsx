import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../chatbot/Chatbot';

export default function AppShell() {
  const location = useLocation();
  return <div id="top" className="app-shell reference-shell">
    <Navbar/>
    <main className="app-main-region">
      <AnimatePresence mode="wait"><div key={location.pathname} className="route-stage"><Outlet/></div></AnimatePresence>
    </main>
    <Footer/>
    <Chatbot/>
  </div>;
}
