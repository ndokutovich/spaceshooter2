# Stardust: A Miner's Tale

A narrative-driven arcade space shooter where Jack "Stardust" Kovac, a space miner, fights through waves of enemies to save his family on Mars from crushing medical debt. Built with vanilla JavaScript and HTML5 Canvas.

## 🎮 Play Now

Open `index.html` in any modern web browser to start playing.

## 📖 Story

Jack Kovac's family on Mars faces insurmountable medical debt. As the sole provider, Jack must battle through dangerous space sectors, mining asteroids and defeating enemies to earn credits. Every credit sent home brings his family closer to freedom and affects their morale, which in turn impacts Jack's combat effectiveness.

## 🎯 Features

### Core Gameplay
- **10 Unique Weapons**: From Pulse Laser to Quantum Disruptor
- **Enemy Variety**: Fighters, Hunters, and Boss battles
- **Critical Hit System**: Up to 100% crit chance with upgrades
- **Asteroid Mining**: Destroy asteroids for extra credits
- **Power-ups**: Health, shield, damage boost, and rapid fire

### Family Morale System
Your family's well-being directly affects your combat performance:
- **Starving** (-30% stats): Hunger below 30
- **Worried** (-5% stats): Low morale
- **Hopeful** (baseline): Stable condition
- **Grateful** (+5% stats): Well-fed and supported
- **Proud** (+10% stats): Thriving family

### Progression Systems
- **8 Upgrade Categories**: Health, damage, fire rate, critical chance, shield, ammo, gold rush, investment
- **Achievement System**: 30+ achievements with permanent bonuses
- **10 Levels**: Each with unique challenges and story beats
- **Profile System**: Multiple player profiles with separate saves

### Localization
- **Multi-language Support**: English and Russian
- **Dynamic Translation**: Switch languages without reload
- **Full UI Translation**: All menus, dialogs, and story content

## 🎮 Controls

### Keyboard
- **Arrow Keys / WASD**: Move ship
- **Space / Enter**: Fire weapon
- **1-0**: Switch weapons
- **P / Escape**: Pause game

### Mouse
- Move mouse to control ship
- Click to fire

### Touch (Mobile)
- **Virtual Joystick**: Drag to move
- **Fire Button**: Tap to shoot
- **Weapon Selection**: Tap weapon icons

### Control Modes
1. **Joystick**: Virtual joystick (mobile-friendly)
2. **Touch**: Direct touch control
3. **Relative**: Ship follows touch/mouse with offset

## 🚀 Weapons Arsenal

| Level | Weapon | Description | Special Feature |
|-------|--------|-------------|-----------------|
| 1 | Pulse Laser | Standard energy weapon | Infinite ammo |
| 2 | Shotgun Blaster | Spread shot | 5-projectile spread |
| 3 | Plasma Cannon | Heavy damage | Slow but powerful |
| 4 | Wave Beam | Oscillating projectiles | Hard to dodge |
| 5 | Missile Launcher | Explosive rounds | Area damage |
| 6 | Lightning Gun | Chain lightning | Jumps between enemies |
| 7 | Flamethrower | Continuous stream | Damage over time |
| 8 | Quantum Rifle | Piercing shots | Hits multiple enemies |
| 9 | BFG 9000 | Massive damage | Screen-clearing power |
| 10 | Quantum Disruptor | Ultimate weapon | Devastating effects |

## 💰 Economy

### Credit Sources
- Enemy kills: 10-50 credits based on type
- Asteroid mining: 20 credits each
- Level completion bonuses
- Achievement rewards
- Passive income (with Investment upgrade)

### Spending Options
- **Upgrades**: Improve ship capabilities
- **Family Support**: Send money home to reduce debt
- **Medical Debt**: 50,000 credits to freedom

## 🏆 Achievement Categories

- **Combat**: Enemy defeats, boss kills, hit streaks
- **Economy**: Credits earned, asteroids mined
- **Progression**: Levels reached, weapons unlocked
- **Skill**: Critical hits, perfect runs
- **Special**: Family care, speed completions

## 🛠️ Technical Details

### Built With
- Pure JavaScript (ES6+)
- HTML5 Canvas for rendering
- CSS3 for UI styling
- No external dependencies

### Architecture
- Entity-Component System for game objects
- Centralized FormulaService for all calculations
- Profile-based save system
- Modular system architecture

### Performance
- 60 FPS rendering target
- Efficient collision detection
- Particle pooling
- Automatic cleanup systems

## 📁 Project Structure

```
space-shooter-game/
├── index.html          # Game UI and screens
├── style.css           # Styling
├── js/
│   ├── Game.js         # Main game controller
│   ├── entities/       # Game objects (Player, Enemy, etc.)
│   ├── systems/        # Core systems (Formula, Language, etc.)
│   ├── ui/             # UI components
│   └── data/           # Game data and configurations
├── assets/
│   ├── images/         # Sprites and graphics
│   └── fonts/          # Custom fonts
└── translations/       # Language files
```

## 🎯 Game Tips

1. **Prioritize Family**: Keeping family morale high provides combat bonuses
2. **Critical Builds**: Invest in crit chance for massive damage potential
3. **Weapon Mastery**: Each weapon has unique strengths - learn them all
4. **Resource Balance**: Balance upgrades with family support
5. **Achievement Hunt**: Achievements provide permanent bonuses
6. **Investment Strategy**: Passive income helps during tough levels

## 🐛 Known Issues

- Performance may degrade with excessive particles on older devices
- Touch controls may need calibration on some devices
- Some achievements may not trigger immediately (refresh fixes)

## 📝 Development

### Key Principles
1. All formulas through `FormulaService.js`
2. All text through `LanguageSystem.js`
3. Profile-aware save system
4. Morale affects everything

### Adding Features
- New formulas go in FormulaService
- UI text must use translation keys
- Track new metrics for achievements
- Consider morale impact

## 📜 License

This game is a personal project. All rights reserved.

## 🙏 Credits

Created with passion for classic arcade shooters and narrative-driven gameplay.

---

*"Every credit counts when your family's life is on the line."* - Jack Kovac