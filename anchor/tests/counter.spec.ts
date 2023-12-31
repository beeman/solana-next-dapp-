import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Counter } from '../target/types/counter';

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Counter as Program<Counter>;

  // Generate a new keypair for the counter account
  const counterKeypair = new Keypair();

  it('Initialize Counter', async () => {
    await program.methods
      .initializeCounter()
      .accounts({
        counter: counterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counterKeypair])
      .rpc();

    const currentCount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    expect(currentCount.count.toNumber()).toEqual(0);
  });

  it('Increment Counter', async () => {
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    expect(currentCount.count.toNumber()).toEqual(1);
  });

  it('Increment Counter Again', async () => {
    await program.methods
      .increment()
      .accounts({ counter: counterKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.counter.fetch(
      counterKeypair.publicKey
    );

    expect(currentCount.count.toNumber()).toEqual(2);
  });
});
