import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageSquare, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import { getWhatsappUrl } from '../lib/socialHelpers';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get('/settings')
      .then((res) => setSettings(res.data.settings || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', form);
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const phone = settings.company_phone || '+90 536 869 62 51';
  const email = settings.company_email || 'info@msgroup.com';
  const address = settings.company_address || 'İstanbul, Türkiye';

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
            <MessageSquare size={12} /> Bize Ulaşın
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
            İletişim & <span style={{ color: 'var(--color-primary)' }}>Ücretsiz Keşif</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '620px', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Projeniz hakkında detaylı bilgi almak, fiyat teklifi istemek veya ücretsiz keşif randevusu oluşturmak için
            bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="contact-section section-padding">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <h3>Projenizi Birlikte Planlayalım</h3>
              <p>
                Sorularınız, proje talepleriniz veya kat karşılığı arsa değerlendirmeleriniz için aşağıdaki iletişim
                kanallarımızdan bize doğrudan ulaşabilir ya da formu doldurabilirsiniz.
              </p>

              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4>Telefon</h4>
                    <p>
                      <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4>E-posta</h4>
                    <p>
                      <a href={`mailto:${email}`}>{email}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4>Merkez Ofis Adresi</h4>
                    <p>{address}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item-icon">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4>Çalışma Saatleri</h4>
                    <p>{settings.working_hours || 'Pazartesi - Cumartesi: 08:30 - 18:30'}</p>
                  </div>
                </div>
              </div>

              <a
                href={getWhatsappUrl(settings.whatsapp_number || settings.company_whatsapp, phone)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
              >
                WhatsApp Hattımızdan Yazın <ArrowRight size={16} />
              </a>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <h3>İletişim & Teklif Formu</h3>
              <p>Bilgilerinizi bırakın, uzman ekibimiz en kısa sürede sizi arasın.</p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ad Soyad *</label>
                    <input
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon Numarası *</label>
                    <input
                      type="tel"
                      placeholder="+90 5xx xxx xx xx"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-posta Adresi</label>
                    <input
                      type="email"
                      placeholder="ornek@email.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Konu / Hizmet Türü</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    >
                      <option value="">Konu Seçiniz</option>
                      <option value="Konut İnşaatı">Konut / Villa İnşaatı</option>
                      <option value="Ticari İnşaat">Ticari İnşaat</option>
                      <option value="Mimari Proje Tasarımı">Mimari Proje & Tasarım</option>
                      <option value="Kentsel Dönüşüm / Restorasyon">Kentsel Dönüşüm & Restorasyon</option>
                      <option value="İç Mimari & Tadilat">İç Mimari & Dekorasyon</option>
                      <option value="Kat Karşılığı Arsa">Kat Karşılığı Arsa Teklifi</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mesajınız *</label>
                  <textarea
                    placeholder="Projenizin detaylarını, konumunu ve beklentilerinizi kısaca yazabilirsiniz..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {sending ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                  {!sending && <Send size={17} />}
                </button>
              </form>
            </div>
          </div>

          {/* Map Section - Otomatik Adresten Harita Gösterimi */}
          <div
            style={{
              marginTop: '60px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              height: '420px',
              background: 'white',
            }}
          >
            {settings.google_maps_embed && settings.google_maps_embed.includes('<iframe') ? (
              <div
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }}
              />
            ) : (
              <iframe
                title="MŞ Group Konum"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              />
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
