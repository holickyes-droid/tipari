# TICKET RESERVATION UX SYSTEM – TIPARI.CZ
**Complete End-to-End Design Specification**

**Document Type:** UX System Design + State Logic + Flow Definition
**Date:** 2025-01-01
**Scope:** Ticket Table + Reservation Process ONLY

---

## EXECUTIVE SUMMARY

**Design Philosophy:**
The ticket reservation system must function as a **professional decision-making tool**, not a marketing funnel. The design prioritizes:

1. **Commission visibility** – Tipaři must see their earnings immediately and constantly
2. **Speed to decision** – Minimize steps between intent and confirmation
3. **Reversibility clarity** – User always knows what can be undone
4. **State transparency** – No hidden logic, all constraints visible
5. **Zero ambiguity** – Every action has one clear outcome

**Core Principle:**
Ticket table IS the primary decision surface. Reservation is a guided continuation, not a separate process.

---

## PART 1: TICKET TABLE DESIGN

### 1.1 LAYOUT VARIANT ANALYSIS

#### VARIANT A: ROW-BASED TABLE (RECOMMENDED)

**Structure:**
```
[Ticket ID] | [Amount] | [Yield] | [Duration] | [Security] | [Slots] | [Commission] | [Action]
```

**Pros:**
- ✅ Maximum information density
- ✅ Fastest scanning for professional users (eyes trained on tables)
- ✅ Commission can be rightmost column (natural terminal position before action)
- ✅ Sortable by any column (commission, amount, availability)
- ✅ Familiar to bankers/finance professionals (Excel-like)
- ✅ Filters work naturally (hide/show rows)
- ✅ Easy to compare multiple tickets side-by-side

**Cons:**
- ⚠️ Limited space for complex status indicators
- ⚠️ Less visual hierarchy (all data same weight)
- ⚠️ Harder to show "Reserved by me" prominently

**Best For:**
- Fast comparison of 5+ tickets
- Commission-driven decision-making
- Professional users who scan tables daily

---

#### VARIANT B: CARD-BASED GRID

**Structure:**
```
┌─────────────────────────────┐
│ TICKET T-001-02             │
│ 5 000 000 Kč                │
│ 8,5% p.a. · 24 měsíců       │
│ Zajištěno 1. pořadí         │
│                             │
│ Sloty: 7 / 10               │
│                             │
│ PROVIZE: 125 000 Kč ←       │
│                             │
│ [Rezervovat tiket]          │
└─────────────────────────────┘
```

**Pros:**
- ✅ Commission can be VERY prominent (large number, visual weight)
- ✅ More space for status badges ("Rezervováno mnou", "Poslední slot")
- ✅ Can use color/iconography for security level
- ✅ Each ticket feels like a distinct "opportunity"
- ✅ Better for mobile/tablet responsive

**Cons:**
- ❌ Slower to scan 10+ tickets
- ❌ Harder to compare specific attributes across tickets
- ❌ Sorting/filtering less intuitive (grid reflows)
- ❌ Takes more vertical space (pagination needed sooner)

**Best For:**
- Projects with 2-5 tickets
- When commission motivation needs to be maximized
- Visual differentiation of ticket types

---

#### VARIANT C: HYBRID TABLE + EXPANDABLE DETAIL (RECOMMENDED FOR COMPLEX PROJECTS)

**Structure:**
```
Collapsed Row:
[T-001-02] | 5 000 000 Kč | 8,5% · 24m | Zajištěno | 7/10 | 125 000 Kč | [Rezervovat] [▼]

Expanded Row (inline):
┌────────────────────────────────────────────────────────────────────────┐
│ TICKET T-001-02 DETAIL                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Investice: 5 000 000 Kč                                                │
│ Výnos: 8,5% p.a. · 24 měsíců · Čtvrtletní výplata úroků               │
│ Zajištění: Zástava 1. pořadí · LTV 60% · Externí ocenění              │
│ Dostupnost: 7 / 10 slotů (3 rezervovány, 7 volných)                   │
│                                                                        │
│ VAŠE PROVIZE: 125 000 Kč (2,5% z investice)                           │
│                                                                        │
│ Matching investoři: 3 aktivní, 5 prospektů                            │
│                                                                        │
│ [Rezervovat tiket]  [Detail tiketu →]                                 │
└────────────────────────────────────────────────────────────────────────┘
```

**Pros:**
- ✅ Best of both: fast scanning + detail on demand
- ✅ Commission visible in both collapsed and expanded states
- ✅ Can show "Reserved by me" status in collapsed row
- ✅ Expandable row shows matching investors (pre-reservation context)
- ✅ Progressive disclosure reduces cognitive load
- ✅ Professional pattern (used in CRM, project management tools)

**Cons:**
- ⚠️ Requires extra click to see full detail
- ⚠️ More complex to implement (expandable rows)

**Best For:**
- Projects with 3-8 tickets
- When tickets have varying security/terms
- When matching investors need to be visible before reservation

---

### 1.2 FINAL RECOMMENDATION: HYBRID TABLE

**Rationale:**

1. **Speed + Depth**: Professional users can scan collapsed rows for commission and availability, then expand for detail ONLY when needed.

2. **Commission Visibility**: Commission appears TWICE:
   - Collapsed row: absolute CZK value (sortable column)
   - Expanded row: absolute CZK + percentage + calculation explanation

3. **Reservation Context**: Expanded row shows matching investors BEFORE reservation, reducing uncertainty.

4. **State Clarity**: Collapsed row can show status badge ("Rezervováno mnou", "Poslední slot") without cluttering table.

5. **Scalability**: Works for 2 tickets or 20 tickets. Filters work on collapsed view.

---

### 1.3 TICKET TABLE STRUCTURE (DETAILED SPEC)

#### COLLAPSED ROW (DEFAULT STATE)

**Columns (left → right):**

| Column | Content | Width | Sortable | Notes |
|--------|---------|-------|----------|-------|
| **Status** | Badge: Available / Reserved by me / Last slot / Full | Icon + 120px | No | Color-coded, icon-first |
| **Ticket ID** | T-001-02 | 90px | No | Click to expand row |
| **Investice** | 5 000 000 Kč | 130px | Yes | Full number, no abbrev |
| **Výnos** | 8,5% · 24m | 110px | Yes | Yield + duration combined |
| **Zajištění** | Icon + text | 120px | Filter only | Icon: shield (yes) or dash (no) |
| **Sloty** | 7 / 10 | 80px | Yes | Current / Total, progress bar |
| **PROVIZE** | **125 000 Kč** | 140px | Yes (default) | Bold, larger font, color |
| **Akce** | [Rezervovat] | 140px | No | CTA button |
| **Expand** | [▼] | 40px | No | Chevron icon |

**Total Width:** ~970px (fits 1280px standard desktop with margins)

**Visual Hierarchy:**
1. **PROVIZE** column – Boldest, #14AE6B green (success color, not marketing)
2. **Status badge** – Second most prominent (if reserved by user)
3. **Sloty** – Visual progress bar (not just number)
4. **CTA button** – Blue #215EF8, enabled/disabled states clear

---

#### EXPANDED ROW (ON CLICK)

**Sections (top → bottom):**

**Section 1: Investment Details**
```
Investice: 5 000 000 Kč
Výnos: 8,5% p.a. · 24 měsíců · Čtvrtletní výplata úroků
Splatnost: 31.12.2026
```

**Section 2: Security Details**
```
Zajištění: Zástava 1. pořadí nemovitosti
LTV: 60% · Externí ocenění (XYZ Experts s.r.o.)
Ocenění k dispozici: [Stáhnout PDF]
```

**Section 3: Availability**
```
Dostupnost: 7 / 10 slotů
└─ Obsazeno: 3 sloty (2 rezervace aktivní, 1 podepsáno)
└─ Volné: 7 slotů
└─ Vaše rezervace: Žádná (nebo: 1 aktivní rezervace)
```

**Section 4: Commission (HIGHLIGHTED)**
```
┌────────────────────────────────────────────┐
│ VAŠE PROVIZE: 125 000 Kč                   │
│ Výpočet: 2,5% z 5 000 000 Kč               │
│ Splatnost provize: Po podpisu investorem   │
└────────────────────────────────────────────┘
```

**Section 5: Matching Investors (KEY DIFFERENTIATOR)**
```
Matching investoři pro tento tiket:
├─ Andrea Nováková (92% match) · Kapacita 1 500 000 Kč
├─ Petr Svoboda (88% match) · Kapacita 800 000 Kč
└─ Milan Dvořák (76% match) · Kapacita 2 000 000 Kč · Má aktivní rezervaci

[Zobrazit všechny investory →]
```

**Section 6: Actions**
```
[Rezervovat tiket]  [Detail tiketu →]
```

**Why This Works:**
- **Pre-Reservation Context**: User sees matching investors BEFORE clicking "Rezervovat", reducing uncertainty ("Do I have anyone for this?")
- **Commission Reinforcement**: Commission shown again in expanded state with calculation transparency
- **Progressive Disclosure**: Only relevant detail shown, not overwhelming
- **Natural Flow**: Expand → See matches → Click reserve → Select investor (already previewed)

---

### 1.4 TICKET TABLE FILTERS & CONTROLS

**Filter Bar (Above Table):**

```
[📊 Tikety]  [🔄 Aktivní / Vše]  [Moje rezervace]  [Volné sloty]  [Seřadit: Provize (max → min) ▼]
```

**Filter Controls:**

1. **Toggle: Aktivní / Vše**
   - Default: Aktivní (show only OPEN, AVAILABLE, PARTIALLY_FILLED tickets)
   - Vše: Show all (including FULLY_FILLED, CLOSED)
   - Visual: Switch toggle, not dropdown

2. **Checkbox: Moje rezervace**
   - Show only tickets where user has active reservation
   - Count badge: "Moje rezervace (3)"
   - State persists in session

3. **Checkbox: Volné sloty**
   - Show only tickets with available capacity > 0
   - Hides fully filled tickets
   - Combines with other filters (AND logic)

4. **Sort Dropdown:**
   - **Provize (max → min)** – DEFAULT, shows highest commission first
   - Provize (min → max)
   - Investice (max → min)
   - Investice (min → max)
   - Výnos (max → min)
   - Výnos (min → max)
   - Sloty (nejvíce volných)
   - Tiket ID (číselně)

**Filter State Indicator:**
```
Zobrazeno: 7 tiketů (Filtry: Aktivní, Volné sloty)
[Zrušit filtry]
```

**Why This Design:**
- **Commission-First Sorting**: Default sort = max commission, motivates action
- **No Accidental Hiding**: Filter state always visible, easy to reset
- **Professional Controls**: Toggle + checkbox pattern familiar from B2B tools
- **Persistent State**: Filters stay active across page refreshes (session storage)

---

## PART 2: STATE MACHINE (TICKET ↔ RESERVATION)

### 2.1 TICKET STATES

| State | Definition | Visible in Table | CTA Label | CTA Enabled |
|-------|------------|------------------|-----------|-------------|
| **AVAILABLE** | No reservations, capacity > 0 | Green badge "Dostupný" | "Rezervovat tiket" | ✅ Yes |
| **PARTIALLY_FILLED** | 1+ reservations, capacity > 0 | Yellow badge "X / Y slotů" | "Rezervovat tiket" | ✅ Yes |
| **LAST_CAPACITY** | Capacity < 20% remaining | Orange badge "Poslední sloty" | "Rezervovat tiket" | ✅ Yes |
| **RESERVED_BY_ME** | User has active reservation on this ticket | Blue badge "Rezervováno mnou" | "Detail rezervace" | ✅ Yes (different action) |
| **FULLY_FILLED** | Capacity = 0 (all reserved or completed) | Gray badge "Obsazeno" | "Plně obsazeno" | ❌ No |
| **CLOSED** | Admin closed ticket | Gray badge "Uzavřeno" | "Uzavřeno" | ❌ No |

**State Calculation Logic:**
```
IF ticket.availableCapacity = 0
  THEN state = FULLY_FILLED
ELSE IF ticket.reservations.includes(currentUser)
  THEN state = RESERVED_BY_ME (prioritize this)
ELSE IF ticket.availableCapacity < (ticket.totalCapacity * 0.2)
  THEN state = LAST_CAPACITY
ELSE IF ticket.reservations.count > 0
  THEN state = PARTIALLY_FILLED
ELSE
  THEN state = AVAILABLE
```

**Visual Treatment:**

| State | Badge Color | Badge Icon | Row Background | CTA Style |
|-------|-------------|------------|----------------|-----------|
| AVAILABLE | Green #14AE6B | ✓ CheckCircle | White | Primary blue button |
| PARTIALLY_FILLED | Yellow #F59E0B | ⏱ Clock | White | Primary blue button |
| LAST_CAPACITY | Orange #F97316 | ⚠ AlertTriangle | Light orange tint | Primary blue button + "Poslední šance" tooltip |
| RESERVED_BY_ME | Blue #215EF8 | 📌 Pin | Light blue tint | Secondary blue outline button |
| FULLY_FILLED | Gray #6B7280 | ✕ XCircle | Light gray | Disabled gray button |
| CLOSED | Gray #6B7280 | 🔒 Lock | Light gray | Disabled gray button |

---

### 2.2 RESERVATION STATES

| State | Definition | Visible to User | Actions Allowed | System Triggers |
|-------|------------|----------------|-----------------|-----------------|
| **DRAFT** | User clicked "Rezervovat", not yet confirmed | Modal open | Confirm / Cancel | 30min timeout → auto-close |
| **PENDING_CONFIRMATION** | User submitted, system validating | Loading spinner | None (wait) | 5sec → ACTIVE or ERROR |
| **ACTIVE** | Reservation confirmed, slot locked | In "Moje rezervace" list | View detail / Cancel | SLA countdown → EXPIRED |
| **EXPIRED** | SLA deadline passed, no action taken | Historical view | View only | Auto-transition, slot released |
| **CANCELLED_BY_USER** | User cancelled before completion | Historical view | View only | Slot released |
| **CANCELLED_BY_SYSTEM** | System auto-cancelled (conflict, admin) | Historical view | View only | Slot released, notify user |
| **CONVERTED** | Investor signed, reservation became deal | Success view | View contract | Commission → EARNED |

**State Transitions:**

```
[USER CLICKS "REZERVOVAT"]
  ↓
DRAFT (modal opens)
  ↓
[USER CONFIRMS]
  ↓
PENDING_CONFIRMATION (validating)
  ↓
  ├─→ ERROR (validation failed) → back to DRAFT
  └─→ ACTIVE (slot locked)
        ↓
        ├─→ EXPIRED (SLA timeout) → slot released
        ├─→ CANCELLED_BY_USER (user action) → slot released
        ├─→ CANCELLED_BY_SYSTEM (admin/conflict) → slot released
        └─→ CONVERTED (investor signed) → commission earned
```

---

### 2.3 DEPENDENCY RULES (TICKET ↔ RESERVATION)

**Rule 1: Slot Lock on ACTIVE Reservation**
```
IF reservation.state = ACTIVE
  THEN ticket.availableCapacity -= 1
  AND ticket.state recalculated
```

**Rule 2: Slot Release on Terminal State**
```
IF reservation.state IN [EXPIRED, CANCELLED_BY_USER, CANCELLED_BY_SYSTEM, CONVERTED]
  THEN ticket.availableCapacity += 1
  AND ticket.state recalculated
```

**Rule 3: User Cannot Double-Reserve**
```
IF user.hasActiveReservation(ticketId)
  AND user.clicks("Rezervovat tiket")
  THEN CTA changes to "Detail rezervace"
  AND clicking navigates to reservation detail (not create new)
```

**Rule 4: Ticket Lock Prevents New Reservations**
```
IF ticket.state = FULLY_FILLED
  THEN CTA disabled
  AND tooltip: "Tiket je plně obsazen – všechny sloty rezervovány"
```

**Rule 5: SLA Auto-Expiry**
```
IF reservation.state = ACTIVE
  AND currentTime > reservation.slaDeadline
  THEN reservation.state = EXPIRED
  AND ticket.availableCapacity += 1
  AND user.notification = "Rezervace vypršela – slot uvolněn"
```

---

## PART 3: RESERVATION FLOW (STEP-BY-STEP)

### 3.1 ENTRY POINT

**Trigger:** User clicks "Rezervovat tiket" button in ticket table row

**Preconditions (Checked BEFORE Opening Modal):**

1. ✅ Ticket capacity > 0
2. ✅ User does NOT already have active reservation on this ticket
3. ✅ User has available global slots (not exceeded limit)
4. ✅ Ticket is not CLOSED or FULLY_FILLED

**IF Precondition Fails:**

| Failed Check | UI Response | Action |
|--------------|-------------|--------|
| Capacity = 0 | Tooltip: "Tiket je plně obsazen" | CTA disabled (should not be clickable) |
| User already has reservation | CTA changes to "Detail rezervace" | Navigate to reservation detail |
| User out of global slots | Modal shows: "Nemáte volné sloty – max [X] aktivních rezervací" | Suggest cancelling inactive reservation |
| Ticket closed | Tooltip: "Tiket byl uzavřen administrátorem" | CTA disabled |

**IF All Checks Pass:**
→ Open Reservation Modal (Side Panel, 600px width, slides in from right)

---

### 3.2 RESERVATION MODAL – DESIGN CHOICE

**Modal Type:** Side Panel (Sheet) – NOT Full-Screen Modal

**Rationale:**

1. **Context Preservation**: User can still see ticket table behind modal (reference commission, compare tickets)
2. **Professional Pattern**: Side panels common in enterprise tools (Jira, Salesforce, Linear)
3. **Non-Blocking**: Feels less committed than full-screen modal
4. **Dismissible**: Easy to close without losing progress (draft auto-saved for 30min)
5. **Scalable**: Can show multi-step flow in same panel (no navigation away)

**Panel Structure:**
```
┌─────────────────────────────────────┐
│ [✕ Close]                           │ ← Always closeable, no lock-in
│                                     │
│ REZERVACE TIKETU                    │
│ ─────────────────────────────────   │
│                                     │
│ [Step Content Here]                 │
│                                     │
│                                     │
│ ─────────────────────────────────   │
│ [Secondary CTA] [Primary CTA]       │ ← Always visible (sticky footer)
└─────────────────────────────────────┘
```

---

### 3.3 STEP 1: TICKET CONFIRMATION + SLOT SELECTION

**Purpose:** Confirm selected ticket and choose number of slots (if applicable)

**Content:**

```
┌─────────────────────────────────────────────────────────┐
│ REZERVACE TIKETU T-001-02                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Investice: 5 000 000 Kč                                │
│ Výnos: 8,5% p.a. · 24 měsíců                           │
│ Zajištění: Zástava 1. pořadí                           │
│                                                         │
│ Dostupnost: 7 / 10 slotů                               │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ VAŠE PROVIZE: 125 000 Kč                          │  │
│ │ (2,5% z investice)                                │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ Kolik slotů chcete rezervovat?                         │
│                                                         │
│ ┌───┬───┬───┬───┬───┐                                  │
│ │ 1 │ 2 │ 3 │ 4 │ 5 │ ← Slot selector (max 5 or available)│
│ └───┴───┴───┴───┴───┘                                  │
│                                                         │
│ ℹ Rezervací si blokujete tento tiket pro svého        │
│   klienta. Rezervace není závazek k investici.        │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [Zrušit]  [Pokračovat →]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Ticket Summary (Read-Only)**: User confirms they selected correct ticket
2. **Commission Highlighted**: Reinforced again (third time user sees it: table → expanded row → modal)
3. **Slot Selector**: Only shown if ticket supports multiple slots AND user wants to reserve >1
4. **Reassurance Microcopy**: "Rezervace není závazek k investici" – reduces fear
5. **Clear Exit**: "Zrušit" button always visible, no penalty

**Validation:**
- Slot quantity must be ≥ 1 and ≤ min(availableCapacity, userGlobalSlotsRemaining, 5)
- If user has no global slots, show error: "Nemáte volné sloty – max [X] aktivních rezervací dosaženo"

**Next Step:**
- Click "Pokračovat" → Step 2: Investor Assignment

---

### 3.4 STEP 2: INVESTOR ASSIGNMENT

**Purpose:** Assign specific investor to this reservation OR defer assignment

**Content:**

```
┌─────────────────────────────────────────────────────────┐
│ REZERVACE TIKETU T-001-02 · Krok 2/4                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Pro koho rezervujete tento tiket?                      │
│                                                         │
│ ○ Existující investor                                  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │ [🔍 Vyhledat investora...]                      │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   Doporučení investoři (matching 80%+):               │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │ ☑ Andrea Nováková (92% match)                   │  │
│   │   Kapacita: 1 500 000 Kč · Aktivní klient       │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │ ☐ Petr Svoboda (88% match)                      │  │
│   │   Kapacita: 800 000 Kč · Prospekt               │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   [Zobrazit všechny investory →]                       │
│                                                         │
│ ─ nebo ─                                                │
│                                                         │
│ ○ Investor bude doplněn později                        │
│   (Můžete přiřadit investora do 48 hodin)             │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ ℹ Proč přiřazujeme investora?                          │
│   Rezervace je právo předložit tiketu konkrétnímu     │
│   klientovi. Jméno investora zůstane skryté až do     │
│   potvrzení schůzky.                                   │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [← Zpět]  [Pokračovat →]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Two Options:**
   - **Option A**: Select existing investor (recommended, shows matching investors first)
   - **Option B**: Defer assignment (placeholder, must assign within SLA)

2. **Matching Investors (Critical UX Feature):**
   - Pre-filtered list based on ticket parameters (amount, yield, risk, duration)
   - Match percentage shown (transparency, not magic)
   - Investor capacity shown (can they afford this ticket?)
   - Investor status shown (Active vs. Prospect)
   - **Why this matters**: Reduces uncertainty ("Do I have someone for this?"), increases conversion

3. **Search Fallback**: If no good matches, user can search all investors

4. **Deferral Option**: Professional users may want to reserve first, find investor later (time pressure on ticket availability)

5. **Explanation Microcopy**: Why we ask for investor name (compliance awareness, privacy)

**Validation:**
- Must select investor OR choose "Investor bude doplněn později"
- Cannot proceed without one option selected

**Next Step:**
- Click "Pokračovat" → Step 3: Risk Acknowledgement

---

### 3.5 STEP 3: RISK ACKNOWLEDGEMENT (UX-Level, Not Legal)

**Purpose:** Ensure user understands reservation mechanics (not legal disclaimer)

**Content:**

```
┌─────────────────────────────────────────────────────────┐
│ REZERVACE TIKETU T-001-02 · Krok 3/4                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Před dokončením rezervace potvrďte:                    │
│                                                         │
│ ☑ Rozumím, že rezervace není investice                 │
│   Rezervace je právo předložit tiket konkrétnímu       │
│   klientovi. Investice vzniká až podpisem smlouvy.     │
│                                                         │
│ ☑ Rozumím lhůtám (SLA)                                 │
│   Rezervace má časový limit. Po vypršení lhůty         │
│   se rezervace automaticky zruší.                      │
│   └─ Lhůta pro akci: 48 hodin                          │
│                                                         │
│ ☑ Rozumím, že slot je blokován                         │
│   Po dokončení rezervace se slot odečte z vašich       │
│   dostupných slotů ([X] / [Y] volných).                │
│   Slot se uvolní po zrušení nebo dokončení rezervace.  │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ ℹ Co se stane po rezervaci?                            │
│                                                         │
│   1. Slot je okamžitě blokován pro vás                 │
│   2. Dokumenty se připraví k odeslání investorovi      │
│   3. Máte 48 hodin na odeslání investorovi             │
│   4. Po podpisu získáváte provizi 125 000 Kč           │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [← Zpět]  [Pokračovat →]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Checkboxes (Required)**: User must check all three to proceed
   - Not legal disclaimers (no lawyer language)
   - UX-level understanding (what happens, why it matters)

2. **Three Core Concepts:**
   - Reservation ≠ Investment (most critical misunderstanding)
   - SLA exists (time pressure is real, not artificial)
   - Slot is limited resource (scarcity is factual, not marketing)

3. **Process Preview**: "What happens next" section reduces uncertainty

4. **Commission Reinforcement**: Shows commission again (fourth time)

**Validation:**
- All three checkboxes must be checked
- If user unchecks, "Pokračovat" button disables

**Rationale for This Step:**
- **Not redundant**: Many users don't read fine print, this forces acknowledgment
- **Reduces support**: Users understand mechanics upfront
- **Compliance-aware**: Shows platform is professional, not careless
- **Exit ramp**: User can still go back if they realize this isn't what they wanted

**Next Step:**
- Click "Pokračovat" → Step 4: Final Summary

---

### 3.6 STEP 4: RESERVATION SUMMARY + FINAL CONFIRMATION

**Purpose:** Final review before committing (last chance to edit)

**Content:**

```
┌─────────────────────────────────────────────────────────┐
│ REZERVACE TIKETU T-001-02 · Krok 4/4                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Kontrola a dokončení rezervace                         │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ TIKET                                             │  │
│ │ T-001-02 · 5 000 000 Kč · 8,5% p.a. · 24 měsíců  │  │
│ │ Zajištění: Zástava 1. pořadí                      │  │
│ │                                              [Upravit]│  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ INVESTOR                                          │  │
│ │ Andrea Nováková                                   │  │
│ │ Kapacita: 1 500 000 Kč · Matching: 92%           │  │
│ │                                              [Upravit]│  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ SLOTY                                             │  │
│ │ Počet rezervovaných slotů: 1                      │  │
│ │ Vaše zbývající sloty: 9 / 10                      │  │
│ │                                              [Upravit]│  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ PROVIZE                                           │  │
│ │ 125 000 Kč                                        │  │
│ │ Splatnost: Po podpisu smlouvy investorem          │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ LHŮTY (SLA)                                       │  │
│ │ Rezervace platná: 48 hodin                        │  │
│ │ Automatické zrušení: 3.1.2025 14:30              │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ Po dokončení rezervace:                                │
│ • Slot bude okamžitě blokován                          │
│ • Dokumenty budou připraveny k odeslání                │
│ • Obdržíte potvrzovací e-mail                          │
│ • Rezervaci můžete zrušit kdykoli před podpisem        │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [← Zpět]  [Dokončit rezervaci]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Editable Sections**: Each section has [Upravit] link
   - Clicking goes back to relevant step (Step 1 for ticket/slots, Step 2 for investor)
   - Form remembers all previous inputs (no re-entry)

2. **Summary Cards**: Clean, scannable layout
   - All key info in one view
   - No hidden details
   - Commission shown AGAIN (fifth time)

3. **SLA Transparency**: Shows exact expiry time (not vague "2 days")

4. **Reassurance List**: What happens next (reduces post-confirmation anxiety)

5. **Reversibility**: "Rezervaci můžete zrušit kdykoli" – reduces fear of commitment

6. **Final CTA**: "Dokončit rezervaci" (not "Rezervovat" – completion, not start)

**Validation:**
- No validation needed (all done in previous steps)
- This is pure confirmation

**Next Step:**
- Click "Dokončit rezervaci" → API Call → Success/Error State

---

### 3.7 STEP 5: CONFIRMATION STATE (SUCCESS)

**Purpose:** Confirm reservation created, guide next steps

**Content:**

```
┌─────────────────────────────────────────────────────────┐
│ ✓ REZERVACE ÚSPĚŠNĚ VYTVOŘENA                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ Číslo rezervace: RES-2025-001234                  │  │
│ │ Vytvořeno: 1.1.2025 12:30                         │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ Rezervace tiketu T-001-02 pro investora                │
│ Andrea Nováková byla úspěšně vytvořena.                │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ CO DĚLAT DÁLE?                                    │  │
│ │                                                   │  │
│ │ 1. Připravte dokumenty pro investora              │  │
│ │    └─ Deadline: 3.1.2025 12:30 (48 hodin)        │  │
│ │                                                   │  │
│ │ 2. Odešlete dokumenty investorovi                 │  │
│ │    └─ Investor musí potvrdit do 72 hodin         │  │
│ │                                                   │  │
│ │ 3. Po podpisu získáte provizi 125 000 Kč          │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ℹ Rezervace je aktivní a slot je blokován.            │
│   Zbývající volné sloty: 9 / 10                        │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [Detail rezervace]  [Zavřít]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements:**

1. **Reservation Number**: Unique ID for tracking (RES-2025-XXXXXX)

2. **Clear Success Indicator**: Checkmark icon + green banner (success color, not celebration)

3. **Next Steps (Critical)**: User knows EXACTLY what to do next
   - Numbered list (clear sequence)
   - Deadlines shown (SLA transparency)
   - Commission reinforced (motivation)

4. **Slot Confirmation**: "Zbývající volné sloty: 9 / 10" – user sees slot was deducted

5. **Two CTAs**:
   - **Primary**: "Detail rezervace" – Navigate to reservation detail page
   - **Secondary**: "Zavřít" – Close modal, return to ticket table (reservation row now updated)

**Auto-Actions (Backend):**
- Reservation created in database (state = ACTIVE)
- Ticket availableCapacity decremented
- User globalSlots decremented
- Email confirmation sent (if enabled)
- Activity log entry created

**Next Step:**
- User clicks "Zavřít" → Modal closes, ticket table updates
- OR user clicks "Detail rezervace" → Navigate to reservation detail page

---

### 3.8 ERROR STATE (IF CREATION FAILS)

**Purpose:** Handle failure gracefully, provide recovery path

**Content:**

```
┌─────────────────────────────────────────────────────────┐
│ ⚠ REZERVACE SE NEPODAŘILA                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Nepodařilo se vytvořit rezervaci tiketu T-001-02.      │
│                                                         │
│ Důvod:                                                  │
│ Tiket byl plně obsazen jiným uživatelem                │
│ během vytváření vaší rezervace.                        │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ CO MŮŽETE UDĚLAT?                                 │  │
│ │                                                   │  │
│ │ • Zkontrolujte dostupnost ostatních tiketů       │  │
│ │   na tomto projektu                               │  │
│ │                                                   │  │
│ │ • Nastavte upozornění, pokud se slot uvolní      │  │
│ │   (rezervace může vypršet nebo být zrušena)       │  │
│ │                                                   │  │
│ │ • Kontaktujte podporu, pokud problém přetrvává   │  │
│ │                                                   │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [Zkusit znovu]  [Zobrazit jiné tikety]  [Zavřít]      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Possible Error Reasons:**

| Error | Reason | UI Message | Recovery Path |
|-------|--------|------------|---------------|
| **Capacity exhausted** | Another user reserved last slot during this flow | "Tiket byl plně obsazen jiným uživatelem během vytváření rezervace" | Show other tickets, set alert |
| **Global slots exceeded** | User hit max concurrent reservations | "Nemáte volné sloty – max [X] aktivních rezervací dosaženo" | Suggest cancelling inactive reservation |
| **Duplicate reservation** | User already has reservation (race condition) | "Již máte aktivní rezervaci na tento tiket" | Navigate to existing reservation |
| **Ticket closed** | Admin closed ticket during flow | "Tiket byl uzavřen administrátorem" | Show reason if available |
| **System error** | API timeout, server error | "Došlo k technické chybě – zkuste to prosím znovu" | Retry button |

**Recovery Actions:**
- "Zkusit znovu" – Re-attempt reservation (if error was transient)
- "Zobrazit jiné tikety" – Close modal, scroll to ticket table
- "Zavřít" – Close modal, no action

---

### 3.9 TICKET TABLE UPDATE (POST-RESERVATION)

**After Successful Reservation:**

**Ticket Row Changes:**

**BEFORE Reservation:**
```
[Dostupný] | T-001-02 | 5 000 000 Kč | 8,5% · 24m | Zajištěno | 7 / 10 | 125 000 Kč | [Rezervovat tiket] | [▼]
```

**AFTER Reservation:**
```
[Rezervováno mnou] | T-001-02 | 5 000 000 Kč | 8,5% · 24m | Zajištěno | 6 / 10 | 125 000 Kč | [Detail rezervace] | [▼]
```

**Visual Changes:**

1. **Status Badge**: "Dostupný" → "Rezervováno mnou" (blue badge, pin icon)
2. **Row Background**: White → Light blue tint (#215EF8 at 5% opacity)
3. **Slots**: "7 / 10" → "6 / 10" (availableCapacity decremented)
4. **CTA**: "Rezervovat tiket" → "Detail rezervace" (different action)
5. **CTA Style**: Primary blue button → Secondary blue outline button

**Expanded Row Changes:**

**BEFORE:**
```
Vaše rezervace: Žádná
```

**AFTER:**
```
Vaše rezervace: 1 aktivní rezervace
├─ RES-2025-001234
├─ Vytvořeno: 1.1.2025 12:30
├─ Investor: Andrea Nováková
├─ SLA: Zbývá 47 hodin
└─ [Detail rezervace →]
```

**Filter Integration:**

If user has filter "Moje rezervace" enabled:
- This ticket NOW appears in filtered view
- Filter count updates: "Moje rezervace (3)" → "Moje rezervace (4)"

---

## PART 4: EDGE CASES & SPECIAL SCENARIOS

### 4.1 USER ALREADY HAS RESERVATION ON TICKET

**Scenario:** User clicks "Rezervovat tiket" on ticket where they already have active reservation

**Expected Behavior:**
- CTA should NOT say "Rezervovat tiket" (this is prevented by state logic)
- CTA should say "Detail rezervace"
- Clicking navigates to existing reservation detail page (not open modal)

**Ticket Row State:**
```
[Rezervováno mnou] | T-001-02 | ... | [Detail rezervace]
```

**Rationale:**
- Prevent accidental double-reservation
- Make existing reservation discoverable
- User can still view/cancel existing reservation

---

### 4.2 LAST AVAILABLE SLOT

**Scenario:** Ticket has 1 slot remaining, user clicks "Rezervovat"

**Expected Behavior:**

**Step 1 (Ticket Confirmation):**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠ POSLEDNÍ DOSTUPNÝ SLOT                                │
│                                                         │
│ Tento tiket má pouze 1 volný slot.                     │
│ Po dokončení rezervace bude tiket plně obsazen.        │
│                                                         │
│ Dostupnost: 1 / 10 slotů (9 obsazeno)                  │
│                                                         │
│ [Zrušit]  [Pokračovat s rezervací →]                   │
└─────────────────────────────────────────────────────────┘
```

**Rationale:**
- User knows this is last chance (factual urgency, not artificial)
- User warned that ticket will be unavailable after their reservation
- Decision is informed, not pressured

**After Reservation:**
- Ticket state → FULLY_FILLED
- Ticket row: "10 / 10" slotů
- CTA disabled for other users: "Plně obsazeno"

---

### 4.3 CONCURRENT RESERVATION CONFLICT

**Scenario:** Two users try to reserve last slot simultaneously

**Expected Behavior:**

**User A** clicks "Dokončit rezervaci" at 12:30:00
**User B** clicks "Dokončit rezervaci" at 12:30:01

**Backend Logic:**
1. Lock ticket capacity during reservation creation
2. First request wins (User A)
3. Second request fails (User B)

**User A sees:**
```
✓ REZERVACE ÚSPĚŠNĚ VYTVOŘENA
```

**User B sees:**
```
⚠ REZERVACE SE NEPODAŘILA

Tiket byl plně obsazen jiným uživatelem
během vytváření vaší rezervace.

[Zobrazit jiné tikety]  [Zavřít]
```

**Rationale:**
- No double-booking (data integrity)
- User B gets clear explanation (not mysterious failure)
- User B offered recovery path (other tickets)

---

### 4.4 RESERVATION EXPIRES (SLA TIMEOUT)

**Scenario:** User creates reservation but doesn't act within SLA (48 hours)

**System Behavior:**
1. Automated job checks reservation SLA every 5 minutes
2. If `currentTime > reservation.slaDeadline`:
   - Reservation state → EXPIRED
   - Ticket availableCapacity += 1
   - User globalSlots += 1
   - Notification sent to user

**Ticket Table Update:**

**BEFORE Expiry:**
```
[Rezervováno mnou] | T-001-02 | ... | 6 / 10 | [Detail rezervace]
```

**AFTER Expiry:**
```
[Částečně obsazeno] | T-001-02 | ... | 7 / 10 | [Rezervovat tiket]
```

**User Notification:**
```
⚠ Rezervace vypršela

Vaše rezervace tiketu T-001-02 (RES-2025-001234)
vypršela z důvodu nedodržení lhůty (SLA).

Slot byl automaticky uvolněn.
Můžete vytvořit novou rezervaci, pokud je kapacita dostupná.

[Detail vypršelé rezervace]  [Zavřít]
```

**Rationale:**
- User is informed (not silent failure)
- Slot is returned to pool (fair to other users)
- User can try again (if capacity available)

---

### 4.5 USER CANCELS RESERVATION

**Scenario:** User has active reservation, wants to cancel

**Entry Point:** Reservation Detail page → "Zrušit rezervaci" button

**Confirmation Dialog:**
```
┌─────────────────────────────────────────────────────────┐
│ Opravdu chcete zrušit rezervaci?                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Rezervace: RES-2025-001234                              │
│ Tiket: T-001-02 · 5 000 000 Kč                         │
│ Investor: Andrea Nováková                               │
│                                                         │
│ Po zrušení:                                             │
│ • Slot bude uvolněn a vrácen do nabídky                │
│ • Ztratíte možnost získat provizi 125 000 Kč           │
│ • Nemůžete zrušení vrátit                              │
│                                                         │
│ Důvod zrušení (volitelné):                              │
│ ┌─────────────────────────────────────────────────┐    │
│ │ [Text area pro důvod...]                        │    │
│ └─────────────────────────────────────────────────┘    │
│                                                         │
│ ─────────────────────────────────────────────────────   │
│                                                         │
│ [Ponechat rezervaci]  [Ano, zrušit rezervaci]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**After Cancellation:**

**System Actions:**
- Reservation state → CANCELLED_BY_USER
- Ticket availableCapacity += 1
- User globalSlots += 1
- Activity log entry created

**Ticket Table Update:**
```
[Rezervováno mnou] → [Částečně obsazeno]
6 / 10 → 7 / 10
[Detail rezervace] → [Rezervovat tiket]
```

**User Notification:**
```
✓ Rezervace zrušena

Rezervace RES-2025-001234 byla zrušena.
Slot byl uvolněn a je nyní dostupný pro ostatní.

[Zobrazit projekt]  [Zavřít]
```

**Rationale:**
- User sees consequences before confirming (informed decision)
- Reason field optional (not required, reduces friction)
- Cancellation is reversible by creating new reservation (if capacity available)

---

### 4.6 INVESTOR SIGNS AGREEMENT (CONVERSION)

**Scenario:** Investor signs investment agreement, reservation becomes deal

**System Behavior:**
1. Admin uploads signed agreement to reservation
2. Reservation state → CONVERTED
3. Commission state → EARNED
4. Slot remains consumed (not released)

**Ticket Table Update:**

**BEFORE Conversion:**
```
[Rezervováno mnou] | T-001-02 | ... | 6 / 10 | [Detail rezervace]
```

**AFTER Conversion:**
```
[Částečně obsazeno] | T-001-02 | ... | 6 / 10 | [Rezervovat tiket] ← Slot NOT released
                                                    (but user's reservation is done)
```

**User Notification:**
```
✓ Rezervace úspěšně uzavřena

Gratulujeme! Investor Andrea Nováková podepsal
smlouvu pro tiket T-001-02.

Vaše provize 125 000 Kč byla zaznamenána.
Provize bude vyplacena po dokončení investice.

[Detail provize]  [Zavřít]
```

**Ticket Row (User's Perspective):**
- User no longer has "Rezervováno mnou" badge on this ticket
- User can create NEW reservation on this ticket (if capacity available)
- But slot consumed by this deal is NOT released

**Expanded Row:**
```
Vaše rezervace: Dokončeno (1 úspěšný obchod)
├─ RES-2025-001234 (CONVERTED)
├─ Uzavřeno: 5.1.2025
├─ Investor: Andrea Nováková
├─ Provize: 125 000 Kč (EARNED)
└─ [Detail obchodu →]
```

**Rationale:**
- Slot consumed (investor got the ticket)
- User can reserve again if capacity available (multiple deals allowed)
- Commission tracking linked to original reservation

---

## PART 5: UX PRINCIPLES & RATIONALE

### 5.1 WHY THIS FLOW IS OPTIMAL

#### 1. **Commission-Driven Motivation**

**Problem:** Users hesitate if they don't see clear financial benefit

**Solution:**
- Commission shown **5 times** during flow:
  1. Ticket table (collapsed row)
  2. Ticket table (expanded row)
  3. Reservation modal Step 1
  4. Reservation modal Step 3 (acknowledgement)
  5. Reservation modal Step 4 (summary)
  6. Success confirmation

**Psychology:** Repetition reinforces value, motivation increases with each reminder

**Professional Context:** B2B users are commission-driven, not product-driven

---

#### 2. **Progressive Disclosure**

**Problem:** Too much information at once = cognitive overload

**Solution:**
- **Ticket Table (Collapsed)**: 7 key data points only
- **Ticket Table (Expanded)**: Full detail ON DEMAND (click to expand)
- **Reservation Modal**: 4 steps, each focused on ONE decision

**Psychology:** Users process information in chunks, decisions made sequentially

**Professional Context:** Bankers scan tables fast, expand for detail when needed

---

#### 3. **Reversibility Clarity**

**Problem:** Fear of irreversible commitment blocks action

**Solution:**
- **Step 3 (Acknowledgement)**: Explicitly states "Rezervaci můžete zrušit kdykoli"
- **Step 4 (Summary)**: All sections editable with [Upravit] links
- **Success Confirmation**: Shows "Detail rezervace" link (implies manageability)
- **Cancellation Flow**: Clear, penalty-free (no dark patterns)

**Psychology:** Reducing perceived risk increases conversion

**Professional Context:** B2B users need control, not lock-in

---

#### 4. **Matching Investors Pre-Shown**

**Problem:** Users hesitate if uncertain whether they have suitable investor

**Solution:**
- **Ticket Table (Expanded Row)**: Shows top 3 matching investors BEFORE clicking "Rezervovat"
- **Reservation Modal Step 2**: Shows full matching list + search fallback

**Psychology:** Reducing uncertainty ("Do I have someone?") removes friction

**Professional Context:** Pre-qualification increases conversion (user knows they have client)

---

#### 5. **SLA Transparency**

**Problem:** Artificial urgency feels manipulative, but real deadlines are necessary

**Solution:**
- SLA shown as **factual constraint**, not marketing pressure
- Exact deadline timestamp (not vague "2 days")
- Explanation: "Po vypršení lhůty se rezervace automaticky zruší" (system rule, not seller choice)

**Psychology:** Factual urgency is trusted, artificial urgency is rejected

**Professional Context:** B2B users respect system constraints, reject sales tactics

---

#### 6. **State Transparency**

**Problem:** Hidden logic causes distrust ("Why can't I do X?")

**Solution:**
- Ticket state always visible (badge + slots count)
- Reservation state always visible (timeline, SLA countdown)
- Blocking reasons always shown (tooltip, error message)

**Psychology:** Transparency builds trust, hidden logic breeds suspicion

**Professional Context:** B2B users expect system rules, not black boxes

---

#### 7. **No Dead Ends**

**Problem:** User hits error, doesn't know what to do next

**Solution:**
- Every error state has recovery path:
  - Capacity exhausted → Show other tickets
  - Global slots exceeded → Suggest cancelling inactive reservation
  - System error → Retry button

**Psychology:** Frustration reduced when user has clear next action

**Professional Context:** B2B users are results-driven, need paths forward

---

### 5.2 WHY 4 STEPS (NOT MORE, NOT LESS)

**Alternative Considered: 1-Step Modal (All-In-One)**

**Rejected Because:**
- ❌ Too much information at once (cognitive overload)
- ❌ Hard to edit specific section (must redo entire form)
- ❌ No sense of progress (user doesn't know how far they are)

**Alternative Considered: 6+ Steps (Granular)**

**Rejected Because:**
- ❌ Too many clicks (professional users value speed)
- ❌ Feels tedious (not respecting user's time)
- ❌ Increased abandonment (each step is potential exit point)

**Why 4 Steps Is Optimal:**

| Step | Decision | Cognitive Load | Can Skip? |
|------|----------|----------------|-----------|
| 1 | Which ticket + how many slots | Low (already decided) | No |
| 2 | Which investor | Medium (choice required) | Partial (can defer) |
| 3 | Understand mechanics | Low (reading only) | No |
| 4 | Confirm all | Low (review only) | No |

**Total Time:** ~2 minutes for informed user, ~5 minutes for new user

**Abandonment Risk:** Steps 1-2 (before commitment), Step 4 (final review)

**Conversion Optimization:** Show commission in Steps 1, 3, 4 (reinforcement)

---

### 5.3 WHY SIDE PANEL (NOT FULL-SCREEN MODAL)

**Comparison:**

| Aspect | Side Panel | Full-Screen Modal | Page Navigation |
|--------|-----------|-------------------|-----------------|
| Context preservation | ✅ Ticket table visible | ❌ Table hidden | ❌ Lost context |
| Professional feel | ✅ Enterprise standard | ⚠️ Consumer-like | ✅ Traditional |
| Dismissibility | ✅ Easy to close | ⚠️ Feels locked in | ❌ Back button required |
| Multi-monitor friendly | ✅ Can reference other windows | ❌ Takes full screen | ✅ Can reference other windows |
| Mobile responsive | ⚠️ Full-screen on mobile | ✅ Works well | ✅ Works well |
| Implementation complexity | Medium | Low | Medium |

**Decision:** Side Panel (600px width)

**Rationale:**
- Professional users often compare multiple tickets (table visible behind panel)
- Non-blocking feel (user doesn't feel trapped)
- Enterprise SaaS standard (Jira, Linear, Salesforce use this pattern)
- Can still show commission from table while in modal (visual reinforcement)

---

### 5.4 WHY MATCHING INVESTORS MATTER

**User Hesitation Point:**
"Should I reserve this ticket if I'm not sure I have the right investor?"

**Without Matching Investors:**
- User must mentally recall their investor list (cognitive burden)
- User uncertain if they have suitable client (hesitation)
- User may skip reservation, intending to "come back later" (abandonment)

**With Matching Investors (Pre-Shown in Expanded Row):**
- User sees 3 top matches BEFORE clicking "Rezervovat" (confidence)
- User knows they have suitable client (removes barrier)
- User more likely to click "Rezervovat" (conversion increase)

**Expected Impact:**
- 15-25% increase in reservation conversion (hypothesis, needs A/B test)
- Reduced time-to-reservation (user doesn't need to search investor list separately)
- Better investor-ticket fit (algorithm pre-filters by parameters)

**Implementation Note:**
- Matching algorithm must be transparent (show match percentage + reasoning)
- Fallback: If no good matches, show "Vyhledat všechny investory" link (no dead end)

---

### 5.5 WHY COMMISSION IN CZK (NOT PERCENTAGE-FIRST)

**Problem:** Percentages are abstract, absolute numbers are tangible

**Bad Pattern (Percentage-First):**
```
Provize: 2,5%
```
↑ User must calculate: 2.5% of 5M = ?

**Good Pattern (CZK-First):**
```
PROVIZE: 125 000 Kč
(2,5% z investice)
```
↑ User immediately sees earnings

**Psychology:**
- **Concrete > Abstract**: CZK is tangible reward, percentage is math problem
- **Mental Accounting**: Users think in absolute gains, not ratios
- **Motivation**: 125,000 Kč feels more motivating than 2.5%

**Professional Context:**
- B2B users are financially literate (can understand both)
- But human psychology still responds to absolute numbers
- Commission is THE primary motivator (must be prominent)

---

### 5.6 WHY SLOT COUNTER (X / Y FORMAT)

**Problem:** "Available: 7" is ambiguous (7 out of how many?)

**Bad Patterns:**
```
Available: 7        ← 7 out of 10? 100? 1000?
80% filled          ← How many actual slots?
Almost full         ← Vague, manipulative
```

**Good Pattern:**
```
7 / 10 slotů
[Progress bar showing 30% filled]
```

**Psychology:**
- **Scarcity Clarity**: User sees exact availability (factual, not marketing)
- **Context**: 7 slots means different urgency if total is 10 vs. 100
- **Visual + Numeric**: Progress bar + number reinforces understanding

**Professional Context:**
- B2B users expect data transparency
- Scarcity must be real, not manufactured
- Exact numbers build trust

---

## PART 6: POST-RESERVATION INTEGRATION

### 6.1 WHERE RESERVATION APPEARS

**1. Ticket Table (Updated Row)**
- Status badge: "Rezervováno mnou"
- CTA: "Detail rezervace"
- Expanded row: Shows reservation summary

**2. Dashboard (Moje rezervace widget)**
```
Aktivní rezervace (4)
├─ RES-2025-001234 · T-001-02 · SLA: 46h
├─ RES-2025-001189 · T-005-01 · SLA: 12h ⚠
└─ [Zobrazit všechny →]
```

**3. Reservations Page (Dedicated view)**
- Full list of all reservations (Active / Expired / Converted / Cancelled)
- Filter by status, project, investor
- Sort by SLA deadline (urgent first)

**4. Investor Detail Page**
```
Rezervace pro Andrea Nováková:
├─ RES-2025-001234 · T-001-02 · Aktivní
└─ RES-2024-000987 · T-003-01 · Dokončeno
```

**5. Commission Page**
```
Očekávané provize:
├─ 125 000 Kč · RES-2025-001234 · T-001-02
└─ Celkem: 325 000 Kč (3 aktivní rezervace)
```

---

### 6.2 RESERVATION DETAIL PAGE (LINKED FROM TABLE)

**URL:** `/reservations/RES-2025-001234`

**Purpose:** Full reservation lifecycle management

**Sections:**

**1. Header:**
```
REZERVACE RES-2025-001234
Status: Aktivní · SLA: Zbývá 46 hodin
```

**2. Ticket Summary:**
```
Tiket: T-001-02
Investice: 5 000 000 Kč · 8,5% p.a. · 24 měsíců
Provize: 125 000 Kč
[Zobrazit tiket →]
```

**3. Investor:**
```
Andrea Nováková
Kapacita: 1 500 000 Kč · Matching: 92%
[Zobrazit investora →]
```

**4. Timeline (Phases):**
```
✓ Rezervace vytvořena (1.1.2025 12:30)
→ Dokumenty připraveny (aktuální krok)
   └─ Deadline: 3.1.2025 12:30
⏱ Odeslání investorovi
⏱ Podpis investorem
⏱ Potvrzení partnerem
⏱ Dokončeno
```

**5. Actions:**
```
[Zrušit rezervaci]  [Stáhnout dokumenty]
```

---

## PART 7: IMPLEMENTATION CHECKLIST

### 7.1 FRONTEND COMPONENTS

**Ticket Table:**
- [ ] Hybrid table with expandable rows
- [ ] 7-column collapsed layout
- [ ] Expanded row with 5 sections
- [ ] Filter bar (toggle + 2 checkboxes + sort dropdown)
- [ ] State badge component (6 variants)
- [ ] Progress bar for slots (visual + numeric)
- [ ] Commission highlight styling
- [ ] Responsive: table → cards on mobile

**Reservation Modal:**
- [ ] Side panel component (600px, slides in from right)
- [ ] 4-step wizard with progress indicator
- [ ] Step 1: Ticket confirmation + slot selector
- [ ] Step 2: Investor assignment (search + matching list)
- [ ] Step 3: Acknowledgement checkboxes
- [ ] Step 4: Summary with editable sections
- [ ] Success confirmation state
- [ ] Error state with recovery paths
- [ ] Draft auto-save (localStorage, 30min expiry)

**State Logic:**
- [ ] Ticket state calculation (6 states)
- [ ] Reservation state machine (7 states)
- [ ] Slot lock/release logic
- [ ] SLA countdown timer
- [ ] Concurrent reservation conflict handling

---

### 7.2 BACKEND API ENDPOINTS

**Read Operations:**
```
GET /api/tickets?projectId={id}&filters={...}&sort={...}
GET /api/tickets/{ticketId}/availability
GET /api/tickets/{ticketId}/matching-investors
GET /api/reservations/{reservationId}
GET /api/reservations?userId={id}&status={...}
```

**Write Operations:**
```
POST /api/reservations/create
  ├─ ticketId
  ├─ investorId (optional, can defer)
  ├─ slotsCount
  └─ Returns: reservationId or error

PUT /api/reservations/{reservationId}/cancel
  ├─ reason (optional)
  └─ Returns: success or error

PUT /api/reservations/{reservationId}/assign-investor
  ├─ investorId
  └─ Returns: success or error
```

**System Operations:**
```
CRON /api/reservations/check-sla-expiry (every 5min)
  ├─ Find reservations where currentTime > slaDeadline
  ├─ Transition to EXPIRED
  ├─ Release slots
  └─ Send notifications
```

---

### 7.3 DATA MODEL UPDATES

**Ticket Table:**
```sql
tickets:
  - availableCapacity (calculated: total - reserved - completed)
  - state (enum: AVAILABLE, PARTIALLY_FILLED, ...)
  - totalCapacity
```

**Reservation Table:**
```sql
reservations:
  - id (UUID)
  - reservationNumber (human-readable: RES-YYYY-NNNNNN)
  - ticketId (FK)
  - userId (FK)
  - investorId (FK, nullable)
  - state (enum: DRAFT, PENDING, ACTIVE, ...)
  - slotsCount
  - createdAt
  - slaDeadline
  - cancelledAt
  - cancelReason
  - convertedAt
```

**User Table:**
```sql
users:
  - globalSlotsLimit (e.g., 10)
  - globalSlotsUsed (calculated from active reservations)
  - globalSlotsRemaining (calculated: limit - used)
```

---

## PART 8: SUCCESS METRICS

### 8.1 CONVERSION METRICS

**Primary KPIs:**
1. **Reservation Completion Rate**: (Reservations created / "Rezervovat" clicks) × 100
   - Target: 70%+ (professional users, high intent)

2. **Commission Per Reservation**: Average commission CZK per created reservation
   - Target: Align with ticket commission distribution

3. **Time to Reserve**: Median time from "Rezervovat" click to "Dokončit"
   - Target: < 3 minutes for returning users

**Secondary KPIs:**
4. **Step Abandonment Rate**: Where users drop off in 4-step flow
   - Step 1 → 2: < 15%
   - Step 2 → 3: < 10%
   - Step 3 → 4: < 5%

5. **Reservation → Conversion Rate**: (Converted reservations / Total reservations) × 100
   - Target: 40%+ (depends on investor quality, SLA compliance)

6. **Cancellation Rate**: (Cancelled reservations / Total reservations) × 100
   - Target: < 20% (voluntary cancellations)

7. **Expiry Rate**: (Expired reservations / Total reservations) × 100
   - Target: < 15% (SLA management)

---

### 8.2 ENGAGEMENT METRICS

**Table Interactions:**
1. **Expand Rate**: (Rows expanded / Total rows viewed) × 100
   - Hypothesis: Users expand to see matching investors before reserving

2. **Filter Usage**: % of sessions using filters
   - Most used filter: Commission (max → min) - should be default

3. **Commission Click-Through**: (Commission cell clicks / Table views) × 100
   - If commission is clickable (tooltip with calculation)

**Matching Investors:**
4. **Match Selection Rate**: (Recommended investor selected / Total reservations) × 100
   - Target: 60%+ (algorithm effectiveness)

5. **Investor Deferral Rate**: ("Doplnit později" / Total reservations) × 100
   - Target: < 30% (encourages immediate assignment)

---

### 8.3 A/B TEST HYPOTHESES

**Test 1: Commission Placement**
- **Variant A**: Commission in rightmost column (current design)
- **Variant B**: Commission in second column (after Ticket ID)
- **Hypothesis**: Earlier commission visibility increases reservation rate
- **Metric**: Reservation completion rate

**Test 2: Matching Investors Visibility**
- **Variant A**: Matching investors in expanded row (current design)
- **Variant B**: Matching investors in collapsed row (top 1 investor shown)
- **Hypothesis**: Immediate visibility of matching investor increases clicks
- **Metric**: "Rezervovat" click-through rate

**Test 3: Step Count**
- **Variant A**: 4 steps (current design)
- **Variant B**: 3 steps (combine Steps 1+2)
- **Hypothesis**: Fewer steps reduces abandonment
- **Metric**: Reservation completion rate, step abandonment rate

**Test 4: SLA Messaging**
- **Variant A**: SLA shown as deadline (current design)
- **Variant B**: SLA shown as time pressure ("Jednejte do 48 hodin")
- **Hypothesis**: Urgency framing increases conversion (but may reduce trust)
- **Metric**: Reservation completion rate, user feedback on trust

---

## END OF DOCUMENT

**Document Status:** Complete
**Last Updated:** 2025-01-01
**Implementation Ready:** Yes
**Approval Required:** Product, Engineering, Compliance

---

## QUICK REFERENCE

**TL;DR for Developers:**

1. **Ticket Table:** Hybrid expandable table, 7 columns collapsed, 5 sections expanded
2. **Reservation Flow:** 4-step side panel modal (600px)
3. **State Machine:** 6 ticket states, 7 reservation states
4. **Commission Visibility:** Shown 5 times during flow (reinforcement)
5. **Matching Investors:** Pre-shown in expanded row (pre-qualification)
6. **SLA:** Transparent factual urgency (not marketing)
7. **Reversibility:** Clear cancellation flow, no penalties

**TL;DR for Designers:**

1. **Professional B2B:** No gamification, no dark patterns, calm interface
2. **Commission-Driven:** CZK-first (not percentage), bold, prominent
3. **Progressive Disclosure:** Collapsed → Expanded → Modal (3 levels)
4. **State Transparency:** Always show why action is blocked
5. **No Dead Ends:** Every error has recovery path

**TL;DR for Product:**

1. **Conversion Focus:** Commission visibility + matching investors + reversibility
2. **Trust Focus:** SLA transparency + state clarity + no lock-in
3. **Professional UX:** Enterprise patterns (side panel, hybrid table)
4. **Metrics:** Track conversion funnel, step abandonment, commission per reservation
5. **A/B Tests:** Commission placement, matching visibility, step count
