import { useState } from 'react';
import customAxios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        password
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
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, mt: 10 }}>
        <Typography variant="h4" gutterBottom align="center">
          Kayıt Ol
        </Typography>
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Ad"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Soyad"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Doğum Tarihi"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="E-posta"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Kayıt Ol
          </Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Typography align="center" sx={{ mt: 2 }}>
          Zaten bir hesabınız var mı?{' '}
          <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            Giriş Yapmak İçin Tıklayın
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
