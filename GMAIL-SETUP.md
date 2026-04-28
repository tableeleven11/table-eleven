# Gmail Auto-Reply Setup

This document covers setting up `table.eleven.matt.and.steph@gmail.com` so that when
Matt and Steph email it on their 11th anniversary, they automatically receive the site URL.

Complete this setup as soon as the site is live. Then run the annual durability checklist
every April to make sure everything still works.

---

## Step 1 — Create the Gmail Account

1. Go to [accounts.google.com](https://accounts.google.com) and create a new Google account.
2. Use the address: `table.eleven.matt.and.steph@gmail.com`
   (or whatever address you put on the card — these must match exactly)
3. Store the password somewhere permanent: a password manager, a printed note in a safe,
   or shared with all four Table 11 couples.

---

## Step 2 — Enable 2-Factor Authentication

1. Go to **My Account** → **Security** → **2-Step Verification**.
2. Enable it using an authenticator app (Google Authenticator, 1Password, etc.).
3. **Save your backup codes.** Google provides 10 single-use codes. Print them and store
   them with the password. Without these, you could lose account access in 2037 if your
   phone changes.

---

## Step 3 — Enable Canned Responses (Templates)

Gmail's auto-reply for filters uses a feature called Templates.

1. In Gmail, click the **Settings gear** → **See all settings**.
2. Go to the **Advanced** tab.
3. Find **Templates** and set it to **Enable**.
4. Click **Save Changes** at the bottom.

---

## Step 4 — Create the Auto-Reply Template

1. Click **Compose** to open a new email.
2. Write the auto-reply message (exact text below).
3. Click the **three-dot menu** (⋮) at the bottom-right of the compose window.
4. Go to **Templates** → **Save draft as template** → **Save as new template**.
5. Name it: `Table 11 Auto-Reply`

### Auto-Reply Text

**Subject line:** (leave blank — Gmail will use "Re: [their subject]")

**Body:**

---

Hey Matt and Steph,

You found it.

Eleven years ago, the people at your table left you something. Head here:

[YOUR-SITE-URL]

We'll see you in Tofino.

— Table 11

---

Replace `[YOUR-SITE-URL]` with the actual deployed URL (e.g. `https://table-eleven.pages.dev`).

Keep it exactly this warm and this short. No subject line explanation, no "this is an
automated message," no signature block. The mystery is the point.

---

## Step 5 — Create the Gmail Filter

This filter catches all incoming emails and fires the auto-reply.

1. In Gmail, go to **Settings** → **See all settings** → **Filters and Blocked Addresses**.
2. Click **Create a new filter**.
3. In the **To** field, enter: `table.eleven.matt.and.steph@gmail.com`
4. Click **Create filter**.
5. On the next screen, check:
   - **Send template** → select `Table 11 Auto-Reply`
   - **Mark as read** (optional, keeps the inbox clean)
6. Click **Create filter**.

**Test it:** Send an email to the address from a different account. Within a minute you
should receive the auto-reply with the site URL.

---

## Durability Checklist

Run this every April. Add a recurring reminder in your calendar now.

### Annual (every April, starting 2027)

- [ ] Log in to `table.eleven.matt.and.steph@gmail.com` — confirm the account is still active
      and hasn't been suspended for inactivity (Google occasionally disables dormant accounts).
- [ ] Send a test email from a separate address and confirm the auto-reply fires with the
      correct URL.
- [ ] Visit the site URL and confirm it loads correctly.
- [ ] Confirm the countdown is still ticking (correct years/months showing).
- [ ] `git pull` the repo locally and save an offline ZIP backup.

### Every 2–3 Years

- [ ] Check that Cloudflare Pages (or GitHub Pages) is still offering free static hosting.
      Both have been stable for 10+ years but it's worth verifying the project hasn't been
      paused or migrated.
- [ ] Rotate the Gmail password if any of the Table 11 couples have had a security incident.
- [ ] Verify backup codes are still accessible. Generate new ones if the old set has been used.

### 6 Months Before (October 2036)

- [ ] Full end-to-end test: email the address, confirm auto-reply, visit the site, confirm
      countdown shows less than 1 year.
- [ ] Ensure all four couples' messages are finalized in `content.json` and deployed.
- [ ] Confirm the hero photo and all media files load correctly.
- [ ] Brief all four couples so everyone remembers what's happening on April 25, 2037.

---

## If Something Goes Wrong

**Gmail account suspended:**
Google sometimes suspends inactive accounts. Log in at least once a year to prevent this.
If suspended, use the account recovery flow with your backup codes.

**Site URL changes:**
If you migrate hosts and the URL changes, update the auto-reply template in Gmail
(Settings → Templates) with the new URL.

**Lost password:**
The password should be stored with all four couples. If truly lost, use Gmail account
recovery (phone number or backup email set during account creation — make sure these
are set up and also stored somewhere durable).
