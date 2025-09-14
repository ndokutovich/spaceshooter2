class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'health' or 'shield'
        this.width = 20;
        this.height = 20;
        this.speed = formulaService.getPowerUpSpeed();
    }

    update(canvas) {
        this.y += this.speed;

        // Return true if off screen (should be removed)
        return this.y > canvas.height + 20;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Glow effect
        ctx.shadowColor = this.type === 'health' ? '#00ff00' : '#00ffff';
        ctx.shadowBlur = 10;

        // Power-up icon
        ctx.fillStyle = this.type === 'health' ? '#00ff00' : '#00ffff';
        ctx.fillRect(-10, -10, 20, 20);

        // Symbol
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.type === 'health' ? '+' : 'S', 0, 0);

        ctx.restore();
    }

    applyEffect(player) {
        const restoreAmount = formulaService.getPowerUpRestoreAmount(this.type);

        if (this.type === 'health') {
            player.health = Math.min(player.maxHealth, player.health + restoreAmount);
        } else if (this.type === 'shield') {
            player.shield = Math.min(player.maxShield, player.shield + restoreAmount);
        }

        return formulaService.getPowerUpScoreValue();
    }
}