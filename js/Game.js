import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Boss } from './entities/Boss.js';
import { Asteroid } from './entities/Asteroid.js';
import { PowerUp } from './entities/PowerUp.js';
import { Projectile } from './entities/Projectile.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { Starfield } from './systems/Starfield.js';
import { InputController } from './systems/InputController.js';
import { UpgradeSystem } from './systems/UpgradeSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { ScreenManager } from './ui/ScreenManager.js';

export class SpaceShooterGame {
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

        // Entities
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        this.asteroids = [];

        // Boss
        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = false;

        // Wave system
        this.waveTimer = 0;
        this.currentWave = 1;
        this.enemiesKilled = 0;
        this.enemiesPerWave = 10;

        // Game options
        this.controlMode = 'touch';
        this.autoFire = true;

        // Systems
        this.particleSystem = new ParticleSystem();
        this.starfield = new Starfield(this.canvas);
        this.inputController = new InputController(this.canvas);
        this.upgradeSystem = new UpgradeSystem();
        this.collisionSystem = new CollisionSystem();
        this.screenManager = new ScreenManager();

        // High scores
        this.highScores = this.loadHighScores();

        // Load saved options
        this.loadOptions();

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
        if (this.starfield) {
            this.starfield.resize(this.canvas);
        }
    }

    init() {
        // Start with logo sequence
        this.showLogoSequence();
    }

    async showLogoSequence() {
        await this.screenManager.showLogoSequence();
    }

    showScreen(screenId) {
        this.screenManager.showScreen(screenId);
    }

    hideScreen(screenId) {
        this.screenManager.hideScreen(screenId);
    }

    startGame(fromMenu = true) {
        this.screenManager.hideScreen('mainMenu');
        this.screenManager.hideScreen('upgradeScreen');
        this.screenManager.showHUD();

        // Reset game state (preserve level, score, credits when continuing)
        if (fromMenu) {
            this.level = 1;
            this.score = 0;
            this.credits = 500;
        }

        this.enemiesKilled = 0;
        this.currentWave = 1;
        this.waveTimer = 0;

        if (fromMenu) {
            this.gameStartTime = Date.now();
        }

        // Clear entities
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        this.asteroids = [];
        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = false;
        this.particleSystem.clear();

        // Create player
        this.createPlayer();

        // Start game loop
        this.isPlaying = true;
        this.isPaused = false;
        this.gameLoop();
    }

    createPlayer() {
        this.player = new Player(this.canvas, this.upgradeSystem.upgrades);
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
        this.starfield.update();
        this.starfield.draw(this.ctx);

        this.updatePlayer();
        if (this.player) this.player.draw(this.ctx);

        this.updateEnemies();
        this.drawEnemies();

        this.updateProjectiles();
        this.drawProjectiles();

        this.updatePowerUps();
        this.drawPowerUps();

        this.particleSystem.update();
        this.particleSystem.draw(this.ctx);

        this.updateAsteroids();
        this.drawAsteroids();

        if (this.bossActive && this.boss) {
            this.updateBoss();
            if (this.boss) { // Check again after update in case boss was defeated
                this.boss.draw(this.ctx);
            }
        }

        // Spawn waves
        this.spawnWaves();

        // Check collisions
        this.checkCollisions();

        // Update HUD
        this.updateHUD();

        // Check for pause
        if (this.inputController.isPausePressed()) {
            this.togglePause();
        }

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    updatePlayer() {
        if (!this.player) return;

        // Process keyboard input
        this.inputController.processPlayerInput(
            this.player,
            this.controlMode,
            this.autoFire,
            this.projectiles
        );

        // Update with touch/mouse input
        this.player.update(
            this.inputController.getTouchData(),
            this.controlMode,
            this.autoFire,
            this.projectiles
        );
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            const shouldRemove = enemy.update(this.player, this.projectiles);
            return !shouldRemove;
        });
    }

    drawEnemies() {
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
    }

    updateBoss() {
        if (!this.boss) return;

        const isDefeated = this.boss.update(this.player, this.projectiles);
        if (isDefeated) {
            this.defeatBoss();
        }
    }

    updateAsteroids() {
        this.asteroids = this.asteroids.filter(asteroid => {
            const shouldRemove = asteroid.update();
            return !shouldRemove;
        });
    }

    drawAsteroids() {
        this.asteroids.forEach(asteroid => asteroid.draw(this.ctx));
    }

    updateProjectiles() {
        this.projectiles = this.projectiles.filter(projectile => {
            const shouldRemove = projectile.update(this.canvas);
            return !shouldRemove;
        });
    }

    drawProjectiles() {
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
    }

    updatePowerUps() {
        this.powerUps = this.powerUps.filter(powerUp => {
            const shouldRemove = powerUp.update(this.canvas);
            return !shouldRemove;
        });
    }

    drawPowerUps() {
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
    }

    spawnWaves() {
        this.waveTimer++;

        // Check if we should spawn boss (but not if we just defeated one)
        if (this.enemiesKilled >= 10 && !this.bossActive && !this.bossDefeated) {
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
        const enemy = new Enemy(this.canvas, this.level);
        this.enemies.push(enemy);
    }

    spawnAsteroid() {
        const asteroid = new Asteroid(this.canvas);
        this.asteroids.push(asteroid);
    }

    spawnBoss() {
        this.bossActive = true;
        this.boss = new Boss(this.canvas, this.level);
    }

    checkCollisions() {
        this.collisionSystem.checkCollisions(this);
    }

    destroyEnemy(index) {
        const enemy = this.enemies[index];
        if (!enemy) return;

        // Create explosion
        for (let i = 0; i < 10; i++) {
            this.particleSystem.createParticle(enemy.x, enemy.y, enemy.color);
        }

        // Rewards
        this.score += enemy.value;
        this.credits += Math.floor(enemy.value / 2);
        this.enemiesKilled++;

        // Chance to drop power-up
        if (Math.random() < 0.1) {
            this.powerUps.push(new PowerUp(
                enemy.x,
                enemy.y,
                Math.random() < 0.7 ? 'health' : 'shield'
            ));
        }

        this.enemies.splice(index, 1);
    }

    destroyAsteroid(index) {
        const asteroid = this.asteroids[index];
        if (!asteroid) return;

        // Create explosion
        for (let i = 0; i < 15; i++) {
            this.particleSystem.createParticle(asteroid.x, asteroid.y, '#8B7355');
        }

        // Rewards
        this.score += asteroid.value;
        this.credits += Math.floor(asteroid.value / 3);

        // Small chance to drop power-up
        if (Math.random() < 0.05) {
            this.powerUps.push(new PowerUp(
                asteroid.x,
                asteroid.y,
                'shield'
            ));
        }

        this.asteroids.splice(index, 1);
    }

    defeatBoss() {
        if (!this.boss) return;

        // Create explosion effect
        this.particleSystem.createExplosion(this.boss.x, this.boss.y, this.boss.color);

        // Get rewards
        const rewards = this.boss.getDefeatRewards();
        this.credits += rewards.credits;
        this.score += rewards.score;

        // Spawn power-up
        this.powerUps.push(new PowerUp(
            rewards.powerUp.x,
            rewards.powerUp.y,
            rewards.powerUp.type
        ));

        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = true; // Prevent new boss spawning during victory delay

        // Level complete
        setTimeout(() => this.levelComplete(), 2000);
    }

    levelComplete() {
        this.isPlaying = false;
        this.screenManager.hideHUD();

        if (this.level >= 10) {
            this.victory();
        } else {
            this.showUpgradeScreen();
        }
    }

    showUpgradeScreen() {
        const upgrades = this.upgradeSystem.getAllUpgrades();
        this.screenManager.showUpgradeScreen(
            this.credits,
            this.level,
            upgrades,
            (type) => this.purchaseUpgrade(type)
        );
    }

    purchaseUpgrade(type) {
        const cost = this.upgradeSystem.purchase(type, this.credits);
        if (cost > 0) {
            this.credits -= cost;
            this.showUpgradeScreen(); // Refresh display
        }
    }

    continueToNextLevel() {
        this.level++;

        if (this.level > 10) {
            this.victory();
        } else {
            this.startGame(false); // false = not from menu, preserve state
        }
    }

    gameOver() {
        this.isPlaying = false;
        this.screenManager.hideHUD();

        this.saveHighScore(this.score);

        this.screenManager.showGameOver({
            score: this.score,
            level: this.level,
            enemiesKilled: this.enemiesKilled,
            credits: this.credits
        });
    }

    victory() {
        this.isPlaying = false;
        this.screenManager.hideHUD();

        this.saveHighScore(this.score);

        const time = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.screenManager.showVictory(this.score, this.credits, timeString);
    }

    retryLevel() {
        this.screenManager.hideScreen('gameOver');
        // Reset score and credits to beginning of game values
        this.level = 1;
        this.score = 0;
        this.credits = 500;
        this.upgradeSystem.reset();
        this.startGame(true);
    }

    updateHUD() {
        this.screenManager.updateHUD(this.player, this.score, this.credits, this.level);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = this.isPaused ? '▶' : '⏸';
        }
    }

    // Menu functions
    showOptions() {
        this.screenManager.showScreen('optionsScreen');
        document.getElementById('controlMode').value = this.controlMode;
        document.getElementById('autoFire').checked = this.autoFire;
    }

    saveOptions() {
        this.controlMode = document.getElementById('controlMode').value;
        this.autoFire = document.getElementById('autoFire').checked;

        localStorage.setItem('spaceShooterOptions', JSON.stringify({
            controlMode: this.controlMode,
            autoFire: this.autoFire,
            sfxVolume: document.getElementById('sfxVolume').value,
            musicVolume: document.getElementById('musicVolume').value
        }));

        this.backToMenu();
    }

    showRecords() {
        this.screenManager.showHighScores(this.highScores);
    }

    showCredits() {
        this.screenManager.showScreen('creditsScreen');
    }

    backToMenu() {
        this.screenManager.hideAllScreens();
        this.screenManager.showScreen('mainMenu');
    }

    saveHighScore(score) {
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 10);
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

// Make game globally accessible for HTML onclick handlers
window.game = new SpaceShooterGame();