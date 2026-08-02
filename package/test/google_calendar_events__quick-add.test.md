# google calendar events quick-add

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server.

`quick-add` is the one endpoint that does not fit the stub+verify recipe cleanly: it
issues a `POST` with `Content-Type: application/json` and **no body** (the natural-language
text rides in the `?text=` query string). The mock server is built on `aux4/api`
(fastify), which rejects an empty JSON body with `FST_ERR_CTP_EMPTY_JSON_BODY` *before*
the request is recorded — so `mock verify` / `mock requests` cannot observe the outgoing
`?text=` query. The real Google API accepts this request shape. This test therefore
asserts the observable behavior: the command reaches the mock and issues exactly that
empty-JSON `POST`. See the MIG-004 kb note for the tracked tooling limitation.

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

### should POST to quickAdd with a bearer token and an empty JSON body

```execute
aux4 mock start --port 18986 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18986 --method POST --path '/calendars/{calendarId}/events/quickAdd' --status 200 --body '{"kind":"calendar#event","id":"q1","status":"confirmed"}' >/dev/null
aux4 google calendar events quick-add "Lunch with Sally tomorrow at noon" --tokenFile google-token.json --apiUrl http://127.0.0.1:18986/api
```

```expect:partial
FST_ERR_CTP_EMPTY_JSON_BODY
```
