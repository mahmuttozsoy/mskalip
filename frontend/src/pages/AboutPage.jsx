import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, CheckCircle, Award, ShieldCheck, Users, Target, Eye,
  ArrowRight, Calendar, Building2, HardHat
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';

export default function AboutPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get('/settings')
      .then((res) => setSettings(res.data.settings || {}))
      .catch(() => {});
  }, []);

  const values = [
    {
      icon: ShieldCheck,
      title: 'Güven ve Şeffaflık',
      desc: 'Sözleşmeden teslimata kadar tüm süreçlerde şeffaf bilgilendirme ve sarsılmaz güven ilkesiyle hareket ediyoruz.',
    },
    {
      icon: Award,
      title: 'Yüksek Kalite Standartları',
      desc: 'Deprem yönetmeliğine tam uyumlu statik çözümler ve birinci sınıf yapı malzemeleri ile uzun ömürlü yapılar üretiyoruz.',
    },
    {
      icon: HardHat,
      title: 'İş Sağlığı ve Güvenliği',
      desc: 'Tüm şantiyelerimizde sıfır iş kazası hedefiyle uluslararası iş güvenliği standartlarını titizlikle uyguluyoruz.',
    },
    {
      icon: Users,
      title: 'Uzman Mühendis & Mimar Kadrosu',
      desc: 'Alanında deneyimli mimar, inşaat mühendisi ve teknik personelimizle her detayı profesyonelce yönetiyoruz.',
    },
  ];

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
            backgroundImage: 'url(/uploads/images/sah-photo-067.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>
            <Star size={12} /> Kurumsal
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
            Hakkımızda & <span style={{ color: 'var(--color-primary)' }}>Vizyonumuz</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '620px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            {settings.company_founded || '2010'} yılından bu yana estetik mimariyi yüksek mühendislik kalitesiyle
            buluşturarak geleceğin yaşam alanlarını inşa ediyoruz.
          </p>
        </div>
      </div>

      {/* Main About Section */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="about-content">
            <div className="about-img-wrapper">
              <div className="about-img-main">
                <img
                  src={settings.about_image_main || '/uploads/images/sah-photo-089.jpg'}
                  alt="MŞ Group İnşaat Mimarlık"
                />
              </div>
              <div className="about-img-small">
                <img
                  src={settings.about_image_small || '/uploads/images/sah-photo-144.jpg'}
                  alt="MŞ Group Şantiye"
                />
              </div>
              <div className="about-years-badge">
                <div className="number">{settings.experience_years || '15+'}</div>
                <div className="text">Yıllık Tecrübe</div>
              </div>
            </div>

            <div>
              <div className="section-tag">
                <Star size={12} /> Biz Kimiz?
              </div>
              <h2 className="section-title">
                {settings.about_title || 'Kalite ve Güvenin'} <br />
                <span>{settings.about_title_highlight || 'Adresi MŞ Group'}</span>
              </h2>
              <div className="divider" style={{ margin: '20px 0' }} />
              <p style={{ color: 'var(--color-dark-gray)', lineHeight: 1.8, marginBottom: '20px', fontSize: '15px' }}>
                {settings.about_text_1 || (
                  <>
                    <strong>{settings.company_name || 'MŞ Group İnşaat Mimarlık'}</strong>, kurulduğu günden bu yana konut,
                    ticari yapılar, mimari proje tasarımı, restorasyon ve altyapı alanlarında yüzlerce başarılı projeye imza
                    atmıştır.
                  </>
                )}
              </p>
              <p style={{ color: 'var(--color-dark-gray)', lineHeight: 1.8, marginBottom: '28px', fontSize: '15px' }}>
                {settings.about_text_2 ||
                  'Modern şehircilik anlayışına uygun, depreme dayanıklı, çevre dostu ve yüksek yatırım değerine sahip projeler geliştirerek müşterilerimize yalnızca bir bina değil, güvenle yaşayacakları sağlam bir gelecek sunuyoruz.'}
              </p>

              <div className="about-features">
                {[
                  { icon: <CheckCircle size={18} />, title: 'ISO 9001 Kalite', desc: 'Uluslararası kalite standartları' },
                  { icon: <Calendar size={18} />, title: 'Zamanında Teslim', desc: 'Planlanan tarihte eksiksiz teslim' },
                  { icon: <Users size={18} />, title: 'Uzman Kadro', desc: `${settings.team_size || '100+'} deneyimli çalışan` },
                  { icon: <Building2 size={18} />, title: 'Güçlü Referanslar', desc: `${settings.projects_count || '500+'} tamamlanan proje` },
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
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            <div
              style={{
                background: 'var(--color-off-white)',
                padding: '44px 36px',
                borderRadius: 'var(--radius-lg)',
                borderTop: '4px solid var(--color-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(184,134,11,0.12)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Target size={28} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  color: 'var(--color-secondary)',
                  marginBottom: '14px',
                }}
              >
                Misyonumuz
              </h3>
              <p style={{ color: 'var(--color-dark-gray)', lineHeight: 1.8, fontSize: '15px' }}>
                {settings.about_mission ||
                  'İnşaat ve mimarlık sektöründe en son teknoloji ve mühendislik yöntemlerini kullanarak; güvenli, estetik, fonksiyonel ve doğaya saygılı yaşam alanları inşa etmek, müşteri memnuniyetini en üst düzeyde tutarak ülke ekonomisine ve kentsel gelişime kalıcı değer katmaktır.'}
              </p>
            </div>

            <div
              style={{
                background: 'var(--color-secondary)',
                padding: '44px 36px',
                borderRadius: 'var(--radius-lg)',
                borderTop: '4px solid var(--color-primary)',
                boxShadow: 'var(--shadow-md)',
                color: 'white',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'rgba(184,134,11,0.2)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Eye size={28} />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  color: 'white',
                  marginBottom: '14px',
                }}
              >
                Vizyonumuz
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontSize: '15px' }}>
                {settings.about_vision ||
                  "Türkiye'de ve uluslararası arenada yenilikçi mimari tasarımları, mühendislik kalitesi ve zamanında teslimat güvencesiyle örnek gösterilen, sektöre yön veren lider inşaat ve mimarlık markası olmaktır."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Star size={12} /> Değerlerimiz
            </div>
            <h2 className="section-title">
              Bizi Farklı Kılan <span>İlkelerimiz</span>
            </h2>
            <div className="divider" />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {values.map((val, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  padding: '36px 28px',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: 'rgba(184,134,11,0.1)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <val.icon size={24} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    color: 'var(--color-secondary)',
                    marginBottom: '10px',
                  }}
                >
                  {val.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: 1.7 }}>{val.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/projeler" className="btn btn-primary">
              Tamamlanan Projelerimizi İnceleyin <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
