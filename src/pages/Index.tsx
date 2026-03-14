import { Navigate } from 'react-router-dom';
import { isFirstUser, getSession } from '@/lib/storage';

const Index = () => {
  if (isFirstUser()) {
    return <Navigate to="/register" replace />;
  }
  if (getSession()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

export default Index;
