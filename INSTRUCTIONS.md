# Mountain Hosts Site — Admin Instructions

A step-by-step guide for managing the Bogus Basin Mountain Hosts website through the admin portal.

---

## Table of Contents

1. [Accessing the Admin Portal](#1-accessing-the-admin-portal)
2. [Managing Comments](#2-managing-comments)
3. [Managing Leadership](#3-managing-leadership)
4. [Managing Announcements](#4-managing-announcements)
5. [Managing the Group Photo](#5-managing-the-group-photo)
6. [Managing Admin Emails (Settings)](#6-managing-admin-emails-settings)
7. [Deploying Firestore Rules](#7-deploying-firestore-rules)
8. [Firebase Console Quick Reference](#8-firebase-console-quick-reference)
9. [First-Time Admin Bootstrap](#9-first-time-admin-bootstrap)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Accessing the Admin Portal

1. Open the site: [https://mountainstogo.github.io/bbhosts/mountain-hosts.html](https://mountainstogo.github.io/bbhosts/mountain-hosts.html)
2. Click the **"Management Portal"** button in the page header
3. Click **Sign in with Google** and sign in with a Google account that is on the authorized admin list
4. After successful login, you'll see five tabs: 💬 Comments, ⭐ Leadership, 📢 Announcements, 📸 Group Photo, 🔧 Settings
5. To sign out, click **Sign Out** in the top-right of the admin panel
6. To close the admin portal, click the **✕** button or click outside the modal

> **Note:** Only Google accounts listed in the admin emails (Settings tab) can access the Management Portal. If your email is not authorized, you'll see a "not authorized" message.

---

## 2. Managing Comments

The Comments tab shows all guest comments with a truncated preview.

### Reply as Admin
1. Find the comment you want to reply to
2. Click **↩ Reply**
3. Type your reply in the prompt dialog
4. Click **OK** — your reply will appear with an "ADMIN" badge and a distinctive blue/teal background

### Delete a Comment
1. Find the comment to remove
2. Click **🗑 Delete**
3. Confirm the deletion
4. The comment and **all its replies** will be permanently removed

### How Guest Comments Work (Public Side)
- Visitors must **sign in with Google** to post comments (click the Google sign-in button in the comment section)
- Signed-in users enter a message in the comment form
- They can insert emoji from the emoji bar
- Comments appear immediately (auto-approved) with community guidelines displayed
- Comments support threaded replies (signed-in users can reply)
- Each comment has reaction buttons (👍 ❤️ 😊 🎿 🏔️) — users must be signed in to react
- Reactions toggle: click once to add, click again to remove (each user can only react once per emoji)
- Reacted emojis appear highlighted for the current user
- All comments update in real-time across all users via Firestore listeners

---

## 3. Managing Leadership

The Leadership tab lets you manage the Director and Lead team members.

### Add a New Leader
1. Switch to the **⭐ Leadership** tab
2. Fill in the form at the top:
   - **Name** — the person's name
   - **Role** — choose "Director" or "Lead" from the dropdown
   - **Photo** — click the upload area or drag & drop a photo (max 5 MB; will be compressed to 300×300 JPEG)
   - **Bio** — use the rich text editor to write a bio (supports bold, italic, lists, links, quotes, and inline photos)
3. Click **Save Leader**
4. The new leader card appears immediately on the public page

### Edit a Leader
1. Find the leader in the list below the form
2. Click **✏️ Edit** — the form populates with existing data (including the bio)
3. Make changes (name, role, photo, or bio)
4. Click **Save Leader** to update

### Delete a Leader
1. Click **🗑 Delete** next to the leader
2. Confirm the deletion

### Bio Display (Public Side)
- On the public page, leader cards are **clickable** — visitors can tap or click any card to see a bio modal
- A "Tap for bio" hint appears on hover
- The bio modal shows the person's photo, name, role, and their rich text bio
- Close by clicking **✕** or clicking outside the modal

### Notes
- **Directors** always sort before **Leads** on the public page
- Photos are compressed client-side and stored as base64 in Firestore (no external storage needed)
- If no photo is uploaded, a person emoji (👤) placeholder is shown
- The initial 5 placeholder leaders ("Director Name", "Lead 1 Name", etc.) are seed data — edit or delete them once you have real entries

---

## 4. Managing Announcements

The Announcements tab includes a rich text editor for creating formatted content.

### Add a New Announcement
1. Switch to the **📢 Announcements** tab
2. Fill in:
   - **Type** — choose from: Announcement, Award, Event, Host Story
   - **Title** — the announcement heading
   - **Content** — use the rich text editor (see toolbar reference below)
3. Click **Save Announcement**

### Rich Text Editor Toolbar

| Button | Action |
|---|---|
| **B** | Bold selected text |
| **I** | Italic selected text |
| **U** | Underline selected text |
| **• List** | Insert a bulleted list |
| **1. List** | Insert a numbered list |
| **🔗 Link** | Insert a hyperlink (prompts for URL; opens in new tab) |
| **❝ Quote** | Format selected text as a blockquote |
| **📷 Photo** | Insert an inline photo (max 5 MB; compressed to 800×600 JPEG) |
| **✘** | Remove all formatting from selected text |

### Tips for the Editor
- **Select text first** before applying bold, italic, underline, link, or quote formatting
- **Photos** are embedded directly in the content as base64 images, so they show inline
- **Links** automatically open in a new browser tab
- The editor preserves formatting when editing existing announcements

### Edit an Announcement
1. Find the announcement in the list below the editor
2. Click **✏️ Edit** — the form and editor populate with existing data
3. Make changes
4. Click **Save Announcement**

### Delete an Announcement
1. Click **🗑 Delete** next to the announcement
2. Confirm the deletion

### Type Icons
Each announcement type displays with a distinct emoji:
- 📢 Announcement
- 🏆 Award
- 📅 Event
- 📖 Host Story

---

## 5. Managing the Group Photo

The Group Photo tab lets you upload a hero photo displayed in the About section.

### Upload a Group Photo
1. Switch to the **📸 Group Photo** tab
2. Click the upload area or **drag & drop** a photo file (max 10 MB)
3. A preview appears — verify it looks correct
4. Optionally enter a **caption** (e.g., "2025 Mountain Hosts Team")
5. Click **Save Group Photo**
6. The photo appears immediately in the About section on the public page

### Remove the Group Photo
1. Click **Remove Photo** to clear the current photo
2. The About section will revert to the placeholder (mountain emoji)

### Notes
- Photos are compressed to 1200×900 JPEG before storage
- The compressed image is stored as base64 in Firestore (the `settings/site` document)
- Maximum upload size is 10 MB; after compression, photos are typically 100–300 KB

---

## 6. Managing Admin Emails (Settings)

The Settings tab lets you manage which Google accounts have admin access.

### Add an Admin
1. Switch to the **🔧 Settings** tab
2. Enter the Google email address to authorize
3. Click **Add**
4. The email appears in the authorized list

### Remove an Admin
1. Find the email in the list
2. Click **Remove** next to it
3. That user will no longer be able to access the Management Portal

> **Warning:** Don't remove your own email unless another admin is authorized, or you'll lock yourself out.

---

## 7. Deploying Firestore Rules

The file `firestore.rules` in the project repository defines who can read and write data. **These rules must be deployed through the Firebase Console** whenever they are updated.

### How to Deploy Rules
1. Open [Firebase Console](https://console.firebase.google.com/project/mtn-hosts/)
2. Navigate to **Firestore Database** in the left sidebar
3. Click the **Rules** tab
4. Delete the existing rules content
5. Copy and paste the entire contents of the `firestore.rules` file from the repository
6. Click **Publish**

### Current Rules Summary
| Collection | Public Read | Authenticated Write | Notes |
|---|---|---|---|
| `comments` | ✅ | ✅ (create & update) | Delete requires auth |
| `leaders` | ✅ | ✅ | Full CRUD for signed-in users |
| `announcements` | ✅ | ✅ | Full CRUD for signed-in users |
| `settings` | ✅ | ✅ (create/update/delete) | Stores admin emails and site config |

> **Important:** If you add a new collection to the app, you must add corresponding rules and redeploy.

---

## 8. Firebase Console Quick Reference

**Console URL:** [https://console.firebase.google.com/project/mtn-hosts/](https://console.firebase.google.com/project/mtn-hosts/)

| Task | Console Path |
|---|---|
| View/manage data | Firestore Database → Data |
| Update security rules | Firestore Database → Rules |
| Monitor usage | Firestore Database → Usage |
| View sign-in providers | Authentication → Sign-in method |
| View authenticated users | Authentication → Users |
| View project settings | Project Settings (gear icon) |
| Check quotas/billing | Usage and billing |

### Firestore Free Tier Limits (Spark Plan)
- **1 GiB** total storage
- **50,000** reads/day
- **20,000** writes/day
- **20,000** deletes/day

Base64 images stored in Firestore count toward the 1 GiB storage limit. Monitor usage if the site has heavy photo uploads.

---

## 9. First-Time Admin Bootstrap

When the site is deployed for the first time with no admin emails configured:

1. Open the site and click **Management Portal**
2. Click **Sign in with Google**
3. Since no `adminEmails` document exists in Firestore yet, the **first Google sign-in automatically becomes the admin**
4. Your email is saved to Firestore as the initial authorized admin
5. Navigate to the **🔧 Settings** tab to add additional admin emails

### Alternative: Console Seeding
You can also seed the admin list from the browser console:
```javascript
seedAdminEmails()
```
This will prompt for an email and create the `settings/adminEmails` document.

---

## 10. Troubleshooting

### "Not authorized" when signing into Management Portal
- **Cause:** Your Google email is not in the admin emails list in Firestore
- **Fix:** Ask an existing admin to add your email via the Settings tab, or if no admins exist, perform the [first-time bootstrap](#9-first-time-admin-bootstrap)

### "Missing or insufficient permissions" Error
- **Cause:** Firestore security rules haven't been deployed or are outdated
- **Fix:** Follow the steps in [Section 6](#6-deploying-firestore-rules) to deploy the latest rules

### Admin panel is blank after signing in
- **Cause:** Firestore collections may be empty or rules are blocking reads
- **Fix:** Check that Firestore rules allow public reads, then refresh the page

### Photos not uploading
- **Cause:** File may exceed the size limit
- **Fix:** Ensure leader photos are under 5 MB and group photos under 10 MB
- **Cause:** Browser may not support the File API (very old browsers)
- **Fix:** Use a modern browser (Chrome, Firefox, Edge, Safari)

### Weather banner shows an error
- **Cause:** NOAA API may be temporarily unavailable
- **Fix:** The banner will automatically retry every 10 minutes; a fallback link to the Bogus Basin webcams page is shown

### Comments not appearing in real-time
- **Cause:** Firestore listeners may have disconnected
- **Fix:** Refresh the page to re-establish the connection

### Site not updating after a code change
- **Cause:** GitHub Pages caching
- **Fix:** After pushing changes to the repository, allow 1–5 minutes for GitHub Pages to redeploy. Hard-refresh the browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)

### Firestore usage approaching limits
- **Cause:** High traffic or many stored images
- **Fix:** Consider upgrading to the Firebase Blaze (pay-as-you-go) plan, or reduce the number of inline photos in announcements

---

## Quick Start Checklist

For a brand-new admin getting started:

- [ ] Open the site and click **Management Portal**
- [ ] Sign in with your authorized Google account
- [ ] Explore the five tabs: Comments, Leadership, Announcements, Group Photo, Settings
- [ ] Edit the placeholder leaders with real names, photos, and bios
- [ ] Upload a group photo
- [ ] Create your first announcement
- [ ] Add any additional admin emails in the Settings tab
- [ ] Check the public page to verify your changes appear

---

*For technical details about the project architecture, see [README.md](README.md).*
