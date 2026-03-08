import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getProfileByOwnerUid } from './profileService';

const ThemeContext = createContext();

// Default theme colors for backward compatibility
const defaultThemes = {
  blue: '#00E5FF',
  purple: '#BC13FE',
  green: '#39FF14',
};

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Apply theme color to CSS variables
function applyThemeColor(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return;
  
  // Set primary and secondary colors (secondary is slightly lighter/more saturated)
  const { r, g, b } = rgb;
  const secondary = {
    r: Math.min(255, Math.round(r * 1.1)),
    g: Math.min(255, Math.round(g * 1.1)),
    b: Math.min(255, Math.round(b * 1.1))
  };
  
  document.documentElement.style.setProperty('--neon-primary', color);
  document.documentElement.style.setProperty('--neon-secondary', `rgb(${secondary.r}, ${secondary.g}, ${secondary.b})`);
  
  // Update background gradients with theme color - more prominent effects
  document.documentElement.style.setProperty('--bg-gradient-1', 
    `radial-gradient(1200px 600px at 50% -10%, rgba(${r}, ${g}, ${b}, 0.35), transparent)`);
  document.documentElement.style.setProperty('--bg-gradient-2', 
    `radial-gradient(900px 500px at 120% 20%, rgba(${r}, ${g}, ${b}, 0.25), transparent)`);
  document.documentElement.style.setProperty('--bg-gradient-3', 
    `radial-gradient(700px 420px at -10% 60%, rgba(${r}, ${g}, ${b}, 0.20), transparent)`);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('#00E5FF'); // Store as hex color
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const p = await getProfileByOwnerUid(u.uid);
          if (p?.theme) {
            // Support both old preset names and new hex colors
            const themeColor = defaultThemes[p.theme] || (p.theme.startsWith('#') ? p.theme : defaultThemes.blue);
            setTheme(themeColor);
            applyThemeColor(themeColor);
          } else {
            // Default to blue if no theme
            setTheme(defaultThemes.blue);
            applyThemeColor(defaultThemes.blue);
          }
        } catch (e) {
          console.error(e);
          // Default on error
          setTheme(defaultThemes.blue);
          applyThemeColor(defaultThemes.blue);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    applyThemeColor(theme);
  }, [theme]);

  async function changeTheme(newThemeColor) {
    if (!user) return;
    setTheme(newThemeColor);
    applyThemeColor(newThemeColor);
    try {
      const p = await getProfileByOwnerUid(user.uid);
      if (p?.username) {
        await setDoc(doc(db, 'profiles', p.username), { theme: newThemeColor }, { merge: true });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

