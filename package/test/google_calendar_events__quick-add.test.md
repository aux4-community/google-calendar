# google calendar events quick-add

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server.

`quick-add` issues a `POST` with `Content-Type: application/json` and **no body** — the
natural-language text rides in the `?text=` query string. `aux4/api` (which backs
`aux4/mock`) accepts empty JSON bodies and records the request, so the outgoing bearer
token and the `?text=` query are fully observable via `mock verify` / `mock requests`.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18986 2>/dev/null
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

### should POST to quickAdd and return the stubbed event

```execute
aux4 mock start --port 18986 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18986 --method POST --path '/calendars/{calendarId}/events/quickAdd' --status 200 --body '{"kind":"calendar#event","id":"q1","status":"confirmed"}' >/dev/null
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon" --tokenFile google-token.json --apiUrl http://127.0.0.1:18986/api
```

```expect:partial
"id":"q1"
```

### should have sent an empty-body POST carrying the bearer token

```execute
aux4 mock verify --port 18986 --method POST --path '/calendars/{calendarId}/events/quickAdd' --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

### should have carried the natural-language text in the ?text= query

```execute
aux4 mock requests --port 18986 --method POST | aux4 json get --path '$.0.query.text'
```

```expect:partial
Lunch with Sally tomorrow at noon
```
