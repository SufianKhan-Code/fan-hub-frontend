import { Activity, BarChart3, Bot, MessageCircle, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/common/Loading';

const TrendBars = ({ data = [], suffix = '' }) => {
  const max = Math.max(...data.map((item) => item.value || 0), 1);
  return (
    <div className="analytics-trend" aria-label="Seven day trend">
      {data.map((item) => (
        <div className="analytics-trend-column" key={item.date}>
          <strong>{item.value}</strong>
          <div className="analytics-trend-track"><i style={{ height: `${Math.max(8, (item.value / max) * 100)}%` }} /></div>
          <span>{item.label}</span>
          {suffix && <small>{suffix}</small>}
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data: response }) => setData(response.data));
  }, []);

  if (!data) return <div className="page-loader"><Spinner /></div>;

  const maxPopularity = Math.max(...data.categoryBreakdown.map((item) => item.popularityValue || 0), 1);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">USAGE STATISTICS</span>
          <h1>Analytics</h1>
          <p>Live database-backed statistics for active users, audience interests and chatbot interaction volume.</p>
        </div>
      </div>

      <div className="analytics-highlight-grid analytics-highlight-grid-five">
        <article><Activity /><strong>{data.metrics.activeUsers7d}</strong><span>Active users · 7d</span></article>
        <article><Users /><strong>{data.metrics.activeUsers24h}</strong><span>Active users · 24h</span></article>
        <article><MessageCircle /><strong>{data.metrics.chatbotQueries7d}</strong><span>Chatbot queries · 7d</span></article>
        <article><Bot /><strong>{data.metrics.chatbotSessions7d}</strong><span>Chat sessions · 7d</span></article>
        <article><BarChart3 /><strong>{data.metrics.totalUsers}</strong><span>Registered users</span></article>
      </div>

      <div className="admin-grid analytics-admin-grid">
        <section className="admin-panel span-two">
          <div className="panel-head">
            <div><h2>Popular categories</h2><small>Real tracked views across content, articles, media and merchandise</small></div>
          </div>
          <div className="analytics-bars analytics-popularity-bars">
            {data.categoryBreakdown.map((item, index) => (
              <div key={item.slug}>
                <div>
                  <strong><b>0{index + 1}</b> {item.name}</strong>
                  <span>{item.totalViews} views · {item.contentCount} tracked items</span>
                </div>
                <div className="analytics-track"><i style={{ width: `${Math.max(3, (item.popularityValue / maxPopularity) * 100)}%`, background: item.color }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel analytics-trend-panel">
          <div className="panel-head"><div><h2>Active users</h2><small>Unique signed-in users with recorded activity</small></div></div>
          <TrendBars data={data.activeUserTrend} />
        </section>

        <section className="admin-panel analytics-trend-panel">
          <div className="panel-head"><div><h2>Chatbot interaction volume</h2><small>User questions sent to Nova during the last 7 days</small></div></div>
          <TrendBars data={data.chatbotTrend} />
        </section>

        <section className="admin-panel">
          <h2>Top content by views</h2>
          <div className="rank-list">
            {data.topContent.map((item, index) => (
              <div key={item._id}><b>0{index + 1}</b><span><strong>{item.title}</strong><small>{item.fandom}</small></span><em>{item.viewCount ?? 0}</em></div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Top media by views</h2>
          <div className="rank-list">
            {data.topMedia.map((item, index) => (
              <div key={item._id}><b>0{index + 1}</b><span><strong>{item.title}</strong><small>{item.type}</small></span><em>{item.viewCount}</em></div>
            ))}
          </div>
        </section>

        <section className="admin-panel span-two">
          <div className="panel-head"><div><h2>Platform totals</h2><small>Operational totals for moderation and content management</small></div></div>
          <dl className="metric-dl analytics-metric-dl">
            {Object.entries(data.metrics)
              .filter(([key]) => !['activeUsers24h', 'activeUsers7d', 'chatbotQueries24h', 'chatbotQueries7d', 'chatbotSessions7d'].includes(key))
              .map(([key, value]) => (
                <div key={key}><dt>{key.replace(/([A-Z])/g, ' $1')}</dt><dd>{value}</dd></div>
              ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
