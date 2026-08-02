# google calendar events update

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server: the test stubs a realistic updated-event response and then verifies
the PATCH method, event path and the partial JSON body aux4 sends.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18984 2>/dev/null
pkill -f "18984" 2>/dev/null
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

### should PATCH the event by ID and return the stubbed event

```execute
aux4 mock start --port 18984 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18984 --method PATCH --path '/calendars/{calendarId}/events/{eventId}' --status 200 --body '{"kind":"calendar#event","id":"${path.eventId}","status":"confirmed","summary":"Rescheduled"}' >/dev/null
aux4 google calendar events update abc123eventid --summary "Rescheduled" --tokenFile google-token.json --apiUrl http://127.0.0.1:18984/api
```

```expect:partial
"summary":"Rescheduled"
```

### should send a PATCH to the event on the primary calendar

```execute
aux4 mock verify --port 18984 --method PATCH --path /calendars/primary/events/abc123eventid --header "authorization=Bearer test-access-token" --body-contains '"summary":"Rescheduled"'
```

```expect:partial
verify ok
```

### should send only the changed fields in the body

```execute
aux4 mock reset --port 18984 --requests >/dev/null
aux4 google calendar events update abc123eventid --summary "Project kickoff (rescheduled)" --start 2026-01-16T09:00:00 --end 2026-01-16T10:00:00 --timeZone America/New_York --tokenFile google-token.json --apiUrl http://127.0.0.1:18984/api >/dev/null
aux4 mock verify --port 18984 --method PATCH --path /calendars/primary/events/abc123eventid --body-contains '"summary":"Project kickoff (rescheduled)"' --body-contains '"start":{"dateTime":"2026-01-16T09:00:00","timeZone":"America/New_York"}' --body-contains '"end":{"dateTime":"2026-01-16T10:00:00","timeZone":"America/New_York"}'
```

```expect:partial
verify ok
```
