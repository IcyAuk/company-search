const nafs = ["62.01Z","58.29C","73.11Z"];
const cps = [
  // Léman : Annemasse – Thonon – Évian
  "74100", // Annemasse, Ambilly, Ville-la-Grand, Vétraz-Monthoux
  "74200", // Thonon-les-Bains
  "74500", // Évian, Publier, Amphion
  // Vallée de l'Arve
  "74930", // Reignier-Ésery
  "74800", // La Roche-sur-Foron
  "74130", // Bonneville
  "74970", // Marignier
  "74300", // Cluses
  "74700", // Sallanches
  "74170", // Saint-Gervais-les-Bains / Le Fayet
  // Annecy
  "74000", // Annecy centre
  "74940", // Annecy-le-Vieux
  "74960", // Cran-Gevrier, Meythet
  "74600", // Seynod
  "74370", // Pringy
];
const rows = [["Nom","Adresse","NAF","Effectif"]];
for (const naf of nafs) for (const cp of cps) for (let p = 1; p <= 5; p++) {
  const r = await (await fetch(`/search?activite_principale=${naf}&code_postal=${cp}&per_page=25&page=${p}`)).json();
  console.log(naf, cp, "page", p, "→", r.results?.length ?? 0, "résultats");
  if (!r.results?.length) break;
  for (const e of r.results) {
    const t = e.tranche_effectif_salarie;
    if (!t || t === "00" || t === "NN") continue;
    const et = e.matching_etablissements?.[0] || e.siege || {};
    rows.push([e.nom_complet, et.adresse, naf, t]);
  }
  await new Promise(r => setTimeout(r, 300));
}
const out = rows.map(r => r.map(c => `"${(c ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
console.log(out);
try { await navigator.clipboard.writeText(out); }
catch { const t = document.createElement("textarea"); t.value = out; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
console.log("✅ copié");
