import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, LayoutTemplate, FolderOpen, Wrench, Image, MessageSquare, Settings,
  LogOut, ExternalLink
} from 'lucide-react';
import api from '../../lib/api';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin', exact: true },
  { label: 'Site İçeriği & Sayfalar', icon: LayoutTemplate, to: '/admin/icerik' },
  { label: 'Projeler', icon: FolderOpen, to: '/admin/projeler' },
  { label: 'Hizmetler', icon: Wrench, to: '/admin/hizmetler' },
  { label: 'Medya Kütüphanesi', icon: Image, to: '/admin/medya' },
  { label: 'Mesajlar', icon: MessageSquare, to: '/admin/mesajlar', badge: true },
  { label: 'Site Ayarları', icon: Settings, to: '/admin/ayarlar' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/contact').then(r => setUnread(r.data.unread || 0)).catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="logo" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
            <img src="/logo.png" alt="MŞ Group İnşaat" className="admin-sidebar-logo-img" />
            <div className="site-panel">Yönetim Paneli</div>
          </Link>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-section-label">Ana Menü</div>
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-nav-link ${isActive(item) ? 'active' : ''}`}
              >
                <item.icon size={18} />
                {item.label}
                {item.badge && unread > 0 && (
                  <span className="admin-nav-badge">{unread}</span>
                )}
              </Link>
            ))}
          </div>

          <div className="admin-nav-section">
            <div className="admin-nav-section-label">Hızlı Erişim</div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-nav-link"
            >
              <ExternalLink size={18} />
              Siteyi Görüntüle
            </a>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user?.full_name?.[0] || user?.username?.[0] || 'A'}
            </div>
            <div>
              <div className="admin-user-name">{user?.full_name || user?.username}</div>
              <div className="admin-user-role">{user?.role || 'Admin'}</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
