import autocannon from 'autocannon';

async function run() {
  const instance = autocannon({
    url: process.env.PERF_URL ?? 'http://localhost:3000/api/tracking/results?take=100',
    connections: 10,
    duration: 10
  });

  autocannon.track(instance, { renderProgressBar: true });

  await new Promise<void>((resolve, reject) => {
    instance.on('done', () => resolve());
    instance.on('error', (error) => reject(error));
  });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
