const prisma = require('../config/db');

// @desc    Create a new lead
// @route   POST /api/leads
const createLead = async (req, res) => {
  try {
    const { firstName, lastName, company, email, phone, userId, dealValue } = req.body;

    if (!firstName || !lastName || !userId) {
      return res.status(400).json({ error: 'First name, last name, and assigned userId are required' });
    }

    const newLead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        company,
        email,
        phone,
        userId,
        dealValue: dealValue ? parseInt(dealValue) : 0,
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead', details: error.message });
  }
};

// @desc    Get active leads with assigned rep details
// @route   GET /api/leads
const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { isDeleted: false },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leads' });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'WON', 'LOST'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead status' });
  }
};

// @desc    Soft delete a lead
// @route   DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lead.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: 'Lead soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
};

// @desc    Get a single lead by ID
// @route   GET /api/leads/:id
const getLeadById = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: { assignedTo: { select: { id: true, name: true } } }
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

module.exports = { createLead, getLeads, updateLeadStatus, deleteLead, getLeadById };