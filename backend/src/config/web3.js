// src/config/web3.js
const { ethers } = require('ethers');

// Connect to BSC Mainnet via Infura (or your preferred RPC)
const provider = new ethers.providers.JsonRpcProvider(
  `https://bsc-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
  {
    name: 'binance',
    chainId: 56,
  }
);

// Load ABIs
const pradaAbi = require('../abi/prada.json');
const erc20Abi = require('../abi/erc20.json');

// Contract addresses from your .env
const PRADA_ADDRESS = process.env.PRADA_CONTRACT_ADDRESS;
const USDT_ADDRESS  = process.env.USDT_CONTRACT_ADDRESS;
const USDC_ADDRESS  = process.env.USDC_CONTRACT_ADDRESS;
const SALE_WALLET   = process.env.SALE_WALLET_ADDRESS;

// Instantiate contracts
const PradaContract = new ethers.Contract(PRADA_ADDRESS, pradaAbi, provider);
const USDTContract  = new ethers.Contract(USDT_ADDRESS, erc20Abi, provider);
const USDCContract  = new ethers.Contract(USDC_ADDRESS, erc20Abi, provider);

module.exports = {
  provider,
  PradaContract,
  USDTContract,
  USDCContract,
  SALE_WALLET,
};
