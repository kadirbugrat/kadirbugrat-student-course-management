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
  Box,
  CircularProgress
} from '@mui/material';

interface Course {
  id: number;
  name: string;
  description?: string;
}

const EnrollmentList = () => {
  const { token } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyCourses = async () => {
    try {
      const res = await customAxios.get('/enrollments/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCourses(res.data);
    } catch {
      setError('Kayıtlı dersler alınamadı.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyCourses();
    // eslint-disable-next-line
  }, []);

  const unenroll = async (courseId: number) => {
    try {
      await customAxios.delete(`/enrollments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyCourses();
    } catch {
      alert('Ders kaydı silinemedi.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Kayıtlı Olduğum Dersler
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {myCourses.length === 0 && !loading && (
          <Typography color="text.secondary">Kayıtlı dersiniz yok.</Typography>
        )}
        {myCourses.map((course) => (
          <Card key={course.id} sx={{ flex: '1 1 250px', minWidth: 220, maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">{course.name}</Typography>
              <Typography color="text.secondary">
                {course.description || "Açıklama yok"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => unenroll(course.id)}
              >
                Dersten Çık
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default EnrollmentList;
