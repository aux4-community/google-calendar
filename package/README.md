# community/google-calendar

Commands to interact with Google Calendar using the Calendar API v3

This package provides aux4 command wrappers for the [Google Calendar API v3](https://developers.google.com/calendar/api/v3/reference). It covers listing calendars, listing and reading events, creating, updating, and deleting events, quick-adding events from natural language, and querying free/busy information across calendars.

Authentication is handled by [community/google-auth](https://hub.aux4.io/package/community/google-auth), which stores a single OAuth2 token shared by every aux4 Google package.

## Installation

```bash
aux4 aux4 pkger install community/google-calendar
```

## Prerequisites

Authenticate once with `community/google-auth`. The scopes are resolved from the installed Google service packages, so no `--scopes` flag is needed:

```bash
aux4 google auth login
```

This package requests `https://www.googleapis.com/auth/calendar`, which allows both reading and managing events. To request read-only access instead, use:

```bash
aux4 google auth login --readonly true
```

which requests `https://www.googleapis.com/auth/calendar.readonly`. Read-only access is enough for `calendars list`, `events list`, `events get`, and `freebusy`, but not for creating, updating, or deleting events.

Check the current state at any time:

```bash
aux4 google auth status
```

## Quick Start

List your calendars:

```bash
aux4 google calendar calendars list
```

List upcoming events on your primary calendar:

```bash
aux4 google calendar events list --timeMin 2026-01-01T00:00:00Z --singleEvents true --orderBy startTime
```

Create an event:

```bash
aux4 google calendar events create --summary "Team sync" --start 2026-01-15T09:00:00 --end 2026-01-15T09:30:00 --timeZone America/New_York
```

## Calendars

### List calendars

List every calendar on the authenticated user's calendar list:

```bash
aux4 google calendar calendars list
```

## Events

All event commands accept `--calendarId` to target a calendar other than `primary` (for example a shared calendar's email-style ID).

### List events

```bash
aux4 google calendar events list --calendarId primary --timeMin 2026-01-01T00:00:00Z --timeMax 2026-02-01T00:00:00Z --singleEvents true --orderBy startTime --maxResults 50
```

Optional filters:

- `--timeMin` / `--timeMax` — RFC3339 timestamps bounding the query window
- `--query` — free-text search across event fields (sent as the `q` parameter)
- `--maxResults` — page size
- `--singleEvents` — set to `true` to expand recurring events into instances
- `--orderBy` — `startTime` (requires `--singleEvents true`) or `updated`

Only the flags you provide are added to the request.

### Get an event

```bash
aux4 google calendar events get abc123eventid --calendarId primary
```

### Create an event

```bash
aux4 google calendar events create \
  --summary "Project kickoff" \
  --description "Kickoff meeting for the new project" \
  --location "Room 4B" \
  --start 2026-01-15T09:00:00 \
  --end 2026-01-15T10:00:00 \
  --timeZone America/New_York \
  --attendees sally@example.com,alex@example.com
```

The `--start` and `--end` flags accept either a full RFC3339 dateTime (a timed event, combined with `--timeZone`) or a bare `YYYY-MM-DD` date (an all-day event). Attendees are given as a comma-separated list of email addresses.

### Update an event

Updates use PATCH semantics — only the fields you pass are changed:

```bash
aux4 google calendar events update abc123eventid --summary "Project kickoff (rescheduled)" --start 2026-01-16T09:00:00 --end 2026-01-16T10:00:00 --timeZone America/New_York
```

### Delete an event

```bash
aux4 google calendar events delete abc123eventid --calendarId primary
```

### Quick-add an event

Create an event from a natural-language phrase:

```bash
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon"
```

## Free/Busy

Query when a set of calendars are busy within a time window:

```bash
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --calendars primary,team@group.calendar.google.com
```

## Environment Variables

- `AUX4_GOOGLE_TOKEN_FILE` — where the shared Google OAuth token lives. Defaults to `~/.aux4.config/.oauth/google.json`, the same location `aux4 google auth login` writes to, so it normally needs no setting.

## License

MIT — See [LICENSE](./LICENSE) for details.
