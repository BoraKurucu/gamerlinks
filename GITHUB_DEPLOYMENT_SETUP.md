# GitHub Actions Automatic Deployment Setup

## ✅ What's Already Done

- ✅ GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- ✅ Workflow configured to deploy on push to `main` or `master` branch
- ✅ Workflow builds React app and Firebase Functions
- ✅ Workflow deploys to Firebase Hosting and Functions

## 🔧 Setup Required (One-Time)

To enable automatic deployment, you need to add your Firebase authentication token as a GitHub secret.

### Option 1: Automated Setup (Recommended)

Run the setup script:

```bash
./setup-github-deploy.sh
```

This script will:
1. Generate a Firebase CI token (opens browser for authentication)
2. Automatically set it as a GitHub secret (if GitHub CLI is installed and authenticated)
3. Or provide instructions to set it manually

### Option 2: Manual Setup

1. **Generate Firebase CI Token:**
   ```bash
   firebase login:ci
   ```
   This will output a token. Copy it.

2. **Add Token to GitHub:**
   - Go to: https://github.com/BoraKurucu/gamerlinks/settings/secrets/actions
   - Click "New repository secret"
   - Name: `FIREBASE_TOKEN`
   - Value: (paste the token from step 1)
   - Click "Add secret"

## 🚀 How It Works

Once set up, every push to the `main` or `master` branch will:

1. ✅ Checkout the code
2. ✅ Install dependencies
3. ✅ Build the React app (`npm run build`)
4. ✅ Build Firebase Functions (`cd functions && npm run build`)
5. ✅ Deploy to Firebase Hosting and Functions

## 📋 Manual Deployment

You can also trigger deployment manually:

1. Go to: https://github.com/BoraKurucu/gamerlinks/actions
2. Select "Deploy to Firebase" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## 🔍 Monitoring Deployments

- View deployment status: https://github.com/BoraKurucu/gamerlinks/actions
- View deployment logs: Click on any workflow run
- Firebase Console: https://console.firebase.google.com/project/gamerlinks-844c5/hosting

## ⚠️ Troubleshooting

### Deployment fails with "FIREBASE_TOKEN not found"
- Make sure you've added the `FIREBASE_TOKEN` secret in GitHub
- Verify the token is correct by running `firebase login:ci` again

### Build fails
- Check the Actions logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Functions deployment fails
- Check that `functions/package.json` has all required dependencies
- Verify TypeScript compilation succeeds locally: `cd functions && npm run build`

## 📝 Notes

- The workflow uses Node.js 18
- Firebase project ID: `gamerlinks-844c5`
- Hosting target: `gamerlinks`
- Build output directory: `build`

















