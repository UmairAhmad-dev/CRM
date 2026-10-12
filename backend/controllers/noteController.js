const prisma = require('../config/db');

// @desc    Create a note for a lead
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { content, leadId, authorId } = req.body;

    if (!content || !leadId || !authorId) {
      return res.status(400).json({ error: 'Content, leadId, and authorId are required' });
    }

    const newNote = await prisma.note.create({
      data: { content, leadId, authorId },
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note', details: error.message });
  }
};

// @desc    Get all activity notes for a specific lead
// @route   GET /api/notes/lead/:leadId
const getNotesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const notes = await prisma.note.findMany({
      where: { leadId },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

module.exports = {
  createNote,
  getNotesByLead,
};