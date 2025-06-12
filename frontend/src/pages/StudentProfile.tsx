import { useEffect, useState } from 'react';
import customAxios from '../api/axios';
import { useAuth } from '../context/AuthContext';

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

const StudentProfile = () => {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      customAxios.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const { first_name, last_name, birth_date, email } = res.data;
          setForm({ first_name, last_name, birth_date, email });
        })
        .catch(() => setError('Bilgiler alınamadı'));
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await customAxios.put(`/students/${user?.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Bilgiler başarıyla güncellendi ✅');
    } catch {
      setError('Güncelleme sırasında hata oluştu ❌');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, mt: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Profil Bilgilerim
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="first_name"
            label="Ad"
            value={form.first_name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="last_name"
            label="Soyad"
            value={form.last_name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="birth_date"
            label="Doğum Tarihi"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="email"
            label="E-posta"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            fullWidth
          >
            Güncelle
          </Button>
        </Box>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
};

export default StudentProfile;
