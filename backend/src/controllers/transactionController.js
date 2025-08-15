// src/controllers/transactionController.js

const {
  createTransaction,getAllTransactions,getTransactionsBySale} = require('../models/tokenSaleModel');

/**
 * Create a new blockchain transaction entry in the system.
 * 
 * Required fields in req.body:
 *  - txType: "deposit", "prada_transfer", etc.
 *  - txHash: blockchain tx hash
 * Optional:
 *  - saleId
 *  - tokenAddress
 *  - amount
 */
async function createTx(req, res, next) {
  try {
    const { saleId, txType, txHash, tokenAddress, amount } = req.body;

    if (!txType || !txHash) {
      return res.status(400).json({ error: 'txType and txHash are required' });
    }

    const tx = await createTransaction({
      saleId,
      txType,
      txHash,
      tokenAddress,
      amount
    });

    return res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
}

/**
 * Return all blockchain transactions in the system.
 * (Admin only view typically)
 */
async function listAllTx(req, res, next) {
  try {
    const txs = await getAllTransactions();
    return res.json(txs);
  } catch (err) {
    next(err);
  }
}

/**
 * Get all transactions for a specific token sale
 * 
 * Requires: req.params.saleId
 */
async function listTxBySale(req, res, next) {
  try {
    const saleId = parseInt(req.params.saleId);
    if (isNaN(saleId)) {
      return res.status(400).json({ error: 'Invalid saleId' });
    }

    const txs = await getTransactionsBySale(saleId);
    return res.json(txs);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTx,
  listAllTx,
  listTxBySale
};
