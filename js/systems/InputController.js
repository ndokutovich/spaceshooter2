export class InputController {
    constructor(canvas) {
        this.canvas = canvas;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.isTouching = false;
        this.keys = {};

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Mouse controls (for testing)
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Keyboard controls (for testing)
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
        this.isTouching = true;
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isTouching) return;
        const touch = e.touches[0];
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.isTouching = false;
    }

    handleMouseDown(e) {
        this.touchStartX = e.clientX;
        this.touchStartY = e.clientY;
        this.touchX = e.clientX;
        this.touchY = e.clientY;
        this.isTouching = true;
    }

    handleMouseMove(e) {
        if (!this.isTouching) return;
        this.touchX = e.clientX;
        this.touchY = e.clientY;
    }

    handleMouseUp(e) {
        this.isTouching = false;
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    getTouchData() {
        return {
            isTouching: this.isTouching,
            touchX: this.touchX,
            touchY: this.touchY,
            touchStartX: this.touchStartX,
            touchStartY: this.touchStartY
        };
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    processPlayerInput(player, controlMode, autoFire, projectiles) {
        if (!player) return;

        // Handle keyboard movement
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a')) {
            player.x -= player.speed * 5;
        }
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('d')) {
            player.x += player.speed * 5;
        }
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('w')) {
            player.y -= player.speed * 5;
        }
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('s')) {
            player.y += player.speed * 5;
        }

        // Handle manual shooting
        if (this.isKeyPressed(' ') && !autoFire) {
            const now = Date.now();
            if (now - player.lastShot > 1000 / player.fireRate) {
                player.shoot(projectiles);
                player.lastShot = now;
            }
        }
    }

    isPausePressed() {
        const result = this.isKeyPressed('Escape') || this.isKeyPressed('p');
        if (result) {
            // Reset the key state to prevent continuous pausing
            this.keys['Escape'] = false;
            this.keys['p'] = false;
        }
        return result;
    }
}