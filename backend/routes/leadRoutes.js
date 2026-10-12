const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  getLeadById // <-- Add this here
} = require('../controllers/leadController');

router.post('/', createLead);
router.get('/', getLeads);
router.patch('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);
router.get('/:id', getLeadById);

module.exports = router;