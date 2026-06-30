# Vinvalvet Distribution Schema

## Syfte

Detta dokument definierar vilka fält som ska ingå i den distribuerade versionen av Vinvalvets vinindex.

Målet är att `wine-index.json` endast ska innehålla data som Vinvalvet använder idag eller har en tydligt planerad funktion för.

Datageneratorn får använda mer information internt för filtrering, validering och berikning, men endast godkända fält ska skickas vidare till appen.

---

## Grundprincip

Vinvalvet använder två olika datamodeller:

### Råmodell

Råmodellen består av den data som hämtas från externa källor, exempelvis Systembolaget.

Den kan innehålla många fält som behövs för:

- filtrering
- analys
- validering
- felsökning
- databerikning

Råmodellen används endast i datageneratorn.

### Distributionsmodell

Distributionsmodellen är den optimerade modell som exporteras till `wine-index.json` och laddas ner av Vinvalvet.

Den ska vara:

- kompakt
- snabb att läsa
- enkel att importera
- anpassad för appens behov
- fri från onödiga källspecifika fält

---

## Minimal Distribution Principle

Ett fält ska endast distribueras till appen om Vinvalvet använder det idag eller har en tydligt planerad funktion för det.

För varje fält ska följande fråga kunna besvaras:

> Vilken funktion i Vinvalvet använder detta fält?

Om svaret är oklart ska fältet inte ingå i den distribuerade modellen.

---

# Fält som ska distribueras

Följande fält ska ingå i `wine-index.json`.

| Fält | Typ | Status | Syfte |
|---|---|:---:|---|
| id | string | ✅ | Internt unikt ID i Vinvalvets vinindex |
| productId | string | ✅ | Ursprungligt produkt-ID från källan |
| name | string | ✅ | Produktnamn som visas i appen |
| producer | string/null | ✅ | Producent |
| country | string/null | ✅ | Land |
| region | string/null | ✅ | Region |
| subRegion | string/null | ✅ | Underregion |
| wineType | string | ✅ | Typ av vin, exempelvis red, white, sparkling, rose, fortified |
| vintage | number/null | ✅ | Årgång om känd |
| grapes | array<string> | ✅ | Druvor |
| aliases | array<string> | ✅ | Alternativa namn och framtida sökstöd |
| searchTokens | array<string> | ✅ | Primärt underlag för lokal sökning och matchning |
| qrUrls | array<string> | ✅ | Framtida QR-matchning |
| source | string | ✅ | Datakälla, exempelvis systembolaget |
| sourceUrl | string/null | ✅ | Länk till ursprungskälla |
| imageUrl | string/null | ✅ | Flaskbild |
| labelImageUrl | string/null | ✅ | Framtida etikettigenkänning |
| ocrKeywords | array<string> | ✅ | Framtida OCR-matchning |
| alcoholPercentage | number/null | ✅ | Alkoholhalt |
| sugar | number/null | ✅ | Sockerhalt i gram per liter |
| volumeMl | number/null | ✅ | Volym i milliliter |
| priceSek | number/null | ✅ | Pris i SEK |

---

# Fält som inte ska distribueras

Följande fält kan användas av datageneratorn, men ska inte ingå i den distribuerade versionen av vinindexet.

| Fält | Status | Orsak |
|---|:---:|---|
| productNumber | ❌ | Källspecifikt fält som inte används av appen |
| productNumberShort | ❌ | Används endast för att skapa `sourceUrl` |
| categoryLevel1 | ❌ | Används endast av filtermotorn |
| categoryLevel2 | ❌ | Används endast av filtermotorn |
| categoryLevel3 | ❌ | Används endast av filtermotorn |
| categoryLevel4 | ❌ | Används endast av filtermotorn om det förekommer |
| customCategoryTitle | ❌ | Används endast av filtermotorn och analys |
| updatedAt | ❌ | Versionsinformation hanteras i metadatafilen |
| changedDate | ❌ | Historikfält från rådata |
| priceHistory | ❌ | Historikfält från rådata |
| alcoholHistory | ❌ | Historikfält från rådata |
| soldVolume | ❌ | Källspecifikt fält |
| assortment | ❌ | Källspecifikt sortimentsfält |
| assortmentText | ❌ | Källspecifikt sortimentsfält |
| packagingLevel1 | ❌ | Används inte av appen i nuläget |
| packagingCO2ImpactLevel | ❌ | Används inte av appen i nuläget |
| taste | ❌ | För lång text för första distributionsmodellen |
| usage | ❌ | Används inte av appen i nuläget |
| tasteSymbols | ❌ | Används inte av appen i nuläget |
| tasteClocks | ❌ | Används inte av appen i nuläget |
| images | ❌ | Ersätts av förenklat `imageUrl` |
| imageModules | ❌ | Källspecifik bildstruktur |
| supplierName | ❌ | Producent prioriteras framför leverantör |
| isOrganic | ❌ | Används inte av appen i nuläget |
| isKosher | ❌ | Används inte av appen i nuläget |
| isSustainableChoice | ❌ | Används inte av appen i nuläget |
| isClimateSmartPackaging | ❌ | Används inte av appen i nuläget |
| isEthical | ❌ | Används inte av appen i nuläget |
| ethicalLabel | ❌ | Används inte av appen i nuläget |
| isNews | ❌ | Källspecifikt statusfält |
| isDiscontinued | ❌ | Används inte i första distributionsmodellen |
| isTemporaryOutOfStock | ❌ | Lagerstatus ska inte styra vinindexet |
| isCompletelyOutOfStock | ❌ | Lagerstatus ska inte styra vinindexet |

---

# Metadata

Indexets övergripande metadata ska inte upprepas på varje produkt.

Följande information ska istället ligga i `wine-index-meta.json`:

| Fält | Typ | Syfte |
|---|---|---|
| version | string | Aktuell version av vinindexet |
| generatedAt | datetime | När indexet skapades |
| wineCount | number | Antal produkter i indexet |
| format | string | Filformat |
| fileName | string | Namn på indexfilen |
| downloadUrl | string | URL till aktuell indexfil |

---

# Exempel på distribuerad produkt

```json
{
  "id": "systembolaget_45330569",
  "productId": "45330569",
  "name": "The Flourishing Shiraz Alcohol Free",
  "producer": "MIS S.A/Associated Beverage Solutions S.A",
  "country": "Belgien",
  "region": null,
  "subRegion": null,
  "wineType": "red",
  "vintage": null,
  "grapes": [],
  "aliases": [],
  "searchTokens": [
    "alcohol",
    "alkoholfritt",
    "belgien",
    "flourishing",
    "free",
    "shiraz"
  ],
  "qrUrls": [],
  "source": "systembolaget",
  "sourceUrl": "https://www.systembolaget.se/produkt/vin/1967",
  "imageUrl": "https://product-cdn.systembolaget.se/productimages/45330569/45330569",
  "labelImageUrl": null,
  "ocrKeywords": [],
  "alcoholPercentage": 0,
  "sugar": 48,
  "volumeMl": 750,
  "priceSek": 84
}
```

---

# Regler

- Datageneratorn får använda fler fält än vad som distribueras.
- `wine-index.json` ska endast innehålla godkända distributionsfält.
- Kategorifält ska inte följa med efter filtrering.
- Historikfält från rådata ska inte följa med i första distributionsmodellen.
- Metadata ska ligga i `wine-index-meta.json`, inte upprepas på varje produkt.
- Nya fält ska dokumenteras här innan de läggs till i exporten.

---

# Framtida möjliga fält

Följande fält kan bli aktuella i framtiden, men ska inte ingå förrän Vinvalvet har konkret stöd för dem:

| Fält | Möjlig användning |
|---|---|
| organic | Filter för ekologiskt vin |
| sustainableChoice | Filter för hållbart val |
| packaging | Visning eller filter för förpackning |
| tasteProfile | Framtida smakprofilering |
| foodPairings | Framtida matmatchning |
| aiDescription | AI-genererad sammanfattning |
| embedding | Framtida AI-matchning |
| producerId | Stabil producentkoppling |
| normalizedName | Förbättrad matchning |
| normalizedProducer | Förbättrad matchning |

---

# Versionshistorik

## Version 1.0

**Datum:** 2026-06-30

Första versionen av Vinvalvets distributionsschema.

Fastställda beslut:

- Separera råmodell från distributionsmodell.
- Endast apprelevanta fält ska distribueras.
- Kategorifält används av filtermotorn men tas bort från `wine-index.json`.
- `updatedAt` tas bort från produktnivå och ersätts av metadata på indexnivå.
- `productNumber` och `productNumberShort` tas bort från distributionsmodellen.
