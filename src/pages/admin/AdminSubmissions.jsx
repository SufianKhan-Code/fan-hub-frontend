import { Check, Eye, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

const emptyDraft = {
  title: '',
  category: '',
  fandom: '',
  submissionType: 'fan_article',
  summary: '',
  content: '',
  mediaUrls: ''
};

export default function AdminSubmissions() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('pending');
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/submissions/admin', {
        params: { status: status || undefined, limit: 100 }
      });
      setItems(data.data || []);
    } catch (error) {
      setMessageType('error');
      setMessage(getErrorMessage(error));
    }
  };

  useEffect(() => {
    load();
  }, [status]);

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => setCategories([]));
  }, []);

  const openReview = (item) => {
    setActive(item);
    setFeedback(item.adminFeedback || '');
    setDraft({
      title: item.title || '',
      category: item.category?._id || item.category || '',
      fandom: item.fandom || '',
      submissionType: item.submissionType || 'fan_article',
      summary: item.summary || '',
      content: item.content || '',
      mediaUrls: (item.mediaUrls || []).join('\n')
    });
    setMessage('');
  };

  const closeReview = () => {
    setActive(null);
    setDraft(emptyDraft);
    setFeedback('');
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveChanges = async () => {
    if (!active) return;
    setBusy(true);
    try {
      const payload = {
        ...draft,
        mediaUrls: draft.mediaUrls
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean)
      };

      const { data } = await api.put(`/submissions/${active._id}/admin`, payload);
      setActive(data.data);
      setMessageType('success');
      setMessage('Submission edits saved.');
      await load();
    } catch (error) {
      setMessageType('error');
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const moderate = async (item, nextStatus) => {
    setBusy(true);
    try {
      await api.put(`/submissions/${item._id}/moderate`, {
        status: nextStatus,
        adminFeedback: feedback
      });
      closeReview();
      setMessageType('success');
      setMessage(`Submission ${nextStatus}.`);
      await load();
    } catch (error) {
      setMessageType('error');
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const removeSubmission = async (item) => {
    const confirmed = window.confirm(`Permanently remove “${item.title}”? This cannot be undone.`);
    if (!confirmed) return;

    setBusy(true);
    try {
      await api.delete(`/submissions/${item._id}`);
      if (active?._id === item._id) closeReview();
      setMessageType('success');
      setMessage('Submission removed.');
      await load();
    } catch (error) {
      setMessageType('error');
      setMessage(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">MODERATION QUEUE</span>
          <h1>Fan submissions</h1>
          <p>Review, edit, approve, reject or remove community submissions before publication.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {message && <div className={`form-alert ${messageType}`}>{message}</div>}

      <div className="submission-admin-grid">
        {items.map((item) => (
          <article key={item._id}>
            <div className="submission-admin-head">
              <span className={`status-badge ${item.status}`}>{item.status}</span>
              <small>{item.submissionType?.replace('_', ' ')}</small>
            </div>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="submission-author">
              <strong>{item.user?.name}</strong>
              <span>{item.fandom} · {item.category?.name}</span>
            </div>
            <div className="table-actions">
              <button className="button ghost small" onClick={() => openReview(item)}>
                <Eye size={15} /> Review / edit
              </button>
              <button
                className="danger-icon"
                title="Remove submission"
                disabled={busy}
                onClick={() => removeSubmission(item)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {!items.length && <EmptyState title="No submissions in this queue" />}

      {active && (
        <div className="modal-backdrop">
          <div className="crud-modal submission-review">
            <header>
              <div>
                <span className="eyebrow">SUBMISSION REVIEW</span>
                <h2>{active.title}</h2>
              </div>
              <button className="modal-close static" onClick={closeReview}>
                <X />
              </button>
            </header>

            <div className="crud-form-grid">
              <label className="span-two">
                Title
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft('title', event.target.value)}
                />
              </label>

              <label>
                Category
                <select
                  value={draft.category}
                  onChange={(event) => updateDraft('category', event.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Fandom
                <input
                  value={draft.fandom}
                  onChange={(event) => updateDraft('fandom', event.target.value)}
                />
              </label>

              <label>
                Submission type
                <select
                  value={draft.submissionType}
                  onChange={(event) => updateDraft('submissionType', event.target.value)}
                >
                  <option value="fan_article">Fan article</option>
                  <option value="cosplay_photo">Cosplay photo</option>
                  <option value="fan_art">Fan art</option>
                  <option value="review">Review</option>
                  <option value="guide">Guide</option>
                </select>
              </label>

              <label>
                Status
                <input value={active.status} disabled />
              </label>

              <label className="span-two">
                Summary
                <textarea
                  rows="3"
                  value={draft.summary}
                  onChange={(event) => updateDraft('summary', event.target.value)}
                />
              </label>

              <label className="span-two">
                Submission content
                <textarea
                  rows="10"
                  value={draft.content}
                  onChange={(event) => updateDraft('content', event.target.value)}
                />
              </label>

              <label className="span-two">
                Media URLs — one per line
                <textarea
                  rows="3"
                  value={draft.mediaUrls}
                  onChange={(event) => updateDraft('mediaUrls', event.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label className="span-two">
                Curator feedback
                <textarea
                  rows="4"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Optional note for the creator…"
                />
              </label>
            </div>

            <footer>
              <button
                className="button danger"
                disabled={busy}
                onClick={() => removeSubmission(active)}
              >
                <Trash2 size={16} /> Remove
              </button>
              <button
                className="button ghost"
                disabled={busy}
                onClick={saveChanges}
              >
                <Save size={16} /> Save edits
              </button>
              <button
                className="button danger"
                disabled={busy}
                onClick={() => moderate(active, 'rejected')}
              >
                <X size={16} /> Reject
              </button>
              <button
                className="button primary"
                disabled={busy}
                onClick={() => moderate(active, 'approved')}
              >
                <Check size={16} /> Approve
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
