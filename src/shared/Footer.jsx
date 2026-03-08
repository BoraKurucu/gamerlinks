export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenCookies }) {
  return (
    <footer className="border-t border-white/10 bg-black/20 mt-auto py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} GamerLinks. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <button 
              onClick={onOpenPrivacy}
              className="text-white/70 hover:text-theme-primary transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onOpenTerms}
              className="text-white/70 hover:text-theme-primary transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button 
              onClick={onOpenCookies}
              className="text-white/70 hover:text-theme-primary transition-colors cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

