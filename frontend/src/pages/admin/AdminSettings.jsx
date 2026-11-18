import { useState, useEffect } from 'react';
import { Save, Lock, ExternalLink } from 'lucide-react';
import api from '../../lib/api';
import {
  getInstagramUrl,
  getInstagramHandle,
  getFacebookUrl,
  getFacebookHandle,
  getWhatsappUrl,
} from '../../lib/socialHelpers';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then((r) => {
        const raw = r.data.settings || {};
        const waVal = raw.whatsapp_number || raw.company_whatsapp || raw.company_phone || '+90 536 869 62 51';
        setSettings({
          ...raw,
          company_phone: raw.company_phone || '+90 536 869 62 51',
          whatsapp_number: waVal,
          company_whatsapp: waVal,
          instagram_url: getInstagramHandle(raw.instagram_url),
          facebook_url: getFacebookHandle(raw.facebook_url),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const waVal = settings.whatsapp_number || settings.company_whatsapp || settings.company_phone || '+90 536 869 62 51';
      const payload = {
        ...settings,
        whatsapp_number: waVal,
        company_whatsapp: waVal,
        instagram_url: getInstagramUrl(settings.instagram_url),
        facebook_url: getFacebookUrl(settings.facebook_url),
      };
      await api.put('/settings', payload);
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch {
      toast.error('Kaydetme hatası');
    } finally {
      setSaving(false);
    }
  };

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new_password.length < 6) {
      return toast.error('Yeni şifre en az 6 karakter olmalıdır');
    }
    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error('Yeni şifreler eşleşmiyor');
    }
    setChangingPass(true);
    try {
      await api.put('/auth/change-password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      toast.success('Şifreniz başarıyla güncellendi');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Şifre değiştirilemedi');
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        Yükleniyor...
      </div>
    );
  }

  const igPreview = getInstagramUrl(settings.instagram_url);
  const fbPreview = getFacebookUrl(settings.facebook_url);
  const waPreview = getWhatsappUrl(settings.whatsapp_number, settings.company_phone);

  return (
    <div>
      <div className="admin-topbar">
        <div className="admin-topbar-title">
          <h1>Site Ayarları</h1>
          <p>İletişim bilgileri, sosyal medya ve yönetici güvenliği</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
        </button>
      </div>

      <div className="admin-content">
        {/* Şirket Bilgileri */}
        <div className="admin-form" style={{ marginBottom: '20px' }}>
          <h3
            style={{
              color: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Şirket & İletişim Bilgileri
          </h3>

          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label>Şirket Adı</label>
              <input
                type="text"
                placeholder="MŞ Group İnşaat Mimarlık"
                value={settings.company_name || ''}
                onChange={(e) => set('company_name', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Telefon Numarası</label>
              <input
                type="text"
                placeholder="0532 xxx xx xx"
                value={settings.company_phone || ''}
                onChange={(e) => set('company_phone', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>E-posta Adresi</label>
              <input
                type="text"
                placeholder="info@msgroup.com"
                value={settings.company_email || ''}
                onChange={(e) => set('company_email', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Kuruluş Yılı</label>
              <input
                type="text"
                placeholder="2010"
                value={settings.company_founded || ''}
                onChange={(e) => set('company_founded', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-col-span-2">
              <label>Merkez Ofis Adresi</label>
              <textarea
                rows={2}
                placeholder="Açık adresiniz..."
                value={settings.company_address || ''}
                onChange={(e) => set('company_address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya - Süper Basit Kullanıcı Adı & Numara Girişi */}
        <div className="admin-form" style={{ marginBottom: '20px' }}>
          <h3
            style={{
              color: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Sosyal Medya & WhatsApp (Otomatik Yönlendirme)
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>
            Link kopyalamanıza gerek yoktur; yalnızca <strong>kullanıcı adınızı</strong> ve <strong>telefon numaranızı</strong> yazın, sistem otomatik olarak bağlar.
          </p>

          <div className="admin-grid-3">
            {/* WhatsApp */}
            <div className="admin-form-group">
              <label>WhatsApp Telefon Numarası</label>
              <input
                type="text"
                placeholder="Örn: 0532 123 45 67"
                value={settings.whatsapp_number || ''}
                onChange={(e) => set('whatsapp_number', e.target.value)}
              />
              <a
                href={waPreview}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
              >
                <ExternalLink size={11} /> Otomatik: {waPreview}
              </a>
            </div>

            {/* Instagram */}
            <div className="admin-form-group">
              <label>Instagram Kullanıcı Adı</label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  @
                </span>
                <input
                  type="text"
                  placeholder="msgroupinsaat"
                  value={settings.instagram_url || ''}
                  onChange={(e) => set('instagram_url', e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
              {igPreview && (
                <a
                  href={igPreview}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11px', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                >
                  <ExternalLink size={11} /> {igPreview}
                </a>
              )}
            </div>

            {/* Facebook */}
            <div className="admin-form-group">
              <label>Facebook Kullanıcı / Sayfa Adı</label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  @
                </span>
                <input
                  type="text"
                  placeholder="msgroupinsaat"
                  value={settings.facebook_url || ''}
                  onChange={(e) => set('facebook_url', e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
              {fbPreview && (
                <a
                  href={fbPreview}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '11px', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                >
                  <ExternalLink size={11} /> {fbPreview}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-form" style={{ marginBottom: '20px' }}>
          <h3
            style={{
              color: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Google Arama (SEO) Ayarları
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label>Site Başlığı</label>
              <input
                type="text"
                placeholder="MŞ Group İnşaat & Mimarlık"
                value={settings.site_title || ''}
                onChange={(e) => set('site_title', e.target.value)}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Site Açıklaması</label>
              <textarea
                rows={2}
                placeholder="Kalite ve güvenilirliğin adresi - İnşaat ve Mimarlık çözümleri"
                value={settings.site_description || ''}
                onChange={(e) => set('site_description', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="admin-form" style={{ marginBottom: '20px' }}>
          <h3
            style={{
              color: 'var(--color-primary)',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Güvenlik & Yönetici Şifresi Değiştir
          </h3>
          <form onSubmit={handlePasswordChange}>
            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label>Mevcut Şifre</label>
                <input
                  type="password"
                  value={passwords.current_password}
                  onChange={(e) => setPasswords((p) => ({ ...p, current_password: e.target.value }))}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Yeni Şifre</label>
                <input
                  type="password"
                  value={passwords.new_password}
                  onChange={(e) => setPasswords((p) => ({ ...p, new_password: e.target.value }))}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm_password: e.target.value }))}
                  required
                />
              </div>
            </div>
            <button type="submit" className="admin-btn admin-btn-secondary" disabled={changingPass}>
              <Lock size={15} />
              {changingPass ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
