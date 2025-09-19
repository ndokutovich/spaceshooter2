/**
 * FamilyWelfare - Manages family status, morale, and narrative progression
 */
class FamilyWelfare {
    constructor() {
        // Family statistics
        this.familySize = 6; // Wife + 5 children (Sarah + 4 others) - Jack is away mining
        this.hunger = 100; // 100 = well fed, 0 = starving
        this.morale = 'hopeful'; // starving, worried, hopeful, grateful, proud
        this.medicalDebt = 5000;
        this.creditsSentHome = 0;
        this.daughterName = 'Sarah';

        // Morale thresholds based on last payment
        this.moraleThresholds = {
            proud: 500,
            grateful: 200,
            hopeful: 50,
            worried: 0
        };

        // Messages from family
        this.familyMessages = {
            proud: [
                "Dad, you're our hero!",
                "The medicine is working! Thank you!",
                "We're so proud of you!",
                "Sarah is getting better every day!"
            ],
            grateful: [
                "Thank you for the credits, we bought food.",
                "Sarah says she loves you.",
                "We're managing thanks to you.",
                "The doctor says there's hope."
            ],
            hopeful: [
                "We believe in you, dad.",
                "Stay safe out there.",
                "Sarah drew you a picture.",
                "We're waiting for you."
            ],
            worried: [
                "Dad, when are you coming home?",
                "We're running low on food...",
                "Sarah needs her medicine soon.",
                "Please be careful, we need you."
            ],
            starving: [
                "Dad, we're hungry...",
                "Sarah is getting worse without medicine.",
                "Please, we need help!",
                "The landlord is threatening eviction."
            ]
        };

        // Story milestones
        this.milestones = {
            firstPayment: false,
            halfDebtPaid: false,
            debtPaid: false,
            familySaved: false
        };
    }

    /**
     * Update family hunger (called each level)
     * @returns {boolean} True if family is starving
     */
    updateHunger(levelsCompleted = 1) {
        // Increased hunger depletion: 25 per level (was 10)
        // This means family needs food every 2-3 levels max
        this.hunger = Math.max(0, this.hunger - (25 * levelsCompleted));

        // Update morale based on hunger level
        if (this.hunger < 30) {
            if (this.morale !== 'starving') {
                this.morale = 'starving';
                return true; // Trigger starving event
            }
        } else if (this.hunger < 50 && this.morale === 'hopeful') {
            // Automatically drop to worried if hunger is low
            this.morale = 'worried';
        }

        return this.hunger < 30;
    }

    /**
     * Send money home
     * @param {number} credits - Amount to send
     * @returns {Object} Result with message and stats
     */
    sendMoneyHome(credits) {
        if (credits <= 0) return null;

        this.creditsSentHome += credits;

        // Restore hunger based on credits sent
        // Reduced restoration rate: 1 hunger per 10 credits (was 1 per 5)
        // 500 credits = 50 hunger restored (2 levels worth)
        const hungerRestored = Math.min(credits / 10, 100 - this.hunger);
        this.hunger = Math.min(100, this.hunger + hungerRestored);

        // Update morale based on amount sent
        const previousMorale = this.morale;
        if (credits >= this.moraleThresholds.proud) {
            this.morale = 'proud';
        } else if (credits >= this.moraleThresholds.grateful) {
            this.morale = 'grateful';
        } else if (credits >= this.moraleThresholds.hopeful) {
            this.morale = 'hopeful';
        } else {
            this.morale = 'worried';
        }

        // Pay off medical debt if applicable
        let debtPayment = 0;
        if (credits > 100 && this.medicalDebt > 0) {
            debtPayment = Math.min(credits - 100, this.medicalDebt); // Keep 100 for food
            this.medicalDebt = Math.max(0, this.medicalDebt - debtPayment);
        }

        // Check milestones
        if (!this.milestones.firstPayment) {
            this.milestones.firstPayment = true;
        }
        if (this.medicalDebt <= 2500 && !this.milestones.halfDebtPaid) {
            this.milestones.halfDebtPaid = true;
        }
        if (this.medicalDebt === 0 && !this.milestones.debtPaid) {
            this.milestones.debtPaid = true;
        }

        return {
            hungerRestored: hungerRestored,
            debtPayment: debtPayment,
            newMorale: this.morale,
            moraleImproved: this.getMoraleLevel(this.morale) > this.getMoraleLevel(previousMorale),
            message: this.getRandomFamilyMessage()
        };
    }

    /**
     * Get random message based on current morale
     */
    getRandomFamilyMessage() {
        const messages = this.familyMessages[this.morale];
        const message = messages[Math.floor(Math.random() * messages.length)];
        return languageSystem.t(message);
    }

    /**
     * Get morale as numeric level for comparisons
     */
    getMoraleLevel(morale) {
        const levels = {
            starving: 0,
            worried: 1,
            hopeful: 2,
            grateful: 3,
            proud: 4
        };
        return levels[morale] || 0;
    }

    /**
     * Get stat modifiers based on family morale
     */
    getStatModifiers() {
        const modifiers = {
            starving: { damage: 0.9, speed: 0.9, description: languageSystem.t("Worried about family (-10% stats)") },
            worried: { damage: 0.95, speed: 0.95, description: languageSystem.t("Concerned (-5% stats)") },
            hopeful: { damage: 1.0, speed: 1.0, description: languageSystem.t("Determined") },
            grateful: { damage: 1.05, speed: 1.05, description: languageSystem.t("Motivated (+5% stats)") },
            proud: { damage: 1.1, speed: 1.1, description: languageSystem.t("Inspired (+10% stats)") }
        };
        return modifiers[this.morale] || modifiers.hopeful;
    }

    /**
     * Get family status summary for UI
     */
    getStatus() {
        return {
            hunger: this.hunger,
            morale: this.morale,
            medicalDebt: this.medicalDebt,
            creditsSentHome: this.creditsSentHome,
            moraleEmoji: this.getMoraleEmoji(),
            hungerStatus: this.getHungerStatus()
        };
    }

    getMoraleEmoji() {
        const emojis = {
            starving: '😰',
            worried: '😟',
            hopeful: '🙂',
            grateful: '😊',
            proud: '😍'
        };
        return emojis[this.morale] || '😐';
    }

    getHungerStatus() {
        if (this.hunger >= 80) return languageSystem.t('Well Fed');
        if (this.hunger >= 50) return languageSystem.t('Fed');
        if (this.hunger >= 30) return languageSystem.t('Hungry');
        return languageSystem.t('Starving');
    }

    /**
     * Special dialog when daughter gets medicine
     */
    getDaughterMessage(level) {
        const messages = {
            3: "Daddy, I drew you fighting the bad guys! Be careful!",
            5: "The medicine tastes yucky, but I'm being brave like you!",
            7: "I love you daddy! Come home soon!",
            10: "We're all waiting for you! You're the best daddy ever!"
        };
        return messages[level] || null;
    }

    /**
     * Save/Load system integration
     */
    saveState() {
        return {
            hunger: this.hunger,
            morale: this.morale,
            medicalDebt: this.medicalDebt,
            creditsSentHome: this.creditsSentHome,
            milestones: { ...this.milestones }
        };
    }

    getFullState() {
        // Alias for saveState for consistency with new save system
        return this.saveState();
    }

    loadState(state) {
        if (state) {
            this.hunger = state.hunger || 100;
            this.morale = state.morale || 'hopeful';
            this.medicalDebt = state.medicalDebt || 5000;
            this.creditsSentHome = state.creditsSentHome || 0;
            this.milestones = state.milestones || {
                firstPayment: false,
                halfDebtPaid: false,
                debtPaid: false,
                familySaved: false
            };
        }
    }
}