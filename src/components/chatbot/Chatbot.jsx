import { Bot, ChevronRight, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../../services/api';

const getSessionId = () => {
  let id = localStorage.getItem('fanhub_chat_session');
  if (!id) { id = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('fanhub_chat_session', id); }
  return id;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', message: "Hi! I'm Nova, your fandom navigator. Ask me about anime, events, bookmarks, media, releases or how Fan Hub Plus works.", options: [] }]);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const sessionId = getSessionId();

  useEffect(() => {
    if (!open) return;
    api.get('/chatbot/history', { params: { sessionId } }).then(({ data }) => {
      if (data.data?.length) setMessages(data.data.map((m) => ({ sender: m.sender, message: m.message, options: m.options || [] })));
    }).catch(() => {});
  }, [open, sessionId]);

  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [messages, busy]);

  const send = async (e, quickText) => {
    e?.preventDefault();
    const text = (quickText ?? input).trim();
    if (!text || busy) return;
    setMessages((m) => [...m, { sender: 'user', message: text, options: [] }]);
    setInput(''); setBusy(true);
    try {
      const { data } = await api.post('/chatbot/message', { message: text, sessionId });
      setMessages((m) => [...m, { sender: 'bot', ...data.data }]);
    } catch (err) {
      setMessages((m) => [...m, { sender: 'bot', message: getErrorMessage(err, 'I could not reach the knowledge base. Please try again.'), options: [] }]);
    } finally { setBusy(false); }
  };

  const openLink = (link) => { setOpen(false); navigate(link); };

  return <>
    <button className={`chatbot-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Open Fan Hub assistant">{open ? <X/> : <MessageCircle/>}<span className="fab-pulse"/></button>
    {open && <aside className="chatbot-panel" aria-label="Nova fandom assistant">
      <header><div className="bot-avatar"><Bot/></div><div><strong>Nova</strong><span><i/> Fandom navigator</span></div><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18}/></button></header>
      <div className="chatbot-body" ref={listRef}>
        {messages.map((m, idx) => <div key={idx} className={`chat-message ${m.sender}`}><div className="message-bubble">{m.sender === 'bot' && <Sparkles size={14}/>}<p>{m.message}</p></div>{m.options?.length > 0 && <div className="chat-options">{m.options.map((o, i) => <button key={i} onClick={() => o.link ? openLink(o.link) : send(null, o.value)}>{o.label}<ChevronRight size={14}/></button>)}</div>}</div>)}
        {busy && <div className="chat-message bot"><div className="message-bubble typing"><span/><span/><span/></div></div>}
      </div>
      <form className="chat-input" onSubmit={send}><input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask Nova anything…" aria-label="Message Nova"/><button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={18}/></button></form>
    </aside>}
  </>;
}
