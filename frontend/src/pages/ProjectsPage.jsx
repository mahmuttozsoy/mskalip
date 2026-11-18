import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, ArrowRight, Building2, Calendar, Maximize2, Search, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import { FALLBACK_PROJECTS, FALLBACK_CATEGORIES } from '../lib/fallbackData';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const statusLabels = {
  tamamlandi: { label: 'Tamamlandı', bg: 'rgba(16, 185, 129, 0.9)', color: '#fff' },
  devam_ediyor: { label: 'Devam Ediyor', bg: 'rgba(245, 158, 11, 0.9)', color: '#fff' },
  planlama: { label: 'Planlama', bg: 'rgba(59, 130, 246, 0.9)', color: '#fff' },
};

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('kategori') || 'all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, catRes] = await Promise.all([
          api.get('/projects?limit=100').catch(() => ({ data: { projects: [] } })),
          api.get('/categories').catch(() => ({ data: { categories: [] } })),
        ]);
        setProjects(projRes.data.projects?.length ? projRes.data.projects : FALLBACK_PROJECTS);
        setCategories(catRes.data.categories?.length ? catRes.data.categories : FALLBACK_CATEGORIES);
      } catch (err) {
        console.error(err);
        setProjects(FALLBACK_PROJECTS);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('kategori');
    } else {
      searchParams.set('kategori', slug);
    }
    setSearchParams(searchParams);
  };

  const getImgUrl = (path) => {
    if (!path) return '/uploads/images/sah-photo-067.jpg';
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;
    return `/${path.replace(/^\/+/, '')}`;
  };

  const filteredProjects = projects.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category_slug === activeCategory;
    const matchStatus = activeStatus === 'all' || p.status === activeStatus;
    const matchSearch =
      !searchTerm ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <div
        style={{
          paddingTop: '140px',
          paddingBottom: '80px',
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, #0f0f23 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/uploads/images/sah-photo-089.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>
            <Star size={12} /> Portföyümüz
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              fontWeight: 800,
              color: 'white',
              marginBottom: '16px',
            }}
          >
            Seçkin <span style={{ color: 'var(--color-primary)' }}>Projelerimiz</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Modern mimari anlayışımız ve yüksek mühendislik standartlarımızla hayata geçirdiğimiz konut, ticari ve
            altyapı projelerimizi inceleyin.
          </p>
        </div>
      </div>

      {/* Filters & Projects Grid */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)', minHeight: '60vh' }}>
        <div className="container">
          {/* Search & Status Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '28px',
              background: 'white',
              padding: '16px 24px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-gray)',
                }}
              />
              <input
                type="text"
                placeholder="Proje adı veya konum ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 42px',
                  borderRadius: '50px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  background: 'var(--color-off-white)',
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'Tüm Durumlar' },
                { key: 'tamamlandi', label: 'Tamamlanan' },
                { key: 'devam_ediyor', label: 'Devam Eden' },
                { key: 'planlama', label: 'Planlanan' },
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setActiveStatus(st.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: activeStatus === st.key ? 'var(--color-secondary)' : 'var(--color-off-white)',
                    color: activeStatus === st.key ? 'white' : 'var(--color-dark-gray)',
                    transition: 'var(--transition)',
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="projects-filter">
            <button
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              Tümü ({projects.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-gray)' }}>
              Projeler yükleniyor...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Building2 size={64} style={{ color: 'var(--color-primary)', opacity: 0.4, margin: '0 auto 16px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '8px' }}>
                Proje Bulunamadı
              </h3>
              <p style={{ color: 'var(--color-gray)', marginBottom: '24px' }}>
                Seçilen kriterlere uygun proje bulunmuyor. Filtreleri temizleyerek tekrar deneyebilirsiniz.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleCategoryChange('all');
                  setActiveStatus('all');
                  setSearchTerm('');
                }}
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => {
                const statusInfo = statusLabels[project.status] || statusLabels.tamamlandi;
                return (
                  <Link key={project.id} to={`/projeler/${project.slug}`} className="project-card">
                    <div className="project-img">
                      <img
                        src={getImgUrl(project.cover_image)}
                        alt={project.title}
                        onError={(e) => {
                          e.target.src = '/uploads/images/sah-photo-067.jpg';
                        }}
                      />
                      {project.is_featured ? (
                        <div className="project-badge">Öne Çıkan</div>
                      ) : null}
                      <div
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: statusInfo.bg,
                          color: statusInfo.color,
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: '50px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {statusInfo.label}
                      </div>
                      <div className="project-overlay">
                        <div className="project-overlay-content">
                          <span style={{ fontWeight: 600, fontSize: '15px' }}>Projeyi İncele</span>
                          <div className="project-view-btn">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="project-info">
                      <div className="project-category">{project.category_name || 'Genel Proje'}</div>
                      <h3 className="project-title">{project.title}</h3>
                      {project.short_description && (
                        <p
                          style={{
                            fontSize: '13px',
                            color: 'var(--color-gray)',
                            marginBottom: '16px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {project.short_description}
                        </p>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(0,0,0,0.06)',
                          fontSize: '12px',
                          color: 'var(--color-gray)',
                        }}
                      >
                        {project.location ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="var(--color-primary)" />
                            {project.location}
                          </span>
                        ) : (
                          <span />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {project.area && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Maximize2 size={12} color="var(--color-primary)" />
                              {Number(project.area).toLocaleString('tr-TR')} m²
                            </span>
                          )}
                          {project.year && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} color="var(--color-primary)" />
                              {project.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
