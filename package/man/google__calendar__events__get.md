#### Description

The `get` command retrieves a single event by its ID and returns the full event resource — summary, description, location, start and end times, attendees, organizer, recurrence, and status. Use the event IDs returned by `events list` or from the response of `events create`.

#### Usage

```bash
aux4 google calendar events get <eventId> [--calendarId <id>] [--tokenFile <path>]
```

eventId        The event ID to retrieve (required)
--calendarId   Calendar the event belongs to (default: primary)
--tokenFile    Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar events get abc123eventid
```

```text
{
  "id": "abc123eventid",
  "summary": "Team sync",
  "start": {"dateTime": "2026-01-15T09:00:00-05:00"},
  "end": {"dateTime": "2026-01-15T09:30:00-05:00"},
  "status": "confirmed"
}
```
