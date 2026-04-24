# STT Web Runtime UI Standard

This repo follows the approved active-runtime UI standard for `stt-web`.

## Approved runtime foundation
Active customer-facing runtime code under `src/**` must use:
- Tailwind CSS for styling and layout
- shared shadcn-style primitives in `src/shared/ui/*`
- Radix primitives only through approved shared wrappers when practical

This is the only approved active runtime UI foundation unless an explicit architecture decision says otherwise.

## Not approved in active runtime code
Do not add or reintroduce these into active runtime manifests or `src/**` imports:
- Ant Design and `@ant-design/*`
- Material UI and `@mui/*`
- Chakra UI and `@chakra-ui/*`
- Mantine and `@mantine/*`
- other competing runtime component-system libraries

## Archive status
Historical backups under `archive/runtime-src-backups/**` are reference-only.
They are allowed to remain for historical comparison, but they are not approved runtime implementation patterns and must not be imported into active runtime code.

## Guardrails in this repo
- `npm run check:ui-standards` blocks banned runtime UI dependencies in `package.json`
- the same check blocks banned UI-library imports from active runtime source files in `src/**`
- ESLint also blocks banned imports and any runtime import from `archive/**`
- `npm run lint` runs the UI-standard guardrail before the normal lint pass

## Scope note
These guardrails intentionally target the active runtime only. Archive-only historical files are excluded so they can remain as backup/reference material without driving current implementation.
