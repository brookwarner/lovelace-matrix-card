# Matrix Card for Home Assistant

A Mushroom-styled custom Lovelace card that renders an **aligned grid of
entities** by row × column — e.g. rooms × temperature / humidity / dewpoint.

One CSS grid keeps every column lined up across all rows, the label column
flexes, and value columns stay aligned (tabular figures) down to phone width.
`ha-icon` column headers and row icons; unavailable entities render as `—` and
dim the row.

Built with Lit + TypeScript. Themed via Home Assistant / Mushroom CSS variables.

> Looking for the dual-thumb band / day-night / time control? That's the
> separate [band-card](https://github.com/brookwarner/lovelace-band-card).

## Installation (HACS)

1. HACS → ⋮ → **Custom repositories** → add this repo's URL, category
   **Dashboard** (Lovelace).
2. Install **Matrix Card**, then reload your browser.
3. The resource `/hacsfiles/lovelace-matrix-card/matrix-card.js` is added
   automatically.

## Configuration

```yaml
type: custom:matrix-card
title: Climate – temperature & humidity   # optional
columns: [Temp, RH, Dew]
column_icons: [mdi:thermometer, mdi:water-percent, mdi:thermometer-water]
column_colors: [red, blue, cyan]          # HA named colours or any CSS colour
rows:
  - name: Living room
    icon: mdi:sofa
    entities: [sensor.ths_livingroom_temperature, sensor.ths_livingroom_humidity, sensor.living_room_dewpoint]
  - name: Attic
    icon: mdi:home-roof
    entities: [sensor.attic_fan_1_temperature, sensor.attic_fan_1_humidity, sensor.attic_dewpoint]
```

Each row's `entities` map left-to-right onto `columns`.

Tap any value cell to open Home Assistant's more-info dialog for that entity —
the sheet overlay with its history graph (keyboard accessible: focus a cell and
press Enter/Space).

## Development

```bash
npm install
npm run build      # -> dist/matrix-card.js
npm run watch      # rebuild on change
```

## License

MIT
