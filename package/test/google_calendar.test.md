# google calendar

Part of the optional `integration` group in `test.suite.md`. These tests talk to the
real Calendar API, so they need a completed `aux4 google auth login` — a Google Cloud
OAuth Desktop client plus a human approving the consent screen in a browser. They only
run when asked for explicitly:

```bash
aux4 test run --group integration
```

The read-only commands used here are safe to run against a real account.

```timeout
15000
```

## calendars

### should list the user's calendars

```execute
aux4 google calendar calendars list
```

```expect:partial
"items"
```

## events

### should list events on the primary calendar

```execute
aux4 google calendar events list --maxResults 5 --singleEvents true --orderBy startTime
```

```expect:partial
"kind": "calendar#events"
```

## freebusy

### should return busy information for the primary calendar

```execute
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --calendars primary
```

```expect:partial
"calendars"
```
