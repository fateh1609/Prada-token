// backend/src/index.js
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

// import Sequelize and perform sync
const { sequelize } = require('./models');

// routers
const saleRouter = require('./routes/sale');
const authRouter = require('./routes/auth');

(async () => {
  try {
    // 1) Test & sync DB
    await sequelize.authenticate();
    await sequelize.sync();            // in prod, replace with migrations
    console.log('✅ Database connected and synced');
    

    // 3) Launch Express
    const app  = express();
    const PORT = process.env.PORT || 8080;

    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
    app.use(bodyParser.json());

    app.use('/api/auth', authRouter);
    app.use('/api/sale', saleRouter);

    app.get('/', (req, res) => res.send('PradaFund Backend is running'));

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start application:', err);
    process.exit(1);
  }
})();
