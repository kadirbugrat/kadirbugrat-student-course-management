const pool = require('../db');

const createStudentTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        birth_date DATE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(10) DEFAULT 'student'
      );
    `);
    console.log('students tablosu oluşturuldu ✅');
  } catch (err) {
    console.error('students tablo hatası:', err);
  }
};

module.exports = { createStudentTable };
