import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Shell } from '@/components/layout/shell';

import './globals.css';

export const metadata: Metadata = {
  title: 'WIJI FIKO TEREN - Daily Project 3',
  description: 'Rekayasa Kebutuhan A - Sistem Pelacakan Alumni'
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
