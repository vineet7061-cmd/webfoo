import { Link } from "@tanstack/react-router";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <footer
      className="mt-16 border-t border-border"
      style={{
        background: "linear-gradient(135deg, #0a1520 0%, #0c2233 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + brand */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/cropped_circle_image-1.png"
              alt="WebFoo Mart"
              className="h-9 w-9 object-contain rounded-full"
              style={{ border: "2px solid rgba(6,182,212,0.35)" }}
            />
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                WebFoo Mart
              </p>
              <p className="text-xs text-white/40">Delivering Desires...</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <Link to="/cart" className="hover:text-white/70 transition-colors">
              Cart
            </Link>
            <Link
              to="/login"
              search={{ redirect: undefined }}
              className="hover:text-white/70 transition-colors"
            >
              Login
            </Link>
          </nav>

          {/* Attribution */}
          <p className="text-xs text-white/35">
            © {year}. Built with <span style={{ color: "#06B6D4" }}>♥</span>{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
