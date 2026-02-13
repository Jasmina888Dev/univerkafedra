const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        studyPlan: true,
        grades: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate average grade for each student
    const studentsWithAverage = students.map(student => {
      const totalGrades = student.grades.reduce((sum, grade) => sum + grade.value, 0);
      const averageGrade = student.grades.length > 0 ? totalGrades / student.grades.length : 0;
      
      return {
        ...student,
        averageGrade: Math.round(averageGrade * 100) / 100
      };
    });

    res.json(studentsWithAverage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        },
        studyPlan: {
          include: {
            subjects: {
              include: {
                teacher: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        },
        grades: {
          include: {
            subject: {
              include: {
                teacher: {
                  include: {
                    user: true
                  }
                }
              }
            }
          },
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate average grade
    const totalGrades = student.grades.reduce((sum, grade) => sum + grade.value, 0);
    const averageGrade = student.grades.length > 0 ? totalGrades / student.grades.length : 0;

    res.json({
      ...student,
      averageGrade: Math.round(averageGrade * 100) / 100
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  try {
    const { 
      email, password, firstName, lastName, 
      studentCode, course, group, phone, 
      gender, birthDate, address, enrollYear, studyPlanId 
    } = req.body;

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if student code exists
    const codeExists = await prisma.student.findUnique({ where: { studentCode } });
    
    if (codeExists) {
      return res.status(400).json({ message: 'Student code already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and student
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'STUDENT',
        firstName,
        lastName,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&size=200`,
        student: {
          create: {
            studentCode,
            course: parseInt(course),
            group,
            phone,
            gender,
            birthDate: birthDate ? new Date(birthDate) : null,
            address,
            enrollYear: parseInt(enrollYear),
            studyPlanId
          }
        }
      },
      include: {
        student: {
          include: {
            studyPlan: true
          }
        }
      }
    });

    res.status(201).json(user.student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, 
      studentCode, course, group, phone, 
      gender, birthDate, address, studyPlanId 
    } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update user
    await prisma.user.update({
      where: { id: student.userId },
      data: {
        firstName,
        lastName,
        email
      }
    });

    // Update student
    const updatedStudent = await prisma.student.update({
      where: { id: req.params.id },
      data: {
        studentCode,
        course: parseInt(course),
        group,
        phone,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        address,
        studyPlanId
      },
      include: {
        user: true,
        studyPlan: true,
        grades: {
          include: {
            subject: true
          }
        }
      }
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete user (cascade will delete student)
    await prisma.user.delete({
      where: { id: student.userId }
    });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get top 10 students
// @route   GET /api/students/top
// @access  Private
const getTopStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        grades: true
      }
    });

    // Calculate average and sort
    const studentsWithAverage = students.map(student => {
      const totalGrades = student.grades.reduce((sum, grade) => sum + grade.value, 0);
      const averageGrade = student.grades.length > 0 ? totalGrades / student.grades.length : 0;
      
      return {
        id: student.id,
        studentCode: student.studentCode,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        avatar: student.user.avatar,
        course: student.course,
        group: student.group,
        averageGrade: Math.round(averageGrade * 100) / 100,
        totalGrades: student.grades.length
      };
    });

    // Sort by average grade and take top 10
    const topStudents = studentsWithAverage
      .sort((a, b) => b.averageGrade - a.averageGrade)
      .slice(0, 10);

    res.json(topStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getTopStudents
};
