# Tipari.cz – Dokumentace pro vývoj a UI/UX (Handoff Pack)

> Verze: **1.1 (draft)**  
> Datum generování: **2026-01-17**  
> Určeno pro: Backend/Frontend vývojáře, UI/UX designéra, Admin/Operations

Tento dokument je sestaven z vámi nahraných zdrojů (Word/MD) + z posledních rozhodnutí v chatu. U každé části uvádím **kde je nesoulad** mezi dokumenty a aktuálním rozhodnutím.

## 0. Zdrojové dokumenty (Artifact Registry)

- Business & produkt: `Tipari_Business_Specification_Summary.md`, `Tipari_Functional_Blueprint.md`
- Právní & compliance: `právní architektura.docx`, `FORMY INVESTICE.docx`, `FORMY ZAJIŠTĚNÍ.docx`, `FORMY FINANCOVÁNÍ VS ZAJIŠTĚNÍ.docx`
- Data vstupy & enumy: `Zadání projektu do systému.docx`, `VSTUPNÍ DATA O INVESTOROVI.docx`, `REGISTRACE OBCHODNÍK DEVELOPER.docx`, `VYUŽITÍ PROSTŘEDKŮ.docx`, `ZNALECKÝ POSUDEK.docx`
- RBAC & viditelnost: `TABULKA PRÁVA A VIDITELNOSTI.docx`
- Finance/provize: `ROZDĚLENÍ PROVIZE.docx`
- UI/Brand: `BRAND A PRODUKTOVÁ IDENTITA.docx`, `TIPARI_DESIGN_SYSTEM_COMPLETE.md`, `ZÁKLADNÍ DESIGNOVÁ PRAVIDLA.docx`

## 1. Executive Summary

### 1.1 Purpose & Mission
Tipari.cz je **B2B platforma** pro rychlé a řízené propojení **obchodníků (tipařů/brokerů)** a **developerů** nad konkrétními investičními příležitostmi (projekty/tikety). Klíčová hodnota je v **governance (schvalování, auditovatelnost, SLA)** a v řízení rezervací + provizí.

Klíčový princip: **Investor nemá přímý přístup do platformy** – investor je veden jako CRM záznam brokera; platforma řeší matching, rezervace, governance a provize.

### 1.2 User Value & Core Benefits
- **Broker (Obchodník / tipař)**: eviduje investory, získává matching na relevantní tikety, vytváří rezervace a sleduje provize. Je motivován vyšší úrovní (více slotů) a transparentním SLA.  
- **Developer**: publikuje projekty/tikety, přijímá rezervace, podepisuje smlouvy, dostává kapitál a následně řeší provizi platformě.  
- **Platforma (Admin/Operations/Compliance)**: schvaluje účty/projekty, řídí SLA, audit, incidenty a provizní vypořádání.

### 1.3 Executive Overview
Zjednodušený high-level tok: 1) registrace + schválení účtů, 2) vznik projektu/tiketu, 3) broker vloží investora a získá matching, 4) broker vytvoří rezervaci, 5) platforma provede kontrolu a po podpisu obou stran se rezervace stává aktivní, 6) běží jednání (default 30 dní), 7) po profinancování projektu vzniká nárok na provizi platformě, developer uhradí provizi (default 14 dní) a platforma vyplatí podíl brokerům (default 3 dny).

## 2. Project Scope

### 2.1 In-scope (MVP)
- Registrace + schválení rolí **Broker / Developer / Admin**
- CRM investorů (pouze broker) – evidence + preference
- Projekty + tikety (vytvoření, editace, publikace, validace, blokátory)
- Matching investorů na tikety (rule-based + score)
- Rezervace + smlouvy (workflow, SLA, podpisy, viditelnost dat)
- Provize & finance (nárok, výpočet, rozdělení, payout, ruční korekce adminem)
- Audit log, incident management, governance & compliance základ (schvalování, disclaimery)
- Automatizace: SLA kontrola, expirace, notifikace, matching refresh

### 2.2 Out-of-scope (MVP)
- Investor portal / investor login (explicitně není v MVP)
- Hypotéky / retailové úvěry pro fyzické osoby (B2B only)
- „Garantované výnosy“ a veřejně nabízené cenné papíry (viz compliance)
- Plně automatizované payouts (lze mít jako ruční proces + audit v MVP)

## 3. User Roles & Stakeholders

- **Admin (Platforma)**: schvaluje účty, projekty, tikety; nastavuje SLA a může ho prodlužovat; nastavuje provizní parametry; řeší incidenty a audit.
- **Broker (Obchodník / tipař)**: má vlastní účet; eviduje investory (CRM záznamy) a jejich preference; vytváří rezervace. Má úroveň (tier) a sloty.
- **Developer**: má účet; spravuje projekty/tikety; reaguje na rezervace; po financování hradí provizi platformě.
- **Investor**: není uživatel platformy; je veden jako entita v CRM brokera. Může obdržet link k podpisu dokumentů mimo UI (pokud je v procesu podpisu).
- **Compliance/Legal**: stakeholder pro texty disclaimerů, GDPR, archivaci.
- **Support/Operations**: stakeholder pro incidenty, SLA a manuální zásahy.

## 4. Core Workflows & Processes

### 4.1 Registrace a schválení účtů
- Broker vyplní registraci (identifikace, firma/IČO, region, souhlasy). Developer analogicky. Admin schvaluje a aktivuje přístup.

**Broker registrace – datová tabulka (výňatek, kompletní níže v příloze):**

| Pole | Typ / ENUM | Poznámka |
| --- | --- | --- |
| Typ subjektu | ENUM: Fyzická osoba / Právnická osoba | Určuje další pole |
| Jméno a příjmení (FO) | Text | Povinné |
| Název společnosti (PO) | Text | Povinné |
| IČO (PO) | Text | Povinné |
| Datum narození (FO) | Datum | AML |
| Státní příslušnost | Text | AML |
| Daňová rezidence | Text | AML |
| E-mail | Email | Přihlašovací |
| Telefon | Telefon | Ověření |
| Adresa bydliště / sídla | Text | Povinné |

### 4.2 Zadání projektu a tiketu
Projekt = „obal“ (developer, typ, lokalita, popis, dokumenty). Tiket = konkrétní investiční příležitost v rámci projektu (částka, výnos, zajištění, využití prostředků, dokumenty, publish_status).

> Zdroj: `Zadání projektu do systému.docx` + následná rozhodnutí v chatu (zejména SLA, viditelnost, provize, investor bez UI).

#### A) Data o projektu

##### A1️⃣ Základní identifikace projektu
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Název projektu | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Typ projektu | ENUM: Rezidenční, Logistika, Komerční, Smíšený, Retail, Ubytovací zařízení, Pozemky, Energetika, Ostatní | Zadává, Zdroj informace | Zadává | Schvaluje |
| Stručný popis projektu | Text (3–5 vět) | Zadává, Zdroj informace | Zadává | Schvaluje |

##### A2️⃣ Lokalita & nemovitost
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Obec / město | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Kraj | ENUM: Hlavní město Praha, Středočeský, Jihočeský, Plzeňský, Karlovarský, Ústecký, Liberecký, Královéhradecký, Pardubický, Vysočina, Jihomoravský, Olomoucký, Zlínský, Moravskoslezský | Zadává, Zdroj informace | Zadává | Schvaluje |
| Přesná adresa | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Popis nemovitosti | Text | Zadává, Zdroj informace | Zadává | Schvaluje |

##### A3️⃣ Developer / vlastník projektu
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Název společnosti | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| IČO | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Sídlo společnosti | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Kontaktní osoba – jméno | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Kontaktní osoba – e-mail | Email | Zadává, Zdroj informace | Zadává | Schvaluje |
| Kontaktní osoba – telefon | Telefon | Zadává, Zdroj informace | Zadává | Schvaluje |
| Profil developera | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Reference developera | Text | Zadává, Zdroj informace | Zadává | Schvaluje |

##### A4️⃣ Finanční rámec projektu
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Celkový rozpočet projektu | Číslo (CZK) | Zadává, Zdroj informace | Zadává | Schvaluje |
| Vlastní kapitál | Číslo (CZK) | Zadává, Zdroj informace | Zadává | Schvaluje |
| Cizí zdroje – typ | ENUM: Banka, Úvěr, Jiné | Zadává, Zdroj informace | Zadává | Schvaluje |
| Cizí zdroje – výše | Číslo | Zadává, Zdroj informace | Zadává | Schvaluje |
| Orientační podmínky | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Účel financování (tag) | ENUM: Koupě, Výstavba, Refinancování, Provoz, Prodej | Zadává, Zdroj informace | Zadává | Schvaluje |
| Harmonogram projektu | Text | Zadává, Zdroj informace | Zadává | Schvaluje |

##### A5️⃣ Právní & technický stav
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Vlastnický stav | ENUM: Vlastník, SPV | Zadává, Zdroj informace | Zadává | Schvaluje |
| Stavební stav | ENUM: Povolení ANO, Povolení NE | Zadává, Zdroj informace | Zadává | Schvaluje |
| Existující zástavy | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Věcná břemena | Text | Zadává, Zdroj informace | Zadává | Schvaluje |

##### A6️⃣ Dokumenty k projektu
| Dokument | Typ | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| List vlastnictví | Soubor (PDF) | Zadává, Zdroj informace | Zadává | Schvaluje |
| Projektová dokumentace | Soubor | Zadává, Zdroj informace | Zadává | Schvaluje |
| Rozpočet projektu | Soubor | Zadává, Zdroj informace | Zadává | Schvaluje |
| Term sheet / shrnutí | Soubor | Zadává, Zdroj informace | Zadává | Schvaluje |
| Další podklady | Soubor | Zadává, Zdroj informace | Zadává | Schvaluje |

#### B) Data o tiketu

##### B1️⃣ Základní parametry tiketu
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Typ tiketu | ENUM: Dluhový, Ekvitní, Mezanin, Ostatní | Zadává, Zdroj informace | Zadává | Schvaluje |
| Investiční částka | Číslo (CZK) | Zadává, Zdroj informace | Zadává | Schvaluje |
| Měna | ENUM: CZK, EUR | Zadává, Zdroj informace | Zadává | Schvaluje |

##### B2️⃣ Výnos & doba
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Výnos p.a. | Procenta | Zadává, Zdroj informace | Zadává | Schvaluje |
| Forma výnosu | ENUM: Fixní, Variabilní, Jednáním | Zadává, Zdroj informace | Zadává | Schvaluje |
| Podíl na zisku | ENUM: Ano, Ne, Jednáním | Zadává, Zdroj informace | Zadává | Schvaluje |
| Doba trvání | Číslo + ENUM: měsíce, roky | Zadává, Zdroj informace | Zadává | Schvaluje |
| Výplata výnosu | ENUM: Měsíční, Kvartální, Pololetní, Roční, Na konci | Zadává, Zdroj informace | Zadává | Schvaluje |

##### B3️⃣ Zajištění tiketu
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Je investice zajištěná | ENUM: Ano, Ne | Zadává, Zdroj informace | Zadává | Schvaluje |
| Typ zajištění | MULTI-ENUM (viz sekce 9.5) | Zadává, Zdroj informace | Zadává | Schvaluje |
| Pořadí zástavy | ENUM: 1., 2., Jiné | Zadává, Zdroj informace | Zadává | Schvaluje |
| Odhad LTV | Procenta | Zadává, Zdroj informace | Zadává | Schvaluje |
| Popis zajištění | Text | Zadává, Zdroj informace | Zadává | Schvaluje |

##### B4️⃣ Investiční struktura
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Využití prostředků (kanonické) | Percent breakdown (součet 100 %, viz sekce 9.6) | Zadává, Zdroj informace | Zadává | Schvaluje |
| Vztah tiketu k projektu | ENUM: Seniorní, Podřízený, Jiné | Zadává, Zdroj informace | Zadává | Schvaluje |
| Exit strategie | ENUM: Prodej, Refinancování, Splacení z provozu, Jiné | Zadává, Zdroj informace | Zadává | Schvaluje |

##### B5️⃣ Rezervace & proces
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Maximální počet aktivních rezervací | Číslo | Zadává | Zadává | Schvaluje |
| SLA podpis investora | Číslo (hodiny) – default 48h | Systém | Systém | Override (per tiket i per rezervace) |
| SLA podpis developera | Číslo (hodiny) – default 48h | Systém | Systém | Override (per tiket i per rezervace) |
| Jednání po aktivaci rezervace | Číslo (dny) – default 30 dnů | Systém | Systém | Override + prodlužování |

##### B6️⃣ Provize & obchodní podmínky
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Provize platformy (primárně) | Číslo (CZK) | Zadává | Ne | Schvaluje / může upravit |
| Provize platformy (sekundárně) | Procenta (odvozeno) | Systém (výpočet) | Ne | Schvaluje |
| Rozdělení provize | Procenta (součet 100 %) | Ne | Ne | Admin (ručně per tiket) |
| Okamžik vzniku nároku | ENUM: Financování projektu na účet developera | Systém (event) | Jen vidí | Admin potvrzuje (audit) |
| Okamžik vyplacení brokerům | ENUM: Po úhradě provize platformě + payout window | Systém | Jen vidí | Admin / systém |

##### B7️⃣ Dokumenty k tiketu
| Dokument | Typ | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Rezervační smlouva / podklady | Soubor | Zadává | Zadává | Schvaluje |
| Investiční smlouva | Soubor | Zadává | Zadává | Schvaluje |
| Specifické podmínky tiketu | Text | Zadává | Zadává | Schvaluje |
| Rizika spojená s tiketem | Text | Zadává | Zadává | Schvaluje |


### 4.3 Investor CRM (broker) + Matching

#### Co je „CRM investora“ v Tipari.cz
Investor je **CRM entita (bez loginu)**, kterou na platformě spravuje **broker**. Broker má v IA sekci **„Investoři“**, kde:
- vidí seznam investorů,
- zakládá nového investora,
- upravuje detaily a preference,
- může investora deaktivovat (např. „už neinvestuje“).

Investor se používá pro:
- **matching** (doporučení tiketů podle preferencí),
- **rezervace** (rezervace vždy odkazuje na konkrétního investora z CRM),
- **audit & compliance** (kdo koho uvedl do dealu, kdy, jaké preference byly deklarované).

> Zdroj: `VSTUPNÍ DATA O INVESTOROVI.docx`.

#### 4.3.1 Broker UI (MVP)
- **Broker → Investoři (list)**: vyhledávání, filtrování (typ, min/max ticket, region), stav (active/inactive)
- **Broker → Přidat investora (form)**: identita + vztah + preference + souhlasy
- **Broker → Detail investora**: přehled + editace + historie změn (audit)

#### 4.3.2 Investor – identifikační data (A)
> Pozn.: investor **nemá UI**, ale e-mail/telefon jsou klíčové pro doručení eSign linku při podpisu.

| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Typ investora | ENUM: Fyzická osoba / Právnická osoba | CRUD | View/override | Určuje další pole |
| Jméno a příjmení (FO) | Text | CRUD | View/override | Povinné pro FO |
| Název společnosti (PO) | Text | CRUD | View/override | Povinné pro PO |
| IČO | Text | CRUD | View/override | Povinné pro PO |
| DIČ | Text | CRUD | View/override | Volitelné |
| E-mail | Email | CRUD | View/override | Povinné |
| Telefon | Telefon | CRUD | View/override | Doporučené |
| Adresa bydliště / sídla | Text | CRUD | View/override | Povinné |
| Korespondenční adresa | Text | CRUD | View/override | Volitelné |
| Poznámky | Text | CRUD | View/override | Interní poznámky brokera |

#### 4.3.3 Vztah brokera k investorovi (C)
| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Typ vztahu | ENUM: Osobní kontakt, Klient, Partner, Jiný | CRUD | View | Pro audit |
| Délka vztahu | ENUM: <6 měsíců, 6–12 měsíců, 1–3 roky, >3 roky | CRUD | View | Pro audit |
| Frekvence kontaktu | ENUM: Týdně, Měsíčně, Kvartálně, Ad hoc | CRUD | View | UX / spolehlivost |
| Preferovaná komunikace | ENUM: Telefon, Email, Osobně, Kombinace | CRUD | View | UX |
| Podepsané NDA | ENUM: Ano, Ne | CRUD | View | Compliance |
| Investor informován o Tipari | ENUM: Ano, Ne | CRUD | View | Audit |

#### 4.3.4 Investiční preference & limity (D)
| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Minimální investiční částka | Číslo (CZK) | CRUD | View | Matching hard filter |
| Maximální investiční částka | Číslo (CZK) | CRUD | View | Matching hard filter |
| Preferovaná měna | ENUM: CZK, EUR | CRUD | View | |
| Minimální požadovaný výnos p.a. | Procenta | CRUD | View | Score |
| Maximální délka investice | Číslo + ENUM: měsíce, roky | CRUD | View | Hard/soft |
| Očekávaná výplata výnosu | ENUM: Měsíční, Kvartální, Pololetní, Roční, Na konci | CRUD | View | |
| Požadavek na zajištění | ENUM: Ano, Ne, Preferuji | CRUD | View | |
| Preferované typy zajištění | MULTI-ENUM (viz sekce 9.5) | CRUD | View | |
| Maximální LTV | Procenta | CRUD | View | |
| Preferované typy projektů | MULTI-ENUM (viz sekce 9.3) | CRUD | View | |
| Preferovaná fáze projektu | ENUM: Příprava, Výstavba, Provoz | CRUD | View | |
| Preferované regiony | MULTI-ENUM (kraje / města) | CRUD | View | |
| Preferovaná forma financování / investice | ENUM (viz sekce 9.4) | CRUD | View | |
| Ochota jít do podřízené pozice | ENUM: Ano, Ne, Individuálně | CRUD | View | |
| Ochota akceptovat bankovní kofinancování | ENUM: Ano, Ne | CRUD | View | |
| Ochota vstoupit do SPV | ENUM: Ano, Ne | CRUD | View | |

#### 4.3.5 Komunikace & souhlasy (E)
| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Souhlas se zpracováním osobních údajů | ENUM: Ano, Ne | CRUD | View | Povinné |
| Souhlas s přijímáním nabídek | ENUM: Ano, Ne | CRUD | View | Povinné |
| Preferovaný způsob kontaktu | ENUM: Telefon, Email, Osobně | CRUD | View | |
| Preferovaný jazyk | ENUM: CZ, EN | CRUD | View | |
| Poznámky | Text | CRUD | View | |

#### 4.3.6 AML/KYC data investora (B) – **mimo UX/UI (MVP)**
Dokument definuje i AML/KYC vrstvu pro investora, ale je označená jako **„neimplementujeme do UX/UI“**. Doporučení pro MVP:
- v datovém modelu rezervovat místo (tabulka/JSON),
- UI zatím nenasazovat,
- admin může doplňovat manuálně mimo UI nebo v interním admin-only formuláři v pozdější iteraci.

| Pole | Typ / ENUM | Kdo vyplňuje | Poznámka |
| --- | --- | --- | --- |
| Typ dokladu | ENUM: OP, Pas | Admin | |
| Číslo dokladu | Text | Admin | |
| Platnost dokladu | Datum | Admin | |
| Stát vydání | Text | Admin | |
| Kopie dokladu | Soubor | Admin | |
| PEP status | ENUM: Ano, Ne | Admin | |
| Sankční seznamy | ENUM: Bez nálezu, Nález | Systém/Admin | |
| Zdroj prostředků | ENUM: Prodej majetku, Podnikání, Zaměstnání, Jiný | Admin | |
| AML klasifikace | ENUM: Low, Medium, High | Admin | |
| Riziková poznámka | Text | Admin | |


### 4.4 Rezervace a smlouvy (SLA)
Rezervace je „uzamčení“ tiketu pro konkrétního investora (z CRM brokera). Po podpisu obou stran (investor + developer) se rezervace stává **aktivní** a odemyká identitu stran podle pravidel viditelnosti.

**SLA (defaulty, vše editovatelné adminem per tiket/rezervace):**
- podpis investora: 48h
- podpis developera: 48h
- jednání po aktivaci: 30 dní
- splatnost provize developer → platforma: 14 dní
- payout platforma → broker(ům): 3 dny

### 4.5 Financování a provize
Po profinancování projektu na účet developera vzniká nárok platformy na provizi (z profinancované částky / tiket). Provize se primárně eviduje v Kč; % je sekundární výpočet. Rozdělení podílů mezi platformu, tipaře 1 a tipaře 2 je **ručně nastavitelné adminem per tiket** (defaultní příklad 50/25/25).

### 4.6 Audit a Incident management
Všechny změny stavu (rezervace, podpisy, SLA override, financování, provize) se zapisují do audit logu. Incident management řeší odchylky (prošlá SLA, stížnosti, manuální zásahy admina).

## 5. External Dependencies

MVP počítá s těmito externími závislostmi (implementace může být postupná):
- **Autentizace**: email+password / magic link (např. Supabase Auth)
- **E-sign**: podpis rezervační smlouvy investorem a developerem (DocuSign / Signi / …)
- **Email/SMS**: notifikace na SLA, podpisy, změny stavu
- **File storage**: nahrávání dokumentů k tiketu (S3 kompatibilní)
- **Platby / fakturace**: minimálně evidenční (bankovní převod mimo systém) + audit; možnost napojení později

## 6. Constraints & Assumptions

- B2B platforma, investor nemá login ani dashboard (CRM záznam vede broker).
- Hypotéky jsou mimo scope; jde o financování projektů / ticketů.
- Všechny časy SLA jsou defaultní, ale **admin je může prodlužovat a nastavovat per tiket** (audit povinný).
- Provize je primárně v Kč (brandové pravidlo), % je sekundární atribut pro výpočet.
- Přímé „garantované výnosy“ a veřejně nabízené investiční produkty jsou mimo (compliance).

## 7. Summary of Project Boundaries

- Platforma neřeší přímé zpřístupnění investorům (žádné investor UI).
- Platforma neprovádí automatický převod peněz v MVP; eviduje události a termíny.
- Platforma nehodnotí investiční vhodnost pro investora (nejsme investiční poradce); poskytuje matching dle preferencí brokera.

## 8. Datové entity a jejich vazby

### 8.1 Přehled entit (MVP)
- **User** (login) – role: ADMIN / BROKER / DEVELOPER
- **BrokerProfile** – navázán na User a BrokerCompany; obsahuje tier, slot_capacity
- **DeveloperProfile** – navázán na User a DeveloperCompany
- **Investor** – CRM entita patří brokerovi (bez loginu) + InvestorPreferences
- **Project** – patří developerovi (DeveloperCompany), má typ, lokalitu, metadata
- **Ticket** – patří projektu; má částku, výnos, formu investice, zajištění, use-of-funds, dokumenty, publish_status
- **Reservation** – vazba Ticket ↔ Investor ↔ Broker ↔ Developer; stavová mašina + SLA
- **Commission** – vzniká na základě financování; vazba na ticket; částka CZK + split
- **CommissionSplit** – podíly Platform/Broker1/Broker2 (admin-editable)
- **AuditEvent** – append-only log událostí
- **Incident** – evidence a řešení problémů

### 8.2 Klíčové vazby
- DeveloperCompany 1—N Project
- Project 1—N Ticket
- BrokerProfile 1—N Investor
- Ticket 1—N Reservation (max 1 aktivní)
- Ticket 0..1—1 Commission (pro každý tiket max jedna aktivní provize)

## 9. Business logika

### 9.1 Tipař levely a sloty
3 úrovně (proobchodně): START (10 slotů), PARTNER (25 slotů), ELITE (50 slotů). Slot = kapacita pro aktivní rezervace.

### 9.2 SLA a prodlužování
SLA je řízeno per rezervace/tiket – admin může upravit jednotlivé časy (podpisy, jednání, splatnost, payout). Každá změna musí vytvořit audit event (kdo, kdy, z jaké hodnoty na jakou, důvod).

### 9.3 Typy projektů (enum)
Canonical (MVP) – používá se v `Project.project_type` a v preferencích investora pro matching.

| key | UI label (CZ) | Poznámka |
| --- | --- | --- |
| residential_development | Rezidenční | Výstavba / rezidenční projekty |
| logistics | Logistika | Sklady, logistické parky |
| commercial_development | Komerční | Kanceláře, komerční areály |
| mixed_use | Smíšený | Kombinace více funkcí |
| retail | Retail | Retail parky, jednotky |
| hospitality | Ubytovací zařízení | Hotely, resorty, ubytování |
| land_development | Pozemky | Pozemkový development |
| energy | Energetika | Energetické projekty (B2B) |
| other | Ostatní | Vše ostatní, case-by-case |

Poznámka ke zdrojům:
- `KANONICKÝ DOMAIN DICTIONARY.docx` obsahuje i typy **industrial** a **reconstruction**. V aktuálním setu jsou pokryté přes **other** nebo lze přidat jako volitelné „tagy/podtypy“ v další iteraci.


### 9.4 Formy financování / investice (enum)
Zdroj pravdy pro výběr „formy“ v UI je matice `FORMY FINANCOVÁNÍ VS ZAJIŠTĚNÍ.docx`.

| key | UI label (CZ) | Segment | Poznámka |
| --- | --- | --- | --- |
| loan | Zápůjčka / úvěr | Dluh | Neříkat „přímá půjčka“. |
| mezzanine | Mezaninové financování | Dluh (podřízené) | Typicky kombinace dluhu + participace. |
| bridge | Překlenovací financování (bridge) | Dluh (krátkodobé) | Časově kritické. |
| project_financing_spv | Projektové financování (SPV) | Dluh / strukturované | Finanční struktura přes SPV. |
| refinancing | Refinancování projektu | Dluh | Nahrazení existujícího financování. |
| joint_venture | Společný podnik (Joint Venture) | Partnerství / ekvita | JV smlouvy + kontrolní práva. |
| sale_leaseback | Zpětný leasing (sale & leaseback) | Transakční | Investor kupuje nemovitost a pronajímá zpět. |
| project_sale | Nabídka projektu (prodej projektu) | Transakční | Není to dluh; režim „prodej“. |

Právní poznámky (copy-ready, ze zdroje):
- **Ručení** = osobní/korporátní závazek třetí osoby.
- **Zajištění** = majetkové krytí závazku (zástava, práva, účty).
- U zástavy nemovitosti vždy uvádět pořadí (1./2.).
- „Nabídka projektu“ ≠ investiční produkt (jde o prodej, ne financování).

> Implementační doporučení: pokud chcete zachovat přesnost (senior/junior), přidejte doplňkový atribut `loan_seniority` = {senior, junior, n/a} a používejte ho společně s `investment_form=loan`.


### 9.5 Formy zajištění (enum)
Primary zajištění + možnost kombinace více forem. V UI badge + detail. Viz příloha (FORMY ZAJIŠTĚNÍ).

### 9.6 Využití prostředků (percent breakdown)
V tiketu se eviduje **procentuální rozpad využití prostředků**; součet musí být **100 %**. Toto je kanonická struktura (zdroj: `VYUŽITÍ PROSTŘEDKŮ.docx`).

**Datový typ (doporučení):** `use_of_funds_breakdown: Array<{ category: UseOfFundsCategory, percent: number }>`

| category key | UI label (CZ) | Poznámka |
| --- | --- | --- |
| property_acquisition | Nákup nemovitosti | Akvizice pozemku / budovy |
| construction | Výstavba | Hrubá stavba, dokončení |
| reconstruction | Rekonstrukce | Přestavba / revitalizace |
| refinancing | Refinancování závazků | Splacení existujícího úvěru / zápůjčky |
| bridge_financing | Překlenovací financování | Krátkodobý cashflow gap |
| capex_reserve | Projektová rezerva (CAPEX) | Nečekané náklady |
| operational_costs | Provozní náklady projektu | Energie, správa, služby |
| technical_preparation | Technická příprava projektu | Projekce, studie, povolení |
| marketing_and_sales | Marketing a prodej | Prodejní náklady |
| tax_and_transaction_costs | Daňové a transakční náklady | Daň, poplatky, právní služby |
| partner_buyout | Splacení společníka / investora | Interní restrukturalizace |
| combined_use | Kombinované využití | Více účelů – vždy vyžadovat detailní rozpad |

Volitelná doplňková tag kategorizace (pokud chcete v UI extra filtr):
- `purpose_tag` (ENUM): Koupě, Výstavba, Refinancování, Provoz, Prodej (zdroj: `Zadání projektu do systému.docx`).

Povinná právní formulace (copy-ready, ze zdroje):
Uvedené využití prostředků je plánované a může se v průběhu realizace projektu měnit v závislosti na vývoji projektu.


### 9.7 Viditelnost dat (maskování)
Viditelnost se řídí stavem rezervace. Před aktivací jsou názvy a identita maskované; po aktivaci se odemykají dle pravidel. Kompletní tabulka je v příloze.

### 9.8 Provize – výpočet a split
Platforma má nárok na X % z profinancované částky / tiket. Provize se drží primárně jako CZK; % je odvozeno. Split Platform/Broker1/Broker2 je admin-editable. Pokud Broker1==Broker2, podíl se sčítá.

## 10. API kontrakty

Níže je návrh REST kontraktů (inspirace SystemCore endpoint mapou). Implementace může být REST nebo tRPC, ale **kontrakty a role-based přístup** musí zůstat.

### 10.1 Auth
- POST `/api/auth/register/broker`
- POST `/api/auth/register/developer`
- POST `/api/auth/login`
- GET  `/api/me`

### 10.2 Broker
- GET `/api/broker/dashboard`
- CRUD `/api/broker/investors`
- GET `/api/broker/matching?ticketId=...`
- POST `/api/broker/reservations`
- GET `/api/broker/reservations`
- GET `/api/broker/commissions`

### 10.3 Developer
- GET `/api/developer/dashboard`
- CRUD `/api/developer/projects`
- CRUD `/api/developer/projects/:projectId/tickets`
- GET `/api/developer/reservations`
- POST `/api/developer/reservations/:id/sign`
- POST `/api/developer/tickets/:ticketId/financing` (evidence financování)

### 10.4 Admin
- GET `/api/admin/dashboard`
- POST `/api/admin/approvals/:entityId/approve|reject`
- POST `/api/admin/tickets/:ticketId/sla-overrides`
- POST `/api/admin/tickets/:ticketId/commission-split`
- GET `/api/admin/audit`
- CRUD `/api/admin/incidents`

## 11. Automatizace a integrační procesy

- **SLA monitor cron**: periodicky kontroluje deadliny (podpisy, jednání, splatnost, payout), posílá upozornění a případně expiruje rezervace.
- **Matching refresh cron**: přepočítá skóre matchů pro nové/změněné investory a tikety.
- **GDPR/retention job**: anonymizace/archivace dle interních pravidel.
- **Notifikační pipeline**: email/SMS/push dle role a události (auditované).

## 12. FUNCTIONAL SPECIFICATION

### 12.1 Modul Projekty a Tikety
Zdrojem canonical polí je `Zadání projektu do systému.docx` (viz tabulky výše). V tomto modulu jsou klíčové: validace, publish_status, blokátory (bez klíčových dokumentů tiket nelze publikovat).

### 12.2 Modul Rezervace a Smlouvy
Workflow a viditelnost vychází z `TABULKA PRÁVA A VIDITELNOSTI.docx`. Rezervace je aktivní po podpisu obou stran; od aktivace běží jednání (default 30 dní).

### 12.3 Modul Provize a Finance
Výpočet: commission_czk = financed_amount_czk * commission_percent. Split podle admin nastavení. Termíny: developer payment due 14 dní, broker payout 3 dny.

### 12.4 Modul Audit a Incident Management
Audit je append-only. Incident je entita řízená adminem; změny SLA a manuální zásahy vytváří incident reference.

### 12.5 Modul Matching Investorů
Investor preference jsou v `VSTUPNÍ DATA O INVESTOROVI.docx`. Matching je kombinace tvrdých filtrů (částka, region, typ projektu) a score (výnos, horizont, zajištění...).

### 12.6 Modul Governance a Compliance
Schvalování účtů, projektů, tiketu. Copy-ready právní texty a disclaimery jsou v `FORMY INVESTICE.docx` a `FORMY ZAJIŠTĚNÍ.docx`.

### 12.7 Modul Automatizace a Cron Joby
Viz sekce 11. SLA monitor musí respektovat admin override a vytvářet audit eventy.

## 13. UI/UX DESIGN SPECIFICATION

### 13.1 IA – hlavní sekce (MVP)
- Broker: Dashboard, Investoři (CRM), Matching, Tikety, Rezervace, Provize, Nastavení profilu
- Developer: Dashboard, Projekty, Tikety, Rezervace, Finance/Provize, Profil
- Admin: Dashboard, Registrace brokerů, Registrace developerů, Projekty, Tikety, Rezervace, Provize, Audit, Nastavení

### 13.2 Formuláře – kanonická pole
- Registrace: viz příloha (REGISTRACE OBCHODNÍK/DEVELOPER)
- Zadání projektu/tiketu: viz tabulky v sekci 4.2
- Investor CRM: viz tabulky v sekci 4.3

### 13.3 Design systém (high-level)
Řídit se `TIPARI_DESIGN_SYSTEM_COMPLETE.md` + `ZÁKLADNÍ DESIGNOVÁ PRAVIDLA.docx` + brand. Klíčové: minimalistický vzhled, důvěryhodnost, jasné typografické hierarchie a konzistence komponent.

## 14. Nesrovnalosti & otevřené body

Níže jsou nalezené nesoulady mezi zdrojovými dokumenty. V tomto packu jsem nastavil pracovní „source of truth“ tak, aby šel systém rovnou stavět. Zároveň uvádím, co je potřeba případně rozhodnout / sjednotit.

1) **ProjectType**: `KANONICKÝ DOMAIN DICTIONARY.docx` obsahuje jiné typy (např. industrial, reconstruction). Aktuální volba v packu je 9 typů (Rezidenční…Ostatní) + mapování. Pokud chcete, můžeme industrial/reconstruction přidat jako samostatné volby (nebo jen tagy).

2) **Forma financování/investice**: existují 3 zdroje (`FORMY INVESTICE`, `KANONICKÝ DOMAIN DICTIONARY`, `FORMY FINANCOVÁNÍ VS ZAJIŠTĚNÍ`). V packu je jako UI výběr použita **matice** (8 forem) a výslovně je odstraněn label **„přímá půjčka“**. Pokud chcete granularitu (senior/junior/konvertibilní/podíl na zisku), doporučuji řešit jako **subtypy** (další atributy) nad touto osou.

3) **Zajištění**: `Zadání projektu do systému.docx` uvádí dlouhý seznam typů zajištění, `FORMY ZAJIŠTĚNÍ.docx` definuje DB-ready enum a `KANONICKÝ DOMAIN DICTIONARY.docx` má vlastní enum. V packu je bráno jako kanonické „zajištění jako kombinovatelné položky + pořadí + LTV“, viz příloha D. Je potřeba jen sjednotit finální list pro UI (lze odvodit z přílohy D).

4) **Investor CRM – role „zdroj pravdy“**: `VSTUPNÍ DATA O INVESTOROVI.docx` má u některých polí „Admin = zdroj pravdy“, ale produktové rozhodnutí je „Investor bez přístupu“ a investor je veden brokerem. V packu: **broker spravuje**, admin má **override/view** (kvůli compliance). Pokud admin nemá mít právo editovat investory, dá se to zpřísnit.

5) **Use of Funds**: různé taxonomie napříč dokumenty. V packu je kanonické **percent breakdown = 100 %** (`VYUŽITÍ PROSTŘEDKŮ.docx`) + volitelný tag.

---


## Přílohy (výňatky tabulek)

### Příloha A – Viditelnost (rezervace)

> Aktualizováno podle rozhodnutí: **investor nemá UI**, rezervace je aktivní po podpisu obou stran a až poté se odemykají identity.

| 🔢 Stav rezervace | 👤 Broker (obchodník) | 🏗️ Developer | 🧑‍💼 Platforma (Admin) | 💼 Investor (mimo UI) |
| --- | --- | --- | --- | --- |
| 1️⃣ Rezervace v přípravě (reservation_in_progress) | Vidí parametry tiketu (výnos, LTV, doba, částka, zajištění).<br>❌ Nevidí název projektu ani identitu developera. | Vidí projekt/tiket.<br>❌ Nevidí investora ani brokera. | Vidí vše. | — |
| 2️⃣ Odesláno ke schválení platformou (reservation_submitted_to_platform) | Vidí parametry + stav „odesláno“. | Vidí stav „čeká na schválení platformou“. | Vidí vše + akce Schválit/Zamítnout. | — |
| 3️⃣ Kontrola platformy (platform_due_diligence) | Vidí stav „probíhá kontrola“. | Vidí stav „investor v ověřování“. | Aktivně kontroluje, vidí vše. | — |
| 4️⃣ Schváleno platformou (platform_approved) | Vidí „schváleno – čeká se na podpisy“. | Vidí „čeká se na podpis investora“. | Vidí vše, spravuje SLA podpisů. | Obdrží e-mail s eSign linkem na podpis. |
| 5️⃣ Investor podepsal (investor_signed) | Vidí „investor podepsal – čeká se na podpis developera“. | Vidí „investor podepsal – podepište do 48h“.<br>❌ Stále nevidí jméno investora. | Vidí vše. | Potvrzení o podpisu (e-mail). |
| 6️⃣ Rezervace aktivní (active_reservation) | Vidí kompletní informace o projektu i developerovi (odmaskováno). | Vidí kompletní informace o investorovi a brokerovi (odmaskováno). | Vidí vše. | Notifikace, že rezervace je aktivní (bez UI). |
| 7️⃣ Rezervace zrušena / vypršela (expired / cancelled) | Vidí základní parametry + důvod ukončení. | Vidí historii u tiketu (bez detailů investora, pokud nedošlo k aktivaci). | Vidí vše + audit. | E-mail o zrušení/expiraci (pokud byl v procesu podpisu). |


### Příloha B – Provize (nastavení)

| Pole | Popis | Typ / ENUM | Kdo zadává | Poznámka |
| --- | --- | --- | --- | --- |
| Celková provize | Celková provize z tiketu | Procenta / CZK | Admin | Základ pro výpočet |
| Měna provize | Měna, ve které se provize počítá | ENUM: CZK, EUR | Admin | Musí odpovídat tiketu |
| Platforma – podíl | Podíl platformy na provizi | Procenta | Admin | Povinné pole |
| Tipař 1 – podíl | Podíl primárního tipaře | Procenta | Admin | Přímý vztah k investorovi |
| Tipař 2 – podíl | Podíl sekundárního tipaře | Procenta | Admin | Přímý vztah k projektu |
| Součet podílů | Kontrolní součet | Automaticky | Systém | Musí = 100 % |
| Typ rozdělení | Jak je provize rozdělena | ENUM: Fixní %, Individuální dohoda | Admin | Pro audit |
| Důvod rozdělení | Interní poznámka admina | Text | Admin | Nezobrazovat tipařům |
| Okamžik vzniku nároku | Kdy vzniká nárok na provizi | ENUM: Přijatá platba od developera | Admin | Navázáno na tiket |
| Okamžik vyplacení | Kdy je provize vyplacena | ENUM: Ihned, Po splnění podmínek, Jiný | Admin | Navázáno na tiket |
| Stav rozdělení | Aktuální stav | ENUM: Draft, Schváleno, Vyplaceno | Systém | Workflow |
| Datum nastavení | Datum vytvoření rozdělení | Datum | Systém | Audit |
| Nastavil admin | Identifikace admina | User ID | Systém | Audit |

### Příloha C – Formy financování / investice (overview)

| key | Forma financování / investice | Poznámka |
| --- | --- | --- |
| loan | Zápůjčka / úvěr | Dluhové financování (bez labelu „přímá půjčka“). |
| mezzanine | Mezaninové financování | Podřízené / kombinované. |
| bridge | Překlenovací financování (bridge) | Krátkodobé, časově kritické. |
| project_financing_spv | Projektové financování (SPV) | Struktura přes SPV. |
| refinancing | Refinancování projektu | Nahrazení existujícího úvěru. |
| joint_venture | Společný podnik (Joint Venture) | JV struktura + kontrolní práva. |
| sale_leaseback | Zpětný leasing (sale & leaseback) | Transakční struktura. |
| project_sale | Nabídka projektu (prodej projektu) | Není to dluh; režim „prodej“. |


### Příloha D – Formy zajištění (overview)

| # | Forma zajištění | Typ zajištění | Síla | Co kryje | Typické použití | Poznámka |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Zástavní právo k nemovitosti (1. pořadí) | Majetkové | 🔒🔒🔒🔒🔒 | Jistina + výnos | Konzervativní projekty | Nejsilnější forma |
| 2 | Zástavní právo k nemovitosti (2. pořadí) | Majetkové | 🔒🔒🔒🔒 | Jistina | Dev projekty s bankou | Nutné sledovat LTV |
| 3 | Křížová zástava více nemovitostí | Majetkové | 🔒🔒🔒🔒 | Jistina | Rizikovější projekty | Snižuje koncentraci rizika |
| 4 | Ručení projektovou společností (SPV) | Korporátní | 🔒🔒🔒 | Jistina | Standardní development | Závislé na bonitě |
| 5 | Ručení mateřskou společností | Korporátní | 🔒🔒🔒🔒 | Jistina | Silné developerské skupiny | Vyšší vymahatelnost |
| 6 | Osobní ručení jednatele / vlastníka | Osobní | 🔒🔒🔒 | Jistina | Menší / first-time projekty | Psychologicky silné |
| 7 | Směnka (blanko / na řad) | Právní | 🔒🔒🔒 | Jistina + sankce | Doplňkové zajištění | Nikdy samostatně |
| 8 | Zástava obchodního podílu (SPV) | Kontrolní | 🔒🔒🔒🔒 | Kontrola projektu | JV / SPV struktury | Nutná SHA |
| 9 | Notářský zápis s vykonatelností | Procesní | 🔒🔒🔒🔒🔒 | Vymahatelnost | Bridge / short-term | Velmi silné |
| 10 | Bankovní záruka | Finanční | 🔒🔒🔒🔒🔒 | Plnění závazků | Výjimečně | Vysoké náklady |
| 11 | Escrow / kontrola cashflow | Procesní | 🔒🔒🔒 | Čerpání kapitálu | Výstavba | Kontrolní mechanismus |
| 12 | Pojištění nemovitosti / stavby | Pojistné | 🔒🔒 | Škody | Doplňkové | Nikdy hlavní |

### Příloha E – Využití prostředků (overview)

| # | Využití prostředků | Popis | Typické projekty | Riziko | Poznámka |
| --- | --- | --- | --- | --- | --- |
| 1 | Nákup nemovitosti | Akvizice pozemku / budovy | Buy & hold, development | 🟢 | Nejčistší použití |
| 2 | Výstavba | Hrubá stavba, dokončení | Rezidenční / komerční dev | 🟡 | Nutná kontrola čerpání |
| 3 | Rekonstrukce | Stavební úpravy, modernizace | Rekonstrukce, brownfield | 🟡 | Milníkové čerpání |
| 4 | Refinancování závazků | Splacení úvěru / půjčky | Refinancování | 🟢 | Snižuje riziko |
| 5 | Překlenovací financování | Krátkodobý cashflow gap | Bridge financování | 🟡 | Časově citlivé |
| 6 | Projektová rezerva (CAPEX) | Nečekané náklady | Development | 🟢–🟡 | Doporučeno |
| 7 | Provozní náklady projektu | Energie, správa, služby | Buy & hold | 🟢 | Kryto cashflow |
| 8 | Technická příprava projektu | Projekce, studie, povolení | Land, dev | 🟡 | Předvýstavbová fáze |
| 9 | Marketing a prodej | Prodejní náklady | Rezidenční dev | 🟡 | Omezený podíl |
| 10 | Daňové a transakční náklady | Daň, poplatky, právní služby | Všechny | 🟢 | Standardní |
| 11 | Splacení společníka / investora | Interní restrukturalizace | JV / SPV | 🟡 | Nutná transparentnost |
| 12 | Kombinované využití | Více účelů současně | Většina projektů | 🟡 | Nutný rozpad v detailu |

### Příloha F – Financování vs ručení vs zajištění (matice)

| Forma financování / investice | Přípustné RUČENÍ (primární) | Typické ZAJIŠTĚNÍ (sekundární) | Poznámka z praxe |
| --- | --- | --- | --- |
| Zápůjčka / úvěr | Osobní ručení fyzické osoby | Zástava nemovitosti – 1. pořadí | Nejsilnější standard |
|  | Korporátní ručení právnické osoby | Zástava nemovitosti – 2. pořadí | Časté při bance |
|  | Směnečné ručení (aval) | Zástava obchodního podílu (SPV) | Rychlé řešení |
|  | Omezené ručení (limitované) | Notářský zápis s vykonatelností | Posílení vymahatelnosti |
| Mezaninové financování | Ručení developera (FO / PO) | Zástava nemovitosti – 2. pořadí | Podřízené bance |
|  | Korporátní ručení holdingu | Zástava podílu v SPV | Klíčové u mezz |
|  | Omezené ručení | Podíl na zisku projektu | Motivační prvek |
| Překlenovací financování (bridge) | Osobní ručení vlastníka projektu | Zástava nemovitosti – 1. pořadí | Rychlost > struktura |
|  | Směnečné ručení | Budoucí kupní smlouva / exit | Krátkodobé |
|  | Omezené ručení | Směnka + notářský zápis | Typické |
| Projektové financování (SPV) | Korporátní ručení mateřské společnosti | Zástava nemovitosti – 1. pořadí | Standard |
|  | Ručení developera | Postoupení výnosů projektu | Nájem / prodej |
|  | Omezené ručení | Zástava bankovních účtů (escrow) | Kontrola cash-flow |
| Refinancování projektu | Korporátní ručení | Zástava nemovitosti – 1. pořadí | Nižší LTV |
|  | Omezené ručení | Cash-flow projektu | Stabilní fáze |
| Společný podnik (Joint Venture) | Ručení partnera za závazky JV | Podíl na zisku projektu | Hlavní motivace |
|  | Garance plnění povinností | Smluvní kontrolní práva | Veta, reporting |
|  | (volitelně) korporátní ručení | Zástava obchodního podílu | Individuální |
| Zpětný leasing (sale & leaseback) | Korporátní ručení provozní společnosti | Vlastnictví nemovitosti investorem | Investor kupuje |
|  | Osobní ručení vlastníka | Předkupní právo investora | Preferovaný exit |
|  | Omezené ručení | Budoucí zpětný prodej | Dohodnutý scénář |
| Nabídka projektu (prodej projektu) | ❌ Typicky bez ručení | ❌ Typicky bez zajištění | Nejde o dluh |
|  | (výjimečně) ručení za prohlášení | Záruky v kupní smlouvě | Warranty |
|  | — | Smluvní pokuty | Transakční ochrana |
