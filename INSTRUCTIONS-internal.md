# Internal Portal — Admin Instructions

A step-by-step guide for managing the Bogus Basin Mountain Hosts **internal portal** through the admin panel.

> **Note:** This guide covers `internal-MH.html` (the internal host portal). For the public-facing site, see [INSTRUCTIONS.md](INSTRUCTIONS.md).

---

## Table of Contents

1. [Site Access & Authentication](#1-site-access--authentication)
2. [Accessing the Management Portal](#2-accessing-the-management-portal)
3. [Managing Authorized Users](#3-managing-authorized-users)
4. [Managing Terms & Conditions](#4-managing-terms--conditions)
5. [Managing Comments](#5-managing-comments)
6. [Managing Leadership](#6-managing-leadership)
7. [Managing Board of Directors](#7-managing-board-of-directors)
8. [Managing Announcements](#8-managing-announcements)
9. [Managing Meeting Minutes](#9-managing-meeting-minutes)
10. [Managing the Group Photo](#10-managing-the-group-photo)
11. [Managing Admin Emails (Account Management)](#11-managing-admin-emails-account-management)
12. [Deploying Firestore Rules](#12-deploying-firestore-rules)
13. [Firebase Console Quick Reference](#13-firebase-console-quick-reference)
14. [First-Time Admin Bootstrap](#14-first-time-admin-bootstrap)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Site Access & Authentication

The internal portal is **protected by a sign-in gate**. All visitors must sign in with a Google account that has been authorized before they can see any site content.

### How It Works
1. When someone opens the internal portal, they see a modern sign-in screen with animated snowflake and sun icons and an "Internal Hosts Only" badge — no site content is visible
2. They click **Sign in with Google** and authenticate with their Google account (any Google account works — Gmail, Google Workspace, .edu, etc.)
3. If their email is on the **Authorized Users** list (or the **Admin Emails** list), the gate opens
4. If **Terms & Conditions** have been published, the user must read, scroll to the bottom, check the agreement checkbox, and accept before seeing the site (see [Section 4](#4-managing-terms--conditions))
5. If their email is *not* authorized, they see an "Access denied" message with instructions to contact an admin
6. If they have no Google account at all, Google's popup will prompt them to create one

### Two Levels of Access

| Level | Can View Site | Can Post Comments | Can Access Management Portal |
|---|---|---|---|
| **Authorized User** | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ |

- **Admins** are automatically authorized — they don't need to be added to both lists
- **Authorized users** can view all content and participate in discussions, but cannot manage content through the admin panel

### Session Behavior
- Once signed in, the user stays authenticated until they sign out or clear their browser data
- To sign out, click the **Sign Out** button in the weather banner (top-right, next to the Management Portal button)
- Signing out returns the user to the sign-in gate
- All browsers/devices require separate sign-in

---

## 2. Accessing the Management Portal

1. Open the site: [https://mountainstogo.github.io/bbhosts/internal-MH.html](https://mountainstogo.github.io/bbhosts/internal-MH.html)
2. Sign in through the auth gate (if not already signed in)
3. Click the **"Management Portal"** button in the weather banner at the top of the page
4. Click **Sign in with Google** and sign in with a Google account that is on the admin emails list
5. After successful login, you'll see eight tabs: 💬 Comments, ⭐ Leadership, 🏛️ Board, 📢 Announcements, 📝 Minutes, 📸 Group Photo, 📜 Terms, 🔧 Account Management
6. To sign out, click **Sign Out** in the top-right of the admin panel
7. To close the admin portal, click the **✕** button or click outside the modal

> **Note:** Only Google accounts listed in the **Admin Emails** (Account Management tab) can access the Management Portal. Authorized users who are not admins will see a "not authorized" message if they try to access the Management Portal.

---

## 3. Managing Authorized Users

The Account Management tab (🔧) includes an **Authorized Users** section where you control who can access the internal portal.

### Add an Authorized User
1. Open the Management Portal and switch to the **🔧 Account Management** tab
2. Scroll down to the **👥 Authorized Users** section
3. Enter the person's Google email address
4. Click **Add**
5. The user can now sign in and access the site immediately

### Remove an Authorized User
1. Find the email in the authorized users list
2. Click **Remove** next to it
3. That user will no longer be able to access the site (they'll see "Access denied" on their next visit)

### Important Notes
- **Admins are automatically authorized** — you do not need to add admin emails to the authorized users list
- Users who are both admin and authorized will show an "also admin" badge in the list
- Removing someone from the authorized users list does *not* remove their admin access (those are managed separately)
- There is no limit to the number of authorized users
- Changes take effect immediately — no page refresh or redeployment needed

---

## 4. Managing Terms & Conditions

The Terms tab (📜) lets you create, edit, and publish Terms & Conditions that all users must accept before accessing the portal.

### How T&C Works
1. When an admin publishes T&C, every user must accept them on their next visit
2. The T&C overlay appears **after** sign-in but **before** the site content is shown
3. Users must **scroll to the bottom** of the full terms text
4. A checkbox appears: **"I have read and agree to the Terms & Conditions"**
5. Only after checking the box can they click **"Accept & Continue"**
6. Declining signs the user out
7. If the admin updates the T&C, **all users must re-accept** the new version

### Publish T&C for the First Time
1. Open the Management Portal and switch to the **📜 Terms** tab
2. Click **Load Default Template** — this populates the editor with a standard 10-section template covering acceptance, authorized access, confidentiality, acceptable use, content/IP, privacy, disclaimers, modifications, termination, and contact
3. Edit the template text as needed using the rich text editor toolbar
4. Click **Save & Publish Terms**
5. All users will be prompted to read and accept on their next visit

### Edit Existing T&C
1. Open the **📜 Terms** tab — the current T&C loads automatically into the editor
2. Make your changes
3. Click **Save & Publish Terms**
4. The "Last updated" timestamp updates, and **all users must re-accept**

### View User Agreements
- Below the editor, the **User Agreements** section shows everyone who has agreed
- Each entry shows: name, email, agreement date, and status (✅ Current or ⚠️ Outdated)
- "Outdated" means the user agreed to a previous version and needs to re-accept

### T&C from the User's Perspective
- A **"Terms & Conditions"** link is available in the site footer for reference at any time
- Clicking it opens a viewer modal showing the current T&C and their agreement date
- If no T&C has been published, users are not prompted to agree

### Important Notes
- T&C are stored in Firestore (`internal_settings/termsAndConditions`)
- User agreements are stored in `internal_tc_agreements` (one document per user)
- The version is tracked by timestamp — any save creates a new version
- If you want to skip T&C entirely, simply don't publish any — users won't be prompted

---

## 5. Managing Comments

The Comments tab (💬) shows all host discussion board posts.

### Reply as Admin
1. Find the comment you want to reply to
2. Click **↩ Reply**
3. Type your reply in the prompt dialog
4. Click **OK** — your reply will appear with an "ADMIN" badge and a distinctive teal background

### Delete a Comment
1. Find the comment to remove
2. Click **🗑 Delete**
3. Confirm the deletion
4. The comment and **all its replies** will be permanently removed

### How the Discussion Board Works
- Users must be **signed in** (they already are after passing the auth gate)
- The comment section shows their signed-in identity automatically
- Comments support threaded replies
- Each comment has reaction buttons (👍 ❤️ 😊 🎿 🏔️) — reactions toggle on/off per user
- All comments update in real-time via Firestore listeners

---

## 6. Managing Leadership

The Leadership tab (⭐) lets you manage the Director and Lead team members.

### Add a New Leader
1. Switch to the **⭐ Leadership** tab
2. Fill in:
   - **Name** — the person's name
   - **Role** — choose "Director" or "Lead" from the dropdown
   - **Photo** — click the upload area or drag & drop a photo (max 5 MB; compressed to 300×300 JPEG)
   - **Bio** — use the rich text editor (bold, italic, lists, links, quotes, inline photos)
3. Click **Save Leader**

### Edit a Leader
1. Click **✏️ Edit** next to the leader — the form populates with existing data
2. Make changes
3. Click **Save Leader**

### Delete a Leader
1. Click **🗑 Delete** → confirm

### Public Display
- Leader cards are **clickable** — users can view a bio modal with photo, name, role, and rich text bio
- **Directors** always sort before **Leads**
- Photos are compressed client-side; a 👤 placeholder shows if no photo is uploaded

---

## 7. Managing Board of Directors

The Board tab (🏛️) manages the Board of Directors organizational chart.

### Add a Board Member
1. Switch to the **🏛️ Board** tab
2. Fill in:
   - **Name** — the person's name
   - **Role** — type any custom role (e.g., "President", "Treasurer", "Secretary") or select from suggestions
   - **Photo** — click the upload area or drag & drop (max 5 MB)
   - **Bio** — use the rich text editor
3. Click **Save Director**

### Edit / Delete
- Same workflow as Leadership: **✏️ Edit** to populate the form, **🗑 Delete** to remove

### Custom Roles
- The role field accepts **any text** — type a custom role or pick from dropdown suggestions
- Common suggestions include: President, Vice President, Treasurer, Secretary, Member at Large

---

## 8. Managing Announcements

The Announcements tab (📢) includes a rich text editor for formatted content.

### Add a New Announcement
1. Switch to the **📢 Announcements** tab
2. Fill in:
   - **Type** — choose from: Announcement, Award, Event, Host Story
   - **Title** — the announcement heading
   - **Content** — use the rich text editor
3. Click **Save Announcement**

### Rich Text Editor Toolbar

| Button | Action |
|---|---|
| **B** | Bold selected text |
| **I** | Italic selected text |
| **U** | Underline selected text |
| **• List** | Insert a bulleted list |
| **1. List** | Insert a numbered list |
| **🔗 Link** | Insert a hyperlink (opens in new tab) |
| **❝ Quote** | Format as blockquote |
| **📷 Photo** | Insert inline photo (max 5 MB; compressed to 800×600) |
| **✘** | Remove all formatting |

### Edit / Delete
- **✏️ Edit** to populate form with existing data, make changes, click **Save Announcement**
- **🗑 Delete** to permanently remove

---

## 9. Managing Meeting Minutes

The Minutes tab (📝) lets you create and manage meeting minutes with rich text content.

### Add Meeting Minutes
1. Switch to the **📝 Minutes** tab
2. Fill in:
   - **Date** — the meeting date (date picker)
   - **Title** — e.g., "Monthly Host Meeting" or a descriptive title
   - **Content** — use the rich text editor for formatted meeting notes
3. Click **Save Minutes**

### Edit / Delete
- **✏️ Edit** to update existing minutes
- **🗑 Delete** to permanently remove

### Public Display
- Minutes appear as expandable cards, sorted newest first
- Users click a card to expand and read the full content
- Click again to collapse

---

## 10. Managing the Group Photo

The Group Photo tab (📸) lets you upload a hero photo for the About section.

### Upload
1. Switch to the **📸 Group Photo** tab
2. Click the upload area or drag & drop (max 10 MB)
3. Verify the preview
4. Optionally enter a caption
5. Click **Save Group Photo**

### Remove
- Click **Remove Photo** to clear and revert to the placeholder

### Notes
- Compressed to 1200×900 JPEG before storage
- Stored as base64 in Firestore (`internal_settings/site` document)

---

## 11. Managing Admin Emails (Account Management)

The Account Management tab (🔧) has an **Admin Accounts** section for managing admin access.

### Add an Admin
1. Switch to the **🔧 Account Management** tab
2. Under **🔧 Admin Accounts**, enter the Google email address
3. Click **Add**

### Remove an Admin
1. Click **Remove** next to the email
2. That user loses Management Portal access but retains site viewing access if they're on the authorized users list

> **Warning:** Don't remove your own email unless another admin is authorized, or you'll lock yourself out of the Management Portal.

---

## 12. Deploying Firestore Rules

The file `firestore.rules` defines read/write permissions. **Deploy via the Firebase Console** whenever rules are updated.

### How to Deploy
1. Open [Firebase Console](https://console.firebase.google.com/project/mtn-hosts/)
2. Navigate to **Firestore Database** → **Rules** tab
3. Replace the existing rules with the contents of `firestore.rules`
4. Click **Publish**

### Internal Portal Rules Summary

| Collection | Authenticated Read | Authenticated Write | Notes |
|---|---|---|---|
| `internal_comments` | ✅ | ✅ (create & update) | Delete requires auth |
| `internal_leaders` | ✅ | ✅ | Full CRUD for signed-in users |
| `internal_directors` | ✅ | ✅ | Full CRUD for signed-in users |
| `internal_announcements` | ✅ | ✅ | Full CRUD for signed-in users |
| `internal_minutes` | ✅ | ✅ | Full CRUD for signed-in users |
| `internal_settings` | Public read* | ✅ | *Public read needed for auth gate |
| `internal_tc_agreements` | ✅ | ✅ | Per-user T&C acceptance records |

> **Important:** `internal_settings` must remain publicly readable so the auth gate can verify user authorization before the full sign-in flow completes.

---

## 13. Firebase Console Quick Reference

**Console URL:** [https://console.firebase.google.com/project/mtn-hosts/](https://console.firebase.google.com/project/mtn-hosts/)

| Task | Console Path |
|---|---|
| View/manage internal data | Firestore Database → Data → `internal_*` collections |
| View authorized users | Firestore Database → Data → `internal_settings` → `authorizedUsers` |
| View admin emails | Firestore Database → Data → `internal_settings` → `adminEmails` |
| View T&C content | Firestore Database → Data → `internal_settings` → `termsAndConditions` |
| View T&C agreements | Firestore Database → Data → `internal_tc_agreements` |
| Update security rules | Firestore Database → Rules |
| Monitor usage | Firestore Database → Usage |
| View sign-in providers | Authentication → Sign-in method |
| View authenticated users | Authentication → Users |

### Firestore Collections (Internal Portal)

| Collection | Purpose |
|---|---|
| `internal_comments` | Discussion board posts and replies |
| `internal_leaders` | Host leadership entries |
| `internal_directors` | Board of Directors entries |
| `internal_announcements` | Announcements and awards |
| `internal_minutes` | Meeting minutes |
| `internal_settings/site` | Group photo and caption |
| `internal_settings/adminEmails` | Admin email whitelist |
| `internal_settings/authorizedUsers` | Authorized user email whitelist |
| `internal_settings/termsAndConditions` | T&C content and version timestamp |
| `internal_tc_agreements` | Per-user T&C acceptance records |

---

## 14. First-Time Admin Bootstrap

When the internal portal is deployed for the first time with no users configured:

1. Open the site — you'll see the sign-in gate
2. Click **Sign in with Google**
3. Since no admin emails or authorized users exist yet, the **first Google sign-in automatically becomes the admin and an authorized user**
4. The gate opens and your email is saved to both lists in Firestore
5. Click **Management Portal** → **🔧 Account Management** tab to:
   - Add additional admin emails under **🔧 Admin Accounts**
   - Add host emails under **👥 Authorized Users**
6. Go to the **📜 Terms** tab, click **Load Default Template**, customize if desired, then **Save & Publish Terms**

---

## 15. Troubleshooting

### "Access denied" at the sign-in gate
- **Cause:** The user's Google email is not on the authorized users or admin emails list
- **Fix:** An admin must add their email via the **🔧 Account Management** tab → **👥 Authorized Users**

### "Not authorized" when opening Management Portal
- **Cause:** The user is an authorized viewer but not an admin
- **Fix:** An admin must add their email via **🔧 Account Management** → **🔧 Admin Accounts**

### User can't see site content after signing in
- **Cause:** Firestore rules may be blocking reads, or Firestore listeners haven't connected
- **Fix:** Ensure `internal_settings` has `allow read: if true` in the rules, then hard-refresh (`Ctrl+Shift+R`)

### "Missing or insufficient permissions" error
- **Cause:** Firestore rules haven't been deployed or are outdated
- **Fix:** Deploy the latest `firestore.rules` via the Firebase Console (see [Section 11](#11-deploying-firestore-rules))

### Removed a user but they can still see the site
- **Cause:** The user may still have an active Firebase auth session cached in their browser
- **Fix:** Their access will be blocked on next page reload or when the Firestore listener updates. The auth gate checks authorization every time the page loads.

### T&C overlay not appearing
- **Cause:** No Terms & Conditions have been published yet
- **Fix:** An admin must go to **📜 Terms** tab, enter content (or load the default template), and click **Save & Publish Terms**

### User sees T&C again after already accepting
- **Cause:** The admin published updated T&C, which resets all agreements
- **Fix:** This is expected behavior — all users must re-accept when terms change

### Photos not uploading
- **Cause:** File exceeds size limit
- **Fix:** Ensure leader/director photos are under 5 MB and group photos under 10 MB

### Weather banner shows an error
- **Cause:** NOAA API may be temporarily unavailable
- **Fix:** Auto-retries every 10 minutes; a webcam fallback link is shown

### Site not updating after a code change
- **Cause:** GitHub Pages caching
- **Fix:** Wait 1–5 minutes after pushing, then hard-refresh (`Ctrl+Shift+R`)

---

## Quick Start Checklist

For a brand-new admin getting started:

- [ ] Open the internal portal and sign in (first sign-in becomes admin)
- [ ] Click **Management Portal** and explore the eight tabs
- [ ] Go to **🔧 Account Management** and add other admin emails under **🔧 Admin Accounts**
- [ ] Add all Mountain Host Google emails under **👥 Authorized Users**
- [ ] Go to **📜 Terms** tab, load the default template, customize, and publish
- [ ] Edit the placeholder leaders with real names, photos, and bios
- [ ] Add Board of Directors members under the **🏛️ Board** tab
- [ ] Upload a group photo
- [ ] Create your first announcement
- [ ] Add meeting minutes
- [ ] Share the site URL with authorized hosts
- [ ] Deploy the updated Firestore rules via the Firebase Console

---

*For technical details about the internal portal architecture, see [README-internal.md](README-internal.md).*
*For the public site documentation, see [README.md](README.md) and [INSTRUCTIONS.md](INSTRUCTIONS.md).*
