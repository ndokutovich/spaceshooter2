# Space Shooter Game Balance Matrix

## 1. LEVEL PROGRESSION MATRIX

| Level | Enemies to Boss | Boss HP | Enemy HP Mult | Enemy DMG Mult | Enemy Speed Mult | Credit Mult | Score Mult |
|-------|----------------|---------|---------------|----------------|------------------|-------------|------------|
| 1     | 10             | 500     | 1.00x         | 1.00x          | 1.00x            | 1.0x        | 1.00x      |
| 2     | 13             | 800     | 1.15x         | 1.10x          | 1.10x            | 1.2x        | 1.25x      |
| 3     | 16             | 1200    | 1.30x         | 1.20x          | 1.20x            | 1.4x        | 1.50x      |
| 4     | 19             | 1800    | 1.45x         | 1.30x          | 1.30x            | 1.6x        | 1.75x      |
| 5     | 22             | 2800    | 1.60x         | 1.40x          | 1.40x            | 1.8x        | 2.00x      |
| 6     | 25             | 4000    | 1.75x         | 1.50x          | 1.50x            | 2.0x        | 2.25x      |
| 7     | 28             | 5500    | 1.90x         | 1.60x          | 1.60x            | 2.2x        | 2.50x      |
| 8     | 31             | 7500    | 2.05x         | 1.70x          | 1.70x            | 2.4x        | 2.75x      |
| 9     | 34             | 10000   | 2.20x         | 1.80x          | 1.80x            | 2.6x        | 3.00x      |
| 10    | 37             | 15000   | 2.35x         | 1.90x          | 1.90x            | 2.8x        | 3.25x      |

## 2. ENEMY BASE STATS & SCALING

### Base Enemy Stats
| Type    | Base HP | Base Damage | Base Speed | Fire Rate | Spawn Weight (L1→L10) |
|---------|---------|-------------|------------|-----------|------------------------|
| Scout   | 10      | 10          | 3          | 0.5/sec   | 70% → 10%             |
| Fighter | 20      | 15          | 2          | 1.0/sec   | 30% → 40%             |
| Heavy   | 40      | 25          | 1          | 0.3/sec   | 0% → 50%              |

### Effective Enemy Stats by Level
| Level | Scout HP | Fighter HP | Heavy HP | Scout DMG | Fighter DMG | Heavy DMG |
|-------|----------|------------|----------|-----------|-------------|-----------|
| 1     | 10       | 20         | 40       | 10        | 15          | 25        |
| 5     | 16       | 32         | 64       | 14        | 21          | 35        |
| 10    | 24       | 47         | 94       | 19        | 29          | 48        |

## 3. PLAYER PROGRESSION POTENTIAL

### Base Player Stats
- **Health**: 100 HP
- **Shield**: 50 HP
- **Damage**: 10 (Pulse Laser)
- **Fire Rate**: 2 shots/sec
- **Speed**: 5 units

### Maximum Upgraded Stats (Level 10 all upgrades)
- **Health**: 100 + (40 × 10) = 500 HP
- **Shield**: 50 + (15 × 10) = 200 HP
- **Damage Multiplier**: 10 + (5 × 10) = 60 (6x multiplier)
- **Fire Rate**: 2 + (0.5 × 8) = 6 shots/sec
- **Speed**: 5 + (0.5 × 10) = 10 units
- **Ammo Capacity**: +200% (3x base ammo)

## 4. WEAPON UNLOCK & POWER PROGRESSION

| Level | Weapon Unlocked      | Base DMG | Fire Rate | Special Effect           | Ammo    |
|-------|---------------------|----------|-----------|--------------------------|---------|
| 1     | Pulse Laser         | 10       | 2/sec     | None                     | ∞       |
| 1     | Shotgun Blaster     | 8×5      | 1.5/sec   | Spread shot              | 50      |
| 2     | Plasma Rifle        | 15       | 4/sec     | Rapid fire               | 200     |
| 3     | Rocket Launcher     | 50       | 1/sec     | Explosive (AOE)          | 20      |
| 4     | Lightning Gun       | 20       | 10/sec    | Chain & Pierce           | 100     |
| 5     | Super Shotgun       | 10×10    | 0.8/sec   | Wide spread              | 30      |
| 6     | Gauss Cannon        | 75       | 0.5/sec   | Pierce                   | 40      |
| 7     | Flamethrower        | 5×3      | 20/sec    | Burn DOT                 | 150     |
| 8     | BFG 9000            | 200      | 0.3/sec   | Massive AOE + Tracers    | 10      |
| 9     | Quantum Disruptor   | 100      | 0.7/sec   | Time slow field          | 15      |

## 5. DPS ANALYSIS (WITH MAX DAMAGE UPGRADE)

### Player DPS Potential
| Weapon              | Base DPS | Max Upgrade DPS | Effective vs Groups |
|---------------------|----------|-----------------|---------------------|
| Pulse Laser         | 20       | 120             | Low                 |
| Shotgun (all hit)   | 60       | 360             | Medium              |
| Plasma Rifle        | 60       | 360             | Low                 |
| Rocket Launcher     | 50       | 300             | High (AOE)          |
| Lightning Gun       | 200      | 1200            | High (Chain)        |
| Super Shotgun       | 80       | 480             | High                |
| Gauss Cannon        | 37.5     | 225             | Medium (Pierce)     |
| Flamethrower        | 300      | 1800            | Medium              |
| BFG 9000            | 60       | 360             | Very High (AOE)     |
| Quantum Disruptor   | 70       | 420             | High (Time slow)    |

### Enemy DPS Against Player
| Level | Scout DPS | Fighter DPS | Heavy DPS | Average Enemy DPS |
|-------|-----------|-------------|-----------|-------------------|
| 1     | 5         | 15          | 7.5       | ~9                |
| 5     | 7         | 21          | 10.5      | ~13               |
| 10    | 9.5       | 29          | 14        | ~17               |

## 6. CREDITS & ECONOMY BALANCE

### Credit Income per Level
| Level | Enemies | Credits/Enemy | Boss Credits | Total Expected | Upgrade Cost Range |
|-------|---------|---------------|--------------|----------------|-------------------|
| 1     | 10      | 10-20         | 100          | ~250           | 80-200           |
| 5     | 22      | 18-36         | 180          | ~770           | 207-518          |
| 10    | 37      | 28-56         | 280          | ~1600          | 518-1296         |

### Upgrade Cost Scaling
| Upgrade    | Base Cost | Level 5 Cost | Level 10 Cost | Total to Max    |
|------------|-----------|--------------|---------------|-----------------|
| Max Health | 100       | 759          | 5766          | ~17,000         |
| Damage     | 150       | 1139         | 8649          | ~25,500         |
| Fire Rate  | 120       | 683          | 3888          | ~11,400         |
| Speed      | 80        | 335          | 1405          | ~4,200          |
| Shield     | 200       | 1679         | 14,099        | ~41,500         |
| Ammo Crate | 100       | 538          | 2892          | ~8,500          |

**Total credits needed for all upgrades**: ~108,100

## 7. BALANCE ISSUES & RECOMMENDATIONS

### Current Issues (UPDATED):
1. **Credit Economy Imbalance**: Players need ~108k credits for full upgrades but will earn ~10-15k in a full playthrough
2. **Weapon Power Creep**: Later weapons (Lightning Gun, Flamethrower) vastly outclass early weapons
3. **Enemy Scaling**: Enemy HP scales faster (2.35x) than player damage potential without upgrades
4. ~~**Boss HP Scaling**: Linear scaling doesn't account for weapon power increases~~ **FIXED**

### Boss HP Scaling Solution (IMPLEMENTED):
The boss HP now uses exponential scaling that accounts for weapon unlocks:
- **Level 1-3**: Moderate HP (500-1200) - Players use basic weapons
- **Level 4-6**: Sharp increase (1800-4000) - Compensates for Lightning Gun power spike
- **Level 7-10**: Exponential growth (5500-15000) - Forces weapon variety and ammo management

This encourages players to:
- Use newly unlocked weapons against bosses
- Manage ammo carefully (can't spam one weapon)
- Switch weapons strategically based on boss patterns
- Value the Ammo Crate upgrade more highly

### Recommended Adjustments:

#### A. Economy Rebalance
- Increase credit drops by 3-4x OR
- Reduce upgrade costs by 50-70% OR
- Add credit multipliers for performance (no damage, speed kills, etc.)

#### B. Enemy Scaling
- Reduce HP multiplier from 1.15x to 1.10x per level
- Increase damage multiplier from 1.10x to 1.15x per level (more glass cannon)
- Add more enemy variety with different weaknesses

#### C. Weapon Balance
- Buff early weapons:
  - Pulse Laser: 10 → 15 damage
  - Shotgun: 8 → 10 damage per pellet
- Nerf outliers:
  - Lightning Gun: 20 → 15 damage
  - Flamethrower: 5 → 3 damage per tick

#### D. Progressive Difficulty Options
- Add difficulty modes that affect:
  - Credit multipliers (Easy: 2x, Normal: 1x, Hard: 0.5x)
  - Enemy stats multipliers
  - Upgrade cost multipliers

## 8. OPTIMAL PLAYER STRATEGY

### Early Game (Levels 1-3)
- Focus on Damage and Fire Rate upgrades
- Save Rocket Launcher for bosses
- Prioritize credit collection

### Mid Game (Levels 4-6)
- Invest in Shield and Health upgrades
- Unlock and use Lightning Gun as primary weapon
- Start building Ammo Crate levels

### Late Game (Levels 7-10)
- Max out Damage upgrade
- Use Flamethrower for crowd control
- Save BFG ammo for emergency situations
- Complete remaining upgrades

## 9. TIME TO KILL (TTK) ANALYSIS

### Player TTK vs Enemies (No Upgrades)
| Enemy Type | Pulse Laser | Plasma Rifle | Lightning Gun |
|------------|-------------|--------------|---------------|
| Scout      | 0.5 sec     | 0.17 sec     | 0.05 sec      |
| Fighter    | 1.0 sec     | 0.33 sec     | 0.10 sec      |
| Heavy      | 2.0 sec     | 0.67 sec     | 0.20 sec      |

### Enemy TTK vs Player (No Upgrades, 150 HP total)
| Level | Scout Group (3) | Fighter Group (2) | Heavy (1) |
|-------|----------------|-------------------|-----------|
| 1     | 10 sec         | 5 sec             | 20 sec    |
| 5     | 7 sec          | 3.5 sec           | 14 sec    |
| 10    | 5 sec          | 2.5 sec           | 10 sec    |

## 10. CONCLUSION

The game currently has a **steep difficulty curve** with an **underpowered economy**. Players will struggle to afford meaningful upgrades unless they replay levels or are extremely efficient. The weapon progression is generally good but has some balance outliers that trivialize content once unlocked.

**Priority fixes**:
1. Triple credit drops or halve upgrade costs
2. Rebalance Lightning Gun and Flamethrower
3. Adjust enemy HP scaling to be more gradual
4. Add performance-based credit bonuses