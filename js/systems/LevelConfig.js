import { formulaService } from './FormulaService.js';

export class LevelConfig {
    constructor() {
        // Base configuration constants
        this.BASE_ENEMY_SPAWN_COUNT = 3; // Base enemies spawned per wave
        this.ENEMY_SPAWN_INCREMENT = 0.5; // Additional enemies per wave per level
        this.MAX_ENEMIES_PER_WAVE = 8; // Maximum enemies that can spawn in one wave
        this.MAX_ENEMIES_ON_SCREEN = 5; // Base max enemies on screen
        this.SPAWN_INTERVAL = 120; // Frames between enemy spawns (2 seconds at 60fps)

        // Level configurations
        this.levels = this.generateLevelConfigs();
    }

    generateLevelConfigs() {
        const configs = [];

        for (let level = 1; level <= 10; level++) {
            configs.push({
                level: level,
                name: `Level ${level}`,

                // Enemy spawning - Use FormulaService
                enemiesToBoss: formulaService.calculateEnemiesToBoss(level),
                enemiesPerWave: Math.min(
                    Math.floor(this.BASE_ENEMY_SPAWN_COUNT + level * this.ENEMY_SPAWN_INCREMENT),
                    this.MAX_ENEMIES_PER_WAVE
                ),
                maxEnemiesOnScreen: this.MAX_ENEMIES_ON_SCREEN + Math.floor(level / 2),
                spawnInterval: Math.max(60, this.SPAWN_INTERVAL - level * 5), // Faster spawns at higher levels

                // Enemy types probability (scout, fighter, heavy)
                enemyTypeWeights: this.getEnemyTypeWeights(level),

                // Boss configuration
                hasBoss: true, // All levels have bosses
                bossHealth: this.calculateBossHealth(level),
                bossName: this.getBossName(level),

                // Asteroid spawning - increased for economy balance
                asteroidChance: 0.35 + (level * 0.05), // Higher base chance (35% -> 85% at level 10)
                maxAsteroids: Math.min(5 + Math.floor(level / 2), 10), // More asteroids allowed (5 -> 10)

                // Difficulty modifiers
                enemySpeedMultiplier: 1 + (level - 1) * 0.1,
                enemyHealthMultiplier: 1 + (level - 1) * 0.15,
                enemyDamageMultiplier: 1 + (level - 1) * 0.1,

                // Rewards
                creditMultiplier: 1 + (level - 1) * 0.2,
                scoreMultiplier: 1 + (level - 1) * 0.25,

                // Power-up chances
                powerUpDropChance: 0.1 + (level * 0.01),
                healthPowerUpWeight: 0.7 - (level * 0.02), // More shield power-ups at higher levels
            });
        }

        return configs;
    }

    getEnemyTypeWeights(level) {
        // Adjust enemy type distribution based on level
        if (level <= 2) {
            return { scout: 0.7, fighter: 0.3, heavy: 0.0 };
        } else if (level <= 4) {
            return { scout: 0.5, fighter: 0.4, heavy: 0.1 };
        } else if (level <= 6) {
            return { scout: 0.3, fighter: 0.5, heavy: 0.2 };
        } else if (level <= 8) {
            return { scout: 0.2, fighter: 0.5, heavy: 0.3 };
        } else {
            return { scout: 0.1, fighter: 0.4, heavy: 0.5 };
        }
    }

    calculateBossHealth(level) {
        // Use FormulaService for boss health calculation
        return formulaService.calculateBossHealth(level);
    }

    getBossName(level) {
        const bossNames = [
            'Destroyer Alpha',      // Level 1
            'Twin Sentinel',        // Level 2
            'Asteroid Fortress',    // Level 3
            'Stealth Battleship',   // Level 4
            'Swarm Queen',          // Level 5
            'Plasma Dreadnought',   // Level 6
            'Void Reaper',          // Level 7
            'Quantum Destroyer',    // Level 8
            'Nebula Guardian',      // Level 9
            'Galactic Overlord'     // Level 10
        ];

        return bossNames[level - 1] || 'Unknown Boss';
    }

    getLevel(levelNumber) {
        if (levelNumber < 1 || levelNumber > 10) {
            return this.levels[0]; // Default to level 1 config
        }
        return this.levels[levelNumber - 1];
    }

    // Get specific level property
    getLevelProperty(levelNumber, property) {
        const config = this.getLevel(levelNumber);
        return config[property];
    }

    // Get enemy type based on weights
    getRandomEnemyType(levelNumber) {
        const weights = this.getLevel(levelNumber).enemyTypeWeights;
        const random = Math.random();

        if (random < weights.scout) {
            return 'scout';
        } else if (random < weights.scout + weights.fighter) {
            return 'fighter';
        } else {
            return 'heavy';
        }
    }

    // Check if should drop power-up
    shouldDropPowerUp(levelNumber) {
        const config = this.getLevel(levelNumber);
        return Math.random() < config.powerUpDropChance;
    }

    // Get power-up type based on level weights
    getPowerUpType(levelNumber) {
        const config = this.getLevel(levelNumber);
        return Math.random() < config.healthPowerUpWeight ? 'health' : 'shield';
    }

    // Check if should spawn asteroid
    shouldSpawnAsteroid(levelNumber) {
        const config = this.getLevel(levelNumber);
        return Math.random() < config.asteroidChance;
    }

    // Debug method to print level config
    printLevelConfig(levelNumber) {
        const config = this.getLevel(levelNumber);
        console.log(`Level ${levelNumber} Configuration:`, config);
        return config;
    }
}