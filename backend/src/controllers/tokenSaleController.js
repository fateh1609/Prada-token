const { createTokenSale, getAllTokenSales } = require('../models/tokenSaleModel');
const { sendPradaTokens } = require('../utils/pradaTransfer');
const { sendEmail } = require('../utils/emailService');

async function createSale(req, res, next) {
  try {
    const {
      email,
      walletAddress,
      paymentTokenAddress,
      amountUsd,
      pradaAmount,
      depositTxHash,
    } = req.body;

    if (!email || !walletAddress || !paymentTokenAddress || !amountUsd || !pradaAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const pradaTxHash = await sendPradaTokens(walletAddress, pradaAmount);

    const sale = await createTokenSale(
      email,
      walletAddress,
      paymentTokenAddress,
      amountUsd,
      pradaAmount,
      depositTxHash || null,
      pradaTxHash
    );
    const { sendEmail } = require('../utils/emailService');

await sendEmail({
  to: email,
  subject: '🎉 PRADA Token Purchase Successful',
  html: `
    <h2>Thank you for purchasing PRADA Tokens!</h2>
    <p><strong>Amount:</strong> ${pradaAmount} PRADA</p>
    <p><strong>Wallet:</strong> ${walletAddress}</p>
    <p><strong>Tx Hash:</strong> <a href="https://bscscan.com/tx/${pradaTxHash}" target="_blank">${pradaTxHash}</a></p>
    <p>Stake your tokens Now on <a href="https://stake.pradatoken.fun/">stake.pradatoken.fun</a></p>
    <p>This transaction has been successfully recorded and your PRADA tokens are now in your wallet.</p>
    <br/>
    <p>Regards,<br/>Team PradaToken</p>
  `,
});

    return res.status(201).json(sale);
  } catch (err) {
    next(err);
  }
}

async function listSales(req, res, next) {
  try {
    const sales = await getAllTokenSales();
    return res.json(sales);
  } catch (err) {
    next(err);
  }
}
module.exports = {
  createSale,
  listSales,
};
