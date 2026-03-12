import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileText, Home, UserRound } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/alumni', label: 'Alumni', icon: UserRound },
  { href: '/results', label: 'Results', icon: FileText }
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-excel-mint/40 to-excel-neutral">
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <div>
            <p className="text-sm font-semibold text-excel-dark">RKEB DP3</p>
            <p className="text-xs text-slate-500">Alumni Public Tracking System</p>
          </div>
          <nav className="flex items-center gap-2">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-excel-dark transition hover:bg-excel-mint"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</main>
    </div>
  );
}
