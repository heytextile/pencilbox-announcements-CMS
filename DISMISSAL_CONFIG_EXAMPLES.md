# Banner Dismissal Configuration Examples

## Overview
The banner system now supports per-client dismissal periods configured in `banners.json`. You have full control over how long banners stay dismissed for each client.

## Configuration Structure

```json
{
  "default": null,
  "defaultDismissDays": 7,
  "clients": {
    "example.com": {
      "banner": "/banners/example-banner.html",
      "dismissDays": 3
    }
  }
}
```

## Configuration Options

### Global Settings
- `defaultDismissDays`: Default dismissal period for all clients (7 days recommended for internal apps)

### Per-Client Settings
- `banner`: Path to the banner HTML file
- `dismissDays`: How long banner stays dismissed after user clicks close button

### Special Values
- `dismissDays: 0`: **Disable dismissal completely** - banner reappears on every page load
- `dismissDays: -1`: **Disable dismissal completely** (alternative syntax)
- `dismissDays: 365`: Essentially "dismiss forever"

## Example Configurations

### 1. Urgent Announcement (Daily)
```json
"urgent-site.com": {
  "banner": "/banners/urgent-update.html",
  "dismissDays": 1
}
```

### 2. Weekly Reminder
```json
"weekly-site.com": {
  "banner": "/banners/weekly-reminder.html",
  "dismissDays": 7
}
```

### 3. Always Show (No Dismissal)
```json
"always-show-site.com": {
  "banner": "/banners/permanent-notice.html",
  "dismissDays": 0
}
```

### 4. Monthly Campaign
```json
"monthly-site.com": {
  "banner": "/banners/monthly-promo.html",
  "dismissDays": 30
}
```

### 5. One-Time Notice
```json
"onetime-site.com": {
  "banner": "/banners/one-time-notice.html",
  "dismissDays": 365
}
```

## Backward Compatibility

Old format still works:
```json
"old-site.com": "/banners/old-banner.html"
```
This will use the `defaultDismissDays` setting.

## Testing Dismissal

To test dismissal behavior locally:
```javascript
// Clear dismissal for testing
localStorage.removeItem('pb-dismiss-hfn.pencilbox.work');

// Check current dismissal status
console.log(localStorage.getItem('pb-dismiss-hfn.pencilbox.work'));
```

## Current Configuration

The HFN site is set to 1-day dismissal for testing purposes:
```json
"hfn.pencilbox.work": {
  "banner": "/banners/hfn-countdown.html",
  "dismissDays": 1
}
```