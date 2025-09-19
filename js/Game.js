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

        // Game modes
        this.gameMode = 'campaign'; // 'campaign', 'replay', 'survival'
        this.survivalWave = 0;
        this.survivalStartTime = 0;
        this.masterModeEnabled = false;
        this.completedLevels = []; // Track completed levels for replay

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

        // Hunter spawn tracking for survival mode
        this.huntersSpawned25 = false;
        this.huntersSpawned50 = false;
        this.huntersSpawned75 = false;
        this.huntersSpawned95 = false;

        // Wave system
        this.waveTimer = 0;
        this.currentWave = 1;
        this.enemiesKilled = 0;
        this.enemiesPerWave = 10;

        // Game options
        this.controlMode = 'touch';
        this.autoFire = true;
        this.weaponHUDPosition = 'bottom';

        // Audio system
        this.music = null;
        this.musicVolume = 0.5; // Default volume
        this.sfxVolume = 0.7; // Default SFX volume

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
        this.highScores = [];

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
        // Setup start screen button handler
        this.setupStartScreen();

        // Check if this is first launch (no profiles)
        if (!profileManager.hasProfiles()) {
            // Show profile creation dialog after logo sequence
            this.needsProfileCreation = true;
        } else {
            // Initialize profile display
            this.updateProfileDisplay();

            // Load profile options
            this.loadOptions();

            // Load high scores from profile
            this.highScores = profileManager.getHighScores();

            // Load achievements for current profile
            this.achievementSystem.reloadProgress();
        }

        // Detect browser language and set Russian if found
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && (browserLang.toLowerCase().startsWith('ru') || browserLang.toLowerCase().includes('ru'))) {
            languageSystem.setLanguage('ru');
        }

        // Initialize language
        setTimeout(() => {
            languageSystem.updateAllTexts();
        }, 100);

        // Listen for language changes to update dynamic content
        window.addEventListener('languageChanged', () => {
            this.updateDynamicTexts();
        });
    }

    setupStartScreen() {
        // Detect browser language early for start screen
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('ru')) {
            languageSystem.setLanguage('ru');
        }

        // Translate start screen elements
        const titleElement = document.querySelector('.initial-logo');
        const subtitleElement = document.querySelector('.initial-subtitle');
        const descElement = document.querySelector('.initial-description');
        const buttonText = document.querySelector('.start-text');
        const hintElement = document.querySelector('.initial-hint');

        if (titleElement) titleElement.textContent = languageSystem.t('STARDUST');
        if (subtitleElement) subtitleElement.textContent = languageSystem.t("A Miner's Tale");
        if (descElement) descElement.textContent = languageSystem.t('Save your family. Fight the corporations. Become the hero of Mars.');
        if (buttonText) buttonText.textContent = languageSystem.t('START GAME');
        if (hintElement) hintElement.textContent = languageSystem.t('Click to begin your journey');

        // Preload/cache the MP3 file
        const audioPreload = new Audio();
        audioPreload.src = 'game-intro.mp3';
        audioPreload.load(); // Preload the audio file

        const startButton = document.getElementById('startButton');
        const startScreen = document.getElementById('startScreen');
        const startCanvas = document.getElementById('startCanvas');

        // Setup starfield on start screen
        if (startCanvas) {
            const ctx = startCanvas.getContext('2d');
            startCanvas.width = window.innerWidth;
            startCanvas.height = window.innerHeight;

            // Create a starfield for the start screen
            const startStarfield = new Starfield(startCanvas);

            // Animate the starfield
            const animateStartScreen = () => {
                if (startScreen && startScreen.style.display !== 'none') {
                    ctx.clearRect(0, 0, startCanvas.width, startCanvas.height);
                    startStarfield.update();
                    startStarfield.draw(ctx);
                    requestAnimationFrame(animateStartScreen);
                }
            };
            animateStartScreen();

            // Handle window resize
            window.addEventListener('resize', () => {
                if (startCanvas && startScreen.style.display !== 'none') {
                    startCanvas.width = window.innerWidth;
                    startCanvas.height = window.innerHeight;
                    startStarfield.resize(startCanvas);
                }
            });
        }

        if (startButton && startScreen) {
            startButton.addEventListener('click', () => {
                // Initialize and start music
                this.initMusic();

                // Hide start screen with fade animation
                startScreen.classList.add('hidden');

                // Remove start screen after animation
                setTimeout(() => {
                    startScreen.style.display = 'none';
                }, 800);

                // Start with logo sequence after a short delay
                setTimeout(() => {
                    this.showLogoSequence();
                }, 500);
            });
        }
    }

    initMusic() {
        try {
            // Create audio element for background music
            this.music = new Audio();

            // Set properties before setting source
            this.music.loop = true;

            // Ensure volume is within valid range (0.0 to 1.0)
            const validVolume = Math.max(0, Math.min(1, this.musicVolume));
            this.music.volume = validVolume;

            // Set source (MP3 only, no fallback needed)
            this.music.src = 'game-intro.mp3';

            // Play music immediately since user clicked the start button
            this.music.play().catch(err => {
                console.log('Music playback failed:', err);
                // If it still fails, try once more on next interaction
                const retryMusic = () => {
                    if (this.music) {
                        this.music.play().catch(err => console.log('Music retry failed:', err));
                    }
                };
                document.addEventListener('click', retryMusic, { once: true });
            });
        } catch (error) {
            console.error('Failed to initialize music:', error);
            this.music = null;
        }
    }

    setMusicVolume(volume) {
        // Ensure volume is within valid range (0.0 to 1.0)
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            try {
                this.music.volume = this.musicVolume;
            } catch (e) {
                console.error('Failed to set music volume:', e);
            }
        }
    }

    setSFXVolume(volume) {
        // Ensure volume is within valid range (0.0 to 1.0)
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        // Update any active sound effects
    }

    pauseMusic() {
        if (this.music && !this.music.paused) {
            this.music.pause();
        }
    }

    resumeMusic() {
        if (this.music && this.music.paused) {
            this.music.play().catch(err => console.log('Music resume failed:', err));
        }
    }

    async showLogoSequence() {
        await this.screenManager.showLogoSequence();

        // If first launch, show profile creation
        if (this.needsProfileCreation) {
            this.showCreateProfileDialog();
        }
    }

    showScreen(screenId) {
        this.screenManager.showScreen(screenId);
    }

    hideScreen(screenId) {
        this.screenManager.hideScreen(screenId);
    }

    // Profile management methods
    updateProfileDisplay() {
        const profile = profileManager.getCurrentProfile();

        const avatarEl = document.getElementById('profileAvatar');
        const nameEl = document.getElementById('profileName');

        if (profile) {
            if (avatarEl) avatarEl.textContent = profile.avatar;
            if (nameEl) nameEl.textContent = profile.name;
        } else {
            // No profile yet - show placeholder
            if (avatarEl) avatarEl.textContent = '❓';
            if (nameEl) nameEl.textContent = languageSystem.t('No Profile');
        }
    }

    showProfiles() {
        this.screenManager.showScreen('profileScreen');
        this.refreshProfileList();
    }

    refreshProfileList() {
        const profileList = document.getElementById('profileList');
        if (!profileList) return;

        profileList.innerHTML = '';
        const profiles = profileManager.getAllProfiles();
        const currentProfileId = profileManager.currentProfile;

        profiles.forEach(profile => {
            // Skip invalid profiles
            if (!profile || !profile.name) {
                console.warn('Skipping invalid profile in UI:', profile);
                return;
            }

            const profileCard = document.createElement('div');
            profileCard.className = 'profile-card';
            if (profile.id === currentProfileId) {
                profileCard.classList.add('active');
            }

            const stats = profile.stats || { totalScore: 0, highestLevel: 0 };
            const lastPlayedDate = new Date(profile.lastPlayed || Date.now()).toLocaleDateString();

            // Calculate achievements count from achievement progress
            let achievementCount = 0;
            const achievementProgress = profile.achievementProgress || {};
            for (const id in achievementProgress) {
                if (achievementProgress[id] && achievementProgress[id].unlockedTiers) {
                    achievementCount += achievementProgress[id].unlockedTiers.length;
                }
            }
            const totalPlayTime = stats.totalPlayTime || 0;
            const hours = Math.floor(totalPlayTime / 3600);
            const minutes = Math.floor((totalPlayTime % 3600) / 60);
            const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

            profileCard.innerHTML = `
                ${profile.id === currentProfileId ? '<span class="profile-current-badge">✓ ' + languageSystem.t('Active') + '</span>' : ''}
                <div class="profile-card-header">
                    <div class="profile-card-avatar">${profile.avatar}</div>
                    <div style="flex: 1;">
                        <div class="profile-card-name">${profile.name}</div>
                        <div style="color: #888; font-size: 12px; margin-top: 5px;">${languageSystem.t('Last played')}: ${lastPlayedDate}</div>
                    </div>
                </div>
                <div class="profile-card-stats">
                    <div class="profile-stat-item">
                        <span class="profile-stat-label">🏆 ${languageSystem.t('High Score')}:</span>
                        <span class="profile-stat-value" style="color: #ffff00;">${stats.totalScore.toLocaleString()}</span>
                    </div>
                    <div class="profile-stat-item">
                        <span class="profile-stat-label">📈 ${languageSystem.t('Highest Level')}:</span>
                        <span class="profile-stat-value" style="color: #00ffff;">${stats.highestLevel || 0}</span>
                    </div>
                    <div class="profile-stat-item">
                        <span class="profile-stat-label">🎮 ${languageSystem.t('Games Played')}:</span>
                        <span class="profile-stat-value">${stats.totalGamesPlayed || 0}</span>
                    </div>
                    <div class="profile-stat-item">
                        <span class="profile-stat-label">⏱️ ${languageSystem.t('Play Time')}:</span>
                        <span class="profile-stat-value">${timeString}</span>
                    </div>
                    <div class="profile-stat-item">
                        <span class="profile-stat-label">🌟 ${languageSystem.t('Achievements')}:</span>
                        <span class="profile-stat-value" style="color: #ffa500;">${achievementCount}</span>
                    </div>
                </div>
                <div class="profile-card-actions">
                    ${profile.id !== currentProfileId ?
                        `<button class="profile-button" onclick="game.switchProfile('${profile.id}')">📂 ${languageSystem.t('Select')}</button>` :
                        `<button class="profile-button" onclick="game.editProfile('${profile.id}')">✏️ ${languageSystem.t('Edit')}</button>`
                    }
                    ${Object.keys(profileManager.profiles).length > 1 ?
                        `<button class="profile-button delete" onclick="game.deleteProfile('${profile.id}')">🗑️ ${languageSystem.t('Delete')}</button>` : ''
                    }
                </div>
            `;

            profileList.appendChild(profileCard);
        });
    }

    switchProfile(profileId) {
        if (profileManager.switchProfile(profileId)) {
            this.updateProfileDisplay();
            this.loadOptions();
            this.highScores = profileManager.getHighScores();

            // Reload achievements for the new profile
            this.achievementSystem.reloadProgress();

            this.refreshProfileList();
            // Show success message
            this.dialogSystem.showQuickMessage(languageSystem.t('Profile switched successfully!'));
        }
    }

    deleteProfile(profileId) {
        if (confirm(languageSystem.t('Are you sure you want to delete this profile?'))) {
            if (profileManager.deleteProfile(profileId)) {
                this.updateProfileDisplay();
                this.refreshProfileList();
                this.dialogSystem.showQuickMessage(languageSystem.t('Profile deleted'));
            } else {
                this.dialogSystem.showQuickMessage(languageSystem.t('Cannot delete the last profile'));
            }
        }
    }

    editProfile(profileId) {
        const profile = profileManager.profiles[profileId];
        if (!profile) return;

        // Show edit dialog
        this.showCreateProfileDialog(profile);
    }

    showCreateProfileDialog(existingProfile = null) {
        const dialog = document.getElementById('createProfileDialog');
        if (!dialog) return;

        dialog.style.display = 'block';

        // Set initial values if editing
        const nameInput = document.getElementById('profileNameInput');
        if (nameInput) {
            nameInput.value = existingProfile ? existingProfile.name : '';
        }

        // Update avatar selection
        const avatarGrid = document.getElementById('avatarGrid');
        if (avatarGrid) {
            avatarGrid.innerHTML = '';
            const avatars = ProfileManager.getAvatarOptions();

            avatars.forEach(avatar => {
                const avatarOption = document.createElement('div');
                avatarOption.className = 'avatar-option';
                if (existingProfile && existingProfile.avatar === avatar) {
                    avatarOption.classList.add('selected');
                }
                avatarOption.textContent = avatar;
                avatarOption.onclick = () => {
                    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                    avatarOption.classList.add('selected');
                };
                avatarGrid.appendChild(avatarOption);
            });

            // Select first avatar if creating new profile
            if (!existingProfile && avatarGrid.firstChild) {
                avatarGrid.firstChild.classList.add('selected');
            }
        }

        // Store profile ID if editing
        dialog.dataset.editingProfileId = existingProfile ? existingProfile.id : '';
    }

    createProfile() {
        const dialog = document.getElementById('createProfileDialog');
        const nameInput = document.getElementById('profileNameInput');
        const selectedAvatar = document.querySelector('.avatar-option.selected');

        if (!nameInput || !nameInput.value.trim()) {
            alert(languageSystem.t('Please enter a profile name'));
            return;
        }

        const name = nameInput.value.trim();
        const avatar = selectedAvatar ? selectedAvatar.textContent : '🚀';

        if (dialog.dataset.editingProfileId) {
            // Editing existing profile
            profileManager.updateProfileName(dialog.dataset.editingProfileId, name);
            profileManager.updateProfileAvatar(dialog.dataset.editingProfileId, avatar);
        } else {
            // Creating new profile
            profileManager.createProfile(name, avatar);

            // If this was first profile creation, initialize everything
            if (this.needsProfileCreation) {
                this.needsProfileCreation = false;
                this.updateProfileDisplay();
                this.loadOptions();
                this.highScores = profileManager.getHighScores();

                // Initialize achievements for the new profile
                this.achievementSystem.reloadProgress();
            }
        }

        this.updateProfileDisplay();
        this.refreshProfileList();
        this.cancelCreateProfile();
    }

    cancelCreateProfile() {
        const dialog = document.getElementById('createProfileDialog');
        if (dialog) {
            dialog.style.display = 'none';
            dialog.dataset.editingProfileId = '';
        }
    }

    startGame(fromMenu = true) {
        // If starting from menu, show upgrade screen first
        if (fromMenu) {
            this.level = 1;
            this.score = 0;
            this.credits = 500;

            // Save initial state for retry purposes
            this.levelStartScore = this.score;
            this.levelStartCredits = this.credits;

            // Show upgrade screen instead of starting directly
            this.screenManager.hideScreen('mainMenu');
            this.showUpgradeScreen();
            return; // Don't start the actual game yet
        }

        // This path is no longer used - all starts go through upgrade screen first
        // The actual level start is in actuallyStartLevel()
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
        const achievementBonuses = this.achievementSystem.getTotalBonuses();
        const stats = this.upgradeSystem.getPlayerStats(achievementBonuses);
        this.weaponSystem.updateAmmoMultiplier(stats.ammoMultiplier);

        // Reset to default weapon (Pulse Laser) for each new level
        this.weaponSystem.currentWeaponIndex = 0;

        this.player = new Player(this.canvas, this.upgradeSystem.upgrades, this.weaponSystem);

        // Apply family morale modifiers from FormulaService
        const morale = this.familyWelfare.morale;
        const modifiers = formulaService.getMoraleModifiers(morale);
        this.player.moraleModifiers = modifiers;
        // Apply speed modifier
        this.player.speed = this.player.baseSpeed * modifiers.speed;

        // Initialize weapon HUD
        this.screenManager.initWeaponHUD(this.weaponSystem.weapons);
        this.screenManager.updateWeaponHUD(
            this.weaponSystem.weapons,
            this.weaponSystem.unlockedWeapons,
            this.weaponSystem.currentWeaponIndex
        );

        // Update family status in HUD immediately when game starts
        this.updateFamilyHUD();
    }

    gameLoop() {
        if (!this.isPlaying) {
            this.gameLoopRunning = false;
            return;
        }
        this.gameLoopRunning = true;

        // Render background even when paused (for dialog scenes)
        if (this.isPaused) {
            // Clear canvas
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Still update and draw starfield for visual continuity
            this.starfield.update();
            this.starfield.draw(this.ctx);

            // Continue loop
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

        // Update morale modifiers in real-time from FormulaService
        const morale = this.familyWelfare.morale;
        const modifiers = formulaService.getMoraleModifiers(morale);
        this.player.moraleModifiers = modifiers;
        // Apply speed modifier dynamically
        this.player.speed = this.player.baseSpeed * modifiers.speed;

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

        // Special spawning logic for survival mode
        if (this.gameMode === 'survival') {
            this.spawnSurvivalWaves();
            return;
        }

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
        // In survival mode, use scaled level based on wave
        const effectiveLevel = this.gameMode === 'survival' ?
            Math.min(Math.floor(1 + this.survivalWave * 0.5), 20) : // Cap at level 20 equivalent
            this.level;

        const enemy = new Enemy(this.canvas, effectiveLevel);
        this.enemies.push(enemy);
    }

    spawnSurvivalWaves() {
        // Initial delay before spawning starts
        if (this.enemySpawnDelay > 0) {
            this.enemySpawnDelay--;
            return;
        }

        this.survivalSpawnTimer++;

        // Check if we've spawned all enemies for this wave
        if (this.enemiesSpawned >= this.enemiesPerWave && this.enemies.length === 0 && !this.bossActive) {
            // Wave complete! Move to next wave
            this.levelComplete();
            return;
        }

        // Spawn massive groups at fixed intervals
        if (this.survivalSpawnTimer >= this.spawnInterval && this.enemiesSpawned < this.enemiesPerWave) {
            this.survivalSpawnTimer = 0;

            // Calculate how many enemies to spawn in this group
            const enemiesToSpawn = Math.min(
                this.enemiesPerSpawnGroup,
                this.enemiesPerWave - this.enemiesSpawned
            );

            // Spawn the group with slight position variations
            for (let i = 0; i < enemiesToSpawn; i++) {
                setTimeout(() => {
                    if (this.isPlaying && this.gameMode === 'survival') {
                        this.spawnEnemy();
                        this.enemiesSpawned++;
                    }
                }, i * 50); // Stagger spawns by 50ms to avoid overlap
            }
        }

        // Spawn hunters at 25%, 50%, 75%, and 95% of wave if scheduled
        if (this.survivalWave > 5 && this.survivalWave % 3 === 0 && !this.huntersDefeated) {
            const spawnPercentage = this.enemiesSpawned / this.enemiesPerWave;

            // Check for each spawn threshold
            if (!this.huntersSpawned25 && spawnPercentage >= 0.25 && this.hunters.length === 0) {
                this.spawnHunters();
                this.huntersSpawned25 = true;
            } else if (!this.huntersSpawned50 && spawnPercentage >= 0.50 && this.hunters.length === 0) {
                this.spawnHunters();
                this.huntersSpawned50 = true;
            } else if (!this.huntersSpawned75 && spawnPercentage >= 0.75 && this.hunters.length === 0) {
                this.spawnHunters();
                this.huntersSpawned75 = true;
            } else if (!this.huntersSpawned95 && spawnPercentage >= 0.95 && this.hunters.length === 0) {
                this.spawnHunters();
                this.huntersSpawned95 = true;
            }
        }

        // Spawn boss if scheduled
        if (this.survivalWave % 10 === 0 && !this.bossDefeated && !this.bossActive &&
            this.enemiesSpawned >= this.enemiesPerWave * 0.8) {
            this.spawnBoss();
            this.bossActive = true;
        }

        // Always spawn some asteroids for credits
        if (this.waveTimer % 60 === 0 && this.asteroids.length < 5) {
            this.spawnAsteroid();
        }
    }

    spawnAsteroid() {
        const asteroid = new Asteroid(this.canvas);
        this.asteroids.push(asteroid);
    }

    spawnHunters() {
        // Mark that hunters have been spawned
        this.huntersSpawned = true;

        // Spawn more hunters in survival mode - scale with wave
        let hunterCount;
        if (this.gameMode === 'survival') {
            // In survival: spawn 2-6 hunters based on wave number
            hunterCount = Math.min(2 + Math.floor(this.survivalWave / 5), 6);
        } else {
            // In campaign: spawn 2-3 hunters based on level
            hunterCount = Math.min(1 + Math.floor(this.level / 4), 3);
        }

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
        // Apply morale bonus to credits
        const moraleBonus = this.player?.moraleModifiers?.creditBonus || 1.0;
        const creditsEarned = Math.floor(enemy.value / 2 * levelConfig.creditMultiplier * goldRushMultiplier * moraleBonus);
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
        // Apply morale bonus to credits
        const moraleBonus = this.player?.moraleModifiers?.creditBonus || 1.0;
        const creditsEarned = Math.floor(hunter.value * goldRushMultiplier * moraleBonus);
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
        // Apply morale bonus to credits
        const moraleBonus = this.player?.moraleModifiers?.creditBonus || 1.0;
        const creditsEarned = Math.floor(asteroid.value * goldRushMultiplier * moraleBonus);
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
        // Apply morale bonus to credits
        const moraleBonus = this.player?.moraleModifiers?.creditBonus || 1.0;
        const creditsEarned = Math.floor(rewards.credits * goldRushMultiplier * moraleBonus);
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
        // Track weapon unlock for achievements
        const unlockedCount = this.weaponSystem.unlockedWeapons.filter(unlocked => unlocked).length;
        this.achievementSystem.updateStat('weaponsUnlocked', unlockedCount, false);

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
        // Handle survival mode wave completion
        if (this.gameMode === 'survival') {
            // Don't stop the game loop for survival mode
            // Just transition to next wave immediately
            this.startSurvivalWave();
            return;
        }

        this.isPlaying = false;

        // Check if level was completed without taking damage (perfect wave)
        if (this.player && this.player.health === this.player.maxHealth &&
            this.player.shield === this.player.maxShield) {
            // Track perfect wave for achievements
            this.achievementSystem.updateStat('perfectWaves', 1);
        }

        // Track level completion for achievements
        const levelTime = (Date.now() - this.sessionStats.levelStartTime) / 1000;
        const familyMorale = this.familyWelfare.getStatus().morale;
        const familyHappy = familyMorale === 'hopeful' || familyMorale === 'grateful' || familyMorale === 'proud';
        this.achievementSystem.trackLevelComplete(this.level, levelTime, familyHappy);
        this.achievementSystem.updateStat('highestLevel', this.level + 1, false);

        // Track completed levels for free play mode
        if (!this.completedLevels.includes(this.level)) {
            this.completedLevels.push(this.level);
        }

        // Handle replay mode
        if (this.gameMode === 'replay') {
            // Show completion screen for replay mode
            setTimeout(() => {
                this.screenManager.hideHUD();
                this.showReplayComplete();
            }, 500);
            return;
        }

        // Normal campaign mode
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
        // Create autosave when entering Space Hub (after level completion)
        this.createAutosave();

        // Initialize family UI with proper values
        this.updateFamilyUI();

        // Default to family tab when entering Space Hub
        this.switchTab('family');

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

            // Update family hunger when entering hub (decreases by 10 per level completed)
            const isStarving = this.familyWelfare.updateHunger(1); // Pass 1 for one level completed

            // Update family UI immediately to show new hunger status
            this.updateFamilyUI();
            this.updateFamilyHUD();

            // Show starving message after a delay to not conflict with other UI
            if (isStarving) {
                setTimeout(() => {
                    this.dialogSystem.showQuickMessage(languageSystem.t('Your family is starving! Send money home soon!'));
                }, 1500); // Delayed more to not overlap with passive income
            }

            // Refill all weapon ammo when entering Space Hub
            this.weaponSystem.refillAllAmmo();

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

        // Calculate morale percentage (0-100% based on 5 levels)
        const moralePercentages = {
            'starving': 0,
            'worried': 25,
            'hopeful': 50,
            'grateful': 75,
            'proud': 100
        };
        const moralePercent = moralePercentages[status.morale] || 50;

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
            moraleEl.innerHTML = `${moraleInfo.text}<br><span style="font-size: 12px; color: #aaa;">(${moralePercent}%)</span>`;
            moraleEl.style.color = moraleInfo.color;
        }

        const hungerEl = document.getElementById('familyHunger');
        if (hungerEl) {
            const hungerPercent = Math.round(status.hunger);
            let hungerText = status.hungerStatus;
            // Add warning indicators for low hunger
            if (status.hunger < 30) {
                hungerText = '⚠️ ' + status.hungerStatus + ' ⚠️';
            } else if (status.hunger < 50) {
                hungerText = '⚠ ' + status.hungerStatus;
            }
            hungerEl.innerHTML = `${hungerText}<br><span style="font-size: 12px; color: #aaa;">(${hungerPercent}%)</span>`;
            hungerEl.style.color = status.hunger < 30 ? '#ff3333' : status.hunger < 50 ? '#ff9933' : '#66ff66';
            // Add pulsing animation for critical hunger
            if (status.hunger < 30) {
                hungerEl.style.animation = 'pulse 1s infinite';
            } else {
                hungerEl.style.animation = 'none';
            }
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
        // Check if dialog already exists
        if (document.getElementById('sendMoneyDialog')) {
            return; // Dialog already open
        }

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
            background: linear-gradient(135deg, rgba(0,50,100,0.98), rgba(0,20,50,0.98));
            border: 2px solid #00ffff;
            border-radius: 10px;
            padding: 30px;
            padding-top: 40px;
            z-index: 10001;
            text-align: center;
            box-shadow: 0 0 30px rgba(0,255,255,0.5);
            min-width: 400px;
        `;

        // Close button (X)
        const closeButton = `
            <button onclick="game.cancelSendMoney()" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255,100,100,0.3);
                border: 1px solid #ff6666;
                color: #ff6666;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                transition: all 0.3s;
            " onmouseover="this.style.background='#ff6666'; this.style.color='#000';"
               onmouseout="this.style.background='rgba(255,100,100,0.3)'; this.style.color='#ff6666';">
                ✕
            </button>
        `;

        dialog.innerHTML = `
            ${closeButton}
            <h3 style="color: #00ffff; margin-bottom: 20px; text-shadow: 0 0 10px #00ffff;">💰 ${languageSystem.t('Send Money to Family')}</h3>
            <p style="color: #fff; margin-bottom: 20px;">${languageSystem.t('You have')} <span style="color: #FFD700; font-weight: bold;">${this.credits}</span> ${languageSystem.t('credits')}</p>
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                ${buttonsHTML}
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 15px;">${languageSystem.t('Your family needs your support!')}</p>
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
                message += ` (${result.debtPayment} ${languageSystem.t('credits applied to medical debt')})`;
            }
            this.dialogSystem.showQuickMessage(message);
        }

        // Update dialog with new credit amount instead of closing
        const dialog = document.getElementById('sendMoneyDialog');
        if (dialog) {
            // Update the credit display in the dialog
            const creditSpan = dialog.querySelector('span[style*="color: #FFD700"]');
            if (creditSpan) {
                creditSpan.textContent = this.credits;
            }

            // Update button states
            const buttons = dialog.querySelectorAll('button[onclick*="confirmSendMoney"]');
            buttons.forEach(button => {
                const match = button.onclick.toString().match(/confirmSendMoney\((\d+)\)/);
                if (match) {
                    const buttonAmount = parseInt(match[1]);
                    const disabled = this.credits < buttonAmount;
                    button.disabled = disabled;
                    button.style.opacity = disabled ? '0.5' : '1';
                    button.style.cursor = disabled ? 'not-allowed' : 'pointer';
                }
            });

            // Update the "All" button
            const allButton = Array.from(buttons).find(b => b.textContent.includes(languageSystem.t('All')));
            if (allButton) {
                allButton.textContent = `${languageSystem.t('All')} (${this.credits} ${languageSystem.t('credits')})`;
                allButton.onclick = () => game.confirmSendMoney(this.credits);
            }
        }

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

            // Just update the upgrades tab without switching tabs
            this.updateUpgradesTab();

            // Update credits display
            const creditsEl = document.getElementById('creditsDisplay');
            if (creditsEl) creditsEl.textContent = this.credits;
        }
    }

    continueToNextLevel() {
        // Save the state at the start of the new level for retry purposes
        this.levelStartScore = this.score;
        this.levelStartCredits = this.credits;

        // Level was already incremented in levelComplete(), don't increment again
        if (this.level > 10) {
            this.victory();
        } else {
            this.actuallyStartLevel(); // Start the level after upgrades
        }
    }

    actuallyStartLevel() {
        // This is the actual level start after upgrades
        this.screenManager.hideScreen('upgradeScreen');
        this.screenManager.showHUD();

        // Initialize timing for level 1
        if (this.level === 1 && !this.gameStartTime) {
            this.gameStartTime = Date.now();
        }

        // Initialize level state
        this.enemiesKilled = 0;
        this.currentWave = 1;
        this.waveTimer = 0;
        this.enemySpawnDelay = 180; // 3 seconds delay before enemies appear (60fps)

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
        if (!this.gameLoopRunning) {
            this.gameLoop();
        }

        // Show intro dialog for level 1
        if (this.level === 1 && !this.hasShownIntro) {
            this.hasShownIntro = true;
            setTimeout(() => {
                // Get fresh translated intro
                const introEvents = getTranslatedStoryEvents().intro;
                this.dialogSystem.showSequence(introEvents, () => {
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

    gameOver() {
        this.isPlaying = false;
        this.screenManager.hideHUD();

        // Handle survival mode game over
        if (this.gameMode === 'survival') {
            this.endSurvivalMode();
            return;
        }

        // Update profile stats
        profileManager.updateStats({
            totalGamesPlayed: 1,
            totalScore: this.score,
            totalCreditsEarned: this.credits,
            totalEnemiesKilled: this.enemiesKilled
        });
        profileManager.setStatIfHigher('highestLevel', this.level);

        this.saveHighScore(this.score);

        // Store the failed level state for retry
        this.failedLevel = this.level;
        this.failedLevelScore = this.levelStartScore || 0;
        this.failedLevelCredits = this.levelStartCredits || 500;

        this.screenManager.showGameOver({
            score: this.score,
            level: this.level,
            enemiesKilled: this.enemiesKilled,
            credits: this.credits
        });
    }

    showReplayComplete() {
        // Show completion screen for replay mode
        const replayHTML = `
            <div class="screen active" id="replayComplete" style="text-align: center; padding: 50px;">
                <h2 style="font-size: 48px; margin-bottom: 30px; color: #66ffff;">${languageSystem.t('MISSION COMPLETE')}</h2>
                <div class="game-over-stats">
                    <div class="stat-row">
                        <span>${languageSystem.t('Level Replayed:')}</span>
                        <span>${this.level}</span>
                    </div>
                    <div class="stat-row">
                        <span>${languageSystem.t('Score:')}</span>
                        <span>${this.score.toLocaleString()}</span>
                    </div>
                    <div class="stat-row">
                        <span>${languageSystem.t('Enemies Destroyed:')}</span>
                        <span>${this.enemiesKilled}</span>
                    </div>
                </div>
                <button class="menu-button" onclick="game.showFreePlayModes()">${languageSystem.t('PLAY ANOTHER')}</button>
                <button class="menu-button" onclick="game.backToMenu()">${languageSystem.t('MAIN MENU')}</button>
            </div>
        `;

        // Insert the replay complete screen
        const container = document.getElementById('gameContainer');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = replayHTML;
        container.appendChild(tempDiv.firstElementChild);

        // Remove after navigation
        setTimeout(() => {
            const screen = document.getElementById('replayComplete');
            if (screen) screen.remove();
        }, 30000);
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
        // Update profile stats for victory
        const time = Math.floor((Date.now() - this.gameStartTime) / 1000);
        profileManager.updateStats({
            totalGamesPlayed: 1,
            totalScore: this.score,
            totalCreditsEarned: this.credits,
            totalEnemiesKilled: this.enemiesKilled,
            totalPlayTime: time
        });
        profileManager.setStatIfHigher('highestLevel', 10);

        this.saveHighScore(this.score);

        // Mark game as completed for free play
        this.completedLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        if (profileManager.getCurrentProfile()) {
            profileManager.saveGameProgress({
                completedLevels: this.completedLevels
            });
        }

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        this.screenManager.showVictory(this.score, this.credits, timeString);
    }

    retryLevel() {
        this.screenManager.hideScreen('gameOver');

        // Restore to the failed level, not level 1
        this.level = this.failedLevel || 1;

        // Restore score and credits from the start of the failed level
        this.score = this.failedLevelScore || 0;
        this.credits = this.failedLevelCredits || 500;

        // Don't reset upgrades - player keeps them for retry
        // this.upgradeSystem.reset(); // Removed to keep upgrades

        // Show upgrade screen first, like a new level
        this.showUpgradeScreen();
    }

    updateHUD() {
        this.screenManager.updateHUD(this.player, this.score, this.credits, this.level);

        // Update weapon HUD
        this.screenManager.updateWeaponHUD(
            this.weaponSystem.weapons,
            this.weaponSystem.unlockedWeapons,
            this.weaponSystem.currentWeaponIndex
        );

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
        this.updateFamilyHUD();
    }

    updateFamilyHUD() {
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

        // Also update hunger if displayed anywhere during gameplay
        const hungerInfo = document.getElementById('hudFamilyHunger');
        if (hungerInfo) {
            const hungerPercent = Math.round(status.hunger);
            const hungerColor = status.hunger >= 70 ? '#66ff66' :
                               status.hunger >= 40 ? '#ffff66' :
                               status.hunger >= 20 ? '#ff9933' : '#ff3333';
            hungerInfo.textContent = `${status.hungerStatus} (${hungerPercent}%)`;
            hungerInfo.style.color = hungerColor;
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

            // Pause music when game is paused
            this.pauseMusic();

            // Gather game stats
            const gameStats = {
                level: this.level,
                score: this.score,
                credits: this.credits,
                enemiesKilled: this.enemiesKilled
            };

            // Get player stats
            const achievementBonuses = this.achievementSystem.getTotalBonuses();
            const playerStats = this.upgradeSystem.getPlayerStats(achievementBonuses);

            // Get upgrade levels
            const upgrades = this.upgradeSystem.upgrades;

            // Get weapon list
            const weapons = this.weaponSystem ? this.weaponSystem.weapons : [];
            const unlockedWeapons = this.weaponSystem ? this.weaponSystem.unlockedWeapons : [];
            const currentWeaponIndex = this.weaponSystem ? this.weaponSystem.currentWeaponIndex : 0;

            // Get family stats
            const familyStatus = this.familyWelfare.getStatus();
            const moraleModifiers = formulaService.getMoraleModifiers(familyStatus.morale);

            this.screenManager.showPauseMenu(gameStats, playerStats, upgrades, weapons, unlockedWeapons, currentWeaponIndex, familyStatus, moraleModifiers);
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

        // Resume music when game is unpaused
        this.resumeMusic();
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
        document.getElementById('weaponHUDPosition').value = this.weaponHUDPosition;

        // Set volume sliders
        document.getElementById('musicVolume').value = Math.round(this.musicVolume * 100);
        document.getElementById('sfxVolume').value = Math.round(this.sfxVolume * 100);

        // Update volume display labels
        document.getElementById('musicVolumeValue').textContent = Math.round(this.musicVolume * 100) + '%';
        document.getElementById('sfxVolumeValue').textContent = Math.round(this.sfxVolume * 100) + '%';
    }

    saveOptions() {
        this.controlMode = document.getElementById('controlMode').value;
        this.autoFire = document.getElementById('autoFire').checked;
        this.weaponHUDPosition = document.getElementById('weaponHUDPosition').value;

        // Apply weapon HUD position immediately
        this.screenManager.setWeaponHUDPosition(this.weaponHUDPosition);

        // Get and apply volume settings
        const musicVolumeValue = document.getElementById('musicVolume').value / 100;
        const sfxVolumeValue = document.getElementById('sfxVolume').value / 100;

        this.setMusicVolume(musicVolumeValue);
        this.setSFXVolume(sfxVolumeValue);

        profileManager.saveOptions({
            controlMode: this.controlMode,
            autoFire: this.autoFire,
            weaponHUDPosition: this.weaponHUDPosition,
            sfxVolume: sfxVolumeValue,
            musicVolume: musicVolumeValue,
            language: languageSystem.currentLanguage
        });

        this.backToMenu();
    }

    showRecords() {
        this.screenManager.showHighScores(this.highScores);
    }

    showCredits() {
        this.screenManager.showScreen('creditsScreen');
    }

    exitToStart() {
        // Stop music
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
        }

        // Hide all screens
        this.screenManager.hideAllScreens();

        // Show start screen
        const startScreen = document.getElementById('startScreen');
        if (startScreen) {
            startScreen.style.display = 'flex';
            startScreen.classList.remove('hidden');
        }

        // Reset game state if in progress
        if (this.gameState === 'playing') {
            this.gameState = 'menu';
            this.isPaused = false;
        }
    }

    showAchievements() {
        this.achievementUI.showAchievementScreen();
    }

    showSaves() {
        this.screenManager.showScreen('savesScreen');
        this.refreshSavesList();
    }

    refreshSavesList() {
        const savesList = document.getElementById('savesList');
        if (!savesList) return;

        const profile = profileManager.getCurrentProfile();
        if (!profile) {
            savesList.innerHTML = '<p style="text-align: center; color: #999;">No profile selected</p>';
            return;
        }

        // Get all saves for current profile
        const saves = this.getAllSaves();

        if (saves.length === 0) {
            savesList.innerHTML = '<p style="text-align: center; color: #999;">' + languageSystem.t('No saves yet') + '</p>';
            return;
        }

        savesList.innerHTML = '';

        saves.forEach((save, index) => {
            const card = document.createElement('div');
            card.className = save.isAutosave ? 'save-card autosave' : 'save-card';

            const saveDate = new Date(save.timestamp);
            const formattedDate = saveDate.toLocaleString();

            card.innerHTML = `
                <div class="save-info">
                    <div class="save-name">
                        ${save.isAutosave ? '⚡ ' + languageSystem.t('AUTOSAVE') : '💾 ' + languageSystem.t('Save') + ' ' + (index + 1)}
                    </div>
                    <div class="save-date">${formattedDate}</div>
                </div>
                <div class="save-stats">
                    <div class="save-stat">📍 ${languageSystem.t('Level')} ${save.level}</div>
                    <div class="save-stat">⭐ ${languageSystem.t('Score')} ${save.score}</div>
                    <div class="save-stat">💰 ${save.credits} ${languageSystem.t('credits')}</div>
                    <div class="save-stat">⚔️ ${save.enemiesKilled || 0} ${languageSystem.t('kills')}</div>
                </div>
                <div class="save-actions">
                    <button class="save-action-btn load" onclick="game.loadSaveSlot(${index})">${languageSystem.t('LOAD')}</button>
                    <button class="save-action-btn delete" onclick="game.deleteSaveSlot(${index})">${languageSystem.t('DELETE')}</button>
                </div>
            `;

            savesList.appendChild(card);
        });
    }

    getAllSaves() {
        const profile = profileManager.getCurrentProfile();
        if (!profile) return [];

        // Get saves from localStorage
        const savesKey = `spaceShooter_saves_${profile.id}`;
        const savesData = localStorage.getItem(savesKey);

        if (!savesData) return [];

        try {
            const saves = JSON.parse(savesData);
            // Sort by timestamp, newest first
            return saves.sort((a, b) => b.timestamp - a.timestamp);
        } catch (e) {
            console.error('Failed to load saves:', e);
            return [];
        }
    }

    createManualSave() {
        // Alias for createNewSave to match HTML button onclick
        this.createNewSave();
    }

    createNewSave() {
        const profile = profileManager.getCurrentProfile();
        if (!profile) {
            this.dialogSystem.showQuickMessage(languageSystem.t('Please select a profile first'));
            return;
        }

        // Check if we have any game progress to save
        if (this.level <= 1 && this.score === 0 && this.credits <= 500) {
            this.dialogSystem.showQuickMessage(languageSystem.t('No game progress to save'));
            return;
        }

        // Create save data
        const saveData = {
            timestamp: Date.now(),
            isAutosave: false,
            level: this.level,
            score: this.score,
            credits: this.credits,
            enemiesKilled: this.enemiesKilled,
            // Store the entire game state
            upgrades: this.upgradeSystem.upgrades,
            weapons: {
                unlockedWeapons: this.weaponSystem.unlockedWeapons,
                currentWeaponIndex: this.weaponSystem.currentWeaponIndex,
                ammo: this.weaponSystem.weapons.map(w => w.ammo)
            },
            familyWelfare: this.familyWelfare.getFullState(),
            completedLevels: this.completedLevels,
            masterModeEnabled: this.masterModeEnabled
        };

        // Get existing saves
        const savesKey = `spaceShooter_saves_${profile.id}`;
        let saves = [];

        try {
            const existingSaves = localStorage.getItem(savesKey);
            if (existingSaves) {
                saves = JSON.parse(existingSaves);
            }
        } catch (e) {
            console.error('Failed to load existing saves:', e);
        }

        // Add new save (limit to 10 saves)
        saves.unshift(saveData);
        if (saves.length > 10) {
            saves = saves.slice(0, 10);
        }

        // Save to localStorage
        try {
            localStorage.setItem(savesKey, JSON.stringify(saves));
            this.dialogSystem.showQuickMessage(languageSystem.t('Game saved successfully!'));
            this.refreshSavesList();
        } catch (e) {
            console.error('Failed to save game:', e);
            this.dialogSystem.showQuickMessage(languageSystem.t('Failed to save game'));
        }
    }

    loadSaveSlot(index) {
        const saves = this.getAllSaves();
        if (index >= 0 && index < saves.length) {
            const save = saves[index];
            this.loadSaveData(save);
            this.screenManager.hideScreen('savesScreen');
            this.screenManager.showScreen('upgradeScreen');
            this.showUpgradeScreen();
            this.dialogSystem.showQuickMessage(languageSystem.t('Game loaded successfully!'));
        }
    }

    loadSaveData(saveData) {
        // Restore game state
        this.level = saveData.level || 1;
        this.score = saveData.score || 0;
        this.credits = saveData.credits || 500;
        this.enemiesKilled = saveData.enemiesKilled || 0;

        // Restore upgrades
        if (saveData.upgrades) {
            this.upgradeSystem.upgrades = saveData.upgrades;
        }

        // Restore weapons
        if (saveData.weapons) {
            this.weaponSystem.unlockedWeapons = saveData.weapons.unlockedWeapons;
            this.weaponSystem.currentWeaponIndex = saveData.weapons.currentWeaponIndex;
            // Restore ammo
            if (saveData.weapons.ammo) {
                saveData.weapons.ammo.forEach((ammo, i) => {
                    if (this.weaponSystem.weapons[i]) {
                        this.weaponSystem.weapons[i].ammo = ammo;
                    }
                });
            }
        }

        // Restore family welfare
        if (saveData.familyWelfare) {
            this.familyWelfare.loadState(saveData.familyWelfare);
        }

        // Restore completed levels
        if (saveData.completedLevels) {
            this.completedLevels = saveData.completedLevels;
        }

        // Restore master mode
        this.masterModeEnabled = saveData.masterModeEnabled || false;
    }

    deleteSaveSlot(index) {
        if (!confirm(languageSystem.t('Are you sure you want to delete this save?'))) {
            return;
        }

        const profile = profileManager.getCurrentProfile();
        if (!profile) return;

        const savesKey = `spaceShooter_saves_${profile.id}`;
        let saves = this.getAllSaves();

        if (index >= 0 && index < saves.length) {
            saves.splice(index, 1);

            try {
                localStorage.setItem(savesKey, JSON.stringify(saves));
                this.dialogSystem.showQuickMessage(languageSystem.t('Save deleted'));
                this.refreshSavesList();
            } catch (e) {
                console.error('Failed to delete save:', e);
            }
        }
    }

    createAutosave() {
        const profile = profileManager.getCurrentProfile();
        if (!profile) return;

        // Create autosave data
        const saveData = {
            timestamp: Date.now(),
            isAutosave: true,
            level: this.level,
            score: this.score,
            credits: this.credits,
            enemiesKilled: this.enemiesKilled,
            upgrades: this.upgradeSystem.upgrades,
            weapons: {
                unlockedWeapons: this.weaponSystem.unlockedWeapons,
                currentWeaponIndex: this.weaponSystem.currentWeaponIndex,
                ammo: this.weaponSystem.weapons.map(w => w.ammo)
            },
            familyWelfare: this.familyWelfare.getFullState(),
            completedLevels: this.completedLevels,
            masterModeEnabled: this.masterModeEnabled
        };

        const savesKey = `spaceShooter_saves_${profile.id}`;
        let saves = [];

        try {
            const existingSaves = localStorage.getItem(savesKey);
            if (existingSaves) {
                saves = JSON.parse(existingSaves);
            }
        } catch (e) {
            console.error('Failed to load existing saves:', e);
        }

        // Remove old autosave if exists
        saves = saves.filter(s => !s.isAutosave);

        // Add new autosave at the beginning
        saves.unshift(saveData);

        // Limit total saves to 10
        if (saves.length > 10) {
            saves = saves.slice(0, 10);
        }

        try {
            localStorage.setItem(savesKey, JSON.stringify(saves));
            console.log('Autosave created');
        } catch (e) {
            console.error('Failed to create autosave:', e);
        }
    }

    backToMenu() {
        this.screenManager.hideAllScreens();
        this.screenManager.showScreen('mainMenu');
        languageSystem.updateAllTexts();
    }

    changeLanguage(lang) {
        this.language = lang;
        languageSystem.setLanguage(lang);

        // Save language preference to profile
        profileManager.saveOptions({
            controlMode: this.controlMode,
            autoFire: this.autoFire,
            sfxVolume: document.getElementById('sfxVolume')?.value || 50,
            musicVolume: document.getElementById('musicVolume')?.value || 50,
            language: lang
        });
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

        // Update family UI if visible
        const familyMoraleEl = document.getElementById('familyMorale');
        if (familyMoraleEl) {
            this.updateFamilyUI();
        }

        // Update HUD if visible
        if (this.isPlaying) {
            this.updateFamilyHUD();
        }

        // Update achievement notifications if any are showing
        if (this.achievementUI) {
            // Achievements will re-fetch translations when displayed
        }

        // Update pause menu if visible
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu && pauseMenu.classList.contains('active')) {
            // Refresh pause menu with current translations
            const achievementBonuses = this.achievementSystem.getTotalBonuses();
            const stats = this.upgradeSystem.getPlayerStats(achievementBonuses);
            const familyStatus = this.familyWelfare.getStatus();
            const moraleModifiers = formulaService.getMoraleModifiers(familyStatus.morale);
            this.screenManager.showPauseMenu(
                {
                    level: this.level,
                    score: this.score,
                    credits: this.credits,
                    enemiesKilled: this.enemiesKilled
                },
                stats,
                this.upgradeSystem.upgrades,
                this.weaponSystem.weapons,
                this.weaponSystem.unlockedWeapons,
                this.weaponSystem.currentWeaponIndex,
                familyStatus,
                moraleModifiers
            );
        }
    }

    saveHighScore(score) {
        profileManager.saveHighScore(score);
        this.highScores = profileManager.getHighScores();
    }

    loadOptions() {
        const options = profileManager.loadOptions();
        if (options) {
            this.controlMode = options.controlMode || 'touch';
            this.autoFire = options.autoFire !== undefined ? options.autoFire : true;
            this.weaponHUDPosition = options.weaponHUDPosition || 'bottom';

            // Load audio settings
            this.musicVolume = options.musicVolume !== undefined ? options.musicVolume : 0.5;
            this.sfxVolume = options.sfxVolume !== undefined ? options.sfxVolume : 0.7;

            // Apply music volume
            this.setMusicVolume(this.musicVolume);
            this.setSFXVolume(this.sfxVolume);

            // Apply weapon HUD position
            this.screenManager.setWeaponHUDPosition(this.weaponHUDPosition);

            // Apply language from profile
            if (options.language) {
                languageSystem.setLanguage(options.language);
            }
        }
    }

    // Save game progress (only available in Space Hub)
    saveProgress() {
        // Check if there's a current profile first
        if (!profileManager.getCurrentProfile()) {
            console.warn('No profile available to save progress');
            return;
        }

        const saveData = {
            level: this.level,  // Save the current level (already incremented in levelComplete)
            score: this.score,
            credits: this.credits,
            upgrades: this.upgradeSystem.upgrades,
            weapons: this.weaponSystem.saveState(),
            familyWelfare: this.familyWelfare.saveState(),
            completedLevels: this.completedLevels,
            timestamp: Date.now(),
            version: '1.0'
        };

        profileManager.saveGameProgress(saveData);

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
        const saveData = profileManager.loadGameProgress();
        if (!saveData) {
            return false;
        }

        try {
            // saveData is already an object, no need to parse
            // Restore game state
            this.level = saveData.level || 1;
            this.score = saveData.score || 0;
            this.credits = saveData.credits || 500;

            // Restore upgrades (handles migration from speed to critChance)
            if (saveData.upgrades) {
                this.upgradeSystem.loadState(saveData.upgrades);
            }

            // Restore weapon state
            if (saveData.weapons) {
                this.weaponSystem.loadState(saveData.weapons);
            }

            // Restore family welfare
            if (saveData.familyWelfare) {
                this.familyWelfare.loadState(saveData.familyWelfare);
            }

            // Restore completed levels
            if (saveData.completedLevels) {
                this.completedLevels = saveData.completedLevels;
            }

            // Restore master mode preference
            const options = profileManager.loadOptions();
            if (options && options.masterModeEnabled !== undefined) {
                this.masterModeEnabled = options.masterModeEnabled;
            }

            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }

    // Check if save exists
    hasSaveGame() {
        return profileManager.hasGameProgress();
    }

    // Start from saved game
    continueGame() {
        const profile = profileManager.getCurrentProfile();
        let loaded = false;

        // First try to load autosave from new save system
        if (profile) {
            const saves = this.getAllSaves();
            const autosave = saves.find(s => s.isAutosave);

            if (autosave) {
                this.loadSaveData(autosave);
                loaded = true;
            }
        }

        // Fall back to old save system if no autosave
        if (!loaded) {
            loaded = this.loadProgress();
        }

        if (loaded) {
            this.screenManager.hideScreen('mainMenu');
            // Show upgrade screen first when loading a saved game
            this.showUpgradeScreen();
        }
    }

    updateUpgradesTab() {
        // Re-render just the upgrades grid without switching tabs
        const upgradeGrid = document.getElementById('upgradeGrid');
        if (!upgradeGrid) return;

        upgradeGrid.innerHTML = '';
        const upgrades = this.upgradeSystem.getAllUpgrades();

        upgrades.forEach(upgrade => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';

            card.innerHTML = `
                <div class="upgrade-title">${upgrade.icon} ${languageSystem.t(upgrade.name)}</div>
                <div class="upgrade-info">
                    <span>${languageSystem.t('Level')} ${upgrade.level}/${upgrade.maxLevel}</span>
                </div>
                <div style="color: #aaa; font-size: 14px; margin: 10px 0;">${languageSystem.t(upgrade.description)}</div>
                <div class="upgrade-info">
                    <span>${languageSystem.t('Cost:')} ${upgrade.cost} ${languageSystem.t('credits')}</span>
                </div>
                <button class="upgrade-button" ${upgrade.level >= upgrade.maxLevel || this.credits < upgrade.cost ? 'disabled' : ''}
                        data-upgrade-type="${upgrade.type}">
                    ${upgrade.level >= upgrade.maxLevel ? languageSystem.t('MAX') : languageSystem.t('UPGRADE')}
                </button>
            `;

            const button = card.querySelector('.upgrade-button');
            if (button && !button.disabled) {
                button.addEventListener('click', () => this.purchaseUpgrade(upgrade.type));
            }

            upgradeGrid.appendChild(card);
        });
    }

    // Tab switching in Space Hub
    switchTab(tabName) {
        // Hide all tab contents
        document.getElementById('familyTabContent').style.display = 'none';
        document.getElementById('missionsTabContent').style.display = 'none';
        document.getElementById('upgradesTabContent').style.display = 'none';

        // Reset all tab buttons
        document.getElementById('familyTab').style.background = 'rgba(255,255,255,0.1)';
        document.getElementById('familyTab').style.color = '#fff';
        document.getElementById('missionsTab').style.background = 'rgba(255,255,255,0.1)';
        document.getElementById('missionsTab').style.color = '#fff';
        document.getElementById('upgradesTab').style.background = 'rgba(255,255,255,0.1)';
        document.getElementById('upgradesTab').style.color = '#fff';

        // Show selected tab and highlight button
        switch(tabName) {
            case 'family':
                document.getElementById('familyTabContent').style.display = 'block';
                document.getElementById('familyTab').style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                document.getElementById('familyTab').style.color = '#000';
                break;
            case 'missions':
                document.getElementById('missionsTabContent').style.display = 'block';
                document.getElementById('missionsTab').style.background = 'linear-gradient(135deg, #66ffff, #4488ff)';
                document.getElementById('missionsTab').style.color = '#000';
                this.updateMissionsTab();
                break;
            case 'upgrades':
                document.getElementById('upgradesTabContent').style.display = 'block';
                document.getElementById('upgradesTab').style.background = 'linear-gradient(135deg, #66ff66, #44ff44)';
                document.getElementById('upgradesTab').style.color = '#000';
                // Update credits display
                const creditsEl = document.getElementById('creditsDisplay');
                if (creditsEl) creditsEl.textContent = this.credits;
                // Update the upgrades grid
                this.updateUpgradesTab();
                break;
        }
    }

    goToSpaceHubMissions() {
        // Hide victory screen
        this.screenManager.hideScreen('victoryScreen');

        // Show upgrade screen (Space Hub)
        this.screenManager.showScreen('upgradeScreen');

        // Switch to missions tab
        this.switchTab('missions');
    }

    startSurvivalModeFromHub() {
        // Hide Space Hub
        this.screenManager.hideScreen('upgradeScreen');

        // Start survival mode
        this.startSurvivalMode();
    }

    updateMissionsTab() {
        // Load completed levels
        const saveData = profileManager.loadGameProgress();
        if (saveData && saveData.completedLevels) {
            this.completedLevels = saveData.completedLevels;
        }

        // Populate mission replay buttons
        const missionList = document.getElementById('missionReplayListHub');
        if (missionList) {
            missionList.innerHTML = '';

            for (let i = 1; i <= 10; i++) {
                const button = document.createElement('button');
                button.className = 'menu-button';
                button.style.padding = '10px';
                button.style.fontSize = '14px';

                if (this.completedLevels.includes(i) || this.completedLevels.length >= 10) {
                    button.innerHTML = `${languageSystem.t('Level')} ${i}`;
                    button.onclick = () => this.startReplayMissionFromHub(i);
                    button.style.background = 'linear-gradient(135deg, #4488ff, #66aaff)';
                } else {
                    button.innerHTML = '🔒';
                    button.disabled = true;
                    button.style.background = 'rgba(100,100,100,0.3)';
                    button.style.cursor = 'not-allowed';
                }

                missionList.appendChild(button);
            }
        }

        // Update survival high score
        const profile = profileManager.getCurrentProfile();
        const survivalHighScore = (profile && profile.stats && profile.stats.survivalHighScore) || 0;
        const scoreEl = document.getElementById('survivalHighScoreHub');
        if (scoreEl) scoreEl.textContent = survivalHighScore.toLocaleString();

        // Check if Master Mode should be available
        const allAchievementsUnlocked = this.checkAllAchievementsComplete();
        const specialSection = document.getElementById('specialModeSectionHub');
        if (specialSection) {
            if (allAchievementsUnlocked) {
                specialSection.style.display = 'block';
                const toggleBtn = document.getElementById('masterModeToggleHub');
                if (toggleBtn) {
                    if (this.masterModeEnabled) {
                        toggleBtn.innerHTML = '<span>✨ </span><span>' + languageSystem.t('MASTER MODE ACTIVE') + '</span>';
                        toggleBtn.style.background = 'linear-gradient(135deg, #ffff66, #ff66ff)';
                    } else {
                        toggleBtn.innerHTML = '<span>⭐ </span><span>' + languageSystem.t('ACTIVATE MASTER MODE') + '</span>';
                        toggleBtn.style.background = 'linear-gradient(135deg, #ff66ff, #ffff66)';
                    }
                }
            } else {
                specialSection.style.display = 'none';
            }
        }
    }

    startReplayMissionFromHub(level) {
        // Hide Space Hub
        this.screenManager.hideScreen('upgradeScreen');

        // Start replay mission
        this.startReplayMission(level);
    }

    // Free Play Mode Functions (deprecated, redirects to Space Hub)
    showFreePlayModes() {
        this.goToSpaceHubMissions();
    }

    closeFreePlay() {
        // Deprecated - no longer needed
    }

    startReplayMission(level) {
        this.gameMode = 'replay';
        this.level = level;
        this.score = 0;
        this.credits = 1000; // Start with some credits

        // Reset level-specific things
        this.enemiesKilled = 0;
        this.currentWave = 1;
        this.waveTimer = 0;
        this.enemySpawnDelay = 120; // 2 seconds delay
        this.enemiesPerWave = 10 + level * 2;

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
        this.gameLoopRunning = false;

        // Initialize session stats for replay mode
        this.sessionStats = {
            levelStartTime: Date.now(),
            gameStartTime: Date.now(),
            lastSurvivalUpdate: Date.now()
        };

        // Hide free play screen and start the level
        this.screenManager.hideScreen('freePlayScreen');
        this.screenManager.hideScreen('victoryScreen');

        // Initialize player with current upgrades
        this.player = new Player(this.canvas, this.upgradeSystem.upgrades, this.weaponSystem);

        // Initialize weapon HUD
        this.screenManager.initWeaponHUD(this.weaponSystem.weapons);
        this.screenManager.updateWeaponHUD(
            this.weaponSystem.weapons,
            this.weaponSystem.unlockedWeapons,
            this.weaponSystem.currentWeaponIndex
        );

        // Directly start playing without dialog
        this.isPlaying = true;
        this.isPaused = false;

        // Show HUD
        this.screenManager.showHUD();

        // Show level announcement
        this.dialogSystem.showQuickMessage(`${languageSystem.t('Level')} ${this.level}`, 2000);

        // Start game loop
        if (!this.gameLoopRunning) {
            this.gameLoop();
        }
    }

    startSurvivalMode() {
        this.gameMode = 'survival';
        this.level = 1; // Used for difficulty scaling
        this.survivalWave = 14; // Start at wave 15 (will increment to 15 in startSurvivalWave)
        this.score = 0;
        this.credits = 0; // Start with 0 credits in survival
        this.survivalStartTime = Date.now();

        // Initialize session stats for survival mode
        this.sessionStats = {
            levelStartTime: Date.now(),
            gameStartTime: Date.now(),
            lastSurvivalUpdate: Date.now()
        };

        // Hide screens
        this.screenManager.hideScreen('freePlayScreen');
        this.screenManager.hideScreen('victoryScreen');

        // Initialize player with current upgrades
        this.player = new Player(this.canvas, this.upgradeSystem.upgrades, this.weaponSystem);

        // Initialize weapon HUD
        this.screenManager.initWeaponHUD(this.weaponSystem.weapons);
        this.screenManager.updateWeaponHUD(
            this.weaponSystem.weapons,
            this.weaponSystem.unlockedWeapons,
            this.weaponSystem.currentWeaponIndex
        );

        // Start survival mode
        this.startSurvivalWave();
    }

    startSurvivalWave() {
        this.survivalWave++;
        this.enemiesKilled = 0;
        this.waveTimer = 0;
        this.currentWave = 1;
        this.enemySpawnDelay = 60; // Small delay before enemies appear
        this.survivalSpawnTimer = 0;
        this.enemiesSpawned = 0;

        // Clear existing entities
        this.enemies = [];
        this.hunters = [];
        this.projectiles = [];
        this.powerUps = [];
        this.asteroids = [];
        this.boss = null;
        this.bossActive = false;
        this.huntersDefeated = true; // Start as true
        this.bossDefeated = true; // Start as true

        // Calculate difficulty scaling - MUCH FASTER SCALING
        const difficultyMultiplier = 1 + (this.survivalWave * 0.25); // 25% harder each wave (was 10%)

        // Determine enemies for this wave - exponential growth
        const baseEnemies = 10 + Math.floor(this.survivalWave * 3); // More base enemies
        this.enemiesPerWave = Math.floor(baseEnemies * difficultyMultiplier);

        // Calculate spawn groups - enemies spawn in massive groups every 3 seconds
        this.enemiesPerSpawnGroup = Math.min(5 + Math.floor(this.survivalWave * 1.5), 25); // 5-25 enemies at once
        this.spawnInterval = 180; // 3 seconds between spawn groups (at 60 FPS)

        // Add hunters after wave 5
        if (this.survivalWave > 5 && this.survivalWave % 3 === 0) {
            this.huntersDefeated = false;
            // Reset all hunter spawn flags for multiple spawns
            this.huntersSpawned25 = false;
            this.huntersSpawned50 = false;
            this.huntersSpawned75 = false;
            this.huntersSpawned95 = false;
        }

        // Add boss every 10 waves
        if (this.survivalWave % 10 === 0) {
            this.bossDefeated = false;
        }

        this.isPlaying = true;
        this.isPaused = false;

        // Show HUD
        this.screenManager.showHUD();

        // Show wave announcement as a non-blocking notification
        const waveNotification = document.createElement('div');
        waveNotification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #004488, #0088ff);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 32px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
            pointer-events: none;
        `;
        waveNotification.textContent = `${languageSystem.t('Wave')} ${this.survivalWave}!`;
        document.body.appendChild(waveNotification);
        setTimeout(() => waveNotification.remove(), 2000);

        // Start game loop if not already running
        if (!this.gameLoopRunning) {
            this.gameLoop();
        }
    }

    toggleMasterMode() {
        this.masterModeEnabled = !this.masterModeEnabled;

        const toggleBtn = document.getElementById('masterModeToggle');
        if (this.masterModeEnabled) {
            toggleBtn.innerHTML = '<span>✨ </span><span>' + languageSystem.t('MASTER MODE ACTIVE') + '</span>';
            toggleBtn.style.background = 'linear-gradient(135deg, #ffff66, #ff66ff)';
            this.dialogSystem.showQuickMessage(languageSystem.t('Master Mode Activated! Unlimited special weapons!'), 3000);
        } else {
            toggleBtn.innerHTML = '<span>⭐ </span><span>' + languageSystem.t('ACTIVATE MASTER MODE') + '</span>';
            toggleBtn.style.background = 'linear-gradient(135deg, #ff66ff, #ffff66)';
            this.dialogSystem.showQuickMessage(languageSystem.t('Master Mode Deactivated'), 2000);
        }

        // Save master mode preference
        profileManager.saveOptions({
            masterModeEnabled: this.masterModeEnabled
        });
    }

    checkAllAchievementsComplete() {
        // Get all achievements and check if all are unlocked
        const achievements = this.achievementSystem.getAllAchievements();
        let totalRequired = 0;
        let totalUnlocked = 0;

        for (const achievement of achievements) {
            totalRequired += achievement.tiers.length;
            const progress = this.achievementSystem.getProgress(achievement.id);
            if (progress) {
                totalUnlocked += progress.unlockedTiers.length;
            }
        }

        // If all achievements are complete, unlock the special Master achievement
        if (totalUnlocked >= totalRequired && totalRequired > 0) {
            // Check if Master achievement exists, if not create it
            if (!this.achievementSystem.getProgress('masterOfSpace')) {
                this.achievementSystem.unlockMasterAchievement();
            }
            return true;
        }

        return false;
    }

    endSurvivalMode() {
        this.isPlaying = false;

        // Calculate survival time
        const survivalTime = Math.floor((Date.now() - this.survivalStartTime) / 1000);
        const minutes = Math.floor(survivalTime / 60);
        const seconds = survivalTime % 60;

        // Update high score
        const profile = profileManager.getCurrentProfile();
        const currentHighScore = (profile && profile.stats && profile.stats.survivalHighScore) || 0;
        if (this.score > currentHighScore) {
            profileManager.updateStats({
                survivalHighScore: this.score
            });
        }

        // Calculate rewards based on waves survived
        const creditReward = this.survivalWave * 100;
        this.credits += creditReward;

        // Show game over with survival stats
        this.screenManager.hideHUD();
        const survivalStats = {
            mode: 'Survival',
            wavesCompleted: this.survivalWave - 1,
            survivalTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            score: this.score,
            credits: creditReward,
            isHighScore: this.score > currentHighScore
        };

        this.showSurvivalResults(survivalStats);
    }

    showSurvivalResults(stats) {
        // Hide all screens first
        this.screenManager.hideAllScreens();

        // Create a custom survival results screen
        const resultsHTML = `
            <div class="screen active" id="survivalResults" style="text-align: center; padding: 50px;">
                <h2 style="font-size: 48px; margin-bottom: 30px; color: #ff9966;">${languageSystem.t('SURVIVAL MODE COMPLETE')}</h2>
                ${stats.isHighScore ? '<p style="color: #ffff66; font-size: 24px;">🏆 ' + languageSystem.t('NEW HIGH SCORE!') + ' 🏆</p>' : ''}
                <div class="game-over-stats">
                    <div class="stat-row">
                        <span>${languageSystem.t('Waves Survived:')}</span>
                        <span>${stats.wavesCompleted}</span>
                    </div>
                    <div class="stat-row">
                        <span>${languageSystem.t('Survival Time:')}</span>
                        <span>${stats.survivalTime}</span>
                    </div>
                    <div class="stat-row">
                        <span>${languageSystem.t('Score:')}</span>
                        <span>${stats.score.toLocaleString()}</span>
                    </div>
                    <div class="stat-row">
                        <span>${languageSystem.t('Credits Earned:')}</span>
                        <span>${stats.credits}</span>
                    </div>
                </div>
                <button class="menu-button" onclick="game.returnToSpaceHubFromSurvival()">${languageSystem.t('SPACE HUB')}</button>
                <button class="menu-button" onclick="game.startSurvivalModeAgain()">${languageSystem.t('PLAY AGAIN')}</button>
                <button class="menu-button" onclick="game.backToMenuFromSurvival()">${languageSystem.t('MAIN MENU')}</button>
            </div>
        `;

        // Insert the results screen
        const container = document.getElementById('gameContainer');
        // Remove any existing survival results first
        const existingResults = document.getElementById('survivalResults');
        if (existingResults) {
            existingResults.remove();
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = resultsHTML;
        container.appendChild(tempDiv.firstElementChild);
    }

    returnToSpaceHubFromSurvival() {
        const resultsScreen = document.getElementById('survivalResults');
        if (resultsScreen) {
            resultsScreen.remove();
        }
        // Reset game mode
        this.gameMode = 'campaign';
        // Show Space Hub and go to missions tab
        this.screenManager.showScreen('upgradeScreen');
        this.switchTab('missions');
    }

    startSurvivalModeAgain() {
        const resultsScreen = document.getElementById('survivalResults');
        if (resultsScreen) {
            resultsScreen.remove();
        }
        this.startSurvivalMode();
    }

    backToMenuFromSurvival() {
        const resultsScreen = document.getElementById('survivalResults');
        if (resultsScreen) {
            resultsScreen.remove();
        }
        // Reset game mode
        this.gameMode = 'campaign';
        this.backToMenu();
    }
}

// Make game globally accessible for HTML onclick handlers
window.game = new SpaceShooterGame();

// Debug helper to reset profiles if corrupted
window.resetProfiles = () => {
    if (confirm('This will delete ALL profiles. Are you sure?')) {
        profileManager.resetAllProfiles();
        location.reload();
    }
};

// Debug cheat system - Press '\' twice quickly to unlock everything and skip to victory
let debugKeyPresses = [];
let debugKeyTimeout = null;

document.addEventListener('keydown', (e) => {
    // Listen for backslash key anywhere in the game
    if (e.key === '\\') {
        debugKeyPresses.push(Date.now());

        // Clear old keypresses
        debugKeyPresses = debugKeyPresses.filter(time => Date.now() - time < 500);

        // Check if pressed twice within 500ms
        if (debugKeyPresses.length >= 2) {
            debugKeyPresses = [];

            // CHEAT ACTIVATED - Unlock everything!
            console.log('🎮 DEBUG CHEAT ACTIVATED - Unlocking everything and starting test mode!');

            // Mark all levels as completed
            game.completedLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            // Unlock all achievements
            const achievements = game.achievementSystem.getAllAchievements();
            achievements.forEach(achievement => {
                if (achievement.tiers) {
                    achievement.tiers.forEach((tier, index) => {
                        game.achievementSystem.progress[achievement.id] = {
                            unlockedTiers: achievement.tiers.map((_, i) => i),
                            currentValue: tier.required
                        };
                    });
                }
            });

            // Unlock Master achievement
            game.achievementSystem.unlockMasterAchievement();

            // Don't max upgrades - let player earn them

            // Unlock all weapons
            game.weaponSystem.unlockedWeapons = [true, true, true, true, true, true, true, true, true, true, true];

            // Give tons of credits and high scores
            game.credits = 999999;
            game.score = 999999;

            // Set high survival score and stats
            profileManager.updateStats({
                survivalHighScore: 99999,
                highestLevel: 10,
                totalGamesPlayed: 100,
                totalScore: 999999,
                totalCreditsEarned: 999999,
                totalEnemiesKilled: 9999
            });

            // Save everything
            game.saveProgress();
            profileManager.saveAchievementProgress(game.achievementSystem.progress);

            // Show notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ff00ff, #00ffff);
                color: white;
                padding: 30px 50px;
                border-radius: 20px;
                font-size: 24px;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 0 50px rgba(255,0,255,0.8);
                animation: pulse 0.5s ease-in-out 3;
            `;
            notification.innerHTML = '🎮 CHEAT MODE ACTIVATED! 🎮<br><span style="font-size: 16px;">Everything unlocked! Starting test mode...</span>';
            document.body.appendChild(notification);

            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);

            // After showing notification, just close it
            setTimeout(() => {
                notification.remove();
                style.remove();

                // Show success message in console
                console.log('✅ All content unlocked! You can now:');
                console.log('- Access FREE PLAY from victory screen');
                console.log('- Play any mission with max upgrades');
                console.log('- Use Master Mode with infinite ammo');
                console.log('- All achievements completed');
            }, 3000);
        }
    }
});