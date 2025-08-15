// src/models/tokenSaleModel.js
const pool = require('../config/db');

async function createTokenSale(
  email,
  walletAddress,
  paymentTokenAddress,
  amountUsd,
  pradaAmount,
  depositTxHash,
  pradaTxHash
) {
  const result = await pool.query(
    `INSERT INTO token_sales
      (email, wallet_address, payment_token_address, amount_usd, prada_amount, deposit_tx_hash, prada_tx_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [email, walletAddress, paymentTokenAddress, amountUsd, pradaAmount, depositTxHash, pradaTxHash]
  );
  return result.rows[0];
}

async function getAllTokenSales() {
  const result = await pool.query(`SELECT * FROM token_sales ORDER BY created_at DESC`);
  return result.rows;
}

module.exports = {
  createTokenSale,
  getAllTokenSales,
};
