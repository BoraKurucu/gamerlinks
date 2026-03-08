import PlatformIcons from './PlatformIcons';
import { trackLinkClick } from './analyticsService';

export default function LinkCard({ link, profileUsername }) {
  const { title, url, platform } = link;
  
  const handleClick = async (e) => {
    if (profileUsername) {
      // Track the click (don't await to avoid blocking navigation)
      trackLinkClick(profileUsername, url, title).catch(err => {
        console.error('Failed to track link click:', err);
      });
    }
    // Allow navigation to proceed normally
  };
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className="group card-hover glass flex items-center justify-between rounded-lg px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <PlatformIcons platform={platform} />
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-white/60 truncate max-w-[220px]">{url}</div>
        </div>
      </div>
      <span className="text-neon-blue opacity-0 group-hover:opacity-100 transition translate-x-0 group-hover:translate-x-0.5">→</span>
    </a>
  );
}
