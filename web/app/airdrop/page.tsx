'use client';
import { IDL } from '@app-1699408735/anchor';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '../../components/wallet-buttons';
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { useSolana } from '../solana-provider';

const COUNTER_PROGRAM_ID = 'EuJfgknXicf6iZASeagt5U6XDDPpLTQrvWPW31vgAwo8';

const kp = web3.Keypair.fromSecretKey(
  Uint8Array.from([
    91, 172, 138, 190, 205, 9, 22, 16, 16, 68, 205, 98, 20, 26, 160, 30, 93, 62,
    53, 127, 11, 144, 104, 138, 171, 141, 89, 96, 100, 190, 232, 65, 3, 6, 108,
    24, 140, 226, 136, 32, 204, 175, 150, 113, 219, 78, 43, 254, 180, 194, 75,
    76, 168, 167, 111, 234, 107, 29, 91, 41, 159, 94, 124, 161,
  ])
);

export function useCounterProgram({
  kp,
  wallet,
}: {
  kp: Keypair;
  wallet: AnchorWallet;
}) {
  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: 'processed',
  });
  const program = new Program(IDL, COUNTER_PROGRAM_ID, provider);

  async function initialize() {
    try {
      return program.methods
        .initializeCounter()
        .accounts({
          counter: kp.publicKey,
          payer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([kp])
        .rpc()
        .then(() => fetch());
    } catch (err) {
      return err?.toString();
    }
  }

  async function fetch() {
    try {
      return program.account.counter
        .fetch(kp.publicKey)
        .then((res) => Number(res.count));
    } catch (err) {
      return err?.toString();
    }
  }

  async function increment() {
    try {
      return program.methods
        .increment()
        .accounts({ counter: kp.publicKey })
        .rpc();
    } catch (err) {
      console.log('err', err);
      return err?.toString() ?? 'Something went wrong';
    }
  }
  async function decrement() {
    try {
      return program.methods
        .decrement()
        .accounts({ counter: kp.publicKey })
        .rpc();
    } catch (err) {
      return err?.toString();
    }
  }

  async function set(value: number) {
    try {
      // return program.methods.set(new BN(value)).accounts({ counter: kp.publicKey }).rpc()
    } catch (err) {
      return err?.toString();
    }
  }

  return {
    fetch,
    initialize,
    increment,
    decrement,
    set,
  };
}

export default async function Page() {
  const { connected } = useWallet();
  const wallet = useAnchorWallet();
  return (
    <div>
      <div className="flex gap-4">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      {connected && wallet ? (
        <HomeUiAppConnected wallet={wallet} />
      ) : (
        <pre style={{ fontSize: 'x-small' }}>
          {JSON.stringify(IDL, null, 2)}
        </pre>
      )}
    </div>
  );
}

export function HomeUiAppConnected({ wallet }: { wallet: AnchorWallet }) {
  const { explorerUrl } = useSolana();
  const { decrement, fetch, increment, initialize, set } = useCounterProgram({
    kp,
    wallet,
  });
  const [result, setResult] = useState<unknown>(undefined);
  const [tx, setTx] = useState<string | undefined>(undefined);

  return (
    <div>
      <pre style={{ margin: 0, padding: 0, fontSize: 'small' }}>
        Account: {kp.publicKey.toString()}
      </pre>

      <div>
        <button
          className="btn btn-default"
          onClick={() =>
            fetch()
              .then((res) => setResult({ res }))
              .catch((err) => setResult({ err: err.toString() }))
          }
        >
          fetch
        </button>
        <button
          className="btn btn-default"
          onClick={() =>
            initialize()
              .then((res) => setResult({ res }))
              .catch((err) => setResult({ err: err.toString() }))
          }
        >
          initialize
        </button>
        <button
          className="btn btn-default"
          onClick={() =>
            increment()
              .then((res) => {
                setTx(res?.toString());
                return fetch();
              })
              .then((res) => setResult({ res }))
              .catch((err) => setResult({ err: err.toString() }))
          }
        >
          increment
        </button>
        <button
          className="btn btn-default"
          onClick={() =>
            decrement()
              .then((res) => {
                setTx(res?.toString());
                return fetch();
              })
              .then((res) => setResult({ res }))
              .catch((err) => setResult({ err: err.toString() }))
          }
        >
          decrement
        </button>
        <button
          className="btn btn-default"
          onClick={() => {
            const value = prompt(
              'What value do you want to set to counter?',
              '42'
            );
            return set(Number(value))
              .then((res) => {
                setTx(res?.toString());
                return fetch();
              })
              .then((res) => setResult({ res }))
              .catch((err) => setResult({ err: err.toString() }));
          }}
        >
          set
        </button>

        {tx ? (
          <a
            className={'btn btn-link'}
            target="_blank"
            href={explorerUrl(`/tx/${tx}`)}
          >
            view tx
          </a>
        ) : null}
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}
