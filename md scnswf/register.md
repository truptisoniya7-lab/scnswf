# Register Page Spec

Stack: React + TypeScript. Auth method: email OTP (passwordless).
Route: `/register`. On success, redirect to `/profile`.

---

## 1. Goal

A 3-step registration flow with a dark green, transparent (glassmorphism), animated look.

| Step | Title | Fields |
|------|-------|--------|
| 1 | Your details | Name, Phone, Email |
| 2 | Verify email | 6-digit OTP |
| 3 | Choose your role | Internship / Donor / Volunteer |

A step indicator (3 dots or a thin progress bar) shows progress at the top of the card.

---

## 2. Visual Design

### Design tokens (CSS variables)

```css
:root {
  --bg-deep: #04140c;
  --bg-mid: #0a2a1a;
  --green-500: #1f9d62;
  --green-400: #34d399;
  --green-300: #6ee7b7;
  --glass-bg: rgba(10, 42, 26, 0.45);
  --glass-border: rgba(110, 231, 183, 0.18);
  --text: #e8fff3;
  --text-muted: #9bc9b0;
  --danger: #f87171;
  --radius: 20px;
}
```

### Background
- Full-screen gradient: `linear-gradient(135deg, var(--bg-deep), var(--bg-mid))`.
- 3 blurred green blobs (`filter: blur(80px)`, 40-60% opacity) drifting slowly, 18-28s loops, `ease-in-out`, alternate direction.
- Optional faint noise overlay at 3-4% opacity for depth.

### Card (glass)
- Centered, max-width 440px, padding 32px (24px on mobile).
- `background: var(--glass-bg)`, `backdrop-filter: blur(18px) saturate(140%)`, `border: 1px solid var(--glass-border)`, `box-shadow: 0 20px 60px rgba(0,0,0,.45)`.
- Fallback when `backdrop-filter` is unsupported: solid `rgba(10, 42, 26, 0.9)`.

### Inputs
- Transparent dark fill `rgba(255,255,255,0.04)`, 1px border `var(--glass-border)`, 12px radius, 48px height.
- Floating labels. On focus: border `var(--green-400)` and a soft glow `0 0 0 4px rgba(52,211,153,.15)`.
- Error state: border `var(--danger)` plus a small message below the field.

### Buttons
- Primary: green gradient `var(--green-500)` to `var(--green-400)`, dark text, 48px height, full width.
- Hover: slight lift (`translateY(-1px)`) and brighter glow. Disabled: 50% opacity, `not-allowed` cursor.
- Loading: inline spinner replaces the label and the button stays the same width.

### Animations
- Card entry: fade and slide up 16px, 500ms.
- Step change: outgoing step slides left and fades, incoming slides in from the right, 300ms.
- OTP boxes: gentle pop on digit entry. Shake (3 short oscillations) on a wrong code.
- Role cards: scale to 1.02 on hover, glowing border when selected.
- Wrap all motion in `@media (prefers-reduced-motion: reduce)` and disable blob drift and slides there.

---

## 3. Step 1: Details

| Field | Type | Rules |
|-------|------|-------|
| Name | text | Required, 2-60 chars, trimmed, letters/spaces/`.`/`-`/`'` |
| Phone | tel | Required, 10-digit Indian mobile (`^[6-9]\d{9}$`) with a fixed `+91` prefix chip. Allow an international format later. |
| Email | email | Required, valid format, lowercased. Must not already be registered. |

- Validate on blur and on submit. Button: **Send OTP**.
- Phone is collected here but not verified in v1. Make sure the code is structured so phone OTP can be added later.
- On submit, call `POST /auth/register/start`. On success, go to Step 2.
- If the email already exists, show: "This email is already registered. Log in instead." with a link to `/login`.

---

## 4. Step 2: Email OTP

- Heading: "Verify your email". Subtext: "We sent a 6-digit code to **a***@gmail.com**" (masked).
- 6 separate single-digit inputs (`inputmode="numeric"`, `autocomplete="one-time-code"`).
  - Auto-advance on digit entry, backspace moves back.
  - Paste of a 6-digit code fills all boxes.
  - Auto-submit when the 6th digit is entered.
- Resend link with a 30-second countdown ("Resend in 28s"). Maximum 5 resends per session.
- "Change email" link returns to Step 1 and keeps the other values.
- OTP rules (enforced on the backend):
  - 6 digits, expires in 5 minutes, stored hashed, single use.
  - Maximum 5 wrong attempts, then the code is invalidated and the user must request a new one.
- Call `POST /auth/register/verify`. On success, go to Step 3.

---

## 5. Step 3: Role

Three selectable cards (radio-group semantics, one required choice):

| Value | Label | Description |
|-------|-------|-------------|
| `internship` | Internship | Learn and contribute through an internship. |
| `donor` | Donor | Support the cause with contributions. |
| `volunteer` | Volunteer | Give your time and skills. |

- Each card has an icon, a title and a one-line description. The selected card has a green border and glow, with a check badge.
- Button: **Create account**. Call `POST /auth/register/complete`.
- On success, store the session and redirect to `/profile`.
- Role-specific details (college, availability, donation preference and so on) are collected later on the profile page, not here.

---

## 6. API Contract

All requests use JSON. Errors use `{ "error": { "code": string, "message": string } }`.

```ts
// POST /auth/register/start
type StartReq = { name: string; phone: string; email: string };
type StartRes = { registrationId: string; otpExpiresInSec: number; resendAfterSec: number };

// POST /auth/register/verify
type VerifyReq = { registrationId: string; otp: string };
type VerifyRes = { verified: true };

// POST /auth/register/resend
type ResendReq = { registrationId: string };
type ResendRes = { otpExpiresInSec: number; resendAfterSec: number };

// POST /auth/register/complete
type Role = 'internship' | 'donor' | 'volunteer';
type CompleteReq = { registrationId: string; role: Role };
type CompleteRes = { user: User; accessToken: string };

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

Error codes: `EMAIL_EXISTS`, `INVALID_INPUT`, `OTP_INVALID`, `OTP_EXPIRED`, `OTP_ATTEMPTS_EXCEEDED`, `RATE_LIMITED`.

Session: prefer an httpOnly, Secure, SameSite=Lax cookie. If a token must be used client-side, keep it in memory and refresh via a cookie.

---

## 7. React + TypeScript Structure

```
src/
  pages/Register/
    RegisterPage.tsx        // owns step state and form data
    steps/DetailsStep.tsx
    steps/OtpStep.tsx
    steps/RoleStep.tsx
    components/StepIndicator.tsx
    components/OtpInput.tsx
    components/RoleCard.tsx
    register.module.css
  components/AuthShell.tsx  // animated background + glass card, shared with Login
  lib/api/auth.ts           // typed API calls
  lib/validation.ts         // zod schemas
```

- State: `step: 1 | 2 | 3`, `registrationId`, form values. Use `react-hook-form` with `zod`.
- `AuthShell` is shared with the Login page so both look identical.
- Use `useCountdown(seconds)` for the resend timer.

---

## 8. States

- Loading: disable the form, show the button spinner.
- Field error: inline message under the input.
- Server error: a small dismissible banner at the top of the card.
- Network failure: "Something went wrong. Try again." with the entered data preserved.
- Success: brief green check animation (600ms) before the redirect.

---

## 9. Accessibility

- Every input has a real `<label>` (floating labels must still be associated with the input).
- Errors are announced with `aria-live="polite"` and linked using `aria-describedby`.
- Full keyboard support. Visible focus ring `2px solid var(--green-300)`.
- Text contrast is at least 4.5:1 on the glass surface.
- Role cards use `role="radiogroup"` and `role="radio"` with arrow-key navigation.
- Focus moves to the first field of each step on step change.

---

## 10. Security Checklist

- Rate limit OTP requests per email and per IP.
- Hash OTPs. Never log them or return them in API responses.
- Generic timing for "email exists" checks where practical.
- Validate every field again on the server.
- CSRF protection if cookie-based sessions are used.
- No sensitive data in URLs or `localStorage`.

---

## 11. Acceptance Criteria

- [ ] User can complete registration through all 3 steps with valid data.
- [ ] Invalid name, phone or email shows a specific inline error.
- [ ] OTP: paste, auto-advance, auto-submit, resend countdown and wrong-code shake all work.
- [ ] A wrong or expired OTP shows a clear message, and 5 failed attempts force a new code.
- [ ] Role is required before the account is created.
- [ ] An existing email links to Login.
- [ ] Dark green glass design with animated background, working on mobile (360px) and desktop.
- [ ] Reduced-motion users see no drifting or sliding animation.
- [ ] Redirects to `/profile` after success.
