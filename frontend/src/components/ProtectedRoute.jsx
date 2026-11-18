import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="page-loader">
        <img src="/logo.png" alt="MŞ Group İnşaat" style={{ height: '110px', width: 'auto' }} />
        <div className="loader-bar"><div className="loader-progress"></div></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
