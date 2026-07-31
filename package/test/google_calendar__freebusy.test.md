# google calendar freebusy

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the freeBusy request body — including
the `items` array built from the comma-separated calendar list.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18987 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18987/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
pkill -f "18987" 2>/dev/null
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

### should POST to the freeBusy endpoint

```execute
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --tokenFile google-token.json --apiUrl http://127.0.0.1:18987
```

```expect:partial
"method": "POST"
```

```expect:partial
"path": "/freeBusy"
```

### should build the request body with timeMin, timeMax and an items array

```execute
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --calendars primary,team@group.calendar.google.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18987 | aux4 json get --path '$.body'
```

```expect:json
{
  "items": [
    {
      "id": "primary"
    },
    {
      "id": "team@group.calendar.google.com"
    }
  ],
  "timeMax": "2026-01-16T00:00:00Z",
  "timeMin": "2026-01-15T00:00:00Z"
}
```
