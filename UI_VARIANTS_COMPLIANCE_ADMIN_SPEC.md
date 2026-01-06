# UI VARIANTS, COMPLIANCE & ADMIN SPECIFICATION – TIPARI.CZ
**Visual Design Comparison + Microcopy Checklist + SLA Schema + Admin UX**

**Document Type:** UI Design + Compliance + Backend Schema + Admin Tooling
**Date:** 2025-01-01
**Purpose:** Complete specification for UI variants, compliance-safe copy, SLA engine, and admin overrides

---

## ČÁST 1: TICKET TABLE UI VARIANTS (COMPARISON)

### 1.1 VARIANT A: ROW-BASED TABLE

#### VISUAL STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Tikety (47)  [🔄 Aktivní / Vše]  [☐ Moje rezervace]  [☐ Volné sloty]  [Seřadit: Provize (max→min) ▼]                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                     │
│ Stav       │ ID       │ Investice      │ Výnos    │ LTV │ Zajištění      │ Sloty │ PROVIZE       │ Akce              │ ▼          │
│────────────┼──────────┼────────────────┼──────────┼─────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────│
│ Dostupný ✓ │ T-001-02 │ 5 000 000 Kč   │ 8,5%·24m │ 60% │ 🛡 1. pořadí   │ 7/10  │ 125 000 Kč    │ [Rezervovat]      │ [▼]        │
│────────────┼──────────┼────────────────┼──────────┼─────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────│
│ Poslední 🟠│ T-001-03 │ 3 500 000 Kč   │ 9,2%·18m │ 55% │ 🛡 1. pořadí   │ 2/10  │ 87 500 Kč     │ [Rezervovat]      │ [▼]        │
│────────────┼──────────┼────────────────┼──────────┼─────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────│
│ Mnou 📌    │ T-002-01 │ 2 000 000 Kč   │ 7,8%·12m │ 70% │ 🛡 2. pořadí   │ 5/8   │ 50 000 Kč     │ [Detail]          │ [▼]        │
│────────────┼──────────┼────────────────┼──────────┼─────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────│
│ Obsazeno ✕ │ T-003-01 │ 8 000 000 Kč   │ 8,0%·36m │ 65% │ 🛡 1. pořadí   │ 0/5   │ 200 000 Kč    │ Plně obsazeno     │ [▼]        │
│────────────┼──────────┼────────────────┼──────────┼─────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────│
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

EXPANDED ROW (when user clicks [▼]):
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TIKET T-001-02 DETAIL                                                                                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                     │
│ INVESTICE                              │ ZAJIŠTĚNÍ                              │ DOSTUPNOST                                        │
│ Investice: 5 000 000 Kč                │ Zajištění: Zástava 1. pořadí          │ Sloty: 7 / 10 dostupných                          │
│ Výnos: 8,5% p.a.                       │ LTV: 60% · Externí ocenění             │ ├─ Obsazeno: 3 sloty                              │
│ Doba: 24 měsíců                        │ Ocenění: [Stáhnout PDF]               │ │  └─ 2 rezervace aktivní, 1 podepsáno              │
│ Splatnost: 31.12.2026                  │                                        │ └─ Volné: 7 slotů                                 │
│                                        │                                        │                                                   │
│────────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────────────│
│                                        │                                        │                                                   │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐           │
│ │ VAŠE PROVIZE: 125 000 Kč                                                                                             │           │
│ │ Výpočet: 2,5% z 5 000 000 Kč · Splatnost: Po podpisu investorem                                                      │           │
│ └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘           │
│                                        │                                        │                                                   │
│────────────────────────────────────────┼────────────────────────────────────────┼───────────────────────────────────────────────────│
│                                        │                                        │                                                   │
│ DOPORUČENÍ INVESTOŘI (3)                                                                                                           │
│ ├─ Andrea Nováková (92% shoda) · Kapacita: 1 500 000 Kč · Aktivní                                                                 │
│ ├─ Petr Svoboda (88% shoda) · Kapacita: 800 000 Kč · Prospekt                                                                     │
│ └─ Milan Dvořák (76% shoda) · Kapacita: 2 000 000 Kč · Má aktivní rezervaci                                                       │
│ [Zobrazit všechny investory →]                                                                                                     │
│                                        │                                        │                                                   │
│────────────────────────────────────────┴────────────────────────────────────────┴───────────────────────────────────────────────────│
│                                                                                                                                     │
│ [Rezervovat tiket]  [Detail tiketu →]                                                                                              │
│                                                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### DESIGN SPECS

**Collapsed Row:**
- **Height:** 56px (desktop), 72px (tablet)
- **Columns:** 9 columns (Status | ID | Amount | Yield | LTV | Security | Slots | Commission | Action | Expand)
- **Column Widths:**
  - Status: 110px (icon + text)
  - ID: 90px
  - Amount: 140px
  - Yield: 100px
  - LTV: 60px
  - Security: 130px
  - Slots: 80px (progress bar)
  - Commission: 140px (bold, larger font)
  - Action: 140px (button)
  - Expand: 40px (chevron)
  - **Total:** ~1030px (fits 1280px screen with margins)

**Typography:**
- Header row: 12px semibold, uppercase, gray #6B7280
- Data cells: 14px regular, dark #040F2A
- Commission: 16px bold, green #14AE6B (if positive flow)
- Yield: 14px medium

**Hover State:**
- Row background: Light gray #F9FAFB
- Cursor: pointer (on clickable areas)
- No background change on disabled rows

**Expanded Row:**
- **Height:** Auto (min 300px)
- **Layout:** 3-column grid (Investment | Security | Availability)
- **Commission Box:** Full-width, highlighted background #EFF6FF (light blue)
- **Matching Investors:** List format with match percentage badges

---

#### PROS

✅ **Maximum Information Density**
- All essential data visible without scrolling
- Can compare 10+ tickets side-by-side on one screen
- Professional users (bankers) are trained on spreadsheet-like layouts

✅ **Fast Scanning**
- Eyes trained on horizontal rows (left-to-right reading pattern)
- Sortable columns allow quick prioritization (commission, yield, availability)
- Familiar pattern (Excel, CRM, banking software)

✅ **Efficient Filtering**
- Filters work naturally (hide/show rows)
- Sort order immediately visible (ascending/descending indicators)

✅ **Commission Visibility**
- Commission is rightmost column before action (natural terminal position)
- Can be sorted (highest commission first)
- Bold styling makes it stand out

✅ **Desktop-Optimized**
- Ideal for 1280px+ screens (primary use case for professional users)
- Keyboard navigation friendly (tab through rows, arrow keys)

---

#### CONS

⚠️ **Limited Space for Complex Status**
- Status column restricted to icon + short text
- Hard to show detailed state (e.g., "Reserved by me – SLA: 24h remaining")

⚠️ **Less Visual Hierarchy**
- All data has same visual weight (no natural "hero" element)
- Commission emphasis relies on column position + bold font only

⚠️ **Harder to Show "Reserved by Me" Prominently**
- Blue badge can get lost among other status badges
- Background tint helps but not as salient as card-based layout

⚠️ **Expandable Row Complexity**
- Not all users may discover expand chevron
- Expanded content can push table down (jarring if user is mid-scroll)

⚠️ **Mobile/Tablet Adaptation Difficult**
- 9 columns don't fit on small screens
- Requires horizontal scroll OR complete redesign for mobile

---

#### BEST FOR

- **Speed:** ✅ **EXCELLENT** – Fastest scanning for professional users
- **Clarity:** ✅ **GOOD** – All data visible, sortable, comparable
- **Sales Motivation:** ⚠️ **MEDIUM** – Commission visible but not visually dominant

---

### 1.2 VARIANT B: CARD-BASED LAYOUT

#### VISUAL STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Tikety (47)  [🔄 Aktivní / Vše]  [☐ Moje rezervace]  [☐ Volné sloty]  [Seřadit: Provize (max→min) ▼]                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                     │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐                    │
│  │ Dostupný ✓         T-001-02     │  │ Poslední sloty 🟠   T-001-03    │  │ Rezervováno mnou 📌  T-002-01   │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  │ 5 000 000 Kč                    │  │ 3 500 000 Kč                    │  │ 2 000 000 Kč                    │                    │
│  │ 8,5% p.a. · 24 měsíců           │  │ 9,2% p.a. · 18 měsíců           │  │ 7,8% p.a. · 12 měsíců           │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  │ 🛡 Zajištěno 1. pořadí          │  │ 🛡 Zajištěno 1. pořadí          │  │ 🛡 Zajištěno 2. pořadí          │                    │
│  │ LTV: 60%                        │  │ LTV: 55%                        │  │ LTV: 70%                        │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  │ Sloty: 7 / 10                   │  │ Sloty: 2 / 10                   │  │ Sloty: 5 / 8                    │                    │
│  │ [████████░░] 70%                │  │ [██░░░░░░░░] 20%                │  │ [██████░░░░] 60%                │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  │ ┌─────────────────────────────┐ │  │ ┌─────────────────────────────┐ │  │ ┌─────────────────────────────┐ │                    │
│  │ │ PROVIZE: 125 000 Kč         │ │  │ │ PROVIZE: 87 500 Kč          │ │  │ │ PROVIZE: 50 000 Kč          │ │                    │
│  │ └─────────────────────────────┘ │  │ └─────────────────────────────┘ │  │ └─────────────────────────────┘ │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  │ [Rezervovat tiket]              │  │ [Rezervovat tiket]              │  │ [Detail rezervace]              │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  └─────────────────────────────────┘                    │
│                                                                                                                                     │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐                    │
│  │ Plně obsazeno ✕     T-003-01    │  │ Dostupný ✓         T-004-01     │  │ Dostupný ✓         T-005-02     │                    │
│  │                                 │  │                                 │  │                                 │                    │
│  │ 8 000 000 Kč                    │  │ 1 200 000 Kč                    │  │ 4 500 000 Kč                    │                    │
│  │ 8,0% p.a. · 36 měsíců           │  │ 7,2% p.a. · 6 měsíců            │  │ 9,5% p.a. · 30 měsíců           │                    │
│  │ ...                             │  │ ...                             │  │ ...                             │                    │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  └─────────────────────────────────┘                    │
│                                                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### DESIGN SPECS

**Card:**
- **Dimensions:** 340px width × 400px height
- **Grid:** 3 columns on desktop (1020px + margins = fits 1280px)
- **Spacing:** 24px gap between cards
- **Border:** 1px solid #E5E7EB
- **Border Radius:** 8px
- **Shadow:** Subtle (0 1px 3px rgba(0,0,0,0.1))

**Card Sections (Top → Bottom):**
1. **Header:** Status badge (left) + Ticket ID (right) – 56px height
2. **Amount:** Large number (24px bold) – 40px height
3. **Yield + Duration:** Medium text (16px) – 32px height
4. **Security:** Icon + text – 48px height
5. **LTV:** Secondary text – 24px height
6. **Availability:** Slots text + progress bar – 64px height
7. **Commission Box:** Highlighted (background #EFF6FF, border #215EF8) – 72px height
8. **CTA Button:** Full-width primary button – 48px height

**Typography:**
- Ticket ID: 12px medium, gray #6B7280
- Amount: 24px bold, dark #040F2A
- Yield/Duration: 16px regular
- Commission: 20px bold, blue #215EF8

**Hover State:**
- Card lifts (shadow increases: 0 4px 12px rgba(0,0,0,0.15))
- Border color: Blue #215EF8
- Cursor: pointer

**Status Badge Placement:**
- Top-left corner, absolute positioning
- Overlaps card border slightly for salience

---

#### PROS

✅ **Commission VERY Prominent**
- Large highlighted box (impossible to miss)
- Visual weight matches importance
- Color-coded (blue = commission, aligns with brand color)

✅ **Visual Hierarchy Clear**
- Amount → Yield → Security → Commission → CTA (natural reading flow)
- Each element has distinct visual treatment

✅ **Status Badges Stand Out**
- Corner placement makes "Reserved by me" very visible
- Blue background tint on entire card (if user's reservation) creates strong salience

✅ **"Opportunity" Feel**
- Each card feels like a distinct option
- More emotional/motivational than spreadsheet view
- Good for sales-driven environments

✅ **Mobile/Tablet Responsive**
- Cards stack vertically (1 column on mobile, 2 on tablet)
- No horizontal scroll needed
- Touch-friendly (large tap targets)

✅ **Security/LTV Iconography**
- Can use larger icons (shield for security, etc.)
- More space for visual differentiation

---

#### CONS

❌ **Slower to Scan 10+ Tickets**
- Grid reflows vertically (more scrolling required)
- Can't see all tickets on one screen (typically 6 cards visible)

❌ **Harder to Compare Specific Attributes**
- Must scroll up/down to compare yields across tickets
- No column-based comparison (unlike table)

❌ **Sorting Less Intuitive**
- Grid reflows, visual continuity lost when sort changes
- User doesn't immediately see which attribute is sorted

❌ **More Vertical Space Consumed**
- Pagination needed sooner (e.g., 20 tickets = 4 screens vs. 1 screen in table)

❌ **Commission Takes More Space**
- Highlighted box is 72px tall (takes up valuable card space)
- Could be perceived as too sales-focused (not professional enough)

---

#### BEST FOR

- **Speed:** ⚠️ **MEDIUM** – Slower for comparing many tickets
- **Clarity:** ✅ **EXCELLENT** – Each ticket is self-contained, easy to understand
- **Sales Motivation:** ✅ **EXCELLENT** – Commission is impossible to ignore

---

### 1.3 VARIANT C: HYBRID (ROW + EXPANDABLE DETAIL)

#### VISUAL STRUCTURE

**This is the RECOMMENDED variant from TICKET_RESERVATION_UX_SYSTEM.md**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Tikety (47)  [🔄 Aktivní / Vše]  [☐ Moje rezervace]  [☐ Volné sloty]  [Seřadit: Provize (max→min) ▼]                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                                     │
│ Stav       │ ID       │ Investice      │ Výnos    │ Zajištění      │ Sloty │ PROVIZE       │ Akce              │ ▼                  │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│ Dostupný ✓ │ T-001-02 │ 5 000 000 Kč   │ 8,5%·24m │ 🛡 1. pořadí   │ 7/10  │ 125 000 Kč    │ [Rezervovat]      │ [▼]                │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│ Poslední 🟠│ T-001-03 │ 3 500 000 Kč   │ 9,2%·18m │ 🛡 1. pořadí   │ 2/10  │ 87 500 Kč     │ [Rezervovat]      │ [▼]                │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│                                                                                                                                     │
│            ┌─ EXPANDED (clicked [▼] on T-001-03) ──────────────────────────────────────────────────────────────────────────────┐   │
│            │                                                                                                                     │   │
│            │ TIKET T-001-03 DETAIL                                                                                              │   │
│            │                                                                                                                     │   │
│            │ Investice: 3 500 000 Kč                     Zajištění: Zástava 1. pořadí                                          │   │
│            │ Výnos: 9,2% p.a. · 18 měsíců                LTV: 55% · Externí ocenění                                             │   │
│            │ Splatnost: 30.6.2026                        Ocenění: [Stáhnout PDF]                                                │   │
│            │                                                                                                                     │   │
│            │ Dostupnost: 2 / 10 slotů (8 obsazeno, 2 volné)                                                                     │   │
│            │                                                                                                                     │   │
│            │ ┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐           │   │
│            │ │ VAŠE PROVIZE: 87 500 Kč (2,5% z investice) · Splatnost: Po podpisu investorem                        │           │   │
│            │ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘           │   │
│            │                                                                                                                     │   │
│            │ Doporučení investoři (2):                                                                                          │   │
│            │ ├─ Jana Procházková (89% shoda) · Kapacita: 900 000 Kč · Prospekt                                                 │   │
│            │ └─ Tomáš Černý (82% shoda) · Kapacita: 1 200 000 Kč · Aktivní                                                     │   │
│            │ [Zobrazit všechny investory →]                                                                                     │   │
│            │                                                                                                                     │   │
│            │ [Rezervovat tiket]  [Detail tiketu →]                                                                              │   │
│            │                                                                                                                     │   │
│            └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                                                     │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│ Mnou 📌    │ T-002-01 │ 2 000 000 Kč   │ 7,8%·12m │ 🛡 2. pořadí   │ 5/8   │ 50 000 Kč     │ [Detail]          │ [▲]                │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│                                                                                                                                     │
│            ┌─ EXPANDED (auto-expanded for "Reserved by me") ───────────────────────────────────────────────────────────────────┐   │
│            │                                                                                                                     │   │
│            │ TIKET T-002-01 DETAIL                                                                                              │   │
│            │                                                                                                                     │   │
│            │ ... [Standard detail sections] ...                                                                                 │   │
│            │                                                                                                                     │   │
│            │ Vaše rezervace: 1 aktivní                                                                                          │   │
│            │ ├─ RES-2025-001198                                                                                                 │   │
│            │ ├─ Vytvořeno: 29.12.2024 10:00                                                                                     │   │
│            │ ├─ Investor: Martina Svobodová                                                                                     │   │
│            │ ├─ SLA: Zbývá 36 hodin ⚠                                                                                          │   │
│            │ │   └─ Automatické zrušení: 31.12.2024 22:00                                                                      │   │
│            │ └─ [Detail rezervace →]                                                                                            │   │
│            │                                                                                                                     │   │
│            └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                                                     │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│ Obsazeno ✕ │ T-003-01 │ 8 000 000 Kč   │ 8,0%·36m │ 🛡 1. pořadí   │ 0/5   │ 200 000 Kč    │ Plně obsazeno     │ [▼]                │
│────────────┼──────────┼────────────────┼──────────┼─────────────────┼───────┼───────────────┼───────────────────┼────────────────────│
│                                                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### DESIGN SPECS

**Collapsed Row:**
- Same as Variant A (56px height, 9 columns)

**Expanded Row:**
- **Height:** Auto (min 280px, max 600px depending on content)
- **Animation:** Slide down (200ms ease-out)
- **Background:** White (same as table)
- **Border:** Left border 4px solid blue #215EF8 (indicates expanded state)
- **Padding:** 24px all sides

**Expandable Behavior:**
- Click chevron [▼] → Expands row
- Click chevron [▲] → Collapses row
- Only ONE row expanded at a time (expanding another auto-collapses previous)
- EXCEPTION: Rows with user's reservation auto-expand on page load (max 3 auto-expanded)

**Expanded Content Sections:**
1. **Investment + Security Details** (2-column layout)
2. **Availability** (full-width, slot visualization)
3. **Commission Box** (full-width, highlighted)
4. **Matching Investors** (list, max 3 shown initially)
5. **Actions** (CTA buttons)

---

#### PROS

✅ **Best of Both Worlds**
- Fast scanning (table format) + deep dive on demand (expanded detail)
- Commission visible in BOTH collapsed (column) AND expanded (highlighted box) states

✅ **Progressive Disclosure**
- User only sees detail when needed (reduces cognitive load)
- Not overwhelming (unlike showing all detail in table cells)

✅ **Matching Investors Pre-Shown**
- **CRITICAL DIFFERENTIATOR**: User sees top 3 matching investors BEFORE clicking "Rezervovat"
- Reduces uncertainty: "Do I have a suitable investor for this?"
- Expected 15-25% increase in reservation conversion rate

✅ **User's Reservations Prominent**
- Blue tint background on collapsed row
- Auto-expanded on page load (user sees SLA countdown immediately)
- SLA countdown shown in expanded row (not cluttering table)

✅ **Professional Feel**
- Table format = enterprise standard
- Expandable rows = progressive disclosure (used in Jira, Linear, Salesforce)

✅ **Desktop + Tablet Friendly**
- Table works well on 1024px+ screens
- Expanded row provides mobile-like detail on desktop

---

#### CONS

⚠️ **Expanded Row Discoverability**
- Not all users may notice chevron icon
- Requires user education ("Click ▼ for detail")

⚠️ **Vertical Scroll Jump**
- Expanding row pushes table down
- Can be jarring if user is mid-scroll
- Mitigation: Smooth scroll to expanded row top

⚠️ **Implementation Complexity**
- More complex than pure table or pure cards
- Requires state management (which row is expanded)
- Animation needs to be smooth (janky animation = poor UX)

⚠️ **Mobile Adaptation Still Required**
- Table doesn't fit on small screens
- Likely needs to convert to card-based layout on mobile

---

#### BEST FOR

- **Speed:** ✅ **EXCELLENT** – Fastest scanning + detail on demand
- **Clarity:** ✅ **EXCELLENT** – All data available, context-aware expansion
- **Sales Motivation:** ✅ **EXCELLENT** – Commission visible 2×, matching investors shown early

---

### 1.4 COMPARISON MATRIX

| Criterion | Variant A: Table | Variant B: Cards | Variant C: Hybrid | Winner |
|-----------|-----------------|-----------------|------------------|--------|
| **Scanning Speed** | ✅ Fastest | ⚠️ Slower (vertical scroll) | ✅ Fastest | **A / C** |
| **Information Density** | ✅ Highest | ❌ Lowest | ✅ High (collapsed) | **A / C** |
| **Commission Visibility** | ✅ Good (column) | ✅ Excellent (large box) | ✅ Excellent (both) | **B / C** |
| **Status Prominence** | ⚠️ Medium | ✅ High (corner badge) | ✅ High (badge + background) | **B / C** |
| **Matching Investors** | ✅ In expanded row | ❌ Not shown (space limited) | ✅ In expanded row | **A / C** |
| **Comparison Across Tickets** | ✅ Easy (columns) | ❌ Difficult (scroll) | ✅ Easy (collapsed table) | **A / C** |
| **Desktop Suitability** | ✅ Optimal | ⚠️ OK | ✅ Optimal | **A / C** |
| **Mobile/Tablet Suitability** | ❌ Poor | ✅ Good | ⚠️ Requires redesign | **B** |
| **Professional Feel** | ✅ High | ⚠️ Medium (too sales-y?) | ✅ High | **A / C** |
| **Implementation Complexity** | ✅ Low | ✅ Low | ⚠️ Medium | **A / B** |
| **Sales Motivation** | ⚠️ Medium | ✅ High | ✅ High | **B / C** |

---

### 1.5 FINAL RECOMMENDATION

**RECOMMENDED:** **Variant C – Hybrid (Row + Expandable Detail)**

**Rationale:**

1. **Speed:** Professional users can scan collapsed rows as fast as pure table (Variant A)
2. **Depth:** Matching investors shown BEFORE reservation click (reduces uncertainty, increases conversion)
3. **Commission:** Visible 2× (table column + expanded box) = reinforcement without being pushy
4. **Professional:** Table format aligns with banking/CRM software expectations
5. **Scalability:** Works for 2 tickets or 50 tickets (filters + sort)

**Usage Scenarios:**

**For 3-8 Tickets (Most Projects):**
- User scans collapsed rows (fast overview)
- Expands 2-3 interesting tickets (detail + matching investors)
- Clicks "Rezervovat" with confidence (knows they have suitable investor)

**For 20+ Tickets (Large Projects):**
- User applies filters (e.g., "Volné sloty", sort by "Provize max→min")
- Scans top 10 tickets (commission-driven)
- Expands top 3 (highest commission + matching investors)
- Reserves 1-2 tickets (fastest path to commission)

**For "Reserved by Me" View:**
- Filter: "Moje rezervace" enabled
- Auto-expanded rows show SLA countdown prominently
- User immediately sees urgent actions (< 24h SLA)

---

### 1.6 MOBILE/TABLET ADAPTATION (BONUS RECOMMENDATION)

**FOR TABLET (768px - 1024px):**
- Use Hybrid table with 7 columns (remove LTV, combine Yield+Duration)
- Expand chevron becomes primary interaction (more expansions expected)

**FOR MOBILE (< 768px):**
- **Switch to Variant B (Cards)** with modifications:
  - 1 column layout (cards stack vertically)
  - Card height reduced (320px vs. 400px)
  - Commission box smaller but still highlighted
  - "Reserved by me" cards have blue left border (4px) instead of full background tint

**Why not force Hybrid on mobile?**
- 9-column table doesn't fit (horizontal scroll = poor UX)
- Cards are touch-friendly (large tap targets)
- Mobile users likely viewing 1-2 tickets at a time (not comparing 10+)

---

## ČÁST 2: UX MICROCOPY COMPLIANCE CHECKLIST

### 2.1 CHECKLIST PURPOSE

**This checklist ensures all user-facing text is:**
- ✅ Legally compliant (CZ/EU financial regulations)
- ✅ Trust-building (no misleading claims)
- ✅ Clarity-focused (user understands consequences)
- ✅ Professional (B2B private banking tone)

**Review Process:**
1. UX Writer drafts microcopy
2. Product reviews against this checklist
3. Legal/Compliance reviews flagged items
4. Final approval before deployment

---

### 2.2 SECTION 1: HEADINGS & LABELS

#### TICKET STATUS LABELS

| Element | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Available Ticket** | "Dostupný", "Volné sloty: X/Y" | "Akce", "Exkluzivní nabídka", "Jen dnes" | Factual scarcity only | Neutral |
| **Last Capacity** | "Poslední sloty", "Zbývá méně než 20% kapacity" | "Rychle jednajte!", "Téměř vyprodáno", "Poslední šance!" | No pressure language | Informative |
| **Reserved by User** | "Rezervováno mnou", "Vaše rezervace" | "Vaše investice", "Váš obchod" (premature) | Reservation ≠ Investment | Professional |
| **Fully Filled** | "Plně obsazeno", "Všechny sloty rezervovány" | "Vyprodáno", "Zmeškali jste to" | No FOMO language | Neutral |
| **Expired Reservation** | "Vypršelo", "Rezervace vypršela {date}" | "Zmeškali jste šanci", "Bohužel pozdě" | Factual, no guilt | Neutral |

---

#### SECTION HEADINGS

| Element | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Commission Section** | "Vaše provize", "Provize za zprostředkování" | "Váš zisk", "Zaručená provize", "Garantovaný příjem" | No guarantee of payment (investor may not sign) | Professional |
| **Availability Section** | "Dostupnost", "Zbývající sloty" | "Pospěšte si", "Málo kusů skladem" | Factual capacity info | Neutral |
| **Security Section** | "Zajištění", "Typ zajištění" | "100% bezpečné", "Bez rizika" | No investment is risk-free | Professional |
| **Investor Match** | "Doporučení investoři", "Matching investoři" | "Perfektní klienti", "Zaručené shody" | Algorithm-based recommendation | Informative |

---

### 2.3 SECTION 2: MICROCOPY NEAR CTAs

#### PRIMARY CTA BUTTONS

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Reserve Ticket** | "Rezervovat tiket", "Vytvořit rezervaci" | "Investovat nyní", "Koupit", "Zajistit si investici" | Reservation ≠ Investment | Professional |
| **View Reservation** | "Detail rezervace", "Zobrazit rezervaci" | "Vaše investice", "Váš portfolio" | Reservation ≠ Investment | Professional |
| **Cancel Reservation** | "Zrušit rezervaci", "Stornovat" | "Vzdát se provize", "Smazat investici" | No guilt language | Neutral |
| **Confirm Reservation** | "Dokončit rezervaci", "Potvrdit" | "Zajistit provizi", "Uzavřít obchod" | Confirmation ≠ Deal closing | Professional |

---

#### HELPER TEXT NEAR CTAs

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Before Reservation** | "Rezervací si blokujete tento tiket pro svého klienta. Rezervace není závazek k investici." | "Zajistěte si provizi {X} Kč ještě dnes!" | No pressure, clarify mechanics | Informative |
| **After Reservation** | "Rezervace byla vytvořena. Máte {X} hodin na odeslání dokumentů investorovi." | "Gratulujeme! Provize {X} Kč je vaše!" | Commission earned only after investor signs | Factual |
| **Before Cancellation** | "Po zrušení se slot uvolní a budete moci vytvořit novou rezervaci." | "Opravdu chcete ztratit provizi {X} Kč?" | No guilt, explain consequences | Neutral |
| **Disabled CTA** | "Tiket je plně obsazen – všechny sloty rezervovány" | "Zmeškali jste šanci" | Factual reason, no blame | Informative |

---

### 2.4 SECTION 3: TOOLTIPS

#### INVESTMENT PARAMETERS

| Element | Allowed Tooltip | Forbidden Tooltip | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Yield (Výnos)** | "Očekávaný roční výnos před zdaněním. Skutečný výnos závisí na podmínkách investice." | "Garantovaných {X}% ročně" | Yield is expected, not guaranteed | Informative |
| **LTV** | "Loan-to-Value: Poměr půjčky k hodnotě zajištění. Nižší LTV = vyšší zajištění." | "100% bezpečná investice při LTV {X}%" | LTV doesn't eliminate risk | Professional |
| **Security Type** | "Typ zajištění investice. Externí ocenění poskytuje nezávislé ověření hodnoty." | "Toto zajištění eliminuje veškerá rizika" | Security reduces risk, doesn't eliminate | Professional |
| **Commission** | "Provize je vyplacena po podpisu smlouvy investorem. Výše: {rate}% z investice." | "Provize je zaručena" | Payment conditional on investor signature | Factual |

---

#### AVAILABILITY & SCARCITY

| Element | Allowed Tooltip | Forbidden Tooltip | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Slots (X / Y)** | "Aktuálně {X} volných slotů z celkových {Y}. Slot se může uvolnit, pokud rezervace vyprší." | "Pouze {X} kusů skladem – pospěšte si!" | Factual capacity, no pressure | Neutral |
| **Last Capacity** | "Zbývá méně než 20% kapacity. Aktuálně volné: {X} slotů." | "Poslední šance – rezervujte okamžitě!" | Factual threshold, no urgency | Informative |
| **Reserved by Others** | "Jiní uživatelé mají aktivní rezervace na tento tiket. Stále zbývá {X} slotů." | "Další klienti právě prohlížejí" (fake social proof) | Factual occupancy | Neutral |

---

### 2.5 SECTION 4: STATUS MESSAGES

#### SUCCESS MESSAGES

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Reservation Created** | "Rezervace úspěšně vytvořena. Číslo: {ID}. Máte {X} hodin na odeslání dokumentů." | "Gratulujeme! Provize {X} Kč je vaše!" | Commission not earned yet | Professional |
| **Reservation Cancelled** | "Rezervace zrušena. Slot byl uvolněn. Můžete vytvořit novou rezervaci." | "Rezervace zrušena. Promarněná provize: {X} Kč." | No guilt language | Neutral |
| **Investor Signed** | "Investor podepsal dokumenty. Čeká se na potvrzení partnera." | "Provize {X} Kč je zajištěna!" | Partner can still reject | Factual |
| **Deal Confirmed** | "Obchod úspěšně uzavřen. Provize {X} Kč byla zaznamenána." | "Vyděláte {X} Kč!" | Earned, not "will earn" | Professional |

---

#### ERROR MESSAGES

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Capacity Exhausted** | "Tiket byl plně obsazen jiným uživatelem během vytváření rezervace. Zkontrolujte dostupnost jiných tiketů." | "Bohužel jste zmeškali příležitost." | Factual explanation + recovery path | Neutral |
| **User Out of Slots** | "Nemáte volné sloty pro vytvoření rezervace. Aktuálně: {used}/{limit} slotů použito. Slot se uvolní po dokončení nebo zrušení rezervace." | "Překročili jste limit – zrušte nějakou rezervaci." | Explain constraint + recovery | Informative |
| **SLA Expired** | "Rezervace vypršela {date} z důvodu nedodržení lhůty. Slot byl automaticky uvolněn." | "Rezervace vypršela – ztratili jste provizi {X} Kč." | Factual reason, no guilt | Neutral |
| **Validation Failed** | "Formulář obsahuje chyby. Zkontrolujte: {field_list}" | "Chyba! Zkuste to znovu." | Specific guidance | Helpful |

---

### 2.6 SECTION 5: EMPTY STATES

#### NO TICKETS AVAILABLE

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Filter: No Results** | "Žádné tikety nesplňují vybrané filtry. Zkuste upravit kritéria." | "Bohužel nic pro vás není." | Actionable guidance | Helpful |
| **All Tickets Reserved** | "Všechny tikety na tomto projektu jsou momentálně rezervovány. Nové tikety mohou být přidány." | "Vše vyprodáno – příště budete rychlejší." | Factual state + possibility of change | Neutral |
| **No Matching Investors** | "Žádní investoři nesplňují parametry tohoto tiketu. Můžete vyhledat všechny investory ručně." | "Nemáte žádné klienty." | Offer alternative | Helpful |

---

#### NO ACTIVE RESERVATIONS

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **User Dashboard** | "Nemáte žádné aktivní rezervace. Prohlédněte si dostupné projekty." | "Začněte vydělávat – vytvořte rezervaci!" | No sales pressure | Neutral |
| **Reservation List** | "Žádné rezervace nesplňují vybrané filtry." | "Nic tu není." | Explain why empty | Informative |

---

### 2.7 SECTION 6: SLA / COUNTDOWN COPY

#### ACTIVE SLA (> 48 hours)

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Countdown Display** | "SLA: Zbývá {X} dnů {Y} hodin" OR "Lhůta: {X} hodin" | "Už jen {X} hodin!", "Pospěšte si!" | Factual time remaining | Neutral |
| **Tooltip** | "Lhůta pro dokončení rezervace. Automatické zrušení: {datetime}" | "Čas rychle ubíhá!" | Factual expiry time | Informative |
| **Helper Text** | "Po vypršení lhůty se rezervace automaticky zruší a slot se uvolní." | "Nestihnete-li to, přijdete o provizi!" | Explain consequences | Neutral |

---

#### EXPIRING SOON (24-48 hours)

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Countdown Display** | "SLA: Zbývá {X} hodin" (orange color) | "POSLEDNÍ ŠANCE: {X} hodin!" | Factual urgency (color-coded) | Neutral |
| **Notification** | "Upozornění: Rezervace {ID} vyprší za {X} hodin. Zajistěte dokončení procesu." | "RYCHLE! Rezervace vyprší!" | Inform + suggest action | Helpful |
| **Helper Text** | "Rezervace vyprší {datetime}. Po vypršení se slot automaticky uvolní." | "Jednajte okamžitě nebo ztratíte provizi!" | Factual deadline | Neutral |

---

#### CRITICAL (< 24 hours)

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Countdown Display** | "SLA: Zbývá {X} hodin" (red color) | "ALARM: Ještě {X} hodin!" | Factual urgency (color = severity) | Neutral |
| **Notification** | "Rezervace {ID} vyprší dnes v {time}. Po vypršení: slot bude uvolněn, rezervace zrušena." | "POZOR! Ztratíte provizi {X} Kč!" | Clear consequences | Informative |
| **Banner** | "Rezervace vyprší dnes v {time}. Co musíte udělat: {action_list}" | "KRITICKÉ: Jednajte TEĎ!" | Actionable guidance | Helpful |

---

#### PAUSED (Waiting External Action)

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Status Display** | "Čeká se na: {next_actor}" (e.g., "Podpis investora", "Potvrzení partnera") | "Proces pozastaven" (vague) | Explain dependency | Informative |
| **Helper Text** | "SLA je pozastaveno – lhůta neběží. Proces pokračuje po akci: {next_actor}" | "Nic teď nemůžete dělat." | Explain why paused | Neutral |

---

#### EXPIRED

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Status Display** | "Vypršelo" (gray badge) | "Selhání", "Promarněno" | Factual state | Neutral |
| **Detail View** | "Rezervace vypršela {date}. Důvod: Nedodržení lhůty (SLA). Slot byl uvolněn." | "Rezervace vypršela – ztratili jste provizi {X} Kč." | Explain what happened | Neutral |
| **Recovery Path** | "Můžete vytvořit novou rezervaci, pokud je tiket stále dostupný." | "Zkuste to příště lépe." | Offer next step | Helpful |

---

### 2.8 SECTION 7: COMMISSION DISPLAY

#### COMMISSION AMOUNT

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Amount Display** | "VAŠE PROVIZE: {amount} Kč" OR "Provize: {amount} Kč" | "VÁŠ ZISK: {amount} Kč", "VÝDĚLEK: {amount} Kč" | Commission ≠ profit/income | Professional |
| **Calculation** | "Výpočet: {rate}% z {investment_amount} Kč" | "{rate}% – nejlepší na trhu!" | Transparent calc, no claims | Informative |
| **Payment Terms** | "Splatnost: Po podpisu smlouvy investorem" | "Provize vyplacena okamžitě!" | Honest timing | Factual |

---

#### COMMISSION STATUS

| Context | Allowed Wording | Forbidden Wording | Reason | Tone |
|---------|----------------|------------------|--------|------|
| **Expected** | "Očekávaná provize" (blue badge) | "Zaručená provize" | Conditional on investor signature | Neutral |
| **Earned** | "Zasloužená provize" (green badge) | "Vyděláno!" | Earned ≠ paid | Professional |
| **Pending Payment** | "Čeká na vyplacení" (orange badge) | "Brzy na vašem účtu!" | Payment timing uncertain | Neutral |
| **Paid** | "Vyplaceno" (green badge) | "Máte je!" | Simple confirmation | Professional |
| **Lost** | "Propadlá provize" (gray badge) | "Ztraceno navždy" | Neutral explanation | Neutral |

---

### 2.9 SECTION 8: RISK-RELATED DISCLAIMERS

#### PLACEMENT GUIDELINES

| Context | Required Disclaimer | Placement | Tone |
|---------|-------------------|-----------|------|
| **Investment Parameters** | "Uvedené parametry jsou orientační a mohou se měnit. Investice podléhá rizikům." | Tooltip on "Výnos" field | Informative |
| **Security Info** | "Zajištění snižuje riziko, ale negarantuje vrácení investice." | Tooltip on "Zajištění" field | Balanced |
| **Commission Info** | "Provize je vyplacena po podpisu smlouvy investorem. Není zaručena." | Below commission amount | Factual |
| **Reservation Confirmation** | "Rezervace není investice. Investice vzniká až podpisem smlouvy mezi investorem a partnerem." | Step 3 of reservation modal (checkbox) | Clear |

---

#### DISCLAIMER WORDING

| Disclaimer Type | Allowed Wording | Forbidden Wording | Reason |
|----------------|----------------|------------------|--------|
| **Not Investment Advice** | "Platforma neposkytuje investiční poradenství. Rozhodnutí o investici je na investorovi." | [Omit disclaimer and imply advice] | Legal compliance (CZ) |
| **Risk Acknowledgement** | "Každá investice podléhá rizikům včetně možné ztráty kapitálu." | "Investice je zcela bezpečná." | Regulatory requirement |
| **Commission Contingency** | "Provize závisí na úspěšném uzavření investice investorem." | "Provize je garantována." | Honest expectation |
| **Platform Role** | "Platforma zprostředkovává kontakt mezi investorem a partnerem. Není stranou smlouvy." | [Imply platform is investment provider] | Legal clarity |

---

### 2.10 SECTION 9: "WHY NOW" MESSAGING (Compliance-Safe)

#### ALLOWED MOTIVATORS

| Motivator Type | Allowed Wording | Forbidden Wording | Reason | Placement |
|----------------|----------------|------------------|--------|-----------|
| **Limited Availability** | "Zbývá {X} slotů z celkových {Y}" | "Téměř vyprodáno!", "Poslední šance!" | Factual capacity | Tooltip on status badge |
| **Partner Deadline** | "Partner nastavil deadline pro alokaci: {date}" | "Jen do {date} – pospěšte si!" | External constraint | Info banner on project detail |
| **Investor Readiness** | "Investor je připraven investovat (aktualizováno {date})" | "Investor čeká – jednajte nyní!" | Status indicator | Investor card in expanded row |
| **Operational Deadline** | "Dokumenty musí být odeslány do {deadline} z důvodu koordinace s partnerem" | "Máte jen {X} hodin!" | SLA explanation | SLA helper text |
| **Allocation Threshold** | "Projekt vyžaduje min. {X}% alokace pro zahájení. Aktuálně: {Y}%" | "Pomozte nám naplnit projekt!" | Project dynamics | Info box in expanded row |

---

#### FORBIDDEN MOTIVATORS

| Forbidden Pattern | Example | Why Forbidden | Compliant Alternative |
|------------------|---------|---------------|----------------------|
| **Artificial Scarcity** | "Jen dnes 20% sleva na provizi!" | False urgency | [No discount mechanism] |
| **Emotional Pressure** | "Investoři čekají – nezklامejte je!" | Guilt manipulation | "Čeká se na: Podpis investora" |
| **Profit-Based Urgency** | "Zabezpečte si provizi {X} Kč ještě dnes!" | Commission not guaranteed | "Očekávaná provize: {X} Kč" |
| **Social Proof Manipulation** | "127 lidí právě prohlíží tento tiket" | Fake statistics | [Show real availability: X/Y slots] |
| **Countdown Without Cause** | "Nabídka končí za 03:42:15" | Arbitrary deadline | [Use SLA countdown only] |

---

### 2.11 REVIEW CHECKLIST (FOR LEGAL/COMPLIANCE)

**Before deploying any microcopy, verify:**

- [ ] **No investment guarantees** – Nowhere claims "guaranteed return", "risk-free", "100% secure"
- [ ] **Commission contingency clear** – Always states "Po podpisu investorem" or equivalent
- [ ] **Reservation ≠ Investment** – Clearly distinguished in all copy
- [ ] **Risk disclaimers present** – On investment parameters, security info, commission info
- [ ] **No pressure language** – No "Pospěšte si!", "Jen dnes!", "Poslední šance!" (except factual scarcity)
- [ ] **Factual urgency only** – SLA countdowns are real system constraints, not marketing
- [ ] **Platform role clear** – Platform = intermediary, not investment provider
- [ ] **Error messages helpful** – No blame language, provide recovery paths
- [ ] **Empty states actionable** – Suggest next steps, don't just say "nothing here"
- [ ] **Tooltips informative** – Explain terms, don't persuade

---

## ČÁST 3: SLA ENGINE DATA SCHEMA (BACKEND-READY)

### 3.1 SCHEMA OVERVIEW

**Purpose:** Define data structures for SLA (Service Level Agreement) engine controlling ticket reservations.

**Key Objects:**
1. `Ticket` – Investment opportunity with capacity
2. `Reservation` – User's claim on a ticket slot
3. `SLA_Timer` – Countdown logic and expiry handling
4. `Status_History` – Audit trail of all state changes

---

### 3.2 OBJECT 1: TICKET

```json
{
  "ticket_id": "T-001-02",
  "project_id": "PRJ-2024-001",
  
  "investment_amount_czk": 5000000,
  "yield_pa_percentage": 8.5,
  "duration_months": 24,
  "maturity_date": "2026-12-31",
  
  "commission": {
    "commission_amount_czk": 125000,
    "commission_rate_percentage": 2.5,
    "payment_trigger": "investor_signature"
  },
  
  "capacity": {
    "total_capacity": 10,
    "available_capacity": 7,
    "reserved_capacity": 3,
    "completed_capacity": 0
  },
  
  "status": "active",
  "is_active": true,
  "is_closed": false,
  "closed_reason": null,
  "closed_by_admin_id": null,
  "closed_at": null,
  
  "sla_config": {
    "default_sla_duration_hours": 48,
    "allows_sla_extension": true,
    "max_extensions_per_reservation": 2,
    "max_extension_duration_hours": 24
  },
  
  "timestamps": {
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2025-01-01T12:30:00Z"
  }
}
```

**Field Descriptions:**

| Field | Type | Description | Frontend Usage |
|-------|------|-------------|----------------|
| `ticket_id` | string | Unique identifier | Display in table, link to detail |
| `capacity.available_capacity` | integer | Current free slots | Show "X / Y slotů", enable/disable CTA |
| `status` | enum | "active" / "closed" / "inactive" | Color-code badge, block reservations if not active |
| `sla_config.default_sla_duration_hours` | integer | Default SLA (48h) | Show in reservation modal ("Máte 48 hodin") |
| `sla_config.allows_sla_extension` | boolean | Can admin extend SLA? | Admin UI: show/hide "Extend SLA" button |

**Calculation Logic (Frontend):**
```javascript
const ticketStatus = () => {
  if (!ticket.is_active) return "CLOSED"
  if (ticket.capacity.available_capacity === 0) return "FULLY_FILLED"
  if (ticket.capacity.available_capacity < ticket.capacity.total_capacity * 0.2) return "LAST_CAPACITY"
  if (ticket.capacity.reserved_capacity > 0) return "PARTIALLY_FILLED"
  return "AVAILABLE"
}
```

---

### 3.3 OBJECT 2: RESERVATION

```json
{
  "reservation_id": "550e8400-e29b-41d4-a716-446655440000",
  "reservation_number": "RES-2025-001234",
  
  "ticket_id": "T-001-02",
  "project_id": "PRJ-2024-001",
  "user_id": "USER-123",
  "investor_id": "INV-456",
  
  "status": "active",
  "previous_status": null,
  "status_changed_at": "2025-01-01T12:30:00Z",
  "status_changed_by": "USER-123",
  
  "slots_count": 1,
  
  "sla": {
    "sla_timer_id": "SLA-789",
    "sla_status": "running",
    "sla_started_at": "2025-01-01T12:30:00Z",
    "sla_expires_at": "2025-01-03T12:30:00Z",
    "sla_remaining_seconds": 172800,
    "sla_paused": false,
    "sla_pause_reason": null,
    "sla_paused_at": null,
    "sla_resumed_at": null
  },
  
  "override": {
    "is_overridden": false,
    "overridden_by_admin_id": null,
    "overridden_at": null,
    "override_reason": null,
    "override_type": null
  },
  
  "blocking": {
    "is_blocked": false,
    "blocking_reason": null,
    "blocked_at": null
  },
  
  "timestamps": {
    "created_at": "2025-01-01T12:30:00Z",
    "updated_at": "2025-01-01T12:30:00Z",
    "confirmed_at": "2025-01-01T12:30:00Z",
    "cancelled_at": null,
    "expired_at": null,
    "completed_at": null
  },
  
  "cancellation": {
    "is_cancelled": false,
    "cancelled_by": null,
    "cancelled_at": null,
    "cancellation_reason": null,
    "cancellation_type": null
  },
  
  "commission_id": "COMM-789",
  
  "metadata": {
    "source": "web_ui",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.1"
  }
}
```

**Field Descriptions:**

| Field | Type | Description | Frontend Usage |
|-------|------|-------------|----------------|
| `status` | enum | Current reservation state (14 possible values) | Display badge, show allowed actions |
| `sla.sla_expires_at` | ISO datetime | Absolute expiry time | Show countdown, color-code urgency |
| `sla.sla_remaining_seconds` | integer | Seconds until expiry | Real-time countdown calculation |
| `sla.sla_paused` | boolean | Is SLA countdown paused? | Show "Paused" label, hide countdown |
| `sla.sla_pause_reason` | string | Why paused (e.g., "Waiting for partner") | Tooltip explanation |
| `override.is_overridden` | boolean | Has admin intervened? | Show override badge, audit log link |
| `override.override_reason` | string | Admin's reason | Display in audit log |
| `blocking.blocking_reason` | string | Why reservation is blocked | Show error message to user |

**SLA Countdown Calculation (Frontend):**
```javascript
const calculateSLARemaining = (reservation) => {
  if (reservation.sla.sla_paused) {
    return { status: "paused", displayText: "Čeká se na: " + reservation.sla.sla_pause_reason }
  }
  
  const now = new Date()
  const expiresAt = new Date(reservation.sla.sla_expires_at)
  const diffMs = expiresAt - now
  
  if (diffMs <= 0) {
    return { status: "expired", displayText: "Vypršelo" }
  }
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  let status = "active"
  if (hours < 24) status = "critical"
  else if (hours < 48) status = "expiring_soon"
  
  const displayText = days > 0 
    ? `Zbývá ${days} dnů ${hours % 24} hodin`
    : `Zbývá ${hours} hodin`
  
  return { status, displayText, remainingHours: hours }
}
```

---

### 3.4 OBJECT 3: SLA_TIMER

```json
{
  "sla_timer_id": "SLA-789",
  "reservation_id": "550e8400-e29b-41d4-a716-446655440000",
  
  "duration_hours": 48,
  "started_at": "2025-01-01T12:30:00Z",
  "expires_at": "2025-01-03T12:30:00Z",
  
  "status": "running",
  "paused": false,
  "pause_reason": null,
  "paused_at": null,
  "paused_duration_seconds": 0,
  
  "extensions": [
    {
      "extension_id": "EXT-001",
      "extended_by_admin_id": "ADMIN-123",
      "extended_at": "2025-01-02T10:00:00Z",
      "extension_duration_hours": 24,
      "extension_reason": "Investor requested additional documentation",
      "new_expires_at": "2025-01-04T12:30:00Z"
    }
  ],
  
  "expiry": {
    "is_expired": false,
    "expired_at": null,
    "expiry_action_taken": null,
    "expiry_notification_sent": false
  },
  
  "metadata": {
    "created_at": "2025-01-01T12:30:00Z",
    "updated_at": "2025-01-02T10:00:00Z"
  }
}
```

**Field Descriptions:**

| Field | Type | Description | Frontend Usage |
|-------|------|-------------|----------------|
| `status` | enum | "running" / "paused" / "expired" / "cancelled" | Show countdown state |
| `expires_at` | ISO datetime | Current expiry time (can change if extended) | Countdown target |
| `extensions` | array | All SLA extensions (audit trail) | Show in admin audit log |
| `extensions[].extension_reason` | string | Why extended | Display in admin UI |
| `paused_duration_seconds` | integer | Total time paused | Calculate effective SLA utilization |

**SLA State Machine:**
```
[Created] → status = "pending"
  ↓
[Started] → status = "running"
  ↓
  ├─→ [Paused] → status = "paused" (waiting external action)
  │     ↓
  │   [Resumed] → status = "running"
  │
  ├─→ [Extended] → status = "running" (new expires_at)
  │
  ├─→ [Completed] → status = "completed" (reservation success)
  │
  ├─→ [Expired] → status = "expired" (time ran out)
  │
  └─→ [Cancelled] → status = "cancelled" (reservation cancelled)
```

---

### 3.5 OBJECT 4: STATUS_HISTORY

```json
{
  "history_id": "550e8400-e29b-41d4-a716-446655440001",
  "reservation_id": "550e8400-e29b-41d4-a716-446655440000",
  
  "changed_at": "2025-01-02T14:30:00Z",
  "changed_by_user_id": "ADMIN-123",
  "changed_by_user_role": "admin",
  
  "change_type": "status_transition",
  
  "old_status": "active",
  "new_status": "awaiting_documents",
  
  "change_reason": "Documents prepared by admin, awaiting investor signature",
  "change_source": "admin_panel",
  
  "side_effects": [
    {
      "effect_type": "sla_paused",
      "effect_description": "SLA paused – waiting for investor to sign",
      "effect_timestamp": "2025-01-02T14:30:00Z"
    }
  ],
  
  "metadata": {
    "ip_address": "192.168.1.100",
    "user_agent": "Admin Panel v1.2"
  }
}
```

**Field Descriptions:**

| Field | Type | Description | Frontend Usage |
|-------|------|-------------|----------------|
| `changed_by_user_id` | string | Who made the change | Display in audit log ("Změněno: {name}") |
| `changed_by_user_role` | enum | "user" / "admin" / "system" | Badge color (user=blue, admin=orange, system=gray) |
| `old_status` → `new_status` | string | State transition | Show "Active → Awaiting Documents" |
| `change_reason` | string | Why changed | Display in audit log detail |
| `side_effects` | array | What else happened | Show in audit log (e.g., "SLA paused") |

**Audit Log Display (Frontend):**
```
┌────────────────────────────────────────────────────────────────┐
│ AUDIT LOG                                                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ [2.1.2025 14:30] ADMIN: Petr Novák                           │
│ Změna stavu: Active → Awaiting Documents                      │
│ Důvod: Documents prepared by admin, awaiting investor signature│
│                                                                │
│ Vedlejší efekty:                                              │
│ • SLA pozastaveno – čeká se na podpis investora               │
│                                                                │
│────────────────────────────────────────────────────────────────│
│                                                                │
│ [1.1.2025 12:30] USER: Andrea Nováková                       │
│ Rezervace vytvořena                                            │
│ Investor přiřazen: Martina Svobodová                          │
│                                                                │
│ Vedlejší efekty:                                              │
│ • Slot blokován (1 slot)                                       │
│ • SLA spuštěno (48 hodin)                                     │
│ • Provize vytvořena (125 000 Kč – EXPECTED)                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 3.6 SLA STATE → UI MESSAGE MAPPING

| SLA State | SLA Remaining Time | UI Message | Allowed User Actions | Color Code |
|-----------|-------------------|------------|---------------------|------------|
| **Running (> 48h)** | 48+ hours | "SLA: Zbývá {X} dnů {Y} hodin" | View, Cancel | Gray #6B7280 |
| **Running (24-48h)** | 24-48 hours | "SLA: Zbývá {X} hodin" | View, Cancel, Complete action | Orange #F97316 |
| **Running (< 24h)** | < 24 hours | "SLA: Zbývá {X} hodin" | View, Cancel, **URGENT: Complete action** | Red #EF4444 |
| **Paused** | N/A | "Čeká se na: {reason}" | View, Cancel (with warning) | Blue #215EF8 |
| **Expired** | 0 | "Vypršelo {date}" | View only (terminal state) | Gray #6B7280 |
| **Completed** | N/A | "Dokončeno {date}" | View only (terminal state) | Green #14AE6B |
| **Cancelled** | N/A | "Zrušeno {date}" | View only (terminal state) | Gray #6B7280 |

**Frontend Conditional Rendering:**
```javascript
const getSLAUI = (reservation) => {
  const sla = reservation.sla
  
  if (sla.sla_paused) {
    return {
      message: `Čeká se na: ${sla.sla_pause_reason}`,
      color: "#215EF8", // Blue
      icon: "Pause",
      urgency: "neutral"
    }
  }
  
  if (reservation.status === "expired") {
    return {
      message: `Vypršelo ${formatDate(reservation.timestamps.expired_at)}`,
      color: "#6B7280", // Gray
      icon: "XCircle",
      urgency: "terminal"
    }
  }
  
  const { status, displayText, remainingHours } = calculateSLARemaining(reservation)
  
  const colorMap = {
    active: "#6B7280",       // Gray
    expiring_soon: "#F97316", // Orange
    critical: "#EF4444"       // Red
  }
  
  return {
    message: displayText,
    color: colorMap[status],
    icon: "Clock",
    urgency: status
  }
}
```

---

### 3.7 CRON JOB: CHECK SLA EXPIRY

**Endpoint:** `POST /api/cron/check-sla-expiry`

**Schedule:** Every 5 minutes

**Logic:**
```javascript
async function checkSLAExpiry() {
  const now = new Date()
  
  // Find all active reservations with expired SLA
  const expiredReservations = await db.reservations.findMany({
    where: {
      status: { in: ["active", "documents_ready", "sent_to_investor"] },
      "sla.sla_expires_at": { lte: now },
      "sla.sla_paused": false
    }
  })
  
  for (const reservation of expiredReservations) {
    // Transition to EXPIRED
    await transitionReservationStatus(
      reservation.reservation_id,
      "expired",
      "system",
      "SLA deadline exceeded"
    )
    
    // Release slot
    await releaseTicketSlot(
      reservation.ticket_id,
      reservation.slots_count
    )
    
    // Update commission status
    await updateCommissionStatus(
      reservation.commission_id,
      "LOST"
    )
    
    // Send notification
    await sendNotification(
      reservation.user_id,
      "reservation_expired",
      {
        reservation_number: reservation.reservation_number,
        ticket_id: reservation.ticket_id,
        expired_at: now
      }
    )
    
    // Log in status history
    await createStatusHistory({
      reservation_id: reservation.reservation_id,
      changed_by_user_role: "system",
      old_status: reservation.status,
      new_status: "expired",
      change_reason: "Automated SLA expiry",
      side_effects: [
        { effect_type: "slot_released", effect_description: `${reservation.slots_count} slot(s) released` },
        { effect_type: "commission_lost", effect_description: "Commission status → LOST" }
      ]
    })
  }
  
  return {
    checked_at: now,
    expired_count: expiredReservations.length,
    processed_ids: expiredReservations.map(r => r.reservation_id)
  }
}
```

---

## ČÁST 4: ADMIN TOOLS UX SPECIFICATION

### 4.1 ADMIN CAPABILITIES OVERVIEW

**Admin can perform OVERRIDES on:**
1. SLA extension (add time to countdown)
2. Reservation cancellation (force-cancel active reservation)
3. Reservation force-completion (mark as completed before natural progression)
4. Reservation reassignment (change investor)
5. Ticket status change (close, reopen, pause)

**UX Principles:**
- ✅ **Every override requires REASON input** (mandatory field)
- ✅ **Confirmation step** (no accidental clicks)
- ✅ **Serious UI** (no casual tooltips, use modals)
- ✅ **Audit trail** (all actions logged, visible to user)

---

### 4.2 ADMIN OVERRIDE 1: EXTEND SLA

#### ENTRY POINT

**Location:** Admin panel → Reservation Detail → "Extend SLA" button

**Preconditions:**
- Reservation status ∈ {ACTIVE, DOCUMENTS_READY, SENT_TO_INVESTOR}
- SLA not expired
- Max extensions not exceeded (e.g., 2 extensions per reservation)

**UI Component:**

```
┌────────────────────────────────────────────────────────┐
│ [!] EXTEND SLA – RESERVATION RES-2025-001234           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Current SLA:                                           │
│ Expires: 3.1.2025 12:30                               │
│ Remaining: 18 hours                                    │
│                                                        │
│ Extension Duration:                                    │
│ ○ +24 hours (new expiry: 4.1.2025 12:30)              │
│ ○ +48 hours (new expiry: 5.1.2025 12:30)              │
│ ○ Custom: [___] hours                                  │
│                                                        │
│ Reason (required):                                     │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Text area – min 20 characters]                  │  │
│ │                                                  │  │
│ │ Example:                                         │  │
│ │ "Investor requested additional documentation.    │  │
│ │ Extension approved to allow time for review."    │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ⚠ This action will:                                   │
│ • Update SLA deadline                                  │
│ • Log override in audit trail                         │
│ • Notify user (Andrea Nováková)                       │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [Cancel]  [Confirm Extension]                         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Field Validation:**
- Extension duration: 1-72 hours
- Reason: Min 20 characters, max 500 characters
- Reason cannot be generic ("Extension needed") – suggest specific wording

**After Confirmation:**
```
✓ SLA Extended

Reservation: RES-2025-001234
New expiry: 4.1.2025 12:30
Extension: +24 hours
Reason: Investor requested additional documentation...

User notified: Andrea Nováková (email sent)

[View Audit Log]  [Close]
```

**Backend Actions:**
1. Update `sla.sla_expires_at` → new timestamp
2. Add entry to `sla_timer.extensions[]` array
3. Create `status_history` entry (change_type = "sla_extended")
4. Send notification to user
5. Log admin action

---

### 4.3 ADMIN OVERRIDE 2: CANCEL RESERVATION

#### ENTRY POINT

**Location:** Admin panel → Reservation Detail → "Cancel Reservation" button

**Preconditions:**
- Reservation status ≠ PARTNER_CONFIRMED (cannot cancel success state)
- Reservation status ≠ terminal (EXPIRED, CANCELLED_BY_USER, etc.)

**UI Component:**

```
┌────────────────────────────────────────────────────────┐
│ [⚠] CANCEL RESERVATION – RES-2025-001234              │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ⚠ WARNING: This is a destructive action.              │
│                                                        │
│ Reservation Details:                                   │
│ • Ticket: T-001-02 (5 000 000 Kč)                     │
│ • User: Andrea Nováková                               │
│ • Investor: Martina Svobodová                         │
│ • Status: Active                                       │
│ • Created: 1.1.2025 12:30                             │
│                                                        │
│ Consequences:                                          │
│ • Slot will be released (1 slot freed)                │
│ • Commission will be lost (125 000 Kč → LOST)         │
│ • User will be notified (email + in-app)              │
│ • Investor will be notified (if configured)           │
│                                                        │
│ Reason for Cancellation (required):                   │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Text area – min 20 characters]                  │  │
│ │                                                  │  │
│ │ Example:                                         │  │
│ │ "Ticket withdrawn by partner due to project      │  │
│ │ parameter changes. All active reservations       │  │
│ │ cancelled as per partner request."               │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ Type "CANCEL" to confirm:                             │
│ [_____________]                                        │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [Abort]  [Confirm Cancellation]                       │
│           ↑ (Enabled only if "CANCEL" typed)          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Confirmation Pattern:**
- User must type "CANCEL" in text field (prevents accidental clicks)
- "Confirm Cancellation" button disabled until text matches

**After Confirmation:**
```
✓ Reservation Cancelled

Reservation: RES-2025-001234
Cancelled at: 2.1.2025 15:00
Reason: Ticket withdrawn by partner...

Side effects:
• Slot released: 1 slot (ticket T-001-02 now has 8/10 slots)
• Commission lost: 125 000 Kč (COMM-789 → LOST)
• User notified: Andrea Nováková (email sent)
• Investor notified: Martina Svobodová (email sent)

[View Audit Log]  [Close]
```

**Backend Actions:**
1. Update reservation: status → CANCELLED_BY_SYSTEM
2. Release slot: ticket.available_capacity += 1
3. Update commission: status → LOST
4. Send notifications (user + investor)
5. Create status_history entry (with full consequence list)
6. Log admin action

---

### 4.4 ADMIN OVERRIDE 3: FORCE-COMPLETE RESERVATION

#### ENTRY POINT

**Location:** Admin panel → Reservation Detail → "Force Complete" button

**Preconditions:**
- Reservation status ∈ {ACTIVE, DOCUMENTS_READY, SENT_TO_INVESTOR, INVESTOR_SIGNED, PARTNER_REVIEWING}
- NOT already completed (status ≠ PARTNER_CONFIRMED)

**Use Case:**
- Investment agreement signed outside normal flow (e.g., offline signature)
- Admin needs to manually mark as completed

**UI Component:**

```
┌────────────────────────────────────────────────────────┐
│ [✓] FORCE-COMPLETE RESERVATION – RES-2025-001234      │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Current Status: Sent to Investor                       │
│                                                        │
│ ⚠ Force-completing will:                              │
│ • Mark reservation as SUCCESS                          │
│ • Mark commission as EARNED (125 000 Kč)              │
│ • Lock slot permanently (no release)                   │
│ • Stop SLA countdown                                   │
│ • Notify user of success                               │
│                                                        │
│ Upload Investment Agreement (required):                │
│ [Choose file...] agreement_T-001-02_signed.pdf        │
│                                                        │
│ Completion Date:                                       │
│ [Date picker] → 5.1.2025                              │
│                                                        │
│ Reason for Force-Completion (required):               │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Text area]                                      │  │
│ │                                                  │  │
│ │ Example:                                         │  │
│ │ "Investor signed agreement offline (physical     │  │
│ │ signature). Agreement uploaded by partner.       │  │
│ │ Manual completion approved by compliance."       │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [Cancel]  [Confirm Force-Complete]                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Field Validation:**
- Investment agreement: Required PDF upload
- Completion date: Cannot be future date
- Reason: Min 30 characters (more detail required for manual completion)

**After Confirmation:**
```
✓ Reservation Force-Completed

Reservation: RES-2025-001234
Status: Active → PARTNER_CONFIRMED
Completed at: 5.1.2025 16:00

Side effects:
• Commission earned: 125 000 Kč (COMM-789 → EARNED)
• Slot locked permanently (no release)
• SLA stopped
• User notified: Andrea Nováková (success email sent)
• Investment agreement uploaded: agreement_T-001-02_signed.pdf

[View Audit Log]  [View Commission]  [Close]
```

**Backend Actions:**
1. Update reservation: status → PARTNER_CONFIRMED
2. Update commission: status → EARNED
3. Upload investment agreement document
4. Stop SLA timer
5. Send success notification to user
6. Create status_history entry (change_type = "force_completed")
7. Log admin action with override flag

---

### 4.5 ADMIN OVERRIDE 4: REASSIGN INVESTOR

#### ENTRY POINT

**Location:** Admin panel → Reservation Detail → "Reassign Investor" button

**Preconditions:**
- Reservation status ∈ {ACTIVE, DOCUMENTS_READY} (not after investor signed)
- Investor not yet signed documents

**Use Case:**
- Original investor unavailable
- User requests change (via support)

**UI Component:**

```
┌────────────────────────────────────────────────────────┐
│ [↔] REASSIGN INVESTOR – RES-2025-001234               │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Current Investor:                                      │
│ Martina Svobodová                                      │
│ Assigned: 1.1.2025 12:30                              │
│                                                        │
│ New Investor:                                          │
│ [🔍 Search investor...]                               │
│                                                        │
│ ┌──────────────────────────────────────────────────┐  │
│ │ ☐ Petr Novák                                     │  │
│ │   Kapacita: 1 200 000 Kč · Match: 85%            │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌──────────────────────────────────────────────────┐  │
│ │ ☐ Jana Procházková                               │  │
│ │   Kapacita: 900 000 Kč · Match: 89%              │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ Reason for Reassignment (required):                   │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Text area]                                      │  │
│ │                                                  │  │
│ │ Example:                                         │  │
│ │ "Original investor unavailable due to travel.    │  │
│ │ User requested change via support ticket #1234.  │  │
│ │ New investor approved by compliance."            │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [Cancel]  [Confirm Reassignment]                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**After Confirmation:**
```
✓ Investor Reassigned

Reservation: RES-2025-001234
Old investor: Martina Svobodová
New investor: Jana Procházková
Reassigned at: 2.1.2025 10:00

User notified: Andrea Nováková (change confirmation sent)

[View Audit Log]  [Close]
```

**Backend Actions:**
1. Update reservation: investor_id → new_investor_id
2. Create status_history entry (change_type = "investor_reassigned")
3. Send notification to user (reassignment confirmation)
4. Log admin action

---

### 4.6 ADMIN OVERRIDE 5: CHANGE TICKET STATUS

#### ENTRY POINT

**Location:** Admin panel → Ticket Detail → "Change Status" button

**Preconditions:**
- Admin has permission (ticket_status_override role)

**UI Component:**

```
┌────────────────────────────────────────────────────────┐
│ [⚙] CHANGE TICKET STATUS – T-001-02                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Current Status: Active                                 │
│                                                        │
│ New Status:                                            │
│ ○ Active                                               │
│ ○ Paused                                               │
│ ○ Closed                                               │
│                                                        │
│ [If Paused selected:]                                  │
│ Pause Reason:                                          │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Text area]                                      │  │
│ │ Example: "Project documents under review"        │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ [If Closed selected:]                                  │
│ ⚠ WARNING: Closing this ticket will affect:           │
│ • 3 active reservations (see list below)              │
│                                                        │
│ What to do with active reservations?                  │
│ ○ Cancel all active reservations                      │
│ ○ Let active reservations complete (close to new only)│
│                                                        │
│ Close Reason:                                          │
│ ┌──────────────────────────────────────────────────┐  │
│ │ [Text area – min 20 characters]                  │  │
│ │ Example: "Ticket withdrawn by partner"           │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [Cancel]  [Confirm Status Change]                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**After Confirmation (if closing ticket):**
```
✓ Ticket Closed

Ticket: T-001-02
Status: Active → Closed
Closed at: 2.1.2025 11:00
Reason: Ticket withdrawn by partner

Active reservations affected: 3
• RES-2025-001198 → CANCELLED_BY_SYSTEM (user: Andrea Nováková)
• RES-2025-001199 → CANCELLED_BY_SYSTEM (user: Petr Svoboda)
• RES-2025-001200 → CANCELLED_BY_SYSTEM (user: Milan Dvořák)

All affected users notified.

[View Audit Log]  [Close]
```

**Backend Actions:**
1. Update ticket: status → "closed", is_active → false
2. IF "Cancel all reservations" selected:
   - Transition all active reservations → CANCELLED_BY_SYSTEM
   - Release all slots
   - Update all commissions → LOST
   - Send notifications to all affected users
3. Create status_history entries for ticket + all affected reservations
4. Log admin action

---

### 4.7 AUDIT LOG UX

#### INLINE AUDIT PREVIEW (Reservation Detail)

**Location:** Reservation Detail page → "Audit Log" section (collapsible)

```
┌────────────────────────────────────────────────────────┐
│ AUDIT LOG (Showing last 5 events)                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ [2.1.2025 14:30] ADMIN: Petr Novák                   │
│ • SLA Extended: +24 hours                             │
│ • New expiry: 4.1.2025 12:30                          │
│ • Reason: "Investor requested additional docs"        │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [1.1.2025 18:00] SYSTEM                               │
│ • Status: Active → Documents Ready                     │
│ • Side effect: SLA resumed (was paused 6 hours)       │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [1.1.2025 12:00] ADMIN: Jana Dvořáková               │
│ • Status: Active → Awaiting Documents                  │
│ • Side effect: SLA paused                             │
│ • Reason: "Documents being prepared"                   │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [1.1.2025 12:30] USER: Andrea Nováková                │
│ • Reservation created                                  │
│ • Investor: Martina Svobodová                         │
│ • Side effects:                                        │
│   - Slot locked (1 slot)                              │
│   - SLA started (48 hours)                            │
│   - Commission created (125 000 Kč – EXPECTED)        │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [View Full Audit Log →]                                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Visual Treatment:**
- **Admin actions:** Orange badge "ADMIN" + admin name
- **System actions:** Gray badge "SYSTEM"
- **User actions:** Blue badge "USER" + user name
- **Timestamps:** Absolute datetime (not relative like "2 hours ago")
- **Side effects:** Indented bullet list under main action

---

#### FULL AUDIT LOG VIEW (Table)

**Location:** Admin panel → Audit Logs → Filter by reservation ID

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ AUDIT LOG – RESERVATION RES-2025-001234                                                                                   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                            │
│ Timestamp            │ Actor        │ Action Type           │ Old Value      │ New Value           │ Reason              │
│──────────────────────┼──────────────┼───────────────────────┼────────────────┼─────────────────────┼─────────────────────│
│ 2.1.2025 14:30:00    │ ADMIN        │ SLA Extended          │ Exp: 3.1 12:30 │ Exp: 4.1 12:30      │ Investor requested… │
│                      │ Petr Novák   │                       │                │ (+24h)              │                     │
│──────────────────────┼──────────────┼───────────────────────┼────────────────┼─────────────────────┼─────────────────────│
│ 1.1.2025 18:00:00    │ SYSTEM       │ Status Transition     │ Active         │ Documents Ready     │ Auto-transition     │
│──────────────────────┼──────────────┼───────────────────────┼────────────────┼─────────────────────┼─────────────────────│
│ 1.1.2025 12:00:00    │ ADMIN        │ Status Transition     │ Active         │ Awaiting Documents  │ Docs being prepared │
│                      │ Jana Dvořák  │                       │                │                     │                     │
│──────────────────────┼──────────────┼───────────────────────┼────────────────┼─────────────────────┼─────────────────────│
│ 1.1.2025 12:30:00    │ USER         │ Reservation Created   │ –              │ Active              │ –                   │
│                      │ Andrea N.    │                       │                │                     │                     │
│──────────────────────┴──────────────┴───────────────────────┴────────────────┴─────────────────────┴─────────────────────│
│                                                                                                                            │
│ [Export CSV]  [Filter by Actor]  [Filter by Action Type]                                                                  │
│                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- **Sortable columns** (timestamp, actor, action type)
- **Filterable** (by actor role, action type, date range)
- **Exportable** (CSV download for compliance)
- **Read-only** (no edit/delete buttons – audit trail immutable)

---

### 4.8 ADMIN UI SEPARATION (USER-FACING VS. ADMIN-ONLY)

#### USER-FACING UI (Reservation Detail)

**Visible to User:**
```
┌────────────────────────────────────────────────────────┐
│ REZERVACE RES-2025-001234                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Status: Aktivní                                        │
│ SLA: Zbývá 36 hodin                                    │
│                                                        │
│ [If admin override occurred:]                          │
│ ℹ Rezervace byla upravena administrátorem:            │
│   • SLA prodlouženo o 24 hodin                        │
│   • Důvod: "Investor požádal o dodatečnou dokumentaci"│
│   • Upraveno: 2.1.2025 14:30 (Administrátor: Petr N.) │
│                                                        │
│ [View full history →] (shows inline audit log)         │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ [Zrušit rezervaci]                                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**User sees:**
- ✅ Override happened (transparency)
- ✅ What changed (SLA extended by 24h)
- ✅ Why changed (admin's reason)
- ✅ Who changed it (admin name)
- ❌ Does NOT see: Admin UI controls (cannot extend SLA themselves)

---

#### ADMIN-ONLY UI (Admin Panel – Same Reservation)

**Visible to Admin:**
```
┌────────────────────────────────────────────────────────┐
│ ADMIN: RESERVATION RES-2025-001234                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Status: Active                                         │
│ SLA: 36 hours remaining (expires 4.1.2025 12:30)      │
│                                                        │
│ User: Andrea Nováková                                  │
│ Investor: Martina Svobodová                            │
│ Ticket: T-001-02                                       │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ ADMIN ACTIONS:                                         │
│ [Extend SLA]  [Cancel Reservation]  [Reassign Investor]│
│ [Force Complete]  [Change Status]                     │
│                                                        │
│────────────────────────────────────────────────────────│
│                                                        │
│ OVERRIDE HISTORY (2):                                  │
│ • SLA Extended: +24h (2.1.2025 14:30 by Petr Novák)   │
│ • Investor Reassigned: M.Svobodová → J.Procházková    │
│   (1.1.2025 16:00 by Jana Dvořáková)                  │
│                                                        │
│ [View Full Audit Log]                                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Admin sees:**
- ✅ All user-facing data
- ✅ Admin action buttons (powerful controls)
- ✅ Override history (quick summary)
- ✅ Full audit log access

**Separation Enforcement:**
- Admin UI: Separate route (`/admin/reservations/{id}`) with authentication check
- User UI: Public route (`/reservations/{id}`) – admin buttons NOT rendered
- Backend: Role-based access control (RBAC) on all override endpoints

---

## CONCLUSION

**This document provides:**
✅ **3 UI Variants compared** (Table, Cards, Hybrid) with recommendation (Hybrid wins)
✅ **Complete Microcopy Checklist** (compliance-safe, trust-building, 60+ examples)
✅ **Dev-Ready SLA Schema** (4 JSON objects, state machine, CRON job logic)
✅ **Admin Tools UX Spec** (5 override flows, audit log, user vs. admin separation)

**Implementation Status:** Ready for development

**Next Steps:**
1. **Design:** Create high-fidelity mockups for Hybrid table variant
2. **Copy:** Review microcopy checklist with legal/compliance
3. **Backend:** Implement SLA schema + CRON job
4. **Admin:** Build admin panel with override flows
5. **QA:** Test all override scenarios + audit log integrity

---

**END OF DOCUMENT**

**Last Updated:** 2025-01-01
**Document Status:** Complete
**Coverage:** UI Design + Compliance + Backend + Admin Tooling
