class Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.isPlayer = isPlayer;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    update(canvas) {
        // Handle homing behavior if this is a homing projectile
        if (this.isHoming && this.target) {
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

            const newAngle = currentAngle + angleDiff * (this.turnSpeed || 0.1);

            // Update velocity
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const newSpeed = Math.min(speed * 1.02, this.maxSpeed || 8);
            this.vx = Math.cos(newAngle) * newSpeed;
            this.vy = Math.sin(newAngle) * newSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Return true if off screen (should be removed)
        return (this.y < -20 || this.y > canvas.height + 20 ||
                this.x < -20 || this.x > canvas.width + 20);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    static create(x, y, vx, vy, damage, isPlayer, color, width, height) {
        return new Projectile(x, y, vx, vy, damage, isPlayer, color, width, height);
    }
}