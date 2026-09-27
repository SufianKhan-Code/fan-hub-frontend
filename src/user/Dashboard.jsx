import { Activity, Bookmark, CheckCircle2, Clock3, Sparkles, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PageTransition from '../../components/common/PageTransition';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { ContentCard } from '../../components/cards/Cards';
import { Spinner } from '../../components/common/Loading';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard')
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><Spinner label="Building your dashboard…" /></div>;
  if (!data) return null;

  const recentBookmarks = (data.bookmarks || []).slice(0, 5);

  return (
    <PageTransition>
      <div className="page-hero dashboard-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Dashboard' }]} />
          <span className="eyebrow">PERSONALIZED DASHBOARD</span>
          <h1>{data.greeting}</h1>
          <p>Your fandom activity, saved discoveries and personalized recommendations in one place.</p>
        </div>
      </div>

      <section className="section container">
        <div className="dashboard-stats">
          <article><Bookmark /><div><strong>{data.bookmarks.length}</strong><span>Recent bookmarks</span></div></article>
          <article><Activity /><div><strong>{data.recentActivity.length}</strong><span>Recent actions</span></div></article>
          <article><Sparkles /><div><strong>{data.user.favoriteFandoms?.length || 0}</strong><span>Favorite fandoms</span></div></article>
          <article><UserCircle /><div><strong>{data.profileCompletion}%</strong><span>Profile complete</span></div></article>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-panel span-two">
            <div className="panel-head"><h2>Recommended for you</h2><Link to="/explore">Explore all</Link></div>
            <div className="card-grid three">{data.recommendations.map(x => <ContentCard key={x._id} item={x} />)}</div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-head"><h2>Recent activity</h2></div>
            <div className="activity-list">
              {data.recentActivity.map(x => (
                <div key={x._id}>
                  <span className="activity-icon"><Activity size={15} /></span>
                  <div><strong>{x.title}</strong><p>{x.details}</p><small><Clock3 size={12} />{new Date(x.createdAt).toLocaleString()}</small></div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-panel span-two dashboard-bookmarks-panel">
            <div className="panel-head"><h2>Recent bookmarks</h2><Link to="/bookmarks">View all</Link></div>
            {recentBookmarks.length ? (
              <div className="dashboard-bookmark-list">
                {recentBookmarks.map(item => (
                  <Link key={item._id} to={item.linkUrl || '/bookmarks'} className="dashboard-bookmark-item">
                    <div className="dashboard-bookmark-thumb">
                      {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <Bookmark size={18} />}
                    </div>
                    <div className="dashboard-bookmark-copy">
                      <span>{item.targetType || 'saved'}{item.fandom ? ` · ${item.fandom}` : ''}</span>
                      <strong>{item.title}</strong>
                      {item.note ? <p>{item.note}</p> : <small>Saved {new Date(item.createdAt).toLocaleDateString()}</small>}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                <Bookmark size={24} />
                <div><strong>No bookmarks yet</strong><p>Save articles, characters, media, merchandise or events and they will appear here.</p></div>
                <Link to="/explore">Explore content</Link>
              </div>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="panel-head"><h2>Favorite fandoms</h2><Link to="/profile">Edit</Link></div>
            <div className="fandom-pills">{data.user.favoriteFandoms?.map(f => <Link key={f} to={`/search?q=${encodeURIComponent(f)}`}>{f}</Link>)}</div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-head"><h2>Submission status</h2><Link to="/submissions">View all</Link></div>
            <div className="submission-mini-list">
              {data.submissions.length ? data.submissions.map(x => (
                <div key={x._id}><CheckCircle2 /><span><strong>{x.title}</strong><small className={`status-badge ${x.status}`}>{x.status}</small></span></div>
              )) : <p>No submissions yet. <Link to="/submit-content">Share something with the community.</Link></p>}
            </div>
          </section>
        </div>
      </section>
    </PageTransition>
  );
}
