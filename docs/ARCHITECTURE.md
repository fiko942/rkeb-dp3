# Architecture - DP3 Alumni Tracking Web

## System Flow
User (Admin/Verifier) -> Next.js UI -> API Routes -> Service Layer -> Prisma -> SQLite -> Response.

## Boundaries
- FE to BE: UI memanggil route handler internal Next.js.
- BE to DB: seluruh access via Prisma Client.
- External Services: belum terhubung pada MVP; data berasal dari seed CSV DP2.

## Domain Models
- Alumni
- SearchQuery
- CandidateEvidence
- Disambiguation
- TrackingResult

## Invariants
- Audit trail harus ada: query, evidence, score, dan result saling terhubung.
- Scoring formula wajib mengikuti bobot DP2.
- Threshold keputusan tidak boleh diubah tanpa ADR.
