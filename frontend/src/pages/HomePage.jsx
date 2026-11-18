import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, MapPin, CheckCircle, Calendar, Smile, Users,
  Home, Building2, PencilRuler, Hammer, Sofa, Layers, Trees,
  Star, ChevronRight, Play, ZoomIn, X, ChevronLeft, ChevronRight as ChevronRightIcon,
  MessageSquare, Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuoteWizard from '../components/QuoteWizard';
import api from '../lib/api';
import { FALLBACK_PROJECTS, FALLBACK_CATEGORIES } from '../lib/fallbackData';
import { getInstagramUrl, getFacebookUrl, getWhatsappUrl } from '../lib/socialHelpers';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const serviceIcons = {
  home: Home,
  building2: Building2,
  'building-2': Building2,
  'pencil-ruler': PencilRuler,
  hammer: Hammer,
  sofa: Sofa,
  layers: Layers,
  trees: Trees,
};

const getIcon = (iconName, size = 28) => {
  const Icon = serviceIcons[iconName] || Home;
  return <Icon size={size} />;
};

// Intersection Observer hook
function useIntersection(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return visible;
}

// AnimateSection wrapper
function AnimateSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div
      ref={ref}
      className={`animate-in ${visible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Counter animation
function CounterNumber({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const visible = useIntersection(ref);
  
  useEffect(() => {
    if (!visible) return;
    const num = parseInt(target);
    if (isNaN(num)) return;
    let current = 0;
    const step = num / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);
  
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const [settings, setSettings] = useState({});
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, servicesRes, projectsRes, statsRes, catsRes] = await Promise.all([
          api.get('/settings').catch(() => ({ data: { settings: {} } })),
          api.get('/services').catch(() => ({ data: { services: [] } })),
          api.get('/projects?limit=6&featured=true').catch(() => ({ data: { projects: [] } })),
          api.get('/stats').catch(() => ({ data: { stats: [] } })),
          api.get('/categories').catch(() => ({ data: { categories: [] } })),
        ]);
        setSettings(settingsRes.data.settings || {});
        setServices(servicesRes.data.services || []);
        setProjects(projectsRes.data.projects?.length ? projectsRes.data.projects : FALLBACK_PROJECTS);
        setStats(statsRes.data.stats || []);
        setCategories(catsRes.data.categories?.length ? catsRes.data.categories : FALLBACK_CATEGORIES);
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

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category_slug === activeFilter);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', contactForm);
      toast.success('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.');
      setContactForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const openLightbox = (images, index) => setLightbox({ open: true, images, index });
  const closeLightbox = () => setLightbox({ open: false, images: [], index: 0 });
  const prevImage = () => setLightbox(l => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length }));
  const nextImage = () => setLightbox(l => ({ ...l, index: (l.index + 1) % l.images.length }));

  const getImgUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;
    return `/${path.replace(/^\/+/, '')}`;
  };

  const defaultHeroImages = [
    '/uploads/images/sah-photo-067.jpg',
    '/uploads/images/sah-photo-089.jpg',
  ];

  const featuredVideos = [
    { id: 1, title: 'Saha Beton Dökümü & Pompa Çalışması', src: '/uploads/videos/sah-video-01.mp4', poster: '/uploads/images/sah-photo-037.jpg' },
    { id: 2, title: 'Perde Beton & Kalıp Uygulaması', src: '/uploads/videos/sah-video-02.mp4', poster: '/uploads/images/sah-photo-089.jpg' },
    { id: 3, title: 'Radye Temel & Demir Donatı Montajı', src: '/uploads/videos/sah-video-05.mp4', poster: '/uploads/images/sah-photo-067.jpg' },
    { id: 4, title: 'Şantiye Saha & Vinç Operasyonu', src: '/uploads/videos/sah-video-12.mp4', poster: '/uploads/images/sah-photo-144.jpg' },
  ];

  const featuredGalleryPhotos = [
    '/uploads/images/sah-photo-067.jpg',
    '/uploads/images/sah-photo-089.jpg',
    '/uploads/images/sah-photo-144.jpg',
    '/uploads/images/sah-photo-037.jpg',
    '/uploads/images/sah-photo-086.jpg',
    '/uploads/images/sah-photo-003.jpg',
    '/uploads/images/sah-photo-019.jpg',
    '/uploads/images/sah-photo-044.jpg',
  ];

  return (
    <>
      <Navbar />
      
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <img src={getImgUrl(settings.hero_bg_image) || defaultHeroImages[0]} alt="MŞ Group İnşaat" />
        </div>
        <div className="hero-overlay" />
        
        {/* Particles */}
        <div className="hero-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="hero-particle" style={{
              width: `${Math.random() * 100 + 30}px`,
              height: `${Math.random() * 100 + 30}px`,
              background: `radial-gradient(circle, rgba(184,134,11,0.3), transparent)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 6 + 6}s`
            }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%', paddingTop: '120px', paddingBottom: '80px' }}>
          <div className="hero-grid">
            {/* Left */}
            <div className="hero-content">
              <div className="hero-badge">
                <Star size={12} />
                {settings.hero_badge || "Türkiye'nin Güvenilir İnşaat Firması"}
              </div>
              
              <h1 className="hero-title">
                {settings.hero_title_1 || 'Kalite ile'}<br />
                <span className="highlight">{settings.hero_title_highlight || 'İnşa Ediyoruz,'}</span><br />
                {settings.hero_title_2 || 'Güven ile Teslim Ediyoruz'}
              </h1>
              
              <p className="hero-description">
                {settings.hero_description ||
                  'MŞ Group İnşaat Mimarlık olarak 15 yılı aşkın deneyimimizle konut, ticari ve mimarlık projelerinde hayallerinizi gerçeğe dönüştürüyoruz.'}
              </p>
              
              <div className="hero-actions">
                <Link to="/projeler" className="btn btn-primary">
                  {settings.hero_btn_primary || 'Projelerimizi Gör'}
                  <ArrowRight size={18} />
                </Link>
                <a href="#teklif-sihirbazi" className="btn btn-outline">
                  {settings.hero_btn_secondary || 'Ücretsiz Keşif & Teklif'}
                </a>
              </div>
              
              <div className="hero-stats">
                <div className="hero-stat">
                  <h3>
                    <CounterNumber
                      target={parseInt(stats[0]?.value || settings.projects_count || '500')}
                      suffix={(stats[0]?.value || settings.projects_count || '500+').includes('+') ? '+' : ''}
                    />
                  </h3>
                  <p>{stats[0]?.title || 'Tamamlanan Proje'}</p>
                </div>
                <div className="hero-stat">
                  <h3>
                    <CounterNumber
                      target={parseInt(stats[1]?.value || settings.experience_years || '15')}
                      suffix={(stats[1]?.value || settings.experience_years || '15+').includes('+') ? '+' : ''}
                    />
                  </h3>
                  <p>{stats[1]?.title || 'Yıllık Deneyim'}</p>
                </div>
                <div className="hero-stat">
                  <h3>
                    <CounterNumber
                      target={parseInt(stats[2]?.value || '1000')}
                      suffix={(stats[2]?.value || '1000+').includes('+') ? '+' : ''}
                    />
                  </h3>
                  <p>{stats[2]?.title || 'Mutlu Müşteri'}</p>
                </div>
              </div>
            </div>
            
            {/* Right - Live Construction Video & Photo Showcase */}
            <div className="hero-media-showcase" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '2px solid rgba(184,134,11,0.4)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                  background: '#0a0a0f',
                  position: 'relative',
                  aspectRatio: '16/10',
                }}
              >
                <video
                  src={getImgUrl(settings.hero_video_url) || '/uploads/videos/sah-video-01.mp4'}
                  poster={getImgUrl(settings.hero_bg_image) || '/uploads/images/sah-photo-067.jpg'}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['/uploads/images/sah-photo-089.jpg', '/uploads/images/sah-photo-144.jpg', '/uploads/images/sah-photo-086.jpg'].map((imgSrc, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(featuredGalleryPhotos, idx + 1)}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      aspectRatio: '16/10',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <img src={imgSrc} alt="MŞ Group Saha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse" />
          <span>Aşağı Kaydır</span>
        </div>
      </section>

      {/* ===== ABOUT STRIP ===== */}
      <section style={{ background: 'var(--color-secondary)', padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { icon: <CheckCircle size={18} />, text: settings.strip_item_1 || 'ISO 9001 Kalite Sertifikası' },
              { icon: <Star size={18} />, text: settings.strip_item_2 || 'Ödüllü Mimarlık & Mühendislik' },
              { icon: <Users size={18} />, text: settings.strip_item_3 || '100+ Uzman Teknik Kadro' },
              { icon: <CheckCircle size={18} />, text: settings.strip_item_4 || 'Zamanında Teslimat Garantisi' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500 }}>
                <span style={{ color: 'var(--color-primary)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="about-content">
            <AnimateSection>
              <div className="about-img-wrapper">
                <div className="about-img-main">
                  <img src={getImgUrl(settings.about_image_main) || '/uploads/images/sah-photo-089.jpg'} alt="MŞ Group Mimarlık" />
                </div>
                <div className="about-img-small">
                  <img src={getImgUrl(settings.about_image_small) || '/uploads/images/sah-photo-144.jpg'} alt="İnşaat Projesi" />
                </div>
                <div className="about-years-badge">
                  <div className="number">{settings.experience_years || '15+'}</div>
                  <div className="text">Yıllık Tecrübe</div>
                </div>
              </div>
            </AnimateSection>
            
            <AnimateSection delay={200}>
              <div>
                <div className="section-tag">
                  <Star size={12} />
                  Hakkımızda
                </div>
                <h2 className="section-title">
                  {settings.about_title || 'Kalite ve Güvenin'}<br />
                  <span>{settings.about_title_highlight || 'Adresi MŞ Group'}</span>
                </h2>
                <div className="divider" style={{ margin: '20px 0' }} />
                <p style={{ color: 'var(--color-gray)', lineHeight: 1.8, marginBottom: '24px', fontSize: '15px' }}>
                  {settings.about_text_1 ||
                    "2010 yılından bu yana Türkiye'nin önde gelen inşaat ve mimarlık firmalarından biri olarak faaliyet göstermekteyiz. Uzman mühendis ve mimar kadromuzla her projeyi en yüksek kalite standartlarında hayata geçiriyoruz."}
                </p>
                <p style={{ color: 'var(--color-gray)', lineHeight: 1.8, marginBottom: '32px', fontSize: '15px' }}>
                  {settings.about_text_2 ||
                    'Müşteri memnuniyetini her şeyin üzerinde tutan yaklaşımımızla, teslim ettiğimiz her yapı güven ve kalitenin simgesi olmaktadır.'}
                </p>
                
                <div className="about-features">
                  {[
                    { icon: <CheckCircle size={18} />, title: 'Kalite Güvencesi', desc: 'ISO standartlarında kalite kontrol' },
                    { icon: <Calendar size={18} />, title: 'Zamanında Teslimat', desc: 'Söz verilen tarihe uyum' },
                    { icon: <Users size={18} />, title: 'Uzman Ekip', desc: '100+ deneyimli profesyonel' },
                    { icon: <Star size={18} />, title: 'Ödüllü Tasarım', desc: 'Ulusal mimarlık ödülleri' },
                  ].map((f, i) => (
                    <div key={i} className="about-feature">
                      <div className="about-feature-icon">{f.icon}</div>
                      <div>
                        <h4>{f.title}</h4>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link to="/hakkimizda" className="btn btn-primary" style={{ marginTop: '32px' }}>
                  Daha Fazla Bilgi
                  <ArrowRight size={18} />
                </Link>
              </div>
            </AnimateSection>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="services-section section-padding">
        <div className="container">
          <AnimateSection>
            <div className="section-header">
              <div className="section-tag"><Star size={12} /> Hizmetlerimiz</div>
              <h2 className="section-title">Kapsamlı <span>Yapı Çözümleri</span></h2>
              <div className="divider" />
              <p className="section-subtitle">
                Her ölçekte ve her türde inşaat projesinde profesyonel hizmet sunuyoruz.
              </p>
            </div>
          </AnimateSection>
          
          <div className="services-grid">
            {(services.length > 0 ? services : [
              { id: 1, title: 'Konut İnşaatı', short_description: 'Hayalinizdeki evi inşa ediyoruz', icon: 'home' },
              { id: 2, title: 'Ticari İnşaat', short_description: 'Profesyonel ticari yapılar', icon: 'building2' },
              { id: 3, title: 'Mimarlık & Tasarım', short_description: 'Özgün mimari çözümler', icon: 'pencil-ruler' },
              { id: 4, title: 'Restorasyon', short_description: 'Yapılarınıza yeni bir nefes', icon: 'hammer' },
              { id: 5, title: 'İç Mimari', short_description: 'Estetik yaşam alanları', icon: 'sofa' },
              { id: 6, title: 'Altyapı & Zemin', short_description: 'Sağlam temeller üzerine', icon: 'layers' },
              { id: 7, title: 'Çevre Düzenlemesi', short_description: 'Güzel çevreler yaratıyoruz', icon: 'trees' },
            ]).map((service, i) => (
              <AnimateSection key={service.id} delay={i * 80}>
                <Link to="/hizmetler" className="service-card" style={{ display: 'block', height: '100%' }}>
                  <div className="service-number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="service-card-content">
                    <div className="service-icon">
                      {getIcon(service.icon)}
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.short_description || service.description}</p>
                    <span className="service-arrow">
                      Detaylar <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </AnimateSection>
            ))}

            {/* 8th Balanced CTA Card so the grid never has an awkward empty slot */}
            <AnimateSection delay={560}>
              <a
                href="#teklif-sihirbazi"
                className="service-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, var(--color-secondary) 0%, #0f0f23 100%)',
                  border: '1px solid rgba(184,134,11,0.35)',
                }}
              >
                <div className="service-card-content">
                  <div
                    className="service-icon"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      color: 'white',
                    }}
                  >
                    <Phone size={26} />
                  </div>
                  <h3 className="service-title" style={{ color: 'white' }}>
                    Özel Projeniz mi Var?
                  </h3>
                  <p className="service-description" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Arsanız veya projeniz için Teklif Sihirbazı ile 3 adımda ücretsiz keşif ve fiyat teklifi alın.
                  </p>
                  <span className="service-arrow" style={{ color: 'var(--color-primary)' }}>
                    Teklif Sihirbazını Başlat <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            </AnimateSection>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section section-padding">
        <div className="container">
          <div className="stats-grid">
            {(stats.length > 0 ? stats.slice(0, 4) : [
              { id: 1, value: '500+', title: 'Tamamlanan Proje' },
              { id: 2, value: '15+', title: 'Yıllık Deneyim' },
              { id: 3, value: '1000+', title: 'Mutlu Müşteri' },
              { id: 4, value: '100+', title: 'Uzman Ekip' },
            ]).map((stat, i) => (
              <AnimateSection key={stat.id} delay={i * 100}>
                <div className="stat-item">
                  <div className="stat-value">
                    <CounterNumber target={parseInt(stat.value)} suffix={stat.value.includes('+') ? '+' : ''} />
                  </div>
                  <div className="stat-label">{stat.title}</div>
                </div>
              </AnimateSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS ===== */}
      <section className="projects-section section-padding">
        <div className="container">
          <AnimateSection>
            <div className="section-header">
              <div className="section-tag"><Star size={12} /> Projelerimiz</div>
              <h2 className="section-title">Seçkin <span>Projelerimiz</span></h2>
              <div className="divider" />
              <p className="section-subtitle">
                Her biri hayallerimizin ve çalışkanlığımızın somut yansımaları.
              </p>
            </div>
          </AnimateSection>
          
          {/* Filter */}
          <div className="projects-filter">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Tümü
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${activeFilter === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-gray)' }}>
              <Building2 size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p>Henüz proje eklenmemiş. Admin panelinden proje ekleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project, i) => (
                <AnimateSection key={project.id} delay={i * 80}>
                  <Link to={`/projeler/${project.slug}`} className="project-card">
                    <div className="project-img">
                      <img
                        src={project.cover_image ? getImgUrl(project.cover_image) : '/uploads/images/sah-photo-067.jpg'}
                        alt={project.title}
                        onError={e => { e.target.src = '/uploads/images/sah-photo-067.jpg'; }}
                      />
                      {project.is_featured && <div className="project-badge">Öne Çıkan</div>}
                      <div className="project-overlay">
                        <div className="project-overlay-content">
                          <span style={{ fontWeight: 600, fontSize: '15px' }}>{project.title}</span>
                          <div className="project-view-btn">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="project-info">
                      <div className="project-category">{project.category_name || 'Proje'}</div>
                      <h3 className="project-title">{project.title}</h3>
                      {project.location && (
                        <div className="project-location">
                          <MapPin size={13} />
                          {project.location}
                        </div>
                      )}
                    </div>
                  </Link>
                </AnimateSection>
              ))}
            </div>
          )}
          
          <div className="projects-more">
            <Link to="/projeler" className="btn btn-dark">
              Tüm Projeleri Gör
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SAHA VİDEOLARI & GALERİ ===== */}
      <section className="gallery-section section-padding" style={{ background: 'var(--color-secondary)' }}>
        <div className="container">
          <AnimateSection>
            <div className="section-header">
              <div className="section-tag"><Play size={12} /> Şantiye & Saha</div>
              <h2 className="section-title" style={{ color: 'white' }}>
                Saha Videolarımız ve <span>Fotoğraf Galerimiz</span>
              </h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Devam eden ve tamamlanan şantiyelerimizden gerçek uygulama videolarımız ve saha fotoğraflarımız.
              </p>
            </div>
          </AnimateSection>

          {/* Videos Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {featuredVideos.map((v) => (
              <div
                key={v.id}
                style={{
                  background: '#111122',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(184,134,11,0.25)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                }}
              >
                <div style={{ aspectRatio: '16/10', background: '#000' }}>
                  <video
                    src={v.src}
                    poster={v.poster}
                    controls
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Şantiye Videosu
                  </div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{v.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="gallery-grid" style={{ marginBottom: '40px' }}>
            {featuredGalleryPhotos.map((imgUrl, i) => (
              <div
                key={i}
                className="gallery-item"
                onClick={() => openLightbox(featuredGalleryPhotos, i)}
              >
                <img src={imgUrl} alt={`MŞ Group Saha Fotoğrafı ${i + 1}`} />
                <div className="gallery-item-overlay">
                  <div className="gallery-zoom-btn"><ZoomIn size={20} /></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/galeri" className="btn btn-primary">
              Tüm Fotoğraf (148) ve Videoları (14) Gör
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TEKLİF SİHİRBAZI ===== */}
      <section id="teklif-sihirbazi" className="section-padding" style={{ background: 'var(--color-white)' }}>
        <div className="container">
          <AnimateSection>
            <div className="section-header">
              <div className="section-tag"><Star size={12} /> Hızlı Fiyat Teklifi</div>
              <h2 className="section-title">Projeniz İçin <span>Teklif Sihirbazı</span></h2>
              <div className="divider" />
              <p className="section-subtitle">
                Hizmet türünü ve yaklaşık inşaat alanınızı seçin; size özel maliyet ve uygulama teklifimizi hemen hazırlayalım.
              </p>
            </div>
            <QuoteWizard />
          </AnimateSection>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="contact-section section-padding">
        <div className="container">
          <AnimateSection>
            <div className="section-header">
              <div className="section-tag"><MessageSquare size={12} /> İletişim</div>
              <h2 className="section-title">Bizimle <span>İletişime Geçin</span></h2>
              <div className="divider" />
            </div>
          </AnimateSection>
          
          <div className="contact-grid">
            <AnimateSection>
              <div className="contact-info">
                <h3>{settings.contact_heading || 'Projenizi Birlikte Hayata Geçirelim'}</h3>
                <p>
                  {settings.contact_subheading ||
                    'Ücretsiz keşif ve danışmanlık hizmeti için bize ulaşın. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.'}
                </p>
                
                <div className="contact-items">
                  <div className="contact-item">
                    <div className="contact-item-icon"><Phone size={20} /></div>
                    <div>
                      <h4>Telefon</h4>
                      <p>
                        <a href={`tel:${(settings.company_phone || '+90 536 869 62 51').replace(/\s+/g, '')}`}>
                          {settings.company_phone || '+90 536 869 62 51'}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-item-icon"><Mail size={20} /></div>
                    <div>
                      <h4>E-posta</h4>
                      <p>{settings.company_email || 'info@msgroup.com'}</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-item-icon"><MapPin size={20} /></div>
                    <div>
                      <h4>Adres</h4>
                      <p>{settings.company_address || 'İstanbul, Türkiye'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="social-links">
                  <a href={getInstagramUrl(settings.instagram_url) || 'https://www.instagram.com'} className="social-link" aria-label="Instagram" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  <a href={getFacebookUrl(settings.facebook_url) || 'https://www.facebook.com'} className="social-link" aria-label="Facebook" target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </AnimateSection>
            
            <AnimateSection delay={200}>
              <div className="contact-form">
                <h3>Mesaj Gönderin</h3>
                <p>Tüm alanları doldurun, en kısa sürede yanıt verelim.</p>
                
                <form onSubmit={handleContact}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ad Soyad *</label>
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız"
                        value={contactForm.name}
                        onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Telefon</label>
                      <input
                        type="tel"
                        placeholder="+90 5xx xxx xx xx"
                        value={contactForm.phone}
                        onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>E-posta</label>
                    <input
                      type="email"
                      placeholder="ornek@email.com"
                      value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mesajınız *</label>
                    <textarea
                      placeholder="Projeniz hakkında bilgi verin..."
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
                    {sending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    {!sending && <ArrowRight size={18} />}
                  </button>
                </form>
              </div>
            </AnimateSection>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* WhatsApp Button */}
      <a
        href={getWhatsappUrl(settings.whatsapp_number || settings.company_whatsapp, settings.company_phone)}
        className="whatsapp-btn"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp ile iletişime geç"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Lightbox */}
      {lightbox.open && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}><X size={18} /></button>
            <img src={lightbox.images[lightbox.index]} alt="" />
            {lightbox.images.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-prev" onClick={prevImage}><ChevronLeft size={24} /></button>
                <button className="lightbox-nav lightbox-next" onClick={nextImage}><ChevronRightIcon size={24} /></button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
