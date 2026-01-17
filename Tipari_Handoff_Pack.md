# Tipari.cz — Handoff Pack (DEV + UI)

**Datum:** 2026-01-17  
**Stav:** WORKING DRAFT (živý dokument)  
**Pozn.:** `systemcore_version_manifest.json` nebereme jako rozhodující (jen historický artefakt).

---

## 0) Jak s tím pracovat (aby z toho nebyl chaos)

### 0.1 Princip
- **Jeden balíček** pro předání implementace: *co má programátor postavit* + *co má UI designer navrhnout*.
- **Kanonické slovníky** (enumy, labely, povinná pole) držíme na jednom místě.
- Kde jsou **konflikty mezi dokumenty**, je to označeno jako **ROZHODNUTÍ**.

### 0.2 Co je cílový výstup
- Programátor dostane:
  - datový model + validace,
  - stavové automaty (workflows),
  - RBAC/viditelnost,
  - seznam API endpointů a eventů,
  - seed/fixture data.
- UI designer dostane:
  - mapu obrazovek + komponenty,
  - maskování/odemknutí informací,
  - microcopy a compliance texty,
  - admin IA,
  - napojení na design systém.

---

## 1) Zdrojové dokumenty (kde co hledat)

> Všechny níže uvedené dokumenty už jsou vytažené do Markdownu v `extracted_md/` (kvůli rychlému hledání a kopírování).

### 1.1 Kanonické slovníky (ENUMy, povinná pole)
- `extracted_md/KANONICKÝ DOMAIN DICTIONARY.md` (deklaruje se jako „POVINNÁ IMPLEMENTACE“)
- `extracted_md/FORMY INVESTICE.md` (DB READY enum + tabulka)
- `extracted_md/FORMY ZAJIŠTĚNÍ.md` (DB schéma + tabulka)
- `extracted_md/VYUŽITÍ PROSTŘEDKŮ.md` (DB READY enum + tabulka)
- `extracted_md/TYPY PROJEKTU.md` (tabulka typů projektů)

### 1.2 Práva a viditelnost
- `extracted_md/TABULKA PRAVA A VIDITELNOSTI.md`

### 1.3 Vstupní pole (formuláře)
- `extracted_md/Zadání projektu do systému.md` (Project + Ticket intake)
- `extracted_md/VSTUPNÍ DATA O INVESTOROVI.md` (Investor entity + preference)
- `extracted_md/REGISTRACE OBCHODNIK DEVELOPER.md`

### 1.4 Provize
- `extracted_md/ ROZDĚLENÍ PROVIZE.md`

### 1.5 Právo, compliance, admin
- `extracted_md/právní architektura.md`
- `extracted_md/nastavení admin.md`

### 1.6 Produkt & UI pravidla
- `extracted_md/BRAND A PRODUKTOVÁ IDENTITA.md`
- `extracted_md/ZÁKLADNÍ DESIGNOVÁ PRAVIDLA.md`
- `TIPARI_DESIGN_SYSTEM_COMPLETE.md` (design systém)

### 1.7 Další (referenční)
- `Tipari_Functional_Blueprint.md` (+ visuals)
- `Tipari_Business_Specification_Summary.md`
- `VSTUPNÍ DATA KOMPLET.docx` (obsáhlý zdroj – obsahuje i starší/alternativní varianty)

---

## 2) ROZHODNUTÍ / konflikty mezi zdroji (potřebujeme potvrdit)

> Níže jsou místa, kde dokumenty říkají různé věci. U každého dávám **varianty + doporučení**.

### DEC-001 — Názvy a pořadí „levelů“ tipaře
**Co říkáš ty:** chceš názvy typu `Wolf, Alfa, Gold, Silver…` (ideální výstup z Codexu).  
**Co říkají dokumenty:**
- Brand: Partner / Premium / Elite + „10 globálních slotů“.
- SystemCore / jiné výstupy: BRONZE / SILVER / GOLD / PLATINUM + kapacity 2/5/10/∞.

**Doporučení (bezpečné pro implementaci):**
- V kódu mít stabilní `TiparLevelCode` (např. `L1..L4` nebo `BRONZE..PLATINUM`) a **displayName** zvlášť.
- UI zobrazí názvy: `Wolf / Alfa / Silver / Gold` *(pořadí a počet musíme potvrdit)*.

**Potřebuji od tebe:**
1) Finální seznam levelů + jejich pořadí.
2) Limit globálních „slotů“ pro každý level.

---

### DEC-002 — Kdy je rezervace „aktivní“
**Potvrzeno od tebe:** rezervace je aktivní ve chvíli, kdy je **rezervační smlouva podepsaná oběma stranami (developer + investor)**.

**Konflikt:** Brand text naznačuje platnost po podpisu investorem („platná až po podpisu smlouvy investorem“).  
**Doporučení:** Rozlišit 2 pojmy:
- **Reservation locked / pending**: slot je blokovaný (počítá se do limitů), ale ještě není „aktivní“.
- **Reservation active**: obě strany podepsaly ⇒ odemčení identit a vznik dalších nároků (provize / deal tracking).

---

### DEC-003 — SLA pro podpis/rozhodnutí (48h vs 72h vs dny)
Zdroje uvádějí různé hodnoty (48h, 72h, 7 dní, 30 dní…).  
**Doporučení:** definovat **konfigurovatelné konstanty v Admin nastavení**, a do UI dávat hodnotu z backendu.

**Potřebuji od tebe:**
- jaké SLA platí pro: (a) podpis investora, (b) reakci developera, (c) celkovou expiraci rezervace.

---

### DEC-004 — Kanonická enumerace „Forma investice“
Konflikt mezi:
- `KANONICKÝ DOMAIN DICTIONARY`: `senior_loan, junior_loan, mezzanine, equity, joint_venture, profit_share, convertible_loan`
- `FORMY INVESTICE` (DB READY): `direct_loan, mezzanine_financing, bridge_loan, ... (9 položek)`

**Doporučení:** buď
- (A) **přijmout kanonický dictionary** a ostatní mapovat, nebo
- (B) zavést 2 pole:
  - `investment_form` (strategie: bridge/refi/buy&hold/…) +
  - `capital_position` (senior/mezz/equity-like)

**Potřebuji od tebe:** vyber A nebo B.

---

### DEC-005 — Typy projektu (8 vs 10)
Konflikt mezi:
- `KANONICKÝ DOMAIN DICTIONARY` (8 typů: residential_development… reconstruction)
- `TYPY PROJEKTU` (10 typů včetně buy&hold, refinancing, bridge, brownfield…)

**Doporučení:**
- (A) držet 10 typů (UX praktičtější) a upravit kanonický dictionary, nebo
- (B) držet 8 typů a „bridge/refi/buy&hold“ dát jako **deal strategy** (jiné pole).

**Potřebuji od tebe:** A nebo B.

---

### DEC-006 — Provize: procenta vs CZK
Konflikt:
- Brand: „Provize výhradně v Kč, nikdy ne v %“.
- `ROZDĚLENÍ PROVIZE` + `Zadání projektu`: „Procenta / CZK“.

**Doporučení (praktické):**
- V datech podporovat oboje (audit), ale v UI **primárně zobrazovat CZK**.

**Potřebuji od tebe:**
- má být UI striktně bez % úplně všude, nebo % může existovat interně/admin?

---

## 3) ČÁST A — SPEC pro PROGRAMÁTORA (Backend + FE integrace)

### 3.1 Role a entity (high level)

**Role v systému (RBAC):**
- `ADMIN`
- `BROKER` (obchodník / tipař)
- `DEVELOPER`
- `EMPLOYEE` (read-only / interní)

**Pozn. k investorovi:** z právního pohledu investor často není „uživatel platformy“ (viz právní architektura), ale **entita**, kterou spravuje broker/admin; investor může dostat jen eSign link (bez plného účtu).

### 3.2 Doménové entity (minimální model)

> Detailní pole jsou v přílohách (`Zadání projektu…`, `Vstupní data o investorovi…`). Níže je „programátorský“ řez – co musí existovat v DB/API.

#### 3.2.1 User
- `id`, `role`, `email`, `phone`, `status` (pending/verified/active/suspended/blocked), `created_at`, `verified_at`, `verified_by_admin_id`

#### 3.2.2 BrokerProfile
- `user_id`
- `tipar_level_code`
- `region_scope[]`, `specializations[]`
- `global_slot_limit`, `global_slots_used` (derivované)

#### 3.2.3 DeveloperProfile / DeveloperCompany
- company identity (IČO, sídlo, contact person)
- `verified_status`

#### 3.2.4 Investor (CRM entita)
- identifikace + kontakty
- preference (min/max investice, yield, regiony, zajištění, typy projektů…)
- compliance flags (PEP, sanctions…) – podle rozhodnutí „zatím mimo UI“ (ale v DB/auditu existuje)

#### 3.2.5 Project
- identity + lokalita
- developer (company)
- finance (rozpočet, vlastní kapitál, cizí zdroje…)
- právní/technický stav
- dokumenty
- `status`: draft → pending_review → published / rejected / archived

#### 3.2.6 Ticket
- vazba na project
- investiční parametry (částka, měna, výnos, payout schedule, délka…)
- `investment_form` (viz DEC-004)
- zajištění (M:N přes `ticket_securities`)
- `max_reservations_per_ticket` (dle brand = 3)
- `commission` (model viz 3.5)
- `status`: draft → published → closed

#### 3.2.7 Reservation
- vazba: `ticket_id`, `broker_id`, `investor_id`
- `state` (viz 3.4)
- časové značky + SLA deadliny
- audit trail

#### 3.2.8 ReservationContract
- generated doc reference
- signing statuses: investor_signed_at, developer_signed_at
- eSign provider meta

#### 3.2.9 Commission + CommissionSplit
- `commission_total` (amount + currency; případně i %)
- `entitlement_event` (kdy vzniká nárok)
- `payment_terms`
- split lines: platform, tipař1, tipař2
- `status`: draft → approved → invoiced → paid_to_platform → paid_out

---

### 3.3 API návrh (minimální endpoints)

> Přesné URL nejsou důležité; důležité je *co vrací a kdy*.

**Auth & Profiles**
- `POST /auth/register/broker`
- `POST /auth/register/developer`
- `GET /me`

**Investors (CRM)**
- `POST /investors` (broker/admin)
- `PATCH /investors/:id`
- `GET /investors/:id`
- `GET /investors/:id/matches`

**Projects & Tickets**
- `POST /projects` (developer)
- `PATCH /projects/:id`
- `POST /projects/:id/submit`
- `POST /projects/:id/tickets`
- `GET /tickets` (broker)
- `GET /tickets/:id` (role-filtered view)

**Reservations & Contracts**
- `POST /tickets/:id/reservations` (broker)
- `POST /reservations/:id/submit` (broker → platform review)
- `POST /reservations/:id/platform/approve` (admin)
- `POST /reservations/:id/platform/reject` (admin)
- `POST /reservations/:id/contracts/generate` (system/admin)
- `POST /reservations/:id/contracts/investor-sign` (eSign callback)
- `POST /reservations/:id/contracts/developer-sign` (eSign callback)
- `POST /reservations/:id/cancel` (broker/admin)

**Commissions**
- `GET /commissions?mine=true` (broker)
- `POST /tickets/:id/commission-split` (admin)
- `POST /commissions/:id/approve` (admin)
- `POST /commissions/:id/mark-paid` (admin)

---

### 3.4 Rezervace — stavový automat + odemykání dat

#### 3.4.1 Stavový automat (návrh)

> Zdroje používají různé názvy. Doporučuji standardizovat na jednu `ReservationState` a udělat mapping z legacy.

**Navržené canonical stavy:**
1) `in_progress` — broker vybírá investora/tiket (příprava)
2) `submitted_to_platform` — odesláno ke schválení platformou
3) `platform_due_diligence` — kontrola platformy
4) `platform_approved` — schváleno, čeká se na podpis investora
5) `investor_signed` — investor podepsal, čeká se na podpis/confirm developera
6) `active` — **podepsáno oběma stranami** (dle tvého potvrzení)
7) `expired` — vypršelo SLA
8) `cancelled` — zrušeno

#### 3.4.2 Viditelnost (RBAC) — pravidlo
- Řídí se tabulkou `TABULKA PRAVA A VIDITELNOSTI`.
- „Odemykání identit“ nastává nejdříve po přechodu do `active` (nebo v okamžiku podpisu oběma; podle implementace to je totožné).

---

### 3.5 Sloty a kapacity

- **Per ticket:** max 3 aktivní rezervace (dle brand + UI copy).
- **Per broker (globální):** závisí na levelu (DEC-001).

**Implementační poznámka:**
- „slot“ je vlastně **aktivní/živá rezervace** ve stavech od `submitted_to_platform` až po `active` (a případně `investor_signed`).
- Po `expired/cancelled` se slot uvolní.

---

### 3.6 Provize — model a okamžiky

Z právní architektury:
- platforma není investiční zprostředkovatel; eviduje introdukci + chrání provizní nárok.

Z `ROZDĚLENÍ PROVIZE`:
- rozdělení nastavuje admin (platforma)
- změny = verze
- nastavuje se až po přijetí platby od developera (doporučení v docu)

**Doporučený workflow:**
1) Reservation → `active`
2) Vznikne `commission` v režimu `draft` (nevidí investor)
3) Admin vyplní `commission_split` a schválí (`approved`)
4) Developer zaplatí platformě (`paid_to_platform`)
5) Platforma vyplatí tipařům (`paid_out`)

---

### 3.7 Admin moduly (funkční požadavky)
Viz `nastavení admin`:
- dashboard s KPI
- queue rezervací se SLA countdown
- introdukce investorů + detekce duplicit
- dealy
- provize, faktury, spory, reputace, audit log

---

### 3.8 Právo & compliance (must-have guardrails)
Viz `právní architektura`:
- jasné disclaimery: „nejde o veřejnou nabídku“, „platforma nepřijímá peníze“, „bez investičního poradenství“
- investor může být „ne-uživatel“ (eSign link)
- RBAC + audit log jsou povinné
- anti-obcházení (časový test, sankce) – musí být podklady pro VOP/provizní smlouvu

---

## 4) ČÁST B — SPEC pro UI DESIGNERA (UX, obrazovky, komponenty)

### 4.1 IA / sitemap (per role)

#### Broker
- Dashboard
  - seznam investorů (CRM)
  - investor detail (preference + matchy)
  - match výsledky (ticket list)
- Tickets
  - list + filtry
  - detail tiketu
  - reservation flow (wizard/modal)
- Reservations
  - timeline stavů + SLA
- Commissions

#### Developer
- Projects
  - create/edit
  - submit
- Tickets
  - create/edit
  - security documents
- Reservations
  - incoming investor (bez identity do podpisu)
  - podpis/confirm
- Payments (provize)

#### Admin
- Overview cockpit
- Rezervace queue (SLA)
- Introdukce investorů
- Dealy
- Provize
- Faktury
- Spory
- Reputace
- Uživatelé
- Audit log
- Nastavení

---

### 4.2 Ticket Card — obsahová hierarchie (must)
Z brand docu:
- **Provize (CZK)** největší motivace
- Výnos p.a.
- Zajištění (badges)
- LTV (tooltip vysvětlení)
- Typ investice
- Investor matching CTA
- Čas do uzávěrky
- Volné rezervace (sloty)
- CTA „Rezervovat“ + microcopy (SLA)

---

### 4.3 Maskování dat (kritické)
Z `TABULKA PRAVA A VIDITELNOSTI`:
- dokud není podpis, broker/investor **nevidí název a obrázek projektu**
- developer nevidí identitu investora/brokera do podpisu
- po `active` všichni vidí kompletní info

**UI pravidlo:**
- maskované části musí mít konzistentní placeholder (např. „Skryto do podpisu smlouvy“)
- neodhalovat ani v tooltipu / alt textu / názvu souboru

---

### 4.4 Rezervační flow — doporučené obrazovky/stavy
- Start rezervace (výběr investora)
- Souhrn + upozornění na SLA
- Odeslání ke schválení platformou
- Čekací stav (platform due diligence)
- Platform approved → investor eSign
- Investor signed → developer decision/sign
- Active → odemknutí identit + „další kroky“ (deal, provize)
- Expired/Cancelled → vysvětlení + CTA (uvolněno)

---

### 4.5 Admin UI (high fidelity směr)
Viz `nastavení admin`:
- tabulkový „risk radar“ místo grafů
- „one click to detail“
- oddělit finance a spory

---

## 5) ČÁST C — Data Dictionary (pro FE/BE i copy)

> Tady budeme držet FINÁLNÍ verzi slovníků. Do doby, než rozhodneme konflikty (DEC-004/005/006), držíme obě varianty.

### 5.1 Security types
- Kanonický (dictionary): `mortgage_1st, mortgage_2nd, pledge_shares, bank_guarantee, corporate_guarantee, personal_guarantee, assignment_receivables, escrow_account, notarial_enforcement, insurance, cash_collateral, other_security`
- DB READY (zajištění doc): `real_estate_mortgage, corporate_guarantee, personal_guarantee, promissory_note, share_pledge, notarial_enforcement, bank_guarantee, escrow_control, insurance`

**Návrh mapování (pokud nebudeme refaktorovat DB enum):**
- `mortgage_1st` → `real_estate_mortgage` + `order_rank=1`
- `mortgage_2nd` → `real_estate_mortgage` + `order_rank=2`
- `pledge_shares` → `share_pledge`
- `escrow_account` → `escrow_control`

---

### 5.2 Use of funds
- Kanonický dictionary (12 keys): `land_purchase, construction, reconstruction, technology, project_preparation, permits, marketing, fees, financing_costs, reserve, taxes, other_costs`
- DB READY (use_of_funds doc): `property_acquisition, construction, reconstruction, refinancing, bridge_financing, capex_reserve, operational_costs, technical_preparation, marketing_and_sales, tax_and_transaction_costs, partner_buyout, combined_use`

**Poznámka:** tady je velká pravděpodobnost, že „kanonický“ seznam je potřeba upravit, aby odpovídal reálným položkám z tabulky.

---

### 5.3 Investment form
- Kanonický dictionary (7 keys): `senior_loan, junior_loan, mezzanine, equity, joint_venture, profit_share, convertible_loan`
- DB READY (9 keys): `direct_loan, mezzanine_financing, bridge_loan, profit_share, joint_venture, forward_funding, refinancing, buy_and_hold_financing, project_participation`

---

### 5.4 Project types
- Kanonický dictionary (8 keys): `residential_development, commercial_development, mixed_use, logistics, hospitality, industrial, land_development, reconstruction`
- Typy projektu doc (10): viz `extracted_md/TYPY PROJEKTU.md`

---

## 6) Seed/fixtures (pro rychlý dev)

### 6.1 Seed: role a test uživatelé
```json
{
  "users": [
    {"id":"u_admin_1","role":"ADMIN","email":"admin@tipari.local","status":"active"},
    {"id":"u_broker_1","role":"BROKER","email":"broker@tipari.local","status":"active","tipar_level_code":"L1"},
    {"id":"u_dev_1","role":"DEVELOPER","email":"dev@tipari.local","status":"active"}
  ]
}
```

### 6.2 Seed: ticket se 3 sloty
```json
{
  "ticket": {
    "id": "t_001",
    "project_id": "p_001",
    "amount_czk": 5000000,
    "expected_yield_pa_percent": 11.5,
    "duration_months": 18,
    "max_reservations_per_ticket": 3,
    "available_slots": 3
  }
}
```

---

## 7) Checklist pro předání (ready-to-dev / ready-to-ui)

### 7.1 Ready-to-dev
- [ ] finální seznam Tipar levelů + slot limity (DEC-001)
- [ ] finální SLA konstanty (DEC-003)
- [ ] finální rozhodnutí investment_form & project_type modelu (DEC-004/005)
- [ ] rozhodnutí jak zobrazovat provizi (% vs Kč) (DEC-006)
- [ ] schválený reservation state machine + mapping

### 7.2 Ready-to-ui
- [ ] potvrzený obsah Ticket Card (co je must)
- [ ] definované placeholdery pro maskování
- [ ] texty disclaimers (minimální sada)
- [ ] pravidla pro admin UI (IA)

---

## 8) Change log
- 2026-01-17: vytvořen první sjednocující Handoff Pack + vyznačené konflikty a rozhodnutí.
