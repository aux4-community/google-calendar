# google calendar freebusy

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server: the test stubs a realistic `freeBusy` response and then verifies the
request body — including the `items` array built from the comma-separated calendar list.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18987 2>/dev/null
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

### should POST to the freeBusy endpoint and return the stubbed response

```execute
aux4 mock start --port 18987 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18987 --method POST --path /freeBusy --status 200 --body '{"kind":"calendar#freeBusy","timeMin":"2026-01-15T00:00:00.000Z","timeMax":"2026-01-16T00:00:00.000Z","calendars":{"primary":{"busy":[{"start":"2026-01-15T09:00:00Z","end":"2026-01-15T10:00:00Z"}]}}}' >/dev/null
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --tokenFile google-token.json --apiUrl http://127.0.0.1:18987/api
```

```expect:partial
"kind":"calendar#freeBusy"
```

```expect:partial
"busy":[{"start":"2026-01-15T09:00:00Z","end":"2026-01-15T10:00:00Z"}]
```

### should send a POST with a bearer token to the freeBusy endpoint

```execute
aux4 mock verify --port 18987 --method POST --path /freeBusy --header "authorization=Bearer test-access-token" --header "content-type=application/json"
```

```expect:partial
verify ok
```

### should build the request body with timeMin, timeMax and an items array

```execute
aux4 mock reset --port 18987 --requests >/dev/null
aux4 google calendar freebusy --timeMin 2026-01-15T00:00:00Z --timeMax 2026-01-16T00:00:00Z --calendars primary,team@group.calendar.google.com --tokenFile google-token.json --apiUrl http://127.0.0.1:18987/api >/dev/null
aux4 mock verify --port 18987 --method POST --path /freeBusy --body-contains '"timeMin":"2026-01-15T00:00:00Z"' --body-contains '"timeMax":"2026-01-16T00:00:00Z"' --body-contains '"items":[{"id":"primary"},{"id":"team@group.calendar.google.com"}]'
```

```expect:partial
verify ok
```
