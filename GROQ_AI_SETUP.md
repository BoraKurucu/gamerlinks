# Groq AI Assistant Setup Guide

This guide will help you set up the Groq AI assistant for GamerLinks.

## Step 1: Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for a free account (no credit card required)
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your API key (it starts with `gsk_...`)

**Free Tier Limits:**
- 1 million tokens per day
- Very fast responses (~100+ tokens/second)
- No credit card required

## Step 2: Set the API Key as a Firebase Secret

Firebase Functions use secrets to securely store API keys. Run this command in your terminal:

```bash
cd functions
firebase functions:secrets:set GROQ_API_KEY
```

When prompted, paste your Groq API key.

**Alternative method (if the above doesn't work):**
```bash
echo "YOUR_GROQ_API_KEY_HERE" | firebase functions:secrets:set GROQ_API_KEY
```

Replace `YOUR_GROQ_API_KEY_HERE` with your actual API key.

## Step 3: Build and Deploy

1. **Build the functions:**
   ```bash
   cd functions
   npm run build
   ```

2. **Deploy the AI assistant function:**
   ```bash
   firebase deploy --only functions:aiAssistant
   ```

   Or deploy all functions:
   ```bash
   firebase deploy --only functions
   ```

## Step 4: Test Locally (Optional)

To test the function locally before deploying:

1. **Set the secret in your local environment:**
   ```bash
   # In functions directory
   export GROQ_API_KEY="your-api-key-here"
   ```

2. **Start the emulator:**
   ```bash
   npm run serve
   ```

3. **Test the function** using the Firebase emulator UI or by calling it from your app.

## Step 5: Use in Your Frontend

The function is now available as a callable Firebase Function. Here's how to use it in your React app:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

// In your component
const functions = getFunctions();
const aiAssistant = httpsCallable(functions, 'aiAssistant');

// Call the function
const askQuestion = async (question) => {
  try {
    const result = await aiAssistant({ question });
    console.log('AI Response:', result.data.response);
    return result.data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Example usage
await askQuestion("How can I get more views on my profile?");
```

## Troubleshooting

### Error: "Secret not found"
- Make sure you've set the secret: `firebase functions:secrets:set GROQ_API_KEY`
- Verify the secret name matches exactly: `GROQ_API_KEY`

### Error: "Unauthorized"
- The function requires authentication. Make sure the user is signed in.
- Check that `request.auth` is not null.

### Error: "Groq API error"
- Check your API key is valid
- Verify you haven't exceeded the free tier limit (1M tokens/day)
- Check Groq's status page: https://status.groq.com/

### Function not deploying
- Make sure you're in the `functions` directory
- Run `npm install` to ensure dependencies are installed
- Check that TypeScript compiles: `npm run build`

## Cost Information

**Groq Free Tier:**
- 1 million tokens per day
- No credit card required
- Resets daily

**After Free Tier:**
- $0.05 per million input tokens
- $0.08 per million output tokens
- Very affordable even for high usage

## Example Questions Users Can Ask

- "How can I get more views?"
- "What's my best performing link?"
- "How do I improve my click-through rate?"
- "What time should I post content?"
- "How can I optimize my profile?"
- "What links should I add to increase engagement?"

The AI will provide personalized advice based on the user's actual profile and analytics data!

## Next Steps

1. Create a UI component for the AI assistant (chat interface)
2. Add it to your Dashboard or Analytics page
3. Consider adding conversation history
4. Add loading states and error handling

## Support

If you encounter issues:
1. Check Firebase Functions logs: `firebase functions:log`
2. Check Groq API status
3. Verify your API key is correct
4. Ensure you're within free tier limits

