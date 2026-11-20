# Login Page Spec

Stack: React + TypeScript. Auth method: passwordless email OTP.
Route: `/login`. On success, redirect to `/profile` (or the originally requested protected route).

---

## 1. Goal

A 2-step passwordless login using the same dark green, transparent (glassmorphism), animated look as the Register page.

| Step | Title | Fields |
|------|-------|--------|
| 1 | Welcome back | Email |
| 2 | Verify it's you | 6-digit OTP |

No password anywhere. Unregistered emails are directed to `/register`.

---

## 2. Visual Design

Reuse the shared `AuthShell` component and the design tokens from `register.md`. Do not redefine them.

- Background: dark green gradient with 3 slow-drifting blurred blobs.
- Card: glass panel, max-width 440px, `backdrop-filter: blur(18px)`, 1px translucent green border.
- Inputs, buttons, focus glow, card entry and step transition animations are the same as Register.
- Reduced motion: disable blob drift and slides (`prefers-reduced-motion`).
- Footer link inside the card: "New here? **Create an account**" linking to `/register`.

---

## 3. Step 1: Email

| Field | Type | Rules |
|-------|------|-------|
| Email | email | Required, valid format, trimmed and lowercased |

- Button: **Send OTP**. Calls `POST /auth/login/start`.
- Anti-enumeration: always respond with the same message, "If this email is registered, we've sent a code", so the page never reveals whether an account exists. Step 2 is shown either way.
- Optional UX improvement: if the backend can safely tell the user the email is unregistered (for example behind rate limiting), show a "No account found. Register?" link. Default to the generic response.

---

## 4. Step 2: OTP

- Heading: "Check your email". Subtext: "Enter the 6-digit code sent to **a***@gmail.com**".
- Reuse the `OtpInput` component from Register:
  - 6 boxes, `inputmode="numeric"`, `autocomplete="one-time-code"`.
  - Auto-advance, backspace to go back, paste fills all boxes, auto-submit on the 6th digit.
- Resend link with a 30-second countdown, max 5 resends per session.
- "Use a different email" link returns to Step 1.
- Rules (enforced on the backend): 6 digits, expires in 5 minutes, hashed, single use, maximum 5 wrong attempts then invalidated.
- Wrong code: boxes shake, inline error "That code isn't right", boxes cleared, focus returns to the first box.
- Calls `POST /auth/login/verify`. On success, show a green check (600ms) and redirect.

---

## 5. API Contract

All requests use JSON. Errors use `{ "error": { "code": string, "message": string } }`.

```ts
// POST /auth/login/start
type LoginStartReq = { email: string };
type LoginStartRes = { loginId: string; otpExpiresInSec: number; resendAfterSec: number };

// POST /auth/login/verify
type LoginVerifyReq = { loginId: string; otp: string };
type LoginVerifyRes = { user: User; accessToken: string };

// POST /auth/login/resend
type LoginResendReq = { loginId: string };
type LoginResendRes = { otpExpiresInSec: number; resendAfterSec: number };

type Role = 'internship' | 'donor' | 'volunteer';
type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  createdAt: string;
};
```

Error codes: `INVALID_INPUT`, `OTP_INVALID`, `OTP_EXPIRED`, `OTP_ATTEMPTS_EXCEEDED`, `RATE_LIMITED`.

Session: httpOnly, Secure, SameSite=Lax cookie preferred. If a token must be used client-side, keep it in memory only.

Note on `loginId`: to keep anti-enumeration intact, the backend issues a `loginId` even for unregistered emails but sends no email for them. Verification then fails with the same `OTP_INVALID` error.

---

## 5a. Protected Routes

- `RequireAuth` wrapper: if there is no session, redirect to `/login?next=<original path>`.
- After login, redirect to `next` if it is a same-origin relative path, otherwise `/profile`. Never redirect to an external URL (open-redirect protection).
- If a logged-in user visits `/login` or `/register`, redirect them to `/profile`.

---

## 6. React + TypeScript Structure

```
src/
  pages/Login/
    LoginPage.tsx          // owns step state
    steps/EmailStep.tsx
    steps/OtpStep.tsx      // thin wrapper around shared OtpInput
    login.module.css
  components/AuthShell.tsx // shared with Register
  components/OtpInput.tsx  // shared with Register
  lib/api/auth.ts          // typed API calls
  lib/validation.ts        // zod schemas
  routes/RequireAuth.tsx
  hooks/useCountdown.ts
```

- State: `step: 1 | 2`, `loginId`, `email`.
- Use `react-hook-form` with `zod` for the email field.

---

## 7. States

- Loading: disable the form, spinner inside the button.
- Field error: inline message under the input.
- Server error: dismissible banner at the top of the card.
- Rate limited: "Too many attempts. Try again in a few minutes."
- Network failure: "Something went wrong. Try again." and keep the typed email.
- Success: green check animation, then redirect.

---

## 8. Accessibility

- Real `<label>` on every input (including floating labels).
- Errors use `aria-live="polite"` and `aria-describedby`.
- Full keyboard support, visible focus ring `2px solid var(--green-300)`.
- Text contrast at least 4.5:1 on the glass surface.
- Focus moves to the first field of each step on step change.

---

## 9. Security Checklist

- Generic responses to prevent account enumeration.
- Rate limit OTP requests per email and per IP.
- Hash OTPs, never log them or return them in responses.
- Server-side validation for all fields.
- Same-origin-only `next` redirect.
- CSRF protection if cookie sessions are used.

---

## 10. Acceptance Criteria

- [ ] A registered user can log in with email and OTP only.
- [ ] Invalid email shows an inline error.
- [ ] OTP paste, auto-advance, auto-submit, resend countdown and wrong-code shake all work.
- [ ] A wrong or expired OTP shows a clear message, and 5 failed attempts force a new code.
- [ ] Unregistered and registered emails get the same visible response on Step 1.
- [ ] Protected routes redirect to login and return the user afterwards.
- [ ] Logged-in users are redirected away from `/login`.
- [ ] Same dark green glass look as Register, working at 360px and on desktop.
- [ ] Reduced-motion users see no drifting or sliding animation.
