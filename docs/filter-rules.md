# Vinvalvet Filter Rules

## Syfte

Detta dokument definierar vilka produkter som ska inkluderas i
Vinvalvets vinindex.

Målet är att Vinvalvet endast ska innehålla produkter som användaren
rimligen förväntar sig att kunna lagra i en vinkällare. Filtreringen
sker i datageneratorn innan vinindexet distribueras till appen.

Detta minskar datamängden, förbättrar sökprestandan och säkerställer att
endast relevanta produkter finns tillgängliga för sökning, OCR-matchning
och QR-matchning.

------------------------------------------------------------------------

# Arkitektur

``` text
Systembolaget
        │
        ▼
Rå produktdata
        │
        ▼
Vinvalvet Data Generator
        │
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
Vinvalvet
```

All filtrering sker i datageneratorn.

Flutter-appen ska endast ladda ner ett färdigfiltrerat vinindex.

------------------------------------------------------------------------

# Inkluderas

  Produktkategori     Ska ingå
  ------------------ ----------
  Rött vin               ✅
  Vitt vin               ✅
  Rosévin                ✅
  Mousserande vin        ✅
  Starkvin               ✅
  Vinlådor               ✅
  Smaksatta viner        ✅
  Alkoholfritt vin       ✅

------------------------------------------------------------------------

# Exkluderas

  Produktkategori    Ska ingå
  ----------------- ----------
  Öl                    ❌
  Sprit                 ❌
  Cider                 ❌
  Blanddrycker          ❌
  Glögg                 ❌
  Glühwein              ❌
  Sake                  ❌

------------------------------------------------------------------------

# Designprinciper

-   Endast produkter som naturligt hör hemma i en vinkällare ska
    inkluderas.
-   Filtreringen ska ske innan vinindexet genereras.
-   Flutter-appen ska endast arbeta med ett färdigfiltrerat vinindex.
-   Flutter-appen ska inte behöva filtrera bort produkter.
-   Alla produkter som exkluderas ska filtreras bort i datageneratorn.
-   Filterreglerna ska vara enkla att förstå, underhålla och utöka.

------------------------------------------------------------------------

# Mål

Filtreringen ska ge:

-   mindre nedladdningar
-   mindre lagringsutrymme på telefonen
-   snabbare sökningar
-   snabbare OCR-matchning
-   snabbare QR-matchning
-   renare sökresultat
-   bättre användarupplevelse

------------------------------------------------------------------------

# Framtida ändringar

Om Systembolaget introducerar nya produktkategorier ska dessa granskas
innan de inkluderas i Vinvalvets vinindex.

Ingen ny kategori ska automatiskt inkluderas.

Detta dokument är den centrala specifikationen för datageneratorns
filterlogik.

------------------------------------------------------------------------

# Versionshistorik

## Version 1.0

**Datum:** 2026-06-30

Första versionen av Vinvalvets officiella filterregler.

Fastställda beslut:

-   Rött vin ingår
-   Vitt vin ingår
-   Rosévin ingår
-   Mousserande vin ingår
-   Starkvin ingår
-   Vinlådor ingår
-   Smaksatta viner ingår
-   Alkoholfritt vin ingår
-   Öl exkluderas
-   Sprit exkluderas
-   Cider exkluderas
-   Blanddrycker exkluderas
-   Glögg exkluderas
-   Glühwein exkluderas
-   Sake exkluderas
