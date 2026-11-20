# Navbar auth button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the full-width login/logout navbar cell with a compact button in the header's top row.

**Architecture:** Auth button moves out of the `<nav>` grid into a right-aligned `.actions` group beside `LanguageSwitcher`. `<nav>` renders only when there are items.

**Tech Stack:** Next.js (app router), next-intl, next-auth, SCSS modules. Existing tokens: `--ink-blue`, `--paper`, `--paper-sunk`, `--rule`, `--graphite`.

**Spec:** `docs/superpowers/specs/2026-11-20-navbar-auth-button-design.md`

## Global Constraints

- Button `min-height: 44px`, auto width, visible focus ring (do not remove outlines).
- Reuse existing i18n keys `Common.login` and `Common.logout`. No new keys.
- Hover transition `160ms ease-out`, same as `.cell`.
- Only touch `top-navbar.tsx` and `top-navbar.module.scss`.

## Review Focus

- Logged out, `items` empty: no empty bordered `<nav>` row remains.
- Narrow width (360px): brand + switcher + button do not overflow horizontally.
- Auth session still loading (`ready` false, not authenticated): no button flashes.
- Logged in: logout button works, nav items and active state unchanged.
- Admin user: extra admin nav item still shows.

---

### Task 1: Compact auth button in top row

**Files:**
- Modify: `src/app/components/top-navbar.tsx:48-85`
- Modify: `src/app/components/top-navbar.module.scss`

**Interfaces:**
- Consumes: `useRole(): { isAdmin, authenticated, ready }`, `signOut` from `next-auth/react`.
- Produces: new classes `.actions`, `.authLogin`, `.authLogout`.

- [ ] **Step 1: Restructure `TopNavbar` JSX in `top-navbar.tsx`**

Wrap `<LanguageSwitcher />` and the auth control in `<div className={styles.actions}>`. Auth control: `authenticated` → `<button type="button" className={styles.authLogout} onClick={() => void handleLogout()}>{t("logout")}</button>`; else if `ready` → `<Link href="/login" className={styles.authLogin}>{t("login")}</Link>`; else nothing. Remove the auth control from inside `<nav>`. Render `<nav>` only when `items.length > 0`.

- [ ] **Step 2: Add styles in `top-navbar.module.scss`**

`.actions`: `display: flex; align-items: center; gap: 12px; flex-shrink: 0`. Shared look for `.authLogin, .authLogout`: `display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; font: inherit; font-size: 0.9375rem; font-weight: 600; text-decoration: none; white-space: nowrap; cursor: pointer; border: 1px solid var(--ink-blue); transition: background-color 160ms ease-out, color 160ms ease-out`. `.authLogin`: `background: var(--ink-blue); color: var(--paper)`, hover darkens via `filter: brightness(1.1)`. `.authLogout`: `background: var(--paper); color: var(--ink-blue)`, hover `background: var(--paper-sunk)`.

- [ ] **Step 3: Remove dead rule**

Delete the `@media (max-width: 699px) { .cell:last-child:nth-child(odd) ... }` block only if nothing else needs it. With logout gone, nav cells are nav items only; for 8 items (admin) at 2 columns the rule is still needed, so keep it if any odd-count case remains (7 items for non-admin → yes). Keep it.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run the dev server and check `/home` logged out and logged in at 360px and 1280px (Review Focus list). Expected: compact button right of the TH/EN switcher, no empty nav row logged out, no horizontal scroll.

- [ ] **Step 5: Commit (only when the user asks)**

```bash
git add src/app/components/top-navbar.tsx src/app/components/top-navbar.module.scss
git commit -m "feat: move auth button to navbar top row"
```
