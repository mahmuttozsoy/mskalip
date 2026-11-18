import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Image, MessageSquare, Eye, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, media: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, mediaRes, messagesRes] = await Promise.all([
          api.get('/projects?limit=1').catch(() => ({ data: { total: 0 } })),
          api.get('/media?limit=250').catch(() => ({ data: { media: [] } })),
          api.get('/contact?limit=5').catch(() => ({ data: { messages: [], total: 0, unread: 0 } })),
        ]);
        
        setStats({
          projects: projectsRes.data.total || 0,
          media: mediaRes.data.total ?? mediaRes.data.media?.length ?? 0,
          messages: messagesRes.data.total || 0,
          unread: messagesRes.data.unread || 0,
        });
        setRecentMessages(messagesRes.data.messages?.slice(0, 5) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Toplam Proje', value: stats.projects, icon: FolderOpen, color: '#B8860B', bg: 'rgba(184,134,11,0.1)', to: '/admin/projeler' },
    { label: 'Medya Dosyası', value: stats.media, icon: Image, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', to: '/admin/medya' },
    { label: 'Toplam Mesaj', value: stats.messages, icon: MessageSquare, color: '#10b981', bg: 'rgba(16,185,129,0.1)', to: '/admin/mesajlar' },
    { label: 'Okunmamış', value: stats.unread, icon: Eye, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', to: '/admin/mesajlar' },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <div className="admin-topbar-title">
          <h1>Dashboard</h1>
          <p>Şah Group Yönetim Paneli'ne hoş geldiniz</p>
        </div>
        <Link to="/admin/projeler" className="admin-btn admin-btn-primary">
          + Yeni Proje
        </Link>
      </div>

      <div className="admin-content">
        {/* Stat Cards */}
        <div className="admin-stat-cards">
          {cards.map((card, i) => (
            <Link key={i} to={card.to} className="admin-stat-card" style={{ textDecoration: 'none' }}>
              <div className="admin-stat-card-icon" style={{ background: card.bg }}>
                <card.icon size={24} color={card.color} />
              </div>
              <div>
                <div className="admin-stat-card-value">{loading ? '...' : card.value}</div>
                <div className="admin-stat-card-label">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Messages */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h3>Son Mesajlar</h3>
            <Link to="/admin/mesajlar" className="admin-btn admin-btn-secondary admin-btn-sm">
              Tümünü Gör <ArrowRight size={14} />
            </Link>
          </div>
          
          {recentMessages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)' }}>
              <MessageSquare size={48} style={{ margin: '0 auto 12px' }} />
              <p>Henüz mesaj yok</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad</th>
                  <th>Telefon</th>
                  <th>Mesaj</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map(msg => (
                  <tr key={msg.id}>
                    <td style={{ color: 'white', fontWeight: 600 }}>{msg.name}</td>
                    <td>{msg.phone || '-'}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.message}
                    </td>
                    <td>
                      <span className={`admin-badge ${msg.is_read ? 'badge-success' : 'badge-warning'}`}>
                        {msg.is_read ? 'Okundu' : 'Yeni'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
          {[
            { label: 'Site İçeriğini Düzenle', desc: 'Ana sayfa, hakkımızda, sayaçlar ve kategoriler', to: '/admin/icerik', icon: Eye, color: '#f59e0b' },
            { label: 'Proje Ekle & Düzenle', desc: 'Yeni proje oluşturun ve kapak seçin', to: '/admin/projeler', icon: FolderOpen, color: '#B8860B' },
            { label: 'Medya Yükle', desc: 'Fotoğraf ve video kütüphanesi', to: '/admin/medya', icon: Image, color: '#3b82f6' },
            { label: 'Site Ayarları', desc: 'İletişim ve sosyal medya bilgileri', to: '/admin/ayarlar', icon: TrendingUp, color: '#10b981' },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '20px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(184,134,11,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ width: '44px', height: '44px', background: `${action.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <action.icon size={20} color={action.color} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{action.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' }}>{action.desc}</div>
              </div>
              <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
