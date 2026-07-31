# google calendar events delete

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the DELETE method and event path.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18985 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18985/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
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

### should DELETE the event by ID

```execute
aux4 google calendar events delete abc123eventid --tokenFile google-token.json --apiUrl http://127.0.0.1:18985
```

```expect:partial
"method": "DELETE"
```

```expect:partial
"path": "/calendars/primary/events/abc123eventid"
```

### should target a non-primary calendar when calendarId is set

```execute
aux4 google calendar events delete abc123eventid --calendarId team@group.calendar.google.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18985
```

```expect:partial
"path": "/calendars/team@group.calendar.google.com/events/abc123eventid"
```
