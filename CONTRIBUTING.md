# Contributing to msale

Thanks for helping make local exchange safer, calmer, and more useful for communities in Malaysia.

## Before you begin

- Search existing issues before opening a new one.
- Use public issues for bugs and feature proposals, not security disclosures.
- Follow the private reporting process in `SECURITY.md` for vulnerabilities.
- Never include API keys, private conversations, precise user locations, or other personal data in an issue or screenshot.

## Local development

```bash
git clone https://github.com/sambalbalado/msale.git
cd msale
npm install
npm start
```

No backend account is required. Without a `.env` file, msale automatically uses its functional in-memory demo repository.

## Making a change

1. Fork the repository and create a focused branch from `main`.
2. Keep changes small enough to review and avoid unrelated formatting rewrites.
3. Follow the existing TypeScript, component, theme-token, and repository patterns.
4. Add or update English, Bahasa Melayu, and Simplified Chinese translations for user-facing text.
5. Preserve demo mode unless the change is explicitly backend-only.
6. Run `npm run check` and `npm run doctor`.
7. Test the affected flow on at least one supported platform.

## Commit and pull request style

Use clear, imperative commits. Conventional prefixes are encouraged: `feat:`, `fix:`, `design:`, `refactor:`, `docs:`, `test:`, and `chore:`.

A pull request should explain the user problem, summarize the solution, list verification performed, and include before/after visuals for interface changes. Note any database migration, environment-variable, privacy, accessibility, or localization impact.

## Product guardrails

- msale is for local discovery, direct chat, and meetup coordination.
- Do not introduce deposits, in-app payments, or shipping flows without an explicit product decision.
- Do not expose precise user coordinates in public surfaces.
- Keep safety guidance visible in transactional moments.
- Design mobile-first and verify layouts at narrow and wide widths.

By contributing, you agree that your contributions will be licensed under the MIT License.
