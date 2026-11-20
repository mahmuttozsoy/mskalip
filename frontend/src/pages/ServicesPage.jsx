import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Building2, PencilRuler, Hammer, Sofa, Layers, Trees,
  Star, ArrowRight, CheckCircle, Phone
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuoteWizard from '../components/QuoteWizard';
import api from '../lib/api';

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

const defaultServices = [
  {
    id: 0,
    title: 'Çelik Kalıp & Endüstriyel Kalıp Sistemleri',
    slug: 'celik-kalip-sistemleri',
    short_description: 'Yüksek dayanımlı çelik kalıp ile pürüzsüz brüt beton uygulamaları',
    description:
      'MŞ Group İnşaat (MŞ Kalıp) uzmanlığıyla; toplu konut, yüksek istinat duvarı, perde beton, kolon ve altyapı galerisi projelerinde ağır hizmet tipi endüstriyel çelik kalıp, tünel kalıp ve modüler kalıp sistemleri uyguluyoruz. Vinç destekli hızlı montaj ve yüksek basınç dayanımıyla pürüzsüz brüt beton yüzeyler elde ediyoruz.',
    icon: 'layers',
    features: [
      'Perde, Kolon ve Dairesel Çelik Kalıp Sistemleri',
      'Tünel Kalıp & Vinç Destekli Modüler Çelik Kalıp',
      'Pürüzsüz Brüt Beton Yüzey & Milimetrik Hassasiyet',
      'Yüksek Kotlu İstinat Duvarı ve Altyapı Çelik Kalıpları',
    ],
  },
  {
    id: 1,
    title: 'Konut İnşaatı',
    slug: 'konut-insaati',
    short_description: 'Hayalinizdeki evi inşa ediyoruz',
    description:
      'Apartman, villa, rezidans ve müstakil ev projelerinde yüksek kaliteli inşaat hizmetleri sunuyoruz. Deprem yönetmeliğine tam uyumlu, enerji verimli ve modern mimari anlayışı ile hayalinizdeki yaşam alanlarını inşa ediyoruz.',
    icon: 'home',
    features: ['Anahtar Teslim Villa & Konut', 'Depreme Dayanıklı Statik Proje', 'Akıllı Ev Sistemleri', 'Yüksek Isı ve Ses Yalıtımı'],
  },
  {
    id: 2,
    title: 'Ticari İnşaat',
    slug: 'ticari-insaat',
    short_description: 'Profesyonel ticari yapılar',
    description:
      'Ofis binaları, alışveriş merkezleri, fabrika, depo ve iş merkezi projelerinde kurumsal ihtiyaçlarınıza özel profesyonel inşaat çözümleri üretiyoruz.',
    icon: 'building-2',
    features: ['Plaza & Ofis Binaları', 'Endüstriyel Tesis ve Depolar', 'Mağaza & Showroom Uygulamaları', 'Yüksek Güvenlik Standartları'],
  },
  {
    id: 3,
    title: 'Mimarlık ve Proje Tasarımı',
    slug: 'mimarlik-proje-tasarimi',
    short_description: 'Özgün mimari çözümler',
    description:
      'Deneyimli mimar ve mühendis kadromuzla estetik, fonksiyonel ve sürdürülebilir mimari projeler tasarlıyoruz. 3D görselleştirme ve ruhsat projeleri dahil tüm süreçleri yönetiyoruz.',
    icon: 'pencil-ruler',
    features: ['3D Mimari Görselleştirme', 'Uygulama ve Ruhsat Projeleri', 'Sürdürülebilir Eko-Tasarım', 'Maliyet ve Fizibilite Analizi'],
  },
  {
    id: 4,
    title: 'Restorasyon ve Yenileme',
    slug: 'restorasyon-yenileme',
    short_description: 'Yapılarınıza yeni bir nefes',
    description:
      'Tarihi yapıların aslına uygun restorasyonu, mevcut binaların güçlendirilmesi ve kentsel dönüşüm kapsamındaki yenileme projelerinde uzman çözümler sunuyoruz.',
    icon: 'hammer',
    features: ['Bina Güçlendirme Uygulamaları', 'Kentsel Dönüşüm Danışmanlığı', 'Tarihi Yapı Restorasyonu', 'Dış Cephe Yenileme ve Mantolama'],
  },
  {
    id: 5,
    title: 'İç Mimari ve Dekorasyon',
    slug: 'ic-mimari-dekorasyon',
    short_description: 'Estetik yaşam alanları',
    description:
      'Yaşam ve çalışma alanlarınızı modern iç mimari dokunuşlarla dönüştürüyoruz. Özel mobilya tasarımından aydınlatma ve malzeme seçimine kadar her detayı planlıyoruz.',
    icon: 'sofa',
    features: ['Özel Mutfak & Banyo Tasarımı', 'Kurumsal Ofis İç Mimarisi', 'Aydınlatma ve Akustik Tasarım', 'Anahtar Teslim Tadilat'],
  },
  {
    id: 6,
    title: 'Altyapı ve Zemin Etüdü',
    slug: 'altyapi-zemin-etudu',
    short_description: 'Sağlam temeller üzerine',
    description:
      'Zemin etüdü, derin temel sistemleri, fore kazık, istinat yapıları ve altyapı çalışmalarında mühendislik biliminin ışığında güvenilir çözümler sağlıyoruz.',
    icon: 'layers',
    features: ['Jeolojik Zemin Etüdü', 'Fore Kazık ve İksa Sistemleri', 'Kanalizasyon ve Yağmursuyu Altyapısı', 'Toprakarme ve İstinat Duvarları'],
  },
  {
    id: 7,
    title: 'Yol ve Çevre Düzenleme',
    slug: 'yol-cevre-duzenleme',
    short_description: 'Güzel çevreler yaratıyoruz',
    description:
      'Site içi ve dışı peyzaj düzenlemeleri, yürüyüş yolları, otopark alanları, sosyal tesisler ve yeşil alan projeleriyle yapılarınıza değer katıyoruz.',
    icon: 'trees',
    features: ['Peyzaj ve Bahçe Tasarımı', 'Otopark ve Yol Uygulamaları', 'Otomatik Sulama ve Aydınlatma', 'Sosyal Alan ve Çocuk Parkları'],
  },
];

const processSteps = [
  { step: '01', title: 'Keşif & İhtiyaç Analizi', desc: 'Arsanızı veya mevcut yapınızı yerinde inceliyor, beklentilerinizi ve bütçenizi detaylıca analiz ediyoruz.' },
  { step: '02', title: 'Mimari Tasarım & Planlama', desc: '3D görselleştirmeler, statik ve mekanik projeler ile ruhsat süreçlerini eksiksiz hazırlıyoruz.' },
  { step: '03', title: 'İnşaat & Kalite Kontrol', desc: 'Birinci sınıf malzemeler ve uzman ekiplerimizle projenizi ISO kalite standartlarında inşa ediyoruz.' },
  { step: '04', title: 'Zamanında Anahtar Teslim', desc: 'Tüm test ve kontrolleri tamamlanan yapınızı söz verdiğimiz tarihte garantili olarak teslim ediyoruz.' },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get('/services')
      .then((res) => {
        if (res.data.services && res.data.services.length > 0) {
          setServices(res.data.services);
        } else {
          setServices(defaultServices);
        }
      })
      .catch(() => setServices(defaultServices));
  }, []);

  const rawServices = services.length > 0 ? services : defaultServices;
  const hasSteelFormwork = rawServices.some((s) => /çelik kalıp/i.test(s.title || ''));
  const displayServices = hasSteelFormwork ? rawServices : [defaultServices[0], ...rawServices];

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
            backgroundImage: 'url(/uploads/images/sah-photo-144.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>
            <Star size={12} /> Uzmanlık Alanlarımız
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
            Kapsamlı <span style={{ color: 'var(--color-primary)' }}>Hizmetlerimiz</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '620px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Mimari tasarımdan anahtar teslim inşaata kadar tüm süreçlerde mühendislik güvencesi ve estetik çözümler
            sunuyoruz.
          </p>
        </div>
      </div>

      {/* Services List */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {displayServices.map((service, index) => {
              const IconComp = serviceIcons[service.icon] || Home;
              const fallbackFeatures =
                defaultServices[index]?.features || [
                  'Yüksek Kalite Standartları',
                  'Uzman Mühendis ve Mimar Kadrosu',
                  'Zamanında Teslim Garantisi',
                  'Garantili Malzeme ve İşçilik',
                ];

              return (
                <div
                  key={service.id || index}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    padding: '40px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '40px',
                    alignItems: 'center',
                    borderLeft: '4px solid var(--color-primary)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(135deg, rgba(184,134,11,0.12), rgba(201,168,76,0.2))',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconComp size={28} />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Hizmet {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.6rem',
                            color: 'var(--color-secondary)',
                          }}
                        >
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p style={{ color: 'var(--color-dark-gray)', lineHeight: 1.8, marginBottom: '24px', fontSize: '15px' }}>
                      {service.description || service.short_description}
                    </p>

                    <Link to="/iletisim" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                      Bu Hizmet İçin Teklif Alın <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div
                    style={{
                      background: 'var(--color-off-white)',
                      padding: '28px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(184,134,11,0.12)',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--color-secondary)',
                        marginBottom: '16px',
                      }}
                    >
                      Neler Sunuyoruz?
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      {(service.features || fallbackFeatures).map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--color-dark-gray)' }}>
                          <CheckCircle size={17} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Work Process */}
      <section className="section-padding" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Star size={12} /> Çalışma Sürecimiz
            </div>
            <h2 className="section-title">
              Nasıl <span>Çalışıyoruz?</span>
            </h2>
            <div className="divider" />
            <p className="section-subtitle">
              İlk fikirden anahtar teslimine kadar şeffaf, planlı ve mühendislik disipliniyle ilerliyoruz.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {processSteps.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-off-white)',
                  padding: '32px 28px',
                  borderRadius: 'var(--radius-lg)',
                  position: 'relative',
                  border: '1px solid rgba(184,134,11,0.15)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    opacity: 0.25,
                    lineHeight: 1,
                    marginBottom: '12px',
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    color: 'var(--color-secondary)',
                    marginBottom: '10px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-gray)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Wizard Section */}
      <section className="section-padding" style={{ background: 'var(--color-off-white)' }}>
        <div className="container">
          <QuoteWizard />
        </div>
      </section>

      <Footer />
    </>
  );
}
