import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Shell } from '@/components/layout/shell';

import './globals.css';

export const metadata: Metadata = {
  title: 'RKEB DP3 Alumni Tracker',
  description: 'Web implementation for Daily Project 3 - alumni tracking pipeline'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
