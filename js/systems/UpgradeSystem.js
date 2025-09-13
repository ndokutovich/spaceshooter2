export class UpgradeSystem {
    constructor() {
        this.upgrades = {
            maxHealth: { level: 0, maxLevel: 10, baseCost: 100, multiplier: 1.5 },
            damage: { level: 0, maxLevel: 10, baseCost: 150, multiplier: 1.5 },
            fireRate: { level: 0, maxLevel: 8, baseCost: 120, multiplier: 1.4 },
            speed: { level: 0, maxLevel: 10, baseCost: 80, multiplier: 1.3 },
            shield: { level: 0, maxLevel: 10, baseCost: 200, multiplier: 1.6 }
        };

        this.upgradeInfo = {
            maxHealth: { name: 'Max Health', description: '+40 HP', icon: '❤️' },
            damage: { name: 'Damage', description: '+5 damage per shot', icon: '⚔️' },
            fireRate: { name: 'Fire Rate', description: '+0.5 shots/sec', icon: '🔫' },
            speed: { name: 'Speed', description: '+0.5 movement speed', icon: '🚀' },
            shield: { name: 'Shield', description: '+15 shield capacity', icon: '🛡️' }
        };
    }

    getUpgrade(type) {
        return this.upgrades[type];
    }

    getUpgradeInfo(type) {
        return this.upgradeInfo[type];
    }

    getUpgradeCost(type) {
        const upgrade = this.upgrades[type];
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.level));
    }

    canPurchase(type, credits) {
        const upgrade = this.upgrades[type];
        const cost = this.getUpgradeCost(type);
        return credits >= cost && upgrade.level < upgrade.maxLevel;
    }

    purchase(type, credits) {
        if (this.canPurchase(type, credits)) {
            const cost = this.getUpgradeCost(type);
            this.upgrades[type].level++;
            return cost; // Return cost to deduct from credits
        }
        return 0;
    }

    getPlayerStats() {
        return {
            maxHealth: 100 + (this.upgrades.maxHealth.level * 40),
            damage: 10 + (this.upgrades.damage.level * 5),
            fireRate: 2 + (this.upgrades.fireRate.level * 0.5),
            speed: 5 + (this.upgrades.speed.level * 0.5),
            maxShield: 50 + (this.upgrades.shield.level * 15)
        };
    }

    getAllUpgrades() {
        return Object.keys(this.upgrades).map(key => ({
            type: key,
            ...this.upgrades[key],
            ...this.upgradeInfo[key],
            cost: this.getUpgradeCost(key)
        }));
    }

    reset() {
        Object.keys(this.upgrades).forEach(key => {
            this.upgrades[key].level = 0;
        });
    }
}