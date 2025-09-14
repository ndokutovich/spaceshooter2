import { Projectile } from './Projectile.js';
import { WeaponSystem } from '../systems/WeaponSystem.js';

export class Player {
    constructor(canvas, upgrades, weaponSystem = null) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height - 100;
        this.width = 40;
        this.height = 40;
        this.speed = 5 + (upgrades.speed.level * 0.5);
        this.health = 100 + (upgrades.maxHealth.level * 40);
        this.maxHealth = 100 + (upgrades.maxHealth.level * 40);
        this.shield = 50 + (upgrades.shield.level * 15);
        this.maxShield = 50 + (upgrades.shield.level * 15);
        this.baseDamage = 10 + (upgrades.damage.level * 5); // Base damage multiplier
        this.baseFireRate = 2 + (upgrades.fireRate.level * 0.5); // Base fire rate multiplier
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
                this.x += (touchData.touchX - touchData.touchStartX) * 0.1;
                this.y += (touchData.touchY - touchData.touchStartY) * 0.1;
            }
        }

        // Keep player in bounds
        this.x = Math.max(20, Math.min(this.canvas.width - 20, this.x));
        this.y = Math.max(20, Math.min(this.canvas.height - 20, this.y));

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
            if (this.shieldRegenTimer > 180) { // 3 seconds at 60fps
                this.shield = Math.min(this.maxShield, this.shield + 1);
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
        const weaponProjectiles = this.weaponSystem.createProjectiles(this.x, this.y - 20);

        // Apply damage upgrade modifier
        weaponProjectiles.forEach(proj => {
            proj.damage = Math.floor(proj.damage * (this.baseDamage / 10));
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
            this.invulnerableTimer = 60; // 1 second at 60fps
        }

        return this.health <= 0; // Returns true if player died
    }
}