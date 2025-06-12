import { useEffect, useState } from 'react';
import customAxios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StudentProfile = () => {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && token) {
      customAxios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const { first_name, last_name, birth_date, email } = res.data;
        setForm({ first_name, last_name, birth_date, email });
      })
      .catch(() => setMessage('Bilgiler alınamadı'));
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customAxios.put(`/students/${user?.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Bilgiler başarıyla güncellendi ✅');
    } catch {
      setMessage('Güncelleme sırasında hata oluştu ❌');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>Profil Bilgilerim</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Ad" required /><br /><br />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Soyad" required /><br /><br />
        <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} required /><br /><br />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="E-mail" required /><br /><br />
        <button type="submit">Güncelle</button>
      </form>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
};

export default StudentProfile;
