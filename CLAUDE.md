# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based space shooter game called "Stardust: A Miner's Tale" built with vanilla JavaScript, HTML5 Canvas, and CSS. It's a narrative-driven arcade game where Jack "Stardust" Kovac, a space miner, fights to save his family on Mars from medical debt. The game features a deep upgrade system, family morale mechanics, achievements, and multi-language support.

## Core Architecture Principles

### 1. FormulaService - Centralized Calculations
ALL game calculations and formulas MUST go through `js/systems/FormulaService.js`. This ensures:
- **Single source of truth** for all mathematical formulas
- **Consistency** across the entire game
- **Easy balancing** - change values in one place
- **Testability** - formulas can be tested independently

Never create formulas or calculations inline. Always use or extend FormulaService.

### 2. Translation System
The game supports multiple languages through `js/systems/LanguageSystem.js`:
- **Dynamic language switching** without page reload
- **Complete UI translation** including menus, HUD, dialogs
- **Story content translation** through dynamic loading
- Currently supports English and Russian
- All user-facing text MUST use `languageSystem.t('key')`

### 3. Profile System
Multi-user support through `js/systems/ProfileManager.js`:
- Multiple player profiles with avatars
- Per-profile saves, achievements, and settings
- Automatic save game migration
- Profile switching without data loss

## Project Structure

### Main Files
- `index.html` - All UI screens and menus
- `style.css` - Styling for UI elements
- `js/Game.js` - Main game controller and state management

### Entity System (`js/entities/`)
- `Player.js` - Player ship with morale-affected stats
- `Enemy.js` - Basic enemy ships
- `Hunter.js` - Elite enemy units
- `Boss.js` - Boss enemies with special attacks
- `Asteroid.js` - Destructible obstacles for credits
- `Projectile.js` - Base projectile class
- `SpecialProjectiles.js` - Special weapon projectiles (BFG, Quantum, etc.)
- `PowerUp.js` - Collectible power-ups

### Core Systems (`js/systems/`)
- **FormulaService.js** - ALL game formulas and calculations
- **LanguageSystem.js** - Internationalization support
- **ProfileManager.js** - Multi-user profile management
- **FamilyWelfare.js** - Family morale and hunger system
- **AchievementSystem.js** - Achievement tracking and rewards
- **UpgradeSystem.js** - Player upgrade management
- **WeaponSystem.js** - Weapon unlocks and management
- **CollisionSystem.js** - Collision detection using FormulaService
- **ParticleSystem.js** - Visual effects
- **DamageNumberSystem.js** - Floating damage numbers
- **InputController.js** - Touch, mouse, keyboard input
- **Starfield.js** - Animated space background

### UI Components (`js/ui/`)
- **ScreenManager.js** - Screen transitions and HUD
- **DialogSystem.js** - Story dialogs and notifications
- **AchievementUI.js** - Achievement popups

### Data Files (`js/data/`)
- **StoryEvents.js** - Dynamic story content (uses translations)

## Main Game Flows

### 1. Game Start Flow
```
Main Menu → NEW GAME → Show Upgrade Screen (500 credits) → Start Level 1 → Intro Dialog → Gameplay
         ↳ CONTINUE → Load Save → Show Upgrade Screen → Resume Level
```

### 2. Level Progression Flow
```
Gameplay → Defeat Enemies → Complete Level → Story Dialog → Weapon Unlock (if applicable)
         → Show Upgrade Screen → Family Updates → Next Level
```

### 3. Economic Flow
```
Destroy Enemies/Asteroids → Earn Credits → Send Money Home → Reduce Medical Debt
                         ↳ Purchase Upgrades → Improve Stats
                         ↳ Passive Income (Investment upgrade)
```

### 4. Family Morale System
```
Morale States: Starving ← Worried ← Hopeful → Grateful → Proud
               (-30% stats)  (-5%)    (0%)     (+5%)    (+10%)

Hunger: Decreases 25 per level → Must send money → Restores hunger
        If < 30: Family starving → Morale drops → Stats penalty
```

## Key Systems

### FormulaService Usage
```javascript
// CORRECT - Using FormulaService
const critResult = formulaService.calculateCriticalHit(damage, critChance, isBoss);
const enemyStats = formulaService.calculateEnemyStats('fighter', level);

// WRONG - Inline calculations
const damage = isCritical ? projectile.damage * 2 : projectile.damage; // NO!
const enemyHealth = 20 * (1 + level * 0.15); // NO!
```

### Translation System Usage
```javascript
// CORRECT - Using translations
languageSystem.t('NEW GAME')
languageSystem.t('Family Status')

// WRONG - Hardcoded text
'NEW GAME' // NO!
notification.textContent = 'Game Over'; // NO!
```

### Upgrade System
Eight upgrade categories (critChance replaced speed):
- **maxHealth** - +40 HP per level
- **damage** - +5 damage per shot
- **fireRate** - +0.5 shots/sec
- **critChance** - +5% critical hit chance (2x damage)
- **shield** - +15 shield capacity
- **ammoCrate** - +20% ammo capacity
- **goldRush** - +20% credit earnings
- **investment** - +5% passive income

### Weapon System
10 weapons unlocked progressively:
1. Pulse Laser (default, infinite ammo)
2. Shotgun Blaster (level 2, spread shot)
3. Plasma Cannon (level 3, high damage)
4. Wave Beam (level 4, wave pattern)
5. Missile Launcher (level 5, explosive)
6. Lightning Gun (level 6, chain damage)
7. Flamethrower (level 7, continuous damage)
8. Quantum Rifle (level 8, piercing)
9. BFG 9000 (level 9, massive damage)
10. Quantum Disruptor (level 10, ultimate weapon)

### Achievement System
Tracks progress across categories:
- **Combat** - Enemy kills, boss defeats
- **Economy** - Credits earned, asteroids mined
- **Progression** - Levels reached, weapons unlocked
- **Skill** - Hit streaks, critical hits
- **Special** - Family care, speed runs

Achievements provide permanent bonuses like increased crit chance, damage, etc.

## Critical Game Mechanics

### Critical Hit System
- Base chance: 5% + 5% per upgrade level
- Capped at 100% (level 19)
- Deals 2x damage
- Boss critical chance reduced by 50%
- Shows magenta damage numbers
- All calculations through FormulaService

### Morale Impact on Gameplay
Morale affects multiple systems:
- **Damage**: -30% to +10%
- **Speed**: -20% to +10% (currently fixed at 5)
- **Fire Rate**: -20% to +10%
- **Shield Regen**: -50% to +10%
- **Credit Earnings**: -20% to +10%

### Save System
- Profile-based saves
- Automatic migration from old formats
- Stores: level, score, credits, upgrades, weapons, family state
- Quick save via pause menu
- Auto-save on upgrade screen

## Development Guidelines

### When Adding Features
1. **Formulas** go in FormulaService
2. **UI text** must use LanguageSystem
3. **Achievements** should track new metrics
4. **Profile data** must be saved/loaded
5. **Visual feedback** through ParticleSystem/DamageNumbers

### Testing Checklist
1. Test all three control modes (touch, joystick, relative)
2. Verify translations in both languages
3. Check save/load with multiple profiles
4. Test morale effects on all stats
5. Verify achievement unlocks and bonuses
6. Check critical hits on all enemy types
7. Test family hunger/payment cycle
8. Verify weapon unlock progression
9. Test pause during dialogs
10. Check performance with many particles

### Common Pitfalls to Avoid
- ❌ Don't hardcode text - use translations
- ❌ Don't create inline formulas - use FormulaService
- ❌ Don't modify player stats directly - use UpgradeSystem
- ❌ Don't spawn enemies randomly - use wave system
- ❌ Don't forget morale modifiers
- ❌ Don't skip achievement tracking
- ❌ Don't break save compatibility

## Data Persistence

### localStorage Keys
- `spaceShooterCurrentProfile` - Active profile ID
- `spaceShooterProfiles` - All profile data
- Profile-specific keys are prefixed with profile ID

### Save Data Structure
```javascript
{
  level: number,
  score: number,
  credits: number,
  upgrades: { [type]: { level, maxLevel } },
  weapons: { unlockedWeapons, currentIndex, ammo },
  familyWelfare: { hunger, morale, medicalDebt },
  achievements: { progress, stats }
}
```

## Performance Considerations

- Canvas rendering at 60 FPS
- Particle limit to prevent lag
- Efficient collision detection (spatial partitioning)
- Damage numbers auto-cleanup
- Background starfield optimization
- Projectile pooling for memory efficiency