# google calendar calendars list

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts the request aux4 builds — method,
path and `Authorization` header — without needing a real Google account.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18980 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18980/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
pkill -f "18980" 2>/dev/null
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

### should GET the calendarList endpoint with a bearer token

```execute
aux4 google calendar calendars list --tokenFile google-token.json --apiUrl http://127.0.0.1:18980
```

```expect:partial
"authorization": "Bearer test-access-token"
```

```expect:partial
"method": "GET"
```

```expect:partial
"path": "/users/me/calendarList"
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google calendar calendars list --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:18980
```

```error:partial
no token found for provider "google"
```
