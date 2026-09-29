# PIXEL ARCADE — Complete Browser Arcade

## Goal
Build a single cohesive, browser-only arcade at `/` with four genuinely playable Canvas games, shared menus, persistent scores/settings, synthesized audio, keyboard/touch controls, and the supplied neon pixel-art reference as the visual benchmark.

## Build plan

### 1. Arcade shell and visual system
- Replace the starter screen with a full-screen state-driven arcade experience: home, game select, gameplay, pause, game over, high scores, settings, and controls.
- Establish the exact supplied palette as semantic design tokens, load Press Start 2P, VT323, and Silkscreen, and add crisp pixel borders, offset shadows, scanlines, vignette, flicker, focus states, and restrained screen transitions.
- Draw an original animated arcade-room home scene and original cabinet previews with CSS/canvas primitives rather than copying the reference artwork.

### 2. Shared browser systems
- Add typed screen/game/settings/score models and a central arcade controller.
- Add localStorage persistence for per-game leaderboards, initials, music/SFX volume, mute, and CRT preference, with safe defaults and sample score rows.
- Add a Web Audio synthesizer for coin, menu, impact, shot, pellet, explosion, line clear, game-over, and high-score cues; unlock it only after interaction.
- Add global keyboard handling, gameplay scroll prevention, fullscreen support, responsive canvas scaling, and practical touch controls.

### 3. Shared game presentation
- Build reusable arcade controls, cabinet cards, HUD, game viewport, pause menu, game-over/name-entry flow, leaderboard tabs, settings controls, and controls reference.
- Each game will expose a small engine contract for start, pause, resume, restart, destroy, input, score/lives updates, and game-over callbacks while keeping animation state outside React.

### 4. Four independent Canvas game engines
- **Pinball:** gravity and velocity integration, wall/rail collisions, launch lane, controllable flippers, bumpers, targets, drain/balls, combo multiplier, particles, scoring, and rising ball speed.
- **Starfighter:** player movement, firing, enemy formations, multiple enemy patterns, diving attacks, enemy shots, collisions, power-ups, waves, lives, explosions, and difficulty scaling.
- **Maze chase:** original tile maze, buffered grid-aware movement, pellets and power cells, four original enemy behaviors, frightened mode, lives, level completion, scoring, and increasing enemy speed.
- **Block stacker:** seven tetrominoes, bag randomization, movement, rotation with wall kicks, gravity, soft/hard drop, hold, next preview, ghost piece, line clears, levels, scoring, particles, and lock/game-over logic.

### 5. Flow and persistence
- Wire every game into pause/resume/restart/settings/exit flows.
- On game over, calculate leaderboard qualification, collect initials, persist the score, then offer replay or return to the arcade.
- Ensure all menus work with keyboard and pointer input, including game selection via arrows and Enter.

### 6. Verification
- Check the generated project health after implementation.
- Exercise home → selection → each game, keyboard input, pause/restart/exit, game-over entry, high-score persistence, settings persistence, mute, CRT toggle, and fullscreen.
- Visually inspect desktop and a smaller viewport for canvas fit, HUD readability, focus visibility, overlap, and horizontal scrolling.

## Technical approach
- Keep TanStack Start’s existing runtime and implement the requested experience as a client-side React screen state machine at `/`; no backend, accounts, APIs, or cloud persistence.
- Use `requestAnimationFrame` with fixed-step-friendly delta clamping in four isolated TypeScript engines under `src/games/`.
- Use Canvas for all live gameplay and sprites; React/CSS handles surrounding cabinet UI and overlays.
- Organize shared code under `src/components/arcade/`, `src/arcade/`, and `src/games/`; avoid adding game libraries.
- Add route-specific title, description, Open Graph, and Twitter metadata for PIXEL ARCADE.
