# ADR-001: Web Stack and Initial Data Layer

## Status
Accepted

## Decision
- Build DP3 as Next.js App Router web app.
- Use Tailwind + Radix + shadcn-style components.
- Use Prisma + SQLite for MVP persistence.
- Seed initial operational data from DP2 CSV artifacts.

## Consequences
- Fast delivery and deterministic local setup.
- Suitable for coursework MVP with traceable pipeline.
- Future migration to PostgreSQL remains open.
