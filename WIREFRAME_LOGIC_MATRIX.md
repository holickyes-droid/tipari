# WIREFRAME LOGIC MATRIX – TIPARI.CZ
**Deterministic UI Response Specification**

**Document Type:** Screen × Entity × State × Action → UI Response
**Date:** 2025-01-01
**Status:** Definitive UX Logic Layer

---

## DOCUMENT PURPOSE

This matrix defines EXACTLY what happens in the UI for every possible combination of:
- **Screen** – Where user is
- **Entity** – What they're viewing
- **State** – Current state of that entity
- **User Intent** – What they want to do
- **Allowed Action** – Whether action is permitted
- **UI Response** – What UI shows/does
- **System Side Effect** – What changes in backend
- **Next State** – What state entity transitions to

**Goal:** Zero ambiguity. Developers and designers can implement deterministically.

**Format:** Tables with explicit logic rules.

---

## MATRIX STRUCTURE

Each section covers one screen or screen group.

**Columns:**
1. **Entity** – Which entity's state matters
2. **Current State** – Entity's current state
3. **User Intent** – What user wants to do
4. **Allowed?** – Yes/No
5. **UI Response** – What UI shows/enables/disables
6. **Blocking Reason** – If No, why not
7. **System Side Effect** – What backend does
8. **Next State** – Entity's new state
9. **SLA Impact** – Does this affect SLA?
10. **Commission Impact** – Does this affect commission?

---

## SECTION 1: PROJECT LIST SCREEN

### 1.1 PROJECT LIST – PROJECT ENTITY

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| PENDING_APPROVAL | View in list | ❌ No | Project not shown in public list | Not approved yet | None | No change | N/A | N/A |
| APPROVED | View in list | ❌ No | Project not shown (transitional state) | Will become OPEN immediately | None | No change | N/A | N/A |
| OPEN | View in list | ✅ Yes | Project card shown with green "Aktivní" badge | N/A | None | No change | N/A | N/A |
| OPEN | Click "Zobrazit detail" | ✅ Yes | Navigate to Project Detail screen | N/A | None | No change | N/A | N/A |
| PAUSED | View in list | ✅ Yes | Project card shown with blue "Pozastaveno" badge | N/A | None | No change | N/A | N/A |
| PAUSED | Click "Zobrazit detail" | ✅ Yes | Navigate to Project Detail (read-only mode) | N/A | None | No change | N/A | N/A |
| LAST_SLOTS | View in list | ✅ Yes | Project card shown with orange "Poslední sloty" badge | N/A | None | No change | N/A | N/A |
| LAST_SLOTS | Click "Zobrazit detail" | ✅ Yes | Navigate to Project Detail (reservations enabled) | N/A | None | No change | N/A | N/A |
| FULLY_RESERVED | View in list | Toggle | Project card shown only if "Show closed" = ON, gray badge | User filter preference | None | No change | N/A | N/A |
| FULLY_RESERVED | Click "Zobrazit detail" | ✅ Yes | Navigate to Project Detail (historical view) | N/A | None | No change | N/A | N/A |
| FINISHED | View in list | Toggle | Project card shown only if "Show closed" = ON, dark gray badge | User filter preference | None | No change | N/A | N/A |
| FINISHED | Click "Zobrazit detail" | ✅ Yes | Navigate to Project Detail (archival view) | N/A | None | No change | N/A | N/A |
| REJECTED | View in list | ❌ No | Project not shown in public list | Not approved | None | No change | N/A | N/A |
| WITHDRAWN | View in list | ❌ No | Project not shown in public list | Withdrawn by partner/admin | None | No change | N/A | N/A |

---

## SECTION 2: PROJECT DETAIL SCREEN

### 2.1 PROJECT DETAIL – PROJECT ENTITY

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| OPEN | View details | ✅ Yes | Full project info shown, all sections enabled | N/A | None | No change | N/A | N/A |
| OPEN | View tickets table | ✅ Yes | Tickets table shown, "Rezervovat" enabled per ticket state | N/A | None | No change | N/A | N/A |
| OPEN | Download document (if AVAILABLE) | ✅ Yes | Document download initiated | N/A | Log download event | No change | N/A | N/A |
| OPEN | Click "Rezervovat" on ticket | Check | Opens Reservation Modal IF ticket allows | See ticket state check | None (modal only) | No change | N/A | N/A |
| PAUSED | View details | ✅ Yes | Full project info shown, pause message displayed | N/A | None | No change | N/A | N/A |
| PAUSED | View tickets table | ✅ Yes | Tickets table shown (read-only), "Rezervovat" disabled ALL tickets | N/A | None | No change | N/A | N/A |
| PAUSED | Click "Rezervovat" | ❌ No | Button disabled with tooltip: "Projekt je pozastaven – nové rezervace nejsou možné" | Project paused by admin/partner | None | No change | N/A | N/A |
| LAST_SLOTS | View details | ✅ Yes | Full project info shown, factual indicator: "Zbývá méně než 20% kapacity" | N/A | None | No change | N/A | N/A |
| LAST_SLOTS | Click "Rezervovat" on ticket | Check | Opens Reservation Modal IF ticket allows | See ticket state check | None (modal only) | No change | N/A | N/A |
| FULLY_RESERVED | View details | ✅ Yes | Historical project info shown, all tickets marked as filled | N/A | None | No change | N/A | N/A |
| FULLY_RESERVED | Click "Rezervovat" | ❌ No | Button disabled with tooltip: "Projekt je plně obsazen" | No capacity | None | No change | N/A | N/A |
| FINISHED | View details | ✅ Yes | Archival project info shown, completion date and outcome visible | N/A | None | No change | N/A | N/A |
| FINISHED | Click "Rezervovat" | ❌ No | Button disabled with tooltip: "Projekt je dokončen" | Lifecycle ended | None | No change | N/A | N/A |

### 2.2 PROJECT DETAIL – TICKET ENTITY

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| AVAILABLE | View in table | ✅ Yes | Row shown with green indicator, occupancy "0 / X slotů", "Rezervovat" enabled | N/A | None | No change | N/A | N/A |
| AVAILABLE | Click "Rezervovat" | Check | Opens Reservation Modal → Checks global slots, per-ticket limit | See modal logic | None yet | No change | N/A | N/A |
| PARTIALLY_FILLED | View in table | ✅ Yes | Row shown with yellow indicator, occupancy "Y / X slotů", "Rezervovat" enabled | N/A | None | No change | N/A | N/A |
| PARTIALLY_FILLED | Click "Rezervovat" | Check | Opens Reservation Modal → Checks capacity remaining | See modal logic | None yet | No change | N/A | N/A |
| LAST_CAPACITY | View in table | ✅ Yes | Row shown with orange indicator, occupancy shows < 20% remaining, "Rezervovat" enabled | N/A | None | No change | N/A | N/A |
| LAST_CAPACITY | Click "Rezervovat" | Check | Opens Reservation Modal → Checks final capacity | See modal logic | None yet | No change | N/A | N/A |
| FULLY_FILLED | View in table | ✅ Yes | Row shown with gray indicator, occupancy "X / X slotů", "Rezervovat" disabled | N/A | None | No change | N/A | N/A |
| FULLY_FILLED | Click "Rezervovat" | ❌ No | Button disabled with tooltip: "Tiket je plně obsazen" | No capacity | None | No change | N/A | N/A |
| CLOSED | View in table | ✅ Yes | Row shown with gray indicator, "Uzavřeno administrátorem", "Rezervovat" disabled | N/A | None | No change | N/A | N/A |
| CLOSED | Click "Rezervovat" | ❌ No | Button disabled with tooltip: "Tiket byl uzavřen administrátorem [reason]" | Admin closed | None | No change | N/A | N/A |

### 2.3 PROJECT DETAIL – DOCUMENT ENTITY

| Document State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|----------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| AVAILABLE | Download | ✅ Yes | File download initiated, download icon clickable | N/A | Log download (user ID, timestamp) | No change | No | No |
| AVAILABLE | View in modal | ✅ Yes | PDF Viewer Modal opens with document | N/A | Log view event | No change | No | No |
| PENDING | Download | ❌ No | Download icon grayed out, tooltip: "Dokument se připravuje" | Not ready yet | None | No change | No | No |
| PENDING | View expected date | ✅ Yes | Show "Očekávaná dostupnost: [date]" if known | N/A | None | No change | No | No |
| NOT_AVAILABLE | Download | ❌ No | Download icon grayed out, tooltip: "Dokument není k dispozici" | Not uploaded | None | No change | No | No |
| NOT_AVAILABLE | Request upload | ❌ No | No action available to Tipař (admin/partner only) | No permission | None | No change | No | No |

---

## SECTION 3: RESERVATION CREATION MODAL

### 3.1 RESERVATION MODAL – SLOT AVAILABILITY CHECKS

| Check Type | Condition | Result | UI Response | Blocking? | Error Message |
|------------|-----------|--------|-------------|-----------|---------------|
| Global Slots | remainingSlots > 0 | PASS | Show: "Zbývající sloty: X / Y", proceed to next check | ❌ No | N/A |
| Global Slots | remainingSlots = 0 | FAIL | Show: "Nemáte volné sloty", disable "Potvrdit" button | ✅ Yes | "Nemáte volné sloty pro vytvoření rezervace. Musíte počkat na uvolnění slotu." |
| Per-Ticket Limit | currentReservationsOnTicket < 3 | PASS | Show: "Vaše rezervace na tento tiket: X / 3", proceed | ❌ No | N/A |
| Per-Ticket Limit | currentReservationsOnTicket = 3 | FAIL | Show: "Vaše rezervace na tento tiket: 3 / 3", disable "Potvrdit" | ✅ Yes | "Překročen limit 3 rezervací na jeden tiket." |
| Ticket Capacity | ticketAvailableCapacity > 0 | PASS | Show: "Dostupná kapacita: X / Y slotů", proceed | ❌ No | N/A |
| Ticket Capacity | ticketAvailableCapacity = 0 | FAIL | Show: "Dostupná kapacita: 0 / Y slotů", disable "Potvrdit" | ✅ Yes | "Tiket je plně obsazen." |
| Project State | projectState = OPEN OR LAST_SLOTS | PASS | Modal opens normally | ❌ No | N/A |
| Project State | projectState = PAUSED | FAIL | Modal doesn't open, show error on detail screen | ✅ Yes | "Projekt je pozastaven – nové rezervace nejsou možné." |
| Project State | projectState = FULLY_RESERVED | FAIL | Modal doesn't open, show error | ✅ Yes | "Projekt je plně rezervován." |
| Investor Selected | investorId != null | PASS | "Potvrdit" button enabled (if all other checks pass) | ❌ No | N/A |
| Investor Selected | investorId = null | FAIL | "Potvrdit" button disabled, prompt to select investor | ✅ Yes | "Vyberte investora před potvrzením rezervace." |

### 3.2 RESERVATION MODAL – CREATION FLOW

| Modal State | User Intent | Allowed? | UI Response | System Side Effect | Next State (Reservation) | Next State (Ticket) | SLA Impact | Commission Impact |
|-------------|-------------|----------|-------------|--------------------|----------------------|-------------------|------------|------------------|
| READY | Select investor | ✅ Yes | Investor highlighted in list, commission recalculated for selected investor | None yet | N/A | No change | N/A | N/A |
| READY | Adjust slot quantity | Conditional | Quantity selector enabled if multiple slots available AND capacity allows | None yet | N/A | No change | N/A | N/A |
| READY | View commission estimate | ✅ Yes | Show calculated commission: "[rate]% × [amount] = [commission] Kč" | None yet | N/A | No change | N/A | N/A |
| READY | View SLA info | ✅ Yes | Show: "Po vytvoření rezervace máte [X] hodin na následující krok" | None yet | N/A | No change | N/A | N/A |
| READY | Click "Potvrdit rezervaci" | ✅ Yes (if all checks pass) | Modal state → LOADING, show spinner | Create reservation record | PENDING_APPROVAL | See below | ✅ Yes (SLA starts) | ✅ Yes (commission EXPECTED created) |
| LOADING | Wait for API | N/A | Show spinner, disable all inputs, show "Vytváří se rezervace..." | Backend processing | N/A | N/A | N/A | N/A |
| SUCCESS | View confirmation | ✅ Yes | Modal state → SUCCESS, show success message + reservation number | Reservation created | PENDING_APPROVAL | Update occupancy | SLA started | Commission EXPECTED |
| ERROR | Retry | ✅ Yes | Modal state → ERROR, show error message + reason, "Zkusit znovu" button | None | N/A | No change | N/A | N/A |
| ERROR | Cancel | ✅ Yes | Close modal, return to project detail | None | N/A | No change | N/A | N/A |

### 3.3 RESERVATION MODAL – TICKET STATE TRANSITIONS (On Success)

| Ticket Before | Reservations Before | Reservations After | Capacity Check | Ticket After | UI Update |
|---------------|---------------------|-------------------|----------------|--------------|-----------|
| AVAILABLE | 0 active/pending | 1 active/pending | capacity > 80% free | PARTIALLY_FILLED | Badge color yellow, occupancy updated |
| AVAILABLE | 0 active/pending | 1 active/pending | capacity ≤ 20% free | LAST_CAPACITY | Badge color orange, occupancy updated |
| PARTIALLY_FILLED | X active/pending | X+1 active/pending | capacity > 20% free | PARTIALLY_FILLED | Occupancy count incremented |
| PARTIALLY_FILLED | X active/pending | X+1 active/pending | capacity ≤ 20% free | LAST_CAPACITY | Badge color → orange, occupancy updated |
| LAST_CAPACITY | Y active/pending | Y+1 active/pending | capacity > 0 | LAST_CAPACITY | Occupancy count incremented |
| LAST_CAPACITY | Y active/pending | Y+1 active/pending | capacity = 0 | FULLY_FILLED | Badge color → gray, "Rezervovat" disabled |

### 3.4 RESERVATION MODAL – PROJECT STATE TRANSITIONS (On Success)

| Project Before | Total Available Tickets Before | Total Available After | Project After | UI Update |
|----------------|-------------------------------|----------------------|---------------|-----------|
| OPEN | > 20% | > 20% | OPEN | No visual change |
| OPEN | > 20% | ≤ 20% but > 0 | LAST_SLOTS | Badge → orange "Poslední sloty" |
| OPEN | > 0 | = 0 | FULLY_RESERVED | Badge → gray "Plně rezervováno", no new reservations |
| LAST_SLOTS | > 0 | > 0 | LAST_SLOTS | Occupancy updated |
| LAST_SLOTS | > 0 | = 0 | FULLY_RESERVED | Badge → gray, all tickets filled |

---

## SECTION 4: RESERVATION DETAIL MODAL

### 4.1 RESERVATION DETAIL – PHASE-SPECIFIC UI

| Phase | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|-------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| PENDING_APPROVAL | View details | ✅ Yes | Show: Reservation number, created date, "Čeká na schválení", SLA countdown, investor name HIDDEN | N/A | None | No change | Display SLA | Display EXPECTED commission |
| PENDING_APPROVAL | Cancel reservation | ✅ Yes | Show confirmation dialog: "Opravdu chcete zrušit?" → If yes, reservation → CANCELLED | N/A | Release slot, commission → LOST, log cancellation | CANCELLED | SLA stopped | Commission → LOST |
| PENDING_APPROVAL | View investor identity | ❌ No | Investor field shows "Přiřazený investor" (name hidden) | Not revealed until phase 5 | None | No change | N/A | N/A |
| WAITING_INVESTOR_SIGNATURE | View details | ✅ Yes | Show: RA sent date, "Čeká na podpis investora", SLA countdown, investor name HIDDEN | N/A | None | No change | Display SLA | Display EXPECTED commission |
| WAITING_INVESTOR_SIGNATURE | View RA document | ✅ Yes (if uploaded) | Show document link, open PDF Viewer Modal | N/A | Log view event | No change | No | No |
| WAITING_INVESTOR_SIGNATURE | Cancel reservation | ✅ Yes | Show confirmation dialog → If yes, reservation → CANCELLED | N/A | Release slot, commission → LOST, log cancellation | CANCELLED | SLA stopped | Commission → LOST |
| WAITING_INVESTOR_SIGNATURE | Sign RA | ❌ No | No action available (investor signs offline, admin logs) | No permission | None | No change | N/A | N/A |
| WAITING_DEVELOPER_DECISION | View details | ✅ Yes | Show: Investor signed date, "Čeká na rozhodnutí partnera", SLA countdown, investor name HIDDEN | N/A | None | No change | Display SLA | Display EXPECTED commission |
| WAITING_DEVELOPER_DECISION | View signed RA | ✅ Yes (if uploaded) | Show document link with signature indicator | N/A | Log view event | No change | No | No |
| WAITING_DEVELOPER_DECISION | Cancel reservation | ✅ Yes | Show confirmation dialog → If yes, reservation → CANCELLED | N/A | Release slot, commission → LOST, log cancellation | CANCELLED | SLA stopped | Commission → LOST |
| WAITING_DEVELOPER_DECISION | Approve/reject | ❌ No | No action available (partner decides via admin) | No permission | None | No change | N/A | N/A |
| WAITING_MEETING_SELECTION | View details | ✅ Yes | Show: Partner approved date, proposed meeting dates list, SLA countdown, investor name HIDDEN | N/A | None | No change | Display SLA | Display EXPECTED commission |
| WAITING_MEETING_SELECTION | View proposed dates | ✅ Yes | Show list of dates proposed by partner | N/A | None | No change | No | No |
| WAITING_MEETING_SELECTION | Cancel reservation | ✅ Yes | Show confirmation dialog → If yes, reservation → CANCELLED | N/A | Release slot, commission → LOST, log cancellation | CANCELLED | SLA stopped | Commission → LOST |
| WAITING_MEETING_SELECTION | Select meeting date | ❌ No | No action available (investor selects offline, admin logs) | No permission | None | No change | N/A | N/A |
| MEETING_CONFIRMED | View details | ✅ Yes | Show: Meeting confirmed date, selected date/time/location, **investor name REVEALED**, next step: "Schůzka potvrzena" | N/A | None | No change | No countdown (awaiting meeting) | Display EXPECTED commission |
| MEETING_CONFIRMED | View investor identity | ✅ Yes | Investor full name + contact info shown (revealed only in this phase) | N/A | None | No change | N/A | N/A |
| MEETING_CONFIRMED | View meeting details | ✅ Yes | Show: Date, time, location, meeting confirmation document | N/A | Log view event | No change | No | No |
| MEETING_CONFIRMED | Download meeting confirmation | ✅ Yes | PDF download with meeting details | N/A | Log download | No change | No | No |
| MEETING_CONFIRMED | Cancel reservation | ✅ Yes (rare) | Show warning dialog: "Schůzka je potvrzena, zrušení vyžaduje důvod" → If yes, require reason | N/A | Release slot, commission → LOST, notify partner/investor, log cancellation + reason | CANCELLED | SLA stopped | Commission → LOST |
| MEETING_COMPLETED | View details | ✅ Yes | Show: Meeting completed date, outcome notes (if any), SLA countdown for closure, investor name REVEALED | N/A | None | No change | Display SLA (closure deadline) | Display EXPECTED commission |
| MEETING_COMPLETED | View outcome notes | ✅ Yes | Show admin/partner notes about meeting outcome | N/A | None | No change | No | No |
| MEETING_COMPLETED | Mark as SUCCESS/NO_DEAL | ❌ No | No action available (admin only, after investment agreement) | No permission | None | No change | N/A | N/A |
| SUCCESS | View details | ✅ Yes | Show: Closed date, investment agreement link, earned commission indicator, terminal badge "Úspěšně uzavřeno", investor name REVEALED | N/A | None | No change (terminal) | SLA ended | Commission → EARNED |
| SUCCESS | View investment agreement | ✅ Yes | Show document link, open PDF Viewer Modal | N/A | Log view event | No change | No | No |
| SUCCESS | Download all documents | ✅ Yes | Bulk download all reservation documents | N/A | Log download | No change | No | No |
| SUCCESS | Revive/edit | ❌ No | No actions available (terminal state, immutable) | Terminal state | None | No change | N/A | N/A |
| NO_DEAL | View details | ✅ Yes | Show: Closed date, closure reason, lost commission indicator, terminal badge "Nedohodnutý obchod", investor name REVEALED (if reached phase 5) | N/A | None | No change (terminal) | SLA ended | Commission → LOST |
| NO_DEAL | View closure reason | ✅ Yes | Show admin/partner notes explaining why no deal | N/A | None | No change | No | No |
| NO_DEAL | Revive/edit | ❌ No | No actions available (terminal state, immutable) | Terminal state | None | No change | N/A | N/A |
| EXPIRED | View details | ✅ Yes | Show: Expiry date, which phase expired, SLA violation logged, slot released, terminal badge "Expirováno", investor name HIDDEN (unless was in phase 5+) | N/A | None | No change (terminal) | SLA violated | Commission → LOST |
| EXPIRED | View expiry log | ✅ Yes | Show: "Rezervace expirovala [date] ve fázi [phase]. SLA: [deadline]" | N/A | None | No change | No | No |
| EXPIRED | Revive/edit | ❌ No | No actions available (terminal state, cannot revive) | Terminal state, SLA violated | None | No change | N/A | N/A |
| CANCELLED | View details | ✅ Yes | Show: Cancellation date, who cancelled, reason, slot released, terminal badge "Zrušeno", investor name as per phase when cancelled | N/A | None | No change (terminal) | SLA stopped | Commission → LOST |
| CANCELLED | View cancellation log | ✅ Yes | Show: "Zrušeno [date] uživatelem [name]. Důvod: [reason]" | N/A | None | No change | No | No |
| CANCELLED | Revive/edit | ❌ No | No actions available (terminal state, immutable) | Terminal state | None | No change | N/A | N/A |

### 4.2 RESERVATION DETAIL – TIMELINE COMPONENT

| Phase | Timeline UI | Icon | Status | Timestamp Shown | Next Actor Label |
|-------|-------------|------|--------|----------------|------------------|
| PENDING_APPROVAL | Phase 1 highlighted, phases 2-6 grayed out | Clock | Current | Created: [date] | "Administrátor" |
| WAITING_INVESTOR_SIGNATURE | Phase 2 highlighted, phase 1 checked, phases 3-6 grayed | Document | Current | Sent: [date] | "Investor" |
| WAITING_DEVELOPER_DECISION | Phase 3 highlighted, phases 1-2 checked, phases 4-6 grayed | Building | Current | Signed: [date] | "Partner" |
| WAITING_MEETING_SELECTION | Phase 4 highlighted, phases 1-3 checked, phases 5-6 grayed | Calendar | Current | Approved: [date] | "Investor" |
| MEETING_CONFIRMED | Phase 5 highlighted, phases 1-4 checked, phase 6 grayed | CheckCircle | Current (ACTIVE) | Confirmed: [date] | "Nikdo (čeká se na termín)" |
| MEETING_COMPLETED | Phase 6 highlighted, phases 1-5 checked | FileCheck | Current | Completed: [date] | "Administrátor" |
| SUCCESS | Phase 6 checked with success indicator | CheckCircle2 | Terminal | Closed: [date] | "—" |
| NO_DEAL | Phase 6 checked with close indicator | XCircle | Terminal | Closed: [date] | "—" |
| EXPIRED | Current phase crossed out | AlertCircle | Terminal | Expired: [date] | "—" |
| CANCELLED | Current phase crossed out | Ban | Terminal | Cancelled: [date] | "—" |

---

## SECTION 5: COMMISSION PAGES

### 5.1 COMMISSION OVERVIEW – COMMISSION ENTITY

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| EXPECTED | View in table | ✅ Yes | Row shown with blue badge "Očekávaná", amount shown, linked reservation phase shown | N/A | None | No change | No | No |
| EXPECTED | Click to view detail | ✅ Yes | Navigate to Commission Detail screen, show linked reservation timeline | N/A | None | No change | No | No |
| EXPECTED | Submit invoice | ❌ No | No action available (commission not earned yet) | Not EARNED | None | No change | No | No |
| EARNED | View in table | ✅ Yes | Row shown with green badge "Zasloužená", amount shown, earned date shown | N/A | None | No change | No | No |
| EARNED | Click to view detail | ✅ Yes | Navigate to Commission Detail, show "Připravte fakturu" | N/A | None | No change | No | No |
| EARNED | Submit invoice | ✅ Yes | Show invoice upload form OR mark invoice submitted | N/A | Create invoice record, notify admin | PENDING_PAYMENT | No | No |
| PENDING_PAYMENT | View in table | ✅ Yes | Row shown with orange badge "Čeká na vyplacení", invoice number shown, expected payment date shown | N/A | None | No change | No | No |
| PENDING_PAYMENT | Click to view detail | ✅ Yes | Navigate to Commission Detail, show invoice status and payment tracking | N/A | None | No change | No | No |
| PENDING_PAYMENT | Cancel invoice | ❌ No | No action available (admin handles payment) | No permission | None | No change | No | No |
| PAID | View in table | ✅ Yes | Row shown with green badge "Vyplaceno", amount shown, paid date shown, payment reference shown | N/A | None | No change (terminal) | No | No |
| PAID | Click to view detail | ✅ Yes | Navigate to Commission Detail, show full payment history | N/A | None | No change | No | No |
| PAID | Download payment confirmation | ✅ Yes | PDF download with payment details | N/A | Log download | No change | No | No |
| LOST | View in table | ✅ Yes | Row shown with gray badge "Propadlá", amount 0 or strikethrough, reason shown | N/A | None | No change (terminal) | No | No |
| LOST | Click to view detail | ✅ Yes | Navigate to Commission Detail, show why commission was lost (linked reservation NO_DEAL/EXPIRED/CANCELLED) | N/A | None | No change | No | No |
| LOST | Revive commission | ❌ No | No action available (terminal state) | Terminal state | None | No change | No | No |

### 5.2 COMMISSION DETAIL – STATE-SPECIFIC ACTIONS

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| EXPECTED | View linked reservation | ✅ Yes | Show reservation timeline, current phase, next step | N/A | None | No change | No | No |
| EXPECTED | View commission calculation | ✅ Yes | Show: "[rate]% × [investment amount] = [commission] Kč" | N/A | None | No change | No | No |
| EXPECTED | View expected date | ✅ Yes | Show: "Očekávaná provize – závisí na průběhu rezervace" | N/A | None | No change | No | No |
| EARNED | View earned date | ✅ Yes | Show: "Provize zasloužena [date] – rezervace úspěšně uzavřena" | N/A | None | No change | No | No |
| EARNED | Submit invoice | ✅ Yes | Show invoice form: invoice number, date, amount (pre-filled) → Submit | N/A | Create invoice record, commission → PENDING_PAYMENT, notify admin | PENDING_PAYMENT | No | No |
| EARNED | Download commission statement | ✅ Yes | PDF download with commission details and calculation | N/A | Log download | No change | No | No |
| PENDING_PAYMENT | View invoice status | ✅ Yes | Show: "Faktura odeslána [date], číslo: [invoice number]" | N/A | None | No change | No | No |
| PENDING_PAYMENT | View expected payment date | ✅ Yes | Show: "Očekávaná platba: [date]" (if admin set) | N/A | None | No change | No | No |
| PENDING_PAYMENT | Contact admin about payment | ✅ Yes | Show support link/email | N/A | None | No change | No | No |
| PENDING_PAYMENT | Cancel invoice | ❌ No | No action available (admin processes payment) | No permission | None | No change | No | No |
| PAID | View payment details | ✅ Yes | Show: "Vyplaceno [date], reference: [payment ref], faktura: [invoice number]" | N/A | None | No change | No | No |
| PAID | Download payment confirmation | ✅ Yes | PDF download with payment proof | N/A | Log download | No change | No | No |
| PAID | View complete history | ✅ Yes | Show full timeline: EXPECTED → EARNED → PENDING → PAID | N/A | None | No change | No | No |
| LOST | View loss reason | ✅ Yes | Show: "Provize propadla – důvod: [reservation state]" | N/A | None | No change | No | No |
| LOST | View linked reservation | ✅ Yes | Show reservation detail (terminal state: NO_DEAL/EXPIRED/CANCELLED) | N/A | None | No change | No | No |

---

## SECTION 6: INVESTOR PAGES

### 6.1 INVESTORS LIST – INVESTOR ENTITY

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| ACTIVE | View in table | ✅ Yes | Row shown with green badge "Aktivní", capacity shown, active reservations count shown | N/A | None | No change | No | No |
| ACTIVE | Click to view detail | ✅ Yes | Navigate to Investor Detail screen | N/A | None | No change | No | No |
| ACTIVE | Contact investor | ✅ Yes | Email link opens (mailto:) | N/A | None | No change | No | No |
| PROSPECT | View in table | ✅ Yes | Row shown with blue badge "Prospekt", capacity shown, no active reservations | N/A | None | No change | No | No |
| PROSPECT | Click to view detail | ✅ Yes | Navigate to Investor Detail screen | N/A | None | No change | No | No |
| INACTIVE | View in table | ✅ Yes | Row shown with gray badge "Neaktivní", capacity shown (may be 0), last contact date shown | N/A | None | No change | No | No |
| INACTIVE | Click to view detail | ✅ Yes | Navigate to Investor Detail screen (historical view) | N/A | None | No change | No | No |
| DORMANT | View in table | ✅ Yes | Row shown with light gray badge "Pasivní", no recent activity | N/A | None | No change | No | No |
| DORMANT | Click to view detail | ✅ Yes | Navigate to Investor Detail screen (historical view) | N/A | None | No change | No | No |

### 6.2 INVESTOR DETAIL – INVESTOR ENTITY

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| ACTIVE | View profile | ✅ Yes | Show: Name, type, status badge, contact info, investment preferences, capacity | N/A | None | No change | No | No |
| ACTIVE | View reservation history | ✅ Yes | Show: Active reservations (phase 5), pending reservations (phases 1-4), completed reservations (phases 6+) | N/A | None | No change | No | No |
| ACTIVE | View client matches | ✅ Yes | Show: Recommended projects based on preferences, match percentage, CTA "Rezervovat" | N/A | None | No change | No | No |
| ACTIVE | Click "Rezervovat" on match | ✅ Yes | Navigate to Project Detail with investor context pre-selected | N/A | None | No change | No | No |
| ACTIVE | Add internal notes | ✅ Yes (if implemented) | Show notes editor, save notes (internal only, never exposed to investor) | N/A | Save notes to investor record | No change | No | No |
| PROSPECT | View profile | ✅ Yes | Show: Name, type, status badge, capacity (potential), no active reservations | N/A | None | No change | No | No |
| PROSPECT | View client matches | ✅ Yes | Show: Recommended projects to pitch to prospect | N/A | None | No change | No | No |
| INACTIVE | View profile | ✅ Yes | Show: Name, type, status badge, last contact date, reason for inactivity (if noted) | N/A | None | No change | No | No |
| INACTIVE | View historical reservations | ✅ Yes | Show: Past completed/cancelled reservations | N/A | None | No change | No | No |
| DORMANT | View profile | ✅ Yes | Show: Name, type, status badge, no recent activity indicator | N/A | None | No change | No | No |

---

## SECTION 7: MY PROJECTS SCREENS

### 7.1 MY PROJECTS LIST – PROJECT ENTITY (Tipař-Originated)

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| PENDING_APPROVAL | View in table | ✅ Yes | Row shown with blue badge "Čeká na schválení", submission date shown | N/A | None | No change | No | No |
| PENDING_APPROVAL | Click to view detail | ✅ Yes | Navigate to My Project Detail, show admin review status | N/A | None | No change | No | No |
| PENDING_APPROVAL | Edit project | ❌ No | No edit action (admin reviewing, immutable) | Under review | None | No change | No | No |
| APPROVED | View in table | ✅ Yes | Row shown with green badge "Schváleno", approval date shown, will become OPEN soon | N/A | None | No change | No | No |
| APPROVED | Click to view detail | ✅ Yes | Navigate to My Project Detail, show admin notes | N/A | None | No change | No | No |
| OPEN | View in table | ✅ Yes | Row shown with green badge "Aktivní", tickets count, reservations count, commissions shown | N/A | None | No change | No | No |
| OPEN | Click to view detail | ✅ Yes | Navigate to My Project Detail, show full project + commission tracking | N/A | None | No change | No | No |
| REJECTED | View in table | ✅ Yes | Row shown with red badge "Zamítnuto", rejection date shown, reason preview shown | N/A | None | No change (terminal) | No | No |
| REJECTED | Click to view detail | ✅ Yes | Navigate to My Project Detail, show full rejection reason + feedback | N/A | None | No change | No | No |
| REJECTED | Resubmit | ✅ Yes | CTA: "Navrhnout upravený projekt" → Navigate to Project Submission Form (new submission, not edit) | N/A | None (new project created separately) | No change (this project stays REJECTED) | No | No |
| WITHDRAWN | View in table | ✅ Yes | Row shown with gray badge "Staženo", withdrawal date and reason shown | N/A | None | No change (terminal) | No | No |

### 7.2 MY PROJECT DETAIL – PROJECT ENTITY (Tipař-Originated)

| Current State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| PENDING_APPROVAL | View submission details | ✅ Yes | Show: All submitted data, documents uploaded, submission date, admin review SLA (if exists) | N/A | None | No change | Admin review SLA | No |
| PENDING_APPROVAL | Edit submission | ❌ No | No edit mode (admin reviewing) | Under review | None | No change | No | No |
| PENDING_APPROVAL | Withdraw submission | ❌ No | No withdraw action (not implemented) | Not implemented | None | No change | No | No |
| REJECTED | View rejection details | ✅ Yes | Show: Rejection date, admin notes, what needs improvement, suggestions | N/A | None | No change | No | No |
| REJECTED | Create new submission | ✅ Yes | CTA: "Navrhnout upravený projekt" → Navigate to submission form | N/A | None | No change (this stays REJECTED) | No | No |
| APPROVED | View approval details | ✅ Yes | Show: Approval date, admin notes, "Projekt bude brzy aktivní" | N/A | None | No change | No | No |
| APPROVED | Wait for publish | N/A | No action (admin will publish to OPEN) | Admin action pending | None | No change | No | No |
| OPEN | View full project detail | ✅ Yes | Show: All project info, tickets, reservations, activity log, "Originated by you" badge | N/A | None | No change | No | Track project commission |
| OPEN | Monitor reservations | ✅ Yes | Show: All reservations on this project (from all Tipaři), phases, SLAs | N/A | None | No change | No | No |
| OPEN | Track commissions | ✅ Yes | Show: Project origination commission (your earnings), accrual per reservation | N/A | None | No change | No | Display commission |
| FINISHED | View archival data | ✅ Yes | Show: Completion date, final outcome, total commissions earned, all reservations closed | N/A | None | No change | No | Display final commission |

### 7.3 PROJECT SUBMISSION FORM

| Form State | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State (Project) | SLA Impact | Commission Impact |
|------------|-------------|----------|-------------|-----------------|-------------------|-------------------|------------|------------------|
| Empty | Fill fields | ✅ Yes | Form inputs enabled, validation on blur | N/A | None | N/A | No | No |
| Partial | Submit | ❌ No | "Potvrdit" button disabled, show required fields highlighted | Missing required fields | None | N/A | No | No |
| Complete (valid) | Preview | ✅ Yes | Show preview of submission (optional) | N/A | None | N/A | No | No |
| Complete (valid) | Submit | ✅ Yes | Show confirmation dialog: "Opravdu chcete odeslat projekt ke schválení?" → If yes, submit | N/A | Create project record, state = PENDING_APPROVAL, notify admin | PENDING_APPROVAL | Admin review SLA starts | No (commission only after approval + reservations) |
| Submitted | Edit | ❌ No | Form is cleared after submission, cannot edit (must wait for admin feedback) | Already submitted | None | N/A | No | No |

---

## SECTION 8: ACTIVITIES & MONITORING

### 8.1 ACTIVITIES OVERVIEW – ACTIVITY LOG

| Activity Type | User Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|-------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| Reservation created | View activity | ✅ Yes | Show: "Rezervace vytvořena – [project name] / [ticket]" with timestamp | N/A | None | No change | No | No |
| Reservation phase transition | View activity | ✅ Yes | Show: "Rezervace [ID] – [old phase] → [new phase]" with timestamp | N/A | None | No change | No | No |
| Reservation expired | View activity | ✅ Yes | Show: "Rezervace [ID] expirovala – [phase]" with timestamp | N/A | None | No change | No | No |
| Project submitted | View activity | ✅ Yes | Show: "Projekt odeslán ke schválení – [project name]" with timestamp | N/A | None | No change | No | No |
| Project approved | View activity | ✅ Yes | Show: "Projekt schválen – [project name]" with timestamp | N/A | None | No change | No | No |
| Project rejected | View activity | ✅ Yes | Show: "Projekt zamítnut – [project name] – [reason preview]" with timestamp | N/A | None | No change | No | No |
| Commission earned | View activity | ✅ Yes | Show: "Provize zasloužena – [amount] Kč – [reservation ID]" with timestamp | N/A | None | No change | No | No |
| Commission paid | View activity | ✅ Yes | Show: "Provize vyplacena – [amount] Kč – [payment ref]" with timestamp | N/A | None | No change | No | No |
| Admin override | View activity | ✅ Yes | Show: "Změněno administrátorem – [entity] – [what changed]" with timestamp + reason | N/A | None | No change | No | No |
| SLA warning | View activity | ✅ Yes | Show: "SLA upozornění – Rezervace [ID] vyprší za [X] hodin" with timestamp | N/A | None | No change | Display warning | No |
| Any activity | Click to view entity | ✅ Yes | Navigate to related entity detail (project/reservation/commission) | N/A | None | No change | No | No |
| Any activity | Delete activity | ❌ No | No action (immutable log) | Audit requirement | None | No change | No | No |

---

## SECTION 9: ADMIN SCREENS (Logical Only)

### 9.1 ADMIN DASHBOARD – AGGREGATED VIEW

| Metric | User Intent | Allowed? | UI Response | Admin Action | System Side Effect | Next State | SLA Impact | Commission Impact |
|--------|-------------|----------|-------------|--------------|-------------------|------------|------------|------------------|
| Projects PENDING_APPROVAL | View count | ✅ Yes | Show count + list preview, link to approval queue | N/A | None | No change | No | No |
| Projects PENDING_APPROVAL | Click to review | ✅ Yes | Navigate to Project Approval Queue | N/A | None | No change | No | No |
| SLA violations | View count | ✅ Yes | Show count of expired reservations in last 24h, alert styling | N/A | None | No change | Alert shown | No |
| SLA violations | Click to view | ✅ Yes | Navigate to filtered reservation list (state = EXPIRED) | N/A | None | No change | No | No |

### 9.2 PROJECT APPROVAL QUEUE – PROJECT ENTITY

| Current State | Admin Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|--------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| PENDING_APPROVAL | Review submission | ✅ Yes | Show full project details, documents, Tipař info | N/A | None | No change | No | No |
| PENDING_APPROVAL | Approve project | ✅ Yes | Show confirmation: "Schválit projekt?" → If yes, project → APPROVED → admin can publish to OPEN | N/A | Project → APPROVED, notify Tipař, log approval | APPROVED (then OPEN) | Admin review SLA met | No (commission later) |
| PENDING_APPROVAL | Reject project | ✅ Yes | Show form: "Důvod zamítnutí:" (required) → If submitted, project → REJECTED | N/A | Project → REJECTED, notify Tipař with reason, log rejection | REJECTED (terminal) | Admin review SLA met | No |
| PENDING_APPROVAL | Request changes | ✅ Yes | Show form: "Zpětná vazba pro tipaře:" → Send feedback, keep state PENDING | N/A | Send feedback to Tipař, log feedback event, state stays PENDING | No change | Admin review SLA extended | No |
| APPROVED | Publish to OPEN | ✅ Yes | CTA: "Publikovat projekt" → If clicked, project → OPEN | N/A | Project → OPEN, notify all Tipaři (if relevant), log publish event | OPEN | No | No (commission accrues after reservations) |

### 9.3 RESERVATION OVERRIDES – RESERVATION ENTITY

| Current Phase | Admin Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|--------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| PENDING_APPROVAL | Approve reservation | ✅ Yes | CTA: "Schválit rezervaci" → Reservation → WAITING_INVESTOR_SIGNATURE | N/A | Phase transition, send RA to investor, log admin approval | WAITING_INVESTOR_SIGNATURE | New SLA phase starts | No |
| Any non-terminal | Extend SLA | ✅ Yes | Show form: "Nový deadline:" (date picker) + "Důvod:" (required) → If submitted, SLA extended | N/A | Update SLA deadline, log override + reason, notify Tipař | No change (phase same) | SLA extended | No |
| WAITING_INVESTOR_SIGNATURE | Log investor signature | ✅ Yes | Upload signed RA document → Reservation → WAITING_DEVELOPER_DECISION | N/A | Phase transition, notify partner, log signature event | WAITING_DEVELOPER_DECISION | New SLA phase starts | No |
| WAITING_DEVELOPER_DECISION | Log partner approval | ✅ Yes | CTA: "Partner schválil" + proposed meeting dates → Reservation → WAITING_MEETING_SELECTION | N/A | Phase transition, send dates to investor, log approval | WAITING_MEETING_SELECTION | New SLA phase starts | No |
| WAITING_DEVELOPER_DECISION | Log partner rejection | ✅ Yes | Form: "Důvod zamítnutí:" (required) → Reservation → NO_DEAL | N/A | Terminal transition, release slot, commission → LOST, log rejection | NO_DEAL (terminal) | SLA stopped | Commission → LOST |
| WAITING_MEETING_SELECTION | Log investor selection | ✅ Yes | Select date from proposed list → Reservation → MEETING_CONFIRMED | N/A | Phase transition, **identities revealed**, notify partner/Tipař, log selection | MEETING_CONFIRMED (ACTIVE) | No more SLA (awaiting meeting) | No |
| MEETING_CONFIRMED | Log meeting completion | ✅ Yes | CTA: "Schůzka dokončena" → Reservation → MEETING_COMPLETED | N/A | Phase transition, log completion | MEETING_COMPLETED | New SLA phase (closure) starts | No |
| MEETING_COMPLETED | Upload investment agreement | ✅ Yes | Upload document → Reservation → SUCCESS | N/A | Terminal transition, commission → EARNED, log success | SUCCESS (terminal) | SLA stopped | Commission → EARNED |
| MEETING_COMPLETED | Mark as NO_DEAL | ✅ Yes | Form: "Důvod:" (required) → Reservation → NO_DEAL | N/A | Terminal transition, release slot, commission → LOST, log no deal | NO_DEAL (terminal) | SLA stopped | Commission → LOST |
| Any non-terminal | Force close | ✅ Yes | Form: "Důvod uzavření:" (required) → Reservation → CANCELLED | N/A | Terminal transition, release slot, commission → LOST, log forced closure + reason | CANCELLED (terminal) | SLA stopped | Commission → LOST |
| Any terminal | Reopen reservation | ❌ No | No action available (terminal states are immutable) | Terminal state | None | No change | No | No |

### 9.4 COMMISSION APPROVAL – COMMISSION ENTITY

| Current State | Admin Intent | Allowed? | UI Response | Blocking Reason | System Side Effect | Next State | SLA Impact | Commission Impact |
|---------------|--------------|----------|-------------|-----------------|-------------------|------------|------------|------------------|
| EARNED | Review commission | ✅ Yes | Show: Reservation details, investment amount, commission calculation, Tipař info | N/A | None | No change | No | No |
| EARNED | Request invoice | ✅ Yes | Send notification to Tipař: "Odešlete fakturu pro provizi [ID]" | N/A | Notify Tipař, log request | No change | No | No |
| PENDING_PAYMENT | Review invoice | ✅ Yes | Show: Invoice number, date, amount, PDF (if uploaded) | N/A | None | No change | No | No |
| PENDING_PAYMENT | Approve payment | ✅ Yes | Form: "Payment reference:" + "Payment date:" → If submitted, commission → PAID | N/A | Commission → PAID, log payment details, notify Tipař | PAID (terminal) | No | Payment completed |
| PENDING_PAYMENT | Suspend commission | ✅ Yes | Form: "Důvod pozastavení:" (required) → Commission → SUSPENDED | N/A | Commission → SUSPENDED, log suspension + reason, notify Tipař | SUSPENDED | No | Payment blocked |
| SUSPENDED | Resume payment | ✅ Yes | Form: "Důvod obnovení:" → Commission → PENDING_PAYMENT | N/A | Commission → PENDING_PAYMENT, log resume + reason, notify Tipař | PENDING_PAYMENT | No | Payment unblocked |
| SUSPENDED | Forfeit commission | ✅ Yes | Form: "Důvod propadnutí:" (required) → Commission → LOST | N/A | Commission → LOST, log forfeiture + reason, notify Tipař | LOST (terminal) | No | Commission lost |
| PAID | Initiate clawback | ✅ Yes | Form: "Důvod vymáhání:" (required) → Commission → UNDER_RECOVERY | N/A | Commission → UNDER_RECOVERY, log clawback + reason, notify Tipař | UNDER_RECOVERY | No | Recovery process |

---

## CROSS-ENTITY LOGIC RULES

### RULE 1: Reservation Creation Impact

**WHEN:** User creates reservation (via Reservation Modal)

**CHECKS (pre-creation):**
1. Global slots > 0 → PASS or BLOCK
2. Per-ticket reservations < 3 → PASS or BLOCK
3. Ticket capacity > 0 → PASS or BLOCK
4. Project state = OPEN or LAST_SLOTS → PASS or BLOCK
5. Investor selected → PASS or BLOCK

**IF ALL PASS:**

**Immediate Effects:**
- Reservation created: [NONE] → PENDING_APPROVAL
- Global slots: Decremented by 1
- Commission created: [NONE] → EXPECTED
- SLA: Phase 1 timer starts
- UI: Confirmation modal shown

**Ticket State Impact:**
- IF ticket.reservations = 0 → Ticket: AVAILABLE → PARTIALLY_FILLED
- IF ticket.occupancy > 80% → Ticket: * → LAST_CAPACITY
- IF ticket.occupancy = 100% → Ticket: * → FULLY_FILLED

**Project State Impact:**
- IF project.availableTickets < 20% total → Project: OPEN → LAST_SLOTS
- IF project.availableTickets = 0 → Project: * → FULLY_RESERVED

**IF ANY BLOCK:**
- No reservation created
- Error message shown (specific to blocking reason)
- Modal stays open OR closes with error toast

---

### RULE 2: Reservation Terminal State Impact

**WHEN:** Reservation reaches terminal state (SUCCESS, NO_DEAL, EXPIRED, CANCELLED)

**Immediate Effects:**
- Reservation: [Current Phase] → [Terminal State]
- Global slots: Incremented by 1 (slot released)
- SLA: Stopped

**Commission Impact:**
- IF terminal state = SUCCESS → Commission: EXPECTED → EARNED
- IF terminal state = NO_DEAL/EXPIRED/CANCELLED → Commission: EXPECTED → LOST

**Ticket State Impact (capacity freed):**
- Ticket occupancy: Decremented by 1
- IF was FULLY_FILLED → Ticket: FULLY_FILLED → PARTIALLY_FILLED or LAST_CAPACITY
- IF was LAST_CAPACITY → Ticket: LAST_CAPACITY → PARTIALLY_FILLED
- IF all reservations gone → Ticket: PARTIALLY_FILLED → AVAILABLE

**Project State Impact (if ticket capacity freed):**
- IF was FULLY_RESERVED and now has capacity → Project: FULLY_RESERVED → LAST_SLOTS or OPEN
- IF was LAST_SLOTS and now has more capacity → Project: LAST_SLOTS → OPEN

---

### RULE 3: SLA Expiration Impact

**WHEN:** SLA timer reaches 0 (system auto-trigger)

**Immediate Effects:**
- Reservation: [Current Phase] → EXPIRED
- Global slots: Incremented by 1 (slot released)
- Commission: EXPECTED → LOST
- SLA violation logged
- Notification sent to Tipař

**Ticket/Project State Impact:**
- Same as Rule 2 (capacity freed)

**UI Impact:**
- Reservation Detail: Shows expiry badge, SLA violation log
- Activities Feed: New activity "Rezervace expirována"
- Notification: "Rezervace [ID] expirovala – SLA překročeno"

**Admin Impact:**
- SLA violation appears in admin dashboard alerts
- Cannot be revived (terminal state)

---

### RULE 4: Identity Reveal Rule

**WHEN:** Reservation: * → MEETING_CONFIRMED

**Before Phase 5:**
- Investor name: HIDDEN (shows "Přiřazený investor")
- Investor contact: HIDDEN
- Meeting details: NOT SHOWN

**After Phase 5 (MEETING_CONFIRMED):**
- Investor name: REVEALED (shows full name)
- Investor contact: REVEALED (shows email/phone if available)
- Meeting details: SHOWN (date, time, location)
- Partner notified: Investor identity shared

**Permanent After Phase 5:**
- Even if reservation later → NO_DEAL/EXPIRED/CANCELLED
- Identity remains revealed in logs
- Audit trail includes "Identity revealed at [timestamp]"

---

### RULE 5: Commission Invoice Submission

**WHEN:** Tipař submits invoice (Commission Detail screen, commission = EARNED)

**Pre-submission Checks:**
1. Commission state = EARNED → PASS or BLOCK
2. Invoice not already submitted → PASS or BLOCK

**IF PASS:**
- Commission: EARNED → PENDING_PAYMENT
- Invoice record created (number, date, amount)
- Admin notified for approval
- UI: Show "Faktura odeslána – čeká na schválení"

**IF BLOCK:**
- Error: "Provize musí být ve stavu 'Zasloužená' před odesláním faktury"
- OR "Faktura již byla odeslána"

---

### RULE 6: Admin Override Visibility

**WHEN:** Admin performs any override (SLA extension, phase transition, rejection, etc.)

**Required:**
- Reason field: MUST be filled (cannot be empty)
- Admin identity: Logged
- Timestamp: Logged
- Old value: Logged (if applicable)
- New value: Logged

**UI Impact:**
- Tipař sees override in:
  - Reservation timeline (special icon, e.g., shield)
  - Activity log ("Změněno administrátorem")
  - Notification (if affects user)
- Override is visually distinct (different color/icon)
- Reason is shown: "Administrátor: [name] – [reason]"

**Audit Impact:**
- Full event logged in audit trail
- Immutable (cannot be deleted or edited)
- Searchable by admin, entity ID, reason

---

## ERROR HANDLING MATRIX

### ERROR TYPE 1: USER ERROR (Invalid Action)

| Error Scenario | When Occurs | UI Response | Recovery Path | Example |
|----------------|-------------|-------------|---------------|---------|
| No global slots | User clicks "Rezervovat" but slots = 0 | Modal blocked, tooltip: "Nemáte volné sloty" | Wait for slot release or cancel existing reservation | User has 10 active reservations, limit is 10 |
| Per-ticket limit | User tries to reserve ticket where they already have 3 reservations | Modal blocked, message: "Překročen limit 3 rezervací na tiket" | Select different ticket | User already reserved ticket T1 three times |
| Ticket full | User clicks "Rezervovat" on FULLY_FILLED ticket | Button disabled, tooltip: "Tiket je plně obsazen" | Wait for capacity release or select different ticket | Ticket has 10/10 slots filled |
| Project paused | User tries to reserve on PAUSED project | Modal blocked, message: "Projekt je pozastaven – [reason]" | Contact admin or wait for resume | Admin paused project for review |
| No investor selected | User clicks "Potvrdit" without selecting investor | Button disabled, prompt: "Vyberte investora" | Select investor from list | User forgot to select investor |

### ERROR TYPE 2: BUSINESS RULE VIOLATION

| Error Scenario | When Occurs | UI Response | Recovery Path | Example |
|----------------|-------------|-------------|---------------|---------|
| State conflict | Reservation cancelled but user tries to view as active | Error toast: "Rezervace byla zrušena" | Redirect to reservation detail (cancelled state) | Race condition: cancellation processed while user viewing |
| Document not ready | User clicks download on PENDING document | Disabled link, tooltip: "Dokument se připravuje" | Wait for document to become AVAILABLE | Admin hasn't finished uploading |
| Invoice already submitted | User tries to submit invoice twice | Error message: "Faktura již byla odeslána" | View invoice status instead | User clicked submit twice |
| Terminal state action | User tries to cancel SUCCESS reservation | No cancel button shown, message: "Rezervace je dokončena" | No action (terminal state) | Reservation already completed |

### ERROR TYPE 3: SYSTEM ERROR

| Error Scenario | When Occurs | UI Response | Recovery Path | Example |
|----------------|-------------|-------------|---------------|---------|
| API timeout | Reservation creation takes > 30s | Error toast: "Chyba připojení – zkuste to prosím znovu" | Retry button, check if reservation was created | Network latency |
| Document download failed | PDF viewer fails to load | Error message: "Nepodařilo se načíst dokument – zkuste to později" | Retry button, contact support if persists | Server error |
| Session expired | User action after session timeout | Redirect to login, message: "Platnost relace vypršela" | Re-login, action must be repeated | User inactive for 2 hours |

---

## END OF WIREFRAME LOGIC MATRIX

**Last Updated:** 2025-01-01
**Document Status:** Complete and Definitive
**Usage:** Reference this matrix to implement deterministic UI behavior for all screens
**Coverage:** All screens, entities, states, actions, and their UI responses defined
**Developers:** Use this as source of truth for UI logic implementation
**Designers:** Use this to ensure designs reflect correct state-action relationships
