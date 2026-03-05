# Bogus Basin Mountain Hosts — Architecture

## System Overview

The project consists of two single-page HTML applications hosted on GitHub Pages, backed by Firebase (Auth + Firestore) and EmailJS for notifications. There is no custom backend — everything runs client-side.

```mermaid
graph TB
    subgraph "GitHub Pages"
        PUB["mountain-hosts.html<br/><i>Public Site</i>"]
        INT["internal-MH.html<br/><i>Internal Portal</i>"]
    end

    subgraph "Firebase"
        AUTH["Firebase Auth<br/><i>Google Sign-In</i>"]
        FS["Cloud Firestore<br/><i>Real-time Database</i>"]
    end

    EMAILJS["EmailJS<br/><i>Email Notifications</i>"]
    BROWSER["User Browser"]

    BROWSER -->|HTTPS| PUB
    BROWSER -->|HTTPS| INT
    PUB -->|Auth + Read/Write| AUTH
    PUB -->|Real-time Sync| FS
    INT -->|Auth + Read/Write| AUTH
    INT -->|Real-time Sync| FS
    INT -->|Send Email| EMAILJS
    EMAILJS -->|SMTP| EMAIL["User Email"]

    style PUB fill:#1b2a4a,color:#fff
    style INT fill:#1a3a3a,color:#fff
    style AUTH fill:#f59e0b,color:#000
    style FS fill:#f59e0b,color:#000
    style EMAILJS fill:#6366f1,color:#fff
```

---

## Hosting & Deployment

| Component | Service | URL |
|-----------|---------|-----|
| Public Site | GitHub Pages | `https://mountainstogo.github.io/bbhosts/mountain-hosts.html` |
| Internal Portal | GitHub Pages | `https://mountainstogo.github.io/bbhosts/internal-MH.html` |
| Repository | GitHub | `https://github.com/MountainsToGo/bbhosts` |
| Database & Auth | Firebase | *(project ID in source)* |
| Email Notifications | EmailJS | *(service ID in source)* |
| Firestore Rules | Firebase Console | Deployed manually |

---

## File Structure

```
BBHost/
├── mountain-hosts.html       # Public-facing site (single HTML file)
├── internal-MH.html          # Internal portal (single HTML file)
├── firestore.rules           # Firestore security rules (deploy via Firebase Console)
├── README.md                 # Public site documentation
├── README-internal.md        # Internal portal documentation
├── INSTRUCTIONS.md           # Public site admin guide
├── INSTRUCTIONS-internal.md  # Internal portal admin guide
└── ARCHITECTURE.md           # This file
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
    P --> Q[EmailJS: send approval email]
    O -->|Deny| R[Mark as denied]
    R --> S[EmailJS: send denial email]

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
        WEATHER["Open-Meteo API<br/><i>Weather data</i>"]
        GOOGLE["Google OAuth 2.0<br/><i>Sign-in</i>"]
        EMAILJS["EmailJS<br/><i>Access notifications</i>"]
    end

    subgraph "Firebase Services"
        FAUTH["Firebase Auth"]
        FDB["Cloud Firestore"]
    end

    APP["Both Sites"] --> WEATHER
    APP --> GOOGLE
    APP --> FAUTH
    APP --> FDB
    INT_ONLY["Internal Only"] --> EMAILJS
```

| Service | Purpose | Auth/Key |
|---------|---------|----------|
| Firebase Auth | Google sign-in provider | Config in source (client-side) |
| Cloud Firestore | Real-time data storage | Config in source (client-side) |
| Open-Meteo API | Weather conditions for banner | None (public API) |
| EmailJS | Access request notifications | Key in source (client-side) |

---

## Security Model

| Layer | Public Site | Internal Portal |
|-------|-------------|-----------------|
| **Viewing** | No auth required | Auth gate (Google sign-in + authorized email list) |
| **Commenting** | Google sign-in required | Google sign-in required (auto via auth gate) |
| **Admin Access** | Email in `settings/adminEmails` | Email in `internal_settings/adminEmails` |
| **Data Isolation** | `comments`, `leaders`, etc. | `internal_*` prefixed collections |
| **T&C Gating** | None | Must accept T&C on first visit |
| **Access Requests** | N/A | Unauthorized users can request access |
| **Firestore Rules** | Public read, auth write | Auth required for read & write |

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
- **Hosting:** GitHub Pages (static)
- **Auth:** Firebase Auth with Google provider
- **Database:** Cloud Firestore (real-time listeners via `onSnapshot`)
- **Email:** EmailJS (client-side, free tier — 200/month)
- **Weather:** Open-Meteo API (no key required)
- **SDK Versions:** Firebase compat v10.12.0, EmailJS browser v4
