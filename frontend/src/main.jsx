import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#1a1a2e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '560px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,134,11,0.3)', borderRadius: '16px', padding: '32px' }}>
            <h2 style={{ color: '#B8860B', marginBottom: '12px' }}>Sayfa Yüklenirken Bir Hata Oluştu</h2>
            <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', marginBottom: '16px' }}>
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
            >
              Önbelleği Temizle ve Yenile
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);
