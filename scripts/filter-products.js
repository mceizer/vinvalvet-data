import fs from "node:fs";
import path from "node:path";

const INPUT_FILE = "data/products.json";
const OUTPUT_DIR = "output";
const LOG_DIR = "logs";
const WINE_INDEX_FILE = path.join(OUTPUT_DIR, "wine-index.json");
const WINE_META_FILE = path.join(OUTPUT_DIR, "wine-index-meta.json");
const FILTER_REPORT_FILE = path.join(LOG_DIR, "filter-report.json");

const ALLOWED_CATEGORY_LEVEL_2 = new Set([
	"Rött vin",
	"Vitt vin",
	"Rosévin",
	"Mousserande vin",
	"Starkvin",
	"Vinlåda",
	"Smaksatt vin & fruktvin",
]);

const ALLOWED_ALCOHOL_FREE_TITLES = [
	"Alkoholfritt, Rött",
	"Alkoholfritt, Vitt",
	"Alkoholfritt, Rosé",
	"Alkoholfritt Mousserande vitt",
	"Alkoholfritt Mousserande rosé",
	"Alkoholfritt Mousserande övrigt",
];

const EXCLUDED_CATEGORY_LEVEL_2 = new Set([
	"Glögg och Glühwein",
	"Sake",
]);

const normalizeText = (value) => {
	if (value === null || value === undefined) return "";
	return String(value).trim();
};

const normalizeForSearch = (value) =>
	normalizeText(value)
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

const STOP_WORDS = new Set([
	"a",
	"an",
	"and",
	"av",
	"de",
	"del",
	"di",
	"do",
	"du",
	"el",
	"en",
	"et",
	"il",
	"la",
	"las",
	"le",
	"les",
	"los",
	"of",
	"och",
	"the",
	"und",
	"von",
]);

const WINE_TYPE_TOKENS = {
	red: ["red", "rött", "rod", "röd"],
	white: ["white", "vitt", "vit"],
	rose: ["rose", "rosé", "rosevin", "rosévin"],
	sparkling: ["sparkling", "mousserande", "bubbel"],
	fortified: ["fortified", "starkvin"],
	wine_box: ["vinlåda", "boxvin", "box"],
	flavored: ["smaksatt", "fruktvin"],
};

const normalizeWineType = (product) => {
	const categoryLevel2 = normalizeText(product.categoryLevel2);
	const customCategoryTitle = normalizeText(product.customCategoryTitle);

	if (customCategoryTitle.startsWith("Alkoholfritt, Rött")) return "red";
	if (customCategoryTitle.startsWith("Alkoholfritt, Vitt")) return "white";
	if (customCategoryTitle.startsWith("Alkoholfritt, Rosé")) return "rose";
	if (customCategoryTitle.startsWith("Alkoholfritt Mousserande")) return "sparkling";

	switch (categoryLevel2) {
		case "Rött vin":
			return "red";
		case "Vitt vin":
			return "white";
		case "Rosévin":
			return "rose";
		case "Mousserande vin":
			return "sparkling";
		case "Starkvin":
			return "fortified";
		case "Vinlåda":
			return "wine_box";
		case "Smaksatt vin & fruktvin":
			return "flavored";
		default:
			return "unknown";
	}
};

const buildName = (product) => {
	const bold = normalizeText(product.productNameBold);
	const thin = normalizeText(product.productNameThin);

	if (bold && thin) return `${bold} ${thin}`;
	if (bold) return bold;
	if (thin) return thin;
	return "";
};

const addToken = (tokens, value) => {
	const token = normalizeForSearch(value)
		.replace(/[^\p{L}\p{N}\s-]/gu, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (token.length < 2) return;
	if (STOP_WORDS.has(token)) return;

	tokens.add(token);
};

const addTokenizedText = (tokens, value) => {
	const text = normalizeForSearch(value).replace(/[^\p{L}\p{N}\s-]/gu, " ");

	for (const token of text.split(/\s+/)) {
		addToken(tokens, token);
	}
};

const addPhrase = (tokens, value) => {
	const phrase = normalizeForSearch(value)
		.replace(/[^\p{L}\p{N}\s-]/gu, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (phrase.length < 3) return;

	const words = phrase.split(" ").filter((word) => !STOP_WORDS.has(word));
	if (words.length >= 2) tokens.add(words.join(" "));
};

const addWineTypeTokens = (tokens, wineType) => {
	for (const token of WINE_TYPE_TOKENS[wineType] ?? []) {
		addToken(tokens, token);
	}
};

const addAlcoholFreeTokens = (tokens, product) => {
	const alcoholPercentage = Number(product.alcoholPercentage ?? 0);
	const combinedText = normalizeForSearch(
		[
			product.productNameBold,
			product.productNameThin,
			product.categoryLevel1,
			product.categoryLevel2,
			product.customCategoryTitle,
		].join(" "),
	);

	const isAlcoholFree =
		alcoholPercentage <= 0.5 ||
		combinedText.includes("alkoholfritt") ||
		combinedText.includes("alcohol free") ||
		combinedText.includes("non alcoholic") ||
		combinedText.includes("non-alcoholic");

	if (!isAlcoholFree) return;

	for (const token of [
		"alkoholfritt",
		"alkoholfri",
		"alcohol free",
		"non alcoholic",
		"alcoholfree",
	]) {
		addToken(tokens, token);
	}
};

const buildSearchTokens = ({
	name,
	producer,
	country,
	region,
	subRegion,
	grapes,
	product,
	wineType,
}) => {
	const tokens = new Set();

	for (const value of [
		name,
		producer,
		country,
		region,
		subRegion,
		product.categoryLevel2,
		product.categoryLevel3,
		product.customCategoryTitle,
		...grapes,
	]) {
		addTokenizedText(tokens, value);
	}

	for (const phrase of [name, producer, product.customCategoryTitle]) {
		addPhrase(tokens, phrase);
	}

	addWineTypeTokens(tokens, wineType);
	addAlcoholFreeTokens(tokens, product);

	return [...tokens].sort();
};

const getImageUrl = (product) => {
	if (Array.isArray(product.images) && product.images.length > 0) {
		return product.images[0]?.imageUrl ?? null;
	}

	return null;
};

const shouldIncludeProduct = (product) => {
	const categoryLevel1 = normalizeText(product.categoryLevel1);
	const categoryLevel2 = normalizeText(product.categoryLevel2);
	const customCategoryTitle = normalizeText(product.customCategoryTitle);

	if (EXCLUDED_CATEGORY_LEVEL_2.has(categoryLevel2)) {
		return {
			include: false,
			reason: `Excluded categoryLevel2: ${categoryLevel2}`,
		};
	}

	if (categoryLevel1 === "Alkoholfritt") {
		const allowedAlcoholFree = ALLOWED_ALCOHOL_FREE_TITLES.some((title) =>
			customCategoryTitle.startsWith(title),
		);

		if (allowedAlcoholFree) {
			return {
				include: true,
				reason: "Allowed alcohol-free wine category",
			};
		}

		return {
			include: false,
			reason: `Excluded alcohol-free category: ${customCategoryTitle || "(missing)"}`,
		};
	}

	if (categoryLevel1 !== "Vin") {
		return {
			include: false,
			reason: `Excluded categoryLevel1: ${categoryLevel1 || "(missing)"}`,
		};
	}

	if (ALLOWED_CATEGORY_LEVEL_2.has(categoryLevel2)) {
		return {
			include: true,
			reason: `Allowed categoryLevel2: ${categoryLevel2}`,
		};
	}

	return {
		include: false,
		reason: `Excluded wine subcategory: ${categoryLevel2 || "(missing)"}`,
	};
};

const mapToWineIndexProduct = (product) => {
	const name = buildName(product);
	const producer = normalizeText(product.producerName) || null;
	const country = normalizeText(product.country) || null;
	const region = normalizeText(product.originLevel1) || null;
	const subRegion = normalizeText(product.originLevel2) || null;
	const wineType = normalizeWineType(product);
	const grapes = Array.isArray(product.grapes)
		? product.grapes.map(normalizeText).filter(Boolean)
		: [];

	const searchTokens = buildSearchTokens({
		name,
		producer,
		country,
		region,
		subRegion,
		grapes,
		product,
		wineType,
	});

	return {
		id: `systembolaget_${product.productId}`,
		productId: normalizeText(product.productId),
		name,
		producer,
		country,
		region,
		subRegion,
		wineType,
		vintage: product.vintage ?? null,
		grapes,
		aliases: [],
		searchTokens,
		qrUrls: [],
		source: "systembolaget",
		sourceUrl: product.productNumberShort
			? `https://www.systembolaget.se/produkt/vin/${product.productNumberShort}`
			: null,
		imageUrl: getImageUrl(product),
		labelImageUrl: null,
		ocrKeywords: [],
		alcoholPercentage: product.alcoholPercentage ?? null,
		sugar: product.sugarContent ?? null,
		volumeMl: product.volume ?? null,
		priceSek: product.price ?? null,
	};
};

const ensureDirectories = () => {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	fs.mkdirSync(LOG_DIR, { recursive: true });
};

const readProducts = () => {
	if (!fs.existsSync(INPUT_FILE)) {
		throw new Error(`Missing input file: ${INPUT_FILE}`);
	}

	const raw = fs.readFileSync(INPUT_FILE, "utf8");
	const products = JSON.parse(raw);

	if (!Array.isArray(products)) {
		throw new Error(`${INPUT_FILE} must contain a JSON array.`);
	}

	return products;
};

const buildVersion = () => {
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	const dd = String(now.getDate()).padStart(2, "0");

	return `${yyyy}.${mm}.${dd}`;
};

const main = () => {
	const startedAt = new Date();
	ensureDirectories();

	const products = readProducts();
	const included = [];
	const excludedReasons = new Map();
	const validationWarnings = [];

	for (const product of products) {
		const decision = shouldIncludeProduct(product);

		if (!decision.include) {
			excludedReasons.set(
				decision.reason,
				(excludedReasons.get(decision.reason) ?? 0) + 1,
			);
			continue;
		}

		const mapped = mapToWineIndexProduct(product);

		if (!mapped.id || !mapped.productId || !mapped.name || !mapped.wineType) {
			validationWarnings.push({
				productId: product.productId ?? null,
				productNumber: product.productNumber ?? null,
				reason: "Missing required field after mapping",
			});
			continue;
		}

		included.push(mapped);
	}

	const generatedAt = new Date().toISOString();
	const version = buildVersion();

	const wineIndex = {
		version,
		generatedAt,
		wineCount: included.length,
		wines: included,
	};

	const metadata = {
		version,
		generatedAt,
		wineCount: included.length,
		format: "json",
		fileName: "wine-index.json",
		downloadUrl: "",
	};

	const finishedAt = new Date();
	const report = {
		version,
		startedAt: startedAt.toISOString(),
		finishedAt: finishedAt.toISOString(),
		durationMs: finishedAt.getTime() - startedAt.getTime(),
		inputFile: INPUT_FILE,
		totalProducts: products.length,
		includedProducts: included.length,
		excludedProducts: products.length - included.length,
		validationWarnings: validationWarnings.length,
		excludedReasons: Object.fromEntries(
			[...excludedReasons.entries()].sort((a, b) => b[1] - a[1]),
		),
		warnings: validationWarnings,
	};

	fs.writeFileSync(WINE_INDEX_FILE, JSON.stringify(wineIndex, null, 2));
	fs.writeFileSync(WINE_META_FILE, JSON.stringify(metadata, null, 2));
	fs.writeFileSync(FILTER_REPORT_FILE, JSON.stringify(report, null, 2));

	console.log("Vinvalvet filtermotor");
	console.log("=====================");
	console.log(`Totalt antal produkter: ${products.length}`);
	console.log(`Inkluderade vinprodukter: ${included.length}`);
	console.log(`Exkluderade produkter: ${products.length - included.length}`);
	console.log(`Valideringsvarningar: ${validationWarnings.length}`);
	console.log("");
	console.log(`Skapade: ${WINE_INDEX_FILE}`);
	console.log(`Skapade: ${WINE_META_FILE}`);
	console.log(`Skapade: ${FILTER_REPORT_FILE}`);
};

main();
