const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    // Get counts
    const totalStudents = await prisma.student.count();
    const totalTeachers = await prisma.teacher.count();
    const totalSubjects = await prisma.subject.count();
    const totalGrades = await prisma.grade.count();

    // Get students by course
    const studentsByCourse = await prisma.student.groupBy({
      by: ['course'],
      _count: {
        course: true
      },
      orderBy: {
        course: 'asc'
      }
    });

    // Calculate average grade
    const allGrades = await prisma.grade.findMany();
    const averageGrade = allGrades.length > 0 
      ? allGrades.reduce((sum, grade) => sum + grade.value, 0) / allGrades.length 
      : 0;

    // Get recent activity (last 10 grades)
    const recentGrades = await prisma.grade.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: {
        student: {
          include: {
            user: true
          }
        },
        subject: true
      }
    });

    res.json({
      totalStudents,
      totalTeachers,
      totalSubjects,
      totalGrades,
      averageGrade: Math.round(averageGrade * 100) / 100,
      studentsByCourse: studentsByCourse.map(item => ({
        course: item.course,
        count: item._count.course
      })),
      recentGrades
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStats
};
