# msale

**Good things, nearby.** msale is a mobile-first peer-to-peer marketplace for Malaysia. People can discover pre-loved items, publish listings, save finds, and arrange safe local meetups over chat. There are no payments, deposits, or shipping flows in the product.

The interface ships in English, Bahasa Melayu, and Simplified Chinese, with automatic device-language selection and an in-app language switcher.

## What is included

- Responsive Discover and Search feeds with categories, condition, state, and sort filters
- Warm editorial light and dark themes
- Listing details, image galleries, favorites, profiles, ratings, and meetup guidance
- Guided listing creation with multi-image picking and validation
- Inbox and real-time-ready conversations
- Supabase email/password authentication
- PostgreSQL schema, indexes, Storage bucket, triggers, and Row Level Security policies
- Safe demo mode when Supabase variables are absent
- EAS build profiles for development, preview, and production
- CI checks for linting and TypeScript

## Stack

- Expo SDK 57, React Native 0.86, React 19, Expo Router
- TypeScript 6 in strict mode
- Supabase Database, Auth, Storage, and Realtime
- TanStack Query for server state and optimistic updates
- React Hook Form and Zod for listing validation
- FlashList for efficient marketplace feeds
- Expo Image, Image Picker, Crypto, Location, Notifications, Secure Store, and Localization
- Reanimated and haptics for native interaction polish

## Quick start

Metro requires one of the Node versions declared in `package.json`. Node 22 or a newer supported release is recommended. `nvm` is optional and is not required to run msale.

If the `node --version` command does not work, install Node directly from [nodejs.org](https://nodejs.org/) or with Homebrew:

```bash
brew install node
node --version
npm --version
```

Install the project dependencies:

```bash
cd /Users/macbookairm2/Documents/Projects/msale
npm install
```

The app starts in demo mode when no environment file exists. Demo mode is intentionally functional: browsing, search, favorites, publishing, inbox, and chat all work in memory without touching a backend.

## Run on an iPhone Simulator

Xcode and an iOS Simulator runtime are required. For the first build, run:

```bash
cd /Users/macbookairm2/Documents/Projects/msale
npx expo run:ios
```

This creates or updates the native iOS project, builds it, installs it, and opens it in Apple's iPhone Simulator. The first build can take several minutes.

For normal development after the first build, start Metro with:

```bash
cd /Users/macbookairm2/Documents/Projects/msale
npx expo start --dev-client
```

Keep that Terminal window open and press `i` to open the installed app in the iPhone Simulator. When Metro is already running, save a source file to refresh the app or press `r` in the Terminal to reload it.

If Xcode reports that the required iOS Simulator platform is missing, open **Xcode → Settings → Components**, install the iOS Simulator version matching the installed Xcode SDK, and run `npx expo run:ios` again. If CocoaPods is missing, install it with:

```bash
brew install cocoapods
```

## Run on a physical iPhone

The App Store version of Expo Go cannot open this Expo SDK 57 project. A QR code shown by a normal Expo Go session may remain on “Opening project” or report an SDK mismatch. Install msale as a development build instead:

1. Connect the iPhone to the Mac with a cable, unlock it, and tap **Trust This Computer**.
2. Enable **Settings → Privacy & Security → Developer Mode** on the iPhone if prompted.
3. Run the following command and select the physical iPhone:

```bash
cd /Users/macbookairm2/Documents/Projects/msale
npx expo run:ios --device
```

If Xcode reports a signing error, open the generated workspace:

```bash
open ios/msale.xcworkspace
```

In Xcode, select the **msale** target, open **Signing & Capabilities**, and choose your Apple ID or Personal Team under **Team**. Select the connected iPhone as the destination and click the Run button. A free Apple ID is sufficient for local development, although its development installation may need to be renewed periodically.

After msale is installed on the iPhone, keep the Mac and iPhone on the same Wi-Fi network and start Metro whenever you want to use the development build:

```bash
npx expo start --dev-client
```

Open the msale app on the iPhone. If it does not find Metro automatically, scan the development-client QR code displayed by this command—not a normal Expo Go QR code.

## Common startup errors

### `Unknown command: expo`

Use `npx expo`, not `npm expo`:

```bash
npx expo start --dev-client
```

If `npx` still cannot find Expo, install dependencies and invoke the local binary directly:

```bash
npm install
./node_modules/.bin/expo start --dev-client
```

### `No script URL provided`

The native app is installed, but Metro is not running or the app was opened without its development URL. Start Metro, keep the Terminal open, and press `i`:

```bash
npx expo start --dev-client --clear
```

### The iPhone stays on `Opening project`

Do not open this SDK 57 project in the App Store version of Expo Go. Use the physical-iPhone development-build instructions above. Also confirm that the Mac and iPhone are on the same Wi-Fi network and that no VPN or firewall is blocking local-network access.

For web, run `npm run web`. For Android, run `npm run android` with an emulator or connected Android device.

## Connect Supabase

1. Create a Supabase project in a region appropriate for Malaysian users.
2. Copy `.env.example` to `.env`.
3. In Supabase Dashboard → Project Settings → API, copy the project URL and publishable key into `.env`.
4. Apply `supabase/migrations/202609100001_initial_marketplace.sql` with the SQL editor, or with the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

5. In Authentication → URL Configuration, add `msale://**` and the development/production web URLs you use.
6. Enable email confirmation for production. Add Apple and Google providers later if desired.
7. Restart Metro after adding or changing environment variables:

```bash
npx expo start --clear
```

Only the publishable client key belongs in the app. Never add a Supabase service-role key to an Expo environment variable. Data access is protected by the migration's Row Level Security policies.

## Project structure

```text
app/                    Expo Router screens and navigation
components/             Reusable design-system and marketplace components
constants/              Color, spacing, radius, shadow, and type tokens
data/                   Safe local demo fixtures
hooks/                  Query and presentation hooks
lib/                    Supabase, localization, and formatting utilities
providers/              Authentication state
services/               Supabase and demo repository implementations
supabase/migrations/     Database and security source of truth
types/                  Domain models
```

The UI talks to the `MarketplaceRepository` interface. At startup the app selects the Supabase repository when both required environment variables exist; otherwise it selects the in-memory demo repository. Screens do not need backend-specific conditionals.

## Quality checks

```bash
npm run check
npm run doctor
npm run export:web
```

Do not use `npm audit fix --force` blindly in an Expo project; it can replace SDK-pinned native modules with incompatible versions. Review production dependency findings and upgrade through Expo-supported releases.

## Production builds

The repository already contains EAS configuration and an Expo project ID. Confirm that the EAS project belongs to the intended Expo account before releasing.

```bash
npx eas-cli@latest login
npx eas-cli@latest build --profile preview --platform all
npx eas-cli@latest build --profile production --platform all
```

Before store submission:

- Create the remaining App Store and Play Store screenshots and listing artwork.
- Confirm the unique iOS bundle identifier and Android application ID.
- Supply localized App Store and Play Store privacy disclosures.
- Configure push credentials and test notification deep links on physical devices.
- Run the manual release checklist in `ROADMAP.md`.

## Safety and privacy

msale only stores approximate listing areas in the public UI. Do not expose a user's precise coordinates. The product repeatedly advises public-place meetups, inspection before payment, and never sending deposits or verification codes. Reports and blocks are represented in the production schema and should be connected to a moderation dashboard before public launch.
