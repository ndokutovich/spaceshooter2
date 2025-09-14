export class WeaponSystem {
    constructor() {
        this.currentWeaponIndex = 0;
        this.unlockedWeapons = [true, false, false, false, false, false, false, false, false, false]; // Only pulse laser unlocked at start
        this.ammoMultiplier = 1.0; // Default multiplier, will be updated by upgrades

        // DOOM 2-inspired space weapons
        this.weapons = [
            {
                id: 1,
                name: "Pulse Laser",
                key: "1",
                ammo: Infinity,
                maxAmmo: Infinity,
                damage: 10,  // Base damage, modified by upgrades
                fireRate: 2, // Shots per second
                projectileSpeed: 10,
                projectileCount: 1,
                spread: 0,
                color: '#00ff00',
                projectileWidth: 4,
                projectileHeight: 12,
                description: "Standard infinite energy weapon",
                unlockLevel: 0, // Available from start
                soundEffect: 'laser1'
            },
            {
                id: 2,
                name: "Shotgun Blaster",
                key: "2",
                ammo: 50,
                maxAmmo: 50,
                damage: 8,
                fireRate: 1.5,
                projectileSpeed: 8,
                projectileCount: 5,
                spread: 0.3, // Radians
                color: '#ffaa00',
                projectileWidth: 6,
                projectileHeight: 6,
                description: "Fires spread of energy pellets",
                unlockLevel: 1,
                soundEffect: 'shotgun'
            },
            {
                id: 3,
                name: "Plasma Rifle",
                key: "3",
                ammo: 200,
                maxAmmo: 200,
                damage: 15,
                fireRate: 4,
                projectileSpeed: 12,
                projectileCount: 1,
                spread: 0.05,
                color: '#00aaff',
                projectileWidth: 8,
                projectileHeight: 8,
                description: "Rapid-fire plasma bolts",
                unlockLevel: 2,
                soundEffect: 'plasma'
            },
            {
                id: 4,
                name: "Rocket Launcher",
                key: "4",
                ammo: 20,
                maxAmmo: 20,
                damage: 50,
                fireRate: 1,
                projectileSpeed: 6,
                projectileCount: 1,
                spread: 0,
                color: '#ff0000',
                projectileWidth: 10,
                projectileHeight: 16,
                explosive: true,
                explosionRadius: 50,
                description: "Explosive projectiles",
                unlockLevel: 3,
                soundEffect: 'rocket'
            },
            {
                id: 5,
                name: "Lightning Gun",
                key: "5",
                ammo: 100,
                maxAmmo: 100,
                damage: 20,
                fireRate: 10,
                projectileSpeed: 20,
                projectileCount: 1,
                spread: 0,
                color: '#ffff00',
                projectileWidth: 3,
                projectileHeight: 30,
                piercing: true, // Goes through enemies
                chain: true, // Can jump to nearby enemies
                chainRange: 100,
                description: "Chain lightning weapon",
                unlockLevel: 4,
                soundEffect: 'lightning'
            },
            {
                id: 6,
                name: "Super Shotgun",
                key: "6",
                ammo: 30,
                maxAmmo: 30,
                damage: 10,
                fireRate: 0.8,
                projectileSpeed: 9,
                projectileCount: 10,
                spread: 0.5,
                color: '#ff6600',
                projectileWidth: 7,
                projectileHeight: 7,
                description: "Double-barrel devastation",
                unlockLevel: 5,
                soundEffect: 'supershotgun'
            },
            {
                id: 7,
                name: "Gauss Cannon",
                key: "7",
                ammo: 40,
                maxAmmo: 40,
                damage: 75,
                fireRate: 0.5,
                projectileSpeed: 25,
                projectileCount: 1,
                spread: 0,
                color: '#ff00ff',
                projectileWidth: 5,
                projectileHeight: 40,
                piercing: true,
                description: "High-velocity rail gun",
                unlockLevel: 6,
                soundEffect: 'gauss'
            },
            {
                id: 8,
                name: "Flamethrower",
                key: "8",
                ammo: 150,
                maxAmmo: 150,
                damage: 5,
                fireRate: 20,
                projectileSpeed: 7,
                projectileCount: 3,
                spread: 0.2,
                color: '#ff4400',
                projectileWidth: 12,
                projectileHeight: 12,
                burn: true, // Damage over time
                burnDamage: 2,
                burnDuration: 60, // frames
                description: "Continuous stream of fire",
                unlockLevel: 7,
                soundEffect: 'flame'
            },
            {
                id: 9,
                name: "BFG 9000",
                key: "9",
                ammo: 10,
                maxAmmo: 10,
                damage: 200,
                fireRate: 0.3,
                projectileSpeed: 4,
                projectileCount: 1,
                spread: 0,
                color: '#00ff00',
                projectileWidth: 30,
                projectileHeight: 30,
                explosive: true,
                explosionRadius: 150,
                tracers: true, // Shoots tracers to nearby enemies
                description: "Big Fragging Gun",
                unlockLevel: 8,
                soundEffect: 'bfg'
            },
            {
                id: 10,
                name: "Quantum Disruptor",
                key: "0",
                ammo: 15,
                maxAmmo: 15,
                damage: 100,
                fireRate: 0.7,
                projectileSpeed: 15,
                projectileCount: 1,
                spread: 0,
                color: '#ffffff',
                projectileWidth: 20,
                projectileHeight: 20,
                quantum: true, // Special effect: slows time around impact
                timeSlowRadius: 100,
                timeSlowDuration: 120,
                description: "Ultimate alien technology",
                unlockLevel: 9,
                soundEffect: 'quantum'
            }
        ];

        // Ammo pickups configuration
        this.ammoPickups = {
            small: {
                shotgun: 10,
                plasma: 50,
                rocket: 5,
                lightning: 25,
                superShotgun: 8,
                gauss: 10,
                flame: 40,
                bfg: 2,
                quantum: 3
            },
            large: {
                shotgun: 25,
                plasma: 100,
                rocket: 10,
                lightning: 50,
                superShotgun: 15,
                gauss: 20,
                flame: 75,
                bfg: 5,
                quantum: 7
            }
        };
    }

    getCurrentWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }

    switchWeapon(index) {
        if (index >= 0 && index < this.weapons.length && this.unlockedWeapons[index]) {
            this.currentWeaponIndex = index;
            return true;
        }
        return false;
    }

    switchWeaponByKey(key) {
        const weaponIndex = this.weapons.findIndex(w => w.key === key);
        if (weaponIndex !== -1) {
            return this.switchWeapon(weaponIndex);
        }
        return false;
    }

    nextWeapon() {
        let nextIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
        while (!this.unlockedWeapons[nextIndex] && nextIndex !== this.currentWeaponIndex) {
            nextIndex = (nextIndex + 1) % this.weapons.length;
        }
        this.currentWeaponIndex = nextIndex;
    }

    previousWeapon() {
        let prevIndex = (this.currentWeaponIndex - 1 + this.weapons.length) % this.weapons.length;
        while (!this.unlockedWeapons[prevIndex] && prevIndex !== this.currentWeaponIndex) {
            prevIndex = (prevIndex - 1 + this.weapons.length) % this.weapons.length;
        }
        this.currentWeaponIndex = prevIndex;
    }

    unlockWeapon(level) {
        const weapon = this.weapons.find(w => w.unlockLevel === level);
        if (weapon) {
            const index = this.weapons.indexOf(weapon);
            this.unlockedWeapons[index] = true;
            // Give some initial ammo when unlocking
            if (weapon.ammo !== Infinity) {
                weapon.ammo = weapon.maxAmmo;
            }
            return weapon;
        }
        return null;
    }

    hasAmmo() {
        const weapon = this.getCurrentWeapon();
        return weapon.ammo > 0;
    }

    consumeAmmo(amount = 1) {
        const weapon = this.getCurrentWeapon();
        if (weapon.ammo !== Infinity) {
            weapon.ammo = Math.max(0, weapon.ammo - amount);
        }
    }

    addAmmo(weaponIndex, amount) {
        if (weaponIndex >= 0 && weaponIndex < this.weapons.length) {
            const weapon = this.weapons[weaponIndex];
            if (weapon.ammo !== Infinity) {
                weapon.ammo = Math.min(weapon.maxAmmo, weapon.ammo + amount);
            }
        }
    }

    addAmmoByType(weaponName, amount) {
        const weapon = this.weapons.find(w => w.name.toLowerCase().includes(weaponName.toLowerCase()));
        if (weapon && weapon.ammo !== Infinity) {
            weapon.ammo = Math.min(weapon.maxAmmo, weapon.ammo + amount);
        }
    }

    // Create projectiles based on current weapon
    createProjectiles(x, y, targetX = null, targetY = null) {
        const weapon = this.getCurrentWeapon();
        const projectiles = [];

        if (!this.hasAmmo()) {
            return projectiles;
        }

        // Calculate base angle (towards target if provided, otherwise straight up)
        let baseAngle = -Math.PI / 2; // Straight up by default
        if (targetX !== null && targetY !== null) {
            baseAngle = Math.atan2(targetY - y, targetX - x);
        }

        // Create projectiles based on weapon type
        for (let i = 0; i < weapon.projectileCount; i++) {
            let angle = baseAngle;

            // Add spread for multi-projectile weapons
            if (weapon.projectileCount > 1) {
                const spreadAngle = weapon.spread;
                const offsetAngle = spreadAngle * (i - (weapon.projectileCount - 1) / 2);
                angle += offsetAngle;
            }

            // Add random spread if specified
            if (weapon.spread > 0 && weapon.projectileCount === 1) {
                angle += (Math.random() - 0.5) * weapon.spread;
            }

            projectiles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * weapon.projectileSpeed,
                vy: Math.sin(angle) * weapon.projectileSpeed,
                damage: weapon.damage,
                isPlayer: true,
                color: weapon.color,
                width: weapon.projectileWidth,
                height: weapon.projectileHeight,
                weaponType: weapon.name,
                explosive: weapon.explosive || false,
                explosionRadius: weapon.explosionRadius || 0,
                piercing: weapon.piercing || false,
                chain: weapon.chain || false,
                chainRange: weapon.chainRange || 0,
                burn: weapon.burn || false,
                burnDamage: weapon.burnDamage || 0,
                burnDuration: weapon.burnDuration || 0,
                quantum: weapon.quantum || false,
                timeSlowRadius: weapon.timeSlowRadius || 0,
                timeSlowDuration: weapon.timeSlowDuration || 0,
                tracers: weapon.tracers || false
            });
        }

        this.consumeAmmo();
        return projectiles;
    }

    // Get list of unlocked weapons for UI
    getUnlockedWeapons() {
        return this.weapons.filter((weapon, index) => this.unlockedWeapons[index]);
    }

    // Update ammo multiplier from upgrades
    updateAmmoMultiplier(multiplier) {
        this.ammoMultiplier = multiplier;
        // Update max ammo for all weapons
        this.weapons.forEach(weapon => {
            if (weapon.ammo !== Infinity) {
                // Store base max ammo if not already stored
                if (!weapon.baseMaxAmmo) {
                    weapon.baseMaxAmmo = weapon.maxAmmo;
                }
                weapon.maxAmmo = Math.floor(weapon.baseMaxAmmo * multiplier);
            }
        });
    }

    // Refill all weapon ammo (called when entering Space Hub)
    refillAllAmmo() {
        this.weapons.forEach((weapon, index) => {
            if (weapon.ammo !== Infinity && this.unlockedWeapons[index]) {
                weapon.ammo = weapon.maxAmmo;
            }
        });
    }

    // Save/load weapon state
    saveState() {
        return {
            currentWeaponIndex: this.currentWeaponIndex,
            unlockedWeapons: [...this.unlockedWeapons],
            ammo: this.weapons.map(w => ({ name: w.name, ammo: w.ammo })),
            ammoMultiplier: this.ammoMultiplier
        };
    }

    loadState(state) {
        if (state) {
            this.currentWeaponIndex = state.currentWeaponIndex || 0;
            this.unlockedWeapons = state.unlockedWeapons || [true, false, false, false, false, false, false, false, false, false];
            this.ammoMultiplier = state.ammoMultiplier || 1.0;

            // Update ammo multiplier first
            if (this.ammoMultiplier !== 1.0) {
                this.updateAmmoMultiplier(this.ammoMultiplier);
            }

            if (state.ammo) {
                state.ammo.forEach(ammoState => {
                    const weapon = this.weapons.find(w => w.name === ammoState.name);
                    if (weapon && weapon.ammo !== Infinity) {
                        // Only update ammo for non-infinite weapons
                        weapon.ammo = ammoState.ammo;
                    }
                });
            }
        }
    }
}