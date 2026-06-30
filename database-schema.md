\# Vinvalvet Database Schema



Detta dokument beskriver den planerade datamodellen för Vinvalvets egen vin- och produktdatabas.



Syftet är att Vinvalvet ska kunna använda en egen kontrollerad datakälla för:

\- sökning

\- OCR-matchning

\- QR-flöde

\- framtida AI-matchning

\- minskat beroende av externa tjänster



\## Collection: wines



Varje dokument i `wines` representerar ett vin eller en produktpost.



\---



\## Obligatoriska fält



| Fält | Typ | Beskrivning |

|---|---|---|

| id | string | Internt unikt ID i Vinvalvet |

| productId | string | Produkt-ID från ursprunglig datakälla om tillgängligt |

| name | string | Vinets namn |

| wineType | string | Typ av vin, t.ex. red, white, sparkling, rose |

| searchTokens | array<string> | Sökbara ord för namn, producent, land, region och alias |

| updatedAt | timestamp | Senaste uppdatering av posten |



\---



\## Rekommenderade fält



| Fält | Typ | Beskrivning |

|---|---|---|

| producer | string | Producent |

| country | string | Land |

| region | string | Region |

| vintage | number/null | Årgång om känd |

| grapes | array<string> | Druvor |

| aliases | array<string> | Alternativa namn och vanliga sökningar |

| source | string | Var datan kommer från |

| sourceUrl | string/null | Länk till källa om tillgängligt |



\---



\## Valfria fält



| Fält | Typ | Beskrivning |

|---|---|---|

| qrUrls | array<string> | QR-länkar som kan kopplas till vinet |

| imageUrl | string/null | Bild på flaska eller etikett |

| labelImageUrl | string/null | Bild särskilt av etikett |

| ocrKeywords | array<string> | Ord som hjälper OCR-matchning |

| alcoholPercentage | number/null | Alkoholhalt |

| sugar | number/null | Sockerhalt i gram per 100ml |

| volumeMl | number/null | Volym i ml |

| priceSek | number/null | Pris i SEK |

| systembolagetUrl | string/null | Länk till Systembolaget om sådan finns |



\---



\## Framtida AI-fält



| Fält | Typ | Beskrivning |

|---|---|---|

| embedding | array<number>/null | Framtida vektor för AI-matchning |

| aiDescription | string/null | AI-genererad sammanfattning |

| labelRecognitionHints | array<string> | Hjälpord för bildigenkänning |



\---



\## Exempel



```json

{

&#x20; "id": "vinvalvet\_000001",

&#x20; "productId": "12345",

&#x20; "name": "Naltros Cava Brut",

&#x20; "producer": "Naltros",

&#x20; "country": "Spain",

&#x20; "region": "Cava",

&#x20; "wineType": "sparkling",

&#x20; "vintage": null,

&#x20; "grapes": \["Macabeo", "Xarel-lo", "Parellada"],

&#x20; "aliases": \["Naltros Cava", "Naltros Brut"],

&#x20; "searchTokens": \[

&#x20;   "naltros",

&#x20;   "cava",

&#x20;   "brut",

&#x20;   "spain",

&#x20;   "sparkling"

&#x20; ],

&#x20; "qrUrls": \[],

&#x20; "source": "vinvalvet",

&#x20; "sourceUrl": null,

&#x20; "updatedAt": "2026-06-16T00:00:00Z"

}

