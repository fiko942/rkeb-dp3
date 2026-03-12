'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';

export function VerifyResultButton({ id, verified }: { id: string; verified: boolean }) {
  const [pending, startTransition] = useTransition();

  const verify = () => {
    startTransition(async () => {
      await fetch(`/api/tracking/results/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Verified from web dashboard.' })
      });
      window.location.reload();
    });
  };

  if (verified) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Verified
      </Button>
    );
  }

  return (
    <Button size="sm" variant="outline" disabled={pending} onClick={verify}>
      {pending ? 'Saving...' : 'Verify'}
    </Button>
  );
}
