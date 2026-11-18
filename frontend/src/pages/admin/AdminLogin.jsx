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

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            ← Siteye Dön
          </a>
        </div>
      </div>
    </div>
  );
}
