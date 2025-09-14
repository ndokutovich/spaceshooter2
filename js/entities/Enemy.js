class Enemy {
    constructor(canvas, level) {
        this.canvas = canvas;
        this.level = level;
        const types = ['scout', 'fighter', 'heavy'];
        this.type = types[Math.min(Math.floor(Math.random() * level), types.length - 1)];

        this.x = Math.random() * (canvas.width - 40) + 20;
        this.y = -50;
        this.width = 30;
        this.height = 30;

        // Use FormulaService for stats calculation
        const stats = formulaService.calculateEnemyStats(this.type, level);
        this.health = stats.health;
        this.maxHealth = stats.health;
        this.speed = stats.speed;
        this.damage = stats.damage;
        this.fireRate = stats.fireRate;

        this.lastShot = Date.now();

        // Use FormulaService for credit calculation
        this.value = formulaService.calculateCreditReward(this.type, level);
        this.color = this.type === 'scout' ? '#ff9900' : this.type === 'fighter' ? '#ff0000' : '#ff00ff';
        this.pattern = Math.random() < 0.5 ? 'straight' : 'zigzag';
        this.zigzagTimer = 0;
    }

    update(player, projectiles) {
        // Movement patterns
        if (this.pattern === 'straight') {
            this.y += this.speed;
        } else if (this.pattern === 'zigzag') {
            this.y += this.speed;
            this.zigzagTimer++;
            this.x += Math.sin(this.zigzagTimer * 0.1) * 2;
        }

        // Enemy shooting
        const now = Date.now();
        if (now - this.lastShot > 1000 / this.fireRate && player) {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            projectiles.push(new Projectile(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle) * 5,
                Math.sin(angle) * 5,
                this.damage,
                false,
                '#ff0000',
                4,
                8
            ));
            this.lastShot = now;
        }

        // Return true if off screen (should be removed)
        return this.y > this.canvas.height + 50;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Enemy ship
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.height / 2);
        ctx.lineTo(-this.width / 2, -this.height / 2);
        ctx.lineTo(this.width / 2, -this.height / 2);
        ctx.closePath();
        ctx.fill();

        // Health bar
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(-this.width / 2, -this.height / 2 - 10, this.width * healthPercent, 3);

        ctx.restore();
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
}