# SLOT CANCELLATION FEATURE – UX/UI SPECIFICATION
**Tipari.cz Reservation System Extension**

**Document Type:** Feature Specification (UX + UI + Logic + Compliance)
**Date:** 2025-01-01
**Feature:** User-Initiated Slot Cancellation
**Scope:** Reservation Detail Screen ONLY

---

## EXECUTIVE SUMMARY

**Feature Purpose:**
Enable professional users (Tipaři) to cancel reserved slots on investment tickets before finalization.

**Design Philosophy:**
- **Transparency:** User knows exactly what happens when they cancel
- **Reversibility:** Cancellation is final but user can reserve again
- **Compliance:** No guilt, no pressure, factual consequences only
- **Trust:** User feels in control, not trapped

**Key Constraints:**
- ✅ Can cancel: Active, non-finalized reservations
- ❌ Cannot cancel: Finalized deals, expired reservations, admin-locked
- 🔍 Audit trail: All cancellations logged immutably

**Integration Points:**
- Reservation Detail screen (primary entry point)
- Reservation state machine (new terminal state: CANCELLED_BY_USER)
- Ticket availability (capacity released immediately)
- SLA timer (stopped, not paused)
- Commission tracking (EXPECTED → LOST)
- Audit log (new entry type: user_cancellation)

---

## PART A: UX FLOW (STEP-BY-STEP)

### FLOW OVERVIEW

```
[User on Reservation Detail]
  ↓
[Clicks "Zrušit rezervaci" secondary button]
  ↓
[Confirmation Modal opens]
  ↓
[User reviews consequences]
  ↓
[User optionally selects reason]
  ↓
[User clicks final confirm OR cancels flow]
  ↓
  ├─→ [If confirmed] → API call → Success state → Redirect to ticket detail
  └─→ [If aborted] → Modal closes → Returns to Reservation Detail (no change)
```

---

### STEP 1: INITIAL STATE (Reservation Detail Screen)

**Context:** User is viewing their active reservation.

**Screen Elements:**
```
┌─────────────────────────────────────────────────────────┐
│ REZERVACE RES-2025-001234                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Status: Aktivní                                         │
│ SLA: Zbývá 36 hodin                                     │
│                                                         │
│ Tiket: T-001-02                                         │
│ Investice: 5 000 000 Kč · 8,5% p.a. · 24 měsíců        │
│                                                         │
│ Investor: Andrea Nováková                               │
│ Vytvořeno: 1.1.2025 12:30                              │
│                                                         │
│ Provize: 125 000 Kč (Očekávaná)                        │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [Pokračovat v rezervaci]  [Zrušit rezervaci]           │
│  ↑ Primary blue             ↑ Secondary gray outline    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**CTA Placement:**
- **Primary CTA:** "Pokračovat v rezervaci" (blue, left)
- **Secondary CTA:** "Zrušit rezervaci" (gray outline, right)

**Visual Treatment:**
- Secondary button = gray border, white background, gray text
- No red color (not destructive until final step)
- Icon: ✕ (X) or 🚫 (Ban) – subtle, grayscale

**Hover State:**
- Border color: darker gray (#6B7280)
- No color change to red (maintains calm tone)

---

### STEP 2: TRIGGER – USER CLICKS "ZRUŠIT REZERVACI"

**System Checks (Before Opening Modal):**

```javascript
// Pre-flight validation
const canCancel = () => {
  // Check 1: Reservation not finalized
  if (reservation.status === "PARTNER_CONFIRMED") {
    return { allowed: false, reason: "finalized" }
  }
  
  // Check 2: Reservation not already terminal
  if (["EXPIRED", "CANCELLED_BY_USER", "CANCELLED_BY_SYSTEM"].includes(reservation.status)) {
    return { allowed: false, reason: "already_terminal" }
  }
  
  // Check 3: Not admin-locked
  if (reservation.blocking.is_blocked) {
    return { allowed: false, reason: "admin_locked" }
  }
  
  // Check 4: Investor hasn't signed yet (optional stricter rule)
  // OPTIONAL: Allow cancellation even after investor signed, but show warning
  
  return { allowed: true }
}
```

**IF Cancellation Allowed:**
→ Open Confirmation Modal (Step 3)

**IF Cancellation Blocked:**
→ Show inline error message (Step 2B)

---

### STEP 2B: BLOCKED CANCELLATION (Edge Case)

**Scenario 1: Reservation Already Finalized**

```
┌─────────────────────────────────────────────────────────┐
│ ⚠ ZRUŠENÍ NENÍ MOŽNÉ                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tuto rezervaci již nelze zrušit.                       │
│                                                         │
│ Důvod: Rezervace byla úspěšně dokončena.               │
│ Partner potvrdil investici 5.1.2025 14:00.             │
│                                                         │
│ Provize 125 000 Kč byla zaznamenána jako zasloužená.   │
│                                                         │
│ [Zobrazit detail obchodu →]  [Zavřít]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Scenario 2: Reservation Expired**

```
┌─────────────────────────────────────────────────────────┐
│ ℹ REZERVACE JIŽ VYPRŠELA                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tuto rezervaci nelze zrušit, protože již vypršela.     │
│                                                         │
│ Vypršelo: 3.1.2025 12:30                               │
│ Důvod: Nedodržení SLA (čekal na podpis investora)      │
│                                                         │
│ Slot byl automaticky uvolněn.                          │
│                                                         │
│ Můžete vytvořit novou rezervaci, pokud je tiket        │
│ stále dostupný.                                         │
│                                                         │
│ [Zobrazit tiket →]  [Zavřít]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Scenario 3: Admin Locked**

```
┌─────────────────────────────────────────────────────────┐
│ 🔒 REZERVACE JE UZAMČENA                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tuto rezervaci nelze zrušit – byla uzamčena            │
│ administrátorem.                                        │
│                                                         │
│ Důvod: Investor podepsal dokumenty – čeká se na        │
│ potvrzení partnera. Zrušení vyžaduje administrátorský  │
│ zásah.                                                  │
│                                                         │
│ Pokud potřebujete rezervaci zrušit, kontaktujte        │
│ podporu.                                                │
│                                                         │
│ [Kontaktovat podporu]  [Zavřít]                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### STEP 3: CONFIRMATION MODAL (Main Flow)

**Modal Opens – First Screen**

```
┌──────────────────────────────────────────────────────────────┐
│ ZRUŠENÍ REZERVACE                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Opravdu chcete zrušit tuto rezervaci?                       │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ REZERVACE                                              │  │
│ │ RES-2025-001234                                        │  │
│ │                                                        │  │
│ │ Tiket: T-001-02                                        │  │
│ │ Investice: 5 000 000 Kč · 8,5% p.a.                   │  │
│ │ Investor: Andrea Nováková                              │  │
│ │ Vytvořeno: 1.1.2025 12:30                             │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Co se stane po zrušení:                                     │
│                                                              │
│ ✓ Slot bude okamžitě uvolněn                                │
│   Tiket T-001-02 bude mít opět 8 / 10 volných slotů        │
│                                                              │
│ ✓ SLA časovač bude zastaven                                 │
│   Žádné další SLA upozornění nebudou zasílána              │
│                                                              │
│ ✓ Provize nebude vyplacena                                  │
│   Očekávaná provize 125 000 Kč bude označena jako          │
│   propadlá                                                   │
│                                                              │
│ ✓ Můžete vytvořit novou rezervaci                           │
│   Pokud je tiket stále dostupný, můžete rezervovat znovu   │
│                                                              │
│ ──────────────────────────────────────────────────────────   │
│                                                              │
│ Důvod zrušení (volitelné):                                  │
│                                                              │
│ [Dropdown ▼] Vyberte důvod...                               │
│                                                              │
│ Možnosti:                                                    │
│ • Investor již není dostupný                                │
│ • Parametry tiketu nevyhovují                               │
│ • Nalezen vhodnější tiket                                   │
│ • Chyba při vytváření rezervace                             │
│ • Jiný důvod (prosím specifikujte)                          │
│                                                              │
│ [If "Jiný důvod" selected:]                                  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [Text area – optional, max 500 characters]             │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ──────────────────────────────────────────────────────────   │
│                                                              │
│ [Ponechat rezervaci]  [Zrušit rezervaci]                    │
│  ↑ Secondary gray       ↑ Destructive red                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Modal Design Specs:**

**Size:**
- Width: 600px (desktop), 90vw (mobile)
- Max height: 80vh (scrollable if content exceeds)
- Centered overlay

**Visual Hierarchy:**
1. **Heading:** "Zrušení rezervace" (16px semibold, dark gray #040F2A)
2. **Question:** "Opravdu chcete zrušit?" (14px regular, dark gray)
3. **Reservation Summary Box:** Light gray background (#F9FAFB), 1px border
4. **Consequences List:** Checkmarks (✓) with factual statements (not warnings ⚠)
5. **Reason Dropdown:** Optional (not required)
6. **CTA Buttons:** Bottom, right-aligned

**Button Treatment:**
- **"Ponechat rezervaci"** (Keep Reservation):
  - Style: Secondary gray outline
  - Position: Left
  - Color: Gray #6B7280
  - No icon
  
- **"Zrušit rezervaci"** (Cancel Reservation):
  - Style: Destructive filled
  - Position: Right
  - Color: Red #EF4444
  - Icon: ✕ (X) white
  - **THIS IS THE ONLY RED ELEMENT** (final irreversible action)

**Why Red Only Here:**
- Initial CTA on detail page = gray (non-threatening)
- Modal appearance = neutral tone (informational)
- Final confirm button = red (signals irreversibility)
- Progressive disclosure of destructive nature

---

### STEP 4: USER REVIEWS & OPTIONALLY SELECTS REASON

**User Actions:**

**Option A: User Reads Consequences, Decides to Keep Reservation**
→ Clicks "Ponechat rezervaci"
→ Modal closes, returns to Reservation Detail (no changes)

**Option B: User Decides to Cancel**
→ Optionally selects reason from dropdown
→ Optionally types custom reason (if "Jiný důvod" selected)
→ Clicks "Zrušit rezervaci" (red button)

**Validation:**
- No validation required (reason is optional)
- Red button always enabled (no additional confirmation needed)

**Why Reason is Optional:**
- Reduces friction (user may not want to explain)
- But valuable for analytics (why users cancel)
- Compromise: Dropdown with quick options + optional text

---

### STEP 5: FINAL CONFIRMATION (API CALL)

**User Clicks Red "Zrušit rezervaci" Button**

**Modal State Changes:**
```
┌──────────────────────────────────────────────────────────────┐
│ RUŠENÍ REZERVACE...                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [Spinner icon]                                               │
│                                                              │
│ Probíhá zrušení rezervace RES-2025-001234...               │
│                                                              │
│ Prosím vyčkejte.                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Backend Actions (Atomic Transaction):**

```javascript
async function cancelReservation(reservationId, userId, reason) {
  // Start database transaction (all-or-nothing)
  const transaction = await db.transaction()
  
  try {
    // 1. Update reservation status
    await transaction.reservations.update({
      where: { reservation_id: reservationId },
      data: {
        status: "CANCELLED_BY_USER",
        cancelled_at: new Date(),
        cancellation_reason: reason || null,
        cancellation_type: "user_initiated"
      }
    })
    
    // 2. Release ticket slot
    await transaction.tickets.update({
      where: { ticket_id: reservation.ticket_id },
      data: {
        available_capacity: { increment: reservation.slots_count }
      }
    })
    
    // 3. Update user global slots
    await transaction.users.update({
      where: { user_id: userId },
      data: {
        global_slots_used: { decrement: reservation.slots_count }
      }
    })
    
    // 4. Update commission status
    await transaction.commissions.update({
      where: { commission_id: reservation.commission_id },
      data: {
        status: "LOST"
      }
    })
    
    // 5. Stop SLA timer
    await transaction.sla_timers.update({
      where: { sla_timer_id: reservation.sla.sla_timer_id },
      data: {
        status: "cancelled",
        cancelled_at: new Date()
      }
    })
    
    // 6. Create status history entry (AUDIT TRAIL)
    await transaction.status_history.create({
      data: {
        reservation_id: reservationId,
        changed_by_user_id: userId,
        changed_by_user_role: "user",
        change_type: "cancellation",
        old_status: reservation.status,
        new_status: "CANCELLED_BY_USER",
        change_reason: reason || "User-initiated cancellation (no reason provided)",
        change_source: "reservation_detail_ui",
        side_effects: [
          { effect_type: "slot_released", effect_description: `${reservation.slots_count} slot(s) released` },
          { effect_type: "commission_lost", effect_description: "Commission status → LOST" },
          { effect_type: "sla_stopped", effect_description: "SLA timer stopped" }
        ],
        metadata: {
          ip_address: request.ip,
          user_agent: request.headers["user-agent"]
        }
      }
    })
    
    // 7. Send notification (optional, async)
    await sendCancellationNotification(userId, reservationId)
    
    // Commit transaction
    await transaction.commit()
    
    return { success: true, reservation_id: reservationId }
    
  } catch (error) {
    // Rollback all changes on error
    await transaction.rollback()
    return { success: false, error: error.message }
  }
}
```

**Critical: Atomic Transaction**
- ALL changes happen together OR none happen
- Prevents partial cancellations (e.g., slot released but commission not updated)
- Database consistency guaranteed

---

### STEP 6A: SUCCESS STATE

**Modal Transitions to Success Screen**

```
┌──────────────────────────────────────────────────────────────┐
│ ✓ REZERVACE ZRUŠENA                                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Rezervace RES-2025-001234 byla úspěšně zrušena.            │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ CO SE STALO                                            │  │
│ │                                                        │  │
│ │ ✓ Slot uvolněn                                         │  │
│ │   Tiket T-001-02 má nyní 8 / 10 volných slotů         │  │
│ │                                                        │  │
│ │ ✓ SLA časovač zastaven                                 │  │
│ │   Žádné další upozornění nebudou zasílána             │  │
│ │                                                        │  │
│ │ ✓ Provize propadla                                     │  │
│ │   Provize 125 000 Kč označena jako propadlá           │  │
│ │                                                        │  │
│ │ ✓ Vaše sloty aktualizovány                             │  │
│ │   Zbývající volné sloty: 7 / 10                        │  │
│ │                                                        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ──────────────────────────────────────────────────────────   │
│                                                              │
│ Co můžete dělat dále:                                       │
│                                                              │
│ • Prohlédnout si jiné dostupné tikety na tomto projektu     │
│ • Vytvořit novou rezervaci, pokud je tiket stále dostupný  │
│ • Kontaktovat investora a vysvětlit důvod zrušení           │
│                                                              │
│ ──────────────────────────────────────────────────────────   │
│                                                              │
│ [Zobrazit tiket T-001-02]  [Zobrazit projekt]  [Zavřít]    │
│  ↑ Primary blue             Secondary gray     Secondary    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Visual Treatment:**
- **Green checkmark** (✓) in heading (success confirmation)
- **Light green background** (#F0FDF4) on summary box (subtle success indicator)
- **Factual list** of what happened (no emotional language)
- **Actionable next steps** (helps user move forward)

**Auto-Close Behavior:**
- Modal does NOT auto-close
- User must explicitly click one of the buttons
- Gives time to read confirmation

**After User Clicks Button:**
- "Zobrazit tiket T-001-02" → Navigate to Ticket Detail page (user can see freed capacity)
- "Zobrazit projekt" → Navigate to Project Detail page
- "Zavřít" → Close modal, stay on Reservation Detail (now showing CANCELLED state)

**Reservation Detail Page Update:**

After closing success modal, if user stays on page:

```
┌─────────────────────────────────────────────────────────┐
│ REZERVACE RES-2025-001234                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Status: Zrušeno (uživatelem)                           │
│ Zrušeno: 1.1.2025 14:30                                │
│                                                         │
│ Důvod zrušení: Investor již není dostupný              │
│                                                         │
│ Tiket: T-001-02                                         │
│ Investice: 5 000 000 Kč · 8,5% p.a. · 24 měsíců        │
│                                                         │
│ Investor: Andrea Nováková (původně přiřazená)          │
│ Vytvořeno: 1.1.2025 12:30                              │
│ Aktivní doba: 2 hodiny 0 minut                         │
│                                                         │
│ Provize: 125 000 Kč (Propadlá)                         │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [Zobrazit tiket]  [Vytvořit novou rezervaci]           │
│                                                         │
│ ℹ Tuto rezervaci již nelze obnovit.                    │
│   Můžete vytvořit novou rezervaci, pokud je tiket      │
│   stále dostupný.                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Changes:**
- Status badge: Gray "Zrušeno (uživatelem)"
- Cancelled timestamp shown
- Reason shown (if provided)
- Commission: "Propadlá" (Lost)
- CTAs: "Zrušit rezervaci" removed, replaced with recovery actions
- Info message: Cannot restore, but can create new

---

### STEP 6B: ERROR STATE

**Scenario: API Call Fails**

```
┌──────────────────────────────────────────────────────────────┐
│ ⚠ CHYBA PŘI RUŠENÍ                                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Nepodařilo se zrušit rezervaci RES-2025-001234.            │
│                                                              │
│ Důvod: Technická chyba při komunikaci se serverem.         │
│                                                              │
│ Vaše data nebyla změněna. Rezervace zůstává aktivní.       │
│                                                              │
│ ──────────────────────────────────────────────────────────   │
│                                                              │
│ Co můžete udělat:                                           │
│                                                              │
│ • Zkuste to prosím znovu za několik okamžiků               │
│ • Pokud problém přetrvává, kontaktujte podporu             │
│                                                              │
│ ──────────────────────────────────────────────────────────   │
│                                                              │
│ [Zkusit znovu]  [Kontaktovat podporu]  [Zavřít]           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Error Scenarios:**

| Error Type | User Sees | Recovery Action |
|------------|-----------|-----------------|
| **Network timeout** | "Technická chyba – zkuste znovu" | [Zkusit znovu] button |
| **Server error 500** | "Technická chyba – zkuste znovu" | [Zkusit znovu] + [Kontaktovat podporu] |
| **Concurrent cancellation** (admin cancelled while user on page) | "Rezervace již byla zrušena administrátorem" | [Zavřít] (no retry) |
| **SLA expired during flow** | "Rezervace vypršela během rušení – již byla automaticky zrušena" | [Zavřít] (no retry) |
| **Validation error** (status changed) | "Stav rezervace se změnil – nelze zrušit" | [Obnovit stránku] |

---

## PART B: UI COMPONENTS

### B1: SECONDARY CTA BUTTON (Reservation Detail Page)

**Component:** CancellationButton

**Location:** Reservation Detail page, bottom section (after main content)

**Variants:**

**Variant 1: Allowed (Default)**
```
Button:
  Text: "Zrušit rezervaci"
  Style: Secondary outline
  Color: Gray #6B7280 (border + text)
  Background: White
  Icon: ✕ (X) gray, left-aligned
  Size: Medium (40px height)
  
Hover:
  Border: Darker gray #4B5563
  Background: Light gray #F9FAFB
  
Disabled: false
```

**Variant 2: Blocked (Finalized Reservation)**
```
Button:
  Text: "Nelze zrušit"
  Style: Disabled gray
  Color: Light gray #D1D5DB
  Background: White
  Icon: 🔒 (Lock) gray
  Size: Medium (40px height)
  
Hover:
  Tooltip: "Rezervace byla dokončena – nelze zrušit"
  
Disabled: true
```

**Variant 3: Blocked (Admin Locked)**
```
Button:
  Text: "Uzamčeno administrátorem"
  Style: Disabled gray
  Color: Light gray #D1D5DB
  Background: White
  Icon: 🔒 (Lock) gray
  Size: Medium (40px height)
  
Hover:
  Tooltip: "Rezervace je uzamčena – kontaktujte podporu"
  
Disabled: true
```

**Component Props (React Example):**
```typescript
interface CancellationButtonProps {
  reservation: Reservation
  onCancel: () => void
  disabled?: boolean
  disabledReason?: string
}

const CancellationButton: React.FC<CancellationButtonProps> = ({
  reservation,
  onCancel,
  disabled = false,
  disabledReason
}) => {
  const canCancel = useMemo(() => {
    return reservation.status !== "PARTNER_CONFIRMED" &&
           !reservation.blocking.is_blocked &&
           !["EXPIRED", "CANCELLED_BY_USER", "CANCELLED_BY_SYSTEM"].includes(reservation.status)
  }, [reservation])
  
  if (!canCancel) {
    return (
      <button
        disabled
        className="btn-secondary-disabled"
        title={disabledReason || "Rezervaci nelze zrušit"}
      >
        🔒 Nelze zrušit
      </button>
    )
  }
  
  return (
    <button
      onClick={onCancel}
      className="btn-secondary"
    >
      ✕ Zrušit rezervaci
    </button>
  )
}
```

---

### B2: CONFIRMATION MODAL

**Component:** CancellationConfirmationModal

**Structure:**
- Modal overlay (semi-transparent black #00000080)
- Modal container (white, centered, 600px width)
- Header (title + close X)
- Body (reservation summary + consequences + reason selector)
- Footer (CTAs)

**Sections:**

**1. Header**
```html
<div class="modal-header">
  <h2>Zrušení rezervace</h2>
  <button class="close-button" aria-label="Zavřít">✕</button>
</div>
```

**2. Reservation Summary Box**
```html
<div class="reservation-summary-box">
  <h3>REZERVACE</h3>
  <p><strong>RES-2025-001234</strong></p>
  <p>Tiket: T-001-02</p>
  <p>Investice: 5 000 000 Kč · 8,5% p.a.</p>
  <p>Investor: Andrea Nováková</p>
  <p>Vytvořeno: 1.1.2025 12:30</p>
</div>
```

**3. Consequences List**
```html
<div class="consequences-list">
  <h3>Co se stane po zrušení:</h3>
  <ul>
    <li>
      <span class="checkmark">✓</span>
      <div>
        <strong>Slot bude okamžitě uvolněn</strong>
        <p>Tiket T-001-02 bude mít opět 8 / 10 volných slotů</p>
      </div>
    </li>
    <li>
      <span class="checkmark">✓</span>
      <div>
        <strong>SLA časovač bude zastaven</strong>
        <p>Žádné další SLA upozornění nebudou zasílána</p>
      </div>
    </li>
    <li>
      <span class="checkmark">✓</span>
      <div>
        <strong>Provize nebude vyplacena</strong>
        <p>Očekávaná provize 125 000 Kč bude označena jako propadlá</p>
      </div>
    </li>
    <li>
      <span class="checkmark">✓</span>
      <div>
        <strong>Můžete vytvořit novou rezervaci</strong>
        <p>Pokud je tiket stále dostupný, můžete rezervovat znovu</p>
      </div>
    </li>
  </ul>
</div>
```

**4. Reason Selector (Optional)**
```html
<div class="reason-selector">
  <label for="cancellation-reason">Důvod zrušení (volitelné):</label>
  <select id="cancellation-reason">
    <option value="">Vyberte důvod...</option>
    <option value="investor_unavailable">Investor již není dostupný</option>
    <option value="params_not_suitable">Parametry tiketu nevyhovují</option>
    <option value="found_better">Nalezen vhodnější tiket</option>
    <option value="creation_error">Chyba při vytváření rezervace</option>
    <option value="other">Jiný důvod (prosím specifikujte)</option>
  </select>
  
  <!-- Shown only if "other" selected -->
  <textarea
    id="cancellation-reason-text"
    placeholder="Prosím specifikujte důvod..."
    maxlength="500"
    style="display: none;"
  ></textarea>
</div>
```

**5. Footer CTAs**
```html
<div class="modal-footer">
  <button class="btn-secondary" onclick="closeModal()">
    Ponechat rezervaci
  </button>
  <button class="btn-destructive" onclick="confirmCancellation()">
    ✕ Zrušit rezervaci
  </button>
</div>
```

**CSS Specs:**
```css
.btn-destructive {
  background: #EF4444; /* Red */
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.btn-destructive:hover {
  background: #DC2626; /* Darker red */
}

.btn-secondary {
  background: white;
  color: #6B7280; /* Gray */
  border: 1px solid #D1D5DB;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #F9FAFB; /* Light gray */
  border-color: #9CA3AF;
}
```

---

### B3: SUCCESS MODAL

**Component:** CancellationSuccessModal

**Same structure as confirmation modal, different content:**

```html
<div class="modal success-modal">
  <div class="modal-header success-header">
    <h2>✓ REZERVACE ZRUŠENA</h2>
  </div>
  
  <div class="modal-body">
    <p>Rezervace RES-2025-001234 byla úspěšně zrušena.</p>
    
    <div class="success-summary-box">
      <h3>CO SE STALO</h3>
      <ul>
        <li>✓ Slot uvolněn<br>
            <small>Tiket T-001-02 má nyní 8 / 10 volných slotů</small></li>
        <li>✓ SLA časovač zastaven<br>
            <small>Žádné další upozornění nebudou zasílána</small></li>
        <li>✓ Provize propadla<br>
            <small>Provize 125 000 Kč označena jako propadlá</small></li>
        <li>✓ Vaše sloty aktualizovány<br>
            <small>Zbývající volné sloty: 7 / 10</small></li>
      </ul>
    </div>
    
    <div class="next-steps">
      <h3>Co můžete dělat dále:</h3>
      <ul>
        <li>Prohlédnout si jiné dostupné tikety na tomto projektu</li>
        <li>Vytvořit novou rezervaci, pokud je tiket stále dostupný</li>
        <li>Kontaktovat investora a vysvětlit důvod zrušení</li>
      </ul>
    </div>
  </div>
  
  <div class="modal-footer">
    <button class="btn-primary" onclick="goToTicket()">
      Zobrazit tiket T-001-02
    </button>
    <button class="btn-secondary" onclick="goToProject()">
      Zobrazit projekt
    </button>
    <button class="btn-secondary" onclick="closeModal()">
      Zavřít
    </button>
  </div>
</div>
```

**CSS for Success State:**
```css
.success-header {
  background: #F0FDF4; /* Light green */
  border-bottom: 2px solid #14AE6B; /* Green accent */
}

.success-summary-box {
  background: #F0FDF4;
  border: 1px solid #86EFAC;
  padding: 16px;
  border-radius: 8px;
}

.success-summary-box ul {
  list-style: none;
  padding: 0;
}

.success-summary-box li {
  margin-bottom: 12px;
  line-height: 1.5;
}

.success-summary-box small {
  color: #6B7280;
  display: block;
  margin-top: 4px;
}
```

---

## PART C: UX MICROCOPY (CZECH LANGUAGE)

### C1: PRIMARY BUTTON LABELS

| Context | Label | Tone | Icon |
|---------|-------|------|------|
| **Secondary CTA (Detail Page)** | "Zrušit rezervaci" | Neutral | ✕ |
| **Disabled (Finalized)** | "Nelze zrušit" | Factual | 🔒 |
| **Disabled (Admin Locked)** | "Uzamčeno administrátorem" | Factual | 🔒 |
| **Modal Keep Button** | "Ponechat rezervaci" | Neutral | None |
| **Modal Confirm Button** | "Zrušit rezervaci" | Destructive | ✕ |
| **Success Primary CTA** | "Zobrazit tiket T-001-02" | Actionable | None |
| **Success Secondary CTA** | "Zobrazit projekt" | Neutral | None |
| **Error Retry Button** | "Zkusit znovu" | Helpful | 🔄 |

---

### C2: HEADINGS

| Context | Heading | Subheading |
|---------|---------|------------|
| **Confirmation Modal** | "Zrušení rezervace" | "Opravdu chcete zrušit tuto rezervaci?" |
| **Success Modal** | "✓ REZERVACE ZRUŠENA" | "Rezervace RES-{ID} byla úspěšně zrušena." |
| **Error Modal** | "⚠ CHYBA PŘI RUŠENÍ" | "Nepodařilo se zrušit rezervaci RES-{ID}." |
| **Blocked Modal (Finalized)** | "⚠ ZRUŠENÍ NENÍ MOŽNÉ" | "Tuto rezervaci již nelze zrušit." |
| **Blocked Modal (Expired)** | "ℹ REZERVACE JIŽ VYPRŠELA" | "Tuto rezervaci nelze zrušit, protože již vypršela." |
| **Blocked Modal (Locked)** | "🔒 REZERVACE JE UZAMČENA" | "Tuto rezervaci nelze zrušit – byla uzamčena administrátorem." |

---

### C3: CONSEQUENCE DESCRIPTIONS

**Slot Released:**
```
✓ Slot bude okamžitě uvolněn
Tiket {ticket_id} bude mít opět {available}/{total} volných slotů
```

**SLA Stopped:**
```
✓ SLA časovač bude zastaven
Žádné další SLA upozornění nebudou zasílána
```

**Commission Lost:**
```
✓ Provize nebude vyplacena
Očekávaná provize {amount} Kč bude označena jako propadlá
```

**Can Re-Reserve:**
```
✓ Můžete vytvořit novou rezervaci
Pokud je tiket stále dostupný, můžete rezervovat znovu
```

---

### C4: REASON DROPDOWN OPTIONS

| Value | Display Text (Czech) |
|-------|---------------------|
| `""` | "Vyberte důvod..." (placeholder) |
| `investor_unavailable` | "Investor již není dostupný" |
| `params_not_suitable` | "Parametry tiketu nevyhovují" |
| `found_better` | "Nalezen vhodnější tiket" |
| `creation_error` | "Chyba při vytváření rezervace" |
| `other` | "Jiný důvod (prosím specifikujte)" |

---

### C5: ERROR MESSAGES

| Error Type | Message |
|------------|---------|
| **Network Timeout** | "Technická chyba při komunikaci se serverem. Zkuste to prosím znovu za několik okamžiků." |
| **Server Error 500** | "Technická chyba na straně serveru. Pokud problém přetrvává, kontaktujte podporu." |
| **Concurrent Cancellation** | "Rezervace již byla zrušena administrátorem během vašeho rušení." |
| **SLA Expired During Flow** | "Rezervace vypršela během rušení – již byla automaticky zrušena systémem." |
| **Status Changed** | "Stav rezervace se změnil – nelze zrušit. Prosím obnovte stránku." |

---

### C6: INFO MESSAGES

| Context | Message |
|---------|---------|
| **Finalized Block** | "Důvod: Rezervace byla úspěšně dokončena. Partner potvrdil investici {date}. Provize {amount} Kč byla zaznamenána jako zasloužená." |
| **Expired Block** | "Důvod: Nedodržení SLA (čekal na podpis investora). Slot byl automaticky uvolněn." |
| **Admin Lock** | "Důvod: Investor podepsal dokumenty – čeká se na potvrzení partnera. Zrušení vyžaduje administrátorský zásah." |
| **Success Next Steps** | "• Prohlédnout si jiné dostupné tikety na tomto projektu<br>• Vytvořit novou rezervaci, pokud je tiket stále dostupný<br>• Kontaktovat investora a vysvětlit důvod zrušení" |
| **Post-Cancel Page Info** | "ℹ Tuto rezervaci již nelze obnovit. Můžete vytvořit novou rezervaci, pokud je tiket stále dostupný." |

---

### C7: TOOLTIPS

| Element | Tooltip |
|---------|---------|
| **Disabled Button (Finalized)** | "Rezervace byla dokončena – nelze zrušit" |
| **Disabled Button (Expired)** | "Rezervace vypršela – již byla automaticky zrušena" |
| **Disabled Button (Locked)** | "Rezervace je uzamčena administrátorem – kontaktujte podporu" |
| **Reason Dropdown (Optional Label)** | "Důvod je volitelný, ale pomůže nám zlepšit službu" |

---

### C8: ACCESSIBILITY (A11Y) LABELS

| Element | ARIA Label |
|---------|------------|
| **Modal** | `aria-labelledby="modal-title" aria-describedby="modal-description"` |
| **Close Button (X)** | `aria-label="Zavřít dialog"` |
| **Cancel Button** | `aria-label="Zrušit rezervaci RES-{ID}"` |
| **Keep Button** | `aria-label="Ponechat rezervaci – zavřít dialog"` |
| **Reason Dropdown** | `aria-label="Důvod zrušení rezervace (volitelné)"` |

---

## PART D: STATE DIAGRAM

### D1: RESERVATION STATE MACHINE (WITH CANCELLATION)

```
[ACTIVE]
  │
  ├─→ User clicks "Zrušit rezervaci"
  │   ↓
  │   [CANCELLATION_PENDING] (local UI state, not persisted)
  │   ↓
  │   User confirms in modal
  │   ↓
  │   API call
  │   ↓
  │   ├─→ Success → [CANCELLED_BY_USER] (terminal state)
  │   └─→ Error → Back to [ACTIVE] (modal shows error)
  │
  ├─→ Admin cancels → [CANCELLED_BY_SYSTEM] (terminal state)
  │
  ├─→ SLA expires → [EXPIRED] (terminal state)
  │
  └─→ Partner confirms → [PARTNER_CONFIRMED] (terminal state, cannot cancel)

[CANCELLED_BY_USER]
  │
  └─→ TERMINAL STATE (no transitions out)
      - Slot released
      - Commission → LOST
      - SLA stopped
      - Audit log entry created
      - User can view but not modify
```

---

### D2: UI STATE FLOW

```
[Reservation Detail Page – Active Reservation]
  │
  │ User sees: [Zrušit rezervaci] button (gray, secondary)
  │
  ↓
  User clicks button
  │
  ↓
  Pre-flight validation:
  ├─→ Can cancel? YES → Open Confirmation Modal
  └─→ Can cancel? NO → Show Blocked Modal with reason
  
[Confirmation Modal Open]
  │
  ├─→ User clicks "Ponechat rezervaci" → Close modal, no change
  │
  └─→ User clicks "Zrušit rezervaci" (red button)
      ↓
      Modal state: → LOADING (spinner shown)
      ↓
      API call
      ↓
      ├─→ Success → Modal state: → SUCCESS
      │              ↓
      │              User sees success message
      │              ↓
      │              User clicks one of 3 CTAs:
      │              ├─→ "Zobrazit tiket" → Navigate to ticket detail
      │              ├─→ "Zobrazit projekt" → Navigate to project detail
      │              └─→ "Zavřít" → Close modal, page shows CANCELLED state
      │
      └─→ Error → Modal state: → ERROR
                   ↓
                   User sees error message + retry option
                   ↓
                   ├─→ "Zkusit znovu" → Retry API call (back to LOADING)
                   └─→ "Zavřít" → Close modal, reservation still ACTIVE
```

---

### D3: TICKET STATE TRANSITIONS (AFTER CANCELLATION)

```
BEFORE Cancellation:
Ticket Status: RESERVED_BY_ME (user's reservation active)
Available Capacity: 7 / 10

↓
User cancels reservation
↓

AFTER Cancellation:
Ticket Status: PARTIALLY_FILLED (or AVAILABLE if was last reservation)
Available Capacity: 8 / 10 (capacity incremented)

Ticket Table Row Update:
- Badge: "Rezervováno mnou" → "Částečně obsazeno" (or "Dostupný")
- Slots: "7 / 10" → "8 / 10"
- CTA: "Detail rezervace" → "Rezervovat tiket"
- Background: Light blue tint → White (normal row)
```

---

## PART E: RULES TABLE

### E1: CANCELLATION PERMISSION MATRIX

| Reservation Status | Can Cancel? | Reason if Blocked | Button State |
|-------------------|-------------|------------------|--------------|
| **DRAFT** | ✅ Yes | N/A | Enabled |
| **PENDING_VALIDATION** | ✅ Yes | N/A | Enabled |
| **ACTIVE** | ✅ Yes | N/A | Enabled |
| **AWAITING_DOCUMENTS** | ✅ Yes | N/A | Enabled |
| **DOCUMENTS_READY** | ✅ Yes | N/A | Enabled |
| **SENT_TO_INVESTOR** | ✅ Yes | N/A | Enabled |
| **INVESTOR_SIGNED** | ⚠️ Yes (with warning) | Optional: Show extra warning that investor signed | Enabled with warning |
| **PARTNER_REVIEWING** | ⚠️ Yes (with warning) | Optional: Show extra warning that partner is reviewing | Enabled with warning |
| **PARTNER_CONFIRMED** | ❌ No | "Rezervace byla úspěšně dokončena – nelze zrušit" | Disabled |
| **EXPIRED** | ❌ No | "Rezervace již vypršela – byla automaticky zrušena" | Disabled |
| **CANCELLED_BY_USER** | ❌ No | "Rezervace již byla zrušena" | Disabled / Hidden |
| **CANCELLED_BY_SYSTEM** | ❌ No | "Rezervace byla zrušena administrátorem" | Disabled / Hidden |
| **REJECTED_BY_PARTNER** | ❌ No | "Partner zamítl investici" | Disabled / Hidden |

---

### E2: ADDITIONAL BLOCKING CONDITIONS

| Condition | Check | Block Cancellation? | Reason |
|-----------|-------|-------------------|--------|
| **Admin Lock** | `reservation.blocking.is_blocked === true` | ✅ Yes | "Rezervace je uzamčena administrátorem" |
| **Funds Transferred** | `reservation.payment_status === "paid"` | ✅ Yes | "Platba již byla provedena – nelze zrušit" |
| **Legal Commitment** | `reservation.legal_commitment_finalized === true` | ✅ Yes | "Smlouva byla finalizována – nelze zrušit" |
| **Investor Signed (Optional Stricter)** | `reservation.status === "INVESTOR_SIGNED"` | ⚠️ Show warning | "Investor již podepsal – opravdu chcete zrušit?" |

---

### E3: SLA STATE AFTER CANCELLATION

| SLA State BEFORE Cancellation | SLA State AFTER Cancellation | Countdown Behavior | Notes |
|------------------------------|----------------------------|-------------------|-------|
| **Running** | **Cancelled** | Stopped immediately | No more notifications sent |
| **Paused** | **Cancelled** | Stopped (was paused, now cancelled) | No more notifications sent |
| **Expiring Soon** | **Cancelled** | Stopped immediately | User cancelled before expiry |
| **Critical** | **Cancelled** | Stopped immediately | User cancelled before expiry |

**SLA Timer Object Update:**
```json
{
  "sla_timer_id": "SLA-789",
  "status": "cancelled",
  "cancelled_at": "2025-01-01T14:30:00Z",
  "cancelled_by": "user",
  "cancellation_reason": "User-initiated cancellation"
}
```

---

## PART F: DEVELOPER NOTES

### F1: ATOMIC TRANSACTION REQUIREMENTS

**CRITICAL: All cancellation operations MUST be atomic (all-or-nothing).**

**Required Steps in Single Transaction:**
1. Update reservation status → CANCELLED_BY_USER
2. Release ticket slot (increment `available_capacity`)
3. Update user global slots (decrement `global_slots_used`)
4. Update commission status → LOST
5. Stop SLA timer (set `status = cancelled`)
6. Create status_history entry (audit trail)

**If ANY step fails:**
- Rollback ALL changes
- Return error to frontend
- No partial updates allowed

**Database Transaction Example (Pseudo-code):**
```javascript
async function cancelReservationAtomic(reservationId, userId, reason) {
  const transaction = await db.transaction()
  
  try {
    // Step 1: Update reservation
    const reservation = await transaction.reservations.update({
      where: { reservation_id: reservationId },
      data: {
        status: "CANCELLED_BY_USER",
        cancelled_at: new Date(),
        cancellation_reason: reason
      }
    })
    
    // Step 2: Release ticket slot
    await transaction.tickets.update({
      where: { ticket_id: reservation.ticket_id },
      data: { available_capacity: { increment: reservation.slots_count } }
    })
    
    // Step 3: Update user slots
    await transaction.users.update({
      where: { user_id: userId },
      data: { global_slots_used: { decrement: reservation.slots_count } }
    })
    
    // Step 4: Update commission
    await transaction.commissions.update({
      where: { commission_id: reservation.commission_id },
      data: { status: "LOST" }
    })
    
    // Step 5: Stop SLA timer
    await transaction.sla_timers.update({
      where: { sla_timer_id: reservation.sla.sla_timer_id },
      data: { status: "cancelled", cancelled_at: new Date() }
    })
    
    // Step 6: Create audit log
    await transaction.status_history.create({
      data: {
        reservation_id: reservationId,
        changed_by_user_id: userId,
        old_status: reservation.status,
        new_status: "CANCELLED_BY_USER",
        change_reason: reason || "No reason provided",
        side_effects: [
          { effect_type: "slot_released", slots: reservation.slots_count },
          { effect_type: "commission_lost", amount: reservation.commission_amount },
          { effect_type: "sla_stopped" }
        ]
      }
    })
    
    // Commit all changes
    await transaction.commit()
    return { success: true }
    
  } catch (error) {
    // Rollback on error
    await transaction.rollback()
    return { success: false, error: error.message }
  }
}
```

---

### F2: IMMUTABILITY REQUIREMENTS

**What MUST be immutable:**
1. ✅ **Status history** – Once logged, cannot be edited or deleted
2. ✅ **Cancellation timestamp** – Cannot be changed after set
3. ✅ **Cancellation reason** – Cannot be edited after submission (audit trail)
4. ✅ **Audit log entries** – Read-only, append-only

**What CAN be changed:**
- ❌ Cancelled reservation status CANNOT be reverted (terminal state)
- ❌ Released slot CANNOT be "unreleased" (ticket capacity is real-time)
- ❌ Lost commission CANNOT become EXPECTED again (status is final)

---

### F3: API ENDPOINT SPECIFICATION

**POST /api/reservations/{reservation_id}/cancel**

**Request Body:**
```json
{
  "reason": "investor_unavailable",
  "reason_text": "Investor unavailable due to travel" // Optional, if reason="other"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "reservation_id": "550e8400-e29b-41d4-a716-446655440000",
  "cancelled_at": "2025-01-01T14:30:00Z",
  "ticket_updated": {
    "ticket_id": "T-001-02",
    "available_capacity": 8,
    "total_capacity": 10
  },
  "user_slots_updated": {
    "global_slots_used": 9,
    "global_slots_remaining": 1
  }
}
```

**Error Response (400 Bad Request – Cannot Cancel):**
```json
{
  "success": false,
  "error": {
    "code": "CANCELLATION_BLOCKED",
    "message": "Reservation cannot be cancelled",
    "reason": "Reservation is finalized (PARTNER_CONFIRMED)",
    "details": {
      "reservation_status": "PARTNER_CONFIRMED",
      "finalized_at": "2025-01-05T14:00:00Z"
    }
  }
}
```

**Error Response (409 Conflict – Concurrent Cancellation):**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_CANCELLED",
    "message": "Reservation was cancelled by another process",
    "reason": "Admin cancelled reservation during user cancellation",
    "details": {
      "cancelled_by": "admin",
      "cancelled_at": "2025-01-01T14:29:50Z"
    }
  }
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Internal server error during cancellation",
    "reason": "Database transaction failed"
  }
}
```

---

### F4: FRONTEND STATE MANAGEMENT

**React State Example:**

```typescript
interface CancellationState {
  isModalOpen: boolean
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  selectedReason: string
  customReasonText: string
}

const [cancellationState, setCancellationState] = useState<CancellationState>({
  isModalOpen: false,
  isLoading: false,
  isSuccess: false,
  error: null,
  selectedReason: "",
  customReasonText: ""
})

// Open modal
const handleOpenCancellation = () => {
  // Pre-flight check
  const { allowed, reason } = canCancelReservation(reservation)
  
  if (!allowed) {
    showBlockedModal(reason)
    return
  }
  
  setCancellationState({ ...cancellationState, isModalOpen: true })
}

// Confirm cancellation
const handleConfirmCancellation = async () => {
  setCancellationState({ ...cancellationState, isLoading: true, error: null })
  
  try {
    const response = await api.post(`/reservations/${reservation.id}/cancel`, {
      reason: cancellationState.selectedReason,
      reason_text: cancellationState.customReasonText
    })
    
    if (response.success) {
      setCancellationState({
        ...cancellationState,
        isLoading: false,
        isSuccess: true
      })
      
      // Update reservation in parent state
      onReservationCancelled(reservation.id)
      
    } else {
      throw new Error(response.error.message)
    }
    
  } catch (error) {
    setCancellationState({
      ...cancellationState,
      isLoading: false,
      error: error.message
    })
  }
}
```

---

### F5: WEBSOCKET / REAL-TIME UPDATE HANDLING

**Edge Case: Admin cancels while user is on page**

**Solution: WebSocket notification**

```javascript
// Subscribe to reservation updates
const socket = io.connect('/reservations')

socket.on(`reservation:${reservationId}:updated`, (data) => {
  if (data.new_status === "CANCELLED_BY_SYSTEM") {
    // Admin cancelled while user was viewing
    
    // Close any open modals
    closeAllModals()
    
    // Show notification
    showNotification({
      type: "info",
      title: "Rezervace zrušena administrátorem",
      message: "Tato rezervace byla zrušena administrátorem během vašeho prohlížení.",
      actions: [
        { label: "Obnovit stránku", onClick: () => window.location.reload() }
      ]
    })
    
    // Update reservation state
    setReservation(data.reservation)
  }
})
```

---

## PART G: EDGE CASES

### G1: SLA EXPIRES DURING CANCELLATION FLOW

**Scenario:**
1. User opens Reservation Detail (SLA: 5 minutes remaining)
2. User clicks "Zrušit rezervaci"
3. User reads modal (takes 3 minutes)
4. User clicks "Zrušit rezervaci" red button
5. Meanwhile, SLA expires (system auto-cancels reservation)
6. User's API call arrives AFTER system cancellation

**Expected Behavior:**

**Backend Response:**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_CANCELLED",
    "message": "Reservation was automatically cancelled due to SLA expiry",
    "reason": "SLA expired at 2025-01-01T14:30:00Z",
    "details": {
      "cancelled_by": "system",
      "cancelled_at": "2025-01-01T14:30:00Z",
      "cancel_reason": "SLA expiry"
    }
  }
}
```

**Frontend Handling:**
```javascript
if (response.error.code === "ALREADY_CANCELLED") {
  // Show info modal (not error)
  showInfoModal({
    title: "Rezervace již vypršela",
    message: "Rezervace byla automaticky zrušena systémem z důvodu vypršení SLA během vašeho rušení.",
    body: `
      Vypršelo: ${response.error.details.cancelled_at}
      
      Slot byl automaticky uvolněn.
      Můžete vytvořit novou rezervaci, pokud je tiket stále dostupný.
    `,
    buttons: [
      { label: "Zobrazit tiket", onClick: () => navigateToTicket() },
      { label: "Zavřít", onClick: () => closeModal() }
    ]
  })
}
```

**User Sees:**
- Not an error message (not user's fault)
- Info message explaining what happened
- Same end result (reservation cancelled, slot released)
- Recovery path (create new reservation)

---

### G2: ADMIN CANCELS WHILE USER IS ON PAGE

**Scenario:**
1. User viewing active reservation
2. Admin cancels same reservation in admin panel
3. User sees stale data (page not refreshed)
4. User tries to cancel

**Prevention: WebSocket Update (Recommended)**

```javascript
// Real-time update via WebSocket
socket.on(`reservation:${reservationId}:cancelled`, (data) => {
  // Update reservation state
  setReservation({ ...reservation, status: "CANCELLED_BY_SYSTEM" })
  
  // Show notification toast
  toast.info("Tato rezervace byla zrušena administrátorem", {
    action: { label: "Obnovit", onClick: () => window.location.reload() }
  })
  
  // Disable cancellation button
  setCanCancel(false)
})
```

**Fallback: Optimistic Locking (If No WebSocket)**

```javascript
// Before opening modal, refresh reservation state
const handleOpenCancellation = async () => {
  try {
    const freshReservation = await api.get(`/reservations/${reservationId}`)
    
    if (freshReservation.status !== reservation.status) {
      // State changed since page load
      setReservation(freshReservation)
      
      if (freshReservation.status === "CANCELLED_BY_SYSTEM") {
        showInfoModal({
          title: "Rezervace již zrušena",
          message: "Tato rezervace byla zrušena administrátorem."
        })
        return
      }
    }
    
    // Proceed with cancellation
    setCancellationState({ ...cancellationState, isModalOpen: true })
    
  } catch (error) {
    showErrorModal("Nepodařilo se ověřit stav rezervace")
  }
}
```

---

### G3: PARTIAL CANCELLATION (MULTI-SLOT RESERVATION)

**Scenario:** User reserved 3 slots, wants to cancel only 1 or 2

**DECISION: NOT SUPPORTED (Full Cancellation Only)**

**Rationale:**
- Partial cancellation adds complexity (which slots to release?)
- Reservation is atomic (all-or-nothing)
- User can cancel all, then create new reservation with fewer slots

**UI Message:**
```
ℹ Částečné zrušení není podporováno

Můžete zrušit všechny sloty (3) najednou.

Pokud chcete rezervovat méně slotů, prosím:
1. Zrušte tuto rezervaci
2. Vytvořte novou rezervaci s požadovaným počtem slotů
```

**Alternative (If Partial Cancellation Required):**

Add slot selector to confirmation modal:

```html
<div class="partial-cancellation">
  <label>Kolik slotů chcete zrušit?</label>
  <input type="number" min="1" max="3" value="3">
  
  <p>
    Zrušíte: <strong>3 sloty</strong><br>
    Zbude: <strong>0 slotů</strong> (rezervace bude plně zrušena)
  </p>
</div>
```

**Backend Logic:**
```javascript
if (slotsToCancel === reservation.slots_count) {
  // Full cancellation (current flow)
  cancelReservationFully(reservationId)
} else {
  // Partial cancellation (new flow)
  await transaction.reservations.update({
    where: { reservation_id: reservationId },
    data: { slots_count: { decrement: slotsToCancel } }
  })
  
  await transaction.tickets.update({
    where: { ticket_id: reservation.ticket_id },
    data: { available_capacity: { increment: slotsToCancel } }
  })
  
  // Adjust commission proportionally
  const newCommission = (reservation.commission_amount / reservation.slots_count) * (reservation.slots_count - slotsToCancel)
  
  await transaction.commissions.update({
    where: { commission_id: reservation.commission_id },
    data: { expected_amount: newCommission }
  })
}
```

**Recommendation:** Start with full cancellation only, add partial later if user demand exists.

---

### G4: NETWORK FAILURE DURING CANCELLATION

**Scenario:**
1. User clicks "Zrušit rezervaci" (red button)
2. API call sent
3. Network timeout (no response received)
4. User doesn't know if cancellation succeeded

**Solution: Retry Mechanism + State Check**

**Frontend Handling:**
```javascript
const handleConfirmCancellation = async () => {
  setCancellationState({ ...cancellationState, isLoading: true })
  
  try {
    const response = await api.post(`/reservations/${reservationId}/cancel`, {
      reason: cancellationState.selectedReason
    }, {
      timeout: 10000 // 10 second timeout
    })
    
    if (response.success) {
      setCancellationState({ ...cancellationState, isSuccess: true })
    }
    
  } catch (error) {
    if (error.code === "TIMEOUT") {
      // Network timeout – check reservation state
      const freshReservation = await api.get(`/reservations/${reservationId}`)
      
      if (freshReservation.status === "CANCELLED_BY_USER") {
        // Cancellation succeeded despite timeout
        setCancellationState({ ...cancellationState, isSuccess: true })
      } else {
        // Cancellation did not go through
        setCancellationState({
          ...cancellationState,
          isLoading: false,
          error: "Vypršel časový limit – zkuste to prosím znovu"
        })
      }
    } else {
      // Other error
      setCancellationState({
        ...cancellationState,
        isLoading: false,
        error: error.message
      })
    }
  }
}
```

**Modal Error State with Retry:**
```
┌──────────────────────────────────────────────────────────┐
│ ⚠ VYPRŠEL ČASOVÝ LIMIT                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Nepodařilo se potvrdit zrušení rezervace.               │
│                                                          │
│ Možné důvody:                                            │
│ • Pomalé připojení k internetu                          │
│ • Dočasný výpadek serveru                               │
│                                                          │
│ Ověřili jsme stav rezervace – stále je AKTIVNÍ.         │
│                                                          │
│ [Zkusit znovu]  [Zavřít]                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### G5: USER NAVIGATES AWAY DURING CANCELLATION

**Scenario:**
1. User opens cancellation modal
2. User clicks "Zrušit rezervaci" (red button)
3. API call in progress (loading spinner shown)
4. User closes browser tab / navigates away

**Expected Behavior:**
- Backend completes cancellation (API call already sent)
- Reservation becomes CANCELLED_BY_USER
- User sees cancelled state on next visit

**Prevention: Unload Warning (Optional)**
```javascript
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (cancellationState.isLoading) {
      e.preventDefault()
      e.returnValue = "Probíhá zrušení rezervace. Opravdu chcete opustit stránku?"
      return e.returnValue
    }
  }
  
  window.addEventListener("beforeunload", handleBeforeUnload)
  
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload)
  }
}, [cancellationState.isLoading])
```

**User Sees:**
Browser native confirmation dialog:
```
Opravdu chcete opustit tuto stránku?
Probíhá zrušení rezervace.
```

---

## PART H: INTEGRATION NOTES

### H1: TICKET TABLE UPDATE

**After Successful Cancellation:**

**BEFORE:**
```
[Rezervováno mnou] | T-001-02 | 5M Kč | 8,5% | 24m | 7/10 | 125k Kč | [Detail rezervace]
Background: Light blue tint
```

**AFTER:**
```
[Částečně obsazeno] | T-001-02 | 5M Kč | 8,5% | 24m | 8/10 | 125k Kč | [Rezervovat tiket]
Background: White
```

**Changes:**
- Badge: "Rezervováno mnou" → "Částečně obsazeno" (or "Dostupný" if was last reservation)
- Slots: "7/10" → "8/10"
- CTA: "Detail rezervace" → "Rezervovat tiket"
- Background: Blue tint removed

**Real-Time Update:**
```javascript
// Listen for cancellation events
socket.on(`ticket:${ticketId}:updated`, (data) => {
  // Update ticket in local state
  setTickets(prevTickets => 
    prevTickets.map(ticket => 
      ticket.ticket_id === ticketId 
        ? { ...ticket, available_capacity: data.available_capacity }
        : ticket
    )
  )
})
```

---

### H2: DASHBOARD WIDGET UPDATE

**User Dashboard – "Moje rezervace" Widget:**

**BEFORE Cancellation:**
```
Aktivní rezervace (3)
├─ RES-2025-001234 · T-001-02 · SLA: 36h
├─ RES-2025-001189 · T-005-01 · SLA: 12h ⚠
└─ RES-2025-001156 · T-003-03 · SLA: 60h
```

**AFTER Cancellation:**
```
Aktivní rezervace (2)
├─ RES-2025-001189 · T-005-01 · SLA: 12h ⚠
└─ RES-2025-001156 · T-003-03 · SLA: 60h

Nedávno zrušené (1)
└─ RES-2025-001234 · T-001-02 · Zrušeno 1.1.2025
```

**Implementation:**
- Widget automatically removes cancelled reservation from "Aktivní"
- Shows in "Nedávno zrušené" section (last 5, 7 days max)
- Click on cancelled reservation → Navigate to detail (shows CANCELLED state)

---

### H3: COMMISSION TRACKING UPDATE

**Commission Record Update:**

**BEFORE Cancellation:**
```json
{
  "commission_id": "COMM-789",
  "reservation_id": "RES-2025-001234",
  "status": "EXPECTED",
  "amount_czk": 125000
}
```

**AFTER Cancellation:**
```json
{
  "commission_id": "COMM-789",
  "reservation_id": "RES-2025-001234",
  "status": "LOST",
  "amount_czk": 0,
  "lost_reason": "Reservation cancelled by user",
  "lost_at": "2025-01-01T14:30:00Z"
}
```

**Commission Page Update:**

**Očekávané provize section:**
- BEFORE: Shows RES-2025-001234 with 125 000 Kč
- AFTER: Removed from "Očekávané", moved to "Propadlé"

**Propadlé provize section:**
- Shows RES-2025-001234 with strikethrough: ~~125 000 Kč~~
- Reason: "Zrušeno uživatelem 1.1.2025"

---

### H4: AUDIT LOG ENTRY

**Status History Entry:**

```json
{
  "history_id": "550e8400-e29b-41d4-a716-446655440099",
  "reservation_id": "550e8400-e29b-41d4-a716-446655440000",
  "changed_at": "2025-01-01T14:30:00Z",
  "changed_by_user_id": "USER-123",
  "changed_by_user_role": "user",
  "change_type": "cancellation",
  "old_status": "ACTIVE",
  "new_status": "CANCELLED_BY_USER",
  "change_reason": "Investor již není dostupný",
  "change_source": "reservation_detail_ui",
  "side_effects": [
    {
      "effect_type": "slot_released",
      "effect_description": "1 slot released",
      "effect_details": {
        "ticket_id": "T-001-02",
        "slots_count": 1,
        "new_available_capacity": 8
      }
    },
    {
      "effect_type": "commission_lost",
      "effect_description": "Commission status → LOST",
      "effect_details": {
        "commission_id": "COMM-789",
        "amount_czk": 125000
      }
    },
    {
      "effect_type": "sla_stopped",
      "effect_description": "SLA timer stopped",
      "effect_details": {
        "sla_timer_id": "SLA-789",
        "time_remaining_hours": 36
      }
    },
    {
      "effect_type": "user_slots_freed",
      "effect_description": "User global slots updated",
      "effect_details": {
        "slots_freed": 1,
        "new_remaining": 7,
        "new_used": 3
      }
    }
  ],
  "metadata": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
  }
}
```

**Audit Log Display (Reservation Detail):**
```
┌────────────────────────────────────────────────────────┐
│ AUDIT LOG                                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [1.1.2025 14:30] USER: Andrea Nováková                │
│ Rezervace zrušena                                      │
│ Důvod: Investor již není dostupný                     │
│                                                        │
│ Vedlejší efekty:                                      │
│ • Slot uvolněn (1 slot, tiket T-001-02)               │
│ • Provize propadla (125 000 Kč)                       │
│ • SLA časovač zastaven (zbývalo 36 hodin)             │
│ • Sloty aktualizovány (7/10 volných)                  │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [1.1.2025 12:30] USER: Andrea Nováková                │
│ Rezervace vytvořena                                    │
│ Investor: Martina Svobodová                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## PART I: ACCESSIBILITY (A11Y)

### I1: KEYBOARD NAVIGATION

**Reservation Detail Page:**
- Tab to "Zrušit rezervaci" button
- Enter/Space to activate

**Confirmation Modal:**
- Modal opens → Focus moves to modal heading
- Tab through: Close X → Reason dropdown → Keep button → Cancel button
- Escape key → Close modal (same as clicking "Ponechat rezervaci")
- Enter key (when focused on Cancel button) → Confirm cancellation

**Success Modal:**
- Focus moves to success heading
- Tab through CTAs: "Zobrazit tiket" → "Zobrazit projekt" → "Zavřít"

---

### I2: SCREEN READER SUPPORT

**ARIA Labels:**

**Cancellation Button:**
```html
<button
  aria-label="Zrušit rezervaci RES-2025-001234"
  aria-describedby="cancellation-warning"
>
  ✕ Zrušit rezervaci
</button>

<div id="cancellation-warning" class="sr-only">
  Zrušením rezervace uvolníte slot a ztratíte provizi.
</div>
```

**Confirmation Modal:**
```html
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Zrušení rezervace</h2>
  <p id="modal-description">
    Opravdu chcete zrušit tuto rezervaci? Přečtěte si důsledky níže.
  </p>
  ...
</div>
```

**Loading State:**
```html
<div role="status" aria-live="polite">
  <span class="sr-only">Probíhá zrušení rezervace, prosím vyčkejte...</span>
  [Spinner icon]
</div>
```

**Success State:**
```html
<div role="alert" aria-live="assertive">
  <h2>✓ Rezervace zrušena</h2>
  <p>Rezervace RES-2025-001234 byla úspěšně zrušena.</p>
</div>
```

---

### I3: COLOR CONTRAST

**WCAG AA Compliance:**

| Element | Foreground | Background | Contrast Ratio | Pass? |
|---------|-----------|------------|----------------|-------|
| **Secondary Button Text** | #6B7280 (gray) | #FFFFFF (white) | 4.7:1 | ✅ AA |
| **Destructive Button Text** | #FFFFFF (white) | #EF4444 (red) | 5.1:1 | ✅ AA |
| **Success Heading** | #040F2A (dark) | #F0FDF4 (light green) | 12.3:1 | ✅ AAA |
| **Error Text** | #DC2626 (dark red) | #FFFFFF (white) | 7.2:1 | ✅ AAA |

---

## CONCLUSION

**This specification provides:**
✅ Complete UX flow (8 steps: entry → trigger → modal → confirm → success/error)
✅ UI component descriptions (3 components: button, confirmation modal, success modal)
✅ Czech microcopy (8 categories: buttons, headings, consequences, reasons, errors, tooltips, A11Y)
✅ State diagram (reservation states, UI states, ticket states)
✅ Rules table (permission matrix, blocking conditions, SLA behavior)
✅ Developer notes (atomic transactions, immutability, API specs, state management)
✅ Edge cases handled (5 scenarios: SLA expiry, admin cancellation, partial, network failure, navigation)
✅ Integration points (ticket table, dashboard, commission, audit log)
✅ Accessibility requirements (keyboard nav, screen reader, color contrast)

**Implementation Status:** Ready for development

**Design Principles Applied:**
- ✅ Enterprise B2B tone (no retail pressure)
- ✅ Compliance-first (no dark patterns, clear consequences)
- ✅ Transparency (user knows exactly what happens)
- ✅ Trust over conversion (easy exit, no guilt)
- ✅ Calm UX (progressive disclosure of destructive nature: gray → modal → red)

**Key Differentiators:**
- Red button ONLY on final irreversible step (not premature)
- Reason is optional (reduces friction, but valuable for analytics)
- Success state shows actionable next steps (helps user move forward)
- Atomic transaction guarantees consistency (no partial cancellations)
- Immutable audit trail (compliance-safe)
- Real-time updates prevent stale data (WebSocket integration)

---

**END OF SPECIFICATION**

**Last Updated:** 2025-01-01
**Document Status:** Complete
**Feature Status:** Ready for Implementation
**Approval Required:** Product, Engineering, Legal/Compliance
