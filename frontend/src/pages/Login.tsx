import { useState } from 'react';
import customAxios from '../api/axios';
import { Navigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';

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
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, mt: 10 }}>
        <Typography variant="h4" gutterBottom align="center">
          Giriş Yap
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            fullWidth
          >
            Giriş Yap
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          Hesabınız yok mu?{' '}
          <Link to="/register" style={{ color: '#1976d2', textDecoration: 'underline' }}>
            Kayıt Olmak İçin Tıklayın
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
