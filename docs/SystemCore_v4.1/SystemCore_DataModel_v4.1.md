# SystemCore Data Model v4.1

Tento dokument konsoliduje data model informace z `SystemCoreDocumentation.md`. Zdrojové soubory `SystemCoreSchema.ts` nejsou v repozitáři dostupné, proto jsou detailní definice sloupců a typů označeny jako TBD.

⚠️ [Missing content from v4.1 inputs: SystemCoreSchema.ts, SystemCoreAppendix.tsx]

## 1. Entity Overview
- Project
- Ticket
- Reservation
- CommissionTracking
- CommissionFinance
- Investor
- User
- AuditLog
- SystemIncident
- Notification

## 2. Relationships & Constraints
- Project → Ticket (1:N)
- Ticket → Reservation (1:N)
- Reservation → CommissionTracking (1:N)
- Matching výsledky jako N:M přes spojovací entity (TBD)

**Constrainty:** PK, FK, NOT NULL, UNIQUE (detail TBD podle schema).

## 3. Indexing & Performance
- Matching: (investor_id, ticket_id)
- Incidenty: (severity, created_at)
- Rezervace: (ticket_id, state)
- Audit log: (entity_id, event_type, created_at)
@@ -37,25 +39,66 @@ Tento dokument konsoliduje data model informace z `SystemCoreDocumentation.md`.
- GDPR anonymizace podle appendices (TBD)

## 6. Migration & Versioning
- Schema versioning přes manifest (TBD)
- Migrace s rollback procedurou a auditním logem

---

## Alignment Summary

| Doporučení z Reviewer Alignment | Implementace v4.1 | Stav |
| --- | --- | --- |
| ERD + detailní entity | Uvedeno jako potřeba; schema chybí | ❌ Chybí |
| Migrace + benchmarky | Popsáno na úrovni procesu | ⚙️ Částečně |
| Auditní agregace a snapshoty | Definováno jako plán | ⚙️ Částečně |

---

## Reviewer Confirmation

Reviewed & updated according to SystemCore_Reviewer_Alignment_Report.md

Version: 4.1

Status: ⚙️ Partial

## Appendix A — Source: SystemCoreDocumentation.md (Data Model & Database Design)

# VI. DATA MODEL & DATABASE DESIGN

## 1. Entity Overview
Datový model SystemCore je postaven na canonical entitách definovaných ve `SystemCoreSchema.ts`. Klíčové entity zahrnují **Project** (investiční projekt), **Ticket** (publikovaná investiční nabídka), **Reservation** (rezervační záznam investora), **CommissionTracking** a **CommissionFinance** (procesní a finanční část provizí), **Investor** a **User** (primární subjekty), **AuditLog** (auditní stopa), **SystemIncident** (incident management) a **Notification** (notifikace a alerty). Vztahy odpovídají ERD modelu, kde Project generuje Tickets, Ticket je rezervován přes Reservation a Reservation spouští Commission workflow.

## 2. Relationships & Constraints
Vazby jsou primárně **1:N** (Project → Tickets, Ticket → Reservations, Reservation → CommissionTracking) a **N:M** přes spojovací entity pro matching nebo multi-assign logiku. Každá entita má PRIMARY KEY a referenční vazby jsou zajištěny FOREIGN KEY constrainty. Kritické vazby jsou chráněny NOT NULL a UNIQUE pravidly (např. unikátní reservation per investor a slot). Referenční integrita je vynucena pro řetězec Reservation → Ticket → Project → Investor, aby bylo možné auditovat celý lifecycle.

## 3. Indexes & Optimization
Indexy jsou navrženy pro klíčové dotazy: matching (investor_id, ticket_id), incidenty (severity, created_at), rezervace (ticket_id, state) a auditní dotazy (entity_id, event_type, created_at). Optimalizace zahrnuje složené indexy pro SLA reporting, rychlé vyhledávání podle stavu a časových oken a omezení full-scan operací na auditní tabulky.

## 4. Data Integrity & Validation
Validace dat probíhá na úrovni schema (VALIDATION_RULES), TypeScript typů a databázových constraintů. Migrace obsahují kontrolní skripty pro konzistenci a cron joby validují kritické entity (matching relevance, SLA expirace). QA validace zahrnuje kontrolu integrity vazeb, referenční konzistenci a auditní stopu pro všechny změny.

## 5. Retention & Archiving
Auditní data jsou archivována do **AuditLogArchive** s retencí 180 dnů. GDPR anonymizace se aplikuje na investory a brokery dle Appendixu, včetně auditních záznamů o anonymizačních bězích. Notifikace a incidenty mají vlastní retenční politiku s možností archivace nebo purge po uzavření incidentu.

## 6. Migration & Versioning
Verzování schématu je řízeno přes manifest (schema_version) a release plán. Migrace probíhají s backup/rollback procedurou a musí obsahovat auditní záznamy o provedení. Každý release vyžaduje ověření integrity dat po migraci a zápis výsledků do auditního reportu.

## Reviewer Notes — Professional Analysis
- Doporučuji doplnit ER diagram a tabulkový přehled entit s explicitními sloupci, typy a constrainty.
- Chybí detailní SQL migrační postupy a benchmarky výkonu (index selectivity, query plans).
- Datový model je konzistentní pro audit a GDPR, ale měl by být rozšířen o agregované auditní pohledy a historické snapshoty.
- V další verzi doporučuji zvážit time-series logging pro SLA a incidenty, případně data warehousing pro reporting.
- Je vhodné detailněji dokumentovat datové toky mezi backendem, frontendem a governance vrstvou v samostatné kapitole nebo příloze.

# VII. UI/UX DESIGN SPECIFICATION

---

## Reviewer Confirmation

Reviewed & updated according to SystemCore_Reviewer_Alignment_Report.md

Version: 4.1

Status: ⚙️ Partial
