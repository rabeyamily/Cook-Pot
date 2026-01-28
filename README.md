# Cook Pot

A mobile-first social app for **cooking content only** — videos, photos, and structured recipes. No monetization, no gamification, no analytics. Minimal, calm, food-first UI.

---

## App purpose

Cook Pot lets people share and discover home cooking through recipes and short-form media. Every post is a recipe with ingredients and steps; content is organized by **Cooking Spaces** (cuisine, lifestyle, or context) instead of hashtags. The app encourages experiments, remixes, and hands-only filming so creation stays low-pressure and inclusive.

---

## Design philosophy

- **Food-first:** Visuals and layout put the dish and recipe first.
- **Calm and quiet:** No flashy transitions, no vanity metrics, no growth mechanics.
- **Optional everything:** Hands-only mode, voice-over, filming assists, and accessibility options are all optional.
- **Backend-ready:** Data models use clear typing and ISO timestamps so a future API can plug in without redesign.
- **Accessibility:** Larger text, high-contrast mode, and clear touch targets (44pt minimum) are supported.

---

## Feature overview by phase

| Phase | Scope |
|-------|--------|
| **0** | Foundation: Expo, TypeScript, theme (colors, typography, spacing), navigation, Button/Card/Tag. |
| **1** | Auth: mock login/signup, profile, AsyncStorage persistence. |
| **2** | Posts & recipes: Post/RecipeCard model, create flow, feed, post detail, step-synced video placeholder. |
| **3** | (Skipped) |
| **4** | Pantry & Cook This: save to pantry, shopping list from recipe, scale servings, copy/share list. |
| **5** | Cooking Spaces: Space model, Spaces directory, space feeds, space selection in create. |
| **6** | Engagement: reactions (flavor, presentation, creativity, practicality), comments, I Cooked This. |
| **7** | Experiments & remixes: isExperiment, parentPostId, Remix flow, attribution (Inspired by). |
| **8** | Creation comfort & accessibility: hands-only mode (default on), filming assists (angle grid, lighting, stability), audio options (muted/voice-over), supportive copy, larger text, high contrast. |
| **9** | Stabilization: constants, empty states, edge cases (missing media, empty lists), demo mode, documentation. |

---

## Tech stack

- **React Native (Expo)** — cross-platform
- **TypeScript** — typed models and UI
- **React Navigation** — native stack, auth vs main app
- **AsyncStorage** — local persistence (auth, settings, pantry, engagement)
- **No backend** — all data is in-memory + AsyncStorage; models are API-ready

---

## Design system (Phase 0)

| Role | Color | Hex |
|------|--------|-----|
| Backgrounds | Off-White / Light Mint | `#F0F0D7` / `#D0DDD0` |
| Primary (buttons, accents) | Dark Green | `#727D73` |
| Secondary (tags, etc.) | Sage Green | `#AAB99A` |
| Text | Near-black / Muted | `#2C2C2C` / `#5C5C5C` |
| Border | Sage tint | `#C0C8B8` |

Typography: system fonts only (SF Pro / Roboto). No custom fonts.

---

## Project layout

```
src/
  constants/   # STORAGE_KEYS, COPY, MIN_TOUCH_TARGET
  theme/       # colors, typography, spacing, ThemeContext (a11y)
  models/      # user, post, space, pantry, engagement (backend-ready)
  state/       # Auth, Settings, Posts, Pantry, Engagement
  navigation/  # RootNavigator, AuthStack, RootStack
  screens/     # Home, Create, Profile, Discovery, Pantry, Cook, Spaces, SpaceFeed, PostDetail, RemixBuilder, auth
  components/  # Button, CookingCard, Tag, PostCard
  utils/       # postFilters (discovery)
```

---

## Run the app

1. **Install:** `npm install`
2. **Start:** `npm start`
3. **Run:** Press `i` (iOS), `a` (Android), or open in Expo Go.

Optional: fix npm cache if needed: `sudo chown -R $(whoami) ~/.npm`

---

## Demo mode

In **Profile → Demo mode**, turn on **Demo data** for presentations:

- A banner appears on Home: *Demo mode – changes are not saved.*
- Log out is disabled so the session stays stable.
- Sample posts are already loaded; no backend required.

---

## MVP status

After Phase 9, feature development is **complete**. The app is considered **MVP-final** and demo-ready.
