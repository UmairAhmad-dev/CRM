const express = require('express');
const router = express.Router();
const { createNote, getNotesByLead } = require('../controllers/noteController');

router.post('/', createNote);
router.get('/lead/:leadId', getNotesByLead);

module.exports = router;