# Asteroid Miner - Game Design Document
## Mobile First Top-Down Space Mining & Combat Game

---

## 1. Game Overview

### 1.1 Concept
A mobile-first, top-down space shooter where players control a mining vessel navigating dangerous asteroid fields, extracting valuable minerals while defending against space pirates. Between sectors, players visit a space hub to upgrade their ship and send resources back to their struggling family.

### 1.2 Core Narrative
**The year is 2387.** You are Jack "Stardust" Kovac, a third-generation asteroid miner trying to make an honest living in the outer rim. With a family of seven back on Mars Colony Station-3, including your sick daughter who needs expensive medical treatments, every credit counts. Your mining vessel, the "Hope's Fortune," ventures into dangerous asteroid fields where the richest deposits lie, but the Crimson Raiders—ruthless space pirates led by Captain Vega—patrol these sectors, preying on honest miners.

### 1.3 Core Pillars
- **Survival Mining**: Balance resource extraction with combat survival
- **Family Stakes**: Emotional investment through family welfare system
- **Risk vs Reward**: Richer sectors have more pirates
- **Progressive Difficulty**: 10 sectors with escalating danger and rewards
- **Strategic Upgrades**: Deep customization focused on mining and defense
- **Narrative Progression**: Story unfolds through boss encounters

### 1.4 Target Platform
- Primary: Mobile (iOS/Android)
- Secondary: Web browsers
- Future: Cross-platform multiplayer

---

## 2. Story & Setting

### 2.1 Protagonist
**Name**: Jack "Stardust" Kovac
**Background**: Third-generation asteroid miner
**Motivation**: Feed family of 7, pay for daughter's medical treatment
**Ship**: "Hope's Fortune" - Modified mining vessel with defensive capabilities

### 2.2 Antagonists
**Primary**: The Crimson Raiders
**Leader**: Captain Vega (later Admiral Vega)
**Motivation**: Control mineral-rich sectors, eliminate competition
**Threat**: Escalates throughout the game, culminating in revenge plot

### 2.3 Setting
**Time**: Year 2387
**Location**: Asteroid Belt, Outer Rim sectors
**Economy**: Mineral rush era, lawless frontier
**Stakes**: Family survival, medical debt of 5000 credits

### 2.4 Narrative Arc
1. **Sectors 1-3**: Establish mining routine, minor pirate threats
2. **Sectors 4-6**: Increased pirate presence, first encounters with Vega's lieutenants
3. **Sectors 7-9**: Direct confrontation with Captain Vega's forces
4. **Sector 10**: Final showdown with Admiral Vega seeking revenge

---

## 3. Game Flow & Structure

### 3.1 Boot Sequence
1. **Platform Logo** (1.5 seconds)
2. **Vendor/Publisher Logo** (1.5 seconds)
3. **Game Logo**: "ASTEROID MINER - Survival of the Richest" (2 seconds)
4. **Main Menu** (persistent)

### 3.2 Main Menu Structure
- **Start Mining** → Begin game / Continue
- **Records** → High scores, statistics, achievements
- **Options** → Settings menu
- **Story** → View narrative background
- **Credits** → Development team
- **Exit** → Close application

### 3.3 Core Game Loop
1. **Mining Phase** → Combat with Pirates → Boss Fight → Sector Complete
2. **Space Hub** → Send money home → Ship Upgrades → Next Sector
3. **Family Status Update** → Emotional moments → Continue mission

---

## 4. Gameplay Mechanics

### 4.1 Mining System

#### Resource Types
- **Gold**: Rare, 100 credits per oz, glowing asteroids
- **Common Minerals**: 10 credits per kg, standard asteroids
- **Rare Crystals**: 50 credits per unit, special asteroids

#### Collection Mechanics
- Destroy asteroids to release minerals
- Floating minerals must be collected within 5 seconds
- Magnetic collection range (upgradeable)
- Larger asteroids split into smaller ones with resources

### 4.2 Family Welfare System

#### Family Status
- **Family Members**: 7 (including sick daughter)
- **Hunger Meter**: 100 (depletes over time)
- **Medical Debt**: 5000 credits
- **Morale States**:
  - Proud (500+ credits)
  - Grateful (200-499 credits)
  - Hopeful (50-199 credits)
  - Worried (0-49 credits)
  - Starving (<30 hunger)

#### Impact on Gameplay
- Low family morale affects player resolve (slight stat penalties)
- Sending money home provides temporary boosts
- Story events triggered by family status changes

### 4.3 Combat System

#### Weapon Systems
1. **Mining Laser** (Primary)
   - Dual purpose: mining and combat
   - Infinite ammo
   - Upgradeable power and rate

2. **Defensive Weapons** (Special)
   - EMP Blast (disables pirates)
   - Scatter Shot (crowd control)
   - Missile Barrage (high damage)

### 4.4 Player Ship Stats
- **Hull Integrity**: 100 HP (base)
- **Shield**: 50 SP (regenerates)
- **Speed**: 5 units/second
- **Cargo Capacity**: 100 units (upgradeable)
- **Scanner Range**: 40 units (upgradeable)

---

## 5. Enemies - Space Pirates

### 5.1 Pirate Ranks

#### Scouts (Sectors 1-3)
- **Name**: Pirate Scout
- **HP**: 10
- **Bounty**: 50 credits
- **Behavior**: Fast, weak attacks
- **Dialogue**: "Hand over your minerals!"

#### Raiders (Sectors 4-6)
- **Name**: Pirate Raider
- **HP**: 20
- **Bounty**: 100 credits
- **Behavior**: Aggressive, homing attacks
- **Dialogue**: "This sector belongs to Vega!"

#### Enforcers (Sectors 7-10)
- **Name**: Pirate Enforcer
- **HP**: 40
- **Bounty**: 200 credits
- **Behavior**: Tanky, heavy weapons
- **Dialogue**: "You picked the wrong field, miner!"

### 5.2 Pirate Bosses

1. **Scarface Jake** - Destroyer (Sector 1)
2. **Twin Vipers** - Dual Fighters (Sector 2)
3. **Asteroid King** - Fortress Ship (Sector 3)
4. **Ghost Captain** - Stealth Cruiser (Sector 4)
5. **Queen Cobra** - Swarm Carrier (Sector 5)
6. **Red Baron** - Battleship (Sector 6)
7. **Captain Vega** - Dreadnought (Sector 7)
8. **Crystal Warlord** - Mining Titan (Sector 8)
9. **Dark Nebula** - Shadow Vessel (Sector 9)
10. **Admiral Vega** - Omega Destroyer (Sector 10)

Each boss has unique attack patterns, dialogue, and bounties (1000 × sector level).

---

## 6. Sectors (Levels)

### 6.1 Sector Progression
1. **Outer Rim - Safe Zone**: Tutorial sector, minimal pirates
2. **Asteroid Field Alpha**: Basic mining, scout pirates
3. **The Dusty Nebula**: Reduced visibility, ambush tactics
4. **Pirate's Crossing**: First major pirate stronghold
5. **Gold Rush Canyon**: Rich deposits, heavy competition
6. **The Dead Zone**: Environmental hazards, elite pirates
7. **Vega's Territory**: Captain Vega's domain
8. **The Crystal Fields**: Rare minerals, extreme danger
9. **Dangerous Depths**: Near-impossible odds
10. **The Final Frontier**: Admiral Vega's revenge

### 6.2 Sector Characteristics
- **Asteroid Density**: Increases with progression
- **Gold Frequency**: 10% → 40% (by sector 10)
- **Pirate Spawn Rate**: +25% per sector
- **Environmental Hazards**: Introduced sector 3+
- **Resource Value**: +40% per sector

---

## 7. Upgrade System - Space Hub

### 7.1 Ship Systems

#### Mining Equipment
- **Mining Laser Power**: 10 → 50 damage (10 levels)
- **Extraction Efficiency**: Faster mining (5 levels)
- **Cargo Hold**: 100 → 500 capacity (5 levels)
- **Mineral Scanner**: 40 → 100 range (5 levels)

#### Defense Systems
- **Hull Reinforcement**: 100 → 500 HP (10 levels)
- **Shield Generator**: 50 → 200 SP (10 levels)
- **Shield Recharge**: 3s → 1s (5 levels)

#### Mobility
- **Engine Power**: Better acceleration (8 levels)
- **Maneuvering Thrusters**: 5 → 10 speed (10 levels)
- **Emergency Boost**: Dash ability (3 levels)

### 7.2 Family Support Upgrades
- **Food Shipment**: Instant +50 hunger (500 credits)
- **Medical Payment**: Reduce debt (1000 credits)
- **Family Message**: Morale boost (+20% all stats for next sector)
- **Insurance Policy**: Death doesn't lose resources (2000 credits)

---

## 8. Resources & Economy

### 8.1 Currency System
- **Credits**: Primary currency from minerals and bounties
- **Gold Ounces**: Premium currency, rare drops
- **Family Fund**: Separate pool for family expenses

### 8.2 Economic Balance
- **Basic Sector Income**: 500-1000 credits
- **Boss Bounties**: 1000 × sector level
- **Daily Family Expenses**: 100 credits
- **Medical Treatment Cost**: 5000 credits total
- **Upgrade Costs**: 100-2000 credits

---

## 9. UI/UX Design

### 9.1 HUD Elements
- **Top Left**: 
  - Ship name & hull integrity
  - Shield bar
  - Family status indicator
- **Top Right**:
  - Credits counter (prominent, gold color)
  - Gold collected
  - Minerals collected
  - Current sector & threat level
- **Bottom**: Special weapon indicators

### 9.2 Visual Theming
- **Color Palette**: 
  - Gold/yellow (wealth, resources)
  - Blue/cyan (player, hope)
  - Red (pirates, danger)
  - Gray (asteroids, neutral)
- **Typography**: Industrial, worn fonts
- **Effects**: Mining sparks, gold glows, family photos in hub

---

## 10. Audio Design

### 10.1 Sound Effects
- Mining laser (industrial drill sound)
- Mineral collection (satisfying chime)
- Gold discovery (special fanfare)
- Family message notification
- Pirate threats (radio static)
- Warning alarms for low resources

### 10.2 Music
- Ambient space atmosphere with industrial undertones
- Tense combat music when pirates appear
- Emotional themes during family moments
- Victory fanfare emphasizing relief rather than triumph
- Boss themes incorporating pirate motifs

---

## 11. Narrative Events

### 11.1 Random Events
- **Family Messages**: "Dad, when are you coming home?"
- **News Updates**: "Pirate activity increasing in sector..."
- **Distress Calls**: Optional rescue missions
- **Market Fluctuations**: "Gold prices up 20% today!"

### 11.2 Story Milestones
- **Sector 3**: First message from daughter
- **Sector 5**: Medical bill arrives
- **Sector 7**: Captain Vega personal threat
- **Sector 10**: Family in danger, final stakes

---

## 12. Meta Progression

### 12.1 Achievements
- **Mining**: "Gold Digger" - Collect 100 gold
- **Family**: "Provider" - Keep family fed for 10 sectors
- **Combat**: "Pirate's Bane" - Defeat 100 pirates
- **Story**: "Reunion" - Complete the game
- **Challenge**: "Against All Odds" - Win with minimal upgrades

### 12.2 New Game Plus
- Keep some upgrades
- Increased difficulty
- New story branch where Vega survived
- Alternate endings based on family welfare

---

## 13. Monetization (Optional)

### 13.1 Ethical Considerations
Given the family survival theme, monetization should be carefully handled:
- **No pay-to-win** that trivializes the struggle
- **Cosmetic only**: Ship skins, UI themes
- **Support developer**: "Buy the miner a coffee" donations
- **Ad-supported**: Optional ads for bonus resources

---

## 14. Post-Launch Content

### Phase 1: Quality of Life
- Family photo customization
- More random events
- Pirate backstories

### Phase 2: Content Expansion
- New sector chain: "The Inner Belt"
- Rival miner competition
- Trading post system

### Phase 3: Multiplayer
- Cooperative mining operations
- Competitive mineral races
- Pirate vs Miner PvP mode

---

## 15. Unique Selling Points

1. **Emotional Investment**: Family survival creates real stakes
2. **Dual Gameplay**: Mining and combat equally important
3. **Narrative Integration**: Story drives gameplay decisions
4. **Risk/Reward Balance**: Greed vs family safety
5. **Working Class Hero**: Relatable protagonist and struggles

---

*This document reflects the core vision of Asteroid Miner, where every asteroid destroyed and every pirate defeated brings the player closer to saving their family. The game transforms a simple shooter into an emotional journey of survival and sacrifice.*

---

## 2. Game Flow & Structure

### 2.1 Boot Sequence
1. **Platform Logo** (1.5 seconds)
2. **Vendor/Publisher Logo** (1.5 seconds)
3. **Game Logo** (2 seconds with audio sting)
4. **Main Menu** (persistent)

### 2.2 Main Menu Structure
- **Play** → Start new game / Continue
- **Records** → High scores, statistics, achievements
- **Options** → Settings menu
- **Credits** → Development team
- **Exit** → Close application

### 2.3 Game Loop
1. Level Start → Enemy Waves → Boss Fight → Victory
2. Space Hub → Upgrades → Next Level Selection
3. Repeat with increased difficulty

---

## 3. Gameplay Mechanics

### 3.1 Core Controls

#### Mobile Controls
- **Movement**: Touch and drag anywhere on screen
- **Firing**: Auto-fire (default) or manual tap-to-fire option
- **Special Weapon**: Double-tap or dedicated button
- **Pause**: Top-right corner button

#### Alternative Control Schemes (Options Menu)
- Virtual joystick mode
- Tilt controls (gyroscope)
- Relative touch (ship follows finger offset)

### 3.2 Player Ship Mechanics

#### Base Statistics
- **Health**: 100 HP (base)
- **Shield**: 50 SP (regenerates after 3 seconds of no damage)
- **Speed**: 5 units/second (base)
- **Primary Weapon**: Laser cannon (infinite ammo)
- **Special Weapons**: Limited ammo, collected or purchased

### 3.3 Combat System

#### Weapon Types
1. **Primary Weapons** (Infinite Ammo)
   - Laser Cannon (default)
   - Plasma Blaster (upgrade)
   - Photon Beam (upgrade)

2. **Special Weapons** (Limited Ammo)
   - Homing Missiles (20 ammo)
   - Spread Shot (30 ammo)
   - EMP Blast (5 ammo)
   - Black Hole Generator (3 ammo)

#### Damage System
- Collision damage varies by enemy type
- Projectile damage based on weapon stats
- Critical hit zones on bosses
- Combo multiplier for consecutive hits

---

## 4. Enemies & Obstacles

### 4.1 Regular Enemies

#### Tier 1 (Levels 1-3)
- **Scout Fighter**: 10 HP, straight movement, single shot
- **Drone**: 5 HP, zigzag pattern, no attack
- **Light Cruiser**: 20 HP, slow movement, triple shot

#### Tier 2 (Levels 4-6)
- **Heavy Fighter**: 30 HP, aggressive AI, homing missiles
- **Shield Carrier**: 50 HP, projects shields for allies
- **Kamikaze Ship**: 15 HP, fast charge attack

#### Tier 3 (Levels 7-10)
- **Battlecruiser**: 100 HP, multiple turrets
- **Stealth Fighter**: 40 HP, cloaking ability
- **Carrier**: 150 HP, spawns drones

### 4.2 Asteroids
- **Small**: 10 HP, drops 5-10 credits
- **Medium**: 25 HP, drops 15-25 credits, may contain power-ups
- **Large**: 50 HP, splits into smaller asteroids, guaranteed power-up

### 4.3 Boss Encounters

Each level ends with a unique boss battle:

1. **Level 1**: Destroyer Alpha (500 HP, basic patterns)
2. **Level 2**: Twin Sentinels (400 HP each, coordinated attacks)
3. **Level 3**: Asteroid Fortress (800 HP, environmental hazards)
4. **Level 4**: Stealth Battleship (700 HP, invisibility phases)
5. **Level 5**: Swarm Queen (600 HP, minion spawning)
6. **Level 6**: Laser Fortress (1000 HP, beam attacks)
7. **Level 7**: Time Warper (900 HP, speed manipulation)
8. **Level 8**: Shield Generator (1200 HP, invulnerability phases)
9. **Level 9**: Dual Core (800 HP x2, must destroy simultaneously)
10. **Level 10**: Final Boss - Omega Dreadnought (2000 HP, all mechanics combined)

---

## 5. Power-ups & Collectibles

### 5.1 In-Level Power-ups
- **Health Pack**: Restores 25 HP
- **Shield Boost**: Instant 50 shield points
- **Rapid Fire**: 2x fire rate for 10 seconds
- **Damage Boost**: 2x damage for 10 seconds
- **Speed Boost**: 1.5x movement speed for 10 seconds
- **Invincibility**: 5 seconds of immunity
- **Magnet**: Attracts all collectibles for 10 seconds
- **Smart Bomb**: Clears all enemies on screen

### 5.2 Currency & Resources
- **Credits**: Primary currency for upgrades
- **Energy Cores**: Rare currency for special upgrades
- **Scrap Metal**: Used for ship repairs and basic upgrades

---

## 6. Space Hub - Upgrade System

### 6.1 Upgrade Categories

#### Hull & Defense
- **Max Health**: 100 → 500 HP (10 levels)
- **Shield Capacity**: 50 → 200 SP (10 levels)
- **Shield Regen Rate**: 3s → 1s (5 levels)
- **Armor Plating**: 0% → 30% damage reduction (6 levels)

#### Weapons & Offense
- **Primary Damage**: 10 → 50 per shot (10 levels)
- **Fire Rate**: 2/s → 10/s (8 levels)
- **Critical Chance**: 5% → 25% (5 levels)
- **Critical Damage**: 150% → 300% (5 levels)

#### Special Weapons
- **Missile Capacity**: 20 → 100 (8 levels)
- **Special Damage**: Base → 3x (6 levels)
- **Reload Speed**: Normal → 2x faster (5 levels)

#### Ship Systems
- **Engine Speed**: 5 → 10 units/s (10 levels)
- **Maneuverability**: Base → Elite (5 levels)
- **Credit Magnet Range**: Small → Large (5 levels)
- **Luck**: 0% → 20% bonus drops (4 levels)

### 6.2 Special Upgrades (Energy Cores)
- **Auto-Repair System**: Regenerate 1 HP/second
- **Emergency Shield**: Auto-activate at 20% health
- **Overdrive Mode**: Temporary stat boost ability
- **Companion Drone**: AI-controlled support ship

---

## 7. Level Design & Progression

### 7.1 Level Structure
Each level consists of:
1. **Wave Phase 1**: 30 seconds of light enemies
2. **Wave Phase 2**: 45 seconds of mixed enemies
3. **Wave Phase 3**: 60 seconds of heavy enemies
4. **Boss Approach**: 15 seconds warning/preparation
5. **Boss Battle**: Variable duration

### 7.2 Difficulty Scaling
- Enemy HP: +20% per level
- Enemy Damage: +15% per level
- Enemy Speed: +10% per level
- Enemy Spawn Rate: +25% per level
- Boss HP: +30% per level
- Credit Rewards: +40% per level

### 7.3 Environment Themes
1. **Asteroid Field**: Floating debris, mining stations
2. **Nebula Cloud**: Reduced visibility, gas pockets
3. **Space Station**: Turret defenses, narrow passages
4. **Planet Orbit**: Gravity wells, satellite hazards
5. **Warp Gate**: Dimensional rifts, time anomalies
6. **Enemy Fleet**: Massive battles, reinforcements
7. **Black Hole Vicinity**: Gravitational pull, debris
8. **Crystal Field**: Reflective surfaces, beam hazards
9. **Ancient Ruins**: Trap mechanisms, energy barriers
10. **Core System**: Final fortress, all hazards combined

---

## 8. UI/UX Design

### 8.1 HUD Elements
- **Top Left**: Health bar, shield bar
- **Top Right**: Score, credits, pause button
- **Bottom Left**: Special weapon indicator, ammo count
- **Bottom Right**: Mini-map (optional)
- **Center**: Combo multiplier, damage numbers

### 8.2 Menu Design
- Clean, futuristic aesthetic
- Animated backgrounds (parallax starfield)
- Responsive touch buttons with visual feedback
- Swipe navigation between menu sections

### 8.3 Visual Feedback
- Screen shake on explosions
- Color-coded damage numbers
- Particle effects for impacts
- Warning indicators for off-screen threats
- Boss health bar at top of screen

---

## 9. Audio Design

### 9.1 Sound Effects
- Unique sounds for each weapon type
- Impact sounds based on material (metal, energy, organic)
- Warning sounds for critical health, incoming missiles
- Positive feedback for power-ups, level completion
- Ambient space atmosphere

### 9.2 Music
- Dynamic soundtrack that intensifies with action
- Unique themes for each level
- Special boss battle music
- Victory fanfare
- Space hub ambient music

---

## 10. Progression & Meta Systems

### 10.1 Achievement System
- **Combat**: Kill streaks, no-damage runs, weapon mastery
- **Collection**: Credits earned, power-ups collected
- **Exploration**: Secret areas found, all upgrades unlocked
- **Challenge**: Speed runs, minimal upgrade runs

### 10.2 Leaderboards
- Global high scores per level
- Weekly tournaments
- Friends leaderboard
- Speed run times

### 10.3 Daily Challenges
- Special modified levels
- Unique reward conditions
- Rotating objectives

---

## 11. Monetization (Optional)

### 11.1 Premium Currency
- **Quantum Crystals**: Purchase with real money
- Used for: Premium ships, instant upgrades, continues

### 11.2 Optional Purchases
- Remove ads
- Starter packs (credits + cores)
- Premium ship skins
- Extra life system
- Experience boosters

---

## 12. Technical Specifications

### 12.1 Performance Targets
- **Frame Rate**: 60 FPS (high-end), 30 FPS (minimum)
- **Resolution**: Adaptive to device
- **Battery Optimization**: Power saving mode option
- **Storage**: <500MB initial download

### 12.2 Save System
- Cloud save synchronization
- Local backup
- Multiple save slots
- Auto-save after each level

### 12.3 Network Features
- Offline play capability
- Online leaderboard sync
- Future multiplayer infrastructure preparation

---

## 13. Multiplayer (Future Feature)

### 13.1 Co-op Mode
- 2-player synchronous gameplay
- Shared screen space
- Combined scoring
- Special co-op abilities

### 13.2 Versus Mode
- Head-to-head battles
- Score attack competitions
- Racing through levels

### 13.3 Technical Implementation
- WebSocket real-time communication
- Lag compensation
- Host migration
- Matchmaking system

---

## 14. Post-Launch Content Plan

### Phase 1 (Months 1-3)
- Bug fixes and balancing
- Quality of life improvements
- New achievement sets

### Phase 2 (Months 4-6)
- Endless mode
- New power-ups
- Ship customization

### Phase 3 (Months 7-12)
- Multiplayer implementation
- New level pack (5 levels)
- Seasonal events

---

## 15. Development Priorities

### Core Features (MVP)
1. Basic gameplay loop
2. 10 levels with bosses
3. Essential upgrade system
4. Save/load functionality
5. Basic UI/menus

### Secondary Features
1. Achievements
2. Leaderboards
3. Advanced upgrades
4. Polish and effects

### Future Features
1. Multiplayer
2. Daily challenges
3. Monetization
4. Extended content

---

## Appendix A: Control Schemes Details

### Touch Control Variants
1. **Direct Touch**: Ship follows finger exactly
2. **Offset Touch**: Ship maintains offset from finger
3. **Virtual Stick**: On-screen joystick appears at touch point
4. **Gesture Based**: Swipe for movement, tap for actions

### Accessibility Options
- Colorblind modes
- Button size adjustment
- Auto-fire toggle
- Difficulty modifiers
- Screen reader support

---

## Appendix B: Balancing Formula

### Damage Calculation
```
Final Damage = Base Damage × (1 + Upgrade Bonus) × Critical Multiplier × Combo Multiplier
```

### Score Calculation
```
Score = (Enemies Killed × 100) + (Boss Damage × 10) + (Time Bonus) + (No Hit Bonus) × Difficulty Multiplier
```

### Upgrade Cost Scaling
```
Cost = Base Cost × (1.5 ^ Current Level)
```

---

*This document serves as the foundation for development. All values and features are subject to balancing and testing during the development process.*