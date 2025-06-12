const { createStudentTable } = require('./models/Student');
const { createCourseTable } = require('./models/Course');
const { createEnrollmentTable } = require('./models/Enrollments');

const init = async () => {
  console.log('Veritabanı başlatılıyor...');
  await createStudentTable();
  await createCourseTable();
  await createEnrollmentTable();
  console.log('İşlem tamamlandı.');
  process.exit();
};

init();
