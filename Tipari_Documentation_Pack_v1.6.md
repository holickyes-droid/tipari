# Tipari.cz – Dokumentace pro vývoj a UI/UX (Handoff Pack)

> Verze: **1.4 (draft)**  
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
| Státní příslušnost | Text | AML |
| Daňová rezidence | Text | AML |
| E-mail | Email | Přihlašovací |
| Telefon | Telefon | Ověření |
| Adresa bydliště / sídla | Text | Povinné |

➡️ **Kompletní specifikace registračních polí (Broker + Developer) je v Příloze F.**

### 4.2 Zadání projektu a tiketu
Projekt = „obal“ (developer, typ, lokalita, popis, dokumenty). Tiket = konkrétní investiční příležitost v rámci projektu (částka, výnos, zajištění, využití prostředků, dokumenty, publish_status).

> Zdroj: `Zadání projektu do systému.docx` + následná rozhodnutí v chatu (zejména SLA, viditelnost, provize, investor bez UI).

#### A) Data o projektu

##### A1️⃣ Základní identifikace projektu
| Pole | Typ / ENUM hodnoty | Developer | Obchodník | Admin |
| --- | --- | --- | --- | --- |
| Název projektu | Text | Zadává, Zdroj informace | Zadává | Schvaluje |
| Typ projektu | ENUM: Rezidenční development, Komerční development, Smíšený projekt, Logistika, Hotely a ubytování, Průmyslový projekt, Pozemkový development, Rekonstrukce | Zadává, Zdroj informace | Zadává | Schvaluje |
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
| Maximální počet aktivních rezervací | Číslo (default 3) | Zadává | Zadává | Schvaluje |
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
- upravuje detaily a investiční preference,
- může investora deaktivovat (např. „už neinvestuje“).

Investor se používá pro:
- **matching** (doporučení tiketů podle preferencí),
- **rezervace** (rezervace vždy odkazuje na konkrétního investora z CRM),
- **audit & compliance** (kdo koho uvedl do dealu, kdy, s jakými deklarovanými preferencemi).

> Zdroj: `VSTUPNÍ DATA O INVESTOROVI.docx`.

#### 4.3.1 Broker UI (MVP)
- **Broker → Investoři (list)**: vyhledávání, filtrování (typ, min/max investice, region), stav (Nový/Aktivní/Neaktivní/Blokovaný)
- **Broker → Přidat investora (form)**: identifikace + preference + souhlasy
- **Broker → Detail investora**: přehled + editace + historie změn (audit)

#### 4.3.2 Investor – základní identifikace (A)
> Pozn.: investor **nemá UI**, ale e-mail/telefon jsou klíčové pro doručení eSign linku při podpisu.

| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Typ investora | ENUM: Fyzická osoba / Právnická osoba | CRUD | View/override | Určuje další pole |
| Jméno / Název | Text | CRUD | View/override | FO: jméno+příjmení, PO: název společnosti |
| IČO (PO) | Text | CRUD | View/override | Povinné pro PO |
| DIČ | Text | CRUD | View/override | Volitelné |
| Státní příslušnost | Text | CRUD | View/override | Doporučené (compliance) |
| Daňová rezidence | Text | CRUD | View/override | Doporučené (compliance) |
| E-mail | Email | CRUD | View/override | Povinné |
| Telefon | Telefon | CRUD | View/override | Doporučené |
| Adresa bydliště / sídla | Text | CRUD | View/override | Povinné |
| Korespondenční adresa | Text | CRUD | View/override | Volitelné |
| Poznámky | Text | CRUD | View/override | Interní poznámky brokera |


**DOB investora (datum narození):** z rozhodnutí produktu ho **v MVP nesbíráme** (minimalizace PII). Pokud bude později potřeba pro AML/KYC, doplní se do admin-only části (Phase 2).

#### 4.3.3 AML/KYC data investora (B) – **mimo UX/UI (MVP)**
Dokument definuje AML/KYC vrstvu pro investora, ale je označená jako **„neimplementujeme do UX/UI“**. Doporučení pro MVP:
- v datovém modelu rezervovat místo (tabulka/JSON),
- UI zatím nenasazovat,
- admin může doplňovat manuálně v admin-only formuláři v pozdější iteraci.

| Pole | Typ / ENUM | Kdo vyplňuje | Poznámka |
| --- | --- | --- | --- |
| Typ identifikačního dokladu | ENUM: OP / Pas | Admin | |
| Číslo dokladu | Text | Admin | |
| Platnost dokladu | Datum | Admin | |
| Stát vydání dokladu | Text | Admin | |
| Kopie dokladu | Soubor | Admin | |
| Video / selfie identifikace | Soubor | Admin | |
| Politicky exponovaná osoba (PEP) | ENUM: Ano / Ne | Admin | |
| Sankční seznamy | ENUM: Bez nálezu / Nález | Admin | |
| Zdroj prostředků | ENUM: Podnikání / Zaměstnání / Investice / Dědictví / Jiný | Admin | |
| Odhadovaný roční objem investic | Číslo | Admin | |

#### 4.3.4 Obchodní vztah & historie (C)
| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Primární broker | User ID | Systém | View/override | Vlastník CRM záznamu |
| Stav investora | ENUM: Nový / Aktivní / Neaktivní / Blokovaný | View | View/override | Stav je vhodné řídit adminem (compliance), broker vidí |
| Historie rezervací | Systémová data | View | View | Odvozeno z Reservation |
| Historie investic | Systémová data | View | View | Odvozeno z Commission/Financing eventů |
| Celkový objem investic | Číslo | View | View | Výpočet |

#### 4.3.5 Investiční preference investora (D)
| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Min. investice | Číslo (CZK) | CRUD | View | Matching hard filter |
| Max. investice | Číslo (CZK) | CRUD | View | Matching hard filter |
| Preferovaná měna | ENUM: CZK / EUR | CRUD | View | |
| Minimální výnos p.a. | % | CRUD | View | Score |
| Max. délka investice | Číslo + ENUM: měsíce / roky | CRUD | View | Hard/soft |
| Výplata výnosu | ENUM (viz Ticket) | CRUD | View | Použít stejné hodnoty jako `Ticket.payout_frequency` |
| Požadavek na zajištění | ENUM: Ano / Ne / Preferováno | CRUD | View | |
| Preferované typy zajištění | MULTI-ENUM (viz sekce 9.5) | CRUD | View | |
| Maximální LTV | % | CRUD | View | |
| Preferované typy projektů | MULTI-ENUM (viz sekce 9.3) | CRUD | View | |
| Preferovaná fáze projektu | ENUM: Příprava / Výstavba / Provoz | CRUD | View | |
| Preferované regiony | MULTI-ENUM: Kraje / Město | CRUD | View | |
| Preferovaný typ investice | ENUM (viz sekce 9.4) | CRUD | View | |
| Ochota podřízenosti | ENUM: Ano / Ne / Individuálně | CRUD | View | |
| Ochota bankovního spolufinancování | ENUM: Ano / Ne | CRUD | View | |
| Ochota vstupu do SPV | ENUM: Ano / Ne | CRUD | View | |

#### 4.3.6 Komunikace & souhlasy (E)
| Pole | Typ / ENUM | Broker | Admin | Poznámka |
| --- | --- | --- | --- | --- |
| Preferovaný způsob komunikace | ENUM: Telefon / Email / Osobně / Kombinace | CRUD | View | Zdroj: investor doc |
| Frekvence kontaktu | ENUM: Ihned / Při nové nabídce / Periodicky | CRUD | View | Zdroj: investor doc |
| Souhlas investora (GDPR) | ENUM: Ano / Ne | CRUD | View/override | **Povinné** – viz právní architektura |
| Souhlas s přijímáním nabídek | ENUM: Ano / Ne | CRUD | View | Doporučené pro komunikaci |

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

### 9.1 Levely obchodníka (Partner / Premium / Elite) + sloty
V platformě používáme **brandové 3 levely obchodníka** – je to **tiering (limit přístupu / kapacity)**, *nikoli provizní pool*.

**Definice slotu (MVP):** 1 slot = kapacita pro 1 aktivní rezervaci (tj. obchodník nemůže mít více aktivních rezervací než má slotů).

| Level obchodníka | Popis (interně) | Default slotů | Admin override |
| --- | --- | ---: | --- |
| Partner | Entry level | 10 | Ano (ručně) |
| Premium | Pro aktivní obchodníky | 25 | Ano (ručně) |
| Elite | Top tier | 50 | Ano (ručně) |

Poznámky:
- Sloty jsou **globální limit** pro obchodníka (ne per tiket).
- Sloty jsou přirozený základ pro případný budoucí bonus program (pool), ale v MVP **neřešíme provizní pool** – provize je vždy podle splitu na konkrétním tiketu.

### 9.2 SLA a prodlužování
SLA je řízeno per rezervace/tiket – admin může upravit jednotlivé časy (podpisy, jednání, splatnost, payout). Každá změna musí vytvořit audit event (kdo, kdy, z jaké hodnoty na jakou, důvod).

### 9.3 Typy projektů (enum)
Canonical (MVP) – používá se v `Project.project_type` a v preferencích investora pro matching.

**Zdroj pravdy:** `KANONICKÝ DOMAIN DICTIONARY.docx` (kanonické DB keys).

| key | UI label (CZ) | Co typicky zahrnuje |
| --- | --- | --- |
| residential_development | Rezidenční development | Bytové domy, rodinné domy, rezidenční výstavba. |
| commercial_development | Komerční development | Kanceláře, retail parky/jednotky, komerční areály. |
| mixed_use | Smíšený projekt | Kombinace více funkcí (např. resi+komerce). |
| logistics | Logistika | Logistické parky, sklady, distribuční centra. |
| hospitality | Hotely a ubytování | Hotely, aparthotely, resorty, ubytovací zařízení. |
| industrial | Průmyslový projekt | Průmyslové areály, lehká výroba; **energetiku v MVP mapujeme sem** (pokud ji chcete oddělit, doplníme tag). |
| land_development | Pozemkový development | Pozemky, příprava území, parcelace, změny ÚP. |
| reconstruction | Rekonstrukce | Rekonstrukce/brownfield, revitalizace, přestavby. |

> Pozn.: Starší podklady (`Zadání projektu do systému.docx`, `VSTUPNÍ DATA O INVESTOROVI.docx`) uvádí navíc „Retail/Energetika/Ostatní“. V tomto packu je sjednoceno na kanonických 8 typů. **Retail** je součástí `commercial_development`, **Energetika** je dočasně mapována do `industrial`.

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


### 9.5 Formy zajištění / ručení (security types – enum)
Zdroj pro **kanonický enum**: `KANONICKÝ DOMAIN DICTIONARY.docx`.
Doplňkově: `FORMY ZAJIŠTĚNÍ.docx` (UX doporučení, síla zajištění, copy-ready právní upozornění) a `FORMY FINANCOVÁNÍ VS ZAJIŠTĚNÍ.docx` (praxe: ručení vs zajištění).

**Pravidla (MVP):**
- 1 tiket = N forem zajištění/ručení.
- Max 1 **hlavní** forma (`is_primary=true`).
- Pokud je přítomné `mortgage_1st`, **musí být** označené jako hlavní.
- U zástavy nemovitosti musí být vždy zřejmé pořadí (1. / 2.). Doporučení: používat separátní enum `mortgage_1st` a `mortgage_2nd` (už v kanonickém seznamu).
- `other_security` vyžaduje povinný popis (`other_security_note`).

| key | UI label (CZ) | Popis | Pořadí |
| --- | --- | --- | --- |
| mortgage_1st | Zástavní právo 1. pořadí | Primární zástava nemovitosti | 1 |
| mortgage_2nd | Zástavní právo 2. pořadí | Podřízená zástava | 2 |
| pledge_shares | Zástava podílu | Zástava obchodního podílu (SPV) | — |
| bank_guarantee | Bankovní záruka | Záruka banky | — |
| corporate_guarantee | Ručení mateřské společnosti | Korporátní ručení | — |
| personal_guarantee | Osobní ručení | Ručení fyzické osoby | — |
| assignment_receivables | Postoupení pohledávek | Výnosy / receivables z projektu | — |
| escrow_account | Escrow účet | Kontrola toků peněz | — |
| notarial_enforcement | Notářský zápis | Přímá vykonatelnost | — |
| insurance | Pojištění | Pojistné krytí | — |
| cash_collateral | Hotovostní kolaterál | Blokace hotovosti | — |
| other_security | Jiné zajištění | Individuální zajištění | — |

**⚠️ Nesrovnalost (ke schválení):** `FORMY ZAJIŠTĚNÍ.docx` i matice financování uvádí **Směnku** jako typické doplňkové zajištění (s pravidlem „nikdy samostatně“), ale **v kanonickém domain dictionary enumu není**.
Doporučení: přidat `promissory_note` (UI: Směnka) do enumu a validaci: nesmí být jediným zajištěním.

**Právní upozornění (copy-ready):**
Zajištění slouží ke snížení rizika investice, nikoliv jako garance návratnosti nebo výnosu.

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

> Zdroj: `právní architektura.docx` + právní poznámky ve `FORMY INVESTICE.docx` a `FORMY ZAJIŠTĚNÍ.docx`.

#### 12.6.1 Právní pozice platformy (MVP)
Pracovní právní rámec (pro produkt a copy):
- Platforma **není** investiční zprostředkovatel ani distributor investičních produktů.
- Platforma **nepřijímá peníze**, neeviduje investice a **nedává investiční doporučení**.
- Platforma **eviduje představení investora**, eviduje vznik obchodního vztahu a chrání provizní nárok (auditní stopa).

**Důsledek pro UX:** v UI musí být jasně komunikováno, že:
- platforma pouze zprostředkuje kontakt / introdukci,
- investiční rozhodnutí je na investorovi,
- podmínky (provize, SLA, pravidla) jsou definovány smluvně a per tiket.

#### 12.6.2 Povinné dokumenty (MUST HAVE) – eSign artefakty
Core dokumenty (nutné pro MVP rollout):
1) **Provizní smlouva (Tipař ↔ Developer)** – klíčový dokument, definuje nárok a splatnost.
2) **Smlouva o využití platformy (Developer)**
3) **Smlouva o využití platformy (Tipař)**
4) **VOP** (sjednocení definic a procesů)
5) **Právní disclaimer** (MiFID/ZPKT safe)
6) **Zásady zpracování osobních údajů (GDPR)**

**Implementační standard pro dokumenty:**
- `doc_type`, `doc_version`, `effective_from`, `language`, `storage_url`, `hash`
- podpisy ukládat jako `SignatureEvent` (kdo, kdy, IP, doc_version, eSign provider event_id)

#### 12.6.3 Anti-circumvention & ochrana nároku
Pravidla, která musí podporovat systém (min. auditně):
- ochrana proti obcházení (časový test – typicky 24 měsíců, **nastavitelné adminem**),
- evidence „kdo koho představil, kdy a přes jaký tiket“,
- možnost vytvořit **incident** a eskalaci (např. právní) přímo z detailu sporu/provize,
- audit log musí být „nezpochybnitelný“ (before/after, actor, IP, metadata).

#### 12.6.4 GDPR & práce s PII (prakticky)
- investor není uživatel → minimalizovat PII (např. **DOB se v MVP nesbírá**).
- právní titul: oprávněný zájem + souhlas investora (broker deklaruje checkboxem).
- RBAC: broker vidí své investory, developer vidí investora až po aktivaci rezervace, admin vidí vše.
- logovat přístupy k citlivým údajům (min. view/export) do audit logu.

### 12.7 Modul Automatizace a Cron Joby
Viz sekce 11. SLA monitor musí respektovat admin override a vytvářet audit eventy.

## 13. UI/UX DESIGN SPECIFICATION

### 13.1 IA – hlavní sekce (MVP)
- Broker: Dashboard, Investoři (CRM), Matching, Tikety, Rezervace, Provize, Nastavení profilu
- Developer: Dashboard, Projekty, Tikety, Rezervace, Finance/Provize, Profil
- Admin: Dashboard, Registrace brokerů, Registrace developerů, Projekty, Tikety, Rezervace, Provize, Audit, Nastavení

### 13.2 Formuláře – kanonická pole
- Registrace: viz Příloha F — Registrace Broker / Developer (vstupní data)
- Zadání projektu/tiketu: viz tabulky v sekci 4.2
- Investor CRM: viz tabulky v sekci 4.3

### 13.3 Design systém (high-level)
Řídit se `TIPARI_DESIGN_SYSTEM_COMPLETE.md` + `ZÁKLADNÍ DESIGNOVÁ PRAVIDLA.docx` + brand. Klíčové: minimalistický vzhled, důvěryhodnost, jasné typografické hierarchie a konzistence komponent.

### 13.4 Admin & Finance Dashboard (Figma hi-fi specifikace)
> Zdroj: `nastavení admin.docx`.

#### 13.4.1 Role & mindset
ADMIN potřebuje:
- vidět rizika dřív, než eskalují,
- rozhodovat spory datově,
- hlídat cashflow provizí,
- udržet autoritu platformy.

Design principy:
- enterprise / SaaS (klid, jistota),
- minimum grafů, maximum signálů,
- „one click to detail“,
- **finance a spory nemíchat** do jedné obrazovky.

#### 13.4.2 Informační architektura (Admin only)
Levé menu (ADMIN ONLY):
- Overview
- Rezervace
- Introdukce investorů
- Dealy
- Provize
- Faktury
- Spory
- Reputace
- Uživatelé
- Audit log
- Nastavení

#### 13.4.3 Overview (řídicí cockpit)
Horní KPI lišta (cards):
- Rezervace čekající na akci
- Dealy potvrzené (MTD)
- Provize po splatnosti (částka)
- Aktivní spory
- Rizikoví developeři (count)

Interakce: klik na KPI = přednastaví filtr zbytku stránky.

„Risk radar“ (tabulka, ne graf):
- Entity (Developer / Tipař)
- Typ rizika (SLA / platby / spory)
- Závažnost (Low / Med / High)
- Poslední incident
- CTA: Otevřít

#### 13.4.4 Rezervace – kontrola toku
Tabulka (server-side) – sloupce:
- Projekt
- Tipař
- Stav
- SLA (countdown)
- Poslední akce
- CTA: Schválit / Detail

Filtry:
- podle SLA (např. pending > 24h)
- opakovaně rušené

#### 13.4.5 Introdukce investorů – férovost & duplicity
Sloupce:
- Projekt
- Tipař
- Typ investora
- Range objemu
- Stav
- Čas od představení
- CTA: Detail / Zamítnout

Alerty:
- duplicitní jméno / entita
- podezřele rychlé odmítnutí

#### 13.4.6 Dealy – „money moment“
Sloupce:
- Projekt
- Developer
- Tipař
- Datum podpisu
- Finální objem
- Stav
- CTA: Detail

Badge:
- Admin confirmed
- Developer confirmed
- Reported by tipař

#### 13.4.7 Provize – finanční páteř
Primární tabulka – sloupce:
- Tipař
- Developer (payer)
- Částka
- Splatnost
- Stav
- Days overdue
- CTA: Faktura / Eskalovat

Hromadné akce (ADMIN):
- označit jako overdue
- eskalovat právně
- zmrazit účet developera

#### 13.4.8 Faktury
Sloupce:
- Číslo
- Vystavil
- Komu
- Částka
- Splatnost
- Stav
- PDF
- CTA: Označit zaplaceno

Pozn.: každý override admina = audit event.

#### 13.4.9 Spory
Queue podle priority – sloupce:
- Typ sporu
- Částka (pokud relevantní)
- Strany
- Stav
- Délka
- CTA: Převzít

Detail sporu:
- timeline (události)
- dokumenty
- rozhodnutí
- akce: Rozhodnout / Vyžádat info / Eskalovat právně

#### 13.4.10 Reputace (interní)
Admin-only pohled:
- rozpad skóre
- trend (↑ ↓ →)
- poslední eventy
- doporučená opatření (AI-ready)

Pozn.: uživatelé tato čísla nikdy neuvidí.

#### 13.4.11 Audit log
Filtry:
- entity
- user
- typ akce
- čas

Detail:
- before / after
- actor
- IP
- metadata



## 14. Nesrovnalosti & otevřené body

Níže jsou nalezené nesoulady mezi zdrojovými dokumenty. V tomto packu jsem nastavil pracovní „source of truth“ tak, aby šel systém rovnou stavět. Zároveň uvádím, co je potřeba případně rozhodnout / sjednotit.

1) **ProjectType**: sjednoceno na kanonický seznam 8 typů z `KANONICKÝ DOMAIN DICTIONARY.docx` (resi/commercial/mixed/logistics/hospitality/industrial/land/reconstruction). Starší zdroje uvádí navíc „Retail/Energetika/Ostatní“ – v MVP mapujeme **Retail → commercial_development** a **Energetika → industrial**. Pokud chcete mít „Energetiku“ jako samostatný typ, přidáme `energy` jako **tag** (nebo rozšíříme enum – ale to už by porušovalo „kanonický“ domain dictionary).

2) **Forma financování/investice**: existují 3 zdroje (`FORMY INVESTICE`, `KANONICKÝ DOMAIN DICTIONARY`, `FORMY FINANCOVÁNÍ VS ZAJIŠTĚNÍ`). V packu je jako UI výběr použita **matice** (8 forem) a výslovně je odstraněn label **„přímá půjčka“**. Pokud chcete granularitu (senior/junior/konvertibilní/podíl na zisku), doporučuji řešit jako **subtypy** (další atributy) nad touto osou.

3) **Zajištění**: `Zadání projektu do systému.docx` uvádí dlouhý seznam typů zajištění, `FORMY ZAJIŠTĚNÍ.docx` definuje DB-ready enum a `KANONICKÝ DOMAIN DICTIONARY.docx` má vlastní enum. V packu je bráno jako kanonické „zajištění jako kombinovatelné položky + pořadí + LTV“, viz příloha D. Je potřeba jen sjednotit finální list pro UI (lze odvodit z přílohy D).

4) **Investor CRM – role „zdroj pravdy“**: `VSTUPNÍ DATA O INVESTOROVI.docx` má u některých polí „Admin = zdroj pravdy“, ale produktové rozhodnutí je „Investor bez přístupu“ a investor je veden brokerem. V packu: **broker spravuje**, admin má **override/view** (kvůli compliance). Pokud admin nemá mít právo editovat investory, dá se to zpřísnit.

5) **Use of Funds**: různé taxonomie napříč dokumenty. V packu je kanonické **percent breakdown = 100 %** (`VYUŽITÍ PROSTŘEDKŮ.docx`) + volitelný tag.

6) **Pool / Incentive Pool**: SystemCore dokumentace zmiňuje „Broker Level Policy & Incentive Pool Logic“ (historický prvek). V Tipari používáme **tiering obchodníka** (Partner/Premium/Elite) pro sloty, ale provize se řídí výhradně split pravidly na tiketu (platforma + tipař1 + tipař2) – tedy **žádný samostatný provizní pool v MVP**. Pokud budete chtít pool jako bonusový mechanismus, navrhneme ho až po uzavření MVP provizí.

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



### Příloha F – Registrace Broker / Developer (vstupní data)

> Zdroj: `REGISTRACE OBCHODNÍK DEVELOPER.docx` + `SystemCoreDocumentation.md/tsx`.

#### F0️⃣ Principy a scope
- **Investor nemá účet** (nevytváří login). Investor je jen evidenční entita spravovaná brokerem.
- Registrace brokera/developera = **vytvoření User účtu + profilu role**, následně **admin schvaluje** (status → active).
- **AML/KYC rozšíření (doklady, selfie, PEP…) je definované, ale zatím ho nedáváme do UI/UX** (bude Phase 2 / Compliance).

---

#### F1️⃣ UserAccount (společné pro BROKER i DEVELOPER)

| Pole | Typ / validace | Povinné | Vyplňuje | Poznámka |
| --- | --- | --- | --- | --- |
| role | ENUM: BROKER / DEVELOPER / ADMIN | Ano | Uživatel (BROKER/DEVELOPER), Admin (ADMIN) | V UI registrace 2 varianty: Broker / Developer |
| name | Text (2–200 znaků) | Ano | Uživatel | Zobrazené jméno účtu (pro FO = celé jméno, pro PO = kontaktní osoba) |
| email | Email, **unique** | Ano | Uživatel | Přihlašovací |
| phone | Telefon (valid format) | Ano | Uživatel | Ověření (OTP v budoucnu) |
| password | min 8 znaků, komplexita | Ano | Uživatel | Auth |
| status | ENUM: pending / verified / active / suspended / blocked | System | Systém + Admin | `pending` po registraci, `active` po schválení adminem |
| created_at | timestamp | System | Systém | Audit |
| verified_by | user_id (admin) | System | Admin | Audit |
| verified_at | timestamp | System | Systém | Audit |

> Pozn.: Ve Word podkladech je stav účtu uveden jako `Pending / Ověřen / Aktivní / Pozastaven / Zablokován`.

---

#### F2️⃣ BrokerProfile (registrace BROKER)

##### F2A – Základní identifikace (MVP)
| Pole | Typ / ENUM | Povinné | Poznámka |
| --- | --- | --- | --- |
| subject_type | ENUM: **Fyzická osoba / Právnická osoba** | Ano | Určuje, které pole je povinné |
| full_name (FO) | Text | Pokud FO | Jméno a příjmení |
| company_name (PO) | Text | Pokud PO | Název společnosti |
| ico (PO) | Text | Pokud PO | IČO |
| birth_date (FO) | Datum | Doporučeno (Compliance) | V podkladech označeno jako AML |
| nationality | Text | Volitelné | AML |
| tax_residency | Text | Volitelné | AML |
| address | Text | Ano | Bydliště / sídlo |

##### F2B – Obchodní profil
| Pole | Typ / ENUM | Povinné | Poznámka |
| --- | --- | --- | --- |
| cooperation_type | ENUM: Nezávislý / Vázaný / Interní | Ano | Pro interní logiku |
| region_scope | MULTI-ENUM: kraje / země | Ano | Matching |
| specialization | MULTI-ENUM: Reality / Development / Energetika / Ostatní / Dluh / Ekvita | Ano | Matching |
| typical_investors | ENUM: Retail / HNWI / Institucionální | Volitelné | Informativní |
| average_deal_size_czk | Číslo (CZK) | Volitelné | Informativní |
| preferred_communication | ENUM: Telefon / Email / Osobně | Volitelné | UX |

##### F2C – Právní a smluvní souhlasy (checkboxy / eSign)
| Pole | Typ | Povinné | Poznámka |
| --- | --- | --- | --- |
| agreement_framework | Souhlas / Podpis | Ano | Rámcová smlouva s platformou |
| agreement_nda | Souhlas / Podpis | Ano | NDA |
| agreement_commission_terms | Souhlas | Ano | Provizní podmínky |
| agreement_ethics | Souhlas | Ano | Etický kodex |
| agreement_gdpr | Souhlas | Ano | GDPR |

##### F2D – Tipar Tier (admin)
| Pole | Typ / ENUM | Povinné | Kdo nastavuje | Poznámka |
| --- | --- | --- | --- | --- |
| tipar_tier | ENUM: Partner / Premium / Elite | Ano | Admin | Brandové názvy; ovlivňuje limity |
| max_active_reservations | Číslo | Ano | Systém (z tieru) + Admin override | Defaulty: Partner=10, Premium=25, Elite=50 (brand tiering) |

---

#### F3️⃣ DeveloperProfile (registrace DEVELOPER)

##### F3A – Základní identifikace (MVP)
| Pole | Typ / ENUM | Povinné | Poznámka |
| --- | --- | --- | --- |
| subject_type | ENUM: Právnická osoba / FO podnikatel | Ano | Povinné |
| company_name | Text | Ano | Název společnosti |
| ico | Text | Ano | IČO |
| dic | Text | Volitelné | DIČ |
| headquarters_address | Text | Ano | Sídlo společnosti |
| registered_country | Text | Ano | Země registrace |

##### F3B – Oprávněná osoba / statutár
| Pole | Typ | Povinné | Poznámka |
| --- | --- | --- | --- |
| representative_full_name | Text | Ano | Jméno a příjmení |
| representative_position | Text | Ano | Funkce |
| representative_birth_date | Datum | Volitelné | AML |
| representative_nationality | Text | Volitelné | AML |

##### F3C – Profil developera (pro matching)
| Pole | Typ / ENUM | Povinné | Poznámka |
| --- | --- | --- | --- |
| focus_project_types | MULTI-ENUM: Rezidenční development / Komerční development / Smíšený projekt / Logistika / Hotely a ubytování / Průmyslový projekt / Pozemkový development / Rekonstrukce | Ano | Sjednoceno na kanonický ProjectType (domain dictionary). |
| regions | MULTI-ENUM: kraje / země | Ano | Matching |
| projects_completed | Číslo | Volitelné | Informativní |
| total_volume_czk | Číslo (CZK) | Volitelné | Informativní |
| typical_financing | ENUM: Banka / Privátní kapitál / Jiné / Kombinace | Volitelné | Informativní |
| website | URL | Volitelné | Prezentace |

##### F3D – Právní a smluvní souhlasy
| Pole | Typ | Povinné | Poznámka |
| --- | --- | --- | --- |
| agreement_framework | Podpis | Ano (pro aktivaci) | V podkladech: zadává admin ručně do profilu developera |
| agreement_authorization_declaration | Souhlas | Ano | Prohlášení o oprávnění k projektu |
| agreement_anti_circumvention | Souhlas | Ano (nebo admin) | V podkladech: zadává admin ručně |
| agreement_gdpr | Souhlas | Ano | GDPR |

---

#### F4️⃣ AML/KYC (Phase 2 – zatím mimo UI/UX)

> Definované v podkladech pro brokera, ale nyní **nezahrnovat do UX/UI**.

| Pole | Typ / ENUM |
| --- | --- |
| id_document_type | ENUM: OP / Pas |
| id_document_number | Text |
| id_document_valid_until | Datum |
| id_document_issuing_country | Text |
| id_document_copy | Soubor |
| selfie_or_video_ident | Soubor |
| pep_status | ENUM: Ano / Ne |
| sanctions_check | ENUM: Bez nálezu / Nález (systém) |
| income_source | ENUM: Podnikání / Zaměstnání / Jiný |

---

#### F5️⃣ Klíčové nesrovnalosti (registrace)

1) `SystemCoreDocumentation.tsx` má minimalistickou registraci (name/email/phone/password + company_name/ico pro developera). `REGISTRACE OBCHODNÍK/DEVELOPER.docx` je detailnější (subjekt, regiony, specializace, souhlasy). **V Tipari packu bereme jako kanonické Word podklady + doplňujeme auth pole (password).**
2) Tipar level: starší interní názvy (wolf/alfa/gold…) nahrazujeme brandovými: **Partner / Premium / Elite**.

### Příloha G – Financování vs ručení vs zajištění (matice)

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
