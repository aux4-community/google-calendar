# google calendar events list

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the exact path and query string aux4
builds from the optional filter flags.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18981 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18981/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
pkill -f "18981" 2>/dev/null
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

### should GET the events endpoint with no query string when no filters are given

```execute
aux4 google calendar events list --tokenFile google-token.json --apiUrl http://127.0.0.1:18981
```

```expect:partial
"method": "GET"
```

```expect:partial
"path": "/calendars/primary/events"
```

### should url-encode and append every provided filter as a query parameter

```execute
aux4 google calendar events list --timeMin 2026-01-01T00:00:00Z --query "team sync" --maxResults 5 --singleEvents true --orderBy startTime --tokenFile google-token.json --apiUrl http://127.0.0.1:18981
```

```expect:partial
"path": "/calendars/primary/events?timeMin=2026-01-01T00%3A00%3A00Z&q=team%20sync&maxResults=5&singleEvents=true&orderBy=startTime"
```

### should target a non-primary calendar when calendarId is set

```execute
aux4 google calendar events list --calendarId team@group.calendar.google.com --timeMax 2026-02-01T00:00:00Z --tokenFile google-token.json --apiUrl http://127.0.0.1:18981
```

```expect:partial
"path": "/calendars/team@group.calendar.google.com/events?timeMax=2026-02-01T00%3A00%3A00Z"
```
