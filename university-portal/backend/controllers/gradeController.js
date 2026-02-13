const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all grades
// @route   GET /api/grades
// @access  Private
const getGrades = async (req, res) => {
  try {
    let grades;

    if (req.user.role === 'STUDENT' && req.user.student) {
      // Student sees only their grades
      grades = await prisma.grade.findMany({
        where: { studentId: req.user.student.id },
        include: {
          subject: {
            include: {
              teacher: {
                include: {
                  user: true
                }
              }
            }
          },
          student: {
            include: {
              user: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    } else if (req.user.role === 'TEACHER' && req.user.teacher) {
      // Teacher sees grades for their subjects
      grades = await prisma.grade.findMany({
        where: {
          subject: {
            teacherId: req.user.teacher.id
          }
        },
        include: {
          subject: true,
          student: {
            include: {
              user: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    } else {
      // Admin sees all grades
      grades = await prisma.grade.findMany({
        include: {
          subject: {
            include: {
              teacher: {
                include: {
                  user: true
                }
              }
            }
          },
          student: {
            include: {
              user: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    }

    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get grades by student ID
// @route   GET /api/grades/student/:studentId
// @access  Private
const getGradesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check authorization
    if (req.user.role === 'STUDENT' && req.user.student) {
      if (req.user.student.id !== studentId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const grades = await prisma.grade.findMany({
      where: { studentId },
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
    });

    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create grade
// @route   POST /api/grades
// @access  Private (Admin, Teacher)
const createGrade = async (req, res) => {
  try {
    const { value, studentId, subjectId, comment, date } = req.body;

    // Check if teacher is authorized for this subject
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      });

      if (!subject || subject.teacherId !== req.user.teacher.id) {
        return res.status(403).json({ message: 'Not authorized to grade this subject' });
      }
    }

    const grade = await prisma.grade.create({
      data: {
        value: parseFloat(value),
        studentId,
        subjectId,
        comment,
        date: date ? new Date(date) : new Date()
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        subject: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    res.status(201).json(grade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update grade
// @route   PUT /api/grades/:id
// @access  Private (Admin, Teacher)
const updateGrade = async (req, res) => {
  try {
    const { value, comment, date } = req.body;

    const grade = await prisma.grade.findUnique({
      where: { id: req.params.id },
      include: {
        subject: true
      }
    });

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Check if teacher is authorized
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      if (grade.subject.teacherId !== req.user.teacher.id) {
        return res.status(403).json({ message: 'Not authorized to edit this grade' });
      }
    }

    const updatedGrade = await prisma.grade.update({
      where: { id: req.params.id },
      data: {
        value: parseFloat(value),
        comment,
        date: date ? new Date(date) : undefined
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        subject: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    res.json(updatedGrade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete grade
// @route   DELETE /api/grades/:id
// @access  Private (Admin, Teacher)
const deleteGrade = async (req, res) => {
  try {
    const grade = await prisma.grade.findUnique({
      where: { id: req.params.id },
      include: {
        subject: true
      }
    });

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    // Check if teacher is authorized
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      if (grade.subject.teacherId !== req.user.teacher.id) {
        return res.status(403).json({ message: 'Not authorized to delete this grade' });
      }
    }

    await prisma.grade.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getGrades,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade
};
