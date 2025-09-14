import { Projectile } from './Projectile.js';
import { formulaService } from '../systems/FormulaService.js';
import { StoryEvents } from '../data/StoryEvents.js';

export class Boss {
    constructor(canvas, level, levelConfig = null) {
        this.canvas = canvas;
        this.level = level;

        // Boss color palette based on level
        const bossColors = [
            '#ff0000', // Red - Scarface Jake
            '#ff00ff', // Magenta - Twin Vipers
            '#888888', // Gray - Asteroid King
            '#0000ff', // Blue - Ghost Captain
            '#ffff00', // Yellow - Queen Cobra
            '#00ff00', // Green - Red Baron
            '#ff8800', // Orange - Captain Vega
            '#8800ff', // Purple - Crystal Warlord
            '#00ffff', // Cyan - Dark Nebula
            '#ffffff'  // White - Admiral Vega (final boss)
        ];

        // Get boss data from StoryEvents
        const bossData = StoryEvents.bosses[level];

        // Use level config if provided, otherwise fallback to default
        if (levelConfig) {
            const config = levelConfig.getLevel(level);
            this.name = bossData ? bossData.name : config.bossName;
            this.health = config.bossHealth;
            this.maxHealth = this.health;
        } else {
            // Fallback using FormulaService
            this.name = bossData ? bossData.name : `Boss Level ${level}`;
            this.health = formulaService.calculateBossHealth(level);
            this.maxHealth = this.health;
        }

        // Store boss dialog data
        this.portrait = bossData ? bossData.portrait : '☠️';
        this.introDialog = bossData ? bossData.intro : null;
        this.defeatDialog = bossData ? bossData.defeat : null;
        this.tauntDialog = bossData ? bossData.taunt : null;

        this.x = canvas.width / 2;
        this.y = -100;
        this.width = 120;
        this.height = 80;
        this.color = bossColors[Math.min(level - 1, bossColors.length - 1)];
        this.phase = 1;
        this.attackTimer = 0;
        this.pattern = 'entering';

        // Calculate all boss stats using FormulaService
        this.speed = formulaService.calculateBossSpeed(level);
        this.damage = formulaService.calculateBossDamage(level);
        this.creditReward = formulaService.calculateCreditReward('boss', level);
    }

    update(player, projectiles) {
        // Boss movement patterns
        if (this.pattern === 'entering') {
            this.y += 2;
            if (this.y >= 100) {
                this.pattern = 'fighting';
            }
        } else if (this.pattern === 'fighting') {
            // Horizontal movement
            this.x += Math.sin(Date.now() * 0.001) * 3;

            // Boss attacks
            this.attackTimer++;
            if (this.attackTimer > 60) { // Attack every second
                this.attackTimer = 0;
                this.attack(player, projectiles);
            }
        }

        // Return true if defeated
        return this.health <= 0;
    }

    attack(player, projectiles) {
        if (!player) return;

        // Different attack patterns based on boss phase
        const attackPattern = Math.floor(Math.random() * 3);

        if (attackPattern === 0) {
            // Spread shot
            for (let i = -2; i <= 2; i++) {
                projectiles.push(new Projectile(
                    this.x,
                    this.y + this.height / 2,
                    i * 2,
                    5,
                    formulaService.calculateBossAttackDamage(this.damage, 'spread'),
                    false,
                    '#ff00ff',
                    6,
                    10
                ));
            }
        } else if (attackPattern === 1) {
            // Aimed shot
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            projectiles.push(new Projectile(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle) * 8,
                Math.sin(angle) * 8,
                formulaService.calculateBossAttackDamage(this.damage, 'aimed'),
                false,
                '#ff0000',
                8,
                12
            ));
        } else {
            // Circular pattern
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                projectiles.push(new Projectile(
                    this.x,
                    this.y,
                    Math.cos(angle) * 4,
                    Math.sin(angle) * 4,
                    formulaService.calculateBossAttackDamage(this.damage, 'circle'),
                    false,
                    '#ffff00',
                    5,
                    5
                ));
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Create a more detailed boss design
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.adjustColor(this.color, -50));
        gradient.addColorStop(1, this.adjustColor(this.color, -100));

        // Main body
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 3);
        ctx.lineTo(-this.width / 2, -this.height / 3);
        ctx.lineTo(-this.width / 3, -this.height / 2);
        ctx.lineTo(0, -this.height / 2.5);
        ctx.lineTo(this.width / 3, -this.height / 2);
        ctx.lineTo(this.width / 2, -this.height / 3);
        ctx.lineTo(this.width / 2, this.height / 3);
        ctx.closePath();
        ctx.fill();

        // Armor panels
        ctx.strokeStyle = this.adjustColor(this.color, 50);
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Center line
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(0, this.height / 2);
        // Cross lines
        ctx.moveTo(-this.width / 3, -this.height / 3);
        ctx.lineTo(this.width / 3, -this.height / 3);
        ctx.moveTo(-this.width / 3, 0);
        ctx.lineTo(this.width / 3, 0);
        ctx.moveTo(-this.width / 3, this.height / 3);
        ctx.lineTo(this.width / 3, this.height / 3);
        ctx.stroke();

        // Weapon turrets
        ctx.fillStyle = this.adjustColor(this.color, -70);
        // Left turret
        ctx.beginPath();
        ctx.arc(-this.width / 3, -this.height / 4, 8, 0, Math.PI * 2);
        ctx.fill();
        // Right turret
        ctx.beginPath();
        ctx.arc(this.width / 3, -this.height / 4, 8, 0, Math.PI * 2);
        ctx.fill();
        // Center turret
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Engine glows
        const engineGlow = ctx.createRadialGradient(0, -this.height / 2, 0, 0, -this.height / 2, 20);
        engineGlow.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
        engineGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)');
        engineGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
        ctx.fillStyle = engineGlow;

        // Multiple engines
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.ellipse(i * 20, -this.height / 2 - 5, 8, 12 + Math.random() * 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Warning lights
        if (this.health < this.maxHealth * 0.3) {
            ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() * 0.01) * 0.5})`;
            ctx.beginPath();
            ctx.arc(-this.width / 2.5, 0, 5, 0, Math.PI * 2);
            ctx.arc(this.width / 2.5, 0, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // Boss health bar (at top of screen)
        this.drawHealthBar(ctx);
    }

    drawHealthBar(ctx) {
        const healthPercent = this.health / this.maxHealth;

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(48, 28, this.canvas.width - 96, 24);

        // Health bar gradient
        const healthGradient = ctx.createLinearGradient(50, 0, this.canvas.width - 50, 0);
        if (healthPercent > 0.5) {
            healthGradient.addColorStop(0, '#00ff00');
            healthGradient.addColorStop(1, '#00aa00');
        } else if (healthPercent > 0.25) {
            healthGradient.addColorStop(0, '#ffff00');
            healthGradient.addColorStop(1, '#aaaa00');
        } else {
            healthGradient.addColorStop(0, '#ff0000');
            healthGradient.addColorStop(1, '#aa0000');
        }

        ctx.fillStyle = healthGradient;
        ctx.fillRect(50, 30, (this.canvas.width - 100) * healthPercent, 20);

        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 30, this.canvas.width - 100, 20);

        // Boss name
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(this.name, this.canvas.width / 2, 25);
        ctx.shadowBlur = 0;
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    // Helper function to adjust color brightness
    adjustColor(color, amount) {
        const usePound = (color[0] === '#');
        const col = usePound ? color.slice(1) : color;
        const num = parseInt(col, 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    }

    getDefeatRewards() {
        return {
            credits: this.creditReward,
            score: formulaService.calculateScoreReward('boss', this.level),
            powerUp: {
                x: this.x,
                y: this.y,
                type: 'health',
                width: 20,
                height: 20
            }
        };
    }

    getDialog(type = 'intro') {
        let message = null;
        switch(type) {
            case 'intro':
                message = this.introDialog;
                break;
            case 'defeat':
                message = this.defeatDialog;
                break;
            case 'taunt':
                message = this.tauntDialog;
                break;
        }

        if (!message) return null;

        return {
            speaker: this.name,
            message: message,
            portrait: this.portrait
        };
    }
}