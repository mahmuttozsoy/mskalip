import { useState, useEffect, useRef } from 'react';
import {
  Save, LayoutTemplate, FileText, BarChart3, FolderKanban, PhoneCall,
  Image as ImageIcon, Video, Upload, Plus, Trash2, Pencil, Check, X
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const DEFAULT_CONTENT = {
  hero_badge: "Türkiye'nin Güvenilir İnşaat Firması",
  hero_title_1: 'Kalite ile',
  hero_title_highlight: 'İnşa Ediyoruz,',
  hero_title_2: 'Güven ile Teslim Ediyoruz',
  hero_description:
    'MŞ Group İnşaat Mimarlık olarak 15 yılı aşkın deneyimimizle konut, ticari ve mimarlık projelerinde hayallerinizi gerçeğe dönüştürüyoruz.',
  hero_btn_primary: 'Projelerimizi Gör',
  hero_btn_secondary: 'Ücretsiz Keşif',
  hero_bg_image: '/uploads/images/sah-photo-067.jpg',
  hero_video_url: '/uploads/videos/sah-video-01.mp4',
  strip_item_1: 'ISO 9001 Kalite Sertifikası',
  strip_item_2: 'Ödüllü Mimarlık & Mühendislik',
  strip_item_3: '100+ Uzman Teknik Kadro',
  strip_item_4: 'Zamanında Teslimat Garantisi',
  about_title: 'Kalite ve Güvenin',
  about_title_highlight: 'Adresi MŞ Group',
  about_text_1:
    "2010 yılından bu yana Türkiye'nin önde gelen inşaat ve mimarlık firmalarından biri olarak faaliyet göstermekteyiz. Uzman mühendis ve mimar kadromuzla her projeyi en yüksek kalite standartlarında hayata geçiriyoruz.",
  about_text_2:
    'Modern şehircilik anlayışına uygun, depreme dayanıklı, çevre dostu ve yüksek yatırım değerine sahip projeler geliştirerek müşterilerimize yalnızca bir bina değil, güvenle yaşayacakları sağlam bir gelecek sunuyoruz.',
  about_mission:
    'İnşaat ve mimarlık sektöründe en son teknoloji ve mühendislik yöntemlerini kullanarak; güvenli, estetik, fonksiyonel ve doğaya saygılı yaşam alanları inşa etmek, müşteri memnuniyetini en üst düzeyde tutarak ülke ekonomisine ve kentsel gelişime kalıcı değer katmaktır.',
  about_vision:
    "Türkiye'de ve uluslararası arenada yenilikçi mimari tasarımları, mühendislik kalitesi ve zamanında teslimat güvencesiyle örnek gösterilen, sektöre yön veren lider inşaat ve mimarlık markası olmaktır.",
  about_image_main: '/uploads/images/sah-photo-089.jpg',
  about_image_small: '/uploads/images/sah-photo-144.jpg',
  footer_description:
    '15 yılı aşkın deneyimimizle konut, ticari ve mimarlık projelerinde kalite ve güvenilirliğin adresi olmaya devam ediyoruz.',
  working_hours: 'Pazartesi - Cumartesi: 08:30 - 18:30',
  contact_heading: 'Projenizi Birlikte Hayata Geçirelim',
  contact_subheading:
    'Ücretsiz keşif ve danışmanlık hizmeti için bize ulaşın. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.',
};

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('hero');
  const [settings, setSettings] = useState(DEFAULT_CONTENT);
  const [stats, setStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Media picker modal state
  const [picker, setPicker] = useState({ open: false, targetKey: '', type: 'image' });
  const [uploadingField, setUploadingField] = useState(false);
  const fileInputRef = useRef(null);

  // Category form state
  const [catForm, setCatForm] = useState({ id: null, name: '', slug: '', description: '', sort_order: 0 });
  const [showCatForm, setShowCatForm] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [setRes, statRes, catRes, medRes] = await Promise.all([
        api.get('/settings').catch(() => ({ data: { settings: {} } })),
        api.get('/stats').catch(() => ({ data: { stats: [] } })),
        api.get('/categories/all').catch(() => api.get('/categories').catch(() => ({ data: { categories: [] } }))),
        api.get('/media?limit=250').catch(() => ({ data: { media: [] } })),
      ]);

      setSettings({ ...DEFAULT_CONTENT, ...(setRes.data.settings || {}) });
      setStats(
        statRes.data.stats?.length
          ? statRes.data.stats.slice(0, 4)
          : [
              { id: 1, title: 'Tamamlanan Proje', value: '500+', icon: 'check-circle', sort_order: 1, is_active: 1 },
              { id: 2, title: 'Yıllık Deneyim', value: '15+', icon: 'calendar', sort_order: 2, is_active: 1 },
              { id: 3, title: 'Mutlu Müşteri', value: '1000+', icon: 'smile', sort_order: 3, is_active: 1 },
              { id: 4, title: 'Uzman Ekip', value: '100+', icon: 'users', sort_order: 4, is_active: 1 },
            ]
      );
      setCategories(catRes.data.categories || []);
      setMediaList(medRes.data.media || []);
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Site içerikleri başarıyla kaydedildi!');
    } catch {
      toast.error('İçerikler kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStats = async () => {
    setSaving(true);
    try {
      await Promise.all(
        stats.map((st) =>
          api.put(`/stats/${st.id}`, {
            title: st.title,
            value: st.value,
            icon: st.icon || 'check-circle',
            sort_order: st.sort_order || 1,
            is_active: 1,
          })
        )
      );
      // Aynı zamanda settings içindeki sayaçları da senkronize et
      await api.put('/settings', {
        ...settings,
        projects_count: stats[0]?.value || settings.projects_count,
        experience_years: stats[1]?.value || settings.experience_years,
        team_size: stats[3]?.value || settings.team_size,
      });
      toast.success('İstatistik sayaçları güncellendi!');
    } catch {
      toast.error('İstatistikler güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (catForm.id) {
        await api.put(`/categories/${catForm.id}`, { ...catForm, is_active: 1 });
        toast.success('Kategori güncellendi');
      } else {
        await api.post('/categories', catForm);
        toast.success('Yeni kategori eklendi');
      }
      setShowCatForm(false);
      setCatForm({ id: null, name: '', slug: '', description: '', sort_order: 0 });
      const res = await api.get('/categories/all').catch(() => api.get('/categories'));
      setCategories(res.data.categories || []);
    } catch {
      toast.error('Kategori kaydedilemedi');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori silindi');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error('Kategori silinemedi');
    }
  };

  const handleDirectUploadForField = async (files) => {
    if (!files || files.length === 0 || !picker.targetKey) return;
    setUploadingField(true);
    const formData = new FormData();
    formData.append('files', files[0]);
    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploaded = res.data.files?.[0];
      if (uploaded) {
        const cleanUrl = uploaded.file_path.startsWith('/') ? uploaded.file_path : `/${uploaded.file_path}`;
        setField(picker.targetKey, cleanUrl);
        setMediaList((prev) => [uploaded, ...prev]);
        setPicker({ open: false, targetKey: '', type: 'image' });
        toast.success('Dosya yüklendi ve seçildi! Kaydet butonuna basmayı unutmayın.');
      }
    } catch {
      toast.error('Dosya yüklenemedi');
    } finally {
      setUploadingField(false);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;
    return `/${path.replace(/^\/+/, '')}`;
  };

  const tabs = [
    { id: 'hero', label: 'Ana Sayfa & Hero', icon: LayoutTemplate },
    { id: 'about', label: 'Hakkımızda & Vizyon', icon: FileText },
    { id: 'stats', label: 'Sayaçlar & İstatistikler', icon: BarChart3 },
    { id: 'categories', label: 'Proje Kategorileri', icon: FolderKanban },
    { id: 'footer', label: 'İletişim & Alt Bilgi', icon: PhoneCall },
  ];

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        Site içerikleri yükleniyor...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-topbar">
        <div className="admin-topbar-title">
          <h1>Site İçeriği & Sayfa Yönetimi</h1>
          <p>Sitedeki tüm başlıkları, yazıları, görselleri, videoları ve kategorileri buradan kolayca yönetin</p>
        </div>
        {activeTab !== 'categories' && (
          <button
            className="admin-btn admin-btn-primary"
            onClick={activeTab === 'stats' ? handleSaveStats : handleSaveSettings}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        )}
      </div>

      <div className="admin-content">
        {/* Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            background: '#1a1a2e',
            padding: '10px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background:
                  activeTab === t.id
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                    : 'rgba(255,255,255,0.04)',
                color: activeTab === t.id ? 'white' : 'rgba(255,255,255,0.65)',
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: HERO & HOMEPAGE */}
        {activeTab === 'hero' && (
          <div className="admin-form">
            <h3 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>
              Ana Sayfa Üst Vitrin (Hero) Ayarları
            </h3>

            <div className="admin-form-group">
              <label>Üst Rozet Sloganı</label>
              <input
                type="text"
                value={settings.hero_badge || ''}
                onChange={(e) => setField('hero_badge', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="admin-form-group">
                <label>Ana Başlık (1. Satır)</label>
                <input
                  type="text"
                  value={settings.hero_title_1 || ''}
                  onChange={(e) => setField('hero_title_1', e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Vurgulu Altın Başlık (2. Satır)</label>
                <input
                  type="text"
                  value={settings.hero_title_highlight || ''}
                  onChange={(e) => setField('hero_title_highlight', e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Ana Başlık (3. Satır)</label>
                <input
                  type="text"
                  value={settings.hero_title_2 || ''}
                  onChange={(e) => setField('hero_title_2', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Hero Açıklama Metni</label>
              <textarea
                rows={3}
                value={settings.hero_description || ''}
                onChange={(e) => setField('hero_description', e.target.value)}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>1. Buton Yazısı</label>
                <input
                  type="text"
                  value={settings.hero_btn_primary || ''}
                  onChange={(e) => setField('hero_btn_primary', e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>2. Buton Yazısı</label>
                <input
                  type="text"
                  value={settings.hero_btn_secondary || ''}
                  onChange={(e) => setField('hero_btn_secondary', e.target.value)}
                />
              </div>
            </div>

            {/* Hero Media Selectors */}
            <div className="admin-form-row" style={{ marginTop: '12px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Hero Arka Plan Fotoğrafı
                </label>
                {settings.hero_bg_image && (
                  <img
                    src={getMediaUrl(settings.hero_bg_image)}
                    alt="Hero Arka Plan"
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                  />
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={settings.hero_bg_image || ''}
                    onChange={(e) => setField('hero_bg_image', e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setPicker({ open: true, targetKey: 'hero_bg_image', type: 'image' })}
                  >
                    <ImageIcon size={14} /> Galeriden Seç / Yükle
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Hero Tanıtım Videosu
                </label>
                {settings.hero_video_url && (
                  <video
                    src={getMediaUrl(settings.hero_video_url)}
                    controls
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', background: '#000' }}
                  />
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={settings.hero_video_url || ''}
                    onChange={(e) => setField('hero_video_url', e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setPicker({ open: true, targetKey: 'hero_video_url', type: 'video' })}
                  >
                    <Video size={14} /> Videolardan Seç / Yükle
                  </button>
                </div>
              </div>
            </div>

            <h3 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, margin: '28px 0 16px' }}>
              Güven & Kalite Şeridi Maddeleri (Hero Altı)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>{n}. Madde</label>
                  <input
                    type="text"
                    value={settings[`strip_item_${n}`] || ''}
                    onChange={(e) => setField(`strip_item_${n}`, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT, MISSION & VISION */}
        {activeTab === 'about' && (
          <div className="admin-form">
            <h3 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>
              Hakkımızda Bölümü & Kurumsal Sayfa İçerikleri
            </h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Hakkımızda Başlığı (1. Satır)</label>
                <input
                  type="text"
                  value={settings.about_title || ''}
                  onChange={(e) => setField('about_title', e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Hakkımızda Vurgulu Başlık (2. Satır)</label>
                <input
                  type="text"
                  value={settings.about_title_highlight || ''}
                  onChange={(e) => setField('about_title_highlight', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Hakkımızda 1. Paragraf</label>
              <textarea
                rows={3}
                value={settings.about_text_1 || ''}
                onChange={(e) => setField('about_text_1', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Hakkımızda 2. Paragraf</label>
              <textarea
                rows={3}
                value={settings.about_text_2 || ''}
                onChange={(e) => setField('about_text_2', e.target.value)}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Misyonumuz Metni</label>
                <textarea
                  rows={4}
                  value={settings.about_mission || ''}
                  onChange={(e) => setField('about_mission', e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label>Vizyonumuz Metni</label>
                <textarea
                  rows={4}
                  value={settings.about_vision || ''}
                  onChange={(e) => setField('about_vision', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Hakkımızda Ana Fotoğraf
                </label>
                {settings.about_image_main && (
                  <img
                    src={getMediaUrl(settings.about_image_main)}
                    alt="Hakkımızda Ana"
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                  />
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setPicker({ open: true, targetKey: 'about_image_main', type: 'image' })}
                >
                  <ImageIcon size={14} /> Fotoğraf Seç / Yükle
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Hakkımızda İkinci (Küçük) Fotoğraf
                </label>
                {settings.about_image_small && (
                  <img
                    src={getMediaUrl(settings.about_image_small)}
                    alt="Hakkımızda Küçük"
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                  />
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setPicker({ open: true, targetKey: 'about_image_small', type: 'image' })}
                >
                  <ImageIcon size={14} /> Fotoğraf Seç / Yükle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STATS / COUNTERS */}
        {activeTab === 'stats' && (
          <div className="admin-form">
            <h3 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
              Sitedeki Sayaçlar ve İstatistikler
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>
              Ana sayfada ve Hakkımızda sayfasında görünen rakamsal başarı istatistiklerini buradan değiştirebilirsiniz.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {stats.map((st, idx) => (
                <div
                  key={st.id || idx}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(184,134,11,0.25)',
                    borderRadius: '14px',
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                    {idx + 1}. İstatistik Kartı
                  </div>
                  <div className="admin-form-group">
                    <label>Değer / Sayı (Örn: 500+)</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, value: val } : item)));
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Başlık (Örn: Tamamlanan Proje)</label>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const ttl = e.target.value;
                        setStats((prev) => prev.map((item, i) => (i === idx ? { ...item, title: ttl } : item)));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>Proje Kategorileri ({categories.length})</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                  Projeler sayfasındaki filtreleme sekmelerini buradan ekleyebilir veya düzenleyebilirsiniz.
                </p>
              </div>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  setCatForm({ id: null, name: '', slug: '', description: '', sort_order: categories.length + 1 });
                  setShowCatForm(true);
                }}
              >
                <Plus size={16} /> Yeni Kategori Ekle
              </button>
            </div>

            {showCatForm && (
              <div className="admin-form" style={{ marginBottom: '20px' }}>
                <form onSubmit={handleSaveCategory}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label>Kategori Adı *</label>
                      <input
                        type="text"
                        value={catForm.name}
                        onChange={(e) =>
                          setCatForm((f) => ({
                            ...f,
                            name: e.target.value,
                            slug: f.id ? f.slug : generateSlug(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>URL Slug *</label>
                      <input
                        type="text"
                        value={catForm.slug}
                        onChange={(e) => setCatForm((f) => ({ ...f, slug: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Sıra</label>
                      <input
                        type="number"
                        value={catForm.sort_order}
                        onChange={(e) => setCatForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Açıklama</label>
                    <input
                      type="text"
                      value={catForm.description || ''}
                      onChange={(e) => setCatForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="admin-btn admin-btn-primary">
                      <Save size={15} /> {catForm.id ? 'Güncelle' : 'Ekle'}
                    </button>
                    <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCatForm(false)}>
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sıra</th>
                    <th>Kategori Adı</th>
                    <th>Slug</th>
                    <th>Açıklama</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.sort_order || 0}</td>
                      <td style={{ color: 'white', fontWeight: 600 }}>{cat.name}</td>
                      <td>
                        <span className="admin-badge badge-gold">{cat.slug}</span>
                      </td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => {
                              setCatForm({
                                id: cat.id,
                                name: cat.name,
                                slug: cat.slug,
                                description: cat.description || '',
                                sort_order: cat.sort_order || 0,
                              });
                              setShowCatForm(true);
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FOOTER & CONTACT TEXTS */}
        {activeTab === 'footer' && (
          <div className="admin-form">
            <h3 style={{ color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>
              İletişim Bölümü & Alt Bilgi (Footer) Metinleri
            </h3>

            <div className="admin-form-group">
              <label>Alt Bilgi (Footer) Kurumsal Tanıtım Yazısı</label>
              <textarea
                rows={3}
                value={settings.footer_description || ''}
                onChange={(e) => setField('footer_description', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Çalışma Saatleri (İletişim Sayfasında Görünür)</label>
              <input
                type="text"
                value={settings.working_hours || ''}
                onChange={(e) => setField('working_hours', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>İletişim Bölümü Başlığı</label>
              <input
                type="text"
                value={settings.contact_heading || ''}
                onChange={(e) => setField('contact_heading', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>İletişim Bölümü Alt Açıklaması</label>
              <textarea
                rows={3}
                value={settings.contact_subheading || ''}
                onChange={(e) => setField('contact_subheading', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Media Library Picker Modal */}
      {picker.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setPicker({ open: false, targetKey: '', type: 'image' })}
        >
          <div
            style={{
              background: '#1a1a2e',
              borderRadius: '18px',
              border: '1px solid rgba(184,134,11,0.35)',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                  {picker.type === 'video' ? 'Video Kütüphanesinden Seç veya Yükle' : 'Fotoğraf Kütüphanesinden Seç veya Yükle'}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  Mevcut dosyalardan birine tıklayın veya bilgisayarınızdan yeni dosya yükleyin
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={picker.type === 'video' ? 'video/*' : 'image/*'}
                  style={{ display: 'none' }}
                  onChange={(e) => handleDirectUploadForField(e.target.files)}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingField}
                >
                  <Upload size={14} />
                  {uploadingField ? 'Yükleniyor...' : 'Bilgisayardan Yeni Yükle'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setPicker({ open: false, targetKey: '', type: 'image' })}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {mediaList
                .filter((m) => m.file_type === picker.type)
                .map((m) => {
                  const url = getMediaUrl(m.file_path);
                  const isSelected = settings[picker.targetKey] === url;
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setField(picker.targetKey, url);
                        setPicker({ open: false, targetKey: '', type: 'image' });
                        toast.success('Medya seçildi! Kaydet butonuna basarak kalıcı hale getirin.');
                      }}
                      style={{
                        aspectRatio: '16/10',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: isSelected ? '3px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                        position: 'relative',
                        background: '#000',
                      }}
                    >
                      {picker.type === 'video' ? (
                        <video src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                      ) : (
                        <img src={getMediaUrl(m.thumbnail_path || m.file_path)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      )}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

