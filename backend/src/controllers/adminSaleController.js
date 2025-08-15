// src/controllers/adminSaleController.js
const { createTokenSale }       = require('../models/tokenSaleModel')
const { sendPradaTokens }       = require('../utils/pradaTransfer')
const { sendConfirmationEmail } = require('../utils/emailService') // your existing email helper

// full “Option B” flow:
async function createAdminSale(req, res, next) {
  try {
    const { email, walletAddress, paymentTokenAddress, amountUsd, pradaAmount } = req.body
    if (!email || !walletAddress || !paymentTokenAddress || !amountUsd || !pradaAmount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    // 1) send PRADA on-chain
    const pradaTxHash = await sendPradaTokens(walletAddress, pradaAmount)
    // 2) record in DB
    const sale = await createTokenSale(
      email,
      walletAddress,
      paymentTokenAddress,
      amountUsd,
      pradaAmount,
      null,           // depositTxHash (we didn’t go on-chain here)
      pradaTxHash
    )
    // 3) email confirmation
    await sendConfirmationEmail(email, { sale, pradaTxHash })
    return res.status(201).json(sale)
  } catch (err) {
    next(err)
  }
}
module.exports = { createAdminSale }
