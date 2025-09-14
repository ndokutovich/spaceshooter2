import { Projectile } from './Projectile.js';
import { WeaponSystem } from '../systems/WeaponSystem.js';
import { formulaService } from '../systems/FormulaService.js';

export class Player {
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
        this.speed = stats.speed;
        this.health = stats.maxHealth;
        this.maxHealth = stats.maxHealth;
        this.shield = stats.maxShield;
        this.maxShield = stats.maxShield;
        this.baseDamage = stats.damage;
        this.baseFireRate = stats.fireRate;
        this.lastShot = 0;
        this.shieldRegenTimer = 0;
        this.invulnerable = false;
        this.invulnerableTimer = 0;

        // Weapon system
        this.weaponSystem = weaponSystem || new WeaponSystem();
    }

    update(touchData, controlMode, autoFire, projectiles) {
        // Handle movement based on control mode
        if (touchData.isTouching) {
            if (controlMode === 'touch') {
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
            const fireRate = weapon.fireRate * (this.baseFireRate / 2); // Apply upgrade modifier
            if (now - this.lastShot > 1000 / fireRate && this.weaponSystem.hasAmmo()) {
                this.shoot(projectiles);
                this.lastShot = now;
            }
        }

        // Shield regeneration
        if (this.shield < this.maxShield) {
            this.shieldRegenTimer++;
            if (this.shieldRegenTimer > formulaService.getShieldRegenDelay()) {
                this.shield = Math.min(this.maxShield, this.shield + formulaService.getShieldRegenRate());
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

        // Apply damage upgrade modifier
        weaponProjectiles.forEach(proj => {
            proj.damage = Math.floor(proj.damage * formulaService.calculateWeaponDamageMultiplier(this.baseDamage));
            projectiles.push(new Projectile(
                proj.x,
                proj.y,
                proj.vx,
                proj.vy,
                proj.damage,
                proj.isPlayer,
                proj.color,
                proj.width,
                proj.height
            ));
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