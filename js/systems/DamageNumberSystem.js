export class DamageNumberSystem {
    constructor() {
        this.numbers = [];
    }

    createDamageNumber(x, y, damage, isCritical = false, isPlayer = true) {
        // Determine color based on damage source and type
        let color = '#ffff00'; // Default yellow for player damage
        let size = 16;

        if (!isPlayer) {
            color = '#ff4444'; // Red for damage to player
        } else if (isCritical) {
            color = '#ff00ff'; // Magenta for critical hits
            size = 20;
        } else if (damage >= 50) {
            color = '#ffa500'; // Orange for high damage
            size = 18;
        } else if (damage >= 100) {
            color = '#ff0000'; // Red for massive damage
            size = 22;
        }

        this.numbers.push({
            x: x + (Math.random() - 0.5) * 20, // Slight random offset
            y: y,
            vx: (Math.random() - 0.5) * 2,     // Slight horizontal drift
            vy: -2 - Math.random(),            // Float upward
            text: Math.floor(damage).toString(),
            color: color,
            size: size,
            life: 60,                          // 1 second at 60fps
            maxLife: 60,
            isCritical: isCritical,
            bounce: 0,                          // For animation
            scale: 1.5                          // Start larger for pop effect
        });
    }

    createHealNumber(x, y, amount) {
        this.numbers.push({
            x: x,
            y: y,
            vx: 0,
            vy: -1.5,
            text: '+' + Math.floor(amount),
            color: '#00ff00', // Green for healing
            size: 16,
            life: 60,
            maxLife: 60,
            isCritical: false,
            bounce: 0,
            scale: 1.3
        });
    }

    createTextNotification(x, y, text, color = '#00ffff') {
        this.numbers.push({
            x: x,
            y: y,
            vx: 0,
            vy: -1,
            text: text,
            color: color,
            size: 14,
            life: 90, // Longer duration for text
            maxLife: 90,
            isCritical: false,
            bounce: 0,
            scale: 1.2
        });
    }

    update() {
        this.numbers = this.numbers.filter(num => {
            // Update position
            num.x += num.vx;
            num.y += num.vy;

            // Slow down vertical movement over time
            num.vy *= 0.98;

            // Add slight gravity after halfway point
            if (num.life < num.maxLife / 2) {
                num.vy += 0.02;
            }

            // Update scale for pop effect
            if (num.scale > 1) {
                num.scale -= 0.05;
                if (num.scale < 1) num.scale = 1;
            }

            // Critical hit bounce animation
            if (num.isCritical) {
                num.bounce = Math.sin(Date.now() * 0.01) * 2;
            }

            num.life--;
            return num.life > 0;
        });
    }

    draw(ctx) {
        this.numbers.forEach(num => {
            ctx.save();

            // Calculate opacity fade
            const fadeStart = num.maxLife * 0.3; // Start fading at 30% life
            let alpha = 1;
            if (num.life < fadeStart) {
                alpha = num.life / fadeStart;
            }
            ctx.globalAlpha = alpha;

            // Set up text style
            const fontSize = num.size * num.scale;
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw shadow for better visibility
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(num.text, num.x + 2, num.y + 2 + num.bounce);

            // Draw main text
            ctx.fillStyle = num.color;
            ctx.fillText(num.text, num.x, num.y + num.bounce);

            // Draw critical hit effects
            if (num.isCritical && num.life > num.maxLife * 0.7) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.globalAlpha = alpha * 0.5;
                ctx.strokeText(num.text, num.x, num.y + num.bounce);
            }

            ctx.restore();
        });
    }

    clear() {
        this.numbers = [];
    }

    // Get active damage number count (for performance monitoring)
    getCount() {
        return this.numbers.length;
    }
}