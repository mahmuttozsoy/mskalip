import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, Phone } from 'lucide-react';
import api from '../../lib/api';
import { getWhatsappUrl } from '../../lib/socialHelpers';
import toast from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchMessages(); }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? '?is_read=false' : filter === 'read' ? '?is_read=true' : '';
      const res = await api.get(`/contact${params}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      toast.error('Mesajlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: 1 } : m));
      if (selected?.id === id) setSelected(s => ({ ...s, is_read: 1 }));
    } catch (err) {}
  };

  const deleteMsg = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Mesaj silindi');
      setMessages(msgs => msgs.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      toast.error('Silme hatası');
    }
  };

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id);
  };

  return (
    <div>
      <div className="admin-topbar">
        <div className="admin-topbar-title">
          <h1>Mesajlar</h1>
          <p>{messages.length} mesaj</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'unread', 'read'].map(f => (
            <button
              key={f}
              className={`admin-btn ${filter === f ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : 'Okunmuş'}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-content">
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: '20px' }}>
          {/* Message List */}
          <div className="admin-table-card">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Yükleniyor...</div>
            ) : messages.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                <Mail size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>Mesaj bulunamadı</p>
              </div>
            ) : (
              <div>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      background: selected?.id === msg.id ? 'rgba(184,134,11,0.08)' : 'transparent',
                      borderLeft: !msg.is_read ? '3px solid var(--color-primary)' : '3px solid transparent',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { if (selected?.id !== msg.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ color: !msg.is_read ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: !msg.is_read ? 700 : 500, fontSize: '14px' }}>
                        {msg.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    {msg.subject && (
                      <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>
                        {msg.subject}
                      </div>
                    )}
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selected && (
            <div className="admin-table-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>{selected.name}</h3>
                  {selected.subject && (
                    <div style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                      Konu: {selected.subject}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '13px' }}>
                        <Phone size={14} /> {selected.phone}
                      </a>
                    )}
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                        <Mail size={14} /> {selected.email}
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteMsg(selected.id)}>
                    <Trash2 size={14} /> Sil
                  </button>
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-line' }}>
                  {selected.message}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {selected.phone && (
                  <a href={getWhatsappUrl(selected.phone)} target="_blank" rel="noreferrer" className="admin-btn admin-btn-primary admin-btn-sm">
                    WhatsApp ile Yanıtla
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}?subject=MŞ Group İletişim`} className="admin-btn admin-btn-secondary admin-btn-sm">
                    E-posta ile Yanıtla
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
