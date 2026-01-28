# Cook Pot

Mobile-first social app for cooking content only (videos, photos, structured recipes). No monetization. Minimal, calm, food-first UI.

## Phase 0 — Foundation

- **Stack:** React Native (Expo), TypeScript, React Navigation (native stack)
- **Theme:** `src/theme` — colors, typography, spacing (design system locked)
- **Screens:** Home (dummy cooking cards), Create (placeholder), Profile (placeholder)
- **Components:** `Button`, `CookingCard`, `Tag` in `src/components`
- No backend, no business logic, no feature creep

### Design system

| Role | Color | Hex |
|------|--------|-----|
| Backgrounds | Off-White / Light Mint | `#F0F0D7` / `#D0DDD0` |
| Primary (buttons, accents) | Dark Green | `#727D73` |
| Secondary (tags, etc.) | Sage Green | `#AAB99A` |

Typography: system fonts only (SF Pro / Roboto).

### Run the app

1. Fix npm cache if needed: `sudo chown -R $(whoami) ~/.npm`
2. Install: `npm install`
3. Start: `npm start` then press `i` (iOS) or `a` (Android) or open in Expo Go

### Project layout

```
src/
  theme/       # colors, typography, spacing
  navigation/  # Root stack (Home, Create, Profile)
  screens/     # HomeScreen, CreateScreen, ProfileScreen
  components/  # Button, Card, Tag
```

Do not move to Phase 1 until this structure is clean and reusable.
