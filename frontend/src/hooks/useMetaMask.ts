import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

interface MetaMaskState {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  balance: string | null;
}

export const useMetaMask = () => {
  const [state, setState] = useState<MetaMaskState>({
    account: null,
    isConnected: false,
    isLoading: false,
    error: null,
    balance: null,
  });

  // 메타마스크 설치 여부 확인
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }, []);

  // 메타마스크 연결
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setState((prev) => ({
        ...prev,
        error: 'MetaMask를 설치해주세요.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(account);
        const balanceInEth = (parseFloat(balance.toString()) / 1e18).toFixed(4);

        setState({
          account,
          isConnected: true,
          isLoading: false,
          error: null,
          balance: balanceInEth,
        });

        // 로컬 스토리지에 저장
        localStorage.setItem('walletAddress', account);

        return account;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'MetaMask 연결 중 오류가 발생했습니다.';
      setState({
        account: null,
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        balance: null,
      });
      console.error('MetaMask 연결 오류:', error);
    }
  }, [isMetaMaskInstalled]);

  // 메타마스크 연결 해제
  const disconnectMetaMask = useCallback(() => {
    setState({
      account: null,
      isConnected: false,
      isLoading: false,
      error: null,
      balance: null,
    });
    localStorage.removeItem('walletAddress');
  }, []);

  // 계정 변경 감지
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectMetaMask();
      } else {
        // 계정이 변경되었으므로 다시 연결
        connectMetaMask();
      }
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [isMetaMaskInstalled, connectMetaMask, disconnectMetaMask]);

  return {
    ...state,
    connectMetaMask,
    disconnectMetaMask,
    isMetaMaskInstalled,
  };
};
