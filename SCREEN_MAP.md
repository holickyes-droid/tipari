# SCREEN MAP – TIPARI.CZ PLATFORM
**Closed B2B Investment Referral & Orchestration Platform**

**Document Type:** Analytical Screen Inventory
**Date:** 2025-01-01
**Status:** Current Implementation

---

## DOCUMENT PURPOSE

This document maps ALL real screens in the Tipari.cz platform.
- No speculative screens
- No marketing screens
- No investor-facing screens
- Focus: operational reality

---

## PRIMARY USER ROLE

**Tipař (Banker / Financial Intermediary)**
- Active user of the platform
- Creates reservations
- Manages investor relationships
- Monitors commissions
- Submits projects

---

## SCREEN STRUCTURE

### 1️⃣ AUTHENTICATION & ACCESS

#### 1.1 Login
- **Purpose:** Secure authentication for platform access
- **Elements:** 
  - Email/username input
  - Password input
  - "Zapomenuté heslo" link
  - Login CTA
- **Access Level:** Public (unauthenticated)

#### 1.2 Password Reset
- **Purpose:** Account recovery
- **Elements:**
  - Email input
  - Reset instructions
  - Confirmation flow
- **Access Level:** Public (unauthenticated)

#### 1.3 Account Locked / Inactive
- **Purpose:** Security notification
- **Elements:**
  - Reason for lock
  - Contact information for support
  - No self-service unlock
- **Access Level:** Public (unauthenticated)

---

### 2️⃣ CORE WORKSPACE

#### 2.1 Dashboard (Přehled)
- **Route:** `/prehled`
- **Purpose:** Executive summary with aggregated metrics
- **Components:**
  - KPI cards (projects, reservations, commissions, investors)
  - Recent activities feed (6 most recent)
  - Top projects by relevance (5 items)
  - Quick actions
- **Data Shown:**
  - Total projects (open/closed)
  - Total project volume
  - Active reservations count
  - Commission summary (expected/earned/paid)
  - Investor summary (active/prospect/inactive)
- **Navigation Target:** Primary landing page after login
- **Access Level:** Authenticated Tipař

#### 2.2 Global Header
- **Purpose:** Persistent navigation and context
- **Elements:**
  - Platform logo (Tipari.cz)
  - Main navigation tabs
  - User avatar with:
    - Name and level
    - Remaining slots indicator
    - Unread notifications badge
  - Notification panel trigger
- **Always Visible:** Yes (sticky)

#### 2.3 Notification Panel
- **Purpose:** System messages and alerts
- **Elements:**
  - Unread count badge
  - Notification list (system-generated)
  - Mark as read functionality
  - Time-based sorting
- **Trigger:** User avatar click or bell icon
- **Access Level:** Authenticated Tipař

---

### 3️⃣ PROJECT CATALOG

#### 3.1 Project List (Projekty - Nabídka)
- **Route:** `/nabidka`
- **Purpose:** Browse available investment projects
- **Components:**
  - CTA section (top banner)
  - Search & filter bar
  - Project list header (sort controls)
  - Project cards (horizontal layout)
  - Advanced filters panel (drawer)
- **Filters:**
  - Search query (name, location, type)
  - Investment form dropdown
  - Show/hide closed projects toggle
  - Advanced filters (drawer):
    - Yield range
    - LTV range
    - Duration range
    - Asset class
    - Development stage
    - Security type
- **Sort Options:**
  - Relevance (default)
  - Newest
  - Priority (time-limited first)
  - Yield (asc/desc)
  - LTV (asc/desc)
  - Duration (asc/desc)
  - Volume (asc/desc)
  - Commission (asc/desc)
  - Available tickets
- **Access Level:** Authenticated Tipař

#### 3.2 Project Detail
- **Route:** `/nabidka/:projectId`
- **Purpose:** Complete project information and ticket selection
- **Components:**
  - Back navigation
  - Project header with:
    - Name, location, status badge
    - Key metrics (volume, yield, LTV, commission)
    - Tags (secured, time-limited, etc.)
  - Project description
  - Tickets section:
    - Tickets table (desktop)
    - Tickets carousel (mobile)
    - "Rezervovat" CTA per ticket
  - Documents section:
    - Document list with status
    - Download/view actions
  - Risk section:
    - Security details
    - LTV details modal trigger
  - Partner information
  - Activity log
- **Modals Triggered:**
  - Reservation modal (ticket selection)
  - LTV details modal
  - Security details modal
  - PDF viewer modal (documents)
- **Access Level:** Authenticated Tipař

#### 3.3 Advanced Filters Panel
- **Type:** Drawer (slide-in)
- **Purpose:** Granular filtering of project list
- **Filters:**
  - Yield range slider
  - LTV range slider
  - Duration range slider
  - Asset class multi-select
  - Development stage multi-select
  - Security type multi-select
  - Project form multi-select
- **Actions:**
  - Apply filters
  - Reset filters
  - Close panel
- **Access Level:** Authenticated Tipař

---

### 4️⃣ TICKET & RESERVATION FLOW

#### 4.1 Reservation Creation Modal
- **Type:** Sheet (side panel)
- **Purpose:** Create new reservation for selected ticket
- **Triggered By:** "Rezervovat" button in tickets table/carousel
- **Components:**
  - Ticket summary:
    - Investment amount
    - Yield, duration, commission
    - Security details
  - Slot availability check:
    - Global slots remaining
    - Ticket capacity
    - Per-ticket reservation limit (max 3)
  - Investor selection:
    - Matching investors list
    - Match percentage
    - Available capacity
    - Active reservation indicator
  - Slot quantity selector (if applicable)
  - Commission estimate
  - SLA information
  - Confirm CTA
- **States:**
  - Ready (default)
  - Loading (processing)
  - Success (reservation created)
  - Error (capacity/limit exceeded)
- **Access Level:** Authenticated Tipař
- **Constraints:**
  - Cannot exceed global slot limit
  - Cannot exceed 3 reservations per ticket
  - Ticket must have available capacity
  - Investor must be selected

#### 4.2 Reservation Confirmation Modal
- **Type:** Dialog (overlay)
- **Purpose:** Confirm successful reservation creation
- **Elements:**
  - Success icon
  - Reservation number (e.g., RES-2024-001234)
  - Next step information
  - SLA countdown
  - Close/View detail actions
- **Access Level:** Authenticated Tipař

#### 4.3 Reservation Detail Modal
- **Type:** Sheet (side panel)
- **Purpose:** View complete reservation lifecycle
- **Components:**
  - Reservation header:
    - Reservation number
    - Project name, ticket number
    - Status badge
    - SLA countdown (if applicable)
  - Reservation timeline (vertical):
    - All 6 phases with visual progress
    - Timestamp per phase
    - Next actor indicator
  - Reservation details:
    - Investor information (revealed after meeting confirmed)
    - Investment amount
    - Commission amount
    - Created date
    - Phase-specific dates
  - Phase-specific actions:
    - Cancel (if cancellable)
    - Upload documents (admin only)
    - Approve/reject (partner only)
    - View documents
  - Meeting details (if applicable):
    - Proposed dates
    - Selected date
    - Meeting location
  - Outcome section (if closed):
    - Investment agreement link
    - Outcome notes
- **Access Level:** Authenticated Tipař
- **Phase Visibility Rules:**
  - Identities revealed ONLY after meeting confirmed
  - Documents visible per phase
  - Actions visible per role and phase

#### 4.4 Reservation Timeline Component
- **Type:** Embedded component
- **Purpose:** Visual representation of reservation lifecycle
- **Phases Shown:**
  1. Čeká na podpis investora (WAITING_INVESTOR_SIGNATURE)
  2. Čeká na rozhodnutí developera (WAITING_DEVELOPER_DECISION)
  3. Čeká na volbu termínu (WAITING_MEETING_SELECTION)
  4. Schůzka potvrzena (MEETING_CONFIRMED) ← ACTIVE
  5. Schůzka dokončena (MEETING_COMPLETED)
  6. SUCCESS / NO_DEAL / EXPIRED
- **Visual Elements:**
  - Phase number indicator
  - Phase name
  - Phase status (completed/current/pending)
  - Timestamp (if completed)
  - Next actor label
- **Access Level:** Authenticated Tipař

#### 4.5 SLA Countdown Component
- **Type:** Embedded component
- **Purpose:** Show time remaining until SLA expiration
- **States:**
  - Green: > 48 hours remaining
  - Orange: 24-48 hours remaining
  - Red: < 24 hours remaining
  - Gray: Expired
- **Display Format:** "Zbývá Xd Xh" or "Zbývá Xh"
- **Access Level:** Authenticated Tipař

---

### 5️⃣ INVESTOR HANDLING (Internal Only)

#### 5.1 Investors List
- **Route:** `/investori`
- **Purpose:** Manage investor portfolio
- **Components:**
  - Page header with KPI cards:
    - Total investors
    - Active investors
    - Total capacity
    - Active reservations
  - Search bar
  - Status filter (ALL / ACTIVE / PROSPECT / INACTIVE / DORMANT)
  - Investor table:
    - Name, type, status
    - Total capacity
    - Active reservations count
    - Last contact date
    - Actions (view detail, contact)
- **Access Level:** Authenticated Tipař
- **Note:** Investors NEVER access this platform

#### 5.2 Investor Detail
- **Route:** `/investori/:investorId`
- **Purpose:** Complete investor profile and history
- **Components:**
  - Back navigation
  - Investor header:
    - Name, type, status badge
    - Key metrics (capacity, active reservations, completed deals)
  - Contact information
  - Investment preferences:
    - Preferred asset classes
    - Yield range
    - LTV limits
    - Duration preferences
  - Reservation history:
    - Active reservations
    - Completed reservations
    - Historical timeline
  - Client matches section:
    - Project recommendations
    - Match percentage
  - Notes section (internal only)
- **Access Level:** Authenticated Tipař
- **Note:** All data is internal to Tipař

#### 5.3 Client Matches Modal
- **Type:** Dialog (overlay)
- **Purpose:** Show recommended projects for investor
- **Elements:**
  - Investor name
  - Matching projects list:
    - Project name
    - Match percentage
    - Key metrics
    - "Rezervovat" CTA
- **Access Level:** Authenticated Tipař

---

### 6️⃣ CONTRACTS & DOCUMENTS

#### 6.1 Document Repository (Embedded)
- **Location:** Project Detail → Documents tab
- **Purpose:** Access project-related documents
- **Elements:**
  - Document list with:
    - Document name
    - File type (PDF, DOCX, XLSX, ZIP)
    - Status (Available / Pending / Not available)
    - Upload date
    - File size
    - Download/view action
- **Document Status:**
  - Available: Can download/view
  - Pending: Being prepared
  - Not available: Not yet uploaded
- **Access Level:** Authenticated Tipař

#### 6.2 PDF Viewer Modal
- **Type:** Dialog (full-screen)
- **Purpose:** View PDF documents in-platform
- **Elements:**
  - PDF viewer iframe
  - Close button
  - Download button (optional)
- **Access Level:** Authenticated Tipař

#### 6.3 Document Upload (Admin Only)
- **Type:** Form component
- **Purpose:** Upload reservation-related documents
- **Elements:**
  - File upload input
  - Document type selector
  - Description field
  - Upload CTA
- **Access Level:** Admin only
- **Context:** Reservation detail modal (phase-specific)

---

### 7️⃣ COMMISSIONS & FINANCE

#### 7.1 Commission Overview
- **Route:** `/provize`
- **Purpose:** Track all commissions across reservations and projects
- **Components:**
  - Stats cards:
    - Total paid
    - Expected commission
    - Completed deals count
    - Pending deals count
  - Sub-navigation tabs:
    - Všechny provize (all)
    - Moje projekty (project origination)
    - Moje rezervace (investor referral)
  - Commission table:
    - Project name
    - Ticket number
    - Investor name
    - Amount
    - Status
    - Date
    - Actions (view detail)
- **Commission Statuses:**
  - EXPECTED (reservation in progress)
  - EARNED (reservation SUCCESS)
  - LOST (reservation NO_DEAL or EXPIRED)
  - PENDING_PAYMENT (earned but not paid)
  - PAID (commission paid out)
- **Access Level:** Authenticated Tipař

#### 7.2 Commission Detail (Project Origination)
- **Route:** `/provize/projekty/:commissionId`
- **Purpose:** View commission from project origination
- **Components:**
  - Back navigation
  - Commission header:
    - Commission amount
    - Status badge
    - Project name
  - Project details:
    - Total volume
    - Commission rate
    - Commission calculation
  - Linked reservations:
    - All reservations on this project
    - Individual commission per reservation
  - Payment timeline:
    - Expected date
    - Earned date
    - Paid date
    - Invoice number
    - Payment reference
- **Access Level:** Authenticated Tipař

#### 7.3 Commission Detail (Reservation)
- **Route:** `/provize/rezervace/:reservationId`
- **Purpose:** View commission from investor referral
- **Components:**
  - Back navigation
  - Commission header:
    - Commission amount
    - Status badge
    - Reservation number
  - Reservation summary:
    - Project name
    - Ticket number
    - Investor name (if revealed)
    - Investment amount
    - Commission rate
  - Reservation lifecycle:
    - Current phase
    - Timeline view
  - Payment details:
    - Expected date
    - Earned date
    - Paid date
    - Invoice number
    - Payment reference
- **Access Level:** Authenticated Tipař

#### 7.4 Commission Page - My Projects
- **Route:** `/provize/projekty` (sub-view)
- **Purpose:** Track commissions from project origination
- **Components:**
  - Filter by status
  - Project list with:
    - Project name
    - Total commission potential
    - Earned commission
    - Linked reservations count
    - Status
- **Access Level:** Authenticated Tipař

#### 7.5 Commission Page - My Reservations
- **Route:** `/provize/rezervace` (sub-view)
- **Purpose:** Track commissions from investor referrals
- **Components:**
  - Filter by status
  - Reservation list with:
    - Project name
    - Ticket number
    - Investor name
    - Commission amount
    - Status
    - Expected/earned date
- **Access Level:** Authenticated Tipař

---

### 8️⃣ MY PROJECTS (Tipař-Originated Projects)

#### 8.1 My Projects List
- **Route:** `/projekty`
- **Purpose:** Manage projects submitted by current Tipař
- **Components:**
  - Page header with stats:
    - Total projects submitted
    - Open projects
    - Total volume
    - Average yield
  - CTA: "Navrhnout nový projekt"
  - Search and filters
  - Project table:
    - Project name
    - Asset class
    - Status
    - Total volume
    - Yield
    - Tickets count
    - Actions (view detail)
- **Access Level:** Authenticated Tipař
- **Note:** Only shows projects brought by current user

#### 8.2 My Project Detail
- **Route:** `/projekty/:projectId`
- **Purpose:** Detailed view of Tipař-originated project
- **Components:**
  - Back navigation
  - Project header:
    - Name, status badge
    - Originated by: current user
    - Key metrics
  - Approval status:
    - Admin approval status
    - Admin notes
    - Approval date
  - Tickets section:
    - Ticket list
    - Ticket status
    - Reservations per ticket
  - Linked commissions:
    - Project origination commission
    - Individual referral commissions
  - Activity log
- **Access Level:** Authenticated Tipař

#### 8.3 Project Submission Form
- **Type:** Full page or modal
- **Purpose:** Submit new project for approval
- **Components:**
  - Project basic information:
    - Name, location, type
    - Development stage
    - Asset class
  - Financial details:
    - Total investment volume
    - Yield PA
    - LTV
    - Investment form
    - Commission rate
  - Security information:
    - Secured (yes/no)
    - Security types
    - Valuation type
  - Ticket configuration:
    - Investment amount per ticket
    - Number of tickets
    - Duration
  - Document upload:
    - Business plan
    - Financial model
    - Due diligence materials
  - Submit for approval
- **Access Level:** Authenticated Tipař
- **Note:** Requires admin approval before going live

#### 8.4 My Projects - Activities
- **Route:** `/aktivity/projekty`
- **Purpose:** Activity feed for Tipař's projects
- **Components:**
  - Activity timeline:
    - Project submissions
    - Approval/rejection events
    - Reservation creations on projects
    - Document uploads
    - Status changes
  - Filter by project
  - Filter by activity type
- **Access Level:** Authenticated Tipař

#### 8.5 My Projects - Commissions
- **Route:** `/provize/projekty`
- **Purpose:** Commission tracking for originated projects
- **Components:**
  - Same as "Commission Page - My Projects" (7.4)
- **Access Level:** Authenticated Tipař

---

### 9️⃣ ACTIVITIES & MONITORING

#### 9.1 Activities Overview
- **Route:** `/aktivity`
- **Purpose:** Unified activity feed
- **Components:**
  - Sub-navigation tabs:
    - Všechny aktivity (all)
    - Moje projekty (project activities)
    - Moje rezervace (reservation activities)
  - Activity timeline:
    - Reservation events
    - Project events
    - Commission events
    - Document events
  - Filter by type
  - Filter by date range
  - Search
- **Access Level:** Authenticated Tipař

#### 9.2 My Reservations - Activities
- **Route:** `/aktivity/rezervace`
- **Purpose:** Activity feed for reservations
- **Components:**
  - Activity timeline:
    - Reservation created
    - Phase transitions
    - SLA warnings
    - Meeting scheduled
    - Documents signed
    - Reservation closed
  - Filter by reservation status
  - Filter by project
- **Access Level:** Authenticated Tipař

---

### 🔟 ADMIN / PLATFORM AUTHORITY

**Note:** Admin screens are NOT fully implemented in current codebase.
The following are LOGICAL screens that MUST exist for platform operation.

#### 10.1 Admin Dashboard
- **Purpose:** Platform-level oversight
- **Components:**
  - Platform KPIs:
    - Total Tipaři
    - Total projects (pending/approved/rejected)
    - Total reservations (by phase)
    - Total commission volume
  - Pending approvals queue
  - SLA violations alert
  - System health metrics
- **Access Level:** Admin only

#### 10.2 Project Approval Queue
- **Purpose:** Review and approve submitted projects
- **Components:**
  - Pending projects list
  - Project detail view
  - Approval actions:
    - Approve (go live)
    - Reject (with reason)
    - Request changes
  - Admin notes field
- **Access Level:** Admin only

#### 10.3 Ticket Management
- **Purpose:** Manage ticket capacity and status
- **Components:**
  - Ticket list (all projects)
  - Ticket detail:
    - Capacity adjustment
    - Status override
    - Manual close
  - Reservations on ticket
  - Admin override log
- **Access Level:** Admin only

#### 10.4 SLA Management
- **Purpose:** Configure and monitor SLAs
- **Components:**
  - SLA configuration:
    - Phase 1 deadline (investor signature)
    - Phase 2 deadline (developer decision)
    - Phase 3 deadline (meeting selection)
    - Phase 4-5 deadline (meeting cycle)
  - SLA violations report
  - Auto-expiry log
  - Manual extension controls
- **Access Level:** Admin only

#### 10.5 Reservation Overrides
- **Purpose:** Admin intervention in reservation lifecycle
- **Components:**
  - Reservation search
  - Reservation detail
  - Override actions:
    - Extend SLA (with reason)
    - Manual phase transition
    - Force close
    - Adjust commission
  - Override history log
  - Override reason requirement
- **Access Level:** Admin only
- **Principle:** All overrides are logged and visible

#### 10.6 Audit Logs
- **Purpose:** Complete audit trail
- **Components:**
  - Event log table:
    - Entity type (project/ticket/reservation/commission)
    - Entity ID
    - Event type (created/updated/deleted/overridden)
    - Actor (user ID)
    - Timestamp
    - Old value
    - New value
    - Reason (if override)
  - Search and filter
  - Export functionality
- **Access Level:** Admin only
- **Principle:** Immutable logs, no deletions

#### 10.7 User Management
- **Purpose:** Manage Tipař accounts
- **Components:**
  - Tipař list:
    - Name, email, level
    - Global slot limit
    - Active reservations count
    - Last login
    - Account status
  - Tipař detail:
    - Profile information
    - Slot allocation adjustment
    - Account lock/unlock
    - Activity history
- **Access Level:** Admin only

#### 10.8 Commission Approval
- **Purpose:** Approve and process commissions
- **Components:**
  - Commission queue (EARNED status)
  - Commission detail review
  - Approval actions:
    - Approve payment
    - Request invoice
    - Suspend commission
  - Payment tracking:
    - Invoice number input
    - Payment reference input
    - Payment date confirmation
- **Access Level:** Admin only

---

## SCREEN NAVIGATION MAP

```
┌─────────────────────────────────────────────────────────┐
│  UNAUTHENTICATED                                        │
├─────────────────────────────────────────────────────────┤
│  → Login                                                │
│  → Password Reset                                       │
│  → Account Locked                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  AUTHENTICATED – TIPAŘ                                  │
├─────────────────────────────────────────────────────────┤
│  [GLOBAL HEADER]                                        │
│    ├─ Logo                                              │
│    ├─ Navigation Tabs:                                  │
│    │    ├─ Projekty (nabidka)                           │
│    │    ├─ Aktivity                                     │
│    │    ├─ Provize                                      │
│    │    ├─ Investoři                                    │
│    │    └─ Přehled                                      │
│    └─ User Avatar + Notifications                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  MAIN WORKSPACE                                         │
├─────────────────────────────────────────────────────────┤
│  → Přehled (Dashboard)                                  │
│  → Projekty (Project List)                              │
│      └─ Project Detail                                  │
│          ├─ Ticket Selection                            │
│          ├─ Reservation Modal                           │
│          └─ Document Viewer                             │
│  → Aktivity                                             │
│      ├─ Všechny aktivity                                │
│      ├─ Moje projekty                                   │
│      └─ Moje rezervace                                  │
│  → Provize                                              │
│      ├─ Všechny provize                                 │
│      ├─ Moje projekty                                   │
│      └─ Moje rezervace                                  │
│  → Investoři                                            │
│      └─ Investor Detail                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  MODALS & OVERLAYS                                      │
├─────────────────────────────────────────────────────────┤
│  → Reservation Modal (sheet)                            │
│  → Reservation Confirmation (dialog)                    │
│  → Reservation Detail Modal (sheet)                     │
│  → Advanced Filters (drawer)                            │
│  → Client Matches Modal (dialog)                        │
│  → LTV Details Modal (dialog)                           │
│  → Security Details Modal (dialog)                      │
│  → PDF Viewer Modal (full-screen)                       │
│  → Notification Panel (dropdown)                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ADMIN ONLY (Not in current implementation)             │
├─────────────────────────────────────────────────────────┤
│  → Admin Dashboard                                      │
│  → Project Approval Queue                               │
│  → Ticket Management                                    │
│  → SLA Management                                       │
│  → Reservation Overrides                                │
│  → Audit Logs                                           │
│  → User Management                                      │
│  → Commission Approval                                  │
└─────────────────────────────────────────────────────────┘
```

---

## SCREENS BY USER ROLE

### Tipař (Primary User)
**Has Access To:**
- Dashboard (Přehled)
- Project catalog (Projekty/Nabídka)
- Project detail
- Reservation creation
- Reservation detail
- Activities feed
- Commission tracking
- Investor management
- My projects (if project originator)
- All modals and detail views

**Cannot Access:**
- Admin dashboard
- Approval queues
- Override controls
- Audit logs (full view)
- User management

### Admin (Platform Authority)
**Has Access To:**
- Everything Tipař has access to
- Admin dashboard
- Project approval queue
- Ticket management
- SLA configuration
- Reservation overrides
- Commission approval
- Audit logs
- User management

**Cannot Access:**
- N/A (full access)

### Investor (Not a Platform User)
**Has Access To:**
- NOTHING – Investors do NOT use this platform
- All investor actions happen offline

### Partner/Developer (Not a Platform User)
**Has Access To:**
- NOTHING – Partners do NOT use this platform
- All partner actions happen via admin on their behalf OR offline

---

## SCREEN CONSTRAINTS

### No Investor-Facing Screens
- Investors never log in
- Investors never see reservations
- Investors never interact with platform UI
- All investor communication is external

### No Partner-Facing Screens
- Partners never log in (current implementation)
- Partner actions are handled by admin OR offline
- Platform tracks partner decisions but does not expose UI to them

### No Marketing Screens
- No onboarding flow
- No "Why Tipari" pages
- No testimonials
- No public-facing landing page
- This is a closed operational tool

### No Speculative Features
- No "coming soon" screens
- No placeholder pages
- All screens listed are operational or logically required

---

## SCREEN NAMING CONVENTIONS

### Czech Language (User-Facing)
All user-facing labels are in Czech:
- Projekty (Projects)
- Aktivity (Activities)
- Provize (Commissions)
- Investoři (Investors)
- Přehled (Overview/Dashboard)

### Technical Naming (Code)
Component names are in English:
- ProjectList
- ReservationModal
- CommissionPage
- InvestorDetail

---

## SCREEN INTERACTION PRINCIPLES

### Decision-First UX
- All critical information upfront
- No hidden data behind unnecessary clicks
- Clear next actions always visible

### Compliance-First Copy
- No urgency marketing
- No emotional triggers
- Calm, procedural, professional tone
- Clear state communication

### System-Level Thinking
- Screens reflect real business logic
- States are explicit
- Constraints are visible
- Errors are actionable

### No Dark Patterns
- No auto-progression
- User confirms all irreversible actions
- No silent changes
- All admin overrides are visible

---

## END OF SCREEN MAP

**Last Updated:** 2025-01-01
**Document Status:** Complete
**Implementation Status:** Partially implemented (Tipař screens complete, Admin screens logical only)
