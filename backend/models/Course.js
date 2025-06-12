const pool = require('../db');

const createCourseTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    console.log('courses tablosu oluşturuldu ✅');
  } catch (err) {
    console.error('courses tablo hatası:', err);
  }
};

module.exports = { createCourseTable };
