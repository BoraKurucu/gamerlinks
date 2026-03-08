# Website Icon Sizes Guide

## Standard Favicon Sizes

### **Favicon (Browser Tab Icon)**
- **16x16** - Classic favicon size (very small, not recommended for complex logos)
- **32x32** - Standard modern favicon (recommended minimum)
- **48x48** - High DPI displays
- **64x64** - Very high DPI displays

### **Current Setup:**
- `favicon.ico` - **32x32** pixels (primary favicon)
- `favicon-32x32.png` - **32x32** pixels (PNG version)

---

## App/Manifest Icons (PWA/Mobile)

### **Required Sizes:**
- **192x192** - Android home screen icon
- **512x512** - Splash screen, high-res displays, PWA icon

### **Current Setup:**
- `logo192.png` - **192x192** pixels
- `logo512.png` - **512x512** pixels

---

## Recommended Image Sizes for Your Logo

### **Best Practice:**
1. **Create your logo at 1024x1024 or higher** (source file)
2. Make sure it has:
   - **Transparent background** (so it works on any background)
   - **Square aspect ratio** (1:1)
   - **High resolution** for sharp scaling

### **What I'll Generate:**
From your source image, I'll create:
- `favicon.ico` → **32x32** (with small white border for visibility)
- `favicon-32x32.png` → **32x32** (PNG version)
- `logo192.png` → **192x192** (for PWA)
- `logo512.png` → **512x512** (for PWA, social sharing)

---

## Notes:
- The **favicon (32x32)** is what shows in browser tabs
- Your logo can be any size/shape - I'll fit it properly into these sizes
- **Transparent backgrounds** work best - I'll add white background only for favicon visibility
- Modern browsers support PNG favicons (not just .ico)

---

## Your Current Logo:
- **Source:** `src/logo.png` (944x491 - not square)
- **Issue:** The aspect ratio is not 1:1, which can cause cropping

### **Solution:**
If you want the full logo visible without cropping, provide a **square version** (e.g., 1024x1024) or I can adjust the sizing to fit better.

