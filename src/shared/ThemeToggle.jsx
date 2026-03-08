import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark((d) => !d)}
      className="fixed bottom-4 right-4 rounded-full border border-white/10 bg-bg-darker px-4 py-2 text-sm text-white/80 hover:border-neon-blue/60"
    >
      {dark ? 'Dark' : 'Light'}
    </button>
  );
}
