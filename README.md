# Abfallfibel - Waste Disposal Guide

A simple web application to search and view waste disposal information.

## Local Testing

Due to browser security restrictions, you cannot open the HTML file directly. Use one of these methods:

### Option 1: Python (Recommended)
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

### Option 2: Node.js
```bash
npx http-server
```
Then open the URL shown in the terminal.

### Option 3: VS Code Live Server
If using VS Code, install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

## GitHub Pages Deployment

1. Push both `index.html` and `waste_disposal_data.json` to your GitHub repository
2. Go to Settings → Pages
3. Select source: "Deploy from a branch"
4. Select branch: "main" (or your default branch)
5. Select folder: "/ (root)"
6. Save and wait a few minutes
7. Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Features

- Fuzzy search by waste item name
- Clear button to reset search
- Responsive table design
- Visual indicators for disposal methods
- Special waste warnings