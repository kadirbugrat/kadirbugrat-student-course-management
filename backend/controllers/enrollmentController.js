const pool = require('../db');

const enrollCourse = async (req, res) => {
  const studentId = req.user.id;
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ error: 'course_id zorunludur.' });
  }

  try {
    // Aynı kayıt var mı kontrol et
    const check = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2',
      [studentId, course_id]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ error: 'Bu derse zaten kayıtlısınız.' });
    }

    const result = await pool.query(
      `INSERT INTO enrollments (student_id, course_id) 
       VALUES ($1, $2) RETURNING *`,
      [studentId, course_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Derse kayıt hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

const getMyCourses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT c.id, c.name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = $1
    `, [studentId]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Kayıtlı dersleri çekme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

const unenrollCourse = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM enrollments 
       WHERE student_id = $1 AND course_id = $2 
       RETURNING *`,
      [studentId, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı veya zaten silinmiş.' });
    }

    res.status(200).json({ message: 'Ders kaydı silindi.' });
  } catch (err) {
    console.error('Kayıttan çıkma hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};


module.exports = { enrollCourse, getMyCourses, unenrollCourse };
