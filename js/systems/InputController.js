class InputController {
    constructor(canvas) {
        this.canvas = canvas;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.isTouching = false;
        this.keys = {};

        // Cheat code tracking
        this.cheatBuffer = '';
        this.cheatTimeout = null;
        this.cheatsActivated = {
            allWeapons: false,
            replenish: false
        };

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

        // Track cheat codes
        this.trackCheatCode(e.key);
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    trackCheatCode(key) {
        // Clear buffer after 1 second of no input
        if (this.cheatTimeout) {
            clearTimeout(this.cheatTimeout);
        }
        this.cheatTimeout = setTimeout(() => {
            this.cheatBuffer = '';
        }, 1000);

        // Add key to buffer
        this.cheatBuffer += key;

        // Check for cheat codes
        if (this.cheatBuffer.endsWith(']]')) {
            this.cheatsActivated.allWeapons = true;
            this.cheatBuffer = '';
            console.log(languageSystem.t('CHEAT: All weapons unlocked!'));
        } else if (this.cheatBuffer.endsWith('[[')) {
            this.cheatsActivated.replenish = true;
            this.cheatBuffer = '';
            console.log(languageSystem.t('CHEAT: Replenished!'));
        }

        // Keep buffer size reasonable
        if (this.cheatBuffer.length > 10) {
            this.cheatBuffer = this.cheatBuffer.slice(-10);
        }
    }

    checkAndResetCheats() {
        const cheats = { ...this.cheatsActivated };
        this.cheatsActivated.allWeapons = false;
        this.cheatsActivated.replenish = false;
        return cheats;
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
            const weapon = player.weaponSystem.getCurrentWeapon();
            const fireRate = weapon.fireRate * (player.baseFireRate / 2);
            if (now - player.lastShot > 1000 / fireRate && player.weaponSystem.hasAmmo()) {
                player.shoot(projectiles);
                player.lastShot = now;
            }
        }

        // Handle weapon switching (1-9, 0 keys)
        for (let i = 1; i <= 9; i++) {
            if (this.isKeyPressed(i.toString())) {
                player.weaponSystem.switchWeaponByKey(i.toString());
                this.keys[i.toString()] = false; // Prevent repeated switching
            }
        }
        if (this.isKeyPressed('0')) {
            player.weaponSystem.switchWeaponByKey('0');
            this.keys['0'] = false;
        }

        // Mouse wheel weapon switching (Q and E as alternatives)
        if (this.isKeyPressed('q')) {
            player.weaponSystem.previousWeapon();
            this.keys['q'] = false;
        }
        if (this.isKeyPressed('e')) {
            player.weaponSystem.nextWeapon();
            this.keys['e'] = false;
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