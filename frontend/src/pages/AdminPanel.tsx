import { useEffect, useState } from 'react';
import axios from '../api/axios';

interface Student {
  id: number;
  email: string;
}

interface Course {
  id: number;
  name: string;
}

const AdminPanel = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/students'); // verifyToken + isAdmin middleware unutma!
      setStudents(res.data);
    } catch {
      setError('Öğrenciler alınamadı');
    }
  };

  const fetchStudentCourses = async (id: number) => {
    try {
      const res = await axios.get(`/students/${id}/courses`);
      setCourses(res.data);
    } catch {
      setCourses([]);
      setError('Dersler alınamadı');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Paneli</h2>
      <h3>Öğrenciler</h3>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.email}
            <button onClick={() => {
              setSelectedStudentId(student.id);
              fetchStudentCourses(student.id);
            }}>
              Derslerini Gör
            </button>
          </li>
        ))}
      </ul>

      {selectedStudentId && (
        <>
          <h3>Öğrencinin Dersleri</h3>
          <ul>
            {courses.map(course => (
              <li key={course.id}>{course.name}</li>
            ))}
          </ul>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AdminPanel;
