import { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, Trash2, CheckSquare, Square, Star } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('');
  const [uploadProjectId, setUploadProjectId] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api
      .get('/projects?limit=100')
      .then((r) => setProjects(r.data.projects || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [filter, projectFilter]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter !== 'all') query.set('type', filter);
      if (projectFilter) query.set('project_id', projectFilter);
      query.set('limit', '250');
      const res = await api.get(`/media?${query.toString()}`);
      setMedia(res.data.media || []);
    } catch {
      toast.error('Medya yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    if (uploadProjectId) {
      formData.append('project_id', uploadProjectId);
    }
    Array.from(files).forEach((f) => formData.append('files', f));

    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      toast.success(`${res.data.files.length} dosya yüklendi!`);
      fetchMedia();
    } catch (err) {
      toast.error('Yükleme hatası: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu medyayı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/media/${id}`);
      toast.success('Medya silindi');
      setMedia((m) => m.filter((item) => item.id !== id));
      setSelected((s) => s.filter((sid) => sid !== id));
    } catch {
      toast.error('Silme hatası');
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`${selected.length} medyayı silmek istediğinizden emin misiniz?`)) return;

    try {
      await Promise.all(selected.map((id) => api.delete(`/media/${id}`)));
      toast.success(`${selected.length} medya silindi`);
      setMedia((m) => m.filter((item) => !selected.includes(item.id)));
      setSelected([]);
    } catch {
      toast.error('Toplu silme hatası');
    }
  };

  const handleAssignProject = async (mediaId, newProjectId) => {
    try {
      await api.put(`/media/${mediaId}/assign`, { project_id: newProjectId || null });
      toast.success('Medya projeye atandı');
      fetchMedia();
    } catch {
      toast.error('Atama hatası');
    }
  };

  const handleSetCover = async (mediaId) => {
    try {
      await api.put(`/media/${mediaId}/cover`);
      toast.success('Kapak fotoğrafı güncellendi');
      fetchMedia();
    } catch {
      toast.error('Kapak fotoğrafı ayarlanamadı');
    }
  };

  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((sid) => sid !== id) : [...s, id]));
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
          <h1>Medya Yönetimi</h1>
          <p>{media.length} dosya</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={uploadProjectId}
            onChange={(e) => setUploadProjectId(e.target.value)}
            style={{
              padding: '9px 14px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontSize: '13px',
            }}
          >
            <option value="" style={{ background: '#1a1a2e' }}>
              Genel Galeriye Yükle (Projesiz)
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#1a1a2e' }}>
                Projeye Yükle: {p.title}
              </option>
            ))}
          </select>

          {selected.length > 0 && (
            <button className="admin-btn admin-btn-danger" onClick={handleBulkDelete}>
              <Trash2 size={16} />
              {selected.length} Sil
            </button>
          )}
          <button className="admin-btn admin-btn-primary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} />
            Dosya Yükle
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Upload Area */}
        <div
          className={`upload-area ${dragOver ? 'dragover' : ''}`}
          style={{ marginBottom: '24px' }}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={(e) => handleUpload(e.target.files)}
          />
          <div className="upload-area-icon">
            <Upload size={36} />
          </div>
          {uploading ? (
            <div>
              <h3 style={{ color: 'white', marginBottom: '12px' }}>Yükleniyor... {uploadProgress}%</h3>
              <div
                style={{
                  width: '200px',
                  height: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'var(--color-primary)',
                    borderRadius: '2px',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <h3>Dosyaları buraya sürükleyip bırakın</h3>
              <p>
                veya tıklayarak seçin • JPEG, PNG, WebP, MP4 destekleniyor • Maks. 100MB
                {uploadProjectId && (
                  <strong style={{ color: 'var(--color-primary)', display: 'block', marginTop: '6px' }}>
                    Seçili Proje: {projects.find((p) => String(p.id) === String(uploadProjectId))?.title}
                  </strong>
                )}
              </p>
            </>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['all', 'image', 'video'].map((f) => (
            <button
              key={f}
              className={`admin-btn ${filter === f ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tümü' : f === 'image' ? '🖼 Fotoğraflar' : '🎥 Videolar'}
            </button>
          ))}

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '12px',
              marginLeft: '8px',
            }}
          >
            <option value="" style={{ background: '#1a1a2e' }}>
              Tüm Projeler
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#1a1a2e' }}>
                {p.title}
              </option>
            ))}
          </select>

          {selected.length > 0 && (
            <span
              style={{
                color: 'var(--color-primary)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '8px',
              }}
            >
              {selected.length} seçili
            </span>
          )}
        </div>

        {/* Media Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.4)' }}>Yükleniyor...</div>
        ) : media.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
            <ImageIcon size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Henüz medya yok. Yukarıdan dosya yükleyin.</p>
          </div>
        ) : (
          <div className="admin-media-grid">
            {media.map((item) => (
              <div
                key={item.id}
                className={`admin-media-item ${selected.includes(item.id) ? 'selected' : ''}`}
                onClick={() => toggleSelect(item.id)}
              >
                {item.file_type === 'video' ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Video size={32} color="rgba(255,255,255,0.5)" />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '34px',
                        left: '8px',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.6)',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      VIDEO
                    </span>
                  </div>
                ) : (
                  <img
                    src={getImgUrl(item.thumbnail_path || item.file_path)}
                    alt={item.original_name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Select indicator */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {selected.includes(item.id) ? (
                    <CheckSquare size={20} color="var(--color-primary)" fill="var(--color-primary)" />
                  ) : (
                    <Square size={20} color="rgba(255,255,255,0.5)" />
                  )}
                  {item.is_cover ? (
                    <span
                      style={{
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
                  ) : null}
                </div>

                <div className="admin-media-actions" onClick={(e) => e.stopPropagation()}>
                  {item.project_id && !item.is_cover && item.file_type === 'image' && (
                    <button
                      className="admin-media-action-btn"
                      onClick={() => handleSetCover(item.id)}
                      title="Proje Kapağı Yap"
                    >
                      <Star size={12} color="#f59e0b" />
                    </button>
                  )}
                  <button
                    className="admin-media-action-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Sil"
                  >
                    <Trash2 size={12} color="#ef4444" />
                  </button>
                </div>

                {/* Project assignment bar */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '4px 6px',
                    background: 'rgba(15,15,26,0.85)',
                  }}
                >
                  <select
                    value={item.project_id || ''}
                    onChange={(e) => handleAssignProject(item.id, e.target.value)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>
                      Proje Atanmamış
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: '#1a1a2e' }}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
