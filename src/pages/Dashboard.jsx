import { useEffect, useState } from 'react';
import { PLATFORM_LIST, PLATFORMS } from '../shared/platforms';
import PlatformIcons from '../shared/PlatformIcons';
import SearchableDropdown from '../shared/SearchableDropdown';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaLink, FaCalendarAlt, FaUser, FaPlus, FaTrash,
  FaEye, FaSave, FaCheckCircle, FaChevronRight, FaTimes,
  FaChartBar, FaPalette, FaHome, FaShareAlt, FaQrcode
} from 'react-icons/fa';
import ParticleTrail from '../shared/ParticleTrail';
import { FREE_LINK_LIMIT, FREE_EVENT_LIMIT } from '../shared/subscriptionService';
import { upsertLink, removeLink } from '../shared/profileService';
import { useTheme } from '../shared/ThemeContext';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const { theme, changeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'links', 'scheduler', 'profile', 'themes'

  // Link data
  const [links, setLinks] = useState([]);

  // Scheduler data
  const [events, setEvents] = useState([]);

  // Profile & Ranks data
  const [displayName, setDisplayName] = useState('Guest Gamer');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/300?u=guest');
  const [badges, setBadges] = useState(['Pro Gamer', 'League Leader']);
  const [newBadge, setNewBadge] = useState('');

  // Analytics (Mock/Local)
  const [stats, setStats] = useState({
    views: 0,
    shares: 0,
    clicks: 0
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all local data on mount
    const savedLinks = localStorage.getItem('gamerlinks_guest_links');
    if (savedLinks) setLinks(JSON.parse(savedLinks));

    const savedEvents = localStorage.getItem('gamerlinks_guest_events');
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    const savedSettings = localStorage.getItem('gamerlinks_guest_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setDisplayName(parsed.displayName || 'Guest Gamer');
      setBio(parsed.bio || '');
      setAvatar(parsed.avatar || 'https://i.pravatar.cc/300?u=guest');
      setBadges(parsed.badges || ['Pro Gamer', 'League Leader']);
      if (parsed.theme) changeTheme(parsed.theme);
    }

    const savedStats = localStorage.getItem('gamerlinks_guest_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
    else {
      // Initial mock stats
      const initial = { views: 124, shares: 12, clicks: 45 };
      setStats(initial);
      localStorage.setItem('gamerlinks_guest_stats', JSON.stringify(initial));
    }
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  // --- Link Actions ---
  function handleAddLink() {
    if (links.length >= FREE_LINK_LIMIT) {
      setError(`Free tier limit reached (${FREE_LINK_LIMIT} links)`);
      return;
    }
    setLinks(upsertLink(links, { title: 'New Link', platform: 'twitch', url: '' }));
    setError('');
  }

  function handleLinkChange(idx, field, value) {
    const next = [...links];
    next[idx] = { ...next[idx], [field]: value };
    setLinks(next);
  }

  function handleRemoveLink(idx) {
    const next = removeLink(links, idx);
    setLinks(next);
  }

  // --- Scheduler Actions ---
  function handleAddEvent() {
    if (events.length >= FREE_EVENT_LIMIT) {
      setError(`Free tier limit reached (${FREE_EVENT_LIMIT} events)`);
      return;
    }
    const newEvent = {
      title: 'New Stream',
      platform: 'twitch',
      status: 'scheduled',
      contentType: 'stream',
      scheduleStart: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      link: ''
    };
    setEvents([...events, newEvent]);
    setError('');
  }

  function handleEventChange(idx, field, value) {
    const next = [...events];
    next[idx] = { ...next[idx], [field]: value };
    setEvents(next);
  }

  function handleRemoveEvent(idx) {
    const next = [...events];
    next.splice(idx, 1);
    setEvents(next);
  }

  // --- Badge Actions ---
  function handleAddBadge() {
    if (!newBadge.trim()) return;
    if (badges.includes(newBadge.trim())) return;
    setBadges([...badges, newBadge.trim()]);
    setNewBadge('');
  }

  function handleRemoveBadge(idx) {
    const next = [...badges];
    next.splice(idx, 1);
    setBadges(next);
  }

  // --- Theme Actions ---
  function handleThemeChange(color) {
    changeTheme(color);
    // Auto save theme
    const settings = JSON.parse(localStorage.getItem('gamerlinks_guest_settings') || '{}');
    settings.theme = color;
    localStorage.setItem('gamerlinks_guest_settings', JSON.stringify(settings));
  }

  // --- Master Save ---
  function handleSaveAll() {
    setSaving(true);
    try {
      localStorage.setItem('gamerlinks_guest_links', JSON.stringify(links));
      localStorage.setItem('gamerlinks_guest_events', JSON.stringify(events));
      localStorage.setItem('gamerlinks_guest_settings', JSON.stringify({
        displayName, bio, avatar, badges, theme
      }));
      showToast('All changes saved locally!');
    } catch (e) {
      console.error(e);
      setError('Failed to save data');
    } finally {
      setSaving(false);
    }
  }

  function copyPublicLink() {
    const url = window.location.origin + '/view/guest';
    navigator.clipboard.writeText(url);
    showToast('Public link copied!');
  }

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <span className="text-theme-primary">Gamer</span>Labs
            </h1>
            <p className="text-white/50 text-sm">Experimental Mode • Everything Saved Locally</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/view/guest" className="neon-btn rounded-md border border-white/10 bg-black/30 px-3 sm:px-4 py-2 text-sm flex items-center gap-2 hover:bg-black/50 transition-all">
              <FaEye /> Preview
            </Link>
            <button onClick={handleSaveAll} disabled={saving} className="neon-btn rounded-md bg-theme-primary px-3 sm:px-4 py-2 text-black text-sm font-bold flex items-center gap-2 disabled:opacity-50">
              <FaSave /> {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/5 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all whitespace-nowrap min-w-[100px] ${activeTab === 'home' ? 'bg-theme-primary text-black font-bold' : 'text-white/60 hover:text-white'}`}
          >
            <FaHome /> Home
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all whitespace-nowrap min-w-[100px] ${activeTab === 'links' ? 'bg-theme-primary text-black font-bold' : 'text-white/60 hover:text-white'}`}
          >
            <FaLink /> Links
          </button>
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all whitespace-nowrap min-w-[100px] ${activeTab === 'scheduler' ? 'bg-theme-primary text-black font-bold' : 'text-white/60 hover:text-white'}`}
          >
            <FaCalendarAlt /> Scheduler
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all whitespace-nowrap min-w-[100px] ${activeTab === 'profile' ? 'bg-theme-primary text-black font-bold' : 'text-white/60 hover:text-white'}`}
          >
            <FaUser /> Identity
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all whitespace-nowrap min-w-[100px] ${activeTab === 'themes' ? 'bg-theme-primary text-black font-bold' : 'text-white/60 hover:text-white'}`}
          >
            <FaPalette /> Themes
          </button>
        </div>

        {error && <div className="mb-6 p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-sm animate-shake">{error}</div>}

        {/* Tab Content: HOME / OVERVIEW */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center">
                <span className="text-sm text-white/50 mb-1">Total Profile Views</span>
                <span className="text-4xl font-extrabold text-theme-primary">{stats.views}</span>
                <div className="mt-2 h-1 w-12 bg-theme-primary/30 rounded-full"></div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center">
                <span className="text-sm text-white/50 mb-1">Interactive Clicks</span>
                <span className="text-4xl font-extrabold text-theme-primary">{stats.clicks}</span>
                <div className="mt-2 h-1 w-12 bg-theme-primary/30 rounded-full"></div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center">
                <span className="text-sm text-white/50 mb-1">Profile Shares</span>
                <span className="text-4xl font-extrabold text-theme-primary">{stats.shares}</span>
                <div className="mt-2 h-1 w-12 bg-theme-primary/30 rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaShareAlt className="text-theme-primary" /> Spread the Word</h3>
                <p className="text-white/60 text-sm mb-6">Your profile is ready to be shared with your followers across all platforms.</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-xs font-mono text-white/50"
                    value={window.location.origin + '/view/guest'}
                  />
                  <button onClick={copyPublicLink} className="bg-theme-primary text-black px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">Copy Link</button>
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 w-full"><FaQrcode className="text-theme-primary" /> Profile QR</h3>
                <div className="bg-white p-2 rounded-xl mb-2">
                  <QRCodeSVG value={window.location.origin + '/view/guest'} size={100} />
                </div>
                <span className="text-[10px] text-white/40">Scan to view on mobile</span>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaChartBar className="text-theme-primary" /> Performance Tips</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-theme-primary font-bold">01.</span>
                  <span>Add at least 3 social links to increase engagement rates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-primary font-bold">02.</span>
                  <span>Keep your "Identity" tab updated with your latest peak ranks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-theme-primary font-bold">03.</span>
                  <span>Use the "Scheduler" to let fans know when your next stream starts.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab Content: Links */}
        {activeTab === 'links' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Manage Your Links</h2>
              <button onClick={handleAddLink} className="text-theme-primary flex items-center gap-1 text-sm bg-theme-primary/10 px-3 py-1.5 rounded-full hover:bg-theme-primary/20">
                <FaPlus /> Add New
              </button>
            </div>
            {links.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl text-white/30">
                Empty links. Start adding platforms like Twitch, Steam or Discord.
              </div>
            ) : (
              links.map((l, idx) => (
                <div key={idx} className="glass p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-48">
                      <SearchableDropdown
                        options={PLATFORM_LIST.map(p => ({ value: p.key, label: p.label, icon: p.icon }))}
                        value={l.platform}
                        onChange={(val) => handleLinkChange(idx, 'platform', val)}
                      />
                    </div>
                    <input
                      className="flex-1 rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white"
                      placeholder="Link Title (e.g. My Twitch)"
                      value={l.title}
                      onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                    />
                    <button onClick={() => handleRemoveLink(idx)} className="text-red-400/60 hover:text-red-400 p-2"><FaTrash /></button>
                  </div>
                  <input
                    className="w-full mt-3 rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white text-sm"
                    placeholder="URL (https://...)"
                    value={l.url}
                    onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Scheduler */}
        {activeTab === 'scheduler' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Upcoming Streams & Content</h2>
              <button onClick={handleAddEvent} className="text-theme-primary flex items-center gap-1 text-sm bg-theme-primary/10 px-3 py-1.5 rounded-full hover:bg-theme-primary/20">
                <FaPlus /> Schedule
              </button>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl text-white/30">
                No scheduled content. Show your viewers when you'll be live!
              </div>
            ) : (
              events.map((e, idx) => (
                <div key={idx} className="glass p-4 rounded-xl border border-white/10">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <input
                          className="flex-1 rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white font-bold"
                          placeholder="Event Title"
                          value={e.title}
                          onChange={(val) => handleEventChange(idx, 'title', val.target.value)}
                        />
                        <select
                          className="rounded-md bg-black/40 border border-white/10 px-2 py-2 text-white text-xs"
                          value={e.status}
                          onChange={(val) => handleEventChange(idx, 'status', val.target.value)}
                        >
                          <option value="live">🔴 Live Now</option>
                          <option value="scheduled">🕒 Scheduled</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="datetime-local"
                          className="rounded-md bg-black/40 border border-white/10 px-3 py-1.5 text-white text-xs"
                          value={e.scheduleStart}
                          onChange={(val) => handleEventChange(idx, 'scheduleStart', val.target.value)}
                        />
                        <input
                          className="rounded-md bg-black/40 border border-white/10 px-3 py-1.5 text-white text-xs"
                          placeholder="Dest. Link"
                          value={e.link}
                          onChange={(val) => handleEventChange(idx, 'link', val.target.value)}
                        />
                      </div>
                    </div>
                    <button onClick={() => handleRemoveEvent(idx)} className="text-red-400/60 hover:text-red-400 self-center sm:self-auto"><FaTrash /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Content: Profile & Ranks */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Profile Identity</h2>
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative group">
                  <img src={avatar} className="h-32 w-32 rounded-full border-4 border-theme-primary/30 object-cover shadow-2xl shadow-theme-primary/10" alt="Avatar" />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <p className="text-[10px] text-white font-bold text-center">Update URL below</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Display Name</label>
                    <input
                      className="w-full rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white text-lg font-bold"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Bio / Slogan</label>
                    <textarea
                      className="w-full rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white text-sm min-h-[80px]"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell your fans something cool..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Avatar Image URL</label>
                    <input
                      className="w-full rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white text-xs"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Gamer Ranks & Achievements</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {badges.map((b, idx) => (
                  <div key={idx} className="bg-theme-primary/20 border border-theme-primary/30 text-theme-primary px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold">
                    {b}
                    <button onClick={() => handleRemoveBadge(idx)} className="hover:text-white"><FaTimes /></button>
                  </div>
                ))}
                {badges.length === 0 && <p className="text-white/30 text-sm italic">No achievements added yet. Show off your skills!</p>}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md bg-black/40 border border-white/10 px-4 py-2 text-white"
                  placeholder="Add badge (e.g. Diamond II, Top 500)"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBadge()}
                />
                <button onClick={handleAddBadge} className="bg-theme-primary text-black px-4 py-2 rounded-md font-bold">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: THEMES */}
        {activeTab === 'themes' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="glass p-6 rounded-2xl border border-white/10 text-center">
              <h2 className="text-xl font-bold mb-2">Aesthetic Control</h2>
              <p className="text-white/50 text-sm mb-6">Choose your signature laboratory color. All components will sync to this theme instantly.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Electric Blue', color: '#00E5FF' },
                  { name: 'Neon Purple', color: '#BC13FE' },
                  { name: 'Plasma Green', color: '#39FF14' },
                  { name: 'Radient Red', color: '#FF3131' },
                  { name: 'Solar Orange', color: '#FF9100' },
                  { name: 'Deep Cyber', color: '#4D4DFF' },
                  { name: 'Virtual Gold', color: '#FFD700' },
                  { name: 'White Ghost', color: '#FFFFFF' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => handleThemeChange(c.color)}
                    className={`group relative p-4 rounded-xl border-2 transition-all ${theme === c.color ? 'border-theme-primary scale-105 bg-white/5' : 'border-white/5 hover:border-white/20 bg-black/20'}`}
                  >
                    <div className="w-full aspect-square rounded-full mb-2 shadow-lg" style={{ backgroundColor: c.color, boxShadow: `0 0 15px ${c.color}44` }}></div>
                    <span className={`text-[10px] font-bold uppercase ${theme === c.color ? 'text-theme-primary' : 'text-white/40'}`}>{c.name}</span>
                    {theme === c.color && <div className="absolute -top-1 -right-1 bg-theme-primary text-black rounded-full p-1"><FaCheckCircle size={10} /></div>}
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-theme-primary/5 border border-theme-primary/20">
                <label className="text-xs text-theme-primary font-bold uppercase block mb-3">Custom Lab Color</label>
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="color"
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="h-12 w-24 rounded-lg bg-transparent cursor-pointer"
                  />
                  <span className="text-sm font-mono text-white/60">{theme}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
          <p className="text-white/30 text-sm mb-4">Your modifications are stored safe and sound.</p>
          <div className="flex gap-4">
            <Link to="/view/guest" className="neon-btn group inline-flex items-center gap-3 bg-white/5 border border-white/10 py-3 px-8 rounded-full text-lg font-bold hover:bg-white/10 transition-all">
              View Live <FaChevronRight className="group-hover:translate-x-1 transition-transform text-theme-primary" />
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full border border-theme-primary/30 text-theme-primary font-bold z-50 flex items-center gap-2 animate-bounce">
          <FaCheckCircle /> {toast}
        </div>
      )}
    </div>
  );
}
