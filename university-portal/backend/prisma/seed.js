const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@university.uz',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Adminov',
      avatar: 'https://ui-avatars.com/api/?name=Admin+Adminov&size=200'
    }
  });

  console.log('✅ Admin created');

  // Create Teachers
  const teacher1User = await prisma.user.create({
    data: {
      email: 'teacher1@university.uz',
      password: hashedPassword,
      role: 'TEACHER',
      firstName: 'Jamoliddin',
      lastName: 'Karimov',
      avatar: 'https://ui-avatars.com/api/?name=Jamoliddin+Karimov&size=200',
      teacher: {
        create: {
          phone: '+998901234567',
          position: 'Доцент',
          department: 'Информационные технологии',
          degree: 'Кандидат технических наук',
          bio: 'Специалист по веб-разработке и базам данных'
        }
      }
    },
    include: { teacher: true }
  });

  const teacher2User = await prisma.user.create({
    data: {
      email: 'teacher2@university.uz',
      password: hashedPassword,
      role: 'TEACHER',
      firstName: 'Dilnoza',
      lastName: 'Azimova',
      avatar: 'https://ui-avatars.com/api/?name=Dilnoza+Azimova&size=200',
      teacher: {
        create: {
          phone: '+998901234568',
          position: 'Старший преподаватель',
          department: 'Информационные технологии',
          degree: 'Магистр информатики',
          bio: 'Эксперт по алгоритмам и структурам данных'
        }
      }
    },
    include: { teacher: true }
  });

  console.log('✅ Teachers created');

  // Create Study Plan
  const studyPlan = await prisma.studyPlan.create({
    data: {
      name: 'Информационные системы - 2024',
      year: 2024,
      description: 'Учебный план для специальности Информационные системы'
    }
  });

  console.log('✅ Study plan created');

  // Create Subjects
  const subject1 = await prisma.subject.create({
    data: {
      name: 'Веб-программирование',
      code: 'WP-101',
      credits: 4,
      hours: 64,
      semester: 3,
      description: 'Изучение современных веб-технологий',
      teacherId: teacher1User.teacher.id,
      studyPlans: {
        connect: { id: studyPlan.id }
      }
    }
  });

  const subject2 = await prisma.subject.create({
    data: {
      name: 'Базы данных',
      code: 'DB-102',
      credits: 5,
      hours: 80,
      semester: 3,
      description: 'Проектирование и управление базами данных',
      teacherId: teacher1User.teacher.id,
      studyPlans: {
        connect: { id: studyPlan.id }
      }
    }
  });

  const subject3 = await prisma.subject.create({
    data: {
      name: 'Алгоритмы и структуры данных',
      code: 'ASD-201',
      credits: 4,
      hours: 64,
      semester: 4,
      description: 'Основы алгоритмизации и оптимизации',
      teacherId: teacher2User.teacher.id,
      studyPlans: {
        connect: { id: studyPlan.id }
      }
    }
  });

  const subject4 = await prisma.subject.create({
    data: {
      name: 'Машинное обучение',
      code: 'ML-301',
      credits: 5,
      hours: 80,
      semester: 5,
      description: 'Введение в искусственный интеллект',
      teacherId: teacher2User.teacher.id,
      studyPlans: {
        connect: { id: studyPlan.id }
      }
    }
  });

  console.log('✅ Subjects created');

  // Create Students
  const students = [];
  const studentNames = [
    { firstName: 'Азиз', lastName: 'Рахимов', course: 3, group: 'IS-31' },
    { firstName: 'Малика', lastName: 'Умарова', course: 3, group: 'IS-31' },
    { firstName: 'Бобур', lastName: 'Исмоилов', course: 3, group: 'IS-32' },
    { firstName: 'Нигора', lastName: 'Юсупова', course: 4, group: 'IS-41' },
    { firstName: 'Санжар', lastName: 'Холматов', course: 4, group: 'IS-41' },
    { firstName: 'Гулнора', lastName: 'Абдуллаева', course: 2, group: 'IS-21' },
    { firstName: 'Рустам', lastName: 'Мирзаев', course: 2, group: 'IS-21' },
    { firstName: 'Дилноза', lastName: 'Каримова', course: 1, group: 'IS-11' },
    { firstName: 'Фарход', lastName: 'Тошматов', course: 1, group: 'IS-11' },
    { firstName: 'Шахноза', lastName: 'Нурматова', course: 3, group: 'IS-32' },
    { firstName: 'Улугбек', lastName: 'Собиров', course: 4, group: 'IS-42' },
    { firstName: 'Зарина', lastName: 'Алимова', course: 2, group: 'IS-22' }
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const { firstName, lastName, course, group } = studentNames[i];
    const student = await prisma.user.create({
      data: {
        email: `student${i + 1}@university.uz`,
        password: hashedPassword,
        role: 'STUDENT',
        firstName,
        lastName,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&size=200`,
        student: {
          create: {
            studentCode: `ST${2024}${String(i + 1).padStart(4, '0')}`,
            course,
            group,
            phone: `+99890${String(1000000 + i).substring(0, 7)}`,
            gender: i % 3 === 0 ? 'FEMALE' : 'MALE',
            birthDate: new Date(2002 + (4 - course), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            address: 'Ташкент, Узбекистан',
            enrollYear: 2025 - course,
            studyPlanId: studyPlan.id
          }
        }
      },
      include: { student: true }
    });
    students.push(student);
  }

  console.log('✅ Students created');

  // Create Grades for students
  const subjects = [subject1, subject2, subject3, subject4];
  
  for (const student of students) {
    const numSubjects = student.student.course >= 3 ? 4 : student.student.course === 2 ? 2 : 1;
    
    for (let j = 0; j < numSubjects; j++) {
      const numGrades = Math.floor(Math.random() * 3) + 3; // 3-5 оценок
      
      for (let k = 0; k < numGrades; k++) {
        await prisma.grade.create({
          data: {
            value: Math.floor(Math.random() * 30) + 70, // 70-100
            studentId: student.student.id,
            subjectId: subjects[j].id,
            comment: k === 0 ? 'Первая оценка' : k === numGrades - 1 ? 'Итоговая оценка' : null,
            date: new Date(2024, 8 + k, Math.floor(Math.random() * 28) + 1)
          }
        });
      }
    }
  }

  console.log('✅ Grades created');

  // Create News
  await prisma.news.createMany({
    data: [
      {
        title: 'Новый учебный год 2024-2025',
        content: 'Кафедра информационных технологий приглашает всех студентов на торжественное открытие нового учебного года. Мероприятие состоится 1 сентября 2024 года.',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        published: true,
        publishDate: new Date('2024-08-25')
      },
      {
        title: 'Конференция по искусственному интеллекту',
        content: 'Приглашаем студентов и преподавателей принять участие в международной конференции по AI, которая пройдет 15-17 октября 2024 года.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        published: true,
        publishDate: new Date('2024-09-10')
      },
      {
        title: 'Хакатон "IT Challenge 2024"',
        content: 'Кафедра организует хакатон для студентов всех курсов. Лучшие проекты получат ценные призы и возможность стажировки в IT-компаниях.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        published: true,
        publishDate: new Date('2024-10-01')
      }
    ]
  });

  console.log('✅ News created');

  // Create Graduates
  await prisma.graduate.createMany({
    data: [
      {
        firstName: 'Алишер',
        lastName: 'Навоий',
        photo: 'https://ui-avatars.com/api/?name=Alisher+Navoiy&size=200',
        graduateYear: 2022,
        currentJob: 'Senior Software Engineer',
        company: 'Google',
        achievement: 'Разработал систему распределенной обработки данных'
      },
      {
        firstName: 'Малика',
        lastName: 'Турсунова',
        photo: 'https://ui-avatars.com/api/?name=Malika+Tursunova&size=200',
        graduateYear: 2021,
        currentJob: 'Tech Lead',
        company: 'Microsoft',
        achievement: 'Руководит командой разработки облачных решений'
      },
      {
        firstName: 'Жахонгир',
        lastName: 'Ахмедов',
        photo: 'https://ui-avatars.com/api/?name=Jahongir+Ahmedov&size=200',
        graduateYear: 2023,
        currentJob: 'Full Stack Developer',
        company: 'Yandex',
        achievement: 'Создал платформу для онлайн-обучения'
      }
    ]
  });

  console.log('✅ Graduates created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin: admin@university.uz / password123');
  console.log('Teacher1: teacher1@university.uz / password123');
  console.log('Teacher2: teacher2@university.uz / password123');
  console.log('Student1: student1@university.uz / password123');
  console.log('Student2: student2@university.uz / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
