# Vinvalvet Import Strategy

## Syfte

Detta dokument beskriver hur data ska samlas in, bearbetas, valideras och distribueras till Vinvalvets vinindex.

Målet är att skapa ett stabilt och kontrollerat importflöde som kan underhålla Vinvalvets egen databas med hög kvalitet och minimalt beroende av externa tjänster.

---

## Datakällor

Följande datakällor kan användas som underlag för import:

- Systembolaget
- Producenter
- Importerade CSV-filer
- Manuell kurering
- Användargenererade förbättringar

---

## Importflöde

Ett standardiserat importflöde ska användas för att säkerställa datakvalitet och spårbarhet.

Datakälla

↓

Import

↓

Validering

↓

Datatransformering

↓

Vinvalvets vinindex

↓

JSON / ZIP-export

↓

Distribution

↓

Vinvalvet App

---

## Uppdateringsstrategi

Följande uppdateringsmodeller kan användas beroende på datakälla:

### Daglig import

Lämplig för:

- produktförändringar
- prisförändringar
- sortimentsförändringar

### Veckovis import

Lämplig för:

- större datamängder
- kompletterande metadata
- kvalitetsförbättringar

### Manuell verifiering

Används när:

- datakvaliteten är osäker
- flera källor innehåller motstridig information
- korrigeringar behöver granskas innan publicering

---

## Konflikthantering

När flera datakällor innehåller olika information för samma produkt ska följande prioritering användas.

### Dataprioritet

1. Manuella korrigeringar
2. Användargenererade förbättringar
3. Producentdata
4. Egna importer
5. Systembolagsdata
6. OCR-genererad information

### Exempel

Producentdata vinner över OCR-data.

Manuella korrigeringar vinner över importerad data.

---

## Distribution och lokal lagring

Vinvalvets vinindex ska distribueras som versionshanterade JSON- eller ZIP-filer.

Appen laddar ner aktuell version vid behov och importerar innehållet till lokal Isar-databas.

Sökning, OCR-matchning och QR-matchning ska i första hand ske lokalt i Isar.

Firestore ska inte användas som primär sökmotor för vinindexet för att:

- minimera driftkostnader
- minska antalet databasläsningar
- ge snabbare sökningar
- möjliggöra offline-användning

---

## Långsiktigt mål

Målet är att Vinvalvet ska kunna bygga och underhålla ett komplett vinindex med hjälp av egna importflöden.

Systemet ska kunna uppdateras centralt men användas lokalt på användarens enhet via Isar.

På sikt ska beroendet av externa tjänster kunna minimeras eller helt elimineras.
