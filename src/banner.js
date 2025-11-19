// Pencilbox Banner System
(function() {
  "use strict";
  
  const hostname = location.hostname;
  const dismissKey = "pb-dismiss-" + hostname;
  
  // Check if banner was previously dismissed
  if (localStorage.getItem(dismissKey)) return;
  
  // Get configuration or use defaults
  const config = window.PencilboxBannerConfig || { dismissDays: 30 };
  const baseUrl = "https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest";
  
  // Fetch banner configuration
  fetch(baseUrl + "/banners.json")
    .then(response => response.json())
    .then(bannerConfig => {
      // Get banner URL for current hostname or default
      const bannerUrl = bannerConfig.clients[hostname] || bannerConfig.default;
      
      if (!bannerUrl) return;
      
      // Fetch banner HTML content
      fetch(baseUrl + bannerUrl)
        .then(response => response.text())
        .then(bannerHtml => {
          // Create banner element
          const bannerElement = document.createElement("div");
          bannerElement.className = "pencilbox-banner";
          bannerElement.innerHTML = bannerHtml + '<div class="banner-close">×</div>';
          
          // Add banner to page
          document.body.appendChild(bannerElement);
          
          // Show banner with animation
          setTimeout(() => bannerElement.classList.add("show"), 100);
          
          // Handle close button
          bannerElement.querySelector(".banner-close").onclick = () => {
            bannerElement.classList.remove("show");
            setTimeout(() => bannerElement.remove(), 500);
            localStorage.setItem(dismissKey, Date.now());
            setTimeout(() => localStorage.removeItem(dismissKey), 86400000 * config.dismissDays);
          };
        });
    });
})();