# RESERVATION FLOW — CANONICAL LOGIC DOCUMENTATION
## Tipari.cz B2B Investment Referral Platform

**Purpose**: Internal documentation embedding the complete reservation flow logic as specified in PROMPTs 4-8. This file serves as the single source of truth for all reservation mechanics, state transitions, SLA timers, slot lifecycle, and UI consequences.

**Status**: ✅ CANONICAL — Do not modify without explicit user instruction  
**Last Updated**: 2025-01-15  
**References**: PROMPT 6 (End-to-End Narrative), PROMPT 5 (State Machine), PROMPT 4 (Slots & Levels)

---

## ⚠️ CRITICAL CONSTRAINTS (PROMPT 7)

### **DO NOT CHANGE EXISTING UI**
This file contains logic documentation ONLY. When implementing screens:
- ✅ Use existing components from `/src/app/components/`
- ✅ Follow existing design system (`/src/styles/theme.css`)
- ✅ Preserve current color palette (#215EF8, #14AE6B, #040F2A)
- ❌ Do NOT create new components if existing ones can be extended
- ❌ Do NOT modify typography, spacing, or layout patterns
- ❌ Do NOT add features not explicitly requested

### **PROHIBITED PATTERNS**
- ❌ Retail UI: "Buy Now", shopping cart, star ratings, trending badges
- ❌ FOMO marketing: "Only 1 left!", "Hurry!", countdown for sales
- ❌ Hype language: "Amazing opportunity!", "Guaranteed returns!", 🚀💰
- ❌ Payment processing: Platform does NOT handle money transfers
- ❌ Investor dashboards: Investors do NOT have accounts/login
- ❌ Skipping states: All state transitions must follow canonical sequence

### **SLA TIMERS ARE COMPLIANCE TOOLS, NOT MARKETING**
- ✅ Display: "Zbývá: 22h 35m | Vyprší: 17.1.2025 10:00"
- ✅ Purpose: Help users meet contractual obligations
- ✅ Tone: Neutral, informational, professional
- ❌ NOT for creating urgency to "sell" tickets

---

## 🎯 SYSTEM OVERVIEW

**Tipari.cz** is a **private B2B investment catalog** connecting real estate developers with qualified investors through licensed intermediaries called **Tipars** (introducers).

**Three User Roles ONLY**:
1. **Tipar** (licensed intermediary): Creates reservations, matches investors to projects, earns commission
2. **Developer**: Lists investment tickets, signs contracts, negotiates with investors
3. **Admin**: Approves signatures (offline route), confirms funding, manages platform

**Core Philosophy**:
- **Reservation ≠ Investment**: Reservation is a temporary, exclusive right to facilitate negotiations
- **Slot System**: Prevents spam, enforces quality, enables top performers to scale
- **SLA Accountability**: Every stage has time limits to ensure momentum
- **Winner-Takes-All**: First reservation to complete funding wins; all others auto-close
- **Exclusivity**: Max 3 parallel attempts per ticket, max 3 active negotiations per ticket

---

## 🎖️ TIPAR LEVELS & GLOBAL SLOT LIMITS (PROMPT 4)

### **Level Structure**

| Level ID | Display Name | Czech Name | Global Slots | Progression Criteria |
|----------|--------------|------------|--------------|----------------------|
| **L1** | Associate | Člen | **3** | Entry level |
| **L2** | Professional | Profesionál | **6** | 3 fundings + 6mo tenure |
| **L3** | Elite | Elite | **10** | 10 fundings + €5M volume + 12mo as L2 |
| **L4** | Partner | Partner | **15** | Invitation only, 25+ fundings, €15M+ volume |

**Global Slot Limit** = Maximum number of parallel reservation attempts (pre-activation) a Tipar can have across ALL tickets.

### **Key Principle**
- ✅ Tipar can have **UNLIMITED active reservations** (post-meeting confirmation)
- ❌ Tipar has **FINITE slots** for starting new attempts
- 🎯 Prevents demotivation: "I closed 5 deals but can't start new ones"

---

## 🎫 PER-TICKET LIMITS (EXCLUSIVITY ENFORCEMENT)

### **Capacity Rules**

**Per Ticket (Global)**:
- Max 3 active slots (reservation setup phase)
- Max 3 active reservations (negotiation phase)

**Per Tipar Per Ticket**:
- Max 3 active slots on one ticket (prevents monopolization)
- Max 3 active reservations on one ticket

**Result**: Developer negotiates with max 3 investors at any time per ticket.

---

## 🔄 SLOT LIFECYCLE — THE CRITICAL MECHANIC

### **Slot Consumption States**
Slot IS consumed during these states:
- `draft_investor_selection_pending`
- `draft_signing_method_pending`
- `awaiting_investor_signature_esign`
- `awaiting_offline_signature_upload`
- `pending_admin_approval_investor_signature`
- `awaiting_developer_signature_esign`
- `awaiting_developer_signature_offline`
- `pending_admin_approval_developer_signature`
- `awaiting_meeting_proposal`
- `awaiting_meeting_confirmation`

**During these states**:
```javascript
// Slot counts against ALL three limits:
tipar.slots.currentlyUsed += 1
ticket.capacity.currentActiveSlotsCount += 1
tipar.perTicketSlots[ticketId] += 1
```

### **🔥 SLOT RELEASE TRIGGER (CRITICAL MOMENT)**

**When**: Investor confirms meeting option  
**State Transition**: `awaiting_meeting_confirmation` → `active_reservation`

**Atomic System Actions**:
```javascript
// SLOT RELEASE TRANSACTION
BEGIN ATOMIC {
  // 1. Release Tipar global slot
  tipar.slots.currentlyUsed -= 1
  tipar.slots.available += 1
  
  // 2. Decrement ticket slot count
  ticket.capacity.currentActiveSlotsCount -= 1
  
  // 3. Increment ticket active reservation count
  ticket.capacity.currentActiveReservationsCount += 1
  
  // 4. Update reservation metadata
  reservation.slotConsumed = false
  reservation.slotReleasedAt = NOW
  reservation.state = "active_reservation"
  reservation.activatedAt = NOW
  
  // 5. Start 30-day funding SLA
  reservation.fundingSLA.startedAt = NOW
  reservation.fundingSLA.expiresAt = NOW + 30 days
  
  // 6. Reveal identities
  reservation.identitiesRevealed = true
  
  // 7. Notify all parties
  NOTIFY(tipar, "Rezervace aktivována - slot vrácen")
  NOTIFY(developer, "Schůzka potvrzena - zahájení jednání")
  NOTIFY(investor, "Termín potvrzen")
  
  COMMIT
}
```

**Why This Matters**:
- Tipar can immediately start another reservation (slot freed)
- Top Tipars can have 50+ active reservations but only 10 parallel setup attempts
- Prevents bottleneck: Hard work is GETTING to activation; once there, pursue other deals

### **Slot Release on Failure (Before Activation)**
If reservation expires/cancels BEFORE `active_reservation`:
```javascript
// Same release logic
tipar.slots.currentlyUsed -= 1
ticket.capacity.currentActiveSlotsCount -= 1
reservation.closedAt = NOW
reservation.closedReason = "expired_investor_signature" // or other reason
```

### **Active Reservation Closure (After Activation)**
When active reservation completes:
```javascript
// NO slot release (already released at activation!)
// Only decrement active reservation count
ticket.capacity.currentActiveReservationsCount -= 1

IF funded_success {
  // Trigger winner-takes-all cascade (see below)
}
```

---

## 📋 STATE MACHINE — 22 STATES (PROMPT 5)

### **State Categories**

**Draft States (2)**:
1. `draft_investor_selection_pending` — Tipar selects investor
2. `draft_signing_method_pending` — Tipar chooses E-sign vs Offline

**Route A: E-sign (4)**:
3. `awaiting_investor_signature_esign` — Investor signs via Signi.com (24h SLA)
4. `awaiting_developer_signature_esign` — Developer signs via Signi.com (48h SLA)
5. `awaiting_meeting_proposal` — Developer proposes meeting times (within 48h SLA)
6. (converges to state 13)

**Route B: Offline (6)**:
7. `awaiting_offline_signature_upload` — Tipar uploads signed PDF (24h SLA)
8. `pending_admin_approval_investor_signature` — Admin reviews (2h target)
9. `awaiting_developer_signature_offline` — Developer uploads signed PDF (48h SLA)
10. `pending_admin_approval_developer_signature` — Admin reviews (2h target)
11. `awaiting_meeting_proposal` — Same as Route A
12. (converges to state 13)

**Convergence (2)**:
13. `awaiting_meeting_confirmation` — Investor picks meeting time (24h SLA)
14. **🔥 Activation point** → Next state is `active_reservation`

**Active States (3)**:
15. `active_reservation` — 30-day funding window, slot RELEASED
16. `funding_claimed_pending_confirmation` — Both parties confirm, admin reviews
17. (success or failure divergence)

**Success (1)**:
18. `funded_success` — Winner! Commission created, ticket closed

**Failures (9)**:
19. `expired_investor_signature` — Investor didn't sign in 24h
20. `expired_developer_signature` — Developer didn't sign in 48h
21. `expired_meeting_confirmation` — Investor didn't confirm meeting in 24h
22. `expired_funding_deadline` — 30 days passed without funding
23. `cancelled_by_tipar` — Manual cancellation
24. `cancelled_by_developer` — Developer declined
25. `cancelled_by_admin` — Admin override
26. `rejected_by_developer` — Explicit rejection with reason
27. `closed_ticket_funded_by_other` — Another Tipar won (cascade result)

### **State Transition Rules (NON-NEGOTIABLE)**

```javascript
// NEVER skip states
draft → signature_collection → meeting_proposal 
     → meeting_confirmation → active_reservation → funding → success/failure

// NEVER go backward
active_reservation → awaiting_investor_signature ❌ FORBIDDEN

// NEVER create hybrid states
"partially_signed" ❌ NOT IN 22-STATE LIST

// ALWAYS update ALL related entities atomically
ON STATE_CHANGE {
  UPDATE reservation.state
  UPDATE tipar.slots (if slot state changes)
  UPDATE ticket.capacity (if slot/reservation state changes)
  LOG audit_event
  NOTIFY affected_parties
}
```

---

## ⏱️ SLA TIMERS (COMPLIANCE TOOLS)

### **SLA Durations (FIXED)**

| Stage | Duration | Starts When | Responsible | On Expiry State |
|-------|----------|-------------|-------------|-----------------|
| Investor signature (e-sign) | **24h** | Email sent | Investor | `expired_investor_signature` |
| Investor upload (offline) | **24h** | Method chosen | Tipar | `expired_investor_signature` |
| Admin approval (investor) | **2h target** | PDF uploaded | Admin | Escalation (not hard fail) |
| Developer signature (e-sign) | **48h** | Investor signed | Developer | `expired_developer_signature` |
| Developer upload (offline) | **48h** | Admin approved | Developer | `expired_developer_signature` |
| Admin approval (developer) | **2h target** | PDF uploaded | Admin | Escalation |
| Meeting proposal | **Within 48h** | Developer signs | Developer | `expired_developer_signature` |
| Meeting confirmation | **24h** | Proposals sent | Investor | `expired_meeting_confirmation` |
| Funding window | **30 days** | Meeting confirmed | All parties | `expired_funding_deadline` |

### **SLA Auto-Expiry Logic**

```javascript
// Cron job runs every 5 minutes
CRON_EVERY_5_MIN {
  FOR EACH reservation WHERE state IN [SLA_monitored_states] {
    IF NOW > reservation.slaExpiresAt {
      // Determine expiry state based on current state
      expiredState = getExpiryState(reservation.state)
      
      // Execute expiry transition
      BEGIN ATOMIC {
        reservation.state = expiredState
        reservation.closedAt = NOW
        reservation.closedReason = "SLA expired"
        reservation.slaViolation = true
        
        // Release slot if consumed
        IF reservation.slotConsumed {
          tipar.slots.currentlyUsed -= 1
          ticket.capacity.currentActiveSlotsCount -= 1
        } ELSE {
          ticket.capacity.currentActiveReservationsCount -= 1
        }
        
        // Notify parties
        NOTIFY(tipar, "Rezervace vypršela - slot vrácen")
        IF developer_was_involved {
          NOTIFY(developer, "Rezervace vypršela")
        }
        
        // Log analytics
        LOG_SLA_BREACH(reservation, responsible_party)
        
        COMMIT
      }
    }
  }
}
```

### **SLA Visual Indicators (UI)**

```javascript
// Color coding by time remaining
function getSLAColorCode(remainingMs, totalMs) {
  const percentRemaining = (remainingMs / totalMs) * 100
  
  if (percentRemaining >= 70) return 'green'   // Healthy
  if (percentRemaining >= 40) return 'yellow'  // Caution
  if (percentRemaining >= 15) return 'orange'  // Urgent
  return 'red'                                  // Critical
}

// Auto-reminders
SLA_REMINDERS {
  At 50% remaining: Email to responsible party
  At 12h remaining: Email + In-app notification
  At 2h remaining: SMS (if available) + Urgent notification
}
```

---

## 🏆 WINNER-TAKES-ALL CASCADE (CRITICAL BUSINESS LOGIC)

### **Trigger**: Admin approves funding for Reservation R-001 on Ticket T-001

### **Atomic Cascade Transaction**

```javascript
async function processFundingSuccess(winnerReservationId) {
  return DB.transaction(async (tx) => {
    // 1. Get winning reservation
    const winner = await tx.reservations
      .where({ id: winnerReservationId })
      .forUpdate()
      .first()
    
    // 2. Update winner state
    winner.state = "funded_success"
    winner.completedAt = NOW
    await tx.reservations.update(winner)
    
    // 3. Lock ticket (FOR UPDATE)
    const ticket = await tx.tickets
      .where({ id: winner.ticketId })
      .forUpdate()
      .first()
    
    // 4. Find ALL other reservations on this ticket (any state)
    const otherReservations = await tx.reservations
      .where({ ticketId: ticket.id })
      .whereNot({ id: winnerReservationId })
      .whereIn('state', [
        // Slot-consuming states
        ...SLOT_CONSUMING_STATES,
        // Active reservation states
        'active_reservation',
        'funding_claimed_pending_confirmation'
      ])
    
    // 5. Close each losing reservation
    for (const loser of otherReservations) {
      loser.state = "closed_ticket_funded_by_other"
      loser.closedAt = NOW
      loser.closedReason = `Ticket funded by ${winnerReservationId}`
      
      await tx.reservations.update(loser)
      
      // 6. Release resources
      const loserTipar = await tx.tipars.where({ id: loser.tiparId }).first()
      
      if (loser.slotConsumed) {
        // Was still in slot phase
        loserTipar.slots.currentlyUsed -= 1
        loserTipar.slots.available += 1
        ticket.capacity.currentActiveSlotsCount -= 1
      } else {
        // Was already active reservation
        ticket.capacity.currentActiveReservationsCount -= 1
      }
      
      await tx.tipars.update(loserTipar)
      
      // 7. Notify losing Tipar
      await NOTIFY(loser.tiparId, {
        type: "reservation_closed_ticket_funded",
        title: "❌ Tiket byl profinancován",
        message: `${ticket.name} byl profinancován jinou rezervací. 
                  Vaše ${loser.slotConsumed ? 'slot' : 'rezervace'} byla ukončena.`,
        reservationId: loser.id
      })
    }
    
    // 8. Update ticket to fully funded
    ticket.status = "fully_funded"
    ticket.fundedAt = NOW
    ticket.fundedBy = winnerReservationId
    ticket.capacity.currentActiveSlotsCount = 0
    ticket.capacity.currentActiveReservationsCount = 0
    
    await tx.tickets.update(ticket)
    
    // 9. Create commission object
    const commission = await tx.commissions.insert({
      id: generateCommissionId(),
      reservationId: winner.id,
      tiparId: winner.tiparId,
      ticketId: ticket.id,
      amount: calculateCommission(ticket, winner), // e.g., 2.5% of amount
      commissionType: "investor_side", // vs "project_side"
      status: "pending_payment",
      createdAt: NOW,
      dueDate: NOW + 30_DAYS
    })
    
    // 10. Notify winner
    await NOTIFY(winner.tiparId, {
      type: "reservation_funded_success",
      title: "🎉 Rezervace úspěšně uzavřena!",
      message: `Gratulujeme! ${ticket.name} byl profinancován. 
                Provize ${commission.amount} Kč aktivována.`,
      commissionId: commission.id
    })
    
    // 11. Notify developer
    await NOTIFY(ticket.developerId, {
      type: "ticket_funded_success",
      title: "🎉 Tiket profinancován",
      message: `${ticket.name} úspěšně profinancován rezervací ${winner.id}`
    })
    
    // 12. Commit all changes atomically
    return {
      winner,
      ticket,
      commission,
      closedReservationsCount: otherReservations.length
    }
  })
}
```

**Consequences**:
- Winner gets commission object (tracked, paid externally)
- All losers: Slots/reservations returned immediately
- Ticket: Permanently closed, no new reservations allowed
- Platform capacity: Freed for other tickets

---

## 🚫 VALIDATION RULES (SLOT CLAIM PRE-FLIGHT)

### **When Tipar clicks "Rezervovat slot"**

```javascript
async function validateSlotClaim(tiparId, ticketId) {
  const tipar = await getTipar(tiparId)
  const ticket = await getTicket(ticketId)
  
  // CHECK 1: Tipar global slot limit
  if (tipar.slots.currentlyUsed >= tipar.slots.globalLimit) {
    return {
      allowed: false,
      reason: "GLOBAL_SLOT_LIMIT_REACHED",
      message: `Nemáte volné sloty (${tipar.slots.currentlyUsed}/${tipar.slots.globalLimit} využito).`,
      actions: [
        { label: "Zobrazit moje sloty", action: "navigate_to_slots" },
        { label: "Zrušit nepoužitý slot", action: "show_cancellable_slots" }
      ]
    }
  }
  
  // CHECK 2: Ticket global slot capacity
  const currentSlots = ticket.capacity.currentActiveSlotsCount
  if (currentSlots >= 3) {
    return {
      allowed: false,
      reason: "TICKET_SLOT_CAPACITY_FULL",
      message: `Kapacita slotů tiketu vyčerpána (${currentSlots}/3). 
                Jiní zprostředkovatelé již zahájili 3 rezervační pokusy.`
    }
  }
  
  // CHECK 3: Ticket active reservation capacity
  const currentActive = ticket.capacity.currentActiveReservationsCount
  if (currentActive >= 3) {
    return {
      allowed: false,
      reason: "TICKET_ACTIVE_RESERVATION_CAPACITY_FULL",
      message: `Tiket má již 3 aktivní rezervace (max kapacita). 
                Developer již jedná s 3 investory paralelně.`
    }
  }
  
  // CHECK 4: Tipar per-ticket slot limit
  const tiparSlotsOnTicket = await countActiveSlots(ticketId, tiparId)
  if (tiparSlotsOnTicket >= 3) {
    return {
      allowed: false,
      reason: "PER_TICKET_SLOT_LIMIT_REACHED",
      message: `Již máte 3 probíhající pokusy na tento tiket. 
                Nejprve dokončete nebo zrušte některý.`,
      currentAttempts: await getActiveSlots(ticketId, tiparId)
    }
  }
  
  // CHECK 5: Ticket is closed/funded
  if (ticket.status === "fully_funded") {
    return {
      allowed: false,
      reason: "TICKET_ALREADY_FUNDED",
      message: "Tento tiket byl již úspěšně profinancován."
    }
  }
  
  // ALL CHECKS PASSED
  return { allowed: true }
}
```

---

## 💰 COMMISSION MODEL (DUAL-SIDED)

### **Pathway 1: Investor-Side Commission** (PRIMARY FLOW)
```javascript
// Tipar brings investor to existing ticket
commission = {
  type: "investor_side",
  amount: ticket.amount * 0.025, // 2.5% typical
  triggeredBy: "reservation_funded",
  reservationId: "R-2025-001",
  tiparId: "tipar-jan-novak",
  ticketId: "T-001",
  status: "pending_payment",
  createdAt: NOW,
  dueDate: NOW + 30_DAYS
}
```

### **Pathway 2: Project-Side Commission** (PLATFORM GROWTH)
```javascript
// Tipar introduced project to platform
// When ANY Tipar closes deal on that ticket
commission = {
  type: "project_side",
  amount: ticket.amount * 0.01, // 1% example (separate rate)
  triggeredBy: "ticket_funded",
  reservationId: "R-2025-045", // Winner reservation (different Tipar)
  originalTiparId: "tipar-eva-nova", // Who introduced project
  ticketId: "T-001",
  status: "pending_payment",
  createdAt: NOW,
  dueDate: NOW + 30_DAYS,
  note: "Commission for introducing project to platform"
}
```

**Key Rule**: Commission is CALCULATED and TRACKED by platform, but PAID externally (invoicing/payroll).

---

## 📧 EMAIL & NOTIFICATION SYSTEM

### **Email Types (Automated)**

```javascript
// E1: Investor E-sign Request
EMAIL_TEMPLATE("investor_esign_request", {
  to: investor.email,
  subject: "Podpis rezervační smlouvy - {ticketName}",
  body: `
    Dobrý den, {investorName},
    
    Váš zprostředkovatel {tiparName} připravil rezervační smlouvu 
    k investičnímu projektu {ticketName}.
    
    Prosím podepište elektronicky do 24 hodin:
    [Podepsat smlouvu] → {esignLink}
    
    Projekt: {ticketName}
    Částka: {amount} Kč
    Výnos: {yield}% p.a.
    
    Lhůta: {slaDeadline}
  `,
  cta: { text: "Podepsat smlouvu", url: esignProviderUrl }
})

// E2: Investor Meeting Confirmation
EMAIL_TEMPLATE("investor_meeting_confirmation", {
  to: investor.email,
  subject: "Potvrzení termínu schůzky - {ticketName}",
  body: `
    Dobrý den, {investorName},
    
    Developer {developerName} navrhuje následující termíny schůzky.
    
    Prosím potvrďte termín do 24 hodin:
    [Potvrdit termín] → {confirmationLink}
    
    Navržené termíny:
    {meetingOptions}
    
    Lhůta: {slaDeadline}
  `,
  cta: { text: "Potvrdit termín", url: publicLandingPageUrl }
})

// E3: SLA Warning - 12h Remaining
EMAIL_TEMPLATE("sla_warning_12h", {
  to: responsibleParty.email,
  subject: "Připomínka: SLA vyprší za 12 hodin - {reservationId}",
  body: `
    Dobrý den, {recipientName},
    
    Rezervace {reservationId} vyžaduje Vaši akci.
    
    Aktuální stav: {currentState}
    Zbývá: 12 hodin
    Vyprší: {slaDeadline}
    
    Akce vyžadována: {requiredAction}
    
    [Zobrazit detail rezervace] → {reservationDetailUrl}
  `,
  priority: "high"
})

// E4: Reservation Activated
EMAIL_TEMPLATE("reservation_activated", {
  to: tipar.email,
  subject: "✅ Rezervace aktivována - 30denní lhůta zahájena",
  body: `
    Gratulujeme! Investor potvrdil schůzku.
    
    Rezervace {reservationId} je nyní aktivní.
    
    ✅ Slot vrácen: Máte nyní {availableSlots}/{totalSlots} volných slotů
    ⏰ Financování: 30 dní (do {fundingDeadline})
    
    Potvrzená schůzka:
    Datum: {meetingDate}
    Místo: {meetingLocation}
  `
})

// E5: Winner Notification
EMAIL_TEMPLATE("funding_success_winner", {
  to: winnerTipar.email,
  subject: "🎉 Rezervace úspěšně uzavřena!",
  body: `
    Gratulujeme! Vaše rezervace byla úspěšně profinancována.
    
    Rezervace: {reservationId}
    Tiket: {ticketName}
    Částka: {fundedAmount} Kč
    
    💰 PROVIZE AKTIVOVÁNA:
    ID: {commissionId}
    Částka: {commissionAmount} Kč
    Splatnost: {paymentDueDate}
    
    [Zobrazit detail provize] → {commissionDetailUrl}
  `
})

// E6: Loser Notification
EMAIL_TEMPLATE("funding_success_loser", {
  to: loserTipar.email,
  subject: "Tiket profinancován jinou rezervací",
  body: `
    Tiket {ticketName} byl úspěšně profinancován 
    prostřednictvím jiné rezervace.
    
    Vaše rezervace {reservationId} byla ukončena.
    
    ✅ {slotOrReservation} vrácena
    Aktuální stav slotů: {currentSlots}/{totalSlots}
    
    [Hledat podobné projekty] → {similarTicketsUrl}
  `
})
```

### **In-App Notifications**

```javascript
// Notification Bell Component
NOTIFICATION_TYPES = {
  "reservation_state_change": {
    icon: "🔔",
    color: "blue",
    priority: "normal"
  },
  "sla_warning": {
    icon: "⏰",
    color: "yellow",
    priority: "high"
  },
  "sla_critical": {
    icon: "🚨",
    color: "red",
    priority: "urgent"
  },
  "reservation_activated": {
    icon: "✅",
    color: "green",
    priority: "normal"
  },
  "funding_success": {
    icon: "🎉",
    color: "green",
    priority: "high"
  },
  "reservation_closed": {
    icon: "❌",
    color: "gray",
    priority: "normal"
  }
}

// Notification Display
function NotificationBell({ userId }) {
  const unreadCount = getUnreadNotifications(userId).length
  
  return (
    <button onClick={openNotificationPanel}>
      <Bell />
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </button>
  )
}
```

---

## 🎨 UI COMPONENTS MAPPING (EXISTING → CANONICAL LOGIC)

### **Component Annotations**

```typescript
// /src/app/components/SlotCounter.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * This component displays Tipar's global slot usage.
 * 
 * Data Source:
 * - tipar.slots.currentlyUsed (number of slot-consuming reservations)
 * - tipar.slots.globalLimit (based on tipar.level)
 * - tipar.slots.available (globalLimit - currentlyUsed)
 * 
 * Visual Rules:
 * - Green: 0-60% used (healthy)
 * - Yellow: 61-85% used (caution)
 * - Red: 86-100% used (critical)
 * 
 * Click Action:
 * - Navigate to /slots (Slot Management page)
 * - OR filter My Reservations to show only slot-consuming states
 * 
 * State Updates:
 * - Increment when reservation created (any draft/signature/meeting state)
 * - Decrement when reservation reaches active_reservation (slot released)
 * - Decrement when reservation expires/cancelled before activation
 * 
 * REFERENCES: PROMPT 4 (Slots & Levels), PROMPT 6 (Slot Lifecycle)
 */

// /src/app/components/TicketStatusIndicator.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * This component displays per-ticket capacity meters.
 * 
 * Data Source:
 * - ticket.capacity.currentActiveSlotsCount (0-3)
 * - ticket.capacity.currentActiveReservationsCount (0-3)
 * 
 * Visual Rules:
 * - Show two progress bars:
 *   1. "Probíhající pokusy: X/3" (slots)
 *   2. "Aktivní rezervace: X/3" (active reservations)
 * 
 * Status Messages:
 * - If slots 0/3 AND active 0/3: "✅ Plná kapacita dostupná"
 * - If slots 2/3: "⚠️ Omezená kapacita - 1 volný slot"
 * - If slots 3/3: "🔴 Sloty plné"
 * - If active 3/3: "🟡 Plně rezervováno"
 * 
 * State Updates:
 * - Slots increment: Reservation created
 * - Slots decrement: Reservation activated OR expired/cancelled
 * - Active increment: Reservation activated (meeting confirmed)
 * - Active decrement: Active reservation funded OR expired
 * 
 * REFERENCES: PROMPT 4 (Per-Ticket Limits), PROMPT 6 (Capacity Meters)
 */

// /src/app/components/SLACountdown.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * Reusable SLA countdown timer component.
 * 
 * Props:
 * - expiresAt: ISO timestamp
 * - totalDuration: milliseconds (for percentage calculation)
 * - variant: "large" | "compact" | "critical"
 * 
 * Display Rules:
 * - Large variant (detail page):
 *   "Zbývá: 22 hodin 35 minut"
 *   "Vyprší: 16.1.2025 10:00"
 *   Progress bar + percentage
 * 
 * - Compact variant (list item):
 *   "⏰ Vyprší za: 22h 35m"
 * 
 * Color Coding:
 * - Green: 70-100% time remaining
 * - Yellow: 40-69% remaining
 * - Orange: 15-39% remaining
 * - Red: 0-14% remaining
 * 
 * Updates:
 * - Re-render every 1 minute (or use WebSocket for real-time)
 * - When expires: Display "Vypršelo" + absolute timestamp
 * 
 * REFERENCES: PROMPT 5 (SLA Timers), PROMPT 7 (Timers are Compliance Tools)
 */

// /src/app/components/ReservationTimeline.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * Visual timeline showing reservation progress through states.
 * 
 * Data Source:
 * - reservation.state (current state)
 * - reservation.createdAt, investorSignedAt, developerApprovedAt, etc.
 * - SLA completion times (calculated from timestamps)
 * 
 * Visual Rules:
 * - ✅ Completed steps: Green checkmark + timestamp + duration
 * - ⏳ Current step: Blue dot + "in progress" + SLA countdown
 * - ○ Future steps: Grey outline
 * 
 * Timeline Sequence (depends on route):
 * Route A (E-sign):
 * 1. Rezervace vytvořena
 * 2. Investor podepsal (e-sign)
 * 3. Developer podepsal (e-sign)
 * 4. Schůzka navržena
 * 5. Schůzka potvrzena → ACTIVATION
 * 6. Aktivní rezervace
 * 7. Profinancováno / Vypršelo
 * 
 * Route B (Offline):
 * 1. Rezervace vytvořena
 * 2. Smlouva nahrána (investor)
 * 3. Schváleno adminem (investor)
 * 4. Smlouva nahrána (developer)
 * 5. Schváleno adminem (developer)
 * 6. Schůzka navržena
 * 7. Schůzka potvrzena → ACTIVATION
 * 8. Aktivní rezervace
 * 9. Profinancováno / Vypršelo
 * 
 * REFERENCES: PROMPT 5 (State Machine), PROMPT 8 (Timeline Component C5)
 */

// /src/app/components/ReservationModal.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * 4-step modal for creating new reservation.
 * 
 * Pre-Flight Validation (before opening modal):
 * - Check tipar.slots.currentlyUsed < globalLimit
 * - Check ticket.capacity.currentActiveSlotsCount < 3
 * - Check ticket.capacity.currentActiveReservationsCount < 3
 * - Check tipar active slots on this ticket < 3
 * - Check ticket.status !== "fully_funded"
 * 
 * If validation fails:
 * - Display error modal with specific reason
 * - Do NOT open reservation modal
 * 
 * Step 1/4: Investor Selection
 * - Tabs: "Moji investoři" | "Doporučení" | "Nový investor"
 * - Data: From Investor CRM (mockInvestors.ts)
 * - Action: Select investor → Next step
 * 
 * Step 2/4: Signing Method
 * - Radio options: "E-podpis" | "Offline podpis"
 * - E-sign: Recommended, automatic, Signi.com integration
 * - Offline: Manual upload, admin approval required
 * - Action: Select method → Next step
 * 
 * Step 3/4: Review & Confirmation
 * - Summary: Ticket, Investor, Signing method
 * - Slot warning: "Po vytvoření bude využit 1 slot"
 * - Display: "8/10 → 9/10" (visual change)
 * - Terms checkboxes (required)
 * - Action: Confirm → Create reservation
 * 
 * Step 4/4: Success
 * - Display reservation ID
 * - Next state message (depends on route):
 *   - E-sign: "E-mail odeslán investorovi"
 *   - Offline: "Stáhněte smlouvu k podpisu"
 * - SLA information: "24 hodin | Vyprší: {timestamp}"
 * - Actions: [Detail] [Stáhnout smlouvu] [Zavřít]
 * 
 * On Modal Close (after Step 4):
 * - Navigate to Reservation Detail page OR My Reservations
 * - Update SlotCounter component (trigger re-render)
 * - Update Ticket capacity meters
 * 
 * REFERENCES: PROMPT 6 (Reservation Creation), PROMPT 8 (T4 Component)
 */

// /src/app/components/ReservationDetail.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * Main reservation detail page with state-specific UI.
 * 
 * Header:
 * - Reservation ID + Ticket summary
 * - Large state badge (current state in Czech)
 * - Breadcrumb navigation
 * 
 * Status Banner:
 * - Current state label
 * - Responsible party: "Zodpovídá: {Investor|Developer|Admin}"
 * - Icon indicating who must act
 * 
 * SLA Panel (if SLA active):
 * - Large countdown timer (SLACountdown component)
 * - Absolute deadline
 * - Progress bar with color coding
 * 
 * Slot Indicator:
 * - If slotConsumed === true:
 *   "🎫 Slot spotřebován: Ano"
 *   "Zbývá X/Y volných slotů"
 * - If slotConsumed === false:
 *   "✅ Slot vrácen: Máte X/Y volných slotů"
 * 
 * Timeline:
 * - ReservationTimeline component
 * - Shows completed steps with timestamps
 * - Highlights current step with SLA
 * 
 * Participants Cards:
 * - Tipar (self), Investor, Developer
 * - Contact info (masked until identities revealed)
 * - identitiesRevealed === true ONLY when state >= active_reservation
 * 
 * Documents Section:
 * - Reservation contract PDF (if generated)
 * - Signature status: Investor (✅/○), Developer (✅/○)
 * - Meeting details (if confirmed)
 * - Interim docs (if active reservation): LOI, DD reports
 * - Upload area (if active)
 * 
 * Primary Actions (state-dependent):
 * - awaiting_investor_signature_esign:
 *   [Odeslat připomínku] [Zobrazit PDF] [Zrušit]
 * 
 * - awaiting_offline_signature_upload:
 *   [Stáhnout smlouvu] [Nahrát podepsanou smlouvu] [Zrušit]
 * 
 * - awaiting_developer_signature:
 *   "Čeká se na developera" (informational)
 *   [Zobrazit smlouvu] [Zrušit]
 * 
 * - awaiting_meeting_confirmation:
 *   [Odeslat připomínku] [Zobrazit termíny] [Zrušit]
 * 
 * - active_reservation:
 *   [🎯 Označit jako profinancováno] (primary green)
 *   [+ Nahrát dokument] [+ Poznámka]
 *   [❌ Zrušit] (warning)
 * 
 * - funding_claimed_pending_confirmation:
 *   "Čeká na potvrzení" + [Zobrazit důkazy]
 * 
 * - funded_success:
 *   [Hodnotit spolupráci] [Stáhnout zprávu] [Zobrazit provizi]
 * 
 * - expired/cancelled/closed:
 *   [Zkusit znovu] [Hledat podobné]
 *   Display closed reason
 * 
 * REFERENCES: PROMPT 8 (T5 Component), PROMPT 5 (State Machine UI)
 */

// /src/app/components/ProjectDetail.tsx
/**
 * CANONICAL LOGIC MAPPING:
 * 
 * Ticket detail page with reservation CTA.
 * 
 * Hero Section:
 * - Project image, name, developer
 * - Key metrics: Amount, Yield, Duration, LTV, Location
 * - Status badge: Open | Limited | Full | Funded
 * 
 * Capacity Meters (TicketStatusIndicator component):
 * - Active slots: X/3
 * - Active reservations: X/3
 * - Status message (dynamic)
 * 
 * Primary CTA Button:
 * - Label: "Rezervovat slot"
 * - Enabled/Disabled based on validation (see ReservationModal)
 * - Tooltip (if disabled): Shows blocking reason
 * - onClick: Validate → Open ReservationModal OR show error
 * 
 * CTA State Logic:
 * function getCTAButtonState(tipar, ticket) {
 *   // Run all 5 validation checks
 *   // Return { enabled, label, tooltip, onClick }
 * }
 * 
 * Developer Info:
 * - Company name, track record
 * - Contact: MASKED until reservation active
 *   - Before: "Email: k*****@example.cz"
 *   - After: "Email: kontakt@karlin-dev.cz"
 * 
 * Project Details Tabs:
 * - Tab 1: Přehled (description, timeline, collateral)
 * - Tab 2: Finanční parametry (yield, payment schedule)
 * - Tab 3: Právní dokumenty (prospectus, financials PDFs)
 * 
 * Similar Tickets Carousel (optional):
 * - 3-5 similar tickets by location/asset class
 * - Mini cards with CTA
 * 
 * REFERENCES: PROMPT 8 (T3 Component), PROMPT 6 (Ticket Detail)
 */
```

---

## 📊 DATA STRUCTURE MAPPING (EXISTING → CANONICAL)

### **Current Types → Canonical States Mapping**

```typescript
// /src/app/types/reservation.ts
/**
 * MIGRATION NOTES:
 * 
 * Current types are CLOSE to canonical logic but need alignment:
 * 
 * CURRENT PHASES (8):
 * - WAITING_INVESTOR_SIGNATURE
 * - WAITING_DEVELOPER_DECISION
 * - WAITING_MEETING_SELECTION
 * - MEETING_CONFIRMED (✅ This is "active_reservation")
 * - MEETING_COMPLETED
 * - SUCCESS
 * - NO_DEAL
 * - EXPIRED
 * 
 * CANONICAL STATES (22):
 * Need to expand to include:
 * - draft_investor_selection_pending
 * - draft_signing_method_pending
 * - E-sign route states (4)
 * - Offline route states (6)
 * - Funding states (3)
 * - Failure states (9 variants)
 * 
 * SLOT LOGIC:
 * Current: GlobalSlot has states FREE | LOCKED_WAITING | LOCKED_CONFIRMED
 * Canonical: Slot is consumed by reservation, not separate entity
 *            - slotConsumed boolean on reservation
 *            - Release happens at state transition (not slot state change)
 * 
 * NEXT STEPS FOR ALIGNMENT:
 * 1. Add new state enum with all 22 states
 * 2. Add slotConsumed: boolean to Reservation
 * 3. Add slotReleasedAt?: timestamp
 * 4. Add identitiesRevealed: boolean (true when state >= active_reservation)
 * 5. Add route discriminator: signingRoute: "esign" | "offline"
 * 6. Expand SLA fields per stage (investorSignatureSLA, developerSignatureSLA, etc.)
 * 7. Add funding claim fields (fundingClaimedBy, fundingClaimedAt, proofDocuments)
 */

// PROPOSED TYPE EXPANSION (for future implementation):
export type ReservationStateCanonical =
  // Draft
  | 'draft_investor_selection_pending'
  | 'draft_signing_method_pending'
  // Route A: E-sign
  | 'awaiting_investor_signature_esign'
  | 'awaiting_developer_signature_esign'
  | 'awaiting_meeting_proposal'
  // Route B: Offline
  | 'awaiting_offline_signature_upload'
  | 'pending_admin_approval_investor_signature'
  | 'awaiting_developer_signature_offline'
  | 'pending_admin_approval_developer_signature'
  // Convergence
  | 'awaiting_meeting_confirmation'
  // Active
  | 'active_reservation' // ✅ CRITICAL STATE - slot released here
  | 'funding_claimed_pending_confirmation'
  // Success
  | 'funded_success'
  // Failures
  | 'expired_investor_signature'
  | 'expired_developer_signature'
  | 'expired_meeting_confirmation'
  | 'expired_funding_deadline'
  | 'cancelled_by_tipar'
  | 'cancelled_by_developer'
  | 'cancelled_by_admin'
  | 'rejected_by_developer'
  | 'closed_ticket_funded_by_other';

export interface ReservationCanonical extends Reservation {
  // Slot lifecycle
  slotConsumed: boolean; // True if currently consuming a slot
  slotReleasedAt?: string; // ISO timestamp when slot released
  
  // Route tracking
  signingRoute: 'esign' | 'offline';
  
  // Identity reveal
  identitiesRevealed: boolean; // True when state >= active_reservation
  
  // SLA per stage
  sla: {
    investorSignature?: {
      startedAt: string;
      expiresAt: string;
      completedAt?: string;
      expired: boolean;
    };
    developerSignature?: {
      startedAt: string;
      expiresAt: string;
      completedAt?: string;
      expired: boolean;
    };
    meetingConfirmation?: {
      startedAt: string;
      expiresAt: string;
      completedAt?: string;
      expired: boolean;
    };
    fundingWindow?: {
      startedAt: string; // When meeting confirmed
      expiresAt: string; // 30 days later
      completedAt?: string;
      expired: boolean;
    };
  };
  
  // Funding claim tracking
  fundingClaim?: {
    claimedBy: 'tipar' | 'developer';
    claimedAt: string;
    claimedAmount: number;
    proofDocuments: string[]; // URLs
    counterpartyConfirmedAt?: string;
    adminApprovedAt?: string;
  };
  
  // Offline route specifics
  offlineDocuments?: {
    investorSignedPDF?: string; // URL
    investorApprovedAt?: string;
    investorApprovedBy?: string; // Admin ID
    developerSignedPDF?: string;
    developerApprovedAt?: string;
    developerApprovedBy?: string;
  };
}
```

---

## 🔍 IMPLEMENTATION CHECKLIST

### **Phase 1: Core State Machine** (Must-Have)
- [ ] Expand reservation state enum to 22 canonical states
- [ ] Add `slotConsumed` boolean tracking
- [ ] Implement slot release on activation transition
- [ ] Add SLA per-stage tracking objects
- [ ] Implement auto-expiry cron job
- [ ] Add validation rules (5 checks before slot claim)
- [ ] Implement winner-takes-all cascade transaction

### **Phase 2: UI Components** (Should-Have)
- [ ] Update SlotCounter with canonical logic
- [ ] Update TicketStatusIndicator with capacity meters
- [ ] Enhance SLACountdown with color coding
- [ ] Build ReservationTimeline with route awareness
- [ ] Update ReservationModal with 4-step flow
- [ ] Enhance ReservationDetail with state-specific actions
- [ ] Update ProjectDetail with CTA validation

### **Phase 3: Email & Notifications** (Should-Have)
- [ ] Implement email templates (E1-E6)
- [ ] Add SLA reminder scheduling
- [ ] Build in-app notification system
- [ ] Add notification preferences
- [ ] Integrate SMS for critical SLA (optional)

### **Phase 4: Admin Tools** (Nice-to-Have)
- [ ] Build offline signature approval queue
- [ ] Add funding confirmation workflow
- [ ] Create SLA monitoring dashboard
- [ ] Build audit log viewer
- [ ] Add manual override tools

### **Phase 5: Developer Dashboard** (Nice-to-Have)
- [ ] Incoming reservations queue
- [ ] Meeting proposal modal
- [ ] Funding confirmation flow
- [ ] Developer-specific reservation detail

---

## 📝 FUTURE SCREEN GENERATION GUIDELINES

When implementing new screens, **ALWAYS**:

1. **Check this file FIRST** for canonical logic
2. **Reference existing components** in `/src/app/components/`
3. **Follow existing design system** in `/src/styles/theme.css`
4. **Map state to UI** using state machine (22 states)
5. **Implement validation** before state transitions
6. **Update ALL related entities** atomically (reservation + tipar + ticket)
7. **Test slot lifecycle** (consume → release → cascade)
8. **Add audit logging** for all state changes
9. **Include SLA monitoring** where applicable
10. **Respect constraints** from PROMPT 7 (no retail patterns, no hype)

### **Example Implementation Flow**

```
User Request: "Create the Meeting Confirmation landing page"

Step 1: Read this file → Find "Meeting Confirmation" section
Step 2: Identify canonical logic:
  - State: awaiting_meeting_confirmation
  - SLA: 24 hours from proposals sent
  - Responsible: Investor (external, no login)
  - On confirmation: Transition to active_reservation + RELEASE SLOT
Step 3: Check PROMPT 8 → Find P1. Investor Meeting Confirmation spec
Step 4: Check existing components:
  - Use existing Button, Card, Radio components
  - Follow theme.css typography
Step 5: Implement:
  - Public landing page (token-based, no auth)
  - Display meeting options (from proposedMeetingDates)
  - Submit → Trigger state transition
  - Show success confirmation
Step 6: Test:
  - Valid token → Show options
  - Invalid token → Error message
  - Expired SLA → Error message
  - Confirm → Slot released, tipar notified
```

---

## ✅ COMPLIANCE CHECKLIST (EVERY FEATURE)

Before committing code, verify:

- [ ] **No retail patterns**: No "Buy Now", shopping cart, trending
- [ ] **No FOMO marketing**: Countdowns are SLA tools, not sales pressure
- [ ] **No hype language**: Factual, professional, compliance-safe
- [ ] **No payment processing**: Platform tracks, doesn't process money
- [ ] **No investor login**: Investors use email links only
- [ ] **No state skipping**: Follow 22-state sequence exactly
- [ ] **Slot logic correct**: Consume → Release on activation → Cascade on funding
- [ ] **SLA enforcement**: Auto-expiry, reminders, monitoring
- [ ] **Validation complete**: 5 checks before slot claim
- [ ] **Atomic transactions**: All related entities updated together
- [ ] **Audit logging**: Every state change logged
- [ ] **Color palette preserved**: #215EF8, #14AE6B, #040F2A
- [ ] **Typography unchanged**: Unless explicitly requested
- [ ] **Existing components reused**: No unnecessary new components

---

## 📚 REFERENCES

- **PROMPT 4**: Global Slots, Levels, Per-Ticket Limits
- **PROMPT 5**: SLA Timers, States, UI Consequences
- **PROMPT 6**: End-to-End Narrative (Source of Truth)
- **PROMPT 7**: Constraints & Guardrails
- **PROMPT 8**: Screen Checklist (Minimum Viable)

**Current Codebase**:
- `/src/app/types/reservation.ts` — Type definitions (needs expansion)
- `/src/app/data/mockReservations.ts` — Mock data (close to canonical)
- `/src/app/components/SlotCounter.tsx` — Global slots widget
- `/src/app/components/TicketStatusIndicator.tsx` — Per-ticket capacity
- `/src/app/components/SLACountdown.tsx` — SLA timer
- `/src/app/components/ReservationTimeline.tsx` — Progress visualization
- `/src/app/components/ReservationModal.tsx` — Reservation creation
- `/src/app/components/ReservationDetail.tsx` — Reservation detail page

---

## 🎯 FINAL TRUTH

**This document is the CANONICAL REFERENCE for all reservation flow logic.**

**Hierarchy of Truth**:
1. Explicit user instruction in current prompt (highest)
2. This file (`RESERVATION_FLOW_CANONICAL_LOGIC.md`)
3. PROMPT 6 (End-to-End Narrative)
4. Constraints (PROMPT 7)
5. Existing codebase (implemented reality)
6. General best practices (lowest)

**When conflict arises**: User instruction > This file > PROMPT 6 > Constraints > Code > Best practices

**All future work respects this hierarchy.**

---

**END OF CANONICAL LOGIC DOCUMENTATION**
**Last Updated**: 2025-01-15
**Status**: ✅ ACTIVE — Use as single source of truth for all reservation mechanics
