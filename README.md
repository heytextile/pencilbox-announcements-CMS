# Pencilbox Banner System

A CDN-powered, client-specific banner engine for displaying announcements across Pencilbox websites. This system dynamically loads and displays customizable banners based on the hostname of the visiting website.

## How It Works

The banner system automatically:
1. Detects the current website's hostname
2. Fetches banner configuration from this repository via CDN
3. Loads the appropriate banner HTML for that client
4. Displays the banner with smooth animations
5. Handles user dismissal with configurable persistence

## Quick Integration

Add these two lines to any website to enable banners:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest/src/banner.css">
<script src="https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest/src/banner.js"></script>
```

### Optional Configuration

```javascript
// Configure banner behavior (optional)
window.PencilboxBannerConfig = {
  dismissDays: 7  // How many days to remember dismissal (default: 30)
};
```

## Project Structure

```
├── src/                   # Source files (served via CDN)
│   ├── banner.css         # Banner styles
│   └── banner.js          # Banner functionality
├── banners/               # Banner HTML templates
│   └── hfn-countdown.html # Example: Countdown banner
├── banners.json           # Client-to-banner mapping
└── package.json           # Project configuration
```

## Adding a New Client Banner

1. **Create banner HTML** in the `banners/` directory
2. **Update `banners.json`** to map the hostname to your banner file
3. **Rebuild** the project to update CDN files

Example `banners.json` entry:
```json
{
  "clients": {
    "yoursite.com": "/banners/your-banner.html"
  }
}
```

## Development & Deployment

### Prerequisites
- Node.js installed locally (for preview server only)

### 🚀 Simple Deployment Workflow

#### 1. Make Changes
Edit your files:
- `src/banner.css` - Banner styles
- `src/banner.js` - Banner functionality  
- `banners.json` - Client configuration
- `banners/*.html` - Banner templates

#### 2. Commit & Deploy
1. **Commit all changes** via GitHub Desktop
2. **Push to GitHub**
3. **Done!** - Changes are live immediately via CDN

### Local Development
```bash
npm run dev          # Start local server on :8080
```
Then visit `http://localhost:8080/preview.html` to test banners locally.

### ✅ Benefits of This Approach
- **No build step** - What you see is what you get
- **Immediate deployment** - Commit and go live
- **Easy debugging** - Readable source code
- **No cache issues** - Direct source files

### Banner HTML Guidelines

- Use inline styles (external CSS won't be loaded)
- Keep it lightweight for fast loading
- Include interactive elements as needed
- The close button is automatically added

Example banner:
```html
<div style="background:#333;color:#fff;padding:20px;text-align:center;">
  <h3>Special Announcement!</h3>
  <p>Your important message here.</p>
</div>
```

## Features

- **CDN-powered**: Fast global delivery via jsDelivr
- **Client-specific**: Different banners per hostname
- **Dismissible**: Users can close banners with configurable persistence
- **Animated**: Smooth slide-in/out transitions
- **Lightweight**: Minimal impact on page load times
- **No dependencies**: Pure vanilla JavaScript

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-banner`)
3. Make your changes
4. Test your banner thoroughly
5. Update documentation if needed
6. Submit a pull request

## License

MIT - See [LICENSE](LICENSE) file for details