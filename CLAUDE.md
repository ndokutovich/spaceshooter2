# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based Space Shooter game built with vanilla JavaScript, HTML5 Canvas, and CSS. It's a single-page application with no build process or dependencies.

## Project Structure

### Main Files
- `index.html` - Main HTML file containing all game screens (menus, HUD, upgrade screen)
- `style.css` - All styling for UI elements and screens
- `script.js.backup` - Original monolithic implementation (preserved for reference)

### Modular JavaScript Structure
- `js/Game.js` - Main game controller that coordinates all modules
- `js/entities/` - Game entities
  - `Player.js` - Player ship class
  - `Enemy.js` - Enemy ship class
  - `Boss.js` - Boss enemy class
  - `Asteroid.js` - Asteroid obstacle class
  - `Projectile.js` - Projectile/bullet class
  - `PowerUp.js` - Power-up collectible class
- `js/systems/` - Core game systems
  - `ParticleSystem.js` - Particle effects and explosions
  - `Starfield.js` - Scrolling star background
  - `InputController.js` - Touch, mouse, and keyboard input handling
  - `UpgradeSystem.js` - Player upgrade management
  - `CollisionSystem.js` - Collision detection between entities
- `js/ui/` - User interface
  - `ScreenManager.js` - Menu screens and HUD management

## Running the Game

Open `index.html` directly in a web browser. No build process or server required.

For testing with live reload during development:
```bash
# Use any static file server, for example:
python -m http.server 8000
# or
npx serve .
```

## Architecture

The game follows a modular architecture with clear separation of concerns. The main `SpaceShooterGame` class in `js/Game.js` coordinates all modules and manages:

### Core Game Loop
- Frame-based update/render cycle
- Collision detection between all game entities
- Particle effects and visual feedback
- Star field background animation

### Game States & Screens
- Logo sequence (platform → vendor → game logo)
- Main menu with Play, Options, Records, Credits
- In-game state with HUD
- Upgrade screen ("Space Hub") between levels
- Game over and victory screens

### Entity System
- Player ship with health, shield, and upgradeable stats
- Multiple enemy types with different behaviors
- Boss enemies with complex attack patterns
- Projectiles (player and enemy)
- Power-ups and collectibles
- Asteroids as environmental hazards

### Progression System
- 10 levels with increasing difficulty
- Wave-based enemy spawning
- Boss fight every 5 levels
- Credit system for purchasing upgrades
- Persistent high score tracking (localStorage)

### Controls
Three control modes (configurable in options):
- Touch & drag
- Virtual joystick
- Relative touch
Auto-fire option and manual pause functionality

### Upgrade System
Five upgrade categories:
- maxHealth - Increases player health
- damage - Increases weapon damage
- fireRate - Increases shooting speed
- speed - Increases movement speed
- shield - Adds/improves shield capacity

## Key Classes and Responsibilities

### Game.js
- Main game loop coordination
- Entity spawning and management
- Game state management
- Screen transitions

### Entity Classes
Each entity class (Player, Enemy, Boss, etc.) handles:
- Its own update logic
- Drawing/rendering
- Health and damage management
- Movement patterns

### System Classes
- `CollisionSystem` - Centralized collision detection
- `UpgradeSystem` - Player stat calculations and upgrade purchases
- `InputController` - All input event handling
- `ScreenManager` - UI screen transitions and HUD updates
- `ParticleSystem` - Visual effects management

## Data Persistence

- High scores stored in localStorage under `spaceShooterHighScores`
- Game options stored in localStorage under `spaceShooterOptions`

## Testing Considerations

When modifying game mechanics:
1. Test all three control modes on both desktop and mobile
2. Verify upgrade effects are applied correctly
3. Check boss spawn conditions (levels 5 and 10)
4. Ensure particle effects don't cause performance issues
5. Test pause/resume functionality during gameplay