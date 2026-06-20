# Development guidelines

## Deviating from these guidelines

When a guideline cannot be followed, add an inline comment at the deviation explaining why. The comment should state the constraint that forced the exception, not just that an exception exists.

```ts
// MUI Slider has no native input, so Controller is required here instead of register
// patientId is intentionally excluded — the association is managed by the parent form
```

This keeps the codebase searchable for exceptions and prevents future readers from copying the pattern without understanding the reason.

## Before committing: typecheck, lint, test

Always run all three checks before pushing. A passing build requires all of them to be clean.

```sh
npm run typecheck   # tsc — no incremental cache
npm run lint        # eslint --max-warnings=0 (warnings fail the build)
npm run test        # jest unit/integration tests
CI=true npm run e2e # playwright e2e tests (CI=true disables retries and the browser)
```

`npm run ci` runs typecheck, lint, and unit tests in one command. E2e tests require the dev server to be running and a seeded database, so they are run separately.

## Use React Hook Form for all forms

All forms must use `useForm` / `FormProvider` / `useFormContext`. Do not manage form state with `useState` or track values with refs. RHF stores field state internally via refs, which means `getValues()` always returns the current, complete form snapshot without triggering re-renders.

Use `register` for native inputs (text, number, date). Use `Controller` only when a component has no native input — MUI Slider, chip toggle groups, and custom button groups.

## Autosave: read with `getValues()`, not from the callback argument

The `watch()` callback receives a partial snapshot of whichever field just changed. If you capture that value in a debounce closure, you persist stale or incomplete data on every save. Always call `methods.getValues()` inside the debounce timeout to get the full, current form state at the moment the save fires.

```ts
const subscription = methods.watch(() => {
  clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(async () => {
    const values = methods.getValues(); // full snapshot, not the partial arg
    await save(values);
  }, 2500);
});
```

## MUI Select requires a controlled `value` when used with `register`

MUI `Select` is a controlled component. `register` only wires up the `ref`, `name`, `onChange`, and `onBlur` props — it does not set `value`. Without an explicit `value`, MUI logs an out-of-range warning and the field renders incorrectly after reset or navigation. Add the field to `watch` and pass the result as `value`.

```tsx
const [sessionType, phase] = watch(["sessionType", "phase"]);
<Select {...register("sessionType")} value={sessionType ?? ""}>
```

## Patient and entity pickers must use `Autocomplete`, not `Select`

`Select` renders a dropdown over a static list and requires a `labelId`/`id` pair to be accessible. `Autocomplete` renders with `role="combobox"` and derives its accessible name directly from the `label` on its `renderInput` `TextField`. It also supports free-text filtering, which is expected for long patient lists. Always use `Autocomplete` for entity pickers.

## Mutations belong in server actions, not API route handlers

POST and PATCH mutations should be `"use server"` functions in an `actions.ts` file colocated with the feature. This removes an HTTP round-trip, keeps the server-side logic type-safe end-to-end, and avoids exposing a public endpoint that needs its own input validation.

GET endpoints that return data (used by server components or external clients) remain as route handlers in `app/api/`.

## PATCH handlers must use an explicit field allowlist

Never spread the raw request body into a `save` or `update` call. An `...body` spread lets a client overwrite any column, including `deletedAt`, `status`, or other fields not intended to be user-editable.

For each field, be explicit about nullability:

- Non-nullable fields: `data.field ?? existing.field`
- Nullable fields: `data.field !== undefined ? data.field : existing.field`

## Route naming: use `/create`, not `/new`

Name resource creation routes `/create` rather than `/new`. The `/new` convention originates from Rails and is not meaningful in Next.js. `/create` reads as an action and is consistent with the rest actions used elsewhere.

## Nest resources under their owner in the URL

A resource that only makes sense in the context of a parent belongs under the parent's route segment. Sessions only exist in the context of a patient, so their URL is `/patients/:patientId/sessions/:sessionId` — not a top-level `/documentation/:id`. This makes ownership explicit in the URL and keeps server components close to the data they need.

## Use route groups to scope layouts

In Next.js App Router, every `layout.tsx` wraps all pages beneath it. When only some child pages should inherit a layout (e.g. a patient header with tabs), move those pages into a route group (`(group-name)/`) with its own `layout.tsx`. Pages outside the group — like the session edit page — are not wrapped.

```
patients/[patientId]/
  (patient-view)/          ← layout with patient header + tabs
    layout.tsx
    page.tsx               ← /patients/:id
    sessions/
      page.tsx             ← /patients/:id/sessions
  sessions/
    [sessionId]/
      page.tsx             ← /patients/:id/sessions/:id (no tabs)
```

Route group directory names are stripped from the URL, so `(patient-view)` adds no segment.

## Never create records on page load

Do not create database records as a side effect of rendering a page or mounting a component. A user navigating to a page and immediately pressing back would leave an orphaned draft record with no way to clean it up.

Create records only in response to an explicit user action. For session creation, the server action is called when the user clicks the button, and the result is used to navigate to the new record's page.

## E2e tests must use factories, not direct DB access

Do not call `getDb()` or any repository method directly inside `*.spec.ts` files. Use the factory helpers in `factories/`. Factories handle associations (e.g. creating a patient before a session), apply sensible defaults, and keep tests resilient to schema changes.

```ts
// correct
const session = await sessionFactory.create({ riskLevel: "high" });

// wrong
const db = getDb();
await db.insertInto("sessions").values({ ... }).execute();
```

## Factories must respect overridden foreign keys

Factories use raw DB types (`Insertable<Table>` / `Selectable<Table>`) — that is intentional and correct. JSON columns are passed as strings, matching what the DB actually stores.

However, when `onCreate` creates a required association (e.g. a patient before a session), it must check whether the caller already supplied the foreign key before creating a new record. If `onCreate` always creates and overwrites, passing `patientId` in overrides has no effect:

```ts
// this silently creates a second, unrelated patient and uses that id instead
await sessionFactory.create({ patientId: existingPatient.id });
```

The fix is to reuse the supplied key when present:

```ts
.onCreate(async (attrs) => {
  const patientId = attrs.patientId ?? (await patientFactory.create()).id;
  return getDb().insertInto("sessions").values({ ...attrs, patientId })...
})
```

This lets tests share associations across factory calls without unnecessary DB inserts.

## Floating promises must be marked with `void`

The `@typescript-eslint/no-floating-promises` rule is enabled with `--max-warnings=0`, so any unawaited promise fails the build. When you intentionally fire-and-forget a promise (e.g. inside an event handler), prefix it with `void`.

```ts
void createSession(patientId).then((s) => setSession(s));
```

## React Compiler incompatibility with `methods.watch()`

The React Compiler eslint plugin flags `methods.watch()` inside a `useEffect` as an incompatible library call. This is a known limitation — RHF's `watch()` subscription model predates the compiler and cannot be automatically memoized. Suppress the warning with an inline comment and a brief explanation so reviewers know it is intentional.

```ts
// eslint-disable-next-line react-hooks/incompatible-library -- RHF watch() subscription; cleaned up on unmount
const subscription = methods.watch(() => { ... });
```
