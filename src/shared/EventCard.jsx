import { PLATFORMS } from './platforms';

const CONTENT_TYPE_ICONS = {
  stream: '🔴',
  video: '▶️',
  tournament: '🏆',
  other: '📌',
};

// Platform-specific gradient backgrounds for visual appeal (inactive state)
const PLATFORM_GRADIENTS = {
  twitch: 'from-purple-600/20 via-purple-500/15 to-pink-600/20',
  youtube: 'from-red-600/20 via-red-500/15 to-red-700/20',
  kick: 'from-green-600/20 via-emerald-500/15 to-teal-600/20',
  discord: 'from-indigo-600/20 via-indigo-500/15 to-blue-600/20',
  instagram: 'from-pink-600/20 via-purple-500/15 to-orange-600/20',
  tiktok: 'from-gray-900/30 via-pink-600/15 to-cyan-600/20',
  x: 'from-gray-800/30 via-gray-700/15 to-gray-900/30',
  steam: 'from-blue-600/20 via-cyan-500/15 to-blue-700/20',
  default: 'from-blue-600/20 via-cyan-500/15 to-indigo-600/20',
};

// Platform-specific colors for active state
const PLATFORM_ACTIVE_STYLES = {
  twitch: { border: 'border-purple-500/50', bg: 'bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-pink-600/20', shadow: 'shadow-lg shadow-purple-500/20', icon: 'bg-purple-500/30 border-2 border-purple-400/50' },
  youtube: { border: 'border-red-500/50', bg: 'bg-gradient-to-br from-red-600/20 via-red-500/10 to-red-700/20', shadow: 'shadow-lg shadow-red-500/20', icon: 'bg-red-500/30 border-2 border-red-400/50' },
  kick: { border: 'border-green-500/50', bg: 'bg-gradient-to-br from-green-600/20 via-green-500/10 to-emerald-600/20', shadow: 'shadow-lg shadow-green-500/20', icon: 'bg-green-500/30 border-2 border-green-400/50' },
  discord: { border: 'border-indigo-500/50', bg: 'bg-gradient-to-br from-indigo-600/20 via-indigo-500/10 to-blue-600/20', shadow: 'shadow-lg shadow-indigo-500/20', icon: 'bg-indigo-500/30 border-2 border-indigo-400/50' },
  instagram: { border: 'border-pink-500/50', bg: 'bg-gradient-to-br from-pink-600/20 via-purple-500/10 to-orange-600/20', shadow: 'shadow-lg shadow-pink-500/20', icon: 'bg-pink-500/30 border-2 border-pink-400/50' },
  tiktok: { border: 'border-cyan-500/50', bg: 'bg-gradient-to-br from-gray-900/30 via-pink-600/15 to-cyan-600/20', shadow: 'shadow-lg shadow-cyan-500/20', icon: 'bg-cyan-500/30 border-2 border-cyan-400/50' },
  x: { border: 'border-gray-400/50', bg: 'bg-gradient-to-br from-gray-800/30 via-gray-700/15 to-gray-900/30', shadow: 'shadow-lg shadow-gray-500/20', icon: 'bg-gray-500/30 border-2 border-gray-400/50' },
  steam: { border: 'border-blue-500/50', bg: 'bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-blue-700/20', shadow: 'shadow-lg shadow-blue-500/20', icon: 'bg-blue-500/30 border-2 border-blue-400/50' },
  facebook: { border: 'border-blue-600/50', bg: 'bg-gradient-to-br from-blue-700/20 via-blue-600/10 to-blue-800/20', shadow: 'shadow-lg shadow-blue-600/20', icon: 'bg-blue-600/30 border-2 border-blue-500/50' },
  reddit: { border: 'border-orange-500/50', bg: 'bg-gradient-to-br from-orange-600/20 via-red-500/10 to-orange-700/20', shadow: 'shadow-lg shadow-orange-500/20', icon: 'bg-orange-500/30 border-2 border-orange-400/50' },
  spotify: { border: 'border-green-500/50', bg: 'bg-gradient-to-br from-green-600/20 via-green-500/10 to-emerald-600/20', shadow: 'shadow-lg shadow-green-500/20', icon: 'bg-green-500/30 border-2 border-green-400/50' },
  default: { border: 'border-blue-500/50', bg: 'bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-indigo-600/20', shadow: 'shadow-lg shadow-blue-500/20', icon: 'bg-blue-500/30 border-2 border-blue-400/50' },
};

export default function EventCard({ event, isActive = false, onClick }) {
  const { contentType, platform, title, scheduleStart, scheduleEnd, link, image, thumbnail } = event;
  const platformMeta = PLATFORMS[platform];
  const Icon = platformMeta?.icon;
  const gradient = PLATFORM_GRADIENTS[platform] || PLATFORM_GRADIENTS.default;
  
  // Determine badge label based on content type, and badge color based on platform
  const getActiveBadge = () => {
    if (!isActive) return null;
    
    // Get platform color from active styles
    const activeStyle = PLATFORM_ACTIVE_STYLES[platform] || PLATFORM_ACTIVE_STYLES.default;
    const colorMatch = activeStyle.border.match(/border-(\w+)-500/);
    const platformColor = colorMatch ? colorMatch[1] : 'blue';
    
    if (contentType === 'stream') return { label: 'LIVE', color: platformColor };
    if (contentType === 'video') return { label: 'NEW', color: platformColor };
    if (contentType === 'tournament') return { label: 'ONGOING', color: platformColor };
    return { label: 'ACTIVE', color: platformColor };
  };
  
  const activeBadge = getActiveBadge();
  const isStreamLive = isActive && contentType === 'stream';

  function formatSchedule(start, end, timezone) {
    if (!start) return '';
    
    // Get timezone from event or use user's timezone as fallback
    const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    
    // Format dates in the specified timezone
    const formatOptions = {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    // Get timezone abbreviation
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    });
    
    const tzParts = tzFormatter.formatToParts(startDate);
    const tzAbbr = tzParts.find(p => p.type === 'timeZoneName')?.value || '';
    
    if (endDate && startDate.toDateString() === endDate.toDateString()) {
      const startStr = startDate.toLocaleDateString([], { ...formatOptions, timeZone: tz });
      const endTimeStr = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: tz });
      return `${startStr} - ${endTimeStr} ${tzAbbr}`;
    }
    
    if (endDate) {
      const startStr = startDate.toLocaleString([], { ...formatOptions, timeZone: tz });
      const endStr = endDate.toLocaleString([], { ...formatOptions, timeZone: tz });
      return `${startStr} - ${endStr} ${tzAbbr}`;
    }
    
    const startStr = startDate.toLocaleDateString([], { ...formatOptions, timeZone: tz });
    return `${startStr} ${tzAbbr}`;
  }

  const handleClick = () => {
    if (link && onClick) {
      onClick(event);
    }
  };

  // Determine border and background colors based on platform when active
  const getCardClassName = () => {
    const baseClasses = 'group relative overflow-hidden rounded-xl border transition-all duration-300 hover:border-white/40 hover:shadow-lg hover:scale-[1.02] cursor-pointer';
    
    if (!isActive) {
      return `${baseClasses} border-white/20 bg-gradient-to-br ${gradient}`;
    }
    
    // Use platform-specific colors when active
    const activeStyle = PLATFORM_ACTIVE_STYLES[platform] || PLATFORM_ACTIVE_STYLES.default;
    return `${baseClasses} ${activeStyle.border} ${activeStyle.bg} ${activeStyle.shadow}`;
  };
  
  // Generate or use image URL from event, or use platform placeholder
  const imageUrl = image || thumbnail || null;
  
  const titleText = link ? (isStreamLive ? 'Click to watch live stream' : isActive && contentType === 'video' ? 'Click to watch video' : 'Click to open link') : '';

  return (
    <div
      onClick={handleClick}
      className={getCardClassName()}
      style={{
        ...(!link ? { opacity: 0.8, cursor: 'default' } : {}),
      }}
      title={titleText}
    >
      {/* Animated pulse effect for live streams only */}
      {isStreamLive && (
        <div className="absolute inset-0 bg-green-500/10 animate-pulse z-10" />
      )}

      {/* Image/Visual section - Linktree style */}
      <div className={`relative h-56 sm:h-64 overflow-hidden ${
        imageUrl 
          ? '' 
          : `bg-gradient-to-br ${isActive ? (PLATFORM_ACTIVE_STYLES[platform] || PLATFORM_ACTIVE_STYLES.default).bg : gradient}`
      }`}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title || 'Event image'} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ) : (
          // Platform icon as visual when no image
          <div className="w-full h-full flex items-center justify-center">
            {Icon && (
              <Icon className="text-7xl sm:text-8xl text-white/20 group-hover:text-white/30 transition-colors duration-300" />
            )}
          </div>
        )}
        
        {/* Overlay gradient for text readability with title at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Title overlaid on image bottom - Linktree style */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
          <h3 className="font-bold text-xl sm:text-2xl leading-tight text-white drop-shadow-lg">
            {title || 'Untitled'}
          </h3>
        </div>
        
        {/* Active badge positioned on image top right */}
        {activeBadge && (
          <div className="absolute top-3 right-3 z-20">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm ${
              activeBadge.color === 'purple' ? 'bg-purple-500/30 border-purple-400/50' :
              activeBadge.color === 'red' ? 'bg-red-500/30 border-red-400/50' :
              activeBadge.color === 'green' ? 'bg-green-500/30 border-green-400/50' :
              activeBadge.color === 'indigo' ? 'bg-indigo-500/30 border-indigo-400/50' :
              activeBadge.color === 'pink' ? 'bg-pink-500/30 border-pink-400/50' :
              activeBadge.color === 'cyan' ? 'bg-cyan-500/30 border-cyan-400/50' :
              activeBadge.color === 'gray' ? 'bg-gray-500/30 border-gray-400/50' :
              activeBadge.color === 'blue' ? 'bg-blue-500/30 border-blue-400/50' :
              activeBadge.color === 'orange' ? 'bg-orange-500/30 border-orange-400/50' :
              'bg-blue-500/30 border-blue-400/50'
            }`}>
              {isStreamLive && (
                <span className={`h-2 w-2 rounded-full animate-pulse ${
                  activeBadge.color === 'purple' ? 'bg-purple-400' :
                  activeBadge.color === 'red' ? 'bg-red-400' :
                  activeBadge.color === 'green' ? 'bg-green-400' :
                  activeBadge.color === 'indigo' ? 'bg-indigo-400' :
                  activeBadge.color === 'pink' ? 'bg-pink-400' :
                  activeBadge.color === 'cyan' ? 'bg-cyan-400' :
                  activeBadge.color === 'gray' ? 'bg-gray-400' :
                  activeBadge.color === 'blue' ? 'bg-blue-400' :
                  activeBadge.color === 'orange' ? 'bg-orange-400' :
                  'bg-blue-400'
                }`} />
              )}
              <span className={`text-xs font-medium ${
                activeBadge.color === 'purple' ? 'text-purple-300' :
                activeBadge.color === 'red' ? 'text-red-300' :
                activeBadge.color === 'green' ? 'text-green-300' :
                activeBadge.color === 'indigo' ? 'text-indigo-300' :
                activeBadge.color === 'pink' ? 'text-pink-300' :
                activeBadge.color === 'cyan' ? 'text-cyan-300' :
                activeBadge.color === 'gray' ? 'text-gray-300' :
                activeBadge.color === 'blue' ? 'text-blue-300' :
                activeBadge.color === 'orange' ? 'text-orange-300' :
                'text-blue-300'
              }`}>
                {activeBadge.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card content below image - Linktree style */}
      <div className="relative p-4 sm:p-5">
        {/* Platform and content type info */}
        <div className="flex items-center gap-2 mb-3">
          {/* Small platform icon */}
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
            isActive 
              ? (PLATFORM_ACTIVE_STYLES[platform] || PLATFORM_ACTIVE_STYLES.default).icon.replace('border-2', 'border')
              : 'bg-white/10 border border-white/20'
          } backdrop-blur-sm`}>
            {Icon ? (
              <Icon className="text-base text-white" />
            ) : (
              <span className="text-base">🔗</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-white/80">
              {platformMeta?.label || platform}
            </div>
            <div className="text-xs text-white/50">
              {CONTENT_TYPE_ICONS[contentType] || '📌'} {contentType === 'stream' ? 'Stream' : contentType === 'video' ? 'Video' : contentType === 'tournament' ? 'Tournament' : 'Content'}
            </div>
          </div>
        </div>

        {/* Schedule time for upcoming events */}
        {!isActive && scheduleStart && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>📅</span>
            <span>{formatSchedule(scheduleStart, scheduleEnd, event.timezone)}</span>
          </div>
        )}

        {/* Hover arrow indicator */}
        {link && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white/80 text-2xl transform group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        )}
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
}

