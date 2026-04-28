# Table 11

A static time-capsule website built as a wedding gift for Matt and Steph.
On their 11th anniversary (April 25, 2037), they'll email a Gmail address and receive
the URL of this site in an auto-reply.

Before that date: a minimalist countdown page.
After that date: the full time capsule — messages from their table, a Tofino coordinates
reveal, and a chronological photo/video feed built up over 11 years.

---

## File Structure

```
table-eleven/
  index.html          Main page (both states)
  styles.css          All visual styles
  countdown.js        Timer logic + state switching
  reveal.js           Post-reveal content renderer (reads content.json)
  content.json        All editable copy + media manifest
  fonts/              Self-hosted woff2 files (Cormorant Garamond + Inter)
  media/
    hero.jpg          Full-bleed background photo
    [uploads]         Photos/videos added over the years
  README.md           This file
  GMAIL-SETUP.md      Gmail auto-reply setup guide
```

---

## Local Preview

Requires a local HTTP server (fetch won't work over `file://`).

```bash
cd table-eleven
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000` — countdown (real state)
- `http://localhost:8000?preview` — post-reveal (design/content preview)

---

## Deploying to Cloudflare Pages

1. Push this repo to GitHub (see below).
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**.
3. Connect your GitHub account and select this repository.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/` (or leave as default)
5. Click **Save and Deploy**.

Cloudflare will assign a URL like `table-eleven.pages.dev`. You can add a custom domain
in Pages → Custom Domains if you want something like `table11.xyz`.

Every `git push` to `main` will auto-deploy.

---

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings** → **Pages**.
3. Source: **Deploy from a branch** → branch: `main`, folder: `/ (root)`.
4. Save. GitHub will assign `https://[username].github.io/table-eleven/`.

Note: GitHub Pages serves from a subdirectory path. No changes to the code are needed
as all asset paths are relative.

---

## Adding a New Media Item

This is the main thing you'll do over the 11 years.

**Step 1:** Drop the file into `/media/`:
```
media/tofino-2028.jpg
```

**Step 2:** Open `content.json` and add an entry to the `"media"` array:
```json
{
  "filename": "tofino-2028.jpg",
  "type": "image",
  "uploaded_by": "Josh and Emilie",
  "caption": "First time back in Tofino since the wedding.",
  "date_added": "2028-07-14"
}
```

For videos, use `"type": "video"`. Supported formats: MP4 (H.264).

**Step 3:** Commit and push:
```bash
git add media/tofino-2028.jpg content.json
git commit -m "Add Tofino 2028 photo"
git push
```

The media feed renders chronologically by `date_added`. Newest decade first or oldest
first — currently sorted oldest first so it reads as a timeline.

**Image sizing:** Compress photos to under 1MB before adding. Target 1600px on the long
edge at 75% JPEG. On macOS:
```bash
sips -Z 1600 --setProperty formatOptions 75 yourphoto.jpg
```

---

## Updating Copy

All editable text lives in `content.json`. Open it, change the value, save, commit, push.

Key fields:
- `opening_line` — large serif at top of post-reveal
- `greeting` — subheading below the opening
- `sign_off` — closing line ("We'll see you in Tofino.")
- `coordinates_reveal_text` — text revealed when coordinates are tapped
- `couples[n].message` — each couple's time-capsule message
- `couples[n].message_date` — date the message was written (ISO format: `"2026-05-01"`)

---

## Adding the Couples' Messages

Before locking in the site, collect a message from each couple and fill in `content.json`:

```json
{
  "names": "Josh and Emilie",
  "message": "Your message here. Write it like you'd write a letter — warm, specific, personal.",
  "message_date": "2026-05-01"
}
```

Once all four messages are in, do a final commit and the content is set.

---

## Changing the Reveal Date

If for any reason the reveal date needs to change, update the UTC timestamp in **two places**:

**countdown.js** (line ~23):
```js
var REVEAL_MS = Date.UTC(2037, 3, 26, 2, 0, 0);
```
Month is 0-indexed (0 = January, 3 = April). The timestamp above is
April 26, 2037 02:00 UTC = April 25, 2037 7:00 PM PDT.

**content.json**:
```json
"reveal_date_utc": "2037-04-26T02:00:00Z"
```

Then update the Gmail auto-reply URL and canned response accordingly (see GMAIL-SETUP.md).

---

## Backing Up the Project

The GitHub repo is the primary backup. Additionally:

**Annual offline backup:**
```bash
git clone https://github.com/[username]/table-eleven table-eleven-backup-[year]
```

Or download a ZIP from GitHub → **Code** → **Download ZIP**.

Store a copy on an external drive or cloud storage (iCloud, Google Drive) once a year.
By 2037 you want at least 3 independent copies.

---

## Tech Notes

- **No build step.** HTML + CSS + vanilla JS only. Works on any static host, forever.
- **No external dependencies at runtime.** Fonts, images — everything is self-hosted.
- **Reveal logic** is a single UTC timestamp hardcoded in `countdown.js`. No server needed.
- **`?preview`** in the URL forces post-reveal state for development.
- The site is indexed with `noindex` — search engines won't find it.
