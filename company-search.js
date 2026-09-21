const DEFAULT_NAFS = ["62.01Z", "58.29C", "73.11Z"];
const DEFAULT_CPS = ["74200", "74140", "74500", "74100", "74160"];

function toCsv(rows) {
  return rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectCompanies({
  nafs = DEFAULT_NAFS,
  cps = DEFAULT_CPS,
  maxPages = 5,
  perPage = 25,
  delayMs = 300,
  baseUrl = "",
  fetchImpl = fetch,
} = {}) {
  const rows = [["Nom", "Adresse", "NAF", "Effectif"]];

  for (const naf of nafs) {
    for (const cp of cps) {
      for (let page = 1; page <= maxPages; page += 1) {
        const searchParams = new URLSearchParams({
          activite_principale: naf,
          code_postal: cp,
          per_page: String(perPage),
          page: String(page),
        });

        const response = await fetchImpl(`${baseUrl}/search?${searchParams.toString()}`);
        const payload = await response.json();
        const resultCount = payload.results?.length ?? 0;
        console.log(naf, cp, "page", page, "→", resultCount, "résultats");

        if (!resultCount) {
          break;
        }

        for (const company of payload.results) {
          const tranche = company.tranche_effectif_salarie;
          if (!tranche || tranche === "00" || tranche === "NN") {
            continue;
          }

          const etablissement = company.matching_etablissements?.[0] || company.siege || {};
          rows.push([company.nom_complet, etablissement.adresse, naf, tranche]);
        }

        await sleep(delayMs);
      }
    }
  }

  return rows;
}

async function main() {
  const rows = await collectCompanies({ baseUrl: process.env.SEARCH_BASE_URL || "" });
  console.log(rows.length - 1, "entreprises gardées");
  console.log(toCsv(rows));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  collectCompanies,
  toCsv,
};
