# Student Course Management Fullstack Web Uygulaması

## Proje Hakkında

Bu proje, **öğrenci ve ders yönetimi** sağlayan tam kapsamlı bir web uygulamasıdır. Kullanıcılar (Admin ve Öğrenci rolleriyle) sisteme giriş yapabilir, kendi rollerine uygun işlemleri gerçekleştirebilir. Projede güvenlik, rol bazlı yetkilendirme, test ve konteynerizasyon gibi modern yazılım geliştirme gereksinimleri uygulanmıştır.

---

## İçerik

- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Kurulum & Çalıştırma](#kurulum--çalıştırma)
- [Kullanıcı Rolleri & Yetkilendirme](#kullanıcı-rolleri--yetkilendirme)
- [Temel Özellikler](#temel-özellikler)
- [Testler](#testler)

---

*** Kullanılan Teknolojiler

- **Backend:** Node.js (Express.js)
- **Frontend:** React.js (Vite veya CRA, projenize göre)
- **Veritabanı:** PostgreSQL
- **Kimlik Doğrulama:** JWT (JSON Web Token)
- **Test:** Jest, Supertest
- **Konteynerizasyon:** Docker, Docker Compose
- **State Yönetimi:** Context API (veya Redux alternatifi)
- **UI Kütüphanesi:** Material UI

---

*** Kurulum & Çalıştırma

1. **Klonlama**
```bash
git clone https://github.com/kadirbugrat/kadirbugrat-student-course-management.git
cd kadirbugrat-student-course-management

2. **Docker ile Kolay Kurulum
Tüm servisleri otomatik başlatmak için:

```bash
docker compose up --build

Frontend: http://localhost:5173
Backend API: http://localhost:5000

3. Manuel Kurulum (Opsiyonel)

Backend
```bash
cd backend
npm install
npm run initdb
npm start

Frontend
```bash
cd frontend
npm install
npm run dev

4. Veritabanı
PostgreSQL kurulumu sonrası, studentdb isimli bir veritabanı açın veya Docker ile hazır çalıştırın.


*** Kullanıcı Rolleri & Yetkilendirme

Admin:
Tüm öğrencileri ve dersleri ekleyebilir/güncelleyebilir/silebilir.
İstediği öğrenciye ders atayabilir veya kaydını silebilir.

Öğrenci:
Sadece kendi hesabını ve derslerini görüntüleyip güncelleyebilir.
Mevcut derslere kaydolabilir veya kendi kaydını iptal edebilir.
Başka öğrencilerin verilerine erişemez.

Yetkilendirme kontrolleri kesinlikle backend tarafında yapılmaktadır.

*** Temel Özellikler

JWT ile Güvenli Kimlik Doğrulama
Admin ve Öğrenci Rolleri
Öğrenci ve Ders CRUD İşlemleri
Öğrenci-Ders Kayıt/Çıkış (Eşleştirme)
Sayfalama (Pagination) ile Listeleme
Modal ve Pop-up Detay Sayfaları
Material UI ile Modern ve Kullanıcı Dostu Arayüz
Tüm API çağrıları için güvenli token doğrulaması
Docker ile kolay ve hızlı başlatma
Kapsamlı backend testleri (Jest & Supertest)


*** Testler
Backend testleri: backend/test/app.test.js dosyasında yer alır.

Testleri çalıştırmak için:

```bash
cd backend
npm test

Testlerde kritik API uç noktaları (login, öğrenci ve ders ekleme/listeleme) kontrol edilir.

************************************************
İletişim
Her türlü öneri, hata bildirimi veya katkı için:
kadirbugrat@gmail.com
veya GitHub Issues bölümünden ulaşabilirsiniz.
************************************************