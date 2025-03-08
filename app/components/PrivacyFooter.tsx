export default function PrivacyFooter() {
    return (
        <div className="privacy-footer text-center mt-6 mb-4 w-full px-4 max-w-[1025px]">
          <div className="privacy-content p-3 bg-[rgba(30,30,35,0.6)] rounded border border-[rgba(212,180,131,0.2)]">
            <p className="text-[#eacda3] text-xs mb-2">
              <strong>Privacy Notice:</strong> All conversations during phone calls are logged to Bland.ai's API. Your phone number is used only to connect calls.
            </p>
            <p className="text-[#eacda3] text-xs">
              All data processing and voice generation is handled by Bland.ai. See <a href="https://www.bland.ai/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] underline hover:text-[#79b6ff]">Bland.ai's Privacy Policy</a> for details.
            </p>
          </div>
          <div className="attribution mt-2 text-xs text-[#a0a0a0]">
            Educational Demo, characters etc owned by Hasbro and all rights reserved | Built by <a href="http://benjgorman.com" className="text-[#a0a0a0] underline hover:text-[#eacda3]">Benjamin Gorman </a>
          </div>
        </div>
    );
}