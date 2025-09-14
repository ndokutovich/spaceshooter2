import { Projectile } from './Projectile.js';
import { formulaService } from '../systems/FormulaService.js';

/**
 * Hunter - Elite enemies that actively pursue the player
 * Appear before bosses as mini-bosses
 */
export class Hunter {
    constructor(canvas, level, type = null) {
        this.canvas = canvas;
        this.level = level;

        // Three hunter types with different behaviors
        const types = ['bounty', 'raider', 'assassin'];
        this.type = type || types[Math.floor(Math.random() * types.length)];

        // Hunter-specific properties
        this.hunterProps = {
            bounty: {
                name: 'Bounty Hunter',
                color: '#FFD700',      // Gold
                accentColor: '#FFA500', // Orange
                health: 2.5,            // Health multiplier
                speed: 1.2,             // Speed multiplier
                damage: 1.5,            // Damage multiplier
                fireRate: 1.0,          // Fire rate multiplier
                credits: 3,             // Credit multiplier
                behavior: 'persistent', // Follows player relentlessly
                special: 'tracker'      // Homing shots
            },
            raider: {
                name: 'Pirate Raider',
                color: '#DC143C',      // Crimson
                accentColor: '#8B0000', // Dark red
                health: 3.0,
                speed: 0.8,
                damage: 2.0,
                fireRate: 0.8,
                credits: 2.5,
                behavior: 'aggressive', // Charges at player
                special: 'burst'        // Burst fire
            },
            assassin: {
                name: 'Shadow Assassin',
                color: '#4B0082',      // Indigo
                accentColor: '#9400D3', // Violet
                health: 2.0,
                speed: 1.5,
                damage: 2.5,
                fireRate: 1.2,
                credits: 4,
                behavior: 'flanking',   // Tries to attack from sides
                special: 'cloak'        // Periodic invisibility
            }
        };

        const props = this.hunterProps[this.type];
        this.name = props.name;
        this.color = props.color;
        this.accentColor = props.accentColor;

        // Position (spawn from top but spread out)
        this.x = Math.random() * (canvas.width - 60) + 30;
        this.y = -100;
        this.width = 70;  // Between regular (30-40) and boss (120)
        this.height = 60;

        // Calculate stats with hunter multipliers
        const baseStats = formulaService.calculateEnemyStats('heavy', level);
        this.health = Math.floor(baseStats.health * props.health);
        this.maxHealth = this.health;
        this.speed = baseStats.speed * props.speed;
        this.damage = Math.floor(baseStats.damage * props.damage);
        this.fireRate = baseStats.fireRate * props.fireRate;

        // Rewards
        this.value = Math.floor(formulaService.calculateCreditReward('heavy', level) * props.credits);

        // Combat
        this.lastShot = Date.now();
        this.burstCount = 0;

        // Movement
        this.behavior = props.behavior;
        this.special = props.special;
        this.targetX = this.x;
        this.targetY = 150; // Initial target position
        this.moveTimer = 0;

        // Special abilities
        this.cloakTimer = 0;
        this.cloaked = false;
        this.specialCooldown = 0;

        // Visual effects
        this.engineGlow = 0;
    }

    update(player, projectiles) {
        if (!player) return false;

        this.moveTimer++;
        this.specialCooldown = Math.max(0, this.specialCooldown - 1);

        // Behavior patterns
        switch(this.behavior) {
            case 'persistent':
                this.persistentBehavior(player);
                break;
            case 'aggressive':
                this.aggressiveBehavior(player);
                break;
            case 'flanking':
                this.flankingBehavior(player);
                break;
        }

        // Move towards target position
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // Keep in bounds
        this.x = Math.max(30, Math.min(this.canvas.width - 30, this.x));
        this.y = Math.max(0, Math.min(this.canvas.height - 100, this.y));

        // Special abilities
        this.handleSpecialAbility(player, projectiles);

        // Shooting
        const now = Date.now();
        if (now - this.lastShot > 1000 / this.fireRate && !this.cloaked) {
            this.shoot(player, projectiles);
            this.lastShot = now;
        }

        // Engine glow animation
        this.engineGlow = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;

        // Never leave screen (hunters are persistent)
        return false;
    }

    persistentBehavior(player) {
        // Always move towards player with some offset
        this.targetX = player.x;
        this.targetY = Math.min(player.y - 150, this.canvas.height / 2);
    }

    aggressiveBehavior(player) {
        // Charge at player periodically
        if (this.moveTimer % 120 === 0) {
            this.targetX = player.x;
            this.targetY = player.y - 50;
        }
    }

    flankingBehavior(player) {
        // Try to attack from the sides
        if (this.moveTimer % 90 === 0) {
            const side = this.x < player.x ? -1 : 1;
            this.targetX = player.x + (side * 150);
            this.targetY = player.y - 100;
        }
    }

    handleSpecialAbility(player, projectiles) {
        switch(this.special) {
            case 'tracker':
                // Homing shots are handled in shoot()
                break;

            case 'burst':
                // Burst fire is handled in shoot()
                break;

            case 'cloak':
                // Periodic cloaking
                this.cloakTimer++;
                if (this.cloakTimer > 300 && !this.cloaked && this.specialCooldown === 0) {
                    this.cloaked = true;
                    this.cloakTimer = 0;
                } else if (this.cloaked && this.cloakTimer > 60) {
                    this.cloaked = false;
                    this.specialCooldown = 180;
                    this.cloakTimer = 0;
                }
                break;
        }
    }

    shoot(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);

        switch(this.special) {
            case 'tracker':
                // Homing projectile - create a special projectile that tracks
                const proj = new Projectile(
                    this.x,
                    this.y + this.height / 2,
                    Math.cos(angle) * 4,
                    Math.sin(angle) * 4,
                    this.damage,
                    false,
                    this.accentColor,
                    6,
                    10
                );
                // Add homing properties
                proj.isHoming = true;
                proj.target = player;
                proj.turnSpeed = 0.1;
                proj.maxSpeed = 8;
                projectiles.push(proj);
                break;

            case 'burst':
                // 3-round burst
                for (let i = 0; i < 3; i++) {
                    const spread = (i - 1) * 0.2;
                    projectiles.push(new Projectile(
                        this.x,
                        this.y + this.height / 2,
                        Math.cos(angle + spread) * 6,
                        Math.sin(angle + spread) * 6,
                        this.damage * 0.7,
                        false,
                        this.color,
                        5,
                        8
                    ));
                }
                break;

            case 'cloak':
                // Sniper shot when uncloaking
                if (this.specialCooldown > 170) {
                    projectiles.push(new Projectile(
                        this.x,
                        this.y + this.height / 2,
                        Math.cos(angle) * 10,
                        Math.sin(angle) * 10,
                        this.damage * 1.5,
                        false,
                        '#FF00FF',
                        8,
                        12
                    ));
                } else {
                    // Normal shot
                    projectiles.push(new Projectile(
                        this.x,
                        this.y + this.height / 2,
                        Math.cos(angle) * 5,
                        Math.sin(angle) * 5,
                        this.damage,
                        false,
                        this.color,
                        5,
                        8
                    ));
                }
                break;

            default:
                // Normal shot
                projectiles.push(new Projectile(
                    this.x,
                    this.y + this.height / 2,
                    Math.cos(angle) * 5,
                    Math.sin(angle) * 5,
                    this.damage,
                    false,
                    this.color,
                    5,
                    8
                ));
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Cloaking effect
        if (this.cloaked) {
            ctx.globalAlpha = 0.2 + Math.sin(Date.now() * 0.01) * 0.1;
        }

        // Triple engine trails (more than regular, less than boss)
        const engineAlpha = this.cloaked ? 0.1 : 0.8;
        ctx.fillStyle = `rgba(255, 150, 0, ${engineAlpha * this.engineGlow})`;
        ctx.beginPath();
        ctx.ellipse(-20, -this.height/2 - 8, 5, 10 + this.engineGlow * 5, 0, 0, Math.PI * 2);
        ctx.ellipse(0, -this.height/2 - 10, 6, 12 + this.engineGlow * 6, 0, 0, Math.PI * 2);
        ctx.ellipse(20, -this.height/2 - 8, 5, 10 + this.engineGlow * 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outer shield glow
        ctx.strokeStyle = `rgba(${this.type === 'bounty' ? '255,215,0' :
                               this.type === 'raider' ? '220,20,60' :
                               '75,0,130'}, ${0.3 + Math.sin(Date.now() * 0.005) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width/2 + 10, this.height/2 + 10, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Main body with metallic gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.6, this.accentColor);
        gradient.addColorStop(1, this.color);
        ctx.fillStyle = gradient;

        // Hunter ship design - aggressive angular design
        ctx.beginPath();
        // Front point
        ctx.moveTo(0, this.height / 2);
        // Right wing
        ctx.lineTo(this.width / 2.5, this.height / 3);
        ctx.lineTo(this.width / 2, this.height / 5);
        ctx.lineTo(this.width / 1.8, -this.height / 6);
        ctx.lineTo(this.width / 2.2, -this.height / 3);
        ctx.lineTo(this.width / 3, -this.height / 2.5);
        // Back section
        ctx.lineTo(this.width / 5, -this.height / 2);
        ctx.lineTo(0, -this.height / 2.2);
        ctx.lineTo(-this.width / 5, -this.height / 2);
        ctx.lineTo(-this.width / 3, -this.height / 2.5);
        // Left wing (mirror)
        ctx.lineTo(-this.width / 2.2, -this.height / 3);
        ctx.lineTo(-this.width / 1.8, -this.height / 6);
        ctx.lineTo(-this.width / 2, this.height / 5);
        ctx.lineTo(-this.width / 2.5, this.height / 3);
        ctx.closePath();
        ctx.fill();

        // Dark metal edges
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Wing details - armor plating
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(-this.width/3, -this.height/4);
        ctx.lineTo(-this.width/2.5, 0);
        ctx.lineTo(-this.width/3, this.height/5);
        ctx.lineTo(-this.width/4, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.width/3, -this.height/4);
        ctx.lineTo(this.width/2.5, 0);
        ctx.lineTo(this.width/3, this.height/5);
        ctx.lineTo(this.width/4, 0);
        ctx.closePath();
        ctx.fill();

        // Enhanced cockpit with glow
        const cockpitGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
        cockpitGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        cockpitGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.7)');
        cockpitGradient.addColorStop(1, 'rgba(0, 150, 255, 0.5)');
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Weapon pods - more prominent
        ctx.fillStyle = this.accentColor;
        // Left weapons
        ctx.fillRect(-this.width/2 + 8, -8, 10, 16);
        ctx.fillRect(-this.width/2 + 8, -this.height/3, 8, 12);
        // Right weapons
        ctx.fillRect(this.width/2 - 18, -8, 10, 16);
        ctx.fillRect(this.width/2 - 16, -this.height/3, 8, 12);

        // Front cannon
        ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.fillRect(-3, this.height/2 - 5, 6, 10);

        // Type-specific emblem
        ctx.fillStyle = this.color;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        const emblem = this.type === 'bounty' ? '💰' :
                      this.type === 'raider' ? '☠️' : '🗡️';
        ctx.fillText(emblem, 0, -this.height/4);

        ctx.globalAlpha = 1;

        // Health bar - wider and more prominent
        const healthPercent = this.health / this.maxHealth;
        const barWidth = 80;
        const barHeight = 8;

        // Health bar background with border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-barWidth/2, -this.height/2 - 25, barWidth, barHeight);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(-barWidth/2, -this.height/2 - 25, barWidth, barHeight);

        // Health bar fill with gradient
        const healthGradient = ctx.createLinearGradient(-barWidth/2, 0, barWidth/2, 0);
        if (healthPercent > 0.5) {
            healthGradient.addColorStop(0, 'rgba(0, 200, 0, 0.8)');
            healthGradient.addColorStop(1, 'rgba(0, 255, 0, 0.9)');
        } else if (healthPercent > 0.25) {
            healthGradient.addColorStop(0, 'rgba(200, 200, 0, 0.8)');
            healthGradient.addColorStop(1, 'rgba(255, 255, 0, 0.9)');
        } else {
            healthGradient.addColorStop(0, 'rgba(200, 0, 0, 0.8)');
            healthGradient.addColorStop(1, 'rgba(255, 0, 0, 0.9)');
        }
        ctx.fillStyle = healthGradient;
        ctx.fillRect(-barWidth/2, -this.height/2 - 25, barWidth * healthPercent, barHeight);

        // Name tag with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(-50, -this.height/2 - 42, 100, 14);
        ctx.fillStyle = this.color;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, 0, -this.height/2 - 31);

        ctx.restore();
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
}

/**
 * HomingProjectile - Special projectile that tracks targets
 */
class HomingProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height, target) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.target = target;
        this.turnSpeed = 0.1;
        this.maxSpeed = 8;
    }

    update() {
        if (this.target && !this.isPlayer) {
            // Calculate angle to target
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const targetAngle = Math.atan2(dy, dx);

            // Current angle
            const currentAngle = Math.atan2(this.vy, this.vx);

            // Adjust angle gradually
            let angleDiff = targetAngle - currentAngle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            const newAngle = currentAngle + angleDiff * this.turnSpeed;

            // Update velocity
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = Math.cos(newAngle) * Math.min(speed * 1.02, this.maxSpeed);
            this.vy = Math.sin(newAngle) * Math.min(speed * 1.02, this.maxSpeed);
        }

        // Call parent update
        return super.update();
    }
}