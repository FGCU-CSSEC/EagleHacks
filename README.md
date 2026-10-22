# EagleHacks 2027

The public site for EagleHacks 2027 (March 12–14, 2027, FGCU). Next.js 16, TypeScript and Tailwind. This is the "shell" for the MLH application; the hacker portal (sign-in, confirm button, QR check-in, admin) gets built on top of it by December.

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where to change things

Almost everything lives in **`src/config/site.ts`**:

- Dates, location, hours, cap
- Register button state and the Airtable form link
- Discord, Instagram, LinkedIn, email, Devpost, hacker guide links
- FAQ questions and answers
- Organizers (currently the 2026 team; update for 2027)
- Sponsors (empty list shows the "email us about sponsoring" message)

Colors and fonts are tokens at the top of **`src/app/globals.css`**. When the 2027 theme is picked, change those first.

## Register button

The button reads `registration.state`:

| State | Button shows |
| --- | --- |
| `coming-soon` | Applications open January 2027 (not clickable) |
| `open` | Apply now, linking to the Airtable form |
| `waitlist` | Join the waitlist, linking to the Airtable form |
| `closed` | Applications closed (not clickable) |

You can flip it without editing code by setting two environment variables in Vercel, then redeploying:

- `NEXT_PUBLIC_REGISTRATION_STATE` = `open`
- `NEXT_PUBLIC_APPLICATION_URL` = your Airtable form link

`open` and `waitlist` only show a link when the form URL is set. When applications close, also turn the Airtable form off in Airtable.

## Put it live on eagle-hacks.com

1. **GitHub:** create a repo under the club's GitHub account (for example `eagle-hacks`), then in this folder run:
   ```bash
   git remote add origin https://github.com/<club-account>/eagle-hacks.git
   git push -u origin main
   ```
2. **Vercel:** sign in with the club's GitHub, click Add New → Project, import the repo, and deploy with the default settings. You get a `*.vercel.app` link right away.
3. **Domain:** in Vercel, open the project → Settings → Domains, add `eagle-hacks.com` and `www.eagle-hacks.com`, and copy the DNS records Vercel shows into your domain registrar.
4. **Check it:** visit https://eagle-hacks.com on your phone and desktop.

Every push to `main` redeploys automatically. Pull requests get their own preview link.

## MLH

- The footer links to the MLH Code of Conduct.
- Once accepted as a member event, MLH sends a trust badge snippet. Paste it where the comment says so near the top of `src/app/page.tsx`.
- The Airtable form needs MLH's required fields and its three checkboxes.

## Check before sharing

- Team size "up to four" in the FAQ and About section
- "Applications open January 2027"
- The 2027 organizer list
