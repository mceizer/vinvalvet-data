# Vinvalvet Data

Dataplattformen för **Vinvalvet**.

Detta repository innehåller datageneratorn, importflödet och
dokumentationen som används för att bygga och underhålla Vinvalvets egna
vinindex.

Projektet bygger ursprungligen på en fork av C4illins
*systembolaget-data*, men utvecklas successivt mot en fristående lösning
anpassad för Vinvalvets behov.

------------------------------------------------------------------------

# Syfte

Målet är att skapa ett komplett, versionshanterat och lokalt optimerat
vinindex som används av Vinvalvet.

Dataplattformen ansvarar för att: - hämta produktdata - filtrera bort
produkter som inte ska ingå - validera datakvalitet - berika
information - generera Vinvalvets vinindex - publicera nya versioner

Flutter-appen ska endast konsumera det färdiga vinindexet.

------------------------------------------------------------------------

# Arkitektur

``` text
Systembolaget / Datakällor
            │
            ▼
    Vinvalvet Data Generator
            │
            ├── Import
            ├── Filtrering
            ├── Validering
            ├── Databerikning
            │
            ▼
wine-index.json
wine-index-meta.json
            │
            ▼
GitHub
            │
            ▼
Vinvalvet App
            │
            ▼
Lokal Isar-databas
```

------------------------------------------------------------------------

# Dokumentation

Se katalogen `/docs`.

-   Database Schema
-   Data Sources
-   Filter Rules
-   Import Strategy
-   Index Versioning
-   QR Strategy

------------------------------------------------------------------------

# Projektmål

-   Egen kontrollerad datakälla
-   Snabb lokal sökning
-   OCR-matchning
-   QR-matchning
-   Offline-stöd
-   Minimal driftkostnad
-   Framtida AI-stöd

------------------------------------------------------------------------

# Roadmap

## Fas 3

-   Bygga filtermotor
-   Databerikning
-   Metadata-generator
-   Automatisk versionshantering
-   Distribution av vinindex

------------------------------------------------------------------------

# Licens

Projektet är en del av Vinvalvet och utvecklas för att stödja Vinvalvets
egna dataplattform.
