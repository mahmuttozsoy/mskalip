import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Giriş başarılı!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/logo.png" alt="MŞ Group İnşaat" className="admin-login-logo-img" />
          <p style={{ marginTop: '10px' }}>Yönetim Paneli Girişi</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Kullanıcı Adı veya E-posta</label>
            <input
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoComplete="username"
            />
          </div>
          
          <div className="admin-form-group" style={{ position: 'relative' }}>
            <label>Şifre</label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
              style={{ paddingRight: '48px' }}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '12px',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : (
              <>
                <LogIn size={18} />
                Giriş Yap
              </>
            )}
          </button>
        </form>
        
        <div
          style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: 'rgba(184,134,11,0.1)',
            border: '1px solid rgba(184,134,11,0.25)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          <div>
            <div><strong>Kullanıcı:</strong> admin</div>
            <div><strong>Şifre:</strong> Admin123!</div>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => setForm({ username: 'admin', password: 'Admin123!' })}
          >
            Otomatik Doldur
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            ← Siteye Dön
          </a>
        </div>
      </div>
    </div>
  );
}
