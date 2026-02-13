const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// @desc    Get all news
// @route   GET /api/news
// @access  Public
const getNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { publishDate: 'desc' }
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all news (including unpublished) - Admin only
// @route   GET /api/news/all
// @access  Private (Admin)
const getAllNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Public
const getNewsById = async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { id: req.params.id }
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private (Admin)
const createNews = async (req, res) => {
  try {
    const { title, content, image, published, publishDate } = req.body;

    const news = await prisma.news.create({
      data: {
        title,
        content,
        image,
        published: published || false,
        publishDate: publishDate ? new Date(publishDate) : new Date()
      }
    });

    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin)
const updateNews = async (req, res) => {
  try {
    const { title, content, image, published, publishDate } = req.body;

    const news = await prisma.news.findUnique({
      where: { id: req.params.id }
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const updatedNews = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        image,
        published,
        publishDate: publishDate ? new Date(publishDate) : undefined
      }
    });

    res.json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin)
const deleteNews = async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { id: req.params.id }
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    await prisma.news.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getNews,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
