# Tipari.cz — Business Specification Summary

**SystemCore version:** 3.8.1  
**Generated:** 2026-01-17  
**Governance:** Locked for Production  
**Source:** SystemCore Documentation — Tipari.cz B2B Investment Platform

---

## 1. Účel systému

**Tipari.cz je B2B koordinační platforma** pro obchodní příležitosti v oblasti investičního financování nemovitostí a projektů.

### Hlavní charakteristiky:

- **B2B model:** Propojuje obchodníky (brokery) s developery (zadavateli projektů)
- **Investor není uživatel:** Investor je pouze evidenční entita spravovaná brokerem, nikdy se nepřihlašuje do systému
- **Cíl:** Transparentní evidence a řízení obchodních příležitostí od matchingu přes rezervace až po výplatu provizí
- **Auditovatelnost:** Každá akce je zaznamenána v audit logu s 10letým uchováním

### Klíčové funkce:

- Automatické párování investorů s investičními příležitostmi
- Správa rezervací s dual-signature procesem (investor + developer)
- Automatický výpočet a správa provizí
- Monitoring SLA a automatické expirace
- GDPR compliance s automatickou anonymizací

---

## 2. Role a oprávnění

| Role | Odpovědnosti | Oprávnění |
|------|--------------|-----------|
| **Broker (Obchodník)** | • Registruje a spravuje investory<br>• Vyhledává vhodné projekty pomocí matchingu<br>• Vytváří rezervace pro investory<br>• Dostává provizi za úspěšné obchody | • Plný přístup k vlastním investorům<br>• Čtení publikovaných projektů<br>• Vytváření rezervací<br>• Zobrazení vlastních provizí |
| **Developer (Zadavatel)** | • Zakládá projekty a investiční příležitosti (tikety)<br>• Podepisuje rezervace s investory<br>• Platí provize brokerům po aktivaci rezervace<br>• Nahrává dokumentaci a zajištění | • Správa vlastních projektů<br>• Vytváření a úprava tiketů<br>• Schvalování rezervací<br>• Platba provizí |
| **Admin (Správce)** | • Schvaluje registraci brokerů a developerů<br>• Dohlíží na SLA a automatické procesy<br>• Spravuje audit logy a compliance<br>• Má právo upravovat všechna data v systému | • Plný přístup ke všem datům<br>• Schvalování uživatelů<br>• Úprava SLA limitů<br>• Governance a audit kontrola |

### Registrační workflow:

1. **Broker/Developer** se registruje v systému → `REGISTERED` status
2. **Admin** ověří smlouvy (framework agreement, NDA) → `VERIFIED` status
3. **Admin** aktivuje účet → `ACTIVE` status
4. Broker může začít evidovat investory a vytvářet rezervace

---

## 3. Hlavní procesy

### 3.1 Registrace účastníků

**Účel:** Přijetí nových brokerů a developerů do platformy

**Kdo spouští:** Broker nebo Developer (self-registration)

**Workflow:**
1. Broker/Developer vyplní registrační formulář
2. Systém ověří základní údaje a formáty
3. Admin provede manuální kontrolu smluv a oprávnění
4. Admin schválí nebo zamítne registraci
5. Po schválení je účet aktivován

**Výstup:** Aktivní účet v systému s přidělenými oprávněními

**Obchodní význam:** Zajištění, že pouze ověření partneři mají přístup k obchodním příležitostem

**Audit eventy:** `BROKER_REGISTERED` → `BROKER_VERIFIED` → `BROKER_ACTIVATED`

---

### 3.2 Investor Matching

**Účel:** Automatické párování investorských preferencí s dostupnými investičními příležitostmi

**Kdo spouští:** Systém automaticky při každé změně (vytvoření investora, aktualizace preferencí, publikace tiketu)

**Workflow:**
1. Broker zadá investorské preference (investiční forma, výnos, zajištění, objem)
2. Systém automaticky porovná s aktivními tikety
3. Výpočet match score (0.0 - 1.0) na základě shody parametrů
4. Zobrazení seřazených výsledků podle score
5. Uložení match results do databáze pro trvalou evidenci

**Parametry matchingu:**
- **Investment form** (loan, equity, mezzanine) → váha 40%
- **Yield (výnos)** min/max rozsah → váha 30%
- **Security type** (hypotéka, zástava) → váha 30%

**Výstup:** Seznam projektů s match score a vysvětlením shody (matched attributes)

**Obchodní význam:** Úspora času brokera při hledání vhodných příležitostí, automatizace obchodního procesu

**Audit eventy:** `INVESTOR_MATCH_EXECUTED` → `INVESTOR_MATCH_RESULTED`

**SLA:** ≤ 1 sekunda / 100 tiketů

---

### 3.3 Rezervace (Dual Signature)

**Účel:** Závazek investora k financování konkrétní investiční příležitosti

**Kdo spouští:** Broker (jménem investora)

**Workflow:**
1. Broker vytvoří rezervaci pro investora na konkrétní tiket
2. Investor podepisuje rezervaci (e-sign)
3. Developer podepisuje rezervaci (e-sign)
4. Po obou podpisech je rezervace **aktivována**
5. Systém automaticky vytvoří provizi pro brokera

**Stavy rezervace:**
- `draft` — připravuje se
- `pending_investor_signature` — čeká na podpis investora
- `pending_developer_signature` — čeká na podpis developera
- `active` — obě strany podepsaly
- `cancelled` — zrušeno (před podpisem)
- `expired` — vypršela (30 dní bez podpisu)

**Výstup:** Aktivní rezervace + automaticky vytvořená provize

**Obchodní význam:** Právně závazný dokument pro obě strany, spuštění procesu financování

**Audit eventy:** `RESERVATION_CREATED` → `RESERVATION_SIGNED_INVESTOR` → `RESERVATION_SIGNED_DEVELOPER` → `RESERVATION_ACTIVATED`

**SLA:** 30 dní na dokončení podpisů, jinak automatická expirace

---

### 3.4 Provize (Commission)

**Účel:** Výpočet, schválení a výplata provize brokerovi za úspěšné zprostředkování

**Kdo spouští:** Systém automaticky při aktivaci rezervace

**Workflow:**
1. Rezervace přejde do stavu `active` → systém vytvoří provizi
2. Výpočet výše provize podle pravidel (% z investované částky, Tipar level)
3. Admin schvaluje výši provize (nebo je již předschválená)
4. Developer platí provizi na účet platformy
5. Platforma vyplácí provizi brokerovi (3 dny po přijetí platby)

**Výše provize:**
- Standardní provize: 1-3% z investované částky
- Závislost na Tipar Level brokera (Bronze → Silver → Gold → Platinum)
- Možnost split provize mezi více brokerů

**Stavy provize:**
- `pending` — čeká na schválení
- `approved` — schváleno adminem
- `awaiting_payment` — čeká na platbu developera
- `paid_to_platform` — developer zaplatil
- `paid_to_broker` — vyplaceno brokerovi

**Výstup:** Vyplacená provize brokerovi

**Obchodní význam:** Motivace brokerů, transparentní výpočet odměny

**Audit eventy:** `COMMISSION_CREATED` → `COMMISSION_APPROVED` → `COMMISSION_PAID_BY_DEVELOPER` → `COMMISSION_PAID_OUT`

**SLA:**
- Developer má 30 dní na platbu provize
- Platforma má 3 dny na výplatu brokerovi po přijetí platby

---

## 4. Klíčové entity

| Entita | Popis |
|--------|-------|
| **Project** | Investiční projekt zadaný developerem. Obsahuje základní informace o financování (výše, forma, výnos, zajištění). |
| **Ticket** | Konkrétní investiční příležitost v rámci projektu. Tikety se párují s investory pomocí matchingu. |
| **Reservation** | Závazek investora k financování tiketu. Vyžaduje dual signature (investor + developer). Po aktivaci se vytváří provize. |
| **Commission** | Provize pro brokera za úspěšné zprostředkování. Obsahuje výpočet, status platby a split rules. |
| **Investor** | Evidenční záznam klienta brokera. NENÍ uživatelem platformy. Data jsou anonymizována (email_hash, phone_hash). |
| **User** | Uživatel platformy (Broker, Developer, Admin). Má přístupová práva podle role. |
| **AuditLog** | Záznam každé změny v systému. Slouží pro compliance a auditní trail (10 let). |
| **InvestorMatchingResult** | Trvalý záznam výsledku matchingu investora s tiketem. Obsahuje match score a matched attributes. |
| **BrokerProfile** | Profil brokera s údaji o specializaci, působnosti, typických investorech a smluvních podmínkách. |
| **DeveloperProfile** | Profil developera s údaji o zrealizovaných projektech, zaměření a právním zastoupení. |

### Vztahy mezi entitami:

```
Project (1) → (N) Ticket
Ticket (1) → (N) Reservation
Reservation (1) → (1) Commission
Broker (1) → (N) Investor
Investor (N) → (N) Ticket (přes InvestorMatchingResult)
```

---

## 5. SLA a časové limity

| Proces | Časový limit | Odpovědná role | Důsledek při vypršení |
|--------|--------------|----------------|-----------------------|
| **Rezervace expirace** | 30 dní | Admin | Automatické zrušení nepodepsané rezervace. Status → `expired` |
| **Vyjednávání o provizi** | 90 dní | Admin | Eskalace k adminu pro manuální řešení konfliktu |
| **Platba developera** | 30 dní | Developer (monitoring Admin) | Notifikace developera + admin alert. Možnost blokace účtu |
| **Výplata brokerovi** | 3 dny | Admin (automatická výplata) | Automatická výplata po přijetí platby od developera |
| **Investor matching** | ≤ 1 sekunda | Systém (automatický) | Pro 100 tiketů. Optimalizované indexy a cache |
| **Admin schválení registrace** | 5 pracovních dní | Admin | Best effort. Notifikace admina při zpoždění |
| **Project approval** | 7 pracovních dní | Admin | Schválení projektu k publikaci. Notifikace developera |

### Vlastnosti SLA:

- **Editovatelné:** Admin může měnit všechny SLA limity v administračním rozhraní
- **Auditované:** Každá změna SLA je zaznamenána v audit logu
- **Automatické akce:** Systém automaticky spouští akce při vypršení SLA (expirace, notifikace, eskalace)
- **Notifikace:** Všechny strany jsou včas upozorněny před vypršením SLA (7 dní, 3 dny, 1 den, dnes)
- **Dashboard:** Admin má přehled všech běžících SLA s countdown timerem

---

## 6. Governance a compliance

### 6.1 Governance Framework

**Admin Canonical Input Rights:**
- Admin má právo ručně zadávat, upravovat a přepisovat jakákoli canonical data
- Provádět úpravy přímo v rozhraní platformy
- Opravovat chybné hodnoty bez nutnosti systémového schválení
- Ručně vytvářet nebo mazat entity v případě auditu nebo oprav

**Change Request Process:**
- Všechny změny SystemCore jsou evidovány jako formální Change Requesty
- Každý CR má verzi, datum, typ (MAJOR/MINOR/PATCH), popis a schvalovatele
- CR jsou archivovány a auditovány

**Version Control:**
- SystemCore používá sémantické verzování (MAJOR.MINOR.PATCH)
- Každá verze má deployment log s checksumem a CI/CD pipeline tracking
- Build artifacts jsou archivovány pro rollback

---

### 6.2 Audit Trail

**Uchování:**
- **AuditLog:** 180 dní aktivní + JSON export pro dlouhodobé archivování
- **Compliance audit:** 10 let
- **Entity data:** Podle GDPR (max 180 dní po archivaci investora)

**Struktur audit eventu:**
- `entity_type` — typ entity (user, project, reservation, commission)
- `entity_id` — ID konkrétní entity
- `action` — typ akce (CREATE, UPDATE, DELETE, APPROVE, SIGN)
- `performed_by` — kdo akci provedl (user_id nebo SYSTEM)
- `timestamp` — přesný čas akce
- `previous_audit_id` — odkaz na předchozí audit event (chain)
- `run_id` — ID běhu procesu (pro grouping)
- `session_id` — ID session uživatele
- `severity` — závažnost události (info, warning, error, critical)

**Auditované události:**
- Všechny CRUD operace na entitách
- Změny stavů (registration → verified → active)
- Podpisy (e-sign)
- Platby a výplaty
- Matching runs
- SLA expirace
- GDPR anonymizace
- Admin overrides

---

### 6.3 GDPR Compliance

**Data Lifecycle:**

```
Active → Archived → Anonymized
```

1. **Active:** Data jsou aktivní a používaná (investor je ve stavu `active` nebo `verified`)
2. **Archived:** Investor deaktivován, data archivována (změna stavu na `archived`)
3. **Anonymized:** Po 180 dnech od archivace jsou osobní údaje trvale anonymizovány

**GDPR Pre-Anonymization Notice (7-day policy):**

- **Day -7:** Broker dostane e-mail + in-app notifikaci o nadcházející anonymizaci investora
- **Day -3:** Připomínka notifikace
- **Day -1:** Finální upozornění
- **Day 0:** Osobní údaje investora jsou trvale anonymizovány, zůstávají pouze agregované statistiky

**Anonymizace zahrnuje:**
- `email` → `email_hash` (SHA256)
- `phone` → `phone_hash` (SHA256)
- `full_name` → `[ANONYMIZED]`
- `birth_date` → `null`
- `personal_id` → `null`
- Zachování: investor_id, broker_id, match_history, statistics

**GDPR Rights:**
- **Right to be forgotten:** Investor může kdykoliv požádat o okamžitou anonymizaci
- **Data portability:** Export dat investora ve strojově čitelném formátu (JSON)
- **Access rights:** Broker má přístup k datům svých investorů
- **Correction rights:** Broker může opravit data investora

**Audit eventy:**
- `INVESTOR_ARCHIVED` — investor deaktivován
- `GDPR_NOTICE_SENT` — upozornění na anonymizaci odesláno
- `INVESTOR_ANONYMIZED` — osobní údaje anonymizovány
- `GDPR_DATA_EXPORTED` — data exportována na žádost

---

### 6.4 Access Control (RBA)

**Role-Based Access Matrix:**

| Entity | Broker | Developer | Admin |
|--------|--------|-----------|-------|
| **Project** | Read (published) | Full (own) | Full (all) |
| **Ticket** | Read (published) | Full (own) | Full (all) |
| **Reservation** | Full (own) | Read (related) | Full (all) |
| **Commission** | Read (own) | Read (related) | Full (all) |
| **Investor** | Full (own) | No access | Full (all) |
| **User** | Read (self) | Read (self) | Full (all) |
| **AuditLog** | Read (own actions) | Read (own actions) | Full (all) |

**Admin Subroles (v3.7.8+):**
- `admin_finance` — přístup k provizím a platbám
- `admin_legal` — přístup k smlouvám a compliance
- `admin_compliance` — přístup k auditům a GDPR
- `admin_super` — plný přístup ke všemu

---

### 6.5 Incident Management

**Severity Levels:**
- `critical` — okamžitá eskalace (1h response SLA)
- `high` — vysoká priorita (4h response SLA)
- `medium` — standardní priorita (24h response SLA)
- `low` — nízká priorita (best effort)

**Incident Workflow:**
1. **Detection:** Automatická detekce nebo manuální hlášení
2. **Assignment:** Auto-assign podle severity a typu
3. **Resolution:** Admin řeší incident
4. **Verification:** Ověření řešení
5. **Auto-closure:** Automatické zavření po úspěšné validaci

**Monitoring:**
- SLA countdown timer v incident dashboardu
- Automatické eskalace při překročení SLA
- Auto-resolve pro technické incidenty po validaci modulu

---

## 7. UX a komunikace

### 7.1 UX Principy

**„Odborník mluví lidsky"**
- Komplexní finanční termíny jsou vysvětleny jasně a srozumitelně
- Žádný žargon bez kontextového vysvětlení
- Tooltips a info ikony pro složitější koncepty
- Příklady a kalkulačky pro výpočty

**„Rozhodnutí na první pohled (Decision-first UX)"**
- Důležité informace a akce jsou vždy na prvním místě
- Uživatel vidí, co potřebuje rozhodnout bez scrollování
- Kompaktní karty s klíčovými metrikami
- Call-to-action tlačítka jsou vždy viditelná

**„Konzistentní barvy a typografie"**
- Private banking calm — čistý design bez zbytečných prvků
- Focus na obsah a data
- Jednotné UI komponenty napříč platformou
- Barevné kódování podle významu (success, warning, error)

**„WCAG 2.1 AA compliance"**
- Plná podpora přístupnosti pro zrakově postižené
- ARIA labels na všech interaktivních prvcích
- Keyboard navigation pro všechny funkce
- Kontrastní barvy (min. 4.5:1 poměr)
- Focus indicators pro navigaci klávesnicí
- Skip links pro rychlou navigaci
- Screen reader optimalizované texty

---

### 7.2 Design System

**Canonical komponenty:**

| Komponenta | Účel | Klíčové prvky |
|------------|------|---------------|
| **ProjectCard** | Kompaktní přehled projektu | Název, typ, výše financování, výnos, zajištění, developer |
| **TicketCard** | Detail investiční příležitosti | Match score, parametry tiketu, actions (rezervovat) |
| **ReservationCard** | Status rezervace | Dual-signature status, timeline, documents |
| **CommissionCard** | Přehled provize | Výše, status platby, split breakdown |
| **InvestorCard** | Přehled investora | Anonymizovaná data, preference, match history |
| **Dashboard** | Hlavní přehled | Notifikace, akce, statistiky, grafy |
| **NotificationBell** | In-app notifikace | Unread count, priority sorting |
| **AuditLogTable** | Audit trail | Filtrovatelný seznam všech událostí |

**Barevná paleta:**
- **Primary:** #215EF8 (modrá — akce, odkazy)
- **Success:** #14AE6B (zelená — úspěch, active stavy)
- **Warning:** #F59E0B (oranžová — varování, pending stavy)
- **Error:** #EF4444 (červená — chyby, cancelled stavy)
- **Neutral:** #6B7280 (šedá — text, bordery)

**Typografie:**
- **Primární font:** Manrope nebo Inter
- **Headings:** 600-700 weight
- **Body:** 400-500 weight
- **Monospace:** Courier New (pro kódy, hashe)

---

### 7.3 Notifikační kanály

| Kanál | Použití | SLA | Formát |
|-------|---------|-----|--------|
| **E-mail** | Důležité události, GDPR notices, weekly summaries | Do 5 min | HTML template |
| **In-app** | Real-time notifikace, akce k provedení | Okamžitě | Notification bell |
| **Dashboard** | Přehled všech událostí, SLA monitoring | Okamžitě | Widget |
| **SMS** | Kritické události (optional) | Do 1 min | Plain text |

**Notification Priorities:**
- `critical` — červená, sound alert, popup
- `high` — oranžová, badge count
- `medium` — modrá, standard notification
- `low` — šedá, collapsed by default

**Notification Events:**
- `investor_match_found` — nový matching nalezen
- `reservation_awaiting_signature` — čeká na podpis
- `reservation_activated` — rezervace aktivována
- `commission_approved` — provize schválena
- `commission_paid_out` — provize vyplacena
- `sla_expiring_soon` — SLA brzy vyprší (7, 3, 1 den)
- `gdpr_anonymization_notice` — anonymizace za 7 dní
- `project_published` — nový projekt publikován
- `admin_action_required` — admin musí zasáhnout

---

### 7.4 Multilanguage Support (v3.7.8+)

**Podporované jazyky:**
- **CZ (Czech)** — primární jazyk
- **EN (English)** — sekundární jazyk

**Lokalizované oblasti:**
- UI labels a tlačítka
- Notifikace (e-mail + in-app)
- Error messages
- Help texty a tooltips
- PDF dokumenty (smlouvy, reporty)

**Language switching:**
- User preference v profilu
- Auto-detect podle browseru
- Persist v session storage

---

## 8. Business přínosy

| Oblast | Hodnota | Měřitelné metriky |
|--------|---------|-------------------|
| **Transparentnost** | Každá akce je auditována a zpětně dohledatelná. Audit log uchováván 10 let pro compliance. | • 100% coverage audit logu<br>• Průměrný čas dohledání události: < 10s<br>• Zero disputes díky audit trail |
| **Automatizace** | Investor matching automatický, provize počítané automaticky, SLA monitorovány v reálném čase. | • Matching < 1s pro 100 tiketů<br>• 95% provizí počítáno automaticky<br>• 80% SLA splněno automaticky |
| **Bezpečnost** | GDPR compliance, automatická anonymizace, dual-signature proces, audit trail. | • 100% GDPR compliance rate<br>• 0 data breaches<br>• Dual-signature na všech rezervacích |
| **Efektivita** | Jeden systém od matchingu přes rezervace až po výplatu provizí. Žádné manuální překlikávání. | • 70% snížení času na matching<br>• 50% rychlejší zpracování rezervací<br>• 90% automatických výplat |
| **Škálovatelnost** | Systém zvládá tisíce projektů, investorů a rezervací bez zpomalení. | • Support pro 10,000+ investorů<br>• 1,000+ concurrent users<br>• 99.9% uptime |
| **Compliance** | Plná auditovatelnost pro regulátory, GDPR ready, role-based access control. | • Audit připravený do 1h<br>• GDPR export do 24h<br>• Zero compliance violations |

---

## 9. Klíčové business metriky

### 9.1 Platform Health

**User Metrics:**
- Počet aktivních brokerů
- Počet aktivních developerů
- Počet evidovaných investorů
- Registration conversion rate
- User retention rate (měsíční)

**Project Metrics:**
- Počet publikovaných projektů
- Průměrná hodnota projektu
- Time to publish (od intake po approval)
- Project success rate (kolik se financuje)

**Matching Metrics:**
- Počet matchingů za den
- Průměrný match score
- Conversion rate (z match na rezervaci)
- False positive rate
- Matching performance (ms)

**Reservation Metrics:**
- Počet aktivních rezervací
- Průměrná hodnota rezervace
- Time to activation (od vytvoření po dual-signature)
- Expiration rate
- Cancellation rate + reasons

**Commission Metrics:**
- Celkový objem provizí (měsíční)
- Průměrná výše provize
- Time to payout (od aktivace po výplatu)
- Commission disputes rate
- Split commission ratio

---

### 9.2 Operational Metrics

**SLA Performance:**
- % rezervací dokončených do 30 dní
- % provizí vyplacených do 3 dní
- % projektů schválených do 7 dní
- Průměrný response time na incidenty

**Audit & Compliance:**
- Počet audit eventů za den
- Počet GDPR anonymizací za měsíc
- Compliance violations (should be 0)
- Audit export requests

**System Performance:**
- Average response time API
- Database query performance
- Matching algorithm speed
- Uptime %
- Error rate
- Active sessions

---

## 10. Roadmap & Future Enhancements

### Prioritní oblasti (Q2 2026):

**1. Advanced Analytics Dashboard**
- Real-time reporting pro brokery a developery
- Prediktivní modely pro matching success
- Business intelligence insights

**2. Mobile App**
- iOS + Android native apps
- Push notifications
- Offline mode pro zobrazení dat

**3. API for Partners**
- REST API pro integraci s externí systémy
- Webhook notifications
- Partner dashboard

**4. Extended Matching Algorithm**
- Machine learning pro zlepšení match score
- Historical data analysis
- Personalized recommendations

**5. Commission Automation**
- Automatická integrace s platebními systémy
- Real-time payment tracking
- Auto-payout bez admin approval

---

## 11. Governance Status

**SystemCore v3.8.1 — Production Status**

| Parametr | Hodnota |
|----------|---------|
| **Governance Status** | ✅ Locked for Production |
| **Compliance Rate** | 100% |
| **Audited by** | Admin, Compliance Officer, Data Protection Officer, DevOps Lead |
| **Last Audit** | 2026-03-13 |
| **Next Audit** | 2026-05-01 |
| **Change Requests (v3.8.1)** | 16 approved, 0 pending |
| **Test Coverage** | 95.1% |
| **Production Uptime** | 99.9% |

**Deployment Log:**
- **Deployed:** 2026-03-13T10:20:00Z
- **Deployed by:** Admin (Platform Owner)
- **Environment:** Production
- **Build Hash:** sha256-1a2b3c4d... (verified)
- **Pipeline:** GitHub Actions #358 (success)
- **Duration:** 142 seconds

---

## 12. Kontakty a podpora

**Maintainer:** Tipari.cz Platform Team  
**Email:** dev@tipari.cz  
**Support:** support@tipari.cz

**Documentation:** https://docs.tipari.cz/systemcore/v3.8.1  
**Repository:** https://github.com/tipari/systemcore  
**Changelog:** https://docs.tipari.cz/systemcore/changelog

---

**© 2026 Tipari.cz — B2B Investment Platform**  
*This document is automatically generated from SystemCore v3.8.1 canonical documentation.*
