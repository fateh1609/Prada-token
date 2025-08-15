// backend/src/startup.js
require('dotenv').config();
const bcrypt            = require('bcrypt');
const { sequelize, User } = require('./models');
const ethers            = require('ethers');

async function seedUsers() {
  const adminPlain = 'Test@123';
  const userPlain  = 'test@123';
  const pinPlain   = '0000';

  const [ adminPassHash, userPassHash, pinHash ] = await Promise.all([
    bcrypt.hash(adminPlain, 12),
    bcrypt.hash(userPlain, 12),
    bcrypt.hash(pinPlain, 12)
  ]);

  // Always lowercase the walletAddress here
  const adminWallet = '0x930f58ffA72251A7bA9e810775161C005ffa2a54'
    .toLowerCase();

  // Admin user
  await User.upsert({
    username:      'backoffice',
    firstName:     'Admin',
    lastName:      'User',
    email:         'admin@pradafund.com',
    walletAddress: adminWallet,
    sponsorCode:   'backoffice',
    passwordHash:  adminPassHash,
    pinHash
  });

  // Regular system user (no wallet)
  await User.upsert({
    username:      'system',
    firstName:     'Regular',
    lastName:      'User',
    email:         'system@pradafund.com',
    walletAddress: null,
    sponsorCode:   'backoffice',
    passwordHash:  userPassHash,
    pinHash
  });
}

async function blockchainInit() {
  const provider = new ethers.JsonRpcProvider(process.env.INFURA_RPC_URL);
  const devWallet = new ethers.Wallet(
    process.env.DEV_WALLET_PRIVATE_KEY,
    provider
  );
  console.log('Dev wallet:', devWallet.address);

  const balance = await provider.getBalance(devWallet.address);
  console.log(`Dev wallet ETH balance: ${ethers.formatEther(balance)} ETH`);
  if (balance === 0n) {
    throw new Error('Dev wallet has zero ETH. Fund it and retry.');
  }

  const PRADA_TOKEN_ADDRESS = '0xeF0169B129E5f66FDfA5cC1631B18CE2Fc6E370B';
  const SALE_WALLET_ADDRESS = '0x0bb5D9bE69FBeF3e936Db696Dc6013752dcF037a';
  const TRANSFER_AMOUNT     = ethers.parseUnits('1000', 18);

  const PRADA_ABI = [
    {
      inputs: [
        { internalType: 'address', name: 'to',    type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'user',   type: 'address' },
        { internalType: 'uint128', name: 'amount', type: 'uint128' }
      ],
      name: 'lockTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'user',   type: 'address' },
        { internalType: 'uint128', name: 'amount', type: 'uint128' }
      ],
      name: 'unlockTokens',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'user', type: 'address' }
      ],
      name: 'getAccountInfo',
      outputs: [
        { internalType: 'uint256', name: 'totalBalance', type: 'uint256' },
        { internalType: 'uint128', name: 'locked',       type: 'uint128' },
        { internalType: 'uint256', name: 'unlocked',     type: 'uint256' },
        { internalType: 'bool',    name: 'isLocked',     type: 'bool' }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ];

  const prada = new ethers.Contract(
    PRADA_TOKEN_ADDRESS,
    PRADA_ABI,
    devWallet
  );

  console.log('--- Transferring 1,000 PRADA to sale wallet ---');
  const tx1 = await prada.transfer(SALE_WALLET_ADDRESS, TRANSFER_AMOUNT);
  console.log('→ transfer tx hash:', tx1.hash);
  await tx1.wait();

  console.log('--- Locking 1,000 PRADA in sale wallet ---');
  const tx2 = await prada.lockTokens(SALE_WALLET_ADDRESS, TRANSFER_AMOUNT, {
    gasLimit: 200_000
  });
  console.log('→ lockTokens tx hash:', tx2.hash);
  await tx2.wait();

  console.log('--- Fetching account info for sale wallet ---');
  const [ totalBalance, locked, unlocked, isLocked ] =
    await prada.getAccountInfo(SALE_WALLET_ADDRESS);
  console.log(`→ totalBalance: ${ethers.formatUnits(totalBalance, 18)} PRADA`);
  console.log(`→ locked:       ${ethers.formatUnits(locked,       18)} PRADA`);
  console.log(`→ unlocked:     ${ethers.formatUnits(unlocked,     18)} PRADA`);
  console.log(`→ isLocked:     ${isLocked}`);

  if (locked === 0n) {
    console.log('Nothing locked; skipping unlock.');
  } else {
    console.log('--- Unlocking all locked PRADA ---');
    const tx3 = await prada.unlockTokens(SALE_WALLET_ADDRESS, locked, {
      gasLimit: 200_000
    });
    console.log('→ unlockTokens tx hash:', tx3.hash);
    await tx3.wait();
  }

  console.log('✅ Blockchain startup completed.');
}

(async function init() {
  try {
    console.log('🔌 Connecting to DB...');
    await sequelize.authenticate();
    console.log('✅ Database connected and synced');

    console.log('🔄 Syncing models...');
    await sequelize.sync();
    console.log('✅ Models synced');

    console.log('🌱 Seeding users...');
    await seedUsers();
    console.log('✅ Users seeded');

    // Run the blockchain transfer/lock/unlock steps
    await blockchainInit();

    console.log('🎉 Startup sequence complete.');
  } catch (err) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
})();
