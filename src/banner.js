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
  const baseUrl = "https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest";
  
  // Fetch banner configuration
  fetch(baseUrl + "/banners.json")
    .then(response => response.json())
    .then(bannerConfig => {
      // Handle both old (string) and new (object) client configurations
      const clientConfig = bannerConfig.clients[hostname];
      let bannerUrl, dismissDays;
      
      if (typeof clientConfig === 'string') {
        // Old format: direct path string
        bannerUrl = clientConfig;
        dismissDays = bannerConfig.defaultDismissDays || config.dismissDays;
      } else if (clientConfig && typeof clientConfig === 'object') {
        // New format: object with banner and dismissDays
        bannerUrl = clientConfig.banner;
        dismissDays = clientConfig.dismissDays !== undefined ? clientConfig.dismissDays : (bannerConfig.defaultDismissDays || config.dismissDays);
      } else {
        // No configuration found, try default
        bannerUrl = bannerConfig.default;
        dismissDays = bannerConfig.defaultDismissDays || config.dismissDays;
      }
      
      if (!bannerUrl) return;
      
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