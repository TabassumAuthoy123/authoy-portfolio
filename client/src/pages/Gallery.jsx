import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGalleryItems } from '../api';
import { getImageUrl } from '../api';
import { FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiImage, FiGrid } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = ['All', 'Design', 'Photography', 'Events', 'Projects'];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  useEffect(() => {
    getGalleryItems()
      .then(res => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(i => i.category?.toLowerCase() === activeCategory.toLowerCase());

  // Flatten all images into a 1D array for the lightbox
  const lightboxImages = filtered.flatMap(item => {
    const urls = item.imageUrls?.length > 0 ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : []);
    return urls.map(url => ({ ...item, displayUrl: url }));
  });

  const openLightbox = (itemIndex) => {
    // Find the starting index in the flattened array
    let startIdx = 0;
    for (let i = 0; i < itemIndex; i++) {
      const urls = filtered[i].imageUrls?.length > 0 ? filtered[i].imageUrls : (filtered[i].imageUrl ? [filtered[i].imageUrl] : []);
      startIdx += urls.length;
    }
    setLightbox({ open: true, index: startIdx });
  };
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const navigateLightbox = (dir) => {
    setLightbox(prev => ({
      ...prev,
      index: (prev.index + dir + lightboxImages.length) % lightboxImages.length,
    }));
  };

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox.open, lightboxImages.length]);

  return (
    <>
      <Navbar />
      <div className="gallery-page">
        {/* Hero Banner */}
        <section className="gallery-hero">
          <div className="gallery-hero__bg" />
          <div className="container">
            <Link to="/" className="articles-hero__back">
              <FiArrowLeft size={16} /> Back to Portfolio
            </Link>
            <div className="gallery-hero__content">
              <span className="articles-hero__badge">
                <FiGrid size={14} /> Visual Showcase
              </span>
              <h1 className="gallery-hero__title">
                Photo <span className="gradient-text">Gallery</span>
              </h1>
              <p className="gallery-hero__desc">
                A collection of moments, designs, and visual stories from my journey.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="gallery-content section">
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

            {/* Gallery Grid */}
            {loading ? (
              <div className="articles-loading">
                <div className="articles-loading__spinner" />
                <p>Loading gallery...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="articles-empty">
                <div className="articles-empty__icon">🖼️</div>
                <h3>No Images Yet</h3>
                <p>Gallery images will appear here once uploaded. Stay tuned!</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {filtered.map((item, idx) => {
                  const urls = item.imageUrls?.length > 0 ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : []);
                  if (urls.length === 0) return null;
                  
                  return (
                    <div
                      className="gallery-card"
                      key={item._id}
                      onClick={() => openLightbox(idx)}
                    >
                      <img src={getImageUrl(urls[0])} alt={item.title} loading="lazy" />
                      {urls.length > 1 && (
                        <div className="gallery-card__multi-indicator">
                          <FiImage size={14} /> +{urls.length - 1}
                        </div>
                      )}
                      <div className="gallery-card__overlay">
                        <span className="gallery-card__category">{item.category}</span>
                        <h4 className="gallery-card__title">{item.title}</h4>
                        {item.description && (
                          <p className="gallery-card__desc">{item.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {lightbox.open && lightboxImages[lightbox.index] && (
          <div className="lightbox" onClick={closeLightbox}>
            <div className="lightbox__content" onClick={e => e.stopPropagation()}>
              <button className="lightbox__close" onClick={closeLightbox}>
                <FiX size={24} />
              </button>
              <button className="lightbox__nav lightbox__nav--prev" onClick={() => navigateLightbox(-1)}>
                <FiChevronLeft size={28} />
              </button>
              <img
                src={getImageUrl(lightboxImages[lightbox.index].displayUrl)}
                alt={lightboxImages[lightbox.index].title}
                className="lightbox__image"
              />
              <button className="lightbox__nav lightbox__nav--next" onClick={() => navigateLightbox(1)}>
                <FiChevronRight size={28} />
              </button>
              <div className="lightbox__info">
                <h3>{lightboxImages[lightbox.index].title}</h3>
                {lightboxImages[lightbox.index].description && (
                  <p>{lightboxImages[lightbox.index].description}</p>
                )}
                <span className="lightbox__counter">
                  {lightbox.index + 1} / {lightboxImages.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
