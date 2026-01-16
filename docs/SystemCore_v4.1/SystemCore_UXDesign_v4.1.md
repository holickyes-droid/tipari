# SystemCore UX Design Specification v4.1

Dokument konsoliduje UX doporučení z Reviewer Alignment Reportu. Brandové podklady `ZÁKLADNÍ DESIGNOVÁ PRAVIDLA.docx` a `BRAND A PRODUKTOVÁ IDENTITA.docx` nejsou v repozitáři dostupné, proto je nutné je doplnit pro kompletní brandovou validaci.

⚠️ [Missing content from design sources: ZÁKLADNÍ DESIGNOVÁ PRAVIDLA.docx, BRAND A PRODUKTOVÁ IDENTITA.docx]

## 1. UX Architecture
- UX knihovna mapuje canonical data do UI komponent (TBD – chybí `SystemCoreUXLibrary.tsx`).
- Dashboardy: Admin, Incident, CI/CD.
- Auditní transparentnost: UI musí zobrazovat audit trail pro klíčové workflow.

## 2. Design System (TBD)
- Design tokens: barvy, typografie, spacing.
- Interakční stavy a varianty komponent.
- Dark mode a mobile guidelines.

## 3. Brand & Tone of Voice
- Tone‑of‑voice a microcopy pravidla musí vycházet z brand dokumentů (chybí).
- CTA konzistence a struktura microcopy je požadavek pro v4.1.

## 4. Accessibility
- WCAG 2.1 AA, ARIA atributy, focus indikátory.
- A11y audit jako CI/CD gate.

## 5. UX ↔ Data Mapping
- Požadováno mapování fieldů UX ↔ schema ↔ API kontrakty.
- Doplnit komponentové a flow diagramy.

---

## Alignment Summary

| Doporučení z Reviewer Alignment | Implementace v4.1 | Stav |
| --- | --- | --- |
| Design tokens a interakční stavy | Definovány jako TBD bez brand podkladů | ❌ Chybí |
| UX ↔ data mapping | Požadavek na mapovací appendix | ⚙️ Částečně |
| Figma → kód a CI/CD gate | Zahrnuto jako požadavek | ⚙️ Částečně |

---

## Reviewer Confirmation

Reviewed & updated according to SystemCore_Reviewer_Alignment_Report.md

Version: 4.1

Status: ⚙️ Partial

## Appendix A — Source: SystemCoreDocumentation.md (UI/UX Design Specification)

# VII. UI/UX DESIGN SPECIFICATION

## 1. UI Architecture Overview
UI architektura je postavena na komponentách v `SystemCoreUXLibrary.tsx`, které mapují canonical data do jednotných vizuálních bloků. **ProjectCard** a **TicketCard** zobrazují investiční nabídky, napojují se na matching výsledky a statusy rezervací. **Dashboardy** (Admin, Incident, CI/CD) poskytují agregované metriky, auditní stav a SLA countdown. **IncidentManagement UI** podporuje triage, eskalaci a uzavírání incidentů s auditním logem a notifikacemi.

## 2. Design System & Visual Identity
Design systém definuje jednotnou paletu barev, typografii, spacing a responsivní chování. Kontrastní poměry a typografické hierarchie jsou navrženy tak, aby odpovídaly WCAG 2.1 AA. Komponenty používají standardizované velikosti, stavy a varianty, které zajišťují konzistenci mezi moduly a podporují rychlou orientaci uživatelů.

## 3. UX Principles
UX je navržen s důrazem na jednoduchost, přehlednost a konzistenci. Navigace zachovává hierarchii informací od přehledu projektů až po detail rezervace a provize. Interakční vzory (tlačítka, modály, tabulky) jsou sjednocené napříč moduly, aby bylo možné minimalizovat kognitivní zátěž a zrychlit orientaci.

## 4. Accessibility Standards
Požadavky z `SystemCoreAppendix_Accessibility.tsx` zahrnují ARIA atributy, focus indikátory a ověřené kontrastní barvy. Všechny interaktivní prvky jsou ovladatelné z klávesnice a obsahují vizuální potvrzení stavu. Accessibility audit je součástí release procesu a výsledky se promítají do QA reportů.

## 5. User Flows & Interaction Patterns
Klíčový user flow vede investora od projektu přes ticket k rezervaci a následné provizi. Modály slouží pro potvrzení rezervací, tabulky pro auditní a incidentní přehledy a notifikace informují o změnách stavu. Tlačítka a call-to-action prvky mají jasnou hierarchii a jsou napojeny na auditní eventy při změnách stavu.

## 6. Design System Governance
Design systém je verzován spolu s dokumentací a podléhá governance schvalování. Změny UI komponent musí projít QA a accessibility audit a jsou publikovány přes CI/CD pipeline. Governance rámec zajišťuje, že všechny UX změny mají auditní stopu a jsou konzistentní s datovým modelem.

## Reviewer Notes — Professional Analysis
- Doporučuji doplnit design tokens, detailní interakční stavy a definice pro tmavý režim a mobilní rozhraní.
- Chybí komponentové diagramy a flow mapy, které by vizualizovaly vazby mezi UX, daty a auditními procesy.
- Bylo by vhodné rozšířit UX dokumentaci o mikroanimace a systém notifikací včetně priorit a timing pravidel.
- Doporučuji zlepšit viditelnost auditních a governance informací v UI (např. transparentní audit trail pro rezervace).
- V další fázi doporučuji posílit integraci Figma → kód a definovat CI/CD kontroly pro design consistency.

# VIII. DEVOPS & DEPLOYMENT

---

## Reviewer Confirmation

Reviewed & updated according to SystemCore_Reviewer_Alignment_Report.md

Version: 4.1

Status: ⚙️ Partial
