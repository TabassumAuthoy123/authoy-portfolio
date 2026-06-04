import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug, getImageUrl } from '../api';
import { FiArrowLeft, FiClock, FiCalendar, FiShare2 } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticleBySlug(slug)
      .then(res => setArticle(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="article-detail-loading">
          <div className="articles-loading__spinner" />
          <p>Loading article...</p>
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="article-detail-empty">
          <h2>Article Not Found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/articles" className="btn btn--primary">← Back to Articles</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article className="article-detail">
        {/* Header content and Author Block */}
        <div className="medium-reading-width" style={{ padding: '0 20px' }}>
          <header className="article-detail__header--medium">
            <Link to="/articles" className="articles-hero__back" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '20px', textDecoration: 'none' }}>
              <FiArrowLeft size={16} /> All Articles
            </Link>
            
            <h1 className="article-detail__title--medium">{article.title}</h1>
            <p className="article-detail__subtitle--medium">{article.excerpt}</p>
            
            <div className="article-detail__author-block">
              {/* Dummy author avatar, can be replaced by profile data if needed */}
              <img src="/WhatsApp Image 2026-02-24 at 9.28.02 PM.jpeg" alt="Author" className="article-detail__author-avatar" />
              
              <div className="article-detail__author-info">
                <h4>Tabassum Authoy</h4>
                <div className="article-detail__author-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {article.readTime} read
                  </span>
                  <span>·</span>
                  <span>
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="article-detail__author-actions">
                <button className="article-detail__action-btn" onClick={handleShare} title="Share">
                  <FiShare2 size={20} />
                </button>
              </div>
            </div>
          </header>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="article-detail__cover--medium">
            <img src={getImageUrl(article.coverImage)} alt={article.title} />
          </div>
        )}

        {/* Content */}
        <div className="medium-reading-width" style={{ padding: '0 20px' }}>
          <div
            className="article-detail__content--medium"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Bottom CTA */}
        <div className="medium-reading-width" style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
          <Link to="/articles" className="nav__action-pill">
            <FiArrowLeft size={16} /> More Articles
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
