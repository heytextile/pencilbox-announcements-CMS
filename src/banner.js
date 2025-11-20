// Pencilbox Banner System - with updated object handling logic
(function() {
  "use strict";
  
  const VERSION = "1.2.0"; // Force rebuild for CDN
  const hostname = location.hostname;
  const dismissKey = "pb-dismiss-" + hostname;
  
  // Check if banner was previously dismissed
  if (localStorage.getItem(dismissKey)) return;
  
  // Get configuration or use defaults
  const config = window.PencilboxBannerConfig || { dismissDays: 7 };
  const baseUrl = "https://pencilbox-announcements-cms.vercel.app";
  
  // Fetch banner configuration
  fetch(baseUrl + "/banners.json")
    .then(response => response.json())
    .then(bannerConfig => {
      console.log("Banner config loaded:", bannerConfig);
      console.log("Current hostname:", hostname);
      
      // Helper function to check if a banner is currently active based on dates
      function isBannerActive(bannerObj) {
        if (!bannerObj || typeof bannerObj !== 'object') return true; // Legacy support
        
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Check start date
        if (bannerObj.startDate && bannerObj.startDate > today) {
          console.log("Banner not yet started:", bannerObj.startDate, "vs", today);
          return false;
        }
        
        // Check end date (null means indefinite)
        if (bannerObj.endDate && bannerObj.endDate < today) {
          console.log("Banner has ended:", bannerObj.endDate, "vs", today);
          return false;
        }
        
        console.log("Banner is active");
        return true;
      }
      
      // Handle both old (string) and new (object) client configurations
      const clientConfig = bannerConfig.clients[hostname];
      let bannerUrl, dismissDays;
      
      console.log("Client config for", hostname, ":", clientConfig);
      
      if (typeof clientConfig === 'string') {
        // Old format: direct path string - always active
        bannerUrl = clientConfig;
        dismissDays = bannerConfig.defaultDismissDays || config.dismissDays;
        console.log("Using string client config:", bannerUrl);
      } else if (clientConfig && typeof clientConfig === 'object') {
        // New format: object with banner, dismissDays, and scheduling
        if (isBannerActive(clientConfig)) {
          bannerUrl = clientConfig.banner;
          dismissDays = clientConfig.dismissDays !== undefined ? clientConfig.dismissDays : (bannerConfig.defaultDismissDays || config.dismissDays);
          console.log("Using object client config:", bannerUrl);
        } else {
          console.log("Client banner not active, checking default");
          // Fall through to check default banner
        }
      }
      
      // If no client config or client banner not active, try default
      if (!bannerUrl && bannerConfig.default) {
        if (typeof bannerConfig.default === 'string') {
          // Old default format
          bannerUrl = bannerConfig.default;
          dismissDays = bannerConfig.defaultDismissDays || config.dismissDays;
          console.log("Using string default config:", bannerUrl);
        } else if (typeof bannerConfig.default === 'object' && isBannerActive(bannerConfig.default)) {
          // New default format with scheduling
          bannerUrl = bannerConfig.default.banner;
          dismissDays = bannerConfig.default.dismissDays !== undefined ? bannerConfig.default.dismissDays : (bannerConfig.defaultDismissDays || config.dismissDays);
          console.log("Using object default config:", bannerUrl);
        } else {
          console.log("Default banner not active or not found");
        }
      }
      
      console.log("Final banner URL:", bannerUrl, "Dismiss days:", dismissDays);
      
      if (!bannerUrl) {
        console.log("No banner URL found, exiting");
        return;
      }
      
      // If dismissDays is 0 or negative, disable dismissal entirely
      const dismissalEnabled = dismissDays > 0;
      
      // Fetch banner HTML content
      fetch(baseUrl + bannerUrl)
        .then(response => response.text())
        .then(bannerHtml => {
          const bannerElement = document.createElement("div");
          bannerElement.className = "pencilbox-banner";

          // Parse HTML to extract scripts safely
          const temp = document.createElement("div");
          temp.innerHTML = bannerHtml;

          // Remove all <script> tags from the HTML string
          const cleanHtml = bannerHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
          const scripts = Array.from(temp.querySelectorAll("script"));

          // Insert clean HTML + close button
          bannerElement.innerHTML = cleanHtml + '<div class="banner-close">×</div>';
          document.body.appendChild(bannerElement);

          // Show banner
          setTimeout(() => bannerElement.classList.add("show"), 100);

          // Re-inject and execute any scripts that were in the banner
          scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
              newScript.src = oldScript.src;
              newScript.async = false;
            } else {
              newScript.textContent = oldScript.textContent;
            }
            // Appending to bannerElement keeps scope local — safer
            bannerElement.appendChild(newScript);
          });

          // Close button handler
          bannerElement.querySelector(".banner-close").onclick = () => {
            bannerElement.classList.remove("show");
            setTimeout(() => bannerElement.remove(), 500);
            
            // Only set dismissal if enabled (dismissDays > 0)
            if (dismissalEnabled) {
              localStorage.setItem(dismissKey, Date.now());
              setTimeout(() => localStorage.removeItem(dismissKey), 86400000 * dismissDays);
            }
          };
        })
        .catch(err => console.error("Pencilbox banner load error:", err));
    })
    .catch(err => console.error("Pencilbox config load error:", err));
})();