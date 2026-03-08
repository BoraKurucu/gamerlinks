import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LinkCard from '../shared/LinkCard';
import EventCard from '../shared/EventCard';
import GamerBadge from '../shared/GamerBadge';
import ParticleTrail from '../shared/ParticleTrail';
import { PLATFORMS } from '../shared/platforms';
import { FaChevronDown, FaChevronUp, FaArrowLeft, FaShareAlt, FaFingerprint } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';

export default function GuestView() {
    const [profile, setProfile] = useState(null);
    const [toast, setToast] = useState('');
    const [activeEventsExpanded, setActiveEventsExpanded] = useState(true);
    const [eventsExpanded, setEventsExpanded] = useState(false);
    const [linksExpanded, setLinksExpanded] = useState(true); // default open for links

    useEffect(() => {
        // Load guest profile data
        const links = JSON.parse(localStorage.getItem('gamerlinks_guest_links') || '[]');
        const events = JSON.parse(localStorage.getItem('gamerlinks_guest_events') || '[]');
        const settings = JSON.parse(localStorage.getItem('gamerlinks_guest_settings') || '{}');

        setProfile({
            username: 'guest',
            displayName: settings.displayName || 'Guest Gamer',
            avatar: settings.avatar || 'https://i.pravatar.cc/300?u=guest',
            bio: settings.bio || 'This is your preview bio. Customize it in the dashboard!',
            badges: settings.badges || ['Pro Gamer', 'League Leader'],
            links: links,
            events: events,
            theme: settings.theme || '#00E5FF'
        });

        // Track a mock view
        const stats = JSON.parse(localStorage.getItem('gamerlinks_guest_stats') || '{"views":0, "shares":0, "clicks":0}');
        stats.views = (stats.views || 0) + 1;
        localStorage.setItem('gamerlinks_guest_stats', JSON.stringify(stats));
    }, []);

    function share() {
        try {
            const url = window.location.href;
            navigator.clipboard?.writeText(url);
            setToast('Link copied');
            setTimeout(() => setToast(''), 1500);

            const stats = JSON.parse(localStorage.getItem('gamerlinks_guest_stats') || '{"views":0, "shares":0, "clicks":0}');
            stats.shares = (stats.shares || 0) + 1;
            localStorage.setItem('gamerlinks_guest_stats', JSON.stringify(stats));
        } catch (e) { console.error(e); }
    }

    function handleLinkClick() {
        const stats = JSON.parse(localStorage.getItem('gamerlinks_guest_stats') || '{"views":0, "shares":0, "clicks":0}');
        stats.clicks = (stats.clicks || 0) + 1;
        localStorage.setItem('gamerlinks_guest_stats', JSON.stringify(stats));
    }

    if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading preview…</div>;

    const activeEvents = (profile.events || []).filter((e) => e.status === 'live');
    const upcomingEvents = (profile.events || [])
        .filter((e) => e.status === 'scheduled')
        .sort((a, b) => new Date(a.scheduleStart || 0) - new Date(b.scheduleStart || 0));

    function handleEventClick(event) {
        handleLinkClick();
        if (event.link) window.open(event.link, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-3 sm:px-4 py-6 sm:py-12 bg-black overflow-x-hidden relative">
            {/* Background Glows based on theme */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] blur-[150px] rounded-full" style={{ background: `radial-gradient(circle, ${profile.theme}af, transparent)` }}></div>
            </div>

            <div className="w-full max-w-xl mb-8 flex justify-between items-center relative z-20">
                <Link to="/dashboard" className="text-white/40 hover:text-white flex items-center gap-2 group transition-all">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Lab Studio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-theme-primary animate-pulse"></div>
                    <span className="text-[10px] font-bold text-theme-primary tracking-widest uppercase">Public Beta Page</span>
                </div>
            </div>

            <div className="w-full max-w-xl glass rounded-3xl p-6 sm:p-10 profile-container relative z-20 shadow-2xl overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaFingerprint size={80} className="text-white" />
                </div>

                <div className="flex flex-col items-center text-center">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full blur-xl scale-110 opacity-30" style={{ background: profile.theme }}></div>
                        <img src={profile.avatar} alt={profile.displayName} className="h-32 w-32 sm:h-40 sm:w-40 rounded-full ring-4 shadow-2xl object-cover relative z-10 border-4 border-white/5" />
                    </div>

                    <h1 className="mt-8 text-3xl sm:text-4xl font-black tracking-tight">{profile.displayName}</h1>
                    <p className="text-theme-primary font-bold text-sm sm:text-base tracking-wide mt-1">@{profile.username}</p>

                    {profile.badges?.length ? (
                        <div className="mt-5 flex flex-wrap gap-2 justify-center">
                            {profile.badges.map((b) => (<div key={b} className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/5 text-white/80">{b}</div>))}
                        </div>
                    ) : null}

                    {profile.bio ? (<p className="mt-6 text-white/60 max-w-prose text-sm sm:text-base px-2 leading-relaxed font-medium">{profile.bio}</p>) : null}

                    <div className="w-full mt-10 grid grid-cols-2 gap-4">
                        <button
                            onClick={share}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm"
                        >
                            <FaShareAlt size={14} className="text-theme-primary" /> Share Profile
                        </button>
                        <button
                            onClick={share}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm"
                        >
                            <FaQrcode size={14} className="text-theme-primary" /> Show Link
                        </button>
                    </div>
                </div>

                {activeEvents.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <span className="text-[10px] font-bold text-green-400 tracking-widest uppercase">🔴 Live & Hot</span>
                            <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                        <div className="space-y-4">
                            {activeEvents.map((event, idx) => (
                                <EventCard key={idx} event={event} isActive={true} onClick={handleEventClick} />
                            ))}
                        </div>
                    </div>
                )}

                {upcomingEvents.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-6 flex items-center gap-2">📅 Schedule</h3>
                        <div className="space-y-4">
                            {upcomingEvents.map((event, idx) => (
                                <EventCard key={idx} event={event} isActive={false} onClick={handleEventClick} />
                            ))}
                        </div>
                    </div>
                )}

                {profile.links && profile.links.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase mb-6 flex items-center gap-2">🔗 Connections</h3>
                        <div className="space-y-4">
                            {profile.links.map((l, idx) => (
                                <div key={idx} onClick={handleLinkClick}>
                                    <LinkCard link={l} profileUsername={profile.username} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 text-center relative z-20">
                <p className="text-white/20 text-[10px] font-bold tracking-[.3em] uppercase">Powered by GamerLinks</p>
            </div>

            {toast ? (<div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-theme-primary text-black px-6 py-3 rounded-full font-bold shadow-2xl z-50 animate-bounce">{toast}</div>) : null}

            <div className="hidden lg:block fixed bottom-10 right-10 z-20 group">
                <div className="glass rounded-3xl p-5 border border-white/10 shadow-2xl transition-all hover:scale-105">
                    <div className="p-3 bg-white rounded-2xl">
                        <QRCodeSVG value={window.location.href} size={100} level="H" includeMargin={true} />
                    </div>
                    <p className="text-white/40 text-[9px] font-bold text-center mt-3 tracking-widest">MOBILE SCAN</p>
                </div>
            </div>
        </div>
    );
}

function FaQrcode({ size, className }) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg"><path d="M0 224h192V32H0v192zM64 96h64v64H64V96zm192-64v192h192V32H256zm128 128h-64V96h64v64zM0 480h192V288H0v192zm64-128h64v64H64v-64zm256-64v96h64v-96h-64zm32 32h32v32h-32v-32zm-32 64h32v32h-32v-32zm64 32h32v32h-32v-32zm32-32h32v32h-32v-32zm0-64h-32v32h32v-32zm-64-32h-32v32h32v-32zm32 128h-32v32h32v-32zm64 32h-32v32h32v-32z"></path></svg>;
}
