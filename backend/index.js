require('dotenv').config();
require('./startup');

const express = require('express');
const cors = require('cors');
const saleRouter = require('./routes/sale');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());                               // ← allow your frontend origin
app.use(express.json());

app.use('/api/sale', saleRouter);
app.use('/api/auth', authRouter);              // ← new

app.get('/', (req, res) => res.send('PradaFund Backend is running'));
app.listen(process.env.PORT || 8080, () =>
  console.log(`Server listening on port ${process.env.PORT||8080}`)
);
