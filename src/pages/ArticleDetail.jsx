import { CalendarDays, Clock3, Eye } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PageTransition from '../components/common/PageTransition';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { BookmarkButton, ShareButton } from '../components/common/Actions';
import { ArticleCard } from '../components/cards/Cards';
import { Spinner } from '../components/common/Loading';

const inlineTokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*[^*]+\*)/g;

function renderInline(text) {
  return String(text || '')
    .split(inlineTokenPattern)
    .filter(Boolean)
    .map((token, index) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={index}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={index}>{token.slice(1, -1)}</em>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return <code key={index}>{token.slice(1, -1)}</code>;
      }
      const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (link) {
        return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
      }
      return <Fragment key={index}>{token}</Fragment>;
    });
}

function htmlInlineToMarkdown(node) {
  if (node.nodeType === 3) return node.textContent || '';
  if (node.nodeType !== 1) return '';

  const tag = node.tagName.toLowerCase();
  const children = Array.from(node.childNodes).map(htmlInlineToMarkdown).join('');

  if (tag === 'strong' || tag === 'b') return `**${children}**`;
  if (tag === 'em' || tag === 'i') return `*${children}*`;
  if (tag === 'code') return `\`${children}\``;
  if (tag === 'a') {
    const href = node.getAttribute('href');
    return href ? `[${children}](${href})` : children;
  }
  if (tag === 'br') return '\n';
  return children;
}

function normalizeLegacyHtml(content) {
  const source = String(content || '').trim();
  if (!/<[a-z][\s\S]*>/i.test(source)) return source;

  if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
    return source
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<h1[^>]*>/gi, '# ')
      .replace(/<h2[^>]*>/gi, '## ')
      .replace(/<h3[^>]*>/gi, '### ')
      .replace(/<h4[^>]*>/gi, '### ')
      .replace(/<\/h[1-4]>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .trim();
  }

  const doc = new window.DOMParser().parseFromString(`<div id="article-root">${source}</div>`, 'text/html');
  const root = doc.getElementById('article-root');
  if (!root) return source;

  const output = [];

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === 3) {
      const text = node.textContent?.trim();
      if (text) output.push(text);
      return;
    }
    if (node.nodeType !== 1) return;

    const tag = node.tagName.toLowerCase();
    const inline = () => Array.from(node.childNodes).map(htmlInlineToMarkdown).join('').trim();

    if (/^h[1-4]$/.test(tag)) {
      const level = Math.min(Number(tag.slice(1)), 3);
      output.push(`${'#'.repeat(level)} ${inline()}`);
      return;
    }

    if (tag === 'p') {
      output.push(inline());
      return;
    }

    if (tag === 'blockquote') {
      output.push(`> ${inline()}`);
      return;
    }

    if (tag === 'hr') {
      output.push('---');
      return;
    }

    if (tag === 'img') {
      const src = node.getAttribute('src');
      const alt = node.getAttribute('alt') || 'Article visual';
      if (src) output.push(`![${alt}](${src})`);
      return;
    }

    if (tag === 'figure') {
      const image = node.querySelector('img');
      if (image?.getAttribute('src')) {
        const caption = node.querySelector('figcaption')?.textContent?.trim();
        const alt = image.getAttribute('alt') || caption || 'Article visual';
        output.push(`![${alt}](${image.getAttribute('src')}${caption ? ` "${caption}"` : ''})`);
      }
      return;
    }

    if (tag === 'ul' || tag === 'ol') {
      Array.from(node.children).forEach((child, index) => {
        if (child.tagName?.toLowerCase() !== 'li') return;
        const item = Array.from(child.childNodes).map(htmlInlineToMarkdown).join('').trim();
        output.push(tag === 'ol' ? `${index + 1}. ${item}` : `- ${item}`);
      });
      return;
    }

    const fallback = inline();
    if (fallback) output.push(fallback);
  });

  return output.filter(Boolean).join('\n\n');
}

function RichArticleContent({ content }) {
  const normalized = useMemo(() => normalizeLegacyHtml(content), [content]);
  const lines = normalized.replace(/\r/g, '').split('\n');
  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
    if (image) {
      flushParagraph();
      blocks.push({ type: 'image', alt: image[1] || 'Article visual', url: image[2], caption: image[3] || image[1] });
      continue;
    }

    if (/^---+$/.test(line)) {
      flushParagraph();
      blocks.push({ type: 'divider' });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      const quote = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('> ')) {
        i += 1;
        quote.push(lines[i].trim().slice(2));
      }
      blocks.push({ type: 'quote', text: quote.join(' ') });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const items = [line.replace(/^[-*]\s+/, '')];
      while (i + 1 < lines.length && /^[-*]\s+/.test(lines[i + 1].trim())) {
        i += 1;
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const items = [line.replace(/^\d+\.\s+/, '')];
      while (i + 1 < lines.length && /^\d+\.\s+/.test(lines[i + 1].trim())) {
        i += 1;
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    paragraph.push(line);
  }
  flushParagraph();

  return (
    <div className="article-rich-content">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const Tag = block.level === 1 ? 'h2' : block.level === 2 ? 'h3' : 'h4';
          return <Tag key={index}>{renderInline(block.text)}</Tag>;
        }
        if (block.type === 'quote') return <blockquote key={index}>{renderInline(block.text)}</blockquote>;
        if (block.type === 'divider') return <hr key={index}/>;
        if (block.type === 'image') {
          return (
            <figure className="article-inline-image" key={index}>
              <img src={block.url} alt={block.alt}/>
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }
        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';
          return <ListTag key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ListTag>;
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/articles/${id}`)
      .then(({ data }) => {
        setItem(data.data);
        setRelated(data.related || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><Spinner/></div>;
  if (!item) return <section className="section container"><h1>Article not found</h1></section>;

  return (
    <PageTransition>
      <article className="article-detail article-detail-modern">
        <div className="container article-head">
          <Breadcrumbs items={[{ label: 'Articles', to: '/articles' }, { label: item.title }]}/>
          <span className="eyebrow">{item.category?.name || item.fandom}</span>
          <h1>{item.title}</h1>
          <p className="article-summary">{item.summary}</p>

          <div className="article-byline">
            <img src={item.authorAvatar} alt=""/>
            <div className="article-author-copy">
              <strong>{item.authorName}</strong>
              <span>{item.authorRole}</span>
            </div>
            <span><Clock3 size={15}/>{item.readTime}</span>
            <span><CalendarDays size={15}/>{new Date(item.publishedAt).toLocaleDateString()}</span>
            <span><Eye size={15}/>{item.viewCount}</span>
            <div className="article-head-actions">
              <BookmarkButton targetType="article" item={item}/>
              <ShareButton title={item.title}/>
            </div>
          </div>
        </div>

        <div className="container article-cover-wrap">
          <div className="article-cover">
            <img src={item.coverImage} alt={item.title}/>
            <div className="article-cover-shade"/>
          </div>
        </div>

        <div className="container article-body">
          <div className="prose-card article-prose article-reading-card">
            <div className="article-reading-label">
              <span>FEATURE STORY</span>
              <i/>
            </div>

            <RichArticleContent content={item.content}/>

            {item.eventTimelineHighlights?.length > 0 && (
              <section className="timeline article-timeline">
                <div className="timeline-heading">
                  <span className="eyebrow">STORY TIMELINE</span>
                  <h2>Timeline highlights</h2>
                  <p>Key moments and milestones connected to this story.</p>
                </div>
                {item.eventTimelineHighlights.map((t, i) => (
                  <div className="timeline-item" key={`${t.year}-${t.title}-${i}`}>
                    <span>{t.year}</span>
                    <div>
                      <h3>{t.title}</h3>
                      <p>{t.description}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section container article-related-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">READ NEXT</span>
              <h2>More from this universe</h2>
            </div>
          </div>
          <div className="article-grid">{related.map((x) => <ArticleCard key={x._id} item={x}/>)}</div>
        </section>
      )}
    </PageTransition>
  );
}
