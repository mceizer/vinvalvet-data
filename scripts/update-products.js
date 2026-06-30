// Vinvalvet: lokal uppdateringskedja.
//
// Kör hela kedjan i ett steg utan att starta Express-servern:
//   1. Hämtar nya produkter från Systembolaget och skriver över data/products.json
//      (via befintliga getAllProducts, samma logik som index.js använder vid start).
//   2. Kör den befintliga filtermotorn (scripts/filter-products.js) som ett
//      separat Node-anrop, vilket skapar:
//        - output/wine-index.json
//        - output/wine-index-meta.json
//        - logs/filter-report.json
//
// Filtermotorn ändras inte; den körs exakt som "npm run filter" gör.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { getAllProducts } from "../getAllProducts.js";

const PRODUCTS_FILE = "data/products.json";

// Förladda befintlig products.json till productIdMap så att pris-/alkoholhistorik
// bevaras mellan körningar (samma mönster som index.js vid start).
const productIdMap = {};

try {
	const data = readFileSync(PRODUCTS_FILE, "utf8");
	const products = JSON.parse(data);
	for (const product of products) {
		productIdMap[product.productNumber] = product;
	}
	console.log(`Vinvalvet: förladdade ${products.length} produkter för historik.`);
} catch (error) {
	if (error.code === "ENOENT") {
		console.log("Vinvalvet: ingen befintlig products.json, hämtar allt på nytt.");
	} else {
		console.log("Vinvalvet: kunde inte läsa befintlig products.json: ", error.code ?? error);
	}
}

const run = async () => {
	console.log("Vinvalvet: hämtar nya produkter, detta tar en stund...");
	const products = await getAllProducts(productIdMap);
	console.log(`Vinvalvet: ny products.json hämtad och överskriven med ${products.length} produkter.`);

	console.log("Vinvalvet: kör filtermotorn...");
	const result = spawnSync("node", ["scripts/filter-products.js"], {
		stdio: "inherit",
	});

	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		throw new Error(`Filtermotorn avslutades med kod ${result.status}`);
	}

	console.log(
		"Vinvalvet: klart. Skapade output/wine-index.json, output/wine-index-meta.json och logs/filter-report.json.",
	);
};

run().catch((error) => {
	console.error("Vinvalvet: uppdateringen misslyckades: ", error);
	process.exitCode = 1;
});
