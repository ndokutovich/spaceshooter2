// Game Class
class SpaceShooterGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // Game state
        this.currentScreen = 'platformLogo';
        this.isPlaying = false;
        this.isPaused = false;
        this.level = 1;
        this.score = 0;
        this.credits = 500; // Start with some credits for testing
        this.gameStartTime = 0;
        
        // Player
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        this.particles = [];
        this.asteroids = [];
        
        // Boss
        this.boss = null;
        this.bossActive = false;
        
        // Wave system
        this.waveTimer = 0;
        this.currentWave = 1;
        this.enemiesKilled = 0;
        this.enemiesPerWave = 10;
        
        // Controls
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.isTouching = false;
        this.controlMode = 'touch';
        this.autoFire = true;
        
        // Upgrades
        this.upgrades = {
            maxHealth: { level: 0, maxLevel: 10, baseCost: 100, multiplier: 1.5 },
            damage: { level: 0, maxLevel: 10, baseCost: 150, multiplier: 1.5 },
            fireRate: { level: 0, maxLevel: 8, baseCost: 120, multiplier: 1.4 },
            speed: { level: 0, maxLevel: 10, baseCost: 80, multiplier: 1.3 },
            shield: { level: 0, maxLevel: 10, baseCost: 200, multiplier: 1.6 }
        };
        
        // High scores
        this.highScores = this.loadHighScores();
        
        // Load saved options
        this.loadOptions();
        
        // Background stars
        this.stars = [];
        this.createStarfield();
        
        // Initialize
        this.init();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Setup event listeners
        this.setupEventListeners();
        
        // Start with logo sequence
        this.showLogoSequence();
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
    
    showLogoSequence() {
        setTimeout(() => {
            this.hideScreen('platformLogo');
            this.showScreen('vendorLogo');
            
            setTimeout(() => {
                this.hideScreen('vendorLogo');
                this.showScreen('gameLogo');
                
                // Add click/touch to continue
                const logoScreen = document.getElementById('gameLogo');
                const continueHandler = () => {
                    this.hideScreen('gameLogo');
                    this.showScreen('mainMenu');
                    logoScreen.removeEventListener('click', continueHandler);
                    logoScreen.removeEventListener('touchstart', continueHandler);
                };
                logoScreen.addEventListener('click', continueHandler);
                logoScreen.addEventListener('touchstart', continueHandler);
            }, 1500);
        }, 1500);
    }
    
    showScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }
    
    hideScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('active');
        }
    }
    
    startGame() {
        this.hideScreen('mainMenu');
        this.hideScreen('upgradeScreen');
        document.getElementById('hud').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'block';
        
        // Reset game state
        this.isPlaying = true;
        this.isPaused = false;
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        this.particles = [];
        this.asteroids = [];
        this.boss = null;
        this.bossActive = false;
        this.waveTimer = 0;
        this.currentWave = 1;
        this.enemiesKilled = 0;
        this.gameStartTime = Date.now();
        
        // Create player
        this.createPlayer();
        
        // Update HUD
        this.updateHUD();
        
        // Start game loop
        this.gameLoop();
    }
    
    createPlayer() {
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 100,
            width: 40,
            height: 40,
            speed: 5 + (this.upgrades.speed.level * 0.5),
            health: 100 + (this.upgrades.maxHealth.level * 40),
            maxHealth: 100 + (this.upgrades.maxHealth.level * 40),
            shield: 50 + (this.upgrades.shield.level * 15),
            maxShield: 50 + (this.upgrades.shield.level * 15),
            damage: 10 + (this.upgrades.damage.level * 5),
            fireRate: 2 + (this.upgrades.fireRate.level * 0.5),
            lastShot: 0,
            shieldRegenTimer: 0,
            invulnerable: false,
            invulnerableTimer: 0
        };
    }
    
    createStarfield() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 2 + 0.5
            });
        }
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        if (this.isPaused) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw everything
        this.updateStars();
        this.drawStars();
        
        this.updatePlayer();
        this.drawPlayer();
        
        this.updateEnemies();
        this.drawEnemies();
        
        this.updateProjectiles();
        this.drawProjectiles();
        
        this.updatePowerUps();
        this.drawPowerUps();
        
        this.updateParticles();
        this.drawParticles();
        
        this.updateAsteroids();
        this.drawAsteroids();
        
        if (this.bossActive && this.boss) {
            this.updateBoss();
            this.drawBoss();
        }
        
        // Spawn waves
        this.spawnWaves();
        
        // Check collisions
        this.checkCollisions();
        
        // Update HUD
        this.updateHUD();
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    drawStars() {
        this.ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.size / 2;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        this.ctx.globalAlpha = 1;
    }
    
    updatePlayer() {
        if (!this.player) return;
        
        // Handle movement based on control mode
        if (this.isTouching) {
            if (this.controlMode === 'touch') {
                this.player.x = this.touchX;
                this.player.y = this.touchY;
            } else if (this.controlMode === 'relative') {
                this.player.x += (this.touchX - this.touchStartX) * 0.1;
                this.player.y += (this.touchY - this.touchStartY) * 0.1;
            }
        }
        
        // Keep player in bounds
        this.player.x = Math.max(20, Math.min(this.canvas.width - 20, this.player.x));
        this.player.y = Math.max(20, Math.min(this.canvas.height - 20, this.player.y));
        
        // Auto fire
        if (this.autoFire) {
            const now = Date.now();
            if (now - this.player.lastShot > 1000 / this.player.fireRate) {
                this.playerShoot();
                this.player.lastShot = now;
            }
        }
        
        // Shield regeneration
        if (this.player.shield < this.player.maxShield) {
            this.player.shieldRegenTimer++;
            if (this.player.shieldRegenTimer > 180) { // 3 seconds at 60fps
                this.player.shield = Math.min(this.player.maxShield, this.player.shield + 1);
            }
        } else {
            this.player.shieldRegenTimer = 0;
        }
        
        // Invulnerability timer
        if (this.player.invulnerable) {
            this.player.invulnerableTimer--;
            if (this.player.invulnerableTimer <= 0) {
                this.player.invulnerable = false;
            }
        }
    }
    
    drawPlayer() {
        if (!this.player) return;
        
        this.ctx.save();
        
        // Draw ship (triangle)
        this.ctx.translate(this.player.x, this.player.y);
        
        // Blinking effect when invulnerable
        if (this.player.invulnerable && Math.floor(this.player.invulnerableTimer / 5) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }
        
        // Ship body
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -20);
        this.ctx.lineTo(-15, 20);
        this.ctx.lineTo(15, 20);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Ship details
        this.ctx.fillStyle = '#0099ff';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -10);
        this.ctx.lineTo(-8, 10);
        this.ctx.lineTo(8, 10);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Shield visualization
        if (this.player.shield > 0) {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    playerShoot() {
        if (!this.player) return;
        
        this.projectiles.push({
            x: this.player.x,
            y: this.player.y - 20,
            vx: 0,
            vy: -10,
            damage: this.player.damage,
            isPlayer: true,
            color: '#00ff00',
            width: 4,
            height: 12
        });
    }
    
    spawnWaves() {
        this.waveTimer++;
        
        // Check if we should spawn boss
        if (this.enemiesKilled >= 30 && !this.bossActive) {
            this.spawnBoss();
            return;
        }
        
        // Spawn regular enemies
        if (this.waveTimer > 120 && this.enemies.length < 5 && !this.bossActive) { // Every 2 seconds
            this.waveTimer = 0;
            
            const enemyCount = Math.min(3 + Math.floor(this.level / 2), 8);
            for (let i = 0; i < enemyCount; i++) {
                this.spawnEnemy();
            }
            
            // Spawn asteroids occasionally
            if (Math.random() < 0.3) {
                this.spawnAsteroid();
            }
        }
    }
    
    spawnEnemy() {
        const types = ['scout', 'fighter', 'heavy'];
        const type = types[Math.min(Math.floor(Math.random() * this.level), types.length - 1)];
        
        const enemy = {
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: -50,
            width: 30,
            height: 30,
            type: type,
            health: type === 'scout' ? 10 : type === 'fighter' ? 20 : 40,
            maxHealth: type === 'scout' ? 10 : type === 'fighter' ? 20 : 40,
            speed: type === 'scout' ? 3 : type === 'fighter' ? 2 : 1,
            damage: type === 'scout' ? 10 : type === 'fighter' ? 15 : 25,
            fireRate: type === 'scout' ? 0.5 : type === 'fighter' ? 1 : 0.3,
            lastShot: Date.now(),
            value: type === 'scout' ? 10 : type === 'fighter' ? 25 : 50,
            color: type === 'scout' ? '#ff9900' : type === 'fighter' ? '#ff0000' : '#ff00ff',
            pattern: Math.random() < 0.5 ? 'straight' : 'zigzag',
            zigzagTimer: 0
        };
        
        this.enemies.push(enemy);
    }
    
    spawnAsteroid() {
        const sizes = ['small', 'medium', 'large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        
        const asteroid = {
            x: Math.random() * (this.canvas.width - 60) + 30,
            y: -60,
            size: size,
            radius: size === 'small' ? 15 : size === 'medium' ? 25 : 40,
            health: size === 'small' ? 10 : size === 'medium' ? 25 : 50,
            speed: Math.random() * 2 + 1,
            rotation: 0,
            rotationSpeed: Math.random() * 0.1 - 0.05,
            value: size === 'small' ? 10 : size === 'medium' ? 25 : 50
        };
        
        this.asteroids.push(asteroid);
    }
    
    spawnBoss() {
        this.bossActive = true;
        
        const bossTypes = [
            { name: 'Destroyer Alpha', health: 500, color: '#ff0000' },
            { name: 'Twin Sentinel', health: 600, color: '#ff00ff' },
            { name: 'Asteroid Fortress', health: 800, color: '#888888' },
            { name: 'Stealth Battleship', health: 700, color: '#0000ff' },
            { name: 'Swarm Queen', health: 600, color: '#ffff00' }
        ];
        
        const bossType = bossTypes[Math.min(this.level - 1, bossTypes.length - 1)];
        
        this.boss = {
            x: this.canvas.width / 2,
            y: -100,
            width: 120,
            height: 80,
            health: bossType.health * (1 + (this.level - 1) * 0.3),
            maxHealth: bossType.health * (1 + (this.level - 1) * 0.3),
            name: bossType.name,
            color: bossType.color,
            speed: 1,
            phase: 1,
            attackTimer: 0,
            pattern: 'entering'
        };
    }
    
    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            // Movement patterns
            if (enemy.pattern === 'straight') {
                enemy.y += enemy.speed;
            } else if (enemy.pattern === 'zigzag') {
                enemy.y += enemy.speed;
                enemy.zigzagTimer++;
                enemy.x += Math.sin(enemy.zigzagTimer * 0.1) * 2;
            }
            
            // Enemy shooting
            const now = Date.now();
            if (now - enemy.lastShot > 1000 / enemy.fireRate && this.player) {
                const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
                this.projectiles.push({
                    x: enemy.x,
                    y: enemy.y + enemy.height / 2,
                    vx: Math.cos(angle) * 5,
                    vy: Math.sin(angle) * 5,
                    damage: enemy.damage,
                    isPlayer: false,
                    color: '#ff0000',
                    width: 4,
                    height: 8
                });
                enemy.lastShot = now;
            }
            
            // Remove if off screen
            if (enemy.y > this.canvas.height + 50) {
                this.enemies.splice(index, 1);
            }
        });
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);
            
            // Enemy ship
            this.ctx.fillStyle = enemy.color;
            this.ctx.beginPath();
            this.ctx.moveTo(0, enemy.height / 2);
            this.ctx.lineTo(-enemy.width / 2, -enemy.height / 2);
            this.ctx.lineTo(enemy.width / 2, -enemy.height / 2);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Health bar
            const healthPercent = enemy.health / enemy.maxHealth;
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            this.ctx.fillRect(-enemy.width / 2, -enemy.height / 2 - 10, enemy.width * healthPercent, 3);
            
            this.ctx.restore();
        });
    }
    
    updateBoss() {
        if (!this.boss) return;
        
        // Boss movement patterns
        if (this.boss.pattern === 'entering') {
            this.boss.y += 2;
            if (this.boss.y >= 100) {
                this.boss.pattern = 'fighting';
            }
        } else if (this.boss.pattern === 'fighting') {
            // Horizontal movement
            this.boss.x += Math.sin(Date.now() * 0.001) * 3;
            
            // Boss attacks
            this.boss.attackTimer++;
            if (this.boss.attackTimer > 60) { // Attack every second
                this.boss.attackTimer = 0;
                this.bossAttack();
            }
        }
        
        // Check if boss is defeated
        if (this.boss.health <= 0) {
            this.defeatBoss();
        }
    }
    
    drawBoss() {
        if (!this.boss) return;
        
        this.ctx.save();
        this.ctx.translate(this.boss.x, this.boss.y);
        
        // Create a more detailed boss design
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.boss.width / 2);
        gradient.addColorStop(0, this.boss.color);
        gradient.addColorStop(0.5, this.adjustColor(this.boss.color, -50));
        gradient.addColorStop(1, this.adjustColor(this.boss.color, -100));
        
        // Main body
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.boss.height / 2);
        this.ctx.lineTo(-this.boss.width / 2, this.boss.height / 3);
        this.ctx.lineTo(-this.boss.width / 2, -this.boss.height / 3);
        this.ctx.lineTo(-this.boss.width / 3, -this.boss.height / 2);
        this.ctx.lineTo(0, -this.boss.height / 2.5);
        this.ctx.lineTo(this.boss.width / 3, -this.boss.height / 2);
        this.ctx.lineTo(this.boss.width / 2, -this.boss.height / 3);
        this.ctx.lineTo(this.boss.width / 2, this.boss.height / 3);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Armor panels
        this.ctx.strokeStyle = this.adjustColor(this.boss.color, 50);
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        // Center line
        this.ctx.moveTo(0, -this.boss.height / 2);
        this.ctx.lineTo(0, this.boss.height / 2);
        // Cross lines
        this.ctx.moveTo(-this.boss.width / 3, -this.boss.height / 3);
        this.ctx.lineTo(this.boss.width / 3, -this.boss.height / 3);
        this.ctx.moveTo(-this.boss.width / 3, 0);
        this.ctx.lineTo(this.boss.width / 3, 0);
        this.ctx.moveTo(-this.boss.width / 3, this.boss.height / 3);
        this.ctx.lineTo(this.boss.width / 3, this.boss.height / 3);
        this.ctx.stroke();
        
        // Weapon turrets
        this.ctx.fillStyle = this.adjustColor(this.boss.color, -70);
        // Left turret
        this.ctx.beginPath();
        this.ctx.arc(-this.boss.width / 3, -this.boss.height / 4, 8, 0, Math.PI * 2);
        this.ctx.fill();
        // Right turret
        this.ctx.beginPath();
        this.ctx.arc(this.boss.width / 3, -this.boss.height / 4, 8, 0, Math.PI * 2);
        this.ctx.fill();
        // Center turret
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Engine glows
        const engineGlow = this.ctx.createRadialGradient(0, -this.boss.height / 2, 0, 0, -this.boss.height / 2, 20);
        engineGlow.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
        engineGlow.addColorStop(0.5, 'rgba(255, 100, 0, 0.4)');
        engineGlow.addColorStop(1, 'rgba(255, 50, 0, 0)');
        this.ctx.fillStyle = engineGlow;
        
        // Multiple engines
        for (let i = -1; i <= 1; i++) {
            this.ctx.beginPath();
            this.ctx.ellipse(i * 20, -this.boss.height / 2 - 5, 8, 12 + Math.random() * 6, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Warning lights
        if (this.boss.health < this.boss.maxHealth * 0.3) {
            this.ctx.fillStyle = `rgba(255, 0, 0, ${0.5 + Math.sin(Date.now() * 0.01) * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(-this.boss.width / 2.5, 0, 5, 0, Math.PI * 2);
            this.ctx.arc(this.boss.width / 2.5, 0, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        // Boss health bar (at top of screen)
        const healthPercent = this.boss.health / this.boss.maxHealth;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(48, 28, this.canvas.width - 96, 24);
        
        // Health bar gradient
        const healthGradient = this.ctx.createLinearGradient(50, 0, this.canvas.width - 50, 0);
        if (healthPercent > 0.5) {
            healthGradient.addColorStop(0, '#00ff00');
            healthGradient.addColorStop(1, '#00aa00');
        } else if (healthPercent > 0.25) {
            healthGradient.addColorStop(0, '#ffff00');
            healthGradient.addColorStop(1, '#aaaa00');
        } else {
            healthGradient.addColorStop(0, '#ff0000');
            healthGradient.addColorStop(1, '#aa0000');
        }
        
        this.ctx.fillStyle = healthGradient;
        this.ctx.fillRect(50, 30, (this.canvas.width - 100) * healthPercent, 20);
        
        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, 30, this.canvas.width - 100, 20);
        
        // Boss name
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'black';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(this.boss.name, this.canvas.width / 2, 25);
        this.ctx.shadowBlur = 0;
    }
    
    // Helper function to adjust color brightness
    adjustColor(color, amount) {
        const usePound = (color[0] === '#');
        const col = usePound ? color.slice(1) : color;
        const num = parseInt(col, 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    }
    
    bossAttack() {
        if (!this.boss || !this.player) return;
        
        // Different attack patterns based on boss phase
        const attackPattern = Math.floor(Math.random() * 3);
        
        if (attackPattern === 0) {
            // Spread shot
            for (let i = -2; i <= 2; i++) {
                this.projectiles.push({
                    x: this.boss.x,
                    y: this.boss.y + this.boss.height / 2,
                    vx: i * 2,
                    vy: 5,
                    damage: 20,
                    isPlayer: false,
                    color: '#ff00ff',
                    width: 6,
                    height: 10
                });
            }
        } else if (attackPattern === 1) {
            // Aimed shot
            const angle = Math.atan2(this.player.y - this.boss.y, this.player.x - this.boss.x);
            this.projectiles.push({
                x: this.boss.x,
                y: this.boss.y + this.boss.height / 2,
                vx: Math.cos(angle) * 8,
                vy: Math.sin(angle) * 8,
                damage: 30,
                isPlayer: false,
                color: '#ff0000',
                width: 8,
                height: 12
            });
        } else {
            // Circular pattern
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                this.projectiles.push({
                    x: this.boss.x,
                    y: this.boss.y,
                    vx: Math.cos(angle) * 4,
                    vy: Math.sin(angle) * 4,
                    damage: 15,
                    isPlayer: false,
                    color: '#ffff00',
                    width: 5,
                    height: 5
                });
            }
        }
    }
    
    defeatBoss() {
        // Create explosion effect
        for (let i = 0; i < 30; i++) {
            this.createParticle(this.boss.x, this.boss.y, this.boss.color);
        }
        
        // Drop rewards
        this.credits += 500 * this.level;
        this.score += 1000 * this.level;
        
        // Spawn power-up
        this.powerUps.push({
            x: this.boss.x,
            y: this.boss.y,
            type: 'health',
            width: 20,
            height: 20
        });
        
        this.boss = null;
        this.bossActive = false;
        
        // Level complete
        setTimeout(() => this.levelComplete(), 2000);
    }
    
    updateAsteroids() {
        this.asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed;
            asteroid.rotation += asteroid.rotationSpeed;
            
            if (asteroid.y > this.canvas.height + asteroid.radius * 2) {
                this.asteroids.splice(index, 1);
            }
        });
    }
    
    drawAsteroids() {
        this.asteroids.forEach(asteroid => {
            this.ctx.save();
            this.ctx.translate(asteroid.x, asteroid.y);
            this.ctx.rotate(asteroid.rotation);
            
            this.ctx.fillStyle = '#8B7355';
            this.ctx.beginPath();
            
            // Draw irregular asteroid shape
            const points = 8;
            for (let i = 0; i < points; i++) {
                const angle = (Math.PI * 2 / points) * i;
                const radius = asteroid.radius * (0.8 + Math.random() * 0.4);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    updateProjectiles() {
        this.projectiles.forEach((projectile, index) => {
            projectile.x += projectile.vx;
            projectile.y += projectile.vy;
            
            // Remove if off screen
            if (projectile.y < -20 || projectile.y > this.canvas.height + 20 ||
                projectile.x < -20 || projectile.x > this.canvas.width + 20) {
                this.projectiles.splice(index, 1);
            }
        });
    }
    
    drawProjectiles() {
        this.projectiles.forEach(projectile => {
            this.ctx.fillStyle = projectile.color;
            this.ctx.fillRect(
                projectile.x - projectile.width / 2,
                projectile.y - projectile.height / 2,
                projectile.width,
                projectile.height
            );
        });
    }
    
    updatePowerUps() {
        this.powerUps.forEach((powerUp, index) => {
            powerUp.y += 2;
            
            // Remove if off screen
            if (powerUp.y > this.canvas.height + 20) {
                this.powerUps.splice(index, 1);
            }
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.save();
            this.ctx.translate(powerUp.x, powerUp.y);
            
            // Glow effect
            this.ctx.shadowColor = powerUp.type === 'health' ? '#00ff00' : '#00ffff';
            this.ctx.shadowBlur = 10;
            
            // Power-up icon
            this.ctx.fillStyle = powerUp.type === 'health' ? '#00ff00' : '#00ffff';
            this.ctx.fillRect(-10, -10, 20, 20);
            
            // Symbol
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(powerUp.type === 'health' ? '+' : 'S', 0, 0);
            
            this.ctx.restore();
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / particle.maxLife;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
        this.ctx.globalAlpha = 1;
    }
    
    createParticle(x, y, color) {
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
    
    checkCollisions() {
        if (!this.player) return;
        
        // Player vs enemy projectiles
        this.projectiles.forEach((projectile, pIndex) => {
            if (!projectile.isPlayer && !this.player.invulnerable) {
                if (this.checkCollision(
                    projectile.x - projectile.width / 2,
                    projectile.y - projectile.height / 2,
                    projectile.width,
                    projectile.height,
                    this.player.x - this.player.width / 2,
                    this.player.y - this.player.height / 2,
                    this.player.width,
                    this.player.height
                )) {
                    this.damagePlayer(projectile.damage);
                    this.projectiles.splice(pIndex, 1);
                }
            }
        });
        
        // Player projectiles vs enemies
        this.projectiles.forEach((projectile, pIndex) => {
            if (projectile.isPlayer) {
                // Check enemies
                this.enemies.forEach((enemy, eIndex) => {
                    if (this.checkCollision(
                        projectile.x - projectile.width / 2,
                        projectile.y - projectile.height / 2,
                        projectile.width,
                        projectile.height,
                        enemy.x - enemy.width / 2,
                        enemy.y - enemy.height / 2,
                        enemy.width,
                        enemy.height
                    )) {
                        enemy.health -= projectile.damage;
                        this.projectiles.splice(pIndex, 1);
                        
                        if (enemy.health <= 0) {
                            this.destroyEnemy(eIndex);
                        }
                    }
                });
                
                // Check boss
                if (this.boss) {
                    if (this.checkCollision(
                        projectile.x - projectile.width / 2,
                        projectile.y - projectile.height / 2,
                        projectile.width,
                        projectile.height,
                        this.boss.x - this.boss.width / 2,
                        this.boss.y - this.boss.height / 2,
                        this.boss.width,
                        this.boss.height
                    )) {
                        this.boss.health -= projectile.damage;
                        this.projectiles.splice(pIndex, 1);
                        this.createParticle(projectile.x, projectile.y, '#ffff00');
                    }
                }
                
                // Check asteroids
                this.asteroids.forEach((asteroid, aIndex) => {
                    const dx = projectile.x - asteroid.x;
                    const dy = projectile.y - asteroid.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < asteroid.radius) {
                        asteroid.health -= projectile.damage;
                        this.projectiles.splice(pIndex, 1);
                        
                        if (asteroid.health <= 0) {
                            this.destroyAsteroid(aIndex);
                        }
                    }
                });
            }
        });
        
        // Player vs enemies (collision)
        this.enemies.forEach((enemy, index) => {
            if (!this.player.invulnerable && this.checkCollision(
                enemy.x - enemy.width / 2,
                enemy.y - enemy.height / 2,
                enemy.width,
                enemy.height,
                this.player.x - this.player.width / 2,
                this.player.y - this.player.height / 2,
                this.player.width,
                this.player.height
            )) {
                this.damagePlayer(enemy.damage * 2);
                this.destroyEnemy(index);
            }
        });
        
        // Player vs power-ups
        this.powerUps.forEach((powerUp, index) => {
            if (this.checkCollision(
                powerUp.x - 10,
                powerUp.y - 10,
                20,
                20,
                this.player.x - this.player.width / 2,
                this.player.y - this.player.height / 2,
                this.player.width,
                this.player.height
            )) {
                this.collectPowerUp(powerUp);
                this.powerUps.splice(index, 1);
            }
        });
    }
    
    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }
    
    damagePlayer(damage) {
        if (this.player.shield > 0) {
            const shieldDamage = Math.min(this.player.shield, damage);
            this.player.shield -= shieldDamage;
            damage -= shieldDamage;
            this.player.shieldRegenTimer = 0;
        }
        
        this.player.health -= damage;
        
        if (this.player.health <= 0) {
            this.gameOver();
        } else {
            // Make player invulnerable for a short time
            this.player.invulnerable = true;
            this.player.invulnerableTimer = 60; // 1 second at 60fps
        }
    }
    
    destroyEnemy(index) {
        const enemy = this.enemies[index];
        
        // Create explosion
        for (let i = 0; i < 10; i++) {
            this.createParticle(enemy.x, enemy.y, enemy.color);
        }
        
        // Drop credits
        this.credits += enemy.value;
        this.score += enemy.value * 10;
        this.enemiesKilled++;
        
        // Chance to drop power-up
        if (Math.random() < 0.1) {
            this.powerUps.push({
                x: enemy.x,
                y: enemy.y,
                type: Math.random() < 0.7 ? 'health' : 'shield',
                width: 20,
                height: 20
            });
        }
        
        this.enemies.splice(index, 1);
    }
    
    destroyAsteroid(index) {
        const asteroid = this.asteroids[index];
        
        // Create debris
        for (let i = 0; i < 15; i++) {
            this.createParticle(asteroid.x, asteroid.y, '#8B7355');
        }
        
        // Drop credits
        this.credits += asteroid.value;
        this.score += asteroid.value * 5;
        
        // Large asteroids split into smaller ones
        if (asteroid.size === 'large') {
            for (let i = 0; i < 2; i++) {
                this.asteroids.push({
                    x: asteroid.x + (Math.random() - 0.5) * 40,
                    y: asteroid.y,
                    size: 'small',
                    radius: 15,
                    health: 10,
                    speed: Math.random() * 3 + 2,
                    rotation: 0,
                    rotationSpeed: Math.random() * 0.2 - 0.1,
                    value: 10
                });
            }
        }
        
        this.asteroids.splice(index, 1);
    }
    
    collectPowerUp(powerUp) {
        if (powerUp.type === 'health') {
            this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
        } else if (powerUp.type === 'shield') {
            this.player.shield = Math.min(this.player.maxShield, this.player.shield + 50);
        }
        
        this.score += 50;
    }
    
    levelComplete() {
        this.isPlaying = false;
        document.getElementById('hud').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'none';
        
        // Show upgrade screen
        this.showUpgradeScreen();
    }
    
    showUpgradeScreen() {
        this.showScreen('upgradeScreen');
        document.getElementById('creditsDisplay').textContent = this.credits;
        document.getElementById('nextLevelNum').textContent = this.level + 1;
        
        // Populate upgrades
        const upgradeGrid = document.getElementById('upgradeGrid');
        upgradeGrid.innerHTML = '';
        
        const upgradeInfo = {
            maxHealth: { name: 'Max Health', description: '+40 HP', icon: '❤️' },
            damage: { name: 'Damage', description: '+5 damage per shot', icon: '⚔️' },
            fireRate: { name: 'Fire Rate', description: '+0.5 shots/sec', icon: '🔫' },
            speed: { name: 'Speed', description: '+0.5 movement speed', icon: '🚀' },
            shield: { name: 'Shield', description: '+15 shield capacity', icon: '🛡️' }
        };
        
        Object.keys(this.upgrades).forEach(key => {
            const upgrade = this.upgrades[key];
            const info = upgradeInfo[key];
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.level));
            
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            
            card.innerHTML = `
                <div class="upgrade-title">${info.icon} ${info.name}</div>
                <div class="upgrade-info">
                    <span>Level ${upgrade.level}/${upgrade.maxLevel}</span>
                </div>
                <div style="color: #aaa; font-size: 14px; margin: 10px 0;">${info.description}</div>
                <div class="upgrade-info">
                    <span>Cost: ${cost} credits</span>
                </div>
                <button class="upgrade-button" ${upgrade.level >= upgrade.maxLevel || this.credits < cost ? 'disabled' : ''} 
                        onclick="game.purchaseUpgrade('${key}')">
                    ${upgrade.level >= upgrade.maxLevel ? 'MAX' : 'UPGRADE'}
                </button>
            `;
            
            upgradeGrid.appendChild(card);
        });
    }
    
    purchaseUpgrade(type) {
        const upgrade = this.upgrades[type];
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.level));
        
        if (this.credits >= cost && upgrade.level < upgrade.maxLevel) {
            this.credits -= cost;
            upgrade.level++;
            this.showUpgradeScreen(); // Refresh display
        }
    }
    
    continueToNextLevel() {
        this.level++;
        
        if (this.level > 10) {
            this.victory();
        } else {
            this.hideScreen('upgradeScreen');
            this.startGame();
        }
    }
    
    gameOver() {
        this.isPlaying = false;
        document.getElementById('hud').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'none';
        
        // Update game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('levelReached').textContent = this.level;
        document.getElementById('enemiesDestroyed').textContent = this.enemiesKilled;
        document.getElementById('creditsEarned').textContent = this.credits;
        
        // Save high score
        this.saveHighScore(this.score);
        
        this.showScreen('gameOver');
    }
    
    victory() {
        this.isPlaying = false;
        document.getElementById('hud').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'none';
        
        const totalTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        
        document.getElementById('victoryScore').textContent = this.score;
        document.getElementById('victoryCredits').textContent = this.credits;
        document.getElementById('completionTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.saveHighScore(this.score);
        
        this.showScreen('victoryScreen');
    }
    
    retryLevel() {
        // Reset upgrades to previous state would go here
        this.hideScreen('gameOver');
        this.startGame();
    }
    
    updateHUD() {
        if (!this.player) return;
        
        document.getElementById('healthBar').style.width = `${(this.player.health / this.player.maxHealth) * 100}%`;
        document.getElementById('shieldBar').style.width = `${(this.player.shield / this.player.maxShield) * 100}%`;
        document.getElementById('score').textContent = this.score;
        document.getElementById('credits').textContent = this.credits;
        document.getElementById('level').textContent = this.level;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '▶' : '⏸';
    }
    
    // Control handlers
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
        if (!this.player || !this.isPlaying) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
                this.player.x -= this.player.speed * 5;
                break;
            case 'ArrowRight':
            case 'd':
                this.player.x += this.player.speed * 5;
                break;
            case 'ArrowUp':
            case 'w':
                this.player.y -= this.player.speed * 5;
                break;
            case 'ArrowDown':
            case 's':
                this.player.y += this.player.speed * 5;
                break;
            case ' ':
                if (!this.autoFire) {
                    this.playerShoot();
                }
                break;
            case 'Escape':
            case 'p':
                this.togglePause();
                break;
        }
    }
    
    handleKeyUp(e) {
        // Handle key release if needed
    }
    
    // Menu functions
    showOptions() {
        this.hideScreen('mainMenu');
        this.showScreen('optionsScreen');
        
        // Load current settings
        document.getElementById('controlMode').value = this.controlMode;
        document.getElementById('autoFire').checked = this.autoFire;
    }
    
    saveOptions() {
        this.controlMode = document.getElementById('controlMode').value;
        this.autoFire = document.getElementById('autoFire').checked;
        
        // Save to localStorage
        localStorage.setItem('spaceShooterOptions', JSON.stringify({
            controlMode: this.controlMode,
            autoFire: this.autoFire,
            sfxVolume: document.getElementById('sfxVolume').value,
            musicVolume: document.getElementById('musicVolume').value
        }));
        
        this.backToMenu();
    }
    
    showRecords() {
        this.hideScreen('mainMenu');
        this.showScreen('recordsScreen');
        
        const scoresList = document.getElementById('highScoresList');
        scoresList.innerHTML = '<h3>Top 10 Scores</h3>';
        
        this.highScores.forEach((score, index) => {
            const scoreDiv = document.createElement('div');
            scoreDiv.style.cssText = 'display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;';
            scoreDiv.innerHTML = `
                <span>#${index + 1}</span>
                <span>${score.score.toLocaleString()} pts</span>
                <span>Level ${score.level}</span>
            `;
            scoresList.appendChild(scoreDiv);
        });
        
        if (this.highScores.length === 0) {
            scoresList.innerHTML += '<p style="text-align: center; margin-top: 20px; opacity: 0.7;">No scores yet. Play to set a high score!</p>';
        }
    }
    
    showCredits() {
        this.hideScreen('mainMenu');
        this.showScreen('creditsScreen');
    }
    
    backToMenu() {
        // Hide all screens
        ['optionsScreen', 'recordsScreen', 'creditsScreen', 'gameOver', 'victoryScreen', 'upgradeScreen'].forEach(screen => {
            this.hideScreen(screen);
        });
        
        // Reset game state
        this.isPlaying = false;
        this.level = 1;
        this.score = 0;
        this.credits = 500;
        this.enemiesKilled = 0;
        
        // Reset upgrades
        Object.keys(this.upgrades).forEach(key => {
            this.upgrades[key].level = 0;
        });
        
        // Show main menu
        this.showScreen('mainMenu');
    }
    
    // Save system
    saveHighScore(score) {
        this.highScores.push({
            score: score,
            level: this.level,
            date: new Date().toISOString()
        });
        
        // Sort and keep top 10
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('spaceShooterHighScores', JSON.stringify(this.highScores));
    }
    
    loadHighScores() {
        const saved = localStorage.getItem('spaceShooterHighScores');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadOptions() {
        const saved = localStorage.getItem('spaceShooterOptions');
        if (saved) {
            const options = JSON.parse(saved);
            this.controlMode = options.controlMode || 'touch';
            this.autoFire = options.autoFire !== undefined ? options.autoFire : true;
        }
    }
}

// Initialize game
const game = new SpaceShooterGame();

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
