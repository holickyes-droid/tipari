# DESIGN SYSTEM LOGIC – TIPARI.CZ PLATFORM
**Closed B2B Investment Referral & Orchestration Platform**

**Document Type:** Design System Logic Rules (Not Visual Specification)
**Date:** 2025-01-01
**Status:** Non-Negotiable Design Principles

---

## DOCUMENT PURPOSE

This document defines the LOGICAL PRINCIPLES that govern all UI decisions.
- Not a visual style guide
- Not a component library spec
- Not a brand guideline

This is the **LOGIC layer** that determines:
- What information is shown
- How information is prioritized
- What actions are allowed
- How users make decisions
- How errors are communicated
- How authority is expressed

---

## CORE DESIGN PHILOSOPHY

### Platform Identity
**Tipari.cz is:**
- A closed B2B professional tool
- Used by bankers and financial intermediaries
- NOT a marketplace
- NOT a retail investment platform
- NOT a marketing product

**Design must feel like:**
- Internal banking software
- Enterprise SaaS tool
- Regulated workflow system
- Professional data management interface

**Design must NOT feel like:**
- Consumer fintech app
- Crowdfunding platform
- Investment marketplace
- Growth-hacked product

---

## DESIGN SYSTEM LAYERS

### Layer 1: Information Hierarchy

#### PRIMARY INFORMATION (Always Visible)
Information that directly impacts decision-making:
- Current state of entity (project/ticket/reservation/commission)
- Next required action
- Deadlines (SLA countdown)
- Financial amounts (investment, commission)
- Capacity constraints (slots, tickets)
- Blocking reasons (why action is unavailable)

**Visual Treatment:**
- Largest text size
- Highest contrast
- Top of screen
- Never hidden behind interactions

#### SECONDARY INFORMATION (Contextual)
Information that provides context but is not decision-critical:
- Historical data
- Metadata (created date, modified date)
- Actor information (who did what)
- Audit trail
- Related entities

**Visual Treatment:**
- Medium text size
- Medium contrast
- Below primary info or in tabs
- Can be collapsed if space constrained

#### TERTIARY INFORMATION (Background)
Information for reference or compliance:
- System-generated IDs
- Timestamps (to the second)
- IP addresses
- Technical error codes
- Full audit logs

**Visual Treatment:**
- Smallest text size
- Low contrast (muted)
- Bottom of screen or dedicated views
- Can be hidden by default

---

### Layer 2: Component Intent

Components are defined by PURPOSE, not appearance.

#### TABLES
**Purpose:** Display multiple entities with comparable attributes

**Must Show:**
- Sortable columns for decision criteria
- Current state per row
- Primary action per row (if allowed)
- Empty state if no data

**Must NOT Show:**
- Marketing copy in empty states
- Fake data
- Disabled rows without explanation

**Usage Rules:**
- Use for list views (projects, reservations, investors, commissions)
- Always show total count
- Always allow filtering
- Always show loading state

#### MODALS / SHEETS
**Purpose:** Focus on single entity or action without losing context

**Types:**
1. **Detail Modal** – View complete entity information
   - Use: Reservation detail, investor detail
   - Size: Large (80% width or side panel)
   - Scrollable: Yes
   - Dismissible: Yes (no data loss)

2. **Action Modal** – Perform specific action
   - Use: Create reservation, approve project
   - Size: Medium (60% width)
   - Scrollable: If needed
   - Dismissible: Yes with confirmation if data entered

3. **Confirmation Modal** – Confirm irreversible action
   - Use: Cancel reservation, reject project
   - Size: Small (40% width)
   - Scrollable: No
   - Dismissible: Yes

**Must Show:**
- Clear title (what entity/action)
- Close button (always)
- Primary action (if applicable)
- Cancel action (if applicable)
- Blocking reasons (if action unavailable)

**Must NOT Show:**
- Marketing messages
- Upsells
- Unrelated suggestions

#### BADGES
**Purpose:** Indicate current state or property

**Types:**
1. **State Badge** – Entity lifecycle state
   - Use: Project status, reservation phase, commission status
   - Must include text label (no icon-only)
   - Color must have semantic meaning (not decorative)

2. **Property Badge** – Binary attribute
   - Use: Secured, time-limited, verified
   - Must be factual (no subjective labels like "hot")

3. **Urgency Badge** – Time-sensitive information
   - Use: SLA countdown, deadline approaching
   - Must show actual time remaining
   - Must NOT use generic "urgent" without data

**Color Semantics:**
- **Green** (`#14AE6B`) – Positive state (active, completed, paid)
- **Blue** (`#215EF8`) – In progress (waiting, pending)
- **Orange** – Time-sensitive (deadline approaching)
- **Red** – Critical (expired, rejected, error)
- **Gray** – Neutral (inactive, dormant, closed)

**Must NOT:**
- Use color alone (always include text)
- Use subjective labels ("amazing deal")
- Animate or pulse (no attention hacks)

#### STATUS INDICATORS
**Purpose:** Show progress or state visually

**Types:**
1. **Progress Indicator** – Multi-step process
   - Use: Reservation timeline (6 phases)
   - Must show current step
   - Must show completed steps
   - Must show remaining steps
   - Must NOT hide steps

2. **Capacity Indicator** – Resource availability
   - Use: Slot counter, ticket occupancy
   - Must show current vs. total
   - Must show blocking threshold (e.g., "0 remaining")
   - Must NOT use percentage alone

3. **Health Indicator** – System status
   - Use: SLA status, compliance check
   - Must be binary (pass/fail, healthy/degraded)
   - Must show reason if failed

**Must Show:**
- Actual numbers (not just percentage)
- Units (days, hours, CZK, slots)
- Thresholds (when state changes)

**Must NOT Show:**
- Ambiguous states ("almost full")
- Marketing language ("hurry!")

#### CTAs (Call-to-Action Buttons)
**Purpose:** Trigger user action

**Allowed CTA Labels:**
- Rezervovat slot
- Potvrdit
- Zrušit
- Zobrazit detail
- Stáhnout dokument
- Nahrát dokument
- Schválit
- Zamítnout
- Uzavřít
- Uložit

**Forbidden CTA Labels:**
- ❌ Investovat nyní (implies platform is investment platform)
- ❌ Rychle jednat (urgency manipulation)
- ❌ Nenechte si ujít (FOMO)
- ❌ Omezená nabídka (marketing)
- ❌ Rezervovat teď! (urgency)
- ❌ Any label with exclamation mark
- ❌ Any label with emoji

**CTA Governance Rules:**
1. **Primary CTA** – Main action on screen
   - Maximum 1 per view
   - Always blue background (`#215EF8`)
   - Always at top-right or bottom-right
   - Disabled if action unavailable (with reason shown)

2. **Secondary CTA** – Alternative action
   - Maximum 2 per view
   - Outline style (no background)
   - Next to or below primary CTA
   - Can always cancel/close

3. **Destructive CTA** – Irreversible action
   - Red color (only for delete/reject)
   - Requires confirmation modal
   - Must show consequence ("Tato akce je nevratná")

**CTA State Rules:**
- **Enabled:** Action is allowed
  - Full opacity
  - Clickable
  - No tooltip needed

- **Disabled:** Action is blocked
  - Reduced opacity (50%)
  - Not clickable
  - Tooltip MUST explain why blocked
  - Example: "Nelze rezervovat – kapacita vyčerpána"

- **Loading:** Action is processing
  - Show spinner icon
  - Change label to "Zpracovává se..."
  - Block further clicks

**Must NOT:**
- Auto-click or auto-submit
- Hide blocking reasons
- Use generic "Disabled" without explanation
- Change CTA label unexpectedly

---

### Layer 3: Status Communication Rules

**Principle:** States must be explicit, never implicit.

#### Rule 1: No Color-Only Communication
**❌ Wrong:**
- Red badge with no text
- Green dot with no label
- Color-coded rows without key

**✅ Correct:**
- Red badge with text "Expirováno"
- Green badge with text "Aktivní"
- Color-coded rows WITH legend

**Reason:** Accessibility (color blindness) + clarity

#### Rule 2: Always Show Next Step
**For every non-terminal state, UI must show:**
- Who needs to act (Investor, Partner, Admin, System)
- What action is expected
- When it needs to happen (SLA)

**Example:**
```
Current State: Čeká na podpis investora
Next Step: Investor musí podepsat RA
SLA: Zbývá 36 hodin
```

**Must NOT:**
- Show state without next step
- Use generic "Pending" without actor
- Hide deadlines

#### Rule 3: Terminal States Must Be Clear
**Terminal states require explicit labeling:**
- ✅ "Úspěšně uzavřeno" (SUCCESS)
- ✅ "Nedohodnutý obchod" (NO_DEAL)
- ✅ "Expirováno" (EXPIRED)
- ✅ "Zrušeno" (CANCELLED)

**Must show:**
- Date when terminal state was reached
- Reason (if cancelled/rejected)
- Outcome (if applicable)

**Must NOT:**
- Allow actions on terminal states
- Show countdown on terminal states
- Hide reason for termination

#### Rule 4: State History Is Immutable
**All past states must remain visible:**
- In timeline components
- In activity logs
- In audit trails

**Must NOT:**
- Delete past state records
- Hide state transition history
- Overwrite timestamps

---

### Layer 4: User Control Philosophy

**Principle:** User confirms every irreversible action. No auto-progression. No dark patterns.

#### Rule 1: Explicit Confirmation
**Actions requiring confirmation:**
- Create reservation (locks slot)
- Cancel reservation (releases slot)
- Approve project (goes live)
- Reject project (terminal state)
- Mark as NO_DEAL (loses commission)
- Suspend commission (blocks payment)

**Confirmation modal must show:**
- What will happen
- What cannot be undone
- "Jste si jisti?" question
- Reason field (if applicable)
- Confirm + Cancel buttons

**Must NOT:**
- Auto-confirm after timeout
- Use "OK" as default button
- Hide consequences

#### Rule 2: No Auto-Progression
**States must NOT change automatically based on:**
- User scrolling
- Time passing (except SLA expiration)
- Background sync
- Other user actions

**System CAN auto-progress:**
- SLA expiration (reservation → EXPIRED)
- Capacity calculation (ticket → FULLY_FILLED)
- Project state based on tickets (project → FULLY_RESERVED)

**User must manually trigger:**
- Reservation phase transitions (except SLA)
- Document uploads
- Approvals/rejections
- Commission invoice submission

#### Rule 3: No Dark Patterns
**Forbidden patterns:**
- ❌ Pre-selected checkboxes (user must opt-in)
- ❌ Confirm-shaming ("No, I don't want to succeed")
- ❌ Hidden unsubscribe (if notifications exist)
- ❌ Fake urgency ("Only 2 left!" when not true)
- ❌ Bait-and-switch CTAs (button changes meaning)
- ❌ Forced actions (cannot proceed without upsell)
- ❌ Disguised ads (must be labeled)

**Required patterns:**
- ✅ Clear state communication
- ✅ Visible constraints
- ✅ Honest capacity information
- ✅ Accessible cancel/close
- ✅ Reason explanations

#### Rule 4: Reversible Actions Are Instant
**Actions that CAN be undone:**
- Filtering project list
- Sorting table columns
- Expanding/collapsing sections
- Opening/closing modals
- Changing tabs

**No confirmation needed:**
- These actions are instant
- No loading state unless network call
- Can be reversed by user immediately

---

### Layer 5: Admin Authority Layer

**Principle:** Admin actions are visually and logically distinct from user actions.

#### Rule 1: Visual Distinction
**Admin-triggered events must be labeled:**
- "Změněno administrátorem"
- "Schváleno platformou"
- "Rozšířeno administrátorem"

**In timelines/logs:**
- Different icon (shield or lock)
- Different color (distinct from user actions)
- Always show admin name/ID

#### Rule 2: Override Visibility
**All admin overrides must show:**
- What was overridden
- Who did it (admin name)
- When (timestamp)
- Why (reason field required)
- Original value (if applicable)

**Example:**
```
SLA prodlouženo
Administrátor: Jana Nováková
Datum: 15.12.2024 14:30
Důvod: Partner požádal o dodatečný čas na kontrolu
Původní deadline: 13.12.2024
Nový deadline: 20.12.2024
```

#### Rule 3: Override Logging
**Every override must be logged:**
- In entity audit trail
- In admin action log
- In user-visible timeline (if affects user)

**Cannot be:**
- Deleted
- Hidden from audit
- Performed without reason

#### Rule 4: User Awareness
**Users (Tipaři) must see admin actions:**
- In reservation timeline (if admin changes phase)
- In notification panel (if admin pauses project)
- In project status (if admin rejects)

**Users must NOT:**
- Be able to undo admin actions
- See admin's internal notes (if marked private)
- Access admin-only controls

---

### Layer 6: Error Handling Logic

**Principle:** Errors are part of workflow, not exceptions. Every error must be actionable.

#### Error Categories

**1. USER ERROR – User attempted invalid action**
- Example: "Nelze rezervovat – kapacita vyčerpána"
- Show: Why action is blocked + what user can do instead
- Tone: Neutral, factual
- Color: Orange (warning)

**2. BUSINESS RULE VIOLATION – System constraint hit**
- Example: "Překročen limit 3 rezervací na jeden tiket"
- Show: Which rule was violated + current state
- Tone: Informative
- Color: Orange (warning)

**3. STATE CONFLICT – Entity is in wrong state**
- Example: "Projekt je pozastaven – nové rezervace nejsou možné"
- Show: Current state + required state
- Tone: Neutral
- Color: Gray (info)

**4. SYSTEM ERROR – Technical failure**
- Example: "Chyba připojení – zkuste to prosím znovu"
- Show: What happened + retry option
- Tone: Apologetic but calm
- Color: Red (error)

**5. PERMISSION ERROR – User lacks authority**
- Example: "Tato akce vyžaduje oprávnění administrátora"
- Show: What action is restricted + who can perform it
- Tone: Neutral
- Color: Gray (info)

#### Error Display Rules

**Must Show:**
- Clear error message (Czech language)
- Reason for error (what constraint was violated)
- Next valid action (what user CAN do)
- Retry option (if applicable)
- Contact support (if system error)

**Must NOT Show:**
- Technical stack traces
- Database error codes (unless in admin mode)
- Blame language ("You did this wrong")
- Generic "Error occurred" without details

#### Error Recovery Paths

**No Dead Ends:**
- Every error state has a way forward
- User can always cancel/close
- Data entered is preserved (if possible)
- User can retry with corrected input

**Example Flow:**
```
User clicks "Rezervovat"
  ↓
System checks capacity
  ↓
IF capacity = 0
  ↓
Show error:
  "Nelze rezervovat – tiket je plně obsazen"
  "Co můžete udělat:"
  - [Zobrazit jiné tikety]
  - [Nastavit upozornění] (if supported)
  - [Zavřít]
```

#### Error Prevention

**Before Blocking Action:**
- Disable CTA + show tooltip explaining why
- Update UI to reflect current constraint
- Show real-time capacity/slot counts

**Better Than Error Message:**
- Don't show "Rezervovat" button if capacity = 0
- Don't allow selecting more slots than available
- Don't allow submitting form with missing required fields

---

### Layer 7: Data Display Logic

#### Rule 1: Always Show Units
**Never show bare numbers:**
- ❌ "125000"
- ✅ "125 000 Kč"

- ❌ "2.5"
- ✅ "2,5 % p.a."

- ❌ "24"
- ✅ "24 měsíců"

- ❌ "8"
- ✅ "8 slotů"

**Use Czech locale:**
- Thousands separator: space
- Decimal separator: comma
- Currency: "Kč" after number
- Percentage: "%" after number

#### Rule 2: Show Actual Values, Not Just Derived
**When showing occupancy:**
- ❌ "80% obsazeno"
- ✅ "8 / 10 slotů obsazeno (80%)"

**When showing capacity:**
- ❌ "Nízká dostupnost"
- ✅ "Zbývá 2 / 10 slotů"

**When showing time:**
- ❌ "Brzy vyprší"
- ✅ "Zbývá 18 hodin"

#### Rule 3: Comparative Context
**When showing financial amounts:**
- Show total + per-unit if applicable
- Example: "Celkem 5 000 000 Kč (5× 1 000 000 Kč)"

**When showing commission:**
- Show percentage + calculated amount
- Example: "2,5% provize = 125 000 Kč"

**When showing capacity:**
- Show current + total + percentage
- Example: "7 / 10 slotů (70%)"

#### Rule 4: Time Display
**Absolute vs. Relative:**
- Use **absolute** for created/completed dates
  - "Vytvořeno 15.12.2024 14:30"
- Use **relative** for recent activity (< 7 days)
  - "Před 2 hodinami"
- Use **countdown** for deadlines
  - "Zbývá 2 dny 5 hodin"

**Date Format:**
- Full: "15. prosince 2024 14:30"
- Short: "15.12.2024 14:30"
- Relative: "Před 2h", "Včera", "Před 3 dny"
- Countdown: "Xd Xh" or "Xh Xm"

#### Rule 5: Empty States
**When list/table is empty:**
- Show clear message (not just blank space)
- Explain why empty
- Offer next action (if applicable)

**Example:**
```
Žádné aktivní rezervace
Nemáte zatím žádné aktivní rezervace.
[Prohlédnout projekty]
```

**Must NOT:**
- Show marketing copy in empty state
- Use illustrations (keep it professional)
- Suggest actions user cannot perform

---

### Layer 8: Notification & Alert Logic

#### Notification Types

**1. SYSTEM NOTIFICATION – Platform-generated**
- Example: "Nová rezervace vyžaduje vaši pozornost"
- Trigger: Reservation state change, SLA warning
- Dismissible: Yes
- Actionable: Link to relevant entity

**2. ADMIN NOTIFICATION – Admin action affecting user**
- Example: "Projekt byl pozastaven administrátorem"
- Trigger: Admin override
- Dismissible: Yes
- Actionable: View details + reason

**3. SLA WARNING – Deadline approaching**
- Example: "Rezervace RES-2024-001234 vyprší za 6 hodin"
- Trigger: SLA < 24 hours
- Dismissible: Yes (but reappears if not acted on)
- Actionable: View reservation

**4. SUCCESS CONFIRMATION – Action completed**
- Example: "Rezervace úspěšně vytvořena"
- Trigger: User action completed
- Dismissible: Auto-dismiss after 5 seconds
- Actionable: View created entity

**5. ERROR ALERT – Action failed**
- Example: "Rezervace se nezdařila – kapacita vyčerpána"
- Trigger: User action failed
- Dismissible: Manual dismiss only
- Actionable: Retry or alternative action

#### Notification Display

**In-App Notifications:**
- Badge count on user avatar (unread count)
- Notification panel (dropdown)
- Sorted by time (newest first)
- Mark as read functionality
- Maximum 50 visible (older archived)

**Toast Notifications:**
- Bottom-right corner
- Auto-dismiss after 5 seconds (success)
- Manual dismiss required (error)
- Maximum 3 visible at once
- No auto-play sound

**Email Notifications (if implemented):**
- Only for critical events (SLA expiration, admin rejection)
- Daily digest option (not per-event)
- Clear unsubscribe link
- No marketing content

#### Notification Content Rules

**Must Include:**
- What happened (clear statement)
- Which entity (project/reservation ID)
- When (timestamp)
- What user can do (CTA if applicable)

**Must NOT Include:**
- Urgency manipulation ("Hurry!")
- Multiple CTAs (max 1 per notification)
- Marketing messages
- Unrelated suggestions

---

### Layer 9: Accessibility Logic

**Principle:** Professional tools must be accessible to all users.

#### Keyboard Navigation
- All interactive elements must be keyboard-accessible
- Tab order must be logical (top→bottom, left→right)
- Focus indicators must be visible
- Shortcuts for common actions (if applicable)

#### Screen Reader Support
- All images/icons must have alt text or aria-label
- State changes must be announced
- Loading states must be announced
- Error messages must be associated with form fields

#### Color Contrast
- Text must meet WCAG AA contrast ratio (4.5:1)
- Interactive elements must meet WCAG AA (3:1)
- Color must not be only means of communication

#### Text Sizing
- Base font size: 16px minimum
- User can zoom to 200% without layout breaking
- No absolute pixel heights that prevent text growth

---

### Layer 10: Responsive Behavior Logic

**Principle:** Platform must work on desktop (primary) and tablet (secondary). Mobile is read-only.

#### Desktop (Primary)
- Optimal: 1280px - 1920px width
- Minimum: 1024px width
- Layout: Multi-column, side-by-side views
- Modals: Large sheets, full detail views
- Tables: Full width with all columns

#### Tablet (Secondary)
- Optimal: 768px - 1024px width
- Layout: Stacked columns, tabs for sections
- Modals: Full-screen sheets
- Tables: Horizontal scroll OR cards

#### Mobile (Read-Only)
- Width: < 768px
- Purpose: View-only (no creation/editing)
- Layout: Single column, bottom navigation
- Tables: Card layout
- Forms: Disabled with message "Použijte desktop"

**Responsive Rules:**
- Never hide decision-critical information
- Never require horizontal scroll (except tables)
- Always show state + next action
- Adjust layout, not content

---

## TONE & VOICE GUIDELINES

### Personality
- **Calm** – No urgency, no pressure
- **Professional** – Like internal banking software
- **Neutral** – No emotion, no marketing
- **Precise** – Specific data, not vague descriptions

### Language Rules

**Use:**
- Direct statements ("Kapacita vyčerpána")
- Passive voice when appropriate ("Rezervace byla vytvořena")
- Imperative for actions ("Potvrďte rezervaci")
- Questions for confirmations ("Opravdu chcete zrušit?")

**Avoid:**
- Exclamation marks (no urgency)
- Emojis (not professional)
- Subjective adjectives ("skvělá příležitost")
- Marketing superlatives ("nejlepší", "unikátní")
- False scarcity ("Poslední šance!")
- FOMO triggers ("Nenechte si ujít")

### Writing Checklist

Before any copy goes into UI, ask:
1. Is it factual? (Not opinion)
2. Is it necessary? (Not filler)
3. Is it clear? (Not jargon)
4. Is it calm? (Not urgent)
5. Is it professional? (Not casual)

If all YES → use it
If any NO → rewrite

---

## DESIGN DECISION FRAMEWORK

### When Designing Any Screen, Ask:

**1. INFORMATION ARCHITECTURE**
- What is the primary decision user must make?
- What information is critical to that decision?
- What can be secondary or tertiary?
- Is anything missing that blocks decision-making?

**2. STATE COMMUNICATION**
- What state is this entity in?
- Is the state visible immediately?
- Is the next step clear?
- Is the SLA (if applicable) visible?

**3. ACTION AVAILABILITY**
- What actions can user take?
- Are actions visible or hidden?
- If action is blocked, is reason shown?
- Is there always a way forward?

**4. ERROR PREVENTION**
- What can go wrong?
- Can we prevent error before it happens?
- If error occurs, is it recoverable?
- Is error message actionable?

**5. COMPLIANCE & AUDIT**
- Is this action logged?
- Is user aware of what will be recorded?
- Is admin oversight clear (if applicable)?
- Can user export their data (if needed)?

---

## ANTI-PATTERNS TO AVOID

### ❌ Marketing Anti-Patterns
- Countdown timers (fake urgency)
- "Hot deal" badges (subjective)
- Animated CTAs (attention manipulation)
- Pop-ups with offers (interruption)
- "Limited time" when not true (false scarcity)

### ❌ UX Anti-Patterns
- Disabled buttons without explanation
- Hidden navigation
- Unexpected state changes
- Modal stacking (modal opens modal)
- Infinite scroll without pagination
- Auto-playing anything
- Forced tutorial/onboarding

### ❌ Data Anti-Patterns
- Showing percentage without actual numbers
- Using "high", "medium", "low" without thresholds
- Hiding constraints until error
- Rounding financial amounts
- Showing "success" before confirmation

### ❌ State Anti-Patterns
- Allowing actions on terminal states
- Hiding state transition history
- Ambiguous state labels ("Pending...")
- Color-only state indication
- States with no next step

---

## VISUAL TOKENS (Reference Only)

**Colors:**
- Primary Blue: `#215EF8`
- Success Green: `#14AE6B`
- Background Dark: `#040F2A`
- Warning Orange: `#F59E0B` (inferred)
- Error Red: `#EF4444` (inferred)
- Neutral Gray: `#6B7280`
- Border: `#EAEAEA`
- Muted Text: `#6B7280`

**Typography:**
- System uses theme.css for default sizing
- No Tailwind font size classes unless user requests change
- Rely on semantic HTML (h1, h2, p) for hierarchy

**Spacing:**
- Consistent spacing scale (theme-based)
- Generous whitespace (professional, not cramped)
- Clear visual grouping

**Note:** These are reference only. Visual design is implemented in theme.css and Tailwind config.

---

## IMPLEMENTATION CHECKLIST

Before shipping any UI component:

**✅ Information Hierarchy**
- [ ] Primary info is largest and most visible
- [ ] Secondary info is grouped and accessible
- [ ] Tertiary info is available but not intrusive

**✅ State Communication**
- [ ] Current state is explicit (not implied)
- [ ] Next step is shown (if applicable)
- [ ] SLA countdown is visible (if applicable)
- [ ] Terminal states are clearly labeled

**✅ User Control**
- [ ] Irreversible actions require confirmation
- [ ] No auto-progression without user trigger
- [ ] Cancel/Close is always available
- [ ] No dark patterns used

**✅ Error Handling**
- [ ] Errors show clear reason
- [ ] Errors show next valid action
- [ ] Errors are recoverable (no dead ends)
- [ ] Form data is preserved on error

**✅ Accessibility**
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA
- [ ] Text is zoomable

**✅ Professional Tone**
- [ ] No urgency manipulation
- [ ] No marketing language
- [ ] No subjective claims
- [ ] Calm and factual copy

**✅ Admin Authority**
- [ ] Admin actions are visually distinct
- [ ] Overrides show reason
- [ ] All changes are logged
- [ ] Users see admin actions (when relevant)

---

## END OF DESIGN SYSTEM LOGIC

**Last Updated:** 2025-01-01
**Document Status:** Complete and Non-Negotiable
**Application:** All UI design and development must follow these principles
**Authority:** Design decisions that violate these principles must be challenged

This is not a suggestion document.
This is the design decision framework for Tipari.cz.
