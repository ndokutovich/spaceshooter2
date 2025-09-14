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
import { LevelConfig } from './systems/LevelConfig.js';
import { WeaponSystem } from './systems/WeaponSystem.js';
import { ScreenManager } from './ui/ScreenManager.js';
import { formulaService } from './systems/FormulaService.js';

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
        this.levelConfig = new LevelConfig();
        this.weaponSystem = new WeaponSystem();
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
        // Update weapon system with ammo multiplier
        const stats = this.upgradeSystem.getPlayerStats();
        this.weaponSystem.updateAmmoMultiplier(stats.ammoMultiplier);

        this.player = new Player(this.canvas, this.upgradeSystem.upgrades, this.weaponSystem);
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

        // Check for cheat codes
        this.checkCheats();

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

        const levelConfig = this.levelConfig.getLevel(this.level);

        // Check if we should spawn boss (but not if we just defeated one)
        if (this.enemiesKilled >= levelConfig.enemiesToBoss && !this.bossActive && !this.bossDefeated) {
            this.spawnBoss();
            return;
        }

        // Spawn regular enemies
        if (this.waveTimer > levelConfig.spawnInterval &&
            this.enemies.length < levelConfig.maxEnemiesOnScreen &&
            !this.bossActive) {
            this.waveTimer = 0;

            const enemyCount = levelConfig.enemiesPerWave;
            for (let i = 0; i < enemyCount; i++) {
                this.spawnEnemy();
            }

            // Spawn asteroids occasionally based on level config
            if (this.levelConfig.shouldSpawnAsteroid(this.level) &&
                this.asteroids.length < levelConfig.maxAsteroids) {
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
        this.boss = new Boss(this.canvas, this.level, this.levelConfig);
    }

    checkCollisions() {
        this.collisionSystem.checkCollisions(this);
    }

    destroyEnemy(index) {
        const enemy = this.enemies[index];
        if (!enemy) return;

        const levelConfig = this.levelConfig.getLevel(this.level);

        // Create explosion
        for (let i = 0; i < 10; i++) {
            this.particleSystem.createParticle(enemy.x, enemy.y, enemy.color);
        }

        // Rewards with level multipliers
        this.score += Math.floor(enemy.value * levelConfig.scoreMultiplier);
        this.credits += Math.floor(enemy.value / 2 * levelConfig.creditMultiplier);
        this.enemiesKilled++;

        // Chance to drop power-up based on level config
        if (this.levelConfig.shouldDropPowerUp(this.level)) {
            this.powerUps.push(new PowerUp(
                enemy.x,
                enemy.y,
                this.levelConfig.getPowerUpType(this.level)
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
        this.credits += formulaService.calculateAsteroidCredits(asteroid.value);

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

        // Unlock new weapon based on level
        const newWeapon = this.weaponSystem.unlockWeapon(this.level);
        if (newWeapon) {
            // Show weapon unlock notification
            this.showWeaponUnlock(newWeapon);
        }

        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = true; // Prevent new boss spawning during victory delay

        // Level complete
        setTimeout(() => this.levelComplete(), 2000);
    }

    showWeaponUnlock(weapon) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #004400, #00ff00);
            color: white;
            padding: 30px;
            border-radius: 15px;
            font-size: 24px;
            z-index: 1000;
            text-align: center;
            border: 3px solid #00ff00;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        `;
        notification.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">NEW WEAPON UNLOCKED!</div>
            <div style="font-size: 28px; color: #00ff00; margin: 10px 0;">${weapon.name}</div>
            <div style="font-size: 16px; opacity: 0.8;">${weapon.description}</div>
            <div style="font-size: 14px; margin-top: 10px;">Press ${weapon.key} to equip</div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
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
        // Refill all weapon ammo when entering Space Hub
        this.weaponSystem.refillAllAmmo();

        // Show ammo refill notification
        this.showAmmoRefillNotification();

        const upgrades = this.upgradeSystem.getAllUpgrades();
        this.screenManager.showUpgradeScreen(
            this.credits,
            this.level,
            upgrades,
            (type) => this.purchaseUpgrade(type)
        );
    }

    showAmmoRefillNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 100, 200, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 20px;
            z-index: 1000;
            text-align: center;
            border: 2px solid #00aaff;
            box-shadow: 0 0 20px rgba(0, 170, 255, 0.5);
        `;
        notification.innerHTML = '🔫 All weapons refilled! 🔫';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    purchaseUpgrade(type) {
        const cost = this.upgradeSystem.purchase(type, this.credits);
        if (cost > 0) {
            this.credits -= cost;

            // Update weapon system if ammo crate was upgraded
            if (type === 'ammoCrate') {
                const stats = this.upgradeSystem.getPlayerStats();
                this.weaponSystem.updateAmmoMultiplier(stats.ammoMultiplier);
            }

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

    checkCheats() {
        const cheats = this.inputController.checkAndResetCheats();

        // Unlock all weapons cheat
        if (cheats.allWeapons) {
            for (let i = 0; i < this.weaponSystem.weapons.length; i++) {
                this.weaponSystem.unlockedWeapons[i] = true;
                // Give max ammo to all weapons
                const weapon = this.weaponSystem.weapons[i];
                if (weapon.ammo !== Infinity) {
                    weapon.ammo = weapon.maxAmmo;
                }
            }
            this.showCheatNotification('ALL WEAPONS UNLOCKED!');
        }

        // Replenish cheat
        if (cheats.replenish && this.player) {
            // Restore health and shield
            this.player.health = this.player.maxHealth;
            this.player.shield = this.player.maxShield;

            // Refill all ammo
            this.weaponSystem.refillAllAmmo();

            this.showCheatNotification('FULLY REPLENISHED!');
        }
    }

    showCheatNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            color: white;
            padding: 20px 40px;
            font-size: 24px;
            font-weight: bold;
            border-radius: 10px;
            z-index: 10000;
            animation: cheatPulse 0.5s ease-in-out;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    togglePause() {
        if (!this.isPaused) {
            // Pause the game and show pause menu
            this.isPaused = true;

            // Gather game stats
            const gameStats = {
                level: this.level,
                score: this.score,
                credits: this.credits,
                enemiesKilled: this.enemiesKilled
            };

            // Get player stats
            const playerStats = this.upgradeSystem.getPlayerStats();

            // Get upgrade levels
            const upgrades = this.upgradeSystem.upgrades;

            this.screenManager.showPauseMenu(gameStats, playerStats, upgrades);
        } else {
            // Resume the game
            this.resumeGame();
        }
    }

    resumeGame() {
        this.isPaused = false;
        this.screenManager.hideScreen('pauseMenu');
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = '⏸';
        }
    }

    saveAndQuit() {
        // Save the game state
        this.saveProgress();
        // Return to main menu
        this.quitToMenu();
    }

    quitToMenu() {
        // Stop the game
        this.isPlaying = false;
        this.isPaused = false;

        // Hide all game UI
        this.screenManager.hideHUD();
        this.screenManager.hideScreen('pauseMenu');

        // Show main menu
        this.screenManager.showScreen('mainMenu');

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
            try {
                const options = JSON.parse(saved);
                this.controlMode = options.controlMode || 'touch';
                this.autoFire = options.autoFire !== undefined ? options.autoFire : true;
            } catch (e) {
                console.error('Error loading options:', e);
                // Keep defaults if loading fails
            }
        }
    }

    // Save game progress (only available in Space Hub)
    saveProgress() {
        const saveData = {
            level: this.level + 1,  // Save the NEXT level (the one shown in Space Hub)
            score: this.score,
            credits: this.credits,
            upgrades: this.upgradeSystem.upgrades,
            weapons: this.weaponSystem.saveState(),
            timestamp: Date.now(),
            version: '1.0'
        };

        localStorage.setItem('spaceShooterSave', JSON.stringify(saveData));

        // Show confirmation (brief message)
        const upgradeScreen = document.getElementById('upgradeScreen');
        if (upgradeScreen && upgradeScreen.classList.contains('active')) {
            const saveMsg = document.createElement('div');
            saveMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 255, 0, 0.9); color: white; padding: 20px; border-radius: 10px; font-size: 24px; z-index: 1000;';
            saveMsg.textContent = 'Progress Saved!';
            document.body.appendChild(saveMsg);
            setTimeout(() => saveMsg.remove(), 2000);
        }
    }

    // Load saved progress
    loadProgress() {
        const saved = localStorage.getItem('spaceShooterSave');
        if (!saved) {
            return false;
        }

        try {
            const saveData = JSON.parse(saved);

            // Restore game state
            this.level = saveData.level || 1;
            this.score = saveData.score || 0;
            this.credits = saveData.credits || 500;

            // Restore upgrades
            if (saveData.upgrades) {
                Object.keys(saveData.upgrades).forEach(key => {
                    if (this.upgradeSystem.upgrades[key]) {
                        this.upgradeSystem.upgrades[key].level = saveData.upgrades[key].level || 0;
                    }
                });
            }

            // Restore weapon state
            if (saveData.weapons) {
                this.weaponSystem.loadState(saveData.weapons);
            }

            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }

    // Check if save exists
    hasSaveGame() {
        return localStorage.getItem('spaceShooterSave') !== null;
    }

    // Start from saved game
    continueGame() {
        if (this.loadProgress()) {
            this.screenManager.hideScreen('mainMenu');
            this.startGame(false); // Start game preserving loaded state
        }
    }
}

// Make game globally accessible for HTML onclick handlers
window.game = new SpaceShooterGame();