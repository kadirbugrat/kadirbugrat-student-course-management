import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!token || !user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={user.role === 'admin' ? '/admin' : '/dashboard'}
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            mr: 2,
          }}
        >
          🎓 Student Course App
        </Typography>
        {user.role === 'student' && (
          <Box>
            <Button color="primary" component={Link} to="/dashboard" sx={{ mr: 1 }}>
              Derslerim
            </Button>
            <Button color="primary" component={Link} to="/profile" sx={{ mr: 1 }}>
              Profilim
            </Button>
          </Box>
        )}
        {user.role === 'admin' && (
          <Box>
            <Button color="primary" component={Link} to="/dashboard" sx={{ mr: 1 }}>
              Dashboard
            </Button>
            {/* <Button color="primary" component={Link} to="/admin" sx={{ mr: 1 }}>
              Admin Panel
            </Button> */}
          </Box>
        )}
        <Button color="error" variant="contained" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
