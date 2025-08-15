// src/utils/pradaTransfer.js
const { ethers } = require('ethers');
const pradaAbi = require('../abi/prada.json');

const {
  INFURA_RPC_URL,
  PRADA_TOKEN_ADDRESS,
  DEV_WALLET_PRIVATE_KEY
} = process.env;

// Setup provider and signer
const provider = new ethers.JsonRpcProvider(INFURA_RPC_URL);

const signer = new ethers.Wallet(DEV_WALLET_PRIVATE_KEY, provider);

// Setup PRADA contract instance
const pradaContract = new ethers.Contract(
  PRADA_TOKEN_ADDRESS,
  pradaAbi,
  signer
);

/**
 * Sends PRADA tokens to a given wallet.
 *
 * @param {string} to - recipient wallet address
 * @param {string|number} amount - number of PRADA tokens to send (not wei)
 * @returns {Promise<string>} - transaction hash
 */
async function sendPradaTokens(to, amount) {
  try {
    const decimals = 18;
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals);

    const tx = await pradaContract.transfer(to, parsedAmount);
    await tx.wait(); // Wait for it to be mined

    console.log(`✅ Sent ${amount} PRADA to ${to} | Tx: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error('❌ PRADA transfer failed:', error);
    throw new Error('PRADA token transfer failed');
  }
}

module.exports = { sendPradaTokens };
