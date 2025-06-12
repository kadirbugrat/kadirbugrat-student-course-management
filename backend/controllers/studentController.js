const pool = require("../db");
const bcrypt = require("bcryptjs");

// ✅ 1. Admin olmayan öğrenciler tüm listeyi alamaz
const getAllStudents = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yetkisiz erişim' });
  }

  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, birth_date, email, role 
      FROM students
      ORDER BY id ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Öğrenci listeleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// ✅ 2. Sadece admin yeni öğrenci ekleyebilir
const addStudent = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yetkisiz işlem' });
  }

  const { first_name, last_name, birth_date, email, password, role } = req.body;

  if (!first_name || !last_name || !birth_date || !email || !password) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur." });
  }

  try {
    const check = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(409).json({ error: "Bu email zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO students (first_name, last_name, birth_date, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [first_name, last_name, birth_date, email, hashedPassword, role || "student"]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Öğrenci ekleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// ✅ 3. Öğrenci sadece kendini güncelleyebilir, admin herkes için
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, birth_date, email, role } = req.body;

  // ❌ Öğrenci başkasını güncelleyemez
  if (req.user.role !== 'admin' && parseInt(id) !== req.user.id) {
    return res.status(403).json({ error: 'Yetkisiz işlem' });
  }

  const emailCheck = await pool.query(
    "SELECT * FROM students WHERE email = $1 AND id != $2",
    [email, id]
  );
  if (emailCheck.rows.length > 0) {
    return res.status(409).json({ error: "Bu email başka bir kullanıcıya ait." });
  }

  if (!first_name || !last_name || !birth_date || !email) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur." });
  }

  try {
    const result = await pool.query(
      `UPDATE students 
       SET first_name = $1, last_name = $2, birth_date = $3, email = $4, role = $5
       WHERE id = $6
       RETURNING *`,
      [first_name, last_name, birth_date, email, role || "student", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Öğrenci bulunamadı." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// ✅ 4. Sadece admin öğrenci silebilir
const deleteStudent = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yetkisiz işlem' });
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM students WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Silinecek öğrenci bulunamadı." });
    }

    res.status(200).json({ message: "Öğrenci silindi." });
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// ✅ 5. Kendi verisini getiriyor (herkes erişebilir)
const getMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, birth_date, email, role FROM students WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Kendi verisini alma hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// ✅ 6. Öğrenci sadece kendi derslerini görebilir
const getStudentCourses = async (req, res) => {
  const studentId = parseInt(req.params.id);

  if (req.user.role !== 'admin' && req.user.id !== studentId) {
    return res.status(403).json({ error: 'Bu verilere erişim yetkiniz yok.' });
  }

  try {
    const result = await pool.query(
      `SELECT c.id, c.name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.student_id = $1`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Ders getirme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getMe,
  getStudentCourses,
};
