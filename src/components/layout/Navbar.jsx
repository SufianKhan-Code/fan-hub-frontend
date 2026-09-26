import {
  Bell, BookOpen, CalendarDays, ChevronDown, Clapperboard, Compass, Crown, Gamepad2,
  Heart, Home, LogOut, Menu, Moon, Music2, Newspaper, Search, Sparkles, Star,
  Sun, Tv, User, Users, X, Zap, Image as ImageIcon, ShoppingBag, MessageCircle, Settings2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUi } from '../../context/UiContext';
import '../../styles/sidebar-logo.css';
import '../../styles/navbar-wordmark.css';

const universeLinks = [
  ['Anime','anime',Sparkles],
  ['Manga','manga',BookOpen],
  ['Movies','movies',Clapperboard],
  ['TV Shows','tv-shows',Tv],
  ['Gaming','gaming',Gamepad2],
  ['K-Pop','k-pop',Music2],
  ['Comics','comics',Newspaper],
  ['Cosplay','cosplay',Crown]
];

// Keep icons in a separate map so the navigation data stays easy to scan.
const universeIcons = {
  anime: Sparkles,
  manga: BookOpen,
  movies: Clapperboard,
  'tv-shows': Tv,
  gaming: Gamepad2,
  'k-pop': Music2,
  comics: Newspaper,
  cosplay: Crown
};

const discoveryLinks = [
  ['Trending','/explore?sort=most-popular',Zap],
  ['Popular','/explore?minPopularity=80',Star],
  ['New Releases','/releases',CalendarDays],
  ['Top Rated','/explore?sort=rating',Crown]
];

const communityLinks = [
  ['Characters','/characters',Users],
  ['Multimedia','/media',ImageIcon],
  ['Articles','/articles',Newspaper],
  ['Events','/events',CalendarDays],
  ['Merchandise','/merchandise',ShoppingBag],
  ['Feedback','/feedback',MessageCircle]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme, fontSize, setFontSize, reducedMotion, setReducedMotion } = useUi();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  const close = () => setOpen(false);
  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

  const sidebarContent = <>
    <div className="sidebar-logo-row">
      <Link className="sidebar-logo sidebar-logo-image-link" to="/" onClick={close} aria-label="Fan Hub Plus home">
        <img src="/images/fanhub-logo.png" alt="Fan Hub Plus" className="sidebar-brand-logo" />
      </Link>
      <button className="sidebar-mobile-close" onClick={close} aria-label="Close navigation"><X size={20}/></button>
    </div>

    <nav className="sidebar-nav" aria-label="Primary navigation">
      <NavLink end className={linkClass} to="/" onClick={close}><Home size={18}/><span>Home</span></NavLink>

      <p className="sidebar-label">Universes</p>
      {universeLinks.map(([name, slug]) => {
        const Icon = universeIcons[slug];
        return <NavLink key={slug} className={linkClass} to={`/category/${slug}`} onClick={close}><Icon size={18}/><span>{name}</span></NavLink>;
      })}

      <p className="sidebar-label">Discover</p>
      {discoveryLinks.map(([name,to,Icon]) => <NavLink key={name} className={linkClass} to={to} onClick={close}><Icon size={18}/><span>{name}</span></NavLink>)}

      <p className="sidebar-label">Community</p>
      {communityLinks.map(([name,to,Icon]) => <NavLink key={name} className={linkClass} to={to} onClick={close}><Icon size={18}/><span>{name}</span></NavLink>)}
    </nav>

    <div className="sidebar-promo">
      <span><Crown size={17}/> Fan Hub Plus</span>
      <strong>Your fandom, organized beautifully.</strong>
      <p>Profiles, bookmarks, events and fan submissions in one place.</p>
      <Link to={user ? '/dashboard' : '/register'} onClick={close}>{user ? 'Open dashboard' : 'Join community'} <ChevronDown size={14}/></Link>
    </div>
  </>;

  return <>
    <aside className={`desktop-app-sidebar ${open ? 'open' : ''}`}>{sidebarContent}</aside>
    {open && <button className="sidebar-backdrop" onClick={close} aria-label="Close navigation"/>}

    <header className={`top-appbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="top-appbar-inner">
        <button className="topbar-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
        <Link className="topbar-brand topbar-wordmark-link" to="/" aria-label="Fan Hub Plus home">
          <img src="/images/fanhub-wordmark-light.png" alt="Fan Hub Plus" className="topbar-wordmark-logo topbar-wordmark-light" />
          <img src="/images/fanhub-wordmark-dark.png" alt="" aria-hidden="true" className="topbar-wordmark-logo topbar-wordmark-dark" />
        </Link>

        <form className="topbar-search" onSubmit={submitSearch}>
          <Search size={17}/>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search anime, manga, movies, characters..." aria-label="Global search"/>
          <button type="submit" aria-label="Search"><Search size={16}/></button>
        </form>

        <div className="topbar-actions">
          <Link className="topbar-icon" to={user ? '/dashboard' : '/login'} aria-label="Notifications"><Bell size={18}/><i/></Link>
          <button className="theme-pill" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <Sun size={14}/><span className={theme === 'light' ? 'left' : 'right'}>{theme === 'light' ? <Sun size={13}/> : <Moon size={13}/>}</span><Moon size={14}/>
          </button>
          <div className="topbar-settings-wrap">
            <button className="topbar-icon" onClick={()=>setSettingsOpen(v=>!v)} aria-label="Accessibility settings"><Settings2 size={18}/></button>
            {settingsOpen && <div className="topbar-settings-panel">
              <strong>Accessibility</strong>
              <div className="font-size-controls"><button className={fontSize==='small'?'active':''} onClick={()=>setFontSize('small')}>A</button><button className={fontSize==='medium'?'active':''} onClick={()=>setFontSize('medium')}>A+</button><button className={fontSize==='large'?'active':''} onClick={()=>setFontSize('large')}>A++</button></div>
              <label><input type="checkbox" checked={reducedMotion} onChange={()=>setReducedMotion(!reducedMotion)}/> Reduce motion</label>
            </div>}
          </div>

          {user ? <div className="topbar-account nav-dropdown">
            <button className="topbar-account-button">
              <span className="avatar-shell">{user.avatar ? <img src={user.avatar} alt=""/> : <User size={17}/>}</span>
              <span className="topbar-account-copy"><strong>{user.name}</strong><small>{user.role === 'admin' ? 'Administrator' : 'Fan member'}</small></span>
              <ChevronDown size={14}/>
            </button>
            <div className="dropdown-panel account-panel">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}><User size={16}/>{user.role === 'admin' ? 'Admin panel' : 'Dashboard'}</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/bookmarks"><Heart size={15}/>Bookmarks</Link>
              <button onClick={handleLogout}><LogOut size={16}/>Log out</button>
            </div>
          </div> : <div className="topbar-guest-actions"><Link to="/login">Sign in</Link><Link className="join-chip" to="/register">Join Community</Link></div>}
        </div>
      </div>
    </header>
  </>;
}
