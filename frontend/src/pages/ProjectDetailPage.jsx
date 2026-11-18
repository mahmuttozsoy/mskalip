import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Maximize2, CheckCircle, ArrowLeft, Phone,
  ZoomIn, X, ChevronLeft, ChevronRight, Building2, Share2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import { getFallbackProjectBySlug } from '../lib/fallbackData';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const statusLabels = {
  tamamlandi: { label: 'Tamamlandı', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  devam_ediyor: { label: 'Devam Ediyor', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  planlama: { label: 'Planlama Aşamasında', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api
      .get(`/projects/${slug}`)
      .then((res) => {
        setProject(res.data.project || getFallbackProjectBySlug(slug));
        setActiveImage(0);
      })
      .catch(() => {
        setProject(getFallbackProjectBySlug(slug));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const getImgUrl = (path) => {
    if (!path) return '/uploads/images/sah-photo-067.jpg';
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;
    return `/${path.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-secondary)',
            color: 'white',
          }}
        >
          Proje detayları yükleniyor...
        </div>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-off-white)',
            padding: '120px 24px 60px',
            textAlign: 'center',
          }}
        >
          <Building2 size={64} color="var(--color-primary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-secondary)', marginBottom: '12px' }}>
            Proje Bulunamadı
          </h1>
          <p style={{ color: 'var(--color-gray)', marginBottom: '24px' }}>
            Aradığınız proje kaldırılmış veya adresi değişmiş olabilir.
          </p>
          <Link to="/projeler" className="btn btn-primary">
            <ArrowLeft size={16} /> Tüm Projelere Dön
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const mediaList = project.media || [];
  const images = mediaList.filter((m) => m.file_type === 'image');
  const videos = mediaList.filter((m) => m.file_type === 'video');
  const mainCover =
    images[activeImage]?.file_path ||
    images[0]?.file_path ||
    '/uploads/images/sah-photo-067.jpg';

  const statusInfo = statusLabels[project.status] || statusLabels.tamamlandi;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Proje bağlantısı kopyalandı!');
    }
  };

  return (
    <>
      <Navbar />

      {/* Header Banner */}
      <div
        style={{
          paddingTop: '130px',
          paddingBottom: '60px',
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, #0f0f23 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${getImgUrl(mainCover)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            filter: 'blur(4px)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link
            to="/projeler"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            <ArrowLeft size={16} /> Projelere Dön
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            {project.category_name && (
              <span className="section-tag" style={{ marginBottom: 0 }}>
                {project.category_name}
              </span>
            )}
            <span
              style={{
                background: statusInfo.bg,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.color}40`,
                padding: '6px 16px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {statusInfo.label}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '16px',
            }}
          >
            {project.title}
          </h1>

          {project.short_description && (
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '750px', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {project.short_description}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div className="project-detail-grid">
            {/* Left Column: Gallery & Description */}
            <div className="project-detail-main">
              {/* Main Showcase Image */}
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  background: '#111',
                  aspectRatio: '16/10',
                  position: 'relative',
                  marginBottom: '16px',
                  cursor: images.length > 0 ? 'pointer' : 'default',
                }}
                onClick={() => images.length > 0 && setLightbox({ open: true, index: activeImage })}
              >
                <img
                  src={getImgUrl(mainCover)}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/uploads/images/sah-photo-067.jpg';
                  }}
                />
                {images.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      background: 'rgba(26,26,46,0.85)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '50px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ZoomIn size={15} color="var(--color-primary)" /> Büyüt ({activeImage + 1}/{images.length})
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '12px',
                    marginBottom: '36px',
                  }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => setActiveImage(idx)}
                      style={{
                        aspectRatio: '4/3',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: activeImage === idx ? '3px solid var(--color-primary)' : '3px solid transparent',
                        opacity: activeImage === idx ? 1 : 0.65,
                        transition: 'var(--transition)',
                      }}
                    >
                      <img
                        src={getImgUrl(img.thumbnail_path || img.file_path)}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Project Description */}
              <div
                style={{
                  background: 'white',
                  padding: '36px',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '32px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    color: 'var(--color-secondary)',
                    marginBottom: '16px',
                  }}
                >
                  Proje Hakkında
                </h2>
                <div className="divider" style={{ margin: '0 0 24px 0' }} />
                <div
                  style={{
                    color: 'var(--color-dark-gray)',
                    lineHeight: 1.8,
                    fontSize: '15px',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {project.description ||
                    project.short_description ||
                    'Bu proje MŞ Group İnşaat & Mimarlık kalite standartlarına uygun olarak modern mühendislik ve mimari çözümlerle hayata geçirilmiştir.'}
                </div>
              </div>

              {/* Project Videos if any */}
              {videos.length > 0 && (
                <div
                  style={{
                    background: 'white',
                    padding: '36px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      color: 'var(--color-secondary)',
                      marginBottom: '20px',
                    }}
                  >
                    Proje Videoları
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {videos.map((vid) => (
                      <video
                        key={vid.id}
                        src={getImgUrl(vid.file_path)}
                        controls
                        style={{ width: '100%', borderRadius: 'var(--radius-md)', background: '#000' }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Project Info Card */}
            <div>
              <div
                style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)',
                  borderTop: '4px solid var(--color-primary)',
                  position: 'sticky',
                  top: '100px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-secondary)' }}>
                    Proje Künyesi
                  </h3>
                  <button
                    onClick={handleShare}
                    title="Paylaş"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--color-off-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      paddingBottom: '14px',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(184,134,11,0.1)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Kategori</div>
                      <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '14px' }}>
                        {project.category_name || 'İnşaat & Mimarlık'}
                      </div>
                    </div>
                  </div>

                  {project.location && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(184,134,11,0.1)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Konum</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '14px' }}>
                          {project.location}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.year && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(184,134,11,0.1)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Proje Yılı</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '14px' }}>
                          {project.year}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.area && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        paddingBottom: '14px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(184,134,11,0.1)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Maximize2 size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>İnşaat Alanı</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-secondary)', fontSize: '14px' }}>
                          {Number(project.area).toLocaleString('tr-TR')} m²
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(184,134,11,0.1)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray)' }}>Proje Durumu</div>
                      <div style={{ fontWeight: 700, color: statusInfo.color, fontSize: '14px' }}>
                        {statusInfo.label}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--color-secondary)',
                    padding: '24px',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '8px' }}>
                    Benzer Bir Proje mi Planlıyorsunuz?
                  </h4>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                    Uzman mimar ve mühendis ekibimizle ücretsiz keşif için hemen iletişime geçin.
                  </p>
                  <Link
                    to="/iletisim"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '14px' }}
                  >
                    <Phone size={15} /> Teklif Alın
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox.open && images.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightbox({ open: false, index: 0 })}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox({ open: false, index: 0 })}>
              <X size={18} />
            </button>
            <img src={getImgUrl(images[lightbox.index]?.file_path)} alt={project.title} />
            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav lightbox-prev"
                  onClick={() =>
                    setLightbox((l) => ({ ...l, index: (l.index - 1 + images.length) % images.length }))
                  }
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
