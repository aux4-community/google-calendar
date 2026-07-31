#### Description

The `create` command adds a new event to a calendar. The request body is assembled from the flags you provide — empty flags are omitted, so a minimal event needs only a start and end time.

The `--start` and `--end` flags accept two forms:

- A full RFC3339 dateTime (e.g. `2026-01-15T09:00:00`) creates a timed event. Combine it with `--timeZone` to set the IANA time zone; the value is sent as `{dateTime, timeZone}`.
- A bare `YYYY-MM-DD` date (e.g. `2026-01-15`) creates an all-day event, sent as `{date}`.

`--attendees` takes a comma-separated list of email addresses, which is expanded into an array of `{email}` objects. Surrounding whitespace around each address is trimmed.

#### Usage

```bash
aux4 google calendar events create [--calendarId <id>] [--summary <title>] [--description <text>] [--location <text>] [--start <dateTime|date>] [--end <dateTime|date>] [--timeZone <tz>] [--attendees <emails>] [--tokenFile <path>]
```

--calendarId   Calendar to create the event on (default: primary)
--summary      Event title
--description  Event description
--location     Event location
--start        Event start: RFC3339 dateTime, or `YYYY-MM-DD` for an all-day event
--end          Event end: RFC3339 dateTime, or `YYYY-MM-DD` for an all-day event
--timeZone     IANA time zone for the start and end times (e.g. `America/New_York`)
--attendees    Comma-separated attendee email addresses
--tokenFile    Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar events create \
  --summary "Project kickoff" \
  --location "Room 4B" \
  --start 2026-01-15T09:00:00 \
  --end 2026-01-15T10:00:00 \
  --timeZone America/New_York \
  --attendees sally@example.com,alex@example.com
```

```text
{
  "id": "abc123eventid",
  "summary": "Project kickoff",
  "start": {"dateTime": "2026-01-15T09:00:00-05:00", "timeZone": "America/New_York"},
  "end": {"dateTime": "2026-01-15T10:00:00-05:00", "timeZone": "America/New_York"},
  "attendees": [{"email": "sally@example.com"}, {"email": "alex@example.com"}]
}
```

Create an all-day event:

```bash
aux4 google calendar events create --summary "Company holiday" --start 2026-07-04 --end 2026-07-05
```
