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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest/dist/banner.min.css">
<script src="https://cdn.jsdelivr.net/gh/heytextile/pencilbox-announcements-cms@latest/dist/banner.min.js"></script>
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
├── src/                    # Source files
│   ├── banner.css         # Banner styles
│   └── banner.js          # Banner functionality
├── dist/                  # Built/minified files (served via CDN)
│   ├── banner.min.css     # Minified styles
│   └── banner.min.js      # Minified JavaScript
├── banners/               # Banner HTML templates
│   └── hfn-countdown.html # Example: Countdown banner
├── banners.json           # Client-to-banner mapping
└── package.json           # Build configuration
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

## Development

### Prerequisites
- Node.js installed locally

### Building the Project

```bash
# Install dependencies
npm install

# Build minified files
npm run build

# Build individual files
npm run build:css    # CSS only
npm run build:js     # JavaScript only
```

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