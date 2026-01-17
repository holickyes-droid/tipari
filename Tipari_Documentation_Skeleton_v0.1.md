# Tipari.cz — Dokumentace pro předání (kostra)

**Účel:** Tohle je *kostra* jednotné dokumentace pro předání **programátorovi (backend + frontend)** a **UI/UX designerovi**. Do jednotlivých sekcí budeme postupně doplňovat data z vašich zdrojových souborů (včetně Word).  
**Stav:** Skeleton v0.1 (bez doplněných hodnot)  
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

### 0.4 Slovník levelů (poznámka)
- Uvedl jste, že levely jste měl pojmenované jinak (např. „wolf, alfa, gold, silver…“). V dokumentaci vytvoříme:
  - **Kanonický seznam názvů** (to, co chceme v produktu)
  - **Mapování legacy názvů → kanonické názvy**

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

