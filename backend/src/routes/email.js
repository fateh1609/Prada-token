// src/routes/email.js
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailService');

/**
 * POST /api/email/send
 *   Send a one‐off email via your Resend integration.
 *   Body: { to, subject, html }
 */
router.post('/send', async (req, res, next) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'to, subject and html are required' });
    }
    await sendEmail(to, subject, html);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
