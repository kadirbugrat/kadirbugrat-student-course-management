import { useState } from 'react';
import customAxios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await customAxios.post('/auth/register', {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        email,
        password,
        role: isAdmin ? 'admin' : 'student'
      });

      // ✅ Başarı mesajı göster, 1.5 saniye sonra login sayfasına yönlendir
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => navigate('/'), 1500);

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
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ad"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        /><br /><br />

        <input
          type="text"
          placeholder="Soyad"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        /><br /><br />

        <input
          type="date"
          placeholder="Doğum Tarihi"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        /><br /><br />

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

        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Admin olarak kayıt ol
        </label><br /><br />

        <button type="submit">Kayıt Ol</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <p style={{ marginTop: '10px' }}>
        Zaten bir hesabınız var mı?{' '}
        <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Giriş Yapmak İçin Tıklayın
        </Link>
      </p>
    </div>
  );
};

export default Register;
