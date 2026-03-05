import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api';
import { getImageUrl } from '../api';
import { FiArrowLeft, FiClock, FiCalendar, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = ['All', 'Tech', 'Tutorial', 'Opinion', 'Career'];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getArticles()
      .then(res => setArticles(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <Navbar />
      <div className="articles-page">
        {/* Hero Banner */}
        <section className="articles-hero">
          <div className="articles-hero__bg" />
          <div className="container">
            <Link to="/" className="articles-hero__back">
              <FiArrowLeft size={16} /> Back to Portfolio
            </Link>
            <div className="articles-hero__content">
              <span className="articles-hero__badge">
                <FiBookOpen size={14} /> Blog & Insights
              </span>
              <h1 className="articles-hero__title">
                Articles & <span className="gradient-text">Thoughts</span>
              </h1>
              <p className="articles-hero__desc">
                Sharing knowledge about software engineering, web development, and the tech industry.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="articles-content section">
          <div className="container">
            {/* Category Filters */}
            <div className="articles-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`articles-filter-pill ${activeCategory === cat ? 'articles-filter-pill--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="articles-loading">
                <div className="articles-loading__spinner" />
                <p>Loading articles...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="articles-empty">
                <div className="articles-empty__icon">📝</div>
                <h3>No Articles Yet</h3>
                <p>Articles will appear here once published. Stay tuned!</p>
              </div>
            ) : (
              <div className="articles-grid--medium">
                {filtered.map(article => (
                  <Link
                    to={`/articles/${article.slug}`}
                    className="article-card--medium"
                    key={article._id}
                  >
                    <div className="article-card__body--medium">
                      
                      {/* Author Meta */}
                      <div className="article-card__meta-author">
                        <img src="/WhatsApp Image 2026-02-24 at 9.28.02 PM.jpeg" alt="Author" />
                        <span>Adnan Kader Mitul</span>
                      </div>

                      <h3 className="article-card__title--medium">{article.title}</h3>
                      <p className="article-card__excerpt--medium">{article.excerpt}</p>
                      
                      {/* Bottom Meta */}
                      <div className="article-card__meta-bottom">
                        <span>
                          {new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                        <span>·</span>
                        <span>{article.readTime} read</span>
                        <span>·</span>
                        <span style={{ 
                          background: 'rgba(150,150,150,0.1)', 
                          padding: '2px 8px', 
                          borderRadius: '10px',
                          color: 'inherit'
                        }}>
                          {article.category}
                        </span>
                      </div>

                    </div>

                    {/* Right side cover image */}
                    <div className="article-card__image-container--medium">
                      {article.coverImage ? (
                        <img src={getImageUrl(article.coverImage)} alt={article.title} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ta-surface)' }}>
                          <FiBookOpen size={24} color="var(--muted-fg)" />
                        </div>
                      )}
                    </div>
                    
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
