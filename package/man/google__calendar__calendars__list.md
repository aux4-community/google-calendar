#### Description

The `list` command returns every calendar on the authenticated user's calendar list — the set of calendars shown in the Google Calendar sidebar, including primary, secondary, and subscribed calendars. Each entry includes the calendar ID, summary, time zone, access role, and color.

Use the calendar IDs returned here as the `--calendarId` value for the `events` commands or in the comma-separated list passed to `freebusy`.

#### Usage

```bash
aux4 google calendar calendars list [--tokenFile <path>]
```

--tokenFile  Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar calendars list
```

```text
{
  "kind": "calendar#calendarList",
  "items": [
    {"id": "user@example.com", "summary": "user@example.com", "primary": true, "accessRole": "owner"},
    {"id": "team@group.calendar.google.com", "summary": "Team", "accessRole": "reader"}
  ]
}
```
