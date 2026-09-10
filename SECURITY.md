# Security policy

Please report vulnerabilities privately to the repository owner rather than opening a public issue. Include reproduction steps, affected versions, and impact where possible.

## Security boundaries

- The Expo client is untrusted. All authorization belongs in Supabase Row Level Security or server-side functions.
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is a public client identifier. A service-role key must never appear in this repository or app bundle.
- Listing photos are public. Users must be warned not to upload documents, addresses, faces without consent, or other sensitive information.
- Precise geolocation must not be stored or displayed unless a future feature has explicit consent, purpose limitation, and retention controls.
- Messages are visible only to conversation participants under RLS. Product administrators require a separate audited moderation path.
- There are no in-app payments. Anyone requesting deposits, verification codes, or off-platform credentials should be reported.

Before production, test every RLS policy with unauthenticated, buyer, seller, unrelated-user, and administrator roles.

