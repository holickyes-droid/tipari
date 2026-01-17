# Tipari.cz — Functional Blueprint

**Version:** 0.2 (Auto-generated Draft)  
**Generated:** 2026-01-17  
**Source:** Tipari_Business_Specification_Summary.md (v1.1 Locked)  
**Author:** Figma AI (SystemCore Workflow)  
**Audit Marker:** `FUNCTIONAL_BLUEPRINT_GENERATED`

---

## Účel dokumentu

Tento dokument obsahuje procesní a UX popis platformy Tipari.cz. Je automaticky vygenerován z uzamčené Business Specification a slouží jako návod pro implementaci systému bez technických detailů.

**Klíčové znaky:**
- ✅ Srozumitelné popisy procesů (vstup → průběh → výstup)
- ✅ Jasné role a odpovědnosti
- ✅ Automatizované procesy označené symbolem ⚙️
- ✅ Stavové diagramy a workflow přechody
- ❌ Žádný kód, pseudokód ani API reference

---

## 1. Role & Actions Map

### 1.1 Přehled rolí a klíčových akcí

| Role | Klíčové akce | Automatizace |
|------|--------------|--------------|
| **Broker (Obchodník)** | • Registrace a správa investorů<br>• Vytváření rezervací<br>• Kontrola provizí<br>• Export dat investorů (GDPR) | **Částečně** — matching automatický, vytváření rezervací ruční |
| **Developer (Zadavatel)** | • Vytváření projektů<br>• Správa tiketů (investiční příležitosti)<br>• Podpis rezervací<br>• Platba provizí | **Ručně** — všechny akce vyžadují manuální vstup |
| **Admin (Správce)** | • Schvalování uživatelů<br>• Kontrola SLA<br>• Audit a compliance<br>• Správa GDPR anonymizace | **⚙️ Plně automatizované procesy** — monitoring, SLA, GDPR, incidenty |

---

### 1.2 Detailní akční matice

#### Broker (Obchodník)

| Akce | Kdy | Vstup | Výstup | Automatizace |
|------|-----|-------|--------|--------------|
| **Registrace brokera** | Při vstupu do systému | Jméno, firma, IČO, region působnosti, specializace | Účet se statusem `pending` | ⚙️ Validace formátů |
| **Přidání investora** | Kdykoliv po aktivaci účtu | Preference investora (forma, výnos, zajištění, objem) | Investor vytvořen, matching spuštěn | ⚙️ Auto-matching |
| **Aktualizace preferencí** | Při změně požadavků | Nové preference investora | Přepočet matchingu | ⚙️ Auto-matching |
| **Zobrazení matchingu** | Kdykoliv | investor_id | Seznam tiketů s match score | ⚙️ Real-time výsledky |
| **Vytvoření rezervace** | Po výběru tiketu | investor_id, ticket_id, částka | Rezervace se statusem `draft` | Ručně |
| **Kontrola provize** | Kdykoliv | broker_id | Seznam provizí (pending, paid) | Dashboard |

**Audit eventy:** `BROKER_REGISTERED`, `INVESTOR_CREATED`, `INVESTOR_UPDATED`, `RESERVATION_CREATED`

---

#### Developer (Zadavatel)

| Akce | Kdy | Vstup | Výstup | Automatizace |
|------|-----|-------|--------|--------------|
| **Registrace developera** | Při vstupu do systému | Firma, IČO, zaměření, regiony | Účet se statusem `pending` | ⚙️ Validace formátů |
| **Vytvoření projektu** | Kdykoliv po aktivaci | Název, typ, výše financování, výnos, zajištění | Projekt se statusem `draft` | Ručně |
| **Vytvoření tiketu** | Po schválení projektu | Parametry příležitosti (forma, výnos, zajištění) | Tiket vytvořen, matching spuštěn | ⚙️ Auto-matching pro všechny investory |
| **Podpis rezervace** | Po podpisu investora | reservation_id | Rezervace aktivována, provize vytvořena | ⚙️ Auto-vytvoření provize |
| **Nahrání dokumentace** | Kdykoliv | PDF soubory (zajištění, smlouvy) | Dokumenty připojeny k tiketu | Ručně |
| **Platba provize** | Po schválení adminem | commission_id, částka | Provize zaplacena platformě | Ručně (bankovní převod) |

**Audit eventy:** `DEVELOPER_REGISTERED`, `PROJECT_CREATED`, `TICKET_CREATED`, `RESERVATION_SIGNED_DEVELOPER`, `COMMISSION_PAID_BY_DEVELOPER`

---

#### Admin (Správce)

| Akce | Kdy | Vstup | Výstup | Automatizace |
|------|-----|-------|--------|--------------|
| **Schválení registrace** | Po kontrole smluv | user_id (broker/developer) | Status `verified` → `active` | Ručně |
| **Schválení projektu** | Po kontrole dat | project_id | Status `published` | Ručně |
| **Schválení provize** | Po aktivaci rezervace | commission_id | Provize schválena, developer notifikován | Ručně nebo ⚙️ auto-approve |
| **Kontrola SLA** | Automaticky každou hodinu | N/A | SLA alerts, auto-expirace | ⚙️ Plně automatické |
| **Řešení incidentů** | Při detekci problému | incident_id | Incident vyřešen nebo eskalován | ⚙️ Auto-resolve pro technické |
| **GDPR anonymizace** | 180 dní po archivaci | investor_id | Osobní údaje anonymizovány | ⚙️ Plně automatické |
| **Úprava SLA limitů** | Při změně business pravidel | timeout_constants | Nové SLA limity | Ručně |
| **Audit log přehled** | Kdykoliv | Filtry (role, entita, akce) | Seznam audit eventů | Dashboard |

**Audit eventy:** `BROKER_VERIFIED`, `PROJECT_APPROVED`, `COMMISSION_APPROVED`, `ADMIN_OVERRIDE`, `SLA_MODIFIED`, `INVESTOR_ANONYMIZED`

---

## 2. Investor Matching Flow

### 2.1 Proces párování investorů s projekty

**Účel:** Automaticky najít vhodné investiční příležitosti pro každého investora na základě jeho preferencí.

**Kdo spouští:** ⚙️ Systém automaticky

**Triggery:**
- Broker zadá nebo aktualizuje investora a jeho preference
- Developer vytvoří nebo aktualizuje tiket
- Admin publikuje projekt

---

### 2.2 Workflow (krok za krokem)

#### 1️⃣ Broker zadá investora a jeho preference

**Actor:** Broker (ručně)

**Vstup:**
- Jméno investora (anonymizováno jako `email_hash`, `phone_hash`)
- **Preference:**
  - Investiční forma: loan (půjčka), equity (kapitál), mezzanine, custom
  - Min/max výnos: např. 8% - 12%
  - Min/max objem: např. 5 mil - 20 mil CZK
  - Typ zajištění: mortgage (hypotéka), pledge (zástava), guarantee (záruka)
  - Preferované regiony: např. Praha, Brno

**Výstup:** Investor uložen do databáze se statusem `draft`

**Audit event:** `INVESTOR_CREATED`

---

#### 2️⃣ ⚙️ Systém automaticky porovná investora s aktivními tikety

**Actor:** Systém (automatický krok)

**Logika:**
- Načti všechny aktivní tikety (status `published`)
- Pro každý tiket:
  - Porovnej investiční formu (shoda = +40% score)
  - Porovnej výnos (tiket.yield v rozsahu investor.yield_min - investor.yield_max = +30% score)
  - Porovnej zajištění (shoda typu = +30% score)

**Performance SLA:** ≤ 1 sekunda pro 100 tiketů

---

#### 3️⃣ ⚙️ Výpočet match score (0.0 – 1.0) a ukládání výsledků

**Actor:** Systém (automatický krok)

**Výpočet:**

**Příklad:**
- Investor preference: `loan`, yield 8-12%, `mortgage`
- Tiket A: `loan`, yield 10%, `mortgage` → **match_score = 1.0** (100% shoda)
- Tiket B: `loan`, yield 10%, `pledge` → **match_score = 0.7** (70% shoda, zajištění se neshoduje)
- Tiket C: `equity`, yield 15%, `none` → **match_score = 0.0** (0% shoda)

**Výstup:**
- `InvestorMatchingResult` záznam pro každý tiket s score > 0.0
- Matched attributes: `["investment_form", "yield", "security"]`

**Audit event:** `INVESTOR_MATCH_EXECUTED`

---

#### 4️⃣ Broker vidí seznam shod v dashboardu

**Actor:** Broker (zobrazení)

**UI Display:**
- **TicketCard** komponenta zobrazí:
  - Název projektu
  - Match score badge (zelená 80-100%, oranžová 50-79%, šedá < 50%)
  - Matched attributes (tagy: "Investment Form ✓", "Yield ✓", "Security ✓")
  - CTA button: "Vytvořit rezervaci"

**Výstup:** Seřazený seznam tiketů podle match score (nejvyšší první)

---

#### 5️⃣ Audit eventy

**Vygenerované eventy:**
- `INVESTOR_MATCH_EXECUTED` — matching běh spuštěn
- `INVESTOR_MATCH_RESULTED` — výsledky uloženy do databáze
- `NOTIFICATION_SENT` — broker notifikován o nových shodách

---

### 2.3 Souhrn (vstup → výstup)

| Parametr | Hodnota |
|----------|---------|
| **Vstup** | investor_id + preference (forma, výnos, zajištění, objem, region) |
| **Proces** | ⚙️ Automatické porovnání s aktivními tikety + výpočet score |
| **Výstup** | Seřazený seznam tiketů podle match score (0.0 - 1.0) + matched attributes |
| **SLA** | ≤ 1 sekunda / 100 tiketů |
| **Audit** | `INVESTOR_MATCH_EXECUTED`, `INVESTOR_MATCH_RESULTED` |

---

## 3. Reservation Lifecycle

### 3.1 Stavový diagram (textový)

```
┌─────────┐
│  DRAFT  │ ← Broker vytváří rezervaci
└────┬────┘
     │
     ▼
┌─────────────────────────────┐
│ PENDING_INVESTOR_SIGNATURE  │ ← Čeká na podpis investora
└────┬────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ PENDING_DEVELOPER_SIGNATURE  │ ← Čeká na podpis developera
└────┬─────────────────────────┘
     │
     ▼
┌──────────┐
│  ACTIVE  │ ← Obě strany podepsaly → ⚙️ Provize vytvořena
└────┬─────┘
     │
     ▼
┌───────────┐
│ COMPLETED │ ← Financování proběhlo (terminal state)
└───────────┘

Alternativní stavy:
- CANCELLED ← Zrušeno před aktivací (broker nebo admin)
- EXPIRED ← 30 dní SLA vypršelo bez podpisů
```

---

### 3.2 Pravidla přechodů

#### Přechod: DRAFT → PENDING_INVESTOR_SIGNATURE

**Trigger:** Broker dokončí rezervaci a odešle k podpisu  
**Akce:**
- Vygenerovat PDF dokument rezervace
- Odeslat e-sign request investorovi (e-mail + link)
- ⚙️ Spustit 30denní SLA timer

**Audit event:** `RESERVATION_SUBMITTED`

---

#### Přechod: PENDING_INVESTOR_SIGNATURE → PENDING_DEVELOPER_SIGNATURE

**Trigger:** Investor podepíše rezervaci (e-sign webhook)  
**Akce:**
- Validovat podpis investora
- Odeslat e-sign request developerovi
- Notifikovat developera (e-mail + in-app)

**Audit event:** `RESERVATION_SIGNED_INVESTOR`

---

#### Přechod: PENDING_DEVELOPER_SIGNATURE → ACTIVE

**Trigger:** Developer podepíše rezervaci  
**Akce:**
- Validovat podpis developera
- Změnit status → `active`
- ⚙️ **Automaticky vytvořit provizi** pro brokera
- Zastavit SLA timer
- Notifikovat brokera (rezervace aktivována + provize vytvořena)

**Audit event:** `RESERVATION_SIGNED_DEVELOPER`, `COMMISSION_CREATED`

---

#### Automatická expirace: → EXPIRED

**Trigger:** ⚙️ 30 dní od vytvoření bez dokončení podpisů  
**Akce:**
- Cron job kontroluje rezervace v `pending_*_signature` každou hodinu
- Pokud `created_at + 30 dní < now()` → změnit status → `expired`
- Uvolnit kapacitu tiketu
- Notifikovat brokera (rezervace vypršela)

**Audit event:** `RESERVATION_EXPIRED`

---

#### Manuální zrušení: → CANCELLED

**Kdo může zrušit:**
- Broker (před podpisem investora)
- Admin (kdykoliv, s důvodem override)

**Akce:**
- Změnit status → `cancelled`
- Uvolnit kapacitu tiketu

**Audit event:** `RESERVATION_CANCELLED` (s cancellation_reason)

---

### 3.3 SLA a časové limity

| SLA | Hodnota | Enforcement |
|-----|---------|-------------|
| **Dokončení podpisů** | 30 dní | ⚙️ Automatická expirace |
| **Notifikace před expirací** | 7 dní, 3 dny, 1 den před koncem | ⚙️ Auto e-mail + in-app |

---

### 3.4 Audit eventy

| Event | Kdy | Kdo |
|-------|-----|-----|
| `RESERVATION_CREATED` | Vytvoření rezervace | Broker |
| `RESERVATION_SUBMITTED` | Odeslání k podpisu | Broker |
| `RESERVATION_SIGNED_INVESTOR` | Investor podepsal | Investor (external) |
| `RESERVATION_SIGNED_DEVELOPER` | Developer podepsal | Developer |
| `RESERVATION_ACTIVATED` | Obě strany podepsaly | System |
| `RESERVATION_EXPIRED` | 30 dní bez podpisů | ⚙️ System (cron) |
| `RESERVATION_CANCELLED` | Manuální zrušení | Broker nebo Admin |

---

## 4. Commission Workflow

### 4.1 Proces výpočtu a výplaty provize

**Účel:** Automaticky vypočítat a vyplatit provizi brokerovi za úspěšné zprostředkování investice.

**Kdo spouští:** ⚙️ Systém automaticky při aktivaci rezervace

---

### 4.2 Workflow (krok za krokem)

#### 1️⃣ ⚙️ Provize vzniká při aktivaci rezervace

**Trigger:** Reservation status → `active` (obě strany podepsaly)

**Actor:** Systém (automatický krok)

**Akce:**
- Vytvoření záznamu `Commission` se statusem `pending`

**Audit event:** `COMMISSION_CREATED`

---

#### 2️⃣ ⚙️ Systém vypočítá výši podle procenta a Tipar Levelu

**Actor:** Systém (automatický krok)

**Výpočet:**

**Tipar Level brokera:**
- **Bronze:** 1.0% provize
- **Silver:** 1.5% provize
- **Gold:** 2.0% provize
- **Platinum:** 3.0% provize

**Příklad:**
- Rezervace: 10 mil CZK
- Broker level: Gold (2%)
- **Provize = 10,000,000 * 0.02 = 200,000 CZK**

**Split Commission (pokud více brokerů):**
- Broker A (hlavní): 60% = 120,000 CZK
- Broker B (spolupráce): 40% = 80,000 CZK

**Výstup:** Commission amount uložena

---

#### 3️⃣ Admin ověřuje / schvaluje

**Actor:** Admin (ručně) nebo ⚙️ Auto-approve (pro standardní provize)

**Akce:**
- Admin zkontroluje výpočet provize
- Zkontroluje broker eligibility
- Schválí nebo zamítne

**Možnosti:**
- ✅ Approve → status `approved`
- ✏️ Modify → admin přepíše částku (s důvodem)
- ❌ Reject → status `rejected` (s důvodem)

**Audit event:** `COMMISSION_APPROVED` (nebo `COMMISSION_REJECTED`)

**Notifikace:** Developer dostane e-mail + in-app notifikaci k platbě

---

#### 4️⃣ Developer zaplatí platformě

**Actor:** Developer (ručně)

**Akce:**
- Developer provede bankovní převod na účet platformy
- Developer nebo admin potvrdí platbu v systému

**Výstup:** Commission status → `paid_to_platform`

**Audit event:** `COMMISSION_PAID_BY_DEVELOPER`

**SLA:** 30 dní na platbu (jinak eskalace k adminu)

---

#### 5️⃣ ⚙️ Platforma vyplácí brokerovi do 3 dnů

**Actor:** Systém (automatická výplata) nebo Admin (manuální)

**Trigger:** Commission status = `paid_to_platform` + 3denní verifikační perioda

**Akce:**
- Systém ověří přijaté peníze
- ⚙️ Automatický převod na účet brokera
- Vygenerování výplatního dokladu

**Výstup:** Commission status → `paid_to_broker`

**Audit event:** `COMMISSION_PAID_OUT`

**Notifikace:** Broker dostane e-mail + in-app notifikaci o výplatě

**SLA:** 3 dny po přijetí platby od developera

---

### 4.3 Stavy provize

| Status | Popis | Další krok | SLA |
|--------|-------|------------|-----|
| **pending** | Čeká na schválení adminem | `approved` nebo `rejected` | Best effort |
| **approved** | Schváleno, čeká na platbu developera | `paid_to_platform` | 30 dní |
| **paid_to_platform** | Developer zaplatil, čeká na výplatu | `paid_to_broker` | 3 dny |
| **paid_to_broker** | Broker dostal výplatu | (terminal state) | N/A |
| **rejected** | Admin zamítl | (terminal state) | N/A |

---

### 4.4 Audit eventy

| Event | Kdy | Kdo |
|-------|-----|-----|
| `COMMISSION_CREATED` | Rezervace aktivována | ⚙️ System |
| `COMMISSION_APPROVED` | Admin schválil | Admin |
| `COMMISSION_PAID_BY_DEVELOPER` | Developer zaplatil | Developer |
| `COMMISSION_PAID_OUT` | Broker dostal výplatu | ⚙️ System nebo Admin |
| `COMMISSION_REJECTED` | Admin zamítl | Admin |

---

### 4.5 Souhrn (vstup → výstup)

| Parametr | Hodnota |
|----------|---------|
| **Vstup** | reservation_id (status `active`) |
| **Proces** | ⚙️ Auto-vytvoření → výpočet částky → admin approval → developer platba → broker výplata |
| **Výstup** | Provize vyplacena brokerovi |
| **SLA** | Developer má 30 dní na platbu, platforma 3 dny na výplatu |
| **Audit** | `COMMISSION_CREATED`, `COMMISSION_APPROVED`, `COMMISSION_PAID_BY_DEVELOPER`, `COMMISSION_PAID_OUT` |

---

## 5. Automated Processes

### 5.1 Přehled automatických úloh

Všechny automatické procesy jsou označeny symbolem ⚙️ a běží na pozadí bez manuálního zásahu.

---

### 5.2 ⚙️ Investor Matching Audit

**Název:** `INVESTOR_MATCHING_AUDIT_CRON`

**Frekvence:** Denně v 02:00 CET

**Účel:** Validace aktivních matchingů a přepočet zastaralých výsledků

**Workflow:**
1. Načti všechny investory se statusem `active`
2. Pro každého investora:
   - Zkontroluj, kdy byl naposledy spočítán matching
   - Pokud je starší než 24 hodin → přepočítej
3. Načti všechny nově publikované tikety za posledních 24h
4. Pro každý nový tiket:
   - Spusť matching se všemi aktivními investory
5. Ulož audit log

**Vstup:** N/A (automatický trigger)

**Výstup:**
- Aktualizované `InvestorMatchingResult` záznamy
- Notifikace brokerům o nových shodách

**Audit event:** `INVESTOR_MATCH_AUDIT`

**SLA:** Dokončení do 15 minut

---

### 5.3 ⚙️ SLA Monitoring

**Název:** `SLA_MONITORING_CRON`

**Frekvence:** Každou 1 hodinu

**Účel:** Kontrola expirací rezervací, plateb a automatické akce při vypršení SLA

**Workflow:**

**A) Kontrola rezervací:**
```
FOR každou rezervaci WHERE status IN ('pending_investor_signature', 'pending_developer_signature'):
    days_elapsed = now() - created_at
    
    IF days_elapsed == 23:
        → SEND notification (Broker, "Rezervace vyprší za 7 dní")
    
    IF days_elapsed == 27:
        → SEND notification (Broker, "Rezervace vyprší za 3 dny")
    
    IF days_elapsed == 29:
        → SEND notification (Broker, "Rezervace vyprší zítra")
    
    IF days_elapsed >= 30:
        → UPDATE status = 'expired'
        → AUDIT_LOG('RESERVATION_EXPIRED')
        → SEND notification (Broker, "Rezervace vypršela")
```

**B) Kontrola provizí:**
```
FOR každou provizi WHERE status = 'approved':
    days_elapsed = now() - approved_at
    
    IF days_elapsed == 20:
        → SEND notification (Developer, "Platba provize splatná za 10 dní")
    
    IF days_elapsed == 27:
        → SEND notification (Developer, "Platba provize splatná za 3 dny")
    
    IF days_elapsed >= 30:
        → SEND escalation (Admin, "Developer payment overdue")
        → AUDIT_LOG('COMMISSION_PAYMENT_OVERDUE')
```

**Vstup:** N/A (automatický trigger)

**Výstup:**
- Auto-expirované rezervace
- SLA notifikace
- Admin eskalace

**Audit event:** `SLA_CHECK_COMPLETED`, `RESERVATION_EXPIRED`, `COMMISSION_PAYMENT_OVERDUE`

---

### 5.4 ⚙️ GDPR Pre-Anonymization Notice

**Název:** `GDPR_PRE_ANONYMIZATION_CRON`

**Frekvence:** Denně v 09:00 CET

**Účel:** Poslat brokerům 7denní upozornění před anonymizací investora

**Workflow:**
```
FOR každého investora WHERE status = 'archived':
    days_archived = now() - archived_at
    
    IF days_archived == 173:  // 7 dní před 180denním limitem
        → SEND gdpr_notice (Broker, "Investor bude anonymizován za 7 dní")
        → SEND in-app notification
        → AUDIT_LOG('GDPR_NOTICE_SENT', severity='warning')
    
    IF days_archived == 177:  // 3 dny před
        → SEND gdpr_notice (Broker, "Investor bude anonymizován za 3 dny")
    
    IF days_archived == 179:  // 1 den před
        → SEND gdpr_notice (Broker, "Investor bude anonymizován zítra")
    
    IF days_archived >= 180:
        → EXECUTE anonymize_investor()
        → AUDIT_LOG('INVESTOR_ANONYMIZED')
        → SEND confirmation (Broker, "Investor anonymizován")
```

**Anonymizace zahrnuje:**
- `email` → `SHA256(email)` (hash)
- `phone` → `SHA256(phone)` (hash)
- `full_name` → `[ANONYMIZED]`
- `birth_date` → `NULL`
- `personal_id` → `NULL`

**Zachovávají se:**
- `investor_id` (pro audit trail)
- `broker_id` (vazba na brokera)
- `match_history` (anonymizované statistiky)
- `statistics` (agregované metriky)

**Vstup:** N/A (automatický trigger)

**Výstup:**
- E-mail + in-app notifikace brokerům
- Anonymizovaná data investora po 180 dnech

**Audit event:** `GDPR_NOTICE_SENT`, `INVESTOR_ANONYMIZED`

**GDPR Compliance:** ✅ Right to be forgotten implementováno

---

### 5.5 ⚙️ Incident Auto-Resolve

**Název:** `INCIDENT_AUTO_RESOLVE_CRON`

**Frekvence:** Každých 15 minut

**Účel:** Automaticky uzavřít technické incidenty po validaci modulu

**Workflow:**
```
FOR každý incident WHERE status = 'open' AND category = 'technical':
    
    // Zkontroluj health check postiženého modulu
    IF module_health_check(incident.affected_module) == 'healthy':
        → UPDATE status = 'auto_resolved'
        → AUDIT_LOG('INCIDENT_AUTO_RESOLVED')
        → SEND notification (Admin, "Incident auto-resolved")
        
        // Naplánuj verifikaci za 1 hodinu
        → SCHEDULE check_incident_reopening(incident.id, delay='1h')
    
    // Pokud po 1 hodině je stále healthy → permanent closure
    IF verification_passed AND time_since_resolve >= 1 hour:
        → UPDATE status = 'closed'
        → AUDIT_LOG('INCIDENT_CLOSED')
```

**Vstup:** N/A (automatický trigger)

**Výstup:**
- Auto-resolved incidenty
- Admin notifikace

**Audit event:** `INCIDENT_AUTO_RESOLVED`, `INCIDENT_CLOSED`

---

### 5.6 Souhrn automatických procesů

| Proces | Frekvence | Vstup | Výstup | Audit Event |
|--------|-----------|-------|--------|-------------|
| **⚙️ Investor Matching Audit** | Denně 02:00 | Active investors + tickets | Aktualizované matching results | `INVESTOR_MATCH_AUDIT` |
| **⚙️ SLA Monitoring** | Každou 1h | Rezervace + provize | SLA alerts, auto-expirace | `SLA_CHECK_COMPLETED` |
| **⚙️ GDPR Pre-Anonymization** | Denně 09:00 | Archived investors | E-mail notifikace (7d, 3d, 1d) | `GDPR_NOTICE_SENT` |
| **⚙️ GDPR Anonymization** | Denně 09:00 | Investors archived 180+ dní | Anonymizovaná data | `INVESTOR_ANONYMIZED` |
| **⚙️ Incident Auto-Resolve** | Každých 15min | Open technical incidents | Auto-resolved incidents | `INCIDENT_AUTO_RESOLVED` |

---

## 6. UX Interaction Layer

### 6.1 Broker Dashboard

**Účel:** Centrální přehled pro brokera

**Komponenty:**

| Komponenta | Obsah | Akce |
|------------|-------|------|
| **InvestorListCard** | Seznam investorů se statusy (`draft`, `active`, `archived`) | • Přidat investora<br>• Upravit preference<br>• Zobrazit matching |
| **MatchingResultsWidget** | Top 10 matchů pro každého investora s match score | • Vytvořit rezervaci<br>• Zobrazit detail tiketu |
| **ReservationTracker** | Aktivní rezervace s dual-signature status | • Sledovat progress<br>• Zrušit rezervaci |
| **CommissionSummary** | Celková suma provizí (pending, approved, paid) | • Zobrazit detail provize<br>• Historie výplat |
| **NotificationBell** | In-app alerts (matches, signatures, payouts) | • Přečíst notifikaci<br>• Přejít na detail |

**Klíčové akce:**
- ✅ Přidat nového investora
- ✅ Aktualizovat preference → ⚙️ auto-matching
- ✅ Zobrazit matching results
- ✅ Vytvořit rezervaci
- ✅ Sledovat status provizí
- ✅ Export dat investora (GDPR)

---

### 6.2 Developer Dashboard

**Účel:** Správa projektů a tiketů

**Komponenty:**

| Komponenta | Obsah | Akce |
|------------|-------|------|
| **ProjectListCard** | Seznam projektů se statusy (`draft`, `pending_approval`, `published`) | • Vytvořit projekt<br>• Upravit projekt<br>• Zobrazit tikety |
| **TicketListCard** | Aktivní tikety s matching statistikami | • Vytvořit tiket<br>• Upravit tiket<br>• Zobrazit matching |
| **ReservationInbox** | Rezervace čekající na podpis developera | • Zobrazit detail<br>• Podepsat rezervaci |
| **CommissionPaymentQueue** | Schválené provize k zaplacení | • Zaplatit provizi<br>• Zobrazit detail |
| **NotificationBell** | Alerts (nové rezervace, payment reminders) | • Přečíst notifikaci<br>• Přejít na detail |

**Klíčové akce:**
- ✅ Vytvořit projekt → odeslat k approval
- ✅ Vytvořit tiket → ⚙️ auto-matching
- ✅ Podepsat rezervaci → ⚙️ provize vytvořena
- ✅ Nahrát dokumentaci (zajištění)
- ✅ Zaplatit provizi

---

### 6.3 Admin Dashboard

**Účel:** Governance a monitoring platformy

**Komponenty:**

| Komponenta | Obsah | Akce |
|------------|-------|------|
| **RegistrationApprovalQueue** | Pending brokers + developers | • Approve/Reject<br>• Zobrazit detail |
| **ProjectApprovalQueue** | Projekty čekající na publikaci | • Approve/Reject<br>• Zobrazit detail |
| **SLAMonitoringWidget** | Real-time SLA countdown timers | • Zobrazit detail<br>• Override SLA |
| **IncidentDashboard** | Open incidenty se severity levels | • Vyřešit incident<br>• Eskalovat |
| **AuditLogViewer** | Kompletní audit trail s filtry | • Filtrovat podle role/entity/akce<br>• Export do JSON |
| **GDPRComplianceWidget** | Nadcházející anonymizace + export requesty | • Zobrazit detail<br>• Manual anonymization |
| **CommissionApprovalQueue** | Pending provize | • Approve/Reject/Modify<br>• Zobrazit detail |

**Klíčové akce:**
- ✅ Schválit registrace brokerů a developerů
- ✅ Schválit projekty před publikací
- ✅ Schválit provize
- ✅ Upravit SLA limity
- ✅ Vyřešit incidenty
- ✅ Zobrazit full audit log
- ✅ GDPR anonymizace (manual override)

---

### 6.4 Notifikace (event → komu → kanál)

| Event | Recipient | Kanál | Priority | Obsah |
|-------|-----------|-------|----------|-------|
| **investor_match_found** | Broker | In-app | 🟡 Medium | "Nové shody pro investora [NAME]: [N] tiketů" |
| **reservation_awaiting_signature** | Developer | E-mail + In-app | 🟠 High | "Rezervace [ID] čeká na váš podpis" |
| **reservation_activated** | Broker | E-mail + In-app | 🟠 High | "Rezervace [ID] aktivována. Provize vytvořena." |
| **commission_approved** | Broker + Developer | E-mail + In-app | 🟠 High | "Provize schválena. Developer platba splatná do 30 dní." |
| **commission_paid_out** | Broker | E-mail + In-app | 🟠 High | "Provize [AMOUNT] vyplacena na váš účet" |
| **sla_expiring_soon** | Broker / Developer | E-mail | 🟠 Warning | "[PROCESS] vyprší za [N] dní" |
| **gdpr_anonymization_notice** | Broker | E-mail + In-app | 🔴 Critical | "Investor [NAME] bude anonymizován za 7 dní" |
| **project_published** | All brokers | In-app | 🟢 Low | "Nový projekt publikován: [PROJECT NAME]" |
| **admin_action_required** | Admin | E-mail + Dashboard | 🔴 Critical | "Schválení potřebné: [ENTITY]" |

**Priority Legend:**
- 🔴 **Critical** — červená, popup alert
- 🟠 **High** — oranžová, badge count
- 🟡 **Medium** — modrá, standard notification
- 🟢 **Low** — šedá, collapsed by default

---

## 7. Governance Hooks

### 7.1 Akce vyžadující schválení Admina

**Governance Policy:** Admin má právo schvalovat klíčové akce před jejich finalizací.

| Akce | Entita | Důvod schválení | Auto-Approved? |
|------|--------|-----------------|----------------|
| **Registrace brokera** | User (Broker) | Ověření smluv (NDA, framework agreement) | ❌ Vždy manuální |
| **Registrace developera** | User (Developer) | Ověření právního oprávnění | ❌ Vždy manuální |
| **Publikace projektu** | Project | Validace kompletnosti dat | ❌ Vždy manuální |
| **Schválení provize** | Commission | Validace výpočtu a eligibility | ✅ Ano (pro standardní) |
| **Override entity dat** | Any | Admin discretion pro výjimečné případy | ❌ Vždy manuální |
| **Změna SLA limitů** | System settings | Business pravidla platformy | ❌ Vždy manuální |
| **GDPR export** | Investor | Compliance requirement | ✅ Ano (automatický log) |
| **Manual anonymizace** | Investor | Right to be forgotten | ❌ Vždy manuální |

---

### 7.2 Admin Override Rights

**Admin Canonical Input Rights:**

Admin má právo:
- ✅ Ručně zadávat, upravovat a přepisovat jakákoli canonical data
- ✅ Provádět úpravy přímo v rozhraní platformy
- ✅ Opravovat chybné hodnoty bez nutnosti systémového schválení
- ✅ Ručně vytvářet nebo mazat entity v případě auditu nebo oprav

**Governance Note:**
> Všechny governance akce generují audit event s typem `ADMIN_OVERRIDE`.

**Audit Event Structure:**
```
{
  entity_type: "reservation",
  entity_id: "res_12345",
  action: "ADMIN_OVERRIDE",
  performed_by: "admin_user_001",
  override_reason: "Correction of investor data per client request",
  timestamp: "2026-01-17T14:32:15Z",
  severity: "warning"
}
```

---

### 7.3 Audit Event Generování

**Pravidlo:** Každá akce v systému generuje audit event.

**Struktura:**
- `entity_type` — co bylo změněno (user, project, reservation, commission, investor)
- `entity_id` — které ID
- `action` — co se stalo (CREATE, UPDATE, DELETE, APPROVE, SIGN, EXPIRE, ANONYMIZE)
- `performed_by` — kdo to udělal (user_id nebo SYSTEM)
- `timestamp` — kdy (ISO 8601)
- `previous_audit_id` — chain reference (pro audit trail)
- `run_id` — batch process ID (pro grouped operations)
- `session_id` — user session
- `severity` — info, warning, error, critical

**Příklady:**

**Broker vytvoří investora:**
```
{
  entity_type: "investor",
  entity_id: "inv_12345",
  action: "CREATE",
  performed_by: "user_broker_456",
  timestamp: "2026-01-17T10:00:00Z",
  severity: "info"
}
```

**Systém anonymizuje investora (GDPR):**
```
{
  entity_type: "investor",
  entity_id: "inv_12345",
  action: "ANONYMIZE",
  performed_by: "SYSTEM",
  timestamp: "2026-01-17T02:00:00Z",
  run_id: "gdpr_cron_2026_01_17",
  severity: "info"
}
```

**Admin schválí projekt:**
```
{
  entity_type: "project",
  entity_id: "proj_67890",
  action: "APPROVE",
  performed_by: "admin_user_001",
  timestamp: "2026-01-17T14:30:00Z",
  severity: "info"
}
```

---

### 7.4 Uchování audit logu

| Typ dat | Retention | Formát |
|---------|-----------|--------|
| **Active audit log** | 180 dní | Database (PostgreSQL) |
| **Archived audit log** | 10 let | JSON export (compressed) |
| **Compliance audit** | 10 let | Immutable storage |

**Governance Note:**
> Audit trail je neměnný (immutable). Všechny změny jsou pouze append-only.

---

## 8. Souhrn dokumentu

### 8.1 Klíčové poznatky

✅ **Role jasně definované:** Broker, Developer, Admin s konkrétními akcemi  
✅ **Automatizace označena:** Všechny ⚙️ procesy běží bez manuálního zásahu  
✅ **Workflow popisy:** Vstup → průběh → výstup pro každý proces  
✅ **SLA enforcement:** Automatické expirace, notifikace, eskalace  
✅ **Governance hooks:** Admin approval pro klíčové akce  
✅ **Audit trail:** Každá akce zaznamenána s 10letým uchováním

---

### 8.2 Automatizované procesy

| Proces | Symbol | Frekvence |
|--------|--------|-----------|
| Investor Matching | ⚙️ | Real-time + denní audit |
| SLA Monitoring | ⚙️ | Každou 1 hodinu |
| GDPR Anonymization | ⚙️ | Denně v 09:00 |
| Incident Auto-Resolve | ⚙️ | Každých 15 minut |
| Commission Creation | ⚙️ | Při aktivaci rezervace |
| Reservation Expiration | ⚙️ | Každou 1 hodinu |

---

### 8.3 Next Steps

Tento Functional Blueprint slouží jako základ pro:

1. **Backend API Design** — Definice REST/GraphQL endpointů
2. **Frontend UX Wireframes** — Vizuální návrh dashboardů
3. **Database Schema** — Překlad entit do tabulek
4. **Test Cases** — Scénáře testování workflow
5. **DevOps CI/CD** — Automatizace deployment a monitoring

---

**© 2026 Tipari.cz — Functional Blueprint v0.2**  
*Auto-generated from Business Specification Summary v1.1 (Locked for Production)*  
*All governance and audit rules enforced per SystemCore v3.8.1*
