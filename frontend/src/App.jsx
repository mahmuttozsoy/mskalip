import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContent from './pages/admin/AdminContent';
import AdminProjects from './pages/admin/AdminProjects';
import AdminServices from './pages/admin/AdminServices';
import AdminMedia from './pages/admin/AdminMedia';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(184,134,11,0.3)',
            },
            success: {
              iconTheme: { primary: '#B8860B', secondary: '#fff' }
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/projeler" element={<ProjectsPage />} />
          <Route path="/projeler/:slug" element={<ProjectDetailPage />} />
          <Route path="/hizmetler" element={<ServicesPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/galeri" element={<GalleryPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="icerik" element={<AdminContent />} />
            <Route path="projeler" element={<AdminProjects />} />
            <Route path="hizmetler" element={<AdminServices />} />
            <Route path="medya" element={<AdminMedia />} />
            <Route path="mesajlar" element={<AdminMessages />} />
            <Route path="ayarlar" element={<AdminSettings />} />
          </Route>

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <div
                  style={{
                    minHeight: '75vh',
                    background: 'var(--color-secondary)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '120px 24px 60px',
                  }}
                >
                  <img src="/logo.png" alt="MŞ Group" style={{ height: '90px', marginBottom: '20px' }} />
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', marginBottom: '12px' }}>
                    Sayfa Bulunamadı (404)
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '460px', marginBottom: '28px' }}>
                    Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
                  </p>
                  <Link to="/" className="btn btn-primary">
                    Ana Sayfaya Dön
                  </Link>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
