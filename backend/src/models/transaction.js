// src/models/transaction.js

const pool = require('../config/db');

/**
 * Insert a blockchain transaction record into the database.
 *
 * @param {Object} params
 * @param {number|null} params.saleId        – ID of the related token_sale (nullable for generic tx)
 * @param {string} params.txType             – "deposit" | "prada_transfer" | "manual" | "airdrop" | etc.
 * @param {string} params.txHash             – Blockchain transaction hash
 * @param {string|null} [params.tokenAddress] – Contract address of the token involved (optional)
 * @param {string|number|null} [params.amount] – Amount transferred (in token units)
 * @returns {Promise<object>} The inserted transaction row
 */
async function createTransaction({
  saleId = null,
  txType,
  txHash,
  tokenAddress = null,
  amount = null
}) {
  const result = await pool.query(
    `INSERT INTO transactions
      (sale_id, tx_type, tx_hash, token_address, amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [saleId, txType, txHash, tokenAddress, amount]
  );
  return result.rows[0];
}

/**
 * Retrieve all transactions associated with a specific token sale.
 *
 * @param {number} saleId
 * @returns {Promise<object[]>}
 */
async function getTransactionsBySale(saleId) {
  const result = await pool.query(
    `SELECT * FROM transactions
     WHERE sale_id = $1
     ORDER BY created_at DESC`,
    [saleId]
  );
  return result.rows;
}

/**
 * Retrieve all blockchain transactions stored in the system.
 *
 * @returns {Promise<object[]>}
 */
async function getAllTransactions() {
  const result = await pool.query(
    `SELECT * FROM transactions
     ORDER BY created_at DESC`
  );
  return result.rows;
}

module.exports = {
  createTransaction,
  getTransactionsBySale,
  getAllTransactions
};
