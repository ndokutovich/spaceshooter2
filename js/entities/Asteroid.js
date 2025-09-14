class Asteroid {
    constructor(canvas, forceType = null) {
        this.canvas = canvas;
        const sizes = ['small', 'medium', 'large'];
        this.size = sizes[Math.floor(Math.random() * sizes.length)];

        // Different asteroid types with varying rarity and value
        const typeRoll = Math.random();
        if (forceType) {
            this.type = forceType;
        } else if (typeRoll < 0.60) {
            this.type = 'rock';     // 60% - Normal asteroid
        } else if (typeRoll < 0.80) {
            this.type = 'iron';     // 20% - Iron-rich (1.5x credits)
        } else if (typeRoll < 0.92) {
            this.type = 'gold';     // 12% - Gold ore (3x credits)
        } else if (typeRoll < 0.98) {
            this.type = 'crystal';  // 6% - Energy crystal (5x credits)
        } else {
            this.type = 'platinum'; // 2% - Platinum (10x credits)
        }

        // Type properties
        this.typeProperties = {
            rock: { color: '#8B7355', creditMult: 1, healthMult: 1 },
            iron: { color: '#696969', creditMult: 1.5, healthMult: 1.2 },
            gold: { color: '#FFD700', creditMult: 3, healthMult: 1.5 },
            crystal: { color: '#00CED1', creditMult: 5, healthMult: 0.8 },
            platinum: { color: '#E5E4E2', creditMult: 10, healthMult: 2 }
        };

        const props = this.typeProperties[this.type];

        // Use FormulaService for stats
        const stats = formulaService.getAsteroidStats(this.size);
        this.radius = stats.radius;
        this.health = stats.health * props.healthMult;
        this.maxHealth = this.health;
        this.value = Math.floor(stats.credits * props.creditMult);

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

        // Use type-specific color
        const props = this.typeProperties[this.type];
        ctx.fillStyle = props.color;

        // Add glow effect for valuable asteroids
        if (this.type === 'gold' || this.type === 'crystal' || this.type === 'platinum') {
            ctx.shadowColor = props.color;
            ctx.shadowBlur = 10 + Math.sin(Date.now() * 0.002) * 5;
        }

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