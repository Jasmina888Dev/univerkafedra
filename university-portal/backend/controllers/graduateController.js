const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all graduates
// @route   GET /api/graduates
// @access  Public
const getGraduates = async (req, res) => {
  try {
    const graduates = await prisma.graduate.findMany({
      orderBy: { graduateYear: 'desc' }
    });

    res.json(graduates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get graduate by ID
// @route   GET /api/graduates/:id
// @access  Public
const getGraduateById = async (req, res) => {
  try {
    const graduate = await prisma.graduate.findUnique({
      where: { id: req.params.id }
    });

    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    res.json(graduate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create graduate
// @route   POST /api/graduates
// @access  Private (Admin)
const createGraduate = async (req, res) => {
  try {
    const { firstName, lastName, photo, graduateYear, currentJob, company, achievement } = req.body;

    const graduate = await prisma.graduate.create({
      data: {
        firstName,
        lastName,
        photo,
        graduateYear: parseInt(graduateYear),
        currentJob,
        company,
        achievement
      }
    });

    res.status(201).json(graduate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update graduate
// @route   PUT /api/graduates/:id
// @access  Private (Admin)
const updateGraduate = async (req, res) => {
  try {
    const { firstName, lastName, photo, graduateYear, currentJob, company, achievement } = req.body;

    const graduate = await prisma.graduate.findUnique({
      where: { id: req.params.id }
    });

    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    const updatedGraduate = await prisma.graduate.update({
      where: { id: req.params.id },
      data: {
        firstName,
        lastName,
        photo,
        graduateYear: parseInt(graduateYear),
        currentJob,
        company,
        achievement
      }
    });

    res.json(updatedGraduate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete graduate
// @route   DELETE /api/graduates/:id
// @access  Private (Admin)
const deleteGraduate = async (req, res) => {
  try {
    const graduate = await prisma.graduate.findUnique({
      where: { id: req.params.id }
    });

    if (!graduate) {
      return res.status(404).json({ message: 'Graduate not found' });
    }

    await prisma.graduate.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Graduate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getGraduates,
  getGraduateById,
  createGraduate,
  updateGraduate,
  deleteGraduate
};
