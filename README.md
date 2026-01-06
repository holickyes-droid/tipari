# 🧩 SAFE DEV ZONE — Tikety Module

**Status:** 🔓 Development Mode Active  
**Base Version:** v2.1 (Snapshot Locked)  
**Last Updated:** 2026-01-06

---

## 📋 PURPOSE

Tato složka obsahuje **bezpečné pracovní kopie** produkčních komponent pro vývoj a testování nových funkcí.

### Workflow:
1. **Develop** - Prováděj změny v `_dev.tsx` souborech
2. **Test** - Testuj v izolovaném prostředí
3. **Review** - Zkontroluj změny před merge
4. **Merge** - Po schválení zkopíruj zpět do produkce

---

## 🔒 PRODUCTION LOCK STATUS

| Component | Production Status | Dev Copy | Safe to Edit |
|-----------|------------------|----------|--------------|
| TicketsPageNew.tsx | 🔒 LOCKED v2.1 | ✅ TicketsPageNew_dev.tsx | ✅ YES |
| TicketsTableView.tsx | 🔒 LOCKED v2.1 | 🚧 TBD | ⏳ On request |
| TicketsTileView.tsx | 🔒 LOCKED v2.1 | 🚧 TBD | ⏳ On request |
| useTicketsPageLogic.ts | 🔒 LOCKED v2.1 | 🚧 TBD | ⏳ On request |

---

## 📦 DEV FILES

### TicketsPageNew_dev.tsx
```
Base: TicketsPageNew.tsx v2.1
Status: 🔓 UNLOCKED - Development Active
Purpose: Main tickets page development copy
Changes: Safe to modify without affecting production
```

---

## ⚠️ IMPORTANT RULES

### DO:
✅ Make changes ONLY in `_dev.tsx` files  
✅ Test thoroughly before merge  
✅ Document significant changes  
✅ Keep imports and exports consistent  
✅ Preserve TypeScript types  

### DON'T:
❌ Modify production files directly (v2.1 locked)  
❌ Change file structure without documentation  
❌ Remove safety headers  
❌ Break export integrity  
❌ Skip testing phase  

---

## 🔄 MERGE PROCESS

When ready to merge dev changes to production:

1. **Validate:**
   - ✅ All imports working
   - ✅ All exports valid
   - ✅ TypeScript compiles
   - ✅ Runtime tested

2. **Document:**
   - List all changes made
   - Update version number
   - Create new snapshot if major

3. **Merge:**
   - Copy from `_dev.tsx` to production
   - Update snapshot if needed
   - Test full integration

4. **Lock:**
   - Re-lock production file
   - Archive dev copy or continue development

---

## 🎯 DEVELOPMENT GUIDELINES

### File Naming:
- Production: `ComponentName.tsx`
- Dev Copy: `ComponentName_dev.tsx`
- Always suffix with `_dev` for clarity

### Headers:
All dev files must include:
```typescript
/**
 * 🧩 [COMPONENT NAME] DEV MODE
 * Tento soubor je bezpečná pracovní kopie verze v2.1.
 * Jakékoli úpravy se netýkají produkčního buildu.
 */
```

### Testing:
- Test locally before proposing merge
- Check all user flows
- Verify performance
- Validate accessibility

---

## 📊 VERSION CONTROL

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| v2.1 | 2026-01-06 | Initial snapshot | ✅ Locked |
| v2.2-dev | TBD | In development | 🚧 Active |

---

## 🚀 QUICK START

To create a new dev copy:

1. Copy production file to `/dev/`
2. Rename with `_dev` suffix
3. Add dev mode header
4. Update this README
5. Start developing!

---

**Created:** Tipari.cz Build System  
**Framework:** React + TypeScript + Tailwind CSS v4  
**Environment:** Safe Development Zone
