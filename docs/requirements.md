# Krav — Recipes

## Översikt

Recipes är en webbaserad applikation för matplanering. Användare kan skapa och hantera recept, bygga inköpslistor och planera veckans måltider i en kalender.

Applikationen riktar sig till hushåll där flera personer delar på matplaneringen. Inloggning sker via Google, vilket gör det enkelt för familjemedlemmar att komma åt samma recept och listor utan att hantera separata lösenord.

## Sammanfattning

| ID     | Beskrivning                                               | Status |
|--------|-----------------------------------------------------------|--|
| US-001 | Logga in med Google OAuth                                 | ✅ |
| US-002 | Delade data för alla inloggade användare                  | ✅ |
| US-003 | Skapa recept                                              | ✅ |
| US-004 | Redigera recept                                           | ✅ |
| US-005 | Ta bort recept med bekräftelsedialog                      | ✅ |
| US-006 | Visa receptlista i bokstavsordning                        | ✅ |
| US-007 | Filtrera receptlista på kategori                          | ✅ |
| US-008 | Visa receptdetalj med ingredienser och instruktioner      | ✅ |
| US-009 | Välj skalfaktor i planeringsläge                          | ✅ |
| US-010 | Välj inköpslista i planeringsläge                         | ✅ |
| US-011 | Lägg till / ta bort ingrediens i inköpslista från recept  | ✅ |
| US-012 | Summera mängder om ingrediens redan finns i listan        | ✅ |
| US-013 | Välj dag för tillagning via datepicker i receptvy         | ✅ |
| US-014 | Markera ingredienser och steg som klara i tillagningsläge | ✅ |
| US-015 | Spara tillagningsprogress persistent                      | ✅ |
| US-016 | Återställ alla markeringar med "Avmarkera allt"           | ✅ |
| US-017 | Skapa inköpslista                                         | ✅ |
| US-018 | Byta namn på inköpslista                                  | ✅ |
| US-019 | Ta bort inköpslista                                       | ✅ |
| US-020 | Lägga till varor manuellt i inköpslista                   | ✅ |
| US-021 | Redigera vara i inköpslista                               | ✅ |
| US-022 | Ta bort vara från inköpslista                             | ✅ |
| US-023 | Bocka av vara (persistent)                                | ✅ |
| US-024 | Töm lista — återställ avbockningsstatus                   | ✅ |
| US-025 | Veckovy i kalender                                        | ✅ |
| US-026 | Månadsvy i kalender                                       | ✅ |
| US-027 | Lägg till maträtt på en dag                               | ✅ |
| US-028 | Ta bort maträtt från en dag                               | ✅ |
| US-029 | Klick på maträtt navigerar till recept                    | ✅ |
| US-030 | Navigera framåt och bakåt i kalender                      | ✅ |
| US-031 | Listvy för veckans matsedel                               | ✅ |
| US-032 | Import av recept via URL                                  | ✅ |
| US-033 | Användarinställningar                                     | ✅ |
| US-034 | Tema                                                      | ✅ |
| US-035 | Import av text                                            | 🔄 |
| US-036 | Kalender - månadsvy på små enheter                        | ✅ |
| US-037 | Klick på veckonummer i månadsvy navigerar till veckovyn   | ✅ |
| US-038 | Kalendernavigering sparas i URL-historik                  | ✅ |
| US-039 | Sektionsrubriker för tillagningssteg                      | ✅ |
| US-040 | Sektionsrubriker för ingredienser                         | ✅ |
| US-041 | Ordna ingredienser med drag-and-drop                      | ⬜ |

**Status:** ✅ Klar &nbsp;·&nbsp; 🔄 Delvis &nbsp;·&nbsp; ⬜ Ej påbörjad

---

## Autentisering

### US-001 — Logga in med Google OAuth

Inloggning sker via Google OAuth. Användare autentiseras med sitt Google-konto och behöver inte skapa ett separat konto i applikationen.

### US-002 — Delade data för alla inloggade användare

Alla inloggade användare har tillgång till samma recept, inköpslistor och kalender.

---

## Recept

### US-003 — Skapa recept

Användare kan skapa ett nytt recept med följande fält:

| Fält | Beskrivning |
|---|---|
| Namn | Receptets titel |
| Kategori | En eller flera taggar, t.ex. kött, fågel, vegetariskt, glutenfritt |
| Källa | Valfritt. Består av ett namn och en URL (t.ex. länk till originalreceptet) |
| Ingredienser | Lista med ingredienser, vardera med namn, mängd och enhet. Enhet är ett fritextfält med autocomplete baserat på enheter från befintliga ingredienser. Varje rad kan tas bort med en ×-knapp. Rader kan omvandlas till sektionsrubriker (se US-040). |
| Instruktioner | Steg-för-steg-beskrivning av tillagningen. Steg kan grupperas under namngivna sektioner (se US-039). |
| Tillagningstid | Angiven i minuter |
| Portioner | Antal portioner receptet är avsett för |

### US-004 — Redigera recept

Användare kan redigera alla fält på ett befintligt recept.

### US-005 — Ta bort recept med bekräftelsedialog

Innan ett recept tas bort visas en bekräftelsedialog som varnar användaren om att åtgärden inte kan ångras.

### US-006 — Visa receptlista i bokstavsordning

Receptlistan visar alla recept i bokstavsordning.

### US-007 — Filtrera receptlista på kategori

Receptlistan kan filtreras på kategori i gränssnittet.

### US-008 — Visa receptdetalj med ingredienser och instruktioner

Klickar man på ett recept visas hela receptet med ingredienser och instruktioner.

### US-032 — Import av recept via URL

Användare kan ange en URL till ett recept på en extern sida (t.ex. koket.se) och få receptet automatiskt importerat. Importerad data fylls i formuläret där användaren kan granska och spara.

Om webbplatsen använder klientrendering (t.ex. kokaihop.se) och inte kan importeras automatiskt visas en varning direkt när URL:en skrivs in. Om importen ändå misslyckas visas ett felmeddelande som toast med serverns felbeskrivning.

### US-035 — Import av recept via textfil

Användare kan importera recept från lokala textfiler (`.txt`, `.md`). Filen tolkas enligt ett definierat format med rubrik, portioner, ingredienser och tillagningssteg.
Vid import av textfil ska rader som inled med `# ` tolkas som sektionsrubriker och renderas som `h2`-rubriker, se [Gremolata.txt](Gremolata.txt).
I ingredienslistan finns också rader som inleds med `# ` dessa ska tolkas som en sektionsrubrik enligt US-040.
### US-039 — Sektionsrubriker för tillagningssteg

Tillagningssteg kan grupperas under namngivna sektioner. En rad som börjar med `# ` tolkas som en sektionsrubrik och renderas som en `h2`-rubrik med en egen numrerad lista för efterföljande steg. Vid URL-import omvandlas `HowToSection`-objekt automatiskt till sektionsrubriker.

### US-040 — Sektionsrubriker för ingredienser

Ingredienser i ett recept kan grupperas under namngivna sektionsrubriker (t.ex. "Sås", "Pesto"). I receptformuläret omvandlas en rad till en sektionsrubrik via en `§`-knapp — mängd och enhet döljs och namnet täcker hela raden. Sektionen härledds positionellt vid sparande. I receptdetaljen visas varje sektion som en `h2`-rubrik ovanför sin ingredienslista.

---

## Receptdetalj — planeringsläge

Receptdetaljvyn har ett planeringsläge (standardläge) och ett tillagningsläge som användaren kan växla mellan.

### US-009 — Välj skalfaktor i planeringsläge

En skalfaktor väljs bland förinställda alternativ: 0.5×, 1×, 2×, 3×, 4×. Kontrollerna visas under beskrivningen, ovanför ingredienslistan.

### US-010 — Välj inköpslista i planeringsläge

En inköpslista väljs från en dropdown i planeringsläget.

### US-011 — Lägg till / ta bort ingrediens i inköpslista från recept

Klick på en ingrediens lägger till den i vald lista med skalad mängd och markerar den med en listikon. Klick igen tar bort ingrediensen från listan och tar bort markeringen.

### US-012 — Summera mängder om ingrediens redan finns i listan

Om en ingrediens redan finns i inköpslistan ska mängderna summeras i stället för att lägga till ett duplikat. Gäller både vid tillägg från planeringsläge och vid tillägg från inköpslistsvyn.

### US-013 — Välj dag för tillagning via datepicker i receptvy

Det ska gå att välja en dag i en datepicker i planeringsläget för att koppla receptet till en dag i kalender.

---

## Receptdetalj — tillagningsläge

### US-014 — Markera ingredienser och steg som klara i tillagningsläge

Klick på en ingrediens markerar den som "tagen". Klick på ett steg markerar det som "utfört".

### US-015 — Spara tillagningsprogress persistent

Tillståndet sparas persistent och återställs nästa gång man öppnar receptet.

### US-016 — Återställ alla markeringar med "Avmarkera allt"

Knappen "Avmarkera allt" återställer alla markeringar i tillagningsläget.

---

## Inköpslistor

Användare kan skapa och hantera flera namngivna inköpslistor (t.ex. en per butik). Varje lista innehåller varor med namn, mängd och enhet.

### US-017 — Skapa inköpslista

Användare kan skapa en ny namngiven inköpslista.

### US-018 — Byta namn på inköpslista

Användare kan byta namn på en befintlig inköpslista.

### US-019 — Ta bort inköpslista

Användare kan ta bort en inköpslista.

### US-020 — Lägga till varor manuellt i inköpslista

Användare kan lägga till varor manuellt med namn, mängd och enhet.

### US-021 — Redigera vara i inköpslista

Användare kan redigera en befintlig vara i en inköpslista.

### US-022 — Ta bort vara från inköpslista

Användare kan ta bort en vara från en inköpslista.

### US-023 — Bocka av vara (persistent)

Användare kan bocka av varor under en pågående handling. Avbockningen sparas persistent.

### US-024 — Töm lista

Töm lista återställer alla varors avbockningsstatus.

---

## Kalender / Veckomatsedel

Användare kan planera måltider genom att koppla recept till specifika dagar.

### US-025 — Veckovy i kalender

Kalendern visas i en veckovy med en dag per rad. Varje dag kan ha en eller flera maträtter.

### US-026 — Månadsvy i kalender

Kalendern ska visas i månadsvy med alla dagar i månaden i ett 7-kolumners grid + en kolumn för rad-rubriker.
Månadsnamn och år visas i headern.
Veckonummer ska visas för varje rad i månaden.
Veckodag ska visas som för varje kolumn i månaden.
Veckodag visas förkortat med två tecken, t.ex. "Må", "Ti", "On", "To", "Fr", "Lö", "Sö".

### US-027 — Lägg till maträtt på en dag

Användare kan lägga till en maträtt på en valfri dag i kalendern via en receptväljare.

### US-028 — Ta bort maträtt från en dag

Användare kan ta bort en planerad maträtt från en dag i kalendern.

### US-029 — Klick på maträtt navigerar till recept

Klick på en maträtt i kalendern navigerar till det tillhörande receptet. Gäller både veckovy och månadsvy.

### US-030 — Navigera framåt och bakåt i kalender

Användaren kan navigera framåt och bakåt i tid i både vecko- och månadsvy.

### US-031 — Listvy för veckans matsedel

En listvy visar veckans matsedel (eller kommande sju dagar) som en enkel lista med datum och tillhörande maträtter. Klick på en maträtt navigerar till receptet.

> Täcks av US-025. Veckovyn visar en dag per rad med länkade maträtter.

### US-036 - Kalender - månadsvy på små enheter

På små enheter (t.ex. mobilen) visas kalendern i en lista med dagar i månaden. 
Månadsnamn och år visas i headern.
För varje ny vecka visas en rad med veckonummer.
Veckodag visas för varje dag i månaden.

### US-037 — Klick på veckonummer i månadsvy navigerar till veckovyn

När användaren klickar på ett veckonummer i månadsvy ska kalendern byta till veckovy och visa den klickade veckans dagar.

### US-038 — Kalendernavigering sparas i URL-historik

Kalendernavigering ska uppdatera URL:en med query params `?view=` och `?date=` så att webbläsarens back/forward och swipe-back på mobil fungerar.

- `view`: `week` eller `month`
- `date`: ISO-datum för måndagen i vald vecka (`?view=week&date=2026-05-18`) respektive första dagen i vald månad (`?view=month&date=2026-05-01`)
- Alla navigationsåtgärder (föregående/nästa vecka, föregående/nästa månad, klick på veckonummer) ska pusha till URL-historiken
- Vid sidladdning ska kalenderstate läsas från URL:en; saknas params visas aktuell vecka i veckovy

---

## Inställningar

### US-033 — Användarinställningar

Användare kan ändra inställningar via en inställningssida som nås via kugghjulsikonen i appens header (till höger om temabytaren).

- **Föredragen inköpslista** — väljs bland befintliga listor; den valda listan förvaljs i planeringsläget
- **Tema** — se US-034
- **Senaste visade sida** — vid inloggning omdirigeras användaren till den senaste besökta sidan; vid fel (t.ex. 404) omdirigeras till receptlistan

### US-034 — Tema

Användare kan välja bland tre teman:

- **Standard** — standardtemat
- **Nord Dark** — mörkt tema baserat på Nord Polar Night med accenter från Frost och Aurora
- **Nord Light** — ljust tema baserat på Nord Snow Storm

Temabytaren nås via en solikon i appens header. Valt tema sparas persistent i `localStorage`.

---

## Planerade funktioner

### US-041 — Ordna ingredienser med drag-and-drop

Användare ska kunna ändra ordningen på ingrediensrader i receptformuläret genom att dra och släppa. Sektionsrubriker (US-040) ska kunna flyttas tillsammans med sina tillhörande ingredienser.
