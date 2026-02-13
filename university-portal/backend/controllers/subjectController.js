const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    let subjects;

    // If teacher, only show their subjects
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      subjects = await prisma.subject.findMany({
        where: { teacherId: req.user.teacher.id },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            }
          },
          grades: {
            include: {
              student: {
                include: {
                  user: true
                }
              }
            }
          },
          studyPlans: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Admin and Student see all subjects
      subjects = await prisma.subject.findMany({
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            }
          },
          grades: true,
          studyPlans: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        grades: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          },
          orderBy: { date: 'desc' }
        },
        studyPlans: true
      }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if teacher is authorized
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      if (subject.teacherId !== req.user.teacher.id) {
        return res.status(403).json({ message: 'Not authorized to access this subject' });
      }
    }

    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Admin, Teacher)
const createSubject = async (req, res) => {
  try {
    const { name, code, credits, hours, semester, description, teacherId, studyPlanIds } = req.body;

    // Check if code exists
    const codeExists = await prisma.subject.findUnique({ where: { code } });
    
    if (codeExists) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    let finalTeacherId = teacherId;

    // If teacher is creating, use their ID
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      finalTeacherId = req.user.teacher.id;
    }

    // Create subject
    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        credits: parseInt(credits),
        hours: parseInt(hours),
        semester: parseInt(semester),
        description,
        teacherId: finalTeacherId,
        studyPlans: studyPlanIds ? {
          connect: studyPlanIds.map(id => ({ id }))
        } : undefined
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        studyPlans: true
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin, Teacher - own only)
const updateSubject = async (req, res) => {
  try {
    const { name, code, credits, hours, semester, description, teacherId, studyPlanIds } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if teacher is authorized (can only edit their own subjects)
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      if (subject.teacherId !== req.user.teacher.id) {
        return res.status(403).json({ message: 'Not authorized to edit this subject' });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      code,
      credits: parseInt(credits),
      hours: parseInt(hours),
      semester: parseInt(semester),
      description
    };

    // Only admin can change teacher
    if (req.user.role === 'ADMIN' && teacherId) {
      updateData.teacherId = teacherId;
    }

    // Handle study plans
    if (studyPlanIds) {
      // Disconnect all and reconnect
      await prisma.subject.update({
        where: { id: req.params.id },
        data: {
          studyPlans: {
            set: []
          }
        }
      });

      updateData.studyPlans = {
        connect: studyPlanIds.map(id => ({ id }))
      };
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        studyPlans: true
      }
    });

    res.json(updatedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin, Teacher - own only)
const deleteSubject = async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if teacher is authorized (can only delete their own subjects)
    if (req.user.role === 'TEACHER' && req.user.teacher) {
      if (subject.teacherId !== req.user.teacher.id) {
        return res.status(403).json({ message: 'Not authorized to delete this subject' });
      }
    }

    await prisma.subject.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};
