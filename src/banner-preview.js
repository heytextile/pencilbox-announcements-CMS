// Pencilbox Banner System - Preview Version
(function() {
  "use strict";
  
  // For preview mode, use current location instead of CDN
  const isPreview = window.location.protocol === 'http:' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );
  
  // Check for test hostname override
  const config = window.PencilboxBannerConfig || { dismissDays: 7 };
  const hostname = config.testHostname || location.hostname;
  const dismissKey = "pb-dismiss-" + hostname;
  
  // In preview mode, don't check for dismissals to make testing easier
  if (!isPreview && !config.previewMode && localStorage.getItem(dismissKey)) {
    console.log('Banner dismissed for', hostname);
    return;
  }
  
  const baseUrl = isPreview ? 
    "." : 
    "https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest";
  
  console.log('Pencilbox Banner: Loading config from', baseUrl, 'for hostname', hostname);
  
  // Fetch banner configuration
  fetch(baseUrl + "/banners.json" + (isPreview ? '?t=' + Date.now() : ''))
    .then(response => {
      console.log('Banner config response:', response.status, response.statusText);
      return response.json();
    })
    .then(bannerConfig => {
      console.log('Banner config loaded:', bannerConfig);
      
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
      
      console.log('Banner URL for', hostname, ':', bannerUrl);
      console.log('Dismiss days for', hostname, ':', dismissDays);
      
      if (!bannerUrl) {
        console.log('No banner configured for hostname:', hostname);
        return;
      }
      
      // If dismissDays is 0 or negative, disable dismissal entirely
      const dismissalEnabled = dismissDays > 0;
      
      // Fetch banner HTML content
      const fullBannerUrl = baseUrl + bannerUrl + (isPreview ? '?t=' + Date.now() : '');
      console.log('Fetching banner from:', fullBannerUrl);
      
      fetch(fullBannerUrl)
        .then(response => {
          console.log('Banner HTML response:', response.status, response.statusText);
          return response.text();
        })
        .then(bannerHtml => {
          console.log('Banner HTML loaded, creating banner...');
          const bannerElement = document.createElement("div");
          bannerElement.className = "pencilbox-banner";

          // Parse HTML to extract scripts safely
          const temp = document.createElement("div");
          temp.innerHTML = bannerHtml;

          // Remove all <script> tags from the HTML string
          const cleanHtml = bannerHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
          const scripts = Array.from(temp.querySelectorAll("script"));

          console.log('Found scripts in banner:', scripts.length);

          // Insert clean HTML + close button
          bannerElement.innerHTML = cleanHtml + '<div class="banner-close">×</div>';
          document.body.appendChild(bannerElement);

          // Show banner
          setTimeout(() => {
            bannerElement.classList.add("show");
            console.log('Banner shown');
          }, 100);

          // Re-inject and execute any scripts that were in the banner
          scripts.forEach((oldScript, index) => {
            console.log('Executing script', index + 1);
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
            console.log('Banner close clicked');
            bannerElement.classList.remove("show");
            setTimeout(() => bannerElement.remove(), 500);
            
            // Only set dismissal if enabled and not in preview mode
            if (!isPreview && dismissalEnabled) {
              localStorage.setItem(dismissKey, Date.now());
              setTimeout(() => localStorage.removeItem(dismissKey), 86400000 * dismissDays);
            }
          };
        })
        .catch(err => {
          console.error("Pencilbox banner load error:", err);
        });
    })
    .catch(err => {
      console.error("Pencilbox config load error:", err);
    });
})();