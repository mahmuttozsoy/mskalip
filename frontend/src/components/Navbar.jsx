import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Lock } from 'lucide-react';
import api from '../lib/api';

const navLinks = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Hizmetler', to: '/hizmetler' },
  { label: 'Projeler', to: '/projeler' },
  { label: 'Galeri', to: '/galeri' },
  { label: 'İletişim', to: '/iletisim' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState('+90 (212) 555 00 00');
  const location = useLocation();

  useEffect(() => {
    api.get('/settings').then(r => {
      if (r.data?.settings?.company_phone) {
        setPhone(r.data.settings.company_phone);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="navbar-logo">
              <img src="/logo.png" alt="MŞ Group İnşaat" className="navbar-logo-img" />
            </Link>

            <div className="navbar-links">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="navbar-cta">
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '13px' }}>
                <Phone size={14} />
                Bizi Arayın
              </a>
              <button
                className="navbar-toggle"
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Menü"
              >
                {menuOpen ? <X color="white" size={24} /> : (
                  <>
                    <span /><span /><span />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button
          style={{ position: 'absolute', top: 24, right: 24, color: 'white', cursor: 'pointer' }}
          onClick={() => setMenuOpen(false)}
        >
          <X size={32} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/logo.png"
            alt="MŞ Group İnşaat"
            style={{ height: '92px', width: 'auto', margin: '0 auto', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.45))' }}
          />
        </div>
        
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            style={{ fontSize: '20px', fontFamily: 'Playfair Display', fontWeight: 700, color: 'white' }}
          >
            {link.label}
          </Link>
        ))}
        
        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="btn btn-primary" style={{ marginTop: '8px' }}>
          <Phone size={16} />
          Bizi Arayın
        </a>
      </div>
    </>
  );
}
