const pool = require('../db');

const addCourse = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Ders adı zorunludur.' });
  }

  try {
    const existing = await pool.query('SELECT * FROM courses WHERE name = $1', [name]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Bu ders zaten mevcut.' });
    }

    const result = await pool.query(
      'INSERT INTO courses (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ders ekleme hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};

module.exports = { addCourse };
