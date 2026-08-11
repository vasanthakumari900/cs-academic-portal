// Generates a CSS "legacy palette unification" block: every Tailwind
// arbitrary-value utility that referenced the old teal/navy brand colors is
// remapped to the premium maroon/gold palette, so all ~100 components adopt
// the new design system without per-file edits.
//
// Usage: node scripts/generate-palette-remap.mjs > src/styles/legacy-remap.css

const LEGACY = {
  // Legacy teal brand
  "0D9488": "4A1620", // primary teal → brand maroon
  "0F766E": "61182A", // darker teal → darker maroon
  "115E59": "3A101A", // darkest teal → deep maroon
  "134E4A": "2A0D13", // teal ink text → maroon ink
  "2DD4BF": "D97706", // bright teal accent → gold
  "5EEAD4": "F4C266", // light teal border → light gold
  "99F6E4": "EDC8D0", // pale teal → pale rose
  "CCFBF1": "F3E4E8", // cream teal → cream
  "F0FDFA": "FBF4F5", // teal-tinted white → rose-cream
  "E8F1F4": "F6E4E8", // hover tint → rose tint
  "042F2E": "22101A", // dark teal surface → dark plum
  // Legacy navy (DGVC sub-brand)
  "021C4F": "4A1620", // navy ink → brand maroon
  "0F4C81": "6B2332", // steel blue → maroon light
  "011337": "250A11", // near-black navy → deep plum
  "0B3C91": "61182A",
  "0A369D": "61182A",
  "032B7A": "61182A",
  // Legacy dark navy surfaces
  "0A192F": "190B13",
  "0B2545": "250A11",
  "060D19": "0F060B",
};

const OPACITIES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

const rgbCache = new Map();
function rgb(hex) {
  if (!rgbCache.has(hex)) rgbCache.set(hex, hexToRgb(hex));
  return rgbCache.get(hex);
}

// Builds `.escaped\:class` style selectors for a utility like `bg-[#0D9488]`
// or `bg-[#0D9488]/10` (slashes must be escaped too — Tailwind escapes them).
function esc(util) {
  return util
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/#/g, "\\#")
    .replace(/\//g, "\\/");
}

// Build a color token: `rgb(r g b)` or `rgb(r g b / a)` (CSS Color 4 — slash
// alpha must live INSIDE the parentheses to be valid + minifier-safe).
function colorToken({ r, g, b }, alpha) {
  return alpha === null ? `rgb(${r} ${g} ${b})` : `rgb(${r} ${g} ${b} / ${alpha})`;
}

const DECL = {
  bg: (rgbStr) => `background-color: ${rgbStr};`,
  text: (rgbStr) => `color: ${rgbStr};`,
  border: (rgbStr) => `border-color: ${rgbStr};`,
  ring: (rgbStr) => `--tw-ring-color: ${rgbStr};`,
  from: (rgbStr) => `--tw-gradient-from: ${rgbStr} var(--tw-gradient-from-position);`,
  via: (rgbStr) => `--tw-gradient-via: ${rgbStr} var(--tw-gradient-via-position);`,
  to: (rgbStr) => `--tw-gradient-to: ${rgbStr};`,
  fill: (rgbStr) => `fill: ${rgbStr};`,
  stroke: (rgbStr) => `stroke: ${rgbStr};`,
  decoration: (rgbStr) => `text-decoration-color: ${rgbStr};`,
  outline: (rgbStr) => `outline-color: ${rgbStr};`,
};

const PROP_KEYS = ["bg", "text", "border", "ring", "from", "via", "to", "fill", "stroke", "decoration", "outline"];

let out = "";
out += "/* ═══ LEGACY PALETTE UNIFICATION — auto-generated, do not edit by hand ═══ */\n";
out += "/* Remaps old teal/navy brand utilities to the premium maroon/gold design system. */\n";

for (const [oldHex, newHex] of Object.entries(LEGACY)) {
  const { r, g, b } = rgb(newHex);

  for (const prop of PROP_KEYS) {
    const base = `${prop}-[#${oldHex}]`;
    const sel = `.${esc(base)}`;
    const decl = DECL[prop](colorToken({ r, g, b }, null));

    // Base + common variants
    const rules = [
      [sel, decl],
      [`.hover\\:${esc(base)}:hover`, decl],
      [`.focus\\:${esc(base)}:focus`, decl],
      [`.active\\:${esc(base)}:active`, decl],
      [`.group:hover .group-hover\\:${esc(base)}`, decl],
      [`.dark .dark\\:${esc(base)}`, decl],
      [`.dark .dark\\:hover\\:${esc(base)}:hover`, decl],
      [`.dark .group:hover .dark\\:group-hover\\:${esc(base)}`, decl],
    ];

    for (const [s, d] of rules) {
      out += `${s} { ${d} }\n`;
    }

    // Opacity-modified variants (e.g. bg-[#0D9488]/10)
    for (const o of OPACITIES) {
      const oBase = `${base}/${o}`;
      const oSel = `.${esc(oBase)}`;
      const oDecl = DECL[prop](colorToken({ r, g, b }, `${o / 100}`));
      const oRules = [
        [oSel, oDecl],
        [`.hover\\:${esc(oBase)}:hover`, oDecl],
        [`.focus\\:${esc(oBase)}:focus`, oDecl],
        [`.group:hover .group-hover\\:${esc(oBase)}`, oDecl],
        [`.dark .dark\\:${esc(oBase)}`, oDecl],
        [`.dark .dark\\:hover\\:${esc(oBase)}:hover`, oDecl],
      ];
      for (const [s, d] of oRules) {
        out += `${s} { ${d} }\n`;
      }
    }
  }
}

process.stdout.write(out);
