# FIGMA DOCUMENTATION — RESERVATION FLOW COMPLETE
## Tipari.cz B2B Referral & Orchestration Platform

**Purpose**: Complete reservation flow documentation for Figma design file  
**Type**: NEW documentation frames (do not modify existing UI)  
**Frame Naming**: "DOCS — Reservation Flow [Section]"  
**Format**: Neutral text-only blocks for designer/developer reference

**Status**: ✅ ACTIVE — Based on PROMPTs 1-8 context  
**Created**: 2025-01-15

---

## 📐 FIGMA FRAME STRUCTURE

Create these NEW frames in Figma:

```
📁 DOCS — Reservation Flow
  ├── 📄 Frame 1: Product Reality & Entity Model
  ├── 📄 Frame 2: Role Definitions
  ├── 📄 Frame 3: Complete Flow (13 Steps)
  ├── 📄 Frame 4: Investor Selection (Mandatory)
  ├── 📄 Frame 5: Signing Methods (E-sign vs Offline)
  ├── 📄 Frame 6: SLA Timer System
  ├── 📄 Frame 7: Global Slots & Tier Structure
  ├── 📄 Frame 8: Per-Ticket Limits
  ├── 📄 Frame 9: Win Condition & Cascade
  └── 📄 Frame 10: Commission Model (Dual-Sided)
```

---

## 📄 FRAME 1: PRODUCT REALITY & ENTITY MODEL

### **What Tipari.cz IS**
- B2B referral & orchestration system
- For professional introducers ("Tipař") and partners/developers
- Manages: information, tickets, slot reservations, contract workflows, SLA timers, meetings, commissions

### **What Tipari.cz IS NOT**
- ❌ Investment platform
- ❌ Money receiver/processor
- ❌ Contract signer (platform doesn't sign investment contracts)
- ❌ Public offering system

### **Entity Model**

**A) PROJECT**
- Container of investment opportunity
- Contains identity, documents, and **multiple tickets**
- Project itself is NOT "the investment"

**B) TICKET** (key unit)
- Specific investable slot definition
- Fixed amount, yield p.a., duration
- Security/collateral flag + details
- Commission rules (who earns and when)
- Capacity/availability logic
- **Investor invests into a specific ticket** (not "a project")
- Reservation competition is **per ticket**

**C) GLOBAL SLOT** (Tipař capacity unit)
- Capacity token allowing Tipař to start a reservation attempt
- Tipař has **global slot limit** based on tier level

**D) RESERVATION** (contract-driven workflow)
- Workflow case tied to: one ticket, one investor, one Tipař, one partner/developer
- Contains: SLA timers, statuses, documents, meeting scheduling, commission claim

---

## 📄 FRAME 2: ROLE DEFINITIONS

### **1) TIPAŘ** (Primary User — Full Platform Access)
**Actions**:
- Browses projects
- Opens project detail
- Compares tickets
- Clicks "Reserve slot" on selected ticket
- **Selects investor** (mandatory)
- Chooses signing method: E-sign OR Offline print
- Tracks SLA + statuses in dashboard
- Sees whether reservation becomes "Active"
- Later sees commission lifecycle and payout

**UI Access**: Full Tipař dashboard

---

### **2) INVESTOR** (External — NO Platform Login)
**Interactions**:
- Receives email link for e-sign OR attends offline signing
- Signs reservation agreement (via email link or physically)
- Later receives meeting options email
- Confirms one meeting time (via email link)
- Participates in negotiation and final contractual signing directly with developer **(outside platform UI)**

**UI Access**: Email links only (no platform account)

---

### **3) PARTNER/DEVELOPER** (Partner Dashboard Access)
**Actions**:
- Gets notified when investor has signed reservation agreement
- Must countersign reservation agreement
- Proposes meeting place/time options
- Sees which reservations become active in partner dashboard
- Later proceeds to final deal documentation and funding

**UI Access**: Partner dashboard (separate interface)

---

### **4) ADMIN** (Tipari Team — Administrative Access)
**Actions**:
- Approves/validates offline uploaded signed agreement (PDF)
- Can intervene if errors/conflicts
- Orchestrates platform integrity

**UI Access**: Admin panel

---

## 📄 FRAME 3: COMPLETE FLOW (13 STEPS)

### **STEP 0: Project Selection**
**Actor**: Tipař  
**Action**: Selects Project → Opens Project Detail page  
**UI**: Project catalog/list → Project detail view

---

### **STEP 1: Ticket Selection**
**Actor**: Tipař  
**Action**: Views available tickets, sees availability + capacity rules  
**UI**: Ticket comparison table/cards within project detail  
**Data Displayed**:
- Ticket amount, yield, duration
- Security/collateral details
- Capacity indicators: "2/3 active reservations"
- Commission structure

---

### **STEP 2: Reserve Slot (Initiation)**
**Actor**: Tipař  
**Action**: Clicks "Reserve slot" button on selected ticket  
**Validation**:
- Check global slot limit (Tipař has available slots)
- Check per-ticket limits (< 3 active slots by this Tipař on ticket)
- Check ticket capacity (< 3 total active slots on ticket)
**If Valid**: Opens reservation creation flow  
**If Invalid**: Show error modal with specific reason

---

### **STEP 3: Investor Selection (MANDATORY)**
**Actor**: Tipař  
**Action**: Must select one investor before proceeding  
**Options**:
1. **Select from CRM**: Existing investor records
2. **Create New Investor**: Minimal form (name, email, phone, preferences)
3. **Recommended Investors**: System-matched investors based on ticket criteria

**Cannot proceed without selection**

**UI**: 3-tab selector or modal with options  
**See**: Frame 4 for detailed investor selection logic

---

### **STEP 4: Signing Method Choice**
**Actor**: Tipař  
**Action**: Chooses how reservation agreement will be signed  
**Options**:
- **A) E-SIGN**: Automatic, email-based, fast (24h SLA starts)
- **B) OFFLINE**: Print → Sign physically → Upload PDF → Admin approval (24h SLA starts)

**See**: Frame 5 for detailed signing method flows

---

### **STEP 5: Investor Signature**
**Actor**: Investor (external)  
**Action**: Signs reservation agreement

**Route A (E-sign)**:
- Investor receives email with signing link
- Signs via e-sign provider
- SLA #1: 24 hours to sign

**Route B (Offline)**:
- Tipař prints PDF
- Investor signs physically
- Tipař uploads signed PDF
- Admin reviews/approves
- SLA #1: 24 hours for Tipař to upload

**Status Update**: When signed → Reservation status updates → Developer notified

---

### **STEP 6: Developer Countersign**
**Actor**: Developer (partner dashboard)  
**Action**: Developer receives notification → Must countersign  
**SLA #2**: 48 hours to countersign  
**UI**: Developer sees pending signature request in partner dashboard

---

### **STEP 7: Meeting Proposal**
**Actor**: Developer  
**Action**: After countersigning, developer proposes meeting options  
**Data Input**:
- Meeting place (physical location or online)
- Multiple time slots (2-5 options)
**Output**: Email sent to investor with meeting options

---

### **STEP 8: Meeting Confirmation → ACTIVATION**
**Actor**: Investor (external)  
**Action**: Investor receives email → Confirms one meeting option  
**SLA #3**: 24 hours to confirm  

**🔥 CRITICAL MOMENT: ACTIVATION**
When investor confirms:
- **Reservation becomes ACTIVE**
- **Global slot returns to Tipař immediately** (slot released)
- Negotiation SLA #4 starts (30 days)

**UI Updates**:
- Tipař dashboard: "Reservation Active" badge
- Global slot counter: Decrements (e.g., 7/10 → 6/10)
- Developer dashboard: "Meeting confirmed" status

---

### **STEP 9: Negotiation Phase**
**Actor**: Investor ↔ Developer (outside platform UI)  
**Duration**: Up to 30 days (SLA #4)  
**Activities**:
- Physical meetings
- Document exchange
- Terms negotiation
- Due diligence
**Platform Role**: Tracks status, shows countdown timer

---

### **STEP 10: Final Contractual Documentation**
**Actor**: Investor + Developer (external)  
**Action**: Sign final investment contract (outside platform)  
**Platform Role**: Tracks status update ("Contract signed")

---

### **STEP 11: Funding Occurs**
**Actor**: Investor (external)  
**Action**: Transfers funds to developer/project  
**Platform Role**: Developer or Tipař reports funding completion

**🏆 WIN CONDITION TRIGGERED**
- First reservation to reach "funded" wins
- Ticket becomes inactive
- All other competing reservations on this ticket are closed/ended
**See**: Frame 9 for cascade logic

---

### **STEP 12: Commission Claim**
**Actor**: Tipař  
**Action**: Commission lifecycle begins  
**Process**:
- Platform calculates commission (per agreed rules)
- Platform receives commission from developer/project
- Platform pays Tipař
**Commission Types**:
- Investor-sourced (Tipař brought investor)
- Project-sourced (Tipař brought project)
**See**: Frame 10 for dual commission model

---

### **STEP 13: Case Closed**
**Status**: Reservation marked as "Completed — Funded"  
**Ticket Status**: Inactive (no new reservations allowed)  
**Archive**: Case data retained for records/analytics

---

## 📄 FRAME 4: INVESTOR SELECTION (MANDATORY STEP)

### **Context**
- Occurs during "Reserve slot" flow (Step 3)
- **Cannot proceed** to signing method without selecting investor
- Investor tied to reservation case permanently

### **Option 1: Select from CRM**

**UI**: List/table of existing investors in Tipař's CRM

**Display Fields**:
- Investor name
- Email
- Phone
- Investment preferences (summary)
- Past investment history (count, total amount)
- Last activity date

**Action**: Click investor row → Selected → Proceed to Step 4

---

### **Option 2: Create New Investor**

**UI**: Inline form or modal

**Required Fields**:
- Full name (text input, required)
- Email (text input, required, validated)

**Optional Fields**:
- Phone (text input, formatted)
- Notes (textarea)
- Investment preferences:
  - Investment size range (slider: min-max)
  - Risk tolerance (dropdown: Conservative / Moderate / Aggressive)
  - Duration preference (dropdown: Short / Mid / Long term)
  - Secured-only preference (checkbox)
  - Geography preference (multi-select)
  - Asset type preference (checkboxes: Residential / Commercial / Mixed / Land)

**Action**: Submit → Investor created → Added to CRM → Selected for reservation → Proceed to Step 4

**Note**: Preferences used for future "Recommended investors" matching

---

### **Option 3: Recommended Investors**

**UI**: List of system-recommended investors with match score

**Matching Algorithm**: System compares investor preferences to ticket criteria

**Matching Signals**:
- Investment size range (investor capacity vs ticket amount)
- Risk tolerance (investor profile vs ticket risk level)
- Duration preference (investor timeline vs ticket duration)
- Secured-only preference (investor requirement vs ticket security)
- Geography (investor location interest vs project location)
- Asset type (investor asset class interest vs ticket asset class)

**Display**:
- Investor name
- Match score (e.g., "95% match")
- Why matched (e.g., "Size range fits, prefers secured, Prague interest")
- Investment history (count, amount)

**Action**: Click "Select" button → Investor selected → Proceed to Step 4

**Benefit**: 1-click selection for best-fit investors

---

### **Rules**
- ✅ Exactly ONE investor must be selected
- ❌ Cannot select multiple investors per reservation
- ✅ Investor visible in reservation summary after selection
- ✅ Professional tone (no retail hype language)

---

## 📄 FRAME 5: SIGNING METHODS (E-SIGN VS OFFLINE)

### **Context**
- Occurs after investor selection (Step 4)
- Tipař chooses how reservation agreement will be signed
- Two paths: E-sign (automatic) or Offline (manual)

---

### **ROUTE A: E-SIGN PATH**

**Step A1: Tipař Chooses "E-sign"**
**UI**: Radio button or card selection "E-sign (recommended)"

**Step A2: System Generates Agreement**
**Process**: Auto-populate PDF with:
- Ticket details (amount, yield, duration, security)
- Investor details (name, email from selection)
- Tipař details (name, company, license)
- Reservation terms and conditions

**Step A3: Send for E-sign**
**Action**: Tipař clicks "Send for e-sign" button  
**System Action**:
- Sends email to investor with signing link (e-sign provider integration)
- Email contains: Ticket summary, terms, signing link, SLA deadline

**Step A4: SLA #1 Starts**
**Timer**: 24 hours from email sent  
**Responsible**: Investor  
**Countdown Display**: In Tipař dashboard, show "Investor signature: 23h 15m remaining"

**Step A5: Investor Signs**
**Process**: Investor clicks link → Reviews agreement → E-signs → Submits  
**System Action**:
- Reservation status updates to "Investor signed — Awaiting developer"
- Developer notification sent to partner dashboard
- Tipař dashboard updated: "✅ Investor signed, ⏳ Developer to countersign"

**If SLA Expires** (24h passed, no signature):
- Reservation status → "Expired — Investor signature timeout"
- Global slot returns to Tipař
- Tipař notified: "Reservation expired, slot returned"

---

### **ROUTE B: OFFLINE (PHYSICAL) PATH**

**Step B1: Tipař Chooses "Offline signing"**
**UI**: Radio button or card selection "Offline signing"

**Step B2: System Provides Printable PDF**
**Action**: System generates same agreement as e-sign route  
**UI**: "Download agreement for printing" button  
**Download**: PDF file opens/downloads

**Step B3: Physical Signing**
**Process** (external to platform):
- Tipař prints agreement
- Tipař meets investor physically
- Investor signs with pen
- Tipař ensures signature is present and valid

**Step B4: Upload Signed Document**
**Action**: Tipař scans signed agreement → Uploads PDF to platform  
**UI**: File upload field in reservation detail page  
**SLA #1**: 24 hours from reservation start to upload (same as e-sign route)

**Step B5: Admin Review/Approval**
**Actor**: Admin (Tipari team)  
**Process**:
- Admin receives notification: "Offline agreement uploaded for review"
- Admin opens uploaded PDF
- Admin checks:
  - ✅ Investor signature present
  - ✅ Signature matches investor name
  - ✅ All pages signed/initialed (if required)
  - ✅ No tampering or modifications
- Admin clicks "Approve" or "Reject with reason"

**If Approved**:
- Reservation status → "Investor signed (offline) — Awaiting developer"
- Developer notified to countersign
- Tipař notified: "Agreement approved, developer notified"

**If Rejected**:
- Reservation status → "Admin rejected — Re-upload required"
- Tipař notified: "Agreement rejected: [reason]. Please re-upload."
- Tipař can re-upload corrected document
- SLA clock may pause or continue (business rule decision)

**Step B6: SLA #1 Still Applies**
**Timer**: 24 hours from reservation start  
**If Tipař doesn't upload within 24h**:
- Reservation expires
- Global slot returns

**Step B7: After Admin Approval**
Same as e-sign route:
- Developer notified to countersign
- Proceeds to Step 6 (Developer countersign)

---

### **Comparison Table**

| Aspect | E-sign | Offline |
|--------|--------|---------|
| **Speed** | Faster (automated) | Slower (manual) |
| **SLA #1** | 24h for investor to sign | 24h for Tipař to upload |
| **Admin Approval** | Not required | Required |
| **Investor Action** | Click link, e-sign | Meet physically, pen sign |
| **Tipař Action** | Click "Send" | Print, meet, scan, upload |
| **Best For** | Remote investors, speed | Investor prefers physical, compliance |

---

## 📄 FRAME 6: SLA TIMER SYSTEM

### **Overview**
SLA (Service Level Agreement) timers ensure momentum and accountability in reservation flow.

**Purpose**: Compliance tool, NOT marketing pressure  
**Tone**: Neutral, informational, professional  
**Display**: Countdown + absolute deadline timestamp

---

### **SLA #1: Investor Signature**

**Duration**: 24 hours  
**Starts**: When e-sign email sent OR when reservation created (offline route)  
**Ends**: When investor signs OR 24h expires  
**Responsible**: Investor (e-sign) OR Tipař (offline upload)

**Countdown Display** (Tipař dashboard):
```
⏰ Investor Signature
Zbývá: 22 hodin 35 minut
Vyprší: 16.1.2025 10:00
████████████░░░░░░ 70%
```

**Color Coding**:
- Green: 24h-12h remaining (healthy)
- Yellow: 12h-6h remaining (caution)
- Orange: 6h-2h remaining (urgent)
- Red: < 2h remaining (critical)

**On Expiry**:
- Reservation status → "Expired — Investor signature timeout"
- Global slot returned to Tipař immediately
- Tipař notified: "Reservation expired, slot returned"
- Investor notified (if e-sign): "Signing window closed"
- Analytics logged: SLA breach (investor engagement issue)

---

### **SLA #2: Developer Countersign**

**Duration**: 48 hours  
**Starts**: When developer notified (after investor signed)  
**Ends**: When developer countersigns OR 48h expires  
**Responsible**: Developer

**Countdown Display** (Developer dashboard):
```
🚨 ACTION REQUIRED
Developer Signature
Zbývá: 44 hodin 20 minut
Vyprší: 17.1.2025 14:30
█████████████████░ 92%
```

**Developer Dashboard Priority**:
- Show in "Pending Actions" queue
- Sort by SLA urgency (critical first)

**On Expiry**:
- Reservation status → "Expired — Developer signature timeout"
- Global slot returned to Tipař
- Tipař notified: "Reservation expired (developer timeout), slot returned"
- Developer notified: "Signature deadline missed, reservation closed"
- Analytics logged: SLA breach (developer responsiveness issue)

---

### **SLA #3: Meeting Confirmation**

**Duration**: 24 hours  
**Starts**: When meeting options email sent to investor  
**Ends**: When investor confirms one option OR 24h expires  
**Responsible**: Investor

**Countdown Display** (Tipař dashboard):
```
⏰ Meeting Confirmation
Zbývá: 18 hodin 45 minut
Vyprší: 17.1.2025 15:50
████████████████░░ 78%
```

**Email to Investor**:
```
Subject: Potvrzení termínu schůzky — [Ticket Name]

Meeting Options:
○ 20.1.2025, 10:00 — Kancelář Praha 1
○ 20.1.2025, 14:00 — Kancelář Praha 1
○ 21.1.2025, 11:00 — Kancelář Praha 1

Please confirm by: 17.1.2025 15:50 (24 hours)
[Confirm Meeting] button
```

**On Expiry**:
- Reservation status → "Expired — Meeting confirmation timeout"
- Global slot returned to Tipař
- Tipař notified: "Reservation expired (investor didn't confirm meeting)"
- Developer notified: "Meeting confirmation expired"
- Investor notified: "Meeting confirmation window closed"

**🔥 SPECIAL: On Confirmation (Not Expiry)**:
- **Reservation becomes ACTIVE**
- **Global slot returns to Tipař immediately** (slot released)
- Negotiation SLA #4 starts (30 days)
- Identities revealed to all parties
- Status update: "Active Reservation"

---

### **SLA #4: Negotiation/Financing**

**Duration**: 30 days  
**Starts**: When reservation becomes ACTIVE (meeting confirmed)  
**Ends**: When funding occurs OR 30 days expires  
**Responsible**: All parties (Tipař, Investor, Developer — collaborative)

**Countdown Display** (Tipař dashboard):
```
🟢 ACTIVE RESERVATION
Financing Window
Zbývá: 25 dní 3 hodiny
Vyprší: 15.2.2025 18:30
██████████████████████░░░ 83% (day 5/30)
```

**Milestones** (optional tracking):
- Meeting completed: ✅
- Due diligence started: ⏳
- Terms agreed: ○
- Contract signed: ○
- Funding: ○

**On Expiry** (30 days, no funding):
- Reservation status → "Expired — Financing deadline"
- Ticket remains open (other reservations can still proceed)
- Tipař notified: "Reservation expired (30-day financing window)"
- No slot return (slot already released at activation)
- Analytics logged: Deal flow issue (not necessarily anyone's fault)

**On Funding** (Before Expiry):
- Reservation status → "Completed — Funded"
- **Win condition triggered** (see Frame 9)
- Ticket becomes inactive
- Other reservations on ticket closed
- Commission lifecycle starts

---

### **SLA Reminders (Automated)**

**At 50% Remaining**:
- Email to responsible party
- In-app notification

**At 12h Remaining**:
- Email reminder
- In-app notification (urgent)

**At 2h Remaining**:
- Email (critical)
- SMS (if phone available)
- In-app notification (critical alert)

---

## 📄 FRAME 7: GLOBAL SLOTS & TIER STRUCTURE

### **Purpose**
Global slots control how many reservation attempts a Tipař can START simultaneously across all tickets.

**Key Principle**: Prevent spam, encourage focus, enable top performers to scale.

---

### **Tier Structure** (Proposed Professional Names)

| Tier ID | Display Name | Czech Name | Global Slot Limit | Typical Profile |
|---------|--------------|------------|-------------------|-----------------|
| **T1** | **Associate** | **Člen** | **3 slots** | Entry level, learning platform |
| **T2** | **Professional** | **Profesionál** | **6 slots** | Established, proven track record |
| **T3** | **Elite** | **Elite** | **10 slots** | Top performer, large network |

**Progression Criteria** (example):
- T1 → T2: 3 successful fundings + 6 months tenure
- T2 → T3: 10 successful fundings + €5M total volume + 12 months as T2

**Alternative Tier Names** (if preferred):
- Starter / Pro / Elite
- Junior / Senior / Expert
- Bronze / Silver / Gold (avoid if too "gamified")

---

### **Global Slot Mechanic**

**Slot Definition**: Capacity token that allows Tipař to initiate "Reserve slot" on a ticket.

**Slot Consumption**:
- When: Tipař clicks "Reserve slot" → Reservation created
- Counter updates: Global slots used +1 (e.g., 6/10 → 7/10)

**Slot Return** (Critical Timing):

**Returns IMMEDIATELY when**:
1. ✅ **Reservation becomes ACTIVE** (investor confirms meeting)
   - This is the KEY mechanic: Slot released at activation
   - Tipař can immediately start another reservation
   - Counter updates: Global slots used -1 (e.g., 7/10 → 6/10)

2. ✅ **Reservation cancelled** (by Tipař or developer, at any stage)
   - Slot returned
   - Counter updates: -1

3. ✅ **Reservation expires** (SLA timeout at any stage before activation)
   - Slot returned automatically
   - Counter updates: -1

**Does NOT Return**:
- ❌ While reservation is in progress (draft, signing, meeting proposal states)
- ❌ During active reservation (slot already returned at activation)

---

### **Why This Design Works**

**Problem**: If slots never return, top Tipars are blocked from starting new deals even after successfully activating many reservations.

**Solution**: Release slot at activation (meeting confirmed), because:
- The "holding capacity" is no longer needed
- The case is now actively managed (not in limbo)
- Tipař can pursue other opportunities in parallel

**Result**:
- Tipař can have UNLIMITED active reservations (no cap)
- Tipař has FINITE slots for starting new attempts (controlled entry)
- Top performers scale without artificial bottlenecks

---

### **UI Display: Global Slot Counter**

**Location**: Top of Tipař dashboard (always visible)

**Design**:
```
┌─────────────────────────────────────────┐
│ 🎫 VAŠE SLOTY                           │
│                                         │
│     ████████░░  7/10 využito           │
│                                         │
│     Volné sloty: 3                      │
│     Level: Elite                        │
│                                         │
│     [Zobrazit probíhající pokusy]      │
└─────────────────────────────────────────┘
```

**Color Coding**:
- Green: 0-60% used (healthy)
- Yellow: 61-85% used (caution)
- Red: 86-100% used (critical, at limit)

**Click Action**: Navigate to slot management page OR filter reservations to show only slot-consuming ones

**Tooltip**: "Slot se uvolní automaticky, když rezervace dosáhne stavu 'Aktivní' (schůzka potvrzena)."

---

### **Validation: Cannot Exceed Limit**

**When Tipař clicks "Reserve slot"**:
```javascript
IF tipar.slotsUsed >= tipar.slotLimit {
  SHOW ERROR MODAL:
    Title: "Limit slotů vyčerpán"
    Message: "Využili jste všech 10 slotů (Elite level).
              Slot se uvolní automaticky, když rezervace
              dosáhne stavu 'Aktivní' (schůzka potvrzena),
              nebo můžete zrušit některý z probíhajících pokusů."
    Actions:
      [Zobrazit moje sloty]
      [Zrušit]
}
```

---

## 📄 FRAME 8: PER-TICKET LIMITS

### **Purpose**
Per-ticket limits control exclusivity and prevent one Tipař from monopolizing a ticket.

**Goal**: Developer negotiates with max 3 investors at a time per ticket (controlled, professional).

---

### **Hard Limits Per Single Ticket**

**Limit 1: Max 3 Active Slot Holds (Global)**
- Across ALL Tipaři combined
- Max 3 Tipaři can be in "reservation setup" phase on one ticket simultaneously

**Limit 2: Max 3 Active Slot Holds (Per Tipař)**
- One Tipař cannot have more than 3 active slot holds on the same ticket
- Prevents monopolization

**Limit 3: Max 3 Active Reservations (Global)**
- Across ALL Tipaři combined
- Max 3 Tipaři can be in "active negotiation" phase on one ticket simultaneously

**Limit 4: Max 3 Active Reservations (Per Tipař)**
- One Tipař cannot have more than 3 active reservations on the same ticket
- Encourages investor diversity

---

### **State Definitions**

**"Active Slot Hold"** = Reservation in these states:
- Draft (investor selection, signing method choice)
- Signature collection (investor sig, developer sig)
- Meeting proposal/confirmation
- **Does NOT include**: Active reservation (slot already released)

**"Active Reservation"** = Reservation in these states:
- Active reservation (meeting confirmed, negotiation phase)
- Funding claimed (pending confirmation)
- **Does NOT include**: Slot holds (not yet activated)

---

### **Validation Logic**

**When Tipař clicks "Reserve slot" on Ticket T-001**:
```javascript
// Check 1: Ticket global slot capacity
IF ticket.activeSlotHoldsCount >= 3 {
  SHOW ERROR:
    "Kapacita slotů tiketu vyčerpána (3/3).
     Jiní zprostředkovatelé již zahájili 3 rezervační pokusy.
     Sledujte tiket pro uvolnění kapacity."
  DISABLE BUTTON
}

// Check 2: Ticket active reservation capacity
IF ticket.activeReservationsCount >= 3 {
  SHOW ERROR:
    "Tiket má již 3 aktivní rezervace (max kapacita).
     Developer již jedná s 3 investory paralelně."
  DISABLE BUTTON
}

// Check 3: Tipař per-ticket slot limit
IF tipar.activeSlotHoldsOnTicket(T-001) >= 3 {
  SHOW ERROR:
    "Již máte 3 probíhající pokusy na tento tiket.
     Nejprve dokončete nebo zrušte některý z nich."
  DISABLE BUTTON
}

// Check 4: Tipař per-ticket active reservation limit
IF tipar.activeReservationsOnTicket(T-001) >= 3 {
  SHOW ERROR:
    "Již máte 3 aktivní rezervace na tento tiket.
     Dokončete existující rezervace před zahájením nové."
  DISABLE BUTTON
}

// All checks pass
ALLOW RESERVATION CREATION
```

---

### **UI Display: Per-Ticket Capacity Meters**

**Location**: Ticket detail page, below hero section

**Design**:
```
┌─────────────────────────────────────────────┐
│ 📊 KAPACITA TIKETU                          │
│                                             │
│ Probíhající pokusy: ██░  2/3                │
│ Aktivní rezervace: █░░  1/3                 │
│                                             │
│ ℹ️ Max 3 paralelní pokusy, max 3 aktivní   │
│    rezervace na jeden tiket.                │
└─────────────────────────────────────────────┘
```

**Status Messages**:
- If 0/3 slots, 0/3 active: "✅ Plná kapacita dostupná"
- If 2/3 slots: "⚠️ Omezená kapacita - 1 volný slot"
- If 3/3 slots: "🔴 Sloty plné - kapacita vyčerpána"
- If 3/3 active: "🟡 Plně rezervováno - max jednání dosaženo"

---

### **Important Note: NO Global Reservation Limit**

**We do NOT limit**:
- ❌ Total number of reservations a Tipař can have globally

**We ONLY limit**:
- ✅ Global slots (capacity to START new reservations)
- ✅ Activity per single ticket (exclusivity)

**Rationale**: Top Tipars should not be artificially capped on their overall deal flow. They can have 50 active reservations across different tickets, as long as they respect:
- Their global slot limit (for starting new attempts)
- Per-ticket limits (for exclusivity)

---

## 📄 FRAME 9: WIN CONDITION & CASCADE

### **Win Condition**

**Rule**: For a given ticket, the winner is the **first reservation to reach "Ticket Funded"**.

**Multiple Reservations Can Compete**:
- Ticket T-001 can have:
  - 2 active slot holds (in signing/meeting phase)
  - 1 active reservation (negotiation phase)
- All are racing to fund first

**Only One Winner**:
- As soon as ONE reservation reaches funded status:
  - That reservation wins
  - Ticket becomes inactive
  - All other reservations on that ticket are closed

---

### **Cascade Logic (When Ticket Funded)**

**Trigger**: Developer or Tipař reports "Funding completed" for Reservation R-001 on Ticket T-001

**System Actions** (Atomic Transaction):

**1. Update Winner (R-001)**:
- Status → "Completed — Funded"
- Funding date recorded
- Commission lifecycle triggered

**2. Lock Ticket (T-001)**:
- Status → "Inactive — Funded"
- No new reservations allowed
- Display: "✅ Profinancováno"

**3. Find All Other Reservations on T-001**:
Example: R-002, R-003, R-004

**4. Close Each Losing Reservation**:

For R-002 (in slot hold phase):
- Status → "Closed — Ticket funded by another party"
- Global slot returned to Tipař immediately
- Tipař notified: "Tiket T-001 byl profinancován jinou rezervací. Váš slot vrácen."

For R-003 (in active reservation phase):
- Status → "Closed — Ticket funded by another party"
- No slot return (slot already released at activation)
- Tipař notified: "Tiket T-001 byl profinancován jinou rezervací."

For R-004 (in meeting confirmation phase):
- Status → "Closed — Ticket funded by another party"
- Global slot returned to Tipař
- Tipař notified with same message

**5. Notify All Parties**:
- Winner Tipař: "🎉 Rezervace úspěšně uzavřena! Provize aktivována."
- Loser Tipaři: "Tiket profinancován jinou rezervací."
- Developer: "Ticket T-001 funded successfully."
- Investors (losers): "Project funded by another investor."

**6. Update Counters**:
- Ticket: activeSlotHolds = 0, activeReservations = 0
- Tipaři (losers): slotsUsed -1 (if slot was consumed)

---

### **UI Consequences**

**Winner Tipař Dashboard**:
```
✅ RESERVATION SUCCESS

Reservation R-001 funded
Ticket: T-001 — Bytový dům Karlín
Amount: 5,000,000 Kč

💰 COMMISSION ACTIVATED
Amount: 125,000 Kč (2.5%)
Status: Pending payout
Due: 30 days

[View commission detail]
```

**Loser Tipař Dashboard**:
```
❌ RESERVATION CLOSED

Reservation R-002 ended
Ticket: T-001 — Bytový dům Karlín
Reason: Ticket funded by another party

✅ Slot returned
Your slots: 7/10 → 6/10 (available +1)

[View similar tickets]
```

**Ticket Detail Page** (all users):
```
Status: ✅ PROFINANCOVÁNO
Funded: 10.2.2025 | 5,000,000 Kč

CTA: "Profinancováno" (disabled, grey)
No new reservations allowed
```

---

### **Fair Competition Rules**

**Transparency**:
- Tipaři can see capacity meters (2/3 active slots)
- Tipaři know they are competing
- First to fund wins (clear rule)

**No Interference**:
- Platform does not favor any Tipař
- No insider information
- Purely based on execution speed and investor readiness

**Slot Return for Losers**:
- Ensures losing Tipaři are not penalized
- Slots returned immediately
- Can pursue other opportunities

---

## 📄 FRAME 10: COMMISSION MODEL (DUAL-SIDED)

### **Overview**
Tipař can earn commission through TWO pathways.

**Important**: Both pathways use the same reservation mechanics (slots, SLA, flow). Commission attribution is determined by business rules.

---

### **Pathway 1: Investor-Sourced Commission** (Primary Flow)

**Scenario**: Tipař brings investor to an existing project/ticket on platform.

**Commission Trigger**: When reservation reaches "Funded" status

**Commission Calculation**:
- Percentage of funded amount (typically 2-2.5%)
- Example: 5M CZK investment → 125,000 CZK commission (2.5%)

**Commission Lifecycle**:
1. Funding occurs (developer receives investment)
2. Platform receives commission from developer/project
3. Platform pays Tipař (per agreed terms, e.g., 30 days)

**Status Tracking** (Tipař dashboard):
```
💰 COMMISSION — INVESTOR-SOURCED

ID: COM-2025-001
Type: Investor-side
Amount: 125,000 Kč (2.5% z 5,000,000 Kč)
Status: Pending payment
Created: 10.2.2025
Due: 12.3.2025 (30 days)

Related Reservation: R-2025-001
Ticket: T-001 — Bytový dům Karlín
Investor: Jan Dvořák

[View details] [Download invoice]
```

---

### **Pathway 2: Project-Sourced Commission** (Platform Growth)

**Scenario**: Tipař introduces a new project/developer to Tipari.cz platform.

**When Tipař Earns**:
- That project gets listed on platform
- ANY Tipař (including different Tipař) successfully closes a deal on that ticket
- Original introducing Tipař earns commission share

**Commission Trigger**: When ANY reservation on that ticket reaches "Funded" status

**Commission Calculation**:
- Separate percentage (defined in project introduction agreement)
- Example: 1% of funded amount (lower than investor-side, but passive income)
- Split logic: Closing Tipař gets investor-side commission (2.5%), introducing Tipař gets project-side commission (1%)

**Status Tracking** (Introducing Tipař dashboard):
```
💰 COMMISSION — PROJECT-SOURCED

ID: COM-2025-002
Type: Project-side (introduced project)
Amount: 50,000 Kč (1% z 5,000,000 Kč)
Status: Pending payment
Created: 10.2.2025
Due: 12.3.2025 (30 days)

Related Reservation: R-2025-045 (closed by Eva Nová)
Ticket: T-001 — Bytový dům Karlín
Your Contribution: Introduced project to platform

[View details] [Download invoice]
```

---

### **Dual Commission Example**

**Ticket T-001**: Bytový dům Karlín (5M CZK)

**History**:
- Tipař A (Jan Novák) introduced project to platform in 2024
- Tipař B (Eva Nová) brought investor (Petr Svoboda) to ticket in 2025
- Investor funded project: 5M CZK

**Commission Distribution**:
- **Tipař B (Eva Nová)**: 125,000 CZK (2.5% investor-side) — Closed the deal
- **Tipař A (Jan Novák)**: 50,000 CZK (1% project-side) — Introduced project

**Total Platform Commission**: 175,000 CZK (3.5% combined)

---

### **UI Display: Commission Dashboard**

**Tipař Dashboard** → "Provize" Page

**Summary Cards**:
```
┌──────────────────────────────┐
│ 💰 CELKEM PROVIZE            │
│                              │
│ Pending: 325,000 Kč (3)      │
│ Paid (this year): 1,250,000 Kč │
│ Next payment: 12.3.2025      │
└──────────────────────────────┘
```

**Commission List** (filterable):
- Filter by: Status (Pending / Paid), Type (Investor / Project), Date range
- Sort by: Created date, Amount, Due date

**Each Commission Item**:
```
┌─────────────────────────────────────────┐
│ 💰 COM-2025-001                         │
│ Type: Investor-side | Amount: 125,000 Kč│
│ Status: Pending payment                 │
│ Due: 12.3.2025 (30 days)                │
│                                         │
│ Ticket: T-001 — Bytový dům Karlín       │
│ Investor: Jan Dvořák                    │
│ Funded: 10.2.2025                       │
│                                         │
│ [View details] [Download invoice]       │
└─────────────────────────────────────────┘
```

---

### **Important Note**

**Reservation Mechanics Are Identical**:
- Same slot system
- Same SLA timers
- Same signing methods
- Same meeting confirmation
- Same win condition

**Only Difference**:
- Commission attribution (who gets what %)
- Tracked in separate commission module
- Both pathways can coexist (introducing Tipař + closing Tipař both earn)

---

## ✅ DOCUMENTATION COMPLETE

**These 10 frames** provide complete reference for Tipari.cz reservation flow logic.

**Usage**:
1. Add as NEW frames in Figma (do not modify existing UI)
2. Name frames: "DOCS — Reservation Flow [Frame Number]"
3. Use neutral text blocks (copy content from this document)
4. Reference when designing/implementing reservation features
5. Ensure consistency with canonical logic

**Status**: Ready for Figma integration  
**Format**: Neutral documentation frames (no UI redesign)  
**Authority**: Based on PROMPTs 1-8 complete context

---

**END OF FIGMA DOCUMENTATION**
