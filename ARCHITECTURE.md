# Bogus Basin Mountain Hosts — Architecture

## System Overview

The project consists of two single-page HTML applications hosted on Firebase Hosting, backed by Firebase (Auth + Firestore), a Cloudflare Worker for secure email proxying, and GitHub Actions for CI/CD. There is no traditional backend server — security is enforced via Firestore rules and the Cloudflare Worker.

```mermaid
graph TB
    subgraph "Firebase Hosting"
        PUB["mountain-hosts.html<br/><i>Public Site</i>"]
        INT["internal-MH.html<br/><i>Internal Portal</i>"]
    end

    subgraph "Firebase"
        AUTH["Firebase Auth<br/><i>Google Sign-In</i>"]
        FS["Cloud Firestore<br/><i>Real-time Database</i>"]
    end

    subgraph "Cloudflare"
        WORKER["Cloudflare Worker<br/><i>Email Proxy</i>"]
    end

    EMAILJS["EmailJS API<br/><i>Email Delivery</i>"]
    BROWSER["User Browser"]
    GH["GitHub Actions<br/><i>Auto-deploy on push</i>"]

    BROWSER -->|HTTPS| PUB
    BROWSER -->|HTTPS| INT
    PUB -->|Auth + Read/Write| AUTH
    PUB -->|Real-time Sync| FS
    INT -->|Auth + Read/Write| AUTH
    INT -->|Real-time Sync| FS
    INT -->|POST| WORKER
    WORKER -->|Server-side API call| EMAILJS
    EMAILJS -->|SMTP| EMAIL["User Email"]
    GH -->|firebase deploy| PUB
    GH -->|firebase deploy| INT

    style PUB fill:#1b2a4a,color:#fff
    style INT fill:#1a3a3a,color:#fff
    style AUTH fill:#f59e0b,color:#000
    style FS fill:#f59e0b,color:#000
    style WORKER fill:#f97316,color:#fff
    style EMAILJS fill:#6366f1,color:#fff
    style GH fill:#333,color:#fff
```

---

## Hosting & Deployment

| Component | Service | URL / Location |
|-----------|---------|----------------|
| Public Site | Firebase Hosting | `https://mtn-hosts.web.app/mountain-hosts.html` |
| Internal Portal | Firebase Hosting | `https://mtn-hosts.web.app/internal-MH.html` |
| GitHub Pages (mirror) | GitHub Pages | `https://mountainstogo.github.io/bbhosts/` |
| Repository | GitHub | `https://github.com/MountainsToGo/bbhosts` |
| Database & Auth | Firebase | Project: `mtn-hosts` |
| Email Proxy | Cloudflare Workers | `https://bbhosts-email.bogusbasinhosts.workers.dev` |
| Email Delivery | EmailJS | Credentials stored as Cloudflare Worker secrets |
| Firestore Rules | Firebase | Deployed via CLI (`firebase deploy --only firestore:rules`) |
| CI/CD | GitHub Actions | Auto-deploys to Firebase on push to `main` |

---

## File Structure

```
BBHost/
├── mountain-hosts.html                     # Public-facing site (single HTML file)
├── internal-MH.html                        # Internal portal (single HTML file)
├── firestore.rules                         # Firestore security rules (deployed via CLI)
├── firebase.json                           # Firebase Hosting + Firestore config
├── .firebaserc                             # Firebase project link (mtn-hosts)
├── .gitignore                              # Excludes .firebase/, .wrangler/, .env, etc.
├── email-worker/                           # Cloudflare Worker (EmailJS proxy)
│   ├── worker.js                           # Worker source — CORS + origin check + EmailJS relay
│   └── wrangler.toml                       # Wrangler config (secrets via `wrangler secret put`)
├── .github/workflows/
│   └── firebase-hosting-merge.yml          # GitHub Actions: auto-deploy on push to main
├── README.md                               # Public site documentation
├── README-internal.md                      # Internal portal documentation
├── INSTRUCTIONS.md                         # Public site admin guide
├── INSTRUCTIONS-internal.md                # Internal portal admin guide
└── ARCHITECTURE.md                         # This file
```

---

## Authentication Flow

### Public Site
```mermaid
flowchart TD
    A[User visits public site] --> B{Action requires auth?}
    B -->|No| C[View content freely]
    B -->|Yes: Comment/React| D[Google Sign-In popup]
    D --> E{Signed in?}
    E -->|Yes| F[Can comment & react]
    E -->|No| G[Cannot comment]

    H[Admin clicks Management Portal] --> I[Google Sign-In]
    I --> J{Email in adminEmails?}
    J -->|Yes| K[Full admin access]
    J -->|No| L[Access denied]
```

### Internal Portal
```mermaid
flowchart TD
    A[User visits internal portal] --> B[Auth Gate shown]
    B --> C[Google Sign-In]
    C --> D{Email authorized?}
    D -->|Yes| E{T&C accepted?}
    E -->|Yes| F[Site content loads]
    E -->|No| G[Show T&C agreement]
    G -->|Accept| F
    D -->|No| H{Previous request?}
    H -->|Pending| I[Show pending status]
    H -->|Denied| J[Show denied status]
    H -->|None| K[Show request form]
    K --> L[Submit request]
    L --> M[Request saved to Firestore]
    M --> I

    N[Admin reviews request] --> O{Decision}
    O -->|Approve| P[Add to authorized users]
    P --> Q[Worker Proxy: send approval email]
    O -->|Deny| R[Mark as denied]
    R --> S[Worker Proxy: send denial email]

    style B fill:#1a3a3a,color:#fff
    style F fill:#16a34a,color:#fff
    style J fill:#dc2626,color:#fff
```

---

## Firestore Data Model

```mermaid
erDiagram
    PUBLIC_COMMENTS {
        string id PK
        string text
        string userName
        string userEmail
        string userPhoto
        timestamp createdAt
        map reactions
        array replies
    }

    PUBLIC_LEADERS {
        string id PK
        string name
        string role
        string photo
        string bio
    }

    PUBLIC_ANNOUNCEMENTS {
        string id PK
        string type
        string title
        string content
        timestamp createdAt
    }

    PUBLIC_SETTINGS {
        string site "groupPhoto URL"
        string adminEmails "authorized admin list"
    }

    INTERNAL_COMMENTS {
        string id PK
        string text
        string userName
        string userEmail
        string userPhoto
        timestamp createdAt
        map reactions
        array replies
    }

    INTERNAL_LEADERS {
        string id PK
        string name
        string role
        string photo
        string bio
    }

    INTERNAL_DIRECTORS {
        string id PK
        string name
        string role
        string photo
    }

    INTERNAL_ANNOUNCEMENTS {
        string id PK
        string type
        string title
        string content
        timestamp createdAt
    }

    INTERNAL_MINUTES {
        string id PK
        string title
        string date
        string content
        timestamp createdAt
    }

    INTERNAL_SETTINGS {
        string site "groupPhoto, siteDescription"
        string adminEmails "admin email list"
        string authorizedUsers "authorized user list"
        string termsAndConditions "T&C HTML content"
    }

    INTERNAL_TC_AGREEMENTS {
        string id PK
        string email
        timestamp agreedAt
        string version
    }

    INTERNAL_ACCESS_REQUESTS {
        string id PK
        string email
        string name
        string reason
        string status
        string reviewedBy
        timestamp requestedAt
        timestamp reviewedAt
    }
```

---

## Firestore Collections Map

### Public Site Collections
| Collection | Purpose | Read | Write |
|------------|---------|------|-------|
| `comments` | Guest comments with reactions | Public | Authenticated |
| `leaders` | Leadership directory | Public | Admin |
| `announcements` | News & awards | Public | Admin |
| `settings/site` | Group photo, site config | Public | Admin |
| `settings/adminEmails` | Admin email whitelist | Public | Admin |

### Internal Portal Collections
| Collection | Purpose | Read | Write |
|------------|---------|------|-------|
| `internal_comments` | Host discussion board | Authenticated | Authenticated |
| `internal_leaders` | Internal leadership | Authenticated | Admin |
| `internal_directors` | Board of Directors | Authenticated | Admin |
| `internal_announcements` | Internal announcements | Authenticated | Admin |
| `internal_minutes` | Meeting minutes | Authenticated | Admin |
| `internal_settings/site` | Site config, group photo | Public* | Admin |
| `internal_settings/adminEmails` | Admin whitelist | Public* | Admin |
| `internal_settings/authorizedUsers` | Authorized user list | Public* | Admin |
| `internal_settings/termsAndConditions` | T&C content & version | Public* | Admin |
| `internal_tc_agreements` | User T&C acceptances | Authenticated | Authenticated |
| `internal_access_requests` | Access request records | Authenticated | Authenticated |

_*Public read required for auth gate to verify user authorization before full sign-in._

---

## Admin Management Portal

Both sites use an icon-grid control panel for admin functions.

### Public Site — 5 Panels
```mermaid
graph LR
    CP["🎛️ Control Panel"]
    CP --> C["💬 Comments"]
    CP --> L["⭐ Leadership"]
    CP --> A["📢 Announcements"]
    CP --> P["📸 Group Photo"]
    CP --> S["🔧 Account Mgmt"]
```

### Internal Portal — 9 Panels
```mermaid
graph LR
    CP["🎛️ Control Panel"]
    CP --> C["💬 Comments"]
    CP --> L["⭐ Leadership"]
    CP --> B["🏛️ Board"]
    CP --> A["📢 Announcements"]
    CP --> M["📝 Minutes"]
    CP --> P["📸 Group Photo"]
    CP --> T["📜 Terms"]
    CP --> R["📥 Requests"]
    CP --> S["🔧 Account Mgmt"]
```

---

## Board of Directors Hierarchy

```mermaid
graph TD
    CH["👑 Chairman"]
    CH --> PR["President"]
    CH --> VP["Vice President"]
    CH --> SE["Secretary"]
    CH --> TR["Treasurer"]
    CH --> ME["Member"]
```

---

## External Integrations

```mermaid
graph LR
    subgraph "Client-Side APIs"
        WEATHER["NOAA Weather API<br/><i>api.weather.gov</i>"]
        GOOGLE["Google OAuth 2.0<br/><i>Sign-in</i>"]
    end

    subgraph "Server-Side (Cloudflare Worker)"
        WORKER["Email Proxy Worker<br/><i>bbhosts-email.bogusbasinhosts.workers.dev</i>"]
        EMAILJS["EmailJS REST API<br/><i>Credentials as Worker secrets</i>"]
    end

    subgraph "Firebase Services"
        FAUTH["Firebase Auth"]
        FDB["Cloud Firestore"]
    end

    subgraph "CI/CD"
        GHA["GitHub Actions"]
        FH["Firebase Hosting"]
    end

    APP["Both Sites"] --> WEATHER
    APP --> GOOGLE
    APP --> FAUTH
    APP --> FDB
    INT_ONLY["Internal Only"] --> WORKER
    WORKER --> EMAILJS
    GHA -->|push to main| FH
```

| Service | Purpose | Auth / Credentials |
|---------|---------|--------------------|
| Firebase Auth | Google sign-in provider | Config in source (client-side, public by design) |
| Cloud Firestore | Real-time data storage | Config in source (secured by Firestore rules) |
| NOAA Weather API | Weather conditions for banner | None (public API) |
| Cloudflare Worker | Email proxy — CORS-locked | Worker URL in source (CORS-protected) |
| EmailJS | Email delivery | Secrets in Cloudflare Worker (never in browser) |
| GitHub Actions | Auto-deploy on push | Firebase CI token in GitHub Secrets |

---

## Security Model

| Layer | Public Site | Internal Portal |
|-------|-------------|-----------------|
| **Hosting** | Firebase Hosting (`mtn-hosts.web.app`) | Firebase Hosting (`mtn-hosts.web.app`) |
| **Viewing** | No auth required | Auth gate (Google sign-in + authorized email list) |
| **Commenting** | Google sign-in required | Google sign-in required (auto via auth gate) |
| **Comment Updates** | Reactions-only (server-enforced) | Reactions-only (server-enforced) |
| **Admin Access** | Email in `settings/adminEmails` (server-verified) | Email in `internal_settings/adminEmails` (server-verified) |
| **Data Isolation** | `comments`, `leaders`, etc. | `internal_*` prefixed collections |
| **T&C Gating** | None | Must accept T&C on first visit |
| **Access Requests** | N/A | Unauthorized users can request access |
| **Email Notifications** | None | Via Cloudflare Worker proxy (server-side credentials) |
| **XSS Protection** | DOMPurify v3 sanitizes all user HTML | DOMPurify v3 sanitizes all user HTML |
| **Firestore Rules** | Public read, admin-only write (server-enforced) | Auth required for read, admin-only write (server-enforced) |
| **CI/CD** | GitHub Actions → Firebase Hosting | GitHub Actions → Firebase Hosting |
| **Secrets Management** | Firebase config (public by design) | EmailJS creds in Cloudflare Worker secrets |

### Firestore Rules Security
- Admin status verified **server-side** via `isPublicAdmin()` / `isInternalAdmin()` helper functions
- These check `request.auth.token.email` against the `adminEmails` Firestore document
- Bootstrap protection: `!exists()` fallback allows first admin to self-seed
- Comment updates restricted to `reactions` field only via `affectedKeys().hasOnly(['reactions'])`
- T&C agreements restricted to user's own document
- Access request approval/denial restricted to admins only

### Email Security (Cloudflare Worker Proxy)
- EmailJS credentials (service ID, template ID, public key, private key) stored as **encrypted Cloudflare Worker secrets**
- Zero credentials in browser-side code
- Worker enforces **CORS origin allowlist**: `mtn-hosts.web.app`, `mountainstogo.github.io`, `localhost`
- Worker validates required fields before forwarding to EmailJS API
- Free tier: 100,000 Worker requests/day, 200 EmailJS emails/month

---

## Color Schemes

| Element | Public Site | Internal Portal |
|---------|-------------|-----------------|
| Primary | Navy `#1b2a4a` | Teal `#1a3a3a` |
| Accent | Gold `#c8913a` | Copper `#b5651d` |
| Theme | Winter mountain | Forest/alpine |

---

## Technology Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (no frameworks)
- **Hosting:** Firebase Hosting (primary), GitHub Pages (mirror)
- **Auth:** Firebase Auth with Google provider
- **Database:** Cloud Firestore (real-time listeners via `onSnapshot`)
- **Email Proxy:** Cloudflare Workers (server-side credential storage)
- **Email Delivery:** EmailJS (via Cloudflare Worker proxy — 200/month free tier)
- **XSS Protection:** DOMPurify v3 (CDN)
- **Weather:** NOAA Weather API (api.weather.gov, no key required)
- **CI/CD:** GitHub Actions (auto-deploy to Firebase on push to `main`)
- **SDK Versions:** Firebase compat v10.12.0, DOMPurify v3, Wrangler v4
