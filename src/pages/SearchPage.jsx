import { Search as SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';

const sources = [
  {
    label: 'Content',
    url: '/content',
    title: (item) => item.title,
    image: (item) => item.thumbnailUrl || item.bannerUrl,
    link: (item) => `/content/${item._id}`,
    meta: (item) => item.category?.name || item.fandom || item.type || 'Content',
    description: (item) => item.description
  },
  {
    label: 'Characters',
    url: '/characters',
    title: (item) => item.name,
    image: (item) => item.imageUrl,
    link: (item) => `/characters/${item._id}`,
    meta: (item) => item.category?.name || item.fandom || item.role || 'Character',
    description: (item) => item.bio || item.role
  },
  {
    label: 'Articles',
    url: '/articles',
    title: (item) => item.title,
    image: (item) => item.coverImage,
    link: (item) => `/articles/${item._id}`,
    meta: (item) => item.category?.name || item.fandom || 'Article',
    description: (item) => item.summary || item.description
  },
  {
    label: 'Media',
    url: '/media',
    title: (item) => item.title,
    image: (item) => item.thumbnailUrl,
    link: () => '/media',
    meta: (item) => `${item.fandom || 'Media'}${item.type ? ` · ${item.type}` : ''}`,
    description: (item) => item.description
  },
  {
    label: 'Merchandise',
    url: '/merchandise',
    title: (item) => item.name,
    image: (item) => item.imageUrl,
    link: (item) => `/merchandise/${item._id}`,
    meta: (item) => `${item.fandom || 'Merchandise'}${item.tag ? ` · ${item.tag}` : ''}`,
    description: (item) => item.description
  },
  {
    label: 'Events',
    url: '/events',
    title: (item) => item.title,
    image: (item) => item.bannerImage,
    link: (item) => `/events/${item._id}`,
    meta: (item) => `${item.fandom || item.category?.name || 'Event'}${item.city ? ` · ${item.city}` : ''}`,
    description: (item) => item.description
  },
  {
    label: 'Upcoming Releases',
    url: '/releases',
    title: (item) => item.title,
    image: (item) => item.bannerImage,
    link: (item) => `/releases?search=${encodeURIComponent(item.title)}`,
    meta: (item) => {
      const date = item.releaseDate ? new Date(item.releaseDate) : null;
      const dateLabel = date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : '';
      return [item.releaseType, item.fandom, dateLabel].filter(Boolean).join(' · ');
    },
    description: (item) => item.description || item.platform
  }
];

export default function SearchPage(){
  const [params,setParams]=useSearchParams();
  const [q,setQ]=useState(params.get('q')||'');
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(false);
  const search=params.get('q')||'';

  useEffect(()=>{
    setQ(search);
    if(!search){
      setResults([]);
      return;
    }

    let cancelled=false;
    setLoading(true);

    Promise.allSettled(
      sources.map((source)=>api.get(source.url,{params:{search,limit:6}}))
    )
      .then((responses)=>{
        if(cancelled) return;
        setResults(responses.map((response,index)=>({
          source:sources[index],
          items:response.status==='fulfilled' ? (response.value.data.data||[]) : []
        })));
      })
      .finally(()=>{
        if(!cancelled) setLoading(false);
      });

    return ()=>{cancelled=true;};
  },[search]);

  const submit=(e)=>{
    e.preventDefault();
    const value=q.trim();
    if(value) setParams({q:value});
  };

  const total=results.reduce((sum,result)=>sum+result.items.length,0);
  const matchedGroups=results.filter((result)=>result.items.length).length;

  return <PageTransition>
    <div className="page-hero compact">
      <div className="container">
        <Breadcrumbs items={[{label:'Search'}]}/>
        <span className="eyebrow">GLOBAL SEARCH</span>
        <h1>Search the entire universe.</h1>
        <p>Search stories, characters, articles, media, merchandise, events and upcoming releases from one place.</p>
        <form className="search-page-form" onSubmit={submit}>
          <SearchIcon/>
          <input autoFocus value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Try ‘anime’, ‘cosplay’, ‘gaming’…"/>
          <button className="button primary">Search</button>
        </form>
      </div>
    </div>

    <section className="section container">
      {loading
        ? <div className="search-loading">Searching across stories, characters, media, events and upcoming releases…</div>
        : search && total===0
          ? <EmptyState title={`No results for “${search}”`}/>
          : <>
              {search&&<p className="search-count">Showing <strong>{total}</strong> matches across <strong>{matchedGroups}</strong> result types for “{search}”</p>}
              {results.filter((result)=>result.items.length).map(({source,items})=>
                <div className="search-group" key={source.label}>
                  <div className="section-heading mini"><h2>{source.label}</h2></div>
                  <div className="search-result-grid">
                    {items.map((item)=><Link key={item._id} to={source.link(item)} className="search-result">
                      <img src={source.image(item)} alt=""/>
                      <div>
                        <span>{source.meta(item) || source.label}</span>
                        <h3>{source.title(item)}</h3>
                        <p>{source.description(item)}</p>
                      </div>
                    </Link>)}
                  </div>
                </div>
              )}
            </>}
    </section>
  </PageTransition>;
}
