# Tipari.cz – Kanonický souhrn dat, UX a UI

**Stav dokumentu:** sjednocení, úklid a finalizace dat + zadání pro UX/UI (bez technických kódů a bez návrhu databáze)

**Verze:** 4.6

**Datum:** 2026-01-18

## Osnova

### Souhrn dat
- 0. Jak s dokumentem pracovat
- 1. Shrnutí pro vedení
- 2. Projektový rozsah
- 3. Role a zainteresované strany
- 4. Klíčové toky
- 5. Externí závislosti
- 6. Omezení a předpoklady
- 7. Datové entity
- 8. Kanonické seznamy povolených hodnot
- 10. Business logika (kanonické rozhodnutí)
- 11. Zjištěné duplicity a nesoulady (a návrh řešení)
- 12. Datový slovník (MVP, bez technických kódů)
- 15. Pravidla publikace a blokátory dat
- 16. Audit a incident management (kanonické minimum)
- 17. Administrace a nastavení
- 18. Matching investorů (specifikace bez kódu)
- 19. Dokumenty, smlouvy a elektronické podpisy
- 20. Otevřené otázky a rozhodnutí k potvrzení
- 21. Stavové automaty a automatizace
- Příloha A: Doporučení pro udržování dokumentace (inspirace z veřejných zdrojů)
- Příloha D: Právní rámec a minimalizace rizik
- Příloha E: Nesrovnalosti v podkladech a naše kanonické rozhodnutí
- Příloha F: Témata pro další doplnění (aby byl systém plně předatelný)
- Příloha H: Doporučené pokračování práce (priorita pro předání týmu)

### UX část
- 14. Notifikace (MVP)
- Příloha G: UX a uživatelské rozhraní – detailní specifikace (MVP)
- G.1 Zásady uživatelské zkušenosti
- G.2 Informační architektura (navigace)
- G.7 Maskování a odkrytí identit v uživatelském rozhraní
- G.8 Zobrazení kapacity a pořadí rezervací
- G.9 Minimální standard přístupnosti a použitelnosti
- G.10 Otevřená UX rozhodnutí (návrhy)

### UI část
- 9. Formuláře a vstupní data (bez technických kódů)
- 13. Matice viditelnosti a oprávnění (MVP)
- Příloha B: Uživatelské rozhraní – hierarchie informací a rozhodovací údaje
- Příloha C: Administrátorské rozhraní – navigace, seznamy, sloupce, filtry, akce
- G.3 Základní komponenty a datové bloky
- G.4 Obrazovky – obchodník (broker)
- G.5 Obrazovky – developer
- G.6 Obrazovky – administrátor
- Příloha I: Registry formulářů (MVP – pro implementaci databáze i uživatelského rozhraní)

## Souhrn dat

### 0. Jak s dokumentem pracovat

Tento soubor je **jediný kanonický „souhrn dat“** pro:
- programátora (co má vzniknout v systému: data, vazby, pravidla)
- návrháře uživatelského rozhraní (jaká data se sbírají a kde se zobrazují)

Cíl:
- odstranit duplicity a rozpory mezi podklady
- převést „chaotické“ výčty do jedné logické struktury
- připravit přehledné seznamy povolených hodnot (seznamy povolených hodnot)
- popsat business logiku tak, aby byla proveditelná v systému

#### 0.1 Co v dokumentu záměrně zatím není
- technické názvy polí a strojové klíče
- návrh databázového schématu
- návrh konkrétních koncových bodů aplikačního programového rozhraní

Tyto části doplníme až ve chvíli, kdy budou data stabilní.

#### 0.2 Hlavní zdroje, ze kterých byla data sjednocena
- **Zadání projektu do systému.docx** (pole projektu a tiketu + role ve schvalování)
- **Registrace obchodník developer.docx** (registrace + členění polí + co je mimo scope UX)
- **Vstupní data o investorovi.docx** (evidence investora + preference pro matching + kdo je zdroj pravdy)
- **Formy financování vs zajištění.docx** (obchodní klasifikace financování + rozdíl ručení vs zajištění)
- **Formy investice.docx** (doporučení pro UX klasifikaci + compliance „co sem nepatří“)
- **Formy zajištění.docx** (katalog zajištění + doporučení pro UI zobrazení)
- **Znalecký posudek.docx** (pravidla ocenění, zdroje hodnoty, LTV a právní texty)
- **Využití prostředků.docx** (kanonický procentuální rozpad + validace součtu)
- **Rozdělení provize.docx** (provizní pravidla + admin-only workflow + verzování)
- **Brand a produktová identita.docx** (brandové ukotvení: levely, sloty, pravidla zobrazení, „provize v Kč“)
- **Nastavení admin.docx** (admin pohled: finance, spory, audit a „override = audit“)
- **Tabulka práva a viditelnosti.docx** (referenční pro maskování identity; obsahuje roli investora jako UI uživatele – to je nyní neplatné)
- **Kanonický domain dictionary.docx** (referenční slovník; obsahuje rozpory s novějšími podklady – viz kapitola 11)


#### 0.3 Terminologie a zkratky

V dokumentu se vyskytují některé zkratky – aby nevznikaly nejasnosti, používáme je takto:

- **Uživatelské rozhraní (UI)**: obrazovky a ovládací prvky, které uživatelé vidí a používají.
- **Uživatelský zážitek (UX)**: jak snadno a pochopitelně uživatelé systémem projdou (toky, přehlednost, chybové stavy).
- **Časové lhůty (SLA)**: doby, do kdy se musí stát určitý krok (např. podpis smlouvy). Vždy nastavitelné administrátorem.
- **Ochrana osobních údajů (GDPR)**: povinnosti a souhlasy se zpracováním osobních údajů.
- **Mezinárodní číslo účtu (IBAN)**: formát pro bankovní účet (použijeme, pokud bude výplata probíhat převodem).
- **Poměr dluhu k hodnotě zajištění (LTV)**: ukazatel rizika u zajištěného financování.
- **Minimální první verze (MVP)**: funkční základ, který umožní provoz (zbytek rozšiřujeme postupně).
- **AML/KYC**: procesy proti praní špinavých peněz a ověření klienta. V těchto pravidlech jsou aktuálně **mimo rozsah uživatelského rozhraní** (řeší se mimo platformu), pokud není uvedeno jinak.


---

### 1. Shrnutí pro vedení

#### 1.1 Účel a mise
Tipari.cz je platforma pro **zprostředkování investičních příležitostí mezi firmami** (obchodníci přivádějí investory, developeři přidávají projekty). Klíčovým prvkem je řízený tok rezervace a následného jednání – tak, aby:
- obchodník věděl, co má dělat a kdy
- developer viděl jen relevantní informace ve správný čas
- platforma měla kontrolu nad pravidly, časovými limity a provizemi

#### 1.2 Hodnota pro uživatele (hlavní přínosy)

- **Obchodník (tipař/broker):** vidí atraktivní B2B projekty bez toho, aby platforma odhalila identitu projektu a developera před aktivací rezervace. Může rychle rezervovat slot pro svého investora a mít jasné lhůty, auditní stopu a spravedlivé vypořádání.
- **Developer:** získá přístup k distribuční síti obchodníků, ale identita investora se mu odemkne až po podpisu rezervační smlouvy oběma stranami. Tím je doloženo, že investor byl představen přes platformu.
- **Platforma (administrátor):** správa pravidel a parametrů (časové limity, kapacity rezervací, splatnosti), finanční vypořádání (provize, faktury), audit a řešení sporů. Platforma **neověřuje investory** ani **neschvaluje jednotlivé rezervace** – nastavuje rámec, eviduje průběh a může kdykoliv zasáhnout (override) s auditní stopou.

#### 1.3 Přehled platformy

Základní tok je:
1) developer (nebo obchodník jako „lead“) zadá projekt a tiket k publikaci
2) administrátor projekt/tiket schválí a zveřejní (včetně nastavení kapacit a časů)
3) obchodník vybere investora ze své evidence a vytvoří rezervaci na tiket
4) investor podepíše rezervační smlouvu (elektronicky, nebo fyzicky + scan) ve lhůtě
5) developer podepíše rezervační smlouvu ve lhůtě
6) po podpisu obou stran se rezervace aktivuje a systém v uživatelském rozhraní odemkne identity (důkaz introdukce)
7) od aktivace běží jednání a lhůta na profinancování
8) po reálném profinancování na účet developera vzniká platformě nárok na provizi; po úhradě provize platformě vzniká nárok obchodníků vyfakturovat svůj podíl (platforma vyplácí dle SLA)

---

### 2. Projektový rozsah

#### 2.1 Co je v rozsahu

- Registrace a ověřování obchodníků a developerů (KYC/administrativní schválení účtu).
- Evidence investorů obchodníkem (interní databáze kontaktů). Platforma investory **neschvaluje** ani **neověřuje**.
- Zadání projektu a tiketů developerem.
- Zadání projektu obchodníkem jako „lead“ (návrh projektu do systému), včetně interního stavu „čeká na zasmluvnění developera“.
- Schválení a zveřejnění projektu/tiketů administrátorem (publikační pravidla, kapacity rezervací, časové limity).
- Vyhledávání a párování investorů (matching) na základě preferencí.
- Rezervace tiketu obchodníkem pro konkrétního investora.
- Rezervační smlouvy:
  - elektronický podpis (výchozí),
  - fyzický podpis investora (PDF) + nahrání scanu.
  - fyzický podpis developera (PDF) + nahrání scanu.
- Aktivace rezervace až po podpisu obou stran + odemknutí identit v UI jako právní důkaz introdukce (developer vidí i jméno obchodníka).
- Jednání po aktivaci rezervace (výchozí 30 dní; vše upravitelné/prodlužitelné administrátorem).
- Financování a platby **bez bankovní integrace**:
  - financování potvrzuje **developer** ručním zadáním (datum přijetí na účet),
  - úhradu provize (developer → platforma) a výplaty (platforma → obchodník) eviduje **administrátor** ručně (s auditní stopou a případně přílohami).
- Provizní logika a vypořádání:
  - nárok platformy na provizi vzniká až po reálném profinancování,
  - nárok obchodníka na výplatu vzniká až po úhradě provize platformě,
  - obchodník vystavuje fakturu platformě na základě dat poskytnutých platformou.
- Auditní záznamy, spory/incident management, exporty.
- Bonusový program „Pool“ (pokud aktivní): tvorba poolu z podílu platformy, vyhodnocení za období a výplata.
- Doba zveřejnění projektu/tiketů: po zveřejnění běží publikační okno; po expiraci se tiket skryje a nové rezervace nejsou možné (aktivní rezervace doběhnou).

#### 2.2 Co je mimo rozsah
- investor jako aktivní uživatel platformy (investor nemá přístup do uživatelského rozhraní)
- hypotéky a retailové financování pro fyzické osoby
- přímé půjčky mezi investorem a developerem jako „produkt platformy“


---

### 3. Role a zainteresované strany

#### 3.1 Role uživatelů

- **Administrátor platformy** (interní role): má právo změnit cokoli v systému (globální nastavení, tiket, rezervace, provize, doklady). Provádí manuální kroky (například potvrzení financování a úhrad), řeší spory/incidenty. Každý zásah musí mít důvod a auditní stopu.
- **Obchodník (tipař/broker):** spravuje vlastní profil, eviduje své investory, vytváří rezervace a sleduje jejich průběh. Může stáhnout PDF rezervační smlouvy pro fyzický podpis investora a nahrát podepsaný scan. Vystavuje faktury platformě na svůj podíl provize. Může také zadat projekt do systému ke schválení jako „lead“ (pokud developer ještě není zasmluvněn na platformě).
- **Developer:** spravuje vlastní profil, zakládá projekty a tikety, doplňuje data a dokumenty projektu, podepisuje rezervační smlouvy, komunikuje financování a hradí provizi platformě dle smlouvy.

#### 3.2 Investor

Investor:
- není uživatelský účet,
- nemá přístup do platformy a nevidí „co se na platformě děje“,
- je evidován obchodníkem jako kontakt (osoba / firma) primárně kvůli komunikaci a podpisu rezervační smlouvy.

GDPR a právní minimum (požadavek na data a proces):
- investor musí obdržet informace dle GDPR (informační povinnost) a musí existovat dohledatelný záznam, že mu byly předány a že je potvrdil (typicky součástí rezervační smlouvy a/nebo samostatným dokumentem přiloženým k podpisu),
- platforma uchovává auditní stopu doručení a podpisu (elektronicky i u fyzického podpisu přes nahraný scan).

Poznámka:
- datum narození investora se nesbírá (MVP).

### 4. Klíčové toky

#### 4.1 Registrace a schválení uživatelů

1) Obchodník a developer vyplní registrační formulář.
2) Administrátor provede ověření (administrativní, KYC dle interních pravidel).
3) Po schválení má uživatel přístup do platformy.

Poznámka:
- Ověřování se týká **uživatelů platformy** (obchodník, developer), nikoli investorů evidovaných obchodníkem.

#### 4.2 Evidence investorů obchodníkem (interní databáze)

1) Obchodník vytvoří investora ve své databázi.
2) Vyplní údaje a investiční profil (preferované parametry, velikosti, zajištění, regiony atd.).
3) Platforma investora **neověřuje** a **neschvaluje** – investor je okamžitě použitelný pro rezervace. Administrátor může záznam kdykoliv zablokovat (např. zneužití, GDPR incident) a zablokování má auditní stopu.

#### 4.3 Projekt a tikety (nabídky)

Kanonické pravidlo: projekt (a následně tikety) může do systému vložit **developer** i **obchodník**.

A) Developer zadává projekt a tikety
1) Developer založí projekt, doplní data, dokumenty a založí jeden nebo více tiketů.
2) Odešle projekt/tikety ke schválení.
3) Administrátor schválí a zveřejní (nastaví publikační okno, kapacity rezervací, časové limity, provize).

B) Obchodník zadává projekt jako „lead“
1) Obchodník zadá návrh projektu do systému (základní informace + kontakty na developera).
2) Projekt je ve stavu „čeká na zasmluvnění developera“.
3) Administrátor řeší zasmluvnění mimo platformu. Po zasmluvnění:
   - developer je vyzván k registraci, nebo
   - administrátor projekt přiřadí existujícímu developer účtu.
4) Poté pokračuje standardní schvalovací/publikační tok.

Požadavek na viditelnost:
- obchodník vidí stav svého leadu a průběh schvalování, ale nikdy neuvidí investory jiných obchodníků.

#### 4.4 Investor matching

- Obchodník nastaví investiční profil investora.
- Platforma (matching modul) navrhne vhodné tikety.
- Obchodník rozhodne, zda investora na tiket rezervuje.

#### 4.5 Rezervace a smlouvy

Kanonický tok rezervace (bez schvalování platformou):

1) Obchodník vybere tiket a investora a vytvoří rezervaci.
2) Systém ověří základní podmínky:
   - obchodník má volný slot (limit aktivních rezervací obchodníka),
   - tiket je ve stavu, který dovoluje nové rezervace (typicky **Zveřejněný**),
   - investor je zapsán v interní evidenci obchodníka (platforma investora neověřuje).
   
   Poznámka: **kapacita tiketu se v tomto kroku neblokuje**. O „přednost“ na tiketu rozhoduje až **podpis investora** (viz krok 5).
3) Obchodník zvolí způsob podpisu investora:
   - **Elektronický podpis (výchozí):** systém odešle investorovi výzvu k podpisu.
   - **Fyzický podpis investora:** systém umožní stáhnout PDF rezervační smlouvy; obchodník zajistí podpis investora a nahraje scan do rozpracované rezervace.
4) Investor podepíše (elektronicky) nebo obchodník nahraje scan (fyzický podpis) ve lhůtě **48 hodin** (výchozí; administrátor může měnit i prodlužovat).
5) Okamžikem podpisu investora vzniká **pořadí rezervace na tiketu**:
   - rozhoduje **datum a čas podpisu investora** (u fyzického podpisu datum a čas **nahrání scanu**),
   - systém seřadí všechny „investorem podepsané“ rezervace na tiketu a určí, které jsou **v kapacitě** (výchozí kapacita 3).
   - rezervace **mimo kapacitu** jsou ve stavu „čeká ve frontě“ a systém je automaticky posune, jakmile se uvolní místo.
6) Developer podepisuje (nebo odmítá) pouze rezervace, které jsou **v kapacitě**:
   - **Elektronický podpis (výchozí):** systém odešle výzvu k podpisu oprávněné osobě developera.
   - **Fyzický podpis developera:** developer si stáhne PDF, podepíše mimo platformu a nahraje scan.
   - Lhůta pro podpis developera je **48 hodin** od chvíle, kdy je rezervace „v kapacitě“ (výchozí; administrátor může měnit i prodlužovat).
   - Čas podpisu developera **nemění pořadí** rezervací (pořadí určuje vždy investorův podpis).
7) Pokud developer rezervaci **odmítne** (nebo neproběhne podpis v termínu):
   - rezervace se ukončí jako neúspěšná,
   - systém automaticky posune další rezervaci z fronty do kapacity a vyzve developera k podpisu.
8) Po podpisu obou stran se rezervace **aktivuje**:
   - v uživatelském rozhraní se odemkne identita projektu a developera obchodníkovi,
   - v uživatelském rozhraní se odemkne identita investora developerovi,
   - developerovi se zároveň odemkne i jméno obchodníka (důkaz introdukce přes platformu),
   - vše se auditně loguje.
9) Od aktivace běží lhůta jednání **30 dní** (výchozí; administrátor může měnit i prodlužovat).
10) Ve chvíli, kdy kterákoliv rezervace dosáhne stavu **Financování potvrzeno**:
   - tiket se uzavře (profinancovaný),
   - všechny ostatní rezervace na tiketu automaticky zanikají (včetně těch, kde investor už podepsal),
   - obchodníci i investoři dostanou informaci, že financování bylo realizováno jiným investorem.

#### 4.6 Financování a provize

1) Dojde k reálnému financování (převod prostředků na účet developera). **Částečné financování nepřipouštíme**, ale může dojít k dohodě na jiné (finální) částce než byla původně uvedená na tiketu.
2) Financování do systému potvrzuje **developer** (ruční zadání v jeho účtu), včetně:
   - **data přijetí** prostředků na bankovní účet developera (od tohoto data běží navazující lhůty),
   - **profinancované částky** (skutečně přijaté částky; může se lišit od cílové),
   - volitelných podkladů (např. potvrzení / výpis).
   Administrátor může záznam upravit (override) s auditní stopou.
3) V okamžiku financování vzniká platformě nárok na provizi.
4) Současně platí: **po potvrzení financování jedné rezervace zanikají všechny ostatní rezervace na stejném tiketu** (včetně těch, kde investor už podepsal).
5) Developer uhradí provizi platformě do **14 dnů** (výchozí; administrátor může měnit).
6) Po přijetí platby platformou se provize na tiketu stává „způsobilá k vyfakturování“ pro obchodníky.
7) Obchodník vystaví fakturu platformě na svůj podíl (primárně v Kč; sekundárně se může zobrazit procento).
8) Platforma uhradí fakturu obchodníka do **3 dnů** (výchozí; administrátor může měnit).

### 5. Externí závislosti

- Poskytovatel elektronického podpisu (eSign) pro rezervační smlouvy a GDPR dokumenty.
- E-mail/SMS doručování výzev k podpisu a notifikací.
- Úložiště dokumentů (smlouvy, scany, podklady projektu).
- Bankovní převody probíhají mimo platformu; platforma **není napojená na banku**:
  - **financování potvrzuje developer** ručním zadáním (datum přijetí na účet),
  - **úhrady** (provize developer → platforma, výplaty platforma → obchodníci) **eviduje administrátor** ručně (s auditní stopou).

### 6. Omezení a předpoklady

- Platforma je B2B (investor nemá přístup do aplikace).
- Platforma v MVP není napojená na banky; **financování potvrzuje developer ručně** a **úhrady (provize, výplaty) eviduje administrátor ručně**.
- Časy (podpisy, jednání, splatnosti) musí být nastavitelné administrátorem globálně i pro každý tiket/rezervaci zvlášť.
- Platforma neověřuje investory evidované obchodníkem a neschvaluje jednotlivé rezervace.
- Maskování identity projektu/developera a investora je klíčový právně-obchodní mechanismus; odemknutí identit po podpisu obou stran slouží jako důkaz introdukce.

### 7. Datové entity

Toto je kanonický seznam hlavních entit. Vztahy jsou uvedeny logicky, detailní DB návrh se doplní později.

#### 7.1 Uživatelský účet
- role: administrátor / obchodník / developer

#### 7.2 Profil obchodníka
- navázán na uživatelský účet obchodníka
- obsahuje obchodní úroveň (Partner/Premium/Elite), počet slotů, fakturační údaje

#### 7.3 Profil developera
- navázán na uživatelský účet developera
- obsahuje firemní údaje, bankovní účet pro financování, kontakty

#### 7.4 Investor (záznam obchodníka)
- patří obchodníkovi (není globální)
- obsahuje identifikační a kontaktní údaje + investiční profil

#### 7.5 Projekt
- standardně je vlastníkem developer
- může vzniknout i jako „lead“ vytvořený obchodníkem (před zasmluvněním developera) a po zasmluvnění se přiřadí developerovi

#### 7.6 Tiket (nabídka)
- patří projektu
- obsahuje investiční parametry, kapacity rezervací, časové limity, publikační okno a provizní nastavení

#### 7.7 Rezervace
- patří tiketu a investorovi (záznam obchodníka)
- vzniká vytvořením rezervace obchodníkem
- aktivuje se až po podpisu rezervační smlouvy oběma stranami
- obsahuje metodu podpisu (elektronicky / fyzicky + scan), termíny, auditní stopu a vazbu na provizi

#### 7.8 Provize
- provize platformy vůči developerovi (vzniká až po profinancování)
- rozdělení provize mezi platformu a obchodníky (role 1 / role 2)

#### 7.9 Platby / úhrady
- evidence financování (převod na účet developera) – ruční zadání developerem (administrátor může override)
- evidence úhrady provize developer → platforma – ruční zadání
- evidence výplaty obchodníkům platforma → obchodník – ruční zadání

#### 7.10 Auditní záznam
- loguje klíčové události (stavové změny, podpisy, prodloužení termínů, ruční zásahy, exporty)

#### 7.11 Pool bonus program (volitelné – pokud aktivní)
- akumulace části podílu platformy do poolu (výchozí 10 %)
- periodické vyhodnocení (půlrok) a výplata brokerům dle pravidel
- evidence příspěvků a výplat (audit, reporty)

### 8. Kanonické seznamy povolených hodnot

#### 8.1 Úrovně obchodníka a sloty
Úrovně jsou brandově ukotvené: **Partner, Premium, Elite**.

**Výchozí nastavení (pro obchodní provoz):**
- **Partner:** 10 aktivních rezervací (slotů)
- **Premium:** 25 aktivních rezervací (slotů)
- **Elite:** 50 aktivních rezervací (slotů)

Poznámky:
- slot = kapacita na **současně otevřené (běžící)** rezervace (tj. rezervace v procesu včetně čekání na podpis i aktivních; ne historické)
- počty slotů musí být upravitelné administrátorem
- úrovně nejsou „provizní pool“; jsou to úrovně přístupu a kapacity

#### 8.2 Typy projektů (kanonický seznam)

**Kanonický (business) seznam pro Tipari.cz (B2B)** – používá se ve formulářích, filtrech a statistikách:
- Rezidenční
- Logistika
- Komerční
- Smíšený
- Retail
- Ubytovací zařízení
- Pozemky
- Energetika
- Ostatní

Poznámky k jednotnosti:
- V některých podkladech existuje přísnější „domain dictionary“ se **starším** členěním (např. „Rezidenční development“, „Průmyslový projekt“, „Rekonstrukce“ apod.). Pro snížení chaosu držíme výše uvedený seznam jako **hlavní**.
- Pokud budeme chtít zachovat zpětnou kompatibilitu, doporučuje se přidat **mapování** (interně):
  - „Rezidenční“ → rezidenční development / rekonstrukce (dle tagů)
  - „Komerční“ → komerční development
  - „Smíšený“ → mixed use
  - „Ubytovací zařízení“ → hospitality
  - „Pozemky“ → land development
  - „Ostatní“ → industrial / cokoliv mimo (případně rozdělit později)

> Důležité: typ projektu je „hlavní šuplík“ (asset class). To **co se financuje** (např. výstavba, refinancování, bridge…) řešíme odděleně přes tagy a využití prostředků.


#### 8.3 Doplňková kategorizace projektu (tagy)

Toto je **volitelné tagování** (není to primární typ projektu). Používá se pro filtrování, vysvětlení účelu financování a pro lepší matching.

**Doporučený kanonický seznam tagů (sjednoceno napříč podklady):**
- Nákup nemovitosti (buy & hold)
- Výstavba
- Rekonstrukce
- Refinancování
- Překlenovací financování (bridge)
- Land development (příprava pozemků)
- Brownfield redevelopment
- Projektové financování (SPV)
- Provozní financování
- Prodej projektu (transakce, ne financování) – volitelné

Pravidla:
- Tagy nesmí rozbíjet typ projektu. Jsou doplňkové.
- Tagy mohou být vícenásobné, ale doporučuje se max. 3 na jeden projekt/tiket.
- „Prodej projektu“ je **transakční typ** – pokud ho nechceme v první verzi, vypnout (nezobrazovat v UI).


#### 8.4 Forma financování (kanonické pole na tiketu)

V podkladech se míchají pojmy „forma financování“ a „forma investice“ (instrument). Pro Tipari.cz (MVP) používáme **jedno pole**: **Forma financování**.

- Toto pole se zadává u tiketu.
- Toto pole se zobrazuje **i na kartě tiketu** (v seznamu tiketů) a v detailu tiketu.

**Kanonický seznam (finální):**
- Zápůjčka / úvěr
- Mezaninové financování
- Kapitálový vstup
- Joint Venture (společný podnik)
- Konvertibilní zápůjčka
- Zpětný leasing (sale & leaseback)
- Nabídka projektu (prodej projektu) – volitelné

Poznámky:
- Termín „přímá půjčka“ se v uživatelském rozhraní nepoužívá (brand). Pro běžné dealy používáme „Zápůjčka / úvěr“.
- Pokud budeme později potřebovat detailní rozlišení instrumentu (seniorita, konverze, kapitálový vstup…), doplníme samostatným polem v další verzi nebo to budeme držet jen v právních dokumentech/podmínkách tiketu.

#### 8.5 Ručení a zajištění (sjednocený katalog pro tiket)

Abychom nemíchali pojmy, rozlišujeme:
- **Ručení** = osobní/korporátní závazek třetí osoby (zvyšuje vymahatelnost).
- **Zajištění** = majetkové krytí závazku (zástava, účty, práva).
- **Procesní posílení** = notářská vykonatelnost, escrow apod.

##### 8.5.1 Kanonické typy zajištění (pro výběr v tiketu)
**Majetkové zajištění:**
- Zástavní právo k nemovitosti (1. pořadí) – primární
- Zástavní právo k nemovitosti (2. pořadí)
- Křížová zástava více nemovitostí
- Zástava podílu (SPV / obchodní podíl)
- Postoupení pohledávek
- Escrow / vázaný účet (kontrola cash-flow)
- Hotovostní kolaterál
- Pojištění (doplňkové)
- Jiné zajištění (volný popis)

**Ručení (garance):**
- Bankovní záruka
- Ručení mateřské společnosti (korporátní ručení)
- Osobní ručení

**Procesní posílení vymahatelnosti:**
- Notářský zápis (ideálně s přímou vykonatelností – pokud to právně chceme rozlišovat)

**Doplňkové zajištění (časté v praxi):**
- Směnka / blankosměnka (doporučeno jako doplněk, ne jako jediné zajištění)

##### 8.5.2 Pravidla zadání a kombinací
- Pokud je vybrána „Zástavní právo k nemovitosti“, musí být vždy uvedeno **pořadí** (1./2./jiné).
- „Bez zajištění“ (pokud se vůbec povolí) se **nesmí kombinovat** s jinými typy.
- U zástav se doporučuje uvádět LTV (volitelně/později povinně podle pravidel publikace).

> Poznámka k právní jistotě: v části 11 (nesoulady) držíme „Směnku“ jako bod k potvrzení právní architekturou (zda má být samostatná volba, nebo pouze popis v „Jiné zajištění“).


#### 8.6 Využití prostředků – kanonický procentuální rozpad

Použijeme **procentuální rozpad (součet = 100 %)**. Kategorie (sjednoceno napříč podklady):
- Nákup nemovitosti
- Výstavba
- Rekonstrukce
- Refinancování závazků
- Překlenovací financování
- Projektová rezerva (CAPEX)
- Provozní náklady projektu
- Technická příprava projektu (projekce, studie, povolení)
- Marketing a prodej
- Daňové a transakční náklady
- Splacení společníka / investora
- Kombinované využití

Pravidla:
- Součet musí být 100 % (validace ve formuláři).
- „Kombinované využití“ je povoleno, ale i tak musí být rozpad vysvětlen (alespoň v textu).
- Doporučení: v UI zobrazovat tabulku nebo jednoduchý graf (pro rychlé pochopení).

Povinná právní formulace (copy-ready):
> „Uvedené využití prostředků je plánované a může se v průběhu realizace projektu měnit v závislosti na vývoji projektu.“



#### 8.6.1 Znalecký posudek, ocenění a poměr financování k hodnotě zástavy

- Znalecký posudek / odhad hodnoty zástavy je **volitelný** podklad (příloha u projektu).
- V první verzi systém **neblokuje** zveřejnění tiketu jen proto, že posudek chybí.
- Pokud je u tiketu vybráno zajištění typu „Zástavní právo k nemovitosti“, je doporučeno (ne povinné) evidovat:
  - hodnotu zástavy (dle posudku/odhadu),
  - poměr financování k hodnotě zástavy (informativně pro obchodníka a interně pro matching).

Poznámka:
- Platforma podklady **neověřuje**; slouží jako evidence pro audit a komunikaci.

#### 8.7 Měna
- Koruna česká (CZK)
- Euro (EUR)

#### 8.7.1 Lokalita – kraje (kanonický seznam pro filtry)

- Hlavní město Praha
- Středočeský
- Jihočeský
- Plzeňský
- Karlovarský
- Ústecký
- Liberecký
- Královéhradecký
- Pardubický
- Vysočina
- Jihomoravský
- Olomoucký
- Zlínský
- Moravskoslezský

Doplnění:
- Kromě kraje evidujeme u projektu také **obec / město** (minimálně jako textové pole nebo číselník pro výběr), aby šlo lépe filtrovat a orientovat se.

#### 8.8 Stav účtu
- Čeká na ověření
- Aktivní (ověřen)
- Pozastaven
- Zamítnut
- Zablokován


#### 8.9 Stav investora v evidenci obchodníka
- Nový
- Aktivní
- Neaktivní
- Zablokovaný

#### 8.10 Stav projektu
Výchozí stavový tok:
- Rozpracovaný
- Odeslaný ke schválení
- Schválený
- Zveřejněný
- Uzavřený
- Zamítnutý

#### 8.11 Stav tiketu

- Rozpracovaný
- Odeslaný ke schválení
- Schválený
- Zveřejněný
- Skrytý (ručně skryto administrátorem)
- Expirovaný (uplynulo publikační okno)
- Uzavřený (profinancovaný; referenční / read-only)
- Zamítnutý

#### 8.12 Stav rezervace

- Rozpracovaná
- Čeká na podpis investora
- Podepsáno investorem – čeká ve frontě (mimo kapacitu)
- Podepsáno investorem – v kapacitě (čeká na podpis developera)
- Rezervace aktivní (podepsáno oběma stranami; odemčené identity)
- Jednání probíhá
- Financování potvrzeno (developer zadal datum a částku)
- Ukončeno úspěšně (tiket profinancován)
- Ukončeno neúspěšně (expirace / zrušení / odmítnutí developerem / profinancováno jiným investorem)
- Spor

#### 8.13 Stav provize (sledování a vypořádání)

Aby nevznikal falešný dojem „provize je jistá“ už při rezervaci, rozlišujeme:
- **Záznam provize (tracking)** vzniká při aktivaci rezervace (začíná se sledovat průběh).
- **Nárok platformy** vzniká až po reálném financování na účet developera.

Doporučené stavy provize (sjednoceno s fakturačním krokem):
- Sledovaná (probíhá jednání; zatím bez nároku)
- Nárok platformy vznikl (financováno)
- Čeká na úhradu provize developerem platformě (splatnost; výchozí 14 dnů)
- Po splatnosti
- Uhrazena developerem platformě
- Připravena k vyfakturování obchodníkem (platforma poskytla podklady)
- Čeká na fakturu od obchodníka
- Faktura přijata / schválena
- Vyplacena obchodníkům
- Spor / reklamace

> Poznámka: primární prezentace v UI je vždy v Kč, procento je pouze doplňkový kontrolní údaj.

---

### 10. Business logika (kanonické rozhodnutí)

#### 10.1 Sloty obchodníka, kapacita tiketu a pravidla konkurence

##### Sloty obchodníka (limit obchodníka)

- Sloty definují, kolik **současně rozpracovaných / běžících rezervací** může mít obchodník (napříč všemi tikety).
- Levely obchodníka (dle brandu):
  - **Partner** – 10 slotů
  - **Premium** – 25 slotů (default)
  - **Elite** – 50 slotů (default)

Poznámka: default je 10/25/50 (Partner/Premium/Elite). Administrátor může hodnoty upravovat (globálně i per obchodník).

##### Kapacita tiketu (limit tiketu)

- Kapacita tiketu říká, kolik rezervací může být současně „v kapacitě“.
- **Do kapacity se započítávají rezervace až od podpisu investora** (až do jejich ukončení), typicky:
  - „podepsáno investorem – v kapacitě (čeká na podpis developera)“,
  - „rezervace aktivní“,
  - „jednání probíhá“.
- Rezervace před podpisem investora kapacitu tiketu neblokují.

##### Pravidla konkurence (fronta podle podpisu investora)

- Tiket se **nezamyká** pro jednoho obchodníka. O stejný tiket se mohou ucházet různí obchodníci současně.
- O pořadí rozhoduje **čas podpisu investora** (u fyzického podpisu čas nahrání scanu).
- Systém udržuje pořadí všech investorem podepsaných rezervací a do kapacity pustí vždy **prvních N** (N = kapacita tiketu).
- Pokud některá rezervace v kapacitě odpadne (např. developer odmítne podpis, vyprší lhůty, rezervace je zrušena), systém automaticky posune další rezervaci z pořadí do kapacity.
- **Jakmile dojde k financování jedné rezervace, ostatní rezervace na tiketu automaticky zanikají** (včetně těch ve frontě).

#### 10.2 Aktivace rezervace a odemknutí identity

- Identita projektu a developera je obchodníkovi skryta až do aktivace rezervace.
- Identita investora je developerovi skryta až do aktivace rezervace.
- Aktivace nastává až po podpisu rezervační smlouvy oběma stranami.
- Po aktivaci se v UI odemkne:
  - obchodníkovi: název projektu + jméno developera,
  - developerovi: identita investora,
  - developerovi: jméno obchodníka (důkaz introdukce přes platformu).

#### 10.3 Časové limity a SLA (globálně + per tiket/rezervaci)

Výchozí hodnoty:
- Podpis investora: 48 hodin
- Podpis developera: 48 hodin
- Jednání po aktivaci: 30 dní
- Splatnost provize developer → platforma: 14 dnů
- Výplata obchodníkovi po úhradě platformě: 3 dny

Pravidlo:
- Administrátor může všechny časy měnit a prodlužovat, a to **globálně** i **pro konkrétní tiket/rezervaci**.

#### 10.4 Kdy vzniká nárok na provizi

- Obchodníkovi **nevzniká** nárok na provizi v okamžiku aktivní rezervace.
- Nárok platformy na provizi vzniká až po **reálném profinancování** (převod prostředků na účet developera).
- Nárok obchodníka na výplatu vzniká až po **úhradě provize platformě**.

#### 10.5 Provize v Kč vs v %

Brandové pravidlo:
- Primární vyjádření provize je vždy **v Kč**.
- Pro interní výpočty a audit se může držet i **%**, ale v rozhraní je sekundární.

#### 10.6 Fakturace a výplaty

- Developer hradí provizi platformě dle smlouvy (splatnost výchozí 14 dní).
- Obchodník vystavuje fakturu platformě na základě informací poskytnutých platformou.
- Platforma platí obchodníkovi v SLA (výchozí 3 dny) po úhradě provize od developera.

#### 10.7 Bonusový program „Pool“ (nově)

Cíl:
- Motivovat obchodníky k výkonu a dlouhodobé aktivitě.

Kanonická pravidla (aktuální):

- Platforma odvádí do poolu **10 % ze svého podílu** z provize.
  - Podíly obchodníků se tím **nekrátí** (pool jde čistě na vrub podílu platformy).
- Pool se vyhodnocuje každých **6 měsíců**.

##### 10.7.1 Obrat pro účely poolu

- „Obrat“ = součet **profinancovaných částek** tiketů v daném období.
- Obrat se počítá v **korunách českých**.
  - Pokud je tiket v eurech, administrátor musí mít možnost zadat (nebo potvrdit) kurz použitý pro přepočet.
- Obrat se započítává obchodníkovi, pokud je u tiketu evidovaný jako:
  - **obchodník 1** (přivedl investora),
  - nebo **obchodník 2** (přivedl projekt), pokud je obchodník 2 skutečně obchodník (nikoli developer).
- Pokud je obchodník stejná osoba jako obchodník 1 i obchodník 2, obrat se započítá **jen jednou**.

##### 10.7.2 Dvě mety (férové vyhodnocení)

Výchozí (administrátorsky upravitelné) hodnoty:
- **Meta 1 (kvalifikace pro podílové rozdělení): 100 000 000 Kč**
- **Meta 2 (vítěz bere vše): 200 000 000 Kč**

Pravidla výplaty:
1) Pokud jakýkoli obchodník v období dosáhne **mety 2**, vyhrává **celý pool** (100 %).
   - Vyhrává ten, kdo mety 2 dosáhne **jako první** (podle časové posloupnosti profinancování).
2) Pokud v období **nikdo** nedosáhne mety 2, ale alespoň jeden obchodník dosáhne **mety 1**, pool se rozdělí **podílově**.
   - Výchozí rozdělení pro první tři obchodníky podle obratu: **50 % / 30 % / 20 %**.
   - Pokud se kvalifikuje méně než 3 obchodníci, podíly se přepočítají tak, aby součet byl 100 % (např. 2 obchodníci = 62,5 % / 37,5 %; 1 obchodník = 100 %).
3) Pokud v období **nikdo** nedosáhne mety 1:
   - 50 % poolu zůstává platformě,
   - 50 % poolu se převádí do dalšího období (přičte se k poolu dalšího půlroku).

Tie-break (pro podílové rozdělení i pro vítěze):
- Při shodě obratu rozhoduje dřívější čas dosažení dané mety / dřívější datum profinancování.
- Pokud je shoda i poté, rozhodne administrátor ručně a rozhodnutí se uloží do auditu.

Administrace:
- Administrátor nastavuje: procento do poolu, délku období, metu 1, metu 2, podíly pro top 3 a pravidlo převodu (50/50).
- Výpočet a výplata musí mít auditní stopu a report (kdo vyhrál, proč, z čeho).

#### 10.8 Doba zveřejnění projektu a tiketů

- Každý tiket má **publikační okno 90 dnů** (výchozí).
- Po uplynutí publikačního okna přejde tiket do stavu **Expirovaný**:
  - tiket se skryje z nabídky,
  - nelze zakládat nové rezervace,
  - existující běžící rezervace mohou doběhnout (pokud je administrátor ručně neukončí).
- Stav **Skrytý** nastavuje administrátor ručně (například dočasné stažení z nabídky):
  - tiket není viditelný v nabídce,
  - nelze zakládat nové rezervace,
  - existující rezervace mohou pokračovat (pokud administrátor nerozhodne jinak).
- Stav **Uzavřený (profinancovaný)** vzniká potvrzením financování developerem:
  - tiket zůstává viditelný jako reference,
  - tiket je **deaktivovaný pro další akce**,
  - všechny ostatní rezervace na tiketu zanikají.
- Administrátor může tiket znovu zveřejnit (re-open) ze stavu Skrytý nebo Expirovaný:
  - prodlouží / nastaví nové publikační okno,
  - systém odešle obchodníkům notifikaci, že se tiket znovu otevřel (pokud mají rozpracované rezervace, mohou je dokončit).

#### 10.9 Změny tiketu po zveřejnění (žádost developera)

- Developer nemůže „na přímo“ upravovat tiket, který je již zveřejněný.
- Developer může podat **žádost o úpravu tiketu** (popis změn), kterou posuzuje administrátor.
- Administrátor může:
  - změnu schválit,
  - změnu zamítnout,
  - změnu schválit s úpravou (admin upraví navržené hodnoty).
- Po schválení se změna promítne do tiketu a v uživatelském rozhraní se zobrazí informace, že tiket byl upraven (např. tag „upraveno“ + datum).
- Omezení pro developera: žádost o úpravu nelze podat (nebo nelze změnu aplikovat) v případě, že:
  - na tiketu existují **aktivní rezervace**, nebo
  - na tiketu existují **vygenerované žádosti k podpisu investora** (rezervace už byla odeslána investorovi k podpisu).
- Administrátor má právo na vše (může udělat výjimku), ale každá výjimka musí mít auditní stopu.

### 11. Zjištěné duplicity a nesoulady (a návrh řešení)

#### 11.1 Typy projektů
**Rozpor:**
- „Kanonický domain dictionary“ uvádí 8 typů (včetně „průmyslový“ a „hospitality“)
- „Zadání projektu do systému“ uvádí 9 typů (včetně retail a energetika)
- „Vstupní data o investorovi“ uvádí zkrácený seznam (6 typů)

**Návrh sjednocení (v tomto dokumentu už použito):**
- kanonický seznam = 9 typů podle „Zadání projektu do systému“
- zkrácený seznam u investora je pouze podmnožina
- „Kanonický domain dictionary“ aktualizovat (nebo udržovat mapování)

#### 11.2 Formy financování
**Rozpor:**
- existují minimálně tři různé seznamy forem

**Návrh sjednocení (v tomto dokumentu už použito):**
- kanonický seznam pro zadání tiketu = seznam v kapitole 8.4 (Forma financování)
- detailní parametry instrumentu (seniorita, konverzní poměr, struktura kapitálového vstupu) se řeší v podmínkách tiketu a ve smluvní dokumentaci

#### 11.3 Směnka jako zajištění
**Rozpor:**
- některé podklady obsahují směnku jako explicitní typ zajištění
- kanonický slovník ji neobsahuje

**Návrh:**
- přidat „Směnka“ jako volitelný typ zajištění po právním potvrzení
- do té doby používat „Jiné zajištění“ + volný popis

#### 11.4 Investor jako uživatel
**Rozpor:**
- tabulka práv a viditelnosti počítá s investorem jako přihlášeným uživatelem
- kanonické rozhodnutí: investor přístup nemá

**Návrh:**
- vyřadit investora z matice oprávnění v uživatelském rozhraní
- ponechat investora pouze jako evidovanou entitu a příjemce dokumentů k podpisu

#### 11.5 Datum narození investora
**Rozpor:**
- v podkladech se objevuje datum narození investora
- kanonické rozhodnutí: datum narození se nesbírá

**Návrh:**
- datum narození neimplementovat v první verzi
- pokud bude později vyžadováno, doplnit jako administrátorské pole (s odůvodněním sběru a omezením přístupu)

#### 11.6 Fakturace provizí (kdo fakturuje komu)
**Rozpor:**
- pilotní materiály obsahují variantu, kdy „obchodník vystaví fakturu“ a developer ji přímo hradí (obchodník fakturuje developerovi)
- kanonické obchodní nastavení platformy je ale postavené na tom, že provizi vůči developerovi uplatňuje platforma a následně ji rozděluje obchodníkům

**Kanonické rozhodnutí (aktuální):**
- developer hradí provizi platformě (podle smlouvy platforma ↔ developer)
- obchodník vystavuje fakturu **platformě** na svoji část provize (podle podkladů od platformy)

**Dopad do implementace:**
- v uživatelském rozhraní obchodníka musí existovat krok „vyfakturovat provizi“ + nahrání dokladu
- v administraci musí existovat evidence faktur (číslo, vystavil, komu, částka, splatnost, stav, soubor) + možnost označit jako zaplacené




#### 11.7 Konkurence a rezervace na tiketu

**Nesoulad v podkladech:**
- některé starší verze popisovaly, že se tiket po první aktivaci „zamkne“ pro ostatní obchodníky.

**Kanonické pravidlo (finální):**
- tiket se **nezamyká** na jednoho obchodníka,
- každý tiket má kapacitu (např. 1 / 2 / 3), kolik rezervací může být současně „v kapacitě“,
- **přednost získává ten, kdo dřív zajistí podpis investora** (pořadí se určuje podle data a času podpisu investora; u fyzického podpisu podle času nahrání scanu),
- podpis developera pořadí **neovlivňuje**,
- pokud rezervace v kapacitě odpadne (developer odmítne, vyprší lhůta, zrušení), systém automaticky posune další rezervaci z fronty,
- jakmile jedna rezervace dosáhne financování, ostatní rezervace na tiketu automaticky zanikají.

### 12. Datový slovník (MVP, bez technických kódů)

Tato kapitola převádí „formuláře“ a „entity“ do jednotného **datového slovníku**, aby:
- programátor přesně věděl, jaká data musí existovat a jak se validují,
- návrhář uživatelského rozhraní věděl, co je povinné, co je citlivé a kdo to vidí.

Poznámky:
- Používáme **lidské názvy polí** (bez strojových klíčů).
- „Kdo vidí“ je myšleno pro **uživatelské rozhraní platformy**; dokumenty pro podpis mohou obsahovat více údajů.

#### 12.0 Společné konvence napříč systémem

**Společná pole (doporučení pro všechny entity):**
- Interní identifikátor záznamu (unikátní, generuje systém).
- Datum a čas vytvoření.
- Datum a čas poslední změny.
- Kdo záznam vytvořil / změnil (uživatel nebo administrátor).
- Stav záznamu (pokud entita má stavový tok).
- Auditní stopa (záznam změn stavů, limitů a finančních údajů).

**Práce s částkami a procenty:**
- Částky ukládáme v měně (koruna česká / euro) s přesností na haléře/centy.
- Procenta ukládáme v rozsahu 0–100; pokud jde o rozdělení, součet musí být 100.

**Maskování identity:**
- Identita investora a identita projektu (název projektu a developer) se v uživatelském rozhraní odemykají až po aktivaci rezervace.
- Administrátor vidí vždy vše.

---

#### 12.1 Uživatelský účet

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Interní identifikátor účtu | text (unikátní identifikátor) | ano | systém | administrátor | nemění se |
| Role účtu | výběr: administrátor / obchodník / developer | ano | systém / administrátor | administrátor | zásadní pro oprávnění |
| Přihlašovací e-mail | e-mail | ano | uživatel | administrátor | musí být unikátní |
| Telefon | telefon | doporučeno | uživatel | administrátor | formát včetně předvolby |
| Stav účtu | výběr (viz kapitola 8.8) | ano | administrátor | administrátor | změna stavu = audit |
| Datum registrace | datum a čas | ano | systém | administrátor | |
| Ověřil administrátor | odkaz na administrátora | volitelné | administrátor | administrátor | vyplní se při ověření |
| Datum ověření | datum a čas | volitelné | administrátor | administrátor | |
| Poznámka k ověření | text | volitelné | administrátor | administrátor | interní |

---

#### 12.2 Profil obchodníka

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Typ subjektu | výběr: fyzická osoba / právnická osoba | ano | obchodník | administrátor, obchodník | určuje povinná pole |
| Jméno a příjmení | text | podmíněně | obchodník | administrátor, obchodník | povinné pro fyzickou osobu |
| Název společnosti | text | podmíněně | obchodník | administrátor, obchodník | povinné pro právnickou osobu |
| Identifikační číslo osoby | text | podmíněně | obchodník | administrátor, obchodník | povinné pro právnickou osobu |
| Adresa bydliště / sídla | text | ano | obchodník | administrátor, obchodník | |
| Kontaktní e-mail | e-mail | ano | obchodník | administrátor, obchodník | může být stejný jako přihlašovací |
| Kontaktní telefon | telefon | ano | obchodník | administrátor, obchodník | |
| Region působnosti | vícenásobný výběr (kraje) | ano | obchodník | administrátor, obchodník | používá se pro filtrování a onboarding |
| Specializace | vícenásobný výběr | volitelné | obchodník | administrátor, obchodník | doporučeno pro matching |
| Preferovaný způsob komunikace | výběr | volitelné | obchodník | administrátor, obchodník | |
| Úroveň obchodníka | výběr: Partner / Premium / Elite | ano | administrátor | administrátor, obchodník | navazuje na limit slotů |
| Limit aktivních rezervací (slotů) | číslo (celé) | ano | administrátor | administrátor, obchodník | výchozí dle úrovně |
| Rámcová smlouva s platformou | potvrzení + datum | ano | obchodník | administrátor | může být elektronický podpis |
| Dohoda o mlčenlivosti | potvrzení + datum | ano | obchodník | administrátor | |
| Provizní podmínky | potvrzení + datum | ano | obchodník | administrátor | |
| Etický kodex | potvrzení + datum | ano | obchodník | administrátor | |
| Souhlas se zpracováním osobních údajů | potvrzení + datum | ano | obchodník | administrátor | |

**Doporučená doplnění pro finance (prakticky nutná kvůli výplatám a fakturaci):**
- bankovní účet pro výplatu provizí obchodníkovi (číslo účtu nebo mezinárodní číslo účtu, měna)
- fakturační adresa (pokud se liší od adresy sídla/bydliště)
- daňové identifikační číslo (pokud existuje)
- status plátce daně z přidané hodnoty (ano/ne) – pro správné vystavení dokladu


---

#### 12.3 Profil developera

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Typ subjektu | výběr: právnická osoba / fyzická osoba podnikatel | ano | developer | administrátor, developer | |
| Název společnosti | text | ano | developer | administrátor, developer | |
| Identifikační číslo osoby | text | ano | developer | administrátor, developer | |
| Daňové identifikační číslo | text | volitelné | developer | administrátor, developer | |
| Sídlo společnosti | text | ano | developer | administrátor, developer | |
| Země registrace | text | ano | developer | administrátor, developer | |
| Kontaktní e-mail | e-mail | ano | developer | administrátor, developer | |
| Kontaktní telefon | telefon | ano | developer | administrátor, developer | |
| Oprávněná osoba – jméno | text | ano | developer | administrátor, developer | |
| Oprávněná osoba – funkce | text | ano | developer | administrátor, developer | |
| Oprávněná osoba – e-mail a telefon | e-mail + telefon | ano | developer | administrátor, developer | |
| Zaměření | vícenásobný výběr (typy projektů) | volitelné | developer | administrátor, developer | podporuje párování |
| Regiony působnosti | vícenásobný výběr (kraje) | volitelné | developer | administrátor, developer | |
| Typické financování | výběr | volitelné | developer | administrátor, developer | informativní |
| Stav účtu | výběr (viz kapitola 8.8) | ano | administrátor | administrátor | |
| Rámcová smlouva s platformou | potvrzení + datum | doporučeno | administrátor | administrátor | v některých podkladech admin-only |
| Anti-obcházející ujednání | potvrzení + datum | doporučeno | administrátor | administrátor | v některých podkladech admin-only |

**Doporučená doplnění pro finance (prakticky nutná):**
- výchozí bankovní účet developera pro financování (pokud se nemění tiket od tiketu)

---

#### 12.4 Investor (záznam v evidenci obchodníka)

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Interní identifikátor investora | text (unikátní identifikátor) | ano | systém | administrátor, obchodník | |
| Vlastník záznamu | odkaz na obchodníka | ano | systém | administrátor, obchodník | investor je vždy „pod obchodníkem“ |
| Typ investora | výběr: fyzická osoba / právnická osoba | ano | obchodník | administrátor, obchodník | |
| Jméno a příjmení / název firmy | text | ano | obchodník | administrátor, obchodník | |
| Identifikační číslo osoby | text | podmíněně | obchodník | administrátor, obchodník | pouze pro právnickou osobu |
| Daňová rezidence | text | ano | obchodník | administrátor, obchodník | |
| E-mail | e-mail | doporučeno | obchodník | administrátor, obchodník | pro podpisy a komunikaci |
| Telefon | telefon | doporučeno | obchodník | administrátor, obchodník | |
| Adresa | text | volitelné | obchodník | administrátor, obchodník | |
| Stav záznamu | výběr (viz kapitola 8.9) | ano | obchodník / administrátor | administrátor, obchodník | blokace = audit |
| Minimální investice | číslo | volitelné | obchodník | administrátor, obchodník | pokud je vyplněno, musí být ≤ maximum |
| Maximální investice | číslo | volitelné | obchodník | administrátor, obchodník | |
| Preferovaná měna | výběr: koruna česká / euro | volitelné | obchodník | administrátor, obchodník | |
| Minimální očekávaný výnos ročně | číslo (v procentech) | volitelné | obchodník | administrátor, obchodník | pouze preference investora |
| Maximální délka investice | číslo + jednotka | volitelné | obchodník | administrátor, obchodník | |
| Preferovaný typ výnosu | výběr: fixní / variabilní / individuálně | volitelné | obchodník | administrátor, obchodník | preference investora |
| Preferovaná výplata výnosu | výběr: měsíčně / čtvrtletně / pololetně / ročně / na konci | volitelné | obchodník | administrátor, obchodník | preference investora |
| Preferované typy projektů | vícenásobný výběr (viz kapitola 8.2) | volitelné | obchodník | administrátor, obchodník | |
| Preferované regiony | vícenásobný výběr (kraje) | volitelné | obchodník | administrátor, obchodník | |
| Preferované formy financování | vícenásobný výběr (viz kapitola 8.4) | volitelné | obchodník | administrátor, obchodník | |
| Požadavek na zajištění | výběr: ano / ne / preferováno | volitelné | obchodník | administrátor, obchodník | |
| Preferované typy zajištění | vícenásobný výběr (viz kapitola 8.5.1) | volitelné | obchodník | administrátor, obchodník | |
| Maximální poměr financování k hodnotě zástavy | číslo (v procentech) | volitelné | obchodník | administrátor, obchodník | poměr investice k hodnotě zástavy |
| Interní poznámka obchodníka | text | volitelné | obchodník | pouze obchodník | nikdy nezobrazovat developerovi |
| Prohlášení obchodníka k právnímu důvodu evidence | potvrzení | doporučeno | obchodník | administrátor | obchodník potvrzuje oprávnění evidovat údaje |

Kanonické rozhodnutí pro ochranu osobních údajů:
- Datum narození investora se v první verzi nesbírá.

---

#### 12.5 Projekt

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Název projektu | text | ano | developer | administrátor, developer; obchodník až po aktivaci rezervace | před aktivací maskováno |
| Typ projektu | výběr (viz kapitola 8.2) | ano | developer | administrátor, developer; obchodník (anonymně) | používá se pro filtry |
| Stručný popis | text | ano | developer | administrátor, developer; obchodník (zkráceně) | doporučeno 3–5 vět |
| Lokalita – město | text | ano | developer | administrátor, developer; obchodník (bez adresy) | |
| Lokalita – kraj | výběr (kraje) | ano | developer | administrátor, developer; obchodník | |
| Přesná adresa | text | volitelné | developer | administrátor, developer; obchodník až po aktivaci | citlivé |
| Celkový rozpočet projektu | číslo | volitelné | developer | administrátor, developer | |
| Vlastní kapitál | číslo | volitelné | developer | administrátor, developer | |
| Cizí zdroje – typ | výběr | volitelné | developer | administrátor, developer | |
| Cizí zdroje – výše | číslo | volitelné | developer | administrátor, developer | |
| Stavební stav / povolení | výběr: ano / ne / ve vývoji | volitelné | developer | administrátor, developer | |
| Vlastnický stav | výběr: vlastník / speciální účelová společnost | volitelné | developer | administrátor, developer | |
| Dokumenty projektu | soubory | volitelné | developer | administrátor, developer; obchodník až po aktivaci (dle nastavení) | přístup řízený |
| Stav projektu | výběr (viz kapitola 8.10) | ano | developer / administrátor | administrátor, developer | publikace až po schválení |

---

#### 12.6 Tiket / nabídka

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---:|---|---|---|
| Projekt | reference | ano | systém | všichni (dle maskování) | Parent projekt |
| Dlužník | text | ano | developer | administrátor, developer | |
| Typ tiketu | výběr | ano | developer | všichni (anonymiz.) | Dluhový / Kapitálový |
| Cílová částka financování | number (CZK) | ano | developer | všichni (anonymiz.) | |
| Minimální investice | number (CZK) | ne | developer | všichni (anonymiz.) | |
| Předpokládaný výnos | number (%) | ano | developer | všichni (anonymiz.) | |
| Doba splatnosti | integer (měsíce) | ano | developer | všichni (anonymiz.) | |
| Bankovní účet developera | text | ano | developer | administrátor, developer | Bez bankovní integrace; slouží pro instrukce k převodu |
| Zveřejněno od | datum a čas | ano (při publikaci) | systém / administrátor | všichni | Start zveřejnění |
| Zveřejněno do | datum a čas | volitelné | administrátor | všichni | Konec zveřejnění; po vypršení se nabídka skryje a nelze vytvářet nové rezervace |
| Kapacita rezervací na tiketu (celkem) | integer | ano | administrátor | administrátor, developer | Výchozí 3; **do kapacity se počítají rezervace od podpisu investora** (čeká na podpis developera / aktivní / jednání). Rezervace před podpisem investora kapacitu neblokují. |
| Pravidlo konkurence na tiketu | enum | ano | administrátor | administrátor, developer | Výchozí: „sdílené sloty podle podpisu investora“ – pořadí určuje čas podpisu investora; v kapacitě jsou vždy první N rezervací |
| Čas na podpis investora | duration | ano | administrátor | administrátor | Výchozí 48h |
| Čas na podpis developera | duration | ano | administrátor | administrátor | Výchozí 48h |
| Čas na jednání / financování od aktivace rezervace | duration | ano | administrátor | administrátor | Výchozí 30 dní |
| Splatnost developera pro úhradu provize platformě | duration | ano | administrátor | administrátor | Výchozí 14 dní |
| Splatnost platformy pro výplatu obchodníkovi po přijetí platby | duration | ano | administrátor | administrátor | Výchozí 3 dny |
| Provize platformy (primárně Kč) | number (CZK) | ano | administrátor | administrátor | Dle smlouvy s developerem |
| Provize platformy (sekundárně %) | number (%) | ne | administrátor | administrátor | Informativně |
| Rozdělení provize (platforma / broker1 / broker2) | procenta (sum=100) | ano | administrátor | administrátor | Ručně zadávané podíly; výchozí příklad 50/25/25 |
| Stav tiketu | výběr | ano | systém / administrátor | administrátor, developer | |

#### 12.7 Rezervace

| Pole | Typ | Povinné | Kdo zadává | Kdo vidí | Poznámka |
|---|---|---|---|---|---|
| ID rezervace | string/uuid | ano | systém | všichni (dle práv) | Interní identifikátor. |
| Tiket | FK | ano | obchodník | admin, developer, obchodník | Tiket, na který je rezervace navázána. |
| Investor | FK | ano | obchodník | admin, obchodník | Developer vidí investora až po aktivaci. |
| Obchodník (iniciátor) | FK | ano | systém | admin, obchodník | Developer vidí jméno obchodníka až po aktivaci. |
| Stav rezervace | enum | ano | systém/admin | všichni (dle práv) | Viz 8.12. |
| Metoda podpisu investora | enum | ano | obchodník | admin, obchodník | Elektronicky / fyzicky + scan. |
| Metoda podpisu developera | enum | ano | developer | admin, developer | Elektronicky / fyzicky + scan. |
| Scan podepsané smlouvy (developer) | file/id | volitelně | developer | admin, developer | Povinné pokud metoda = fyzicky + scan. |
| Dokument k podpisu – rezervační smlouva | file/id | ano | systém | admin, obchodník, developer | Generuje se při odeslání k podpisu; obchodník i developer mohou stáhnout PDF pro fyzický podpis. |
| Scan podepsané smlouvy (investor) | file/id | volitelně | obchodník | admin, obchodník | Povinné pokud metoda = fyzicky + scan. |
| Datum a čas podpisu investora | datetime | ano (při podpisu) | systém/obchodník | admin, obchodník; developer po aktivaci | U fyzického podpisu se vyplní při nahrání scanu (neověřuje se obsah; slouží jako evidence). |
| Pořadí rezervace na tiketu (odvozené) | integer | ne | systém | admin, obchodník (jen vlastní rezervace); developer | Pořadí se počítá dle času podpisu investora; **přepočítává se**, pokud některá rezervace zanikne. Používá se pro rozhodnutí, kdo je v kapacitě. |
| V kapacitě tiketu | boolean | ne | systém | admin, developer, obchodník (jen vlastní rezervace) | Ano = rezervace je v top N dle pořadí (N = kapacita tiketu); pouze tyto rezervace čekají na podpis developera. |
| Datum a čas podpisu developera | datetime | ano (při podpisu) | systém | admin, developer; obchodník | |
| Termín podpisu investora (deadline) | datetime | ano | systém/admin | admin, obchodník | Výchozí 48 h; upravitelné a prodlužitelné. |
| Termín podpisu developera (deadline) | datetime | ano | systém/admin | admin, developer | Výchozí 48 h; počítá se od chvíle, kdy je rezervace v kapacitě; upravitelné a prodlužitelné. |
| Termín konce jednání | datetime | ano | systém/admin | admin, developer, obchodník | Výchozí 30 dní od aktivace; prodlužitelné. |
| Datum aktivace | datetime | ano (při aktivaci) | systém | admin, developer, obchodník | V tento okamžik se odemknou identity a běží jednání. |
| Datum financování (přijetí na účet developera) | datetime | volitelně | developer (administrátor může override) | administrátor, developer, obchodník (jen vlastní rezervace) | Ručně potvrzeno developerem; **od tohoto data běží lhůty**. |
| Profinancovaná částka | money | volitelně | developer (administrátor může override) | administrátor, developer, obchodník (jen vlastní rezervace) | Potvrzená částka přijatá na účet developera; slouží jako základ provize. |
| Podklady k financování | file/id | volitelně | developer (administrátor může nahrát) | administrátor | Např. potvrzení / výpis; platforma obsah neověřuje, slouží pro audit. |
| Poznámka / důvod | text | volitelně | admin/obchodník/developer | admin | Např. důvod zrušení, incident. |
| GDPR potvrzení investora | datetime/text | volitelně | systém/obchodník | admin | Evidence, že investor obdržel GDPR informace a potvrdil je (typicky podpisem smlouvy / přílohy). |

#### 12.8 Provize a vypořádání

Provize se skládá ze dvou rovin:
1) **nárok platformy vůči developerovi** (vzniká až po financování),
2) **výplata obchodníkům** (vzniká až po úhradě provize platformě).

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Základ provize (profinancovaná částka) | číslo | ano (pro úspěch) | systém (z rezervace) / administrátor (override) | administrátor | vychází z potvrzení financování developerem |
| Procento provize platformy | číslo (v procentech) | volitelné | administrátor | administrátor | doplňkové |
| Částka provize platformy | číslo (koruna česká) | ano | administrátor | administrátor; developer informativně | primární údaj |
| Datum vzniku nároku | datum a čas | volitelné | systém | administrátor | nastává při „financováno“ |
| Splatnost provize developerem | datum a čas | ano | systém | administrátor | výchozí 14 dnů |
| Datum úhrady provize platformě | datum a čas | volitelné | administrátor | administrátor | po připsání platby |
| Stav provize | výběr (viz kapitola 8.13) | ano | systém | administrátor, obchodník (omezeně) | obchodník nesmí vidět „jistotu“ dříve |
| Rozdělení provize – verze | číslo | ano | systém | administrátor | změna rozdělení = nová verze |
| Typ rozdělení | výběr: výchozí / individuální | volitelné | administrátor | pouze administrátor | pro audit a reporting |
| Důvod rozdělení | text | volitelné | administrátor | pouze administrátor | interní poznámka, nikdy nezobrazovat uživatelům |
| Podíl platformy | procenta | ano | administrátor | administrátor | součet 100 |
| Podíl obchodníka 1 | procenta | ano | administrátor | administrátor | |
| Podíl obchodníka 2 | procenta | ano | administrátor | administrátor | může být 0 |
| Částka pro obchodníka 1 | číslo (koruna česká) | odvozené | systém | administrátor | zaokrouhlení definovat |
| Částka pro obchodníka 2 | číslo (koruna česká) | odvozené | systém | administrátor | |
| Termín výplaty obchodníkům | datum a čas | ano | systém | administrátor | výchozí 3 dny |
| Datum výplaty obchodníkům | datum a čas | volitelné | administrátor | administrátor | |
| Datum poskytnutí podkladů k fakturaci obchodníkům | datum a čas | volitelné | systém | administrátor | po úhradě provize platformě |
| Související faktury | seznam odkazů | volitelné | systém | administrátor | 0 až 1 faktura platformy developerovi + 0 až 2 faktury obchodníků platformě |

**Poznámka k prezentaci:**
- V uživatelském rozhraní zobrazujeme primárně částky v korunách českých.

---

#### 12.9 Doklady a platby (praktická vrstva)

Kanonické nastavení pro provize:
- developer hradí provizi platformě (platforma je příjemce)
- obchodník (tipař/broker) fakturuje platformě svoji část provize (platforma je odběratel)

Doporučení:
- systém eviduje **platební události** (kdo, komu, kdy a kolik zaplatil) i **doklady** (faktury) jako soubory. Je to důležité pro audit, účetnictví a řešení sporů.

##### 12.9.1 Typy faktur v systému
1) Faktura platformy developerovi (pohledávka platformy za provizi)
2) Faktura obchodníka platformě (závazek platformy za vyplacení podílu)

> Poznámka: v pilotních materiálech se objevuje varianta, kde obchodník fakturuje developerovi. Tato varianta se v kanonickém procesu nepoužívá.

##### 12.9.2 Minimální datová pole faktury (společná vrstva)

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Typ faktury | výběr: platforma → developer / obchodník → platforma | ano | systém | administrátor | určuje viditelnost a workflow |
| Vazba na provizi | odkaz | ano | systém | administrátor | faktura je vždy navázaná na provizní záznam |
| Vazba na tiket | odkaz | ano | systém | administrátor | pro dohledatelnost |
| Číslo dokladu | text | ano | vystavitel | administrátor + vystavitel + příjemce | musí být unikátní v rámci vystavitele |
| Vystavil | odkaz na subjekt | ano | systém / vystavitel | administrátor + vystavitel + příjemce | platforma nebo obchodník |
| Komu | odkaz na subjekt | ano | systém / vystavitel | administrátor + vystavitel + příjemce | developer nebo platforma |
| Datum vystavení | datum | ano | vystavitel | administrátor + vystavitel + příjemce | |
| Datum splatnosti | datum | ano | vystavitel (výchozí z podkladů) | administrátor + vystavitel + příjemce | výchozí termíny nastavitelné administrátorem |
| Částka celkem | číslo (koruna česká / euro) | ano | vystavitel | administrátor + vystavitel + příjemce | primárně v korunách českých |
| Rozpad daně z přidané hodnoty | struktura | volitelné | vystavitel | administrátor + vystavitel + příjemce | podle toho, zda je vystavitel plátcem |
| Identifikace platby | text | doporučeno | systém | administrátor + vystavitel + příjemce | například variabilní symbol / reference |
| Stav faktury | výběr | ano | systém / administrátor | administrátor + vystavitel + příjemce | návrh: rozpracovaná / odeslaná / přijata / schválena / uhrazena / po splatnosti / vrácena / sporná |
| Soubor dokladu | soubor | doporučeno | vystavitel | administrátor + vystavitel + příjemce | v první verzi jako nahrání souboru (například PDF) |
| Poznámka administrátora | text | volitelné | administrátor | pouze administrátor | interní |

##### 12.9.3 Vazba na proces (stručně)
- Faktura platformy developerovi: vzniká po financování a slouží jako podklad pro úhradu provize platformě (pokud fakturaci vůči developerovi používáme).
- Faktura obchodníka platformě: vzniká po úhradě provize developerem platformě; platforma poskytne podklady k fakturaci, obchodník vystaví doklad a platforma ho uhradí.

---

#### 12.10 Auditní záznam

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Typ události | výběr | ano | systém | administrátor | např. změna stavu rezervace |
| Dotčená entita | text | ano | systém | administrátor | projekt/tiket/rezervace/… |
| Identifikátor dotčeného záznamu | text | ano | systém | administrátor | |
| Kdo akci provedl | odkaz na uživatele | ano | systém | administrátor | |
| Datum a čas | datum a čas | ano | systém | administrátor | |
| Popis změny | text | volitelné | systém | administrátor | může být automatické |
| Před / po | text (shrnutí) | volitelné | systém | administrátor | bez citlivých osobních údajů |

---

#### 12.11 Spor / incident

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Typ incidentu | výběr | ano | administrátor | administrátor | procesní / finanční / právní / bezpečnostní |
| Závažnost | výběr | ano | administrátor | administrátor | nízká / střední / vysoká / kritická |
| Dotčené záznamy | odkazy | ano | administrátor | administrátor | rezervace, tiket, provize… |
| Popis | text | ano | administrátor | administrátor | |
| Stav řešení | výběr | ano | administrátor | administrátor | otevřeno / v řešení / vyřešeno / uzavřeno |
| Přiděleno | odkaz na administrátora | volitelné | administrátor | administrátor | |
| Výsledek | text | volitelné | administrátor | administrátor | |


#### 12.12 Pool bonus program (datový model)

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Poznámka |
|---|---|---:|---|---|---|
| Aktivní | boolean | ano | administrátor | administrátor | Zapnutí/vypnutí programu |
| Příspěvek do poolu (%) | number (%) | ano | administrátor | administrátor | Výchozí 10 % z podílu platformy |
| Období poolu | datum-od / datum-do | ano | systém | administrátor | Standardně 6 měsíců |
| Stav období | enum | ano | systém | administrátor | Otevřené / uzavřené / vyplacené |
| Zůstatek poolu | Kč | ano | systém | administrátor | Průběžná výše poolu |
| Příspěvek z provize | Kč | ano | systém | administrátor | Vzniká při přijetí úhrady provize developerem platformě |
| Zdrojový tiket / provize | reference | ano | systém | administrátor | Auditní vazba |
| Meta 1 (kvalifikace) | Kč | ano | administrátor | administrátor | Výchozí 100 000 000 Kč |
| Meta 2 (vítěz bere vše) | Kč | ano | administrátor | administrátor | Výchozí 200 000 000 Kč |
| Obrat obchodníka v období | Kč | ano | systém | administrátor | Součet profinancovaných částek (započítává se pro obchodníka 1 i 2; jednou, pokud je to stejná osoba) |
| Výherce mety 2 (kdo a kdy) | struktura | volitelné | systém | administrátor | Vyplněno jen pokud někdo dosáhne mety 2 |
| Výherci období | list(obchodník) | volitelné | systém / administrátor | administrátor | Buď 1 výherce (meta 2), nebo až 3 výherci (meta 1) |
| Rozdělení poolu | procenta | ano | administrátor | administrátor | Výchozí 50/30/20 (přepočet při <3 kvalifikovaných; při meta 2 = 100 %) |
| Převod do dalšího období | Kč | volitelné | systém | administrátor | Výchozí 50 % zůstatku jen pokud nikdo nedosáhne mety 1 |
| Vyplaceno dne | datum | volitelné | administrátor | administrátor | |
| Poznámka / rozhodnutí | text | volitelné | administrátor | administrátor | Pro audit |



---

#### 12.13 Žádost o úpravu tiketu (developer → administrátor)

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Poznámka |
|---|---|---:|---|---|---|
| Tiket | reference | ano | developer | administrátor, developer | na který tiket se změna vztahuje |
| Podal | reference (uživatel) | ano | systém | administrátor | developer účet |
| Datum podání | datum a čas | ano | systém | administrátor, developer | |
| Popis změny | text | ano | developer | administrátor, developer | co chce developer změnit a proč |
| Navržené změny | struktura / text | doporučeno | developer | administrátor | admin může převést do konkrétních polí |
| Stav žádosti | výběr | ano | systém / administrátor | administrátor, developer | návrh: rozpracovaná / odeslaná / schválená / zamítnutá / realizovaná |
| Rozhodl administrátor | reference | volitelné | administrátor | administrátor | |
| Datum rozhodnutí | datum a čas | volitelné | administrátor | administrátor, developer | |
| Poznámka administrátora | text | volitelné | administrátor | administrátor, developer | vysvětlení rozhodnutí |
| Tag „upraveno“ na tiketu | boolean | odvozené | systém | všichni | po realizaci změny se na tiketu zobrazí informace „upraveno“ |

Poznámky:
- Žádost může být blokovaná, pokud na tiketu existují aktivní rezervace nebo vygenerované žádosti k podpisu investora (viz 10.9).
- Administrátor může udělat výjimku (audit).

---

### 15. Pravidla publikace a blokátory dat

#### 15.1 Co blokuje zveřejnění tiketu

Aby šel tiket zveřejnit (a dával smysl pro obchodníka), doporučené minimum:
- investiční částka
- měna
- očekávaný výnos ročně
- doba trvání
- typ projektu a kraj
- forma financování
- informace, zda je investice zajištěná
- pokud je zajištěná: minimálně jeden typ zajištění
- nastavená provize platformy (částka v korunách českých)

Doporučené (neblokuje v první verzi, ale zvyšuje kvalitu):
- poměr financování k hodnotě zástavy
- znalecký posudek nebo zdroj ocenění
- dokumenty projektu

#### 15.2 Co blokuje odeslání rezervace k podpisu investorovi

- Neexistuje volný slot obchodníka (obchodník je na svém limitu otevřených rezervací).
- Tiket není ve stavu **Zveřejněný** (je rozpracovaný, čeká na schválení, je skrytý nebo expirovaný).
- Tiket je **uzavřený (profinancovaný)** nebo administrátorem deaktivovaný pro nové rezervace.
- Investor nemá vyplněný minimální kontakt (e-mail) pro podpis.
- Chybí potvrzení obchodníka, že má právní důvod investora evidovat a kontaktovat.

Poznámka:
- Pokud je na tiketu aktuálně obsazená kapacita rezervací, rezervaci je stále možné odeslat k podpisu. Po podpisu investora se rezervace zařadí do pořadí (fronty) a do kapacity se dostane až uvolněním místa.

#### 15.3 Validace procent „Využití prostředků“

Pokud developer vyplňuje procentuální rozpad využití prostředků:
- součet musí být přesně 100 %,
- každá položka musí být v rozsahu 0–100 %,
- systém má nabízet kontrolu a nápovědu (například upozornění, že součet je 98 %).


---

### 16. Audit a incident management (kanonické minimum)

#### 16.1 Co musí být auditováno

Auditní záznam se musí vytvořit minimálně pro:
- změny stavů účtů (ověření, pozastavení, zablokování)
- publikaci a ukončení tiketu
- změny stavů rezervace
- prodloužení nebo změnu časových limitů (kdo, kdy, proč)
- potvrzení financování developerem (a případný override administrátorem)
- vznik nároku na provizi
- změny rozdělení provize (verzování)
- označení úhrady provize developerem
- nahrání, schválení nebo vrácení faktury obchodníka (doklad pro výplatu)
- výplaty provizí obchodníkům

#### 16.2 Incidenty

Typy incidentů:
- procesní (například spor o to, kdo přivedl projekt)
- finanční (například pozdní úhrada provize, reklamace výplaty)
- právní (například obcházení platformy)
- bezpečnostní (například neoprávněný přístup)

Každý incident musí mít:
- typ, závažnost, popis, stav řešení, zodpovědnou osobu a výsledek.


---

### 17. Administrace a nastavení

#### 17.1 Globální parametry

- Default čas podpisu investora (48 h)
- Default čas podpisu developera (48 h)
- Default čas jednání (30 dní)
- Default splatnost provize developer → platforma (14 dnů)
- Default SLA výplaty obchodníkovi po úhradě platformě (3 dny)
- Default maximální počet aktivních rezervací na tiket (3)
- Default pravidlo konkurence na tiketu: „sdílené sloty podle podpisu investora“
- Default doba zveřejnění tiketu (publikační okno) – 90 dní (upravitelné a prodlužovatelné)

#### 17.2 Per tiket parametry

Administrátor může pro každý tiket nastavit/změnit:
- čas podpisu investora,
- čas podpisu developera,
- čas jednání,
- splatnost provize,
- SLA výplaty,
- kapacitu rezervací a pravidlo konkurence,
- dobu zveřejnění tiketu.

#### 17.3 Práva administrátora

- Administrátor může změnit jakékoli údaje (override).
- Každá změna musí být logována do auditu s důvodem.

#### 17.4 Nastavení Pool programu

Pokud je Pool aktivní, administrátor nastavuje:
- procento z podílu platformy do poolu (výchozí 10 %),
- délku období (výchozí 6 měsíců),
- metu 1 (kvalifikace pro podílové rozdělení) a metu 2 (vítěz bere vše),
- podíly pro podílové rozdělení (výchozí 50/30/20) a pravidlo přepočtu, když se kvalifikuje méně obchodníků,
- pravidlo převodu při 0 kvalifikovaných (výchozí 50 % platforma / 50 % převod do dalšího období),
- pravidla výpočtu obratu (započítání pro obchodníka 1 i 2; jednou, pokud je to stejná osoba) a pravidla přepočtu měn.

### 18. Matching investorů (specifikace bez kódu)

Matching investorů je funkce pro obchodníka: pomáhá mu rychle vybrat, kteří jeho investoři se nejlépe hodí k danému tiketu.

Důležité zásady:
- Matching je **doporučení**, nikoli investiční poradenství.
- Investor nemá účet na platformě, matching je čistě interní nástroj obchodníka (a administrátora).
- Matching musí respektovat maskování identity projektu před aktivací rezervace (obchodník pracuje primárně s parametry pro rozhodnutí).

#### 18.1 Vstupy do matchingu

**Vstupy z tiketu (a projektu):**
- investiční částka a měna
- očekávaný výnos ročně
- doba trvání
- typ projektu a kraj (případně město)
- informace o zajištění (ano/ne) + typy zajištění
- poměr financování k hodnotě zástavy (pokud je vyplněn)
- volitelné tagy (nákup / výstavba / rekonstrukce / refinancování / …)

**Vstupy z investora (záznam v evidenci obchodníka):**
- minimální a maximální investice + preferovaná měna
- minimální očekávaný výnos ročně
- maximální délka investice
- preferované typy projektů
- preferované regiony
- požadavek na zajištění + preferované typy zajištění
- maximální poměr financování k hodnotě zástavy (pokud je vyplněn)

#### 18.2 Pravidla matchingu (MVP)

V první verzi doporučujeme kombinaci:
- **tvrdých filtrů** (pokud nesplní, spadá do „mimo kritéria“),
- **měkkých preferencí** (ovlivňují pořadí a slovní hodnocení).

**Tvrdé filtry (doporučené):**
1) Měna: pokud investor vyžaduje konkrétní měnu, tiket musí být ve stejné měně.
2) Částka: pokud investor má vyplněné minimum/maximum, tiket musí být v rozmezí.
3) Doba: pokud investor má vyplněnou maximální délku investice, tiket nesmí být delší.
4) Region: pokud investor má vyplněné preferované regiony, tiket musí být v jednom z nich.

**Měkké preference (doporučené):**
- očekávaný výnos ročně ≥ minimální očekávaný výnos investora
- shoda typů projektu
- shoda typů zajištění (pokud tiket je zajištěný)
- poměr financování k hodnotě zástavy ≤ limit investora

#### 18.3 Výstupy matchingu

V rozhraní obchodníka doporučujeme tyto výstupy:
- **Seznam investorů** se slovním hodnocením: „Vysoká shoda / Střední shoda / Nízká shoda / Mimo kritéria“.
- U každého investora **důvod shody** (například: „částka v rozsahu, kraj odpovídá, investice zajištěná“).
- Možnost filtrovat investory (například podle minima, regionu, typu projektu).

Poznámka:
- Pokud je investor „Nový“ nebo „Neaktivní“, systém ho v matchingu buď nezobrazuje, nebo zobrazí až po zapnutí filtru.

#### 18.4 Ochrana dat a přístupová práva

- Investor v evidenci je viditelný pouze:
  - vlastníkovi (obchodníkovi),
  - administrátorovi.
- Ostatní obchodníci investory nevidí.

---

### 19. Dokumenty, smlouvy a elektronické podpisy

#### 19.1 Typy dokumentů

- Smlouva developer ↔ platforma (provizní podmínky, splatnosti).
- Smlouva obchodník ↔ platforma (fakturace, výplata provizí, podmínky práce s investorem).
- Rezervační smlouva investor ↔ developer (generovaná systémem).
- GDPR informace a souhlasy pro investora (součást smlouvy nebo samostatný dokument k podpisu).

#### 19.2 Elektronický podpis

- Výchozí varianta pro rezervační smlouvy.
- Odkaz k podpisu se posílá:
  - investorovi e-mailem,
  - developerovi (oprávněné osobě) e-mailem a současně je dostupný i v jeho uživatelském účtu.
- Audit log musí obsahovat: kdo, kdy, jak podepsal.

#### 19.3 Fyzický podpis investora (PDF + scan)

- Obchodník si nechá systémem vygenerovat PDF rezervační smlouvy.
- Investor podepíše fyzicky mimo platformu.
- Obchodník nahraje scan do rozpracované rezervace.
- Nahrání scanu posune rezervaci do fáze „čeká na podpis developera“.
- Platforma obsah scanu neověřuje; scan slouží jako evidence a pro audit.

#### 19.4 Fyzický podpis developera (PDF + scan)

- Developer si stáhne (nebo nechá vygenerovat) PDF rezervační smlouvy.
- Developer podepíše fyzicky mimo platformu.
- Developer nahraje scan do rezervace (alternativně může scan nahrát administrátor).
- Nahrání scanu posune rezervaci do stavu „podepsáno developerem“ (a pokud je podepsáno i investorem, rezervace se aktivuje).
- Platforma obsah scanu neověřuje; scan slouží jako evidence a pro audit.

### 20. Otevřené otázky a rozhodnutí k potvrzení

#### 20.1 Rozhodnutí uzavřená v této verzi

- Pool program: zavedené dvě mety (meta 1 = kvalifikace pro podílové rozdělení; meta 2 = vítěz bere vše), příspěvek do poolu je z podílu platformy (podíly obchodníků se nekrátí).
- Doba zveřejnění tiketů: výchozí publikační okno je 90 dní; administrátor může upravovat a prodlužovat.
- Podpisní toky: umožněn fyzický podpis (PDF + nahrání scanu) jak pro investora, tak i pro developera.

#### 20.2 Otevřené otázky

1) Doklady a audit
- Jaké přílohy budou povinné při ručním potvrzení financování a úhrad (například potvrzení o převodu)?


### 21. Stavové automaty a automatizace

Tato kapitola je praktická pro programátora (implementace stavů, přechodů a časovačů) a zároveň pomáhá návrháři uživatelského rozhraní (kdy se co zobrazuje a kdy je co povoleno).

Důležité principy:
- **Časové parametry** (lhůty podpisů, jednání, splatnosti, doba zveřejnění) jsou nastavitelné administrátorem a mohou být **prodlužovány**.
- Platforma v první verzi **neověřuje** obsah dokumentů ani platby; slouží jako evidence a audit.
- Po **profinancování** tiketu je tiket uzavřen a ostatní rezervace se automaticky ukončí.

#### 21.1 Stavový automat tiketu

##### 21.1.1 Stavy tiketu (kanonický seznam)

| Stav tiketu | Co to znamená | Kdo stav nastavuje | Klíčová pravidla |
|---|---|---|---|
| Rozpracovaný | Tiket vzniká, ale ještě není odeslán ke schválení | developer / obchodník (zadavatel) | Nezobrazuje se ostatním uživatelům (mimo administrátora). |
| Ke schválení | Tiket byl odeslán administrátorovi ke schválení | systém (po odeslání) | Administrátor rozhoduje: schválit / zamítnout / vrátit k doplnění. |
| Schválený (nepublikovaný) | Tiket je schválen, ale ještě nebyl zveřejněn | administrátor | Administrátor nastaví publikační okno a zveřejní. |
| Zveřejněný | Tiket je aktivně v nabídce a lze zahajovat nové rezervace | systém / administrátor | Běží publikační okno (výchozí 90 dní). |
| Skrytý | Tiket je skrytý z nabídky ručně administrátorem | administrátor | Nové rezervace nelze zahajovat; existující mohou běžet dál podle pravidel níže. |
| Expirovaný | Tiket automaticky expiroval po skončení publikačního okna | systém | Nové rezervace nelze zahajovat; existující mohou běžet dál podle pravidel níže. |
| Uzavřený (profinancovaný) | Financování bylo potvrzeno developerem; tiket je uzavřen | systém (trigger z rezervace) / administrátor (override) | Všechny ostatní rezervace se ukončí jako neúspěšné z důvodu „profinancováno jiným investorem“. |
| Zamítnutý | Administrátor zamítl tiket (například nesplňuje požadavky) | administrátor | Tiket se nezobrazí v nabídce. |

##### 21.1.2 Přechody tiketu (zjednodušeně)

- Rozpracovaný → Ke schválení (odeslání ke schválení)
- Ke schválení → Schválený (schválení administrátorem)
- Ke schválení → Zamítnutý (zamítnutí administrátorem)
- Ke schválení → Rozpracovaný (vrácení k doplnění)
- Schválený → Zveřejněný (publikace)
- Zveřejněný → Skrytý (ručně administrátorem)
- Zveřejněný → Expirovaný (automaticky po uplynutí publikačního okna)
- Skrytý / Expirovaný → Zveřejněný (znovuotevření administrátorem)
- Zveřejněný / Skrytý / Expirovaný → Uzavřený (po potvrzení financování u některé rezervace)

Poznámka:
- V praxi administrátor může mít právo stav **přepsat** (override) i mimo standardní tok (vždy s auditním záznamem).

#### 21.2 Stavový automat rezervace

##### 21.2.1 Stavy rezervace (kanonický seznam)

| Stav rezervace | Co to znamená | Jak se do stavu dostane | Viditelnost / dopad |
|---|---|---|---|
| Rozpracovaná | Obchodník připravuje rezervaci pro investora | vytvoření rezervace obchodníkem | Identita investora je interní pro obchodníka; developer nevidí. |
| Čeká na podpis investora | Rezervační smlouva byla odeslána investorovi (nebo se čeká na nahrání scanu) | odeslání k podpisu / generace dokumentu | Běží lhůta podpisu investora (výchozí 48 hodin). |
| Podepsáno investorem (ve frontě) | Investor podepsal, ale rezervace ještě není v kapacitě tiketu | podpis investora v okamžiku, kdy je kapacita obsazená dřívějšími podpisy | Rezervace je ve frontě, čeká na uvolnění kapacity; developer zatím nepodepisuje. |
| V kapacitě tiketu (čeká na podpis developera) | Rezervace je v top N dle času podpisu investora a čeká na podpis developera | automaticky po vstupu do kapacity (po podpisu investora nebo po posunu ve frontě) | Developer může podepsat elektronicky nebo nahrát scan. |
| Aktivní | Podepsal investor i developer; rezervace se aktivovala | podpis developera (a investor už podepsal) | Od tohoto okamžiku se v rozhraní odemkne identita stran a začne běžet jednání (výchozí 30 dní). |
| Financováno | Developer potvrdil přijetí financování na bankovní účet (včetně data) | ruční potvrzení developerem (administrátor může upravit) | Od data financování běží splatnosti a provize. Zároveň se uzavře tiket. |
| Ukončeno neúspěšně | Rezervace skončila bez financování | automaticky (lhůty) nebo ručně (zrušení) nebo uzavření tiketu jiným investorem | Důvod musí být evidován (například nepodepsal investor, nepodepsal developer, neprofinancováno včas, profinancováno jiným investorem). |

##### 21.2.2 Fronta a kapacita rezervací na tiketu

- Každý tiket má **kapacitu rezervací** (například 3). Kapacitu lze nastavit administrátorem (a měnit i během života tiketu).
- Do kapacity se počítají rezervace **od okamžiku podpisu investora**.
- Pořadí ve frontě je určeno **časem podpisu investora**.
- V kapacitě jsou vždy **první N rezervací** (N = kapacita). Pokud některá rezervace zanikne, pořadí se **přepočítá** a další rezervace se posune do kapacity.
- Developer podpisuje jen rezervace, které jsou **v kapacitě**.

Důležité: podpis developera **nemění pořadí**. O pořadí rozhoduje vždy podpis investora.

##### 21.2.3 Ukončení ostatních rezervací po profinancování

Jakmile je u jedné rezervace potvrzeno „Financováno“:
- tiket se uzavře,
- všechny ostatní rezervace (včetně těch, které měly podepsáno investorem) se automaticky nastaví na „Ukončeno neúspěšně“ s důvodem „profinancováno jiným investorem“,
- obchodníci jsou informováni, že financování proběhlo jiným investorem.

#### 21.3 Stavový automat provize a vypořádání

| Stav provize | Co znamená | Vzniká kdy | Kdo mění |
|---|---|---|---|
| Připravena (čeká na financování) | Provizní záznam může existovat, ale nárok ještě nevznikl | volitelně po aktivaci rezervace (pro evidenci) | administrátor |
| Nárok vznikl | Platformě vznikl nárok na provizi vůči developerovi | potvrzení financování developerem | systém / administrátor |
| Fakturováno platformou | Platforma vystavila doklad developerovi (nebo jej eviduje) | po vzniku nároku | administrátor |
| Uhrazena platformě | Developer uhradil provizi platformě (ručně potvrzeno) | po připsání platby | administrátor |
| Podklady pro fakturaci obchodníků poskytnuty | Platforma poskytla obchodníkům podklady pro vystavení faktury platformě | po úhradě platformě | systém |
| Faktury obchodníků přijaty | Obchodníci nahráli své faktury platformě | po poskytnutí podkladů | obchodník |
| Vyplaceno obchodníkům | Platforma vyplatila obchodníkům jejich podíly | po přijetí faktur / dle nastavení | administrátor |

Poznámka:
- Nárok obchodníků nikdy nevzniká v okamžiku „aktivní rezervace“, ale až po **reálném financování** a následně po **úhradě provize platformě**.

#### 21.4 Automatizace a časovače

Níže je seznam automatizovaných kroků, které systém provádí bez ruční akce (neobsahuje texty notifikací, pouze události).

##### 21.4.1 Časové expirace

- **Expirace podpisu investora:** pokud investor nepodepíše do termínu, rezervace přejde do „Ukončeno neúspěšně“ (důvod: nepodepsal investor).
- **Expirace podpisu developera:** pokud developer nepodepíše do termínu (počítáno od okamžiku, kdy se rezervace dostane do kapacity), rezervace přejde do „Ukončeno neúspěšně“ (důvod: nepodepsal developer) a systém posune další rezervaci z fronty do kapacity.
- **Expirace jednání:** pokud neproběhne financování do termínu jednání, rezervace přejde do „Ukončeno neúspěšně“ (důvod: neprofinancováno včas) a systém posune další rezervaci z fronty do kapacity.
- **Expirace tiketu:** po uplynutí publikačního okna systém přepne tiket do stavu „Expirovaný“.

##### 21.4.2 Přepočet pořadí a kapacity

Systém přepočítává pořadí (frontu) a to, kdo je v kapacitě, při těchto událostech:
- podpis investora (nový vstup do fronty),
- ukončení rezervace (jakýkoliv důvod),
- změna kapacity tiketu administrátorem.

Při vstupu rezervace do kapacity systém:
- vytvoří požadavek na podpis developera,
- nastaví termín podpisu developera dle nastavení tiketu,
- odešle notifikaci developerovi (a informativně obchodníkovi).

##### 21.4.3 Přechody po financování

- po potvrzení „Financováno“ systém uzavře tiket a ukončí ostatní rezervace,
- vytvoří / aktualizuje provizní záznam (včetně splatností),
- spustí následné lhůty (splatnost developer → platforma, následně výplata obchodníkům).

##### 21.4.4 Bonusový program Pool

Automatizace pro Pool program:
- při každé úhradě provize platformě systém vypočte příspěvek do Poolu (podíl z podílu platformy) a přičte jej do Poolu aktuálního pololetí,
- na konci pololetí systém připraví pořadí obchodníků dle obratu (součet profinancovaných částek) a určí výplatu:
  - pokud první obchodník dosáhl meta 2 (například 200 milionů korun), získá celý Pool,
  - jinak se Pool rozdělí mezi první tři obchodníky, kteří splnili meta 1 (například 100 milionů korun) podle poměru 50/30/20,
  - pokud meta 1 nesplní nikdo, polovina Poolu zůstane platformě a polovina se převede do dalšího pololetí.

Poznámka:
- Částky (mety) a pravidla musí být konfigurovatelné administrátorem (minimálně jako globální parametry).

---

### Příloha A: Doporučení pro udržování dokumentace (inspirace z veřejných zdrojů)

Aby dokumentace nezastarala a šla dlouhodobě udržovat, doporučujeme:
- držet „jeden kanonický soubor“ pro data a pravidla (tento dokument),
- mít datový slovník jako hlavní zdroj pravdy (entita → pole → validace → viditelnost),
- udržovat stavové toky a notifikace jako samostatné tabulky,
- každou změnu pravidel verzovat a držet audit.



---

### Příloha D: Právní rámec a minimalizace rizik

Tato příloha není právní dokument, ale shrnuje principy, které mají dopad na data a procesy.

#### D.1 Základní principy

- Platforma neposkytuje investiční doporučení.
- Platforma není stranou investiční dohody mezi investorem a developerem.
- Platforma eviduje introdukci a řídí rezervaci tak, aby byla dohledatelná a aby šlo spravedlivě vypořádat provize.

#### D.2 Doporučené smluvní vztahy (aktuální kanonické nastavení)

- Developer ↔ Platforma: smlouva o využití platformy + provizní podmínky (platforma má nárok na provizi).
- Obchodník ↔ Platforma: smlouva o využití platformy + podmínky výplaty provize (obchodník vystavuje fakturu platformě).
- Investor ↔ Developer: rezervační smlouva + následná investiční dokumentace.

Poznámka k podkladům:
- v některých materiálech se objevuje varianta, kde provizní smlouva běží přímo mezi obchodníkem a developerem. To je v rozporu s kanonickým procesem fakturace „obchodník → platforma“ a je potřeba to držet jako historickou variantu.

#### D.3 Ochrana proti obcházení

Doporučení do smluv a podmínek:
- uznání auditních záznamů platformy jako důkazu introdukce,
- zákaz obcházení po definovanou dobu,
- sankční ustanovení,
- povinnost součinnosti při sporu.

#### D.4 Ochrana osobních údajů

- Investor není uživatelský účet.
- Držíme minimalizaci osobních údajů (pouze to, co je nezbytné pro komunikaci a podpisy).
- Datum narození investora se v první verzi nesbírá.
- Investor musí obdržet GDPR informace (informační povinnost) a musí existovat auditní záznam potvrzení (typicky podpisem rezervační smlouvy a/nebo samostatného dokumentu).
- Identita investora se developerovi odemkne až po podpisu obou stran (minimalizace rizika obcházení a důkaz introdukce).




### Příloha E: Nesrovnalosti v podkladech a naše kanonické rozhodnutí

Níže jsou klíčové rozdíly mezi různými podklady a tím, co je v tomto dokumentu považováno za aktuální.

1) Investor jako uživatel platformy
- některé podklady počítají s tím, že investor vidí projekt a podepisuje v rozhraní,
- kanonické rozhodnutí: investor nemá přístup do rozhraní; podpis probíhá mimo jeho účet.

2) Kdy je rezervace aktivní
- některé podklady uvádí aktivaci po podpisu investora,
- kanonické rozhodnutí: aktivace až po podpisu investora i developera (48 hodin + 48 hodin; vše upravitelné administrátorem).

3) Komu se vystavují faktury
- kanonické rozhodnutí: obchodník vystavuje fakturu platformě na základě dat poskytnutých platformou.

4) Typy projektů
- starší doménový slovník používá jiné kategorie (například „rekonstrukce“, „průmysl“),
- kanonické rozhodnutí: typ projektu je asset třída: Rezidenční, Logistika, Komerční, Smíšený, Retail, Ubytovací zařízení, Pozemky, Energetika, Ostatní.

Doporučené mapování (pro migraci):
- „Rezidenční development“ → typ: Rezidenční + tag: výstavba
- „Komerční development“ → typ: Komerční (nebo Retail dle obsahu) + tag: výstavba
- „Logistický / průmyslový development“ → typ: Logistika (nebo Komerční) + tag: výstavba
- „Rekonstrukce / brownfield“ → typ: dle assetu + tag: rekonstrukce

5) Využití prostředků
- některé podklady mají jiné členění,
- kanonické rozhodnutí: používáme procentuální rozpad do 12 kategorií z dokumentu „Využití prostředků“.

6) Formy financování
- existují různé seznamy,
- kanonické rozhodnutí: používáme seznam forem financování z dokumentu „Formy financování vs zajištění“.

### Příloha F: Témata pro další doplnění (aby byl systém plně předatelný)

- Finální texty notifikací (e-mail i v aplikaci) včetně právních upozornění.
- Finální rozhodnutí k DPH u faktur (platforma ↔ developer, obchodník ↔ platforma).
- Zaokrouhlování a práce s haléři (interní přesnost vs zobrazování).
- Detailní seznam auditních událostí (co se loguje) včetně exportů.
- Detailní specifikace výpočtu obratu pro Pool a přesné parametry kvalifikace.
- Pravidla expirace a re-publikace tiketů (publikační okno).


---

### Příloha H: Doporučené pokračování práce (priorita pro předání týmu)

Tento dokument už obsahuje:
- kanonická data, entity, stavy a klíčová pravidla,
- základní matice viditelnosti a oprávnění,
- první verzi specifikace uživatelského rozhraní (příloha G).

Aby z toho programátor i návrhář uživatelského rozhraní mohli **bez dohadů** stavět, doporučuji pokračovat v tomto pořadí:

#### H.1 Finalizace registrů vstupních polí formulářů (nejvyšší priorita)

Cíl:
- uzamknout „co se kde vyplňuje“, v jakém pořadí, co je povinné/volitelné,
- sjednotit validace, názvosloví a nápovědy,
- přímo tím odvodit databázová pole + komponenty ve formulářích.

Výstup (pro každý formulář):
- tabulka polí: **název pole, typ, povinnost, validace, příklad, nápověda, kdo vidí, v jakých stavech**,
- definice defaultů a odvozených hodnot (např. pozice ve frontě, stav „v kapacitě“).

Formuláře k doplnění (minimálně):
1) Registrace obchodníka
2) Registrace developera
3) Evidence investora obchodníkem (interní databáze)
4) Zadání projektu (developer i broker jako „lead“)
5) Zadání tiketu (developer)
6) Vytvoření rezervace (včetně volby podpisu a nahrání scanu)
7) Potvrzení financování developerem (datum + částka + podklady)
8) Fakturace obchodníka platformě (nahrání faktury + metadata)
9) Administrátorské nastavení parametrů (lhůty, kapacita, provize, pool)

> Doporučení k procesu: nejdřív uzamknout registrace (obchodník + developer) a rezervace, protože na tom stojí celé workflow.

#### H.2 UX/UI „dotažení do stavů“ (vysoká priorita)

Cíl:
- aby návrhář uživatelského rozhraní nemusel domýšlet hraniční stavy a programátor nemusel „vymýšlet UX“.

Konkrétně doplnit pro klíčové obrazovky (příloha G):
- prázdné stavy (např. žádní investoři, žádné rezervace, žádné tikety),
- chybové stavy (např. expirovaný tiket, plná kapacita, propadnutí lhůty, kolize pořadí),
- potvrzovací dialogy u citlivých akcí,
- standardní texty štítků (stavů) a vysvětlivek („co to znamená“),
- přesné podmínky zobrazení tlačítek podle stavu a role.

Nejprve řešit:
1) Katalog tiketů + karta tiketu + filtry
2) Detail tiketu
3) Wizard rezervace
4) Detail rezervace (včetně fronty a odpočtů)
5) Potvrzení financování developerem
6) Admin: schvalování projektů/tiketů + zásahy do lhůt/kapacity

#### H.3 Knihovna notifikací a „mikrotextů“ (střední priorita)

Cíl:
- snížit chybovost v procesech a vyřešit právní komunikaci (hlavně investor).

Výstup:
- pro každou událost: příjemce, kanál (e-mail / aplikace), předmět, text, proměnné,
- jednotná terminologie (projekt/tiket/rezervace/aktivace/financování),
- jasné texty o lhůtách, expiraci a důsledcích.



##### H.3.1 Konvence proměnných v textech

Aby šly texty snadno napojit na data, používáme **hranaté závorky**:
- `[Název projektu]`, `[Název developera]`, `[Jméno obchodníka]`, `[Jméno investora]` (zobrazovat jen tam, kde je to dle pravidel viditelnosti dovoleno)
- `[Číslo projektu]`, `[Číslo tiketu]`, `[Číslo rezervace]`
- `[Částka financování]`, `[Měna]`, `[Provize obchodníka]`, `[Provize platformy]`, `[Splatnost]`
- `[Odkaz na podpis]`, `[Odkaz na tiket]`, `[Odkaz na rezervační smlouvu]`, `[Odkaz na podporu]`

Doporučení:
- V uživatelském rozhraní používat spíše „**Tiket [Číslo tiketu]**“ než interní identifikátory.
- V e-mailu může být uvedeno i „**Číslo rezervace**“ kvůli dohledatelnosti.

##### H.3.2 Notifikace k tiketům

**1) Nový tiket zveřejněn (obchodníci)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník
- Předmět e-mailu: `Nový tiket k financování: [Název projektu] ([Číslo tiketu])`
- Text e-mailu:
  - `Na platformě byl zveřejněn nový tiket.`
  - `Projekt: [Název projektu] • Lokalita: [Město], [Kraj] • Forma financování: [Forma financování] • Požadovaná částka: [Částka financování] [Měna]`
  - `Detail tiketu: [Odkaz na tiket]`
- Text v aplikaci: `Nový tiket: [Název projektu] – [Částka financování] [Měna]` (tlačítko: `Zobrazit`)

**2) Tiket upraven (obchodníci s rozpracovanou / aktivní rezervací)**
- Kanál: notifikace v aplikaci (+ e-mail, pokud jde o podstatnou změnu)
- Příjemce: obchodník, který má k tiketu rozpracovanou rezervaci / aktivní rezervaci
- Text v aplikaci: `Tiket [Číslo tiketu] byl upraven. Zkontrolujte prosím detail.` (tlačítko: `Zobrazit změny`)
- Poznámka: Pokud tiket nelze upravit kvůli rezervacím, tato notifikace se nepoužije (změny se neprovedou).

**3) Tiket znovu otevřen (obchodníci s rozpracovanou rezervací)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník (kteří mají rozpracovanou rezervaci k tomuto tiketu)
- Předmět e-mailu: `Tiket [Číslo tiketu] byl znovu otevřen – můžete dokončit rezervaci`
- Text e-mailu:
  - `Tiket byl znovu otevřen administrátorem.`
  - `Pokud máte rozpracovanou rezervaci, můžete pokračovat v procesu.`
  - `Odkaz: [Odkaz na tiket]`
- Text v aplikaci: `Tiket [Číslo tiketu] znovu otevřen. Dokončete rezervaci.` (tlačítko: `Pokračovat`)

**4) Tiket expiroval (publikační okno skončilo)**
- Kanál: notifikace v aplikaci
- Příjemce: obchodník, developer
- Text v aplikaci (obchodník): `Tiket [Číslo tiketu] expiroval. Rezervace již nelze vytvářet.`
- Text v aplikaci (developer): `Tiket [Číslo tiketu] expiroval. Pokud chcete pokračovat, požádejte o znovuotevření.`

##### H.3.3 Notifikace k rezervacím a podpisům

**5) Výzva k podpisu rezervační smlouvy (investor)**
- Kanál: e-mail
- Příjemce: investor
- Předmět e-mailu: `Prosíme o podpis rezervační smlouvy – [Název projektu] ([Číslo tiketu])`
- Text e-mailu:
  - `Dobrý den,`
  - `obdrželi jste rezervační smlouvu k projektu [Název projektu] (tiket [Číslo tiketu]).`
  - `Pro pokračování prosíme o podpis nejpozději do [Splatnost podpisu investora].`
  - `Podpis: [Odkaz na podpis]`
  - `V případě dotazů kontaktujte: [Jméno obchodníka] ([Kontakt obchodníka])`
  - `Podpora platformy: [Odkaz na podporu]`
- Poznámka: Součástí procesu je předání informací o zpracování osobních údajů (odkaz / příloha dle právních podkladů).

**6) Investor podepsal rezervační smlouvu (obchodník)**
- Kanál: notifikace v aplikaci + e-mail
- Příjemce: obchodník
- Předmět e-mailu: `Investor podepsal rezervační smlouvu – rezervace [Číslo rezervace]`
- Text e-mailu:
  - `Investor podepsal rezervační smlouvu k tiketu [Číslo tiketu].`
  - `Další krok: čekáme na podpis developera (lhůta do [Splatnost podpisu developera]).`
- Text v aplikaci: `Investor podepsal rezervaci [Číslo rezervace]. Čekáme na podpis developera.`

**7) Výzva k podpisu rezervační smlouvy (developer)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: developer
- Předmět e-mailu: `Nová rezervace k podpisu – tiket [Číslo tiketu]`
- Text e-mailu:
  - `Máte novou rezervaci k podpisu (rezervace [Číslo rezervace]).`
  - `Prosíme o podpis do [Splatnost podpisu developera].`
  - `Podpis: [Odkaz na podpis]`
- Text v aplikaci: `Nová rezervace k podpisu – [Číslo rezervace].` (tlačítko: `Podepsat`)

**8) Rezervace aktivována (podpis obou stran dokončen)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník, developer (+ investor e-mailem)
- Předmět e-mailu (obchodník): `Rezervace aktivní – odhalené strany, tiket [Číslo tiketu]`
- Text e-mailu (obchodník):
  - `Rezervace je aktivní (rezervace [Číslo rezervace]).`
  - `Od této chvíle je v platformě odhalena identita stran a běží lhůta na jednání do [Konec jednání].`
  - `Developer: [Název developera] • Projekt: [Název projektu]`
- Předmět e-mailu (developer): `Rezervace aktivní – tiket [Číslo tiketu]`
- Text e-mailu (developer):
  - `Rezervace je aktivní. V detailu rezervace nyní vidíte investora a obchodníka.`
  - `Konec jednání: [Konec jednání]`
- Text e-mailu (investor):
  - `Rezervace byla aktivována podpisem obou stran. Nyní probíhá jednání s developerem.`
  - `V případě dotazů kontaktujte svého obchodníka: [Jméno obchodníka] ([Kontakt obchodníka])`
- Text v aplikaci: `Rezervace [Číslo rezervace] je aktivní. Začalo jednání.`

**9) Developer odmítl rezervaci**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník (+ investor e-mailem)
- Předmět e-mailu: `Developer odmítl rezervaci – rezervace [Číslo rezervace]`
- Text e-mailu:
  - `Developer odmítl rezervaci k tiketu [Číslo tiketu].`
  - `Důvod (pokud uveden): [Důvod odmítnutí]`
  - `Pokud je k dispozici další kapacita, můžete vytvořit novou rezervaci.`
- Text v aplikaci: `Rezervace [Číslo rezervace] byla odmítnuta developerem.`

**10) Rezervace expirovala (neproběhl podpis investora včas)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník (+ investor e-mailem)
- Text v aplikaci: `Rezervace [Číslo rezervace] expirovala – investor nepodepsal včas.`

**11) Rezervace expirovala (neproběhl podpis developera včas)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník, developer (+ investor e-mailem)
- Text v aplikaci: `Rezervace [Číslo rezervace] expirovala – developer nepodepsal včas.`

##### H.3.4 Notifikace k financování a uzavření tiketu

**12) Financování potvrzeno developerem**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník (rezervace vítěz), administrátor
- Předmět e-mailu: `Financování potvrzeno – tiket [Číslo tiketu]`
- Text e-mailu:
  - `Developer potvrdil přijetí financování na bankovní účet.`
  - `Datum financování: [Datum financování]`
  - `Skutečná částka: [Skutečná částka financování] [Měna]`
- Text v aplikaci: `Financování potvrzeno – tiket [Číslo tiketu].`

**13) Tiket uzavřen (financování proběhlo jiným investorem)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodníci/investoři, kteří měli rozpracovanou nebo aktivní rezervaci, ale nevyhráli
- Předmět e-mailu: `Tiket [Číslo tiketu] byl financován – vaše rezervace byla ukončena`
- Text e-mailu:
  - `Tiket byl financován jiným investorem. Vaše rezervace byla ukončena.`
  - `Pokud potřebujete další informace, kontaktujte podporu: [Odkaz na podporu]`
- Text v aplikaci: `Tiket [Číslo tiketu] byl financován jiným investorem. Rezervace ukončena.`

##### H.3.5 Notifikace k provizím a fakturaci

**14) Vznikl nárok na provizi platformě (developer)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: developer
- Předmět e-mailu: `Vznikl nárok na provizi platformě – tiket [Číslo tiketu]`
- Text e-mailu:
  - `Na základě potvrzeného financování vznikl nárok na provizi platformě.`
  - `Částka k úhradě: [Provize platformy] Kč`
  - `Splatnost: [Splatnost]`
  - `Platební údaje: [Platební údaje platformy]`
- Text v aplikaci: `Provize k úhradě: [Provize platformy] Kč (splatnost [Splatnost]).`

**15) Podklady k fakturaci pro obchodníka připraveny**
- Kanál: notifikace v aplikaci + e-mail
- Příjemce: obchodník (s nárokem na provizi)
- Předmět e-mailu: `Podklady k fakturaci – tiket [Číslo tiketu]`
- Text e-mailu:
  - `Na základě úhrady provize platformě jsou připraveny podklady k vystavení faktury.`
  - `Vaše provize: [Provize obchodníka] Kč`
  - `Vystavení faktury provedete v platformě v sekci Provize.`
- Text v aplikaci: `Můžete vystavit fakturu – tiket [Číslo tiketu] (provize [Provize obchodníka] Kč).`

**16) Obchodník nahrál fakturu (administrátor)**
- Kanál: notifikace v aplikaci
- Příjemce: administrátor
- Text v aplikaci: `Nahrána faktura obchodníka – zkontrolujte a schvalte.`

**17) Faktura obchodníka schválena / zamítnuta**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník
- Text v aplikaci (schváleno): `Faktura schválena. Proplacení nejpozději do [Splatnost].`
- Text v aplikaci (zamítnuto): `Faktura zamítnuta. Důvod: [Důvod].`

**18) Faktura proplacena (obchodník)**
- Kanál: e-mail + notifikace v aplikaci
- Příjemce: obchodník
- Text v aplikaci: `Faktura proplacena dne [Datum proplacení].`

##### H.3.6 Mikrotexty v aplikaci (krátké texty na obrazovkách)

**Tiket – karta v přehledu**
- `Forma financování: [Forma financování]` (povinně zobrazit)
- `Volná kapacita rezervací: [Volné]/[Kapacita]`
- `Publikační okno do: [Datum]` (jen pokud je relevantní pro rozhodnutí)

**Rezervace – status**
- `Čeká na podpis investora` / `Čeká na podpis developera` / `Rezervace aktivní` / `Rezervace ukončena`


#### H.4 Fakturační a daňová pravidla (střední priorita)

Cíl:
- aby se platforma dala provozovat bez chaosu ve fakturaci.

Doplnit:
- jak se evidují faktury (pole, stavy, schvalování),
- co se děje při reklamaci/sporu,
- jak pracovat se zaokrouhlováním,
- rozhodnutí k dani z přidané hodnoty (platforma ↔ developer, obchodník ↔ platforma) a co se zobrazuje v UI.

#### H.5 Bonusový program Pool (střední priorita)

V dokumentu už je logika met a výplaty. Zbývá doplnit:
- přesný výpočet obratu (a edge cases),
- pravidla u měn a kurzu,
- co když dojde k ruční úpravě profinancované částky,
- auditní report (z čeho se obrat skládá).

#### H.6 Integrace a automatizace (nižší priorita, ale nutné pro běh)

Doplnit:
- jaké integrace jsou potřeba (elektronický podpis, e-mail/SMS, úložiště dokumentů),
- cron úlohy: expirace, připomínky, posuny ve frontě, vyhodnocení Poolu.

---

#### H.7 Co navrhuji dělat jako další konkrétní krok

Navrhuji pokračovat bodem **H.1 (registry vstupních polí formulářů)** – začneme:
1) Registrace obchodníka
2) Registrace developera
3) Evidence investora obchodníkem

Důvod:
- je to největší „základní kámen“ pro databázi i uživatelské rozhraní,
- na těchto formulářích stojí celý proces rezervací a pozdější finance.


---

## UX část

### 14. Notifikace (MVP)

#### 14.1 Události pro notifikace

- Registrace dokončena → administrátorovi (čeká na schválení)
- Účet schválen / zamítnut → uživateli

- Projekt/tiket odeslán ke schválení → administrátorovi
- Projekt/tiket schválen / zamítnut → developerovi (případně obchodníkovi u leadu)
- Tiket expiroval (konec doby zveřejnění) → developerovi + administrátorovi

- Rezervace vytvořena a odeslána investorovi k podpisu → obchodníkovi (potvrzení)
- Výzva k podpisu investorovi → investorovi (e-mail)
- Investor podepsal / byl nahrán scan → developerovi (výzva k podpisu)
- Developer podepsal → obchodníkovi + administrátorovi
- Rezervace aktivní (podepsáno oběma stranami, identity odemknuty) → obchodníkovi + developerovi
- Blíží se deadline (podpis / jednání) → relevantním stranám + administrátorovi
- Rezervace expirovala / zrušena → obchodníkovi + developerovi + administrátorovi

- Financování potvrzeno developerem (datum přijetí na účet) → administrátorovi + obchodníkovi
- Přijata úhrada provize developer → platforma (ruční zadání) → obchodníkovi (může fakturovat)
- Faktura obchodníka přijata / schválena k úhradě → administrátorovi
- Faktura obchodníka uhrazena → obchodníkovi

#### 14.2 Šablony zpráv (poznámky)

- Texty musí být neutrální, bez marketingových frází.
- U podpisů musí být jasné termíny a následky expirace.
- U investora je nutné připojit GDPR informace a kontakty na správce údajů.

### Příloha G: UX a uživatelské rozhraní – detailní specifikace (MVP)

> Tato příloha překládá kanonická data, stavy a pravidla do požadavků na uživatelské rozhraní.
> Nejde o grafický návrh, ale o to, **jaké obrazovky mají existovat, jaká data mají sbírat a zobrazovat a jak se mají chovat**.

#### G.0 Cíl a rozsah

Cíl:
- dát návrháři uživatelského rozhraní a programátorovi **společnou mapu obrazovek, komponent a datových bloků**
- zajistit, aby uživatelské rozhraní bylo v souladu s procesy (projekty → tikety → rezervace → financování → provize)
- vyjasnit, kde se co **zobrazuje / nezobrazuje** (maskování identit, práva, pořadí rezervací)

Rozsah (MVP):
- obrazovky a komponenty pro role **obchodník (broker)**, **developer**, **administrátor**
- průchod klíčovými workflow (rezervace, podpisy, aktivace, jednání, financování, provize, fakturace, Pool)
- minimální standardy použitelnosti, srozumitelnosti a auditovatelnosti

Mimo rozsah (zatím):
- finální texty všech notifikací (jen místa + smysl)
- finální grafický styl, rozvržení a pixel-perfect návrhy

---

### G.1 Zásady uživatelské zkušenosti

#### G.1.1 „Data rozhodují, text vysvětluje“
- Primární je **číslo a status** (např. odměna v Kč, výnos, LTV, zbývající čas, kapacita rezervací).
- Text má sloužit jako stručné vysvětlení „co to znamená“ a „co mám udělat dál“.

#### G.1.2 Jedna terminologie napříč celou platformou
Používat konzistentně (bez synonym):
- **Projekt** (celé zadání od developera)
- **Tiket** (konkrétní nabídka k financování v rámci projektu)
- **Rezervace** (proces vedoucí k aktivnímu stavu po podpisu obou stran)
- **Rezervační smlouva** (dokument, který podepisuje investor a developer)
- **Aktivní rezervace** (stav po podpisu investorem i developerem)
- **Jednání** (časové okno po aktivaci rezervace, default 30 dní)
- **Financování** (reálné přijetí peněz investora na účet developera; potvrzuje developer)
- **Provize** (vzniká až po financování)
- **Pool** (bonusový program financovaný z podílu platformy)

#### G.1.3 Transparentní časovače a lhůty
- Všude, kde běží čas (podpisy, jednání, splatnosti), zobrazit:
  - **odpočet** + datum konce
  - kdo je „na tahu“
  - upozornění, že lhůty může prodloužit administrátor

#### G.1.4 Právní ochrana a důkaz „představení“
- Identita stran (projekt/developer ↔ investor) se **odkrývá až ve chvíli aktivace rezervace**.
- Systém musí umět doložit:
  - kdy byla rezervace aktivována
  - kdo byl zobrazen komu
  - jaká verze dokumentu byla podepsána

---

### G.2 Informační architektura (navigace)

#### G.2.1 Navigace – obchodník (broker)
Doporučené hlavní menu:
1) **Přehled** (dashboard)
2) **Projekty a tikety** (katalog)
3) **Moje rezervace**
4) **Investoři** (interní databáze brokera)
5) **Fakturace** (podklady a stav faktur)
6) **Pool** (bonusový program)
7) **Podpora / incidenty**
8) **Profil a nastavení**

#### G.2.2 Navigace – developer
Doporučené hlavní menu:
1) **Přehled**
2) **Projekty**
3) **Tikety**
4) **Rezervace**
5) **Finance** (úhrady platformě, provize jako závazek)
6) **Dokumenty** (projektové dokumenty)
7) **Podpora / incidenty**
8) **Profil a nastavení**

#### G.2.3 Navigace – administrátor
Doporučené hlavní menu:
1) **Přehled**
2) **Schvalování** (projekty, tikety)
3) **Uživatelé** (obchodníci, developeři)
4) **Rezervace a smlouvy**
5) **Finance a provize**
6) **Pool**
7) **Nastavení systému** (lhůty, kapacity, pravidla)
8) **Audit logy**
9) **Incident management**

---

### G.7 Maskování a odkrytí identit v uživatelském rozhraní

#### G.7.1 Co je maskováno
Do aktivace rezervace se maskuje:
- název projektu
- jméno developera
- identifikační údaje investora

#### G.7.2 Kdy a komu se identita odkrývá
- Po podpisu rezervační smlouvy oběma stranami (aktivace rezervace):
  - obchodník uvidí název projektu + jméno developera
  - developer uvidí jméno investora
  - developer uvidí jméno obchodníka

#### G.7.3 Auditní stopa
- systém uloží datum/čas aktivace
- uloží „komu se co odhalilo“
- uloží verzi dokumentu

---

### G.8 Zobrazení kapacity a pořadí rezervací

#### G.8.1 Kapacita na tiketu
- Každý tiket má kapacitu (default 3), kolik rezervací může být „v kapacitě“.
- Pořadí je určeno časem podpisu investora.
- Developerovo potvrzení neovlivňuje pořadí.

#### G.8.2 Práce s pořadím
- Pokud rezervace na vyšším pořadí odpadne (nepodepíše, developer odmítne, expiruje), další rezervace se posune.
- V UI musí být vždy jasné:
  - moje pozice
  - zda jsem „v kapacitě“ nebo „čekám mimo kapacitu“

#### G.8.3 Automatický zánik ostatních rezervací po financování
- Jakmile dojde k financování jednoho investora, ostatní rezervace zanikají.
- Uživatelé (obchodník + investor) obdrží informaci, že financování proběhlo jiným investorem.

---

### G.9 Minimální standard přístupnosti a použitelnosti

- Rozhraní musí být ovladatelné klávesnicí.
- Důležité informace nesmí být sděleny pouze barvou.
- Formuláře musí mít jasné chybové hlášky.
- U citlivých akcí (zrušení rezervace, potvrzení financování) vyžadovat potvrzení.

---

### G.10 Otevřená UX rozhodnutí (návrhy)

1) Viditelnost dokumentů projektu brokerům
- návrh: dokumenty zobrazit až po aktivní rezervaci (ochrana informací)

2) Zobrazení „odměny obchodníka“ na kartě tiketu
- návrh: zobrazit částku v Kč, která odpovídá odměně za přivedení investora (nikoliv podíl za přivedení projektu)

3) Vnitroaplikační notifikace vs e-mail
- návrh: klíčové kroky posílat e-mailem + zároveň zobrazit v aplikaci jako „centrum notifikací“

## UI část

### 9. Formuláře a vstupní data (bez technických kódů)

#### 9.1 Registrace obchodníka

Kanonická pole (sjednoceno):

**A) Identita a kontakt**
- Jméno a příjmení
- Firma / obchodní název (pokud relevantní)
- IČO / DIČ (pokud relevantní)
- E-mail
- Telefon

**B) Profil a úroveň**
- Úroveň obchodníka: Partner / Premium / Elite
- Počet slotů (odvozeno od úrovně)
- Regionální fokus (kraje)
- Typičtí investoři (např. privátní / institucionální / family office) – volitelné

**C) Fakturační a platební údaje**
- Fakturační adresa
- Bankovní účet

**D) Právní prohlášení a souhlasy**
- Souhlas s podmínkami platformy
- Prohlášení k právnímu důvodu evidence investorů (GDPR/komunikace)

#### 9.2 Registrace developera

Cíl registrace: vědět, kdo projekty zadává, kdo je oprávněná osoba a že má právo s projektem nakládat.

**Sekce A – Společnost (povinné)**
- Typ subjektu: právnická osoba / fyzická osoba podnikatel
- Název společnosti
- Identifikační číslo osoby
- Daňové identifikační číslo (volitelné)
- Sídlo společnosti
- Země registrace
- E-mail (přihlašovací)
- Telefon

**Sekce B – Oprávněná osoba (statutár / zástupce)**
- Jméno a příjmení
- Funkce
- Kontaktní e-mail
- Kontaktní telefon

**Sekce C – Profil developera (informativní + pro matching)**
- Zaměření (vícenásobný výběr; typy projektů)
- Regiony působnosti (vícenásobný výběr)
- Počet realizovaných projektů (informativní)
- Celkový objem projektů (informativní)
- Typické financování: banka / privátní kapitál / jiné / kombinace
- Web / prezentace (volitelné)

**Sekce D – Právní a smluvní souhlasy (povinné)**
- Prohlášení o oprávnění k projektu
- Souhlas s podmínkami platformy
- Souhlas se zpracováním osobních údajů (GDPR)

**Sekce E – Stav (spravuje administrátor)**
- Stav účtu (čeká na ověření / aktivní (ověřen) / pozastaven / zamítnut / zablokován)

Poznámka:
- Některé dokumenty zmiňují „rámcovou smlouvu“ a „anti-obcházející ujednání“ jako krok spravovaný administrátorem mimo self-service registraci. Doporučení: evidovat tyto dokumenty u profilu developera jako „splněno/nesplněno“ + datum + kdo potvrdil.


#### 9.3 Založení investora obchodníkem (evidence investorů)

Investor je interní záznam obchodníka (ne účet). Cílem je:
- evidovat kontaktní a základní identifikační údaje,
- držet investiční profil pro matching,
- umožnit odeslání dokumentů k podpisu (rezervační smlouva + GDPR informace).

Platforma investory neschvaluje ani neověřuje.

Kanonická pole:

**A) Identita**
- Typ investora: fyzická osoba / právnická osoba
- Jméno a příjmení / název společnosti
- IČO (u právnické osoby)

**B) Kontakt**
- E-mail
- Telefon
- Kontaktní osoba (u právnické osoby)

**C) Investiční profil (pro matching)**
- Preferované typy projektů
- Preferované lokality (kraje)
- Investiční částka: min / max
- Preferovaný výnos: min
- Preferovaná doba: min / max
- Preferované zajištění (enum + volitelné upřesnění)

**D) Interní poznámky**
- Poznámka obchodníka

#### 9.4 Zadání projektu (developer nebo obchodník)

Kanonická pole projektu (sjednoceno a rozšířeno):

**A) Identifikace**
- Název projektu
- Typ projektu
- Stručný popis (3–5 vět)
- Detailní popis / profil projektu (volitelně delší)

**B) Lokalita a nemovitost**
- Obec / město
- Kraj
- Přesná adresa (volitelné – dle citlivosti, lze skrýt pro brokery do aktivace)
- Popis nemovitosti / assetu

**C) Developer / vlastník projektu**
- Pokud projekt zadává developer: návaznost na profil developera (automaticky)
- Pokud projekt zadává obchodník (lead):
  - název developera / společnosti
  - kontaktní osoba
  - e-mail, telefon
  - IČO (pokud je k dispozici)
  - interní poznámka pro administrátora (stav jednání, zdroj leadu)

**D) Finanční rámec projektu**
- Celkový rozpočet projektu
- Vlastní kapitál
- Cizí zdroje – typ (banka / úvěr / jiné)
- Cizí zdroje – výše
- Orientační podmínky (text)
- Harmonogram projektu (text)

**E) Právní a technický stav**
- Vlastnický stav: vlastník / SPV
- Stavební stav: povolení ano / ne
- Existující zástavy (text)
- Věcná břemena (text)

**F) Využití prostředků (procenta)**
- Procentuální rozpad (součet 100 %)

**G) Dokumenty k projektu (přílohy)**
- List vlastnictví
- Projektová dokumentace
- Rozpočet projektu
- Term sheet / shrnutí
- Další podklady

Poznámka k viditelnosti:
- V části 13 (Matice viditelnosti a oprávnění) držíme pravidlo, že broker před aktivací vidí jen „decision-first“ parametry (výnos, LTV, částka, doba, zajištění…), nikoli citlivé identifikátory projektu.

#### 9.5 Zadání tiketu developerem

Kanonická pole tiketu:

**A) Základní parametry**
- Název / označení tiketu
- Investiční částka
- Doba trvání
- Typ tiketu: dluhový / kapitálový / hybridní

**B) Výnos a podmínky**
- Výnos v Kč (primární)
- Výnos v % (sekundární, pro interní výpočty / přepočet)
- Výplatní profil: měsíčně / kvartálně / na konci

**C) Forma financování (enum)**
- Použít kanonický seznam z kapitoly 8.4 (Forma financování).

**D) Ručení a zajištění (enum + parametry)**
- Typ zajištění
- Hodnota zástavy (pokud relevantní)
- LTV (pokud relevantní)
- Další podmínky

**E) Proces, kapacity a časové limity**

- Kapacita tiketu: maximální počet rezervací, které mohou být současně **v kapacitě** (výchozí 3; nastavuje administrátor; návrh může dát developer i obchodník při zadání).
- Do kapacity se **počítají rezervace od chvíle, kdy investor podepíše rezervační smlouvu** (včetně stavu „čeká na podpis developera“, „rezervace aktivní“ a „jednání“).
- Rezervace před podpisem investora (rozpracovaná / čeká na podpis investora) kapacitu tiketu neblokují.

Pořadí rezervací na tiketu:
- pořadí se určuje podle **data a času podpisu investora** (u fyzického podpisu podle data a času nahrání scanu),
- čas podpisu developera pořadí **neovlivňuje**.

Konkurence a přesuny ve frontě:
- systém vždy udržuje „top N“ rezervací **v kapacitě** (N = kapacita tiketu),
- pokud některá rezervace z top N odpadne (expirace, zrušení, odmítnutí developerem), systém automaticky posune další rezervaci podle pořadí do kapacity,
- pokud jedna rezervace dosáhne financování, ostatní rezervace na tiketu automaticky zanikají.

Časové limity (výchozí, vše upravitelné i prodlužitelné administrátorem):
- podpis investora: 48 hodin,
- podpis developera: 48 hodin (od chvíle, kdy je rezervace v kapacitě),
- jednání / financování: 30 dní od aktivace,
- splatnost developera: 14 dnů od vzniku nároku,
- splatnost platformy pro výplatu obchodníka: 3 dny,
- publikační okno tiketu: 90 dnů.

**F) Provize a obchodní podmínky (spravuje administrátor)**
- Provize platformy vůči developerovi: X % z profinancované částky (nebo ekvivalent v Kč; primární reporting v Kč)
- Rozdělení provize mezi platformu / obchodníka 1 / obchodníka 2: zadává administrátor ručně (např. 50/25/25) + pravidlo „pokud je obchodník stejná osoba v obou rolích, může dostat součet“
- Splatnost provize developer → platforma (výchozí 14 dnů; upravitelné)
- SLA výplaty obchodníkovi po úhradě provize platformě (výchozí 3 dny; upravitelné)
- Pokud je aktivní bonusový program Pool: část podílu platformy se odvádí do poolu (výchozí 10 % z podílu platformy); podíly obchodníků se tím nekrátí.

Poznámka:
- Dokumenty jsou vedeny na úrovni projektu (přílohy projektu). Pro tiket v MVP nepřidáváme samostatné přílohy.

### 13. Matice viditelnosti a oprávnění (MVP)

#### 13.1 Skupiny viditelnosti dat

Pro jednoduchost dělíme data na skupiny:

1) **Veřejná data tiketu (decision-first)** – výnos, částka, doba, zajištění, LTV, kraj, typ projektu.
2) **Identita projektu** – název projektu, jméno developera, přesná adresa, dokumenty s identifikátory.
3) **Identita investora** – jméno/název, kontakty.
4) **Identita obchodníka** – jméno/název obchodníka (odemkne se developerovi po aktivaci).

#### 13.2 Kdo co vidí podle stavu rezervace

| Stav | Obchodník | Developer | Administrátor |
|---|---|---|---|
| Rozpracovaná | (1) + investor | (1)+(2) | vše |
| Čeká na podpis investora | (1) + investor | (1)+(2) | vše |
| Podepsáno investorem – čeká ve frontě (mimo kapacitu) | (1) + investor | (1)+(2) | vše |
| Podepsáno investorem – v kapacitě (čeká na podpis developera) | (1) + investor | (1)+(2) | vše |
| Rezervace aktivní / jednání probíhá | (1)+(2) + investor | (1)+(2)+(3)+(4) | vše |
| Financování potvrzeno / ukončeno | dle účelu (bez cizích investorů) | dle účelu | vše |

Poznámka:
- Obchodník nikdy nevidí investory jiných obchodníků.

#### 13.3 Oprávnění (akce)

| Akce | Obchodník | Developer | Administrátor |
|---|---|---|---|
| Vytvořit projekt | ano (lead) | ano | ano |
| Odeslat projekt/tiket ke schválení | ano (lead) | ano | ano |
| Založit tiket (plný) | ne | ano | ano |
| Vytvořit rezervaci a odeslat k podpisu investorovi | ano | ne | ano |
| Stáhnout PDF rezervační smlouvy | ano | ne | ano |
| Nahrát scan podepsané smlouvy investorem | ano | ne | ano |
| Podepsat rezervační smlouvu | ne | ano | ne |
| Prodloužit termíny (podpis / jednání) | ne | ne | ano |
| Zrušit rezervaci | ne (jen žádost) | ne (jen žádost) | ano |
| Potvrdit financování (přijetí na účet developera) | ne | ano | ano |
| Vystavit fakturu platformě | ano | ne | ne |
| Označit fakturu jako uhrazenou | ne | ne | ano |

### Příloha B: Uživatelské rozhraní – hierarchie informací a rozhodovací údaje

Tato příloha je určena hlavně pro návrháře uživatelského rozhraní a pro programátora (aby chápal, proč některá data existují a kdy se zobrazují).

#### B.1 Základní princip: „nejdřív rozhodnutí, pak detail“

Obchodník se rozhoduje rychle. V seznamu tiketů a v rychlém náhledu musí být okamžitě jasné:
1) **kolik si vydělá** (provize v korunách českých),
2) **jaký je výnos** (výnos za rok),
3) **jaké je krytí** (zajištění a poměr financování k hodnotě zástavy),
4) **jak rychle musí jednat** (dostupnost a časové lhůty).

#### B.2 Doporučené pořadí informací na kartě tiketu (seznam tiketů)

**Horní část (nejviditelnější):**
- Provize obchodníka (Kč)
- Výnos za rok
- Zajištění (stručné štítky + pořadí zástavy, pokud je relevantní)

**Střed (pro rychlé posouzení):**
- Investiční částka + měna
- Doba trvání
- Poměr financování k hodnotě zástavy (pokud existuje)
- Typ projektu + kraj
- Forma financování

**Spodní část (operativní):**
- Dostupnost (počet volných rezervací / limit)
- Čas do konce nabídky (pokud je definován)
- Tlačítka akcí dle oprávnění (např. „Rezervovat“)

#### B.3 Maskování identity (před aktivací rezervace)

Před aktivací rezervace obchodník nevidí:
- název projektu,
- jméno developera,
- přesnou adresu,
- dokumenty s identifikátory.

Doporučené texty v rozhraní (bez marketingových frází, neutrálně):
- „Název projektu se zobrazí po aktivaci rezervace.“
- „Jméno developera se zobrazí po aktivaci rezervace.“

#### B.4 Stavové štítky (uživatelské rozhraní)

Uživatelé potřebují srozumitelný stav. Doporučené názvy stavů pro zobrazení:
- „Rozpracováno“
- „Čeká na podpis investora“
- „Čeká na podpis developera“
- „Rezervace aktivní“
- „Jednání probíhá“
- „Financování potvrzeno“
- „Ukončeno úspěšně“
- „Ukončeno neúspěšně“
- „Spor“

#### B.5 Prázdné stavy a chybové stavy (návrh)

- „Zatím zde nejsou žádné tikety, které odpovídají vašim filtrům.“
- „Nemáte volný slot pro rezervaci. Kontaktujte administrátora nebo zvyšte úroveň.“
- „Tento tiket již není dostupný.“

#### B.6 Doporučené filtry (obchodník)

- Typ projektu
- Kraj
- Investiční částka (rozsah)
- Výnos (rozsah)
- Doba trvání (rozsah)
- Forma financování
- Zajištění (ano/ne + typy)
- Poměr financování k hodnotě zástavy (rozsah)
- Dostupnost (jen dostupné / vše)




#### B.7 Mapa obrazovek pro obchodníka (informační architektura)

Doporučená navigace (MVP):
- Přehled
- Nabídka tiketů
- Moje rezervace
- Investoři (interní databáze obchodníka)
- Provize a fakturace
- Bonusový program „Pool“ (pokud je aktivní)
- Profil a nastavení
- Podpora a dokumenty

Poznámky:
- Obchodník vždy vidí pouze své investory a své rezervace.
- Před aktivací rezervace obchodník nevidí identitu projektu ani developera (viz maskování identity).

#### B.8 Mapa obrazovek pro developera (informační architektura)

Doporučená navigace (MVP):
- Přehled
- Projekty
- Tikety
- Rezervace (k podpisu / aktivní)
- Financování a provize
- Dokumenty
- Profil a nastavení
- Podpora

Poznámky:
- Developer před aktivací rezervace nevidí identitu investora.
- Po aktivaci rezervace developer vidí identitu investora i jméno obchodníka (důkaz introdukce).

#### B.9 Obrazovka „Nabídka tiketů“ (obchodník)

**Účel:** rychlý výběr, porovnání a rozhodnutí, zda má smysl zahájit rezervaci.

**Zobrazení v seznamu (karty tiketů):**
- Držet se doporučeného pořadí informací z kapitoly B.2.
- Povinně zobrazit i „Formu financování“.

**Dostupnost a konkurence (bez úniku citlivých dat):**
- Zobrazit kapacitu tiketu (např. „V kapacitě: 2 / 3“).
- Zobrazit agregovaný počet investorem podepsaných rezervací (např. „Podepsáno investorem: 5“), bez zobrazení identit.
- Obchodník v detailu své rezervace vidí svoji pozici ve frontě („Jste 4. v pořadí“).

**Výchozí filtry a řazení (doporučení):**
- Filtry: dle kapitoly B.6.
- Řazení: „Nejvyšší provize (Kč)“ nebo „Nejnovější“ (volba v nastavení uživatele).

**Prázdné stavy:** viz kapitola B.5.

#### B.10 Obrazovka „Detail tiketu“ (obchodník)

**Účel:** potvrdit rozhodnutí a založit rezervaci pro vybraného investora.

**Sekce v detailu (doporučené):**
1) **Rychlé shrnutí** (nahoře): provize v Kč, výnos, částka, doba, zajištění, forma financování, kraj + město.
2) **Zajištění a krytí**: typy zajištění, pořadí, poměr financování k hodnotě zástavy (pokud existuje), zdroj ocenění.
3) **Využití prostředků**: procentuální rozpad + kontrola součtu 100 % (pokud vyplněno).
4) **Časové parametry**: publikační okno (kolik dní zbývá) + standardní lhůty (podpisy, jednání) s poznámkou, že administrátor může lhůty měnit.
5) **Dostupnost**: kapacita tiketu, počet podepsaných rezervací investorem, informace o tom, že rozhoduje čas podpisu investora.
6) **Akce**:
   - „Založit rezervaci pro investora“ (otevře průvodce).
   - Pokud už má obchodník rozpracovanou rezervaci na tento tiket: „Pokračovat v rezervaci“.

**Maskování identity:**
- Před aktivací rezervace se v detailu nezobrazuje název projektu ani jméno developera (viz kapitola B.3).

#### B.11 Průvodce založením rezervace (obchodník)

**Cíl:** vytvořit rezervaci a získat podpis investora ve lhůtě.

Doporučené kroky (MVP):
1) **Výběr investora** z interní databáze (nebo „Přidat investora“).
2) **Rekapitulace tiketu** + potvrzení obchodníka, že má právní důvod investora evidovat a kontaktovat.
3) **Volba způsobu podpisu investora**:
   - elektronický podpis (odeslání odkazu e-mailem),
   - fyzický podpis (vygenerovat a stáhnout PDF).
4) **Vytvoření rezervace** a zobrazení dalších kroků:
   - odpočet času do expirace podpisu investora,
   - možnost znovu odeslat výzvu,
   - možnost nahrát scan (pokud zvolen fyzický podpis).

Poznámka:
- Teprve po podpisu investora se rezervace zařadí do pořadí a může obsadit kapacitu tiketu.

#### B.12 Obrazovka „Moje rezervace“ (obchodník)

**Zobrazení:** seznam rezervací + detail.

V seznamu doporučujeme:
- stavový štítek,
- odpočet relevantní lhůty (podpis investora / podpis developera / konec jednání),
- informaci, zda je rezervace „v kapacitě“ nebo „mimo kapacitu“,
- informaci o pozici ve frontě (pokud je investorem podepsaná).

V detailu rezervace doporučujeme:
- časovou osu událostí (vytvoření → podpis investora → podpis developera → aktivace → jednání → financování),
- dokumenty k podpisu (PDF, záznam o podpisu, scan),
- po aktivaci odemknuté identity (název projektu + developer),
- důvody ukončení (např. „financováno jiným investorem“).

#### B.13 Obrazovka „Rezervace“ (developer)

**Účel:** podepsat rezervační smlouvu a následně potvrdit financování.

V seznamu rezervací doporučujeme:
- zobrazovat jen rezervace, které jsou pro developera relevantní (typicky podepsané investorem a čekající na podpis developera, a aktivní rezervace),
- ukazovat odpočet času do expirace podpisu developera.

V detailu rezervace doporučujeme:
- možnost podepsat elektronicky,
- možnost stáhnout PDF a nahrát scan (fyzický podpis),
- možnost odmítnout podpis (důvod; rezervace se ukončí a uvolní se kapacita pro další v pořadí),
- po aktivaci zobrazení identity investora a obchodníka.

#### B.14 Formulář „Potvrdit financování“ (developer)

**Účel:** potvrdit, že prostředky od investora skutečně dorazily na bankovní účet developera. Na základě tohoto data se spouští následné lhůty (provize, fakturace, výplata).

Doporučená pole:
- Datum přijetí na bankovní účet (povinné).
- Skutečně profinancovaná částka (povinné; může se lišit od částky tiketu).
- Důvod odchylky částky (povinné, pokud se liší).
- Příloha k potvrzení (volitelné; například potvrzení o platbě pro audit).

Poznámky:
- Platforma v první verzi platby neověřuje, ale potvrzení musí být auditováno.
- Po potvrzení financování se tiket uzavírá a ostatní rezervace na tiketu se automaticky ukončí.

#### B.15 Obrazovka „Provize a fakturace“ (obchodník)

**Účel:** obchodník vidí, kdy mu vznikl nárok vystavit fakturu platformě a co má k dispozici za podklady.

Doporučené části:
- Seznam „K vyfakturování“: tiket, profinancovaná částka, podíl obchodníka, datum vzniku nároku, termín výplaty.
- Detail položky: podklady od platformy (shrnutí, číslo tiketu, auditní data) + nahrání faktury.
- Stav faktury: nahráno → přijato → schváleno → uhrazeno.

#### B.16 Obrazovka „Pool“ (obchodník)

**Účel:** motivace a transparentní přehled plnění met v aktuálním období.

Doporučené části:
- Aktuální období (od–do), meta 1, meta 2.
- Váš obrat v období + progress vůči metám.
- Stav poolu (kolik je v poolu).
- Pořadí obchodníků:
  - doporučení: zobrazit minimálně vlastní pořadí; zobrazení žebříčku (top 3) je možné zapnout jako obchodní parametr (citlivost dat).

### Příloha C: Administrátorské rozhraní – navigace, seznamy, sloupce, filtry, akce

Tato příloha shrnuje, jak by mělo vypadat administrátorské rozhraní v první verzi, aby šly procesy efektivně řídit.

#### C.1 Doporučená struktura navigace

- Přehled
- Uživatelé (obchodníci, developeři)
- Projekty
- Tikety
- Rezervace
- Financování a provize
- Faktury
- Spory a incidenty
- Auditní záznam
- Nastavení

#### C.2 Rezervace (seznam)

**Sloupce (doporučení):**
- Identifikátor rezervace
- Tiket / projekt (anonymně, dokud není aktivní)
- Obchodník (iniciátor)
- Investor (vždy vidí administrátor)
- Stav
- Termín podpisu investora
- Termín podpisu developera
- Termín konce jednání
- Poznámka / důvod (pokud relevantní)

**Filtry:**
- Stav
- Obchodník
- Developer
- Datum vytvoření (rozsah)

**Akce:**
- Zrušit rezervaci (s důvodem)
- Prodloužit termín (u podpisu / jednání)
- Znovu odeslat výzvu k podpisu
- Zobrazit financování potvrzené developerem (a případně upravit datum / označit jako sporné – override)
- Založit spor

#### C.3 Financování a provize

**Sloupce:**
- Tiket
- Profinancovaná částka
- Provize platformy (Kč)
- Splatnost developerem
- Stav úhrady
- Podíl platformy / obchodníka 1 / obchodníka 2
- Termín výplaty obchodníkům

**Akce:**
- Nastavit / změnit rozdělení
- Označit úhradu developera
- Poskytnout podklady obchodníkům k fakturaci
- Označit fakturu obchodníka jako přijatou / uhrazenou

#### C.4 Spory a incidenty

- Fronta sporů podle priority
- Časová osa událostí
- Připojené dokumenty
- Rozhodnutí administrátora (s auditní stopou)



### G.3 Základní komponenty a datové bloky

#### G.3.1 Karta projektu (v katalogu)
Účel: rychle rozhodnout, zda projekt stojí za otevření.

Povinné prvky:
- Typ projektu (Rezidenční / Logistika / …)
- Lokalita (kraj + město)
- Souhrn (1–2 věty, bez citlivých identit)
- Počet tiketů v projektu
- Stav projektu (v přípravě / publikovaný / skrytý / uzavřený)

#### G.3.2 Karta tiketu (v katalogu) – povinné bloky
Účel: rozhodnout, zda tiket rezervovat.

**Poznámka:** Název projektu a jméno developera mohou být maskované (dle pravidel odkrývání identit).

Povinné bloky na kartě:
1) **Odměna obchodníka (Kč)** – primární motivátor
   - zobrazovat v Kč jako hlavní číslo
   - procento jen sekundárně (např. v detailu)
2) **Částka tiketu (Kč)**
3) **Forma financování** (povinně jako štítek/čip)
   - Zápůjčka / úvěr
   - Mezaninové financování
   - Kapitálový vstup
   - Joint Venture (společný podnik)
   - Konvertibilní zápůjčka
   - Zpětný leasing (sale & leaseback)
   - Nabídka projektu (prodej projektu) – volitelné
4) **Výnos** (pokud je definovaný) + jednotka (např. ročně)
5) **Zajištění** (štítky) + **LTV** (pokud je relevantní)
6) **Do uzávěrky** (odpočet do expirace publikačního okna, default 90 dnů)
7) **Kapacita rezervací** (např. 2/3 obsazeno) + dostupnost
8) **Akce**: „Rezervovat“ / „Plno“ / „Uzavřeno“

Doporučené doplňkové bloky (pokud pomáhají rozhodnutí):
- Typ projektu
- Investiční účel (kategorizace využití prostředků – procentuální rozpad)
- „Shoda s investory“ (jen pro brokera, interní)

#### G.3.3 Stavové štítky (status chips)
- Jedna barva = jeden význam (konzistentně v celé aplikaci).
- Status štítky použít pro:
  - stav projektu
  - stav tiketu
  - stav rezervace
  - stav financování / plateb

#### G.3.4 Krokovník (timeline) pro rezervaci
Na detailu rezervace vždy zobrazit krokovník:
1) Rozpracováno
2) Čeká na podpis investora (48 h)
3) Čeká na podpis developera (48 h)
4) Aktivní rezervace (identita odhalena)
5) Jednání (default 30 dní)
6) Financování potvrzeno developerem
7) Provize a fakturace

---

### G.4 Obrazovky – obchodník (broker)

> Poznámka: Investor nemá přístup do platformy. Vše, co investor dělá, probíhá přes e-mail / podpisový tok.

#### BRO-001 Přihlášení
- Email + heslo
- Zapomenuté heslo
- Zabezpečení: omezení pokusů, audit přihlášení

#### BRO-010 Přehled (dashboard)
Zobrazit:
- Počet aktivních rezervací / kapacita (globální sloty)
- Moje rozpracované rezervace (top 5)
- Tikety s blížící se expirací (top 5)
- Pool: aktuální období (souhrnný progres)

#### BRO-020 Projekty a tikety (katalog)
Funkce:
- fulltext vyhledávání
- filtry (minimálně): typ projektu, kraj + město, forma financování, zajištění, LTV, výnos, dostupnost kapacity
- řazení: nejvyšší odměna, nejbližší expirace, nejvyšší výnos

Zobrazení:
- seznam karet tiketů (viz G.3.2)

#### BRO-021 Detail projektu
- základní informace (bez citlivých identit, dokud není aktivní rezervace)
- seznam tiketů projektu
- dokumenty projektu:
  - **doporučení:** dokumenty zobrazit brokerovi až po aktivní rezervaci (ochrana informací)
  - pokud bude rozhodnuto jinak, zavést minimálně watermark + audit stažení

#### BRO-022 Detail tiketu
Zobrazit:
- všechny parametry tiketu
- stav tiketu (otevřený / expirovaný / skrytý / uzavřený)
- kapacita rezervací + obsazenost
- historie změn tiketu (pokud byl upraven)

Akce:
- „Vytvořit rezervaci“ (pokud je kapacita)

#### BRO-030 Vytvoření rezervace (wizard)
Kroky:
1) Výběr investora (z interní databáze brokera) nebo založení nového
2) Rekapitulace tiketu + odměna + klíčová upozornění
3) Volba podpisu investora:
   - elektronicky (odeslat link)
   - mimo elektronický podpis: vygenerovat PDF → vytisknout → nahrát scan
4) Odeslání

Systém po odeslání:
- vytvoří rezervaci ve stavu „čeká na podpis investora“
- spustí odpočet 48 h
- určí pořadí v kapacitě dle času podpisu investora

#### BRO-031 Detail rezervace
Zobrazit:
- krokovník + odpočty
- aktuální pozice v kapacitě (např. 2/3)
- identita developera/projektu až po aktivaci
- dokumenty: rezervační smlouva, případně scan

Akce (dle stavu):
- připomenout investorovi podpis
- nahrát scan (pokud offline)
- zrušit rezervaci (pokud to pravidla dovolují)

#### BRO-040 Investoři (seznam)
Zobrazit:
- seznam investorů brokera
- filtry podle preferencí (typy projektů, forma financování, region, objem)
- rychlé akce: detail, edit, archivace

#### BRO-041 Detail investora
Zobrazit:
- kontaktní údaje
- investiční profil a preference
- historie rezervací tohoto investora (jen v rámci brokera)
- poznámky brokera
- souhlasy (GDPR): stav + datum

#### BRO-060 Fakturace
Zobrazit:
- přehled nároků na odměnu (vznikají až po financování)
- stav: čeká na úhradu platformě od developera / lze fakturovat / faktura nahraná / proplaceno
- pro každý nárok: částka v Kč + identifikace tiketu + datum financování (od developera)

Akce:
- stáhnout podklady k fakturaci
- nahrát fakturu (PDF)

#### BRO-050 Pool
Zobrazit:
- aktuální období (datum od/do)
- celková výše Poolu
- moje dosažený obrat (dle pravidel v kapitole 10.7)
- metriky: Meta1 (100 mil. Kč) + Meta2 (200 mil. Kč)
- leaderboard top 3 (bez citlivých údajů investorů)

#### BRO-070 Podpora / incidenty
- vytvoření požadavku
- stav požadavku
- komunikace s administrátorem

---

### G.5 Obrazovky – developer

#### DEV-010 Přehled (dashboard)
Zobrazit:
- projekty ve stavu: koncept / čeká na schválení / publikované
- tikety: otevřené / s rezervacemi / uzavřené
- rezervace čekající na podpis developera (s odpočtem 48 h)

#### DEV-020 Projekty (seznam)
- seznam projektů developera
- stav projektu
- akce: detail, vytvořit nový projekt, žádost o úpravu

#### DEV-030 Tikety (seznam)
- seznam tiketů
- stav tiketu
- kapacita rezervací
- akce: detail, požádat o úpravu (pokud to stav dovoluje)

#### DEV-040 Rezervace (přehled)
Zobrazit tabulku:
- tiket
- pořadí rezervace v kapacitě (dle času podpisu investora)
- stav (čeká na podpis developera / aktivní / jednání / financování)
- zbývající čas na podpis

Akce:
- otevřít detail

#### DEV-041 Detail rezervace + podpis
Zobrazit:
- anonymizovaný profil investora (bez identity) před aktivací
- rezervační smlouvu k podpisu
- volbu podpisu:
  - elektronicky
  - mimo elektronický podpis: vygenerovat PDF → podepsat → nahrát scan

Po podpisu developera:
- rezervace se aktivuje a odhalí identitu stran dle pravidel

#### DEV-050 Potvrzení financování
Na detailu aktivní rezervace / tiketu:
- potvrzení, že peníze investora dorazily na účet developera
- pole: datum přijetí + skutečně profinancovaná částka (pokud se liší)
- možnost nahrát podklad (volitelné)

Důsledek:
- vzniká nárok na provizi platformě
- spouští se lhůty splatnosti (developer → platforma)

#### DEV-060 Finance
Zobrazit:
- seznam profinancovaných tiketů
- závazek vůči platformě (částka + splatnost, default 14 dní, upravitelné administrátorem)
- stav: neuhrazeno / uhrazeno (zadává administrátor ručně, pokud není bankovní napojení)

---

### G.6 Obrazovky – administrátor

#### ADM-010 Přehled (dashboard)
Zobrazit:
- fronty ke schválení (projekty, tikety)
- expirace tiketů
- rezervace s blížící se lhůtou podpisu
- finance: neuhrazené závazky developerů, nevyplacené provize
- incidenty

#### ADM-020 Schvalování projektů
- seznam projektů čekajících na schválení
- detail projektu (všechna data)
- akce: schválit / vrátit k doplnění / zamítnout

#### ADM-021 Schvalování tiketů
- seznam tiketů čekajících na schválení
- detail tiketu
- nastavení kapacity rezervací (default 3, upravitelné)
- akce: schválit / vrátit / zamítnout

#### ADM-040 Rezervace a smlouvy
- monitoring všech rezervací
- možnost prodloužit lhůty pro konkrétní rezervaci
- možnost ručně změnit stav (pouze s auditem a důvodem)

#### ADM-050 Finance a provize
- evidence financování (podle potvrzení developera)
- evidence úhrady platformě od developera (ruční zadání)
- generování podkladů pro obchodníka k fakturaci
- evidence nahraných faktur od obchodníků
- evidence výplat obchodníkům

#### ADM-060 Pool
- nastavení období, pravidel a met
- výpočet leaderboardu
- uzavření období + přidělení výplaty

#### ADM-070 Nastavení systému
Nastavitelné (globálně i per rezervace/tiket):
- lhůty podpisu (investor, developer)
- délka jednání
- publikační okno tiketu
- splatnosti a lhůty v provizích
- kapacita rezervací na tiketu
- globální sloty obchodníků (Partner/Premium/Elite)

---

### Příloha I: Registry formulářů (MVP – pro implementaci databáze i uživatelského rozhraní)

> Poznámka k pravdě: Tento souhrnný dokument je kanonický. Word podklady slouží primárně jako „zdroj polí“ a inspirace pro strukturu formulářů. Pokud se Word podklady rozcházejí s pravidly výše (např. ověřování investora, AML/KYC), platí pravidla v tomto dokumentu.

#### I.1 Registrace obchodníka

**Zdroje pro pole:** `REGISTRACE OBCHODNIK DEVELOPER.docx` (sekce A1, A3, A4) + doplnění o bezpečnostní minimum (heslo) a fakturační/platební údaje.

##### I.1.1 Formulář: Vytvoření účtu obchodníka

| Sekce | Pole | Povinné | Kdo vyplňuje | Typ | Validace / pravidla | Poznámka |
|---|---:|:---:|---|---|---|---|
| Přihlašovací údaje | E-mail | Ano | Obchodník | E-mail | unikátní v systému, lowercase, validní formát | používá se pro přihlášení |
| Přihlašovací údaje | Heslo | Ano | Obchodník | Text | min. 8 znaků (doporučeno 12+), kontrola shody s potvrzením | bez ukládání do logů |
| Přihlašovací údaje | Potvrzení hesla | Ano | Obchodník | Text | musí odpovídat heslu |  |
| Identifikace subjektu | Typ subjektu | Ano | Obchodník | Výběr (enum) | **Fyzická osoba podnikající / Právnická osoba** | „Fyzická osoba podnikající“ = pro účely B2B vztahu |
| Identifikace (FO) | Jméno a příjmení | Podmíněně | Obchodník | Text | povinné, pokud typ = FO |  |
| Identifikace (FO) | IČO | Podmíněně | Obchodník | Text | povinné, pokud typ = FO (doporučení pro provoz fakturace) | ⚠️ viz nesrovnalosti níže |
| Identifikace (PO) | Název společnosti | Podmíněně | Obchodník | Text | povinné, pokud typ = PO |  |
| Identifikace (PO) | IČO | Podmíněně | Obchodník | Text | povinné, pokud typ = PO |  |
| Identifikace (PO) | DIČ | Ne | Obchodník | Text | volitelné | pro fakturaci |
| Kontakty | Telefon | Ano | Obchodník | Telefon | validace formátu +420…, doporučit ověření SMS kódem |  |
| Kontakty | Adresa (bydliště / sídlo) | Ano | Obchodník | Text | minimálně ulice + číslo, město, PSČ, země | pro smlouvy a fakturaci |
| Platební údaje | Bankovní účet pro výplaty (IBAN / číslo účtu) | Ne* | Obchodník | Text | základní validace, možnost změny později | *povinné nejpozději před první výplatou provize |
| Profil (obchodní) | Region působnosti | Ne | Obchodník | Vícenásobný výběr | kraje (a volitelně města) | používá se pro matching |
| Profil (obchodní) | Specializace | Ne | Obchodník | Vícenásobný výběr | typy projektů + formy financování (dle tohoto dokumentu) | zjednodušit, aby nevznikl chaos |
| Profil (obchodní) | Typičtí investoři | Ne | Obchodník | Výběr (enum) | např. privátní / kvalifikovaní / instituce | pouze informativní |
| Profil (obchodní) | Průměrná velikost obchodu | Ne | Obchodník | Číslo (Kč) | >= 0 | informativní |
| Profil (obchodní) | Preferovaná komunikace | Ne | Obchodník | Výběr (enum) | telefon / e-mail / osobně |  |
| Souhlasy | Souhlas s podmínkami platformy | Ano | Obchodník | Checkbox | musí být potvrzeno | terminologie dle právních textů |
| Souhlasy | Souhlas s ochranou osobních údajů (GDPR) | Ano | Obchodník | Checkbox | musí být potvrzeno |  |
| Souhlasy | Souhlas s mlčenlivostí (NDA) | Ano | Obchodník | Checkbox | musí být potvrzeno | lze nahradit podpisem dokumentu |
| Souhlasy | Souhlas s provizními podmínkami | Ano | Obchodník | Checkbox | musí být potvrzeno | bez vzniku nároku při aktivaci rezervace |
| Souhlasy | Souhlas s etickým kodexem | Ne | Obchodník | Checkbox | volitelné (doporučeno) | ve Word podkladech je povinné – viz nesrovnalosti |

##### I.1.2 Administrátorské doplnění po registraci (není součást formuláře)

| Pole | Kdo vyplňuje | Typ | Pravidla |
|---|---|---|---|
| Stav účtu obchodníka | Administrátor | enum | Pending / Aktivní / Pozastaven / Zablokován |
| Úroveň obchodníka | Administrátor | enum | Partner / Premium / Elite |
| Sloty obchodníka | Administrátor | číslo | default dle úrovně, možnost override |
| Důvod pozastavení/zablokování | Administrátor | text | povinné při zásahu |

##### I.1.3 Nesrovnalosti z podkladů a jak s nimi naložit

- **AML/KYC pole (doklady, PEP, sankční seznamy)** jsou ve Word podkladech, ale v tomto MVP jsou **mimo rozsah**. Držíme pouze „minimální identifikaci“ pro smlouvy a provoz.
- Ve Word podkladech existuje **„Typ spolupráce“** (nezávislý/vázaný/interní). V tomto dokumentu je rozhodnuto **neevidovat**.
- Ve Word podkladech je **etický kodex povinný**. V kanonických pravidlech to není nutné pro procesy – navrhuji **ponechat jako volitelný**, dokud právník neřekne, že musí být povinný.
- **IČO u fyzické osoby**: Word podklady rozlišují FO/PO. V B2B a fakturační realitě ale platí, že obchodník musí mít titul k fakturaci. Navrhuji: **FO = FO podnikající a IČO povinné** (aby se předešlo problémům při výplatě provize). Pokud chcete umožnit i čistou FO, musí se doplnit alternativní mechanismus vyplácení.

---

#### I.2 Registrace developera

**Zdroje pro pole:** `REGISTRACE OBCHODNIK DEVELOPER.docx` (sekce B1, B2, B3, B4) + doplnění o bezpečnostní minimum (heslo).

##### I.2.1 Formulář: Vytvoření účtu developera

| Sekce | Pole | Povinné | Kdo vyplňuje | Typ | Validace / pravidla | Poznámka |
|---|---:|:---:|---|---|---|---|
| Přihlašovací údaje | E-mail | Ano | Developer | E-mail | unikátní, validní formát | přihlášení |
| Přihlašovací údaje | Heslo | Ano | Developer | Text | min. 8 znaků (doporučeno 12+) |  |
| Přihlašovací údaje | Potvrzení hesla | Ano | Developer | Text | shoda s heslem |  |
| Identifikace subjektu | Typ subjektu | Ano | Developer | Výběr (enum) | **Právnická osoba / Fyzická osoba podnikající** | doporučené zjednodušení |
| Identifikace | Název společnosti | Ano | Developer | Text | povinné |  |
| Identifikace | IČO | Ano | Developer | Text | povinné |  |
| Identifikace | DIČ | Ne | Developer | Text | volitelné |  |
| Identifikace | Sídlo společnosti | Ano | Developer | Text | ulice + číslo, město, PSČ, země |  |
| Identifikace | Země registrace | Ano | Developer | Text | default ČR |  |
| Kontakty | Telefon | Ano | Developer | Telefon | validace formátu |  |
| Oprávněná osoba | Jméno a příjmení | Ano | Developer | Text | povinné | statutár / zástupce |
| Oprávněná osoba | Funkce | Ano | Developer | Text | povinné |  |
| Oprávněná osoba | E-mail | Ano | Developer | E-mail | validní formát |  |
| Oprávněná osoba | Telefon | Ano | Developer | Telefon | validace formátu |  |
| Profil developera | Zaměření (typy projektů) | Ne | Developer | Vícenásobný výběr | dle typů projektu v tomto dokumentu |  |
| Profil developera | Regiony působnosti | Ne | Developer | Vícenásobný výběr | kraje (a volitelně města) |  |
| Profil developera | Web / prezentace | Ne | Developer | URL | validní URL |  |
| Souhlasy | Souhlas s ochranou osobních údajů (GDPR) | Ano | Developer | Checkbox | musí být potvrzeno |  |
| Souhlasy | Prohlášení o oprávnění k projektu | Ano | Developer | Checkbox | musí být potvrzeno |  |

##### I.2.2 Administrátorské doplnění po registraci (není součást formuláře)

| Pole | Kdo vyplňuje | Typ | Pravidla |
|---|---|---|---|
| Stav účtu developera | Administrátor | enum | Pending / Aktivní / Pozastaven / Zablokován |
| Rámcová smlouva s platformou | Administrátor | boolean + dokument | admin značí „zasmluvněno“ mimo platformu |
| Anti-obcházející ujednání | Administrátor | boolean + dokument | admin značí „zasmluvněno“ mimo platformu |
| Výchozí splatnost developera | Administrátor | číslo (dny) | default 14 dní |

##### I.2.3 Nesrovnalosti z podkladů a jak s nimi naložit

- Word podklady uvádí u oprávněné osoby **datum narození** a některé AML položky. V MVP je to **mimo rozsah** (stejně jako u obchodníka). Pokud bude později potřeba pro compliance, přidá se jako samostatný modul.
- U právních souhlasů Word podklady uvádí „podpis“ některých dokumentů. V kanonickém procesu už počítáme s tím, že **část dokumentů se řeší mimo platformu a admin jen nastaví stav**.

---

#### I.3 Evidence investora obchodníkem (interní databáze)

**Zdroje pro pole:** `VSTUPNÍ DATA O INVESTOROVI.docx` (sekce A, D, E) + kanonická pravidla: investor **nemá přístup** do platformy, platforma investora **neověřuje**, ale investor musí obdržet informace a souhlasy k ochraně osobních údajů.

##### I.3.1 Formulář: Přidat investora

| Sekce | Pole | Povinné | Kdo vyplňuje | Typ | Validace / pravidla | Poznámka |
|---|---:|:---:|---|---|---|---|
| Identifikace | Typ investora | Ano | Obchodník | Výběr (enum) | Fyzická osoba / Právnická osoba | investor není uživatel |
| Identifikace | Jméno / název investora | Ano | Obchodník | Text | povinné |  |
| Identifikace (PO) | IČO | Podmíněně | Obchodník | Text | povinné, pokud typ = PO |  |
| Identifikace (PO) | DIČ | Ne | Obchodník | Text | volitelné |  |
| Kontakty | E-mail investora | Ano* | Obchodník | E-mail | validní formát | *povinné pro e-podpis a GDPR e-mail |
| Kontakty | Telefon investora | Ano | Obchodník | Telefon | validace formátu |  |
| Adresa | Adresa investora | Ne* | Obchodník | Text | ulice + číslo, město, PSČ, země | *povinné nejpozději před vygenerováním rezervační smlouvy |
| Preference | Minimální investice | Ne | Obchodník | Číslo (Kč) | >= 0 | matching |
| Preference | Maximální investice | Ne | Obchodník | Číslo (Kč) | >= min investice | matching |
| Preference | Preferovaná měna | Ne | Obchodník | Výběr (enum) | CZK / EUR | matching |
| Preference | Minimální výnos ročně | Ne | Obchodník | Číslo (%) | 0–100 | matching |
| Preference | Maximální délka investice | Ne | Obchodník | Číslo + jednotka | měsíce / roky | matching |
| Preference | Výplata výnosu | Ne | Obchodník | Výběr (enum) | měsíčně / kvartálně / pololetně / ročně / na konci | sladit s tiketem |
| Preference | Preferované typy projektů | Ne | Obchodník | Vícenásobný výběr | dle typů projektu v tomto dokumentu | matching |
| Preference | Preferované lokality | Ne | Obchodník | Vícenásobný výběr | kraje + města | matching |
| Preference | Preferované formy financování | Ne | Obchodník | Vícenásobný výběr | dle forem financování v tomto dokumentu | matching |
| Preference | Požadavek na zajištění | Ne | Obchodník | Výběr (enum) | Ano / Ne / Preferováno | matching |
| Preference | Maximální LTV | Ne | Obchodník | Číslo (%) | 0–100 | matching |
| Komunikace | Preferovaný způsob komunikace | Ne | Obchodník | Výběr (enum) | telefon / e-mail / osobně / kombinace |  |
| Komunikace | Frekvence kontaktu | Ne | Obchodník | Výběr (enum) | ihned / při nové nabídce / periodicky |  |

##### I.3.2 GDPR a právní komunikace s investorem (automatizované záznamy)

| Pole | Kdo vyplňuje | Typ | Pravidla |
|---|---|---|---|
| Stav souhlasu investora se zpracováním osobních údajů | Systém | enum | Neposláno / Odesláno / Souhlas udělen / Souhlas odmítnut / Odvolán |
| Datum a čas udělení souhlasu | Systém | datum a čas | ukládat včetně časové zóny |
| Důkaz souhlasu | Systém | text + odkaz | např. identifikátor e-mailu / podpisu, IP, hash dokumentu |

> Doporučení: GDPR a informační texty posílat investorovi už při vytvoření investora (nečekat až na rezervaci), aby se eliminovalo zdržení v procesu.

##### I.3.3 Nesrovnalosti z podkladů a jak s nimi naložit

- Word podklady pracují s principem „broker sbírá, admin potvrzuje“. V kanonickém nastavení platforma investora **neověřuje**. Proto:
  - investor je **okamžitě použitelný** pro rezervaci,
  - admin má právo data měnit, ale **není to schvalovací krok**.
- Word podklady obsahují AML/KYC položky včetně data narození a dokladů. V MVP jsou **mimo rozsah** a uživatel (obchodník) je do rozhraní vůbec nezadává.

---

#### I.4 Co navrhuji plnit dál (navazující krok)

Až odsouhlasíme tento registr (I.1–I.3) jako „finální“, navrhuji doplnit stejnou úroveň detailu pro:
1) **Zadání projektu** (developer i obchodník jako lead)
2) **Zadání tiketu** (včetně formy financování v kartě tiketu)
3) **Vytvoření rezervace** (včetně offline podpisů a fronty)


#### I.4 Zadání projektu (developer i obchodník)

**Zdroje pro pole:**
- Kanonická kapitola 9.3 + pravidla publikace (kap. 4.1, 5, 7)
- Word podklad: **Zadání projektu do systému.docx** (tabulky 1–6)

> Princip: Projekt může do systému zadat **developer** nebo **obchodník**. V obou případech jde o **návrh ke schválení administrátorem**. Pokud projekt zadává obchodník, admin následně mimo platformu zajistí zasmluvnění projektu s developerem.

| Sekce | Pole | Povinné | Kdo vyplňuje | Typ hodnoty | Validace / pravidlo | Poznámka (zobrazení) |
|---|---:|:---:|---|---|---|---|
| Základ | Název projektu | Ano | Developer / Obchodník | Text | Max. délka dle UI (doporučení 120 znaků) | Skryto pro ostatní obchodníky do aktivace rezervace (kap. 4.5) |
| Základ | Typ projektu | Ano | Developer / Obchodník | Výběr z nabídky | Viz kap. 8.3 (Rezidenční, Logistika, …) | Viditelné v anonymizované podobě i před aktivací |
| Základ | Stručný popis projektu | Ano | Developer / Obchodník | Text | Doporučení: 3–5 vět | Před aktivací bez identifikačních detailů |
| Lokalita | Kraj | Ano | Developer / Obchodník | Výběr z nabídky | Viz kap. 8.7.1 | Viditelné před aktivací |
| Lokalita | Město / obec | Ano | Developer / Obchodník | Text | Bez speciální validace (doporučení: našeptávač) | Viditelné před aktivací |
| Lokalita | Přesná adresa | Ne | Developer / Obchodník | Text |  | Skryto před aktivací |
| Lokalita | Popis nemovitosti / lokality | Ne | Developer / Obchodník | Text |  |  |
| Developer (lead) | Developer (pokud zadává developer) | Ano | Developer | Vazba na subjekt |  | Developer vždy vidí své údaje |
| Developer (lead) | Název společnosti developera (pokud zadává obchodník) | Ano | Obchodník | Text |  | Admin následně doplní/napáruje reálný účet developera |
| Developer (lead) | IČO developera (pokud zadává obchodník) | Ne | Obchodník | Text | Formát IČO | Pomáhá párování |
| Developer (lead) | Kontaktní osoba – jméno | Ano | Developer / Obchodník | Text |  | Skryto pro ostatní obchodníky |
| Developer (lead) | Kontaktní osoba – e-mail | Ano | Developer / Obchodník | E-mail | E-mail validace | Skryto pro ostatní obchodníky |
| Developer (lead) | Kontaktní osoba – telefon | Ano | Developer / Obchodník | Telefon | E.164 nebo český formát | Skryto pro ostatní obchodníky |
| Ekonomika (vol.) | Celkový rozpočet projektu | Ne | Developer / Obchodník | Číslo (Kč) | >=0 | Nezveřejňovat citlivé detaily před aktivací |
| Ekonomika (vol.) | Vlastní kapitál | Ne | Developer / Obchodník | Číslo (Kč) | >=0 |  |
| Ekonomika (vol.) | Cizí zdroje – typ | Ne | Developer / Obchodník | Výběr z nabídky | Banka / jiný úvěr / jiné |  |
| Ekonomika (vol.) | Cizí zdroje – výše | Ne | Developer / Obchodník | Číslo (Kč) | >=0 |  |
| Ekonomika (vol.) | Účel financování | Ne | Developer / Obchodník | Odvozené z tiketu |  | Primárně řeší tiket přes procentuální rozpad (kap. 8.6) |
| Právní (vol.) | Vlastnický stav | Ne | Developer / Obchodník | Výběr z nabídky | Vlastník / SPV |  |
| Právní (vol.) | Stavební stav | Ne | Developer / Obchodník | Výběr z nabídky | Povolení ano / ne |  |
| Právní (vol.) | Existující zástavy | Ne | Developer / Obchodník | Text |  |  |
| Právní (vol.) | Věcná břemena | Ne | Developer / Obchodník | Text |  |  |
| Harmonogram (vol.) | Harmonogram projektu | Ne | Developer / Obchodník | Text |  |  |
| Dokumenty (vol.) | Dokumenty k projektu | Ne | Developer / Obchodník | Nahrání souborů | Viz kap. 9.4 | Nejsou blokující pro publikaci (kap. 8.6.1) |
| Stav | Stav projektu | Ne (syst.) | Systém / Admin | Stav | Draft → Ke schválení → Schváleno/Zamítnuto | Admin může kdykoliv změnit |

**Nesrovnalosti z podkladů (projekt):**
- Word podklad počítá s tím, že **admin „schvaluje“ každé pole**. V kanonických pravidlech to držíme jako „admin schvaluje publikaci a může upravit data“, ale nevalidujeme faktickou správnost. (Kap. 2.1 + 4.1)


#### I.5 Zadání tiketu (developer i obchodník)

**Zdroje pro pole:**
- Kanonická kapitola 9.5 + stavy tiketu (kap. 4.1 a 4.5) + provize/pool (kap. 4.7 + 15)
- Word podklad: **Zadání projektu do systému.docx** (tabulky 7–12)

> Princip: Tiket je „konkrétní investiční nabídka“ v rámci projektu. Je to jednotka, na kterou se vážou rezervace, financování a provize.

| Sekce | Pole | Povinné | Kdo vyplňuje | Typ hodnoty | Validace / pravidlo | Poznámka (zobrazení) |
|---|---:|:---:|---|---|---|---|
| Základ | Projekt | Ano | Developer / Obchodník | Vazba | Musí existovat projekt |  |
| Základ | Název tiketu (interní) | Ne | Developer / Obchodník | Text |  | Volitelný interní název pro práci (pro obchodníka anonymizovat před aktivací) |
| Základ | Typ tiketu | Ano | Developer / Obchodník | Výběr z nabídky | Dluhový / kapitálový / hybridní | Doporučení: odvozovat z „Formy financování“ (kap. 8.4) |
| Parametry | Investiční částka (cílová) | Ano | Developer / Obchodník | Číslo + měna | >0 | Zobrazuje se na kartě tiketu |
| Parametry | Měna | Ano | Developer / Obchodník | Výběr z nabídky | CZK / EUR (default CZK) |  |
| Parametry | Doba trvání | Ano | Developer / Obchodník | Číslo | V měsících (nebo dnech) – sjednotit v UI | Doporučení: ukládat v dnech jako základ, v UI zobrazovat měsíce |
| Výnos | Očekávaný výnos ročně | Ano | Developer / Obchodník | Procenta | 0–100 (doporučení) | Zobrazuje se na kartě tiketu |
| Výnos | Výplatní profil výnosu | Ano | Developer / Obchodník | Výběr z nabídky | Měsíčně / kvartálně / pololetně / ročně / na konci |  |
| Výnos | Forma výnosu | Ne | Developer / Obchodník | Výběr z nabídky | Fixní / variabilní / jednáním | Pomáhá popisu nabídky |
| Výnos | Podíl na zisku | Ne | Developer / Obchodník | Výběr z nabídky | Ano / ne / jednáním | Typicky pro kapitálový vstup / joint venture |
| Financování | Forma financování | Ano | Developer / Obchodník | Výběr z nabídky | Viz kap. 8.4 (Zápůjčka / úvěr, Mezanin…, …) | **Musí být vidět na kartě tiketu** (UI pravidlo) |
| Financování | Využití prostředků – procenta | Ano | Developer / Obchodník | Tabulka (kategorie+%) | Součet = 100 % | Viz kap. 8.6 |
| Financování | Využití prostředků – tagy | Ne | Developer / Obchodník | Tagy |  | Volitelná doplňková kategorizace |
| Zajištění | Je investice zajištěná | Ano | Developer / Obchodník | Ano / ne |  | Zobrazení na kartě tiketu (např. „Zajištěno“) |
| Zajištění | Typ zajištění | Podmíněně | Developer / Obchodník | Vícenásobný výběr | Viz kap. 8.5 | Povinné, pokud „zajištěná = ano“ |
| Zajištění | Odhad poměru financování k hodnotě zástavy | Ne | Developer / Obchodník | Procenta | 0–100 (doporučení) |  |
| Zajištění | Popis zajištění | Ne | Developer / Obchodník | Text |  |  |
| Exit | Exit strategie | Ne | Developer / Obchodník | Výběr z nabídky | Prodej / refinancování / splacení z provozu / jiné |  |
| Rezervace | Kapacita aktivních rezervací na tiketu | Ano | Developer / Obchodník (návrh) + Admin (schválení) | Číslo | Default 3 | Viz kap. 4.5.4 a 9.5 |
| Rezervace | Lhůta pro publikaci (okno) | Ne | Admin | Číslo (dny) | Default 90 | Viz kap. 4.1 + 15.4 |
| Provize | Procento provize platformy z profinancované částky | Ano | Admin | Procenta | >0 | Nárok vzniká až po financování (kap. 4.7) |
| Provize | Rozdělení provize na tiketu (platforma / obchodník 1 / obchodník 2) | Ano | Admin | Procenta | Součet = 100 % | Admin může nastavit ručně per tiket (default 50/25/25) |
| Provize | Způsob zobrazení provize | Ano | Systém |  | Primárně v Kč, sekundárně v % | Kap. 4.7 (brand pravidlo) |
| Stav | Stav tiketu | Ne (syst.) | Systém / Admin | Stav | Draft → Ke schválení → Publikováno/Skryto/Expirované/Uzavřené | Viz kap. 4.1 |

**Nesrovnalosti z podkladů (tiket):**
- Word podklad uvádí „okamžik vzniku nároku“ jako volbu. V kanonických pravidlech je **pevně**: nárok vzniká až po profinancování (kap. 4.7).
- Word podklad uvádí „rezervační dokumenty k tiketu“. V kanonických pravidlech držíme **dokumenty primárně k projektu** (kap. 9.4) a u tiketu maximálně textové „specifické podmínky / rizika“.


#### I.6 Vytvoření rezervace (obchodník)

**Zdroje pro pole:**
- Kanonická kapitola 9.6 + proces rezervace (kap. 4.5) + podpisy mimo elektronický podpis (kap. 2.1 + 4.5)

| Krok | Pole / akce | Povinné | Kdo provádí | Typ hodnoty | Pravidlo | Poznámka |
|---:|---|:---:|---|---|---|---|
| 1 | Výběr tiketu | Ano | Obchodník | Výběr | Tiket musí být publikovaný a neuzavřený |  |
| 2 | Výběr investora | Ano | Obchodník | Výběr | Investor musí být z databáze obchodníka | Pokud investor chybí, obchodník ho založí (Příloha I.3) |
| 3 | Volba způsobu podpisu investora | Ano | Obchodník | Výběr | Elektronický podpis / podpis mimo elektronický podpis |  |
| 4A | Elektronický podpis – odeslání odkazu investorovi | Podmíněně | Systém | Odeslání e-mailu | Lhůta 48 hodin (default) | Texty notifikací viz Příloha A |
| 4B | Podpis mimo elektronický podpis – stažení PDF | Podmíněně | Obchodník | PDF soubor | Systém vygeneruje PDF z rezervační smlouvy |  |
| 5B | Podpis mimo elektronický podpis – nahrání scanu | Podmíněně | Obchodník | Nahrání souboru | Nahrání scanu = doložení podpisu investora | Doporučení: uložení času nahrání jako „čas podpisu“ |
| 6 | Čas podpisu investora | Ano (syst.) | Systém | Datum+čas | Řadí pořadí rezervací při převisu poptávky | Kap. 4.5.4 (pořadí podle času podpisu investora) |
| 7 | Stav rezervace po podpisu investora | Ano (syst.) | Systém | Stav | „Čeká na podpis developera“ nebo „Čeká na místo“ | Závisí na kapacitě tiketu |




#### I.6.1 Podpis rezervace (developer)

**Zdroje pro pole:**
- Proces rezervace (kap. 4.5), pravidla podpisů (kap. 4.5.2), konkurence na tiketu (kap. 4.5.4)

> Poznámka k identitám: v uživatelském rozhraní jsou identity stran (investor, developer, projekt) maskované až do aktivace rezervace. V samotném rezervačním dokumentu (PDF / elektronický podpis) se identity stran uvádějí, aby mohl být dokument platně podepsán.

| Pole / akce | Povinné | Kdo provádí | Typ hodnoty | Pravidlo | Poznámka |
|---|:---:|---|---|---|---|
| Výběr rezervace k podpisu | Ano | Developer | Výběr | Pouze rezervace ve stavu „čeká na podpis developera“ a „v kapacitě“ | Rezervace mimo kapacitu jsou ve frontě a developer je nepodepisuje |
| Volba způsobu podpisu developera | Ano | Developer | Výběr | Elektronický podpis / podpis mimo elektronický podpis | Výchozí: elektronický podpis |
| Elektronický podpis – odeslání odkazu developerovi | Podmíněně | Systém | Odeslání e-mailu | Lhůta 48 hodin (default) od chvíle, kdy je rezervace „v kapacitě“ | Texty notifikací viz Příloha H.3 |
| Podpis mimo elektronický podpis – stažení PDF | Podmíněně | Developer | PDF soubor | Systém vygeneruje PDF z rezervační smlouvy | Dokument obsahuje identifikaci investora |
| Podpis mimo elektronický podpis – nahrání scanu | Podmíněně | Developer | Nahrání souboru | Nahrání scanu = doložení podpisu developera | Doporučení: čas nahrání uložit jako „čas podpisu developera“ |
| Odmítnout rezervaci | Ne (akce) | Developer | Akce + důvod | Odmítnutí ukončí rezervaci a posune frontu | Povinný důvod (min. výběr + volitelný popis) |
| Stav po podpisu developera | Ano (syst.) | Systém | Stav | Po podpisu obou stran = „aktivní“ | Aktivace spouští jednání a odhalení identit v UI |
| Odhalení identit po aktivaci | Ano (syst.) | Systém | Akce | Po aktivaci: broker vidí projekt+developera; developer vidí investora + obchodníka | Kap. 4.5 bod 6 |

#### I.7 Potvrzení financování (developer)

| Pole / akce | Povinné | Kdo provádí | Typ hodnoty | Pravidlo | Poznámka |
|---|:---:|---|---|---|---|
| Výběr rezervace k potvrzení | Ano | Developer | Výběr | Pouze rezervace ve stavu „aktivní“ |  |
| Datum přijetí financí na účet developera | Ano | Developer | Datum | Od tohoto data běží lhůty (provize, splatnosti) | Viz kap. 4.6.2 |
| Skutečně profinancovaná částka | Ano | Developer (admin může opravit) | Číslo + měna | Může se lišit od cílové částky tiketu | Slouží pro výpočet provize |
| Podklady k financování | Ne | Developer | Nahrání souborů |  | Nejsou povinné (bez napojení na banku) |
| Zrušení ostatních rezervací na tiketu | Ano (syst.) | Systém | Akce | Po potvrzení financování se ostatní rezervace ukončí | Notifikace obchodníkům + důvod |



#### I.8 Fakturace obchodníka platformě (nahrání faktury)

**Účel:** obchodník vystaví platformě fakturu na provizi za úspěšně profinancovaný tiket na základě podkladů, které mu platforma poskytne.

**Kdy je možné fakturovat:**
- až po tom, co je u dané rezervace potvrzené financování developerem (kap. 4.6.2) **a zároveň**
- až po tom, co administrátor (ručně) potvrdí úhradu provize platformě od developera (bez bankovní integrace).

| Pole / akce | Povinné | Kdo provádí | Typ hodnoty | Pravidlo | Poznámka |
|---|:---:|---|---|---|---|
| Výběr provizní události k fakturaci | Ano | Obchodník | Výběr | Pouze položky ve stavu „lze fakturovat“ | Typicky 1 událost = 1 faktura |
| Podklady k fakturaci (souhrn) | Ano (syst.) | Systém | Zobrazení / PDF | Obsahuje: identifikaci platformy, identifikaci tiketu, datum financování, částku financování, částku provize obchodníka (v Kč) | Slouží jako „návod“ pro vystavení faktury |
| Číslo faktury | Ano | Obchodník | Text | Unikátní v rámci obchodníka |  |
| Datum vystavení | Ano | Obchodník | Datum |  |  |
| Datum splatnosti | Ano | Obchodník | Datum | Výchozí dle nastavení platformy (např. 14 dní) | Administrátor může dohodnout jinak |
| Fakturovaná částka (v Kč) | Ano | Obchodník | Číslo | Musí odpovídat podkladům k fakturaci (nebo vyžaduje ruční schválení administrátorem) | Primární částka je v Kč |
| Daň z přidané hodnoty (DPH) – sazba | Podmíněně | Obchodník | Výběr | Pouze pokud je obchodník plátce DPH | Sazba typicky 21 %, ale necháváme jako datové pole |
| DPH – částka | Podmíněně | Obchodník | Číslo | Musí odpovídat výpočtu z částky bez DPH | Pokud není plátce DPH, je 0 |
| Celková částka k úhradě | Ano (odvozeně) | Systém | Číslo | Součet částky bez DPH a DPH |  |
| Nahrání faktury (PDF) | Ano | Obchodník | Soubor | Povinný formát PDF | Platforma ukládá jako účetní doklad |
| Poznámka k faktuře | Ne | Obchodník | Text |  |  |
| Stav faktury | Ano (syst.) | Systém | Stav | „nahraná“ → „schválená“ → „proplacená“ | Stav mění administrátor |


#### I.9 Administrátorské nastavení parametrů (globální + na úrovni tiketu/rezervace)

**Zdroje:** kap. 6 (nastavitelné parametry), kap. 4.5.4 (kapacita), kap. 4.6 (finance), kap. 10 (provize, pool, publikační okno), kap. 17 (nastavení administrátora).

> Administrátor má právo změnit vše na platformě. Každá změna musí mít důvod a auditní stopu.

##### I.9.1 Globální parametry (výchozí hodnoty)

| Parametr | Výchozí hodnota | Kdo mění | Poznámka |
|---|---:|---|---|
| Lhůta podpisu investora | 48 hodin | Administrátor | Lze upravit i pro konkrétní rezervaci |
| Lhůta podpisu developera | 48 hodin | Administrátor | Start až když je rezervace „v kapacitě“ |
| Doba jednání po aktivaci rezervace | 30 dnů | Administrátor | Lze upravit/prodloužit pro konkrétní rezervaci |
| Publikační okno tiketu | 90 dnů | Administrátor | Lze upravit/prodloužit pro konkrétní tiket |
| Splatnost provize developer → platforma | 14 dnů | Administrátor | Lze upravit pro konkrétní tiket/projekt |
| Splatnost platforma → obchodník | 3 dny | Administrátor | Po úhradě provize platformě |
| Výchozí kapacita rezervací na tiketu | 3 | Administrátor | Per tiket lze nastavit 1–3 (nebo více, pokud dovolíte) |
| Podíl do bonusového programu Pool | 10 % z podílu platformy | Administrátor | Pouze pokud je Pool aktivní |
| Meta 1 / Meta 2 pro Pool | 100 mil. / 200 mil. Kč | Administrátor | Administrátor může měnit |
| Rozdělení Poolu pro top 3 | 50 % / 30 % / 20 % | Administrátor | Při méně než 3 kvalifikovaných se přepočítá |

##### I.9.2 Parametry na úrovni tiketu

| Parametr | Povinné | Kdo mění | Pravidlo | Poznámka |
|---|:---:|---|---|---|
| Kapacita rezervací na tiketu | Ano | Administrátor | Určuje počet rezervací „v kapacitě“ (fronta se řídí časem podpisu investora) | Výchozí 3 |
| Publikační okno – datum konce | Ano | Administrátor | Po uplynutí: tiket expirovaný | Lze prodlužovat |
| Stav tiketu (publikovaný/skrytý/expirovaný/uzavřený) | Ano | Administrátor | Administrátor může měnit ručně | Uzavřený = profinancovaný |
| Procento provize platformy (z financované částky) | Ano | Administrátor | Odpovídá smlouvě s developerem | Primární je vyjádření v Kč, ale procento je nutné pro výpočet |
| Rozdělení provize (platforma/obchodník 1/obchodník 2) | Ano | Administrátor | Součet = 100 % | Default 50/25/25, ale je to ručně nastavitelné |

##### I.9.3 Parametry na úrovni rezervace

| Parametr | Povinné | Kdo mění | Pravidlo | Poznámka |
|---|:---:|---|---|---|
| Prodloužení lhůty podpisu investora | Ne | Administrátor | Uloží se nový termín | Vždy s důvodem |
| Prodloužení lhůty podpisu developera | Ne | Administrátor | Uloží se nový termín | Vždy s důvodem |
| Prodloužení doby jednání | Ne | Administrátor | Uloží se nový termín | Vždy s důvodem |
| Ruční úprava profinancované částky (override) | Ne | Administrátor | Má dopad na provize i obrat pro Pool | Auditní stopa povinná |


#### I.10 Ruční zadání plateb (bez bankovní integrace)

**Účel:** protože platforma není napojená na banku, stavy úhrad se potvrzují ručně v systému.

| Pole / akce | Povinné | Kdo provádí | Typ hodnoty | Pravidlo | Poznámka |
|---|:---:|---|---|---|---|
| Potvrdit úhradu provize platformě od developera | Ano | Administrátor | Akce + datum + částka | Odemkne možnost fakturace obchodníků | Doporučení: uložit variabilní symbol / poznámku / přílohu |
| Datum přijetí platby platformou | Ano | Administrátor | Datum | Od tohoto data může běžet splatnost směrem k obchodníkům |  |
| Částka přijatá platformou | Ano | Administrátor | Číslo | Musí odpovídat očekávané provizi (nebo vyžaduje vysvětlení) |  |
| Potvrdit výplatu obchodníkovi | Ano | Administrátor | Akce + datum + částka | U každé faktury zvlášť |  |
| Datum odeslání platby obchodníkovi | Ano | Administrátor | Datum |  |  |
| Částka odeslaná obchodníkovi | Ano | Administrátor | Číslo | Musí odpovídat schválené faktuře |  |
| Přílohy k platbě | Ne | Administrátor | Soubor |  | Např. potvrzení o platbě |
