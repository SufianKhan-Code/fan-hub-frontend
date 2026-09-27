import { Activity, Bot, Boxes, CalendarDays, FileCheck2, MessageSquare, PackageSearch, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Spinner } from '../../components/common/Loading';
import PageTransition from '../../components/common/PageTransition';

const metricDefs = [
  ['activeUsers7d', 'Active users · 7d', Activity, '/admin/analytics'],
  ['totalUsers', 'Registered users', Users, '/admin/users'],
  ['totalContent', 'Content', Boxes, '/admin/content'],
  ['totalMedia', 'Media', Sparkles, '/admin/media'],
  ['totalEvents', 'Events', CalendarDays, '/admin/events'],
  ['totalMerchandise', 'Merchandise', PackageSearch, '/admin/merchandise'],
  ['pendingSubmissions', 'Pending submissions', FileCheck2, '/admin/submissions'],
  ['chatbotQueries7d', 'Chatbot queries · 7d', Bot, '/admin/analytics']
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(({ data: response }) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><Spinner label="Loading curator console…" /></div>;
  if (!data) return null;

  const maxPopularity = Math.max(...data.categoryBreakdown.map((item) => item.popularityValue || 0), 1);

  return (
    <PageTransition>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">ADMIN CONTROL PANEL</span>
          <h1>Fandom Universe overview</h1>
          <p>Manage content, moderation, users and platform knowledge from one protected workspace.</p>
        </div>
        <Link className="button primary" to="/">View live site</Link>
      </div>

      <div className="admin-metrics">
        {metricDefs.map(([key, label, Icon, to]) => (
          <Link key={key} to={to}>
            <span><Icon /></span>
            <div><strong>{data.metrics[key] ?? 0}</strong><small>{label}</small></div>
          </Link>
        ))}
      </div>

      <div className="admin-insight-strip">
        <article>
          <Activity />
          <div><strong>{data.metrics.activeUsers24h ?? 0}</strong><span>Active users today</span></div>
        </article>
        <article>
          <Bot />
          <div><strong>{data.metrics.chatbotQueries24h ?? 0}</strong><span>Chatbot queries today</span></div>
        </article>
        <article>
          <MessageSquare />
          <div><strong>{data.metrics.pendingFeedback ?? 0}</strong><span>Feedback awaiting review</span></div>
        </article>
      </div>

      <div className="admin-grid">
        <section className="admin-panel span-two">
          <div className="panel-head">
            <div><h2>Popular categories</h2><small>Ranked by tracked audience views</small></div>
            <Link to="/admin/analytics">Full analytics</Link>
          </div>
          <div className="bar-list popularity-bars">
            {data.categoryBreakdown.map((item) => (
              <div key={item.slug}>
                <span>{item.name}</span>
                <div><i style={{ width: `${Math.max(4, (item.popularityValue / maxPopularity) * 100)}%`, background: item.color }} /></div>
                <strong>{item.totalViews}</strong>
                <small>views</small>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-head"><h2>Top content</h2></div>
          <div className="rank-list">
            {data.topContent.map((item, index) => (
              <div key={item._id}>
                <b>0{index + 1}</b>
                <span><strong>{item.title}</strong><small>{item.fandom}</small></span>
                <em>{item.viewCount ?? 0}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="panel-head"><h2>Recent activity</h2></div>
          <div className="activity-list compact">
            {data.recentActivities.map((item) => (
              <div key={item._id}>
                <span className="activity-dot" />
                <div>
                  <strong>{item.title || item.action}</strong>
                  <p>{item.details}</p>
                  <small>{item.user?.name || 'System'} · {new Date(item.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
