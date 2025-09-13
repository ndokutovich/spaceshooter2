export class Projectile {
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