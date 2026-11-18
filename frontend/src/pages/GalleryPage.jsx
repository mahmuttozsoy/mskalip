import { useState, useEffect } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Video } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';

// Built-in fallback list of the 148 photos & 14 videos in /uploads
const FALLBACK_VIDEOS = Array.from({ length: 14 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: 1000 + i + 1,
    file_name: `sah-video-${num}.mp4`,
    original_name: `MŞ Group Şantiye Saha Videosu #${i + 1}`,
    file_path: `/uploads/videos/sah-video-${num}.mp4`,
    file_type: 'video',
  };
});

const FALLBACK_IMAGES = Array.from({ length: 148 }, (_, i) => {
  const num = String(i + 1).padStart(3, '0');
  return {
    id: i + 1,
    file_name: `sah-photo-${num}.jpg`,
    original_name: `MŞ Group Saha & Proje Fotoğrafı #${i + 1}`,
    file_path: `/uploads/images/sah-photo-${num}.jpg`,
    thumbnail_path: `/uploads/images/sah-photo-${num}.jpg`,
    file_type: 'image',
  };
});

export default function GalleryPage() {
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get('/media?limit=250')
      .then((r) => {
        const list = r.data.media || [];
        if (list.length > 0) {
          setAllMedia(list);
        } else {
          setAllMedia([...FALLBACK_VIDEOS, ...FALLBACK_IMAGES]);
        }
      })
      .catch(() => {
        setAllMedia([...FALLBACK_VIDEOS, ...FALLBACK_IMAGES]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!lightbox.open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox({ open: false, index: 0 });
      if (e.key === 'ArrowLeft') {
        setLightbox((l) => {
          const imgs = allMedia.filter((m) => m.file_type === 'image');
          return { ...l, index: (l.index - 1 + imgs.length) % imgs.length };
        });
      }
      if (e.key === 'ArrowRight') {
        setLightbox((l) => {
          const imgs = allMedia.filter((m) => m.file_type === 'image');
          return { ...l, index: (l.index + 1) % imgs.length };
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox.open, allMedia]);

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;
    return `/${path.replace(/^\/+/, '')}`;
  };

  const images = allMedia.filter((m) => m.file_type === 'image');
  const videos = allMedia.filter((m) => m.file_type === 'video');

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingTop: '140px',
          paddingBottom: '70px',
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, #0f0f23 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/uploads/images/sah-photo-067.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>
            Galeri & Saha Arşivi
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '12px',
            }}
          >
            Proje <span style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>&amp;</span> Şantiye{' '}
            <span style={{ color: 'var(--color-primary)' }}>Galerimiz</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '640px', fontSize: '1.05rem' }}>
            Şantiyelerimizden {images.length} fotoğraf ve {videos.length} uygulama videosu ile çalışmalarımızı yakından inceleyin.
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Tümü ({allMedia.length})
            </button>
            <button
              className={`filter-btn ${filter === 'video' ? 'active' : ''}`}
              onClick={() => setFilter('video')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Video size={16} /> Videolar ({videos.length})
            </button>
            <button
              className={`filter-btn ${filter === 'image' ? 'active' : ''}`}
              onClick={() => setFilter('image')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <ImageIcon size={16} /> Fotoğraflar ({images.length})
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--color-gray)' }}>Yükleniyor...</div>
          ) : (
            <>
              {/* Videos Section */}
              {(filter === 'all' || filter === 'video') && videos.length > 0 && (
                <div style={{ marginBottom: filter === 'all' ? '56px' : '0' }}>
                  {filter === 'all' && (
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.8rem',
                        color: 'var(--color-secondary)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <Play size={22} color="var(--color-primary)" /> Şantiye & Uygulama Videoları ({videos.length})
                    </h2>
                  )}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {videos.map((vid, idx) => (
                      <div
                        key={vid.id}
                        style={{
                          background: 'var(--color-secondary)',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-md)',
                          border: '1px solid rgba(184,134,11,0.2)',
                        }}
                      >
                        <div style={{ aspectRatio: '16/10', background: '#000' }}>
                          <video
                            src={getMediaUrl(vid.file_path)}
                            controls
                            preload="metadata"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '14px 16px' }}>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-primary)',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              marginBottom: '4px',
                            }}
                          >
                            Saha Videosu #{idx + 1}
                          </div>
                          <div style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                            {vid.original_name || `MŞ Group Saha Videosu #${idx + 1}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos Section */}
              {(filter === 'all' || filter === 'image') && images.length > 0 && (
                <div>
                  {filter === 'all' && (
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.8rem',
                        color: 'var(--color-secondary)',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <ImageIcon size={22} color="var(--color-primary)" /> Şantiye & Proje Fotoğrafları ({images.length})
                    </h2>
                  )}
                  <div className="gallery-grid">
                    {images.slice(0, visibleCount).map((item, i) => (
                      <div
                        key={item.id}
                        className="gallery-item"
                        onClick={() => setLightbox({ open: true, index: i })}
                      >
                        <img
                          src={getMediaUrl(item.thumbnail_path || item.file_path)}
                          alt={item.original_name || `Fotoğraf ${i + 1}`}
                          loading="lazy"
                        />
                        <div className="gallery-item-overlay">
                          <div className="gallery-zoom-btn">
                            <ZoomIn size={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {visibleCount < images.length && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => setVisibleCount((c) => Math.min(images.length, c + 24))}
                      >
                        Daha Fazla Fotoğraf Göster ({visibleCount} / {images.length})
                      </button>
                      <button
                        className="btn btn-dark"
                        onClick={() => setVisibleCount(images.length)}
                      >
                        Tümünü Göster ({images.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightbox.open && images[lightbox.index] && (
        <div className="lightbox-overlay" onClick={() => setLightbox({ open: false, index: 0 })}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox({ open: false, index: 0 })}>
              <X size={18} />
            </button>
            <img src={getMediaUrl(images[lightbox.index]?.file_path)} alt="" />
            <div
              style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                marginTop: '10px',
                fontSize: '13px',
              }}
            >
              {lightbox.index + 1} / {images.length} — {images[lightbox.index]?.original_name}
            </div>
            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={() => setLightbox((l) => ({ ...l, index: (l.index - 1 + images.length) % images.length }))}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="lightbox-nav lightbox-next"
                  onClick={() => setLightbox((l) => ({ ...l, index: (l.index + 1) % images.length }))}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
