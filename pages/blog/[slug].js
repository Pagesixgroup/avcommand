import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '../../lib/posts';

function renderMarkdown(content) {
  if (!content) return null;
  const lines = content.split('\n');
  const elements = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = String(lines[i] || '');

    if (line.match(/^-{3,}$/)) {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #1a1a1a', margin: '32px 0' }} />);
      i++; continue;
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontSize: 22, color: '#fff', letterSpacing: 1, marginTop: 40, marginBottom: 16, fontFamily: 'Courier New, monospace', fontWeight: 700 }}>{line.slice(3)}</h2>);
      i++; continue;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} style={{ fontSize: 15, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase', marginTop: 28, marginBottom: 12, fontFamily: 'Courier New, monospace' }}>{line.slice(4)}</h3>);
      i++; continue;
    }

    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && String(lines[i] || '').startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter(r => !String(r).match(/^\|[\s\-|]+\|$/));
      elements.push(
        <div key={key++} style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Courier New, monospace' }}>
            <tbody>
              {rows.map((row, ri) => {
                const cells = String(row).split('|').slice(1, -1);
                return (
                  <tr key={ri} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    {cells.map((cell, ci) => (
                      <td key={ci} style={{ padding: '10px 14px', color: ri === 0 ? '#00ff88' : '#999', fontSize: ri === 0 ? 10 : 13, letterSpacing: ri === 0 ? 2 : 0, textTransform: ri === 0 ? 'uppercase' : 'none', background: ri === 0 ? 'rgba(0,255,136,0.05)' : 'transparent' }}>
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && String(lines[i] || '').startsWith('- ')) {
        items.push(String(lines[i]).slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} style={{ margin: '12px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item, li) => (
            <li key={li} style={{ fontSize: 14, color: '#888', lineHeight: 1.65, display: 'flex', gap: 10 }}>
              <span style={{ color: '#00ff88', flexShrink: 0 }}>▸</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === '') { i++; continue; }

    const renderInline = (text) => {
      const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
      return parts.map((part, pi) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={pi} style={{ color: '#fff' }}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={pi} style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '1px 6px', borderRadius: 4, fontSize: '0.9em', fontFamily: 'Courier New, monospace' }}>{part.slice(1, -1)}</code>;
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith('http');
          return isExternal
            ? <a key={pi} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#00ff88', textDecoration: 'underline' }}>{linkMatch[1]}</a>
            : <Link key={pi} href={linkMatch[2]} style={{ color: '#00ff88', textDecoration: 'underline' }}>{linkMatch[1]}</Link>;
        }
        return part;
      });
    };

    elements.push(<p key={key++} style={{ fontSize: 14, color: '#888', lineHeight: 1.8, marginBottom: 16 }}>{renderInline(line)}</p>);
    i++;
  }

  return elements;
}

export default function BlogPost({ post }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e0e0e0', fontFamily: 'Courier New, monospace' }}>
      <Head>
        <title>{post.title} — AV-Command</title>
        <meta name="description" content={post.description} />
      </Head>
      <style>{`body { margin: 0; } a { text-decoration: none; }`}</style>
      <nav style={{ borderBottom: '1px solid #1a1a1a', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚡</div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: '#fff', textTransform: 'uppercase' }}>AV-Command</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/blog" style={{ fontSize: 10, letterSpacing: 2, color: '#555', textTransform: 'uppercase' }}>← Blog</Link>
          <Link href="https://avcommand.gumroad.com/l/AV-Command-Pro" target="_blank" style={{ fontSize: 10, letterSpacing: 2, padding: '7px 16px', background: '#00ff88', color: '#000', borderRadius: 6, textTransform: 'uppercase', fontWeight: 700 }}>Get Pro</Link>
        </div>
      </nav>
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '60px 40px 100px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {(post.tags || []).map(tag => (
            <span key={tag} style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 4, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase' }}>{tag}</span>
          ))}
        </div>
        <h1 style={{ fontSize: 30, color: '#fff', letterSpacing: 1, marginBottom: 16, lineHeight: 1.3, fontWeight: 700 }}>{post.title}</h1>
        <div style={{ fontSize: 10, color: '#333', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid #1a1a1a' }}>{post.date}</div>
        <div>{renderMarkdown(post.content)}</div>
        <div style={{ marginTop: 60, padding: '28px 32px', background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#00ff88', textTransform: 'uppercase', marginBottom: 8 }}>⚡ AV-Command Pro</div>
          <div style={{ fontSize: 15, color: '#fff', marginBottom: 8, fontWeight: 600 }}>Need commands for a different device?</div>
          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.65, marginBottom: 20 }}>AV-Command generates RS-232 command strings, serial port settings, and Crestron SIMPL+ code for hundreds of AV devices instantly.</div>
          <Link href="https://avcommand.gumroad.com/l/AV-Command-Pro" target="_blank" style={{ display: 'inline-block', padding: '10px 22px', background: '#00ff88', color: '#000', borderRadius: 8, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Get Pro Access — $5.99/mo →</Link>
        </div>
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  return { paths: posts.map(post => ({ params: { slug: post.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  return { props: { post } };
}
