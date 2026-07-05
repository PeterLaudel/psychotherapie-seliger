# Phase 2 — LLM Report Generation

## Architecture Overview

```
Session finalized by therapist
        ↓
[Background] Ollama/mistral → pseudonymized_notes stored in DB
        ↓
Therapist clicks "Generate Report"
        ↓
Verification modal: review & optionally edit pseudonymized text
        ↓
[Confirm] → Claude API → report draft (placeholders only)
        ↓
Therapist reviews, edits, approves
        ↓
Export: placeholders → real names (final document only)
```

---

## Step 1 — Pseudonymization: DB Migration

New fields on the existing `sessions` table:

| Field | Type | Description |
|---|---|---|
| `pseudonymized_notes` | text \| null | Pseudonymized `clinicalNotes` text |
| `pseudonymized_next_plan` | text \| null | Pseudonymized `nextSessionPlan` text |
| `pseudonymization_status` | text \| null | `"pending"` \| `"done"` \| `"failed"` |

Deliverables: migration file, Kysely DB types updated.

---

## Step 2 — Pseudonymization: Service (`src/server/pseudonymizer.ts`)

Runs entirely within the local cluster. Real patient data never leaves the system.

### Timing — async on session finalization

```
Therapist clicks "Finalize session"
        ↓
session.status → "final"             (immediate, synchronous)
pseudonymization_status → "pending"  (immediate, synchronous)
        ↓
jobQueue.enqueue({ type: "pseudonymize_session", sessionId })
        ↓  [background, non-blocking]
Ollama pseudonymizes clinicalNotes + nextSessionPlan
        ↓
pseudonymized_notes + pseudonymized_next_plan stored
pseudonymization_status → "done"
```

When the therapist later clicks "Generate Report", the pseudonymized text is already ready — only the Claude API call (~3–5s) remains.

**Crash safety:** On server startup, re-enqueue all sessions with `pseudonymization_status: "pending"`:

```typescript
// server startup
const pending = await db.selectFrom("sessions")
  .where("pseudonymization_status", "=", "pending")
  .selectAll().execute();
pending.forEach(s =>
  jobQueue.enqueue({ type: "pseudonymize_session", sessionId: s.id })
);
```

### Job Queue Abstraction (`src/server/queue/`)

The queue is hidden behind an interface so the implementation can be swapped later (e.g. BullMQ, RabbitMQ) without changing any other code.

Important: systems like RabbitMQ cannot transfer functions — only serializable JSON messages. The interface is therefore based on **job types**, not functions.

```
src/server/queue/
  types.ts           ← job types and JobQueue interface
  jobProcessor.ts    ← handles each job type
  inProcess.ts       ← current implementation (in-process, no external service)
  index.ts           ← exports the active queue instance
```

**`types.ts`:**
```typescript
export type Job =
  | { type: "pseudonymize_session"; sessionId: number }
  | { type: "generate_report"; reportId: number }  // Step 5

export interface JobQueue {
  enqueue(job: Job): void;
}
```

**`jobProcessor.ts`:**
```typescript
export async function processJob(job: Job) {
  switch (job.type) {
    case "pseudonymize_session":
      return pseudonymizeSession(job.sessionId);
    case "generate_report":
      return generateReport(job.reportId);
  }
}
```

**`inProcess.ts`** — runs in the same Node.js process, no external service needed:
```typescript
export class InProcessQueue implements JobQueue {
  private queue: Job[] = [];
  private running = false;

  enqueue(job: Job) {
    this.queue.push(job);
    if (!this.running) this.drain();
  }

  private async drain() {
    this.running = true;
    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      await processJob(job).catch(console.error);
    }
    this.running = false;
  }
}
```

**`index.ts`** — the only file that needs to change when swapping implementations:
```typescript
import { InProcessQueue } from "./inProcess";
export const jobQueue: JobQueue = new InProcessQueue();
```

Usage everywhere in the codebase:
```typescript
import { jobQueue } from "@/server/queue";
jobQueue.enqueue({ type: "pseudonymize_session", sessionId });
```

### Two-Pass Approach

**Pass 1 — rule-based** (structured fields, no LLM):
- `patient.name`, `patient.surname` → `[Patient]`
- `patient.birthdate` → `[Geburtsdatum]`
- Therapist name → `[Therapeut]`
- Known locations (city, street) → `[Ort]`

**Pass 2 — LLM (Ollama/mistral)** (implicit identifiers in free text):
- Third-party persons: *"ihr Lebensgefährte Jens"* → *"ihr Lebensgefährte [Person]"*
- Implicit locations: *"Klinik in München"* → *"Klinik in [Ort]"*
- Identifying date references → `[Datum]`
- Identifying job titles → `[Beruf]`

Deliberately **not** used:
- **spaCy NER** — too many false positives on psychotherapy terminology (`Stimmungstagebuch`, `Verhaltensaktivierung` were classified as persons)
- **phi3:mini** — hallucinates text, corrupts clinical content
- **RabbitMQ** — overkill for a single-practice setup

### Placeholder Schema

| Original | Placeholder |
|---|---|
| Patient name | `[Patient]` |
| Therapist name | `[Therapeut]` |
| Referring doctor | `[Arzt]` |
| Date of birth | `[Geburtsdatum]` |
| Third-party persons | `[Person]` |
| Locations / streets | `[Ort]` |
| Identifying dates | `[Datum]` |
| Identifying job titles | `[Beruf]` |

### Prompt — Pseudonymization (`src/server/prompts/pseudonymization.ts`)

System prompt and user message are separated — enables prompt caching if later switched to Claude API. Prompts remain in German as they instruct a German-language task.

**System Prompt:**
```
Du bist ein Datenschutz-Assistent für eine psychotherapeutische Praxis (DSGVO).

Du erhältst einen Text als JSON mit folgendem Feld:
- text: der zu pseudonymisierende Freitext aus einer Therapiesitzung

Deine Aufgabe: Ersetze alle personenidentifizierenden Informationen durch Platzhalter.
Bereits ersetzte Platzhalter (z.B. [Patient], [Therapeut]) bleiben unverändert.

Ersetze ALLE der folgenden Kategorien:
- Vornamen und Nachnamen von Personen → [Person]
  Dazu zählen ausdrücklich: Partner, Lebensgefährten, Ehepartner, Geschwister,
  Eltern, Kinder, Freunde, Kollegen, Vorgesetzte – auch wenn sie nur durch ihre
  Beziehung erwähnt werden (z.B. "ihr Lebensgefährte Jens" → "ihr Lebensgefährte [Person]")
- Ortsnamen, Stadtteile, Straßen und Straßennamen (mit oder ohne Hausnummer), Gebäude → [Ort]
- Datumsangaben mit Monatsname oder Tagesangabe → [Datum]
- Berufsbezeichnungen die identifizierend sein könnten → [Beruf]

Nicht anonymisieren:
- Medizinische Diagnosen, Symptombeschreibungen, Interventionen, Testergebnisse (PHQ-9 etc.)

Antworte NUR mit dem bereinigten Text, keine Erklärungen, keine Kommentare.
```

**User Message:**
```json
{ "text": "Patientin berichtet von Lebensgefährten Jens..." }
```

---

## Step 3 — Verification Modal (UI)

Before any data is sent to Claude, the therapist reviews the pseudonymized text in a modal.

```
Therapist clicks "Generate Report"
        ↓
Modal opens:
  ┌─────────────────────────────────────────────────┐
  │ Datenschutz-Prüfung                             │
  │                                                 │
  │ Bitte prüfen Sie ob alle personenbezogenen      │
  │ Daten entfernt wurden, bevor die Daten zur      │
  │ Berichtsgenerierung übertragen werden.          │
  │                                                 │
  │ [editable pseudonymized text]                   │
  │                                                 │
  │ [Abbrechen]  [Bestätigen & Bericht erstellen]   │
  └─────────────────────────────────────────────────┘
```

- Text is editable — therapist can manually correct any missed identifiers
- Edited text is used for the Claude call but **not** written back to the DB
- Button shows status indicator if pseudonymization is still running (`⏳`) or failed (`⚠️`)

---

## Step 4 — `reports` DB Table & Model

Two migrations:

**`reports` table:**

| Field | Type | Notes |
|---|---|---|
| `id` | integer | PK |
| `patientId` | integer | FK patients |
| `therapeutId` | integer | nullable, FK therapeuts |
| `reportType` | text | `"Verlaufsbericht"` \| `"Konsiliarbericht"` |
| `dateFrom` | text | |
| `dateTo` | text | |
| `draftContent` | text | placeholders only, never real names |
| `approvedContent` | text | nullable, set on approval, still placeholders |
| `status` | text | `"pending"` \| `"draft"` \| `"approved"` |
| `approvedAt` | text | nullable |
| `createdAt` | text | |

**`report_sessions` join table** (replaces a JSON `sessionIds` column — keeps sessions queryable):

| Field | Type | Notes |
|---|---|---|
| `reportId` | integer | FK reports, PK |
| `sessionId` | integer | FK sessions, PK |

This enables queries in both directions:

```sql
-- All sessions in a report
SELECT s.* FROM sessions s
JOIN report_sessions rs ON rs.session_id = s.id
WHERE rs.report_id = 42;

-- All reports that include a specific session
SELECT r.* FROM reports r
JOIN report_sessions rs ON rs.report_id = r.id
WHERE rs.session_id = 7;
```

Deliverables: two migration files, `Report` model, `reportsRepository` following existing pattern.

---

## Step 5 — Report Generation: Service (`src/server/reportGenerator.ts`)

Receives only pseudonymized data (from the verified modal text) and calls the Claude API.

### Prompt Architecture (`src/server/prompts/reportGeneration.ts`)

System prompt explains the JSON schema once, user message delivers only the data. This enables **Anthropic Prompt Caching** — the system prompt is only computed on the first call, then cached. Prompts remain in German as they instruct a German-language task.

**System Prompt:**
```
Du bist ein approbierter Psychotherapeut und Gutachter.

Du erhältst Therapiedaten als JSON mit folgender Struktur:
- diagnosis: ICD-10 Diagnose mit Klartext
- therapyForm: z.B. "Einzeltherapie"
- therapyStart: Datum des Therapiebeginns (ISO)
- approvedSessions: Anzahl bewilligter Sitzungen
- goals[]: Behandlungsziele mit description, status, priority
- sessions[]: Sitzungen mit:
    date: Datum (ISO)
    sessionNumber: laufende Nummer
    type: Sitzungstyp (z.B. "Erstgespräch", "Einzelgespräch")
    durationMinutes: Dauer in Minuten
    moodStart / moodEnd: Stimmung 1–10 zu Beginn und Ende
    riskLevel: Risikoniveau (none / low / medium / high / null)
    interventions[]: eingesetzte therapeutische Methoden
    notes: pseudonymisierte klinische Notizen
    nextPlan: pseudonymisierter Plan für nächste Sitzung
    homeworkGiven[]: erteilte Hausaufgaben
    homeworkReview[]: Review der Hausaufgaben aus Vorsitzung mit status (done/partial/open)

Alle Personennamen und Orte sind bereits pseudonymisiert ([Patient], [Person], [Ort] etc.).
Übernimm diese Platzhalter unverändert in den Bericht.

Verfasse einen formellen Verlaufsbericht für die gesetzliche Krankenkasse mit exakt diesen fünf Abschnitten:

1. Aktueller Behandlungsstatus
Diagnose, Therapiephase, Anzahl absolvierter Sitzungen im Berichtszeitraum. (2–3 Sätze)

2. Behandlungsverlauf
Chronologischer Verlauf. PHQ-9-Verlauf als Kurve benennen wenn vorhanden.
Hausaufgaben mit Compliance in der Folgesitzung verknüpfen. (4–6 Sätze)

3. Therapeutische Interventionen und deren Wirksamkeit
Eingesetzte Methoden mit konkreten Wirksamkeitsbelegen aus den Sitzungen. (3–5 Sätze)

4. Zielerreichung
Jedes Behandlungsziel einzeln bewerten. PHQ-9-Verlauf als objektiven Beleg nutzen.
Keine wörtlichen Zitate aus den Rohdaten. (3–5 Sätze)

5. Ausblick und weiteres Vorgehen
Notwendigkeit der Weiterbehandlung begründen. Konkrete nächste Schritte und Prognose. (3–4 Sätze)

Stilregeln:
- Durchgehend Behördendeutsch, dritte Person ("die Patientin")
- Kein Umgangssprachliches
- Keine klinischen Details erfinden die nicht im JSON stehen
- Fehlende PHQ-9-Werte als "nicht erhoben" kennzeichnen, nicht schätzen
- Prognosen nur auf Basis dokumentierter Beobachtungen formulieren
```

**User Message:**
```json
{
  "diagnosis": "F33.1 – Rezidivierende depressive Störung",
  "therapyForm": "Einzeltherapie",
  "therapyStart": "2025-01-15",
  "approvedSessions": 25,
  "goals": [
    { "description": "Depressive Symptomatik reduzieren (PHQ-9 < 5)", "status": "active", "priority": 1 }
  ],
  "sessions": [
    {
      "date": "2025-02-03",
      "sessionNumber": 1,
      "type": "Erstgespräch",
      "durationMinutes": 100,
      "moodStart": 3,
      "moodEnd": 4,
      "riskLevel": "none",
      "interventions": ["Psychoedukation", "Aktives Zuhören"],
      "notes": "Patientin berichtet von anhaltend gedrückter Stimmung...",
      "nextPlan": "Stimmungstagebuch einführen...",
      "homeworkGiven": ["Stimmungstagebuch täglich ausfüllen"],
      "homeworkReview": []
    }
  ]
}
```

The response is stored as `draftContent` — placeholders intact, no real names ever stored.

**Server Action** `generateReport(patientId, reportType, sessionIds)`:
1. Creates a `reports` row with `status: "pending"`
2. Inserts a `report_sessions` row per session
3. Writes an outbox event in the same transaction
4. Returns `reportId` immediately — UI polls status from there

The worker picks up the job, calls Claude, and updates `draftContent` + `status: "draft"` when done.

---

## Step 6 — Report UI

New "Berichte" tab on the patient detail page:

1. **"Bericht generieren"** button → opens verification modal (Step 3)
2. After confirmation: loading indicator *"Befund wird erstellt..."*
3. Draft rendered with prominent banner:
   > KI-Entwurf — Prüfung und Freigabe durch Therapeut:in erforderlich
4. Draft is editable (rich text editor)
5. **"Freigeben"** → saves `approvedContent`, status → `approved`
6. **"Verwerfen"** → deletes draft

Approved reports listed in the tab with date, type, status chip, and download button.

---

## Step 7 — Export (Placeholder Substitution)

Export only — no LLM involved.

`src/server/reportExporter.ts`:
1. Takes `approvedContent` (still contains placeholders)
2. Fetches real patient and therapist data from DB
3. Substitutes all placeholders with real values
4. Exports as DOCX or PDF

The final exported document is the **only artifact that ever contains real names**. Nothing with real names is stored in the DB from the LLM pipeline.

---

## Local Development Setup

### Docker Compose

Ollama is already integrated in `docker-compose.yml`:

```yaml
ollama:
  image: ollama/ollama:latest
  ports:
    - "11434:11434"
  volumes:
    - ollama_data:/root/.ollama
  healthcheck:
    test: ["CMD-SHELL", "curl -sf http://localhost:11434/api/tags || exit 1"]
    interval: 10s
    timeout: 5s
    retries: 10
    start_period: 30s
```

### First-time model pull

```bash
# Production model
docker compose exec ollama ollama pull mistral

# Lightweight stand-in for local dev / CI (quality irrelevant for pipeline tests)
docker compose exec ollama ollama pull tinyllama
```

### Environment variables

| Variable | Development | Docker stack |
|---|---|---|
| `OLLAMA_URL` | `http://localhost:11434` | `http://ollama:11434` |
| `ANTHROPIC_API_KEY` | your key | secret / env inject |
| `LLM_MODEL` | `claude-sonnet-4-6` | swappable via env |

### Testing strategy

- `tinyllama` in e2e / CI — verifies pipeline runs end-to-end, not pseudonymization quality
- `mistral` locally — test actual pseudonymization quality
- Mock Claude API calls at the `reportGenerator.ts` boundary in tests

---

## Open Questions

1. **Streaming vs. polling** — Claude API call (~3–5s) during report generation: simple polling or streaming directly in the UI?
2. **Token limit strategy** — patients with 40+ sessions may exceed Claude's context window. Options: summarize older sessions, truncate, or warn therapist to narrow the date range.
3. **Ollama unavailable fallback** — block report generation or fall back to rule-based pass only?

---

## Out of Scope for Phase 2

- Questionnaire score tracking (BDI, PHQ-9, GAD-7) → Phase 3
- Progress dashboard / charts → Phase 3
