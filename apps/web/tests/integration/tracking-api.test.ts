import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/tracking/run/route';
import * as trackingService from '@/server/services/tracking';

describe('POST /api/tracking/run', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 on invalid payload', async () => {
    const request = new Request('http://localhost/api/tracking/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 1000 })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('runs simulation and returns summary', async () => {
    vi.spyOn(trackingService, 'runTrackingSimulation').mockResolvedValue({
      processed: 20,
      identified: 12,
      review: 6,
      notFound: 2
    });

    const request = new Request('http://localhost/api/tracking/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 20 })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.processed).toBe(20);
    expect(body.data.identified).toBe(12);
  });
});
