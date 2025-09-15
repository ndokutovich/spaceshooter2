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

        // Entities
        this.player = null;
        this.enemies = [];
        this.hunters = [];  // Elite enemies before boss
        this.projectiles = [];
        this.powerUps = [];
        this.asteroids = [];

        // Boss
        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = false;
        this.huntersDefeated = false;  // Track if hunters are defeated

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
        this.damageNumberSystem = new DamageNumberSystem();
        this.starfield = new Starfield(this.canvas);
        this.inputController = new InputController(this.canvas);
        this.upgradeSystem = new UpgradeSystem();
        this.collisionSystem = new CollisionSystem();
        this.levelConfig = new LevelConfig();
        this.weaponSystem = new WeaponSystem();
        this.screenManager = new ScreenManager();
        this.dialogSystem = new DialogSystem();
        this.familyWelfare = new FamilyWelfare();
        this.achievementSystem = new AchievementSystem();
        this.achievementUI = new AchievementUI(this.achievementSystem);

        // FPS counter
        this.fps = 60;
        this.frameCount = 0;
        this.lastFpsUpdate = performance.now();

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

        // Initialize language
        setTimeout(() => {
            languageSystem.updateAllTexts();
        }, 100);

        // Listen for language changes to update dynamic content
        window.addEventListener('languageChanged', () => {
            this.updateDynamicTexts();
        });
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
        this.enemySpawnDelay = 180; // 3 seconds delay before enemies appear (60fps)

        if (fromMenu) {
            this.gameStartTime = Date.now();
        }

        // Clear entities
        this.enemies = [];
        this.hunters = [];
        this.projectiles = [];
        this.powerUps = [];
        this.asteroids = [];
        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = false;
        this.huntersDefeated = false;
        this.huntersSpawned = false;  // Track if hunters were actually spawned
        this.particleSystem.clear();
        this.damageNumberSystem.clear();

        // Spawn initial asteroids for resource collection
        const initialAsteroids = 3 + Math.floor(this.level / 2); // 3-8 asteroids
        for (let i = 0; i < initialAsteroids; i++) {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.spawnAsteroid();
                }
            }, i * 200); // Stagger spawning
        }

        // Create player
        this.createPlayer();

        // Reset achievement session stats for this level
        this.sessionStats = {
            levelStartTime: Date.now(),
            gameStartTime: this.sessionStats?.gameStartTime || Date.now(),
            lastSurvivalUpdate: Date.now()
        };

        // Set up game state but pause immediately
        this.isPlaying = true;
        this.isPaused = true;  // Start paused for dialog

        // Start the game loop (will be paused)
        this.gameLoop();

        // Show intro dialog for level 1
        if (this.level === 1 && fromMenu) {
            setTimeout(() => {
                this.dialogSystem.showSequence(StoryEvents.intro, () => {
                    this.showLevelStartDialog();
                });
            }, 100);
        } else {
            // Show level start dialog
            setTimeout(() => {
                this.showLevelStartDialog();
            }, 100);
        }
    }

    showLevelStartDialog() {
        const levelEvent = getLevelEvent(this.level, 'start');
        if (levelEvent && levelEvent.length > 0) {
            // Keep paused while showing dialog
            this.dialogSystem.showSequence(levelEvent, () => {
                this.isPaused = false;  // Unpause after dialog
            });
        } else {
            // No dialog, unpause immediately
            this.isPaused = false;
        }
    }

    createPlayer() {
        // Update weapon system with ammo multiplier
        const stats = this.upgradeSystem.getPlayerStats();
        this.weaponSystem.updateAmmoMultiplier(stats.ammoMultiplier);

        // Reset to default weapon (Pulse Laser) for each new level
        this.weaponSystem.currentWeaponIndex = 0;

        this.player = new Player(this.canvas, this.upgradeSystem.upgrades, this.weaponSystem);

        // Apply family morale modifiers
        const modifiers = this.familyWelfare.getStatModifiers();
        this.player.moraleModifiers = modifiers;
    }

    gameLoop() {
        if (!this.isPlaying) return;
        if (this.isPaused) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }

        // Calculate FPS
        this.frameCount++;
        const now = performance.now();
        const deltaTime = now - this.lastFpsUpdate;
        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastFpsUpdate = now;

            // Update FPS display
            const fpsElement = document.getElementById('fps');
            if (fpsElement) {
                fpsElement.textContent = this.fps;
                // Color code based on performance
                if (this.fps >= 55) {
                    fpsElement.style.color = '#00ff00'; // Green for good
                } else if (this.fps >= 30) {
                    fpsElement.style.color = '#ffff00'; // Yellow for ok
                } else {
                    fpsElement.style.color = '#ff0000'; // Red for poor
                }
            }
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

        this.updateHunters();
        this.drawHunters();

        this.updateProjectiles();
        this.drawProjectiles();

        this.updatePowerUps();
        this.drawPowerUps();

        this.particleSystem.update();
        this.particleSystem.draw(this.ctx);

        // Update and draw damage numbers
        this.damageNumberSystem.update();
        this.damageNumberSystem.draw(this.ctx);

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

        // Process achievement notifications
        this.achievementUI.processUnlockQueue();

        // Update survival time every second
        const currentTime = Date.now();
        if (currentTime - this.sessionStats.lastSurvivalUpdate > 1000) {
            const survivalSeconds = Math.floor((currentTime - this.sessionStats.gameStartTime) / 1000);
            this.achievementSystem.updateStat('totalSurvivalTime', survivalSeconds, false);
            this.sessionStats.lastSurvivalUpdate = currentTime;
        }

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

        // Update morale modifiers in real-time
        const modifiers = this.familyWelfare.getStatModifiers();
        this.player.moraleModifiers = modifiers;

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

    updateHunters() {
        if (this.hunters.length > 0 && !this.hunterLogShown) {
            console.log(`Updating ${this.hunters.length} hunters`, this.hunters);
            this.hunterLogShown = true;
        }

        this.hunters = this.hunters.filter(hunter => {
            const shouldRemove = hunter.update(this.player, this.projectiles);
            return !shouldRemove;
        });

        // DON'T check for defeated hunters here - this runs every frame!
        // The defeat check should only happen in destroyHunter when a hunter actually dies
    }

    drawHunters() {
        if (this.hunters.length > 0) {
            // Draw warning indicator
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            const hunterText = this.hunters.length > 1 ? languageSystem.t('HUNTERS') : languageSystem.t('HUNTER');
            this.ctx.fillText(`⚠️ ${this.hunters.length} ${hunterText} ${languageSystem.t('ACTIVE')} ⚠️`, this.canvas.width / 2, 50);
            this.ctx.restore();
        }
        this.hunters.forEach(hunter => hunter.draw(this.ctx));
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

        // Decrease enemy spawn delay
        if (this.enemySpawnDelay > 0) {
            this.enemySpawnDelay--;
        }

        const levelConfig = this.levelConfig.getLevel(this.level);

        // Only spawn enemies after the delay
        if (this.enemySpawnDelay <= 0) {
            // Check if we should spawn hunters before boss (at 80% of enemies killed)
            const shouldSpawnHunters = this.enemiesKilled >= levelConfig.enemiesToBoss * 0.8;

            if (shouldSpawnHunters &&
                this.hunters.length === 0 &&
                !this.huntersDefeated &&
                !this.bossActive &&
                !this.bossDefeated) {
                this.spawnHunters();
                return;
            }

            // Check if we should spawn boss (only after hunters are defeated if they were spawned)
            if (this.enemiesKilled >= levelConfig.enemiesToBoss) {
                // Check if we can spawn boss
                const canSpawnBoss = this.huntersSpawned ? this.huntersDefeated : false;

                if (!this.huntersSpawned) {
                    console.log(languageSystem.t("ERROR: Reached boss threshold but hunters never spawned!"));
                    // Force spawn hunters now if somehow we missed them
                    this.spawnHunters();
                    return;
                }

                if (canSpawnBoss &&
                    !this.bossActive &&
                    !this.bossDefeated) {
                    this.spawnBoss();
                    return;
                }
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
            }
        }

        // Spawn asteroids continuously throughout the level (not just with enemies)
        if (this.waveTimer % 30 === 0) { // Check every half second
            if (this.asteroids.length < levelConfig.maxAsteroids * 1.5) { // Allow more asteroids
                // Higher chance to spawn asteroids
                if (Math.random() < 0.6) {
                    this.spawnAsteroid();

                    // Sometimes spawn 2 asteroids at once for clusters
                    if (Math.random() < 0.3 && this.asteroids.length < levelConfig.maxAsteroids * 1.5 - 1) {
                        setTimeout(() => {
                            if (this.isPlaying) {
                                this.spawnAsteroid();
                            }
                        }, 300);
                    }
                }
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

    spawnHunters() {
        // Mark that hunters have been spawned
        this.huntersSpawned = true;

        // Spawn 2-3 hunters based on level
        const hunterCount = Math.min(1 + Math.floor(this.level / 4), 3);

        console.log(`=============== HUNTER SPAWN ===============`);
        console.log(`Spawning ${hunterCount} hunters at level ${this.level}`);
        console.log(`Enemies killed: ${this.enemiesKilled}`);

        // Create hunters immediately
        for (let i = 0; i < hunterCount; i++) {
            // Spawn different types or random
            let type = null;
            if (hunterCount === 1) {
                type = 'bounty';
            } else if (hunterCount === 2) {
                type = i === 0 ? 'bounty' : 'raider';
            } else {
                type = ['bounty', 'raider', 'assassin'][i];
            }

            const hunter = new Hunter(this.canvas, this.level, type);
            // Spread them out horizontally
            hunter.x = (this.canvas.width / (hunterCount + 1)) * (i + 1);
            hunter.y = -100; // Start above screen
            this.hunters.push(hunter);
            console.log(`Created hunter ${i+1}/${hunterCount}: ${type} at (${hunter.x}, ${hunter.y})`);
        }

        console.log(`Total hunters array:`, this.hunters);

        // Show warning message that doesn't wait for input
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            font-weight: bold;
            z-index: 1000;
            border: 2px solid #ffff00;
            animation: pulse 0.5s 3;
        `;
        notification.textContent = languageSystem.t("⚠️ ELITE HUNTERS INCOMING!");
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    spawnBoss() {
        this.bossActive = true;
        this.boss = new Boss(this.canvas, this.level, this.levelConfig);

        // Show boss intro dialog after a brief delay
        const bossDialog = this.boss.getDialog('intro');
        if (bossDialog) {
            setTimeout(() => {
                this.isPaused = true;
                this.dialogSystem.show(
                    bossDialog.speaker,
                    bossDialog.message,
                    bossDialog.portrait,
                    () => {
                        this.isPaused = false;
                    }
                );
            }, 1000); // Give player a moment to see the boss appear
        }
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

        // Rewards with level multipliers and gold rush
        const goldRushMultiplier = this.upgradeSystem.getPlayerStats().creditMultiplier || 1.0;
        this.score += Math.floor(enemy.value * levelConfig.scoreMultiplier);
        const creditsEarned = Math.floor(enemy.value / 2 * levelConfig.creditMultiplier * goldRushMultiplier);
        this.credits += creditsEarned;
        this.enemiesKilled++;

        // Track achievements
        this.achievementSystem.updateStat('enemiesKilled', 1);
        this.achievementSystem.updateStat('totalCreditsEarned', creditsEarned);

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

    destroyHunter(index) {
        const hunter = this.hunters[index];
        if (!hunter) return;

        // Create big explosion for hunters
        for (let i = 0; i < 20; i++) {
            this.particleSystem.createParticle(hunter.x, hunter.y, hunter.color);
        }

        // Better rewards for hunters
        const goldRushMultiplier = this.upgradeSystem.getPlayerStats().creditMultiplier || 1.0;
        this.score += hunter.value * 2; // Double score for hunters
        const creditsEarned = Math.floor(hunter.value * goldRushMultiplier);
        this.credits += creditsEarned;

        // Show reward notification
        this.showResourceNotification('hunter', creditsEarned);

        // Track achievements
        this.achievementSystem.updateStat('huntersKilled', 1);
        this.achievementSystem.updateStat('totalCreditsEarned', creditsEarned);

        // High chance to drop power-up
        if (Math.random() < 0.5) {
            const powerUpType = Math.random() < 0.5 ? 'health' : 'shield';
            this.powerUps.push(new PowerUp(
                hunter.x,
                hunter.y,
                powerUpType
            ));
        }

        this.hunters.splice(index, 1);

        // Check if all hunters are defeated after removing this one
        if (this.hunters.length === 0 && this.huntersSpawned) {
            this.huntersDefeated = true;
            console.log(languageSystem.t("All hunters defeated! Boss can now spawn."));
            this.dialogSystem.showQuickMessage(languageSystem.t('HUNTERS APPROACHING!'));
        }
    }

    destroyAsteroid(index) {
        const asteroid = this.asteroids[index];
        if (!asteroid) return;

        // Create explosion with type-specific color
        const props = asteroid.typeProperties[asteroid.type];
        for (let i = 0; i < 15; i++) {
            this.particleSystem.createParticle(asteroid.x, asteroid.y, props.color);
        }

        // Rewards with gold rush - asteroid value already includes type multiplier
        const goldRushMultiplier = this.upgradeSystem.getPlayerStats().creditMultiplier || 1.0;
        this.score += asteroid.value;
        const creditsEarned = Math.floor(asteroid.value * goldRushMultiplier);
        this.credits += creditsEarned;

        // Show special notification for valuable asteroids
        if (asteroid.type === 'gold' || asteroid.type === 'crystal' || asteroid.type === 'platinum') {
            this.showResourceNotification(asteroid.type, creditsEarned);
            // Track rare asteroids
            this.achievementSystem.updateStat('rareAsteroidsFound', 1);
        }

        // Track achievements
        this.achievementSystem.updateStat('asteroidsDestroyed', 1);
        this.achievementSystem.updateStat('creditsFromAsteroids', creditsEarned);
        this.achievementSystem.updateStat('totalCreditsEarned', creditsEarned);

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

    showResourceNotification(type, credits) {
        const messages = {
            gold: `💰 ${languageSystem.t('Gold ore!')} +${credits} ${languageSystem.t('credits!')}`,
            crystal: `💎 ${languageSystem.t('Energy crystal!')} +${credits} ${languageSystem.t('credits!')}`,
            platinum: `✨ ${languageSystem.t('Platinum ore!')} +${credits} ${languageSystem.t('credits!')}`,
            hunter: `🎯 ${languageSystem.t('Hunter bounty!')} +${credits} ${languageSystem.t('credits!')}`
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 215, 0, 0.9);
            color: #000;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s;
        `;
        notification.textContent = messages[type];
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    defeatBoss() {
        if (!this.boss) return;

        // Create explosion effect
        this.particleSystem.createExplosion(this.boss.x, this.boss.y, this.boss.color);

        // Get rewards with gold rush
        const goldRushMultiplier = this.upgradeSystem.getPlayerStats().creditMultiplier || 1.0;
        const rewards = this.boss.getDefeatRewards();
        const creditsEarned = Math.floor(rewards.credits * goldRushMultiplier);
        this.credits += creditsEarned;
        this.score += rewards.score;

        // Track achievements
        this.achievementSystem.updateStat('bossesKilled', 1);
        this.achievementSystem.updateStat('totalCreditsEarned', creditsEarned);

        // Spawn power-up
        this.powerUps.push(new PowerUp(
            rewards.powerUp.x,
            rewards.powerUp.y,
            rewards.powerUp.type
        ));

        // Store boss defeat dialog and weapon unlock for sequential display
        this.pendingBossDefeatDialog = this.boss.getDialog('defeat');
        this.pendingWeaponUnlock = this.weaponSystem.unlockWeapon(this.level);

        this.boss = null;
        this.bossActive = false;
        this.bossDefeated = true; // Prevent new boss spawning during victory delay

        // Start the sequential display of events
        this.showBossDefeatSequence();
    }

    showBossDefeatSequence() {
        // First show boss defeat dialog if exists
        if (this.pendingBossDefeatDialog) {
            this.isPaused = true;
            this.dialogSystem.show(
                this.pendingBossDefeatDialog.speaker,
                this.pendingBossDefeatDialog.message,
                this.pendingBossDefeatDialog.portrait,
                () => {
                    this.isPaused = false;
                    this.pendingBossDefeatDialog = null;
                    // Continue to special events
                    this.checkBossDefeatSpecialEvents();
                }
            );
        } else {
            this.checkBossDefeatSpecialEvents();
        }
    }

    checkBossDefeatSpecialEvents() {
        const levelEvent = getLevelEvent(this.level, 'boss_defeat');
        if (levelEvent && levelEvent.length > 0) {
            this.isPaused = true;
            this.dialogSystem.showSequence(levelEvent, () => {
                this.isPaused = false;
                // Continue to weapon unlock
                this.showWeaponUnlockIfNeeded();
            });
        } else {
            // No special events, go straight to weapon unlock
            this.showWeaponUnlockIfNeeded();
        }
    }

    showWeaponUnlockIfNeeded() {
        if (this.pendingWeaponUnlock) {
            // Show weapon unlock notification
            this.showWeaponUnlock(this.pendingWeaponUnlock);
            this.pendingWeaponUnlock = null;

            // Wait for notification to show, then complete level
            setTimeout(() => this.levelComplete(), 3000);
        } else {
            // No weapon unlock, complete level after short delay
            setTimeout(() => this.levelComplete(), 2000);
        }
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
            <div style="font-size: 32px; margin-bottom: 10px;">${languageSystem.t('NEW WEAPON UNLOCKED!')}</div>
            <div style="font-size: 28px; color: #00ff00; margin: 10px 0;">${languageSystem.t(weapon.name)}</div>
            <div style="font-size: 16px; opacity: 0.8;">${languageSystem.t(weapon.description)}</div>
            <div style="font-size: 14px; margin-top: 10px;">${languageSystem.t('Press')} ${weapon.key} ${languageSystem.t('to equip')}</div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    levelComplete() {
        this.isPlaying = false;

        // Check if level was completed without taking damage (perfect wave)
        if (this.player && this.player.health === this.player.maxHealth &&
            this.player.shield === this.player.maxShield) {
            // Track perfect wave for achievements
            this.achievementSystem.updateStat('perfectWaves', 1);
        }

        // Track level completion for achievements
        const levelTime = (Date.now() - this.sessionStats.levelStartTime) / 1000;
        const familyHappy = this.familyWelfare.getStatus().morale >= 50;
        this.achievementSystem.trackLevelComplete(this.level, levelTime, familyHappy);
        this.achievementSystem.updateStat('highestLevel', this.level + 1, false);

        // Increment level AFTER checking for victory
        if (this.level >= 10) {
            // Add delay before showing victory
            setTimeout(() => {
                this.screenManager.hideHUD();
                this.victory();
            }, 500);
        } else {
            this.level++;
            // Add delay before showing upgrade screen
            setTimeout(() => {
                this.screenManager.hideHUD();
                this.showUpgradeScreen();
            }, 500);
        }
    }

    showUpgradeScreen() {
        // Initialize family UI with proper values
        this.updateFamilyUI();

        // Only do these actions when first entering the screen (not on refresh)
        if (!this.isRefreshingUpgradeScreen) {
            // Calculate passive income
            const passiveIncomeRate = this.upgradeSystem.getPlayerStats().passiveIncomeRate || 0;
            if (passiveIncomeRate > 0) {
                const passiveIncome = Math.floor(this.credits * passiveIncomeRate);
                if (passiveIncome > 0) {
                    this.credits += passiveIncome;
                    // Show passive income notification
                    setTimeout(() => {
                        this.dialogSystem.showQuickMessage(`${languageSystem.t('Investment Portfolio earned you')} ${passiveIncome} ${languageSystem.t('credits')}! (+${Math.floor(passiveIncomeRate * 100)}% ${languageSystem.t('interest')})`);
                    }, 500);
                }
            }

            // Update family hunger when entering hub
            const isStarving = this.familyWelfare.updateHunger(this.level);

            // Show starving message after a delay to not conflict with other UI
            if (isStarving) {
                setTimeout(() => {
                    this.dialogSystem.showQuickMessage(languageSystem.t('Your family is starving! Send money home soon!'));
                }, 1500); // Delayed more to not overlap with passive income
            }

            // Refill all weapon ammo when entering Space Hub
            this.weaponSystem.refillAllAmmo();

            // Show ammo refill notification
            this.showAmmoRefillNotification();
        }

        // Always update family UI
        this.updateFamilyUI();

        const upgrades = this.upgradeSystem.getAllUpgrades();
        this.screenManager.showUpgradeScreen(
            this.credits,
            this.level,
            upgrades,
            (type) => this.purchaseUpgrade(type)
        );
    }

    updateFamilyUI() {
        const status = this.familyWelfare.getStatus();
        const moraleLevels = {
            'starving': { text: languageSystem.t('Desperate') + ' 😰', color: '#ff3333' },
            'worried': { text: languageSystem.t('Worried') + ' 😟', color: '#ff9933' },
            'hopeful': { text: languageSystem.t('Hopeful') + ' 🙂', color: '#ffff66' },
            'grateful': { text: languageSystem.t('Grateful') + ' 😊', color: '#66ff66' },
            'proud': { text: languageSystem.t('Proud') + ' 😍', color: '#66ffff' }
        };

        const moraleInfo = moraleLevels[status.morale] || moraleLevels.hopeful;

        const moraleEl = document.getElementById('familyMorale');
        if (moraleEl) {
            moraleEl.textContent = moraleInfo.text;
            moraleEl.style.color = moraleInfo.color;
        }

        const hungerEl = document.getElementById('familyHunger');
        if (hungerEl) {
            hungerEl.textContent = status.hungerStatus;
            hungerEl.style.color = status.hunger < 30 ? '#ff3333' : status.hunger < 50 ? '#ff9933' : '#66ff66';
        }

        const debtEl = document.getElementById('familyDebt');
        if (debtEl) {
            debtEl.textContent = status.medicalDebt + ' ' + languageSystem.t('credits');
        }

        const sentEl = document.getElementById('familySent');
        if (sentEl) {
            sentEl.textContent = status.creditsSentHome + ' ' + languageSystem.t('credits');
        }

        const messageEl = document.getElementById('familyMessage');
        if (messageEl) {
            messageEl.textContent = this.familyWelfare.getRandomFamilyMessage();
        }
    }

    sendMoneyHome() {
        // Create dialog for sending money
        const amounts = [100, 200, 500, 1000, 'All'];
        const buttonsHTML = amounts.map(amount => {
            const value = amount === 'All' ? this.credits : amount;
            const disabled = this.credits < value;
            return `<button
                class="menu-button"
                style="padding: 10px; margin: 5px; ${disabled ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                ${disabled ? 'disabled' : ''}
                onclick="game.confirmSendMoney(${value})">
                ${amount === 'All' ? `${languageSystem.t('All')} (${this.credits} ${languageSystem.t('credits')})` : `${amount} ${languageSystem.t('credits')}`}
            </button>`;
        }).join('');

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,20,0.95);
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 30px;
            z-index: 10001;
            text-align: center;
        `;
        dialog.innerHTML = `
            <h3 style="color: #00ffff; margin-bottom: 20px;">${languageSystem.t('Send Money to Family')}</h3>
            <p style="color: #fff; margin-bottom: 20px;">${languageSystem.t('You have')} ${this.credits} ${languageSystem.t('credits')}</p>
            <div>${buttonsHTML}</div>
            <button class="menu-button" style="margin-top: 20px; background: #ff6666;" onclick="game.cancelSendMoney()">${languageSystem.t('Cancel')}</button>
        `;
        dialog.id = 'sendMoneyDialog';
        document.body.appendChild(dialog);
    }

    confirmSendMoney(amount) {
        if (amount > this.credits) return;

        // Send money and get result
        const result = this.familyWelfare.sendMoneyHome(amount);
        this.credits -= amount;

        // Update UI
        this.updateFamilyUI();
        document.getElementById('creditsDisplay').textContent = this.credits;

        // Show result message
        if (result) {
            let message = result.message;
            if (result.debtPayment > 0) {
                message += ` (${result.debtPayment} credits applied to medical debt)`;
            }
            this.dialogSystem.showQuickMessage(message);
        }

        // Close dialog
        this.cancelSendMoney();

        // Refresh upgrade screen to update button states
        this.isRefreshingUpgradeScreen = true;
        this.showUpgradeScreen();
        this.isRefreshingUpgradeScreen = false;
    }

    cancelSendMoney() {
        const dialog = document.getElementById('sendMoneyDialog');
        if (dialog) {
            dialog.remove();
        }
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
        notification.innerHTML = '🔫 ' + languageSystem.t('All weapons refilled!') + ' 🔫';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    purchaseUpgrade(type) {
        const cost = this.upgradeSystem.purchase(type, this.credits);
        if (cost > 0) {
            this.credits -= cost;

            // Track achievements
            this.achievementSystem.updateStat('upgradesPurchased', 1);

            // Update weapon system if ammo crate was upgraded
            if (type === 'ammoCrate') {
                const stats = this.upgradeSystem.getPlayerStats();
                this.weaponSystem.updateAmmoMultiplier(stats.ammoMultiplier);
            }

            // Refresh display with flag to prevent re-triggering initial actions
            this.isRefreshingUpgradeScreen = true;
            this.showUpgradeScreen(); // Refresh display
            this.isRefreshingUpgradeScreen = false;
        }
    }

    continueToNextLevel() {
        // Level was already incremented in levelComplete(), don't increment again
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

        // Show victory dialog sequence
        const victoryEvents = getLevelEvent(10, 'victory');
        if (victoryEvents && victoryEvents.length > 0) {
            this.dialogSystem.showSequence(victoryEvents, () => {
                this.completeVictory();
            });
        } else {
            this.completeVictory();
        }
    }

    completeVictory() {
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

        // Draw debug info for enemies/hunters
        const levelConfig = this.levelConfig.getLevel(this.level);
        const hunterThreshold = Math.floor(levelConfig.enemiesToBoss * 0.8);

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        const hunterStatus = this.huntersSpawned ?
            (this.huntersDefeated ? languageSystem.t('DEFEATED') : `${languageSystem.t('ACTIVE')}: ${this.hunters.length}`) :
            languageSystem.t('NOT SPAWNED');
        this.ctx.fillText(`${languageSystem.t('Kills:')} ${this.enemiesKilled}/${levelConfig.enemiesToBoss} | ${languageSystem.t('Hunters at:')} ${hunterThreshold} | ${languageSystem.t('Status:')} ${hunterStatus}`, 10, this.canvas.height - 10);
        this.ctx.restore();

        // Update family status in HUD
        const status = this.familyWelfare.getStatus();
        const moraleEl = document.getElementById('hudFamilyMorale');
        if (moraleEl) {
            moraleEl.textContent = status.moraleEmoji;
            // Add morale text color
            const colors = {
                '😰': '#ff3333',
                '😟': '#ff9933',
                '🙂': '#ffff66',
                '😊': '#66ff66',
                '😍': '#66ffff'
            };
            moraleEl.style.color = colors[status.moraleEmoji] || '#ffffff';
        }

        const debtEl = document.getElementById('hudFamilyDebt');
        if (debtEl) {
            debtEl.textContent = status.medicalDebt;
            debtEl.style.color = status.medicalDebt === 0 ? '#66ff66' : '#ff6666';
        }
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
            this.showCheatNotification(languageSystem.t('ALL WEAPONS UNLOCKED!'));
        }

        // Replenish cheat
        if (cheats.replenish && this.player) {
            // Restore health and shield
            this.player.health = this.player.maxHealth;
            this.player.shield = this.player.maxShield;

            // Refill all ammo
            this.weaponSystem.refillAllAmmo();

            this.showCheatNotification(languageSystem.t('FULLY REPLENISHED!'));
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

            // Get weapon list
            const weapons = this.weaponSystem ? this.weaponSystem.weapons : [];
            const unlockedWeapons = this.weaponSystem ? this.weaponSystem.unlockedWeapons : [];
            const currentWeaponIndex = this.weaponSystem ? this.weaponSystem.currentWeaponIndex : 0;

            this.screenManager.showPauseMenu(gameStats, playerStats, upgrades, weapons, unlockedWeapons, currentWeaponIndex);
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

    showAchievements() {
        this.achievementUI.showAchievementScreen();
    }

    backToMenu() {
        this.screenManager.hideAllScreens();
        this.screenManager.showScreen('mainMenu');
        languageSystem.updateAllTexts();
    }

    changeLanguage(lang) {
        this.language = lang;
        languageSystem.setLanguage(lang);
    }

    updateDynamicTexts() {
        // Update weapon names in HUD if playing
        if (this.player && this.weaponSystem) {
            const weaponName = document.getElementById('weaponName');
            if (weaponName) {
                const currentWeapon = this.weaponSystem.getCurrentWeapon();
                weaponName.textContent = languageSystem.t(currentWeapon.name);
            }
        }
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
            level: this.level,  // Save the current level (already incremented in levelComplete)
            score: this.score,
            credits: this.credits,
            upgrades: this.upgradeSystem.upgrades,
            weapons: this.weaponSystem.saveState(),
            familyWelfare: this.familyWelfare.saveState(),
            timestamp: Date.now(),
            version: '1.0'
        };

        localStorage.setItem('spaceShooterSave', JSON.stringify(saveData));

        // Show confirmation (brief message)
        const upgradeScreen = document.getElementById('upgradeScreen');
        if (upgradeScreen && upgradeScreen.classList.contains('active')) {
            const saveMsg = document.createElement('div');
            saveMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 255, 0, 0.9); color: white; padding: 20px; border-radius: 10px; font-size: 24px; z-index: 1000;';
            saveMsg.textContent = languageSystem.t('Progress Saved!');
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

            // Restore family welfare
            if (saveData.familyWelfare) {
                this.familyWelfare.loadState(saveData.familyWelfare);
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