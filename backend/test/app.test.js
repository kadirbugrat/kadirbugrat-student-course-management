const request = require('supertest');
const app = require('../app');

let adminToken;

describe('Öğrenci ve Ders Yönetimi API Testleri', () => {
  // 1. Giriş testi
  it('Giriş başarılı olmalı (POST /api/auth/login)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' }); // varolan bir admin mail-şifresi

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  // 2. Öğrenci Listeleme (admin ile)
  it('Tüm öğrenciler listelenmeli (GET /api/students)', async () => {
    const res = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 3. Ders Ekleme (admin ile)
  it('Yeni ders eklenebilmeli (POST /api/courses)', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'TestDersi' + Date.now() }); // random isim

      
    expect([201, 409]).toContain(res.statusCode);
  });
});
