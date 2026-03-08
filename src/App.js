import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import OwnerProfile from './pages/OwnerProfile';
import ViewProfile from './pages/ViewProfile';
import Dashboard from './pages/Dashboard';
import ContentManager from './pages/ContentManager';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import GuestView from './pages/GuestView';
import Starfield from './shared/Starfield';
import Footer from './shared/Footer';

function App() {
  const [legalModal, setLegalModal] = useState(null); // 'privacy', 'terms', 'cookies', or null

  return (
    <div className="min-h-screen bg-bg-dark text-white relative flex flex-col">
      <Starfield />
      <div className="relative z-10 flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profile/:username" element={<OwnerProfile />} />
          <Route path="/view/:username" element={<ViewProfile />} />
          <Route path="/view/guest" element={<GuestView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/content-manager" element={<ContentManager />} />
          <Route path="/analytics/:username" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold">Page not found</h1>
                  <Link className="text-theme-primary underline" to="/">Go home</Link>
                </div>
              </div>
            }
          />
        </Routes>
        <Footer
          onOpenPrivacy={() => setLegalModal('privacy')}
          onOpenTerms={() => setLegalModal('terms')}
          onOpenCookies={() => setLegalModal('cookies')}
        />

        {/* Legal Modals */}
        {legalModal === 'privacy' && <PrivacyPolicy onClose={() => setLegalModal(null)} />}
        {legalModal === 'terms' && <TermsOfService onClose={() => setLegalModal(null)} />}
        {legalModal === 'cookies' && <CookiePolicy onClose={() => setLegalModal(null)} />}
      </div>
    </div>
  );
}

export default App;
