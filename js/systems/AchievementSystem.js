/**
 * Comprehensive Achievement System
 * Tracks player progress and unlocks achievements with rewards
 */

class AchievementSystem {
    constructor() {
        // Achievement categories for organization
        this.categories = {
            COMBAT: 'Combat',
            ECONOMY: 'Economy',
            PROGRESSION: 'Progression',
            SKILL: 'Skill',
            EXPLORATION: 'Exploration',
            SPECIAL: 'Special'
        };

        // Achievement definitions with progressive tiers
        this.achievements = this.defineAchievements();

        // Load saved progress
        this.progress = this.loadProgress();

        // Track current session stats
        this.sessionStats = this.initSessionStats();

        // Achievement unlock queue for notifications
        this.unlockQueue = [];
    }

    defineAchievements() {
        return {
            // ========== COMBAT ACHIEVEMENTS ==========
            firstBlood: {
                id: 'firstBlood',
                name: 'First Blood',
                description: 'Destroy your first enemy',
                category: this.categories.COMBAT,
                tiers: [
                    { required: 1, reward: { credits: 100 }, icon: '🎯' }
                ],
                trackStat: 'enemiesKilled',
                hidden: false
            },

            enemySlayer: {
                id: 'enemySlayer',
                name: 'Enemy Slayer',
                description: 'Destroy enemies',
                category: this.categories.COMBAT,
                tiers: [
                    { required: 10, reward: { credits: 200 }, icon: '⚔️', suffix: 'Rookie' },
                    { required: 50, reward: { credits: 500 }, icon: '⚔️', suffix: 'Veteran' },
                    { required: 100, reward: { credits: 1000 }, icon: '⚔️', suffix: 'Elite' },
                    { required: 500, reward: { credits: 5000 }, icon: '⚔️', suffix: 'Master' },
                    { required: 1000, reward: { credits: 10000, damageBonus: 0.05 }, icon: '⚔️', suffix: 'Legend' }
                ],
                trackStat: 'enemiesKilled',
                formula: (kills) => Math.floor(kills),
                hidden: false
            },

            hunterKiller: {
                id: 'hunterKiller',
                name: 'Hunter Killer',
                description: 'Defeat elite hunters',
                category: this.categories.COMBAT,
                tiers: [
                    { required: 1, reward: { credits: 500 }, icon: '🎖️' },
                    { required: 5, reward: { credits: 1500 }, icon: '🎖️' },
                    { required: 10, reward: { credits: 3000, healthBonus: 10 }, icon: '🎖️' }
                ],
                trackStat: 'huntersKilled',
                hidden: false
            },

            bossSlayer: {
                id: 'bossSlayer',
                name: 'Boss Slayer',
                description: 'Defeat bosses',
                category: this.categories.COMBAT,
                tiers: [
                    { required: 1, reward: { credits: 1000 }, icon: '👑' },
                    { required: 5, reward: { credits: 5000 }, icon: '👑' },
                    { required: 10, reward: { credits: 10000, allStatsBonus: 0.1 }, icon: '👑' }
                ],
                trackStat: 'bossesKilled',
                hidden: false
            },

            perfectWave: {
                id: 'perfectWave',
                name: 'Perfect Wave',
                description: 'Complete waves without taking damage',
                category: this.categories.SKILL,
                tiers: [
                    { required: 1, reward: { credits: 300 }, icon: '✨' },
                    { required: 5, reward: { credits: 1000, shieldBonus: 10 }, icon: '✨' },
                    { required: 10, reward: { credits: 2000, shieldBonus: 20 }, icon: '✨' }
                ],
                trackStat: 'perfectWaves',
                hidden: false
            },

            // ========== ECONOMY ACHIEVEMENTS ==========
            asteroidMiner: {
                id: 'asteroidMiner',
                name: 'Asteroid Miner',
                description: 'Destroy asteroids',
                category: this.categories.ECONOMY,
                tiers: [
                    { required: 10, reward: { credits: 100 }, icon: '⛏️' },
                    { required: 50, reward: { credits: 500 }, icon: '⛏️' },
                    { required: 100, reward: { credits: 1000 }, icon: '⛏️' },
                    { required: 500, reward: { credits: 5000, creditMultiplier: 0.05 }, icon: '⛏️' }
                ],
                trackStat: 'asteroidsDestroyed',
                hidden: false
            },

            goldRush: {
                id: 'goldRush',
                name: 'Gold Rush',
                description: 'Collect credits from asteroids',
                category: this.categories.ECONOMY,
                tiers: [
                    { required: 1000, reward: { credits: 500 }, icon: '💰' },
                    { required: 5000, reward: { credits: 2000 }, icon: '💰' },
                    { required: 10000, reward: { credits: 5000 }, icon: '💰' },
                    { required: 50000, reward: { credits: 20000, creditMultiplier: 0.1 }, icon: '💰' }
                ],
                trackStat: 'creditsFromAsteroids',
                formula: (credits) => Math.floor(credits),
                hidden: false
            },

            wealthAccumulator: {
                id: 'wealthAccumulator',
                name: 'Wealth Accumulator',
                description: 'Total credits earned',
                category: this.categories.ECONOMY,
                tiers: [
                    { required: 10000, reward: { credits: 1000 }, icon: '💎' },
                    { required: 50000, reward: { credits: 5000 }, icon: '💎' },
                    { required: 100000, reward: { credits: 10000 }, icon: '💎' },
                    { required: 500000, reward: { credits: 50000, passiveIncome: 0.02 }, icon: '💎' }
                ],
                trackStat: 'totalCreditsEarned',
                hidden: false
            },

            rareFinder: {
                id: 'rareFinder',
                name: 'Rare Finder',
                description: 'Find rare asteroids (Gold, Crystal, Platinum)',
                category: this.categories.EXPLORATION,
                tiers: [
                    { required: 1, reward: { credits: 200 }, icon: '🔍' },
                    { required: 10, reward: { credits: 1000 }, icon: '🔍' },
                    { required: 25, reward: { credits: 2500, luckBonus: 0.05 }, icon: '🔍' },
                    { required: 50, reward: { credits: 5000, luckBonus: 0.1 }, icon: '🔍' }
                ],
                trackStat: 'rareAsteroidsFound',
                hidden: false
            },

            // ========== PROGRESSION ACHIEVEMENTS ==========
            levelClimber: {
                id: 'levelClimber',
                name: 'Level Climber',
                description: 'Reach higher levels',
                category: this.categories.PROGRESSION,
                tiers: [
                    { required: 2, reward: { credits: 200 }, icon: '📈' },
                    { required: 5, reward: { credits: 1000 }, icon: '📈' },
                    { required: 8, reward: { credits: 3000 }, icon: '📈' },
                    { required: 10, reward: { credits: 10000, experienceBonus: 0.1 }, icon: '📈' }
                ],
                trackStat: 'highestLevel',
                hidden: false
            },

            weaponCollector: {
                id: 'weaponCollector',
                name: 'Weapon Collector',
                description: 'Unlock weapons',
                category: this.categories.PROGRESSION,
                tiers: [
                    { required: 2, reward: { credits: 300 }, icon: '🔫' },
                    { required: 5, reward: { credits: 1000 }, icon: '🔫' },
                    { required: 8, reward: { credits: 3000 }, icon: '🔫' },
                    { required: 10, reward: { credits: 5000, ammoBonus: 0.2 }, icon: '🔫' }
                ],
                trackStat: 'weaponsUnlocked',
                hidden: false
            },

            upgradeExpert: {
                id: 'upgradeExpert',
                name: 'Upgrade Expert',
                description: 'Purchase upgrades',
                category: this.categories.PROGRESSION,
                tiers: [
                    { required: 5, reward: { credits: 200 }, icon: '🔧' },
                    { required: 15, reward: { credits: 800 }, icon: '🔧' },
                    { required: 30, reward: { credits: 2000 }, icon: '🔧' },
                    { required: 50, reward: { credits: 5000, upgradeDiscount: 0.1 }, icon: '🔧' }
                ],
                trackStat: 'upgradesPurchased',
                hidden: false
            },

            // ========== SKILL ACHIEVEMENTS ==========
            sharpshooter: {
                id: 'sharpshooter',
                name: 'Sharpshooter',
                description: 'Land consecutive hits',
                category: this.categories.SKILL,
                tiers: [
                    { required: 10, reward: { credits: 100 }, icon: '🎯' },
                    { required: 25, reward: { credits: 500 }, icon: '🎯' },
                    { required: 50, reward: { credits: 1500, accuracyBonus: 0.05 }, icon: '🎯' }
                ],
                trackStat: 'maxHitStreak',
                hidden: false
            },

            survivor: {
                id: 'survivor',
                name: 'Survivor',
                description: 'Survive for extended time',
                category: this.categories.SKILL,
                tiers: [
                    { required: 60, reward: { credits: 200 }, icon: '🛡️' },  // 1 minute
                    { required: 300, reward: { credits: 1000 }, icon: '🛡️' }, // 5 minutes
                    { required: 600, reward: { credits: 3000, healthRegen: 1 }, icon: '🛡️' } // 10 minutes
                ],
                trackStat: 'longestSurvivalTime',
                formula: (seconds) => Math.floor(seconds),
                hidden: false
            },

            pacifist: {
                id: 'pacifist',
                name: 'Pacifist Run',
                description: 'Complete level using only collision damage',
                category: this.categories.SKILL,
                tiers: [
                    { required: 1, reward: { credits: 1000, title: 'Pacifist' }, icon: '☮️' }
                ],
                trackStat: 'pacifistLevels',
                hidden: true  // Hidden achievement
            },

            // ========== SPECIAL ACHIEVEMENTS ==========
            familyProvider: {
                id: 'familyProvider',
                name: 'Family Provider',
                description: 'Keep family well-fed',
                category: this.categories.SPECIAL,
                tiers: [
                    { required: 5, reward: { credits: 500 }, icon: '👨‍👩‍👧‍👦' },
                    { required: 10, reward: { credits: 2000, moraleBonus: 10 }, icon: '👨‍👩‍👧‍👦' }
                ],
                trackStat: 'levelsWithHappyFamily',
                hidden: false
            },

            speedRunner: {
                id: 'speedRunner',
                name: 'Speed Runner',
                description: 'Complete levels quickly',
                category: this.categories.SPECIAL,
                tiers: [
                    { required: 1, reward: { credits: 500 }, icon: '⚡' },
                    { required: 5, reward: { credits: 2000, speedBonus: 0.1 }, icon: '⚡' }
                ],
                trackStat: 'speedRunLevels',
                condition: (time) => time < 120,  // Under 2 minutes
                hidden: false
            },

            criticalMaster: {
                id: 'criticalMaster',
                name: 'Critical Master',
                description: 'Land critical hits',
                category: this.categories.COMBAT,
                tiers: [
                    { required: 10, reward: { credits: 200 }, icon: '💥' },
                    { required: 50, reward: { credits: 1000 }, icon: '💥' },
                    { required: 100, reward: { credits: 2500, critChance: 0.02 }, icon: '💥' },
                    { required: 500, reward: { credits: 10000, critChance: 0.05 }, icon: '💥' }
                ],
                trackStat: 'criticalHits',
                hidden: false
            },

            deathless: {
                id: 'deathless',
                name: 'Deathless',
                description: 'Complete the game without dying',
                category: this.categories.SPECIAL,
                tiers: [
                    { required: 1, reward: { credits: 50000, title: 'Immortal', godMode: true }, icon: '🌟' }
                ],
                trackStat: 'deathlessRun',
                hidden: true
            }
        };
    }

    initSessionStats() {
        return {
            enemiesKilled: 0,
            huntersKilled: 0,
            bossesKilled: 0,
            asteroidsDestroyed: 0,
            creditsFromAsteroids: 0,
            totalCreditsEarned: 0,
            rareAsteroidsFound: 0,
            highestLevel: 1,
            weaponsUnlocked: 1,
            upgradesPurchased: 0,
            perfectWaves: 0,
            maxHitStreak: 0,
            currentHitStreak: 0,
            longestSurvivalTime: 0,
            survivalStartTime: Date.now(),
            pacifistLevels: 0,
            levelsWithHappyFamily: 0,
            speedRunLevels: 0,
            criticalHits: 0,
            deathlessRun: 1,
            deaths: 0,
            levelStartTime: Date.now(),
            damageDealtThisLevel: 0,
            shotsFiredThisLevel: 0
        };
    }

    loadProgress() {
        const saved = localStorage.getItem('achievementProgress');
        if (saved) {
            return JSON.parse(saved);
        }

        // Initialize progress for all achievements
        const progress = {};
        for (const id in this.achievements) {
            progress[id] = {
                currentTier: 0,
                currentValue: 0,
                unlocked: false,
                unlockedTiers: []
            };
        }
        return progress;
    }

    saveProgress() {
        localStorage.setItem('achievementProgress', JSON.stringify(this.progress));
    }

    // Update achievement progress
    updateStat(stat, value, increment = true) {
        if (increment) {
            this.sessionStats[stat] = (this.sessionStats[stat] || 0) + value;
        } else {
            this.sessionStats[stat] = Math.max(this.sessionStats[stat] || 0, value);
        }

        // Check all achievements that track this stat
        for (const id in this.achievements) {
            const achievement = this.achievements[id];
            if (achievement.trackStat === stat) {
                this.checkAchievement(id);
            }
        }
    }

    checkAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        const progress = this.progress[achievementId];
        const statValue = this.sessionStats[achievement.trackStat] || 0;

        // Apply formula if exists
        const value = achievement.formula ? achievement.formula(statValue) : statValue;

        // Update current value
        progress.currentValue = Math.max(progress.currentValue, value);

        // Check each tier
        for (let tierIndex = 0; tierIndex < achievement.tiers.length; tierIndex++) {
            const tier = achievement.tiers[tierIndex];

            // Skip already unlocked tiers
            if (progress.unlockedTiers.includes(tierIndex)) {
                continue;
            }

            // Check if tier requirement is met
            if (value >= tier.required) {
                // Check additional condition if exists
                if (!achievement.condition || achievement.condition(value)) {
                    this.unlockTier(achievementId, tierIndex);
                }
            }
        }

        this.saveProgress();
    }

    unlockTier(achievementId, tierIndex) {
        const achievement = this.achievements[achievementId];
        const progress = this.progress[achievementId];
        const tier = achievement.tiers[tierIndex];

        // Mark tier as unlocked
        progress.unlockedTiers.push(tierIndex);
        progress.currentTier = tierIndex + 1;

        // Mark achievement as unlocked if first tier
        if (tierIndex === 0) {
            progress.unlocked = true;
        }

        // Queue unlock notification
        this.unlockQueue.push({
            achievement: achievement,
            tier: tier,
            tierIndex: tierIndex,
            isComplete: tierIndex === achievement.tiers.length - 1
        });

        // Apply permanent rewards
        this.applyRewards(tier.reward);
    }

    applyRewards(reward) {
        // Rewards are applied by the game system
        // This just stores them for retrieval
        this.lastReward = reward;
    }

    // Get next unlock in queue
    getNextUnlock() {
        return this.unlockQueue.shift();
    }

    // Get achievement display data
    getAchievementDisplay(achievementId) {
        const achievement = this.achievements[achievementId];
        const progress = this.progress[achievementId];

        const currentTier = progress.currentTier;
        const nextTier = achievement.tiers[currentTier] || null;

        return {
            id: achievementId,
            name: achievement.name,
            description: achievement.description,
            category: achievement.category,
            icon: achievement.tiers[0].icon,
            currentValue: progress.currentValue,
            nextRequired: nextTier ? nextTier.required : null,
            progress: nextTier ? (progress.currentValue / nextTier.required) * 100 : 100,
            currentTier: currentTier,
            maxTier: achievement.tiers.length,
            unlocked: progress.unlocked,
            hidden: achievement.hidden && !progress.unlocked
        };
    }

    // Get all achievements grouped by category
    getAchievementsByCategory() {
        const grouped = {};

        for (const category of Object.values(this.categories)) {
            grouped[category] = [];
        }

        for (const id in this.achievements) {
            const display = this.getAchievementDisplay(id);
            if (!display.hidden) {
                grouped[display.category].push(display);
            }
        }

        return grouped;
    }

    // Get total achievement points/score
    getAchievementScore() {
        let totalScore = 0;
        let unlockedCount = 0;
        let totalCount = 0;

        for (const id in this.achievements) {
            const progress = this.progress[id];
            const achievement = this.achievements[id];

            totalCount += achievement.tiers.length;
            unlockedCount += progress.unlockedTiers.length;

            // Each tier is worth points based on its index
            progress.unlockedTiers.forEach(tierIndex => {
                totalScore += (tierIndex + 1) * 100;
            });
        }

        return {
            score: totalScore,
            unlocked: unlockedCount,
            total: totalCount,
            percentage: (unlockedCount / totalCount) * 100
        };
    }

    // Get cumulative bonuses from achievements
    getCumulativeBonuses() {
        const bonuses = {
            damageBonus: 0,
            healthBonus: 0,
            shieldBonus: 0,
            creditMultiplier: 0,
            passiveIncome: 0,
            luckBonus: 0,
            experienceBonus: 0,
            ammoBonus: 0,
            upgradeDiscount: 0,
            accuracyBonus: 0,
            healthRegen: 0,
            moraleBonus: 0,
            speedBonus: 0,
            critChance: 0,
            allStatsBonus: 0
        };

        // Sum up all bonuses from unlocked achievement tiers
        for (const id in this.achievements) {
            const progress = this.progress[id];
            const achievement = this.achievements[id];

            progress.unlockedTiers.forEach(tierIndex => {
                const reward = achievement.tiers[tierIndex].reward;
                for (const bonus in reward) {
                    if (bonuses.hasOwnProperty(bonus)) {
                        bonuses[bonus] += reward[bonus];
                    }
                }
            });
        }

        return bonuses;
    }

    // Reset session stats (call at game start)
    resetSessionStats() {
        this.sessionStats = this.initSessionStats();
        this.sessionStats.survivalStartTime = Date.now();
    }

    // Special tracking methods
    trackLevelComplete(level, time, familyHappy) {
        this.updateStat('highestLevel', level, false);

        if (time < 120) {
            this.updateStat('speedRunLevels', 1, true);
        }

        if (familyHappy) {
            this.updateStat('levelsWithHappyFamily', 1, true);
        }

        // Update survival time
        const survivalTime = (Date.now() - this.sessionStats.survivalStartTime) / 1000;
        this.updateStat('longestSurvivalTime', survivalTime, false);
    }

    trackDeath() {
        this.sessionStats.deaths++;
        this.sessionStats.deathlessRun = 0;
    }

    trackCriticalHit() {
        this.updateStat('criticalHits', 1, true);
    }

    trackHitStreak(hit) {
        if (hit) {
            this.sessionStats.currentHitStreak++;
            this.updateStat('maxHitStreak', this.sessionStats.currentHitStreak, false);
        } else {
            this.sessionStats.currentHitStreak = 0;
        }
    }
}