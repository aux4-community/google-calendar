#### Description

The `list` command returns events from a calendar. All filters are optional — only the flags you provide are added to the request, so calling it with no filters returns the calendar's events with the API defaults.

To list events in chronological order, pass `--singleEvents true` (which expands recurring events into individual instances) together with `--orderBy startTime`. The API rejects `--orderBy startTime` without `--singleEvents true`.

#### Usage

```bash
aux4 google calendar events list [--calendarId <id>] [--timeMin <ts>] [--timeMax <ts>] [--query <text>] [--maxResults <n>] [--singleEvents <true|false>] [--orderBy <startTime|updated>] [--tokenFile <path>]
```

--calendarId   Calendar to read from (default: primary)
--timeMin      Lower bound (inclusive) for an event's end time (RFC3339 timestamp)
--timeMax      Upper bound (exclusive) for an event's start time (RFC3339 timestamp)
--query        Free-text search terms, sent as the `q` parameter
--maxResults   Maximum number of events returned on one result page
--singleEvents Expand recurring events into single instances (`true` or `false`)
--orderBy      Order of the events returned (`startTime` or `updated`)
--tokenFile    Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar events list --timeMin 2026-01-01T00:00:00Z --timeMax 2026-02-01T00:00:00Z --singleEvents true --orderBy startTime --maxResults 50
```

```text
{
  "kind": "calendar#events",
  "items": [
    {"id": "abc123", "summary": "Team sync", "start": {"dateTime": "2026-01-15T09:00:00-05:00"}, "end": {"dateTime": "2026-01-15T09:30:00-05:00"}}
  ]
}
```

Search for events matching a phrase:

```bash
aux4 google calendar events list --query "kickoff"
```
