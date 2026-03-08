import { Link } from 'react-router-dom';
import { FaChevronRight, FaRocket, FaShieldAlt, FaMagic } from 'react-icons/fa';
import ParticleTrail from '../shared/ParticleTrail';

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-theme-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-theme-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-4xl text-center relative z-10">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-theme-primary uppercase animate-pulse">
          <FaRocket /> Now in Labs Mode
        </div>

        <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight">
          Level Up Your <span className="text-theme-primary">Identity.</span>
        </h1>
        <p className="max-w-2xl mx-auto mb-12 text-lg sm:text-xl text-white/50 leading-relaxed font-medium">
          The ultimate link portal for gamers, creators, and competitors.
          Manage your presence, schedule streams, and show off your achievements instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="h-10 w-10 rounded-xl bg-theme-primary/20 flex items-center justify-center text-theme-primary mb-4 shadow-lg shadow-theme-primary/20">
              <FaShieldAlt />
            </div>
            <h3 className="font-bold text-lg mb-2">Login-Free Edit</h3>
            <p className="text-xs text-white/40 leading-relaxed">No accounts, no cookies. Edit your profile in our sandbox mode and preview it instantly in production style.</p>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="h-10 w-10 rounded-xl bg-theme-primary/20 flex items-center justify-center text-theme-primary mb-4 shadow-lg shadow-theme-primary/20">
              <FaMagic />
            </div>
            <h3 className="font-bold text-lg mb-2">Unified Control</h3>
            <p className="text-xs text-white/40 leading-relaxed">Combine your social links, stream schedules, and gaming ranks into one single, high-performance web destination.</p>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="h-10 w-10 rounded-xl bg-theme-primary/20 flex items-center justify-center text-theme-primary mb-4 shadow-lg shadow-theme-primary/20">
              <FaRocket />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Themes</h3>
            <p className="text-xs text-white/40 leading-relaxed">Sync your entire profile to your signature lab color with one click. Real-time preview across all your views.</p>
          </div>
        </div>

        <div className="glass rounded-[40px] p-8 sm:p-12 mx-auto w-full max-w-2xl bg-theme-primary/5 border border-theme-primary/20 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-theme-primary to-transparent opacity-50"></div>

          <div className="flex flex-col items-center gap-8">
            <div>
              <h2 className="text-3xl font-black mb-2">Creator Lab Studio</h2>
              <p className="text-white/40 text-sm">Experience the future of gamer profiles.</p>
            </div>

            <div className="w-full grid grid-cols-4 gap-4">
              {[
                { label: 'Links', icon: '🔗' },
                { label: 'Scheduler', icon: '🕒' },
                { label: 'Ranks', icon: '🏆' },
                { label: 'Stats', icon: '📊' },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shadow-inner">{item.icon}</div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>

            <ParticleTrail>
              <Link
                to="/dashboard"
                className="neon-btn group inline-flex items-center justify-center gap-4 rounded-full bg-theme-primary px-10 py-5 text-black text-2xl font-black transition-all hover:scale-105 shadow-2xl shadow-theme-primary/40"
              >
                Enter the Lab <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </ParticleTrail>

            <p className="text-xs text-white/30 font-medium italic">
              Data is saved to your local browser storage for security & speed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
