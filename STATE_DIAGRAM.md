# STATE DIAGRAM – TIPARI.CZ PLATFORM
**Closed B2B Investment Referral & Orchestration Platform**

**Document Type:** Entity State Model & Transition Rules
**Date:** 2025-01-01
**Status:** Non-Negotiable Business Logic

---

## DOCUMENT PURPOSE

This document defines ALL valid states for core entities and their allowed transitions.
- No invented states
- No simplified workflows
- Reflects real operational constraints
- Basis for all UI and backend logic

---

## CORE ENTITIES

1. **Project** – Investment opportunity container
2. **Ticket** – Investable unit within project
3. **Reservation** – SLA-based claim by Tipař on ticket
4. **Commission** – Financial entitlement from successful reservation

---

## ENTITY 1: PROJECT

### Purpose
Container for investment opportunity with multiple tickets.

### States

| State | Description | User-Facing Label |
|-------|-------------|-------------------|
| `PENDING_APPROVAL` | Submitted by Tipař, awaiting admin review | Čeká na schválení |
| `APPROVED` | Approved by admin, ready to go live | Schváleno |
| `OPEN` | Active, accepting reservations | Aktivní |
| `PAUSED` | Temporarily stopped by admin or partner | Pozastaveno |
| `LAST_SLOTS` | Near capacity (< 20% tickets available) | Poslední sloty |
| `FULLY_RESERVED` | All tickets occupied or reserved | Plně rezervováno |
| `FINISHED` | Investment cycle completed | Dokončeno |
| `REJECTED` | Admin rejected submission | Zamítnuto |
| `WITHDRAWN` | Partner or Tipař withdrew project | Staženo |

### State Transitions

```
FLOW 1: SUBMISSION → APPROVAL
─────────────────────────────────
[NONE] → PENDING_APPROVAL
  └─→ APPROVED (admin approves)
  └─→ REJECTED (admin rejects)
  └─→ WITHDRAWN (Tipař cancels)

PENDING_APPROVAL → APPROVED
  └─→ OPEN (admin publishes)

PENDING_APPROVAL → REJECTED
  └─→ [TERMINAL STATE]

PENDING_APPROVAL → WITHDRAWN
  └─→ [TERMINAL STATE]

FLOW 2: ACTIVE LIFECYCLE
─────────────────────────────────
APPROVED → OPEN
  └─→ LAST_SLOTS (capacity < 20%)
  └─→ PAUSED (admin/partner pause)
  └─→ FULLY_RESERVED (all tickets taken)
  └─→ WITHDRAWN (partner withdraws)

OPEN → LAST_SLOTS
  └─→ FULLY_RESERVED (capacity = 0)
  └─→ PAUSED (admin/partner pause)

OPEN → PAUSED
  └─→ OPEN (admin/partner resumes)
  └─→ WITHDRAWN (permanent stop)

LAST_SLOTS → FULLY_RESERVED
  └─→ FINISHED (all investments completed)

FULLY_RESERVED → FINISHED
  └─→ [TERMINAL STATE]

PAUSED → OPEN
  └─→ (resume normal flow)

PAUSED → WITHDRAWN
  └─→ [TERMINAL STATE]
```

### Terminal States
- `REJECTED` – Cannot be revived
- `WITHDRAWN` – Cannot be revived
- `FINISHED` – Completed lifecycle

### Forbidden Transitions
❌ `REJECTED` → any state (cannot revive)
❌ `WITHDRAWN` → any state (cannot revive)
❌ `FINISHED` → any state (cannot reopen)
❌ `FULLY_RESERVED` → `OPEN` (only → FINISHED)
❌ `LAST_SLOTS` → `OPEN` (only forward)

### State Dependencies
- **Project can accept reservations ONLY if:**
  - State = `OPEN` OR `LAST_SLOTS`
  - At least one ticket has available capacity
- **Project becomes `LAST_SLOTS` automatically when:**
  - Total available capacity < 20% of total tickets
- **Project becomes `FULLY_RESERVED` automatically when:**
  - All tickets are fully occupied OR reserved

---

## ENTITY 2: TICKET

### Purpose
Investable unit with specific terms (amount, yield, duration).

### States

| State | Description | User-Facing Label |
|-------|-------------|-------------------|
| `DRAFT` | Created but not published | Koncept |
| `AVAILABLE` | Open for reservations | Dostupný |
| `PARTIALLY_FILLED` | Some capacity occupied/reserved | Částečně obsazeno |
| `LAST_CAPACITY` | < 20% capacity remaining | Poslední kapacita |
| `FULLY_FILLED` | All slots occupied or reserved | Plně obsazeno |
| `CLOSED` | Manually closed by admin | Uzavřeno |

### State Transitions

```
FLOW 1: CREATION → AVAILABILITY
─────────────────────────────────
[NONE] → DRAFT
  └─→ AVAILABLE (admin publishes)

DRAFT → AVAILABLE
  └─→ PARTIALLY_FILLED (first reservation)
  └─→ CLOSED (admin closes)

FLOW 2: RESERVATION LIFECYCLE
─────────────────────────────────
AVAILABLE → PARTIALLY_FILLED
  └─→ LAST_CAPACITY (occupancy > 80%)
  └─→ FULLY_FILLED (occupancy = 100%)
  └─→ CLOSED (admin closes)

PARTIALLY_FILLED → LAST_CAPACITY
  └─→ FULLY_FILLED (occupancy = 100%)
  └─→ AVAILABLE (reservation released)

LAST_CAPACITY → FULLY_FILLED
  └─→ PARTIALLY_FILLED (reservation released)

FULLY_FILLED → PARTIALLY_FILLED
  └─→ (reservation expired/cancelled)

FULLY_FILLED → [STAYS FULL]
  └─→ (all reservations completed)

Any State → CLOSED
  └─→ [TERMINAL STATE]
```

### Capacity Calculation

```
Current Occupancy = 
  Completed Reservations 
  + Active Reservations (locked slots)
  + Pending Reservations (locked slots)

Available Capacity = 
  Total Capacity - Current Occupancy
```

### Terminal States
- `CLOSED` – Manually closed, no new reservations
- `FULLY_FILLED` (if all reservations completed) – Natural end

### Forbidden Transitions
❌ `CLOSED` → any state (cannot reopen via UI)
❌ `DRAFT` → `PARTIALLY_FILLED` (must go through AVAILABLE)

### State Dependencies
- **Ticket can accept reservations ONLY if:**
  - State = `AVAILABLE`, `PARTIALLY_FILLED`, OR `LAST_CAPACITY`
  - Available capacity > 0
  - Parent project is `OPEN` or `LAST_SLOTS`
- **Ticket becomes `LAST_CAPACITY` automatically when:**
  - Available capacity < 20% of total capacity
- **Ticket becomes `FULLY_FILLED` automatically when:**
  - Available capacity = 0

### Slot Lock Rules
- **Slot is locked IMMEDIATELY when reservation is created**
- **Slot is released ONLY when reservation is:**
  - `SUCCESS` (completed)
  - `NO_DEAL` (closed without investment)
  - `EXPIRED` (SLA violation)
  - `CANCELLED` (manual cancellation)

---

## ENTITY 3: RESERVATION (Slot)

### Purpose
Time-limited claim by Tipař on specific ticket for specific investor.

### States (Phases)

| Phase | Description | User-Facing Label | Next Actor |
|-------|-------------|-------------------|------------|
| `PENDING_APPROVAL` | Reservation created, internal validation | Čeká na schválení | ADMIN |
| `WAITING_INVESTOR_SIGNATURE` | RA sent to investor | Čeká na podpis investora | INVESTOR |
| `WAITING_DEVELOPER_DECISION` | Investor signed, awaiting partner | Čeká na rozhodnutí developera | PARTNER |
| `WAITING_MEETING_SELECTION` | Partner approved, dates proposed | Čeká na volbu termínu | INVESTOR |
| `MEETING_CONFIRMED` | Investor confirmed meeting (ACTIVE) | Schůzka potvrzena | NONE |
| `MEETING_COMPLETED` | Meeting happened, awaiting outcome | Schůzka dokončena | ADMIN |
| `SUCCESS` | Investment agreement signed | Úspěšně uzavřeno | NONE |
| `NO_DEAL` | No agreement reached | Nedohodnutý obchod | NONE |
| `EXPIRED` | SLA deadline exceeded | Expirováno | NONE |
| `CANCELLED` | Manually cancelled | Zrušeno | NONE |

### State Transitions

```
FLOW 1: NORMAL PROGRESSION
─────────────────────────────────────────────────
[CREATE] → PENDING_APPROVAL
  └─→ WAITING_INVESTOR_SIGNATURE (admin approves)
  └─→ CANCELLED (admin rejects)
  └─→ EXPIRED (SLA timeout)

PENDING_APPROVAL → WAITING_INVESTOR_SIGNATURE
  └─→ WAITING_DEVELOPER_DECISION (investor signs)
  └─→ CANCELLED (investor refuses)
  └─→ EXPIRED (SLA timeout)

WAITING_INVESTOR_SIGNATURE → WAITING_DEVELOPER_DECISION
  └─→ WAITING_MEETING_SELECTION (partner approves)
  └─→ NO_DEAL (partner rejects)
  └─→ EXPIRED (SLA timeout)

WAITING_DEVELOPER_DECISION → WAITING_MEETING_SELECTION
  └─→ MEETING_CONFIRMED (investor selects date)
  └─→ CANCELLED (investor cancels)
  └─→ EXPIRED (SLA timeout)

WAITING_MEETING_SELECTION → MEETING_CONFIRMED
  └─→ MEETING_COMPLETED (meeting date passed)
  └─→ CANCELLED (investor cancels)
  └─→ EXPIRED (SLA timeout)

MEETING_CONFIRMED → MEETING_COMPLETED
  └─→ SUCCESS (investment agreement signed)
  └─→ NO_DEAL (no agreement)
  └─→ EXPIRED (SLA timeout)

MEETING_COMPLETED → SUCCESS
  └─→ [TERMINAL STATE]

MEETING_COMPLETED → NO_DEAL
  └─→ [TERMINAL STATE]

FLOW 2: TERMINATIONS
─────────────────────────────────────────────────
Any Non-Terminal State → EXPIRED
  └─→ [TERMINAL STATE] (SLA timeout)

Any Non-Terminal State → CANCELLED
  └─→ [TERMINAL STATE] (manual cancellation)
```

### Terminal States
- `SUCCESS` – Investment completed, commission earned
- `NO_DEAL` – Closed without investment, no commission
- `EXPIRED` – SLA violation, slot released, no commission
- `CANCELLED` – Manual cancellation, slot released, no commission

### Forbidden Transitions
❌ `SUCCESS` → any state (cannot undo success)
❌ `NO_DEAL` → any state (cannot revive)
❌ `EXPIRED` → any state (cannot revive)
❌ `CANCELLED` → any state (cannot revive)
❌ `MEETING_CONFIRMED` → `PENDING_APPROVAL` (no backward)
❌ Skipping phases (must progress sequentially)

### State Dependencies
- **Reservation can be created ONLY if:**
  - Ticket has available capacity
  - Tipař has available global slots
  - Tipař has < 3 reservations on this ticket
  - Project is `OPEN` or `LAST_SLOTS`
- **Reservation becomes `EXPIRED` automatically when:**
  - Current time > SLA deadline
  - Phase is not terminal
- **Slot is locked when:**
  - Phase is any non-terminal state
- **Slot is released when:**
  - Phase becomes terminal (`SUCCESS`, `NO_DEAL`, `EXPIRED`, `CANCELLED`)

### SLA Rules

| Phase | SLA Duration | Countdown Shown |
|-------|--------------|-----------------|
| `PENDING_APPROVAL` | 24h | Yes |
| `WAITING_INVESTOR_SIGNATURE` | 48h | Yes |
| `WAITING_DEVELOPER_DECISION` | 72h | Yes |
| `WAITING_MEETING_SELECTION` | 48h | Yes |
| `MEETING_CONFIRMED` | 30 days | No |
| `MEETING_COMPLETED` | 7 days | Yes |

**SLA Behavior:**
- SLA starts at phase entry
- SLA countdown is visible to Tipař
- SLA expiration triggers automatic `EXPIRED` transition
- Admin can extend SLA manually (with reason, logged)

### Active Reservation Definition
**Active Reservation = Phase is `MEETING_CONFIRMED`**
- This is the ONLY phase where identities are revealed
- This is when slot lock becomes "confirmed"
- This is when commission entitlement is expected

### Identity Reveal Rules
- **Before `MEETING_CONFIRMED`:** Investor identity is HIDDEN
- **After `MEETING_CONFIRMED`:** Investor identity is REVEALED
- **After `SUCCESS`:** All details are visible

---

## ENTITY 4: COMMISSION

### Purpose
Financial entitlement from completed reservation or project origination.

### States

| State | Description | User-Facing Label |
|-------|-------------|-------------------|
| `EXPECTED` | Reservation in progress (phases 1-5) | Očekávaná |
| `EARNED` | Reservation reached SUCCESS | Zasloužená |
| `LOST` | Reservation reached NO_DEAL or EXPIRED | Propadlá |
| `PENDING_PAYMENT` | Earned, invoice submitted, awaiting payment | Čeká na vyplacení |
| `PAID` | Payment received | Vyplaceno |
| `SUSPENDED` | Payment held (dispute, compliance) | Pozastaveno |
| `UNDER_RECOVERY` | Clawback initiated | Ve vymáhání |

### State Transitions

```
FLOW 1: COMMISSION CREATION
─────────────────────────────────────────────────
[RESERVATION CREATED] → EXPECTED
  └─→ EARNED (reservation → SUCCESS)
  └─→ LOST (reservation → NO_DEAL/EXPIRED/CANCELLED)

EXPECTED → EARNED
  └─→ PENDING_PAYMENT (invoice submitted)
  └─→ SUSPENDED (compliance hold)

EXPECTED → LOST
  └─→ [TERMINAL STATE]

FLOW 2: PAYMENT PROCESSING
─────────────────────────────────────────────────
EARNED → PENDING_PAYMENT
  └─→ PAID (payment processed)
  └─→ SUSPENDED (payment hold)

PENDING_PAYMENT → PAID
  └─→ UNDER_RECOVERY (clawback)
  └─→ [TERMINAL STATE if no issues]

EARNED → SUSPENDED
  └─→ PENDING_PAYMENT (hold released)
  └─→ LOST (commission forfeited)

PENDING_PAYMENT → SUSPENDED
  └─→ PENDING_PAYMENT (hold released)
  └─→ LOST (commission forfeited)

FLOW 3: EXCEPTIONAL PATHS
─────────────────────────────────────────────────
PAID → UNDER_RECOVERY
  └─→ PAID (recovery failed, commission stays)
  └─→ LOST (recovery successful)

SUSPENDED → LOST
  └─→ [TERMINAL STATE]
```

### Terminal States
- `PAID` (if no recovery) – Commission successfully paid
- `LOST` – Commission forfeited or recovered
- `UNDER_RECOVERY` (during process) – Not terminal until resolved

### Forbidden Transitions
❌ `LOST` → any state (cannot revive lost commission)
❌ `EXPECTED` → `PAID` (must go through EARNED → PENDING_PAYMENT)
❌ `EARNED` → `LOST` (can only go via SUSPENDED)

### State Dependencies
- **Commission is created ONLY when:**
  - Reservation is created (state = `EXPECTED`)
  - OR project origination is confirmed (state = `EXPECTED`)
- **Commission becomes `EARNED` ONLY when:**
  - Associated reservation reaches `SUCCESS` phase
- **Commission becomes `LOST` when:**
  - Associated reservation reaches `NO_DEAL`, `EXPIRED`, OR `CANCELLED`
- **Commission becomes `PENDING_PAYMENT` when:**
  - Tipař submits invoice
  - Admin approves invoice
- **Commission becomes `PAID` when:**
  - Admin confirms payment processed
  - Payment reference logged

### Commission Types

**Type 1: Investor Referral Commission**
- Earned when Tipař brings investor to project
- Commission rate: per ticket
- Lifecycle: tied to single reservation

**Type 2: Project Origination Commission**
- Earned when Tipař brings project to platform
- Commission rate: per project OR per successful ticket
- Lifecycle: can span multiple reservations

**Both types:**
- Follow same state model
- Tracked separately
- Can stack (Tipař can earn both)

---

## CROSS-ENTITY DEPENDENCIES

### Project → Ticket
- Project state affects ticket availability
- Project `PAUSED` → All tickets cannot accept new reservations
- Project `WITHDRAWN` → All tickets become `CLOSED`
- Project `FULLY_RESERVED` → All tickets are `FULLY_FILLED`

### Ticket → Reservation
- Ticket capacity constrains reservation creation
- Ticket `CLOSED` → No new reservations
- Ticket `FULLY_FILLED` → No new reservations
- Reservation terminal → Ticket capacity recalculated

### Reservation → Commission
- Reservation phase drives commission state
- Reservation `SUCCESS` → Commission `EARNED`
- Reservation terminal (not SUCCESS) → Commission `LOST`
- Commission state cannot advance without reservation state

### Reservation → Ticket → Project
- Reservation locks ticket capacity
- Multiple locked reservations can fill ticket
- Filled tickets can change project state

---

## STATE TRANSITION AUTHORITY

| Entity | State Change | Authority | Requires Reason |
|--------|--------------|-----------|-----------------|
| Project | PENDING_APPROVAL → APPROVED | Admin | No |
| Project | PENDING_APPROVAL → REJECTED | Admin | Yes |
| Project | OPEN → PAUSED | Admin/Partner | Yes |
| Project | PAUSED → OPEN | Admin/Partner | No |
| Project | * → WITHDRAWN | Admin/Partner/Tipař | Yes |
| Ticket | DRAFT → AVAILABLE | Admin | No |
| Ticket | * → CLOSED | Admin | Yes |
| Ticket | Auto-state changes | System | No |
| Reservation | PENDING_APPROVAL → WAITING_* | Admin | No |
| Reservation | Phase progression | System/Actor | No |
| Reservation | * → CANCELLED | Tipař/Admin | Yes |
| Reservation | * → EXPIRED | System (SLA) | No |
| Reservation | SLA extension | Admin | Yes |
| Commission | EARNED → PENDING_PAYMENT | Tipař (invoice) | No |
| Commission | PENDING_PAYMENT → PAID | Admin | No |
| Commission | * → SUSPENDED | Admin | Yes |

---

## STATE VALIDATION RULES

### Before Creating Reservation
```
CHECK 1: Project state
  IF project.state NOT IN [OPEN, LAST_SLOTS]
    THEN BLOCK reservation

CHECK 2: Ticket capacity
  IF ticket.availableCapacity <= 0
    THEN BLOCK reservation

CHECK 3: Global slots
  IF tipar.remainingSlots <= 0
    THEN BLOCK reservation

CHECK 4: Per-ticket limit
  IF tipar.reservationsOnTicket >= 3
    THEN BLOCK reservation

CHECK 5: Investor assignment
  IF investor.id IS NULL
    THEN BLOCK reservation

IF ALL CHECKS PASS
  THEN ALLOW reservation creation
```

### Before State Transition
```
CHECK 1: Current state validity
  IF currentState NOT IN allowedStates[targetState]
    THEN REJECT transition

CHECK 2: Actor authority
  IF actor.role NOT IN authorizedRoles[targetState]
    THEN REJECT transition

CHECK 3: Required data
  IF targetState.requiredFields NOT ALL present
    THEN REJECT transition

CHECK 4: SLA status
  IF targetState != EXPIRED AND sla.isExpired
    THEN FORCE EXPIRED transition

IF ALL CHECKS PASS
  THEN ALLOW transition
  AND LOG state change
  AND NOTIFY affected parties
```

---

## STATE LOGGING REQUIREMENTS

### Every State Change Must Log:
1. **Entity type** (project, ticket, reservation, commission)
2. **Entity ID**
3. **Old state**
4. **New state**
5. **Actor** (user ID or "SYSTEM")
6. **Timestamp** (ISO 8601)
7. **Reason** (if manual override)
8. **IP address** (if user action)

### Log Example:
```json
{
  "entityType": "reservation",
  "entityId": "res-2024-001234",
  "oldState": "WAITING_INVESTOR_SIGNATURE",
  "newState": "WAITING_DEVELOPER_DECISION",
  "actor": "SYSTEM",
  "timestamp": "2025-01-01T14:30:00Z",
  "reason": null,
  "ipAddress": null,
  "metadata": {
    "investorSignedAt": "2025-01-01T14:30:00Z"
  }
}
```

---

## STATE DIAGRAM SUMMARY

```
PROJECT LIFECYCLE:
──────────────────────────────────────────────────────────
[Submit] → PENDING_APPROVAL → APPROVED → OPEN → LAST_SLOTS 
              ↓                           ↓         ↓
           REJECTED                    PAUSED  FULLY_RESERVED
              ↓                           ↓         ↓
         [TERMINAL]                  WITHDRAWN  FINISHED
                                        ↓         ↓
                                    [TERMINAL] [TERMINAL]

TICKET LIFECYCLE:
──────────────────────────────────────────────────────────
[Create] → DRAFT → AVAILABLE → PARTIALLY_FILLED → LAST_CAPACITY
                      ↓            ↑   ↓               ↓
                   CLOSED      ←────────────→   FULLY_FILLED
                      ↓                               ↓
                 [TERMINAL]                      [TERMINAL]

RESERVATION LIFECYCLE:
──────────────────────────────────────────────────────────
[Create] → PENDING_APPROVAL
              ↓
        WAITING_INVESTOR_SIGNATURE
              ↓
        WAITING_DEVELOPER_DECISION
              ↓
        WAITING_MEETING_SELECTION
              ↓
        MEETING_CONFIRMED (ACTIVE)
              ↓
        MEETING_COMPLETED
              ↓
        SUCCESS / NO_DEAL
              ↓
         [TERMINAL]

        Any phase can → EXPIRED (SLA)
        Any phase can → CANCELLED (manual)

COMMISSION LIFECYCLE:
──────────────────────────────────────────────────────────
[Reservation Created] → EXPECTED
                          ↓
                   EARNED / LOST
                     ↓       ↓
             PENDING_PAYMENT  [TERMINAL]
                     ↓
                   PAID
                     ↓
               [TERMINAL] or UNDER_RECOVERY
```

---

## END OF STATE DIAGRAM

**Last Updated:** 2025-01-01
**Document Status:** Complete and Non-Negotiable
**Implementation Requirement:** All UI and backend logic MUST respect these state rules
