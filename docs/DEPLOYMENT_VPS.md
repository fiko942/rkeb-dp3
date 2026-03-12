# Deployment Guide - Self-host VPS

## Prerequisites
- Ubuntu/Debian VPS
- Node.js LTS
- Nginx
- PM2
- Domain/subdomain optional

## Build and Run
```bash
git clone https://github.com/fiko942/rkeb-dp3.git
cd rkeb-dp3
npm install
cp apps/web/.env.example apps/web/.env
npm run db:push
npm run db:seed
npm run build:production
cd release/rkeb-dp3-production
pm2 start main.js --name rkeb-dp3
pm2 save
```

Default app port: `34546`.

## Nginx Reverse Proxy
```nginx
server {
  listen 80;
  server_name rkeb-dp3.streampeg.com;

  location / {
    proxy_pass http://127.0.0.1:34546;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## Health Check
- Open `/` dashboard
- Open `/results`
- Trigger `Run Tracking Batch`
