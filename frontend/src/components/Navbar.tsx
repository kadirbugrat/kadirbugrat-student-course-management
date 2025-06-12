import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!token || !user) return null; // 🔒 Giriş yapılmadıysa navbar hiç görünmez

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ background: '#eee', padding: '10px' }}>
      <h3 style={{ display: 'inline-block', marginRight: '20px' }}>🎓 Student Course App</h3>

      {user.role === 'student' && (
        <>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>Derslerim</Link>
          <Link to="/profile" style={{ marginRight: '10px' }}>Profilim</Link>
        </>
      )}

      {user.role === 'admin' && (
        <>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
          <Link to="/admin" style={{ marginRight: '10px' }}>Admin Panel</Link>
        </>
      )}

      <button onClick={handleLogout}>Çıkış Yap</button>
    </nav>
  );
};

export default Navbar;
