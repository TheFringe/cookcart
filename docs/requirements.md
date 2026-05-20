# Krav — Recipes

## 1. Översikt

Recipes är en webbaserad applikation för matplanering. Användare kan skapa och hantera recept, bygga inköpslistor och planera veckans måltider i en kalender.

Applikationen riktar sig till hushåll där flera personer delar på matplaneringen. Inloggning sker via Google, vilket gör det enkelt för familjemedlemmar att komma åt samma recept och listor utan att hantera separata lösenord.

## 2. Autentisering

Inloggning sker via Google OAuth. Användare autentiseras med sitt Google-konto och behöver inte skapa ett separat konto i applikationen.

Alla inloggade användare har tillgång till samma recept, inköpslistor och kalender.

## 3. Recept

Användare kan skapa, redigera och ta bort recept. Receptlistan går att söka och filtrera i gränssnittet.

### Fält

| Fält | Beskrivning |
|---|---|
| Namn | Receptets titel |
| Kategori | En eller flera taggar, t.ex. kött, fågel, vegetariskt, glutenfritt |
| Källa | Valfritt. Består av ett namn och en URL (t.ex. länk till originalreceptet) |
| Ingredienser | Lista med ingredienser, vardera med namn, mängd och enhet. Enhet är ett fritextfält med autocomplete baserat på enheter från befintliga ingredienser. |
| Instruktioner | Steg-för-steg-beskrivning av tillagningen |
| Tillagningstid | Angiven i minuter |
| Portioner | Antal portioner receptet är avsett för |

### Visning

Receptlistan visar alla recept i bokstavsordning och kan filtreras på kategori. Klickar man på ett recept visas hela receptet med ingredienser och instruktioner.

Innan ett recept tas bort visas en bekräftelsedialog som varnar användaren om att åtgärden inte kan ångras.

### Receptdetalj — två lägen

Receptdetaljvyn har två lägen som användaren kan växla mellan:

**Planeringsläge (standardläge)**

- En skalfaktor väljs bland förinställda alternativ: 0.5×, 1×, 2×, 3×, 4×
- En inköpslista väljs från en dropdown
- Kontrollerna visas under beskrivningen, ovanför ingredienslistan
- Klick på en ingrediens lägger till den i vald lista med skalad mängd och markerar den med en listikon
- Klick igen tar bort ingrediensen från listan och tar bort markeringen
- Om en ingrediens redan finns i listan summeras mängderna

**Tillagningsläge**

- Klick på en ingrediens markerar den som "tagen"
- Klick på ett steg markerar det som "utfört"
- Tillståndet sparas persistent och återställs nästa gång man öppnar receptet
- Knappen "Avmarkera allt" återställer alla markeringar

## 4. Inköpslistor

Användare kan skapa och hantera flera namngivna inköpslistor (t.ex. en per butik). Varje lista innehåller varor med namn, mängd och enhet.

### Hantera listor

- Skapa, byta namn på och ta bort listor
- Lägga till varor manuellt
- Redigera och ta bort enskilda varor
- Bocka av varor (t.ex. under en pågående handling) — avbockning sparas persistent
- Töm lista — återställer alla varors avbockningsstatus

### Lägga till från recept

Från ett recept kan användaren välja vilka ingredienser som ska läggas till en inköpslista. Innan varorna läggs till kan användaren justera antalet portioner — mängderna skalas då proportionellt mot receptets originalportioner.

Användaren väljer vilken lista varorna ska hamna i. Om en ingrediens redan finns i listan summeras mängderna.

## 5. Kalender / Veckomatsedel

Användare kan planera måltider genom att koppla recept till specifika dagar.

### Kalendervy

Kalendern visas i både vecko- och månadsvy. Varje dag kan ha en eller flera maträtter. Maträtterna visas direkt i kalendern och klick på en maträtt navigerar till det tillhörande receptet. Maträtter kan läggas till och tas bort per dag.

Användaren kan navigera framåt och bakåt i tid. Navigeringen implementeras med react-datepicker.

### Listvy

En listvy visar veckans matsedel (eller kommande sju dagar) som en enkel lista med datum och tillhörande maträtter. Klick på en maträtt navigerar till receptet.

## 6. Framtida funktioner

- **Import av recept via URL** — användare ska kunna ange en URL till ett recept på en extern sida (t.ex. koket.se) och få receptet automatiskt importerat till applikationen.
