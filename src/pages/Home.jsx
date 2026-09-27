import {
  ArrowRight, Crown, Flame, Heart, MessageCircle, Play, Search, Sparkles, Star,
  Users, CalendarDays, MapPin, TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/home-community-fix.css';
import '../styles/explore-universe-fix.css';
import '../styles/featured-anime-upgrade.css';
import '../styles/featured-stories-upgrade.css';
import '../styles/final-home-experience.css';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import { EventCard, MediaCard, ReleaseCard } from '../components/cards/Cards';
import { SkeletonGrid } from '../components/common/Loading';

const fallbackHero = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=90';
const fallbackAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80';
const heroVideo = '/videos/action-anime-hero.mp4';

const communityFallback = [
  { _id:'f1', title:'Just finished the latest anime arc and I am speechless. The animation is on another level!', submissionType:'Anime', user:{name:'ShadowRaven'}, reactions:48, comments:324 },
  { _id:'f2', title:'Looking for teammates for a weekend co-op run. Anyone up for it?', submissionType:'Gaming', user:{name:'PixelNeko'}, reactions:76, comments:192 },
  { _id:'f3', title:'That new movie was absolutely incredible. The visuals are next level.', submissionType:'Movies', user:{name:'MovieGeek'}, reactions:41, comments:267 },
  { _id:'f4', title:'New comeback is already on repeat. Who else loves it?', submissionType:'K-Pop', user:{name:'KPopLover'}, reactions:99, comments:213 }
];

function imgOf(item) {
  return item?.bannerUrl || item?.thumbnailUrl || item?.coverImage || item?.imageUrl || item?.bannerImage || fallbackHero;
}

function ratingOf(item) {
  const v = Number(item?.ratingAverage || item?.rating || 0);
  return v ? v.toFixed(1) : '8.8';
}

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState({ categories:[], trending:[], anime:[], characters:[], media:[], articles:[], releases:[], events:[], merch:[], community:[] });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      api.get('/categories'),
      api.get('/content',{params:{isTrending:true,limit:8}}),
      api.get('/content',{params:{category:'anime',limit:10,sort:'most-popular'}}),
      api.get('/characters',{params:{isFeatured:true,limit:8}}),
      api.get('/media',{params:{isFeatured:true,limit:8}}),
      api.get('/articles',{params:{isFeatured:true,limit:6}}),
      api.get('/releases'),
      api.get('/events',{params:{limit:6}}),
      api.get('/merchandise',{params:{limit:8}}),
      api.get('/submissions/approved',{params:{limit:6}})
    ]).then((r) => {
      const value = (i) => r[i].status === 'fulfilled' ? (r[i].value.data.data || []) : [];
      setData({ categories:value(0),trending:value(1),anime:value(2),characters:value(3),media:value(4),articles:value(5),releases:value(6),events:value(7),merch:value(8),community:value(9) });
    }).finally(()=>setLoading(false));
  }, []);

  const hero = data.anime[0] || data.trending[0] || { title:'Your Ultimate Anime Universe', description:'Discover, watch, read and explore anime, manga, movies, K-Pop and more — all in one place.', bannerUrl:fallbackHero };
  const community = data.community.length ? data.community : communityFallback;
  const universes = data.categories.length ? data.categories : [
    { _id:'a',name:'Anime',slug:'anime',tagline:'12.4K+ communities',bannerImage:fallbackHero,color:'#ff4eb8' },
    { _id:'m',name:'Manga',slug:'manga',tagline:'8.7K+ communities',bannerImage:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=85',color:'#7c6cff' },
    { _id:'mv',name:'Movies',slug:'movies',tagline:'6.2K+ communities',bannerImage:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85',color:'#ff8a62' },
    { _id:'k',name:'K-Pop',slug:'k-pop',tagline:'2.1K+ communities',bannerImage:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85',color:'#ff4ea1' },
    { _id:'c',name:'Cosplay',slug:'cosplay',tagline:'4.3K+ communities',bannerImage:'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85',color:'#9b6bff' }
  ];

  const featuredAnime = data.anime.length ? data.anime : data.trending;
  const featuredSpotlight = featuredAnime[0] || hero;
  const communityLead = community[0] || communityFallback[0];
  const communityVisual = imgOf(featuredAnime[1] || featuredAnime[0] || hero);
  const collectorItems = data.merch.slice(0,4);
  const collectorLead = collectorItems[0];
  const collectorSide = collectorItems.slice(1,4);
  const submit = (e) => { e.preventDefault(); if(q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`); };

  return <PageTransition>
    <div className="reference-home">
      <div className="home-dashboard-grid">
        <div className="home-primary-column">
          <Reveal>
            <section className={`reference-hero ${heroVideoReady ? 'has-action-video' : ''}`} style={{'--hero-image':`url("${imgOf(hero)}")`}}>
              <video
                className="hero-action-video"
                src={heroVideo}
                poster={imgOf(hero)}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                onCanPlay={() => setHeroVideoReady(true)}
                onError={() => setHeroVideoReady(false)}
              />
              <div className="reference-hero-content">
                <span className="reference-kicker">WELCOME TO FAN HUB PLUS</span>
                <h1>Your Ultimate<br/><span>Anime Universe</span></h1>
                <p>{hero.description || 'Discover, watch, read and explore anime, manga, movies, K-Pop and more — all in one place. Join a global community of fans and share your passion!'}</p>
                <div className="reference-hero-actions">
                  <Link className="ref-primary-btn" to="/category/anime"><Play size={16} fill="currentColor"/> Explore Anime <ArrowRight size={15}/></Link>
                  <Link className="ref-secondary-btn" to="/register"><Users size={16}/> Join Community</Link>
                </div>
                <div className="hero-social-proof"><div className="proof-avatars">{[1,2,3,4].map((x)=><img key={x} src={`${fallbackAvatar}&sig=${x}`} alt=""/>)}</div><strong>+328K</strong><span>Fans already joined!</span></div>
              </div>
              <div className="hero-quote-chip"><span>“Anime isn't just entertainment,<br/>it's a feeling.”</span><Heart size={16} fill="currentColor"/></div>
              <div className="hero-petal p1"/><div className="hero-petal p2"/><div className="hero-petal p3"/>
            </section>
          </Reveal>

          <section className="ref-section compact-top">
            <div className="ref-section-head"><div><span className="section-icon purple"><Sparkles size={15}/></span><h2>Explore Universes</h2></div><Link to="/explore">View All Categories <ArrowRight size={14}/></Link></div>
            {loading ? <SkeletonGrid count={5}/> : <Swiper
              key={`universe-marquee-${universes.length}`}
              className="universe-swiper universe-auto-marquee"
              modules={[Navigation, Autoplay]}
              navigation
              loop
              loopAdditionalSlides={Math.max(universes.length, 8)}
              speed={4800}
              autoplay={{
                delay: 1,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                waitForTransition: false,
                stopOnLastSlide: false
              }}
              observer
              observeParents
              watchSlidesProgress
              onSwiper={(swiper) => {
                window.requestAnimationFrame(() => swiper.autoplay?.start());
              }}
              onResize={(swiper) => swiper.autoplay?.start()}
              spaceBetween={14}
              slidesPerView={1.25}
              breakpoints={{500:{slidesPerView:2.15},760:{slidesPerView:3.15},1040:{slidesPerView:5}}}
            >
              {[...universes, ...universes, ...universes].map((c,i)=><SwiperSlide key={`${c._id || c.slug}-${i}`}><Link className="reference-universe-card" to={`/category/${c.slug}`}><img src={c.bannerImage || fallbackHero} alt={c.name}/><div className="universe-card-shade"/><div className="universe-card-copy"><span className="universe-round-icon"><Sparkles size={13}/></span><strong>{c.name}</strong><small>{c.stats?.contentCount ? `${c.stats.contentCount}+ stories` : c.tagline || 'Explore community'}</small></div><span className="universe-arrow"><ArrowRight size={14}/></span></Link></SwiperSlide>)}
            </Swiper>}
          </section>

          <section className="ref-section live-community-section fh-community-section">
            <div className="ref-section-head fh-community-head">
              <div><span className="section-icon pink"><Flame size={15}/></span><h2>What's happening now</h2></div>
              <Link className="outline-micro-button fh-community-more" to="/submit-content">Join Discussion <ArrowRight size={13}/></Link>
            </div>

            <div className="fh-community-grid">
              <article className="fh-community-post">
                <div className="fh-community-user">
                  <span className="fh-community-avatar">{(communityLead.user?.name || 'K')[0]}</span>
                  <div>
                    <strong>{communityLead.user?.name || 'Kai Takahashi'}</strong>
                    <small>2h ago</small>
                  </div>
                </div>
                <p>{communityLead.summary || communityLead.title || 'Fans are sharing reactions, theories and favorite moments from the latest releases.'}</p>
                <div className="fh-community-post-bottom">
                  <span className="fh-community-tag">{communityLead.submissionType || 'Anime'}</span>
                  <div>
                    <span><Heart size={12}/>{communityLead.reactions || 100}</span>
                    <span><MessageCircle size={12}/>{communityLead.comments || 40}</span>
                  </div>
                </div>
              </article>

              <article className="fh-community-banner" style={{'--fh-community-image': `url("${communityVisual}")`}}>
                <div className="fh-community-banner-copy">
                  <span className="fh-community-kicker">JOIN THE CONVERSATION</span>
                  <h3>Discover. <span>Discuss.</span><br/>Connect with <span>Fans.</span></h3>
                  <div className="fh-community-proof">
                    <div className="proof-avatars">{[11,12,13,14].map((x)=><img key={x} src={`${fallbackAvatar}&sig=${x}`} alt=""/>)}</div>
                    <strong>+12K</strong>
                    <span>Active fans right now</span>
                  </div>
                </div>

                <div className="fh-community-stats">
                  <div><MessageCircle size={15}/><span><strong>12K+</strong><small>Active Fans</small></span></div>
                  <div><Users size={15}/><span><strong>3K+</strong><small>Discussions</small></span></div>
                  <div><TrendingUp size={15}/><span><strong>50K+</strong><small>Posts</small></span></div>
                </div>
              </article>
            </div>
          </section>

          <Reveal>
            <section className="reference-promo-banner">
              <div><h3>Your fandom, your universe.</h3><p>Create your profile, follow your favorite fandoms, and be part of something bigger.</p></div>
              <Link to="/profile">Create your profile <ArrowRight size={14}/></Link>
            </section>
          </Reveal>

          <section className="ref-section featured-anime-section fh-featured-anime-section">
            <div className="ref-section-head"><div><span className="section-icon crown"><Crown size={15}/></span><h2>Featured Anime</h2></div><Link to="/category/anime">View All <ArrowRight size={14}/></Link></div>

            <div className="fh-featured-layout">
              <div className="fh-featured-cards-wrap">
                <Swiper
                  className="featured-anime-swiper fh-featured-swiper"
                  modules={[Navigation,Autoplay]}
                  navigation
                  autoplay={{delay:3600,disableOnInteraction:false,pauseOnMouseEnter:true}}
                  spaceBetween={14}
                  slidesPerView={1.2}
                  breakpoints={{480:{slidesPerView:2.15},760:{slidesPerView:3.05},1180:{slidesPerView:3.15}}}
                >
                  {featuredAnime.slice(0,8).map((x,i)=><SwiperSlide key={x._id || i}><Link className="featured-anime-card fh-feature-card" to={`/content/${x._id || x.slug}`}><div className="featured-anime-image"><img src={imgOf(x)} alt={x.title}/><span>{x.genre?.[0] || x.genres?.[0] || ['Action','Fantasy','Adventure','Comedy'][i%4]}</span><div className="fh-card-play"><Play size={13} fill="currentColor"/></div></div><div className="featured-anime-copy"><strong>{x.title}</strong><div><small>{x.genre?.[1] || x.type || 'Fantasy'}</small><span><Star size={12} fill="currentColor"/>{ratingOf(x)}</span></div></div></Link></SwiperSlide>)}
                </Swiper>
              </div>

              <Link
                className="fh-anime-spotlight"
                to={featuredSpotlight?._id || featuredSpotlight?.slug ? `/content/${featuredSpotlight._id || featuredSpotlight.slug}` : '/category/anime'}
                style={{'--fh-spotlight-image': `url("${imgOf(featuredSpotlight)}")`}}
              >
                <div className="fh-spotlight-overlay"/>
                <div className="fh-spotlight-top">
                  <span><Flame size={13} fill="currentColor"/> ANIME SPOTLIGHT</span>
                  <span className="fh-spotlight-rating"><Star size={12} fill="currentColor"/>{ratingOf(featuredSpotlight)}</span>
                </div>
                <div className="fh-spotlight-copy">
                  <small>Trending pick of the week</small>
                  <h3>{featuredSpotlight?.title || 'Discover your next favorite anime'}</h3>
                  <p>{featuredSpotlight?.description || 'Jump into a fan-favorite title, discover characters, media, ratings and community reactions.'}</p>
                  <span className="fh-spotlight-cta">Explore Now <ArrowRight size={14}/></span>
                </div>
              </Link>
            </div>
          </section>

          <section className="ref-section lower-discovery-section">
            <div className="ref-section-head"><div><span className="section-icon blue"><Play size={15}/></span><h2>Multimedia Spotlight</h2></div><Link to="/media">View All <ArrowRight size={14}/></Link></div>
            <div className="card-grid three compact-reference-grid">{data.media.slice(0,3).map(x=><MediaCard key={x._id} item={x}/>)}</div>
          </section>

          <section className="ref-section lower-discovery-section fh-stories-section">
            <div className="ref-section-head fh-stories-head"><div><span className="section-icon orange"><TrendingUp size={15}/></span><h2>Featured Stories</h2></div><Link to="/articles">View All <ArrowRight size={14}/></Link></div>

            {data.articles.length ? (
              <div className="fh-stories-layout">
                {data.articles[0] && (
                  <Link
                    className="fh-story-lead"
                    to={`/articles/${data.articles[0]._id || data.articles[0].slug}`}
                    style={{'--fh-story-image': `url("${data.articles[0].coverImage || fallbackHero}")`}}
                  >
                    <div className="fh-story-lead-overlay"/>
                    <div className="fh-story-lead-top">
                      <span className="fh-story-featured"><Sparkles size={12}/> EDITOR'S PICK</span>
                      <span className="fh-story-read">{data.articles[0].readTime || '5 min read'}</span>
                    </div>
                    <div className="fh-story-lead-copy">
                      <span className="fh-story-category">{data.articles[0].category?.name || data.articles[0].fandom || 'Fandom'}</span>
                      <h3>{data.articles[0].title}</h3>
                      <p>{data.articles[0].summary}</p>
                      <div className="fh-story-author-row">
                        <span>By {data.articles[0].authorName || 'Fan Hub Editorial'}</span>
                        <span className="fh-story-open">Read Story <ArrowRight size={13}/></span>
                      </div>
                    </div>
                  </Link>
                )}

                {data.articles[1] && (
                  <Link className="fh-story-editorial" to={`/articles/${data.articles[1]._id || data.articles[1].slug}`}>
                    <div className="fh-story-editorial-media">
                      <img src={data.articles[1].coverImage || fallbackHero} alt={data.articles[1].title}/>
                      <span className="fh-story-floating-label">FEATURED</span>
                    </div>
                    <div className="fh-story-editorial-body">
                      <div className="fh-story-editorial-meta">
                        <span>{data.articles[1].category?.name || data.articles[1].fandom || 'Anime'}</span>
                        <span>{data.articles[1].readTime || '6 min read'}</span>
                      </div>
                      <h3>{data.articles[1].title}</h3>
                      <p>{data.articles[1].summary}</p>
                      <div className="fh-story-editorial-foot">
                        <span>By {data.articles[1].authorName || 'Fan Hub Editorial'}</span>
                        <span className="fh-story-circle-arrow"><ArrowRight size={15}/></span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="fh-stories-empty">Stories will appear here as soon as featured articles are published.</div>
            )}
          </section>

          <section className="ref-section lower-discovery-section">
            <div className="ref-section-head"><div><span className="section-icon purple"><CalendarDays size={15}/></span><h2>Upcoming Releases</h2></div><Link to="/releases">View All <ArrowRight size={14}/></Link></div>
            <Swiper modules={[Navigation]} navigation spaceBetween={14} slidesPerView={1.2} breakpoints={{650:{slidesPerView:2.2},980:{slidesPerView:3}}}>{data.releases.slice(0,6).map(x=><SwiperSlide key={x._id}><ReleaseCard item={x}/></SwiperSlide>)}</Swiper>
          </section>

          <section className="ref-section lower-discovery-section">
            <div className="ref-section-head"><div><span className="section-icon pink"><MapPin size={15}/></span><h2>Upcoming Events</h2></div><Link to="/events">View All <ArrowRight size={14}/></Link></div>
            <div className="card-grid three compact-reference-grid">{data.events.slice(0,3).map(x=><EventCard key={x._id} item={x}/>)}</div>
          </section>

          <section className="ref-section lower-discovery-section fh-collector-section">
            <div className="ref-section-head fh-collector-head">
              <div><span className="section-icon crown"><Crown size={15}/></span><h2>Collector Showcase</h2></div>
              <Link to="/merchandise">View All <ArrowRight size={14}/></Link>
            </div>

            {collectorLead ? (
              <div className="fh-collector-layout">
                <Link
                  className="fh-collector-feature"
                  to={`/merchandise/${collectorLead._id}`}
                  style={{'--collector-image': `url("${collectorLead.imageUrl || fallbackHero}")`}}
                >
                  <div className="fh-collector-feature-glow"/>
                  <div className="fh-collector-feature-top">
                    <span className="fh-collector-drop"><Sparkles size={13}/> FEATURED DROP</span>
                    <span className="fh-collector-score"><Heart size={13} fill="currentColor"/>{collectorLead.popularityScore || 94}%</span>
                  </div>
                  <div className="fh-collector-feature-copy">
                    <span className="fh-collector-fandom">{collectorLead.fandom || 'Collector Edition'}</span>
                    <h3>{collectorLead.name}</h3>
                    <p>{collectorLead.description}</p>
                    <div className="fh-collector-meta">
                      <span>{collectorLead.tag || 'Official Merch'}</span>
                      <span>{collectorLead.releaseDate || 'Available Now'}</span>
                      <span>{collectorLead.scaleOrSize || 'Special Edition'}</span>
                    </div>
                    <span className="fh-collector-open">View Collectible <ArrowRight size={15}/></span>
                  </div>
                </Link>

                <div className="fh-collector-side-grid">
                  {collectorSide.map((x,i)=>(
                    <Link className={`fh-collector-mini fh-collector-mini-${i+1}`} to={`/merchandise/${x._id}`} key={x._id}>
                      <div className="fh-collector-mini-media">
                        <img src={x.imageUrl || fallbackHero} alt={x.name}/>
                        <span className="fh-collector-mini-tag">{x.tag || 'Collectible'}</span>
                        <span className="fh-collector-mini-arrow"><ArrowRight size={14}/></span>
                      </div>
                      <div className="fh-collector-mini-copy">
                        <span>{x.fandom || 'Fan Hub Plus'}</span>
                        <h3>{x.name}</h3>
                        <div>
                          <small>{x.releaseDate || 'Available Now'}</small>
                          <strong>{x.popularityScore || 90}% <Heart size={11} fill="currentColor"/></strong>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="fh-collector-empty">Collector drops will appear here when merchandise is available.</div>
            )}
          </section>

          <section className="ref-section home-sitemap-reference">
            <div className="ref-section-head"><div><span className="section-icon purple"><Sparkles size={15}/></span><h2>Explore the whole Fan Hub</h2></div><Link to="/sitemap">Full Sitemap <ArrowRight size={14}/></Link></div>
            <div className="reference-sitemap-grid">
              <div><strong>Explore</strong><Link to="/explore">Content Explorer</Link><Link to="/search">Global Search</Link><Link to="/characters">Characters</Link></div>
              <div><strong>Discover</strong><Link to="/articles">Articles</Link><Link to="/media">Multimedia</Link><Link to="/releases">Releases</Link></div>
              <div><strong>Community</strong><Link to="/events">Events</Link><Link to="/calendar">Calendar</Link><Link to="/submit-content">Submit Fan Content</Link></div>
              <div><strong>My Fan Hub</strong><Link to="/dashboard">Dashboard</Link><Link to="/bookmarks">Bookmarks & Notes</Link><Link to="/profile">Profile</Link></div>
            </div>
          </section>

          <section className="reference-sitemap-strip">
            <div><strong>Everything in one universe</strong><p>Search, profiles, media, releases, events, bookmarks, submissions and more.</p></div>
            <Link to="/sitemap">Open Sitemap <ArrowRight size={14}/></Link>
          </section>
        </div>

        <aside className="home-right-rail">
          <section className="right-rail-card">
            <div className="right-rail-title"><span><Flame size={17}/> Trending Now</span><Link to="/explore?sort=most-popular">View All <ArrowRight size={12}/></Link></div>
            <div className="trending-list">{(data.trending.length ? data.trending : featuredAnime).slice(0,5).map((x,i)=><Link to={`/content/${x._id || x.slug}`} className="trending-row" key={x._id || i}><img src={imgOf(x)} alt=""/><div><strong>{x.title}</strong><small>{x.category?.name || x.fandom || 'Anime'} <span>#{i+1}</span> <b><Star size={10} fill="currentColor"/>{ratingOf(x)}</b></small></div></Link>)}</div>
          </section>

          <section className="right-rail-card top-characters-card">
            <div className="right-rail-title"><span><Crown size={17}/> Top Characters</span><Link to="/characters">View All <ArrowRight size={12}/></Link></div>
            <div className="top-character-list">{data.characters.slice(0,5).map((x,i)=><Link to={`/characters/${x._id}`} className="top-character-row" key={x._id}><span className="rank-number">{i+1}</span><img src={x.imageUrl || fallbackAvatar} alt=""/><div><strong>{x.name}</strong><small>{x.fandom || 'Anime'}</small><em>{(12.4-i*1.3).toFixed(1)}M fans {i<2?'🔥':'✨'}</em></div></Link>)}</div>
          </section>

          <section className="right-rail-card rail-quick-card">
            <span className="rail-quick-icon"><Search size={17}/></span><div><strong>Find your next obsession</strong><p>Search across all eight fandom universes.</p></div>
            <form onSubmit={submit}><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search Fan Hub Plus"/><button><ArrowRight size={14}/></button></form>
          </section>
        </aside>
      </div>
    </div>
  </PageTransition>;
}
