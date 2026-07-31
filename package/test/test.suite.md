# google-calendar test suite

Run the CI-safe group with `aux4 test run --group core` from this directory. The
`integration` group needs a real Google login and is skipped unless requested.

## core

- google_calendar_calendars__list.test.md
- google_calendar_events__list.test.md
- google_calendar_events__get.test.md
- google_calendar_events__create.test.md
- google_calendar_events__update.test.md
- google_calendar_events__delete.test.md
- google_calendar_events__quick-add.test.md
- google_calendar__freebusy.test.md
- google_calendar__injection.test.md

## integration (optional)

- google_calendar.test.md
