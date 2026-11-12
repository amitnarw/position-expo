# FORMA

**An atlas of closeness.**

FORMA is an illustrated, educational field guide to intimacy for adults — thirty-six abstract
contour plates, eight short guides, and six curated paths. It is quiet, plain-spoken, and
non-explicit by design: every plate is a line drawing you read rather than a picture you look at.

Built with Expo, React Native, Expo Router, NativeWind and Skia. Runs in Expo Go.

---

## What it is

- **36 plates** — abstract line studies, each with a plain-language name, a short setup, steps to
  arrive, a note on why the shape works, small adjustments, and a care note.
- **8 guides** — consent, communication, anatomy, pace, comfort, lubricant, aftercare, and what to
  do when something goes wrong.
- **6 collections** — curated paths for slower, closer, or more playful evenings.
- **Saved and history** — kept on the device only.

## What it is not

- Not explicit. No photography, no realistic nudity — contour lines only.
- Not medical advice, therapy, or a substitute for talking to your partner or a clinician.
- Not a scoreboard. There are no achievements, streaks, or goals.
- Not networked for content. There is no account and no FORMA server. Your
  favourites and history stay on your device.

## Privacy

FORMA stores everything in a local SQLite key-value database on your device: your age-gate
confirmation, onboarding answers, appearance settings, saved plates, and recently opened plates.
Nothing leaves the device. There is no sign-in, no crash reporting, and no network
calls to a FORMA backend. Clearing the app data — or **Settings → Reset everything** — removes all
of it.

## Advertising

FORMA is ad-supported to fund development. Banners may appear on the Atlas and Learn screens, and
occasional full-screen interstitials may show at natural breaks. You can turn ads off in
**Settings → About → Allow advertising**.

Ad networks may receive a device/advertising identifier and limited device information to serve
and measure ads. Personal app data (plates viewed, favourites, history) is not shared with ad
networks. During development, test ads are used and no revenue is generated. Ad requests are
marked as not child-directed and not under the age of consent; the store listing is rated 18+.

## Running it

```bash
npm install
npx expo start        # open in Expo Go
npx tsc --noEmit      # typecheck
npx expo-doctor       # dependency and config checks
npx expo export --platform ios   # production bundle check
```

All native modules used here ship inside the Expo Go client for the current SDK (Skia, Reanimated,
Gesture Handler, Screens, SQLite), so no development build is required.

## Project layout

```
src/app/            file-based routes (Expo Router)
  (tabs)/           Today · Atlas · Learn · Saved
  plate/[slug]      plate detail (modal)
  guide/[slug]      guide detail (modal)
  collection/[slug] collection detail (modal)
src/art/            pose geometry + scene cache
src/components/     UI primitives, plate cards, nav, editorial blocks
src/content/        36 positions, 8 guides, 6 collections
src/store/          local settings + library persistence
src/theme/          tokens, theme provider, fonts, scale
scripts/            art QA sheets and brand asset generation
```

See `HANDOFF.md` for the deeper architectural notes, the art-engine explanation, and the
verification checklist.

## Design

Quiet Heat: bone paper, ink, a single clay accent; Fraunces for display, Geist for interface;
hairlines instead of shadows; generous margins; sentence case throughout. The app ships light and
dark palettes and four accent editions (clay, sage, plum, ochre).

## Age

FORMA is intended for adults (18+). An age gate runs before anything else is shown, and nothing is
stored until it is confirmed.

## License

See `LICENSE`.
