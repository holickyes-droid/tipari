# Tipari.cz – Kanonický souhrn dat a pravidel

**Stav dokumentu:** sjednocení a úklid dat (bez technických kódů a bez návrhu databáze)

**Verze:** 2.5

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
5) po přijetí platby platformou se provize obchodníků stává **způsobilá k vyfakturování** (systém vygeneruje podklady k fakturaci)
6) obchodník vystaví platformě fakturu na svou část provize (podle podkladů) a nahraje ji do platformy (PDF)
7) platforma uhradí fakturu obchodníkovi ve výchozím limitu **3 dnů** od přijetí a schválení faktury (nastavitelné)


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
- stav účtu: čeká na ověření / aktivní (ověřen) / zamítnut / pozastaven / zablokován

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
- Stav účtu (čeká na ověření / aktivní (ověřen) / pozastaven / zamítnut / zablokován)
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
- Stav účtu (čeká na ověření / aktivní (ověřen) / pozastaven / zamítnut / zablokován)

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
- Preferovaný typ výnosu: fixní / variabilní / individuálně
- Preferovaná výplata výnosu: měsíčně / čtvrtletně / pololetně / ročně / na konci
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
- V části 13 (Matice viditelnosti a oprávnění) držíme pravidlo, že broker před aktivací vidí jen „decision-first“ parametry (výnos, LTV, částka, doba, zajištění…), nikoli citlivé identifikátory projektu.


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

### 10.6 Fakturace obchodníků a výplata provizí

Kanonické rozhodnutí:
- **Developer hradí provizi platformě.**
- **Obchodník (tipař/broker) vystavuje fakturu platformě** na svoji část provize, a to na základě informací (podkladů), které mu platforma poskytne.

Praktický workflow:
1) Developer uhradí provizi platformě (vzniká splatná pohledávka platformy podle smlouvy a nastavené splatnosti).
2) Platforma po přijetí platby vypočte částky pro obchodníka 1 a obchodníka 2 (dle rozdělení na tiketu) a připraví **podklady k fakturaci**.
3) Systém notifikuje obchodníka/obchodníky: „Provize připravena k vyfakturování“.
4) Každý obchodník vystaví fakturu platformě a nahraje ji do platformy (PDF) + doplní základní metadata faktury.
5) Administrátor fakturu zkontroluje a označí jako schválenou k úhradě (nebo vrátí k doplnění). Každý zásah administrátora musí mít auditní stopu.
6) Platforma uhradí fakturu obchodníkovi v nastavitelném termínu. **Výchozí lhůta úhrady (servisní úroveň): 3 dny od přijetí a schválení faktury.**

Podklady k fakturaci (co platforma poskytne obchodníkovi):
- identifikace tiketu a provize (interní identifikátor, název tiketu/projektu pro účely dokladu)
- částka k vyfakturování v korunách českých (primární)
- doplňkově procentuální podíl (sekundární kontrolní údaj)
- datum vzniku nároku (datum financování + datum úhrady developerem platformě)
- doporučená splatnost (výchozí 3 dny; může měnit administrátor)
- identifikátor platby (například variabilní symbol / reference platby)
- fakturační údaje platformy (název, adresa, identifikační číslo osoby, daňové identifikační číslo – pokud relevantní)

Důležité provozní poznámky:
- Pokud jsou na tiketu dva obchodníci, vystavují typicky **dvě samostatné faktury** (každý na svou část).
- Pokud obchodník není plátcem daně z přidané hodnoty, fakturuje bez daně; systém proto musí evidovat status plátce a případně daňové identifikační číslo obchodníka.
- Obchodník nesmí nabýt dojmu, že mu vznikl nárok na provizi už aktivací rezervace. Nárok na výplatu se odvíjí až od **reálné úhrady provize developerem platformě**.


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



---


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
| Preferované formy financování | vícenásobný výběr (viz kapitola 8.4.1) | volitelné | obchodník | administrátor, obchodník | |
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

### 12.6 Tiket

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Návaznost na projekt | odkaz | ano | systém | administrátor, developer, obchodník | |
| Investiční částka | číslo | ano | developer | administrátor, developer, obchodník | „decision-first“ údaj |
| Měna | výběr: koruna česká / euro | ano | developer | administrátor, developer, obchodník | |
| Očekávaný výnos ročně | číslo (v procentech) | ano | developer | administrátor, developer, obchodník | |
| Doba trvání | číslo + jednotka | ano | developer | administrátor, developer, obchodník | měsíce nebo roky |
| Výplata výnosu | výběr | volitelné | developer | administrátor, developer, obchodník | měsíčně/kvartálně/… |
| Forma financování (obchodní) | výběr (viz kapitola 8.4.1) | ano | developer | administrátor, developer, obchodník | |
| Forma investice (strukturální) | výběr (viz kapitola 8.4.2) | volitelné | developer | administrátor, developer; obchodník v detailu | |
| Je investice zajištěná | výběr: ano / ne | ano | developer | administrátor, developer, obchodník | |
| Typy zajištění | vícenásobný výběr (viz kapitola 8.5.1) | podmíněně | developer | administrátor, developer, obchodník | povinné pokud „zajištěná = ano“ |
| Pořadí zástavy | výběr / číslo | volitelné | developer | administrátor, developer, obchodník | relevantní pro zástavu |
| Poměr financování k hodnotě zástavy | číslo (v procentech) | volitelné | developer | administrátor, developer, obchodník | poměr investice k hodnotě zástavy |
| Popis zajištění | text | volitelné | developer | administrátor, developer, obchodník | |
| Maximální počet aktivních rezervací na tiket | číslo (celé) | ano | administrátor | administrátor, developer | výchozí 3 |
| Čas podpisu investora | časový limit | ano | administrátor | administrátor | výchozí 48 hodin |
| Čas podpisu developera | časový limit | ano | administrátor | administrátor | výchozí 48 hodin |
| Délka jednání po aktivaci | časový limit | ano | administrátor | administrátor | výchozí 30 dnů |
| Provize platformy – částka | číslo (koruna česká) | ano | administrátor | administrátor; developer informativně | primární údaj pro UI |
| Provize platformy – procento | číslo (v procentech) | volitelné | administrátor | administrátor | sekundární kontrola |
| Rozdělení provize | procenta (součet 100) | ano | administrátor | administrátor | platforma/broker 1/broker 2 |
| Sekundární obchodník (přivedl projekt) | odkaz na obchodníka | volitelné | administrátor | pouze administrátor | pokud vyplněno, může vzniknout nárok na podíl obchodníka 2 |
| Stav tiketu | výběr (viz kapitola 8.11) | ano | developer / administrátor | administrátor, developer, obchodník (pokud zveřejněn) | |

**Doporučená doplnění pro finance a praxi:**
- bankovní účet developera pro zaslání financování (může být na úrovni tiketu, pokud se liší projekt od projektu)
- referenční symboly platby (variabilní symbol, zpráva pro příjemce) pro párování

---

### 12.7 Rezervace

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Návaznost na tiket | odkaz | ano | systém | administrátor, obchodník, developer | |
| Obchodník (iniciátor) | odkaz | ano | systém | administrátor; obchodník; developer po aktivaci | v UI developera maskovat před aktivací |
| Investor (záznam) | odkaz | ano | obchodník | administrátor, obchodník | developer až po aktivaci |
| Stav rezervace | výběr (viz kapitola 8.12) | ano | systém | administrátor, obchodník, developer | |
| Datum a čas vytvoření | datum a čas | ano | systém | administrátor, obchodník | |
| Datum a čas schválení platformou | datum a čas | volitelné | administrátor | administrátor | |
| Časový limit pro podpis investora | datum a čas | ano | systém | administrátor | vypočítáno z nastavení tiketu |
| Časový limit pro podpis developera | datum a čas | ano | systém | administrátor | vypočítáno z nastavení tiketu |
| Datum a čas podpisu investora | datum a čas | volitelné | externí podpis / administrátor | administrátor | potvrzeno poskytovatelem podpisu |
| Datum a čas podpisu developera | datum a čas | volitelné | externí podpis / administrátor | administrátor | |
| Datum aktivace rezervace | datum a čas | volitelné | systém | administrátor, obchodník, developer | aktivace = podpis obou stran |
| Lhůta jednání do | datum a čas | ano | systém | administrátor | výchozí 30 dnů, admin prodlužuje |
| Datum financování (na účet developera) | datum a čas | volitelné | administrátor | administrátor | spouští nárok na provizi |
| Důkaz financování | soubor / poznámka | volitelné | administrátor | administrátor | například potvrzení z banky |
| Důvod ukončení | výběr + text | volitelné | administrátor | administrátor | pro reporting |
| Poznámka obchodníka | text | volitelné | obchodník | administrátor, obchodník | |
| Poznámka administrátora | text | volitelné | administrátor | pouze administrátor | |
| Dokument k podpisu – rezervační smlouva | odkaz na dokument | ano | systém / administrátor | administrátor | generuje se při schválení |

---

### 12.8 Provize a vypořádání

Provize se skládá ze dvou rovin:
1) **nárok platformy vůči developerovi** (vzniká až po financování),
2) **výplata obchodníkům** (vzniká až po úhradě provize platformě).

| Pole | Typ / formát | Povinnost | Vyplňuje | Kdo vidí | Validace / poznámka |
|---|---|---|---|---|---|
| Základ provize (profinancovaná částka) | číslo | ano (pro úspěch) | administrátor | administrátor | vychází z reality financování |
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


---

## 13. Matice viditelnosti a oprávnění (bez investora jako uživatele)

Cíl: jednoznačně popsat, **kdo co vidí a co může dělat** v jednotlivých stavech rezervace.

### 13.1 Skupiny dat pro maskování

Aby se to dalo dobře navrhnout i implementovat, dělíme data do skupin:
1) **Parametry pro rozhodnutí**: částka, výnos, doba, typ projektu, kraj, zajištění, poměr financování k hodnotě zástavy.
2) **Identita projektu a developera**: název projektu, název firmy developera, přesná adresa, dokumenty projektu.
3) **Identita investora**: jméno / firma investora, kontaktní údaje.
4) **Interní poznámky a důvody**: interní poznámky brokerů a administrátorů, důvody zamítnutí.

### 13.2 Přehled viditelnosti podle stavu rezervace

| Stav rezervace (zjednodušeně) | Obchodník vidí | Developer vidí | Administrátor vidí |
|---|---|---|---|
| Rozpracovaná / odeslaná ke kontrole | (1) + své (3) | (1) + (2) | vše |
| Schválená platformou, čeká na podpisy | (1) + své (3) | (1) + (2) | vše |
| Aktivní (po podpisu obou stran) | (1) + (2) + své (3) | (1) + (2) + (3) | vše |
| Ukončená úspěšně / neúspěšně | archiv dle oprávnění | archiv dle oprávnění | vše + audit |

Vysvětlení:
- Obchodník před aktivací nevidí identitu projektu a developera (skupina 2).
- Developer před aktivací nevidí identitu investora v uživatelském rozhraní (skupina 3).

### 13.3 Oprávnění (kdo může co dělat)

| Akce | Obchodník | Developer | Administrátor |
|---|---|---|---|
| Registrovat se / upravit profil | ano | ano | ano (správa) |
| Vytvořit investora v evidenci | ano | ne | ano (správa/override) |
| Vytvořit projekt a tiket | ne | ano | ano (správa/override) |
| Odeslat projekt/tiket ke schválení | ne | ano | ano |
| Zveřejnit tiket | ne | ne | ano (po schválení) |
| Vytvořit rezervaci | ano | ne | ano |
| Upravit rozpracovanou rezervaci | ano | ne | ano |
| Schválit / zamítnout rezervaci | ne | ne | ano |
| Prodlužovat časové limity | ne | ne | ano |
| Označit financování jako proběhlé | ne | ne | ano (nebo admin po ověření) |
| Nastavit rozdělení provize | ne | ne | ano |
| Označit provizi jako uhrazenou | ne | ne | ano |
| Vystavit a nahrát fakturu platformě (výplata provize) | ano | ne | ano (správa/override) |
| Označit fakturu jako uhrazenou | ne | ne | ano |
| Vyplatit provize obchodníkům | ne | ne | ano |


---

## 14. Notifikace a systémové zprávy (návrh)

Notifikace dělíme na:
- notifikace v aplikaci (pro přihlášené uživatele),
- e-mailové notifikace,
- e-mailové výzvy k podpisu (pro investora, který nemá účet).

### 14.1 Události, které musí mít notifikaci

1) **Registrace obchodníka / developera**
- administrátor: „Nová registrace ke schválení“
- uživatel: „Registrace přijata – čeká na ověření“

2) **Schválení / zamítnutí účtu**
- uživatel: „Účet ověřen“ nebo „Účet zamítnut“ (s bezpečnou formulací)

3) **Založení a schválení tiketu**
- developer: „Tiket odeslán ke schválení“
- developer: „Tiket schválen / zamítnut“
- obchodníci (volitelné): „Nový tiket odpovídá vašim filtrům“

4) **Rezervace – klíčové milníky**
- obchodník: „Rezervace odeslána ke kontrole“
- administrátor: „Nová rezervace ke kontrole investora“
- investor: „Výzva k podpisu rezervační smlouvy“ (přes e-mail)
- developer: „Rezervace čeká na váš podpis“
- obchodník + developer: „Rezervace aktivní – odemknuty identity“

5) **Lhůty a jejich vypršení**
- upozornění před vypršením podpisu investora / developera
- upozornění před koncem lhůty jednání
- notifikace o vypršení a ukončení rezervace

6) **Financování a provize**
- developer: „Financování potvrzeno – vznikl nárok platformy na provizi“
- developer: „Splatnost provize“ + připomínky
- obchodník: „Podklady k fakturaci jsou připraveny“ (provize připravena k vyfakturování)
- administrátor: „Faktura od obchodníka nahrána – ke kontrole“ (pokud probíhá ruční schvalování)
- obchodník: „Faktura přijata / schválena“ (volitelně)
- obchodník: „Provize vyplacena“

### 14.2 Návrh textů (stručné šablony)

**E-mail investoru – výzva k podpisu**
- Předmět: „Tipari.cz – podpis rezervační smlouvy“
- Text: „Dobrý den, prosíme o podpis rezervační smlouvy. Odkaz k podpisu: … Lhůta pro podpis: …“

**E-mail developerovi – podpis**
- Předmět: „Tipari.cz – rezervace čeká na váš podpis“
- Text: „Rezervace je schválena platformou a čeká na váš podpis. Lhůta: …“

**E-mail obchodníkovi – aktivace**
- Předmět: „Tipari.cz – rezervace aktivní“
- Text: „Rezervační smlouva je podepsána oběma stranami. Nyní se vám zobrazují plné údaje projektu a developera.“

**E-mail developerovi – splatnost provize**
- Předmět: „Tipari.cz – splatnost provize za tiket“
- Text: „Na základě profinancování tiketu vznikl nárok platformy na provizi. Splatnost: … Částka: …“

Poznámky:
- Texty musí být jednoduše editovatelné administrátorem (minimálně v souborech šablon).
- Notifikace musí respektovat maskování identity v uživatelském rozhraní.


---

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

### 15.2 Co blokuje odeslání rezervace ke kontrole

Rezervace musí mít:
- vybraný tiket
- vybraného investora z evidence obchodníka
- potvrzení obchodníka, že údaje investora jsou správné a má oprávnění je evidovat

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
- označení financování jako proběhlé
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

## 17. Nastavení administrátora (kanonický seznam parametrů)

### 17.1 Globální parametry

- výchozí čas pro podpis investora (hodiny)
- výchozí čas pro podpis developera (hodiny)
- výchozí délka jednání (dny)
- výchozí splatnost provize developerem platformě (dny)
- výchozí doba pro úhradu faktury obchodníka po přijetí a schválení dokladu (dny)
- výchozí doba na vystavení faktury obchodníkem po poskytnutí podkladů (dny, doporučeno)
- povinnost nahrát doklad před výplatou provize (ano/ne)
- režim schvalování dokladů (ruční schválení / automatické)
- výchozí maximální počet aktivních rezervací na tiket
- výchozí limity slotů pro úrovně Partner / Premium / Elite

### 17.2 Parametry na úrovni tiketu

Administrátor může u každého tiketu přepsat:
- maximální počet aktivních rezervací
- všechny časové limity (podpisy, jednání, splatnosti)
- provizi platformy (částku i procento)
- rozdělení provize (platforma / obchodník 1 / obchodník 2)

### 17.3 Pravidla pro „override“ (zásah administrátora)

Každý zásah administrátora musí:
- vyžadovat důvod (povinné pole „proč“),
- vytvořit auditní záznam,
- být dohledatelný v historii tiketu a rezervace.


---

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

Platforma stojí na tom, že klíčové kroky jsou kryté dokumenty a auditní stopou.

### 19.1 Kanonické typy dokumentů

**A) Smluvní dokumenty pro přístup na platformu**
- rámcová smlouva obchodník ↔ platforma
- rámcová smlouva developer ↔ platforma
- dohoda o mlčenlivosti (pokud je samostatně)
- potvrzení provizních podmínek a etického kodexu

**B) Dokumenty pro konkrétní tiket / transakci**
- dokument k rezervaci (rezervační smlouva investor ↔ developer)
- provizní ujednání platforma ↔ developer (buď rámcové, nebo příloha k tiketu)

**C) Doklady k platbám (prakticky potřebné)**
- faktura platformy developerovi (provize)
- faktura obchodníka platformě (výplata podílu na provizi)
- potvrzení o přijetí/odeslání platby (interní záznam)

### 19.2 Rezervační smlouva (investor ↔ developer)

Požadované vlastnosti:
- musí být generovatelná ze systémových dat (strany, částka, lhůty, identifikace tiketu/projektu)
- musí podporovat podpis investora i developera v definovaných časových limitech
- po podpisu musí být uložen podepsaný dokument a metadata podpisu (datum a čas, identifikace podpisového procesu)

Zásadní pravidlo:
- rezervace se v systému stává „aktivní“ až po podpisu obou stran.

### 19.3 Provizní dokumenty a vypořádání

Kanonické pravidlo:
- nárok platformy na provizi vzniká až po reálném financování na účet developera.

Doporučení:
- mít jednotné místo, kde administrátor zadá:
  - profinancovanou částku
  - částku provize v korunách českých
  - splatnost
  - rozdělení provize

### 19.4 Elektronický podpis

Externí závislost:
- poskytovatel elektronického podpisu musí umět:
  - poslat výzvu k podpisu e-mailem,
  - evidovat čas podpisu,
  - vrátit podepsaný soubor,
  - poskytovat dohledatelné metadata.

Interní pravidla:
- administrátor musí umět proces podpisu znovu odeslat (například když adresát nedostal e-mail).
- před podpisem lze dokument znovu vygenerovat; po podpisu už ne (pouze dodatky).




## 20. Otevřené otázky k rozhodnutí (aktualizováno)

1) Chceme mít „Směnku“ jako samostatný typ zajištění, nebo pouze jako součást „Jiné zajištění“?
2) „Nabídka projektu“: jde o formu financování (prodej projektu), nebo samostatný typ transakce mimo běžné tikety?
3) Sloty pro Premium a Elite: ponecháme výchozí 25 a 50, nebo definujeme jiné počty?
4) Potřebujeme v první verzi evidovat poměr financování k hodnotě zástavy povinně, nebo volitelně?
5) Fakturace vůči developerovi: bude platforma v první verzi vystavovat developerovi fakturu / daňový doklad automaticky, nebo bude úhrada probíhat jen na základě smlouvy a výzvy k platbě?
6) Jakým způsobem budeme potvrzovat „financování na účet developera“ (manuální potvrzení administrátorem, nahrání důkazu, nebo pozdější bankovní integrace)?
7) Bankovní účty: budeme držet bankovní účet developera na úrovni profilu, nebo na úrovni každého tiketu?
8) Retence dat: jak dlouho uchovávat osobní údaje investorů v evidenci obchodníka po ukončení spolupráce?
9) Doklad obchodníka: bude pro výplatu podílu na provizi povinné nahrát fakturu jako soubor (například PDF), nebo bude stačit zadat číslo dokladu a potvrdit odeslání?


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
- „Ke schválení platformou“
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
- Schválit / zamítnout
- Prodloužit termín (u podpisu / jednání)
- Znovu odeslat výzvu k podpisu
- Označit financování jako proběhlé
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
- Finální rozhodnutí k dani z přidané hodnoty u faktur (platforma ↔ developer, obchodník ↔ platforma).
- Zaokrouhlování a práce s haléři (interní přesnost vs zobrazování).
- Přesné rozhodnutí, zda obchodník může zakládat projekt jako „lead“, nebo to dělá pouze administrátor a developer.
- Detailní seznam auditních událostí (co se loguje) včetně exportů.

