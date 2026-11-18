import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Pencil, X, Wrench } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const iconOptions = [
  { value: 'home', label: 'Konut / Ev (home)' },
  { value: 'building2', label: 'Ticari Bina (building2)' },
  { value: 'pencil-ruler', label: 'Mimari & Tasarım (pencil-ruler)' },
  { value: 'hammer', label: 'Restorasyon & Yapım (hammer)' },
  { value: 'sofa', label: 'İç Mimari (sofa)' },
  { value: 'layers', label: 'Altyapı & Zemin (layers)' },
  { value: 'trees', label: 'Çevre & Peyzaj (trees)' },
];

const initialForm = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  icon: 'home',
  sort_order: 0,
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      setServices(res.data.services || []);
    } catch {
      toast.error('Hizmetler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) =>
    title
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

  const handleTitleChange = (title) => {
    setForm((f) => ({ ...f, title, slug: editItem ? f.slug : generateSlug(title) }));
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      short_description: item.short_description || '',
      description: item.description || '',
      icon: item.icon || 'home',
      sort_order: item.sort_order || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/services/${editItem.id}`, { ...form, is_active: 1 });
        toast.success('Hizmet güncellendi');
      } else {
        await api.post('/services', form);
        toast.success('Hizmet eklendi');
      }
      setShowForm(false);
      setEditItem(null);
      setForm(initialForm);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.error || 'İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Hizmet silindi');
      setServices((s) => s.filter((item) => item.id !== id));
    } catch {
      toast.error('Silme hatası');
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div className="admin-topbar-title">
          <h1>Hizmet Yönetimi</h1>
          <p>{services.length} aktif hizmet</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditItem(null);
            setForm(initialForm);
          }}
        >
          <Plus size={16} /> Yeni Hizmet
        </button>
      </div>

      <div className="admin-content">
        {showForm && (
          <div className="admin-form" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                {editItem ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
              </h3>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => {
                  setShowForm(false);
                  setEditItem(null);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Hizmet Başlığı *</label>
                  <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>URL Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>İkon</label>
                  <select value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}>
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Sıralama</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Kısa Açıklama</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                  placeholder="Kart üzerinde görünecek kısa açıklama"
                />
              </div>

              <div className="admin-form-group">
                <label>Detaylı Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Hizmetler sayfasında görünecek detaylı açıklama..."
                />
              </div>

              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={16} />
                {editItem ? 'Güncelle' : 'Kaydet'}
              </button>
            </form>
          </div>
        )}

        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Yükleniyor...</div>
          ) : services.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <Wrench size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>Henüz hizmet eklenmemiş.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Hizmet Adı</th>
                  <th>Kısa Açıklama</th>
                  <th>İkon</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.sort_order || 0}</td>
                    <td style={{ color: 'white', fontWeight: 600 }}>{service.title}</td>
                    <td>{service.short_description || '-'}</td>
                    <td>
                      <span className="admin-badge badge-gold">{service.icon || 'home'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEdit(service)}>
                          <Pencil size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
