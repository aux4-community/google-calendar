# google calendar events list

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server: the test stubs a realistic `events` list response and then inspects
the recorded request to assert the path and the query string aux4 builds from the
optional filter flags.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18981 2>/dev/null
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

### should GET the events endpoint and return the stubbed events

```execute
aux4 mock start --port 18981 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18981 --method GET --path '/calendars/{calendarId}/events' --status 200 --body '{"kind":"calendar#events","summary":"Sally","items":[{"kind":"calendar#event","id":"evt1","status":"confirmed","summary":"Team sync"}]}' >/dev/null
aux4 google calendar events list --tokenFile google-token.json --apiUrl http://127.0.0.1:18981/api
```

```expect:partial
"kind":"calendar#events"
```

```expect:partial
"summary":"Team sync"
```

### should send a GET to the primary calendar events endpoint with no query string when no filters are given

```execute
aux4 mock verify --port 18981 --method GET --path /calendars/primary/events --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

### should url-encode and append every provided filter as a query parameter

```execute
aux4 mock reset --port 18981 --requests >/dev/null
aux4 google calendar events list --timeMin 2026-01-01T00:00:00Z --query "team sync" --maxResults 5 --singleEvents true --orderBy startTime --tokenFile google-token.json --apiUrl http://127.0.0.1:18981/api >/dev/null
aux4 mock requests --port 18981 --method GET --path /calendars/primary/events | aux4 json get --path '$.0.query'
```

```expect:json
{
  "maxResults": "5",
  "orderBy": "startTime",
  "q": "team sync",
  "singleEvents": "true",
  "timeMin": "2026-01-01T00:00:00Z"
}
```

### should target a non-primary calendar when calendarId is set

```execute
aux4 mock reset --port 18981 --requests >/dev/null
aux4 google calendar events list --calendarId team@group.calendar.google.com --timeMax 2026-02-01T00:00:00Z --tokenFile google-token.json --apiUrl http://127.0.0.1:18981/api >/dev/null
aux4 mock requests --port 18981 --method GET --path /calendars/team@group.calendar.google.com/events | aux4 json get --path '$.0.query.timeMax'
```

```expect:partial
2026-02-01T00:00:00Z
```
