class Boss {
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

        // Each boss uses the weapon they drop when defeated
        switch(this.level) {
            case 1:
                this.shotgunBlasterAttack(player, projectiles);
                break;
            case 2:
                this.plasmaRifleAttack(player, projectiles);
                break;
            case 3:
                this.rocketLauncherAttack(player, projectiles);
                break;
            case 4:
                this.lightningGunAttack(player, projectiles);
                break;
            case 5:
                this.superShotgunAttack(player, projectiles);
                break;
            case 6:
                this.gaussCannonAttack(player, projectiles);
                break;
            case 7:
                this.flamethrowerAttack(player, projectiles);
                break;
            case 8:
                this.bfgAttack(player, projectiles);
                break;
            case 9:
                this.quantumDisruptorAttack(player, projectiles);
                break;
            case 10:
                this.finalBossAttack(player, projectiles);
                break;
            default:
                this.defaultAttack(player, projectiles);
        }
    }

    // Level 1 Boss - Shotgun Blaster pattern
    shotgunBlasterAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Spread of 5 projectiles
        for (let i = -2; i <= 2; i++) {
            const spread = 0.3; // Similar to weapon spread
            projectiles.push(new Projectile(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle + i * spread * 0.5) * 8,
                Math.sin(angle + i * spread * 0.5) * 8,
                formulaService.calculateBossAttackDamage(this.damage * 0.8, 'spread'),
                false,
                '#ffaa00',
                6,
                6
            ));
        }
    }

    // Level 2 Boss - Plasma Rifle pattern
    plasmaRifleAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Rapid fire plasma bolts (burst of 3)
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (this.health > 0) {
                    projectiles.push(new Projectile(
                        this.x,
                        this.y + this.height / 2,
                        Math.cos(angle + (Math.random() - 0.5) * 0.05) * 12,
                        Math.sin(angle + (Math.random() - 0.5) * 0.05) * 12,
                        formulaService.calculateBossAttackDamage(this.damage * 1.2, 'aimed'),
                        false,
                        '#00aaff',
                        8,
                        8
                    ));
                }
            }, i * 100);
        }
    }

    // Level 3 Boss - Rocket Launcher pattern
    rocketLauncherAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Slower, high damage explosive projectile
        projectiles.push(new ExplosiveProjectile(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * 6,
            Math.sin(angle) * 6,
            formulaService.calculateBossAttackDamage(this.damage * 2.5, 'heavy'),
            false,
            '#ff0000',
            10,
            16
        ));
    }

    // Level 4 Boss - Lightning Gun pattern
    lightningGunAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Fast chain lightning projectile
        projectiles.push(new ChainLightningProjectile(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * 20,
            Math.sin(angle) * 20,
            formulaService.calculateBossAttackDamage(this.damage * 1.5, 'pierce'),
            false,
            '#ffff00',
            3,
            30
        ));
    }

    // Level 5 Boss - Super Shotgun pattern
    superShotgunAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Wide spread of 10 projectiles
        for (let i = -5; i < 5; i++) {
            const spread = 0.5;
            projectiles.push(new Projectile(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle + i * spread * 0.2) * 9,
                Math.sin(angle + i * spread * 0.2) * 9,
                formulaService.calculateBossAttackDamage(this.damage * 0.6, 'spread'),
                false,
                '#ff6600',
                7,
                7
            ));
        }
    }

    // Level 6 Boss - Gauss Cannon pattern
    gaussCannonAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // High velocity piercing shot
        projectiles.push(new PiercingProjectile(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * 25,
            Math.sin(angle) * 25,
            formulaService.calculateBossAttackDamage(this.damage * 3, 'heavy'),
            false,
            '#ff00ff',
            5,
            40
        ));
    }

    // Level 7 Boss - Flamethrower pattern
    flamethrowerAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Stream of fire projectiles
        for (let i = -1; i <= 1; i++) {
            projectiles.push(new Projectile(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle + i * 0.2) * 7,
                Math.sin(angle + i * 0.2) * 7,
                formulaService.calculateBossAttackDamage(this.damage * 0.5, 'burn'),
                false,
                '#ff4400',
                12,
                12
            ));
        }
    }

    // Level 8 Boss - BFG 9000 pattern
    bfgAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Massive slow-moving projectile with area damage
        projectiles.push(new BFGProjectile(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * 4,
            Math.sin(angle) * 4,
            formulaService.calculateBossAttackDamage(this.damage * 5, 'massive'),
            false,
            '#00ff00',
            30,
            30
        ));
    }

    // Level 9 Boss - Quantum Disruptor pattern
    quantumDisruptorAttack(player, projectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        // Quantum projectile that distorts space
        projectiles.push(new QuantumProjectile(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * 15,
            Math.sin(angle) * 15,
            formulaService.calculateBossAttackDamage(this.damage * 3.5, 'quantum'),
            false,
            '#ffffff',
            20,
            20
        ));
    }

    // Level 10 Final Boss - Uses all weapon patterns
    finalBossAttack(player, projectiles) {
        // Cycle through different weapon patterns based on health
        const healthPercent = this.health / this.maxHealth;

        if (healthPercent > 0.75) {
            // Phase 1: Shotgun and Plasma
            if (this.attackTimer % 120 < 60) {
                this.shotgunBlasterAttack(player, projectiles);
            } else {
                this.plasmaRifleAttack(player, projectiles);
            }
        } else if (healthPercent > 0.5) {
            // Phase 2: Rockets and Lightning
            if (this.attackTimer % 120 < 60) {
                this.rocketLauncherAttack(player, projectiles);
            } else {
                this.lightningGunAttack(player, projectiles);
            }
        } else if (healthPercent > 0.25) {
            // Phase 3: Gauss and Flame
            if (this.attackTimer % 120 < 60) {
                this.gaussCannonAttack(player, projectiles);
            } else {
                this.flamethrowerAttack(player, projectiles);
            }
        } else {
            // Phase 4: BFG and Quantum
            if (this.attackTimer % 180 < 90) {
                this.bfgAttack(player, projectiles);
            } else {
                this.quantumDisruptorAttack(player, projectiles);
            }
        }
    }

    // Default attack pattern (fallback)
    defaultAttack(player, projectiles) {
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