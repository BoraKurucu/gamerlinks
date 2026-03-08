# GamerLinks

🎮 A gaming-themed LinkTree-style profile builder with neon dark vibes. Create your gamer profile and share your gaming identity across platforms.

## ✨ Features

- **Gamer Profiles**: Create custom profiles with gaming-themed links
- **Neon Dark Theme**: Eye-catching cyberpunk aesthetic with customizable themes
- **Platform Integration**: Support for Twitch, YouTube, Discord, Steam, and more
- **Real-time Profiles**: Powered by Firebase for instant updates
- **Mobile Responsive**: Works perfectly on all devices
- **Badge System**: Showcase your gaming achievements and ranks

## 🚀 Live Demo

**🎮 GamerLinks is now LIVE!** 

🔗 **Live App**: [https://gamerlinks-app.web.app](https://gamerlinks-app.web.app)

📊 **Firebase Project**: `gamerlinks-app` - Fully deployed and operational
🔥 **Authentication**: ✅ Email/Password + ✅ Google sign-in enabled
📱 **Mobile Ready**: Responsive design for all devices
🔐 **OAuth Configured**: Google OAuth consent screen complete

### ✅ **Features Working**
- ✅ Profile creation and customization
- ✅ Firebase authentication (Email + Google)
- ✅ Real-time profile updates
- ✅ Gaming platform integration
- ✅ Neon dark theme
- ✅ Mobile responsive design
- ✅ Google OAuth sign-in fully functional

## 🛠️ Tech Stack

- **Frontend**: React 18 with Create React App
- **Styling**: Tailwind CSS with custom neon theme
- **Routing**: React Router v6
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Icons**: Platform-specific gaming icons
- **Build Tools**: Modern web development toolchain

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Google account (for Firebase setup)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/BoraKurucu/gamerlinks.git
cd gamerlinks
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Enable Firestore Database
4. Get your config from Project Settings > General > Your apps
5. Create a `.env.local` file in the root directory:

**Note**: The project is already configured with Firebase project `gamerlinks-app`. You can use this project or create your own.

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 4. Run the Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎮 Usage

### Creating a Profile

1. Visit the landing page
2. Enter your desired username
3. Click "Create Profile"
4. Customize your profile with:
   - Gaming links (Twitch, YouTube, Discord, etc.)
   - Bio and avatar
   - Gaming badges and achievements
   - Social media links

### Sample Profiles

Try these example profiles:
- `/shadowwolf` - FPS enthusiast profile
- `/cyberkat` - RPG gamer profile

## 📁 Project Structure

```
gamerlinks/
├── public/                 # Static assets
├── src/
│   ├── pages/              # Main application pages
│   │   ├── Landing.jsx     # Landing page with CTA
│   │   ├── Profile.jsx     # Dynamic profile view
│   │   └── ...             # Other pages
│   ├── shared/             # Reusable components
│   │   ├── LinkCard.jsx    # Individual link component
│   │   ├── PlatformIcons.jsx # Gaming platform icons
│   │   ├── GamerBadge.jsx  # Achievement badges
│   │   └── ...             # Other shared components
│   ├── firebase.js         # Firebase configuration
│   └── App.js              # Main app component
├── functions/              # Firebase Cloud Functions
├── android/                # Android app (Capacitor)
└── firebase.json           # Firebase configuration
```

## 🎨 Customization

### Theme Customization

The neon theme is configured in `tailwind.config.js`. You can modify colors and styles:

```javascript
theme: {
  extend: {
    colors: {
      neon: {
        pink: '#ff006e',
        blue: '#00f5ff',
        purple: '#8338ec',
        // Add your custom colors
      }
    }
  }
}
```

### Adding New Platforms

1. Add platform icon to `PlatformIcons.jsx`
2. Update link validation in `LinkCard.jsx`
3. Add platform-specific styling if needed

## 🔧 Configuration

### Environment Variables

Copy `ENV_EXAMPLE.txt` to `.env.local` and fill in your Firebase credentials:

```bash
cp ENV_EXAMPLE.txt .env.local
```

### Firebase Setup

1. **Authentication**: Enable Email/Password and Google providers
2. **Firestore**: Create the necessary collections and indexes
3. **Storage**: Configure for profile images and assets
4. **Hosting**: Set up for production deployment

## 📱 Mobile App

The project includes Capacitor configuration for mobile app deployment:

```bash
# Build for mobile
npm run build
npx cap sync
```

## 🚀 Deployment

### ✅ **Production Deployment**

**Current Status**: 🟢 **LIVE AND OPERATIONAL**

- **🌐 Live URL**: https://gamerlinks-app.web.app
- **🔥 Firebase Console**: https://console.firebase.google.com/project/gamerlinks-app/overview
- **📱 Project ID**: `gamerlinks-app`
- **🚀 Status**: Fully deployed with authentication enabled

### 🛠️ **Deploy Commands**

For developers who want to deploy their own version:

```bash
# Switch to the project
firebase use gamerlinks-app

# Build and deploy
npm run build
firebase deploy --only hosting
```

### 📋 **Deployment Checklist**
- [x] Firebase project created and configured
- [x] Web app registered with API keys
- [x] Authentication enabled (Email/Password + Google)
- [x] Google OAuth consent screen configured
- [x] Hosting configured and deployed
- [x] Environment variables set
- [x] Production build optimized
- [x] All authentication methods working

### 🔧 **Custom Domain Setup**

To use a custom domain:
1. Add your domain in Firebase Hosting settings
2. Update DNS records as instructed by Firebase
3. Deploy with custom domain enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/BoraKurucu/gamerlinks/issues) page
2. Create a new issue with detailed information
3. Join our Discord community (link in app)

## 🎯 Roadmap

- [ ] Profile editor with drag-and-drop
- [ ] Advanced analytics dashboard
- [ ] Custom domains for profiles
- [ ] QR code generation for profiles
- [ ] Gaming stats integration
- [ ] Clan/team profiles
- [ ] Streaming overlays
- [ ] NFT badge integration

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=BoraKurucu/gamerlinks&type=Date)](https://star-history.com/#BoraKurucu/gamerlinks&Date)

---

Made with ❤️ by gamers, for gamers. [Support the project](https://github.com/sponsors/BoraKurucu)
