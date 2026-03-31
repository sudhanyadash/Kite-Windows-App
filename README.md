# Kite Windows App

<p align="center">
  <img src="assets/icon.png" alt="Kite Windows logo" width="96" />
</p>

A multi-pane desktop shell for Zerodha Kite, built with Electron + React.

## Why this app exists
Kite Windows helps active traders view multiple Kite pages at once without constant tab switching.

## Key features
- Multi-pane split layout with horizontal and vertical splits
- Bookmark-friendly, persistent workspace behavior
- Local-first layout persistence through Electron Store
- Portable Windows build support

## Getting started (users)
1. Go to the GitHub Releases page for this repository.
2. Download the latest Windows portable executable from the latest release assets.
3. Run the executable and log in with your Kite account.

## Getting started (developers)
```bash
npm install
npm run dev
```

Useful scripts:
- `npm run lint` - Lint app code
- `npm run build` - Build renderer assets into `build/`
- `npm run build-win` - Build renderer + package app into `releases/`

## Repository structure
- `app/` - Electron main/preload and React renderer source
- `assets/` - App icon and static brand assets
- `build/` - Generated renderer build output (kept as a tracked folder)
- `releases/` - Generated packaged artifacts (kept as a tracked folder)
- `docs/product/` - Product documentation (PRD and technical spec)
- `public/` - Static files served by Vite

## Documentation
- Product requirements: `docs/product/Kite_PRD.md`
- Technical spec: `docs/product/Kite_Spec.md`
- Contribution guide: `CONTRIBUTING.md`

## Contributing
Please read `CONTRIBUTING.md` before opening a pull request.

## Support
- Issues: [GitHub Issues](https://github.com/sudhanyadash/Kite-Windows-App/issues)

built with <3 by Sudhanya