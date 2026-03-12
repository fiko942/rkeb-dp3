'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

export function RunTrackingButton() {
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  const run = () => {
    startTransition(async () => {
      const response = await fetch('/api/tracking/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 200 })
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage('Batch failed. Check payload and database state.');
        return;
      }

      setMessage(
        `Processed ${payload.data.processed}, identified ${payload.data.identified}, review ${payload.data.review}`
      );
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={run} disabled={pending}>
        {pending ? 'Running...' : 'Run Tracking Batch'}
      </Button>
      {message && <p className="text-xs text-slate-600">{message}</p>}
    </div>
  );
}
