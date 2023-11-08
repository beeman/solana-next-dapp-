'use client';
import { WalletError } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-unsafe-burner';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

export interface SolanaProviderContext {
  cluster: Cluster | string;
  endpoint: string;
  explorerUrl: (path: string) => string;
  setCluster?: (cluster: Cluster) => void;
}

const Context = createContext<SolanaProviderContext>(
  {} as SolanaProviderContext
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const explorerUrl = 'https://explorer.solana.com';
  const [cluster, setCluster] = useState<Cluster | string>(
    'http://localhost:8899'
  );
  const endpoint = useMemo(
    () =>
      cluster.startsWith('http') ? cluster : clusterApiUrl(cluster as Cluster),
    [cluster]
  );
  const wallets = useMemo(
    () => [new UnsafeBurnerWalletAdapter(), new SolflareWalletAdapter()],
    [cluster]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const value: SolanaProviderContext = {
    cluster,
    endpoint,
    explorerUrl: useMemo(
      () => (path: string) =>
        `${explorerUrl}${path}${
          cluster === 'mainnet-beta'
            ? ''
            : `?cluster=${
                cluster.startsWith('http')
                  ? `custom&customUrl=${cluster}`
                  : `${cluster}`
              }`
        }`,
      [cluster]
    ),
    setCluster,
  };
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          <Context.Provider value={value}>{children}</Context.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useSolana() {
  return useContext(Context);
}
