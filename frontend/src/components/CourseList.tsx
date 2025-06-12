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

const CourseList = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tüm dersleri çek
  const fetchCourses = async () => {
    try {
      const res = await customAxios.get('/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch {
      setError('Dersler alınamadı.');
    }
  };

  // Kayıt olunan dersleri çek
  const fetchMyCourses = async () => {
    try {
      const res = await customAxios.get('/enrollments/my-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyCourses(res.data);
    } catch {
      setError('Kayıtlı dersler alınamadı.');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCourses(), fetchMyCourses()]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // Derse kayıt ol
  const enroll = async (courseId: number) => {
    try {
      await customAxios.post(
        '/enrollments',
        { course_id: courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyCourses();
    } catch {
      alert('Kayıt başarısız veya zaten kayıtlısın.');
    }
  };

  const isEnrolled = (courseId: number) =>
    myCourses.some((course) => course.id === courseId);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Tüm Dersler
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {courses.length === 0 && !loading && (
          <Typography color="text.secondary">Hiç ders tanımlanmamış.</Typography>
        )}
        {courses.map((course) => (
          <Card key={course.id} sx={{ flex: '1 1 250px', minWidth: 220, maxWidth: 300 }}>
            <CardContent>
              <Typography variant="h6">{course.name}</Typography>
              <Typography color="text.secondary">
                {course.description || "Açıklama yok"}
              </Typography>
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
        ))}
      </Box>
    </Container>
  );
};

export default CourseList;
