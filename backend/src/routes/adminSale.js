// src/routes/adminSale.js
const express              = require('express')
const { createAdminSale }  = require('../controllers/adminSaleController')
const router               = express.Router()

// (you’ll want to protect this with your auth middleware in real life)
router.post('/', createAdminSale)

module.exports = router
