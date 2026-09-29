# Pixel Arcade Classics

BUILD A COMPLETE BROWSER-BASED RETRO PIXEL-ART ARCADE.

This is a complete fun project, not a landing page, not a UI prototype, and not a collection of static mockups.

The final application should feel like a polished nostalgic arcade machine that exists inside the browser.

The arcade contains FOUR ACTUALLY PLAYABLE GAMES:

1. PINBALL
2. GALAGA-STYLE SPACE SHOOTER
3. PAC-MAN-STYLE MAZE GAME
4. TETRIS

The attached reference image is the PRIMARY visual and artistic reference for the entire project.

Use the attached image to understand:

- Pixel-art quality
- Arcade atmosphere
- Neon colors
- CRT aesthetic
- Pixel typography
- Arcade cabinet presentation
- Game-selection UI
- Game HUDs
- Game-over screens
- High-score screens
- Settings
- Pixel-art sprites
- Lighting
- Glow
- Decorative details
- Overall visual density

Do NOT simply copy the image.

Create original pixel-art assets inspired by the same visual language.

Do NOT use copyrighted original game sprites, ROMs, sounds, logos, or ripped assets.

==================================================
CORE PRODUCT
==================================================

The product is called:

PIXEL ARCADE

The experience should feel like entering an old-school arcade.

The user should be able to:

OPEN ARCADE
↓
ARCADE HOME
↓
SELECT GAME
↓
PINBALL / GALAGA / PAC-MAN / TETRIS
↓
PLAY
↓
PAUSE
↓
GAME OVER
↓
ENTER HIGH SCORE
↓
HIGH SCORES
↓
RETURN TO ARCADE

Also include:

SETTINGS

The entire experience should feel like one cohesive arcade machine.

==================================================
TECH STACK
==================================================

Use:

- React
- TypeScript
- Vite
- HTML Canvas for actual game rendering
- CSS for UI
- localStorage for persistence
- Web Audio API and/or local audio assets

Do NOT use:

- Backend
- Database
- Authentication
- User accounts
- Supabase
- Firebase
- API keys
- OpenAI APIs
- Gemini APIs
- External game APIs
- Payment systems
- Analytics
- Cloud services

The project must work entirely in the browser.

No login is required.

No server-side persistence is required.

Keep the project lightweight.

==================================================
VISUAL DESIGN
==================================================

The entire application must use:

RETRO PIXEL ART + CRT + NEON ARCADE

The visual quality should resemble a polished 16-bit / early-arcade-inspired game rather than a modern website.

Use:

- Dark backgrounds
- Deep purple/navy surfaces
- Neon cyan
- Neon pink
- Arcade yellow
- Bright green
- Red
- Purple
- Cream pixel text
- Chunky pixel borders
- Pixel shadows
- Pixel-art icons
- Pixel-art sprites
- CRT scanlines
- Subtle screen glow
- Pixel particles
- Arcade cabinet framing
- Game-specific accent colors
- Animated arcade details

The UI should feel colorful, dense, tactile, nostalgic, and alive.

Avoid:

- Modern SaaS UI
- Corporate dashboards
- Material Design
- Bootstrap-looking components
- Glassmorphism
- Excessive rounded cards
- Soft modern shadows
- Generic gradients
- Minimal corporate layouts
- Huge empty whitespace
- Generic HTML buttons

Prefer:

- Hard rectangular edges
- Pixel borders
- Pixel shadows
- Offset shadows
- Neon outlines
- Small decorative details
- Arcade-style menus
- CRT effects

==================================================
COLOR PALETTE
==================================================

Use this palette consistently:

VOID BLACK:
#07060D

DEEP SURFACE:
#100D18

SECONDARY SURFACE:
#181226

CREAM:
#EBEBD1

CYAN:
#1AF2FF

PINK:
#FF2E94

YELLOW:
#FFD83C

GREEN:
#4DFF73

RED:
#FF5A4F

PURPLE:
#7D5CFF

Do not randomly introduce many additional colors.

Use these game-specific accent colors consistently:

PINBALL → PINK
GALAGA → CYAN
PAC-MAN → YELLOW
TETRIS → GREEN

==================================================
TYPOGRAPHY
==================================================

Use pixel-style fonts if available.

Preferred:

Press Start 2P:
- Main logo
- Major headings
- Game titles
- Important buttons

VT323:
- Scores
- Large numbers
- HUD
- Numeric displays

Silkscreen:
- Small labels
- Controls
- Status information
- Secondary text

Typography should be:

- Pixelated
- Bold
- Compact
- Readable
- Mostly uppercase

==================================================
ARCADE HOME
==================================================

Create a full arcade home screen.

It should feel like an arcade room/cabinet rather than a normal website.

Main branding:

PIXEL
ARCADE

Main options:

INSERT COIN

PLAY

HIGH SCORES

SETTINGS

EXIT

Include pixel-art environmental decoration such as:

- Arcade machines
- Neon signs
- Floor reflections
- Small plants/decor
- Pixel lights
- Decorative game posters
- Small animated details

Do not make the background so busy that the navigation becomes difficult to read.

Include:

CREDITS 03

The "INSERT COIN" text can blink subtly.

==================================================
GAME SELECT
==================================================

Create a dedicated game selection screen.

Show four arcade machines/cards:

PINBALL
GALAGA
PAC-MAN
TETRIS

Each game should have:

- Game title
- Pixel-art preview
- Genre
- 1 PLAYER
- Unique accent color
- Selection state

Example:

PINBALL
PHYSICS
1 PLAYER

GALAGA
SHOOTER
1 PLAYER

PAC-MAN
MAZE
1 PLAYER

TETRIS
PUZZLE
1 PLAYER

The selected game should have:

- Brighter neon border
- Pixel shadow
- Glow
- Arrow/selector indicator
- Slight animation

Controls:

LEFT / RIGHT = SELECT
ENTER = PLAY
ESC = BACK

==================================================
GLOBAL NAVIGATION
==================================================

Create arcade-style transitions between:

HOME
GAME SELECT
GAMEPLAY
PAUSE
GAME OVER
HIGH SCORES
SETTINGS

Do not require a full page reload when changing screens.

Use React state/routing appropriately.

==================================================
GLOBAL CONTROLS
==================================================

ENTER
Start / Select

ESC
Back / Exit

P
Pause

M
Mute / Unmute

PINBALL:

A
Left flipper

D
Right flipper

SPACE
Launch ball

GALAGA:

LEFT / RIGHT
Move

SPACE
Shoot

PAC-MAN:

ARROW KEYS
Move

TETRIS:

LEFT / RIGHT
Move

UP
Rotate

DOWN
Soft drop

SPACE
Hard drop

Prevent browser scrolling while gameplay controls are active.

==================================================
GAMEPLAY ARCHITECTURE
==================================================

Use HTML Canvas for actual gameplay.

Do NOT implement the games as a collection of ordinary HTML elements.

Each game must have an independent game engine.

Structure approximately like:

games/
    pinball/
        PinballGame
        physics
        renderer
        input

    galaga/
        GalagaGame
        enemies
        renderer
        input

    pacman/
        PacmanGame
        maze
        enemies
        renderer
        input

    tetris/
        TetrisGame
        pieces
        board
        renderer
        input

Keep the game loop independent from React UI rendering.

React should manage:

- Navigation
- Menus
- Settings
- High scores
- Pause overlays
- Game-over overlays
- Global audio state

Canvas should manage:

- Gameplay
- Physics
- Collision
- Sprites
- Game state
- Animation
- Rendering

==================================================
PINBALL
==================================================

Build a genuinely playable pinball game.

It must include:

- Ball physics
- Gravity
- Velocity
- Collision detection
- Walls
- Flippers
- Bumpers
- Targets
- Launch lane
- Scoring
- Combos
- Multiplier
- Ball counter
- Game over
- Pause
- Restart
- Increasing difficulty

Create an original pixel-art pinball table.

Visual style:

- Dark table
- Neon rails
- Pink/cyan glowing bumpers
- Pixel particles
- Bright flippers
- Targets
- Decorative lights
- Retro arcade details

HUD:

PINBALL

SCORE 042500

BALL 03

COMBO x2

HIGH SCORE 099999

The pinball table should occupy most of the screen.

Make the physics feel responsive.

The ball should visibly bounce, collide, and react to the flippers.

==================================================
GALAGA-STYLE SPACE SHOOTER
==================================================

Create an original fixed-screen arcade space shooter inspired by classic Galaga-style gameplay.

Do NOT copy original Galaga sprites or assets.

Include:

- Player spaceship
- Enemy formations
- Multiple enemy types
- Enemy movement patterns
- Player shooting
- Enemy projectiles
- Collision detection
- Explosions
- Waves
- Increasing difficulty
- Lives
- Score
- Bonus/power-up mechanics
- Game over
- Pause
- Restart

Create original pixel-art spaceships.

Gameplay should contain:

- Enemy formations
- Enemies moving in patterns
- Enemies occasionally diving toward the player
- Player bullets
- Enemy bullets
- Pixel explosions

HUD:

GALAGA

SCORE
HIGH SCORE
LIVES
WAVE

Use cyan as the primary accent.

==================================================
PAC-MAN-STYLE MAZE GAME
==================================================

Create an original maze-chase game inspired by classic Pac-Man gameplay.

Do NOT copy the original Pac-Man maze or character sprites.

Include:

- Grid-based maze
- Player character
- Four enemy/ghost-like characters
- Distinct enemy colors
- Collectible pellets
- Power pellets
- Temporary power mode
- Enemy chase behavior
- Score
- Lives
- Levels
- Increasing difficulty
- Game over
- Restart
- Pause

The maze must be an original design.

Characters must be original pixel-art characters.

Player movement should be smooth and grid-aware.

Enemies should have different behaviors.

For example:

Enemy 1:
Directly chase player.

Enemy 2:
Target an area ahead of player.

Enemy 3:
Alternate between chase and scatter.

Enemy 4:
Use a more unpredictable movement pattern.

HUD:

PAC-MAN

SCORE
HIGH SCORE
LIVES
LEVEL

Use yellow as the primary accent.

==================================================
TETRIS
==================================================

Create a fully playable falling-block puzzle game.

Include:

- Tetromino pieces
- Piece movement
- Rotation
- Collision
- Gravity
- Soft drop
- Hard drop
- Line clearing
- Score
- Levels
- Increasing speed
- Next piece preview
- Hold piece if practical
- Game over
- Pause
- Restart

Use a pixel-art grid.

Different block types should have bright arcade colors.

HUD:

TETRIS

SCORE
LEVEL
LINES
NEXT

The board should be the primary visual focus.

Add satisfying pixel effects when lines are cleared.

==================================================
PAUSE SCREEN
==================================================

Every game should support:

P = PAUSE

Show a retro overlay:

GAME PAUSED

> RESUME
  RESTART
  SETTINGS
  EXIT TO ARCADE

Use pixel borders and neon accents.

The gameplay behind the overlay should freeze.

==================================================
GAME OVER
==================================================

When the player loses:

GAME OVER

FINAL SCORE

042500

If the score qualifies:

NEW HIGH SCORE!

Allow the player to enter initials/name.

Example:

HAM_

SAVE

SKIP

Controls:

ENTER = SAVE
ESC = SKIP

Then show:

PLAY AGAIN
ARCADE

==================================================
HIGH SCORES
==================================================

Use localStorage.

Do NOT create a database.

Maintain separate leaderboards for each game:

PINBALL
GALAGA
PAC-MAN
TETRIS

Each game should store its own top 5 or top 10 scores.

Example:

PINBALL

1. HAM     042500
2. AAA     031200
3. XYZ     018900
4. KAY     015600
5. NEO     012300

Allow the player to switch between games.

Make the leaderboard visually match the arcade aesthetic.

==================================================
SETTINGS
==================================================

Create a retro arcade settings screen.

Options:

MUSIC
SFX
CRT EFFECT
FULLSCREEN
CONTROLS

Use arcade-style selectors.

Example:

MUSIC       < 80% >
SFX         < 80% >
CRT EFFECT  < ON >
FULLSCREEN  < ON >
CONTROLS    < VIEW >

Persist settings with localStorage.

==================================================
AUDIO
==================================================

Use local audio or Web Audio API.

No external APIs.

Include:

- Menu navigation sound
- Button/select sound
- Coin sound
- Shooting sound
- Explosion sound
- Pellet collection sound
- Tetris line-clear sound
- Pinball collision sounds
- Game-over sound
- High-score sound
- Background arcade music

Allow:

M = MUTE

Settings should independently control:

MUSIC
SFX

Audio should not autoplay aggressively before user interaction.

==================================================
CRT EFFECT
==================================================

Create a subtle CRT effect.

Include:

- Scanlines
- Slight glow
- Subtle vignette
- Tiny flicker
- Pixel noise if performance allows

The CRT effect must NOT make the interface difficult to read.

Allow:

CRT EFFECT
ON / OFF

Persist this setting.

==================================================
ANIMATION
==================================================

Make the arcade feel alive.

Add subtle animations:

- INSERT COIN blinking
- Neon signs flickering
- Arcade cabinet lights
- Game-card hover effects
- Selected-game glow
- Pixel particles
- Score popups
- Explosions
- Tetris line-clear effects
- Pinball impact effects
- Game transitions
- CRT flicker

Use pixel-art-style movement.

Avoid excessive modern smooth UI animations.

==================================================
RESPONSIVE DESIGN
==================================================

Desktop keyboard gameplay is the primary target.

The application must still adapt to smaller screens.

For smaller screens:

- Preserve game aspect ratios
- Scale Canvas correctly
- Prevent horizontal scrolling
- Keep HUD readable
- Provide touch controls where practical
- Keep buttons accessible
- Preserve the arcade aesthetic

Desktop experience should receive the highest priority.

==================================================
PERFORMANCE
==================================================

The games should use requestAnimationFrame or an appropriate game loop.

Avoid unnecessary React re-renders during gameplay.

Keep high-frequency game state inside the game engine rather than React state.

Use efficient Canvas rendering.

Do not add unnecessary libraries.

==================================================
ACCESSIBILITY
==================================================

Maintain readable text contrast.

Do not rely only on color to communicate selection.

Provide visible focus/selection states.

Allow CRT effects to be disabled.

Make controls visible from the game screens.

==================================================
ORIGINALITY / ASSETS
==================================================

Create original visual assets.

Do NOT use:

- Original Pac-Man sprites
- Original Galaga sprites
- Original game ROMs
- Original arcade cabinet artwork
- Copyrighted sound effects ripped from games
- Trademarked logos

The games can be inspired by the gameplay concepts but should have their own pixel-art identity.

==================================================
NO PLACEHOLDERS
==================================================

This is extremely important.

Do NOT leave:

- Empty game screens
- Placeholder rectangles
- "Coming Soon"
- Fake buttons
- Static screenshots pretending to be games
- Non-functional controls
- Dummy game logic

All four games must actually be playable.

==================================================
PROJECT STRUCTURE
==================================================

Keep the project organized approximately like:

src/

  components/
    PixelButton
    PixelCard
    CRTScreen
    ArcadeHeader
    GameHUD
    PauseMenu
    GameOver
    HighScores
    Settings

  arcade/
    audio
    storage
    input
    theme

  games/
    pinball/
    galaga/
    pacman/
    tetris/

  pages/
    Home
    GameSelect
    GameScreen
    HighScores
    Settings

  App
  main

Do not create one giant component containing the entire application.

==================================================
DATA STORAGE
==================================================

Use localStorage for:

- High scores
- Settings
- Audio preferences
- CRT preference
- Player initials

Example storage categories:

pixelArcade.highScores
pixelArcade.settings
pixelArcade.player

No server-side persistence.

==================================================
IMPORTANT IMPLEMENTATION PRIORITY
==================================================

Do NOT spend a disproportionate amount of the generation budget perfecting one screen while other core functionality remains unimplemented.

Prioritize in this order:

1. Working application structure
2. Complete navigation
3. All four playable games
4. Game controls
5. Pause/restart/game-over states
6. High-score persistence
7. Settings persistence
8. Core visual identity
9. Audio
10. Advanced visual polish

If a choice must be made between an additional visual effect and making another game playable, prioritize the playable game.

The objective is to get the entire arcade functional first and then polish it.

==================================================
CREDIT / GENERATION LIMIT SAFETY
==================================================

This project may be generated under a limited AI credit budget.

If you reach a generation, context, token, or credit limit before the entire project is finished:

DO NOT pretend that the project is complete.

DO NOT say the project is finished if any major functionality is missing.

Instead, stop safely and provide a clear COMPLETION REPORT.

The report MUST contain:

1. FULLY COMPLETED

List every:
- Screen
- Game
- Feature
- Component

that is actually completed and working.

2. PARTIALLY COMPLETED

List anything that was started but is not finished.

For each item, explain exactly what remains.

3. NOT STARTED

List every remaining:
- Game
- Screen
- Feature
- Integration
- Polish task

that has not been implemented.

4. CURRENT PROJECT STRUCTURE

Briefly explain the important files/components/modules that were created.

Mention where each game implementation lives.

5. CURRENT FUNCTIONALITY

Explain exactly what currently runs and can be tested.

6. NEXT IMPLEMENTATION POINT

Give the exact next logical task to continue from.

Do NOT recommend rebuilding the completed parts.

7. KNOWN ISSUES

List:
- Bugs
- Incomplete mechanics
- Placeholder assets
- Missing sounds
- Visual issues
- Technical limitations

MOST IMPORTANT:

PRESERVE ALL COMPLETED WORK.

If credits run out:

- Do not delete working features.
- Do not replace working implementations with placeholders.
- Do not restart the project.
- Do not rebuild completed screens unnecessarily.
- Do not claim unfinished games are playable.
- Leave the project in the most functional runnable state possible.

The completion report must accurately reflect the real state of the project.

==================================================
FINAL EXPERIENCE
==================================================

The finished project should feel like:

"I walked into a neon pixel-art arcade and opened an arcade cabinet in my browser."

It should NOT feel like:

"A normal website that happens to contain four JavaScript games."

Prioritize:

1. Actual playability
2. Strong pixel-art visual identity
3. Consistent arcade UI
4. Responsive controls
5. Game feedback
6. Animation
7. Sound
8. CRT atmosphere
9. Performance
10. Polish

==================================================
FINAL VERIFICATION
==================================================

Before considering the project complete, verify that:

- Arcade home works
- Game selection works
- Pinball launches and is playable
- Galaga-style shooter launches and is playable
- Pac-Man-style maze game launches and is playable
- Tetris launches and is playable
- Keyboard controls work
- Pause works
- Restart works
- Game over works
- High-score entry works
- High scores persist after refresh
- Settings work
- Settings persist after refresh
- Music can be muted
- SFX can be muted
- CRT effect can be disabled
- Navigation works without unnecessary page reloads
- Browser scrolling is prevented during gameplay
- No authentication is required
- No backend is required
- No database is required
- No API keys are required
- The application can run entirely in the browser

==================================================
START BUILD
==================================================

Build the complete PIXEL ARCADE now.

Use the attached reference image as the primary visual and artistic direction.

Work systematically while prioritizing a complete working application over excessive polishing of individual screens.

Do not stop at a landing page.
Do not stop at a wireframe.
Do not create only one game.
Do not create fake gameplay.
Do not create placeholder game screens.

Build the complete playable PIXEL ARCADE with:

PINBALL
GALAGA-STYLE SPACE SHOOTER
PAC-MAN-STYLE MAZE GAME
TETRIS

and the complete retro pixel-art UI.

If credits run out before completion, follow the CREDIT / GENERATION LIMIT SAFETY section and clearly report exactly where implementation stopped.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44b89546-0686-47af-82fa-317d39dc6edd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
