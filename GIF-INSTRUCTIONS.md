# Adding Your Falling Leaves GIF

To use your actual falling leaves GIF animation instead of the CSS fallback:

1. Save your falling leaves GIF file as: `banners/falling-leaves.gif`

2. Update the Thanksgiving banner to use the GIF by replacing line 25 in `banners/thanksgiving-2025.html`:

Change from:
```javascript
// Set up the animation sequence
setTimeout(() => {
  const overlay = document.getElementById('thanksgiving-overlay');
  
  // Fade in the overlay
  overlay.style.opacity = '1';
```

To:
```javascript
// Set up the animation sequence  
setTimeout(() => {
  const overlay = document.getElementById('thanksgiving-overlay');
  
  // Set background to your GIF
  overlay.style.background = 'url("https://pencilbox-announcements-cms.vercel.app/banners/falling-leaves.gif")';
  overlay.style.backgroundSize = 'cover';
  overlay.style.backgroundPosition = 'center';
  overlay.style.backgroundRepeat = 'no-repeat';
  
  // Fade in the overlay
  overlay.style.opacity = '1';
```

The CSS fallback with emoji leaves will work great for now, but using your actual GIF will look even better!