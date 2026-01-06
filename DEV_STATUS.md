# 🚧 SAFE DEV ZONE — STATUS REPORT

**Datum aktivace:** 2026-01-06  
**Status:** ✅ ACTIVE — Development Mode Unlocked

---

## 📦 DEV KOPIE VYTVOŘENY

| Source (LOCKED v2.1) | Dev Copy (UNLOCKED) | Status | Safe to Edit |
|----------------------|---------------------|--------|--------------|
| TicketsPageNew.tsx | ✅ TicketsPageNew_dev.tsx | 🔓 ACTIVE | ✅ YES |
| TicketsTileView.tsx | ✅ TicketsTileView_dev.tsx | 🔓 ACTIVE | ✅ YES |
| TicketsTableView.tsx | ⏳ TBD | 🔒 PENDING | ⏳ On request |
| useTicketsPageLogic.ts | ⏳ TBD | 🔒 PENDING | ⏳ On request |

---

## ✅ TicketsPageNew_dev.tsx — DEV KOPIE

### Změny oproti produkční verzi v2.1:

```diff
Header:
- 🧩 TIPARI SAFE SNAPSHOT v2.1
+ 🧩 TICKETS PAGE DEV MODE
+ Status: 🔓 UNLOCKED - Development Active
+ ⚠️ Změny v tomto souboru se NETÝKAJÍ produkčního buildu!

Imports:
- import { TicketsTileView } from './TicketsTileView';
+ import { TicketsTileViewDev } from './TicketsTileView_dev';
  (upraveno pro dev verzi TileView)

Data:
- export const MOCK_TICKETS: TicketData[]
+ export const MOCK_TICKETS_DEV: TicketData[]
  (oddělená dev data - neovlivní produkci)

Component Name:
- function TicketsPageNew
+ function TicketsPageNewDev

Props Interface:
- interface TicketsPageNewProps
+ interface TicketsPageNewDevProps

Exports:
- export { TicketsPageNew }
+ export { TicketsPageNewDev }
+ export { MOCK_TICKETS_DEV }

Visual Indicator:
+ DEV MODE INDICATOR banner (amber background)
  "🚧 DEV MODE - Pracovní kopie v2.1"
```

---

## ✅ TicketsTileView_dev.tsx — DEV KOPIE

### Změny oproti produkční verzi v2.1:

```diff
Header:
- 🧩 TIPARI SAFE SNAPSHOT v2.1
+ 🧩 TICKETS TILE VIEW DEV MODE
+ Status: 🔓 UNLOCKED - Development Active
+ Visual enhancements documented

Visual Enhancements:
+ Border-radius: 8px → 12px (rounded-lg → rounded-xl)
+ Hover efekt: scale-[1.01] + shadow-xl
+ Modrá barva: #215EF8 → #1E4EEB (změkčená)
+ Card padding: p-4 → p-5
+ Tlačítko Rezervovat: py-4 + ikona 🎟️
+ Název projektu: text-white font-semibold → text-lg font-bold
+ Mini avatar u "Shody s investory" (iniciály count)

Component Name:
- function TicketsTileView
+ function TicketsTileViewDev

Props Interface:
- interface TicketsTileViewProps
+ interface TicketsTileViewDevProps

Imports:
- import { ... } from '../utils/securityScoring';
+ import { ... } from '../../utils/securityScoring';
  (upraveno pro dev/ subdirectory)

New Features:
+ getInvestorInitials() helper function
+ Mini avatar badge with investor count

Exports:
- export function TicketsTileView
+ export function TicketsTileViewDev
+ export { TicketsTileViewDev }
```

### Visual Enhancement Details:

#### 1. **Card Layout (Border-radius 12px)**
```tsx
// Before:
className="... rounded-lg ..."

// After:
className="... rounded-xl ..."
```

#### 2. **Hover Effect (scale + shadow)**
```tsx
// Before:
className="... hover:shadow-md ..."

// After:
className="... hover:shadow-xl hover:scale-[1.01] ..."
```

#### 3. **Modrá barva (#1E4EEB)**
```tsx
// Before: #215EF8
// After: #1E4EEB (všude kde se používá modrá barva)
```

#### 4. **Card Padding (p-5)**
```tsx
// Before:
<div className="p-4 space-y-3 ...">

// After:
<div className="p-5 space-y-3 ...">
```

#### 5. **Tlačítko Rezervovat (py-4 + 🎟️)**
```tsx
// Before:
<button className="... py-4 ...">
  <Ticket className="w-5 h-5" />
  Rezervovat
</button>

// After:
<button className="... py-4 ...">
  <span className="text-lg">🎟️</span>
  Rezervovat
</button>
```

#### 6. **Název projektu (text-lg font-bold)**
```tsx
// Before:
<h3 className="text-white font-semibold ...">

// After:
<h3 className="text-white text-lg font-bold ...">
```

#### 7. **Mini Avatar u "Shody s investory"**
```tsx
// New helper:
const getInvestorInitials = (count: number) => {
  if (count >= 10) return '10+';
  return count.toString();
};

// New avatar badge:
<div className="w-6 h-6 rounded-full bg-[#1E4EEB] text-white flex items-center justify-center text-[10px] font-bold">
  {getInvestorInitials(ticket.investorMatches)}
</div>
```

---

## 🎯 FEATURES

### Dev Mode Indicator:
```tsx
<div className="bg-amber-100 border-b-2 border-amber-300 px-6 py-2">
  <span className="text-amber-800 text-xs font-bold">🚧 DEV MODE</span>
  <span className="text-amber-700 text-xs">
    Pracovní kopie v2.1 - změny se netýkají produkce
  </span>
</div>
```

### Separate Dev Data:
- `MOCK_TICKETS_DEV` — isolované testovací data
- Nezávislé na produkční datové sadě
- Bezpečné pro experimentování

### Development Notes Section:
```typescript
/**
 * 🚧 DEVELOPMENT NOTES:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * [2026-01-06] - Dev kopie vytvořena z v2.1 snapshot
 * 
 * Dokumentuj všechny významné úpravy zde:
 * ...
 */
```

---

## 📂 STRUKTURA

```
/src/app/components/
├── dev/
│   ├── README.md                    ✅ Dev zone documentation
│   ├── DEV_STATUS.md                ✅ This file
│   └── TicketsPageNew_dev.tsx       ✅ Dev copy - UNLOCKED
│
├── __snapshots__/Tikety_v2.1/
│   ├── README.md                    📦 Snapshot documentation
│   └── SNAPSHOT_STATUS.md           📦 Snapshot status
│
├── TicketsPageNew.tsx               🔒 LOCKED v2.1
├── TicketsTableView.tsx             🔒 LOCKED v2.1
├── TicketsTileView.tsx              🔒 LOCKED v2.1
└── hooks/
    └── useTicketsPageLogic.ts       🔒 LOCKED v2.1
```

---

## ⚠️ IMPORTANT RULES

### ✅ DO:
- Edituj POUZE `TicketsPageNew_dev.tsx`
- Testuj všechny změny před merge
- Dokumentuj významné úpravy
- Zachovej import/export integrity
- Ověř TypeScript types

### ❌ DON'T:
- Neměň produkční soubory (v2.1 locked!)
- Neodstraňuj dev mode indicator
- Nemaž safety headers
- Neměň strukturu bez dokumentace
- Neskákej testing fázi

---

## 🔄 MERGE WORKFLOW

Když budeš připraven/a merge změn zpět do produkce:

### 1. Pre-merge Checklist:
```
□ Všechny importy fungují
□ Všechny exporty jsou validní
□ TypeScript compile bez chyb
□ Runtime tested
□ UX/UI review done
□ Performance check passed
□ No console errors
□ No accessibility issues
```

### 2. Documentation:
```
□ Seznam všech změn dokumentován
□ Update version number (v2.2)
□ Create changelog
□ Update DEV_STATUS.md
```

### 3. Merge Process:
```bash
# 1. Zkontroluj diff
git diff TicketsPageNew_dev.tsx TicketsPageNew.tsx

# 2. Backup current production
cp TicketsPageNew.tsx TicketsPageNew_v2.1_backup.tsx

# 3. Prepare merge content
# - Remove dev mode indicator
# - Restore original imports (remove ../)
# - Restore original component name
# - Restore original exports
# - Restore MOCK_TICKETS (not _DEV)

# 4. Update production file
# 5. Test integration
# 6. Create new snapshot if needed (v2.2)
```

### 4. Post-merge:
```
□ Production file updated
□ All tests passing
□ Snapshot updated (if major change)
□ Production locked again
□ Dev copy archived or continue development
```

---

## 🎨 DEV CUSTOMIZATIONS

### Odlišnosti od produkce:

1. **Visual Dev Indicator**
   - Amber banner na vrchu stránky
   - Jasně viditelné "DEV MODE"
   - Upozornění, že změny neovlivní produkci

2. **Separate Data Set**
   - `MOCK_TICKETS_DEV` vs `MOCK_TICKETS`
   - Možnost experimentovat s daty
   - Bez vlivu na produkční mock data

3. **Adjusted Imports**
   - Cesty upraveny pro `/dev/` subdirectory
   - Relativní importy: `../Component` místo `./Component`

4. **Renamed Components**
   - `TicketsPageNew` → `TicketsPageNewDev`
   - Props: `TicketsPageNewProps` → `TicketsPageNewDevProps`
   - Jasné oddělení od produkce

---

## 📊 VERSION TRACKING

| Version | File | Date | Status |
|---------|------|------|--------|
| v2.1 | TicketsPageNew.tsx | 2026-01-06 | 🔒 LOCKED (Production) |
| v2.2-dev | TicketsPageNew_dev.tsx | 2026-01-06 | 🔓 UNLOCKED (Development) |

---

## 🚀 QUICK START GUIDE

### Pro začátek vývoje:

1. **Otevři dev soubor:**
   ```
   /src/app/components/dev/TicketsPageNew_dev.tsx
   ```

2. **Všimni si dev mode indicator:**
   - Amber banner na vrchu
   - "🚧 DEV MODE" text

3. **Začni editovat:**
   - Všechny změny jsou bezpečné
   - Produkce zůstává locked
   - Experimentuj volně!

4. **Test locally:**
   ```bash
   npm run dev
   # Navigate to page with TicketsPageNewDev
   ```

5. **Dokumentuj změny:**
   - Update "DEVELOPMENT NOTES" v header
   - Update tento DEV_STATUS.md
   - Připrav changelog pro merge

---

## ✅ VALIDATION STATUS

```
DEV ZONE SETUP: ✅ COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Dev directory created
✅ README.md created
✅ DEV_STATUS.md created
✅ TicketsPageNew_dev.tsx created
✅ Dev mode indicator added
✅ Separate data set (MOCK_TICKETS_DEV)
✅ Imports adjusted for subdirectory
✅ Component renamed (Dev suffix)
✅ Safety headers added
✅ Production v2.1 remains LOCKED

READY FOR DEVELOPMENT: ✅
```

---

## 📞 SUPPORT

### Pro vytvoření dalších dev kopií:

Požaduj vytvoření dev kopií pro:
- `TicketsTableView_dev.tsx`
- `TicketsTileView_dev.tsx`
- `useTicketsPageLogic_dev.ts`

Workflow je stejný jako u TicketsPageNew_dev.tsx.

---

**Created:** 2026-01-06  
**Framework:** React + TypeScript + Tailwind CSS v4  
**Environment:** Safe Development Zone  
**Next Steps:** Start developing in TicketsPageNew_dev.tsx! 🚀