# google calendar events create

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server: the test stubs a realistic created-event response and then verifies
the JSON body aux4 assembles from the flags — including the built `start`/`end` objects
and the `attendees` array.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18983 2>/dev/null
pkill -f "18983" 2>/dev/null
```

```file:google-token.json
{
  "clientId": "test-client",
  "clientSecret": "test-secret",
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth",
  "tokenUrl": "https://oauth2.googleapis.com/token",
  "scopes": "https://www.googleapis.com/auth/calendar",
  "accessToken": "test-access-token",
  "refreshToken": "test-refresh-token",
  "expiresAt": "2099-12-31T23:59:59Z"
}
```

### should POST to the events endpoint and return the stubbed event

```execute
aux4 mock start --port 18983 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18983 --method POST --path '/calendars/{calendarId}/events' --status 200 --body '{"kind":"calendar#event","id":"evt_new_123","status":"confirmed","htmlLink":"https://www.google.com/calendar/event?eid=abc","summary":"Team sync"}' >/dev/null
aux4 google calendar events create --summary "Team sync" --start 2026-01-15T09:00:00 --end 2026-01-15T09:30:00 --timeZone America/New_York --tokenFile google-token.json --apiUrl http://127.0.0.1:18983/api
```

```expect:partial
"status":"confirmed"
```

### should POST with a bearer token, JSON content type and the event body

```execute
aux4 mock verify --port 18983 --method POST --path /calendars/primary/events --header "authorization=Bearer test-access-token" --header "content-type=application/json" --body-contains '"summary":"Team sync"' --body-contains '"start":{"dateTime":"2026-01-15T09:00:00","timeZone":"America/New_York"}'
```

```expect:partial
verify ok
```

### should build a timed event body with start, end and attendees

```execute
aux4 mock reset --port 18983 --requests >/dev/null
aux4 google calendar events create --summary "Project kickoff" --location "Room 4B" --start 2026-01-15T09:00:00 --end 2026-01-15T10:00:00 --timeZone America/New_York --attendees sally@example.com,alex@example.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18983/api >/dev/null
aux4 mock verify --port 18983 --method POST --path /calendars/primary/events --body-contains '"summary":"Project kickoff"' --body-contains '"location":"Room 4B"' --body-contains '"start":{"dateTime":"2026-01-15T09:00:00","timeZone":"America/New_York"}' --body-contains '"end":{"dateTime":"2026-01-15T10:00:00","timeZone":"America/New_York"}' --body-contains '"attendees":[{"email":"sally@example.com"},{"email":"alex@example.com"}]'
```

```expect:partial
verify ok
```

### should build an all-day event body using date fields when start is a bare date

```execute
aux4 mock reset --port 18983 --requests >/dev/null
aux4 google calendar events create --summary "Company holiday" --start 2026-07-04 --end 2026-07-05 --tokenFile google-token.json --apiUrl http://127.0.0.1:18983/api >/dev/null
aux4 mock verify --port 18983 --method POST --path /calendars/primary/events --body-contains '"summary":"Company holiday"' --body-contains '"start":{"date":"2026-07-04"}' --body-contains '"end":{"date":"2026-07-05"}'
```

```expect:partial
verify ok
```
