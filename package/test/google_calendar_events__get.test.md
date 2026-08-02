# google calendar events get

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server: the test stubs a realistic single-event response (templated on the
`{eventId}` path param) and then verifies the method and path aux4 builds for a
single-event lookup.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18982 2>/dev/null
pkill -f "18982" 2>/dev/null
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

### should GET the event by ID and return the stubbed event

```execute
aux4 mock start --port 18982 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18982 --method GET --path '/calendars/{calendarId}/events/{eventId}' --status 200 --body '{"kind":"calendar#event","id":"${path.eventId}","status":"confirmed","summary":"Team sync","start":{"dateTime":"2026-01-15T09:00:00-05:00"},"end":{"dateTime":"2026-01-15T09:30:00-05:00"}}' >/dev/null
aux4 google calendar events get abc123eventid --tokenFile google-token.json --apiUrl http://127.0.0.1:18982/api
```

```expect:partial
"id":"abc123eventid"
```

```expect:partial
"status":"confirmed"
```

### should send a GET to the event on the primary calendar

```execute
aux4 mock verify --port 18982 --method GET --path /calendars/primary/events/abc123eventid --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

### should target a non-primary calendar when calendarId is set

```execute
aux4 mock reset --port 18982 --requests >/dev/null
aux4 google calendar events get abc123eventid --calendarId team@group.calendar.google.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18982/api >/dev/null
aux4 mock verify --port 18982 --method GET --path /calendars/team@group.calendar.google.com/events/abc123eventid
```

```expect:partial
verify ok
```
