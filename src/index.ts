import { MatrixCard } from "./matrix-card.js";

const VERSION = "1.0.0";

window.customCards = window.customCards || [];
window.customCards.push({
  type: "matrix-card",
  name: "Matrix Card",
  description: "Aligned, Mushroom-styled grid of entities by row and column.",
  preview: false,
});

// eslint-disable-next-line no-console
console.info(
  `%c MATRIX-CARD %c v${VERSION} `,
  "background:#1D9E75;color:#fff;border-radius:3px 0 0 3px",
  "background:#444;color:#fff;border-radius:0 3px 3px 0"
);

export { MatrixCard };
