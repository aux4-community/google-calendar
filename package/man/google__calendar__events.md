#### Description

The `google calendar events` command group lists, reads, and manages events on a calendar. Every command accepts `--calendarId` to target a calendar other than `primary`.

Available subcommands:

- **list** — List events on a calendar
- **get** — Get a single event by ID
- **create** — Create an event
- **update** — Update an existing event (PATCH semantics)
- **delete** — Delete an event by ID
- **quick-add** — Create an event from a natural-language description

#### Usage

```bash
aux4 google calendar events <subcommand>
```

#### Example

```bash
aux4 google calendar events list --timeMin 2026-01-01T00:00:00Z --singleEvents true --orderBy startTime
aux4 google calendar events get abc123eventid
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon"
```
