# SCREEN-STATE-ACTION MAPPING – TIPARI.CZ
**Deterministic UI Behavior Specification**

**Document Type:** Screen ↔ State Connection Layer
**Date:** 2025-01-01
**Status:** Authoritative Reference

---

## DOCUMENT PURPOSE

This document connects:
- SCREENS (from SCREEN_MAP.md)
- STATES (from STATE_DIAGRAM.md)
- ACTIONS (allowed per state per screen)

**Goal:** Define exactly what user sees and can do on each screen based on entity state.

**Principle:** If you know the screen + entity state, you can deterministically predict UI behavior.

---

## MAPPING STRUCTURE

For each screen:
1. **Primary Entity** – Which entity's state drives this screen
2. **Visible States** – Which states are shown on this screen
3. **Hidden States** – States that exist but are not exposed here
4. **Allowed Actions** – What user can do per state
5. **Forbidden Actions** – What user cannot do and why
6. **Transition Triggers** – What causes state changes from this screen

---

## AUTHENTICATION & ACCESS SCREENS

### 🔹 LOGIN SCREEN

**Primary Entity:** None (pre-authentication)

**Visible States:** N/A

**Allowed Actions:**
- Enter credentials
- Request password reset
- View "Account locked" message if applicable

**Forbidden Actions:**
- Access any authenticated screen
- View any project/reservation data

**Transition Triggers:**
- Successful login → Redirect to Dashboard
- Failed login → Show error, stay on Login

---

### 🔹 PASSWORD RESET SCREEN

**Primary Entity:** None

**Visible States:** N/A

**Allowed Actions:**
- Enter email for reset
- Submit reset request
- View confirmation message

**Forbidden Actions:**
- Reset without email validation
- Access authenticated screens

**Transition Triggers:**
- Reset submitted → Show confirmation, redirect to Login

---

### 🔹 ACCOUNT LOCKED SCREEN

**Primary Entity:** User Account (not in core entities but implied)

**Visible States:**
- Account locked (reason shown)

**Allowed Actions:**
- View lock reason
- Contact support (link/email)

**Forbidden Actions:**
- Unlock via UI (requires admin)
- Access any authenticated features

**Transition Triggers:** None (user cannot trigger, admin-only)

---

## CORE WORKSPACE SCREENS

### 🔹 DASHBOARD (PŘEHLED)

**Primary Entities:** 
- Project (aggregated)
- Reservation (aggregated)
- Commission (aggregated)
- Investor (aggregated)

**Visible States:**

**Project States Visible:**
- OPEN (count)
- PAUSED (count)
- FULLY_RESERVED (count)
- FINISHED (count)
- State NOT exposed: PENDING_APPROVAL, REJECTED, WITHDRAWN (not shown in public stats)

**Reservation States Visible:**
- Active count (phase = MEETING_CONFIRMED)
- Waiting count (phases 1-3)
- Completed count (phases 5-6)
- State NOT exposed: Individual phase details (shown in activity feed only)

**Commission States Visible:**
- EXPECTED (sum)
- EARNED + PENDING_PAYMENT (sum)
- PAID (sum)
- State NOT exposed: LOST, SUSPENDED, UNDER_RECOVERY (admin-level)

**Investor States Visible:**
- ACTIVE (count)
- PROSPECT (count)
- INACTIVE (count)
- State NOT exposed: DORMANT (grouped with INACTIVE)

**Allowed Actions:**
- Navigate to any main section
- View recent activities (last 6)
- View top projects (by relevance)
- Click through to entity detail

**Forbidden Actions:**
- Create reservation from dashboard (must go through project detail)
- Modify any entity state
- Approve/reject anything (no admin controls)

**Transition Triggers:**
- Navigation only (no state changes from this screen)

---

### 🔹 NOTIFICATION PANEL

**Primary Entity:** System Notification (not in core entities but system-level)

**Visible States:**
- Unread notifications (count)
- Read notifications (list)

**Related Entity States Shown:**
- Reservation phase changes (shown as activity)
- SLA warnings (shown as alert)
- Admin overrides (shown as notification)

**Allowed Actions:**
- View notification list
- Mark notification as read
- Click through to related entity

**Forbidden Actions:**
- Dismiss SLA warnings permanently
- Delete notifications (only mark as read)
- Disable critical notifications

**Transition Triggers:**
- Mark as read → Update notification state (local only)
- Click through → Navigate to entity detail

---

## PROJECT CATALOG SCREENS

### 🔹 PROJECT LIST (PROJEKTY - NABÍDKA)

**Primary Entity:** Project

**Visible States:**
- **OPEN** → Labeled: "Aktivní" (green badge)
- **PAUSED** → Labeled: "Pozastaveno" (blue badge)
- **LAST_SLOTS** → Labeled: "Poslední sloty" (orange badge)
- **FULLY_RESERVED** → Labeled: "Plně rezervováno" (gray badge)
- **FINISHED** → Labeled: "Dokončeno" (dark gray badge)

**Hidden States:**
- PENDING_APPROVAL (not shown in public list)
- APPROVED (immediately goes to OPEN)
- REJECTED (not shown in public list)
- WITHDRAWN (not shown in public list)

**State Filtering:**
- Toggle "Show closed projects" → Shows/hides FULLY_RESERVED + FINISHED
- Default: Only OPEN, PAUSED, LAST_SLOTS shown

**Allowed Actions:**
- View project card
- Click "Zobrazit detail" → Navigate to Project Detail
- Filter by investment form, search, sort
- Open advanced filters

**Forbidden Actions:**
- ❌ Create reservation from list view (must go to detail)
- ❌ Edit project (no edit controls for Tipař)
- ❌ Approve/reject project (admin only)
- ❌ Change project state (admin only)

**Transition Triggers:**
- None (read-only view, state changes happen elsewhere)

**State-Dependent UI:**
- If state = OPEN OR LAST_SLOTS → "Rezervovat" button is enabled in detail
- If state = PAUSED → Show pause reason, no new reservations
- If state = FULLY_RESERVED → Show "Plně obsazeno", no actions
- If state = FINISHED → Show completion date, historical view

---

### 🔹 PROJECT DETAIL

**Primary Entities:** 
- Project (main)
- Ticket (list)
- Reservation (related)

**Project States Visible:**
- OPEN → Full detail, tickets reservable
- PAUSED → Show pause message, no new reservations
- LAST_SLOTS → Urgency indicator (factual, not marketing)
- FULLY_RESERVED → Historical view, no actions
- FINISHED → Historical view, show outcome

**Project States Hidden:**
- PENDING_APPROVAL (Tipař sees this in "My Projects" only)
- REJECTED (Tipař sees this in "My Projects" only)
- WITHDRAWN (shown with reason if user was involved)

**Ticket States Visible (per ticket in table):**
- AVAILABLE → Green indicator, "Rezervovat" enabled
- PARTIALLY_FILLED → Show occupancy (e.g., "7/10 slotů"), "Rezervovat" enabled
- LAST_CAPACITY → Orange indicator, "Rezervovat" enabled
- FULLY_FILLED → Gray indicator, "Rezervovat" disabled

**Ticket States Hidden:**
- DRAFT (never shown to Tipař)
- CLOSED (shown as FULLY_FILLED or with admin note)

**Reservation States (shown in activity log):**
- All phases shown as activity timeline
- Active reservations count shown per ticket
- Expired reservations logged but not blocking

**Allowed Actions PER PROJECT STATE:**

**IF Project = OPEN OR LAST_SLOTS:**
- ✅ View all project details
- ✅ View tickets table
- ✅ Click "Rezervovat" on available tickets
- ✅ Download available documents
- ✅ View LTV details modal
- ✅ View security details modal

**IF Project = PAUSED:**
- ✅ View all project details
- ✅ View tickets table (read-only)
- ❌ Cannot create reservation → Show: "Projekt je pozastaven"
- ✅ Download available documents
- ✅ View existing reservations (if any)

**IF Project = FULLY_RESERVED:**
- ✅ View all project details (historical)
- ✅ View tickets table (all filled)
- ❌ Cannot create reservation → Show: "Projekt je plně obsazen"
- ✅ Download available documents

**IF Project = FINISHED:**
- ✅ View all project details (archival)
- ✅ View final outcome
- ❌ Cannot create reservation → Show: "Projekt je dokončen"
- ✅ Download all documents (full access)

**Allowed Actions PER TICKET STATE:**

**IF Ticket = AVAILABLE OR PARTIALLY_FILLED OR LAST_CAPACITY:**
- ✅ Click "Rezervovat" → Opens Reservation Modal
- ✅ View ticket details (amount, yield, duration, commission)
- ✅ View security details
- ✅ View matching investors (if recommender exists)

**IF Ticket = FULLY_FILLED:**
- ❌ Cannot reserve → Show: "Tiket je plně obsazen"
- ✅ View ticket details (read-only)
- ✅ View historical data

**IF Ticket = CLOSED:**
- ❌ Cannot reserve → Show: "Tiket byl uzavřen administrátorem"
- ✅ View ticket details (read-only)
- ✅ View closure reason (if provided by admin)

**Forbidden Actions:**
- ❌ Edit project details (no edit mode)
- ❌ Edit ticket details (no edit mode)
- ❌ Create ticket (admin only)
- ❌ Pause/resume project (admin only)
- ❌ Upload documents (admin/partner only)
- ❌ Approve/reject project (admin only)

**Transition Triggers FROM THIS SCREEN:**
- Click "Rezervovat" → Opens Reservation Modal (no state change yet)
- Submit reservation → Ticket transitions:
  - AVAILABLE → PARTIALLY_FILLED (if first reservation)
  - PARTIALLY_FILLED → LAST_CAPACITY (if occupancy > 80%)
  - LAST_CAPACITY → FULLY_FILLED (if occupancy = 100%)
- Reservation expiry/cancellation → Ticket may transition back:
  - FULLY_FILLED → PARTIALLY_FILLED (capacity freed)
  - PARTIALLY_FILLED → AVAILABLE (if all reservations gone)

**State-Dependent UI Elements:**

**Project Header:**
- State badge (color-coded, text label)
- If PAUSED → Show pause reason + admin override info
- If time-limited → Show SLA countdown (factual)

**Tickets Table:**
- Occupancy column shows: "X / Y slotů" (actual numbers)
- State indicator column (color + text)
- "Rezervovat" button:
  - Enabled if ticket allows + project allows
  - Disabled with tooltip if blocked (shows reason)

**Documents Section:**
- Document status per item (Available / Pending / Not available)
- Download enabled only if status = Available

**Activity Log:**
- Shows all reservation events on this project
- Shows admin overrides (if any)
- Shows document uploads

---

### 🔹 ADVANCED FILTERS PANEL

**Primary Entity:** None (UI-only filter state)

**Visible States:** N/A (filters project list, doesn't show entity states)

**Allowed Actions:**
- Select filter criteria (yield, LTV, duration, asset class, etc.)
- Apply filters → Update project list
- Reset filters → Clear all criteria
- Close panel

**Forbidden Actions:**
- Filter by states not available to Tipař (e.g., PENDING_APPROVAL)
- Save filter presets (not implemented)

**Transition Triggers:**
- Filter changes → Re-query project list (client-side filtering)
- No entity state changes

---

## TICKET & RESERVATION FLOW SCREENS

### 🔹 RESERVATION CREATION MODAL

**Primary Entities:**
- Ticket (selected)
- Reservation (being created)
- Global Slots (Tipař capacity)

**Ticket State Check (Modal Won't Open If):**
- Ticket = FULLY_FILLED → Modal blocked, show: "Tiket je plně obsazen"
- Ticket = CLOSED → Modal blocked, show: "Tiket byl uzavřen"
- Project = PAUSED → Modal blocked, show: "Projekt je pozastaven"
- Project = FULLY_RESERVED → Modal blocked, show: "Projekt je plně rezervován"

**Slot Availability Checks (Shown in Modal):**
1. **Global Slots:**
   - Show: "Zbývající sloty: X / Y"
   - If X = 0 → Block action, show: "Nemáte volné sloty"

2. **Per-Ticket Reservation Limit:**
   - Show: "Vaše rezervace na tento tiket: X / 3"
   - If X = 3 → Block action, show: "Překročen limit 3 rezervací na tiket"

3. **Ticket Capacity:**
   - Show: "Dostupná kapacita: X / Y slotů"
   - If X = 0 → Block action, show: "Tiket je plně obsazen"

**Modal States:**
- **READY** → All checks passed, form ready
- **LOADING** → Reservation being created
- **SUCCESS** → Reservation created, show confirmation
- **ERROR** → Creation failed, show error + reason

**Allowed Actions:**

**IF All Checks Pass:**
- ✅ Select investor from matching list
- ✅ Adjust slot quantity (if multiple slots available)
- ✅ View commission estimate (calculated real-time)
- ✅ View SLA information (what happens after creation)
- ✅ Click "Potvrdit rezervaci" → Create reservation

**IF Any Check Fails:**
- ❌ Cannot proceed → Show specific blocking reason
- ✅ Can close modal
- ✅ Can view alternative tickets (if suggested)

**Forbidden Actions:**
- ❌ Create reservation without investor selection
- ❌ Create reservation exceeding global slots
- ❌ Create reservation exceeding per-ticket limit (3)
- ❌ Create reservation on fully filled ticket
- ❌ Create reservation on paused project

**Transition Triggers:**

**ON SUCCESS (Reservation Created):**
1. **Reservation State:** [NONE] → PENDING_APPROVAL
2. **Ticket State:** 
   - AVAILABLE → PARTIALLY_FILLED (if first reservation)
   - PARTIALLY_FILLED → LAST_CAPACITY (if occupancy > 80%)
   - LAST_CAPACITY → FULLY_FILLED (if capacity = 100%)
3. **Project State:**
   - OPEN → LAST_SLOTS (if total available tickets < 20%)
   - LAST_SLOTS → FULLY_RESERVED (if all tickets filled)
4. **Commission State:** [NONE] → EXPECTED (commission record created)
5. **Global Slots:** Tipař remaining slots decremented by 1
6. **SLA:** Countdown starts (Phase 1 deadline set)

**ON ERROR:**
- No state changes
- User can retry with corrections

**Post-Creation Actions:**
- Show Reservation Confirmation Modal
- Option to view reservation detail
- Option to return to project list

---

### 🔹 RESERVATION CONFIRMATION MODAL

**Primary Entity:** Reservation (just created)

**Visible States:**
- Reservation Phase: PENDING_APPROVAL (shown as "Čeká na schválení")

**Allowed Actions:**
- View reservation number (e.g., RES-2024-001234)
- View next step (what happens next)
- View SLA countdown (when approval needed by)
- Click "Zobrazit detail" → Navigate to Reservation Detail Modal
- Click "Zavřít" → Return to project detail

**Forbidden Actions:**
- ❌ Edit reservation (no edit mode, must cancel and recreate)
- ❌ Cancel reservation (too early, must go through detail)

**Transition Triggers:**
- No state changes from this modal (confirmation only)

---

### 🔹 RESERVATION DETAIL MODAL

**Primary Entity:** Reservation

**All Reservation States Visible:**
- PENDING_APPROVAL
- WAITING_INVESTOR_SIGNATURE
- WAITING_DEVELOPER_DECISION
- WAITING_MEETING_SELECTION
- MEETING_CONFIRMED (ACTIVE)
- MEETING_COMPLETED
- SUCCESS
- NO_DEAL
- EXPIRED
- CANCELLED

**Phase-Specific Visibility:**

**PHASE 1: PENDING_APPROVAL**
- Show: Reservation number, created date, SLA countdown
- Show: Next actor = ADMIN
- Show: Expected action = "Čeká na schválení platformou"
- Identity: Investor name HIDDEN (shows "Přiřazený investor")

**PHASE 2: WAITING_INVESTOR_SIGNATURE**
- Show: Reservation number, RA sent date, SLA countdown
- Show: Next actor = INVESTOR
- Show: Expected action = "Čeká na podpis investora"
- Identity: Investor name HIDDEN (shows "Přiřazený investor")
- Documents: RA document link (if available)

**PHASE 3: WAITING_DEVELOPER_DECISION**
- Show: Investor signed date, SLA countdown
- Show: Next actor = PARTNER
- Show: Expected action = "Čeká na rozhodnutí partnera"
- Identity: Investor name HIDDEN (shows "Přiřazený investor")

**PHASE 4: WAITING_MEETING_SELECTION**
- Show: Partner approved date, proposed meeting dates, SLA countdown
- Show: Next actor = INVESTOR
- Show: Expected action = "Čeká na výběr termínu"
- Identity: Investor name HIDDEN (shows "Přiřazený investor")

**PHASE 5: MEETING_CONFIRMED (ACTIVE)**
- Show: Meeting confirmed date, selected meeting date, location
- Show: Next actor = NONE (awaiting meeting date)
- Show: Expected action = "Schůzka potvrzena, čeká se na termín"
- Identity: **Investor name REVEALED** (shows full name)
- **This is the ONLY phase where identities are revealed**

**PHASE 6: MEETING_COMPLETED**
- Show: Meeting completed date, SLA countdown (for outcome)
- Show: Next actor = ADMIN
- Show: Expected action = "Čeká se na uzavření"
- Identity: Investor name REVEALED

**PHASE 7A: SUCCESS**
- Show: Closed date, investment agreement link
- Show: Commission earned indicator
- Identity: Investor name REVEALED
- Terminal state badge: "Úspěšně uzavřeno"

**PHASE 7B: NO_DEAL**
- Show: Closed date, reason (if provided)
- Show: Commission lost indicator
- Identity: Investor name REVEALED (or kept hidden if never reached phase 5)
- Terminal state badge: "Nedohodnutý obchod"

**PHASE X: EXPIRED**
- Show: Expiry date, which phase expired
- Show: SLA violation logged
- Show: Slot released info
- Identity: Investor name HIDDEN (unless was in phase 5+)
- Terminal state badge: "Expirováno"

**PHASE X: CANCELLED**
- Show: Cancellation date, who cancelled, reason
- Show: Slot released info
- Identity: Investor name as per phase when cancelled
- Terminal state badge: "Zrušeno"

**Timeline Component:**
- Shows all phases (1-6) with visual progression
- Current phase highlighted
- Completed phases checked
- Future phases grayed out
- Timestamps shown for completed phases

**Allowed Actions PER PHASE:**

**PHASE 1 (PENDING_APPROVAL):**
- ✅ View reservation details
- ✅ Cancel reservation (with reason)
- ❌ Cannot edit (must cancel and recreate)
- ❌ Cannot approve (admin only)

**PHASE 2 (WAITING_INVESTOR_SIGNATURE):**
- ✅ View reservation details
- ✅ View RA document (if uploaded)
- ✅ Cancel reservation (with reason)
- ❌ Cannot sign RA (investor does this offline)
- ❌ Cannot skip to next phase

**PHASE 3 (WAITING_DEVELOPER_DECISION):**
- ✅ View reservation details
- ✅ View signed RA (if uploaded)
- ✅ Cancel reservation (with reason)
- ❌ Cannot approve/reject (partner does this via admin)

**PHASE 4 (WAITING_MEETING_SELECTION):**
- ✅ View reservation details
- ✅ View proposed meeting dates
- ✅ Cancel reservation (with reason)
- ❌ Cannot select meeting (investor does this offline, admin updates)

**PHASE 5 (MEETING_CONFIRMED - ACTIVE):**
- ✅ View reservation details (full visibility)
- ✅ View investor identity
- ✅ View meeting details (date, time, location)
- ✅ Download meeting confirmation
- ✅ Cancel reservation (with reason, rare)
- ❌ Cannot change meeting date (requires admin)

**PHASE 6 (MEETING_COMPLETED):**
- ✅ View reservation details
- ✅ View meeting outcome notes
- ❌ Cannot upload investment agreement (admin only)
- ❌ Cannot mark as SUCCESS/NO_DEAL (admin only)

**PHASE 7A (SUCCESS):**
- ✅ View complete reservation history
- ✅ View investment agreement
- ✅ View earned commission details
- ✅ Download all documents
- ❌ Cannot modify (terminal state)

**PHASE 7B (NO_DEAL):**
- ✅ View complete reservation history
- ✅ View closure reason
- ✅ View lost commission record
- ❌ Cannot revive (terminal state)

**PHASE X (EXPIRED):**
- ✅ View reservation history up to expiry
- ✅ View which SLA was violated
- ✅ View auto-release log
- ❌ Cannot revive (terminal state)
- ❌ Cannot extend SLA after expiry

**PHASE X (CANCELLED):**
- ✅ View reservation history up to cancellation
- ✅ View cancellation reason and actor
- ✅ View slot release confirmation
- ❌ Cannot revive (terminal state)

**Forbidden Actions (All Phases):**
- ❌ Edit reservation details (immutable)
- ❌ Change investor assignment (immutable)
- ❌ Skip phases (must progress sequentially)
- ❌ Manually transition phases (system/admin only)
- ❌ Delete reservation (audit trail required)

**Transition Triggers FROM THIS SCREEN:**

**User-Triggered:**
- Click "Zrušit rezervaci" → Reservation: [Current Phase] → CANCELLED
  - Side effect: Slot released, commission → LOST

**System-Triggered (shown in modal):**
- SLA expiry → Reservation: [Current Phase] → EXPIRED
  - Side effect: Slot released, commission → LOST
  - Auto-notification sent to Tipař

**Admin-Triggered (via backend, shown in modal):**
- Admin approves → PENDING_APPROVAL → WAITING_INVESTOR_SIGNATURE
- Investor signs (admin logs) → Phase 2 → Phase 3
- Partner approves (admin logs) → Phase 3 → Phase 4
- Investor selects meeting (admin logs) → Phase 4 → Phase 5
- Meeting date passes (system + admin confirm) → Phase 5 → Phase 6
- Admin uploads agreement → Phase 6 → SUCCESS
- Admin marks no deal → Phase 6 → NO_DEAL
- Admin extends SLA → Show override in timeline

**SLA Countdown Component:**
- Shown in modal header
- Updates in real-time
- Color-coded:
  - Green: > 48h remaining
  - Orange: 24-48h remaining
  - Red: < 24h remaining
  - Gray: Expired or no SLA

---

### 🔹 SLA COUNTDOWN COMPONENT

**Primary Entity:** Reservation (SLA timer)

**Visible States:**
- Time remaining until SLA expiry
- SLA expired indicator

**Allowed Actions:**
- View countdown
- See SLA deadline (absolute timestamp)

**Forbidden Actions:**
- ❌ Extend SLA (admin only)
- ❌ Pause SLA (not allowed)
- ❌ Reset SLA (not allowed)

**Transition Triggers:**
- SLA reaches 0 → Auto-transition to EXPIRED
- Admin extends SLA → Countdown updates with new deadline (admin override shown)

---

## INVESTOR HANDLING SCREENS

### 🔹 INVESTORS LIST

**Primary Entity:** Investor (internal records)

**Visible States:**
- **ACTIVE** → Labeled: "Aktivní" (green)
- **PROSPECT** → Labeled: "Prospekt" (blue)
- **INACTIVE** → Labeled: "Neaktivní" (gray)
- **DORMANT** → Labeled: "Pasivní" (light gray)

**State Filtering:**
- Filter dropdown: ALL / ACTIVE / PROSPECT / INACTIVE / DORMANT
- Default: Show all

**Allowed Actions:**
- View investor table
- Search investors (name, email, ID)
- Filter by status
- Click investor row → Navigate to Investor Detail
- Click "Kontaktovat" (email link)

**Forbidden Actions:**
- ❌ Create investor (not implemented, would be admin)
- ❌ Delete investor (audit trail required)
- ❌ Change investor status (system-based on activity)
- ❌ Expose investor to platform UI (they never log in)

**Transition Triggers:**
- None from this screen (read-only)
- Investor status changes based on reservation activity (backend logic)

---

### 🔹 INVESTOR DETAIL

**Primary Entity:** Investor

**Visible States:**
- Investor status: ACTIVE / PROSPECT / INACTIVE / DORMANT
- Related reservation states (if investor has reservations)

**Allowed Actions:**
- View investor profile (name, type, contact info)
- View investment preferences
- View capacity information
- View reservation history:
  - Active reservations (phase = MEETING_CONFIRMED)
  - Pending reservations (phases 1-4)
  - Completed reservations (phases 6+)
- View client matches (recommended projects)
- Click "Rezervovat pro investora" → Navigate to recommended project
- Add internal notes (if implemented)

**Forbidden Actions:**
- ❌ Edit investor details (no edit mode)
- ❌ Delete investor (audit trail required)
- ❌ Manually change investor status
- ❌ Create reservation directly from investor detail (must go through project)
- ❌ Expose investor to any platform UI

**Transition Triggers:**
- Click "Rezervovat" on recommended project → Navigate to Project Detail
- No direct state changes from this screen

---

### 🔹 CLIENT MATCHES MODAL

**Primary Entity:** Investor + Project (matching logic)

**Visible States:**
- Project states: OPEN, LAST_SLOTS (only active projects shown)
- Match percentage (calculated, not a state)

**Allowed Actions:**
- View matching projects for investor
- View match percentage + reasoning
- Click "Rezervovat" → Navigate to Project Detail with pre-selected investor context

**Forbidden Actions:**
- ❌ Create reservation directly from modal (must go through project detail)
- ❌ Adjust match algorithm (system logic)
- ❌ Show paused/closed projects

**Transition Triggers:**
- None (recommendation view only)

---

## DOCUMENTS & CONTRACTS SCREENS

### 🔹 DOCUMENT REPOSITORY (Embedded in Project Detail)

**Primary Entity:** Document (project-level)

**Document States Visible:**
- **AVAILABLE** → Show download icon, clickable
- **PENDING** → Show "Připravuje se" indicator, not clickable
- **NOT_AVAILABLE** → Show "Nedostupné" label, grayed out

**Allowed Actions:**

**IF Document State = AVAILABLE:**
- ✅ Download document
- ✅ View document (PDF viewer modal)
- ✅ View upload date, file size, file type

**IF Document State = PENDING:**
- ❌ Cannot download → Show: "Dokument se připravuje"
- ✅ View expected availability date (if known)

**IF Document State = NOT_AVAILABLE:**
- ❌ Cannot download → Show: "Dokument není k dispozici"
- ✅ View reason (if provided by admin)

**Forbidden Actions:**
- ❌ Upload document (admin/partner only)
- ❌ Delete document (admin only)
- ❌ Edit document metadata (admin only)
- ❌ Change document status (system/admin)

**Transition Triggers:**
- Admin uploads document → NOT_AVAILABLE → PENDING → AVAILABLE
- No user-triggered transitions

---

### 🔹 PDF VIEWER MODAL

**Primary Entity:** Document (viewing)

**Visible States:** Document content rendered

**Allowed Actions:**
- View PDF in iframe
- Scroll through document
- Close viewer
- Download document (optional button)

**Forbidden Actions:**
- ❌ Edit document (read-only viewer)
- ❌ Print document (if restricted by admin)

**Transition Triggers:** None (viewing only)

---

## COMMISSION & FINANCE SCREENS

### 🔹 COMMISSION OVERVIEW

**Primary Entity:** Commission

**All Commission States Visible:**
- **EXPECTED** → Labeled: "Očekávaná" (blue badge)
- **EARNED** → Labeled: "Zasloužená" (green badge)
- **PENDING_PAYMENT** → Labeled: "Čeká na vyplacení" (orange badge)
- **PAID** → Labeled: "Vyplaceno" (green badge)
- **LOST** → Labeled: "Propadlá" (gray badge)

**Commission States Hidden (Admin-Level):**
- SUSPENDED (not shown to Tipař, admin resolves)
- UNDER_RECOVERY (not shown to Tipař, admin handles)

**State Filtering:**
- Sub-tabs: Všechny / Moje projekty / Moje rezervace
- Status filter: ALL / EXPECTED / EARNED / PENDING_PAYMENT / PAID

**Aggregated Metrics:**
- Total PAID (sum)
- Total EXPECTED (sum)
- Total EARNED + PENDING_PAYMENT (sum)
- Completed deals (count where status = PAID)

**Allowed Actions:**
- View commission table (all commissions)
- Filter by status
- Filter by source (project vs. reservation)
- Click commission row → Navigate to Commission Detail
- Search by project name, reservation number

**Forbidden Actions:**
- ❌ Create commission manually (system-generated only)
- ❌ Edit commission amount (system-calculated)
- ❌ Delete commission (audit trail required)
- ❌ Mark as PAID (admin only)
- ❌ Approve commission (admin only)

**Transition Triggers:**
- View only, no state changes from this screen
- Commission state changes driven by reservation state:
  - Reservation → SUCCESS: Commission EXPECTED → EARNED
  - Reservation → NO_DEAL/EXPIRED: Commission EXPECTED → LOST

---

### 🔹 COMMISSION DETAIL (Reservation-Based)

**Primary Entity:** Commission (tied to specific reservation)

**Commission States Visible:**
- EXPECTED, EARNED, PENDING_PAYMENT, PAID, LOST (same as overview)

**Related Reservation State Shown:**
- Current reservation phase
- Reservation timeline (read-only)

**State-Specific UI:**

**IF Commission = EXPECTED:**
- Show: "Provize bude zasloužena po uzavření rezervace"
- Show: Linked reservation current phase
- Show: Expected date (if reservation progressing normally)
- Show: Commission calculation (rate × investment amount)

**IF Commission = EARNED:**
- Show: "Provize zasloužena – připravte fakturu"
- Show: Earned date (when reservation → SUCCESS)
- Show: Next step: "Odeslat fakturu"
- CTA: "Odeslat fakturu" (if invoice system implemented)

**IF Commission = PENDING_PAYMENT:**
- Show: "Provize čeká na vyplacení"
- Show: Invoice number (if submitted)
- Show: Expected payment date (if known)
- Show: Payment processing status

**IF Commission = PAID:**
- Show: "Provize vyplacena"
- Show: Paid date
- Show: Payment reference
- Show: Invoice number
- No further actions (terminal state)

**IF Commission = LOST:**
- Show: "Provize propadla"
- Show: Reason (reservation NO_DEAL, EXPIRED, or CANCELLED)
- Show: Related reservation closure details
- No recovery option (terminal state)

**Allowed Actions:**

**IF Commission = EARNED:**
- ✅ View commission details
- ✅ Submit invoice (if system supports)
- ✅ Download commission statement

**IF Commission = PENDING_PAYMENT:**
- ✅ View commission details
- ✅ View invoice status
- ✅ Contact admin about payment (support link)

**IF Commission = PAID:**
- ✅ View complete commission history
- ✅ Download payment confirmation
- ✅ Download invoice

**IF Commission = EXPECTED or LOST:**
- ✅ View commission details (read-only)
- ❌ Cannot submit invoice (not earned yet or lost)

**Forbidden Actions (All States):**
- ❌ Edit commission amount (system-calculated)
- ❌ Change commission rate (contract-based)
- ❌ Mark as PAID manually (admin only)
- ❌ Revive LOST commission (terminal state)
- ❌ Dispute commission (requires admin escalation)

**Transition Triggers FROM THIS SCREEN:**

**User-Triggered:**
- Submit invoice → Commission: EARNED → PENDING_PAYMENT
  - Side effect: Invoice record created, admin notified

**System-Triggered (shown in detail):**
- Reservation → SUCCESS: Commission EXPECTED → EARNED
- Reservation → NO_DEAL/EXPIRED/CANCELLED: Commission EXPECTED → LOST

**Admin-Triggered (via backend, shown in detail):**
- Admin approves invoice → PENDING_PAYMENT → PAID
  - Side effect: Payment reference logged, payment date recorded

---

### 🔹 COMMISSION DETAIL (Project-Based)

**Primary Entity:** Commission (project origination)

**Commission States Visible:** Same as reservation-based

**Difference from Reservation-Based:**
- Shows multiple linked reservations (project can have many)
- Commission calculation spans all successful reservations on project
- Commission earned incrementally as reservations succeed

**State-Specific UI:**

**IF Commission = EXPECTED:**
- Show: "Provize z projektu se akumuluje při uzavírání rezervací"
- Show: Active reservations on project (phase = MEETING_CONFIRMED)
- Show: Potential commission (if all reservations succeed)
- Show: Earned commission so far (from completed reservations)

**IF Commission = EARNED (Partial):**
- Show: "Provize částečně zasloužena"
- Show: Earned amount from completed reservations
- Show: Expected amount from active reservations
- Show: Total potential

**IF Commission = EARNED (Full):**
- Show: "Provize plně zasloužena"
- Show: Total earned amount
- Show: All linked reservations (all SUCCESS)
- CTA: "Odeslat fakturu"

**Allowed Actions:**
- Similar to reservation-based, but with multi-reservation view
- Can track commission accrual over time

**Forbidden Actions:**
- Same as reservation-based

**Transition Triggers:**
- Each linked reservation → SUCCESS: Increment earned commission
- Project-level commission becomes fully EARNED when all reservations closed

---

## MY PROJECTS SCREENS

### 🔹 MY PROJECTS LIST

**Primary Entity:** Project (originated by current Tipař)

**All Project States Visible (Tipař's Own Projects):**
- **PENDING_APPROVAL** → Labeled: "Čeká na schválení" (blue badge)
- **APPROVED** → Labeled: "Schváleno" (green badge, brief state)
- **OPEN** → Labeled: "Aktivní" (green badge)
- **PAUSED** → Labeled: "Pozastaveno" (orange badge)
- **LAST_SLOTS** → Labeled: "Poslední sloty" (orange badge)
- **FULLY_RESERVED** → Labeled: "Plně rezervováno" (gray badge)
- **FINISHED** → Labeled: "Dokončeno" (dark gray badge)
- **REJECTED** → Labeled: "Zamítnuto" (red badge)
- **WITHDRAWN** → Labeled: "Staženo" (gray badge)

**State Filtering:**
- Filter: Open / Closed / Rejected
- Default: Show all

**Allowed Actions:**
- View project table (only projects brought by current Tipař)
- Search projects
- Filter by status
- Click project row → Navigate to My Project Detail
- CTA: "Navrhnout nový projekt" → Project Submission Form

**Forbidden Actions:**
- ❌ View other Tipař's projects (only own)
- ❌ Edit project after submission (admin-only)
- ❌ Delete project (admin-only)
- ❌ Approve/reject own project (admin conflict of interest)

**Transition Triggers:**
- Click "Navrhnout nový projekt" → Create project: [NONE] → PENDING_APPROVAL

---

### 🔹 MY PROJECT DETAIL

**Primary Entity:** Project (Tipař-originated)

**All Project States Visible:**
- Same as My Projects List
- Additional visibility into admin notes/feedback

**State-Specific UI:**

**IF Project = PENDING_APPROVAL:**
- Show: "Projekt čeká na schválení administrátorem"
- Show: Submission date
- Show: Current review status (if visible)
- Show: Estimated approval time (if SLA exists)
- ❌ No actions available (waiting for admin)

**IF Project = REJECTED:**
- Show: "Projekt byl zamítnut"
- Show: Rejection date
- Show: Rejection reason (admin notes)
- Show: What can be improved (if admin provided feedback)
- ✅ CTA: "Navrhnout upravený projekt" (resubmit)

**IF Project = APPROVED:**
- Show: "Projekt byl schválen – brzy bude aktivní"
- Show: Approval date
- Show: Admin notes (if any)
- Waiting for admin to publish (APPROVED → OPEN)

**IF Project = OPEN:**
- Show: Full project detail (same as public Project Detail)
- Show: "Projekt je aktivní a přijímá rezervace"
- Show: Originated by badge (highlight)
- Show: Linked commissions (project origination)

**IF Project = PAUSED:**
- Show: "Projekt byl pozastaven"
- Show: Pause reason (admin or partner provided)
- Show: Expected resume date (if known)
- ❌ Cannot resume via UI (admin/partner action required)

**IF Project = FULLY_RESERVED:**
- Show: "Projekt je plně obsazen"
- Show: All tickets filled
- Show: Commission accrual status

**IF Project = FINISHED:**
- Show: "Projekt je dokončen"
- Show: Completion date
- Show: Final outcome
- Show: Total commissions earned

**IF Project = WITHDRAWN:**
- Show: "Projekt byl stažen"
- Show: Withdrawal date
- Show: Withdrawal reason (who initiated, why)
- Show: Any linked reservations closed

**Allowed Actions PER STATE:**

**IF State = PENDING_APPROVAL:**
- ✅ View submission details
- ✅ View documents uploaded
- ❌ Cannot edit (admin reviewing)
- ❌ Cannot withdraw (not implemented)

**IF State = REJECTED:**
- ✅ View rejection details
- ✅ View feedback
- ✅ Create new submission (not edit existing)

**IF State = OPEN:**
- ✅ View full project detail
- ✅ Monitor reservations
- ✅ Track commissions
- ✅ View activity log
- ❌ Cannot edit (admin-only)

**IF State = FINISHED:**
- ✅ View archival data
- ✅ Download final reports
- ✅ View commission summary

**Forbidden Actions (All States):**
- ❌ Edit project after submission (immutable)
- ❌ Delete project (audit trail required)
- ❌ Approve/reject own project (conflict of interest)
- ❌ Pause/resume project (admin/partner authority)

**Transition Triggers:**
- View only, state changes driven by admin actions

---

### 🔹 PROJECT SUBMISSION FORM

**Primary Entity:** Project (being created)

**Initial State:** [NONE] (not yet created)

**Form Sections:**
1. Basic information (name, location, type, stage, asset class)
2. Financial details (volume, yield, LTV, investment form, commission rate)
3. Security information (secured yes/no, security types, valuation type)
4. Ticket configuration (per-ticket amount, count, duration)
5. Document upload (business plan, financial model, due diligence)

**Allowed Actions:**
- Fill all required fields
- Upload documents
- Preview submission
- Submit for approval → Creates project in PENDING_APPROVAL state

**Forbidden Actions:**
- ❌ Submit incomplete form (validation required)
- ❌ Submit without documents (minimum docs required)
- ❌ Edit after submission (must wait for admin feedback)
- ❌ Set project as OPEN directly (must go through approval)

**Validation Rules:**
- All required fields must be filled
- Financial values must be within platform limits
- Commission rate must be within allowed range
- At least one document required

**Transition Triggers:**
- Submit form → Project: [NONE] → PENDING_APPROVAL
  - Side effect: Admin notified, project appears in approval queue

---

## ACTIVITIES & MONITORING SCREENS

### 🔹 ACTIVITIES OVERVIEW

**Primary Entities:** 
- Reservation (activity events)
- Project (activity events)
- Commission (activity events)

**No Explicit States Shown (Activity Log View):**
- Activities are events, not states
- But activities reference entity states

**Activity Types Shown:**
- Reservation created (show reservation ID + project)
- Reservation phase transition (show old → new phase)
- Reservation cancelled/expired (show reason)
- Project submitted (show project name)
- Project approved/rejected (show admin decision)
- Commission earned (show reservation + amount)
- Commission paid (show payment reference)
- Admin override (show what was changed + reason)

**Allowed Actions:**
- View activity timeline (all activities)
- Filter by sub-tab: Všechny / Moje projekty / Moje rezervace
- Filter by activity type
- Filter by date range
- Search by entity ID or name
- Click activity → Navigate to related entity detail

**Forbidden Actions:**
- ❌ Delete activity (immutable log)
- ❌ Edit activity (immutable log)
- ❌ Hide activity (full transparency)

**Transition Triggers:**
- View only, no state changes
- New activities appear as entities change state

---

### 🔹 MY RESERVATIONS - ACTIVITIES

**Primary Entity:** Reservation (activity log)

**Activity Events Shown:**
- Reservation created
- Phase 1 → Phase 2 (investor signed)
- Phase 2 → Phase 3 (partner approved)
- Phase 3 → Phase 4 (meeting proposed)
- Phase 4 → Phase 5 (meeting confirmed)
- Phase 5 → Phase 6 (meeting completed)
- Phase 6 → SUCCESS (agreement signed)
- Phase 6 → NO_DEAL (no agreement)
- Any phase → EXPIRED (SLA violation)
- Any phase → CANCELLED (manual cancellation)
- SLA warnings (X hours before expiry)
- Admin overrides (SLA extension, manual phase change)

**Allowed Actions:**
- View activity timeline (only user's reservations)
- Filter by reservation status
- Filter by project
- Filter by date range
- Click activity → Navigate to Reservation Detail Modal

**Forbidden Actions:**
- Same as Activities Overview

**Transition Triggers:**
- View only, no state changes

---

### 🔹 MY PROJECTS - ACTIVITIES

**Primary Entity:** Project (Tipař-originated, activity log)

**Activity Events Shown:**
- Project submitted (→ PENDING_APPROVAL)
- Project approved (→ APPROVED → OPEN)
- Project rejected (→ REJECTED)
- Project paused (→ PAUSED)
- Project resumed (→ OPEN)
- Reservation created on project
- Ticket filled (→ FULLY_FILLED)
- Project completed (→ FINISHED)
- Admin overrides on project

**Allowed Actions:**
- View activity timeline (only user's projects)
- Filter by project
- Filter by activity type
- Click activity → Navigate to My Project Detail

**Forbidden Actions:**
- Same as Activities Overview

**Transition Triggers:**
- View only, no state changes

---

## ADMIN SCREENS (Logical Definition Only)

**Note:** Admin screens are NOT fully implemented. These definitions are LOGICAL requirements.

### 🔹 ADMIN DASHBOARD

**Primary Entities:** All (aggregated)

**Visible States:**
- Projects: Count per state (PENDING_APPROVAL, OPEN, PAUSED, etc.)
- Reservations: Count per phase
- Commissions: Sum per state
- SLA violations: Count + alert

**Allowed Actions (Admin Only):**
- View pending approval queue
- View SLA violation alerts
- Navigate to project approval
- Navigate to reservation overrides
- View system health metrics

**Forbidden Actions:**
- ❌ No bulk actions without individual review

---

### 🔹 PROJECT APPROVAL QUEUE

**Primary Entity:** Project (state = PENDING_APPROVAL)

**Visible States:**
- PENDING_APPROVAL (queue items)

**Allowed Actions (Admin Only):**
- View project submission details
- Review documents
- Approve project → PENDING_APPROVAL → APPROVED
- Reject project → PENDING_APPROVAL → REJECTED (reason required)
- Request changes (send feedback to Tipař)

**Forbidden Actions:**
- ❌ Approve without document review
- ❌ Reject without reason

**Transition Triggers:**
- Approve → Project: PENDING_APPROVAL → APPROVED → OPEN (admin publishes)
- Reject → Project: PENDING_APPROVAL → REJECTED (terminal)

---

### 🔹 RESERVATION OVERRIDES

**Primary Entity:** Reservation (admin intervention)

**All Reservation States Visible:**
- Admin can see and modify any reservation state

**Allowed Actions (Admin Only):**
- Extend SLA (reason required)
- Manual phase transition (reason required)
- Force close reservation (reason required)
- Upload documents on behalf of investor/partner
- Mark meeting completed
- Mark as SUCCESS (upload investment agreement)
- Mark as NO_DEAL (reason required)

**Forbidden Actions:**
- ❌ Override without reason (audit requirement)
- ❌ Skip phases without justification

**Transition Triggers:**
- Any manual transition → Log override with reason
- All overrides visible in audit log + user-facing timeline

---

### 🔹 AUDIT LOGS

**Primary Entities:** All (event log)

**Visible States:** All state transitions logged

**Allowed Actions (Admin Only):**
- Search audit log by entity type, entity ID, actor, date
- Filter by event type (created, updated, overridden, deleted)
- Export audit log (compliance requirement)
- View full event details (old value, new value, reason)

**Forbidden Actions:**
- ❌ Delete audit log entries (immutable)
- ❌ Edit audit log entries (immutable)
- ❌ Hide audit log entries (transparency requirement)

**Transition Triggers:**
- View only, no state changes
- All entity state changes automatically logged here

---

## CROSS-SCREEN STATE PROPAGATION

### Global Slot Counter (User Avatar Component)

**Visible Across All Screens:**
- Remaining slots: "X slotů" (shown in user avatar dropdown)

**State Dependency:**
- Decrements when reservation created (any phase except terminal)
- Increments when reservation reaches terminal state (SUCCESS, NO_DEAL, EXPIRED, CANCELLED)

**Blocks Actions If:**
- Remaining slots = 0 → Cannot create new reservation on any screen

---

### SLA Countdown (Visible on Multiple Screens)

**Shown In:**
- Reservation Detail Modal
- Activities feed (as warning)
- Notification panel (if < 24h)

**State Dependency:**
- Tied to current reservation phase
- Different SLA per phase (configured)

**Blocks Actions If:**
- SLA expired → Reservation auto-transitions to EXPIRED (cannot be stopped)

---

### Project/Ticket Capacity (Visible on Multiple Screens)

**Shown In:**
- Project List (card)
- Project Detail (tickets table)
- Reservation Modal (availability check)

**State Dependency:**
- Calculated from: Total capacity - (completed + active + pending reservations)

**Blocks Actions If:**
- Available capacity = 0 → Cannot create reservation
- Ticket becomes FULLY_FILLED → "Rezervovat" button disabled

---

## STATE VISIBILITY MATRIX

| Entity | State | Project List | Project Detail | Reservation Modal | Reservation Detail | Commission Page | My Projects |
|--------|-------|--------------|----------------|-------------------|-------------------|-----------------|-------------|
| **Project** | PENDING_APPROVAL | ❌ Hidden | ❌ Hidden | ❌ Hidden | N/A | N/A | ✅ Visible |
| Project | APPROVED | ❌ Hidden | ❌ Hidden | ❌ Hidden | N/A | N/A | ✅ Visible |
| Project | OPEN | ✅ Visible | ✅ Visible | ✅ Check | N/A | N/A | ✅ Visible |
| Project | PAUSED | ✅ Visible | ✅ Visible | ❌ Blocks | N/A | N/A | ✅ Visible |
| Project | LAST_SLOTS | ✅ Visible | ✅ Visible | ✅ Check | N/A | N/A | ✅ Visible |
| Project | FULLY_RESERVED | Toggle | ✅ Visible | ❌ Blocks | N/A | N/A | ✅ Visible |
| Project | FINISHED | Toggle | ✅ Visible | ❌ Blocks | N/A | N/A | ✅ Visible |
| Project | REJECTED | ❌ Hidden | ❌ Hidden | ❌ Hidden | N/A | N/A | ✅ Visible |
| Project | WITHDRAWN | ❌ Hidden | ❌ Hidden | ❌ Hidden | N/A | N/A | ✅ Visible |
| **Ticket** | DRAFT | ❌ Hidden | ❌ Hidden | ❌ Hidden | N/A | N/A | ❌ Hidden |
| Ticket | AVAILABLE | N/A | ✅ Visible | ✅ Check | N/A | N/A | N/A |
| Ticket | PARTIALLY_FILLED | N/A | ✅ Visible | ✅ Check | N/A | N/A | N/A |
| Ticket | LAST_CAPACITY | N/A | ✅ Visible | ✅ Check | N/A | N/A | N/A |
| Ticket | FULLY_FILLED | N/A | ✅ Visible | ❌ Blocks | N/A | N/A | N/A |
| Ticket | CLOSED | N/A | ✅ Visible | ❌ Blocks | N/A | N/A | N/A |
| **Reservation** | All Phases | N/A | Activity Log | N/A | ✅ Visible | Linked | Activity Log |
| **Commission** | EXPECTED | N/A | N/A | N/A | Linked | ✅ Visible | N/A |
| Commission | EARNED | N/A | N/A | N/A | Linked | ✅ Visible | N/A |
| Commission | PENDING_PAYMENT | N/A | N/A | N/A | Linked | ✅ Visible | N/A |
| Commission | PAID | N/A | N/A | N/A | Linked | ✅ Visible | N/A |
| Commission | LOST | N/A | N/A | N/A | Linked | ✅ Visible | N/A |

**Legend:**
- ✅ Visible = State is shown on this screen
- ❌ Hidden = State exists but not shown here
- ❌ Blocks = State prevents action on this screen
- ✅ Check = State is checked before allowing action
- Toggle = Visibility controlled by user filter
- N/A = Entity not relevant to this screen
- Activity Log = Shown in activity timeline only
- Linked = Shown when related entity is viewed

---

## ACTION PERMISSION MATRIX

| Action | Screen | Allowed If | Blocked If | Admin Override? |
|--------|--------|-----------|------------|-----------------|
| **Create Reservation** | Project Detail → Modal | Project=OPEN/LAST_SLOTS, Ticket=AVAILABLE/PARTIAL/LAST, GlobalSlots>0, PerTicket<3 | Project=PAUSED/FULL/FINISHED, Ticket=FULL/CLOSED, GlobalSlots=0, PerTicket=3 | No |
| **Cancel Reservation** | Reservation Detail | Phase=1-6 (non-terminal) | Phase=TERMINAL | Yes (force close) |
| **View Investor Identity** | Reservation Detail | Phase=MEETING_CONFIRMED+ | Phase<MEETING_CONFIRMED | No |
| **Submit Invoice** | Commission Detail | Commission=EARNED | Commission≠EARNED | No |
| **Approve Project** | Admin: Approval Queue | State=PENDING_APPROVAL | State≠PENDING | Admin only |
| **Extend SLA** | Admin: Reservation Override | Any non-terminal phase | Phase=TERMINAL | Admin only |
| **Mark Commission PAID** | Admin: Commission Approval | Commission=PENDING_PAYMENT | Commission≠PENDING | Admin only |
| **Download Document** | Project Detail: Docs | Document=AVAILABLE | Document=PENDING/NOT_AVAILABLE | No |
| **Edit Project** | N/A (no edit screen) | Never allowed for Tipař | Always blocked | Admin only |
| **Delete Entity** | N/A (no delete UI) | Never allowed | Always blocked (audit) | Admin only (archive) |

---

## END OF SCREEN-STATE-ACTION MAPPING

**Last Updated:** 2025-01-01
**Document Status:** Complete and Authoritative
**Usage:** Reference this document to determine UI behavior for any screen/state combination
**Next Step:** WIREFRAME LOGIC MATRIX for detailed UI response specification
