// src/contexts/WalletContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ethers }   from 'ethers';

const WalletContext = createContext();
export const useWallet = () => useContext(WalletContext);

// BEP‑20 USDT & USDC
const USDT         = '0x55d398326f99059fF775485246999027B3197955';
const USDC         = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
// Your PRADA token contract
const PRADA_TOKEN  = import.meta.env.VITE_PRADA_ADDRESS;
// Where to send the USDT/USDC you collect
const SALE_ADDRESS = import.meta.env.VITE_SALE_ADDRESS;
// Your backend
const BACKEND_URL  = import.meta.env.VITE_BACKEND_URL;

const erc20Abi = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint amount) returns (bool)'  // for USDT/USDC
];

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [usdtBalance, setUsdtBalance]     = useState('0.00');
  const [usdcBalance, setUsdcBalance]     = useState('0.00');
  const { toast } = useToast(); 

  const truncateAddress = addr =>
    addr ? `${addr.slice(0,4)}…${addr.slice(-6)}` : '';

  // 1) Fetch USDT & USDC balances
  const getBalances = useCallback(async address => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const usdtC    = new ethers.Contract(USDT, erc20Abi, provider);
      const usdcC    = new ethers.Contract(USDC, erc20Abi, provider);

      const [ rawUsdt, decUsdt ] = await Promise.all([
        usdtC.balanceOf(address),
        usdtC.decimals()
      ]);
      const [ rawUsdc, decUsdc ] = await Promise.all([
        usdcC.balanceOf(address),
        usdcC.decimals()
      ]);

      setUsdtBalance(parseFloat(
        ethers.formatUnits(rawUsdt, decUsdt)
      ).toFixed(2));
      setUsdcBalance(parseFloat(
        ethers.formatUnits(rawUsdc, decUsdc)
      ).toFixed(2));
    } catch (e) {
      console.error('Balance fetch error', e);
      setUsdtBalance('0.00');
      setUsdcBalance('0.00');
    }
  }, []);

  // 1b) Fetch on‑chain PRADA balance
  const getPradaBalance = useCallback(async address => {
    if (!window.ethereum || !PRADA_TOKEN) return '0.00';
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const pradaC   = new ethers.Contract(PRADA_TOKEN, erc20Abi, provider);
      const [ raw, dec ] = await Promise.all([
        pradaC.balanceOf(address),
        pradaC.decimals()
      ]);
      return parseFloat(
        ethers.formatUnits(raw, dec)
      ).toFixed(2);
    } catch (e) {
      console.error('PRADA fetch error', e);
      return '0.00';
    }
  }, []);

  // 2) Handle account (re)connection
  const onAccountsChanged = useCallback(accounts => {
    if (accounts.length) {
      const addr = ethers.getAddress(accounts[0]);
      setWalletAddress(addr);
      getBalances(addr);
      localStorage.setItem('walletConnected','true');
      toast({ title: 'Wallet Connected', description: truncateAddress(addr) });
    } else {
      setWalletAddress(null);
      setUsdtBalance('0.00');
      setUsdcBalance('0.00');
      localStorage.removeItem('walletConnected');
      toast({ title: 'Wallet Disconnected', variant: 'destructive' });
    }
  }, [getBalances, toast]);

  // 3) Listen for user switching accounts
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on('accountsChanged', onAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    };
  }, [onAccountsChanged]);

  // 4) Auto‑reconnect on mount if previously connected or already authorized
  useEffect(() => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.send('eth_accounts', []).then(accounts => {
      if (accounts.length > 0 || localStorage.getItem('walletConnected')) {
        onAccountsChanged(accounts);
      }
    });
  }, [onAccountsChanged]);

  // 5) Manual connect (on button click)
  const connectWallet = async () => {
    if (!window.ethereum) {
      return toast({
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask.',
        variant: 'destructive'
      });
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      onAccountsChanged(accounts);
    } catch (e) {
      console.error('Connect error', e);
      toast({ title: 'Connection Failed', variant: 'destructive' });
    }
  };

  /**
   * purchaseTokens():
   *  1) on‑chain transfer USDT/USDC → SALE_ADDRESS
   *  2) POST sale record to backend
   */
  const purchaseTokens = async ({
    email,
    paymentTokenAddress,
    amountUsd,
    pradaAmount
  }) => {
    if (!walletAddress) throw new Error('Wallet not connected');

    // on‑chain transfer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer   = await provider.getSigner();
    const tokenC   = new ethers.Contract(paymentTokenAddress, erc20Abi, signer);

    const dec = await tokenC.decimals();
    const raw = ethers.parseUnits(amountUsd.toString(), dec);
    const tx  = await tokenC.transfer(SALE_ADDRESS, raw);
    const { transactionHash: depositTxHash } = await tx.wait();

    // backend recording
    const res = await fetch(`${BACKEND_URL}/api/sale`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        walletAddress,
        paymentTokenAddress,
        amountUsd,
        pradaAmount,
        depositTxHash
      })
    });
    if (!res.ok) throw new Error('API sale failed');
    return res.json(); // { pradaTxHash, ... }
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnected: Boolean(walletAddress),
      connectWallet,
      usdtBalance,
      usdcBalance,
      truncateAddress,
      getBalances,
      getPradaBalance,    // ← new
      purchaseTokens
    }}>
      {children}
    </WalletContext.Provider>
  );
};
