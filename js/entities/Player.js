import { Projectile } from './Projectile.js';

export class Player {
    constructor(canvas, upgrades) {
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
        this.damage = 10 + (upgrades.damage.level * 5);
        this.fireRate = 2 + (upgrades.fireRate.level * 0.5);
        this.lastShot = 0;
        this.shieldRegenTimer = 0;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
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
            if (now - this.lastShot > 1000 / this.fireRate) {
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
        projectiles.push(new Projectile(
            this.x,
            this.y - 20,
            0,
            -10,
            this.damage,
            true,
            '#00ff00',
            4,
            12
        ));
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