#### Description

The `quick-add` command creates an event from a single natural-language phrase, letting Google Calendar parse the date, time, and title. It is the fastest way to add a simple event without specifying start and end times separately. The text is URL-encoded and sent as the `text` query parameter to the `quickAdd` endpoint.

Phrases like `Lunch with Sally tomorrow at noon` or `Dentist appointment on Friday at 3pm` are interpreted by Google's parser, which sets the event summary and time automatically.

#### Usage

```bash
aux4 google calendar events quick-add <text> [--calendarId <id>] [--tokenFile <path>]
```

text           Natural-language event description (required)
--calendarId   Calendar to create the event on (default: primary)
--tokenFile    Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon"
```

```text
{
  "id": "abc123eventid",
  "summary": "Lunch with Sally",
  "start": {"dateTime": "2026-01-16T12:00:00-05:00"},
  "end": {"dateTime": "2026-01-16T13:00:00-05:00"}
}
```
