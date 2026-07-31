#### Description

The `google calendar` command group provides access to Google Calendar through the Calendar API v3. Every request is signed with the shared Google OAuth2 token that `community/google-auth` maintains, so there is nothing to configure beyond a single login.

Available subcommands:

- **calendars** — List the calendars on the user's calendar list
- **events** — List, read, create, update, delete, and quick-add events
- **freebusy** — Query free/busy information across a set of calendars

#### Prerequisites

Authenticate once before first use. Scopes are resolved from the installed Google service packages, so no `--scopes` flag is required:

```bash
aux4 google auth login
```

This package requests `https://www.googleapis.com/auth/calendar`, which allows reading and managing events. Use `aux4 google auth login --readonly true` to request `https://www.googleapis.com/auth/calendar.readonly` instead, which is enough for the read-only commands.

The token is read from `~/.aux4.config/.oauth/google.json`. Override it per command with `--tokenFile`, or for the whole shell with the `AUX4_GOOGLE_TOKEN_FILE` environment variable.

#### Usage

```bash
aux4 google calendar <subcommand>
```

#### Example

```bash
aux4 google calendar calendars list
aux4 google calendar events list --timeMin 2026-01-01T00:00:00Z --singleEvents true --orderBy startTime
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon"
```
