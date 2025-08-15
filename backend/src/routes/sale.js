// src/routes/sale.js
const express = require('express');
const router = express.Router();

const { createSale } = require('../controllers/tokenSaleController'); // Make sure this path and function match

// POST /api/sale
router.post('/', createSale);

// (Optional) GET /api/sale to list sales
const { listSales } = require('../controllers/tokenSaleController');
router.get('/', listSales);

module.exports = router;
