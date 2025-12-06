# Verrassingskalender

Een interactieve verrassingskalender web applicatie met 10.000 krasvakjes gebouwd met Vue 3 en TypeScript.

**[Live Demo](https://hamoen.info/verrassingskalender)**

## Usecase

Een nieuw kansspel. Op een website zien gebruikers een grote verrassingskalender met 10000 vakjes (100x100 grid). In 1 vakje zit een hoofdprijs van 25000 euro, in 100 vakjes zit een troostprijs van 100 euro. Een bezoeker van de website mag 1 vakje wegkrassen om zo kans te maken op een prijs. Ze zien welke vakjes al door andere gebruikers zijn opengemaakt en welke niet.

In de programmeertaal- en framework naar jouw keuze:

- Maak een webpagina waarop de verrassingskalender te zien is. Dit mag een simpele ongestylde grid zijn van 100 x 100.
- Een gebruiker kan een vakje openkrassen, waardoor de prijs eronder langzaam zichtbaar wordt.
- Bij herladen van de pagina moet zichtbaar blijven welke vakjes al open gekrast zijn en welke prijs daaronder zat krassen in de kalender dus simuleren.
- Je hoeft geen authenticatie te bouwen, je mag het concept dat meerdere gebruikers krassen in de kalender dus simuleren.

Het doel van deze opdracht is dat jij laat zien waar je technisch enthousiast van wordt. Richt je op wat jij belangrijk vindt in front-end werk. Alles is goed, zolang het jouw kwaliteiten laat zien.

- performance,
- UX,
- codekwaliteit,
- testbaarheid,
- design systems,
- tooling,

## Install

```bash
# Dependencies installeren
npm install

# Development server starten
npm run dev

# Build voor productie
npm run build

# Preview production build
npm run preview
```

## Uitwerking

### Stack

- Vue 3
- TypeScript
- Pinia
- Vuetify
- Vite
- SCSS

### Features

#### Core functionaliteit

- 100x100 gridsysteem met virtualization
- Kras mechanisme
- Persistant caching
- Prijs verdeling
- Speler simulatie

#### User experience

- Live stats
- Confetti animaties
- Snackbar notificaties
- Responsive design
- Prijs reveal animaties

#### Technische highlights

- TypeScript interfaces
- Composables
- Debug mode
- Optimized rendering

#### Styling & visuals

- pattern background
- Cell state visualization
- Pulse animatie
- Sticky stats bar

## Uitbreidingen

Mogelijke features om toe te voegen:

### UX verbeteringen

- Random start positie
- Guided navigatie naar interessante plekken
- Afgerond spel modal
- Sound effects
- Mobile touch optimalisatie met pinch-to-zoom

### Functionaliteit

- Daily reset
- Leaderboard
- Share functie

### Testing & kwaliteit

- Unit tests
- E2E tests (Playwright/Cypress/robot framework)
- Code coverage

### Accessibility & usability

- WCAG
- Keyboard navigatie

### Production-ready

- API naar database
- Authentication
- WebSocket
- CI/CD pipeline
- Monitoring/logging/analytics
- etc.
