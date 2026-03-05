# Bogus Basin Mountain Hosts

A public-facing website for the **Bogus Basin Mountain Hosts** volunteer program — providing information about guided mountain tours, host leadership, announcements, and guest interactions, all managed through a secure admin portal backed by Firebase.

**Live Site:** [https://mountainstogo.github.io/bbhosts/mountain-hosts.html](https://mountainstogo.github.io/bbhosts/mountain-hosts.html)

---

## Features

### Public Pages
- **Live Weather Banner** — Real-time conditions at Bogus Basin via the NOAA API (auto-refreshes every 10 minutes)
- **Sign Out Button** — Appears in the weather banner (next to Management Portal) when a user is signed in, for easy session termination
- **About Section** — Mission statement and uploadable group photo
- **Mountain Tours** — Complimentary guided tours schedule (Sat & Sun at 10:30 AM & 1:30 PM)
- **Host Leadership** — Director and Lead cards with photos and clickable rich text bios
- **Bogus Basin Resources** — Quick links to bogusbasin.org and conditions/webcams
- **National Ski Patrol** — Link to nsp.org
- **Become a Host** — Call-to-action section with QR code placeholder
- **Announcements & Awards** — Rich-text announcements with inline photos, categorized as announcements, awards, events, or stories
- **Guest Comments** — Threaded comment system with Google sign-in, per-user emoji reaction toggles, and admin replies
- **Community Guidelines** — Six-rule code of conduct displayed inline in the comment section

### Admin Portal (Management Portal)
- **Google Sign-In** — Admin access via Google accounts whitelisted in Firestore
- **Icon Grid Control Panel** — Modern dashboard with 5 clickable cards, each opening a management panel with a "← Control Panel" back button:
  - 💬 **Comments** — View, reply as admin, and delete comments (including all nested replies)
  - ⭐ **Leadership** — Add, edit, and delete leadership entries with drag-and-drop photo uploads and rich text bios
  - 📢 **Announcements** — Rich text editor with bold, italic, underline, lists, links, blockquotes, and inline photo support
  - 📸 **Group Photo** — Upload and caption the hero group photo
  - 🔧 **Account Management** — Manage authorized admin email addresses

### Design
- **Winter/Summer Dual Theme** — Gradient palette blending winter blues/navies with summer golds/greens, representing the year-round volunteer program
- **Fully Responsive** — Mobile-friendly layout with CSS Grid and media queries
- **Animated Header** — Floating ❄️ and ☀️ emoji decorations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Single-file HTML / CSS / vanilla JavaScript |
| Auth | Firebase Authentication (Google sign-in) |
| Database | Cloud Firestore (Spark free tier) |
| Image Storage | Client-side canvas compression → base64 data URLs stored in Firestore |
| Weather | NOAA Weather API (api.weather.gov) |
| Hosting | GitHub Pages |
| Rich Text | `contenteditable` div with `document.execCommand` toolbar |

> **No server-side code or Firebase Storage required.** All images are compressed client-side and stored as base64 strings directly in Firestore documents.

---

## Project Structure

```
BBHost/
├── mountain-hosts.html          # Public-facing site (single-file HTML/CSS/JS)
├── internal-MH.html             # Internal host portal (separate Firestore collections)
├── firestore.rules              # Firestore security rules (deploy via Firebase Console)
├── README.md                    # This file (public site documentation)
├── README-internal.md           # Internal portal documentation
├── INSTRUCTIONS.md              # Public site admin instructions
├── INSTRUCTIONS-internal.md     # Internal portal admin instructions
└── ARCHITECTURE.md              # System architecture documentation
```

---

## Firestore Collections

| Collection | Document Fields | Description |
|---|---|---|
| `comments` | `name`, `email`, `body`, `date`, `parentId`, `isAdmin`, `reactions` | Guest comments and admin replies. `parentId` links replies to parents. `reactions` stores arrays of user UIDs per emoji. |
| `leaders` | `name`, `role`, `photoUrl`, `bio` | Leadership entries. `role` is "Director" or "Lead". `photoUrl` is base64. `bio` is rich HTML. |
| `announcements` | `type`, `title`, `content`, `date` | Rich HTML content. `type`: announcement, award, event, or story. |
| `settings/site` | `photoUrl`, `photoCaption` | Single document storing the group photo (base64) and its caption. |
| `settings/adminEmails` | `emails` | Array of authorized admin email addresses (Google accounts). |

---

## Firestore Security Rules

```
comments       → Public read, authenticated create/update, admin-only delete
leaders        → Public read, admin-only write
announcements  → Public read, admin-only write
settings       → Public read, authenticated create/update/delete
```

Rules are defined in `firestore.rules` and must be deployed via the Firebase Console (see [INSTRUCTIONS.md](INSTRUCTIONS.md) for details).

---

## Firebase Setup (For New Deployments)

If you're setting up a new instance of this project:

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)
2. **Enable Authentication**
   - Go to Authentication → Sign-in method → Enable **Google**
   - Add your domain (e.g., `mountainstogo.github.io`) to the authorized domains list
3. **Create a Firestore Database**
   - Go to Firestore Database → Create database → **Production mode**
   - Choose a region close to your users
4. **Deploy Security Rules**
   - Go to Firestore → Rules tab
   - Copy the contents of `firestore.rules` and publish
5. **Update Firebase Config**
   - Get your config from Project Settings → General → Your apps → Web app
   - Replace the `firebaseConfig` object in `mountain-hosts.html` (around line 1326)
6. **Deploy to GitHub Pages**
   - Push to a GitHub repository
   - Enable GitHub Pages (Settings → Pages → Source: main branch)

---

## Image Handling

All images are processed client-side before storage to keep Firestore document sizes manageable:

| Image Type | Max Dimensions | JPEG Quality | Max Upload Size |
|---|---|---|---|
| Leader Photo | 300 × 300 | 0.80 | 5 MB |
| Group Photo | 1200 × 900 | 0.82 | 10 MB |
| Announcement Inline Photo | 800 × 600 | 0.80 | 5 MB |

Images are compressed using an HTML5 `<canvas>` element, converted to JPEG base64 data URLs, and stored directly in Firestore fields. This avoids the need for Firebase Storage (which has associated costs on paid plans).

> **Note:** Firestore documents have a 1 MB size limit. Compressed photos typically stay well under this, but very large or numerous inline announcement photos could approach the limit.

---

## Weather Integration

The weather banner fetches data from the **NOAA Weather API** using a two-step process:

1. `GET https://api.weather.gov/points/43.7722,-116.0947` → returns forecast grid endpoint
2. `GET {forecast_url}` → returns current period forecast data

Displays: temperature (°F), conditions, wind speed/direction, weather emoji icon, and next-period forecast. Auto-refreshes every 10 minutes. Falls back to a webcam link on error.

---

## Real-Time Updates

All public content uses **Firestore `onSnapshot` listeners**, meaning:
- New comments, leadership changes, announcements, and group photo updates appear instantly for all connected users — no page refresh needed
- Admin panels also update in real-time

---

## Seed Data

On first load with empty collections, the app automatically seeds:
- **5 placeholder leaders** (1 Director + 4 Leads with "Name" placeholders)
- **3 sample announcements** (welcome message, host-of-the-year award, spring BBQ event)

These can be edited or deleted through the admin portal once signed in.

---

## Contributing

1. Clone the repository: `git clone https://github.com/MountainsToGo/bbhosts.git`
2. Edit `mountain-hosts.html` directly
3. Test locally by opening the file in a browser (Firebase auth/Firestore will work with the existing config)
4. Commit and push to deploy via GitHub Pages

---

## License

This project is maintained by the Bogus Basin Mountain Hosts volunteer organization.
