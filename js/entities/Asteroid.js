import { formulaService } from '../systems/FormulaService.js';

export class Asteroid {
    constructor(canvas) {
        this.canvas = canvas;
        const sizes = ['small', 'medium', 'large'];
        this.size = sizes[Math.floor(Math.random() * sizes.length)];

        // Use FormulaService for stats
        const stats = formulaService.getAsteroidStats(this.size);
        this.radius = stats.radius;
        this.health = stats.health;
        this.maxHealth = stats.health;
        this.value = stats.credits;

        this.x = Math.random() * (canvas.width - 60) + 30;
        this.y = -60;
        this.speed = formulaService.calculateAsteroidSpeed();
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.1 - 0.05;

        // Generate random asteroid shape
        this.shapePoints = this.generateShape();
    }

    generateShape() {
        const points = [];
        const numPoints = 8;
        for (let i = 0; i < numPoints; i++) {
            const angle = (Math.PI * 2 / numPoints) * i;
            const radiusVariation = 0.8 + Math.random() * 0.4;
            points.push({
                angle: angle,
                radius: radiusVariation
            });
        }
        return points;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;

        // Return true if off screen (should be removed)
        return this.y > this.canvas.height + this.radius * 2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.fillStyle = '#8B7355';
        ctx.beginPath();

        // Draw irregular asteroid shape using pre-generated points
        this.shapePoints.forEach((point, i) => {
            const x = Math.cos(point.angle) * this.radius * point.radius;
            const y = Math.sin(point.angle) * this.radius * point.radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    // For collision detection
    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}