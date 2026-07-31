# google calendar events create

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the JSON body aux4 assembles from the
flags — including the built `start`/`end` objects and the `attendees` array.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18983 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18983/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
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

### should POST to the events endpoint with a bearer token and JSON content type

```execute
aux4 google calendar events create --summary "Team sync" --start 2026-01-15T09:00:00 --end 2026-01-15T09:30:00 --timeZone America/New_York --tokenFile google-token.json --apiUrl http://127.0.0.1:18983
```

```expect:partial
"authorization": "Bearer test-access-token"
```

```expect:partial
"contentType": "application/json"
```

```expect:partial
"method": "POST"
```

```expect:partial
"path": "/calendars/primary/events"
```

### should build a timed event body with start, end and attendees

```execute
aux4 google calendar events create --summary "Project kickoff" --location "Room 4B" --start 2026-01-15T09:00:00 --end 2026-01-15T10:00:00 --timeZone America/New_York --attendees sally@example.com,alex@example.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18983 | aux4 json get --path '$.body'
```

```expect:json
{
  "attendees": [
    {
      "email": "sally@example.com"
    },
    {
      "email": "alex@example.com"
    }
  ],
  "end": {
    "dateTime": "2026-01-15T10:00:00",
    "timeZone": "America/New_York"
  },
  "location": "Room 4B",
  "start": {
    "dateTime": "2026-01-15T09:00:00",
    "timeZone": "America/New_York"
  },
  "summary": "Project kickoff"
}
```

### should build an all-day event body using date fields when start is a bare date

```execute
aux4 google calendar events create --summary "Company holiday" --start 2026-07-04 --end 2026-07-05 --tokenFile google-token.json --apiUrl http://127.0.0.1:18983 | aux4 json get --path '$.body'
```

```expect:json
{
  "end": {
    "date": "2026-07-05"
  },
  "start": {
    "date": "2026-07-04"
  },
  "summary": "Company holiday"
}
```
