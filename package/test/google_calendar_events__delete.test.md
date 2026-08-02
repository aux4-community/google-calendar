# google calendar events delete

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server. Delete returns an empty `204 No Content`, so the stub is fed an
empty body via `printf ''` (an empty `--body` would make `mock stub` block on stdin).
The test then verifies the DELETE method and event path.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18985 2>/dev/null
pkill -f "18985" 2>/dev/null
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

### should DELETE the event by ID from the primary calendar

```execute
aux4 mock start --port 18985 >/dev/null 2>&1
sleep 1
printf '' | aux4 mock stub --port 18985 --method DELETE --path '/calendars/{calendarId}/events/{eventId}' --status 204 >/dev/null
aux4 google calendar events delete abc123eventid --tokenFile google-token.json --apiUrl http://127.0.0.1:18985/api
aux4 mock verify --port 18985 --method DELETE --path /calendars/primary/events/abc123eventid --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

### should target a non-primary calendar when calendarId is set

```execute
aux4 mock reset --port 18985 --requests >/dev/null
aux4 google calendar events delete abc123eventid --calendarId team@group.calendar.google.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18985/api >/dev/null
aux4 mock verify --port 18985 --method DELETE --path /calendars/team@group.calendar.google.com/events/abc123eventid
```

```expect:partial
verify ok
```
