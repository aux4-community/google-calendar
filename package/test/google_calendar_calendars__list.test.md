# google calendar calendars list

Part of the `core` group in `test.suite.md`. The Calendar API is replaced by an
`aux4/mock` server: the test stubs a realistic `calendarList` response and then verifies
the request aux4 built — method, path and `Authorization` header — without a real Google
account.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 18980 2>/dev/null
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

### should GET the calendarList endpoint and return the stubbed calendars

```execute
aux4 mock start --port 18980 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 18980 --method GET --path /users/me/calendarList --status 200 --body '{"kind":"calendar#calendarList","items":[{"kind":"calendar#calendarListEntry","id":"primary","summary":"Sally","primary":true,"accessRole":"owner"}]}' >/dev/null
aux4 google calendar calendars list --tokenFile google-token.json --apiUrl http://127.0.0.1:18980/api
```

```expect:partial
"kind":"calendar#calendarList"
```

```expect:partial
"id":"primary"
```

### should send a GET with a bearer token to the calendarList endpoint

```execute
aux4 mock verify --port 18980 --method GET --path /users/me/calendarList --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google calendar calendars list --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:18980/api
```

```error:partial
no token found for provider "google"
```
