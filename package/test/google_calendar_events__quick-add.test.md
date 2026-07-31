# google calendar events quick-add

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by a local
echo server (`mock-echo.js`), so the test asserts that the natural-language text is
url-encoded into the `text` query parameter of the quickAdd endpoint.

## against a local mock API

```beforeAll
nohup node mock-echo.js 18986 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:18986/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
pkill -f "18986" 2>/dev/null
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

### should POST to quickAdd with the url-encoded text query parameter

```execute
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon" --tokenFile google-token.json --apiUrl http://127.0.0.1:18986
```

```expect:partial
"method": "POST"
```

```expect:partial
"path": "/calendars/primary/events/quickAdd?text=Lunch%20with%20Sally%20tomorrow%20at%20noon"
```
