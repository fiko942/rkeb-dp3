# Daily Project 3 - Sistem Pelacakan Alumni

Implementasi web dari desain Daily Project 2 menggunakan Next.js, Tailwind, Radix UI, shadcn/ui style components, Prisma, dan SQLite.

## Identitas Mahasiswa
- Nama: **WIJI FIKO TEREN**
- NIM: **202310370311437**
- Kelas: **REKAYASA KEBUTUHAN A**

## Submission Links
- Source Code (GitHub): `https://github.com/fiko942/rkeb-dp3.git`
- Published Web: `TODO_ADD_VPS_URL`

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Radix UI primitives + shadcn-style components
- Prisma ORM + SQLite
- Vitest (unit + integration)
- Playwright (E2E smoke)

## Professional Workspace Structure
```text
apps/web                 # Next.js application
packages/config          # shared eslint/tsconfig config
docs                     # architecture, ADR, deployment runbook
scripts                  # task automation and utility scripts
```

## Core Features
- Dashboard ringkasan tracking.
- Alumni management: list, filter, detail profile.
- Query log viewer.
- Candidate evidence viewer.
- Disambiguation score viewer.
- Tracking result queue + manual verification action.
- Batch tracking simulation endpoint.

## API Endpoints
- `GET /api/alumni`
- `GET /api/alumni/:id`
- `POST /api/tracking/run`
- `GET /api/tracking/results`
- `GET /api/tracking/results/:alumniId`
- `PATCH /api/tracking/results/:id/verify`

## Quick Start
```bash
npm install
cp apps/web/.env.example apps/web/.env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Testing
```bash
npm run test
npm run test:e2e
npm run perf:api --workspace web
```

## Quality Test Evidence (README Required)
| Aspek | Skenario Uji | Metode/Tools | Hasil | Status |
|---|---|---|---|---|
| Fungsional | Batch run tracking mengubah status alumni dan hasil tersimpan | Integration test + manual API check | Endpoint `POST /api/tracking/run` memproses data sesuai limit | PASS |
| Fungsional | Manual verification pada queue result | UI action + API patch | `isManuallyVerified` berubah `true` | PASS |
| Akurasi | Formula scoring sesuai bobot DP2 | Unit test `scoring.test.ts` | Nilai sample `0.86` tervalidasi | PASS |
| Akurasi | Threshold klasifikasi score (`>=0.8`, `0.6-0.79`, `<0.6`) | Unit test | Mapping label konsisten | PASS |
| Kinerja | Latensi endpoint hasil tracking (`GET /api/tracking/results`) | `autocannon` 10 detik | Isi metrik dengan hasil run lokal/VPS | TODO |
| Kinerja | Stabilitas render halaman dashboard | E2E smoke test | Halaman utama dan navigasi termuat | PASS |

## Theme Direction
Palet warna minimalis terinspirasi Microsoft Excel:
- `excel-dark: #0f3d2e`
- `excel-primary: #107c41`
- `excel-soft: #3ba776`
- `excel-mint: #d9f2e4`
- `excel-neutral: #f5f7f6`

## Deployment
Panduan deploy VPS ada di [`docs/DEPLOYMENT_VPS.md`](./docs/DEPLOYMENT_VPS.md).
