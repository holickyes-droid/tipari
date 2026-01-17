# 🎨 TIPARI.CZ - KOMPLETNÍ DESIGN SYSTEM
**Platforma:** Tipari.cz B2B Investiční Katalog  
**Verze:** v2.3 (Prompt 53 Update)  
**Status:** ✅ AKTIVNÍ  
**Datum:** 17. ledna 2026  
**Autor:** Tipari.cz Design Team

---

## 📋 OBSAH

1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography System](#typography-system)
4. [Spacing & Layout](#spacing--layout)
5. [Border & Radius](#border--radius)
6. [Shadows & Elevation](#shadows--elevation)
7. [Animation System](#animation-system)
8. [Component Library](#component-library)
9. [Usage Guidelines](#usage-guidelines)
10. [Implementation Examples](#implementation-examples)
11. [Reference Documentation](#reference-documentation)

---

## 🎯 BRAND IDENTITY

### Brand Colors (Primary Palette)

```css
/* Primary - Blue */
--color-brand-blue: #215EF8;
--color-brand-blue-dark: #1a4bc6;
--color-brand-blue-light: #EEF3FF;

/* Success - Green */
--color-brand-green: #14AE6B;
--color-brand-green-dark: #0f8d54;
--color-brand-green-light: #E8F8F1;

/* Dark - Navy */
--color-brand-navy: #040F2A;
--color-brand-navy-light: #1a2742;

/* Commission/Premium - Gold */
--color-commission: #F59E0B;
--color-commission-dark: #D97706;
--color-commission-light: #FEF3C7;
```

### Semantic Colors

```css
--color-success: #14AE6B;    /* Schválené stavy, pozitivní akce */
--color-warning: #F59E0B;    /* Upozornění, čekající akce */
--color-danger: #EF4444;     /* Chyby, odmítnuté stavy */
--color-info: #215EF8;       /* Informace, odkazy */
```

### Brand Usage Rules

| Color | Usage | Examples |
|-------|-------|----------|
| **#215EF8** (Blue) | Primární akce, odkazy, focus states | Tlačítka "Rezervovat", aktivní stavy |
| **#14AE6B** (Green) | Success states, potvrzení, provize | "Schváleno", finální potvrzení |
| **#040F2A** (Navy) | Texty, headingy, dark mode | Nadpisy, hlavní text |
| **#F59E0B** (Gold) | Provize, premium features | Odhad provize, VIP značky |

---

## 🎨 COLOR PALETTE

### Primary System Colors

```css
--background: #ffffff;
--foreground: oklch(0.145 0 0);        /* ~#040F2A */
--card: #ffffff;
--card-foreground: oklch(0.145 0 0);
--popover: oklch(1 0 0);
--popover-foreground: oklch(0.145 0 0);
--primary: #030213;
--primary-foreground: oklch(1 0 0);
--secondary: oklch(0.95 0.0058 264.53);
--secondary-foreground: #030213;
--muted: #ececf0;
--muted-foreground: #717182;
--accent: #e9ebef;
--accent-foreground: #030213;
--destructive: #d4183d;
--destructive-foreground: #ffffff;
--border: rgba(0, 0, 0, 0.1);
--input: transparent;
--input-background: #f3f3f5;
--switch-background: #cbced4;
--ring: oklch(0.708 0 0);
```

### Chart Colors

```css
--chart-1: oklch(0.646 0.222 41.116);  /* Orange */
--chart-2: oklch(0.6 0.118 184.704);   /* Teal */
--chart-3: oklch(0.398 0.07 227.392);  /* Blue */
--chart-4: oklch(0.828 0.189 84.429);  /* Yellow */
--chart-5: oklch(0.769 0.188 70.08);   /* Green */
```

### Dark Mode Support

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --primary: oklch(0.985 0 0);
  /* ... kompletní dark mode definice v theme.css */
}
```

---

## ✍️ TYPOGRAPHY SYSTEM

### Font Family

```css
--font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Import:** `/src/styles/fonts.css`

### Typography Scale

#### 1. Display / Page Title
```css
--type-display-page-size: 2rem;           /* 32px */
--type-display-page-line: 2.5rem;         /* 40px */
--type-display-page-weight: 700;
--type-display-page-spacing: -0.02em;
```
**Usage:** Hlavní nadpisy stránek (H1)

#### 2. Heading / Section
```css
--type-heading-section-size: 1.25rem;     /* 20px */
--type-heading-section-line: 1.75rem;     /* 28px */
--type-heading-section-weight: 600;
--type-heading-section-spacing: -0.01em;
```
**Usage:** Sekce nadpisy (H2)

#### 3. Heading / Subsection
```css
--type-heading-subsection-size: 1rem;     /* 16px */
--type-heading-subsection-line: 1.5rem;   /* 24px */
--type-heading-subsection-weight: 600;
--type-heading-subsection-spacing: -0.01em;
```
**Usage:** Podnadpisy (H3)

#### 4. Body / Primary
```css
--type-body-primary-size: 0.875rem;       /* 14px */
--type-body-primary-line: 1.375rem;       /* 22px */
--type-body-primary-weight: 400;
--type-body-primary-spacing: 0;
```
**Usage:** Hlavní text odstavců, popisky

#### 5. Body / Secondary
```css
--type-body-secondary-size: 0.8125rem;    /* 13px */
--type-body-secondary-line: 1.25rem;      /* 20px */
--type-body-secondary-weight: 400;
--type-body-secondary-spacing: 0;
```
**Usage:** Vedlejší text, metadata

#### 6. Label / Strong
```css
--type-label-strong-size: 0.8125rem;      /* 13px */
--type-label-strong-line: 1.125rem;       /* 18px */
--type-label-strong-weight: 500;
--type-label-strong-spacing: 0.01em;
```
**Usage:** Form labels, důležité štítky

#### 7. Label / Muted
```css
--type-label-muted-size: 0.75rem;         /* 12px */
--type-label-muted-line: 1rem;            /* 16px */
--type-label-muted-weight: 400;
--type-label-muted-spacing: 0.02em;
```
**Usage:** Pomocné texty, poznámky

#### 8. Number / Metric L
```css
--type-number-metric-l-size: 1.5rem;      /* 24px */
--type-number-metric-l-line: 2rem;        /* 32px */
--type-number-metric-l-weight: 600;
--type-number-metric-l-spacing: -0.01em;
```
**Usage:** Velké číselné hodnoty, metriky

#### 9. Number / Metric M
```css
--type-number-metric-m-size: 1rem;        /* 16px */
--type-number-metric-m-line: 1.5rem;      /* 24px */
--type-number-metric-m-weight: 600;
--type-number-metric-m-spacing: -0.01em;
```
**Usage:** Střední číselné hodnoty

#### 10. Button / Primary
```css
--type-button-primary-size: 0.875rem;     /* 14px */
--type-button-primary-line: 1.25rem;      /* 20px */
--type-button-primary-weight: 600;
--type-button-primary-spacing: 0.01em;
```
**Usage:** Primární tlačítka (CTA)

#### 11. Button / Secondary
```css
--type-button-secondary-size: 0.875rem;   /* 14px */
--type-button-secondary-line: 1.25rem;    /* 20px */
--type-button-secondary-weight: 500;
--type-button-secondary-spacing: 0.01em;
```
**Usage:** Sekundární tlačítka

#### 12. Badge / Status
```css
--type-badge-status-size: 0.75rem;        /* 12px */
--type-badge-status-line: 1rem;           /* 16px */
--type-badge-status-weight: 500;
--type-badge-status-spacing: 0.02em;
```
**Usage:** Status badges, labely

#### 13. Table / Cell
```css
--type-table-cell-size: 0.875rem;         /* 14px */
--type-table-cell-line: 1.25rem;          /* 20px */
--type-table-cell-weight: 400;
--type-table-cell-spacing: 0;
```
**Usage:** Obsah tabulkových buněk

#### 14. Table / Header
```css
--type-table-header-size: 0.8125rem;      /* 13px */
--type-table-header-line: 1.125rem;       /* 18px */
--type-table-header-weight: 500;
--type-table-header-spacing: 0.02em;
```
**Usage:** Hlavičky tabulek

### Typography Utilities

```css
/* Tabular Numbers - zarovnání čísel */
.tabular-nums {
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
}

/* Value Typography - důležité číselné hodnoty */
.text-value {
  @apply tabular-nums font-bold;
}
```

---

## 📐 SPACING & LAYOUT

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Layout Guidelines

| Element | Spacing | Token |
|---------|---------|-------|
| Card Padding | 20px | `var(--space-5)` |
| Card Gap | 24px | `var(--space-6)` |
| Section Gap | 32px | `var(--space-8)` |
| Button Padding | 12px 20px | `var(--space-3) var(--space-5)` |
| Input Padding | 12px 16px | `var(--space-3) var(--space-4)` |

### Grid System

```
Columns:    3 (desktop), 2 (tablet), 1 (mobile)
Gap:        24px (var(--space-6))
Max Width:  1440px
Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
```

---

## 🔲 BORDER & RADIUS

### Border Radius Scale

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Plný kruh */

/* Base Radius (pro shadcn/ui) */
--radius: 0.625rem;     /* 10px */
```

### Usage Examples

| Component | Radius | Token |
|-----------|--------|-------|
| Cards | 12px | `var(--radius-lg)` |
| Buttons | 8px | `var(--radius-md)` |
| Inputs | 8px | `var(--radius-md)` |
| Badges | 6px | `var(--radius-sm)` |
| Avatars | 9999px | `var(--radius-full)` |
| Modals | 16px | `var(--radius-xl)` |

---

## 🌓 SHADOWS & ELEVATION

### Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Elevation System

| Level | Shadow | Usage |
|-------|--------|-------|
| **Level 0** | None | Flat surfaces, backgrounds |
| **Level 1** | `shadow-sm` | Cards, tiles (default state) |
| **Level 2** | `shadow-md` | Cards on hover, dropdowns |
| **Level 3** | `shadow-lg` | Modals, popovers, overlays |

---

## 🎬 ANIMATION SYSTEM

### Base Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in { animation: fadeIn 150ms ease-out; }
.animate-fade-in-slow { animation: fadeIn 200ms ease-out; }
```

#### Slide Animations
```css
/* Slide In Top */
@keyframes slideInTop {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide Left */
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide Right */
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

#### Scale & Pop
```css
/* Modal Scale Up */
@keyframes modalScaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Pop Animation */
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```

#### State Animations
```css
/* Success Pulse */
@keyframes successPulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}

/* Checkbox Bounce */
@keyframes checkboxBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
```

### Animation Classes

```css
.animate-fade-in           /* 150ms fade */
.animate-fade-in-slow      /* 200ms fade */
.animate-slide-in-top      /* 250ms slide from top */
.animate-slide-left        /* 250ms slide from right */
.animate-slide-right       /* 250ms slide from left */
.animate-modal-enter       /* 300ms modal entry */
.animate-pop               /* 120ms pop effect */
.animate-success-pulse     /* 180ms success pulse */
.animate-checkbox-bounce   /* 90ms checkbox bounce */
.animate-banner-scale      /* 400ms banner emphasis */
```

### Stagger Animation
```css
.stagger-fade > * {
  animation: fadeIn 150ms ease-out;
  animation-fill-mode: backwards;
}

.stagger-fade > *:nth-child(1) { animation-delay: 0ms; }
.stagger-fade > *:nth-child(2) { animation-delay: 50ms; }
.stagger-fade > *:nth-child(3) { animation-delay: 100ms; }
/* ... up to :nth-child(10) with 450ms delay */
```

### Microinteractions

```css
/* Hover Scale Effect */
.hover-scale {
  @apply transition-transform duration-200 ease-out;
}
.hover-scale:hover {
  @apply scale-[1.02];
}
```

---

## 🧩 COMPONENT LIBRARY

### Umístění
`/src/app/components/ui/`

### Core Components (shadcn/ui)

| Component | File | Usage |
|-----------|------|-------|
| **Button** | `button.tsx` | Primární/sekundární akce |
| **Card** | `card.tsx` | Content containers |
| **Badge** | `badge.tsx` | Status indicators |
| **Input** | `input.tsx` | Text inputs |
| **Label** | `label.tsx` | Form labels |
| **Select** | `select.tsx` | Dropdown selections |
| **Checkbox** | `checkbox.tsx` | Boolean inputs |
| **Switch** | `switch.tsx` | Toggle switches |
| **Dialog** | `dialog.tsx` | Modal dialogs |
| **Drawer** | `drawer.tsx` | Side panels |
| **Dropdown Menu** | `dropdown-menu.tsx` | Context menus |
| **Popover** | `popover.tsx` | Floating content |
| **Toast** | `sonner.tsx` | Notifications |
| **Table** | `table.tsx` | Data tables |
| **Tabs** | `tabs.tsx` | Tab navigation |
| **Accordion** | `accordion.tsx` | Collapsible sections |
| **Alert** | `alert.tsx` | Alert messages |
| **Avatar** | `avatar.tsx` | User avatars |
| **Calendar** | `calendar.tsx` | Date picker |
| **Chart** | `chart.tsx` | Data visualization |
| **Progress** | `progress.tsx` | Progress bars |
| **Skeleton** | `skeleton.tsx` | Loading states |
| **Tooltip** | `tooltip.tsx` | Hover info |

### Custom Tipari Components

| Component | Location | Purpose |
|-----------|----------|---------|
| **ReservationModalRedesign** | `/dev/` | Nový rezervační flow (Prompt 53) |
| **TicketsPageNew_dev** | `/dev/` | Hlavní stránka tiketů |
| **NotificationBanner_dev** | `/dev/` | Toast notifications |
| **RoleSwitchTester** | `/system/` | Role testing (Test 51-A) |
| **SlaDashboard** | `/system/` | SLA monitoring |

---

## 📚 USAGE GUIDELINES

### DO ✅

#### 1. Use Design Tokens
```tsx
// GOOD ✅
<div style={{ 
  color: 'var(--color-brand-blue)',
  fontSize: 'var(--type-body-primary-size)',
  padding: 'var(--space-4)'
}}>
  Content
</div>
```

#### 2. Use Component Library
```tsx
// GOOD ✅
import { Button } from '@/app/components/ui/button';

<Button variant="default">Rezervovat</Button>
```

#### 3. Additive Extensions
```tsx
// GOOD ✅
<div className="relative">
  <OriginalComponent />
  <Badge className="absolute -top-2 -right-2">New</Badge>
</div>
```

#### 4. Consistent Spacing
```tsx
// GOOD ✅
<div className="space-y-6">  {/* 24px gap */}
  <Section />
  <Section />
</div>
```

### DON'T ❌

#### 1. Custom Values
```tsx
// BAD ❌
<div style={{ 
  color: '#FF5733',  // Custom color!
  fontSize: '15px',  // Off-scale size!
  padding: '13px'    // Random spacing!
}}>
  Content
</div>
```

#### 2. Inline Styles Override
```tsx
// BAD ❌
<Button style={{ fontSize: '18px', padding: '25px' }}>
  Custom Button
</Button>
```

#### 3. Direct Component Modification
```tsx
// BAD ❌
<TicketCard className="p-8 text-2xl" /> {/* Breaking layout! */}
```

#### 4. Non-Semantic Colors
```tsx
// BAD ❌
<div className="bg-purple-500 text-pink-400">
  Random colors
</div>
```

---

## 💻 IMPLEMENTATION EXAMPLES

### Example 1: Ticket Card (Correct)

```tsx
import { Card, CardHeader, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

export function TicketCard({ ticket }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#040F2A]">
            {ticket.name}
          </h3>
          <Badge variant="default" className="bg-[#215EF8]">
            Dostupný
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm text-gray-600">Investiční částka:</span>
          <p className="text-xl font-semibold text-[#040F2A] tabular-nums">
            {ticket.amount.toLocaleString('cs-CZ')} Kč
          </p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Výnos p.a.:</span>
          <p className="text-lg font-semibold text-[#14AE6B]">
            {ticket.yield}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Example 2: Modal with Animation

```tsx
import { Dialog, DialogContent } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

export function ReservationModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] animate-modal-enter">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-[#040F2A]">
            Nová rezervace
          </h2>
          
          <div className="space-y-4">
            {/* Content */}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Zrušit
            </Button>
            <Button className="bg-[#215EF8] hover:bg-[#1a4bc6]">
              Potvrdit →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Example 3: Status Badge System

```tsx
const statusConfig = {
  available: {
    color: '#215EF8',
    bg: '#EEF3FF',
    label: 'Dostupný'
  },
  reserved: {
    color: '#F59E0B',
    bg: '#FEF3C7',
    label: 'Rezervováno'
  },
  completed: {
    color: '#14AE6B',
    bg: '#E8F8F1',
    label: 'Dokončeno'
  }
};

export function StatusBadge({ status }) {
  const config = statusConfig[status];
  
  return (
    <Badge
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
      className="font-medium"
    >
      {config.label}
    </Badge>
  );
}
```

### Example 4: Form with Design Tokens

```tsx
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

export function InvestorForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold">
          Jméno investora *
        </Label>
        <Input
          id="name"
          placeholder="Jan Novák"
          className="h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold">
          E-mail *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="investor@email.cz"
          className="h-12"
        />
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-[#215EF8] hover:bg-[#1a4bc6]"
      >
        Odeslat
      </Button>
    </form>
  );
}
```

---

## 📖 REFERENCE DOCUMENTATION

### Primary Documentation Files

| File | Location | Purpose |
|------|----------|---------|
| **Design System Summary** | `/DESIGN_SYSTEM_SUMMARY.md` | Master index & quick reference |
| **Design Constraints** | `/DESIGN_CONSTRAINTS_TIKETY.md` | Preservation rules |
| **Design Tokens** | `/TIKETY_DESIGN_TOKENS.md` | Token reference |
| **Extension Guide** | `/TIKETY_EXTENSION_GUIDE.md` | Implementation patterns |
| **Design System Logic** | `/DESIGN_SYSTEM_LOGIC.md` | System logic |

### CSS Files

| File | Location | Content |
|------|----------|---------|
| **Theme Tokens** | `/src/styles/theme.css` | ⭐ HLAVNÍ SOUBOR - všechny tokeny |
| **Font Imports** | `/src/styles/fonts.css` | Inter font import |
| **Tailwind Config** | `/src/styles/tailwind.css` | Tailwind v4 setup |
| **Index** | `/src/styles/index.css` | Main CSS entry point |

### Component Documentation

| Documentation | Location |
|---------------|----------|
| UI Components | `/src/app/components/ui/` |
| Dev Components | `/src/app/components/dev/` |
| System Components | `/src/app/components/system/` |

---

## 🔐 DESIGN CONSTRAINTS

### Tikety Page: STRICT MODE

**LOCKED:**
- ✅ Typography (size, weight, line-height)
- ✅ Layout (grid, spacing, alignment)
- ✅ Colors (brand palette only)
- ✅ Spacing (token-based only)

**ALLOWED:**
- ✅ Overlay patterns (modals, tooltips)
- ✅ Badge additions (absolute positioning)
- ✅ Role-based logic (visibility, permissions)
- ✅ Animation (within guidelines)

### Other Pages: FLEXIBLE MODE

**REQUIRED:**
- ✅ Use design tokens
- ✅ Follow brand colors
- ✅ Maintain Inter font
- ✅ Consistent spacing scale

**ALLOWED:**
- ✅ Flexible layouts
- ✅ Custom component arrangements
- ✅ New components
- ✅ Creative extensions

---

## 🚀 QUICK START CHECKLIST

### Before Adding Features

- [ ] Review `/DESIGN_SYSTEM_SUMMARY.md`
- [ ] Check design tokens in `/src/styles/theme.css`
- [ ] Browse UI components in `/src/app/components/ui/`
- [ ] Understand constraints (Tikety = STRICT, Others = FLEXIBLE)
- [ ] Plan additive approach (overlays, not modifications)

### During Implementation

- [ ] Use CSS custom properties (`var(--token)`)
- [ ] Import from component library
- [ ] Apply brand colors (#215EF8, #14AE6B, #040F2A)
- [ ] Use spacing scale (4px increments)
- [ ] Add animations from design system
- [ ] Test responsive behavior

### Before Deployment

- [ ] Visual regression test (no layout shifts)
- [ ] Typography preserved (size, weight, spacing)
- [ ] Colors match brand palette
- [ ] Spacing follows token scale
- [ ] Animations smooth and performant
- [ ] Dark mode support (if applicable)
- [ ] Code review approved

---

## 🎯 DESIGN PRINCIPLES

### 1. Consistency First
> "Every element should feel like it belongs to the same family."

### 2. Performance Matters
> "Animations should enhance, not hinder user experience."

### 3. Accessibility Always
> "Design for all users, including those with disabilities."

### 4. Mobile-First
> "Start with mobile constraints, expand to desktop."

### 5. Token-Driven
> "Never hardcode values that have tokens."

### 6. Additive Extensions
> "Preserve original, extend with overlays."

---

## 📊 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| **v2.3** | 2026-01-17 | Prompt 53: Reservation UX Flow Redesign |
| **v2.2** | 2026-01-16 | Test 51-A: Role Switch Testing Module |
| **v2.1** | 2026-01-08 | Design System documentation created |
| **v2.0** | 2026-01-05 | Tikety base design established |
| **v1.6** | — | Hybrid Tipari Assets introduced |

---

## 💡 SUPPORT & QUESTIONS

### Design Questions
→ Check `/DESIGN_CONSTRAINTS_TIKETY.md`

### Token Questions
→ Check `/src/styles/theme.css` or `/TIKETY_DESIGN_TOKENS.md`

### Implementation Questions
→ Check `/TIKETY_EXTENSION_GUIDE.md`

### Component Questions
→ Browse `/src/app/components/ui/` + shadcn/ui docs

### Still Unsure?
→ Ask design team before implementing

---

## ✅ FINAL NOTES

**Remember:**
1. **Preserve first** - Don't modify existing designs (especially Tikety page)
2. **Token-driven** - Always use design tokens, never hardcode
3. **Component library** - Use shadcn/ui components as foundation
4. **Additive approach** - Extend with overlays, modals, badges
5. **Test everything** - Visual regression, responsive, accessibility

**Brand Colors Memory Aid:**
- 🔵 **#215EF8** = Primary Blue (Actions, Links)
- 🟢 **#14AE6B** = Success Green (Confirmations)
- ⚫ **#040F2A** = Navy Dark (Text, Headers)
- 🟡 **#F59E0B** = Commission Gold (Premium)

---

**Created:** 17. ledna 2026  
**Status:** ✅ AKTIVNÍ  
**Compliance:** POVINNÉ  
**Review:** REQUIRED

**Tipari.cz Design System v2.3** 🎨
