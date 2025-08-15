// backend/src/controllers/authController.js
const bcrypt                    = require('bcrypt');
const jwt                       = require('jsonwebtoken');
const crypto                    = require('crypto');
const { Op, UniqueConstraintError } = require('sequelize');
const { User }                  = require('../models');
const { sendEmail }             = require('../utils/emailService');

const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;

// —————————————————————————————————————————————
//  VALIDATION CONTROLLERS
// —————————————————————————————————————————————

/**
 * POST /api/auth/username
 */
exports.checkUsername = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ available: false, error: 'Missing username' });
  }
  const exists = await User.findOne({
    where: { username: username.toLowerCase() }
  });
  return exists
    ? res.json({ available: false, error: 'Username already in use' })
    : res.json({ available: true });
};

/**
 * POST /api/auth/email
 */
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ available: false, error: 'Missing email' });
  }
  const exists = await User.findOne({
    where: { email: email.toLowerCase() }
  });
  return exists
    ? res.json({ available: false, error: 'Email already registered' })
    : res.json({ available: true });
};

/**
 * POST /api/auth/wallet
 */
exports.checkWallet = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ available: false, error: 'Missing walletAddress' });
  }
  if (!WALLET_REGEX.test(walletAddress)) {
    return res.status(400).json({ available: false, error: 'Invalid wallet format' });
  }
  const lower = walletAddress.toLowerCase();
  const exists = await User.findOne({
    where: { walletAddress: lower }
  });
  return exists
    ? res.json({ available: false, error: 'Wallet already registered' })
    : res.json({ available: true });
};

/**
 * GET /api/auth/sponsor/:code
 */
exports.getSponsor = async (req, res) => {
  const { code } = req.params;
  const sponsor = await User.findOne({
    where: { username: code.toLowerCase() }
  });
  if (!sponsor) {
    return res.status(404).json({ error: `No sponsor found with username "${code}"` });
  }
  res.json({
    username: sponsor.username,
    fullName: `${sponsor.firstName} ${sponsor.lastName}`
  });
};

// —————————————————————————————————————————————
//  AUTH CONTROLLERS
// —————————————————————————————————————————————

/**
 * POST /api/auth/register
 */
exports.signup = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    walletAddress,
    sponsorCode,
    password,
    pin
  } = req.body;

  if (!sponsorCode) {
    return res.status(400).json({ error: 'Sponsor username is required.' });
  }

  try {
    const sponsor = await User.findOne({
      where: { username: sponsorCode.toLowerCase() }
    });
    if (!sponsor) {
      return res.status(400).json({ error: `No sponsor found with username "${sponsorCode}"` });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const pinHash      = await bcrypt.hash(pin, 12);

    const user = await User.create({
      firstName,
      lastName,
      username:       username.toLowerCase(),
      email:          email.toLowerCase(),
      walletAddress:  walletAddress ? walletAddress.toLowerCase() : null,
      sponsorCode:    sponsor.username,
      passwordHash,
      pinHash
    });

    const token = jwt.sign(
      { sub: user.id, wallet: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        username:      user.username,
        firstName:     user.firstName,
        lastName:      user.lastName,
        email:         user.email,
        walletAddress: user.walletAddress,
        sponsorCode:   user.sponsorCode
      }
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      const field = err.errors[0].path;
      return res.status(409).json({ error: `${field} already in use` });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() }
        ]
      }
    });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { sub: user.id, wallet: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, requiresPin: true });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/verify-pin
 */
exports.verifyPin = async (req, res) => {
  try {
    const { token, pin } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user || !await bcrypt.compare(pin, user.pinHash)) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    const finalToken = jwt.sign(
      { sub: user.id, wallet: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token: finalToken });
  } catch (err) {
    console.error('Verify PIN error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/wallet-login
 */
exports.walletLogin = async (req, res) => {
  try {
    const { walletAddress, pin } = req.body;
    const user = await User.findOne({
      where: { walletAddress: walletAddress.toLowerCase() }
    });
    if (!user || !await bcrypt.compare(pin, user.pinHash)) {
      return res.status(401).json({ error: 'Invalid wallet or PIN' });
    }
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error('Wallet login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/auth/me
 */
exports.me = async (req, res) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.sendStatus(401);
  try {
    const { sub } = jwt.verify(auth, process.env.JWT_SECRET);
    const user = await User.findByPk(sub);
    if (!user) return res.sendStatus(404);
    res.json({
      username:      user.username,
      firstName:     user.firstName,
      lastName:      user.lastName,
      email:         user.email,
      walletAddress: user.walletAddress,
      sponsorCode:   user.sponsorCode
    });
  } catch (err) {
    console.error('Me error:', err);
    res.sendStatus(401);
  }
};

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(404).json({ error: 'No user with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken       = resetToken;
    user.resetTokenExpiry = Date.now() + 3600_000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to:      user.email,
      subject: 'PradaFund Password Reset',
      html:    `<p>Hello ${user.firstName},</p>
                <p>Reset your password <a href="${resetUrl}">${resetUrl}</a> (expires in 1h)</p>`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Forgot Password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'Not authenticated' });
    const { sub } = jwt.verify(auth, process.env.JWT_SECRET);
    const user = await User.findByPk(sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { currentPassword, newPassword, confirm } = req.body;
    if (!currentPassword || !newPassword || !confirm) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (newPassword !== confirm) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }
    // verify old password
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/change-pin
 * Body: { currentPin, newPin, confirm }
 */
exports.changePin = async (req, res) => {
  try {
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'Not authenticated' });
    const { sub } = jwt.verify(auth, process.env.JWT_SECRET);
    const user = await User.findByPk(sub);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { currentPin, newPin, confirm } = req.body;
    if (!currentPin || !newPin || !confirm) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (newPin !== confirm) {
      return res.status(400).json({ error: 'New PINs do not match' });
    }
    // verify old PIN
    const ok = await bcrypt.compare(currentPin, user.pinHash);
    if (!ok) {
      return res.status(401).json({ error: 'Current PIN is incorrect' });
    }

    user.pinHash = await bcrypt.hash(newPin, 12);
    await user.save();
    res.json({ message: 'PIN changed successfully' });
  } catch (err) {
    console.error('changePin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user || Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    user.passwordHash       = await bcrypt.hash(newPassword, 12);
    user.resetToken         = null;
    user.resetTokenExpiry   = null;
    await user.save();
    res.json({ message: 'Password has been reset' });
  } catch (err) {
    console.error('Reset Password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
