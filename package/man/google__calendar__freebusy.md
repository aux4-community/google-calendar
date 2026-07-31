#### Description

The `freebusy` command reports the busy time ranges for a set of calendars within a time window. It answers the question "when is everyone free?" without exposing event details — the response contains only busy intervals per calendar. This is useful for scheduling meetings across several people or resources.

The `--calendars` flag takes a comma-separated list of calendar IDs, which is expanded into the API's `items` array of `{id}` objects.

#### Usage

```bash
aux4 google calendar freebusy [--timeMin <ts>] [--timeMax <ts>] [--calendars <ids>] [--tokenFile <path>]
```

--timeMin      Start of the interval (RFC3339 timestamp, e.g. `2026-01-15T00:00:00Z`)
--timeMax      End of the interval (RFC3339 timestamp, e.g. `2026-01-16T00:00:00Z`)
--calendars    Comma-separated calendar IDs to query (default: primary)
--tokenFile    Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --calendars primary,team@group.calendar.google.com
```

```text
{
  "kind": "calendar#freeBusy",
  "timeMin": "2026-01-15T00:00:00.000Z",
  "timeMax": "2026-01-16T00:00:00.000Z",
  "calendars": {
    "primary": {"busy": [{"start": "2026-01-15T09:00:00Z", "end": "2026-01-15T10:00:00Z"}]},
    "team@group.calendar.google.com": {"busy": []}
  }
}
```
