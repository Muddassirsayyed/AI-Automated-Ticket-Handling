import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Redirect to login if not authenticated, or to home if wrong role
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
