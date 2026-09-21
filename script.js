const nafs = ["62.01Z","58.29C","73.11Z"];
const cps  = ["74200","74140","74500","74100","74160"];
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
console.log(rows.length - 1, "entreprises gardées");
console.log(rows.map(r => r.map(c => `"${(c ?? "").replace(/"/g,'""')}"`).join(",")).join("\n"));
copy(rows.map(r => r.map(c => `"${(c ?? "").replace(/"/g,'""')}"`).join(",")).join("\n"));
