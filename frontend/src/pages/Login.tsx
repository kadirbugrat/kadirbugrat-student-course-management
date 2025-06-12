import { useState } from 'react';
import customAxios from '../api/axios';
import { Navigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, token } = useAuth();

  // ✅ Giriş yapmış kullanıcıyı otomatik yönlendir
  if (user && token) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await customAxios.post('/auth/login', { email, password });

      // ✅ login fonksiyonuna hem token hem user ver
      login(res.data.token, res.data.user);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const errorMessage = err.response?.data?.error || 'Sunucu hatası';
        setError(errorMessage);
      } else {
        setError('Bilinmeyen hata oluştu.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Giriş</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={{ marginTop: '10px' }}>
        Hesabınız yok mu?{' '}
        <Link to="/register" style={{ color: 'blue', textDecoration: 'underline' }}>
          Kayıt Olmak İçin Tıklayın
        </Link>
      </p>
    </div>
  );
};

export default Login;
