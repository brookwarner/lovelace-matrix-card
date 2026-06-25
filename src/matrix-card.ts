import { LitElement, html, css, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { type HomeAssistant, resolveColor } from "./ha.js";

interface MatrixRow {
  name?: string;
  icon?: string;
  entities: string[];
}

interface MatrixCardConfig {
  type: string;
  title?: string;
  columns: string[];
  column_icons?: string[];
  column_colors?: string[];
  rows: MatrixRow[];
}

@customElement("matrix-card")
export class MatrixCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: MatrixCardConfig;

  public setConfig(config: MatrixCardConfig): void {
    if (!config || !Array.isArray(config.columns) || !Array.isArray(config.rows)) {
      throw new Error("matrix-card: 'columns' and 'rows' arrays are required");
    }
    this._config = config;
  }

  public getCardSize(): number {
    return 1 + (this._config?.rows.length ?? 0);
  }

  private _cell(entityId: string): { txt: string; avail: boolean } {
    const s = this.hass?.states[entityId];
    if (!s || s.state === "unavailable" || s.state === "unknown") return { txt: "—", avail: false };
    const u = (s.attributes?.unit_of_measurement as string) || "";
    const n = Number(s.state);
    const v = isFinite(n) ? (Math.abs(n) < 100 ? n.toFixed(1) : String(Math.round(n))) : s.state;
    return { txt: `${v}${u}`, avail: true };
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    const c = this._config;
    const icons = c.column_icons || [];
    const colors = c.column_colors || [];
    const gtc = `minmax(56px, 1fr) repeat(${c.columns.length}, minmax(46px, max-content))`;

    return html`
      <ha-card>
        ${c.title ? html`<div class="title">${c.title}</div>` : nothing}
        <div class="grid" style="grid-template-columns:${gtc}">
          <div class="hcell"></div>
          ${c.columns.map(
            (col, i) => html`<div class="hcell" style="--c:${resolveColor(colors[i])}">
              ${icons[i] ? html`<ha-icon icon=${icons[i]}></ha-icon>` : nothing}<span>${col}</span>
            </div>`
          )}
          ${c.rows.map((r, ri) => {
            const cells = (r.entities || []).map((e) => this._cell(e));
            const rowAvail = cells.every((x) => x.avail);
            return html`
              <div class="label ${ri > 0 ? "sep" : ""} ${rowAvail ? "" : "dim"}">
                ${r.icon ? html`<ha-icon icon=${r.icon}></ha-icon>` : nothing}<span class="nm">${r.name || ""}</span>
              </div>
              ${cells.map(
                (x) => html`<div class="v ${ri > 0 ? "sep" : ""} ${x.avail ? "" : "dim"}">${x.txt}</div>`
              )}
            `;
          })}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card { padding: var(--mush-spacing, 12px); }
    .title {
      font-size: var(--mush-card-primary-font-size, 15px); font-weight: 500;
      color: var(--mush-card-primary-color, var(--primary-text-color)); margin: 2px 2px 12px;
    }
    .grid { display: grid; align-items: center; column-gap: 12px; }
    .hcell {
      font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--c, var(--secondary-text-color));
      display: flex; align-items: center; justify-content: flex-end; gap: 4px; padding: 0 2px 8px; white-space: nowrap;
    }
    .hcell ha-icon { --mdc-icon-size: 15px; color: var(--c, var(--secondary-text-color)); }
    .label { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 2px; }
    .label ha-icon { --mdc-icon-size: 21px; color: var(--secondary-text-color); flex: 0 0 auto; }
    .nm { font-size: 14px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .v {
      font-size: 14px; color: var(--primary-text-color); text-align: right;
      font-variant-numeric: tabular-nums; padding: 10px 2px; white-space: nowrap;
    }
    .sep { border-top: 0.5px solid var(--divider-color, rgba(255, 255, 255, 0.12)); }
    .dim { opacity: 0.4; }
  `;
}
