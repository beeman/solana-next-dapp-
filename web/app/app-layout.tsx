'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = { pathname: '' };
  const pages = [
    { label: 'Airdrop', path: '/airdrop' },
    { label: 'Page 1', path: '/page-1' },
    { label: 'Page 2', path: '/page-2' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            @solana-developers/preset-next
          </Link>
          <ul className="menu menu-horizontal px-1">
            {pages.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={pathname.startsWith(path) ? 'active' : ''}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-none">
          <WalletMultiButton />
        </div>
      </div>
      <div className="flex-grow">{children}</div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Generated with @solana-developers/preset-next@2.0.6</p>
        </aside>
      </footer>
    </div>
  );
}
