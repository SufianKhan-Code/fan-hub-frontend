import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Compass,
  Crown,
  Film,
  Heart,
  MapPin,
  MessageCircle,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/premium-footer.css';

const footerGroups = [
  {
    title: 'Explore',
    links: [
      ['Explore All', '/explore'],
      ['Anime', '/category/anime'],
      ['Manga', '/category/manga'],
      ['Movies', '/category/movies'],
      ['K-Pop', '/category/k-pop'],
      ['Characters', '/characters'],
    ],
  },
  {
    title: 'Discover',
    links: [
      ['Featured Stories', '/articles'],
      ['Multimedia', '/media'],
      ['Upcoming Releases', '/releases'],
      ['Collector Showcase', '/merchandise'],
      ['Global Search', '/search'],
    ],
  },
  {
    title: 'Community',
    links: [
      ['Events', '/events'],
      ['Event Calendar', '/calendar'],
      ['Submit Fan Content', '/submit-content'],
      ['Feedback', '/feedback'],
      ['Join Fan Hub Plus', '/register'],
    ],
  },
];

const fandoms = [
  ['Anime', '/category/anime'],
  ['Gaming', '/category/gaming'],
  ['Movies', '/category/movies'],
  ['TV Shows', '/category/tv-shows'],
  ['K-Pop', '/category/k-pop'],
  ['Comics', '/category/comics'],
  ['Manga', '/category/manga'],
  ['Cosplay', '/category/cosplay'],
];

export default function Footer() {
  return (
    <footer className="fhp-footer">
      <div className="fhp-footer-glow fhp-footer-glow-one" />
      <div className="fhp-footer-glow fhp-footer-glow-two" />

      <div className="fhp-footer-wrap">
        <section className="fhp-footer-cta" aria-label="Join Fan Hub Plus">
          <div className="fhp-footer-cta-icon">
            <Sparkles size={22} />
          </div>

          <div className="fhp-footer-cta-copy">
            <span>YOUR FANDOM STARTS HERE</span>
            <h2>One hub. Every universe.</h2>
            <p>
              Discover stories, characters, releases, events and fan conversations
              across the fandoms you love.
            </p>
          </div>

          <div className="fhp-footer-cta-actions">
            <Link className="fhp-footer-primary" to="/explore">
              Explore Fan Hub <ArrowRight size={16} />
            </Link>
            <Link className="fhp-footer-secondary" to="/register">
              Join Community <Users size={15} />
            </Link>
          </div>
        </section>

        <div className="fhp-footer-main">
          <div className="fhp-footer-brand-column">
            <Link className="fhp-footer-brand" to="/" aria-label="Fan Hub Plus home">
              <span className="fhp-footer-logo"><Sparkles size={20} /></span>
              <span className="fhp-footer-brand-text">
                <strong>FAN HUB</strong>
                <em>PLUS</em>
              </span>
            </Link>

            <p className="fhp-footer-description">
              Your all-in-one fandom universe for anime, gaming, movies, TV shows,
              K-Pop, comics, manga and cosplay.
            </p>

            <div className="fhp-footer-feature-list">
              <Link to="/explore"><Compass size={15} /><span>Explore fandoms</span></Link>
              <Link to="/media"><PlayCircle size={15} /><span>Watch & discover</span></Link>
              <Link to="/events"><MapPin size={15} /><span>Find fan events</span></Link>
            </div>

            <div className="fhp-footer-trust">
              <span><ShieldCheck size={15} /> Fan-first experience</span>
              <span><Heart size={15} /> Built for communities</span>
            </div>
          </div>

          <div className="fhp-footer-links-area">
            {footerGroups.map((group) => (
              <nav className="fhp-footer-link-group" key={group.title} aria-label={`${group.title} footer links`}>
                <h3>{group.title}</h3>
                {group.links.map(([label, to]) => (
                  <Link to={to} key={to}>
                    <span>{label}</span><ChevronRight size={13} />
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <section className="fhp-footer-fandoms" aria-label="Fandom universes">
          <div className="fhp-footer-fandoms-title">
            <span className="fhp-footer-small-icon"><Crown size={15} /></span>
            <div>
              <strong>Explore every universe</strong>
              <small>Jump straight into your favorite fandom.</small>
            </div>
          </div>

          <div className="fhp-footer-fandom-chips">
            {fandoms.map(([label, to]) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
          </div>
        </section>

        <section className="fhp-footer-mini-panels">
          <Link className="fhp-footer-mini-panel" to="/articles">
            <span className="fhp-footer-mini-icon purple"><BookOpen size={17} /></span>
            <div><strong>Fresh Stories</strong><small>Editorial fandom reads</small></div>
            <ArrowRight size={15} />
          </Link>

          <Link className="fhp-footer-mini-panel" to="/releases">
            <span className="fhp-footer-mini-icon blue"><CalendarDays size={17} /></span>
            <div><strong>Upcoming Releases</strong><small>Never miss what is next</small></div>
            <ArrowRight size={15} />
          </Link>

          <Link className="fhp-footer-mini-panel" to="/media">
            <span className="fhp-footer-mini-icon pink"><Film size={17} /></span>
            <div><strong>Media Spotlight</strong><small>Trailers, clips & more</small></div>
            <ArrowRight size={15} />
          </Link>

          <Link className="fhp-footer-mini-panel" to="/feedback">
            <span className="fhp-footer-mini-icon orange"><MessageCircle size={17} /></span>
            <div><strong>Need Help?</strong><small>Feedback & support</small></div>
            <ArrowRight size={15} />
          </Link>
        </section>

        <div className="fhp-footer-bottom">
          <div className="fhp-footer-bottom-left">
            <span>© 2026 Fan Hub Plus. All rights reserved.</span>
            <span className="fhp-footer-dot" />
            <span>Made for fans, powered by community.</span>
          </div>

          <nav className="fhp-footer-bottom-nav" aria-label="Footer utility links">
            <Link to="/sitemap"><Search size={13} /> Sitemap</Link>
            <Link to="/feedback"><CircleHelp size={13} /> Feedback</Link>
            <Link to="/events"><Star size={13} /> Community</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
