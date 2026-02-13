const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private (Admin)
const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
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
        subjects: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
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
        subjects: {
          include: {
            grades: {
              include: {
                student: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create teacher
// @route   POST /api/teachers
// @access  Private (Admin)
const createTeacher = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, position, department, degree, bio } = req.body;

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and teacher
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'TEACHER',
        firstName,
        lastName,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&size=200`,
        teacher: {
          create: {
            phone,
            position,
            department,
            degree,
            bio
          }
        }
      },
      include: {
        teacher: true
      }
    });

    res.status(201).json(user.teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (Admin)
const updateTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, department, degree, bio } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update user
    await prisma.user.update({
      where: { id: teacher.userId },
      data: {
        firstName,
        lastName,
        email
      }
    });

    // Update teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id: req.params.id },
      data: {
        phone,
        position,
        department,
        degree,
        bio
      },
      include: {
        user: true,
        subjects: true
      }
    });

    res.json(updatedTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin)
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id }
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete user (cascade will delete teacher)
    await prisma.user.delete({
      where: { id: teacher.userId }
    });

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
