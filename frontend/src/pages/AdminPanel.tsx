import { useEffect, useState } from "react";
import customAxios from "../api/axios";
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, IconButton, TablePagination, TextField, Box
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  role: string;
}
interface Course {
  id: number;
  name: string;
}

const AdminPanel = () => {
  // State’ler:
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [openDetail, setOpenDetail] = useState(false);

  // Öğrenci güncelleme
  const [openEdit, setOpenEdit] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  // Ders ekle/güncelle
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Verileri çek
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await customAxios.get("/students", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setStudents(res.data);
    } catch {
      setError("Öğrenci listesi alınamadı.");
    }
    setLoading(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await customAxios.get("/courses", { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setCourses(res.data);
    } catch {
      setError("Ders listesi alınamadı.");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // Öğrenci detay/dersler modalı aç
  const handleOpenDetail = async (student: Student) => {
    setSelectedStudent(student);
    try {
      const res = await customAxios.get(`/students/${student.id}/courses`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setSelectedCourses(res.data);
      setOpenDetail(true);
    } catch {
      setError("Dersler yüklenemedi.");
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedStudent(null);
    setSelectedCourses([]);
  };

  // Öğrenci güncelleme modalı aç/kapat
  const handleOpenEdit = (student: Student) => {
    setEditStudent(student);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setEditStudent(null);
    setOpenEdit(false);
  };

  // Öğrenci güncelle
  const handleUpdateStudent = async () => {
    if (!editStudent) return;
    try {
      await customAxios.put(`/students/${editStudent.id}`, editStudent, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchStudents();
      handleCloseEdit();
    } catch {
      setError("Güncelleme başarısız.");
    }
  };

  // Öğrenci sil
  const handleDeleteStudent = async (id: number) => {
    if (!window.confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) return;
    try {
      await customAxios.delete(`/students/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchStudents();
    } catch {
      setError("Öğrenci silinemedi.");
    }
  };

  // Ders ekle
  const handleAddCourse = async () => {
    if (!newCourseName) return;
    try {
      await customAxios.post("/courses", {
        name: newCourseName,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setOpenAddCourse(false);
      setNewCourseName("");
      fetchCourses();
    } catch {
      setError("Ders eklenemedi.");
    }
  };

  // Ders güncelle modalı aç/kapat
  const handleOpenEditCourse = (course: Course) => {
    setEditCourse(course);
    setOpenEditCourse(true);
  };
  const handleCloseEditCourse = () => {
    setEditCourse(null);
    setOpenEditCourse(false);
  };

  // Ders güncelle
  const handleUpdateCourse = async () => {
    if (!editCourse) return;
    try {
      await customAxios.put(`/courses/${editCourse.id}`, editCourse, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchCourses();
      handleCloseEditCourse();
    } catch {
      setError("Ders güncellenemedi.");
    }
  };

  // Ders sil
  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm("Bu dersi silmek istediğinize emin misiniz?")) return;
    try {
      await customAxios.delete(`/courses/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchCourses();
    } catch {
      setError("Ders silinemedi.");
    }
  };

  // Sayfalama fonksiyonları
  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Paneli</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Öğrenci Tablosu */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Öğrenciler</Typography>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell>Soyad</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Doğum Tarihi</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.birth_date}</TableCell>
                  <TableCell>{student.role}</TableCell>
                  <TableCell>
                    <IconButton color="info" onClick={() => handleOpenDetail(student)}><Visibility /></IconButton>
                    <IconButton color="primary" onClick={() => handleOpenEdit(student)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteStudent(student.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>

      {/* Öğrenci detay/ders modalı */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle>Öğrenci Detay</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <Typography>Ad: {selectedStudent.first_name}</Typography>
              <Typography>Soyad: {selectedStudent.last_name}</Typography>
              <Typography>Email: {selectedStudent.email}</Typography>
              <Typography>Doğum Tarihi: {selectedStudent.birth_date}</Typography>
              <Typography mt={2} mb={1} fontWeight={600}>Kayıtlı Dersler:</Typography>
              <ul>
                {selectedCourses.length === 0
                  ? <li>Ders yok</li>
                  : selectedCourses.map((course) => (
                    <li key={course.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {course.name}
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={async () => {
                          await customAxios.delete(`/enrollments/${course.id}`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                            data: { student_id: selectedStudent.id }
                          });
                          // Kaydı güncelle
                          const res = await customAxios.get(`/students/${selectedStudent.id}/courses`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                          });
                          setSelectedCourses(res.data);
                        }}
                      >
                        Kaydı Sil
                      </Button>
                    </li>
                  ))
                }
              </ul>
              {/* --- Kayıtlı olmadığı dersleri bulup göster --- */}
              <Typography mt={3} fontWeight={600}>Kayıtlı Olmadığı Dersler</Typography>
              <ul>
                {courses
                  .filter((course) => !selectedCourses.some((c) => c.id === course.id))
                  .map((course) => (
                    <li key={course.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {course.name}
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={async () => {
                          await customAxios.post("/enrollments", { course_id: course.id, student_id: selectedStudent.id }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                          });
                          // Kaydı güncelle
                          const res = await customAxios.get(`/students/${selectedStudent.id}/courses`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                          });
                          setSelectedCourses(res.data);
                        }}
                      >
                        Derse Ata
                      </Button>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Öğrenci Güncelleme Modalı */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle>Öğrenci Güncelle</DialogTitle>
        <DialogContent>
          {editStudent && (
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Ad"
                value={editStudent.first_name}
                onChange={e => setEditStudent(s => ({ ...s!, first_name: e.target.value }))}
              />
              <TextField
                label="Soyad"
                value={editStudent.last_name}
                onChange={e => setEditStudent(s => ({ ...s!, last_name: e.target.value }))}
              />
              <TextField
                label="Email"
                value={editStudent.email}
                onChange={e => setEditStudent(s => ({ ...s!, email: e.target.value }))}
              />
              <TextField
                label="Doğum Tarihi"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editStudent.birth_date?.slice(0, 10) || ""}
                onChange={e => setEditStudent(s => ({ ...s!, birth_date: e.target.value }))}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Vazgeç</Button>
          <Button onClick={handleUpdateStudent} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Dersler Tablosu */}
      <Typography variant="h6" sx={{ mt: 5, mb: 1 }}>Dersler</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenAddCourse(true)}>
        Yeni Ders Ekle
      </Button>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders Adı</TableCell>
                <TableCell>İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEditCourse(course)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteCourse(course.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Ders Ekle Modalı */}
      <Dialog open={openAddCourse} onClose={() => setOpenAddCourse(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Yeni Ders Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Ders Adı"
              value={newCourseName}
              onChange={e => setNewCourseName(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddCourse(false)}>Vazgeç</Button>
          <Button
            onClick={handleAddCourse}
            variant="contained"
            disabled={!newCourseName}
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ders Güncelle Modalı */}
      <Dialog open={openEditCourse} onClose={handleCloseEditCourse} maxWidth="xs" fullWidth>
        <DialogTitle>Dersi Güncelle</DialogTitle>
        <DialogContent>
          {editCourse && (
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Ders Adı"
                value={editCourse.name}
                onChange={e => setEditCourse(c => ({ ...c!, name: e.target.value }))}
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCourse}>Vazgeç</Button>
          <Button onClick={handleUpdateCourse} variant="contained" disabled={!editCourse?.name}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
