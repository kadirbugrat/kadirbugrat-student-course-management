const pool = require("../db");

const addCourse = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Ders adı zorunludur." });
  }

  try {
    const existing = await pool.query("SELECT * FROM courses WHERE name = $1", [
      name,
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Bu ders zaten mevcut." });
    }

    const result = await pool.query(
      "INSERT INTO courses (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Ders ekleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Ders listeleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM courses WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ders bulunamadı." });
    }
    res.status(200).json({ message: "Ders silindi." });
  } catch (err) {
    console.error("Ders silme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Ders adı zorunludur." });
  }

  try {
    // Aynı isimde başka ders var mı (ve bu ders değilse), kontrol et
    const existing = await pool.query(
      "SELECT * FROM courses WHERE name = $1 AND id != $2",
      [name, id]
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Bu isimde başka bir ders mevcut." });
    }

    const result = await pool.query(
      `UPDATE courses SET name = $1 WHERE id = $2 RETURNING *`,
      [name || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ders bulunamadı." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ders güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = {
  addCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
};
