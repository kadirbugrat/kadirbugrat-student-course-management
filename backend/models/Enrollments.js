const pool = require('../db');

const createEnrollmentTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(student_id, course_id)
      );
    `);
    console.log('enrollments tablosu oluşturuldu ✅');
  } catch (err) {
    console.error('enrollments tablo hatası:', err);
  }
};

module.exports = { createEnrollmentTable };
