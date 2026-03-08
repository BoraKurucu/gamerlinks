# Favorite Games Display - Setup Guide

## ✅ Fixed Issues

1. ✅ Added FAVORITE_GAMES to default section order in `ProfileSectionRenderer.jsx`
2. ✅ Component is integrated into ViewProfileSections
3. ✅ Editor is available in Settings page

## 🎮 How to See Favorite Games

The Favorite Games section will **only display** if you have at least one game added. Here's how to add games:

### Step 1: Add Favorite Games

1. Go to **Settings** page (`/settings` or click Settings in your profile)
2. Scroll down to find the **"Favorite Games"** section
3. Click **"Add Game"** button
4. Fill in:
   - **Game Title** (required) - e.g., "Valorant", "CS2", "Apex Legends"
   - **Cover Image URL** (optional) - Get from:
     - Steam game pages
     - Google Images (search "[game name] cover art")
     - Game store websites
   - **Note** (optional) - e.g., "Main game", "Streaming daily"
5. Click **"Save changes"** at the bottom

### Step 2: Check Layout Settings

1. In Settings, find **"Profile Layout"** section
2. Click **"Customize Layout"**
3. Make sure **"Favorite Games"** is:
   - ✅ In the section order list
   - ✅ Visible (eye icon should show it's visible)
4. If hidden, click the eye icon to make it visible
5. You can drag it to reorder where it appears on your profile

### Step 3: View Your Profile

1. Go to your profile page (`/profile/YOUR_USERNAME`)
2. The Favorite Games section should appear after your Bio
3. You'll see your games with cover art or game icons

## 🎨 Visual Features

- **Game Icons**: 40+ popular games have custom icons (Valorant, CS2, League, etc.)
- **Cover Art**: If you add a cover image URL, it will display the game cover
- **Fallback**: Games without cover art show a beautiful icon with game-specific colors
- **Horizontal Scroll**: Games scroll horizontally on mobile
- **Responsive**: Looks great on all screen sizes

## 🔍 Troubleshooting

### Section Not Showing?

1. **Do you have games added?**
   - Check Settings → Favorite Games
   - The section only shows if you have at least 1 game

2. **Is the section visible in layout?**
   - Settings → Profile Layout → Customize Layout
   - Make sure "Favorite Games" is visible (not hidden)

3. **Is it in your section order?**
   - If you customized layout, make sure "Favorite Games" is in the list
   - If missing, reset to default order

4. **Browser cache?**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache

### Games Not Saving?

1. Make sure you clicked **"Save changes"** at the bottom of Settings
2. Check browser console for errors (F12)
3. Make sure game title is filled (required field)

### Cover Images Not Loading?

1. Make sure the URL is publicly accessible (not behind login)
2. Try the image URL directly in a browser
3. Use HTTPS URLs when possible
4. Common sources:
   - Steam: Right-click game cover → Copy image address
   - Google Images: Search "[game] cover art" → Copy image address
   - Game stores: Official game pages

## 📝 Example Games to Add

Try adding these popular games:

1. **Valorant**
   - Title: "Valorant"
   - Note: "Main FPS game"

2. **Counter-Strike 2**
   - Title: "CS2"
   - Note: "Competitive gaming"

3. **Apex Legends**
   - Title: "Apex Legends"
   - Note: "Battle Royale main"

4. **League of Legends**
   - Title: "League of Legends"
   - Note: "Ranked climbing"

## 🎯 Supported Games (Auto-Icon Detection)

These games automatically get custom icons:
- Valorant, CS2, CS:GO
- Apex Legends, Overwatch
- League of Legends, Dota 2
- Fortnite, PUBG, Warzone
- World of Warcraft, Final Fantasy XIV
- And 30+ more!

Even if a game isn't in the list, it will show a generic gaming icon.

---

**Still not working?** Check the browser console (F12) for any JavaScript errors and share them!























