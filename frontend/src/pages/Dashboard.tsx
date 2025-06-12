import { useEffect, useState } from 'react';
import customAxios from '../api/axios';
import { useAuth } from '../context/AuthContext';

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
    <div style={{ padding: 20 }}>
      <h2>Hoş geldiniz, {user?.first_name}!</h2>

      <h3>Kayıtlı Derslerim</h3>
      <ul>
        {myCourses.map((course) => (
          <li key={course.id}>
            {course.name} - {course.description}{' '}
            <button onClick={() => unenroll(course.id)}>Çık</button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Tüm Dersler</h3>
      <ul>
        {allCourses.map((course) => (
          <li key={course.id}>
            {course.name} - {course.description}{' '}
            {isEnrolled(course.id) ? (
              <span style={{ color: 'green' }}>Zaten kayıtlısın</span>
            ) : (
              <button onClick={() => enroll(course.id)}>Kayıt Ol</button>
            )}
          </li>
        ))}
      </ul>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
