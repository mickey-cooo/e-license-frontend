# Navbar auth button: design

## Intent
Login (and logout) is a full-width bar in the navbar, too big for one action. Make it a compact button in the header's top row.

## Cause
Logged out, `items` is empty, so the login link is the only cell in `.cells`. The rule `.cell:last-child:nth-child(odd) { grid-column: 1 / -1 }` (`top-navbar.module.scss`) stretches it across the bar. Logout has the same problem when logged in.

## Goals
- Login and logout sit in the top row next to `LanguageSwitcher`.
- Compact, auto-width, `min-height: 44px`, visible focus, keyboard accessible.
- No empty nav row when logged out.

## Non-goals
- No user menu or dropdown.
- No change to nav items, `LanguageSwitcher`, routes or i18n keys (`login`, `logout` exist).

## Approaches
1. Auth button in the top row (chosen): standard header placement, always visible.
2. Keep it as a nav cell but shrink it: still sits in a grid built for equal cells, and fights that layout.
3. Hero-only CTA on `/home`: not visible on other pages or when scrolled.

## Design (my calls)
- Top row: `brand` | `[LanguageSwitcher] [auth button]`.
- Login: filled `--ink-blue` button. Logout: outlined button, same size. Existing tokens, 160ms hover transition.
- Logout moves too, for consistency (assumption, not requested).
- Render `<nav>` only when `items.length > 0`.
- Mobile: the button stays in the top row. Brand shrinks via `min-width: 0`.
- Files: `src/app/components/top-navbar.tsx`, `top-navbar.module.scss`.

## Left to the builder
Remove `.cell:last-child:nth-child(odd)` if it becomes dead. Check the layout at 360px and at desktop width.
