const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { first_name, last_name, birth_date, email, password, role } = req.body;

  // Giriş doğrulama
  if (!first_name || !last_name || !birth_date || !email || !password) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur." });
  }

  try {
    // Kullanıcı zaten var mı?
    const userCheck = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );
    if (userCheck.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Bu email ile bir kullanıcı zaten var." });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı veritabanına ekle
    const newUser = await pool.query(
      `INSERT INTO students (first_name, last_name, birth_date, email, password, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        first_name,
        last_name,
        birth_date,
        email,
        hashedPassword,
        role || "student",
      ]
    );

    // JWT oluştur
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error("Kayıt hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Giriş kontrolü
  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre zorunludur." });
  }

  try {
    const user = await pool.query("SELECT * FROM students WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Email veya şifre hatalı." });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(401).json({ error: "Email veya şifre hatalı." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ user: user.rows[0], token });
  } catch (err) {
    console.error("Giriş hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, email, role FROM students WHERE id = $1",
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error("getMe hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

module.exports = { register, login , getMe };
