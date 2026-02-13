const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all study plans
// @route   GET /api/study-plans
// @access  Private
const getStudyPlans = async (req, res) => {
  try {
    const studyPlans = await prisma.studyPlan.findMany({
      include: {
        subjects: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          }
        },
        students: {
          include: {
            user: true
          }
        }
      },
      orderBy: { year: 'desc' }
    });

    res.json(studyPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get study plan by ID
// @route   GET /api/study-plans/:id
// @access  Private
const getStudyPlanById = async (req, res) => {
  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: req.params.id },
      include: {
        subjects: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          },
          orderBy: { semester: 'asc' }
        },
        students: {
          include: {
            user: true
          }
        }
      }
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json(studyPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create study plan
// @route   POST /api/study-plans
// @access  Private (Admin)
const createStudyPlan = async (req, res) => {
  try {
    const { name, year, description, subjectIds } = req.body;

    const studyPlan = await prisma.studyPlan.create({
      data: {
        name,
        year: parseInt(year),
        description,
        subjects: subjectIds ? {
          connect: subjectIds.map(id => ({ id }))
        } : undefined
      },
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
    });

    res.status(201).json(studyPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update study plan
// @route   PUT /api/study-plans/:id
// @access  Private (Admin)
const updateStudyPlan = async (req, res) => {
  try {
    const { name, year, description, subjectIds } = req.body;

    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: req.params.id }
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    // Prepare update data
    const updateData = {
      name,
      year: parseInt(year),
      description
    };

    // Handle subjects
    if (subjectIds) {
      // Disconnect all and reconnect
      await prisma.studyPlan.update({
        where: { id: req.params.id },
        data: {
          subjects: {
            set: []
          }
        }
      });

      updateData.subjects = {
        connect: subjectIds.map(id => ({ id }))
      };
    }

    const updatedStudyPlan = await prisma.studyPlan.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        subjects: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          }
        },
        students: {
          include: {
            user: true
          }
        }
      }
    });

    res.json(updatedStudyPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete study plan
// @route   DELETE /api/study-plans/:id
// @access  Private (Admin)
const deleteStudyPlan = async (req, res) => {
  try {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: req.params.id }
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    await prisma.studyPlan.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Study plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudyPlans,
  getStudyPlanById,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan
};
