# Tipari.cz — Dokumentace pro předání (kostra)

**Účel:** Tohle je *kostra* jednotné dokumentace pro předání **programátorovi (backend + frontend)** a **UI/UX designerovi**. Do jednotlivých sekcí budeme postupně doplňovat data z vašich zdrojových souborů (včetně Word).  
**Stav:** Skeleton v0.3 (aktualizace: SLA/rezervace/provize + analýza typů projektů)  
**Datum:** 2026-01-17

---

## 0) Jak s dokumentem pracovat

### 0.1 Konvence
- Každá sekce má:
  - **Co potřebujeme dodat** (jaká data / rozhodnutí)
  - **Zdroj** (z jakého dokumentu to bereme)
  - **Status**: `TODO` / `IN PROGRESS` / `DONE`
  - **Otázky** (kde je potřeba vaše potvrzení)

### 0.2 Pravidla „source of truth“ (dočasně — upravíme)
- Pokud existuje konflikt mezi dokumenty:
  1) **Kanonický Domain Dictionary / schválené business zadání** (pokud je označeno jako kanonické)
  2) **Funkční blueprint / procesní specifikace**
  3) **UX/Design System** (pro UI pravidla, ne pro business logiku)
  4) Ostatní poznámky / starší exporty

> Pozn.: Uvedl jste, že **manifest nerozhoduje** (je z jedné ze starších verzí). V této dokumentaci ho budeme brát pouze jako referenci, ne jako autoritu.

### 0.3 Kanonické rozhodnutí (už potvrzené od vás)
- **Rezervace je „aktivní“ až ve chvíli, kdy je podepsaná rezervační smlouva oběma stranami** (developer + investor). ✅

### 0.4 Kanonické levely (tiera) tipařů
**Status:** IN PROGRESS

**Zadání od vás:** 3 úrovně, „začáteční“ začíná na **10 slotech**, nastavit pro-obchodně.

**Brand / pojmy:** V brand identitě jsou uvedené názvy tierů **Partner / Premium / Elite**.【642:1†BRAND A PRODUKTOVÁ IDENTITA.docx†L20-L37】

**Slotová pravidla (z brand identit):**
- Tiket má *sloty* (kapacita kolik tipařů může „držet“ přístup).【642:2†BRAND A PRODUKTOVÁ IDENTITA.docx†L45-L53】
- Tipař má omezený počet *globálních slotů* podle tieru.【642:2†BRAND A PRODUKTOVÁ IDENTITA.docx†L45-L51】
- Jeden tipař může mít max. **3 aktivní rezervace** na jeden tiket.【642:2†BRAND A PRODUKTOVÁ IDENTITA.docx†L45-L53】

#### Návrh (kanonické defaulty)
| Tier | „Obchodní“ popis | Globální sloty (default) | Max aktivní rezervace / ticket | Poznámka |
|---|---|---:|---:|---|
| **Partner** | Začáteční / standard | **10** | 3 | Vstupní úroveň (minimální prodejní friction) |
| **Premium** | Aktivní tipař | **25** | 3 | Vyšší paralelizace obchodů |
| **Elite** | Top tipař / partner | **50** | 3 | Pro nejlepší performance / velké portfolia |

#### Legacy mapping (ponecháno pro pozdější doplnění)
- wolf/alfa/gold/silver… → Partner/Premium/Elite (TODO)



### 0.5 SLA defaulty (editovatelné adminem per ticket + prodlužitelné per rezervace)
**Status:** IN PROGRESS

**Zadání od vás:**
- Všechny níže uvedené časy musí být **upravitelné adminem na úrovni ticketu**.
- Zároveň musí jít u **každé konkrétní rezervace** tyto deadliny ručně **prodlužovat / zkracovat** (auditně).

**Defaulty (kanonické pro MVP):**
- `investor_signature_timeout_hours = 48`
- `developer_signature_timeout_hours = 48`
- `reservation_activation_state = active_reservation` (po obou podpisech)
- `negotiation_window_days = 30` (běží od `reservation.activated_at`; deadline na jednání + realizaci financování)
- `developer_payment_timeout_days = 14` (běží od `investment_confirmed_at`; developer platí platformě provizi)
- `broker_payout_timeout_days = 3` (běží od `platform_paid_at`; platforma vyplácí brokera/brokery)

**Implementační poznámka (DEV):**
- SLA defaulty ukládat na `Ticket` (admin je může měnit).
- Při vytvoření `Reservation` zkopírovat hodnoty do rezervace (auditně „zamrazit“ SLA pro konkrétní case) + spočítat konkrétní `*_due_at`.
- Admin akce „Prodloužit čas“ upravuje `*_due_at` na rezervaci (nemění historický snapshot).

### 0.6 Rezervace — odkrývání identit + fáze jednání
**Status:** IN PROGRESS

**Zadání od vás (kanonický flow):**
1) Broker vytvoří rezervaci pro investora na konkrétní tiket.
2) Investor podepíše do **48h** (investor **nemá přístup do platformy**; podepisuje přes *sign link*).
3) Developer podepíše do **48h**.
4) Po obou podpisech: `reservation.state = active_reservation` a proběhne **aktivace rezervace** (`activated_at`).
5) V momentu aktivace se **odkryjí identity**:
   - **Developerovi** se odkryje **jméno investora** (v platformě + notifikace).
   - **Investorovi** se odkryje **jméno projektu + jméno developera** (*mimo platformu* – v potvrzení/sign page nebo e-mailu).
   - **Brokerovi/Adminovi** se v platformě odkryjí obě strany.
6) Následuje **jednání / dofinancování** (default **30 dní** od aktivace; admin může prodloužit).
7) Poté dojde k **financování projektu na účet developera** (`investment_confirmed_at`).
8) **Teprve v momentu financování vzniká nárok na provizi platformě** (a broker o tom ví).
9) Developer má defaultně **14 dní** na úhradu provize platformě (`platform_paid_at`) – admin může upravit/prodloužit.
10) Platforma má defaultně **3 dny** od `platform_paid_at` na výplatu provize brokerům (admin může upravit/prodloužit).

**Poznámka:** Brokerovi musíme v UI i v notifikacích opakovaně komunikovat, že **aktivní rezervace ≠ vznik nároku na provizi** (nárok až po `investment_confirmed_at`).

### 0.7 Forma investice A (MVP)
**Status:** IN PROGRESS

**Zadání:** MVP má mít „Forma investice A“.

**Důležité omezení od vás:** „**přímá půjčka**“ = **NE** (nepoužívat jako typ/label).

#### Kanonické enum klíče (KANONICKÝ DOMAIN DICTIONARY — přísně závazné klíče)
- `senior_loan` — Seniorní zápůjčka
- `junior_loan` — Juniorní zápůjčka
- `mezzanine` — Mezaninové financování
- `equity` — Kapitálový vstup
- `joint_venture` — Joint Venture
- `profit_share` — Podíl na zisku
- `convertible_loan` — Konvertibilní zápůjčka

#### Starší varianta (k referenci, ale **NEkanonická**)
V podkladech existuje i klíč `direct_loan` („Přímá půjčka projektu“) – ten je podle vašeho zadání **out of scope**.

#### Návrh pro MVP (Forma investice A)
- **Návrh:** `senior_loan` (UI label: „Seniorní zápůjčka“)
- **UI pravidlo:** nepoužívat wording „přímá půjčka“.

**Status rozhodnutí:** TODO (potřebujeme potvrdit, zda „Forma A“ = `senior_loan`, nebo jiná kanonická forma).

### 0.8 Typy projektů (A) — analýza pro real estate + finance (B2B)
**Status:** IN PROGRESS

**Zadání od vás:** bereme variantu **A** jako základ, ale máme udělat **analýzu**, jaké typy projektů dávají smysl pro realitní business a financování (B2B, **bez hypoték**).

#### Jak to uchopit správně (aby to šlo filtrovat i škálovat)
V praxi se vyplatí rozlišit **2 osy**, protože „typ projektu“ může znamenat dvě věci:
1) **Asset class / segment nemovitosti** (co to je: rezidenční, logistika…)
2) **Deal purpose / fáze** (proč se financuje: development, rekonstrukce, bridge, refinancování…)

👉 Doporučení pro MVP: **držet v DB kanonický `project_type` jako asset class** (varianta A) a pokud budeme chtít finanční pohled, přidat druhé pole `deal_purpose` (volitelné). Tím se vyhneme nekonečnému seznamu kombinací.

#### A) Kanonický `project_type` (asset class) — základní sada (8)
- `residential_development` — Rezidenční development
- `commercial_development` — Komerční development
- `mixed_use` — Smíšený projekt
- `logistics` — Logistika / sklady
- `hospitality` — Hotely a ubytování
- `industrial` — Průmyslový projekt
- `land_development` — Pozemkový development
- `reconstruction` — Rekonstrukce / revitalizace

#### B) Co typicky chce realitní finance řešit (návrh doplňkové osy `deal_purpose`)
Tohle jsou nejčastější finanční scénáře v B2B real estate (bez hypoték):
- `development_financing` — výstavba (financování milníků)
- `reconstruction_financing` — rekonstrukce / redevelopment
- `buy_and_hold` — akvizice nebo financování nemovitosti na pronájem (income)
- `refinancing` — refinancování existujícího úvěru
- `bridge_financing` — krátkodobé překlenovací financování
- `land_entitlement` — pozemky + povolení / změna územního plánu
- `brownfield_redevelopment` — brownfield / areály (volitelné)
- `special_situations` — speciální projekty (hotel, senior housing, energetika…) (volitelné)

#### Poznámka k UI
- Pokud budeme v UI zobrazovat jen jedno pole, můžeme `project_type` zobrazit jako hlavní badge a `deal_purpose` jako sekundární štítek.
- V matchingu dává smysl vážit více **deal_purpose** (protože ovlivňuje riziko/horizont), zatímco `project_type` je spíš segment.

### 0.9 Provize — struktura (Kč/%), split, timing (nárok až po financování)
**Status:** IN PROGRESS

#### Kanonický princip (od vás)
- Každý **projekt/tiket** je **zasmluvněn s developerem**: platforma má nárok na **X % z částky, která bude profinancována na daném tiketu**.
- Z této částky se následně dělí **platforma + tipař 1 + tipař 2**.
- **Rozdělení podílů** musí jít **zadávat ručně adminem** (per tiket / per konkrétní provizi).
- Default pro příklad: **50 / 25 / 25**.
- Pokud je broker stejná osoba v obou rolích (tipař1 i tipař2), dostane **25% + 25% = 50%**.

#### Nárok vs. evidence (kritické pro UI)
- Aktivní rezervace (oba podpisy) **NEZNAMENÁ** vznik nároku brokera na provizi.
- Při aktivaci rezervace provizi pouze **evidujeme / trackujeme**.
- **Nárok platformy na provizi vzniká až po financování** (`investment_confirmed_at`).

#### Časování a SLA (defaulty)
- `reservation.activated_at` → běží `negotiation_window_days = 30` na dokončení financování (admin může prodloužit).
- `investment_confirmed_at` → vznik nároku platformy na provizi a startuje deadline pro developera.
- `developer_payment_due_at = investment_confirmed_at + 14 dní` (admin může upravit/prodloužit)
- `broker_payout_due_at = platform_paid_at + X dní` (default 3; admin může upravit/prodloužit)

#### Datový model (návrh, aby seděl na byznys i brand)
- `platform_fee_percent` (X %) — smluvní nárok platformy (z profinancované částky)
- `funded_amount_czk` — částka profinancovaná na tiket (CZD)
- `total_commission_amount_czk = funded_amount_czk * platform_fee_percent`
- `split_platform_percent` / `split_origin_broker_percent` / `split_reservation_broker_percent` — admin editable, suma = 100
- `split_*_amount_czk` — dopočítané částky pro payout

#### Brand pravidlo
- V UI se provize komunikuje **primárně v Kč**.
- % je **sekundární** (admin/config, exporty, audit).

#### Speciální pravidlo: kdo přivedl projekt
- Pokud projekt přivedl **developer**, pak **nevzniká role tipař1** (nebo má 0 %).
- Pokud projekt přivedl **broker**, pak existuje tipař1 (origin) a může mít podíl.
- Konkrétní % a role jsou vždy **adminem nastavitelné**.




---


---

## 1) Přehled předávky (co dostane kdo)

### 1.1 Balíček pro programátora (Backend + Frontend)
**Cíl:** Mít 100% implementovatelnou specifikaci: datový model, stavy, pravidla, API kontrakty, edge cases, admin akce, chybové stavy.

**Obsah (kapitoly níže):**
- Doménový model & entity
- Stavové automaty (project/ticket/reservation/commission…)
- Business pravidla a validace
- API kontrakty + error codes
- Notifikace/eventy
- Admin rozhraní (co smí/nesmí)
- GDPR/Compliance požadavky
- Seed data / test scénáře

### 1.2 Balíček pro UI/UX designera
**Cíl:** Mít jasný seznam obrazovek, komponent, stavů, formulářů a copy, včetně pravidel viditelnosti a A11y.

**Obsah (kapitoly níže):**
- Informační architektura (IA) a navigace
- Seznam obrazovek + účel
- Komponenty a jejich stavy
- Formuláře: fieldy, validace, chyby
- State → UI mapping (labely, badge, texty)
- Copy (mikrocopy, e-maily/notifikace)
- Design system tokeny + A11y

---

## 2) Registr zdrojových souborů (Artifact Registry)
**Status:** TODO

> Sem dáme přehled všech vašich vstupních souborů a co z nich bereme.

### 2.1 Seznam artefaktů
| ID | Název souboru | Typ | Popis (co v něm je) | Použijeme pro | Priorita | Stav zpracování |
|---|---|---|---|---|---|---|
| A-001 | TODO | docx/md | TODO | DEV / UI / BOTH | High/Med/Low | TODO |

### 2.2 Konflikty a verze
| Oblast | Konflikt mezi zdroji | Preferovaný zdroj | Poznámka | Stav |
|---|---|---|---|---|
| Reservation Active | TODO | TODO | Aktivní až po obou podpisech | DONE |

---

# ČÁST A — DOKUMENTACE PRO PROGRAMÁTORA

## A0) Implementační přehled
**Status:** TODO

### A0.1 Co programátor implementuje (scope)
- [ ] MVP scope
- [ ] Post-MVP scope
- [ ] Out of scope

### A0.2 Systémové hranice a integrace
- [ ] E-sign (jaký provider, callbacky, ověření)
- [ ] Email/SMS/In-app notifikace
- [ ] Platební tok (pokud existuje)
- [ ] Externí registry (ISIN/LEI apod. pokud relevantní)

### A0.3 Role & oprávnění (RBAC/RBA)
- [ ] Role seznam
- [ ] Matice oprávnění (akce × role)
- [ ] Viditelnost dat (co kdo nikdy neuvidí)

**Otázky:**
- (Q-A0-1) Které role jsou v MVP (minimálně)?

---

## A1) Doménový slovník (Glossary)
**Status:** TODO

### A1.1 Kanonické pojmy
- [ ] Projekt
- [ ] Ticket / nabídka investice
- [ ] Rezervace
- [ ] Investor
- [ ] Developer
- [ ] Broker / Obchodník
- [ ] Provize
- [ ] Zajištění / formy zajištění
- [ ] Formy investice

### A1.2 Terminologické mapování (legacy → kanonické)
- [ ] Levely (wolf/alfa/… → kanonické)
- [ ] Pojmenování stavů (pokud se liší napříč dokumenty)

---

## A2) Datový model (Entity Dictionary)
**Status:** TODO

> Každá entita: účel, pole, typy, validace, vazby, indexy, defaulty, audit.

### A2.1 Entity list
- [ ] User
- [ ] Company
- [ ] Investor profile
- [ ] Developer profile
- [ ] Broker profile
- [ ] Project
- [ ] Ticket
- [ ] Reservation
- [ ] Commission
- [ ] Document / Attachments
- [ ] Notification
- [ ] AuditLog
- [ ] (další dle zdrojů)

### A2.2 Šablona pro entitu
**Entity:** `TODO_ENTITY`
- **Popis:** TODO
- **Primary key:** TODO
- **Relace:** TODO
- **Pole:**
  - `field_name`: typ, required/optional, default, validace
- **Indexy:** TODO
- **Audit:** co logujeme při změně

---

## A3) Stavové automaty (State Machines)
**Status:** TODO

### A3.1 Project lifecycle
- [ ] Stavy
- [ ] Povolené přechody
- [ ] Kdo může transition vyvolat
- [ ] Validace a blokace

### A3.2 Ticket lifecycle
- [ ] Stavy
- [ ] Přechody
- [ ] Kapacity/limity

### A3.3 Reservation lifecycle
- [ ] Stavy
- [ ] Přechody
- [ ] **Aktivní až po obou podpisech** (už potvrzeno)
- [ ] Konkurenční rezervace (race conditions)
- [ ] Expirace

### A3.4 Commission lifecycle
- [ ] Vznik provize (trigger)
- [ ] Fáze (pokud jsou)
- [ ] Vymahatelnost / deadlines
- [ ] Rozdělení provize (pokud existuje)

---

## A4) Business pravidla a validace
**Status:** TODO

### A4.1 Validace pro vstupní formuláře
- [ ] Investor input data
- [ ] Developer input data
- [ ] Project input data
- [ ] Ticket input data

### A4.2 Validace pro procesy
- [ ] Rezervace (vytvoření, podpisy, aktivace)
- [ ] Rušení rezervace
- [ ] Provize (vznik, potvrzení, vyplacení)

### A4.3 Edge cases & zakázané operace
- [ ] Co je explicitně zakázané
- [ ] Co se stane, když… (fallbacky)

---

## A5) API kontrakty
**Status:** TODO

> Popíšeme endpointy, request/response, error kódy, auth, pagination.

### A5.1 Autentizace a autorizace
- [ ] JWT / session / magic link?
- [ ] Role claims

### A5.2 Endpoint katalog
| Skupina | Endpoint | Metoda | Popis | Role | Request | Response | Errors |
|---|---|---|---|---|---|---|---|
| Auth | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

### A5.3 Error catalogue
| Code | HTTP | Zpráva pro UI | Technická zpráva | Poznámka |
|---|---:|---|---|---|
| TODO | 400 | TODO | TODO | TODO |

---

## A6) Notifikace a eventy
**Status:** TODO

### A6.1 Event katalog
| Event | Trigger | Recipient | Channel | Payload | Poznámka |
|---|---|---|---|---|---|
| TODO | TODO | TODO | in-app/email | TODO | TODO |

### A6.2 Šablony notifikací (copy)
- [ ] In-app
- [ ] Email

---

## A7) Admin rozhraní a systémové zásahy
**Status:** TODO

### A7.1 Admin akce
- [ ] Co admin může dělat
- [ ] Co admin nesmí dělat
- [ ] Audit stopa každé akce

### A7.2 Nastavení (konstanty, limity, SLA)
- [ ] Co je konfigurovatelné
- [ ] Kde je to uloženo

---

## A8) GDPR, právní a compliance požadavky
**Status:** TODO

### A8.1 Osobní údaje a retention
- [ ] Co je PII
- [ ] Jak dlouho uchováváme
- [ ] Anonymizace / pseudonymizace

### A8.2 Dokumenty a právní texty
- [ ] Rezervační smlouva — struktura, podpisy, evidence
- [ ] Další dokumenty

---

## A9) QA / Akceptační kritéria
**Status:** TODO

### A9.1 Definition of Done (DoD)
- [ ] Backend
- [ ] Frontend
- [ ] Integrace
- [ ] Bezpečnost

### A9.2 Test scénáře (happy path + edge)
- [ ] Reservation flow
- [ ] Signing flow
- [ ] Admin overrides

---

## A10) Seed data a testovací datasety
**Status:** TODO

### A10.1 Co potřebujeme
- [ ] Ukázkoví investoři (různé profily)
- [ ] Ukázkové projekty (různé typy)
- [ ] Ukázkové tickety
- [ ] Ukázkové rezervace a provize

---

# ČÁST B — DOKUMENTACE PRO UI/UX DESIGNERA

## B0) UX cíle a principy
**Status:** TODO

- [ ] Primární cíle pro uživatele (broker/investor/developer/admin)
- [ ] „MUST“ a „MUST NOT“ pravidla pro UI (bez domýšlení business logiky)

---

## B1) Informační architektura (IA) a navigace
**Status:** TODO

- [ ] Navigační strom
- [ ] Sitemap
- [ ] Pojmenování sekcí

---

## B2) Seznam obrazovek (Screen Inventory)
**Status:** TODO

| Screen | Role | Účel | Primární akce | Stavy | Poznámky |
|---|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO | TODO |

---

## B3) Klíčové user flow (UX flow)
**Status:** TODO

- [ ] Registrace a onboarding
- [ ] Vytvoření projektu / intake
- [ ] Publikace projektu a ticketů
- [ ] Rezervace + podpisy
- [ ] Admin schválení / zásah

---

## B4) Komponenty a jejich stavy
**Status:** TODO

- [ ] Cards (Project, Ticket, Reservation)
- [ ] Tables (Admin listy)
- [ ] Modaly (potvrzení, podpis)
- [ ] Status badge systém

---

## B5) Formuláře (fieldy, validace, chyby)
**Status:** TODO

### B5.1 Form katalog
| Form | Role | Fieldy | Validace | Error messages |
|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO |

---

## B6) Mapování stavů → UI (labely, texty, guardrails)
**Status:** TODO

- [ ] Každý state má:
  - label
  - popis (co se děje)
  - „na kom se čeká“ (pokud používáme)
  - doporučené CTA

---

## B7) Viditelnost dat (UI privacy)
**Status:** TODO

- [ ] Co kdo vidí (role-based)
- [ ] Co musí být maskované
- [ ] Co nikdy nesmí být v UI ani „schované“ v payloadu

---

## B8) Copy / texty (mikrocopy, notifikace, e-maily)
**Status:** TODO

- [ ] UI microcopy
- [ ] Error messages (uživatelské)
- [ ] Systémové notifikace
- [ ] E-mail šablony

---

## B9) Design System (tokeny + pravidla)
**Status:** TODO

- [ ] Barvy, typografie, spacing
- [ ] Ikony
- [ ] Komponenty (Figma library)
- [ ] Dark mode? (pokud relevantní)

---

## B10) Přístupnost (A11y)
**Status:** TODO

- [ ] WCAG cíle
- [ ] Kontrast
- [ ] Focus states
- [ ] Klávesnice

---

## B11) Responsive a breakpointy
**Status:** TODO

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

---

## B12) Analytics / tracking (pokud bude)
**Status:** TODO

- [ ] Eventy z UI
- [ ] Kritické funnel kroky

---

# PŘÍLOHY (Appendices)

## C1) Katalog enumů a jejich labelů
**Status:** TODO

## C2) Katalog error kódů
**Status:** TODO

## C3) Katalog dokumentů (Document Types)
**Status:** TODO

## C4) Kanonické mapování levelů (legacy → kanonické)
**Status:** TODO

---

# Backlog doplnění (rychlý seznam)

- [ ] Naplnit Artifact Registry (2.1) ze všech nahraných souborů
- [ ] Vyrobit kanonický Glossary (A1)
- [ ] Vyextrahovat entity + pole do A2
- [ ] Dopsat state machines (A3)
- [ ] Doplnit API kontrakty (A5)
- [ ] Doplnit Screen inventory (B2)
- [ ] Doplnit Form katalog (B5)

