# Tipari.cz – Kanonický souhrn dat a pravidel

**Stav dokumentu:** sjednocení a úklid dat (bez technických kódů a bez návrhu databáze)

**Verze:** 3.5

**Datum:** 2026-01-18

## 0. Jak s dokumentem pracovat

Tento soubor je **jediný kanonický „souhrn dat“** pro:
- programátora (co má vzniknout v systému: data, vazby, pravidla)
- návrháře uživatelského rozhraní (jaká data se sbírají a kde se zobrazují)

Cíl:
- odstranit duplicity a rozpory mezi podklady
- převést „chaotické“ výčty do jedné logické struktury
- připravit přehledné seznamy povolených hodnot (seznamy povolených hodnot)
- popsat business logiku tak, aby byla proveditelná v systému

### 0.1 Co v dokumentu záměrně zatím není
- technické názvy polí a strojové klíče
- návrh databázového schématu
- návrh konkrétních koncových bodů aplikačního programového rozhraní

Tyto části doplníme až ve chvíli, kdy budou data stabilní.

### 0.2 Hlavní zdroje, ze kterých byla data sjednocena
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


---

## 1. Shrnutí pro vedení

### 1.1 Účel a mise
Tipari.cz je platforma pro **zprostředkování investičních příležitostí mezi firmami** (obchodníci přivádějí investory, developeři přidávají projekty). Klíčovým prvkem je řízený tok rezervace a následného jednání – tak, aby:
- obchodník věděl, co má dělat a kdy
- developer viděl jen relevantní informace ve správný čas
- platforma měla kontrolu nad pravidly, časovými limity a provizemi

### 1.2 Hodnota pro uživatele (hlavní přínosy)

- **Obchodník (tipař/broker):** vidí atraktivní B2B projekty bez toho, aby platforma odhalila identitu projektu a developera před aktivací rezervace. Může rychle rezervovat slot pro svého investora a mít jasné lhůty, auditní stopu a spravedlivé vypořádání.
- **Developer:** získá přístup k distribuční síti obchodníků, ale identita investora se mu odemkne až po podpisu rezervační smlouvy oběma stranami. Tím je doloženo, že investor byl představen přes platformu.
- **Platforma (administrátor):** správa pravidel a parametrů (časové limity, kapacity rezervací, splatnosti), finanční vypořádání (provize, faktury), audit a řešení sporů. Platforma **neověřuje investory** ani **neschvaluje jednotlivé rezervace** – nastavuje rámec, eviduje průběh a může kdykoliv zasáhnout (override) s auditní stopou.

### 1.3 Přehled platformy

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

## 2. Projektový rozsah

### 2.1 Co je v rozsahu

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

### 2.2 Co je mimo rozsah
- investor jako aktivní uživatel platformy (investor nemá přístup do uživatelského rozhraní)
- hypotéky a retailové financování pro fyzické osoby
- přímé půjčky mezi investorem a developerem jako „produkt platformy“


---

## 3. Role a zainteresované strany

### 3.1 Role uživatelů

- **Administrátor platformy** (interní role): má právo změnit cokoli v systému (globální nastavení, tiket, rezervace, provize, doklady). Provádí manuální kroky (například potvrzení financování a úhrad), řeší spory/incidenty. Každý zásah musí mít důvod a auditní stopu.
- **Obchodník (tipař/broker):** spravuje vlastní profil, eviduje své investory, vytváří rezervace a sleduje jejich průběh. Může stáhnout PDF rezervační smlouvy pro fyzický podpis investora a nahrát podepsaný scan. Vystavuje faktury platformě na svůj podíl provize. Může také zadat projekt do systému ke schválení jako „lead“ (pokud developer ještě není zasmluvněn na platformě).
- **Developer:** spravuje vlastní profil, zakládá projekty a tikety, doplňuje data a dokumenty projektu, podepisuje rezervační smlouvy, komunikuje financování a hradí provizi platformě dle smlouvy.

### 3.2 Investor

Investor:
- není uživatelský účet,
- nemá přístup do platformy a nevidí „co se na platformě děje“,
- je evidován obchodníkem jako kontakt (osoba / firma) primárně kvůli komunikaci a podpisu rezervační smlouvy.

GDPR a právní minimum (požadavek na data a proces):
- investor musí obdržet informace dle GDPR (informační povinnost) a musí existovat dohledatelný záznam, že mu byly předány a že je potvrdil (typicky součástí rezervační smlouvy a/nebo samostatným dokumentem přiloženým k podpisu),
- platforma uchovává auditní stopu doručení a podpisu (elektronicky i u fyzického podpisu přes nahraný scan).

Poznámka:
- datum narození investora se nesbírá (MVP).

## 4. Klíčové toky

### 4.1 Registrace a schválení uživatelů

1) Obchodník a developer vyplní registrační formulář.
2) Administrátor provede ověření (administrativní, KYC dle interních pravidel).
3) Po schválení má uživatel přístup do platformy.

Poznámka:
- Ověřování se týká **uživatelů platformy** (obchodník, developer), nikoli investorů evidovaných obchodníkem.

### 4.2 Evidence investorů obchodníkem (interní databáze)

1) Obchodník vytvoří investora ve své databázi.
2) Vyplní údaje a investiční profil (preferované parametry, velikosti, zajištění, regiony atd.).
3) Platforma investora **neověřuje** a **neschvaluje** – investor je okamžitě použitelný pro rezervace. Administrátor může záznam kdykoliv zablokovat (např. zneužití, GDPR incident) a zablokování má auditní stopu.

### 4.3 Projekt a tikety (nabídky)

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

### 4.4 Investor matching

- Obchodník nastaví investiční profil investora.
- Platforma (matching modul) navrhne vhodné tikety.
- Obchodník rozhodne, zda investora na tiket rezervuje.

### 4.5 Rezervace a smlouvy

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

### 4.6 Financování a provize

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

## 5. Externí závislosti

- Poskytovatel elektronického podpisu (eSign) pro rezervační smlouvy a GDPR dokumenty.
- E-mail/SMS doručování výzev k podpisu a notifikací.
- Úložiště dokumentů (smlouvy, scany, podklady projektu).
- Bankovní převody probíhají mimo platformu; platforma **není napojená na banku**:
  - **financování potvrzuje developer** ručním zadáním (datum přijetí na účet),
  - **úhrady** (provize developer → platforma, výplaty platforma → obchodníci) **eviduje administrátor** ručně (s auditní stopou).

## 6. Omezení a předpoklady

- Platforma je B2B (investor nemá přístup do aplikace).
- Platforma v MVP není napojená na banky; **financování potvrzuje developer ručně** a **úhrady (provize, výplaty) eviduje administrátor ručně**.
- Časy (podpisy, jednání, splatnosti) musí být nastavitelné administrátorem globálně i pro každý tiket/rezervaci zvlášť.
- Platforma neověřuje investory evidované obchodníkem a neschvaluje jednotlivé rezervace.
- Maskování identity projektu/developera a investora je klíčový právně-obchodní mechanismus; odemknutí identit po podpisu obou stran slouží jako důkaz introdukce.

## 7. Datové entity

Toto je kanonický seznam hlavních entit. Vztahy jsou uvedeny logicky, detailní DB návrh se doplní později.

### 7.1 Uživatelský účet
- role: administrátor / obchodník / developer

### 7.2 Profil obchodníka
- navázán na uživatelský účet obchodníka
- obsahuje obchodní úroveň (Partner/Premium/Elite), počet slotů, fakturační údaje

### 7.3 Profil developera
- navázán na uživatelský účet developera
- obsahuje firemní údaje, bankovní účet pro financování, kontakty

### 7.4 Investor (záznam obchodníka)
- patří obchodníkovi (není globální)
- obsahuje identifikační a kontaktní údaje + investiční profil

### 7.5 Projekt
- standardně je vlastníkem developer
- může vzniknout i jako „lead“ vytvořený obchodníkem (před zasmluvněním developera) a po zasmluvnění se přiřadí developerovi

### 7.6 Tiket (nabídka)
- patří projektu
- obsahuje investiční parametry, kapacity rezervací, časové limity, publikační okno a provizní nastavení

### 7.7 Rezervace
- patří tiketu a investorovi (záznam obchodníka)
- vzniká vytvořením rezervace obchodníkem
- aktivuje se až po podpisu rezervační smlouvy oběma stranami
- obsahuje metodu podpisu (elektronicky / fyzicky + scan), termíny, auditní stopu a vazbu na provizi

### 7.8 Provize
- provize platformy vůči developerovi (vzniká až po profinancování)
- rozdělení provize mezi platformu a obchodníky (role 1 / role 2)

### 7.9 Platby / úhrady
- evidence financování (převod na účet developera) – ruční zadání developerem (administrátor může override)
- evidence úhrady provize developer → platforma – ruční zadání
- evidence výplaty obchodníkům platforma → obchodník – ruční zadání

### 7.10 Auditní záznam
- loguje klíčové události (stavové změny, podpisy, prodloužení termínů, ruční zásahy, exporty)

### 7.11 Pool bonus program (volitelné – pokud aktivní)
- akumulace části podílu platformy do poolu (výchozí 10 %)
- periodické vyhodnocení (půlrok) a výplata brokerům dle pravidel
- evidence příspěvků a výplat (audit, reporty)

## 8. Kanonické seznamy povolených hodnot

### 8.1 Úrovně obchodníka a sloty
Úrovně jsou brandově ukotvené: **Partner, Premium, Elite**.

**Výchozí nastavení (pro obchodní provoz):**
- **Partner:** 10 aktivních rezervací (slotů)
- **Premium:** 25 aktivních rezervací (slotů)
- **Elite:** 50 aktivních rezervací (slotů)

Poznámky:
- slot = kapacita na **současně otevřené (běžící)** rezervace (tj. rezervace v procesu včetně čekání na podpis i aktivních; ne historické)
- počty slotů musí být upravitelné administrátorem
- úrovně nejsou „provizní pool“; jsou to úrovně přístupu a kapacity

### 8.2 Typy projektů (kanonický seznam)

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


### 8.3 Doplňková kategorizace projektu (tagy)

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


### 8.4 Forma financování (kanonické pole na tiketu)

V podkladech se míchají pojmy „forma financování“ a „forma investice“ (instrument). Pro Tipari.cz (MVP) používáme **jedno pole**: **Forma financování**.

- Toto pole se zadává u tiketu.
- Toto pole se zobrazuje **i na kartě tiketu** (v seznamu tiketů) a v detailu tiketu.

**Kanonický seznam (finální):**
- Zápůjčka / úvěr
- Mezaninové financování
- Kapitálový vstup
- Společný podnik (Joint Venture)
- Konvertibilní zápůjčka
- Zpětný leasing (sale & leaseback)
- Nabídka projektu (prodej projektu) – volitelné

Poznámky:
- Termín „přímá půjčka“ se v uživatelském rozhraní nepoužívá (brand). Pro běžné dealy používáme „Zápůjčka / úvěr“.
- Pokud budeme později potřebovat detailní rozlišení instrumentu (seniorita, konverze, kapitálový vstup…), doplníme samostatným polem v další verzi nebo to budeme držet jen v právních dokumentech/podmínkách tiketu.

### 8.5 Ručení a zajištění (sjednocený katalog pro tiket)

Abychom nemíchali pojmy, rozlišujeme:
- **Ručení** = osobní/korporátní závazek třetí osoby (zvyšuje vymahatelnost).
- **Zajištění** = majetkové krytí závazku (zástava, účty, práva).
- **Procesní posílení** = notářská vykonatelnost, escrow apod.

#### 8.5.1 Kanonické typy zajištění (pro výběr v tiketu)
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

#### 8.5.2 Pravidla zadání a kombinací
- Pokud je vybrána „Zástavní právo k nemovitosti“, musí být vždy uvedeno **pořadí** (1./2./jiné).
- „Bez zajištění“ (pokud se vůbec povolí) se **nesmí kombinovat** s jinými typy.
- U zástav se doporučuje uvádět LTV (volitelně/později povinně podle pravidel publikace).

> Poznámka k právní jistotě: v části 11 (nesoulady) držíme „Směnku“ jako bod k potvrzení právní architekturou (zda má být samostatná volba, nebo pouze popis v „Jiné zajištění“).


### 8.6 Využití prostředků – kanonický procentuální rozpad

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



### 8.6.1 Znalecký posudek, ocenění a poměr financování k hodnotě zástavy

- Znalecký posudek / odhad hodnoty zástavy je **volitelný** podklad (příloha u projektu).
- V první verzi systém **neblokuje** zveřejnění tiketu jen proto, že posudek chybí.
- Pokud je u tiketu vybráno zajištění typu „Zástavní právo k nemovitosti“, je doporučeno (ne povinné) evidovat:
  - hodnotu zástavy (dle posudku/odhadu),
  - poměr financování k hodnotě zástavy (informativně pro obchodníka a interně pro matching).

Poznámka:
- Platforma podklady **neověřuje**; slouží jako evidence pro audit a komunikaci.

### 8.7 Měna
- Koruna česká (CZK)
- Euro (EUR)

### 8.7.1 Lokalita – kraje (kanonický seznam pro filtry)

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

### 8.8 Stav účtu
- Čeká na ověření
- Aktivní (ověřen)
- Pozastaven
- Zamítnut
- Zablokován


### 8.9 Stav investora v evidenci obchodníka
- Nový
- Aktivní
- Neaktivní
- Zablokovaný

### 8.10 Stav projektu
Výchozí stavový tok:
- Rozpracovaný
- Odeslaný ke schválení
- Schválený
- Zveřejněný
- Uzavřený
- Zamítnutý

### 8.11 Stav tiketu

- Rozpracovaný
- Odeslaný ke schválení
- Schválený
- Zveřejněný
- Skrytý (ručně skryto administrátorem)
- Expirovaný (uplynulo publikační okno)
- Uzavřený (profinancovaný; referenční / read-only)
- Zamítnutý

### 8.12 Stav rezervace

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

### 8.13 Stav provize (sledování a vypořádání)

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

## 9. Formuláře a vstupní data (bez technických kódů)

### 9.1 Registrace obchodníka

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

### 9.2 Registrace developera

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


### 9.3 Založení investora obchodníkem (evidence investorů)

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

### 9.4 Zadání projektu (developer nebo obchodník)

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

### 9.5 Zadání tiketu developerem

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

## 10. Business logika (kanonické rozhodnutí)

### 10.1 Sloty obchodníka, kapacita tiketu a pravidla konkurence

#### Sloty obchodníka (limit obchodníka)

- Sloty definují, kolik **současně rozpracovaných / běžících rezervací** může mít obchodník (napříč všemi tikety).
- Levely obchodníka (dle brandu):
  - **Partner** – 10 slotů
  - **Premium** – obchodně nastavené (admin)
  - **Elite** – obchodně nastavené (admin)

Poznámka: konkrétní sloty pro Premium/Elite se drží v administraci a lze je upravovat.

#### Kapacita tiketu (limit tiketu)

- Kapacita tiketu říká, kolik rezervací může být současně „v kapacitě“.
- **Do kapacity se započítávají rezervace až od podpisu investora** (až do jejich ukončení), typicky:
  - „podepsáno investorem – v kapacitě (čeká na podpis developera)“,
  - „rezervace aktivní“,
  - „jednání probíhá“.
- Rezervace před podpisem investora kapacitu tiketu neblokují.

#### Pravidla konkurence (fronta podle podpisu investora)

- Tiket se **nezamyká** pro jednoho obchodníka. O stejný tiket se mohou ucházet různí obchodníci současně.
- O pořadí rozhoduje **čas podpisu investora** (u fyzického podpisu čas nahrání scanu).
- Systém udržuje pořadí všech investorem podepsaných rezervací a do kapacity pustí vždy **prvních N** (N = kapacita tiketu).
- Pokud některá rezervace v kapacitě odpadne (např. developer odmítne podpis, vyprší lhůty, rezervace je zrušena), systém automaticky posune další rezervaci z pořadí do kapacity.
- **Jakmile dojde k financování jedné rezervace, ostatní rezervace na tiketu automaticky zanikají** (včetně těch ve frontě).

### 10.2 Aktivace rezervace a odemknutí identity

- Identita projektu a developera je obchodníkovi skryta až do aktivace rezervace.
- Identita investora je developerovi skryta až do aktivace rezervace.
- Aktivace nastává až po podpisu rezervační smlouvy oběma stranami.
- Po aktivaci se v UI odemkne:
  - obchodníkovi: název projektu + jméno developera,
  - developerovi: identita investora,
  - developerovi: jméno obchodníka (důkaz introdukce přes platformu).

### 10.3 Časové limity a SLA (globálně + per tiket/rezervaci)

Výchozí hodnoty:
- Podpis investora: 48 hodin
- Podpis developera: 48 hodin
- Jednání po aktivaci: 30 dní
- Splatnost provize developer → platforma: 14 dnů
- Výplata obchodníkovi po úhradě platformě: 3 dny

Pravidlo:
- Administrátor může všechny časy měnit a prodlužovat, a to **globálně** i **pro konkrétní tiket/rezervaci**.

### 10.4 Kdy vzniká nárok na provizi

- Obchodníkovi **nevzniká** nárok na provizi v okamžiku aktivní rezervace.
- Nárok platformy na provizi vzniká až po **reálném profinancování** (převod prostředků na účet developera).
- Nárok obchodníka na výplatu vzniká až po **úhradě provize platformě**.

### 10.5 Provize v Kč vs v %

Brandové pravidlo:
- Primární vyjádření provize je vždy **v Kč**.
- Pro interní výpočty a audit se může držet i **%**, ale v rozhraní je sekundární.

### 10.6 Fakturace a výplaty

- Developer hradí provizi platformě dle smlouvy (splatnost výchozí 14 dní).
- Obchodník vystavuje fakturu platformě na základě informací poskytnutých platformou.
- Platforma platí obchodníkovi v SLA (výchozí 3 dny) po úhradě provize od developera.

### 10.7 Bonusový program „Pool“ (nově)

Cíl:
- Motivovat obchodníky k výkonu a dlouhodobé aktivitě.

Kanonická pravidla (aktuální):

- Platforma odvádí do poolu **10 % ze svého podílu** z provize.
  - Podíly obchodníků se tím **nekrátí** (pool jde čistě na vrub podílu platformy).
- Pool se vyhodnocuje každých **6 měsíců**.

#### 10.7.1 Obrat pro účely poolu

- „Obrat“ = součet **profinancovaných částek** tiketů v daném období.
- Obrat se počítá v **korunách českých**.
  - Pokud je tiket v eurech, administrátor musí mít možnost zadat (nebo potvrdit) kurz použitý pro přepočet.
- Obrat se započítává obchodníkovi, pokud je u tiketu evidovaný jako:
  - **obchodník 1** (přivedl investora),
  - nebo **obchodník 2** (přivedl projekt), pokud je obchodník 2 skutečně obchodník (nikoli developer).
- Pokud je obchodník stejná osoba jako obchodník 1 i obchodník 2, obrat se započítá **jen jednou**.

#### 10.7.2 Dvě mety (férové vyhodnocení)

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

### 10.8 Doba zveřejnění projektu a tiketů

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

### 10.9 Změny tiketu po zveřejnění (žádost developera)

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

## 11. Zjištěné duplicity a nesoulady (a návrh řešení)

### 11.1 Typy projektů
**Rozpor:**
- „Kanonický domain dictionary“ uvádí 8 typů (včetně „průmyslový“ a „hospitality“)
- „Zadání projektu do systému“ uvádí 9 typů (včetně retail a energetika)
- „Vstupní data o investorovi“ uvádí zkrácený seznam (6 typů)

**Návrh sjednocení (v tomto dokumentu už použito):**
- kanonický seznam = 9 typů podle „Zadání projektu do systému“
- zkrácený seznam u investora je pouze podmnožina
- „Kanonický domain dictionary“ aktualizovat (nebo udržovat mapování)

### 11.2 Formy financování
**Rozpor:**
- existují minimálně tři různé seznamy forem

**Návrh sjednocení (v tomto dokumentu už použito):**
- kanonický seznam pro zadání tiketu = seznam v kapitole 8.4 (Forma financování)
- detailní parametry instrumentu (seniorita, konverzní poměr, struktura kapitálového vstupu) se řeší v podmínkách tiketu a ve smluvní dokumentaci

### 11.3 Směnka jako zajištění
**Rozpor:**
- některé podklady obsahují směnku jako explicitní typ zajištění
- kanonický slovník ji neobsahuje

**Návrh:**
- přidat „Směnka“ jako volitelný typ zajištění po právním potvrzení
- do té doby používat „Jiné zajištění“ + volný popis

### 11.4 Investor jako uživatel
**Rozpor:**
- tabulka práv a viditelnosti počítá s investorem jako přihlášeným uživatelem
- kanonické rozhodnutí: investor přístup nemá

**Návrh:**
- vyřadit investora z matice oprávnění v uživatelském rozhraní
- ponechat investora pouze jako evidovanou entitu a příjemce dokumentů k podpisu

### 11.5 Datum narození investora
**Rozpor:**
- v podkladech se objevuje datum narození investora
- kanonické rozhodnutí: datum narození se nesbírá

**Návrh:**
- datum narození neimplementovat v první verzi
- pokud bude později vyžadováno, doplnit jako administrátorské pole (s odůvodněním sběru a omezením přístupu)

### 11.6 Fakturace provizí (kdo fakturuje komu)
**Rozpor:**
- pilotní materiály obsahují variantu, kdy „obchodník vystaví fakturu“ a developer ji přímo hradí (obchodník fakturuje developerovi)
- kanonické obchodní nastavení platformy je ale postavené na tom, že provizi vůči developerovi uplatňuje platforma a následně ji rozděluje obchodníkům

**Kanonické rozhodnutí (aktuální):**
- developer hradí provizi platformě (podle smlouvy platforma ↔ developer)
- obchodník vystavuje fakturu **platformě** na svoji část provize (podle podkladů od platformy)

**Dopad do implementace:**
- v uživatelském rozhraní obchodníka musí existovat krok „vyfakturovat provizi“ + nahrání dokladu
- v administraci musí existovat evidence faktur (číslo, vystavil, komu, částka, splatnost, stav, soubor) + možnost označit jako zaplacené




### 11.7 Konkurence a rezervace na tiketu

**Nesoulad v podkladech:**
- některé starší verze popisovaly, že se tiket po první aktivaci „zamkne“ pro ostatní obchodníky.

**Kanonické pravidlo (finální):**
- tiket se **nezamyká** na jednoho obchodníka,
- každý tiket má kapacitu (např. 1 / 2 / 3), kolik rezervací může být současně „v kapacitě“,
- **přednost získává ten, kdo dřív zajistí podpis investora** (pořadí se určuje podle data a času podpisu investora; u fyzického podpisu podle času nahrání scanu),
- podpis developera pořadí **neovlivňuje**,
- pokud rezervace v kapacitě odpadne (developer odmítne, vyprší lhůta, zrušení), systém automaticky posune další rezervaci z fronty,
- jakmile jedna rezervace dosáhne financování, ostatní rezervace na tiketu automaticky zanikají.

## 12. Datový slovník (MVP, bez technických kódů)

Tato kapitola převádí „formuláře“ a „entity“ do jednotného **datového slovníku**, aby:
- programátor přesně věděl, jaká data musí existovat a jak se validují,
- návrhář uživatelského rozhraní věděl, co je povinné, co je citlivé a kdo to vidí.

Poznámky:
- Používáme **lidské názvy polí** (bez strojových klíčů).
- „Kdo vidí“ je myšleno pro **uživatelské rozhraní platformy**; dokumenty pro podpis mohou obsahovat více údajů.

### 12.0 Společné konvence napříč systémem

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

### 12.1 Uživatelský účet

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

### 12.2 Profil obchodníka

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

### 12.3 Profil developera

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

### 12.4 Investor (záznam v evidenci obchodníka)

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

### 12.5 Projekt

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

### 12.6 Tiket / nabídka

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

### 12.7 Rezervace

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

### 12.8 Provize a vypořádání

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

### 12.9 Doklady a platby (praktická vrstva)

Kanonické nastavení pro provize:
- developer hradí provizi platformě (platforma je příjemce)
- obchodník (tipař/broker) fakturuje platformě svoji část provize (platforma je odběratel)

Doporučení:
- systém eviduje **platební události** (kdo, komu, kdy a kolik zaplatil) i **doklady** (faktury) jako soubory. Je to důležité pro audit, účetnictví a řešení sporů.

#### 12.9.1 Typy faktur v systému
1) Faktura platformy developerovi (pohledávka platformy za provizi)
2) Faktura obchodníka platformě (závazek platformy za vyplacení podílu)

> Poznámka: v pilotních materiálech se objevuje varianta, kde obchodník fakturuje developerovi. Tato varianta se v kanonickém procesu nepoužívá.

#### 12.9.2 Minimální datová pole faktury (společná vrstva)

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

#### 12.9.3 Vazba na proces (stručně)
- Faktura platformy developerovi: vzniká po financování a slouží jako podklad pro úhradu provize platformě (pokud fakturaci vůči developerovi používáme).
- Faktura obchodníka platformě: vzniká po úhradě provize developerem platformě; platforma poskytne podklady k fakturaci, obchodník vystaví doklad a platforma ho uhradí.

---

### 12.10 Auditní záznam

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

### 12.11 Spor / incident

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Typ incidentu | výběr | ano | administrátor | administrátor | procesní / finanční / právní / bezpečnostní |
| Závažnost | výběr | ano | administrátor | administrátor | nízká / střední / vysoká / kritická |
| Dotčené záznamy | odkazy | ano | administrátor | administrátor | rezervace, tiket, provize… |
| Popis | text | ano | administrátor | administrátor | |
| Stav řešení | výběr | ano | administrátor | administrátor | otevřeno / v řešení / vyřešeno / uzavřeno |
| Přiděleno | odkaz na administrátora | volitelné | administrátor | administrátor | |
| Výsledek | text | volitelné | administrátor | administrátor | |


### 12.12 Pool bonus program (datový model)

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

### 12.13 Žádost o úpravu tiketu (developer → administrátor)

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

## 13. Matice viditelnosti a oprávnění (MVP)

### 13.1 Skupiny viditelnosti dat

Pro jednoduchost dělíme data na skupiny:

1) **Veřejná data tiketu (decision-first)** – výnos, částka, doba, zajištění, LTV, kraj, typ projektu.
2) **Identita projektu** – název projektu, jméno developera, přesná adresa, dokumenty s identifikátory.
3) **Identita investora** – jméno/název, kontakty.
4) **Identita obchodníka** – jméno/název obchodníka (odemkne se developerovi po aktivaci).

### 13.2 Kdo co vidí podle stavu rezervace

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

### 13.3 Oprávnění (akce)

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

## 14. Notifikace (MVP)

### 14.1 Události pro notifikace

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

### 14.2 Šablony zpráv (poznámky)

- Texty musí být neutrální, bez marketingových frází.
- U podpisů musí být jasné termíny a následky expirace.
- U investora je nutné připojit GDPR informace a kontakty na správce údajů.

## 15. Pravidla publikace a blokátory dat

### 15.1 Co blokuje zveřejnění tiketu

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

### 15.2 Co blokuje odeslání rezervace k podpisu investorovi

- Neexistuje volný slot obchodníka (obchodník je na svém limitu otevřených rezervací).
- Tiket není ve stavu **Zveřejněný** (je rozpracovaný, čeká na schválení, je skrytý nebo expirovaný).
- Tiket je **uzavřený (profinancovaný)** nebo administrátorem deaktivovaný pro nové rezervace.
- Investor nemá vyplněný minimální kontakt (e-mail) pro podpis.
- Chybí potvrzení obchodníka, že má právní důvod investora evidovat a kontaktovat.

Poznámka:
- Pokud je na tiketu aktuálně obsazená kapacita rezervací, rezervaci je stále možné odeslat k podpisu. Po podpisu investora se rezervace zařadí do pořadí (fronty) a do kapacity se dostane až uvolněním místa.

### 15.3 Validace procent „Využití prostředků“

Pokud developer vyplňuje procentuální rozpad využití prostředků:
- součet musí být přesně 100 %,
- každá položka musí být v rozsahu 0–100 %,
- systém má nabízet kontrolu a nápovědu (například upozornění, že součet je 98 %).


---

## 16. Audit a incident management (kanonické minimum)

### 16.1 Co musí být auditováno

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

### 16.2 Incidenty

Typy incidentů:
- procesní (například spor o to, kdo přivedl projekt)
- finanční (například pozdní úhrada provize, reklamace výplaty)
- právní (například obcházení platformy)
- bezpečnostní (například neoprávněný přístup)

Každý incident musí mít:
- typ, závažnost, popis, stav řešení, zodpovědnou osobu a výsledek.


---

## 17. Administrace a nastavení

### 17.1 Globální parametry

- Default čas podpisu investora (48 h)
- Default čas podpisu developera (48 h)
- Default čas jednání (30 dní)
- Default splatnost provize developer → platforma (14 dnů)
- Default SLA výplaty obchodníkovi po úhradě platformě (3 dny)
- Default maximální počet aktivních rezervací na tiket (3)
- Default pravidlo konkurence na tiketu: „sdílené sloty podle podpisu investora“
- Default doba zveřejnění tiketu (publikační okno) – 90 dní (upravitelné a prodlužovatelné)

### 17.2 Per tiket parametry

Administrátor může pro každý tiket nastavit/změnit:
- čas podpisu investora,
- čas podpisu developera,
- čas jednání,
- splatnost provize,
- SLA výplaty,
- kapacitu rezervací a pravidlo konkurence,
- dobu zveřejnění tiketu.

### 17.3 Práva administrátora

- Administrátor může změnit jakékoli údaje (override).
- Každá změna musí být logována do auditu s důvodem.

### 17.4 Nastavení Pool programu

Pokud je Pool aktivní, administrátor nastavuje:
- procento z podílu platformy do poolu (výchozí 10 %),
- délku období (výchozí 6 měsíců),
- metu 1 (kvalifikace pro podílové rozdělení) a metu 2 (vítěz bere vše),
- podíly pro podílové rozdělení (výchozí 50/30/20) a pravidlo přepočtu, když se kvalifikuje méně obchodníků,
- pravidlo převodu při 0 kvalifikovaných (výchozí 50 % platforma / 50 % převod do dalšího období),
- pravidla výpočtu obratu (započítání pro obchodníka 1 i 2; jednou, pokud je to stejná osoba) a pravidla přepočtu měn.

## 18. Matching investorů (specifikace bez kódu)

Matching investorů je funkce pro obchodníka: pomáhá mu rychle vybrat, kteří jeho investoři se nejlépe hodí k danému tiketu.

Důležité zásady:
- Matching je **doporučení**, nikoli investiční poradenství.
- Investor nemá účet na platformě, matching je čistě interní nástroj obchodníka (a administrátora).
- Matching musí respektovat maskování identity projektu před aktivací rezervace (obchodník pracuje primárně s parametry pro rozhodnutí).

### 18.1 Vstupy do matchingu

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

### 18.2 Pravidla matchingu (MVP)

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

### 18.3 Výstupy matchingu

V rozhraní obchodníka doporučujeme tyto výstupy:
- **Seznam investorů** se slovním hodnocením: „Vysoká shoda / Střední shoda / Nízká shoda / Mimo kritéria“.
- U každého investora **důvod shody** (například: „částka v rozsahu, kraj odpovídá, investice zajištěná“).
- Možnost filtrovat investory (například podle minima, regionu, typu projektu).

Poznámka:
- Pokud je investor „Nový“ nebo „Neaktivní“, systém ho v matchingu buď nezobrazuje, nebo zobrazí až po zapnutí filtru.

### 18.4 Ochrana dat a přístupová práva

- Investor v evidenci je viditelný pouze:
  - vlastníkovi (obchodníkovi),
  - administrátorovi.
- Ostatní obchodníci investory nevidí.

---

## 19. Dokumenty, smlouvy a elektronické podpisy

### 19.1 Typy dokumentů

- Smlouva developer ↔ platforma (provizní podmínky, splatnosti).
- Smlouva obchodník ↔ platforma (fakturace, výplata provizí, podmínky práce s investorem).
- Rezervační smlouva investor ↔ developer (generovaná systémem).
- GDPR informace a souhlasy pro investora (součást smlouvy nebo samostatný dokument k podpisu).

### 19.2 Elektronický podpis

- Výchozí varianta pro rezervační smlouvy.
- Odkaz k podpisu se posílá:
  - investorovi e-mailem,
  - developerovi (oprávněné osobě) e-mailem a současně je dostupný i v jeho uživatelském účtu.
- Audit log musí obsahovat: kdo, kdy, jak podepsal.

### 19.3 Fyzický podpis investora (PDF + scan)

- Obchodník si nechá systémem vygenerovat PDF rezervační smlouvy.
- Investor podepíše fyzicky mimo platformu.
- Obchodník nahraje scan do rozpracované rezervace.
- Nahrání scanu posune rezervaci do fáze „čeká na podpis developera“.
- Platforma obsah scanu neověřuje; scan slouží jako evidence a pro audit.

### 19.4 Fyzický podpis developera (PDF + scan)

- Developer si stáhne (nebo nechá vygenerovat) PDF rezervační smlouvy.
- Developer podepíše fyzicky mimo platformu.
- Developer nahraje scan do rezervace (alternativně může scan nahrát administrátor).
- Nahrání scanu posune rezervaci do stavu „podepsáno developerem“ (a pokud je podepsáno i investorem, rezervace se aktivuje).
- Platforma obsah scanu neověřuje; scan slouží jako evidence a pro audit.

## 20. Otevřené otázky a rozhodnutí k potvrzení

### 20.1 Rozhodnutí uzavřená v této verzi

- Pool program: zavedené dvě mety (meta 1 = kvalifikace pro podílové rozdělení; meta 2 = vítěz bere vše), příspěvek do poolu je z podílu platformy (podíly obchodníků se nekrátí).
- Doba zveřejnění tiketů: výchozí publikační okno je 90 dní; administrátor může upravovat a prodlužovat.
- Podpisní toky: umožněn fyzický podpis (PDF + nahrání scanu) jak pro investora, tak i pro developera.

### 20.2 Otevřené otázky

1) Doklady a audit
- Jaké přílohy budou povinné při ručním potvrzení financování a úhrad (například potvrzení o převodu)?


## 21. Stavové automaty a automatizace

Tato kapitola je praktická pro programátora (implementace stavů, přechodů a časovačů) a zároveň pomáhá návrháři uživatelského rozhraní (kdy se co zobrazuje a kdy je co povoleno).

Důležité principy:
- **Časové parametry** (lhůty podpisů, jednání, splatnosti, doba zveřejnění) jsou nastavitelné administrátorem a mohou být **prodlužovány**.
- Platforma v první verzi **neověřuje** obsah dokumentů ani platby; slouží jako evidence a audit.
- Po **profinancování** tiketu je tiket uzavřen a ostatní rezervace se automaticky ukončí.

### 21.1 Stavový automat tiketu

#### 21.1.1 Stavy tiketu (kanonický seznam)

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

#### 21.1.2 Přechody tiketu (zjednodušeně)

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

### 21.2 Stavový automat rezervace

#### 21.2.1 Stavy rezervace (kanonický seznam)

| Stav rezervace | Co to znamená | Jak se do stavu dostane | Viditelnost / dopad |
|---|---|---|---|
| Rozpracovaná | Obchodník připravuje rezervaci pro investora | vytvoření rezervace obchodníkem | Identita investora je interní pro obchodníka; developer nevidí. |
| Čeká na podpis investora | Rezervační smlouva byla odeslána investorovi (nebo se čeká na nahrání scanu) | odeslání k podpisu / generace dokumentu | Běží lhůta podpisu investora (výchozí 48 hodin). |
| Podepsáno investorem (ve frontě) | Investor podepsal, ale rezervace ještě není v kapacitě tiketu | podpis investora v okamžiku, kdy je kapacita obsazená dřívějšími podpisy | Rezervace je ve frontě, čeká na uvolnění kapacity; developer zatím nepodepisuje. |
| V kapacitě tiketu (čeká na podpis developera) | Rezervace je v top N dle času podpisu investora a čeká na podpis developera | automaticky po vstupu do kapacity (po podpisu investora nebo po posunu ve frontě) | Developer může podepsat elektronicky nebo nahrát scan. |
| Aktivní | Podepsal investor i developer; rezervace se aktivovala | podpis developera (a investor už podepsal) | Od tohoto okamžiku se v rozhraní odemkne identita stran a začne běžet jednání (výchozí 30 dní). |
| Financováno | Developer potvrdil přijetí financování na bankovní účet (včetně data) | ruční potvrzení developerem (administrátor může upravit) | Od data financování běží splatnosti a provize. Zároveň se uzavře tiket. |
| Ukončeno neúspěšně | Rezervace skončila bez financování | automaticky (lhůty) nebo ručně (zrušení) nebo uzavření tiketu jiným investorem | Důvod musí být evidován (například nepodepsal investor, nepodepsal developer, neprofinancováno včas, profinancováno jiným investorem). |

#### 21.2.2 Fronta a kapacita rezervací na tiketu

- Každý tiket má **kapacitu rezervací** (například 3). Kapacitu lze nastavit administrátorem (a měnit i během života tiketu).
- Do kapacity se počítají rezervace **od okamžiku podpisu investora**.
- Pořadí ve frontě je určeno **časem podpisu investora**.
- V kapacitě jsou vždy **první N rezervací** (N = kapacita). Pokud některá rezervace zanikne, pořadí se **přepočítá** a další rezervace se posune do kapacity.
- Developer podpisuje jen rezervace, které jsou **v kapacitě**.

Důležité: podpis developera **nemění pořadí**. O pořadí rozhoduje vždy podpis investora.

#### 21.2.3 Ukončení ostatních rezervací po profinancování

Jakmile je u jedné rezervace potvrzeno „Financováno“:
- tiket se uzavře,
- všechny ostatní rezervace (včetně těch, které měly podepsáno investorem) se automaticky nastaví na „Ukončeno neúspěšně“ s důvodem „profinancováno jiným investorem“,
- obchodníci jsou informováni, že financování proběhlo jiným investorem.

### 21.3 Stavový automat provize a vypořádání

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

### 21.4 Automatizace a časovače

Níže je seznam automatizovaných kroků, které systém provádí bez ruční akce (neobsahuje texty notifikací, pouze události).

#### 21.4.1 Časové expirace

- **Expirace podpisu investora:** pokud investor nepodepíše do termínu, rezervace přejde do „Ukončeno neúspěšně“ (důvod: nepodepsal investor).
- **Expirace podpisu developera:** pokud developer nepodepíše do termínu (počítáno od okamžiku, kdy se rezervace dostane do kapacity), rezervace přejde do „Ukončeno neúspěšně“ (důvod: nepodepsal developer) a systém posune další rezervaci z fronty do kapacity.
- **Expirace jednání:** pokud neproběhne financování do termínu jednání, rezervace přejde do „Ukončeno neúspěšně“ (důvod: neprofinancováno včas) a systém posune další rezervaci z fronty do kapacity.
- **Expirace tiketu:** po uplynutí publikačního okna systém přepne tiket do stavu „Expirovaný“.

#### 21.4.2 Přepočet pořadí a kapacity

Systém přepočítává pořadí (frontu) a to, kdo je v kapacitě, při těchto událostech:
- podpis investora (nový vstup do fronty),
- ukončení rezervace (jakýkoliv důvod),
- změna kapacity tiketu administrátorem.

Při vstupu rezervace do kapacity systém:
- vytvoří požadavek na podpis developera,
- nastaví termín podpisu developera dle nastavení tiketu,
- odešle notifikaci developerovi (a informativně obchodníkovi).

#### 21.4.3 Přechody po financování

- po potvrzení „Financováno“ systém uzavře tiket a ukončí ostatní rezervace,
- vytvoří / aktualizuje provizní záznam (včetně splatností),
- spustí následné lhůty (splatnost developer → platforma, následně výplata obchodníkům).

#### 21.4.4 Bonusový program Pool

Automatizace pro Pool program:
- při každé úhradě provize platformě systém vypočte příspěvek do Poolu (podíl z podílu platformy) a přičte jej do Poolu aktuálního pololetí,
- na konci pololetí systém připraví pořadí obchodníků dle obratu (součet profinancovaných částek) a určí výplatu:
  - pokud první obchodník dosáhl meta 2 (například 200 milionů korun), získá celý Pool,
  - jinak se Pool rozdělí mezi první tři obchodníky, kteří splnili meta 1 (například 100 milionů korun) podle poměru 50/30/20,
  - pokud meta 1 nesplní nikdo, polovina Poolu zůstane platformě a polovina se převede do dalšího pololetí.

Poznámka:
- Částky (mety) a pravidla musí být konfigurovatelné administrátorem (minimálně jako globální parametry).

---

## Příloha A: Doporučení pro udržování dokumentace (inspirace z veřejných zdrojů)

Aby dokumentace nezastarala a šla dlouhodobě udržovat, doporučujeme:
- držet „jeden kanonický soubor“ pro data a pravidla (tento dokument),
- mít datový slovník jako hlavní zdroj pravdy (entita → pole → validace → viditelnost),
- udržovat stavové toky a notifikace jako samostatné tabulky,
- každou změnu pravidel verzovat a držet audit.



---

## Příloha B: Uživatelské rozhraní – hierarchie informací a rozhodovací údaje

Tato příloha je určena hlavně pro návrháře uživatelského rozhraní a pro programátora (aby chápal, proč některá data existují a kdy se zobrazují).

### B.1 Základní princip: „nejdřív rozhodnutí, pak detail“

Obchodník se rozhoduje rychle. V seznamu tiketů a v rychlém náhledu musí být okamžitě jasné:
1) **kolik si vydělá** (provize v korunách českých),
2) **jaký je výnos** (výnos za rok),
3) **jaké je krytí** (zajištění a poměr financování k hodnotě zástavy),
4) **jak rychle musí jednat** (dostupnost a časové lhůty).

### B.2 Doporučené pořadí informací na kartě tiketu (seznam tiketů)

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

### B.3 Maskování identity (před aktivací rezervace)

Před aktivací rezervace obchodník nevidí:
- název projektu,
- jméno developera,
- přesnou adresu,
- dokumenty s identifikátory.

Doporučené texty v rozhraní (bez marketingových frází, neutrálně):
- „Název projektu se zobrazí po aktivaci rezervace.“
- „Jméno developera se zobrazí po aktivaci rezervace.“

### B.4 Stavové štítky (uživatelské rozhraní)

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

### B.5 Prázdné stavy a chybové stavy (návrh)

- „Zatím zde nejsou žádné tikety, které odpovídají vašim filtrům.“
- „Nemáte volný slot pro rezervaci. Kontaktujte administrátora nebo zvyšte úroveň.“
- „Tento tiket již není dostupný.“

### B.6 Doporučené filtry (obchodník)

- Typ projektu
- Kraj
- Investiční částka (rozsah)
- Výnos (rozsah)
- Doba trvání (rozsah)
- Forma financování
- Zajištění (ano/ne + typy)
- Poměr financování k hodnotě zástavy (rozsah)
- Dostupnost (jen dostupné / vše)



## Příloha C: Administrátorské rozhraní – navigace, seznamy, sloupce, filtry, akce

Tato příloha shrnuje, jak by mělo vypadat administrátorské rozhraní v první verzi, aby šly procesy efektivně řídit.

### C.1 Doporučená struktura navigace

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

### C.2 Rezervace (seznam)

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

### C.3 Financování a provize

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

### C.4 Spory a incidenty

- Fronta sporů podle priority
- Časová osa událostí
- Připojené dokumenty
- Rozhodnutí administrátora (s auditní stopou)



## Příloha D: Právní rámec a minimalizace rizik

Tato příloha není právní dokument, ale shrnuje principy, které mají dopad na data a procesy.

### D.1 Základní principy

- Platforma neposkytuje investiční doporučení.
- Platforma není stranou investiční dohody mezi investorem a developerem.
- Platforma eviduje introdukci a řídí rezervaci tak, aby byla dohledatelná a aby šlo spravedlivě vypořádat provize.

### D.2 Doporučené smluvní vztahy (aktuální kanonické nastavení)

- Developer ↔ Platforma: smlouva o využití platformy + provizní podmínky (platforma má nárok na provizi).
- Obchodník ↔ Platforma: smlouva o využití platformy + podmínky výplaty provize (obchodník vystavuje fakturu platformě).
- Investor ↔ Developer: rezervační smlouva + následná investiční dokumentace.

Poznámka k podkladům:
- v některých materiálech se objevuje varianta, kde provizní smlouva běží přímo mezi obchodníkem a developerem. To je v rozporu s kanonickým procesem fakturace „obchodník → platforma“ a je potřeba to držet jako historickou variantu.

### D.3 Ochrana proti obcházení

Doporučení do smluv a podmínek:
- uznání auditních záznamů platformy jako důkazu introdukce,
- zákaz obcházení po definovanou dobu,
- sankční ustanovení,
- povinnost součinnosti při sporu.

### D.4 Ochrana osobních údajů

- Investor není uživatelský účet.
- Držíme minimalizaci osobních údajů (pouze to, co je nezbytné pro komunikaci a podpisy).
- Datum narození investora se v první verzi nesbírá.
- Investor musí obdržet GDPR informace (informační povinnost) a musí existovat auditní záznam potvrzení (typicky podpisem rezervační smlouvy a/nebo samostatného dokumentu).
- Identita investora se developerovi odemkne až po podpisu obou stran (minimalizace rizika obcházení a důkaz introdukce).




## Příloha E: Nesrovnalosti v podkladech a naše kanonické rozhodnutí

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



## Příloha F: Témata pro další doplnění (aby byl systém plně předatelný)

- Finální texty notifikací (e-mail i v aplikaci) včetně právních upozornění.
- Finální rozhodnutí k DPH u faktur (platforma ↔ developer, obchodník ↔ platforma).
- Zaokrouhlování a práce s haléři (interní přesnost vs zobrazování).
- Detailní seznam auditních událostí (co se loguje) včetně exportů.
- Detailní specifikace výpočtu obratu pro Pool a přesné parametry kvalifikace.
- Pravidla expirace a re-publikace tiketů (publikační okno).

