# RESERVATION STATE MACHINE – COMPLETE SYSTEM
**Ticket Status × SLA × Reservation Flow**

**Document Type:** State Machine Definition + System Logic
**Date:** 2025-01-01
**Purpose:** Deterministic state transitions for ticket reservation system

---

## EXECUTIVE SUMMARY

**This document defines:**
1. All ticket statuses and their SLA relevance
2. Complete reservation state machine (A→Z)
3. State transition rules (valid, invalid, system-enforced)
4. SLA behavior per state
5. UI treatment per status in ticket table
6. Error handling and edge cases

**Design Principle:**
Professional transaction handling, not a sales funnel.

---

## PART 1: TICKET STATUS TAXONOMY

### 1.1 ALL TICKET STATUSES (EXHAUSTIVE LIST)

| Status ID | Display Name | Definition | SLA Relevant? | User Can Reserve? |
|-----------|-------------|------------|---------------|-------------------|
| **AVAILABLE** | Dostupný | No reservations, capacity > 0 | ❌ No | ✅ Yes |
| **PARTIALLY_FILLED** | Částečně obsazeno | 1+ reservations, capacity > 0 | ❌ No (ticket-level) | ✅ Yes |
| **LAST_CAPACITY** | Poslední sloty | Capacity < 20% remaining | ❌ No (ticket-level) | ✅ Yes |
| **RESERVED_BY_ME** | Rezervováno mnou | User has active reservation on this ticket | ✅ Yes (user's reservation SLA) | ❌ No (already reserved) |
| **RESERVED_BY_OTHERS** | Rezervováno jinými | Other users have reservations, capacity > 0 | ❌ No (not user's SLA) | ✅ Yes (if capacity allows) |
| **IN_SIGNING** | V podpisu | Investor signing documents (1+ reservations in signing phase) | ✅ Yes (per reservation) | Conditional |
| **CONFIRMED** | Potvrzeno | Partner confirmed investment (1+ reservations confirmed) | ❌ No (SLA completed) | Conditional |
| **FULLY_FILLED** | Plně obsazeno | All slots reserved or completed, capacity = 0 | ❌ No | ❌ No |
| **EXPIRED** | Vypršelo | Reservation(s) expired due to SLA, capacity released | ❌ No (historical) | ✅ Yes (if capacity freed) |
| **CANCELLED** | Zrušeno | Reservation(s) cancelled by user/system | ❌ No (historical) | ✅ Yes (if capacity freed) |
| **CLOSED** | Uzavřeno | Admin closed ticket | ❌ No | ❌ No |

**Note:** A ticket can have MULTIPLE reservations simultaneously, each with its own state and SLA.

**Ticket Status Calculation Logic:**
```javascript
function calculateTicketStatus(ticket, currentUser) {
  // Priority 1: Admin closure
  if (ticket.is_closed) return "CLOSED"
  
  // Priority 2: User's own reservation
  const userReservation = ticket.reservations.find(r => 
    r.user_id === currentUser.id && 
    ["active", "in_signing", "confirmed"].includes(r.status)
  )
  if (userReservation) {
    if (userReservation.status === "in_signing") return "IN_SIGNING"
    if (userReservation.status === "confirmed") return "CONFIRMED"
    return "RESERVED_BY_ME"
  }
  
  // Priority 3: Capacity-based
  if (ticket.available_capacity === 0) return "FULLY_FILLED"
  if (ticket.available_capacity < ticket.total_capacity * 0.2) return "LAST_CAPACITY"
  
  // Priority 4: Others' reservations
  if (ticket.reservations.length > 0) return "PARTIALLY_FILLED"
  
  // Default
  return "AVAILABLE"
}
```

---

### 1.2 TICKET STATUS × SLA BEHAVIOR MAPPING

| Ticket Status | SLA Countdown Visible? | Countdown Location | Countdown Format | SLA Influencing Sort? | Visual Priority |
|---------------|----------------------|-------------------|-----------------|---------------------|-----------------|
| **AVAILABLE** | ❌ No | N/A | N/A | ❌ No | Low (neutral) |
| **PARTIALLY_FILLED** | ❌ No | N/A | N/A | ❌ No | Low (neutral) |
| **LAST_CAPACITY** | ❌ No | N/A | N/A | ❌ No | Medium (factual urgency) |
| **RESERVED_BY_ME** | ✅ Yes | Expanded row + Reservation detail | "SLA: Zbývá Xh" | ✅ Yes (user's active SLA) | High (user's responsibility) |
| **RESERVED_BY_OTHERS** | ❌ No (not user's concern) | N/A | N/A | ❌ No | Low (neutral) |
| **IN_SIGNING** | ✅ Yes | Expanded row + Reservation detail | "Čeká na podpis" | ✅ Yes (if user's reservation) | High (user's responsibility) |
| **CONFIRMED** | ❌ No (SLA completed) | N/A | N/A | ❌ No | Medium (success state) |
| **FULLY_FILLED** | ❌ No | N/A | N/A | ❌ No | Low (terminal) |
| **EXPIRED** | ❌ No (historical) | Expanded row (historical log) | "Vypršelo {date}" | ❌ No | Low (historical) |
| **CANCELLED** | ❌ No (historical) | Expanded row (historical log) | "Zrušeno {date}" | ❌ No | Low (historical) |
| **CLOSED** | ❌ No | N/A | N/A | ❌ No | Low (terminal) |

**Rationale:**
- SLA shown ONLY when user has active responsibility (RESERVED_BY_ME, IN_SIGNING)
- Other users' SLAs are NOT shown (privacy + irrelevant to decision-making)
- Historical states show timestamps, not countdowns

---

### 1.3 TICKET STATUS × UI TREATMENT IN TABLE

#### COLLAPSED ROW (DEFAULT VIEW)

| Ticket Status | Badge Color | Badge Icon | Badge Text | Row Background | CTA Label | CTA Enabled |
|---------------|------------|-----------|-----------|---------------|-----------|-------------|
| **AVAILABLE** | Green #14AE6B | ✓ CheckCircle | "Dostupný" | White | "Rezervovat tiket" | ✅ Enabled |
| **PARTIALLY_FILLED** | Yellow #F59E0B | ⏱ Clock | "X / Y slotů" | White | "Rezervovat tiket" | ✅ Enabled |
| **LAST_CAPACITY** | Orange #F97316 | ⚠ AlertTriangle | "Poslední sloty" | White | "Rezervovat tiket" | ✅ Enabled |
| **RESERVED_BY_ME** | Blue #215EF8 | 📌 Pin | "Rezervováno mnou" | Light blue tint | "Detail rezervace" | ✅ Enabled (different action) |
| **RESERVED_BY_OTHERS** | Gray #6B7280 | 👥 Users | "Rezervováno" | White | "Rezervovat tiket" | ✅ Enabled (if capacity) |
| **IN_SIGNING** | Blue #215EF8 | ✍ Edit3 | "V podpisu" | Light blue tint | "Detail rezervace" | ✅ Enabled |
| **CONFIRMED** | Green #14AE6B | ✓ CheckCircle2 | "Potvrzeno" | Light green tint | "Detail obchodu" | ✅ Enabled (view only) |
| **FULLY_FILLED** | Gray #6B7280 | ✕ XCircle | "Plně obsazeno" | Light gray tint | "Plně obsazeno" | ❌ Disabled |
| **EXPIRED** | Gray #6B7280 | ⏱ Clock | "Vypršelo" | White | "Rezervovat tiket" | ✅ Enabled (if capacity freed) |
| **CANCELLED** | Gray #6B7280 | ✕ Ban | "Zrušeno" | White | "Rezervovat tiket" | ✅ Enabled (if capacity freed) |
| **CLOSED** | Gray #6B7280 | 🔒 Lock | "Uzavřeno" | Light gray tint | "Uzavřeno" | ❌ Disabled |

**Visual Hierarchy Principle:**
- **User's own reservations (RESERVED_BY_ME, IN_SIGNING, CONFIRMED)**: Blue tint background = visual salience
- **Available tickets**: White background = neutral, no emphasis needed
- **Terminal/Unavailable**: Gray background = visually de-emphasized

---

#### EXPANDED ROW (DETAILED VIEW)

**ADDITIONAL INFO SHOWN PER STATUS:**

**AVAILABLE / PARTIALLY_FILLED / LAST_CAPACITY:**
```
Dostupnost: X / Y slotů
├─ Obsazeno: Z sloty
│  └─ N rezervací aktivních
└─ Volné: X slotů

Vaše rezervace: Žádná
```

**RESERVED_BY_ME:**
```
Dostupnost: X / Y slotů

Vaše rezervace: 1 aktivní
├─ RES-2025-001234
├─ Vytvořeno: 1.1.2025 12:30
├─ Investor: Andrea Nováková
├─ SLA: Zbývá 46 hodin ← COUNTDOWN HERE
│   └─ Automatické zrušení: 3.1.2025 12:30
└─ [Link:] Detail rezervace →
```

**IN_SIGNING:**
```
Dostupnost: X / Y slotů

Vaše rezervace: 1 v podpisu
├─ RES-2025-001234
├─ Stav: Čeká na podpis investora
├─ SLA: Zbývá 68 hodin ← COUNTDOWN HERE
│   └─ Investor musí podepsat do: 5.1.2025 10:00
└─ [Link:] Detail rezervace →
```

**CONFIRMED:**
```
Dostupnost: X / Y slotů (váš slot obsazen)

Váš obchod: Úspěšně uzavřeno
├─ RES-2025-001234
├─ Uzavřeno: 5.1.2025 14:00
├─ Investor: Andrea Nováková
├─ Provize: 125 000 Kč (EARNED)
└─ [Link:] Detail obchodu →
```

**EXPIRED:**
```
Dostupnost: X / Y slotů

Vaše rezervace: Vypršela
├─ RES-2024-001198
├─ Vypršelo: 28.12.2024 16:00
├─ Důvod: Nedodržení SLA (fáze: Čeká na podpis investora)
├─ Slot uvolněn: Ano
└─ [Link:] Detail vypršelé rezervace →
```

---

### 1.4 TICKET TABLE FILTERING & SORTING

#### FILTER RULES

**Filter 1: Aktivní / Vše**
```
DEFAULT: "Aktivní"
Shows: AVAILABLE, PARTIALLY_FILLED, LAST_CAPACITY, RESERVED_BY_ME, 
       RESERVED_BY_OTHERS, IN_SIGNING, CONFIRMED

Hides: FULLY_FILLED, EXPIRED, CANCELLED, CLOSED

When "Vše" selected:
Shows: All statuses
```

**Filter 2: Moje rezervace (Checkbox)**
```
When CHECKED:
Shows ONLY: RESERVED_BY_ME, IN_SIGNING, CONFIRMED, EXPIRED (user's), 
            CANCELLED (user's)

Hides: AVAILABLE, PARTIALLY_FILLED, LAST_CAPACITY, RESERVED_BY_OTHERS, 
       FULLY_FILLED, CLOSED

AND: Show user's reservations on OTHER tickets even if those tickets have different primary status
```

**Filter 3: Volné sloty (Checkbox)**
```
When CHECKED:
Shows ONLY: available_capacity > 0

Hides: FULLY_FILLED, CLOSED
```

**Filter 4: Vyprší brzy (Checkbox)**
```
When CHECKED:
Shows ONLY: Tickets with user's active reservation where SLA < 24 hours

This filter ONLY applies to:
- RESERVED_BY_ME (SLA < 24h)
- IN_SIGNING (SLA < 24h)

Hides: All other statuses
```

**Filter Combination Logic:**
```
Filters use AND logic:
  IF "Moje rezervace" AND "Vyprší brzy"
  THEN show only user's reservations where SLA < 24h
```

---

#### SORT RULES

**Sort Option 1: Provize (max → min)** [DEFAULT]
```
Primary: commission_amount_czk DESC
Secondary: ticket_id ASC
```

**Sort Option 2: SLA (nejdříve vypršící)**
```
Priority:
1. User's reservations with SLA < 24h (CRITICAL)
2. User's reservations with SLA < 48h (WARNING)
3. User's reservations with SLA > 48h (ACTIVE)
4. All other tickets (no SLA relevance)

Within each group: Sort by sla_expires_at ASC
```

**Sort Option 3: Investice (max → min)**
```
Primary: investment_amount_czk DESC
Secondary: ticket_id ASC
```

**Sort Option 4: Výnos (max → min)**
```
Primary: yield_pa_percentage DESC
Secondary: ticket_id ASC
```

**Sort Option 5: Sloty (nejvíce volných)**
```
Primary: available_capacity DESC
Secondary: ticket_id ASC
```

**Rationale:**
- Default = Commission (motivates action based on earnings)
- SLA sort = Risk management (user focuses on urgent items first)
- Other sorts = Standard comparison (investment size, yield, availability)

---

### 1.5 SLA COUNTDOWN VISUAL TREATMENT

#### SLA STATE: ACTIVE (> 48 hours)

**Visual Style:**
```
Color: Gray #6B7280 (neutral)
Icon: ⏱ Clock
Font Weight: Normal
Background: None

Text: "SLA: Zbývá X dnů Y hodin"
Example: "SLA: Zbývá 2 dny 14 hodin"
```

**Location:**
- Expanded row (secondary info)
- Reservation detail page (prominent)

**Rationale:** No urgency needed, informational only.

---

#### SLA STATE: EXPIRING SOON (24-48 hours)

**Visual Style:**
```
Color: Orange #F97316 (attention)
Icon: ⏱ Clock
Font Weight: Medium
Background: Light orange tint (optional, in detail view)

Text: "SLA: Zbývá X hodin"
Example: "SLA: Zbývá 36 hodin"
```

**Location:**
- Expanded row (highlighted)
- Reservation detail page (prominent with helper text)
- Dashboard notification (toast)

**Helper Text:**
```
"Rezervace vyprší 3.1.2025 12:30.
Po vypršení se slot automaticky uvolní."
```

**Rationale:** Factual notification, encourages action or intentional dismissal.

---

#### SLA STATE: CRITICAL (< 24 hours)

**Visual Style:**
```
Color: Red #EF4444 (urgent)
Icon: ⚠ AlertCircle
Font Weight: Semibold
Background: Light red tint (in detail view)

Text: "SLA: Zbývá X hodin"
Example: "SLA: Zbývá 6 hodin"
```

**Location:**
- Expanded row (prominent)
- Reservation detail page (top banner)
- Dashboard notification (persistent)
- Email notification (if enabled)

**Helper Text:**
```
"Rezervace vyprší dnes v 18:30.
Po vypršení:
• Slot bude uvolněn
• Rezervace bude zrušena
• Nebudete moci získat provizi z tohoto tiketu"
```

**Call-to-Action:**
```
[Button:] "Dokončit rezervaci"
[Link:] "Zrušit rezervaci"
```

**Rationale:** Clear consequences, user can act or let expire consciously.

---

#### SLA STATE: PAUSED (Waiting for External Action)

**Visual Style:**
```
Color: Blue #215EF8 (informational)
Icon: ⏸ Pause
Font Weight: Normal
Background: None

Text: "Čeká se na: {next_actor}"
Examples:
- "Čeká se na: Podpis investora"
- "Čeká se na: Potvrzení partnera"
```

**Location:**
- Expanded row
- Reservation detail page

**Helper Text:**
```
"SLA je pozastaveno – lhůta neběží.
Proces pokračuje po akci: {next_actor}"
```

**Rationale:** User knows why nothing is happening, no false urgency.

---

## PART 2: RESERVATION STATE MACHINE (COMPLETE)

### 2.1 ALL RESERVATION STATES (A→Z)

| State ID | Display Name | Definition | Can User Cancel? | SLA Active? | Ticket Slot Locked? |
|----------|-------------|------------|-----------------|-------------|-------------------|
| **NONE** | [No reservation] | Default state, no reservation exists | N/A | ❌ No | ❌ No |
| **DRAFT** | Koncept | User opened modal, not submitted | ✅ Yes (close modal) | ❌ No | ❌ No |
| **PENDING_VALIDATION** | Validace | API validating reservation request | ❌ No (wait) | ❌ No | ❌ No |
| **ACTIVE** | Aktivní | Reservation confirmed, slot locked | ✅ Yes | ✅ Yes | ✅ Yes |
| **AWAITING_DOCUMENTS** | Čeká na dokumenty | Admin preparing documents | ✅ Yes | ✅ Yes (paused) | ✅ Yes |
| **DOCUMENTS_READY** | Dokumenty připraveny | Documents ready to send to investor | ✅ Yes | ✅ Yes | ✅ Yes |
| **SENT_TO_INVESTOR** | Odesláno investorovi | Documents sent, awaiting signature | ✅ Yes | ✅ Yes | ✅ Yes |
| **INVESTOR_SIGNED** | Podepsáno investorem | Investor signed, awaiting partner | ✅ Yes (with warning) | ✅ Yes (paused) | ✅ Yes |
| **PARTNER_REVIEWING** | Kontrola partnerem | Partner reviewing signed documents | ✅ Yes (with warning) | ✅ Yes (paused) | ✅ Yes |
| **PARTNER_CONFIRMED** | Potvrzeno partnerem | Partner confirmed investment | ❌ No (terminal success) | ❌ No (SLA stopped) | ✅ Yes (permanent) |
| **EXPIRED** | Vypršelo | SLA deadline passed, auto-cancelled | ❌ No (terminal) | ❌ No | ❌ No (released) |
| **CANCELLED_BY_USER** | Zrušeno uživatelem | User manually cancelled | ❌ No (terminal) | ❌ No | ❌ No (released) |
| **CANCELLED_BY_SYSTEM** | Zrušeno systémem | System auto-cancelled (admin, conflict) | ❌ No (terminal) | ❌ No | ❌ No (released) |
| **REJECTED_BY_PARTNER** | Zamítnuto partnerem | Partner rejected after review | ❌ No (terminal failure) | ❌ No | ❌ No (released) |

**Total: 14 states**

---

### 2.2 STATE TRANSITION DIAGRAM (TEXT-BASED)

```
[NONE]
  │
  │ User clicks "Rezervovat tiket"
  ↓
[DRAFT]
  │
  │ User fills form, clicks "Dokončit rezervaci"
  ↓
[PENDING_VALIDATION]
  │
  ├─→ Validation PASS → [ACTIVE]
  │
  └─→ Validation FAIL → Error shown, back to [DRAFT]
  
[ACTIVE]
  │
  ├─→ Admin starts preparing documents → [AWAITING_DOCUMENTS]
  ├─→ User cancels → [CANCELLED_BY_USER]
  ├─→ SLA expires → [EXPIRED]
  └─→ System conflict (e.g., capacity exhausted) → [CANCELLED_BY_SYSTEM]
  
[AWAITING_DOCUMENTS]
  │
  ├─→ Documents ready → [DOCUMENTS_READY]
  ├─→ User cancels → [CANCELLED_BY_USER]
  ├─→ SLA expires → [EXPIRED]
  └─→ Admin cancels → [CANCELLED_BY_SYSTEM]
  
[DOCUMENTS_READY]
  │
  ├─→ User/Admin sends to investor → [SENT_TO_INVESTOR]
  ├─→ User cancels → [CANCELLED_BY_USER]
  └─→ SLA expires → [EXPIRED]
  
[SENT_TO_INVESTOR]
  │
  ├─→ Investor signs → [INVESTOR_SIGNED]
  ├─→ User cancels → [CANCELLED_BY_USER]
  └─→ SLA expires → [EXPIRED]
  
[INVESTOR_SIGNED]
  │
  ├─→ Partner starts review → [PARTNER_REVIEWING]
  ├─→ User cancels (with warning) → [CANCELLED_BY_USER]
  └─→ (SLA paused during partner review)
  
[PARTNER_REVIEWING]
  │
  ├─→ Partner confirms → [PARTNER_CONFIRMED] (SUCCESS)
  ├─→ Partner rejects → [REJECTED_BY_PARTNER] (FAILURE)
  ├─→ User cancels (with strong warning) → [CANCELLED_BY_USER]
  └─→ Admin cancels (rare, conflict) → [CANCELLED_BY_SYSTEM]
  
[PARTNER_CONFIRMED]
  │
  └─→ TERMINAL SUCCESS STATE
      - Commission → EARNED
      - Ticket slot → Permanently consumed
      - User cannot cancel
  
[EXPIRED]
  │
  └─→ TERMINAL FAILURE STATE
      - Ticket slot → Released
      - User global slots → Freed
      - Can create new reservation if capacity available
  
[CANCELLED_BY_USER]
  │
  └─→ TERMINAL FAILURE STATE
      - Ticket slot → Released
      - User global slots → Freed
      - Can create new reservation if capacity available
  
[CANCELLED_BY_SYSTEM]
  │
  └─→ TERMINAL FAILURE STATE
      - Ticket slot → Released
      - User global slots → Freed
      - Can create new reservation if capacity available
  
[REJECTED_BY_PARTNER]
  │
  └─→ TERMINAL FAILURE STATE
      - Ticket slot → Released
      - User global slots → Freed
      - User notified of rejection reason
```

---

### 2.3 STATE TRANSITION RULES (DETAILED)

#### VALID TRANSITIONS (System-Enforced)

| From State | To State | Trigger | Actor | Pre-conditions | Side Effects |
|------------|----------|---------|-------|----------------|--------------|
| NONE | DRAFT | User clicks "Rezervovat" | User | Ticket available, user has slots | Modal opens, no DB change |
| DRAFT | PENDING_VALIDATION | User clicks "Dokončit" | User | Form valid, investor selected | API call initiated |
| PENDING_VALIDATION | ACTIVE | Validation passes | System | Capacity available, no conflicts | Slot locked, SLA started, commission created (EXPECTED) |
| PENDING_VALIDATION | [Error → DRAFT] | Validation fails | System | Capacity exhausted / user out of slots | Error shown, modal stays open |
| ACTIVE | AWAITING_DOCUMENTS | Admin action | Admin | Reservation approved | SLA paused |
| ACTIVE | CANCELLED_BY_USER | User cancels | User | User confirms cancellation | Slot released, commission → LOST |
| ACTIVE | EXPIRED | SLA timeout | System | Current time > SLA deadline | Slot released, commission → LOST, notification sent |
| ACTIVE | CANCELLED_BY_SYSTEM | Admin/conflict | System/Admin | External conflict (e.g., ticket closed) | Slot released, commission → LOST |
| AWAITING_DOCUMENTS | DOCUMENTS_READY | Documents uploaded | Admin | Documents validated | SLA resumed |
| DOCUMENTS_READY | SENT_TO_INVESTOR | User/Admin sends docs | User/Admin | Investor contact confirmed | SLA continues |
| SENT_TO_INVESTOR | INVESTOR_SIGNED | Investor signs | Investor (logged by admin) | Signature validated | SLA paused (waiting partner) |
| SENT_TO_INVESTOR | EXPIRED | SLA timeout | System | Investor didn't sign in time | Slot released, commission → LOST |
| INVESTOR_SIGNED | PARTNER_REVIEWING | Partner starts review | Partner/Admin | Signed docs received | SLA paused |
| PARTNER_REVIEWING | PARTNER_CONFIRMED | Partner approves | Partner/Admin | Review complete, approved | Commission → EARNED, slot permanent |
| PARTNER_REVIEWING | REJECTED_BY_PARTNER | Partner rejects | Partner/Admin | Review complete, rejected | Slot released, commission → LOST |
| Any non-terminal | CANCELLED_BY_USER | User cancels | User | User confirms (with warnings if late stage) | Slot released, commission → LOST |

---

#### INVALID TRANSITIONS (BLOCKED)

| From State | To State | Why Blocked |
|------------|----------|-------------|
| PARTNER_CONFIRMED | Any other state | Terminal success, immutable |
| EXPIRED | Any other state | Terminal failure, immutable |
| CANCELLED_BY_USER | Any other state | Terminal failure, immutable |
| CANCELLED_BY_SYSTEM | Any other state | Terminal failure, immutable |
| REJECTED_BY_PARTNER | Any other state | Terminal failure, immutable |
| PARTNER_REVIEWING | ACTIVE | Cannot go backwards after investor signed |
| INVESTOR_SIGNED | DOCUMENTS_READY | Cannot go backwards after signature |
| SENT_TO_INVESTOR | ACTIVE | Cannot go backwards after sending to investor |

---

### 2.4 SLA BEHAVIOR PER RESERVATION STATE

| Reservation State | SLA Status | Countdown Shown? | SLA Paused? | What Happens on SLA Expiry? |
|------------------|-----------|-----------------|-------------|---------------------------|
| NONE | N/A | ❌ No | N/A | N/A |
| DRAFT | Not started | ❌ No | N/A | Draft auto-deleted after 30min (local storage cleanup) |
| PENDING_VALIDATION | Not started | ❌ No | N/A | N/A (API call should complete in <10s) |
| ACTIVE | Running | ✅ Yes | ❌ No | → EXPIRED (slot released, commission lost) |
| AWAITING_DOCUMENTS | Paused | ✅ Yes (shows "Paused") | ✅ Yes | No expiry (waiting for admin) |
| DOCUMENTS_READY | Running | ✅ Yes | ❌ No | → EXPIRED (slot released) |
| SENT_TO_INVESTOR | Running | ✅ Yes | ❌ No | → EXPIRED (investor didn't sign in time) |
| INVESTOR_SIGNED | Paused | ✅ Yes (shows "Paused") | ✅ Yes | No expiry (waiting for partner) |
| PARTNER_REVIEWING | Paused | ✅ Yes (shows "Paused") | ✅ Yes | No expiry (waiting for partner decision) |
| PARTNER_CONFIRMED | Stopped | ❌ No | N/A | N/A (terminal success) |
| EXPIRED | Stopped | ❌ No | N/A | N/A (terminal failure) |
| CANCELLED_BY_USER | Stopped | ❌ No | N/A | N/A (terminal failure) |
| CANCELLED_BY_SYSTEM | Stopped | ❌ No | N/A | N/A (terminal failure) |
| REJECTED_BY_PARTNER | Stopped | ❌ No | N/A | N/A (terminal failure) |

**SLA Pause Justification:**
- **AWAITING_DOCUMENTS**: User cannot act until admin prepares docs (external dependency)
- **INVESTOR_SIGNED**: User cannot act, waiting for partner decision (external dependency)
- **PARTNER_REVIEWING**: User cannot act, partner reviewing (external dependency)

**SLA Continues During:**
- **ACTIVE**: User must assign investor and initiate process
- **DOCUMENTS_READY**: User must send documents to investor
- **SENT_TO_INVESTOR**: Investor must sign (user responsible for investor engagement)

---

### 2.5 USER ACTIONS PER RESERVATION STATE

| Reservation State | View Detail? | Cancel? | Edit? | Next Action Prompt |
|------------------|-------------|---------|-------|--------------------|
| NONE | ❌ No | N/A | N/A | "Rezervovat tiket" (CTA in table) |
| DRAFT | ✅ Yes (modal) | ✅ Yes (close modal) | ✅ Yes (edit form) | "Dokončit rezervaci" |
| PENDING_VALIDATION | ✅ Yes (spinner) | ❌ No (wait) | ❌ No (wait) | "Validace..." (auto-proceed) |
| ACTIVE | ✅ Yes | ✅ Yes | ❌ No (immutable) | "Odeslat dokumenty investorovi" |
| AWAITING_DOCUMENTS | ✅ Yes | ✅ Yes | ❌ No | "Čeká na přípravu dokumentů administrátorem" |
| DOCUMENTS_READY | ✅ Yes | ✅ Yes | ❌ No | "Odeslat dokumenty investorovi" |
| SENT_TO_INVESTOR | ✅ Yes | ✅ Yes | ❌ No | "Čeká na podpis investora" |
| INVESTOR_SIGNED | ✅ Yes | ⚠️ Yes (with warning) | ❌ No | "Čeká na potvrzení partnera" |
| PARTNER_REVIEWING | ✅ Yes | ⚠️ Yes (strong warning) | ❌ No | "Partner kontroluje dokumenty" |
| PARTNER_CONFIRMED | ✅ Yes | ❌ No | ❌ No | "Obchod úspěšně uzavřen" |
| EXPIRED | ✅ Yes (historical) | ❌ No | ❌ No | "Rezervace vypršela – vytvořit novou?" |
| CANCELLED_BY_USER | ✅ Yes (historical) | ❌ No | ❌ No | "Rezervace zrušena – vytvořit novou?" |
| CANCELLED_BY_SYSTEM | ✅ Yes (historical) | ❌ No | ❌ No | "Rezervace zrušena systémem – kontaktovat podporu?" |
| REJECTED_BY_PARTNER | ✅ Yes (historical) | ❌ No | ❌ No | "Partner zamítl – důvod: {reason}" |

---

### 2.6 SYSTEM ACTIONS PER RESERVATION STATE

| Reservation State | Automatic Transitions? | Notifications Sent? | Side Effects |
|------------------|----------------------|-------------------|--------------|
| DRAFT | ✅ Yes (30min timeout → delete draft) | ❌ No | None |
| PENDING_VALIDATION | ✅ Yes (validation result → ACTIVE or Error) | ❌ No | Slot lock attempt |
| ACTIVE | ✅ Yes (SLA expiry → EXPIRED) | ✅ Yes (creation confirmation email) | Slot locked, commission created |
| AWAITING_DOCUMENTS | ✅ Yes (admin action → DOCUMENTS_READY) | ❌ No | None |
| DOCUMENTS_READY | ❌ No (user must send) | ✅ Yes (reminder 24h before SLA) | None |
| SENT_TO_INVESTOR | ✅ Yes (investor signs → INVESTOR_SIGNED OR SLA expiry → EXPIRED) | ✅ Yes (reminder to investor, if enabled) | None |
| INVESTOR_SIGNED | ✅ Yes (partner starts review → PARTNER_REVIEWING) | ✅ Yes (notification to partner) | None |
| PARTNER_REVIEWING | ✅ Yes (partner decision → CONFIRMED or REJECTED) | ❌ No | None |
| PARTNER_CONFIRMED | ❌ No (terminal) | ✅ Yes (success notification + commission earned) | Commission → EARNED, slot permanent |
| EXPIRED | ❌ No (terminal) | ✅ Yes (expiry notification) | Slot released, commission → LOST |
| CANCELLED_BY_USER | ❌ No (terminal) | ✅ Yes (cancellation confirmation) | Slot released, commission → LOST |
| CANCELLED_BY_SYSTEM | ❌ No (terminal) | ✅ Yes (system cancellation notification + reason) | Slot released, commission → LOST |
| REJECTED_BY_PARTNER | ❌ No (terminal) | ✅ Yes (rejection notification + reason) | Slot released, commission → LOST |

---

## PART 3: ERROR & EDGE CASES

### 3.1 EDGE CASE 1: SLA Expires Mid-Process

**Scenario:** User is in SENT_TO_INVESTOR state, SLA expires before investor signs.

**System Behavior:**
1. CRON job detects `currentTime > sla_expires_at`
2. Reservation: SENT_TO_INVESTOR → EXPIRED
3. Ticket slot: Released (available_capacity +1)
4. User global slots: Freed (+1)
5. Commission: EXPECTED → LOST
6. Notification: Sent to user via email + in-app

**User Sees:**
```
Reservation Detail:
Status: Vypršelo
Vypršelo: 3.1.2025 14:30
Fáze v době vypršení: Odesláno investorovi (čekal na podpis)

Důvod: SLA deadline nebyl dodržen.
Investor nepotvrdil investici včas.

Slot byl automaticky uvolněn.
Můžete vytvořit novou rezervaci, pokud je kapacita dostupná.

[Zobrazit tiket →]
```

**Ticket Table Update:**
```
BEFORE: "Rezervováno mnou" (blue)
AFTER:  "Částečně obsazeno" or "Dostupný" (depending on other reservations)
```

---

### 3.2 EDGE CASE 2: Investor Signs Late (After SLA Expiry)

**Scenario:** Reservation expired at 14:30, investor signs at 15:00 (offline signature, admin logs it later).

**System Behavior:**
1. Reservation is EXPIRED (terminal state)
2. Admin cannot log signature on expired reservation
3. System shows error: "Rezervace již vypršela – nelze zaznamenat podpis"

**Admin Options:**
1. Create new reservation manually (if capacity available)
2. Contact user to create new reservation
3. Log as exception (compliance review)

**User Sees:**
```
Notification:
"Investor {name} podepsal dokumenty po vypršení rezervace.
Prosím kontaktujte podporu pro ruční zpracování."
```

**Rationale:** Terminal states are immutable (audit trail integrity). Late signature requires manual intervention.

---

### 3.3 EDGE CASE 3: Partner Rejects After Investor Signed

**Scenario:** Investor signed, partner reviews and rejects investment.

**System Behavior:**
1. Partner clicks "Reject" in admin panel
2. Reservation: PARTNER_REVIEWING → REJECTED_BY_PARTNER
3. Ticket slot: Released
4. User global slots: Freed
5. Commission: EXPECTED → LOST
6. Notification: Sent to user + investor (if enabled)

**User Sees:**
```
Reservation Detail:
Status: Zamítnuto partnerem
Zamítnuto: 6.1.2025 10:00

Důvod zamítnutí (od partnera):
"Investor nesplňuje požadavky na tuto investici 
(minimální investiční historie)."

Slot byl uvolněn.
Můžete vybrat jiného investora a vytvořit novou rezervaci.

[Zobrazit tiket →]  [Kontaktovat podporu]
```

**Ticket Table Update:**
```
BEFORE: "V podpisu" (blue)
AFTER:  "Částečně obsazeno" or "Dostupný"
```

---

### 3.4 EDGE CASE 4: User Cancels During INVESTOR_SIGNED State

**Scenario:** Investor already signed, user wants to cancel (rare but allowed).

**System Behavior:**
1. User clicks "Zrušit rezervaci" in reservation detail
2. System shows confirmation dialog with STRONG WARNING

**Confirmation Dialog:**
```
┌──────────────────────────────────────────────────────┐
│ ⚠ POZOR: INVESTOR JIŽ PODEPSAL DOKUMENTY            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Opravdu chcete zrušit tuto rezervaci?               │
│                                                      │
│ Investor: Andrea Nováková                           │
│ Podepsáno: 5.1.2025 09:30                           │
│ Stav: Čeká na potvrzení partnera                    │
│                                                      │
│ Důsledky zrušení:                                    │
│ • Investor bude kontaktován o zrušení                │
│ • Ztratíte možnost získat provizi 125 000 Kč        │
│ • Slot bude uvolněn pro ostatní                     │
│ • Tuto akci nelze vrátit zpět                       │
│                                                      │
│ Důvod zrušení (povinné):                             │
│ ┌────────────────────────────────────────────────┐  │
│ │ [Text area - required field]                   │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ────────────────────────────────────────────────────  │
│                                                      │
│ [Ponechat rezervaci]  [Ano, zrušit rezervaci]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**After Cancellation:**
3. Reservation: INVESTOR_SIGNED → CANCELLED_BY_USER
4. Cancellation reason logged (required field)
5. Notification sent to investor (if configured)
6. Slot released, commission → LOST

**Rationale:** Allow cancellation even in late stage (user autonomy), but require justification (audit trail).

---

### 3.5 EDGE CASE 5: Ticket Becomes Unavailable Externally (Admin Closes)

**Scenario:** User has ACTIVE reservation, admin closes ticket for compliance reasons.

**System Behavior:**
1. Admin clicks "Close ticket" in admin panel
2. Admin must select what happens to active reservations:
   - Option A: Cancel all active reservations
   - Option B: Let active reservations complete (close ticket to NEW reservations only)

**If Option A (Cancel all):**
1. All reservations on this ticket: [Current State] → CANCELLED_BY_SYSTEM
2. Slots released
3. Notifications sent to all affected users

**User Sees:**
```
Notification:
"Vaše rezervace tiketu T-001-02 byla zrušena administrátorem.

Důvod (od administrátora):
'Tiket byl stažen partnerem z nabídky z důvodu změny parametrů projektu.'

Slot byl automaticky uvolněn.
Vaše zbývající sloty: 7 / 10

[Zobrazit jiné tikety]  [Kontaktovat podporu]"
```

**If Option B (Close to new only):**
1. Existing reservations continue normally
2. New reservations blocked (ticket status = CLOSED)
3. Ticket disappears from table for users without reservation

---

### 3.6 EDGE CASE 6: Concurrent Reservation on Last Slot

**Scenario:** Two users try to reserve last slot simultaneously.

**System Behavior:**
1. Both users open reservation modal at 12:00:00
2. User A clicks "Dokončit" at 12:00:10
3. User B clicks "Dokončit" at 12:00:11

**Backend Logic (Database Transaction):**
```sql
BEGIN TRANSACTION;

-- Lock ticket row
SELECT * FROM tickets WHERE ticket_id = 'T-001-02' FOR UPDATE;

-- Check capacity
IF (available_capacity > 0) THEN
  -- Create reservation
  INSERT INTO reservations (...);
  
  -- Decrement capacity
  UPDATE tickets SET available_capacity = available_capacity - 1 WHERE ticket_id = 'T-001-02';
  
  COMMIT;
  RETURN success;
ELSE
  ROLLBACK;
  RETURN error("CAPACITY_EXHAUSTED");
END IF;
```

**User A Sees:**
```
✓ REZERVACE ÚSPĚŠNĚ VYTVOŘENA
...
```

**User B Sees:**
```
⚠ REZERVACE SE NEPODAŘILA

Tiket byl plně obsazen jiným uživatelem
během vytváření vaší rezervace.

[Zobrazit jiné tikety]  [Zavřít]
```

**Rationale:** Database-level locking prevents double-booking. First request wins.

---

### 3.7 EDGE CASE 7: User Runs Out of Global Slots During Reservation

**Scenario:** User has 1 remaining slot, opens reservation modal for 2 tickets simultaneously, completes both.

**System Behavior:**
1. User opens modal for Ticket A at 12:00
2. User opens modal for Ticket B at 12:01
3. User completes Ticket A reservation at 12:02 → Success (slot 10/10 used)
4. User completes Ticket B reservation at 12:03 → Error (no slots remaining)

**User Sees (Ticket B):**
```
⚠ REZERVACE SE NEPODAŘILA

Nemáte volné sloty pro vytvoření další rezervace.
Aktuálně: 10 / 10 slotů použito.

Slot se uvolní po:
• Dokončení rezervace (podpis investora)
• Zrušení rezervace
• Vypršení lhůty (SLA)

[Zobrazit moje rezervace →]  [Zavřít]
```

**Rationale:** Slot availability checked at confirmation time, not modal open time (prevents race conditions).

---

## PART 4: RESERVATION FLOW (A→Z WALKTHROUGH)

### 4.1 FLOW START: USER ON TICKET TABLE

**Context:** User is viewing ticket table, sees available tickets.

**Step 1: Identify Target Ticket**
- User scans table
- Sorted by: Commission (max → min) [DEFAULT]
- User focuses on ticket with high commission + matching investor

**Step 2: Expand Ticket Row (Optional)**
- User clicks expand chevron
- Views:
  - Full investment details
  - Security info
  - Availability (X / Y slots)
  - **Matching investors (3 recommended)**
  - Commission calculation

**Decision Moment 1:**
```
User asks: "Do I have a suitable investor for this ticket?"

If YES (sees matching investor in expanded row):
  → Confidence increased
  → Clicks "Rezervovat tiket"

If NO (no matching investors):
  → May skip this ticket
  → OR: Clicks "Zobrazit všechny investory" to search manually
```

**Step 3: Click "Rezervovat tiket" CTA**
- Preconditions checked (capacity, user slots, ticket active)
- Side panel modal opens (600px, slides from right)

---

### 4.2 RESERVATION MODAL: STEP 1 – TICKET CONFIRMATION

**Purpose:** Confirm ticket selection and slot quantity.

**User Sees:**
```
REZERVACE TIKETU T-001-02

Investice: 5 000 000 Kč
Výnos: 8,5% p.a. · 24 měsíců
Zajištění: Zástava 1. pořadí

Dostupnost: 7 / 10 slotů

┌──────────────────────────────────────────┐
│ VAŠE PROVIZE: 125 000 Kč                 │
│ (2,5% z investice)                       │
└──────────────────────────────────────────┘

[If multiple slots available:]
Kolik slotů chcete rezervovat?
[Selector: 1-5]

ℹ Rezervací si blokujete tento tiket pro svého klienta.
  Rezervace není závazek k investici – můžete ji kdykoli zrušit.

[Zrušit]  [Pokračovat →]
```

**User Action:**
- Reviews ticket (confirm correct selection)
- Sees commission reinforcement (2nd time: table → modal)
- Selects slot quantity (if applicable)
- Clicks "Pokračovat"

**System Action:**
- Validates slot quantity ≤ available capacity
- Validates slot quantity ≤ user global slots remaining
- Advances to Step 2

---

### 4.3 RESERVATION MODAL: STEP 2 – INVESTOR ASSIGNMENT

**Purpose:** Assign specific investor OR defer assignment.

**User Sees:**
```
REZERVACE TIKETU T-001-02 · Krok 2 / 4

Pro koho rezervujete tento tiket?

○ Existující investor

  [🔍 Vyhledat investora...]

  Doporučení investoři (shoda 80%+):

  ┌────────────────────────────────────────┐
  │ ☑ Andrea Nováková (92% shoda)         │
  │   Kapacita: 1 500 000 Kč · Aktivní    │
  └────────────────────────────────────────┘

  ┌────────────────────────────────────────┐
  │ ☐ Petr Svoboda (88% shoda)            │
  │   Kapacita: 800 000 Kč · Prospekt     │
  └────────────────────────────────────────┘

  [Zobrazit všechny investory →]

─ nebo ─

○ Investor bude doplněn později
  (Můžete přiřadit investora do 48 hodin)

ℹ Proč přiřazujeme investora?
  Rezervace je právo předložit tiket konkrétnímu klientovi.
  Jméno investora zůstane skryté až do potvrzení schůzky.

[← Zpět]  [Pokračovat →]
```

**Decision Moment 2:**
```
User asks: "Which investor should I assign?"

If CONFIDENT (sees recommended investor with high match):
  → Selects recommended investor
  → Clicks "Pokračovat"

If UNCERTAIN (no clear match):
  → Option A: Search all investors
  → Option B: Defer assignment ("Investor bude doplněn později")
```

**User Action:**
- Selects investor from recommendations OR searches OR defers
- Clicks "Pokračovat"

**System Action:**
- Stores investor selection (or null if deferred)
- Advances to Step 3

---

### 4.4 RESERVATION MODAL: STEP 3 – RISK ACKNOWLEDGEMENT

**Purpose:** Ensure user understands reservation mechanics (not legal disclaimer).

**User Sees:**
```
REZERVACE TIKETU T-001-02 · Krok 3 / 4

Před dokončením rezervace potvrďte:

☑ Rozumím, že rezervace není investice
  Rezervace je právo předložit tiket konkrétnímu klientovi.
  Investice vzniká až podpisem smlouvy.

☑ Rozumím lhůtám (SLA)
  Rezervace má časový limit. Po vypršení lhůty se rezervace
  automaticky zruší a slot se uvolní.
  └─ Lhůta pro akci: 48 hodin

☑ Rozumím, že slot je blokován
  Po dokončení rezervace se slot odečte z vašich dostupných
  slotů (9 / 10 volných).
  Slot se uvolní po zrušení nebo dokončení rezervace.

ℹ Co se stane po rezervaci?

  1. Slot je okamžitě blokován pro vás
  2. Dokumenty se připraví k odeslání investorovi
  3. Máte 48 hodin na odeslání investorovi
  4. Po podpisu získáváte provizi 125 000 Kč

[← Zpět]  [Pokračovat →]
```

**User Action:**
- Reads all three checkboxes (required)
- Checks all three (primary CTA disabled until all checked)
- Clicks "Pokračovat"

**System Action:**
- Validates all checkboxes checked
- Advances to Step 4

---

### 4.5 RESERVATION MODAL: STEP 4 – FINAL SUMMARY

**Purpose:** Final review, last chance to edit.

**User Sees:**
```
REZERVACE TIKETU T-001-02 · Krok 4 / 4

Kontrola a dokončení rezervace

┌──────────────────────────────────────────┐
│ TIKET                                    │
│ T-001-02 · 5 000 000 Kč · 8,5% p.a.     │
│ · 24 měsíců                              │
│ Zajištění: Zástava 1. pořadí             │
│                                [Upravit] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ INVESTOR                                 │
│ Andrea Nováková                          │
│ Kapacita: 1 500 000 Kč · Shoda: 92%     │
│                                [Upravit] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ SLOTY                                    │
│ Počet rezervovaných slotů: 1             │
│ Vaše zbývající sloty: 9 / 10             │
│                                [Upravit] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ PROVIZE                                  │
│ 125 000 Kč                               │
│ Splatnost: Po podpisu smlouvy investorem │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ LHŮTY (SLA)                              │
│ Rezervace platná: 48 hodin               │
│ Automatické zrušení: 3.1.2025 14:30     │
└──────────────────────────────────────────┘

Po dokončení rezervace:
• Slot bude okamžitě blokován
• Dokumenty budou připraveny k odeslání
• Obdržíte potvrzovací e-mail
• Rezervaci můžete zrušit kdykoli před podpisem

[← Zpět]  [Dokončit rezervaci]
```

**Decision Moment 3 (Final):**
```
User asks: "Is all information correct?"

If YES:
  → Clicks "Dokončit rezervaci"

If NO:
  → Clicks [Upravit] on specific section
  → Goes back to relevant step
  → All previous data preserved (no re-entry)
```

**User Action:**
- Reviews all sections
- Clicks "Dokončit rezervaci"

**System Action:**
- Modal state: → PENDING_VALIDATION (shows spinner)
- API call: POST /api/reservations/create

---

### 4.6 PENDING VALIDATION

**Purpose:** Server-side validation and conflict resolution.

**Backend Checks:**
1. Ticket still available? (capacity > 0)
2. User still has global slots? (remaining > 0)
3. User doesn't already have reservation on this ticket?
4. Investor valid? (if assigned)
5. No concurrent conflicts? (database-level lock)

**Success Path:**
```
API Response: 201 Created
{
  "reservation": { ... },
  "ticket_updated": { ... },
  "user_slots_updated": { ... }
}

Modal state: PENDING_VALIDATION → SUCCESS
```

**Error Path:**
```
API Response: 400 Bad Request / 409 Conflict
{
  "error": {
    "code": "CAPACITY_EXHAUSTED",
    "message": "...",
    "details": { ... }
  }
}

Modal state: PENDING_VALIDATION → ERROR
```

---

### 4.7 SUCCESS STATE

**User Sees:**
```
✓ REZERVACE ÚSPĚŠNĚ VYTVOŘENA

┌──────────────────────────────────────────┐
│ Číslo rezervace: RES-2025-001234         │
│ Vytvořeno: 1.1.2025 12:30                │
└──────────────────────────────────────────┘

Rezervace tiketu T-001-02 pro investora
Andrea Nováková byla úspěšně vytvořena.

┌──────────────────────────────────────────┐
│ CO DĚLAT DÁLE?                           │
│                                          │
│ 1. Připravte dokumenty pro investora     │
│    └─ Deadline: 3.1.2025 12:30 (48h)    │
│                                          │
│ 2. Odešlete dokumenty investorovi        │
│    └─ Investor musí potvrdit do 72h     │
│                                          │
│ 3. Po podpisu získáte provizi 125 000 Kč │
│                                          │
└──────────────────────────────────────────┘

ℹ Rezervace je aktivní a slot je blokován.
  Zbývající volné sloty: 9 / 10

[Detail rezervace]  [Zavřít]
```

**User Action Options:**
1. Click "Detail rezervace" → Navigate to reservation detail page
2. Click "Zavřít" → Close modal, return to ticket table

**System Actions:**
- Reservation created: state = ACTIVE
- Ticket capacity: decremented by 1
- User global slots: decremented by 1
- Commission created: state = EXPECTED
- SLA started: expires_at = now + 48 hours
- Email sent: Confirmation + next steps
- Activity log: Entry created

---

### 4.8 TICKET TABLE UPDATE (POST-RESERVATION)

**Visual Changes:**

**BEFORE:**
```
[Dostupný] | T-001-02 | 5M Kč | 8,5% | 24m | Zajištěno | 7/10 | 125k Kč | [Rezervovat tiket]
```

**AFTER:**
```
[Rezervováno mnou] | T-001-02 | 5M Kč | 8,5% | 24m | Zajištěno | 6/10 | 125k Kč | [Detail rezervace]

Background: Light blue tint
Badge: Blue with pin icon
CTA: Secondary outline button
```

**Expanded Row (NEW):**
```
Vaše rezervace: 1 aktivní

RES-2025-001234
├─ Vytvořeno: 1.1.2025 12:30
├─ Investor: Andrea Nováková
├─ SLA: Zbývá 47 hodin
│   └─ Automatické zrušení: 3.1.2025 12:30
└─ [Detail rezervace →]
```

---

### 4.9 RESERVATION LIFECYCLE (AFTER CREATION)

**State Progression (Normal Path):**
```
ACTIVE
  ↓ (Admin prepares documents)
AWAITING_DOCUMENTS (SLA paused)
  ↓ (Documents ready)
DOCUMENTS_READY (SLA resumed)
  ↓ (User sends to investor)
SENT_TO_INVESTOR (SLA running)
  ↓ (Investor signs)
INVESTOR_SIGNED (SLA paused)
  ↓ (Partner reviews)
PARTNER_REVIEWING (SLA paused)
  ↓ (Partner confirms)
PARTNER_CONFIRMED (SUCCESS)
```

**User Monitoring:**
- Dashboard widget: Shows all active reservations with SLA countdown
- Notifications: Triggered at 48h, 24h, 6h before SLA expiry
- Reservation detail page: Full timeline view with next action prompt

---

### 4.10 RESERVATION DETAIL PAGE (PRIMARY MANAGEMENT SURFACE)

**URL:** `/reservations/RES-2025-001234`

**Sections:**

**1. Header:**
```
REZERVACE RES-2025-001234
Status: Aktivní
SLA: Zbývá 46 hodin
```

**2. Timeline (Visual Progress):**
```
✓ Rezervace vytvořena (1.1.2025 12:30)
→ Dokumenty připraveny (aktuální krok)
  └─ Deadline: 3.1.2025 12:30
⏱ Odeslání investorovi
⏱ Podpis investorem
⏱ Potvrzení partnerem
⏱ Dokončeno
```

**3. Ticket Summary:**
```
Tiket: T-001-02
Investice: 5 000 000 Kč · 8,5% p.a. · 24 měsíců
Provize: 125 000 Kč
[Zobrazit tiket →]
```

**4. Investor:**
```
Andrea Nováková
Kapacita: 1 500 000 Kč · Shoda: 92%
[Zobrazit investora →]
```

**5. Actions:**
```
[Primary CTA: State-dependent]
Examples:
- "Odeslat dokumenty investorovi" (if DOCUMENTS_READY)
- "Čeká na podpis investora" (if SENT_TO_INVESTOR, disabled)
- "Dokončeno" (if PARTNER_CONFIRMED, disabled)

[Secondary CTA: Always available]
- "Zrušit rezervaci" (if non-terminal state)
  ↓ Opens confirmation dialog with consequences
```

**6. Documents (If available):**
```
Dokumenty k odeslání:
├─ Investiční memorandum (PDF, 2.4 MB)
├─ Rezervační smlouva (PDF, 0.8 MB)
└─ Ocenění zajištění (PDF, 1.2 MB)

[Stáhnout vše]
```

---

## PART 5: UX RATIONALE (WHY THIS DESIGN WORKS)

### 5.1 TICKET STATUS VISIBILITY SUPPORTS FAST DECISION-MAKING

**Problem:** User cannot decide which ticket to reserve if status is ambiguous.

**Solution:**
- **Badge + Icon + Text** = Triple-coded information (color, shape, words)
- **Slot count visible** = User sees exact scarcity ("7 / 10" not "Almost full")
- **User's own reservations highlighted** = Visual salience prevents accidental double-booking

**Result:** User can scan 10 tickets in 15 seconds and identify:
1. Which tickets are available
2. Which tickets they already reserved
3. Which tickets have high commission
4. Which tickets have limited capacity

---

### 5.2 SLA SHOWN ONLY WHEN RELEVANT = REDUCES NOISE

**Problem:** Showing everyone's SLA creates information overload.

**Solution:**
- **User's SLA shown**: When user has active reservation (RESERVED_BY_ME, IN_SIGNING)
- **Others' SLA hidden**: Other users' countdowns are irrelevant + privacy concern

**Result:** User focuses on THEIR responsibilities, not distracted by others' timelines.

---

### 5.3 MATCHING INVESTORS PRE-SHOWN = REMOVES UNCERTAINTY

**Problem:** User hesitates: "Do I have a suitable investor?"

**Solution:**
- **Expanded row shows top 3 matches** BEFORE user clicks "Rezervovat"
- **Match percentage transparent** (not black-box algorithm)
- **Investor capacity visible** (can they afford this ticket?)

**Result:** User knows they have suitable investor BEFORE starting reservation process.
**Expected Impact:** 15-25% increase in reservation completion rate.

---

### 5.4 PROGRESSIVE DISCLOSURE = REDUCES COGNITIVE LOAD

**Problem:** Too much information at once = decision paralysis.

**Solution:**
- **Table collapsed row**: 7 essential data points only
- **Table expanded row**: Full detail ON DEMAND (click to expand)
- **Reservation modal**: 4 focused steps, one decision per step

**Result:** User processes information in digestible chunks.

---

### 5.5 REVERSIBILITY CLARITY = REDUCES FEAR OF COMMITMENT

**Problem:** User afraid to commit if action seems irreversible.

**Solution:**
- **Step 3 explicitly states**: "Můžete zrušit kdykoli před podpisem"
- **Step 4 all sections editable**: [Upravit] links allow corrections
- **Cancellation flow**: Clear, penalty-free (no dark patterns)

**Result:** User feels in control, less hesitation.

---

### 5.6 TERMINAL STATES ARE IMMUTABLE = AUDIT TRAIL INTEGRITY

**Problem:** Allowing state reversals creates compliance risk.

**Solution:**
- **PARTNER_CONFIRMED**: Cannot be cancelled (success is final)
- **EXPIRED**: Cannot be revived (SLA violation is permanent record)
- **CANCELLED_BY_USER**: Cannot be undone (cancellation is logged)

**Result:** Audit trail is trustworthy, compliance-safe.

---

### 5.7 SLA PAUSES DURING EXTERNAL DEPENDENCIES = FAIRNESS

**Problem:** User penalized for delays outside their control.

**Solution:**
- **SLA paused during**:
  - AWAITING_DOCUMENTS (admin preparing)
  - INVESTOR_SIGNED (waiting for partner)
  - PARTNER_REVIEWING (partner decision pending)

**Result:** User only accountable for actions within their control.

---

### 5.8 FACTUAL URGENCY (NOT ARTIFICIAL) = BUILDS TRUST

**Problem:** Marketing urgency feels manipulative, professional users reject it.

**Solution:**
- **"Poslední sloty"**: Shows exact capacity ("3 / 10"), not vague "Almost full"
- **SLA countdown**: Shows real deadline (system constraint), not sales pressure
- **Partner deadline**: Shows external constraint, not platform-created urgency

**Result:** User trusts platform, urgency feels legitimate.

---

## PART 6: DEVELOPER IMPLEMENTATION GUIDE

### 6.1 DATABASE SCHEMA (KEY TABLES)

**tickets table:**
```sql
CREATE TABLE tickets (
  ticket_id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  investment_amount_czk BIGINT NOT NULL,
  yield_pa_percentage DECIMAL(5,2) NOT NULL,
  duration_months INT NOT NULL,
  commission_amount_czk BIGINT NOT NULL,
  commission_rate_percentage DECIMAL(5,2) NOT NULL,
  total_capacity INT NOT NULL,
  available_capacity INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_closed BOOLEAN DEFAULT FALSE,
  closed_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**reservations table:**
```sql
CREATE TABLE reservations (
  reservation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_number VARCHAR(50) UNIQUE NOT NULL,
  ticket_id VARCHAR(50) REFERENCES tickets(ticket_id),
  user_id UUID REFERENCES users(user_id),
  investor_id UUID REFERENCES investors(investor_id),
  status VARCHAR(50) NOT NULL,
  slots_count INT DEFAULT 1,
  sla_duration_hours INT DEFAULT 48,
  sla_started_at TIMESTAMP,
  sla_expires_at TIMESTAMP,
  sla_paused BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  expired_at TIMESTAMP,
  cancellation_reason TEXT,
  cancellation_type VARCHAR(50)
);
```

**reservation_status_history table:**
```sql
CREATE TABLE reservation_status_history (
  history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(reservation_id),
  from_status VARCHAR(50),
  to_status VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  changed_by_user_id UUID,
  change_reason TEXT
);
```

---

### 6.2 API ENDPOINTS SUMMARY

**Ticket Operations:**
```
GET    /api/tickets?project_id={id}&filters={...}&sort={...}
GET    /api/tickets/{ticket_id}
GET    /api/tickets/{ticket_id}/availability
GET    /api/tickets/{ticket_id}/matching-investors
```

**Reservation Operations:**
```
POST   /api/reservations/create
GET    /api/reservations/{reservation_id}
PUT    /api/reservations/{reservation_id}/cancel
GET    /api/reservations?user_id={id}&status={...}
```

**System Operations:**
```
CRON   /api/reservations/check-sla-expiry (every 5min)
CRON   /api/reservations/cleanup-drafts (every 30min)
```

---

### 6.3 STATE MACHINE IMPLEMENTATION (PSEUDO-CODE)

```javascript
class ReservationStateMachine {
  constructor(reservation) {
    this.reservation = reservation
  }

  // Valid transitions map
  validTransitions = {
    DRAFT: ["PENDING_VALIDATION"],
    PENDING_VALIDATION: ["ACTIVE", "ERROR"],
    ACTIVE: ["AWAITING_DOCUMENTS", "CANCELLED_BY_USER", "EXPIRED", "CANCELLED_BY_SYSTEM"],
    AWAITING_DOCUMENTS: ["DOCUMENTS_READY", "CANCELLED_BY_USER", "EXPIRED", "CANCELLED_BY_SYSTEM"],
    DOCUMENTS_READY: ["SENT_TO_INVESTOR", "CANCELLED_BY_USER", "EXPIRED"],
    SENT_TO_INVESTOR: ["INVESTOR_SIGNED", "CANCELLED_BY_USER", "EXPIRED"],
    INVESTOR_SIGNED: ["PARTNER_REVIEWING", "CANCELLED_BY_USER"],
    PARTNER_REVIEWING: ["PARTNER_CONFIRMED", "REJECTED_BY_PARTNER", "CANCELLED_BY_USER"],
    PARTNER_CONFIRMED: [], // Terminal
    EXPIRED: [], // Terminal
    CANCELLED_BY_USER: [], // Terminal
    CANCELLED_BY_SYSTEM: [], // Terminal
    REJECTED_BY_PARTNER: [] // Terminal
  }

  canTransitionTo(newStatus) {
    return this.validTransitions[this.reservation.status].includes(newStatus)
  }

  transitionTo(newStatus, actor, reason = null) {
    if (!this.canTransitionTo(newStatus)) {
      throw new Error(`Invalid transition: ${this.reservation.status} → ${newStatus}`)
    }

    const oldStatus = this.reservation.status

    // Update reservation
    this.reservation.status = newStatus
    this.reservation.updated_at = new Date()

    // Log status change
    this.logStatusChange(oldStatus, newStatus, actor, reason)

    // Side effects
    this.executeSideEffects(oldStatus, newStatus)

    return this.reservation
  }

  executeSideEffects(fromStatus, toStatus) {
    // Release slot on terminal failure states
    if (["EXPIRED", "CANCELLED_BY_USER", "CANCELLED_BY_SYSTEM", "REJECTED_BY_PARTNER"].includes(toStatus)) {
      this.releaseSlot()
      this.updateCommissionStatus("LOST")
      this.sendNotification("reservation_terminated")
    }

    // Lock slot permanently on success
    if (toStatus === "PARTNER_CONFIRMED") {
      this.updateCommissionStatus("EARNED")
      this.sendNotification("reservation_success")
    }

    // Pause/Resume SLA
    if (toStatus === "AWAITING_DOCUMENTS" || toStatus === "INVESTOR_SIGNED" || toStatus === "PARTNER_REVIEWING") {
      this.pauseSLA()
    }

    if (toStatus === "DOCUMENTS_READY" && fromStatus === "AWAITING_DOCUMENTS") {
      this.resumeSLA()
    }

    // Start SLA
    if (toStatus === "ACTIVE") {
      this.startSLA()
    }
  }

  releaseSlot() {
    // Increment ticket capacity
    db.tickets.update({
      where: { ticket_id: this.reservation.ticket_id },
      data: { available_capacity: { increment: this.reservation.slots_count } }
    })

    // Free user global slots
    db.users.update({
      where: { user_id: this.reservation.user_id },
      data: { global_slots_used: { decrement: this.reservation.slots_count } }
    })
  }

  startSLA() {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + this.reservation.sla_duration_hours * 60 * 60 * 1000)

    this.reservation.sla_started_at = now
    this.reservation.sla_expires_at = expiresAt
    this.reservation.sla_paused = false
  }

  pauseSLA() {
    this.reservation.sla_paused = true
  }

  resumeSLA() {
    this.reservation.sla_paused = false
  }
}
```

---

## CONCLUSION

**This document provides:**
✅ Complete ticket status taxonomy (11 statuses)
✅ Complete reservation state machine (14 states)
✅ All valid transitions explicitly defined
✅ All invalid transitions explicitly blocked
✅ SLA behavior per state
✅ UI treatment per status
✅ Error handling for 7 edge cases
✅ A→Z reservation flow walkthrough
✅ UX rationale for design decisions
✅ Developer implementation guide

**This system is:**
- **Deterministic**: Same input → Same output
- **Compliance-safe**: Audit trail preserved, terminal states immutable
- **Professional**: No marketing pressure, factual urgency only
- **User-centric**: Clarity, reversibility, transparency

**Implementation Status:** Ready for development

**Next Steps:**
1. Backend: Implement state machine + API endpoints
2. Frontend: Implement ticket table + reservation modal
3. QA: Test all state transitions + edge cases
4. Compliance: Review SLA logic + cancellation policies
5. Deploy: Gradual rollout with monitoring

---

**END OF DOCUMENT**

**Last Updated:** 2025-01-01
**Document Status:** Complete and Authoritative
**Document Type:** State Machine Specification
**Usage:** Reference for development, QA, compliance review
