class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.stars = [];
        this.createStars();
    }

    createStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 2 + 0.5
            });
        }
    }

    update() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }

    draw(ctx) {
        this.stars.forEach(star => {
            ctx.fillStyle = 'white';
            ctx.globalAlpha = star.size / 2;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        ctx.globalAlpha = 1;
    }

    resize(canvas) {
        this.canvas = canvas;
        // Regenerate stars for new canvas size
        this.stars = [];
        this.createStars();
    }
}