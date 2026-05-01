import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';

export default function BlogIndex({ posts }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e0e0e0', fontFamily: "'Courier New', monospace" }}>
      <Head>
        <title>AV Integration Blog — AVCommand</title>
        <meta name="description" content="RS-232 command references, serial control guides, and AV integration tips for professional AV integrators." />
      </Head>

      <style>{`
        body { margin: 0; }
        a { text-decoration: none; }
        .post-card:hover { border-color: rgba(0,255,136,0.3) !important; transform: translateY(-2px); }
        .back:hover { color: #00ff88 !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚡</div>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: '#fff', textTransform: 'uppercase' }}>AVCommand</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 10, letterSpacing: 2, color: '#555', textTransform: 'uppercase' }}>App</Link>
          <Link href="/landing.html" style={{ fontSize: 10, letterSpacing: 2, color: '#555', textTransform: 'uppercase' }}>About</Link>
          <Link href="https://avcommand.gumroad.com/l/AV-Command-Pro" target="_blank" style={{ fontSize: 10, letterSpacing: 2, padding: '7px 16px', background: '#00ff88', color: '#000', borderRadius: 6, textTransform: 'uppercase', fontWeight: 700 }}>Get Pro</Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 40px 40px' }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: '#00ff88', textTransform: 'uppercase', marginBottom: 12 }}>AV Integration Blog</div>
        <h1 style={{ fontSize: 36, color: '#fff', letterSpacing: 2, marginBottom: 12, fontWeight: 700 }}>RS-232 Guides & AV Control References</h1>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, maxWidth: 540 }}>
          Device-specific command references, serial control guides, and integration tips for professional AV integrators.
        </p>
      </div>

      <div style={{ height: 1, background: '#1a1a1a', maxWidth: 800, margin: '0 auto 0 auto', marginLeft: 40, marginRight: 40 }} />

      {/* Posts */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 40px 80px' }}>
        {posts.length === 0 ? (
          <div style={{ fontSize: 13, color: '#444', textAlign: 'center', padding: '60px 0' }}>No posts yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="post-card" style={{
                  background: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: 12,
                  padding: '24px 28px', cursor: 'pointer', transition: 'all 0.2s',
                  animation: `fadeIn 0.3s ${i * 0.05}s ease both`
                }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    {(post.tags || []).slice(0, 4).map(tag => (
                      <span key={tag} style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 4, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase' }}>{tag}</span>
                    ))}
                  </div>
                  <h2 style={{ fontSize: 17, color: '#fff', marginBottom: 8, fontWeight: 600, lineHeight: 1.4, letterSpacing: 0.5 }}>{post.title}</h2>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65, marginBottom: 14 }}>{post.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#333', letterSpacing: 2, textTransform: 'uppercase' }}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span style={{ fontSize: 10, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase' }}>Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}

