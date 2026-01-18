# Tipari.cz – Kanonický souhrn dat a pravidel

**Stav dokumentu:** sjednocení a úklid dat (bez technických kódů a bez návrhu databáze)

**Verze:** 2.2

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
- **Obchodník:** evidence investorů, rychlý výběr vhodných nabídek, rezervace slotů, přehled o stavu a provizích.
- **Developer:** přístup k relevantním investorům až po aktivaci rezervace, standardizace zadání projektu/tiketu, přehled o závazcích vůči platformě.
- **Platforma (administrátor):** kontrola rezervací, správa časových limitů, rozhodování sporů, fakturace a audit.

### 1.3 Přehled platformy
Základní tok je:
1) developer zadá projekt a tiket (nabídku)
2) obchodník vybere investora a vytvoří rezervaci
3) platforma ověří investora a schválí rezervaci
4) investor a developer podepíší rezervační smlouvu (časové limity)
5) po podpisu obou stran se rezervace aktivuje a systém odkryje identitu stran v uživatelském rozhraní
6) běží čas na jednání a financování
7) po reálném financování na účet developera vzniká nárok platformy na provizi; po úhradě provize platformě vzniká povinnost vyplatit provize obchodníkům


---

## 2. Projektový rozsah

### 2.1 Co je v rozsahu
- registrace a ověřování obchodníků a developerů
- evidence investorů obchodníkem (interní databáze na platformě)
- zadání projektu a tiketu developerem
- vyhledávání a párování investorů (podle preferencí) s tikety
- rezervace tiketu obchodníkem pro konkrétního investora
- schvalovací kroky platformy
- elektronický podpis dokumentů (rezervační smlouva, případně navazující dokumenty)
- provize (vznik nároku, výpočet, rozdělení, splatnosti)
- auditní log a incidenty
- administrace: úprava časových limitů a parametrů na úrovni tiketu

### 2.2 Co je mimo rozsah
- investor jako aktivní uživatel platformy (investor nemá přístup do uživatelského rozhraní)
- hypotéky a retailové financování pro fyzické osoby
- přímé půjčky mezi investorem a developerem jako „produkt platformy“


---

## 3. Role a zainteresované strany

### 3.1 Role uživatelů
1) **Administrátor platformy**
- spravuje uživatele, projekty, tikety, rezervace, provize, spory
- nastavuje a prodlužuje časové limity (na každém tiketu zvlášť)

2) **Obchodník (tipař / broker)**
- má vlastní databázi investorů (evidence investorů)
- vytváří rezervace pro investory
- sleduje stav rezervací a provizí

3) **Developer (realitní developer)**
- zakládá projekty a tikety
- po aktivaci rezervace získává identitu investora
- řeší financování projektu a úhradu provize platformě

### 3.2 Investor
Investor je **evidovaná osoba nebo firma**, kterou spravuje obchodník.
- investor **nemá přístup do platformy**
- investor může obdržet dokument k podpisu (elektronicky) a podepsat jej mimo platformu


---

## 4. Klíčové toky procesů a postupy

### 4.1 Registrace obchodníka a developera
1) vyplnění registračního formuláře
2) stav „čeká na ověření“
3) administrátor ověří / odmítne
4) po ověření se účet aktivuje

### 4.2 Evidence investorů obchodníkem (interní databáze)
1) obchodník založí záznam investora
2) doplní identifikační údaje a investiční preference
3) administrátor může záznam označit jako prověřený / zablokovaný (dle interních pravidel)

### 4.3 Projekt a tikety (nabídky)
1) developer založí projekt
2) developer založí tiket (nabídku financování) k projektu
3) administrátor projekt/tiket schválí a zveřejní

### 4.4 Párování investorů
- obchodník vidí tikety a filtruje podle preferencí investora
- systém může nabídnout doporučení (skóre shody), ale obchodník je ten, kdo rezervaci spouští

### 4.5 Rezervace a smlouvy
Kanonický tok rezervace:
1) obchodník vytvoří rezervaci (vybere investora + tiket)
2) administrátor provede kontrolu a schválí rezervaci
3) investor má **48 hodin** na podpis rezervační smlouvy
4) developer má **48 hodin** na podpis rezervační smlouvy
5) po podpisu oběma stranami je rezervace **aktivní**
6) při aktivaci rezervace se v uživatelském rozhraní:
   - obchodníkovi odkryje jméno projektu a developera
   - developerovi se odkryje jméno investora
7) od aktivace běží jednání s výchozím limitem **30 dnů**

> Všechny časové limity musí být upravitelné administrátorem **na úrovni konkrétního tiketu** (a v případě potřeby i prodlužitelné).

### 4.6 Financování a provize
1) během aktivní rezervace probíhá jednání
2) dojde k financování (odeslání peněz na bankovní účet developera)
3) **v okamžiku financování vzniká platformě nárok na provizi**
4) developer má výchozí splatnost **14 dnů** na úhradu provize platformě
5) po přijetí platby platformou vzniká povinnost vyplatit provize obchodníkům
6) platforma vyplácí provize obchodníkům ve výchozím limitu **3 dnů** (nastavitelné)


---

## 5. Externí závislosti

- elektronický podpis dokumentů (poskytovatel elektronického podpisu)
- e-mailové a notifikační služby
- bankovní převody (evidence přijatých plateb, párování)
- úložiště dokumentů


---

## 6. Omezení a předpoklady

- investor nepracuje v uživatelském rozhraní platformy (žádný investor účet)
- všechny časové limity musí být editovatelné administrátorem na úrovni tiketu
- provize se primárně prezentují v korunách českých; procenta jsou sekundární (pro výpočet a kontrolu)
- rezervační tok musí zachovat „maskování identity“ v uživatelském rozhraní do okamžiku aktivace


---

## 7. Datové entity a vazby (kanonický model)

Níže je přehled entit v běžné řeči (bez technických kódů).

### 7.1 Uživatelský účet
- role: administrátor / obchodník / developer
- stav účtu: čeká na ověření / ověřen / odmítnut / pozastaven

### 7.2 Profil obchodníka
- navazuje na uživatelský účet
- obsahuje identitu, firmu, zaměření, úroveň a limit slotů

### 7.3 Profil developera
- navazuje na uživatelský účet
- obsahuje údaje o společnosti a zaměření

### 7.4 Investor (záznam obchodníka)
- investor je záznam vytvořený obchodníkem
- investor nemá přístup do platformy
- obsahuje identifikační údaje a investiční preference

### 7.5 Projekt
- založen developerem
- má jeden nebo více tiketů

### 7.6 Tiket
- finanční nabídka navázaná na projekt
- klíčová data pro párování (objem, výnos, délka, zajištění, typ projektu, lokalita)

### 7.7 Rezervace
- propojuje investora a tiket
- prochází stavovým tokem (kontroly, podpisy, aktivace, jednání, financování)

### 7.8 Provize
- provize platformy vůči developerovi (vzniká po financování)
- rozdělení provize mezi platformu a obchodníky

### 7.9 Platby
- úhrada provize developerem platformě
- výplata provize obchodníkům

### 7.10 Auditní záznam
- zaznamenává klíčové změny stavů a finančních kroků


---

## 8. Kanonické seznamy povolených hodnot

### 8.1 Úrovně obchodníka a sloty
Úrovně jsou brandově ukotvené: **Partner, Premium, Elite**.

**Výchozí nastavení (pro obchodní provoz):**
- **Partner:** 10 aktivních rezervací (slotů)
- **Premium:** 25 aktivních rezervací (slotů)
- **Elite:** 50 aktivních rezervací (slotů)

Poznámky:
- slot = kapacita na **současně aktivní** rezervace (ne historické)
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


### 8.4 Formy financování (obchodní klasifikace) + formy investice (strukturální)

V podkladech se objevují dva různé „seznamy“ a míchají se dohromady. Abychom odstranili chaos, držíme dvě vrstvy:

#### 8.4.1 Forma financování (obchodní klasifikace – „jaký typ dealu to je“)
Použijeme seznam z dokumentu „Formy financování vs zajištění“ (sjednocený):
- Zápůjčka / úvěr
- Mezaninové financování
- Překlenovací financování (bridge)
- Projektové financování (projektová společnost / SPV)
- Refinancování projektu
- Společný podnik (Joint Venture)
- Zpětný leasing (sale & leaseback)
- Nabídka projektu (prodej projektu) – volitelné

Poznámky:
- Termín „přímá půjčka“ se v uživatelském rozhraní nepoužívá (brand). Pro běžné dealy používáme „Zápůjčka / úvěr“.
- „Nabídka projektu“ není investiční produkt – je to prodej (pokud ji nechceme v první verzi, vypneme).

#### 8.4.2 Forma investice (strukturální / smluvní – „jaký instrument se podepisuje“)
Toto pole je důležité pro smluvní šablony a legal texty (seniorita, konverze, podíl na zisku…). Doporučený kanonický seznam:
- Seniorní zápůjčka
- Juniorní zápůjčka
- Mezaninové financování
- Kapitálový vstup
- Joint Venture
- Podíl na zisku
- Konvertibilní zápůjčka

> V praxi: na kartě tiketu lze zobrazovat primárně **formu financování** a v detailu doplnit **formu investice**.


### 8.5 Ručení a zajištění (sjednocený katalog pro tiket)

Abychom nemíchali pojmy, rozlišujeme:
- **Ručení** = osobní/korporátní závazek třetí osoby (zvyšuje vymahatelnost).
- **Zajištění** = majetkové krytí závazku (zástava, účty, práva).
- **Procesní posílení** = notářská vykonatelnost, escrow apod.

#### 8.5.1 Kanonické typy zajištění (pro výběr v tiketu)
**Majetkové zajištění:**
- Zástavní právo k nemovitosti (1. pořadí) – primární
- Zástavní právo k nemovitosti (2. pořadí)
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



### 8.6.1 Znalecký posudek, ocenění a LTV (sjednocená pravidla)

Znalecký posudek slouží jako **orientační podklad pro posouzení zajištění a pro výpočet LTV**.
- Není to garance hodnoty, návratnosti ani výnosu.
- V UI musí být u posudku vždy jasné upozornění (viz níže).

**Typy ocenění (výběr):**
- Tržní hodnota
- Budoucí hodnota (GDV) – pouze orientačně
- Zajišťovací hodnota (konzervativní)
- Nákladová hodnota
- Kombinované ocenění

**Zdroj ocenění (transparentnost):**
- Soudní znalec (znalecký posudek)
- Licencovaný odhadce (odhad tržní hodnoty)
- Bankovní odhad (pokud existuje)
- Interní odhad developera (pouze informativně)
- Kombinace zdrojů (vždy s popisem)

**Pravidla pro LTV a práci s více posudky:**
- LTV se počítá z **nejkonzervativnější** hodnoty.
- Pokud existuje více posudků, používá se **nižší** hodnota.
- GDV nesmí být jediný podklad pro LTV.
- Pokud je zástava nemovitostí a chybí posudek, je to důvod k **blokaci publikace** (pravidlo publikace – navržené, lze upravit).

**Povinná právní formulace (copy-ready):**
> „Hodnota nemovitosti vychází ze znaleckého posudku nebo odhadu třetí strany a slouží výhradně pro orientační posouzení zajištění. Nejedná se o garanci hodnoty ani návratnosti investice.“


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


### 8.8 Stav účtu
- Čeká na ověření
- Ověřen
- Odmítnut
- Pozastaven

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
Výchozí stavový tok:
- Rozpracovaný
- Odeslaný ke schválení
- Schválený
- Zveřejněný
- Ukončený
- Zamítnutý

### 8.12 Stav rezervace

Sjednocený tok (bez investora jako přihlášeného uživatele):
- Rozpracovaná (obchodník ji zakládá)
- Odeslaná ke kontrole platformy
- Kontrola investora platformou (ověření / due diligence)
- Schválená platformou
- Čeká na podpis investora (výchozí 48 h)
- Čeká na podpis developera (výchozí 48 h)
- Aktivní (po podpisu obou stran) – od tohoto momentu běží jednání a odkrývají se identity
- Ukončená úspěšně (financováno)
- Ukončená neúspěšně (zrušená / propadlá / zamítnutá)

Doporučené důvody ukončení (pro reporting a audit):
- Propadnutí lhůty podpisu investorem
- Propadnutí lhůty podpisu developerem
- Odmítnutí ze strany developera
- Zrušení ze strany obchodníka
- Zrušení administrátorem
- Vypršení lhůty jednání


### 8.13 Stav provize (sledování a vypořádání)

Aby nevznikal falešný dojem „provize je jistá“ už při rezervaci, rozlišujeme:
- **Záznam provize (tracking)** vzniká při aktivaci rezervace (začíná se sledovat průběh).
- **Nárok platformy** vzniká až po reálném financování na účet developera.

Doporučené stavy provize:
- Sledovaná (probíhá jednání; zatím bez nároku)
- Nárok platformy vznikl (financováno)
- Čeká na úhradu developerem (splatnost; výchozí 14 dnů)
- Po splatnosti
- Uhrazena developerem platformě
- Připravena k výplatě obchodníkům
- Vyplacena obchodníkům
- Spor / reklamace

> Poznámka: primární prezentace v UI je vždy v Kč, procento je pouze doplňkový kontrolní údaj.

---

## 9. Formuláře a vstupní data (bez technických kódů)

### 9.1 Registrace obchodníka

Cíl registrace: vědět, kdo je obchodník, kdo za něj právně odpovídá a jaké má systémové limity.

**Sekce A – Základní identifikace (povinné)**
- Typ subjektu: fyzická osoba / právnická osoba
- Jméno a příjmení (u fyzické osoby)
- Název společnosti (u právnické osoby)
- Identifikační číslo osoby (u právnické osoby)
- Adresa bydliště / sídla
- E-mail (přihlašovací)
- Telefon

**Sekce B – Obchodní profil (pro párování a onboarding)**
- Typ spolupráce: nezávislý / vázaný / interní (interní logika)
- Region působnosti (kraje, případně země) – vícenásobný výběr
- Specializace (vícenásobný výběr): reality / development / energetika / ostatní / dluh / ekvita
- Typičtí investoři: retail / HNWI / institucionální (informativní)
- Průměrná velikost dealu (informativní)
- Preferovaná komunikace: telefon / e-mail / osobně / kombinace
- Web (volitelné)

**Sekce C – Právní a smluvní souhlasy (povinné)**
- Rámcová smlouva s platformou
- NDA
- Provizní podmínky
- Etický kodex
- Souhlas se zpracováním osobních údajů (GDPR)

**Sekce D – Stav a úroveň (spravuje administrátor)**
- Stav účtu (čeká na ověření / ověřen / pozastaven / zablokován)
- Úroveň obchodníka (Partner, Premium, Elite)
- Sloty (limit aktivních rezervací)

**AML / KYC (poznámka k rozsahu)**
V podkladech se objevují AML/KYC položky (doklady, PEP, sankční seznamy). V této verzi je **nezařazujeme do běžného UX/UI** – pokud je potřebujeme, řeší se jako **admin-only compliance** (nebo externě) a doplní se později.

> Poznámka: v některých starších podkladech se objevuje „nárok na provizi po rozhodnutí administrátora“. To je v rozporu s kanonickým pravidlem „nárok po financování“. Platí kanonické pravidlo.


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
- Stav účtu (čeká na ověření / ověřen / pozastaven / zablokován)

Poznámka:
- Některé dokumenty zmiňují „rámcovou smlouvu“ a „anti-obcházející ujednání“ jako krok spravovaný administrátorem mimo self-service registraci. Doporučení: evidovat tyto dokumenty u profilu developera jako „splněno/nesplněno“ + datum + kdo potvrdil.


### 9.3 Založení investora obchodníkem (evidence investorů)

Investor je uložený v profilu obchodníka. Investor **nemá přístup do platformy**.

Princip odpovědnosti:
- **Obchodník** investora zakládá a udržuje (praktická práce).
- **Administrátor** může investora označit jako ověřeného / zablokovaného a případně doplnit compliance poznámky.
- Systém vede audit změn.

**Sekce A – Identifikace (povinné minimum pro provoz)**
- Typ investora: fyzická osoba / právnická osoba
- Jméno a příjmení (FO) / název firmy (PO)
- Identifikační číslo osoby (PO)
- Daňová rezidence
- Státní příslušnost (volitelné – pokud je potřeba pro smlouvy)

**Sekce B – Kontakt**
- E-mail
- Telefon
- Adresa
- Korespondenční adresa (volitelné)

**Sekce C – Investiční preference (pro matching)**
- Minimální investice
- Maximální investice
- Preferovaná měna
- Minimální očekávaný výnos ročně (pokud investor požaduje)
- Maximální délka investice (měsíce / roky)
- Preferované typy projektů (vícenásobný výběr)
- Preferovaná fáze projektu: příprava / výstavba / provoz
- Preferované regiony (vícenásobný výběr)
- Preferované formy financování (vícenásobný výběr)
- Požadavek na zajištění: ano / ne / preferováno
- Preferované typy zajištění (vícenásobný výběr)
- Maximální LTV (volitelné)
- Ochota podřízenosti: ano / ne / individuálně
- Ochota bankovního spolufinancování: ano / ne / individuálně
- Ochota vstupu do SPV: ano / ne

**Sekce D – Komunikace a poznámky**
- Preferovaný způsob komunikace: telefon / e-mail / osobně / kombinace
- Frekvence kontaktu: ihned / při nové nabídce / periodicky
- Interní poznámka obchodníka (volitelné)

**Záměrné vyloučení (kanonické rozhodnutí):**
- datum narození investora se v této verzi **nesbírá** (ani obchodníkem, ani v běžném UX/UI)

AML / KYC (poznámka k rozsahu):
- Podklady obsahují AML/KYC položky (doklady, PEP, sankce, zdroj prostředků). Tyto položky zatím držíme jako **mimo scope běžného UX/UI**.


### 9.4 Zadání projektu developerem

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
- Návaznost na profil developera (automaticky)
- Reference developera (text / přílohy)

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
- V části 11 (viditelnost) držíme pravidlo, že broker před aktivací vidí jen „decision-first“ parametry (výnos, LTV, částka, doba, zajištění…), nikoli citlivé identifikátory projektu.


### 9.5 Zadání tiketu developerem

Kanonická pole tiketu (sjednoceno a rozšířeno):

**A) Základní parametry**
- Návaznost na projekt
- Typ tiketu: dluhový / kapitálový (ekvitní) / mezanin / jiné
- Investiční částka (objem)
- Měna

**B) Výnos a doba**
- Očekávaný výnos ročně (p.a.)
- Forma výnosu: fixní / variabilní / jednáním
- Podíl na zisku: ano / ne / jednáním
- Doba trvání: číslo + jednotka (měsíce / roky)
- Výplata výnosu: měsíční / kvartální / pololetní / roční / na konci

**C) Forma financování a struktura investice**
- Forma financování (obchodní)
- Forma investice (strukturální / smluvní) – v detailu
- Vztah tiketu k projektu: seniorní / podřízený / jiné
- Exit strategie: prodej / refinancování / splacení z provozu / jiné

**D) Ručení a zajištění**
- Je investice zajištěná: ano / ne
- Typy zajištění (vícenásobný výběr)
- Pořadí zástavy (pokud relevantní)
- Odhad LTV (volitelné – doporučeno)
- Popis zajištění (text)

**E) Proces a rezervace**
- Maximální počet současných aktivních rezervací na tiket: **výchozí 3** (brand) – admin může upravit
- Časové limity: podpis investora, podpis developera, délka jednání (výchozí hodnoty v kapitole 10.3) – admin může upravit/prodloužit

**F) Provize a obchodní podmínky**
- Provize platformy vůči developerovi: primárně v Kč (sekundárně %)
- Rozdělení provize mezi platformu / obchodníka 1 / obchodníka 2 (spravuje admin)

**G) Dokumenty k tiketu**
- Rezervační smlouva / podklady
- Investiční smlouva (pokud existuje)
- Specifické podmínky tiketu
- Rizika spojená s tiketem

---

## 10. Business logika (sjednocená pravidla)

### 10.1 Sloty
- slot je kapacita obchodníka na současně aktivní rezervace
- rezervace zabírá slot až ve chvíli, kdy je ve stavu „schválená platformou“ a dále (tj. blokuje kapacitu)
- na jednom tiketu mohou běžet paralelně více rezervací, ale výchozí limit je **maximálně 3 aktivní rezervace na tiket** (brand; admin může změnit)
- slot se uvolní při ukončení rezervace (úspěšně i neúspěšně)

### 10.2 Aktivace rezervace a viditelnost
- do aktivace rezervace jsou v uživatelském rozhraní maskovány identifikátory stran
- po podpisu obou stran:
  - obchodník uvidí název projektu a developera
  - developer uvidí jméno investora

### 10.3 Časové limity
Výchozí hodnoty:
- podpis investora: 48 hodin
- podpis developera: 48 hodin
- jednání po aktivaci rezervace: 30 dnů
- splatnost provize developerem platformě: 14 dnů
- výplata provize obchodníkům po přijetí platby platformou: 3 dny

Pravidla:
- administrátor může všechny časy prodlužovat
- administrátor může časy upravit na úrovni konkrétního tiketu

### 10.4 Provize a okamžik vzniku nároku
Kanonické pravidlo:
- obchodníkovi **nevzniká nárok na provizi** aktivací rezervace
- nárok platformy na provizi vzniká až **po reálném financování na účet developera**
- výplata provize obchodníkům se spouští až po **úhradě provize developerem platformě**

### 10.5 Rozdělení provize

- každý tiket má dohodnutou provizi platformy vůči developerovi (primárně částka v korunách českých; procento sekundárně)
- platforma se o provizi dělí s obchodníkem 1 a obchodníkem 2
- rozdělení musí být zadatelné administrátorem na úrovni tiketu a musí mít auditní stopu

**Výchozí příklad rozdělení (lze změnit):**
- platforma: 50 %
- obchodník 1: 25 %
- obchodník 2: 25 %

Pravidla rolí:
- obchodník 1 = obchodník, který rezervaci vytvořil (má investora v evidenci)
- obchodník 2 = obchodník, který přivedl projekt
- pokud je obchodník 1 a 2 stejná osoba, obdrží součet obou podílů
- pokud projekt přivedl developer (nikoliv obchodník 2), může administrátor nastavit podíl obchodníka 2 na 0 %

**Workflow a ochrany proti chaosu:**
- rozdělení provize je „admin-only“ a je možné ho mít připravené už při publikaci tiketu, ale **závazné vypořádání** se spouští až po úhradě provize developerem platformě.
- jakákoli změna rozdělení po vzniku nároku/před výplatou musí být řešena jako **nová verze** (aby šlo zpětně dohledat, podle čeho se vyplácelo).
- interní důvod rozdělení (poznámka admina) se nezobrazuje obchodníkům.

---

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
- kanonický seznam pro zadání tiketu = „Formy financování vs zajištění“
- právní instrumenty (seniorní/juniorní zápůjčka, konvertibilní zápůjčka atd.) řešit až v právní vrstvě

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


---

## 12. Jak má vypadat výsledný „souhrn dat“ (doporučení z veřejných zdrojů)

Aby byl souhrn dat dlouhodobě udržitelný a použitelný pro programátora i návrháře uživatelského rozhraní, doporučená struktura je:

### 12.1 Datový slovník

Základ je **datový slovník**: jeden přehledný seznam všech entit a jejich polí.

Pro **každé pole** u každé entity evidovat minimálně:
- **název pole** (lidský název)
- **popisek pole** (jak se zobrazuje v uživatelském rozhraní)
- **definici a význam** (ideálně bez zkratek, aby tomu rozuměl i nový člen týmu)
- **datový typ a formát** (text, číslo, datum, výběr, vícevýběr)
- **povolené hodnoty** (pokud jde o výběr)
- **omezení a závislosti** (například: součet procent musí být 100 %, datum „do“ musí být po datu „od“)
- **povinnost** (povinné / volitelné + za jakých podmínek)
- **výchozí hodnotu**
- **příklad správně vyplněné hodnoty**
- **kdo pole vyplňuje, kdo ho může měnit a kdo ho vidí**
- **důvod sběru** (účel) a **doba uchování** (pokud jde o osobní údaj)

### 12.2 Specifikace požadavků

Doporučené bloky pro dokument „specifikace požadavků“:
- **Úvod**: účel, rozsah, definice pojmů, odkazy
- **Celkový popis**: kontext produktu, třídy uživatelů, předpoklady, omezení
- **Funkční požadavky**: po modulech a scénářích (kroky, vstupy, výstupy, chybové stavy)
- **Požadavky na externí rozhraní a integrace**: elektronický podpis, e-mail, platební tok, případně propojení s dalšími systémy
- **Nefunkční požadavky**: bezpečnost, dostupnost, výkon, auditovatelnost, přístupnost, škálování
- **Přílohy**: datový slovník, seznam stavů a přechodů, matice oprávnění

### 12.3 Aplikační programové rozhraní

Pro programátora je nejefektivnější popsat rozhraní **jednotným standardem**.

Dobrá specifikace rozhraní popisuje:
- operace (co systém umí)
- vstupy (parametry, validační pravidla)
- výstupy (struktura dat)
- chybové stavy a hlášky
- autentizaci a autorizaci
- verzování

V praxi se často používá standard **OpenAPI** (standard pro popis aplikačního programového rozhraní), který sjednocuje popis operací, parametrů, těla požadavku a odpovědí.

### 12.4 Ochrana osobních údajů

Souhrn dat musí u osobních údajů vždy popsat:
- účel zpracování (proč to sbíráme)
- minimalizaci rozsahu (sbíráme jen to, co je nezbytné)
- dobu uchování
- kdo má přístup
- auditovatelnost změn

### 12.5 Přístupnost

U uživatelského rozhraní je vhodné držet pravidla přístupnosti. Obecně se doporučuje navrhovat komponenty tak, aby byly:
- **vnímatelné**
- **ovladatelné**
- **srozumitelné**
- **robustní**

### 12.6 Veřejné zdroje (k dohledání)

Níže jsou zdroje, které byly použity pro doporučení struktury. Odkazy jsou uvedeny v textové podobě, aby šly snadno dohledat:

```text
California Open Data – Data Dictionary: What to Include
Perforce – How to Write a Software Requirements Specification Document (dokument specifikace požadavků)
OpenAPI Initiative / Swagger – OpenAPI Specification
European Commission – Data protection explained
W3C – Web Content Accessibility Guidelines (pravidla přístupnosti webového obsahu)
```


## 13. Témata k doplnění v dalších iteracích

### 13.1 Dokončení datového slovníku
- pro každou entitu doplnit úplný seznam polí + povinné / volitelné
- pro každé pole doplnit validaci, příklady a účel sběru

### 13.2 Matice viditelnosti (bez investora jako uživatele)
- přehled „kdo co vidí“ před aktivací a po aktivaci
- přehled „kdo může co upravit“

### 13.3 Šablony notifikací
- notifikace na končící lhůty podpisu
- notifikace na aktivaci rezervace
- notifikace na konec lhůty jednání
- notifikace na splatnost provize developera
- notifikace na výplatu provize obchodníkovi

### 13.4 Právní dokumenty a texty
- texty rezervačních smluv (varianty)
- texty upozornění k riziku, zajištění a negarantovanému výnosu
- texty souhlasů se zpracováním osobních údajů

### 13.5 Pravidla párování investorů
- definice skóre shody
- definice minimálních filtrů (např. objem, typ projektu, zajištění)

### 13.6 Incidenty a audit
- seznam auditních událostí (co se loguje)
- typy incidentů (finanční, procesní, bezpečnostní)
- proces řešení sporů

### 13.7 Nastavení administrátora
- detailní seznam všech parametrů, které může administrátor nastavovat
- definice „override“ pravidel a povinné auditní stopy


---

## 14. Otevřené otázky k rozhodnutí

1) Chceme mít „Směnku“ jako samostatný typ zajištění, nebo pouze jako součást „Jiné zajištění“?
2) U „Nabídky projektu“: jde o formu financování, nebo samostatný typ transakce (prodej projektu)?
3) Sloty pro Premium a Elite: ponecháme výchozí 25 a 50, nebo definujeme jiné počty?
4) Potřebujeme v první verzi evidovat „poměr financování k hodnotě zástavy“ povinně, nebo volitelně?
5) Chceme držet interní mapování mezi „Typy projektů“ (9 kategorií) a starším domain dictionary (8 kategorií), nebo domain dictionary zahodíme a aktualizujeme?
6) „Nabídka projektu (prodej projektu)“: chceme ji v první verzi jako typ tiketu, nebo ji vyřadíme z UI a necháme mimo?

