import { formulaService } from './FormulaService.js';

export class UpgradeSystem {
    constructor() {
        this.upgrades = {
            maxHealth: { level: 0, maxLevel: 10 },
            damage: { level: 0, maxLevel: 10 },
            fireRate: { level: 0, maxLevel: 8 },
            speed: { level: 0, maxLevel: 10 },
            shield: { level: 0, maxLevel: 10 },
            ammoCrate: { level: 0, maxLevel: 10 }
        };

        this.upgradeInfo = {
            maxHealth: { name: 'Max Health', description: '+40 HP', icon: '❤️' },
            damage: { name: 'Damage', description: '+5 damage per shot', icon: '⚔️' },
            fireRate: { name: 'Fire Rate', description: '+0.5 shots/sec', icon: '🔫' },
            speed: { name: 'Speed', description: '+0.5 movement speed', icon: '🚀' },
            shield: { name: 'Shield', description: '+15 shield capacity', icon: '🛡️' },
            ammoCrate: { name: 'Ammo Crate', description: '+20% max ammo capacity', icon: '📦' }
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
        return formulaService.calculateUpgradeCost(type, upgrade.level);
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
        // Use FormulaService for all calculations
        const upgradeLevels = {
            maxHealth: this.upgrades.maxHealth.level,
            damage: this.upgrades.damage.level,
            fireRate: this.upgrades.fireRate.level,
            speed: this.upgrades.speed.level,
            shield: this.upgrades.shield.level,
            ammoCrate: this.upgrades.ammoCrate.level
        };

        return formulaService.calculateAllPlayerStats(upgradeLevels);
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