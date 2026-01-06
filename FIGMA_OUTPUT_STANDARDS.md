# FIGMA OUTPUT STANDARDS — MANDATORY REQUIREMENTS
## Tipari.cz B2B Investment Referral Platform

**Purpose**: Define strict output format requirements for all future Figma prompts to ensure deterministic, consistent, and complete responses.

**Status**: ✅ ACTIVE — All future responses MUST comply with these standards  
**Established**: 2025-01-15  
**Authority**: User directive (PROMPT 10)

---

## 🎯 CORE PRINCIPLES

### **1. DETERMINISM & CONSISTENCY**

**ALWAYS**:
- ✅ Reference the same canonical states (22 states from PROMPT 5)
- ✅ Use the same SLA durations (24h investor, 48h developer, 24h meeting, 30d funding)
- ✅ Apply the same slot limits (3 global levels: Associate/Pro/Elite/Partner with 3/6/10/15 slots)
- ✅ Enforce the same per-ticket limits (max 3 slots, max 3 active reservations per ticket)
- ✅ Use the same color palette (#215EF8, #14AE6B, #040F2A)
- ✅ Reference the same component names from existing codebase

**NEVER**:
- ❌ Create new state names not in the canonical 22-state list
- ❌ Change SLA durations without explicit user instruction
- ❌ Simplify or "streamline" the state machine
- ❌ Invent new data fields not documented in canonical spec
- ❌ Use different terminology for the same concept across responses

---

## 🚫 PROHIBITED SIMPLIFICATIONS

### **NEVER Remove or Skip**:

**1. SLA Timers**
```
❌ WRONG: "After investor signs, developer reviews"
✅ CORRECT: "After investor signs (24h SLA from email sent), 
             state transitions to awaiting_developer_signature_esign 
             with 48h SLA for developer to sign and propose meeting"
```

**Rationale**: SLA is core business logic, not optional UI decoration.

---

**2. Admin Approval (Offline Route)**
```
❌ WRONG: "If using offline signatures, investor and developer sign"
✅ CORRECT: "Route B (Offline):
             1. Investor signs paper → Tipar uploads PDF
             2. Admin reviews within 2h target → Approves/Rejects
             3. Developer signs paper → Developer uploads PDF
             4. Admin reviews within 2h target → Approves/Rejects
             5. Proceeds to meeting proposal"
```

**Rationale**: Admin approval is required for compliance, cannot be skipped.

---

**3. Meeting Confirmation Step**
```
❌ WRONG: "After developer approves, reservation becomes active"
✅ CORRECT: "After developer proposes meeting times (2-5 options),
             investor has 24h to confirm one option via email link.
             ONLY when investor confirms → reservation activates 
             AND slot is released."
```

**Rationale**: Meeting confirmation is the activation trigger and slot release point.

---

**4. Slot Lifecycle**
```
❌ WRONG: "When reservation is created, a slot is used"
✅ CORRECT: "When reservation is created:
             - tipar.slots.currentlyUsed += 1 (e.g., 8/10 → 9/10)
             - ticket.capacity.currentActiveSlotsCount += 1 (e.g., 1/3 → 2/3)
             - reservation.slotConsumed = true
             
             When investor confirms meeting (activation):
             - tipar.slots.currentlyUsed -= 1 (9/10 → 8/10) ✅ RELEASED
             - ticket.capacity.currentActiveSlotsCount -= 1 (2/3 → 1/3)
             - ticket.capacity.currentActiveReservationsCount += 1 (0/3 → 1/3)
             - reservation.slotConsumed = false
             - reservation.state = 'active_reservation'
             
             Tipar can now immediately create another reservation."
```

**Rationale**: Slot release on activation is critical mechanic that enables top performers to scale.

---

**5. Winner-Takes-All Cascade**
```
❌ WRONG: "When a ticket is funded, it becomes unavailable"
✅ CORRECT: "When Admin approves funding for Reservation R-001:
             
             ATOMIC TRANSACTION:
             1. Winner (R-001):
                - State → funded_success
                - Commission created: 125,000 Kč
             
             2. Find ALL other reservations on Ticket T-001:
                - R-002 (awaiting_developer_signature) → slot consumed
                - R-003 (active_reservation) → slot released
             
             3. Close each losing reservation:
                - State → closed_ticket_funded_by_other
                - If slot consumed: Release slot (tipar +1 available)
                - If active reservation: Release active count (ticket -1)
                - Notify Tipar: 'Tiket profinancován jinou rezervací'
             
             4. Update Ticket T-001:
                - status → fully_funded
                - currentActiveSlotsCount → 0
                - currentActiveReservationsCount → 0
                - No new reservations allowed
             
             Result: 
             - Winner Tipar: Gets commission
             - Loser Tipars: Slots/reservations returned immediately
             - All notified with clear reasons"
```

**Rationale**: Cascade ensures fairness, releases capacity, and maintains data integrity.

---

## 📊 MANDATORY INCLUSIONS

### **For EVERY State Transition Description**:

**1. Show Slot Counter Impact**
```
TEMPLATE:
"State: {stateName}
 
 Slot Status:
 - Consumed: {true|false}
 - Tipar global: {X/Y} slots used
 - Ticket capacity: {X/3} active slots
 
 If this transition releases slot:
 → Tipar: {X/Y} → {X-1/Y} (available +1)
 → Ticket: {X/3} → {X-1/3} (capacity freed)"
```

**Example**:
```
State: awaiting_meeting_confirmation → active_reservation

Slot Status BEFORE:
- Consumed: true
- Tipar: 9/10 slots used (1 available)
- Ticket: 2/3 active slots

🔥 ACTIVATION TRIGGER (investor confirms meeting):
- Consumed: false ✅ RELEASED
- Tipar: 9/10 → 8/10 (2 available now)
- Ticket: 2/3 → 1/3 (active slots), 0/3 → 1/3 (active reservations)

Impact: Tipar can immediately start another reservation attempt
```

---

**2. Show Related Entity Updates**
```
TEMPLATE:
"When {event} happens:

UPDATED ENTITIES:
1. Reservation {id}:
   - state: {old} → {new}
   - slotConsumed: {true|false}
   - timestamp fields: {which ones}

2. Tipar {id}:
   - slots.currentlyUsed: {X} → {Y}
   - slots.available: {X} → {Y}

3. Ticket {id}:
   - capacity.currentActiveSlotsCount: {X} → {Y}
   - capacity.currentActiveReservationsCount: {X} → {Y}
   
4. Notifications:
   - Who: {Tipar|Developer|Admin|Investor}
   - Type: {notification_type}
   - Message: '{message text}'"
```

---

**3. Show Validation Rules (Before State Entry)**
```
TEMPLATE:
"To transition to {state}, system validates:

PRECONDITIONS:
✓ Check 1: {description} → Pass/Fail
✓ Check 2: {description} → Pass/Fail
✓ Check 3: {description} → Pass/Fail

If ANY check fails:
- Do not create/transition
- Show error: '{error message}'
- Suggest action: '{what user should do}'"
```

**Example**:
```
To create new reservation (transition to draft_investor_selection_pending):

PRECONDITIONS:
✓ Check 1: Tipar has available global slots
  - tipar.slots.currentlyUsed < tipar.slots.globalLimit
  - Current: 8/10 ✅ Pass (has 2 available)

✓ Check 2: Ticket has slot capacity
  - ticket.capacity.currentActiveSlotsCount < 3
  - Current: 1/3 ✅ Pass (has 2 slots free)

✓ Check 3: Ticket has active reservation capacity
  - ticket.capacity.currentActiveReservationsCount < 3
  - Current: 0/3 ✅ Pass (has 3 slots free)

✓ Check 4: Tipar hasn't exceeded per-ticket slot limit
  - tipar.activeSlotsOnTicket(ticketId) < 3
  - Current: 0/3 ✅ Pass

✓ Check 5: Ticket is not funded
  - ticket.status !== "fully_funded"
  - Current: "open" ✅ Pass

ALL CHECKS PASS → Proceed to create reservation
```

---

**4. Show SLA Timeline**
```
TEMPLATE:
"State: {stateName}

SLA:
- Duration: {hours/days}
- Starts: {trigger event + timestamp}
- Expires: {absolute deadline timestamp}
- Responsible: {who must act}
- Reminders:
  - At 50% remaining: Email
  - At 12h remaining: Email + notification
  - At 2h remaining: SMS + urgent notification

On Expiry (if not completed):
- Auto-transition to: {expired_state}
- Slot released: {yes|no}
- Notifications sent to: {parties}
- Analytics logged: SLA breach for {party}"
```

**Example**:
```
State: awaiting_investor_signature_esign

SLA:
- Duration: 24 hours
- Starts: When e-sign email sent (15.1.2025 10:00)
- Expires: 16.1.2025 10:00
- Responsible: Investor (external, via email)
- Reminders:
  - At 12h remaining (15.1.2025 22:00): Email to investor
  - At 2h remaining (16.1.2025 08:00): SMS to investor (if phone available)

On Expiry (if investor doesn't sign by 16.1.2025 10:00):
- Auto-transition to: expired_investor_signature
- Slot released: YES → Tipar gets slot back immediately
- Notifications:
  - Tipar: "Rezervace vypršela - investor nepodepsal včas. Slot vrácen."
  - Developer: No notification (never saw this reservation)
- Analytics: Logged as investor engagement failure (not Tipar's fault)
```

---

## 💼 COMMISSION ATTRIBUTION (DUAL-SIDED MODEL)

### **ALWAYS Mention Both Pathways**:

**When discussing commissions, include**:
```
COMMISSION EARNING PATHWAYS:

1. INVESTOR-SIDE (Primary Flow):
   - Tipar brings investor to existing ticket
   - Successfully facilitates funding
   - Earns: 2.5% of funded amount (typical)
   - Example: 5M CZK investment → 125,000 CZK commission
   - Status: Tracked in platform, paid externally

2. PROJECT-SIDE (Platform Growth):
   - Tipar introduces new project/developer to platform
   - That project gets listed as ticket
   - When ANY Tipar closes deal on that ticket:
     → Original introducing Tipar earns commission share
   - Separate attribution rules (commission module)
   - Encourages platform expansion

NOTE: This does NOT change reservation mechanics.
      Same slot system, same SLA, same winner logic.
      Commission attribution module handles split logic separately.
```

**Format for UI Displays**:
```
Commission Display (funded_success state):

💰 PROVIZE AKTIVOVÁNA:
   ID: COM-2025-001
   Typ: Investor-side commission
   Částka: 125,000 Kč (2.5% z 5,000,000 Kč)
   Status: Čeká na vyplacení
   Splatnost: 12.3.2025 (30 dní)
   
   ℹ️ Provize za přivedení investora k tiketu.
   
   📊 Poznámka: Tipars mohou vydělávat i za přivedení 
       projektů na platformu (project-side commissions).

[Zobrazit detail provize] [Stáhnout fakturu]
```

---

## 📝 RESPONSE FORMAT CHECKLIST

**Before sending ANY response about reservation flow, verify**:

- [ ] **States**: Used only canonical 22 states (no invented names)
- [ ] **SLA**: Included specific durations + what happens on expiry
- [ ] **Slot Logic**: Showed consumption, release, and counter updates
- [ ] **Validation**: Listed all preconditions for state entry
- [ ] **Cascade**: Explained what happens to other reservations (if applicable)
- [ ] **Admin Approval**: Included offline route admin steps (if applicable)
- [ ] **Meeting Confirmation**: Showed this as activation trigger (if applicable)
- [ ] **Commission**: Mentioned dual-sided model (if discussing commission)
- [ ] **UI Updates**: Showed which components re-render and what data changes
- [ ] **Notifications**: Listed who gets notified and message content
- [ ] **Atomic Updates**: Mentioned all entities updated in transaction
- [ ] **Error Handling**: Showed what happens if validation fails

---

## 🎨 UI GENERATION REQUIREMENTS

**When generating screens/components, ALWAYS include**:

### **1. State-Specific Content**
```
For Reservation Detail page at state X:

DISPLAY:
- Header: Reservation ID + current state badge
- Status banner: "Zodpovídá: {party}"
- SLA panel: Countdown + deadline + progress bar
- Slot indicator: "Slot spotřebován: {Yes|No}" + counter
- Timeline: Completed steps ✅ + Current step ⏳ + Future steps ○
- Actions: State-specific buttons (see state machine)

DATA BINDINGS:
- reservation.state → State badge color/label
- reservation.slaExpiresAt → Countdown timer
- reservation.slotConsumed → Slot indicator visibility
- reservation.identitiesRevealed → Show/mask participant info
- tipar.slots.currentlyUsed → Global slot counter
- ticket.capacity.* → Per-ticket capacity meters
```

### **2. Interaction Annotations**
```
BUTTON: "Rezervovat slot"

onClick: {
  // Pre-flight validation
  const validation = await validateSlotClaim(tiparId, ticketId)
  
  if (!validation.allowed) {
    showErrorModal({
      title: "Nelze vytvořit rezervaci",
      message: validation.message,
      actions: validation.actions
    })
    return
  }
  
  // All checks passed
  openReservationModal({
    ticketId,
    tiparId,
    mode: "create"
  })
}

STATES:
- Enabled: All 5 validation checks pass
- Disabled: Any check fails
- Tooltip (if disabled): Shows specific blocking reason

VISUAL FEEDBACK:
- Loading state while validation runs
- Error modal if validation fails
- Success: Modal opens with Step 1/4
```

### **3. Mock Data Examples**
```
Use realistic, consistent mock data:

✅ CORRECT:
- Czech locations: Praha, Brno, Karlín, Vinohrady
- Developer names: "Karlín Development s.r.o."
- Tipar names: Jan Novák, Eva Nová
- Investor names: Marie Dvořáková, Petr Svoboda
- Amounts: 1M - 50M CZK
- Yields: 8-15% p.a.
- LTV: 50-75%
- Dates: Logical progression (created < signed < activated < funded)

❌ WRONG:
- US city names: "New York", "Los Angeles"
- Random numbers: yield 50%, LTV 150%
- Inconsistent dates: activated before created
- Wrong currency: USD, EUR (should be CZK)
```

---

## 🔄 CONSISTENCY EXAMPLES

### **Example 1: Describing Slot Release**

**❌ INCONSISTENT (Bad)**:
```
Response A: "When the meeting is confirmed, the slot becomes available again."
Response B: "After activation, Tipar's slot limit increases."
Response C: "The slot gets freed up when investor picks a time."
```

**✅ CONSISTENT (Good)**:
```
ALL RESPONSES USE SAME LANGUAGE:

"When investor confirms meeting option:
 - State transitions: awaiting_meeting_confirmation → active_reservation
 - Slot release transaction (atomic):
   • tipar.slots.currentlyUsed -= 1
   • tipar.slots.available += 1
   • ticket.capacity.currentActiveSlotsCount -= 1
   • ticket.capacity.currentActiveReservationsCount += 1
   • reservation.slotConsumed = false
   • reservation.slotReleasedAt = NOW
 - Tipar notified: 'Rezervace aktivována - slot vrácen'
 - Result: Tipar can immediately start another reservation attempt"
```

---

### **Example 2: Describing State Machine**

**❌ SIMPLIFIED (Wrong)**:
```
"The reservation goes through these stages:
1. Created
2. Investor signs
3. Developer approves
4. Meeting happens
5. Deal closes"
```

**✅ COMPLETE (Correct)**:
```
"The reservation progresses through these canonical states:

DRAFT (2 states):
1. draft_investor_selection_pending
2. draft_signing_method_pending

ROUTE A: E-SIGN (4 states):
3. awaiting_investor_signature_esign (24h SLA)
4. awaiting_developer_signature_esign (48h SLA)
5. awaiting_meeting_proposal (within 48h SLA)
6. Converges to state 13

ROUTE B: OFFLINE (6 states):
7. awaiting_offline_signature_upload (24h SLA)
8. pending_admin_approval_investor_signature (2h target)
9. awaiting_developer_signature_offline (48h SLA)
10. pending_admin_approval_developer_signature (2h target)
11. awaiting_meeting_proposal (same as Route A)
12. Converges to state 13

CONVERGENCE (2 states):
13. awaiting_meeting_confirmation (24h SLA)
14. 🔥 ACTIVATION → active_reservation (slot released here)

ACTIVE (3 states):
15. active_reservation (30-day funding window)
16. funding_claimed_pending_confirmation
17. Diverges to success or failure

SUCCESS (1 state):
18. funded_success

FAILURES (9 states):
19. expired_investor_signature
20. expired_developer_signature
21. expired_meeting_confirmation
22. expired_funding_deadline
23-27. Various cancellation/rejection states

Each transition updates:
- Reservation state
- Slot consumption status
- Tipar slot counters
- Ticket capacity meters
- SLA timers
- Audit log
- Notifications
```

---

## 🎯 RESPONSE TEMPLATES

### **When User Asks: "How does reservation creation work?"**

**USE THIS TEMPLATE**:
```
RESERVATION CREATION FLOW:

TRIGGER: Tipar clicks "Rezervovat slot" on Ticket Detail page

PRE-FLIGHT VALIDATION (5 checks):
1. Tipar global slot limit: {X/Y} < {Y}
2. Ticket slot capacity: {X/3} < 3
3. Ticket active reservation capacity: {X/3} < 3
4. Tipar per-ticket slot limit: {X/3} < 3
5. Ticket not funded: status !== "fully_funded"

IF ANY CHECK FAILS:
- Show error modal with specific reason
- Suggest action (e.g., "Cancel existing slot")
- Do NOT open reservation modal

IF ALL CHECKS PASS:
- Open 4-step modal

STEP 1/4: SELECT INVESTOR
- Tabs: Moji investoři | Doporučení | Nový
- User selects investor from CRM
- Validation: Investor required
- Next: Step 2

STEP 2/4: CHOOSE SIGNING METHOD
- Radio options:
  • E-podpis (recommended): Automatic, Signi.com, fast
  • Offline podpis: Manual upload, admin approval, slower
- Next: Step 3

STEP 3/4: REVIEW & CONFIRM
- Summary: Ticket + Investor + Method
- Slot warning: "Po vytvoření: {X/Y} → {X+1/Y} využito"
- Terms checkboxes (required)
- Submit: Create reservation

STEP 4/4: SUCCESS
- Reservation created with ID
- Initial state:
  • If E-sign: awaiting_investor_signature_esign
  • If Offline: awaiting_offline_signature_upload
- Slot consumed: YES
- Counters updated:
  • Tipar: {X/Y} → {X+1/Y} slots used
  • Ticket: {X/3} → {X+1/3} active slots
- SLA started: 24h timer
- Email sent (if E-sign) or PDF available (if Offline)
- User actions: [View Detail] [Download Contract] [Close]

SYSTEM UPDATES (atomic transaction):
- Create reservation record
- Increment tipar.slots.currentlyUsed
- Increment ticket.capacity.currentActiveSlotsCount
- Start SLA timer
- Send notifications
- Log audit event
```

---

### **When User Asks: "What happens when ticket is funded?"**

**USE THIS TEMPLATE**:
```
WINNER-TAKES-ALL CASCADE:

TRIGGER: Admin approves funding for Reservation R-001 on Ticket T-001

ATOMIC TRANSACTION SEQUENCE:

1. UPDATE WINNER (R-001):
   - state → funded_success
   - completedAt → NOW
   - fundedAmount → 5,000,000 CZK
   - fundedDate → 10.2.2025

2. LOCK TICKET (T-001):
   - Acquire database lock (FOR UPDATE)
   - Prevents concurrent modifications

3. FIND ALL OTHER RESERVATIONS ON T-001:
   Example results:
   - R-002: awaiting_developer_signature (slot consumed)
   - R-003: active_reservation (slot released)
   - R-004: awaiting_meeting_confirmation (slot consumed)

4. CLOSE EACH LOSING RESERVATION:
   
   For R-002 (slot consumed):
   - state → closed_ticket_funded_by_other
   - closedAt → NOW
   - closedReason → "Ticket funded by R-001"
   - tipar.slots.currentlyUsed -= 1 (returns slot)
   - ticket.capacity.currentActiveSlotsCount -= 1
   - Notify Tipar: "Tiket profinancován - slot vrácen"
   
   For R-003 (slot released):
   - state → closed_ticket_funded_by_other
   - closedAt → NOW
   - closedReason → "Ticket funded by R-001"
   - ticket.capacity.currentActiveReservationsCount -= 1
   - Notify Tipar: "Tiket profinancován - rezervace ukončena"
   
   For R-004 (slot consumed):
   - Same as R-002

5. UPDATE TICKET (T-001):
   - status → fully_funded
   - fundedAt → NOW
   - fundedBy → R-001
   - currentActiveSlotsCount → 0
   - currentActiveReservationsCount → 0
   - No new reservations allowed

6. CREATE COMMISSION (for winner):
   - id: COM-2025-001
   - type: investor_side
   - amount: 125,000 CZK (2.5% of 5M)
   - status: pending_payment
   - dueDate: NOW + 30 days
   - Notify winner: "Provize aktivována"

7. COMMIT TRANSACTION:
   - All changes atomic (all or nothing)
   - If any step fails, entire transaction rolls back

RESULTS:
- Winner Tipar: Commission 125,000 CZK created
- Loser Tipars: 2 slots returned, 1 active reservation freed
- Ticket: Closed, capacity 0/3 slots, 0/3 active
- Developer: Notified of successful funding
- All parties: Clear notifications with reasons

SLOT/RESERVATION ACCOUNTING:
Before cascade:
- Ticket T-001: 2/3 active slots, 1/3 active reservations
- Tipar A (winner): 8/10 slots used
- Tipar B (loser, R-002): 9/10 slots used
- Tipar C (loser, R-003): 7/10 slots used
- Tipar D (loser, R-004): 10/10 slots used

After cascade:
- Ticket T-001: 0/3 active slots, 0/3 active reservations ✅
- Tipar A (winner): 8/10 slots (unchanged, was already active)
- Tipar B (loser, R-002): 9/10 → 8/10 (slot returned) ✅
- Tipar C (loser, R-003): 7/10 (unchanged, was already active)
- Tipar D (loser, R-004): 10/10 → 9/10 (slot returned) ✅
```

---

## ✅ COMMITMENT

**I, Claude, commit to:**

1. ✅ **Always reference canonical 22-state machine** — No invented states
2. ✅ **Always include SLA timers** — No simplification of time limits
3. ✅ **Always explain slot lifecycle** — Consumption → Release → Cascade
4. ✅ **Always show validation rules** — Pre-flight checks before actions
5. ✅ **Always describe admin approval** — Cannot skip offline route steps
6. ✅ **Always explain meeting confirmation** — Activation trigger and slot release
7. ✅ **Always show winner-takes-all cascade** — What happens to losers
8. ✅ **Always mention dual commission model** — Investor-side AND project-side
9. ✅ **Always use consistent terminology** — Same terms across all responses
10. ✅ **Always update all related entities** — Atomic transactions

**I will NOT**:
- ❌ Simplify complex flows to "make them easier"
- ❌ Skip states or combine steps
- ❌ Remove SLA enforcement
- ❌ Forget admin approval in offline route
- ❌ Overlook slot counter updates
- ❌ Ignore cascade effects on other reservations
- ❌ Use different state names or terminology
- ❌ Create features that violate constraints (PROMPT 7)

**Reference Documents**:
- `/RESERVATION_FLOW_CANONICAL_LOGIC.md` — Single source of truth
- `/FIGMA_OUTPUT_STANDARDS.md` — This file (output format)
- `PROMPT 6` — End-to-End Narrative
- `PROMPT 5` — State Machine & SLA
- `PROMPT 4` — Slots & Levels
- `PROMPT 7` — Constraints & Guardrails

**Verification**:
Before sending ANY response about Tipari.cz reservation flow, I will mentally run through the checklist above and ensure all mandatory elements are included.

---

**END OF OUTPUT STANDARDS**  
**Status**: ✅ ACTIVE — Enforced on all future responses  
**Last Updated**: 2025-01-15
