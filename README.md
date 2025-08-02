# Focus Lock Extension

A Firefox extension that helps you stay focused by blocking distracting sites during focus time.

## Development

### Prerequisites
- Node.js 14.0.0 or higher

### Building for Distribution

The extension includes a build script that creates a clean distribution folder with only the necessary files for Firefox submission.

#### Option 1: Using npm scripts (recommended)
```bash
# Build the distribution
npm run build

# Clean the dist folder
npm run clean

# Build and create a zip file ready for submission
npm run zip
```

#### Option 2: Direct Node.js execution
```bash
# Build the distribution
node build.js
```

### Project Structure
```
now/
├── src/                    # Source files
│   ├── manifest.json
│   ├── background.js
│   ├── privacy-policy.html
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   └── popup/
│       ├── popup.html
│       ├── popup.css
│       └── popup.js
├── dist/                   # Built distribution (generated)
├── build.js               # Build script
├── package.json           # NPM configuration
└── README.md              # This file
```

### What the build script does:

1. **Reads from `src/` folder** and creates a clean `dist/` folder
2. **Excludes development files** like:
   - `.DS_Store`
   - `generate-icons.html`
   - `.git` folder
   - `build.js`
   - `publish-todo.md`
   - `store-listing.md`
3. **Includes all required files**:
   - `manifest.json`
   - `background.js`
   - `privacy-policy.html`
   - `icons/` directory (all PNG files)
   - `popup/` directory (HTML, CSS, JS files)

### Distribution Structure
```
dist/
├── manifest.json
├── background.js
├── privacy-policy.html
├── icons/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
└── popup/
    ├── popup.html
    ├── popup.css
    └── popup.js
```

## Firefox Submission

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Zip the dist folder**:
   ```bash
   npm run zip
   ```
   This creates `focus-lock-extension.zip` in the project root.

3. **Upload to Firefox Add-ons**:
   - Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
   - Upload the `focus-lock-extension.zip` file
   - Fill in the required metadata and descriptions
   - Submit for review

## Development Notes

- The extension uses Manifest V2 (required for Firefox compatibility)
- All blocking functionality is handled in `background.js`
- The popup interface is in the `popup/` directory
- Icons are in multiple sizes for different contexts
- Privacy policy is included as required by Firefox

## Version History

- **v2.0**: Current version with improved UI and functionality 