# Tipari.cz – Kanonický souhrn dat a pravidel

**Stav dokumentu:** sjednocení a úklid dat (bez technických kódů a bez návrhu databáze)

**Verze:** 2.0

**Datum:** 2026-01-17

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
- **Zadání projektu do systému.docx** (hlavní zdroj pro pole projektu a tiketu)
- **Registrace obchodník developer.docx** (hlavní zdroj pro registraci)
- **Vstupní data o investorovi.docx** (hlavní zdroj pro evidenci investora obchodníkem)
- **Formy financování vs zajištění.docx** (hlavní zdroj pro formy financování a typy zajištění z praxe)
- **Rozdělení provize.docx** (hlavní zdroj pro provizní pravidla)
- **Využití prostředků.docx** (hlavní zdroj pro kategorie „na co jdou peníze“)
- **Kanonický domain dictionary.docx** (referenční slovník; obsahuje rozpory s novějšími podklady – viz kapitola 11)
- **Tabulka práva a viditelnosti.docx** (referenční; obsahuje roli investora jako uživatele – to je nyní neplatné)


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
Použijeme sjednocený seznam z podkladu „Zadání projektu do systému“ + přejmenování pro srozumitelnost:
- Rezidenční
- Logistika
- Komerční
- Smíšený
- Retail
- Ubytovací zařízení
- Pozemky
- Energetika
- Ostatní

### 8.3 Doplňková kategorizace projektu (tagy)
Toto je volitelné „tagování“ (není to primární typ projektu). Slouží pro filtrování a vysvětlení účelu:
- Nákup nemovitosti
- Výstavba
- Rekonstrukce
- Refinancování
- Překlenovací financování
- Projektové financování
- Provozní financování
- Prodej projektu

> Tagy nesmí rozbíjet kanonický typ projektu. Jsou doplňkové.

### 8.4 Formy financování (kanonický seznam pro zadání tiketu)
Použijeme seznam z dokumentu „Formy financování vs zajištění“:
- Zápůjčka / úvěr
- Mezaninové financování
- Překlenovací financování
- Projektové financování (projektová společnost)
- Refinancování projektu
- Společný podnik
- Zpětný leasing
- Nabídka projektu

Poznámka:
- termín „přímá půjčka“ se v uživatelském rozhraní nepoužívá

### 8.5 Typy zajištění (kanonický minimální seznam)
Kanonický seznam z „Kanonický domain dictionary“:
- Zástavní právo k nemovitosti (1. pořadí)
- Zástavní právo k nemovitosti (2. pořadí)
- Zástava podílu
- Bankovní záruka
- Ručení mateřské společnosti
- Osobní ručení
- Postoupení pohledávek
- Vázaný účet (eskrow účet)
- Notářský zápis
- Pojištění
- Hotovostní kolaterál
- Jiné zajištění

Doporučené rozšíření (v podkladech se objevuje opakovaně, ale není v kanonickém slovníku):
- Směnka (jako doplňkové zajištění)

> Rozšíření „Směnka“ vyžaduje potvrzení právní architekturou (zda to chceme jako samostatnou volbu, nebo pouze v „Jiné zajištění“).

### 8.6 Využití prostředků – kanonický procentuální rozpad
Použijeme procentuální rozpad (součet musí být 100 %). Kategorie:
- Nákup nemovitosti
- Výstavba
- Rekonstrukce
- Refinancování závazků
- Překlenovací financování
- Projektová rezerva
- Provozní náklady projektu
- Technická příprava projektu
- Marketing a prodej
- Daňové a transakční náklady
- Splacení společníka nebo investora
- Kombinované využití

### 8.7 Měna
- Koruna česká
- Euro

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
Sjednocený tok (bez role investora v uživatelském rozhraní):
- Rozpracovaná
- Odeslaná ke kontrole platformy
- Kontrola investora platformou
- Schválená platformou
- Čeká na podpis investora
- Čeká na podpis developera
- Aktivní (po podpisu obou stran)
- Ukončená úspěšně (financováno)
- Ukončená neúspěšně (propadlá / zrušená)

### 8.13 Stav provize
- Vypočtená (čeká na úhradu developerem)
- Po splatnosti
- Uhrazená developerem
- Vyplacená obchodníkům
- Spor


---

## 9. Formuláře a vstupní data (bez technických kódů)

### 9.1 Registrace obchodníka
**Sekce A – Kontaktní údaje**
- Jméno a příjmení
- E-mail
- Telefon

**Sekce B – Subjekt**
- Typ subjektu: fyzická osoba / právnická osoba
- Firma (pokud právnická osoba)
- Identifikační číslo osoby
- Daňové identifikační číslo (volitelně)

**Sekce C – Profesní profil**
- Web (volitelně)
- Město
- Zaměření (vícenásobný výběr; sjednotit na typy projektů + volitelně tagy)

**Sekce D – Stav a úroveň (spravuje administrátor)**
- Stav ověření
- Úroveň obchodníka (Partner, Premium, Elite)
- Sloty (počítané / nastavitelné)

> Poznámka: v některých podkladech se objevuje „nárok na provizi po rozhodnutí administrátora“. To je v rozporu s kanonickým pravidlem „nárok po financování“. Zde ponecháváme pouze evidenci provizí, nikoliv vznik nároku.

### 9.2 Registrace developera
**Sekce A – Společnost**
- Název společnosti
- Identifikační číslo osoby
- Adresa sídla

**Sekce B – Kontaktní osoba**
- Jméno
- E-mail
- Telefon

**Sekce C – Profil**
- Web (volitelně)
- Zaměření (vícenásobný výběr; sjednotit na typy projektů + volitelně tagy)

**Sekce D – Stav (spravuje administrátor)**
- Stav ověření

### 9.3 Založení investora obchodníkem (evidence investorů)
Investor je uložený v profilu obchodníka. Doporučené rozdělení formuláře:

**Sekce A – Identifikace**
- Typ investora: fyzická osoba / právnická osoba
- Jméno a příjmení (u fyzické osoby) nebo název firmy (u právnické osoby)
- Identifikační číslo osoby (u právnické osoby)
- Daňové identifikační číslo (volitelně)
- Státní příslušnost (u fyzické osoby)
- Daňová rezidence

**Sekce B – Kontakt**
- E-mail
- Telefon
- Adresa
- Korespondenční adresa (volitelně)

**Sekce C – Investiční preference (párování)**
- Minimální investice
- Maximální investice
- Preferovaná měna
- Minimální očekávaný výnos ročně (pokud investor požaduje)
- Maximální délka investice
- Preferovaný typ projektu (vícenásobný výběr)
- Preferovaná fáze projektu: příprava / výstavba / provoz
- Preferované kraje (vícenásobný výběr)
- Preferované formy financování (vícenásobný výběr)
- Požadavek na zajištění: ano / ne / preferované
- Preferovaný typ zajištění (vícenásobný výběr)
- Maximální poměr financování k hodnotě zástavy (volitelně)
- Ochota podřízenosti: ano / ne / individuálně
- Tolerance spoluúčasti banky: ano / ne / individuálně
- Ochota vstupu do projektové společnosti: ano / ne

**Sekce D – Komunikace a souhlasy**
- Preferovaný způsob komunikace: telefon / e-mail / osobně / kombinace
- Frekvence kontaktu: okamžitě / při nové nabídce / periodicky

**Záměrné vyloučení:**
- datum narození investora se v této verzi **nesbírá**

> V podkladech se datum narození objevuje, ale bylo explicitně rozhodnuto „datum narození ne“. Pokud bude potřeba z důvodu souladu s právními povinnostmi, doplní se později do administrátorské části.

### 9.4 Zadání projektu developerem
Kanonická pole projektu (sjednoceno):
- Název projektu
- Typ projektu
- Lokalita (město, kraj)
- Stručný popis
- Detailní popis
- Stav připravenosti (příprava / výstavba / provoz)
- Celkový rozpočet projektu
- Vlastní zdroje developera
- Požadované externí financování
- Využití prostředků (procentuální rozpad)
- Dokumenty projektu (seznam příloh)

### 9.5 Zadání tiketu developerem
Kanonická pole tiketu (sjednoceno):
- Návaznost na projekt
- Typ tiketu: dluhový / kapitálový / mezanin / jiné
- Požadovaný objem investice
- Měna
- Očekávaný výnos ročně
- Forma výnosu: fixní / variabilní / jednáním
- Délka investice
- Frekvence výplaty výnosu
- Forma financování
- Zajištění: ano / ne
- Typ zajištění (vícenásobný výběr)
- Pořadí zástavy (pokud relevantní)
- Popis zajištění (volně)
- Maximální počet současných rezervací (limit)
- Časové limity (podpis investora, podpis developera, délka jednání) – s možností administrátorské úpravy


---

## 10. Business logika (sjednocená pravidla)

### 10.1 Sloty
- slot je kapacita obchodníka na současně aktivní rezervace
- rezervace zabírá slot až ve chvíli, kdy je ve stavu „schválená platformou“ a dále (tj. blokuje kapacitu)
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
- rozdělení musí být zadatelné administrátorem na úrovni tiketu

**Výchozí příklad rozdělení (lze změnit):**
- platforma: 50 %
- obchodník 1: 25 %
- obchodník 2: 25 %

Pravidla rolí:
- obchodník 1 = obchodník, který rezervaci vytvořil (má investora v evidenci)
- obchodník 2 = obchodník, který přivedl projekt
- pokud je obchodník 1 a 2 stejná osoba, obdrží součet obou podílů
- pokud projekt přivedl developer (nikoliv obchodník 2), může administrátor nastavit podíl obchodníka 2 na 0 %


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

