# google calendar events update

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the PATCH method, event path and the
partial JSON body aux4 sends.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18984 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18984/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
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

### should PATCH the event by ID

```execute
aux4 google calendar events update abc123eventid --summary "Rescheduled" --tokenFile google-token.json --apiUrl http://127.0.0.1:18984
```

```expect:partial
"method": "PATCH"
```

```expect:partial
"path": "/calendars/primary/events/abc123eventid"
```

### should send only the changed fields in the body

```execute
aux4 google calendar events update abc123eventid --summary "Project kickoff (rescheduled)" --start 2026-01-16T09:00:00 --end 2026-01-16T10:00:00 --timeZone America/New_York --tokenFile google-token.json --apiUrl http://127.0.0.1:18984 | aux4 json get --path '$.body'
```

```expect:json
{
  "end": {
    "dateTime": "2026-01-16T10:00:00",
    "timeZone": "America/New_York"
  },
  "start": {
    "dateTime": "2026-01-16T09:00:00",
    "timeZone": "America/New_York"
  },
  "summary": "Project kickoff (rescheduled)"
}
```
