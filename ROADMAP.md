# msale delivery roadmap

## Completed foundation

- [x] Audit the Expo starter and preserve existing EAS configuration
- [x] Upgrade incrementally from Expo SDK 53 to SDK 57
- [x] Remove obsolete type and tunnel dependencies
- [x] Establish responsive design tokens, light/dark themes, and shared UI primitives
- [x] Add English, Bahasa Melayu, and Simplified Chinese localization
- [x] Create the five-tab mobile navigation and responsive content widths
- [x] Add Supabase client selection with a functional no-credentials demo mode
- [x] Add database migration, indexes, triggers, Storage policies, and Row Level Security
- [x] Add lint, typecheck, web export, and CI commands

## Marketplace MVP

- [x] Discover feed, category browsing, search, filters, and sorting
- [x] Listing cards, details, responsive gallery, seller trust signals, and favorites
- [x] Listing creation form with validation and multiple image selection
- [x] Supabase listing writes and image uploads
- [x] Inbox, conversation creation, messages, and Realtime invalidation
- [x] Email/password authentication and profile bootstrapping
- [x] Local-meetup safety messaging
- [ ] Connect a real Supabase project and verify every RLS policy with two test accounts
- [ ] Add profile editing and listing lifecycle controls (edit, reserve, sold, archive)
- [ ] Connect report/block controls to the existing tables
- [ ] Add message read receipts and unread-count RPCs
- [ ] Register and deep-link Expo push notifications

## Production hardening

- [x] Generate branded icon, adaptive icon, splash, and favicon artwork
- [ ] Create final App Store and Play Store listing artwork
- [ ] Add unit tests for repository mapping, filters, validation, and localization
- [ ] Add integration tests for authentication, listing upload, favorites, and conversations
- [ ] Add Maestro end-to-end tests for the primary iOS and Android flows
- [ ] Add Sentry crash reporting and privacy-conscious analytics
- [ ] Add server-side rate limiting and content moderation for listings/messages
- [ ] Build a small authenticated moderation console for reports
- [ ] Validate accessibility with VoiceOver/TalkBack, larger text, contrast, and reduced motion
- [ ] Test poor connectivity, offline transitions, retries, and large image uploads
- [ ] Test low-end Android feed and chat performance in release builds
- [ ] Complete privacy policy, terms, community rules, and account-deletion flow
- [ ] Run preview builds on physical iOS and Android devices

## Release gate

- [ ] No service-role or private credentials in the client bundle or Git history
- [ ] RLS enabled and adversarially tested on every user-data table
- [ ] Public listings reveal area only, never precise user coordinates
- [ ] Image MIME type, dimensions, size, and moderation are enforced
- [ ] Reports can be triaged and abusive accounts can be suspended
- [ ] Account deletion removes or anonymizes data according to policy
- [ ] App identifiers, signing credentials, domains, and support contacts are final
- [ ] App Store and Play Store privacy forms match actual behavior
- [ ] Production monitoring and rollback ownership are assigned
