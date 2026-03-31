# Contributing to Kite Windows App

Thanks for your interest in contributing.

## Development setup
1. Fork the repository and clone your fork.
2. Install dependencies: `npm install`
3. Start development mode: `npm run dev`
4. Run lint checks: `npm run lint`
5. Build locally before opening a PR: `npm run build-win`

## Pull request checklist
- Keep changes scoped and focused.
- Update or add documentation for user-facing changes.
- Verify no generated build artifacts are committed from `build/`, `dist-electron/`, or `releases/`.
- Ensure the app still launches and the core split-view/login flow works.

## Branching and commits
- Create feature branches from `main`.
- Use clear commit messages that explain intent.
- Open PRs from your fork to the upstream repository.

## Reporting issues
When filing bugs, include:
- OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or logs when possible