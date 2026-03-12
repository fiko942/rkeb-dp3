import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-excel-soft bg-excel-mint px-2 py-0.5 text-xs font-medium text-excel-dark',
        className
      )}
    >
      {children}
    </span>
  );
}
