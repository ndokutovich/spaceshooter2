/**
 * Explosive Projectile - Used by Rocket Launcher bosses
 */
class ExplosiveProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.explosionRadius = 50;
    }

    draw(ctx) {
        // Draw rocket with flame trail
        ctx.save();
        ctx.translate(this.x, this.y);

        // Flame trail
        const gradient = ctx.createLinearGradient(0, 0, 0, -20);
        gradient.addColorStop(0, 'rgba(255, 200, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width/2 - 2, 0, this.width + 4, 20);

        // Rocket body
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        // Warhead
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, -this.height/2, this.width/3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Chain Lightning Projectile - Used by Lightning Gun bosses
 */
class ChainLightningProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.chainRange = 100;
        this.chained = [];
    }

    draw(ctx) {
        // Draw lightning bolt effect
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.moveTo(this.x - this.vx * 2, this.y - this.vy * 2);

        // Create jagged lightning pattern
        for (let i = 0; i < 3; i++) {
            const offset = (Math.random() - 0.5) * 10;
            ctx.lineTo(
                this.x - this.vx * (1.5 - i * 0.5) + offset,
                this.y - this.vy * (1.5 - i * 0.5) + offset
            );
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.restore();
    }
}

/**
 * Piercing Projectile - Used by Gauss Cannon bosses
 */
class PiercingProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.pierced = [];
    }

    draw(ctx) {
        // Draw rail gun beam effect
        ctx.save();

        // Trail effect
        const gradient = ctx.createLinearGradient(
            this.x - this.vx * 3, this.y - this.vy * 3,
            this.x, this.y
        );
        gradient.addColorStop(0, 'rgba(255, 0, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.5)');
        gradient.addColorStop(1, this.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x - this.vx * 3, this.y - this.vy * 3);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // Core projectile
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height
        );

        ctx.restore();
    }
}

/**
 * Flame Projectile - Used by Flamethrower bosses
 */
class FlameProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.lifetime = 30;
        this.age = 0;
        this.burnDamage = 2;
        this.burnDuration = 60;
    }

    update(canvas) {
        this.age++;
        // Flames spread out as they travel
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vx += (Math.random() - 0.5) * 0.5;
        this.vy += (Math.random() - 0.5) * 0.5;

        // Flames dissipate after lifetime
        if (this.age > this.lifetime) {
            return true;
        }

        return super.update(canvas);
    }

    draw(ctx) {
        const alpha = 1 - (this.age / this.lifetime);

        // Draw flame particle
        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.width
        );
        gradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
        gradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.6)');
        gradient.addColorStop(0.6, 'rgba(255, 50, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * (1 + this.age * 0.05), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * BFG Projectile - Used by BFG 9000 bosses
 */
class BFGProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.explosionRadius = 150;
        this.tracerTimer = 0;
    }

    update(canvas) {
        this.tracerTimer++;
        return super.update(canvas);
    }

    draw(ctx) {
        // Draw BFG orb with energy tendrils
        ctx.save();

        // Outer energy field
        const time = Date.now() * 0.01;
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + time;
            const tendrilX = this.x + Math.cos(angle) * (this.width + Math.sin(time + i) * 10);
            const tendrilY = this.y + Math.sin(angle) * (this.width + Math.sin(time + i) * 10);

            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.quadraticCurveTo(
                this.x + Math.cos(angle + 0.5) * this.width,
                this.y + Math.sin(angle + 0.5) * this.width,
                tendrilX, tendrilY
            );
            ctx.stroke();
        }

        // Main orb
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.width
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#00ff00');
        gradient.addColorStop(0.6, '#008800');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0.2)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00ff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Quantum Projectile - Used by Quantum Disruptor bosses
 */
class QuantumProjectile extends Projectile {
    constructor(x, y, vx, vy, damage, isPlayer, color, width, height) {
        super(x, y, vx, vy, damage, isPlayer, color, width, height);
        this.timeSlowRadius = 100;
        this.timeSlowDuration = 120;
        this.distortionPhase = 0;
    }

    update(canvas) {
        this.distortionPhase += 0.1;
        return super.update(canvas);
    }

    draw(ctx) {
        // Draw quantum distortion effect
        ctx.save();

        // Distortion rings
        for (let i = 0; i < 3; i++) {
            const phase = this.distortionPhase + i * (Math.PI * 2 / 3);
            const radius = this.width + Math.sin(phase) * 10;

            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - i * 0.1})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Space-time distortion effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.width * 1.5
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.6)');
        gradient.addColorStop(0.6, 'rgba(150, 150, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(100, 100, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Quantum core
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#8888ff';

        // Flickering effect
        if (Math.random() > 0.3) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}