# Krav — Recipes

## Översikt

Recipes är en webbaserad applikation för matplanering. Användare kan skapa och hantera recept, bygga inköpslistor och planera veckans måltider i en kalender.

Applikationen riktar sig till hushåll där flera personer delar på matplaneringen. Inloggning sker via Google, vilket gör det enkelt för familjemedlemmar att komma åt samma recept och listor utan att hantera separata lösenord.

## Sammanfattning

| ID     | Beskrivning                                               | Status |
|--------|-----------------------------------------------------------|---|
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
| US-018 | Byta namn på inköpslista                                  | ⬜ |
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
| US-032 | Import av recept via URL                                  | ⬜ |
| US-033 | Användarinställningar                                     | ⬜ |
| US-034 | Tema                                                      | ⬜ |

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
| Ingredienser | Lista med ingredienser, vardera med namn, mängd och enhet. Enhet är ett fritextfält med autocomplete baserat på enheter från befintliga ingredienser. |
| Instruktioner | Steg-för-steg-beskrivning av tillagningen |
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

Kalendern kan visas i månadsvy med alla dagar i månaden i ett 7-kolumners grid. Månadsnamn och år visas i headern.

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

---

## Framtida funktioner

### US-032 — Import av recept via URL

Användare ska kunna ange en URL till ett recept på en extern sida (t.ex. koket.se) och få receptet automatiskt importerat till applikationen.

### US-033 - Användarinställningar

Användare ska kunna ändra inställningar som till exempel vald inköpslista, valt tema.

### US-034 - Tema

Användare ska kunna välja mellan olika teman för applikationen, inklusive mörkt och ljuset tema.

- Det behövs en theme-switcher för att byta mellan teman.
- Två nya teman utöver det som redan finns:
  - Dark Mode: Nord Polar Night
  - Light Mode: Nord Snow Storm
  - Kontraster från Frost och Aurora
  - Referenser:
    - https://www.nordtheme.com
    - https://www.nordtheme.com/docs/usage 
