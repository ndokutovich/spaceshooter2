class ParticleSystem {
    constructor() {
        this.particles = [];
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

    update() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }

    draw(ctx) {
        this.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / particle.maxLife;
            ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
        ctx.globalAlpha = 1;
    }

    clear() {
        this.particles = [];
    }
}