# google calendar command injection

Part of the `core` group in `test.suite.md`. This is a security regression test: it
proves that a shell-metacharacter payload in an event field cannot break out of the
`jq` env-assignment step (`START='${start}' ...`) and execute an arbitrary command.

The event fields are shell-escaped with `value()`, so a `'`-bearing value is passed
verbatim to `jq` and never reaches the shell. The API call itself fails harmlessly
(the `apiUrl` points at a closed port) — but the injection, if present, would fire at
the `START=value(start) jq` step *before* the network call.

## against a malicious start value

```beforeAll
rm -f /tmp/AUX4_INJ_calendar
```

```afterAll
rm -f /tmp/AUX4_INJ_calendar
```

```file:injection-token.json
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

### should not execute an injected command from the start field

```execute
aux4 google calendar events create --summary "meeting" --start "2030-01-01T10:00:00'; touch /tmp/AUX4_INJ_calendar; echo '" --end 2030-01-01T11:00:00 --calendarId primary --apiUrl http://127.0.0.1:1 --tokenFile injection-token.json </dev/null
```

```error:partial
http://127.0.0.1:1
```

### should confirm the injected command never ran

```execute
test -f /tmp/AUX4_INJ_calendar && echo VULNERABLE || echo SAFE
```

```expect
SAFE
```
