# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Thai business operators (merchants, SMEs) who need licenses to run a business. They arrive wanting to know which licenses their business type requires, register their business, submit documents once for several agencies, and follow the status of each application. Thai is the primary UI language; English is secondary (next-intl, `messages/en.json` and `messages/th.json`).

## Product Purpose
e-Licensing: one system for licensing guidance, merchant registration, document submission, and status tracking across agencies. It exists to cut repeated filings and phone calls to chase status. Success: a merchant knows which licenses apply, files documents once, and sees every application's progress in one place.

## Capabilities and Constraints
Existing routes: `/home` (landing), `/home/license` (license guide by merchant type), `/home/merchant` (register merchant), `/home/document` (submit documents), `/home/tracker` (track status), `/home/dashboard`, `/login`, `/register`. 13 merchant types (food and beverage, hotel, tourism, health and wellness, education, manufacturing, import/export, transport, construction, retail/ecommerce, environmental, digital, other). Stack is fixed: Next.js 16 App Router, React 19, MUI 7, SCSS modules, Tailwind 4 available, next-intl, next-auth. Some steps may still need physical documents; the system tells the user the next step.

## Brand Commitments
None. No agency identity, logo, or mockups exist. Visual direction is open.

## Evidence on Hand
No real testimonials, agency names, statistics, or logos. Do not fabricate any. Landing page currently uses remote Unsplash placeholder photos.

## Product Principles
- Say what the merchant must do next, in plain Thai, at every step.
- File once, track everywhere: show the cross-agency view as the core promise.
- Trust through clarity and honest status, not through official-looking decoration.
- Never claim agency affiliation, approval times, or numbers that are not real.

## Accessibility & Inclusion
No specific standard stated. Treat WCAG AA as the floor. Thai script needs adequate line-height and a Thai-capable font.
