export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Compliance notice */}
          <p className="text-xs text-gray-400 max-w-md text-center sm:text-left leading-relaxed">
            This application supports user-initiated publication of original
            content to a connected Pinterest account. No automated posting,
            scraping, or third-party content distribution.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Pin Publisher Lite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
