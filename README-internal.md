# Bogus Basin Mountain Hosts — Internal Portal

An internal-only companion site for the **Bogus Basin Mountain Hosts** volunteer program — providing host resources, board of directors info, meeting minutes, discussion boards, and admin tools, all backed by Firebase with separate Firestore collections from the public site.

**Live Site:** [https://mountainstogo.github.io/bbhosts/internal-MH.html](https://mountainstogo.github.io/bbhosts/internal-MH.html)

> **Note:** This is the **internal portal** for active Mountain Hosts. The entire site is behind a Google sign-in gate — only authorized users and admins can view content. The public-facing site is [`mountain-hosts.html`](mountain-hosts.html) — see [README.md](README.md) for its documentation.

---

## Features

### Authentication & Access Control
- **Modernized Sign-In Gate** — Full-page authentication screen with animated gradient background, floating SVG snowflake and sun icons, glassmorphism card, and "Internal Hosts Only" badge. Blocks all site content until the user signs in with an authorized Google account
- **Terms & Conditions** — Users must read, scroll to bottom, check an agreement checkbox, and accept T&C before accessing the portal on first visit. Admin-editable via the Management Portal. Changes to T&C require all users to re-accept
- **Access Request System** — Unauthorized users can submit a request to join (name, role, reason). Admins review requests (approve/deny) from the Management Portal. All parties receive email notifications via EmailJS at each step (submission, approval, denial, revocation)
- **Two-Tier Access** — **Authorized Users** can view the site and participate in discussions; **Admins** can additionally manage all content via the Management Portal
- **Authorized Users List** — Admin-managed whitelist stored in Firestore (`internal_settings/authorizedUsers`). Removing a user sends an access-revoked email notification
- **Admin Emails List** — Separate admin whitelist (`internal_settings/adminEmails`); admins are automatically authorized
- **Sign Out Button** — Persistent sign-out button in the weather banner (next to Management Portal) for easy session termination

### Host-Facing Sections
- **Live Weather Banner** — Real-time conditions at Bogus Basin via the NOAA API (auto-refreshes every 10 minutes)
- **About Mountain Hosts** — Mission statement with uploadable group photo
- **Host Leadership** — Director and Lead cards with photos and clickable rich text bios
- **Board of Directors** — Organizational chart with custom roles, photo cards, and bio modals
- **Host Resources** — Quick links to bogusbasin.org, conditions/webcams, Mountain Hosts Learning, and Troopiter scheduling
- **National Ski Patrol** — Link to nsp.org
- **Tools & Apps** — CalTopo backcountry mapping tool with iOS and Android app links
- **Local Business Discounts** — Two discount programs:
  - **Bogus Basin Host Discounts** (On-Mountain) — 20% off retail, 50% off tune & wax, 50% off food & drink (excl. alcohol)
  - **Ridgeline Bike & Ski** — 30% discount with link to ridgelinebikenski.com
- **Announcements & Awards** — Rich-text announcements with inline photos, categorized as announcements, awards, events, or stories
- **Meeting Minutes** — Expandable cards with rich-text meeting notes, sorted newest first
- **Host Discussion Board** — Threaded comment system with Google sign-in, per-user emoji reaction toggles, community guidelines, and admin replies

### Admin Portal (Management Portal)
- **Google Sign-In** — Admin access via Google accounts whitelisted in Firestore
- **Icon Grid Control Panel** — Modern dashboard with 9 clickable cards, each opening a management panel with a "← Control Panel" back button:
  - 💬 **Comments** — View, reply as admin, and delete discussion threads
  - ⭐ **Leadership** — Add, edit, and delete leadership entries with drag-and-drop photos and rich text bios
  - 🏛️ **Board** — Add, edit, and delete Board of Directors entries with custom roles (Chairman, President, VP, Secretary, Treasurer, Member) and rich text bios
  - 📢 **Announcements** — Rich text editor with bold, italic, underline, lists, links, blockquotes, and inline photos
  - 📝 **Minutes** — Create and manage meeting minutes with rich text editor and date picker
  - 📸 **Group Photo** — Upload and caption the hero group photo
  - 📜 **Terms** — Edit and publish Terms & Conditions with rich text editor, load default template, view user agreement status (current vs outdated)
  - 📥 **Requests** — Review access requests with filter buttons (Pending/Approved/Denied/All), approve or deny with one click, automatic email notifications sent to requesters
  - 🔧 **Account Management** — Manage admin emails and authorized user access list; removing an authorized user sends an access-revoked email

### Design
- **Teal & Copper Theme** — Distinct from the public site's navy/gold palette, using teal (`#1a3a3a`) and copper (`#b5651d`) for visual separation
- **Fully Responsive** — Mobile-friendly layout with CSS Grid and media queries
- **Animated SVG Header** — Floating snowflake and sun SVG icons with gradient fills
- **Modern Auth Gate** — Glassmorphism card with animated background orbs, SVG snowflake (drift animation) and sun (spin animation), copper "Internal Hosts Only" badge

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Single-file HTML / CSS / vanilla JavaScript |
| Auth | Firebase Authentication (Google sign-in gate + admin auth) |
| Database | Cloud Firestore (Spark free tier) |
| Image Storage | Client-side canvas compression → base64 data URLs stored in Firestore |
| Email Notifications | EmailJS (client-side, access request workflow) |
| Weather | NOAA Weather API (api.weather.gov) |
| Hosting | GitHub Pages |
| Rich Text | `contenteditable` div with `document.execCommand` toolbar |

> **No server-side code or Firebase Storage required.** All images are compressed client-side and stored as base64 strings directly in Firestore documents.

---

## Project Structure

```
BBHost/
├── mountain-hosts.html          # Public-facing site
├── internal-MH.html             # Internal portal (this site)
├── firestore.rules              # Firestore security rules (both public + internal)
├── README.md                    # Public site documentation
├── README-internal.md           # This file (internal site documentation)
├── INSTRUCTIONS.md              # Public site admin instructions
└── INSTRUCTIONS-internal.md     # Internal site admin instructions
```

---

## Firestore Collections (Internal Portal)

The internal portal uses **separate Firestore collections** prefixed with `internal_` to keep data completely isolated from the public site.

| Collection | Document Fields | Description |
|---|---|---|
| `internal_comments` | `name`, `email`, `uid`, `body`, `date`, `parentId`, `isAdmin`, `reactions` | Host discussion threads. `parentId` links replies. `reactions` stores arrays of UIDs per emoji. |
| `internal_leaders` | `name`, `role`, `photoUrl`, `bio` | Leadership entries. `role` is "Director" or "Lead". `photoUrl` is base64. `bio` is rich HTML. |
| `internal_directors` | `name`, `role`, `photoUrl`, `bio` | Board of Directors entries. `role` is free-text (e.g., "President", "Treasurer"). |
| `internal_announcements` | `type`, `title`, `content`, `date` | Rich HTML content. `type`: announcement, award, event, or story. |
| `internal_minutes` | `title`, `content`, `date` | Meeting minutes with rich HTML content and associated date. |
| `internal_settings/site` | `photoUrl`, `photoCaption` | Group photo (base64) and caption. |
| `internal_settings/adminEmails` | `emails` | Array of authorized admin email addresses. |
| `internal_settings/authorizedUsers` | `emails` | Array of authorized user email addresses (non-admin hosts who can view the site). |
| `internal_settings/termsAndConditions` | `content`, `lastUpdated` | Terms & Conditions HTML content and version timestamp. |
| `internal_tc_agreements` | `email`, `name`, `agreedAt`, `tcVersion` | Per-user T&C acceptance records. Document ID = user UID. |
| `internal_access_requests` | `uid`, `email`, `name`, `role`, `reason`, `status`, `requestedAt`, `reviewedBy`, `reviewedAt`, `reviewNote` | Access request records. `status` is `pending`, `approved`, or `denied`. |

> **Important:** The internal portal shares the same Firebase project (`mtn-hosts`) but uses completely separate collections. Changes to internal data never affect the public site, and vice versa.

---

## Firestore Security Rules

The internal portal's collections follow these access rules (defined in `firestore.rules`):

| Collection | Auth Read | Auth Write | Notes |
|---|---|---|---|
| `internal_comments` | ✅ | ✅ (create & update) | Google sign-in required to read/post/react. Delete requires auth. |
| `internal_leaders` | ✅ | ✅ | Auth required for all operations |
| `internal_directors` | ✅ | ✅ | Auth required for all operations |
| `internal_announcements` | ✅ | ✅ | Auth required for all operations |
| `internal_minutes` | ✅ | ✅ | Auth required for all operations |
| `internal_settings` | Public* | ✅ | *Public read needed for auth gate to verify user access |
| `internal_tc_agreements` | ✅ | ✅ | Per-user T&C acceptance records |
| `internal_access_requests` | ✅ | ✅ | Access request records (requires composite index on `uid` + `requestedAt`) |

Rules must be deployed via the Firebase Console — see [INSTRUCTIONS-internal.md](INSTRUCTIONS-internal.md) for details.

---

## Differences from the Public Site

| Feature | Public Site (`mountain-hosts.html`) | Internal Portal (`internal-MH.html`) |
|---|---|---|
| Color scheme | Navy `#1b2a4a` / Gold `#c8913a` | Teal `#1a3a3a` / Copper `#b5651d` |
| Firestore collections | `comments`, `leaders`, etc. | `internal_comments`, `internal_leaders`, etc. |
| Board of Directors | ❌ Not included | ✅ Org chart with custom roles |
| Meeting Minutes | ❌ Not included | ✅ Expandable rich-text cards |
| Host Resources | Basic links only | Learning, Troopiter, CalTopo, Ridgeline discounts |
| Mountain Tours section | ✅ Public tour schedule | ❌ Not included (internal audience) |
| Become a Host section | ✅ Call-to-action + QR code | ❌ Not included (already hosts) |
| Comment auth | Google sign-in | Google sign-in (gate + comments) |
| Site access | Public | Auth gate + T&C acceptance (authorized users only) |
| Terms & Conditions | ❌ Not included | ✅ Scroll-to-bottom + checkbox acceptance, admin-editable |
| Sign Out | Weather banner (conditional) | Weather banner sign-out button |
| Admin panel | 5 icon grid cards | 9 icon grid cards (+ Board, Minutes, Terms, Requests) |
| Local Discounts | ❌ Not included | ✅ Bogus Basin + Ridgeline discounts |
| Tools & Apps | ❌ Not included | ✅ CalTopo mapping (iOS + Android) |
| Access Requests | ❌ Not included | ✅ Full request system with EmailJS emails |
| Email Notifications | ❌ Not included | ✅ EmailJS (request, approval, denial, revocation) |

---

## Firebase Setup

The internal portal shares the same Firebase project as the public site:

- **Project ID:** `mtn-hosts`
- **Console:** [https://console.firebase.google.com/project/mtn-hosts/](https://console.firebase.google.com/project/mtn-hosts/)

No additional Firebase setup is needed beyond what's already configured for the public site. The internal portal's collections are created automatically on first use.

---

## Image Handling

All images are processed client-side before storage:

| Image Type | Max Dimensions | JPEG Quality | Max Upload Size |
|---|---|---|---|
| Leader Photo | 300 × 300 | 0.80 | 5 MB |
| Director Photo | 300 × 300 | 0.80 | 5 MB |
| Group Photo | 1200 × 900 | 0.82 | 10 MB |
| Announcement/Minutes Photo | 800 × 600 | 0.80 | 5 MB |

> **Note:** Firestore documents have a 1 MB size limit. Compressed photos typically stay well under this.

---

## Real-Time Updates

All content uses **Firestore `onSnapshot` listeners** — new comments, leadership changes, announcements, meeting minutes, and board updates appear instantly for all connected users without a page refresh.

---

## Seed Data

On first load with empty collections, the app automatically seeds:
- **5 placeholder leaders** (1 Director + 4 Leads)
- **3 sample announcements** (welcome message, award, event)

These can be edited or deleted through the admin portal.

---

## Contributing

1. Clone the repository: `git clone https://github.com/MountainsToGo/bbhosts.git`
2. Edit `internal-MH.html` directly
3. Test locally: `python -m http.server 8080` then open `http://localhost:8080/internal-MH.html`
4. Commit and push to deploy via GitHub Pages

---

## License

This project is maintained by the Bogus Basin Mountain Hosts volunteer organization.
