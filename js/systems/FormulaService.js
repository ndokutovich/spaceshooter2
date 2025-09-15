/**
 * FormulaService - Centralized mathematical formulas for game consistency
 * Following SOLID principles - Single Responsibility for all game calculations
 */
class FormulaService {
    constructor() {
        // Base values - all formulas derive from these
        this.BASE_VALUES = {
            // Player base stats
            PLAYER_BASE_HEALTH: 100,
            PLAYER_BASE_SHIELD: 50,
            PLAYER_BASE_DAMAGE: 10,
            PLAYER_BASE_FIRE_RATE: 2,
            PLAYER_BASE_SPEED: 5,

            // Upgrade increments per level
            HEALTH_PER_LEVEL: 40,
            SHIELD_PER_LEVEL: 15,
            DAMAGE_PER_LEVEL: 5,
            FIRE_RATE_PER_LEVEL: 0.5,
            SPEED_PER_LEVEL: 0.5,
            AMMO_MULTIPLIER_PER_LEVEL: 0.2, // 20% per level

            // Upgrade costs
            UPGRADE_BASE_COSTS: {
                maxHealth: 100,
                damage: 150,
                fireRate: 120,
                speed: 80,
                shield: 200,
                ammoCrate: 100,
                goldRush: 300,
                investment: 250
            },
            UPGRADE_COST_MULTIPLIERS: {
                maxHealth: 1.5,
                damage: 1.5,
                fireRate: 1.4,
                speed: 1.3,
                shield: 1.6,
                ammoCrate: 1.4,
                goldRush: 2.0,
                investment: 1.8
            },

            // Enemy base stats
            ENEMY_BASE_STATS: {
                scout: { health: 10, damage: 10, speed: 3, fireRate: 0.5 },
                fighter: { health: 20, damage: 15, speed: 2, fireRate: 1.0 },
                heavy: { health: 40, damage: 25, speed: 1, fireRate: 0.3 }
            },

            // Level progression
            LEVEL_BASE_ENEMIES_TO_BOSS: 10,
            LEVEL_ENEMIES_INCREMENT: 3,
            LEVEL_ENEMY_HP_MULTIPLIER: 0.15, // 15% per level
            LEVEL_ENEMY_DMG_MULTIPLIER: 0.10, // 10% per level
            LEVEL_ENEMY_SPEED_MULTIPLIER: 0.10, // 10% per level

            // Credits and scoring
            CREDIT_BASE: 10,
            CREDIT_MULTIPLIER_PER_LEVEL: 0.2,
            SCORE_MULTIPLIER_PER_LEVEL: 0.25,
            BOSS_CREDIT_MULTIPLIER: 10, // Boss gives 10x enemy credits

            // Power-ups
            POWERUP_HEALTH_RESTORE: 25,
            POWERUP_SHIELD_RESTORE: 50,
            POWERUP_SCORE_VALUE: 50,
            POWERUP_FALL_SPEED: 2,

            // Asteroid stats - increased base credits for family economy
            ASTEROID_SIZES: {
                small: { radius: 15, health: 10, credits: 15 },
                medium: { radius: 25, health: 25, credits: 35 },
                large: { radius: 40, health: 50, credits: 75 }
            },
            ASTEROID_BASE_SPEED: 1,
            ASTEROID_SPEED_VARIANCE: 2,
            ASTEROID_CREDIT_DIVISOR: 3, // Asteroids give 1/3 of their base value as credits

            // Player gameplay constants
            PLAYER_INVULNERABILITY_TIME: 60, // frames (1 second at 60fps)
            PLAYER_SHIELD_REGEN_DELAY: 180, // frames (3 seconds at 60fps)
            PLAYER_SHIELD_REGEN_RATE: 1, // per frame when regenerating
            PLAYER_PROJECTILE_OFFSET_Y: 20, // How far above player center to spawn projectiles
            PLAYER_DAMAGE_DIVISOR: 10, // Used to convert damage stat to weapon multiplier

            // Touch controls
            TOUCH_SENSITIVITY: 0.1,

            // Boundaries
            PLAYER_BOUNDARY_MARGIN: 20
        };
    }

    // ========== PLAYER FORMULAS ==========

    /**
     * Calculate player's max health
     * @param {number} upgradeLevel - Health upgrade level (0-10)
     * @returns {number} Max health value
     */
    calculatePlayerMaxHealth(upgradeLevel) {
        return this.BASE_VALUES.PLAYER_BASE_HEALTH +
               (upgradeLevel * this.BASE_VALUES.HEALTH_PER_LEVEL);
    }

    /**
     * Calculate player's max shield
     * @param {number} upgradeLevel - Shield upgrade level (0-10)
     * @returns {number} Max shield value
     */
    calculatePlayerMaxShield(upgradeLevel) {
        return this.BASE_VALUES.PLAYER_BASE_SHIELD +
               (upgradeLevel * this.BASE_VALUES.SHIELD_PER_LEVEL);
    }

    /**
     * Calculate player's damage multiplier
     * @param {number} upgradeLevel - Damage upgrade level (0-10)
     * @returns {number} Total damage value (not multiplier)
     */
    calculatePlayerDamage(upgradeLevel) {
        return this.BASE_VALUES.PLAYER_BASE_DAMAGE +
               (upgradeLevel * this.BASE_VALUES.DAMAGE_PER_LEVEL);
    }

    /**
     * Calculate player's damage multiplier (for weapon damage)
     * @param {number} upgradeLevel - Damage upgrade level (0-10)
     * @returns {number} Damage multiplier
     */
    calculatePlayerDamageMultiplier(upgradeLevel) {
        return this.calculatePlayerDamage(upgradeLevel) / this.BASE_VALUES.PLAYER_BASE_DAMAGE;
    }

    /**
     * Calculate player's fire rate
     * @param {number} upgradeLevel - Fire rate upgrade level (0-8)
     * @returns {number} Shots per second
     */
    calculatePlayerFireRate(upgradeLevel) {
        return this.BASE_VALUES.PLAYER_BASE_FIRE_RATE +
               (upgradeLevel * this.BASE_VALUES.FIRE_RATE_PER_LEVEL);
    }

    /**
     * Calculate player's movement speed
     * @param {number} upgradeLevel - Speed upgrade level (0-10)
     * @returns {number} Movement speed units
     */
    calculatePlayerSpeed(upgradeLevel) {
        return this.BASE_VALUES.PLAYER_BASE_SPEED +
               (upgradeLevel * this.BASE_VALUES.SPEED_PER_LEVEL);
    }

    /**
     * Calculate ammo capacity multiplier
     * @param {number} upgradeLevel - Ammo crate upgrade level (0-10)
     * @returns {number} Ammo multiplier (1.0 = 100%, 2.0 = 200%, etc.)
     */
    calculateAmmoMultiplier(upgradeLevel) {
        return 1 + (upgradeLevel * this.BASE_VALUES.AMMO_MULTIPLIER_PER_LEVEL);
    }

    /**
     * Calculate credit earning multiplier
     * @param {number} upgradeLevel - Gold Rush upgrade level (0-5)
     * @returns {number} Credit multiplier (1.0 = 100%, 1.2 = 120%, etc.)
     */
    calculateCreditMultiplier(upgradeLevel) {
        return 1.0 + (upgradeLevel * 0.2); // +20% per level
    }

    /**
     * Calculate passive income rate
     * @param {number} upgradeLevel - Investment upgrade level (0-5)
     * @returns {number} Interest rate (0.05 = 5%, 0.1 = 10%, etc.)
     */
    calculatePassiveIncomeRate(upgradeLevel) {
        return upgradeLevel * 0.05; // +5% per level
    }

    /**
     * Get all player stats at once
     * @param {Object} upgradeLevels - Object with all upgrade levels
     * @returns {Object} All calculated player stats
     */
    calculateAllPlayerStats(upgradeLevels) {
        return {
            maxHealth: this.calculatePlayerMaxHealth(upgradeLevels.maxHealth || 0),
            maxShield: this.calculatePlayerMaxShield(upgradeLevels.shield || 0),
            damage: this.calculatePlayerDamage(upgradeLevels.damage || 0),
            damageMultiplier: this.calculatePlayerDamageMultiplier(upgradeLevels.damage || 0),
            fireRate: this.calculatePlayerFireRate(upgradeLevels.fireRate || 0),
            speed: this.calculatePlayerSpeed(upgradeLevels.speed || 0),
            ammoMultiplier: this.calculateAmmoMultiplier(upgradeLevels.ammoCrate || 0),
            creditMultiplier: this.calculateCreditMultiplier(upgradeLevels.goldRush || 0),
            passiveIncomeRate: this.calculatePassiveIncomeRate(upgradeLevels.investment || 0)
        };
    }

    // ========== MORALE SYSTEM FORMULAS ==========

    /**
     * Get morale modifiers based on family morale state
     * Enhanced to be more impactful on gameplay
     * @param {string} moraleState - Current morale state (starving/worried/hopeful/grateful/proud)
     * @returns {Object} Stat modifiers
     */
    getMoraleModifiers(moraleState) {
        const modifiers = {
            starving: {
                damage: 0.7,      // -30% damage (was -10%)
                speed: 0.8,       // -20% speed (was -10%)
                fireRate: 0.8,    // -20% fire rate (NEW)
                shieldRegen: 0.5, // -50% shield regen (NEW)
                creditBonus: 0.8, // -20% credit earnings (NEW)
                description: "morale_starving_desc"
            },
            worried: {
                damage: 0.85,     // -15% damage (was -5%)
                speed: 0.9,       // -10% speed (was -5%)
                fireRate: 0.9,    // -10% fire rate (NEW)
                shieldRegen: 0.75,// -25% shield regen (NEW)
                creditBonus: 0.9, // -10% credit earnings (NEW)
                description: "Concerned (-15% damage, -10% speed/fire rate, -25% shield regen, -10% credits)"
            },
            hopeful: {
                damage: 1.0,
                speed: 1.0,
                fireRate: 1.0,
                shieldRegen: 1.0,
                creditBonus: 1.0,
                description: "Determined (no bonuses or penalties)"
            },
            grateful: {
                damage: 1.15,     // +15% damage (was +5%)
                speed: 1.1,       // +10% speed (was +5%)
                fireRate: 1.1,    // +10% fire rate (NEW)
                shieldRegen: 1.25,// +25% shield regen (NEW)
                creditBonus: 1.1, // +10% credit earnings (NEW)
                description: "Motivated (+15% damage, +10% speed/fire rate, +25% shield regen, +10% credits)"
            },
            proud: {
                damage: 1.3,      // +30% damage (was +10%)
                speed: 1.2,       // +20% speed (was +10%)
                fireRate: 1.2,    // +20% fire rate (NEW)
                shieldRegen: 1.5, // +50% shield regen (NEW)
                creditBonus: 1.25,// +25% credit earnings (NEW)
                description: "Inspired (+30% damage, +20% speed/fire rate, +50% shield regen, +25% credits)"
            }
        };
        return modifiers[moraleState] || modifiers.hopeful;
    }

    /**
     * Apply morale modifiers to player stats
     * @param {Object} baseStats - Base calculated stats
     * @param {string} moraleState - Current morale state
     * @returns {Object} Modified stats
     */
    applyMoraleToStats(baseStats, moraleState) {
        const modifiers = this.getMoraleModifiers(moraleState);
        return {
            ...baseStats,
            damage: Math.floor(baseStats.damage * modifiers.damage),
            damageMultiplier: baseStats.damageMultiplier * modifiers.damage,
            speed: baseStats.speed * modifiers.speed,
            fireRate: baseStats.fireRate * modifiers.fireRate,
            shieldRegenRate: (baseStats.shieldRegenRate || 1) * modifiers.shieldRegen,
            creditMultiplier: (baseStats.creditMultiplier || 1) * modifiers.creditBonus,
            moraleModifiers: modifiers
        };
    }

    // ========== UPGRADE COST FORMULAS ==========

    /**
     * Calculate upgrade cost for a specific type and level
     * @param {string} upgradeType - Type of upgrade
     * @param {number} currentLevel - Current upgrade level
     * @returns {number} Cost for next level
     */
    calculateUpgradeCost(upgradeType, currentLevel) {
        const baseCost = this.BASE_VALUES.UPGRADE_BASE_COSTS[upgradeType];
        const multiplier = this.BASE_VALUES.UPGRADE_COST_MULTIPLIERS[upgradeType];
        return Math.floor(baseCost * Math.pow(multiplier, currentLevel));
    }

    // ========== ENEMY FORMULAS ==========

    /**
     * Calculate enemy stats for a given level
     * @param {string} enemyType - 'scout', 'fighter', or 'heavy'
     * @param {number} level - Current game level (1-10)
     * @returns {Object} Enemy stats
     */
    calculateEnemyStats(enemyType, level) {
        const baseStats = this.BASE_VALUES.ENEMY_BASE_STATS[enemyType];
        const levelMultiplier = level - 1; // Level 1 has no multiplier

        return {
            health: Math.floor(baseStats.health * (1 + levelMultiplier * this.BASE_VALUES.LEVEL_ENEMY_HP_MULTIPLIER)),
            damage: Math.floor(baseStats.damage * (1 + levelMultiplier * this.BASE_VALUES.LEVEL_ENEMY_DMG_MULTIPLIER)),
            speed: baseStats.speed * (1 + levelMultiplier * this.BASE_VALUES.LEVEL_ENEMY_SPEED_MULTIPLIER),
            fireRate: baseStats.fireRate
        };
    }

    /**
     * Calculate how many enemies before boss
     * @param {number} level - Current game level (1-10)
     * @returns {number} Number of enemies to defeat before boss spawns
     */
    calculateEnemiesToBoss(level) {
        return this.BASE_VALUES.LEVEL_BASE_ENEMIES_TO_BOSS +
               ((level - 1) * this.BASE_VALUES.LEVEL_ENEMIES_INCREMENT);
    }

    // ========== BOSS FORMULAS ==========

    /**
     * Calculate boss health for a given level
     * @param {number} level - Current game level (1-10)
     * @returns {number} Boss health
     */
    calculateBossHealth(level) {
        // Exponential scaling to match weapon progression
        const bossHealthValues = [
            500,   // L1
            800,   // L2
            1200,  // L3
            1800,  // L4
            2800,  // L5
            4000,  // L6
            5500,  // L7
            7500,  // L8
            10000, // L9
            15000  // L10
        ];

        return bossHealthValues[level - 1] || 500;
    }

    /**
     * Calculate boss damage
     * @param {number} level - Current game level (1-10)
     * @returns {number} Boss damage per shot
     */
    calculateBossDamage(level) {
        const baseDamage = 30;
        return Math.floor(baseDamage * (1 + (level - 1) * this.BASE_VALUES.LEVEL_ENEMY_DMG_MULTIPLIER));
    }

    /**
     * Calculate boss movement speed
     * @param {number} level - Current game level (1-10)
     * @returns {number} Boss movement speed
     */
    calculateBossSpeed(level) {
        const baseSpeed = 1;
        // Boss speed increases slightly with level but not as much as regular enemies
        return baseSpeed * (1 + (level - 1) * 0.05); // 5% per level
    }

    /**
     * Calculate boss projectile damage modifiers for different attack patterns
     * @param {number} baseDamage - Boss base damage
     * @param {string} attackType - 'spread', 'aimed', or 'circle'
     * @returns {number} Modified damage for attack type
     */
    calculateBossAttackDamage(baseDamage, attackType) {
        const modifiers = {
            spread: 0.7,  // 70% damage for spread shots
            aimed: 1.0,   // 100% damage for aimed shots
            circle: 0.5   // 50% damage for circle pattern
        };
        return Math.floor(baseDamage * (modifiers[attackType] || 1.0));
    }

    // ========== CREDITS & SCORING FORMULAS ==========

    /**
     * Calculate credit reward for enemy kill
     * @param {string} enemyType - 'scout', 'fighter', 'heavy', or 'boss'
     * @param {number} level - Current game level (1-10)
     * @returns {number} Credits earned
     */
    calculateCreditReward(enemyType, level) {
        const baseCredits = this.BASE_VALUES.CREDIT_BASE;
        const levelMultiplier = 1 + ((level - 1) * this.BASE_VALUES.CREDIT_MULTIPLIER_PER_LEVEL);

        // Different multipliers for different enemy types
        const typeMultipliers = {
            scout: 1,
            fighter: 1.5,
            heavy: 2,
            boss: this.BASE_VALUES.BOSS_CREDIT_MULTIPLIER
        };

        const typeMultiplier = typeMultipliers[enemyType] || 1;
        return Math.floor(baseCredits * levelMultiplier * typeMultiplier);
    }

    /**
     * Calculate score for enemy kill
     * @param {string} enemyType - 'scout', 'fighter', 'heavy', or 'boss'
     * @param {number} level - Current game level (1-10)
     * @returns {number} Score earned
     */
    calculateScoreReward(enemyType, level) {
        const baseScores = {
            scout: 10,
            fighter: 20,
            heavy: 30,
            asteroid: 5,
            boss: 100
        };

        const baseScore = baseScores[enemyType] || 10;
        const levelMultiplier = 1 + ((level - 1) * this.BASE_VALUES.SCORE_MULTIPLIER_PER_LEVEL);

        return Math.floor(baseScore * levelMultiplier);
    }

    // ========== WEAPON FORMULAS ==========

    /**
     * Calculate actual weapon damage with player upgrades
     * @param {number} weaponBaseDamage - Base damage of the weapon
     * @param {number} damageUpgradeLevel - Player's damage upgrade level
     * @returns {number} Actual damage dealt
     */
    calculateWeaponDamage(weaponBaseDamage, damageUpgradeLevel) {
        const multiplier = this.calculatePlayerDamageMultiplier(damageUpgradeLevel);
        return Math.floor(weaponBaseDamage * multiplier);
    }

    /**
     * Calculate weapon fire rate with player upgrades
     * @param {number} weaponBaseFireRate - Base fire rate of the weapon
     * @param {number} fireRateUpgradeLevel - Player's fire rate upgrade level
     * @returns {number} Actual fire rate
     */
    calculateWeaponFireRate(weaponBaseFireRate, fireRateUpgradeLevel) {
        // Fire rate upgrade affects the cooldown between shots
        const playerFireRateBonus = this.calculatePlayerFireRate(fireRateUpgradeLevel) / this.BASE_VALUES.PLAYER_BASE_FIRE_RATE;
        return weaponBaseFireRate * playerFireRateBonus;
    }

    /**
     * Calculate weapon max ammo with ammo crate upgrade
     * @param {number} baseMaxAmmo - Base max ammo of the weapon
     * @param {number} ammoCrateLevel - Ammo crate upgrade level
     * @returns {number} Actual max ammo
     */
    calculateWeaponMaxAmmo(baseMaxAmmo, ammoCrateLevel) {
        if (baseMaxAmmo === Infinity) return Infinity;
        const multiplier = this.calculateAmmoMultiplier(ammoCrateLevel);
        return Math.floor(baseMaxAmmo * multiplier);
    }

    // ========== ASTEROID FORMULAS ==========

    /**
     * Get asteroid stats by size
     * @param {string} size - 'small', 'medium', or 'large'
     * @returns {Object} Asteroid stats
     */
    getAsteroidStats(size) {
        return this.BASE_VALUES.ASTEROID_SIZES[size] || this.BASE_VALUES.ASTEROID_SIZES.small;
    }

    /**
     * Calculate asteroid movement speed
     * @returns {number} Random speed for asteroid
     */
    calculateAsteroidSpeed() {
        return Math.random() * this.BASE_VALUES.ASTEROID_SPEED_VARIANCE + this.BASE_VALUES.ASTEROID_BASE_SPEED;
    }

    /**
     * Calculate asteroid credit reward
     * @param {number} baseValue - Base value of the asteroid
     * @returns {number} Credits earned from destroying asteroid
     */
    calculateAsteroidCredits(baseValue) {
        // Asteroids now give full value since types handle multipliers
        return baseValue;
    }

    // ========== POWERUP FORMULAS ==========

    /**
     * Get powerup restoration amount
     * @param {string} type - 'health' or 'shield'
     * @returns {number} Amount to restore
     */
    getPowerUpRestoreAmount(type) {
        if (type === 'health') {
            return this.BASE_VALUES.POWERUP_HEALTH_RESTORE;
        } else if (type === 'shield') {
            return this.BASE_VALUES.POWERUP_SHIELD_RESTORE;
        }
        return 0;
    }

    /**
     * Get powerup score value
     * @returns {number} Score for collecting powerup
     */
    getPowerUpScoreValue() {
        return this.BASE_VALUES.POWERUP_SCORE_VALUE;
    }

    /**
     * Get powerup fall speed
     * @returns {number} Speed at which powerups fall
     */
    getPowerUpSpeed() {
        return this.BASE_VALUES.POWERUP_FALL_SPEED;
    }

    // ========== PLAYER GAMEPLAY FORMULAS ==========

    /**
     * Get player invulnerability duration
     * @returns {number} Frames of invulnerability after taking damage
     */
    getPlayerInvulnerabilityTime() {
        return this.BASE_VALUES.PLAYER_INVULNERABILITY_TIME;
    }

    /**
     * Get shield regeneration delay
     * @returns {number} Frames before shield starts regenerating
     */
    getShieldRegenDelay() {
        return this.BASE_VALUES.PLAYER_SHIELD_REGEN_DELAY;
    }

    /**
     * Get shield regeneration rate
     * @returns {number} Shield points regenerated per frame
     */
    getShieldRegenRate() {
        return this.BASE_VALUES.PLAYER_SHIELD_REGEN_RATE;
    }

    /**
     * Calculate weapon damage multiplier from player damage stat
     * @param {number} playerDamage - Player's damage stat
     * @returns {number} Multiplier for weapon damage
     */
    calculateWeaponDamageMultiplier(playerDamage) {
        return playerDamage / this.BASE_VALUES.PLAYER_DAMAGE_DIVISOR;
    }

    /**
     * Get player projectile spawn offset
     * @returns {number} Y offset for projectile spawning
     */
    getPlayerProjectileOffset() {
        return this.BASE_VALUES.PLAYER_PROJECTILE_OFFSET_Y;
    }

    /**
     * Get touch control sensitivity
     * @returns {number} Touch movement multiplier
     */
    getTouchSensitivity() {
        return this.BASE_VALUES.TOUCH_SENSITIVITY;
    }

    /**
     * Get player boundary margin
     * @returns {number} Distance from edge of screen
     */
    getPlayerBoundaryMargin() {
        return this.BASE_VALUES.PLAYER_BOUNDARY_MARGIN;
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Get a summary of all formulas for debugging/balance
     * @returns {Object} All base values and multipliers
     */
    getFormulasSummary() {
        return {
            baseValues: this.BASE_VALUES,
            sampleCalculations: {
                playerMaxHealthLv5: this.calculatePlayerMaxHealth(5),
                playerDamageLv5: this.calculatePlayerDamage(5),
                upgradeCostDamageLv5: this.calculateUpgradeCost('damage', 5),
                enemyScoutLv5: this.calculateEnemyStats('scout', 5),
                bossHealthLv5: this.calculateBossHealth(5),
                creditRewardBossLv5: this.calculateCreditReward('boss', 5)
            }
        };
    }
}

// Global singleton instance
const formulaService = new FormulaService();