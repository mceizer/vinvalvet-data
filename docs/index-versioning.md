Syfte:
Hur vet appen att en ny vin-databas finns?

------------------

Exempel:
</> JSON
{
  "version": "2026.06.16",
  "generatedAt": "2026-06-16T20:00:00Z",
  "wineCount": 45231,
  "downloadUrl": "..."
}

--------------------

Start
  ↓
Kontrollera version
  ↓
Nyare?
  ↓
Ja
  ↓
Ladda ner
  ↓
Importera till Isar
