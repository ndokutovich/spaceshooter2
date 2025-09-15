class ParticleSystem {
    constructor() {
        this.particles = [];
        this.damageNumbers = [];
    }

    createParticle(x, y, color, count = 1) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                life: 30,
                maxLife: 30
            });
        }
    }

    createExplosion(x, y, color, count = 30) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                color: color,
                life: 40,
                maxLife: 40
            });
        }
    }

    createDamageNumber(x, y, damage, isCritical = false) {
        const isHeal = damage < 0;
        const displayDamage = Math.abs(damage);

        let text;
        if (isHeal) {
            text = `+${Math.floor(displayDamage)}`;
        } else if (isCritical) {
            text = `CRIT! ${Math.floor(displayDamage)}`;
        } else {
            text = Math.floor(displayDamage).toString();
        }

        this.damageNumbers.push({
            x: x,
            y: y,
            text: text,
            vy: -2,
            vx: (Math.random() - 0.5) * 0.5,
            life: 60,
            maxLife: 60,
            isCritical: isCritical,
            isHeal: isHeal,
            scale: isCritical ? 1.5 : 1.0
        });

        // Create extra particles for critical hits
        if (isCritical) {
            this.createCriticalEffect(x, y);
        }
    }

    createCriticalEffect(x, y) {
        // Yellow/orange burst for critical hits
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 8 + Math.random() * 4;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: Math.random() > 0.5 ? '#ffff00' : '#ff8800',
                life: 25,
                maxLife: 25
            });
        }
    }

    update() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });

        this.damageNumbers = this.damageNumbers.filter(num => {
            num.x += num.vx;
            num.y += num.vy;
            num.vy += 0.05; // Gravity effect
            num.life--;
            return num.life > 0;
        });
    }

    draw(ctx) {
        // Draw particles
        this.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / particle.maxLife;
            ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
        ctx.globalAlpha = 1;

        // Draw damage numbers
        ctx.save();
        this.damageNumbers.forEach(num => {
            const alpha = Math.min(1, num.life / 20); // Fade out in last 20 frames
            ctx.globalAlpha = alpha;

            // Set font and color
            const fontSize = 20 * num.scale;
            ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw shadow/outline
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(num.text, num.x, num.y);

            // Draw text
            if (num.isHeal) {
                // Green for healing
                ctx.fillStyle = '#00ff00';
            } else if (num.isCritical) {
                // Gradient for critical hits
                const gradient = ctx.createLinearGradient(num.x - 30, num.y, num.x + 30, num.y);
                gradient.addColorStop(0, '#ffff00');
                gradient.addColorStop(0.5, '#ff8800');
                gradient.addColorStop(1, '#ffff00');
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = '#ffffff';
            }
            ctx.fillText(num.text, num.x, num.y);
        });
        ctx.restore();
    }

    clear() {
        this.particles = [];
        this.damageNumbers = [];
    }
}