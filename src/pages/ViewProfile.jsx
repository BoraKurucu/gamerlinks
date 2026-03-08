import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import LinkCard from '../shared/LinkCard';
import EventCard from '../shared/EventCard';
import GamerBadge from '../shared/GamerBadge';
import { subscribeProfileByUsername } from '../shared/profileService';
import { trackProfileView, trackProfileShare, trackLinkClick } from '../shared/analyticsService';
import ParticleTrail from '../shared/ParticleTrail';
import { PLATFORMS } from '../shared/platforms';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

export default function ViewProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [activeEventsExpanded, setActiveEventsExpanded] = useState(true); // Open by default
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [linksExpanded, setLinksExpanded] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    const unsub = subscribeProfileByUsername(username || '', (p) => {
      setProfile(p);
      setLoading(false);
      
      // Track profile view once when profile loads
      if (p && p.username && !hasTrackedView.current) {
        hasTrackedView.current = true;
        trackProfileView(p.username);
      }
    });
    return () => unsub && unsub();
  }, [username]);

  const activeEvents = useMemo(() => {
    if (!profile?.events?.length) return [];
    return profile.events.filter((e) => e.status === 'live');
  }, [profile?.events]);

  const upcomingEvents = useMemo(() => {
    if (!profile?.events?.length) return [];
    return profile.events
      .filter((e) => e.status === 'scheduled')
      .sort((a, b) => {
        const aStart = a.scheduleStart ? new Date(a.scheduleStart).getTime() : 0;
        const bStart = b.scheduleStart ? new Date(b.scheduleStart).getTime() : 0;
        if (aStart === 0) return 1;
        if (bStart === 0) return -1;
        return aStart - bStart;
      });
  }, [profile?.events]);

  function share() {
    try {
      const url = window.location.href;
      navigator.clipboard?.writeText(url);
      setToast('Link copied');
      setTimeout(() => setToast(''), 1500);
      
      // Track profile share
      if (profile?.username) {
        trackProfileShare(profile.username);
      }
    } catch (e) { console.error(e); }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white/80">Loading profile…</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">No profile found</h1>
        </div>
      </div>
    );
  }

  function handleEventClick(event) {
    if (event.link) {
      window.open(event.link, '_blank', 'noopener,noreferrer');
      
      // Track event click
      if (profile?.username) {
        trackLinkClick(profile.username, event.link, event.title || 'Event', 'event');
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-3 sm:px-4 py-6 sm:py-12">
      <div className="w-full max-w-xl mb-6 flex justify-center">
        <ParticleTrail>
          <Link 
            to="/" 
            className="neon-btn inline-block rounded-md bg-theme-primary px-4 sm:px-5 py-2.5 sm:py-3 text-black font-semibold text-sm sm:text-base min-h-[44px] flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            Create Your Own Page For Free!
          </Link>
        </ParticleTrail>
      </div>

      <div className="w-full max-w-xl glass rounded-xl p-4 sm:p-6 profile-container">
        <div className="flex flex-col items-center text-center">
          <img src={profile.avatar} alt={profile.displayName} className="avatar-glow avatar-ring h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 object-cover" />
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold">{profile.displayName}</h1>
          <p className="text-white/70 text-sm sm:text-base">@{profile.username}</p>
          {profile.badges?.length ? (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {profile.badges.map((b) => (<GamerBadge key={b} label={b} />))}
            </div>
          ) : null}
          {profile.bio ? (<p className="mt-4 text-white/80 max-w-prose text-sm sm:text-base px-2">{profile.bio}</p>) : null}
          {profile.highlightedLinks && profile.highlightedLinks.length > 0 && profile.links && (
            <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
              {profile.highlightedLinks.map((linkIndex) => {
                const link = profile.links[linkIndex];
                if (!link) return null;
                const platformMeta = PLATFORMS[link.platform];
                const Icon = platformMeta?.icon;
                return (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      if (profile.username) {
                        trackLinkClick(profile.username, link.url, link.title);
                      }
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all hover:scale-110 text-white"
                    title={link.title}
                  >
                    {Icon ? <Icon className="w-6 h-6" /> : <span>🔗</span>}
                  </a>
                );
              })}
            </div>
          )}
          <ParticleTrail>
            <button onClick={share} className="neon-btn mt-4 inline-block rounded-md border border-white/10 bg-black/30 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base min-h-[44px] flex items-center justify-center">Share profile</button>
          </ParticleTrail>
        </div>

        {activeEvents.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => setActiveEventsExpanded(!activeEventsExpanded)}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors min-h-[44px] mb-4"
            >
              <span className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Now Available</span>
              </span>
              {activeEventsExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeEventsExpanded && (
              <div className="space-y-3">
                {activeEvents.map((event, idx) => (
                  <EventCard
                    key={event.id || idx}
                    event={event}
                    isActive={true}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => setEventsExpanded(!eventsExpanded)}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors min-h-[44px] mb-4"
            >
              <span className="font-semibold text-base sm:text-lg flex items-center gap-2">
                <span>📅</span>
                <span>Upcoming Streams & Content</span>
              </span>
              {eventsExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {eventsExpanded && (
              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => (
                  <EventCard
                    key={event.id || idx}
                    event={event}
                    isActive={false}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {profile.links && profile.links.length > 0 && (
          <div className="mt-6 sm:mt-8 rounded-md border border-white/10 bg-black/20 overflow-hidden">
            <button
              onClick={() => setLinksExpanded(!linksExpanded)}
              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors min-h-[44px]"
            >
              <span className="font-semibold text-base sm:text-lg">🔗 Links</span>
              {linksExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {linksExpanded && (
              <div className="border-t border-white/10 space-y-3 p-3 sm:p-4">
            {profile.links.map((l) => (<LinkCard key={l.url || l.title} link={l} profileUsername={profile.username} />))}
              </div>
            )}
          </div>
        )}

        {(!profile.links || profile.links.length === 0) && (
          <div className="mt-10 text-center text-white/60">This player hasn't added links yet.</div>
        )}
      </div>

      {toast ? (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/80 border border-white/10 px-4 py-2 text-white/90">{toast}</div>) : null}

      {/* Floating QR Code - Desktop Only */}
      <div className="hidden md:block fixed bottom-28 right-6 z-40">
        <div className="glass rounded-xl p-3 border border-white/10 shadow-lg">
          <div className="p-2 bg-white rounded-lg">
            <QRCodeSVG
              value={window.location.href}
              size={120}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-white/70 text-xs text-center mt-2">View on mobile</p>
        </div>
      </div>
    </div>
  );
}
