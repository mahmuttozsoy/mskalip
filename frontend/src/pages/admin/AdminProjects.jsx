import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Pencil, X, Upload, Star, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const initialForm = {
  title: '',
  slug: '',
  category_id: '',
  description: '',
  short_description: '',
  location: '',
  area: '',
  year: new Date().getFullYear(),
  status: 'tamamlandi',
  is_featured: false,
  sort_order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [projectMedia, setProjectMedia] = useState([]);
  const [allMedia, setAllMedia] = useState([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchProjects();
    api.get('/categories/all').then((r) => setCategories(r.data.categories || [])).catch(() => {});
    api.get('/media?limit=250').then((r) => setAllMedia(r.data.media || [])).catch(() => {});
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects?limit=100');
      setProjects(res.data.projects || []);
    } catch {
      toast.error('Projeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMedia = async (projectId) => {
    try {
      const res = await api.get(`/media/project/${projectId}`);
      setProjectMedia(res.data.media || []);
    } catch {
      setProjectMedia([]);
    }
  };

  const generateSlug = (title) => {
    return title
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
  };

  const handleTitleChange = (title) => {
    setForm((f) => ({ ...f, title, slug: editProject ? f.slug : generateSlug(title) }));
  };

  const openEdit = (project) => {
    setEditProject(project);
    setForm({
      title: project.title || '',
      slug: project.slug || '',
      category_id: project.category_id || '',
      description: project.description || '',
      short_description: project.short_description || '',
      location: project.location || '',
      area: project.area || '',
      year: project.year || new Date().getFullYear(),
      status: project.status || 'tamamlandi',
      is_featured: !!project.is_featured,
      sort_order: project.sort_order || 0,
    });
    fetchProjectMedia(project.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      category_id: form.category_id || null,
      area: form.area ? parseFloat(form.area) : null,
    };

    try {
      if (editProject) {
        await api.put(`/projects/${editProject.id}`, { ...payload, is_active: 1 });
        toast.success('Proje güncellendi');
      } else {
        await api.post('/projects', payload);
        toast.success('Proje eklendi');
      }
      setShowForm(false);
      setEditProject(null);
      setProjectMedia([]);
      setForm(initialForm);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.error || 'İşlem başarısız');
    }
  };

  const handleMediaUpload = async (files) => {
    if (!files || files.length === 0 || !editProject) return;
    setUploadingMedia(true);
    const formData = new FormData();
    formData.append('project_id', editProject.id);
    Array.from(files).forEach((f) => formData.append('files', f));

    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Görseller projeye eklendi');
      fetchProjectMedia(editProject.id);
      fetchProjects();
    } catch (err) {
      toast.error('Görsel yüklenemedi: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSetCover = async (mediaId) => {
    try {
      await api.put(`/media/${mediaId}/cover`);
      toast.success('Kapak fotoğrafı güncellendi');
      fetchProjectMedia(editProject.id);
      fetchProjects();
    } catch {
      toast.error('Kapak fotoğrafı ayarlanamadı');
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/media/${mediaId}`);
      toast.success('Görsel silindi');
      setProjectMedia((m) => m.filter((item) => item.id !== mediaId));
      fetchProjects();
    } catch {
      toast.error('Görsel silinemedi');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Proje silindi');
      setProjects((p) => p.filter((pr) => pr.id !== id));
    } catch {
      toast.error('Silme hatası');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      await api.put(`/projects/${project.id}`, {
        ...project,
        is_featured: !project.is_featured,
        is_active: 1,
      });
      toast.success(!project.is_featured ? 'Proje öne çıkanlara eklendi' : 'Öne çıkanlardan çıkarıldı');
      fetchProjects();
    } catch {
      toast.error('Güncelleme hatası');
    }
  };

  const handleAssignFromLibrary = async (mediaItem) => {
    if (!editProject) return;
    try {
      await api.put(`/media/${mediaItem.id}/assign`, { project_id: editProject.id });
      toast.success('Medya bu projeye eklendi!');
      fetchProjectMedia(editProject.id);
      fetchProjects();
    } catch {
      toast.error('Medya atanamadı');
    }
  };

  const getImgUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/uploads')) return path;
    return `/${path.replace(/^\/+/, '')}`;
  };

  return (
    <div>
      <div className="admin-topbar">
        <div className="admin-topbar-title">
          <h1>Proje Yönetimi</h1>
          <p>{projects.length} proje</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditProject(null);
            setProjectMedia([]);
            setForm(initialForm);
          }}
        >
          <Plus size={16} /> Yeni Proje
        </button>
      </div>

      <div className="admin-content">
        {/* Form */}
        {showForm && (
          <div className="admin-form" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                {editProject ? `Proje Düzenle: ${editProject.title}` : 'Yeni Proje Ekle'}
              </h3>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => {
                  setShowForm(false);
                  setEditProject(null);
                  setProjectMedia([]);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Proje Adı *</label>
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
                  <label>Kategori</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  >
                    <option value="">Kategori Seç</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Durum</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                    <option value="tamamlandi">Tamamlandı</option>
                    <option value="devam_ediyor">Devam Ediyor</option>
                    <option value="planlama">Planlama</option>
                  </select>
                </div>
              </div>

              <div className="admin-grid-3">
                <div className="admin-form-group">
                  <label>Konum</label>
                  <input
                    type="text"
                    placeholder="İstanbul, Kadıköy"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>İnşaat Alanı (m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Örn: 2500"
                    value={form.area}
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Yıl</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Kısa Açıklama</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                  placeholder="Proje hakkında kısa özet..."
                />
              </div>

              <div className="admin-form-group">
                <label>Detaylı Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Proje hakkında detaylı bilgi..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="is_featured" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  Ana Sayfada Öne Çıkan Proje Olarak Göster
                </label>
              </div>

              {/* Project Media Management when editing */}
              {editProject && (
                <div
                  style={{
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                      Proje Görselleri & Videoları ({projectMedia.length})
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setShowMediaPicker(true)}
                      >
                        <ImageIcon size={14} /> Kütüphaneden Seç
                      </button>
                      <label className="admin-btn admin-btn-primary admin-btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={14} />
                        {uploadingMedia ? 'Yükleniyor...' : 'Yeni Dosya Yükle'}
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleMediaUpload(e.target.files)}
                          disabled={uploadingMedia}
                        />
                      </label>
                    </div>
                  </div>

                  {projectMedia.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
                      Bu projeye henüz görsel eklenmemiş. Sağ üstten görsel yükleyebilirsiniz.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {projectMedia.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            position: 'relative',
                            aspectRatio: '4/3',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: m.is_cover ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                            background: '#111',
                          }}
                        >
                          <img
                            src={getImgUrl(m.thumbnail_path || m.file_path)}
                            alt={m.original_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {m.is_cover ? (
                            <span
                              style={{
                                position: 'absolute',
                                top: '6px',
                                left: '6px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              Kapak
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCover(m.id)}
                              title="Kapak Fotoğrafı Yap"
                              style={{
                                position: 'absolute',
                                top: '6px',
                                left: '6px',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                fontSize: '10px',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Star size={10} /> Kapak Yap
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(m.id)}
                            title="Sil"
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: 'rgba(239,68,68,0.85)',
                              color: 'white',
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="admin-btn admin-btn-primary">
                <Save size={16} />
                {editProject ? 'Değişiklikleri Güncelle' : 'Projeyi Kaydet'}
              </button>
            </form>
          </div>
        )}

        {/* Projects Table */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Yükleniyor...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <p>Henüz proje yok. Yukarıdan yeni proje ekleyin.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Proje Adı</th>
                  <th>Kategori</th>
                  <th>Konum</th>
                  <th>Durum</th>
                  <th>Öne Çıkan</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td style={{ width: '64px' }}>
                      {project.cover_image ? (
                        <img
                          src={getImgUrl(project.cover_image)}
                          alt={project.title}
                          style={{ width: '52px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '52px',
                            height: '38px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(255,255,255,0.3)',
                          }}
                        >
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td style={{ color: 'white', fontWeight: 600 }}>{project.title}</td>
                    <td>{project.category_name || '-'}</td>
                    <td>{project.location || '-'}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          project.status === 'tamamlandi'
                            ? 'badge-success'
                            : project.status === 'devam_ediyor'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}
                      >
                        {project.status === 'tamamlandi'
                          ? 'Tamamlandı'
                          : project.status === 'devam_ediyor'
                          ? 'Devam Ediyor'
                          : 'Planlama'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(project)}
                        title="Öne Çıkan Durumunu Değiştirmek İçin Tıklayın"
                        style={{
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                        }}
                      >
                        {project.is_featured ? (
                          <span className="admin-badge badge-gold">⭐ Öne Çıkan</span>
                        ) : (
                          <span className="admin-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                            ☆ Standart
                          </span>
                        )}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => openEdit(project)}
                          title="Düzenle ve Görsel Ekle"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(project.id)}
                          title="Sil"
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

      {/* Media Library Picker Modal for Project */}
      {showMediaPicker && editProject && (
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
          onClick={() => setShowMediaPicker(false)}
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
                  Medya Kütüphanesinden "{editProject.title}" Projesine Ekle
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  Projeye dahil etmek istediğiniz fotoğraf veya videonun üzerine tıklayın
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setShowMediaPicker(false)}
              >
                <X size={16} /> Kapat
              </button>
            </div>
            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
              }}
            >
              {allMedia.map((m) => {
                const alreadyInProject = projectMedia.some((pm) => pm.id === m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => !alreadyInProject && handleAssignFromLibrary(m)}
                    style={{
                      aspectRatio: '4/3',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: alreadyInProject ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      opacity: alreadyInProject ? 0.55 : 1,
                      cursor: alreadyInProject ? 'default' : 'pointer',
                      position: 'relative',
                      background: '#000',
                    }}
                  >
                    {m.file_type === 'video' ? (
                      <video src={getImgUrl(m.file_path)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                    ) : (
                      <img src={getImgUrl(m.thumbnail_path || m.file_path)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    )}
                    {alreadyInProject && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '6px',
                          left: '6px',
                          background: '#10b981',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        ✓ Projede
                      </span>
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
