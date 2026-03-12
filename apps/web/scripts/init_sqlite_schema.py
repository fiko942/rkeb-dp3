#!/usr/bin/env python3
import sqlite3
import os
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_URL = "file:./prisma/dev.db"

SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Alumni (
  id TEXT PRIMARY KEY,
  nim TEXT NOT NULL,
  namaLengkap TEXT NOT NULL,
  namaVariasi TEXT NOT NULL,
  jenisKelamin TEXT NOT NULL,
  tanggalLahir DATETIME,
  kotaAsal TEXT NOT NULL,
  fakultas TEXT NOT NULL,
  prodi TEXT NOT NULL,
  angkatan INTEGER NOT NULL,
  tahunLulus INTEGER NOT NULL,
  ipk REAL NOT NULL,
  predikat TEXT NOT NULL,
  email TEXT NOT NULL,
  noHp TEXT NOT NULL,
  kataKunciAfiliasi TEXT NOT NULL,
  kataKunciKonteks TEXT NOT NULL,
  targetRole TEXT NOT NULL,
  instansiTerakhir TEXT NOT NULL,
  lokasiTerakhir TEXT NOT NULL,
  statusPelacakan TEXT NOT NULL,
  confidenceScore REAL NOT NULL,
  sumberTerakhir TEXT NOT NULL,
  tanggalUpdate DATETIME
);
CREATE INDEX IF NOT EXISTS Alumni_nim_idx ON Alumni(nim);
CREATE INDEX IF NOT EXISTS Alumni_statusPelacakan_idx ON Alumni(statusPelacakan);
CREATE INDEX IF NOT EXISTS Alumni_prodi_idx ON Alumni(prodi);

CREATE TABLE IF NOT EXISTS SearchQuery (
  id TEXT PRIMARY KEY,
  alumniId TEXT NOT NULL,
  nim TEXT NOT NULL,
  prodi TEXT NOT NULL,
  angkatan INTEGER NOT NULL,
  platformTarget TEXT NOT NULL,
  queryText TEXT NOT NULL,
  queryType TEXT NOT NULL,
  createdAt DATETIME NOT NULL,
  schedulerBatchId TEXT NOT NULL,
  FOREIGN KEY(alumniId) REFERENCES Alumni(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS SearchQuery_alumniId_idx ON SearchQuery(alumniId);
CREATE INDEX IF NOT EXISTS SearchQuery_createdAt_idx ON SearchQuery(createdAt);

CREATE TABLE IF NOT EXISTS CandidateEvidence (
  id TEXT PRIMARY KEY,
  alumniId TEXT NOT NULL,
  candidateId TEXT NOT NULL UNIQUE,
  sourceName TEXT NOT NULL,
  sourceUrl TEXT NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT NOT NULL,
  signalName TEXT NOT NULL,
  signalAffiliation TEXT NOT NULL,
  signalRole TEXT NOT NULL,
  signalLocation TEXT NOT NULL,
  signalTopic TEXT NOT NULL,
  signalActivityYear INTEGER NOT NULL,
  capturedAt DATETIME NOT NULL,
  FOREIGN KEY(alumniId) REFERENCES Alumni(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS CandidateEvidence_alumniId_idx ON CandidateEvidence(alumniId);
CREATE INDEX IF NOT EXISTS CandidateEvidence_candidateId_idx ON CandidateEvidence(candidateId);

CREATE TABLE IF NOT EXISTS Disambiguation (
  id TEXT PRIMARY KEY,
  alumniId TEXT NOT NULL,
  candidateId TEXT NOT NULL UNIQUE,
  nameScore REAL NOT NULL,
  affiliationScore REAL NOT NULL,
  timelineScore REAL NOT NULL,
  fieldScore REAL NOT NULL,
  crossValidationBonus REAL NOT NULL,
  finalScore REAL NOT NULL,
  confidenceLevel TEXT NOT NULL,
  decisionLabel TEXT NOT NULL,
  reviewFlag BOOLEAN NOT NULL,
  evaluatedAt DATETIME NOT NULL,
  FOREIGN KEY(alumniId) REFERENCES Alumni(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(candidateId) REFERENCES CandidateEvidence(candidateId) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS Disambiguation_alumniId_idx ON Disambiguation(alumniId);
CREATE INDEX IF NOT EXISTS Disambiguation_finalScore_idx ON Disambiguation(finalScore);

CREATE TABLE IF NOT EXISTS TrackingResult (
  id TEXT PRIMARY KEY,
  alumniId TEXT NOT NULL,
  nim TEXT NOT NULL,
  namaLengkap TEXT NOT NULL,
  prodi TEXT NOT NULL,
  angkatan INTEGER NOT NULL,
  trackingStatus TEXT NOT NULL,
  finalConfidence REAL NOT NULL,
  matchedCandidateId TEXT,
  topSource TEXT NOT NULL,
  currentRoleSummary TEXT NOT NULL,
  currentOrgSummary TEXT NOT NULL,
  currentLocationSummary TEXT NOT NULL,
  evidenceCount INTEGER NOT NULL,
  lastVerifiedAt DATETIME,
  notes TEXT NOT NULL,
  isManuallyVerified BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY(alumniId) REFERENCES Alumni(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS TrackingResult_alumniId_idx ON TrackingResult(alumniId);
CREATE INDEX IF NOT EXISTS TrackingResult_trackingStatus_idx ON TrackingResult(trackingStatus);
"""


def load_env_database_url() -> Optional[str]:
    env_file = ROOT / ".env"
    if not env_file.exists():
        return None
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        if key.strip() == "DATABASE_URL":
            return value.strip().strip('"').strip("'")
    return None


def main() -> int:
    url = os.environ.get("DATABASE_URL") or load_env_database_url() or DEFAULT_URL
    if not url.startswith("file:"):
        raise SystemExit("Only sqlite file: DATABASE_URL is supported by init_sqlite_schema.py")
    raw_path = url.removeprefix("file:")
    db_path = Path(raw_path)
    if not db_path.is_absolute():
        db_path = (ROOT / db_path).resolve()

    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.executescript(SCHEMA_SQL)
    conn.commit()
    conn.close()
    print(db_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
