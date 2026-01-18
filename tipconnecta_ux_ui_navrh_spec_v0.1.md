# Tipconnecta (Tipari) – Produktový & UX návrh (v0.1)

**Datum:** 2026‑01‑18  
**Trh/jazyk:** ČR (CZ), později expanze EU  
**Výchozí podklad:** `tipconnecta_strategie_90dni_v0.1.md`  

## Role, které přispěly
- **Head of Product / PM** – cíle, scope, prioritizace, trade‑offs
- **Lead UX Designer** – koncept, flows, wireframe popisy, usability
- **UX Researcher** – plán validace, test skript, kritéria úspěchu
- **Content Designer / UX Writer** – terminologie, microcopy, error/empty states
- **CRO / Experimentation Lead** – A/B hypotézy, experimenty
- **Data / Product Analyst** – měření, event tracking, KPI
- **Security/Privacy (GDPR)** – minimalizace dat, role-based přístupy, důvěra

---

## Executive summary (7 bodů)

1. **Největší UX riziko je důvěra a procesní jistota (SLA + audit), ne “hezké UI”.** Důkazní prvky (zajištění/LTV, audit, termíny, stavy) musí být vidět průběžně napříč produktem.
2. MVP UX postavíme kolem jediné “core smyčky”: **Broker → vybere tiket → vytvoří rezervaci → podpisy do 48h → rezervace aktivována → 30 dní jednání → financováno / neúspěch → (provize)**.
3. Produkt má **2 hlavní role** (role‑based): *Broker* (primární uživatel / retence) a *Developer* (pravděpodobně primární plátce). UX musí být symetrické ve stavech, ale odlišné v JTBD.
4. Navrhujeme **2 varianty MVP UX**: 
   - **Konzervativní:** seznamy + detail + timeline + checklist (nejrychlejší implementace, nízké riziko).
   - **Odvážná:** pipeline board + “deal room” se sdílenými úkoly (vyšší výtěžnost, vyšší riziko a scope).
5. Největší konverzní páky: **jasně odlišit “Rezervace ≠ investice”**, popsat **co uživatel uvidí na tiketu** (zajištění/LTV), a **co se stane po kliknutí Rezervovat** (časová osa a SLA).
6. Analytics od dne 1: měřit **Activation** (broker = 1. rezervace, developer = 1. publikovaný tiket), plus **deal velocity** (čas do podpisů / aktivace / uzavření).
7. Nejrychlejší validace: **5 brokerů + 3 developeři** v moderovaném usability testu nad prototypem; success = dokončí flow bez nápovědy, pochopí SLA a důvody maskování identity.

---

## Otázky / Předpoklady (max 7)

> Pokud nejsou odpovědi, platí níže uvedené PŘEDPOKLADY.

1. **Brand architektura:** Tipconnecta vs Tipari (co je produkt vs umbrella) – dopad na názvosloví v UI a právní texty.
2. **Monetizace / kdo platí a kdy:** developer provize platformě? existuje i fee/subscription pro brokery? a má broker vidět odhad provize v Kč vždy?
3. **Go‑live definice MVP:** co je P0 “spuštěno” (katalog + rezervace + podpisy + stavy) vs i vypořádání provizí.
4. **Právní rámec & schvalování:** kdo schvaluje claimy/disclaimer texty (rezervace/investice, výnos není garantovaný)?
5. **Onboarding & verifikace:** self‑serve do 10 min vs manuální schválení do 1–2 dnů (zásadní pro čekací stavy).
6. **Supply priorita:** prvních 30 dnů kritičtější bottleneck: tikety od developerů vs brokeři s investory.
7. **Podpisy:** integrovaný e‑sign (doc‑style) vs “download → podepsat mimo → upload/confirm” (ovlivní SLA 48h).

**PŘEDPOKLAD (pro návrh MVP):** začínáme s „Founding partners“ a concierge onboardingem + semi‑manual podpisy, ale s jasnou timeline a notifikacemi.

---

## Diagnóza (UX audit)

> Nemáme konkrétní obrazovky → audit je risk‑based nad definovaným procesem.

### 1) Srozumitelnost (Clarity)
- **Riziko:** uživatel nepochopí rozdíl **tiket / rezervace / aktivace / financováno** → zmatek, support, ztráta důvěry.
- **Doporučení:** slovníček + konzistentní názvy + “co bude dál” (next step) na každé klíčové obrazovce.

### 2) Kognitivní zátěž
- **Riziko:** příliš informací na tiketu bez hierarchie (zajištění, LTV, dokumenty, termíny, provize).
- **Doporučení:** “executive summary” nahoře + postupné odkrývání (sekce/accordion) + vysvětlující tooltipy.

### 3) Důvěra
- **Riziko:** “Proč nevidím investora?” / “Kdo je ověřený?” / “Kde je audit?”
- **Doporučení:** jasné vysvětlení maskování identity + audit log (kdo co udělal) + ověřovací badge + dostupné dokumenty.

### 4) Kontrola a zpětná vazba
- **Riziko:** uživatel neví, jestli akce proběhla (rezervace odeslána? čeká na podpis? kdo je na tahu? deadline?).
- **Doporučení:** status timeline se stavem + deadline + CTA “Udělat další krok” + fallback, co dělat při problému.

### 5) Přístupnost
- **Riziko:** B2B nástroje často podceňují klávesnici, focus, srozumitelné error hlášky.
- **Doporučení:** WCAG 2.2 AA, nekódovat informaci jen barvou, validace formulářů s jasnými instrukcemi.

### 6) Performance
- **Riziko:** tikety s velkými přílohami zpomalí listy i detail.
- **Doporučení:** lazy load příloh, komprese, skeleton, paging.

---

## Návrh řešení (artefakty)

### A) User flows (kroky + rozhodovací body)

#### Flow 1: Broker – „Najít tiket → rezervovat → aktivovat“
1. **Přihlášení / registrace**
   - Rozhodnutí: mám účet vs nemám.
2. **Ověření účtu (pokud není verified)**
   - Stavy: *Neověřený → Ověření odesláno → Ověřený / Zamítnutý*.
   - Rozhodnutí: lze rezervovat před ověřením?
     - Konzervativně: až po ověření.
     - Odvážně: “předrezervace” s podmínkou ověření do X hodin.
3. **Katalog tiketů**
   - Filtry: lokace, objem, LTV, zajištění, doba, dostupnost.
4. **Detail tiketu**
   - Kontrola: zajištění/LTV, termíny, dokumenty, provize (pokud platí).
   - CTA: **„Rezervovat tiket“**.
5. **Vytvoření rezervace**
   - Vybrat investora (existující/nový), potvrdit podmínky a SLA, odeslat.
6. **Rezervace – stavový průběh (timeline)**
   - *Rezervace odeslána* → *Čeká na podpis investora (48h)* → *Čeká na podpis developera (48h)* → *Aktivováno* → *Jednání (30 dní)* → *Financováno / Neúspěch / Expirovalo*.
7. **Uzavření**
   - Úspěch: financováno → provize (14 dní splatnost) → potvrzení.
   - Neúspěch: důvod + možnost založit novou rezervaci.

#### Flow 2: Developer – „Publikovat tiket → schválit rezervaci → aktivovat“
1. Signup/login → verifikace firmy.
2. **Vytvořit projekt** → **vytvořit tiket**.
3. **Publikace tiketu**
   - Draft → Pending approval → Published.
4. **Příchozí rezervace**
   - Developer vidí žádost (bez identity investora), vidí broker profil.
   - Rozhodnutí: přijmout / odmítnout (s důvodem).
5. Podpisy → aktivace → zobrazení identity investora.
6. Statusy v jednání, uzavření.

---

### B) Informační architektura (menu, struktura, terminologie)

#### Společné (pro obě role)
- **Přehled** (dashboard)
- **Tikety** (katalog / moje tikety dle role)
- **Rezervace** (seznam / pipeline)
- **Dokumenty** (trust pack, šablony, audit)
- **Nápověda & FAQ** (včetně „Rezervace vs investice“)
- **Nastavení** (profil, firma, ověření, notifikace, tým)

#### Role‑specific
- Broker: **Investoři** (interní evidence)
- Developer: **Projekty** (projekty + tvorba tiketů)

#### Doporučený slovník (konzistence)
- Tiket (příležitost)
- Rezervace (žádost)
- Aktivace (po podpisu obou stran)
- Jednání (30 dní)
- Financováno (výsledek)
- Provize (v Kč, splatnost)

---

### C) Wireframe popis (sekce, hierarchie, UI patterny)

#### 1) Dashboard (Přehled)
**Cíl:** “Co je dnes potřeba udělat” + “co je v riziku (deadline)”.

Sekce:
- **Top bar:** role, firma, stav ověření (badge), rychlé akce.
- **Priority tasks (P0):**
  - “Čeká na podpis investora – 12h zbývá” (CTA: Poslat podpis / Označit jako podepsáno)
  - “Rezervace vyprší za 2 dny” (CTA: Připomenout / Požádat o prodloužení – pokud dovoleno)
- **Pipeline snapshot:** počty v jednotlivých stavech.
- **Nové tikety:** “Nové od poslední návštěvy” (bez manipulace).
- **Důvěra:** “Poslední aktualizace pravidel / SLA” (nenápadně, ale dostupné).

#### 2) Katalog tiketů (Tikety)
**Pattern:** cards (mobile), table/list hybrid (desktop).

- Header: vyhledávání + filtr + sort.
- Ticket card:
  - Název/oblast, typ projektu, objem
  - Klíčové parametry: LTV, zajištění, doba
  - **Dostupnost** + “Rezervovatelné do …”
  - Broker: “Odhad provize: X Kč” (pokud se používá)
  - CTA: “Zobrazit detail” + sekundární “Uložit”

#### 3) Detail tiketu
**Cíl:** rychlé rozhodnutí + transparentnost.

- Sticky header: Název + badge “ověřeno” + CTA **Rezervovat tiket**
- “Executive summary” grid: objem, doba, LTV, typ zajištění, “poslední aktualizace”
- Sekce:
  1) Parametry
  2) Zajištění & LTV (metodika + tooltip)
  3) Termíny & SLA (48h/30d/14d) jako timeline
  4) Dokumenty a přílohy (+ popisek “co v dokumentu najdu”)
  5) FAQ
- Footer: disclaimer “Rezervace není investice…”

#### 4) Vytvoření rezervace (modal / page)
**Kroky (stepper 1–3):**
1) Investor: vybrat / vytvořit
2) Podmínky: potvrdit význam rezervace, SLA, provize
3) Shrnutí: odeslat

Design:
- Vpravo vždy “Shrnutí tiketu” (klíčové parametry)
- Jasně: “Po odeslání rezervace poběží podpisy do 48h. Pokud se nestihnou, rezervace expiruje.”

#### 5) Rezervace detail (Deal room lite)
**Nejdůležitější obrazovka MVP.**

- Status badge + “kdo je na tahu”
- Timeline se 7 kroky + u každého:
  - deadline
  - co to znamená
  - CTA (primární)
  - fallback (kontaktovat podporu / požádat o prodloužení)
- Tab “Dokumenty” (nahrané, podepsané)
- Tab “Poznámky” (interní, auditované)
- Tab “Audit log” (kdo co udělal kdy)

---

### D) UI pravidla (komponenty, stavy, responsivita)

#### Vizuální styl
- “Private banking calm”: hodně whitespace, jednoduché gridy
- 1 primární barva pro CTA, jinak neutrály
- Outline ikony, bez gradientů

#### Komponenty (MVP)
- Badge: status (Neutral/Info/Success/Warning/Danger)
- Stepper/timeline: (Not started / In progress / Done / Overdue)
- Ticket card / ticket row
- Filter panel (desktop: side panel; mobile: bottom sheet)
- Document list item (název, typ, datum, stav, akce)
- Toast + inline alerts
- Empty states
- Skeleton loaders

#### Responsivita
- Mobile-first: ticket cards 1 sloupec, CTA sticky bottom
- Desktop: 2 sloupce (content + actions/summary)

---

### E) Microcopy (CTA, error states, empty states, onboarding)

#### CTA (příklady)
- “Požádat o přístup do pilotu”
- “Domluvit 15 minut”
- “Rezervovat tiket”
- “Odeslat rezervaci”
- “Zahájit podpis” / “Odeslat k podpisu”
- “Označit jako podepsáno” (MVP fallback)
- “Zobrazit audit”

#### Klíčové vysvětlení (anti‑confusion)
- Tooltip u “Aktivace”:
  - “Aktivace nastane po podpisu obou stran. Teprve potom se odhalí identita investora a běží 30 dní jednání.”

#### Error states (příklady)
- Form validace:
  - “Zkontrolujte prosím pole označená červeně. Bez nich nemůžeme rezervaci odeslat.”
- Nahrávání dokumentu:
  - “Soubor se nepodařilo nahrát. Zkuste to prosím znovu, nebo použijte menší soubor (max. 20 MB).”

#### Empty states
- Katalog tiketů:
  - “Pro zadané filtry jsme nenašli žádné tikety. Zkuste rozšířit filtr LTV nebo lokalitu.”
- Rezervace:
  - “Zatím nemáte žádné rezervace. Začněte výběrem tiketu v katalogu.”

#### Onboarding (ověření)
- “Ověření chrání obě strany a pomáhá zabránit obcházení. Standardně ověřujeme do 1 pracovního dne.”

---

## Behavior & psychologie (eticky)

- **Snížení nejistoty:** timeline + “kdo je na tahu” + deadline.
- **Okamžitá zpětná vazba:** po každé akci potvrzení + “co bude dál”.
- **Progres:** “2/7 kroků hotovo” (orientace, ne gamifikace).
- **Důkazy:** ověření, audit, dokumenty, “poslední aktualizace”.
- **Kontrola:** export dokumentů, audit, jasná pravidla expirace.

---

## Experimenty a validace

### A/B testy (web / landing)
1. **Hero message (Broker)**
   - A: “Dealflow, který má řád.”
   - B: “Provize v Kč. Statusy jasně.”
   - Metrika: CTR na CTA + lead→meeting rate

2. **Hero message (Developer)**
   - A: “Kvalifikovaný kapitál v procesu”
   - B: “Standardizované tikety + SLA podpisů”
   - Metrika: lead kvalita (meeting rate + fit)

### Product experimenty (in‑app)
1. **Ticket card density**
   - A: 4 metriky (LTV, zajištění, doba, objem)
   - B: + “rezervovatelné do …”
   - Success: ticket→detail rate, detail→reservation start rate

2. **Rezervace flow: 1 stránka vs stepper**
   - Success: completion rate, time to submit, error rate

### Usability test – skript (45 min)
**Účastníci:** 3–5 brokerů + 2–3 developeři

Úkoly:
1. Najděte tiket podle preferencí (LTV/lokalita/doba).
2. Otevřete detail a vysvětlete: “Co je aktivace a kdy se odhalí investor?”
3. Vytvořte rezervaci a řekněte, co se stane potom.
4. V detailu rezervace zjistěte: kdo je na tahu, do kdy a co máte udělat.
5. Developer: publikujte tiket a zpracujte příchozí rezervaci (approve/decline).

Kritéria úspěchu:
- 80 % dokončí úkoly bez zásahu moderátora.
- 90 % správně vysvětlí “rezervace ≠ investice” a “maskování identity”.
- Snížení “moments of confusion” mezi iteracemi.

---

## Měření (Analytics)

### KPI (AARRR + HEART)
- **Acquisition:** lead→meeting rate, meeting→signup rate
- **Activation:**
  - Broker: `reservation_submitted` (1. rezervace)
  - Developer: `ticket_published` (1. publikovaný tiket)
- **Revenue:** `reservation_closed_success` + financovaný objem + provize
- **Retention:** WAU/MAU, opakované rezervace, time-to-next-reservation
- **Happiness:** NPS po 1. aktivaci + CES (ease score)
- **Task success:** completion rezervace, podpisy v SLA

### Event tracking (MVP)
Doporučené properties:
- `user_role` (broker/developer/admin)
- `verification_status`
- `ticket_id`, `reservation_id`
- `ticket_ltv_bucket`, `ticket_amount_bucket`
- `deadline_hours_remaining`
- `failure_reason` (u declined/closed_fail)

---

## Implementační specifikace

### P0 / P1 / P2 priority

**P0 (MVP musí mít)**
- Role-based onboarding + stav ověření (i manuální)
- Katalog tiketů + filtry + detail
- Vytvoření rezervace
- Rezervace detail s timeline + statusy + deadlines + “kdo je na tahu”
- Dokumenty: upload/download + stav
- Notifikace e‑mailem pro deadline (min. podpisy 48h)

**P1**
- Audit log (min. na úrovni rezervace)
- Uložené filtry / “nové od poslední návštěvy”
- Důvody odmítnutí + analytika

**P2**
- Kanban pipeline
- In‑app messaging / komentáře
- Reporting / trust score (až po datech)

### Acceptance criteria (výběr)

**Ticket list**
- Filtrování min. 4 klíčové parametry (lokace, LTV, objem, doba)
- Skeleton loading
- Empty state + “Vymazat filtry”

**Reservation create**
- Nelze odeslat bez povinných polí
- Success screen s “co dál” + link na detail rezervace
- Event `reservation_submitted` se správnými properties

**Reservation timeline**
- Každý krok má stav (not started/in progress/done/overdue)
- Overdue krok jasně popisuje důsledek + CTA “Kontaktovat podporu / Požádat o prodloužení”
- Vždy zřejmé, kdo je na tahu

### Edge cases
- Developer odmítne rezervaci → broker vidí důvod + další krok
- Podpis nestihnut → expirace + možnost založit novou rezervaci
- Tiket se stane nedostupný → zablokovat flow + vysvětlit proč
- Uživatel není ověřený → blokace + cesta k řešení
- Dokument špatný formát/velikost → validace + instrukce

---

## Sprint plán (2 týdny)

### Týden 1
1. **PM:** potvrdit P0 scope + definice stavů a SLA (rezervace, aktivace, expirace)
2. **UX:** Figma flow + low‑fi wireframes (ticket list/detail, reservation create, reservation timeline)
3. **UX Writer:** slovník pojmů + P0 microcopy + error/empty states
4. **Security/GDPR:** role permissions, minimalizace dat, logování přístupů
5. **FE/BE:** ticket list + detail + filtry + základní routy

### Týden 2
6. **FE/BE:** reservation create + reservation timeline + statusy + deadlines
7. **Notifikace:** e‑mail šablony pro klíčové stavy (odesláno, čeká podpis, overdue)
8. **Analytics:** instrumentace eventů + jednoduchý dashboard (activation + deal velocity)
9. **QA:** test edge cases + regresní scénáře
10. **UX Research:** 6–8 usability testů → rychlé iterace (copy + hierarchy)

### Rizika sprintu
- Nejasné právní formulace blokují copy a IA (“rezervace vs investice”).
- Příliš složité ověření → drop‑off.
- Bez e‑sign integrace: musí být kvalitní manual fallback, jinak se SLA rozpadá.

