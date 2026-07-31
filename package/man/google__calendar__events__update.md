#### Description

The `update` command modifies an existing event using PATCH semantics — only the fields you pass are changed, and any field you omit keeps its current value. This makes it safe to, for example, change just the start and end time without re-sending the summary and attendees.

The `--start`, `--end`, `--timeZone`, and `--attendees` flags behave exactly as in `events create`: a full RFC3339 dateTime (with `--timeZone`) produces a timed event, a bare `YYYY-MM-DD` date produces an all-day event, and attendees are given as a comma-separated list of email addresses.

#### Usage

```bash
aux4 google calendar events update <eventId> [--calendarId <id>] [--summary <title>] [--description <text>] [--location <text>] [--start <dateTime|date>] [--end <dateTime|date>] [--timeZone <tz>] [--attendees <emails>] [--tokenFile <path>]
```

eventId        The event ID to update (required)
--calendarId   Calendar the event belongs to (default: primary)
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
aux4 google calendar events update abc123eventid --summary "Project kickoff (rescheduled)" --start 2026-01-16T09:00:00 --end 2026-01-16T10:00:00 --timeZone America/New_York
```

```text
{
  "id": "abc123eventid",
  "summary": "Project kickoff (rescheduled)",
  "start": {"dateTime": "2026-01-16T09:00:00-05:00", "timeZone": "America/New_York"},
  "end": {"dateTime": "2026-01-16T10:00:00-05:00", "timeZone": "America/New_York"}
}
```
