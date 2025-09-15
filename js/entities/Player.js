class Player {
    constructor(canvas, upgrades, weaponSystem = null) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height - 100;
        this.width = 40;
        this.height = 40;
        // Use FormulaService for all stats
        // Convert upgrade objects to just their levels
        const upgradeLevels = {
            maxHealth: upgrades.maxHealth?.level || 0,
            shield: upgrades.shield?.level || 0,
            damage: upgrades.damage?.level || 0,
            fireRate: upgrades.fireRate?.level || 0,
            speed: upgrades.speed?.level || 0,
            ammoCrate: upgrades.ammoCrate?.level || 0
        };
        const stats = formulaService.calculateAllPlayerStats(upgradeLevels);

        // Store base stats before morale modifiers
        this.baseSpeed = stats.speed;
        this.baseDamage = stats.damage;
        this.baseFireRate = stats.fireRate;
        this.baseShieldRegenRate = 1.0;

        // These will be updated with morale modifiers
        this.speed = this.baseSpeed;
        this.fireRateModifier = 1.0;
        this.shieldRegenModifier = 1.0;

        this.health = stats.maxHealth;
        this.maxHealth = stats.maxHealth;
        this.shield = stats.maxShield;
        this.maxShield = stats.maxShield;
        this.lastShot = 0;
        this.shieldRegenTimer = 0;
        this.invulnerable = false;
        this.invulnerableTimer = 0;

        // Weapon system
        this.weaponSystem = weaponSystem || new WeaponSystem();

        // Morale modifiers (will be set by Game)
        this.moraleModifiers = { damage: 1.0, speed: 1.0, fireRate: 1.0, shieldRegen: 1.0, creditBonus: 1.0, description: "" };

        // Achievement modifiers (will be set by Game)
        this.achievementDamageMultiplier = 1.0;
        this.creditMultiplier = 1.0;
    }

    update(touchData, controlMode, autoFire, projectiles) {
        // Handle movement based on control mode
        if (touchData.isTouching) {
            if (controlMode === 'touch') {
                // Instant teleport to touch position (original behavior)
                this.x = touchData.touchX;
                this.y = touchData.touchY;
            } else if (controlMode === 'relative') {
                const sensitivity = formulaService.getTouchSensitivity();
                this.x += (touchData.touchX - touchData.touchStartX) * sensitivity;
                this.y += (touchData.touchY - touchData.touchStartY) * sensitivity;
            }
        }

        // Keep player in bounds
        const margin = formulaService.getPlayerBoundaryMargin();
        this.x = Math.max(margin, Math.min(this.canvas.width - margin, this.x));
        this.y = Math.max(margin, Math.min(this.canvas.height - margin, this.y));

        // Auto fire
        if (autoFire) {
            const now = Date.now();
            const weapon = this.weaponSystem.getCurrentWeapon();
            // Apply both upgrade and morale modifiers to fire rate
            const fireRate = weapon.fireRate * (this.baseFireRate / 2) * this.moraleModifiers.fireRate;
            if (now - this.lastShot > 1000 / fireRate && this.weaponSystem.hasAmmo()) {
                this.shoot(projectiles);
                this.lastShot = now;
            }
        }

        // Shield regeneration (affected by morale)
        if (this.shield < this.maxShield) {
            this.shieldRegenTimer++;
            // Apply morale modifier to shield regen delay (inverse - lower is better)
            const regenDelay = formulaService.getShieldRegenDelay() / this.moraleModifiers.shieldRegen;
            if (this.shieldRegenTimer > regenDelay) {
                // Apply morale modifier to regen rate
                const regenRate = formulaService.getShieldRegenRate() * this.moraleModifiers.shieldRegen;
                this.shield = Math.min(this.maxShield, this.shield + regenRate);
            }
        } else {
            this.shieldRegenTimer = 0;
        }

        // Invulnerability timer
        if (this.invulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
            }
        }
    }

    shoot(projectiles) {
        const weapon = this.weaponSystem.getCurrentWeapon();
        const offset = formulaService.getPlayerProjectileOffset();
        const weaponProjectiles = this.weaponSystem.createProjectiles(this.x, this.y - offset);

        // Apply damage upgrade modifier, morale modifier, AND achievement modifier
        weaponProjectiles.forEach(proj => {
            proj.damage = Math.floor(proj.damage * formulaService.calculateWeaponDamageMultiplier(this.baseDamage) * this.moraleModifiers.damage * this.achievementDamageMultiplier);

            // Create special projectile types for special weapons
            let projectile;
            if (proj.weaponType === 'BFG 9000') {
                projectile = new BFGProjectile(
                    proj.x,
                    proj.y,
                    proj.vx,
                    proj.vy,
                    proj.damage,
                    proj.isPlayer,
                    proj.color,
                    proj.width,
                    proj.height
                );
            } else if (proj.weaponType === 'Quantum Disruptor') {
                projectile = new QuantumProjectile(
                    proj.x,
                    proj.y,
                    proj.vx,
                    proj.vy,
                    proj.damage,
                    proj.isPlayer,
                    proj.color,
                    proj.width,
                    proj.height
                );
            } else if (proj.weaponType === 'Lightning Gun' && proj.chain) {
                projectile = new ChainLightningProjectile(
                    proj.x,
                    proj.y,
                    proj.vx,
                    proj.vy,
                    proj.damage,
                    proj.isPlayer,
                    proj.color,
                    proj.width,
                    proj.height
                );
            } else if (proj.weaponType === 'Missile Launcher' && proj.explosive) {
                projectile = new ExplosiveProjectile(
                    proj.x,
                    proj.y,
                    proj.vx,
                    proj.vy,
                    proj.damage,
                    proj.isPlayer,
                    proj.color,
                    proj.width,
                    proj.height
                );
            } else if ((proj.weaponType === 'Quantum Rifle' || proj.weaponType === 'Lightning Gun') && proj.piercing) {
                projectile = new PiercingProjectile(
                    proj.x,
                    proj.y,
                    proj.vx,
                    proj.vy,
                    proj.damage,
                    proj.isPlayer,
                    proj.color,
                    proj.width,
                    proj.height
                );
            } else {
                // Default projectile for other weapons
                projectile = new Projectile(
                    proj.x,
                    proj.y,
                    proj.vx,
                    proj.vy,
                    proj.damage,
                    proj.isPlayer,
                    proj.color,
                    proj.width,
                    proj.height
                );
            }

            // Copy over special properties if they exist
            if (proj.explosive) projectile.explosive = proj.explosive;
            if (proj.explosionRadius) projectile.explosionRadius = proj.explosionRadius;
            if (proj.piercing) projectile.piercing = proj.piercing;
            if (proj.chain) projectile.chain = proj.chain;
            if (proj.chainRange) projectile.chainRange = proj.chainRange;
            if (proj.burn) projectile.burn = proj.burn;
            if (proj.burnDamage) projectile.burnDamage = proj.burnDamage;
            if (proj.burnDuration) projectile.burnDuration = proj.burnDuration;
            if (proj.quantum) projectile.quantum = proj.quantum;
            if (proj.timeSlowRadius) projectile.timeSlowRadius = proj.timeSlowRadius;
            if (proj.timeSlowDuration) projectile.timeSlowDuration = proj.timeSlowDuration;
            if (proj.tracers) projectile.tracers = proj.tracers;

            projectiles.push(projectile);
        });
    }

    draw(ctx) {
        ctx.save();

        // Draw ship (triangle)
        ctx.translate(this.x, this.y);

        // Blinking effect when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerableTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Ship body
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-15, 20);
        ctx.lineTo(15, 20);
        ctx.closePath();
        ctx.fill();

        // Ship details
        ctx.fillStyle = '#0099ff';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(-8, 10);
        ctx.lineTo(8, 10);
        ctx.closePath();
        ctx.fill();

        // Shield visualization
        if (this.shield > 0) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    takeDamage(damage) {
        if (this.shield > 0) {
            const shieldDamage = Math.min(this.shield, damage);
            this.shield -= shieldDamage;
            damage -= shieldDamage;
            this.shieldRegenTimer = 0;
        }

        this.health -= damage;

        if (this.health > 0) {
            // Make player invulnerable for a short time
            this.invulnerable = true;
            this.invulnerableTimer = formulaService.getPlayerInvulnerabilityTime();
        }

        return this.health <= 0; // Returns true if player died
    }
}