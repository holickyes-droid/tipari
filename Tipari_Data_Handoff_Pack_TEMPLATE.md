# Tipari.cz – Data Handoff Pack (TEMPLATE)

> Účel: jeden soubor, který je „source of truth“ pro backend vývoj + UI návrh. 
> Do tohoto souboru budete průběžně doplňovat **reálné hodnoty**, **copy**, **stavové přechody**, **validace** a **seed data**.

---

## 0) Verze a zdroje pravdy

- **Baseline SystemCore verze:** (vyplňte) 
- **Datum zmrazení scope:** (vyplňte)
- **Owner:** (vyplňte)
- **Repo/branch:** (vyplňte)

**Zdroje pravdy (doporučené pořadí):**
1) `systemcore_version_manifest.json` – říká, co je aktuální a „stable“ (schema / documentation / appendix / ux). 
2) `SystemCoreSchema.ts` – entity, enumy, validační konstanty.
3) `SystemCoreDocumentation.md` – governance, SLA, procesní pravidla.
4) `SystemCoreAppendix.tsx` – výpočty, mapování eventů, pseudokód.
5) `SystemCoreUXLibrary.tsx` + design systém – UI komponenty + patterny.

---

## 1) Scope platformy (co stavíme teď)

### 1.1 MVP (must-have)
- [ ] Onboarding broker / developer
- [ ] Vytvoření projektu a tiketu
- [ ] Sloty a kapacita
- [ ] Rezervace (state machine)
- [ ] E-sign flow (investor → developer)
- [ ] Provize (tracking + finance)
- [ ] Notifikace
- [ ] Audit log

### 1.2 Post-MVP (nice-to-have)
- [ ] Investor matching
- [ ] Incident dashboard
- [ ] CI/CD dashboard
- [ ] GDPR anonymizace (včetně pre-notice)

---

## 2) Datový slovník (Data Dictionary)

> Pro každou entitu vyplňte:
> - **kdo pole vyplňuje** (broker / developer / admin / system)
> - **kdy** vzniká a kdy se mění
> - **validace** (min/max, povinnost, povolené hodnoty)
> - **UI label** (cs/en)

### 2.1 Entity přehled
- Project
- Ticket
- Slot
- Reservation
- CommissionTracking
- CommissionFinance
- User
- Investor
- Company
- Document
- Notification
- AuditLog

*(tip: sem vložte auto-generovaný přehled polí z TS schématu a pak ho „vyleštěte“)*

---

## 3) Enumy, stavy a přechody

### 3.1 Reservation state machine
- Seznam stavů:
  - 
- Povolené přechody (tabulka):

| From | To | Trigger | Kdo | Side-effects |
|---|---|---|---|---|
|  |  |  |  |  |

### 3.2 Commission lifecycle
- Tracking statusy:
- Entitlement phase:
- Payment phase:

---

## 4) Validace a business rules

- Projekt:
  - 
- Tiket:
  - 
- Rezervace:
  - 
- Provize:
  - 

---

## 5) UI Copy (cs/en)

> Designér potřebuje: názvy stavů, CTA texty, error messages, empty states, tooltipy, notifikace.

### 5.1 Globální
- Tlačítka:
- Validace formulářů:
- Chybové hlášky:

### 5.2 Notifikace

| Event | Recipient | Title (cs) | Message (cs) | Title (en) | Message (en) |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

---

## 6) Seed data (pro vývoj a UI mocky)

> Cíl: aby vývojář i designér měli „živá“ data pro všechny stavy.

### 6.1 Minimální seed dataset (doporučení)
- 3× Broker (různé tipar level)
- 2× Developer
- 6× Investor (různé typy)
- 6× Project (draft/published/paused/closed)
- 12× Ticket (různé investment_form, security_required)
- Sloty automaticky
- 12× Reservation (pokrytí všech stavů)
- 6× CommissionTracking + Finance (různé fáze)

### 6.2 Seed data – JSON bloky

```json
{
  "users": [],
  "investors": [],
  "projects": [],
  "tickets": [],
  "slots": [],
  "reservations": [],
  "commissionTracking": [],
  "commissionFinance": [],
  "documents": [],
  "notifications": [],
  "auditLog": []
}
```

---

## 7) API kontrakty (minimální)

> Pokud zatím neděláte OpenAPI, stačí Markdown tabulky.

| Endpoint | Method | Input | Output | Auth |
|---|---|---|---|---|
| /projects | GET |  |  |  |
| /projects | POST |  |  |  |
| /tickets | POST |  |  |  |
| /reservations | POST |  |  |  |

---

## 8) Traceability matrix (screen → data → API)

| Screen | Role | Entity | Pole | Endpoint |
|---|---|---|---|---|
|  |  |  |  |  |

---

## 9) Change log (když doplňujete data)

| Datum | Změna | Kdo | Dopad |
|---|---|---|---|
|  |  |  |  |

