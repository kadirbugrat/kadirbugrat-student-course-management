import { useEffect, useState } from 'react';
import customAxios from '../api/axios';
import { useAuth } from '../context/AuthContext';

import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Divider,
  Box
} from '@mui/material';

interface Course {
  id: number;
  name: string;
  description: string;
}

const Dashboard = () => {
  const { user, token } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  const fetchMyCourses = async () => {
    try {
      const res = await customAxios.get(`/students/${user?.id}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCourses(res.data);
    } catch {
      setError('Kayıtlı dersler alınamadı');
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await customAxios.get('/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCourses(res.data);
    } catch {
      setError('Tüm dersler alınamadı');
    }
  };

  const enroll = async (id: number) => {
    try {
      await customAxios.post(
        '/enrollments',
        { course_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyCourses();
    } catch {
      alert('Kayıt başarısız veya zaten kayıtlısın.');
    }
  };

  const unenroll = async (id: number) => {
    try {
      await customAxios.delete(`/enrollments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyCourses();
    } catch {
      alert('Çıkış başarısız.');
    }
  };

  useEffect(() => {
    fetchMyCourses();
    fetchAllCourses();
  }, []);

  const isEnrolled = (courseId: number) =>
    myCourses.some((course) => course.id === courseId);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Hoş geldiniz, {user?.first_name}!
      </Typography>

      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

      {/* Kayıtlı Derslerim */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Kayıtlı Derslerim
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        {myCourses.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Kayıtlı dersiniz yok.
          </Typography>
        ) : (
          myCourses.map((course) => (
            <Card key={course.id} sx={{ flex: '1 1 250px', minWidth: 220, maxWidth: 300 }}>
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography color="text.secondary">{course.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => unenroll(course.id)}
                >
                  Çık
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Tüm Dersler */}
      <Typography variant="h5" gutterBottom>
        Tüm Dersler
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {allCourses.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Hiç ders tanımlanmamış.
          </Typography>
        ) : (
          allCourses.map((course) => (
            <Card key={course.id} sx={{ flex: '1 1 250px', minWidth: 220, maxWidth: 300 }}>
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography color="text.secondary">{course.description}</Typography>
              </CardContent>
              <CardActions>
                {isEnrolled(course.id) ? (
                  <Button variant="outlined" disabled fullWidth color="success">
                    Zaten kayıtlısın
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => enroll(course.id)}
                  >
                    Kayıt Ol
                  </Button>
                )}
              </CardActions>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
