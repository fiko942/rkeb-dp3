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
npm run build
pm2 start npm --name rkeb-dp3 -- run start --workspace web
pm2 save
```

## Nginx Reverse Proxy
```nginx
server {
  listen 80;
  server_name your-domain-or-ip;

  location / {
    proxy_pass http://127.0.0.1:3000;
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
