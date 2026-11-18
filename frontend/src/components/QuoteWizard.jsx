import { useState, useEffect } from 'react';
import {
  Building2, Home, Layers, Hammer, Trees, FileSpreadsheet,
  ArrowRight, ArrowLeft, CheckCircle, MapPin, Phone, User,
  Calendar, Maximize2, Send, Sparkles, RotateCcw
} from 'lucide-react';
import api from '../lib/api';
import { getWhatsappUrl } from '../lib/socialHelpers';
import toast from 'react-hot-toast';

const PROJECT_TYPES = [
  {
    id: 'kaba-insaat',
    title: 'Betonarme & Kaba İnşaat',
    desc: 'Radye temel, perde beton, tünel/modüler kalıp ve ağır demir donatı uygulamaları',
    icon: Layers,
  },
  {
    id: 'anahtar-teslim-konut',
    title: 'Anahtar Teslim Konut & Villa',
    desc: 'Temelden çatıya anahtar teslim apartman, site ve müstakil villa inşaatı',
    icon: Home,
  },
  {
    id: 'istinat-altyapi',
    title: 'İstinat Duvarı & Altyapı',
    desc: 'Yüksek brüt beton istinat duvarı, altyapı galerisi, kanal ve saha betonu',
    icon: Trees,
  },
  {
    id: 'ticari-endustriyel',
    title: 'Endüstriyel Tesis & Fabrika',
    desc: 'Fabrika temeli, iş merkezi, depo ve ağır yük taşıyıcı ticari yapılar',
    icon: Building2,
  },
  {
    id: 'kat-karsiligi',
    title: 'Kat Karşılığı Arsa & Kentsel Dönüşüm',
    desc: 'Arsanız veya mevcut binanız için kat karşılığı proje ve kentsel dönüşüm',
    icon: FileSpreadsheet,
  },
  {
    id: 'restorasyon-tadilat',
    title: 'Güçlendirme & Restorasyon',
    desc: 'Bina güçlendirme, restorasyon, iç-dış mimari yenileme çalışmaları',
    icon: Hammer,
  },
];

const AREA_PRESETS = ['100 - 500 m²', '500 - 1.500 m²', '1.500 - 5.000 m²', '5.000 - 15.000 m²', '15.000+ m²'];
const FLOOR_OPTIONS = ['1 - 2 Kat / Müstakil', '3 - 5 Katlı Yapı', '6+ Kat / Çok Bloklu', 'Altyapı / İstinat / Saha'];
const LAND_STATUS_OPTIONS = [
  'Arsam Var & Ruhsat/Proje Hazır',
  'Arsam Var, Mimari Proje Çizilecek',
  'Taşeron (Kalıp / Demir / Beton) İşçiliği İstiyorum',
  'Kat Karşılığı Değerlendirme İstiyorum',
];
const TIMELINE_OPTIONS = ['Hemen / Acil Başlangıç', '1 - 3 Ay İçinde', '3 - 6 Ay İçinde', 'Fiyat Araştırması Yapıyorum'];

export default function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState({
    projectType: 'kaba-insaat',
    areaPreset: '500 - 1.500 m²',
    exactArea: '',
    floors: '3 - 5 Katlı Yapı',
    landStatus: 'Arsam Var & Ruhsat/Proje Hazır',
    timeline: '1 - 3 Ay İçinde',
    location: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    api
      .get('/settings')
      .then((r) => setSettings(r.data.settings || {}))
      .catch(() => {});
  }, []);

  const selectedTypeObj = PROJECT_TYPES.find((t) => t.id === data.projectType) || PROJECT_TYPES[0];
  const areaDisplay = data.exactArea ? `${data.exactArea} m²` : data.areaPreset;

  const buildSummaryText = () => {
    return [
      `📌 Hizmet Türü: ${selectedTypeObj.title}`,
      `📐 İnşaat Alanı: ${areaDisplay}`,
      `🏢 Kat / Yapı Tipi: ${data.floors}`,
      `📋 Proje / Arsa Durumu: ${data.landStatus}`,
      `🗓️ Planlanan Başlangıç: ${data.timeline}`,
      `📍 Proje Konumu: ${data.location || 'Belirtilmedi'}`,
      data.notes ? `📝 Ek Notlar: ${data.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name.trim() || !data.phone.trim()) {
      return toast.error('Lütfen adınızı ve telefon numaranızı girin.');
    }

    setSending(true);
    try {
      const subject = `📋 Teklif Sihirbazı: ${selectedTypeObj.title} (${areaDisplay})`;
      const message = buildSummaryText();

      await api.post('/contact', {
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject,
        message,
      });

      setSubmitted(true);
      toast.success('Teklif talebiniz başarıyla alındı!');
    } catch {
      toast.error('Talebiniz gönderilirken bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const getWhatsAppDirectLink = () => {
    const baseWa = getWhatsappUrl(settings.whatsapp_number, settings.company_phone);
    const text = `Merhaba MŞ Group, web sitenizdeki Teklif Sihirbazı üzerinden fiyat teklifi almak istiyorum:\n\n👤 Ad Soyad: ${data.name}\n📞 Telefon: ${data.phone}\n${buildSummaryText()}`;
    return `${baseWa}?text=${encodeURIComponent(text)}`;
  };

  const resetWizard = () => {
    setSubmitted(false);
    setStep(1);
    setData((d) => ({ ...d, exactArea: '', location: '', notes: '' }));
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #151528 0%, #1a1a2e 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(184,134,11,0.35)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* Top Progress Header */}
      <div
        style={{
          background: 'rgba(0,0,0,0.25)',
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'white', margin: 0 }}>
              Online Proje & Maliyet Teklif Sihirbazı
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              3 adımda projenizin detaylarını seçin, uzman mühendis ekibimiz size özel fiyat çalışmasını hazırlasın
            </p>
          </div>
        </div>

        {/* Step Pills */}
        {!submitted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {[
              { num: 1, label: 'Hizmet Türü' },
              { num: 2, label: 'Proje Ölçeği' },
              { num: 3, label: 'İletişim & Gönder' },
            ].map((s) => {
              const active = step === s.num;
              const done = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => s.num < step && setStep(s.num)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: s.num < step ? 'pointer' : 'default',
                    background: active
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                      : done
                      ? 'rgba(16,185,129,0.2)'
                      : 'rgba(255,255,255,0.06)',
                    color: active ? 'white' : done ? '#10b981' : 'rgba(255,255,255,0.45)',
                    border: active ? 'none' : done ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span>{done ? '✓' : s.num}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Wizard Body */}
      <div style={{ padding: '32px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.18)',
                border: '2px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle size={38} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '10px' }}>
              Teklif Talebiniz Alındı!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.7 }}>
              Sayın <strong>{data.name}</strong>, proje detaylarınız sistemimize kaydedildi. Teknik ekibimiz talebinizi
              inceleyerek <strong>{data.phone}</strong> numaranız üzerinden en kısa sürede dönüş yapacaktır.
            </p>

            {/* Summary Box */}
            <div
              style={{
                maxWidth: '520px',
                margin: '0 auto 28px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(184,134,11,0.3)',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'left',
                fontSize: '13px',
                lineHeight: 1.9,
                whiteSpace: 'pre-line',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {buildSummaryText()}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={getWhatsAppDirectLink()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
              >
                WhatsApp Üzerinden de Hemen Gönder <ArrowRight size={17} />
              </a>
              <button type="button" className="btn btn-outline" onClick={resetWizard}>
                <RotateCcw size={16} /> Yeni Teklif Hesapla
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* STEP 1: SERVICE / PROJECT TYPE */}
            {step === 1 && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                  1. Hangi Hizmetimiz İçin Teklif Almak İstiyorsunuz?
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '20px' }}>
                  Projenize en uygun yapı veya uygulama kategorisini seçin
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '14px',
                    marginBottom: '28px',
                  }}
                >
                  {PROJECT_TYPES.map((type) => {
                    const IconComp = type.icon;
                    const isSelected = data.projectType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setData((d) => ({ ...d, projectType: type.id }))}
                        style={{
                          padding: '20px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(184,134,11,0.22), rgba(201,168,76,0.12))'
                            : 'rgba(255,255,255,0.03)',
                          border: isSelected
                            ? '2px solid var(--color-primary)'
                            : '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '14px',
                        }}
                      >
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: isSelected ? 'var(--color-primary)' : 'rgba(184,134,11,0.15)',
                            color: isSelected ? 'white' : 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconComp size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: 'white', marginBottom: '4px' }}>
                            {type.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                            {type.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                    Devam Et: Proje Ölçeği <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROJECT SCALE & SPECS */}
            {step === 2 && (
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                  2. Projenizin Yaklaşık Ölçeği ve Durumu Nedir?
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '22px' }}>
                  Seçili Hizmet: <strong style={{ color: 'var(--color-primary)' }}>{selectedTypeObj.title}</strong>
                </p>

                {/* Area selection */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    <Maximize2 size={14} color="var(--color-primary)" /> Tahmini İnşaat / Uygulama Alanı (m²)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    {AREA_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, areaPreset: preset, exactArea: '' }))}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background:
                            data.areaPreset === preset && !data.exactArea
                              ? 'var(--color-primary)'
                              : 'rgba(255,255,255,0.06)',
                          color: 'white',
                          border:
                            data.areaPreset === preset && !data.exactArea
                              ? '1px solid var(--color-primary)'
                              : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                    <input
                      type="number"
                      placeholder="veya tam m² yazın (örn: 1850)"
                      value={data.exactArea}
                      onChange={(e) => setData((d) => ({ ...d, exactArea: e.target.value }))}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        border: data.exactArea ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.12)',
                        color: 'white',
                        fontSize: '13px',
                        minWidth: '220px',
                      }}
                    />
                  </div>
                </div>

                {/* Floors & Land Status */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '22px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Kat / Yapı Tipi
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {FLOOR_OPTIONS.map((fl) => (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => setData((d) => ({ ...d, floors: fl }))}
                          style={{
                            textAlign: 'left',
                            padding: '11px 14px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 500,
                            background: data.floors === fl ? 'rgba(184,134,11,0.22)' : 'rgba(255,255,255,0.04)',
                            border: data.floors === fl ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          {data.floors === fl ? '● ' : '○ '} {fl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Arsa & Proje Durumu
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {LAND_STATUS_OPTIONS.map((ls) => (
                        <button
                          key={ls}
                          type="button"
                          onClick={() => setData((d) => ({ ...d, landStatus: ls }))}
                          style={{
                            textAlign: 'left',
                            padding: '11px 14px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 500,
                            background: data.landStatus === ls ? 'rgba(184,134,11,0.22)' : 'rgba(255,255,255,0.04)',
                            border: data.landStatus === ls ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          {data.landStatus === ls ? '● ' : '○ '} {ls}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    <Calendar size={14} color="var(--color-primary)" /> Planlanan Başlangıç Zamanı
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {TIMELINE_OPTIONS.map((tl) => (
                      <button
                        key={tl}
                        type="button"
                        onClick={() => setData((d) => ({ ...d, timeline: tl }))}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: data.timeline === tl ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                          color: 'white',
                          border: data.timeline === tl ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {tl}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} /> Geri
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                    Devam Et: İletişim Bilgileri <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & SUBMIT */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                  3. Teklifinizi Nereye İletelim?
                </h4>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '20px' }}>
                  Seçimleriniz: <strong style={{ color: 'var(--color-primary)' }}>{selectedTypeObj.title}</strong> •{' '}
                  <strong>{areaDisplay}</strong> • <strong>{data.floors}</strong>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>
                      <User size={13} style={{ display: 'inline', marginRight: '4px' }} /> Ad Soyad veya Firma Adı *
                    </label>
                    <input
                      type="text"
                      placeholder="Adınız Soyadınız"
                      value={data.name}
                      onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>
                      <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} /> Telefon Numaranız *
                    </label>
                    <input
                      type="tel"
                      placeholder="05xx xxx xx xx"
                      value={data.phone}
                      onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} /> Proje Konumu (İl / İlçe)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: İstanbul, Başakşehir"
                      value={data.location}
                      onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Eklemek İstediğiniz Detaylar (İsteğe Bağlı)</label>
                  <textarea
                    rows={3}
                    placeholder="Projenizle ilgili özel taleplerinizi, ada/parsel bilgisini veya sormak istediklerinizi yazabilirsiniz..."
                    value={data.notes}
                    onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                    <ArrowLeft size={16} /> Geri
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    <Send size={16} />
                    {sending ? 'Talebiniz Gönderiliyor...' : 'Ücretsiz Teklif Talebini Gönder'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

