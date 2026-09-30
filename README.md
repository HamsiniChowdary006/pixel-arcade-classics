# PIXEL ARCADE

PIXEL ARCADE is a browser-based neon retro arcade built with React, TypeScript, Vite, and HTML Canvas. It contains four playable games inside a shared arcade-room experience:

- **Pinball**: physics-driven table with flippers, bumpers, targets, ramps, rollovers, particles, and session statistics.
- **Starfighter**: original fixed-screen space shooter with enemy formations, waves, projectiles, lives, and dives.
- **Maze Runner**: original grid-based maze chase with pellets, power mode, enemies, levels, and lives.
- **Block Stack**: falling-block puzzle game with rotation, line clears, hold, next-piece preview, levels, and hard drop.

The presentation combines pixel typography, CRT scanlines, neon lighting, physical cabinet styling, and an arcade-room environment. The game artwork and sprites are original and do not use ROMs or ripped assets.

## Features

- Home arcade room with neon signs, cabinet silhouettes, reflections, posters, stools, and ambient lighting.
- Interactive Game Select screen with four cabinet-style game machines.
- Keyboard, mouse, and practical touch controls.
- Player setup before each session.
- In-memory session score card with game-specific statistics.
- Pause, restart, game-over, and return-to-arcade flows.
- Settings for music volume, sound effects volume, mute, CRT effect, fullscreen, and controls.
- Web Audio API sound effects and synthesized arcade ambience.
- Settings persisted locally with `localStorage`.
- No backend, accounts, authentication, database, analytics, or external game APIs.

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- A modern browser with Canvas and Web Audio API support

## Clone And Run

Clone the repository and enter its directory:

```bash
git clone https://github.com/HamsiniChowdary006/pixel-arcade-classics.git
cd pixel-arcade-classics
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://127.0.0.1:5173/
```

If that port is already in use, Vite automatically chooses another available port, such as `5174` or `8081`.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

Format the project with Prettier:

```bash
npm run format
```

## How To Play

### Navigation

- `Enter`: select or start
- `Escape`: go back
- `Left` / `Right`: change the selected cabinet
- `P`: pause during gameplay
- `M`: mute or unmute audio

### Pinball

- `A`: left flipper
- `D`: right flipper
- `Space`: launch the ball

Pinball includes gravity, velocity, friction, wall response, bumper collisions, flipper impulses, slingshots, ramps, rollovers, targets, drop targets, a plunger lane, ball drain, combo scoring, and impact feedback.

### Starfighter

- `Left` / `Right`: move
- `Space`: shoot

### Maze Runner

- Arrow keys: move through the maze

### Block Stack

- `Left` / `Right`: move
- `Up`: rotate
- `Down`: soft drop
- `Space`: hard drop
- `C`: hold the current piece

Gameplay controls prevent browser scrolling while a game is active.

## Session And Persistence

Each play session follows this flow:

```text
Home
  -> Game Select
  -> Player Setup
  -> Gameplay
  -> Game Over
  -> Session Score Card
```

The username and score statistics exist only in the current React application state. They are not written to storage and are discarded when a new session replaces them.

`localStorage` is used only for user preferences:

- Music volume
- SFX volume
- Mute state
- CRT effect preference

There are no persistent leaderboards or player profiles.

## Project Structure

```text
src/
  arcade/
    audio.ts              Web Audio synthesizer and sound cues
    storage.ts            Settings-only localStorage helpers
    types.ts              Shared game, screen, and snapshot types
  components/
    arcade/
      ArcadeApp.tsx       React screen flow and overlays
      ArcadeDecor.tsx     Shared arcade-room decoration
      GameCanvas.tsx      Canvas engine mounting and input wiring
      PixelButton.tsx     Shared pixel-style button
  games/
    engine.ts             Shared requestAnimationFrame engine contract
    pinball/              Pinball physics and renderer
    galaga/               Starfighter engine and renderer
    pacman/               Maze Runner engine and renderer
    tetris/               Block Stack engine and renderer
  routes/
    index.tsx             Root route and page metadata
  styles.css              Arcade palette, CRT effects, cabinets, and layout
```

React owns navigation, menus, settings, overlays, and session presentation. Each Canvas engine owns its high-frequency gameplay state, collision work, input state, and rendering loop.

## Technology

- React 19
- TypeScript
- Vite
- TanStack Start and TanStack Router
- HTML Canvas
- Web Audio API
- CSS with pixel-focused responsive styling

## Design And Asset Notes

The visual direction is inspired by classic neon arcades and CRT displays. The project uses original CSS-built cabinet environments, original canvas-rendered sprites and effects, and synthesized audio. It does not include copyrighted arcade ROMs, logos, ripped sprites, or ripped sound effects.

## License

No license file is currently included. Add a license before distributing the repository publicly or using it as a base for a commercial project.