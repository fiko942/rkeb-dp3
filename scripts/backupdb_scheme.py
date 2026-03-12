#!/usr/bin/env python3
import csv
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
BACKUP_DIR = ROOT / "backups" / "schema"


def infer_type(value: str) -> str:
    if value is None:
        return "string"
    v = value.strip()
    if v == "":
        return "string"
    try:
        int(v)
        return "integer"
    except ValueError:
        pass
    try:
        float(v)
        return "number"
    except ValueError:
        pass
    if len(v) == 10 and v[4] == "-" and v[7] == "-":
        return "date"
    return "string"


def read_schema(csv_path: Path) -> dict:
    with csv_path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        first_row = next(reader, None)
        columns = []
        for name in fieldnames:
            sample = ""
            if first_row is not None:
                sample = first_row.get(name, "")
            columns.append(
                {
                    "name": name,
                    "inferred_type": infer_type(sample),
                }
            )
        return {
            "table_name": csv_path.stem,
            "file": str(csv_path.relative_to(ROOT)),
            "columns": columns,
        }


def main() -> int:
    csv_files = sorted(DATA_DIR.glob("*.csv"))
    now = datetime.now(timezone.utc)
    stamp = now.strftime("%Y%m%d_%H%M%S")
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    out_file = BACKUP_DIR / f"schema_backup_{stamp}.json"

    payload = {
        "generated_at_utc": now.isoformat(),
        "source": "csv-schema-snapshot",
        "tables": [read_schema(p) for p in csv_files],
    }

    with out_file.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")

    latest_file = BACKUP_DIR / "latest_schema_backup.txt"
    latest_file.write_text(str(out_file.relative_to(ROOT)) + "\n", encoding="utf-8")

    print(str(out_file.relative_to(ROOT)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
