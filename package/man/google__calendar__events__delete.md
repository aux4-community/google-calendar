#### Description

The `delete` command permanently removes an event from a calendar. On success the API returns an empty response. This action cannot be undone, so make sure the event ID is correct — use `events list` or `events get` to confirm before deleting.

#### Usage

```bash
aux4 google calendar events delete <eventId> [--calendarId <id>] [--tokenFile <path>]
```

eventId        The event ID to delete (required)
--calendarId   Calendar the event belongs to (default: primary)
--tokenFile    Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar events delete abc123eventid
```

```text
```

A successful delete produces no output.
