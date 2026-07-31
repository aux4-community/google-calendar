# google calendar events get

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the method and path aux4 builds for a
single-event lookup.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18982 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18982/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
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

### should GET the event by ID from the primary calendar

```execute
aux4 google calendar events get abc123eventid --tokenFile google-token.json --apiUrl http://127.0.0.1:18982
```

```expect:partial
"method": "GET"
```

```expect:partial
"path": "/calendars/primary/events/abc123eventid"
```

### should target a non-primary calendar when calendarId is set

```execute
aux4 google calendar events get abc123eventid --calendarId team@group.calendar.google.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18982
```

```expect:partial
"path": "/calendars/team@group.calendar.google.com/events/abc123eventid"
```
