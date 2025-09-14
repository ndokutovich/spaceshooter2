class ScreenManager {
    constructor() {
        this.currentScreen = 'platformLogo';
        this.screens = [
            'platformLogo', 'vendorLogo', 'gameLogo', 'mainMenu',
            'optionsScreen', 'recordsScreen', 'creditsScreen',
            'upgradeScreen', 'gameOver', 'victoryScreen', 'pauseMenu'
        ];
    }

    showScreen(screenId) {
        this.screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                element.classList.remove('active');
            }
        });

        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;

            // Show/hide continue button if showing main menu
            if (screenId === 'mainMenu') {
                const continueBtn = document.getElementById('continueBtn');
                if (continueBtn) {
                    const saveData = localStorage.getItem('spaceShooterSave');
                    if (saveData) {
                        try {
                            const save = JSON.parse(saveData);
                            continueBtn.innerHTML = `${languageSystem.t('CONTINUE')}<br><span style="font-size: 14px; opacity: 0.7;">${languageSystem.t('Level')} ${save.level} • ${languageSystem.t('Score:').slice(0, -1)}: ${save.score}</span>`;
                            continueBtn.style.display = 'block';
                        } catch (e) {
                            continueBtn.style.display = 'none';
                        }
                    } else {
                        continueBtn.style.display = 'none';
                    }
                }
            }
        }
    }

    hideScreen(screenId) {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('active');
        }
    }

    hideAllScreens() {
        this.screens.forEach(screen => {
            this.hideScreen(screen);
        });
    }

    async showLogoSequence() {
        return new Promise((resolve) => {
            let currentTimeout1, currentTimeout2;
            let skipped = false;

            // Skip handler - works on any screen
            const skipHandler = () => {
                if (skipped) return;
                skipped = true;

                // Clear any pending timeouts
                if (currentTimeout1) clearTimeout(currentTimeout1);
                if (currentTimeout2) clearTimeout(currentTimeout2);

                // Hide all logo screens
                this.hideScreen('platformLogo');
                this.hideScreen('vendorLogo');
                this.hideScreen('gameLogo');

                // Show main menu
                this.showScreen('mainMenu');

                // Clean up listeners
                document.removeEventListener('click', skipHandler);
                document.removeEventListener('touchstart', skipHandler);
                document.removeEventListener('keydown', skipHandler);

                resolve();
            };

            // Add skip listeners from the start
            document.addEventListener('click', skipHandler);
            document.addEventListener('touchstart', skipHandler);
            document.addEventListener('keydown', skipHandler);

            // Show platform logo
            this.showScreen('platformLogo');

            currentTimeout1 = setTimeout(() => {
                if (skipped) return;
                this.hideScreen('platformLogo');
                this.showScreen('vendorLogo');

                currentTimeout2 = setTimeout(() => {
                    if (skipped) return;
                    this.hideScreen('vendorLogo');
                    this.showScreen('gameLogo');

                    // Auto-advance to menu after a delay if not skipped
                    setTimeout(() => {
                        if (!skipped) {
                            skipHandler();
                        }
                    }, 3000);
                }, 2000);
            }, 2000);
        });
    }

    showUpgradeScreen(credits, level, upgrades, purchaseCallback) {
        this.showScreen('upgradeScreen');
        document.getElementById('creditsDisplay').textContent = credits;
        document.getElementById('nextLevelNum').textContent = level;

        const upgradeGrid = document.getElementById('upgradeGrid');
        upgradeGrid.innerHTML = '';

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
                <button class="upgrade-button" ${upgrade.level >= upgrade.maxLevel || credits < upgrade.cost ? 'disabled' : ''}
                        data-upgrade-type="${upgrade.type}">
                    ${upgrade.level >= upgrade.maxLevel ? languageSystem.t('MAX') : languageSystem.t('UPGRADE')}
                </button>
            `;

            const button = card.querySelector('.upgrade-button');
            if (button && !button.disabled) {
                button.addEventListener('click', () => purchaseCallback(upgrade.type));
            }

            upgradeGrid.appendChild(card);
        });
    }

    showHighScores(scores) {
        this.showScreen('recordsScreen');
        const list = document.getElementById('highScoresList');
        list.innerHTML = '';

        if (scores.length === 0) {
            list.innerHTML = `<p style="text-align: center; color: #999;">${languageSystem.t('No high scores yet!')}</p>`;
        } else {
            scores.forEach((score, index) => {
                const entry = document.createElement('div');
                entry.className = 'score-entry';
                entry.style.cssText = 'display: flex; justify-content: space-between; margin: 10px 0; font-size: 20px;';
                entry.innerHTML = `
                    <span>${index + 1}.</span>
                    <span style="flex: 1; text-align: center; color: #00ffff;">${languageSystem.t('PLAYER')}</span>
                    <span style="color: #ffff00;">${score.toLocaleString()}</span>
                `;
                list.appendChild(entry);
            });
        }
    }

    showGameOver(stats) {
        this.showScreen('gameOver');
        document.getElementById('finalScore').textContent = stats.score.toLocaleString();
        document.getElementById('levelReached').textContent = stats.level;
        document.getElementById('enemiesDestroyed').textContent = stats.enemiesKilled;
        document.getElementById('creditsEarned').textContent = stats.credits;
    }

    showVictory(score, credits, time) {
        this.showScreen('victoryScreen');
        document.getElementById('victoryScore').textContent = score.toLocaleString();
        document.getElementById('victoryCredits').textContent = credits;
        document.getElementById('completionTime').textContent = time;
    }

    updateHUD(player, score, credits, level) {
        if (!player) return;

        // Update health bar
        const healthBar = document.getElementById('healthBar');
        if (healthBar) {
            const healthPercent = (player.health / player.maxHealth) * 100;
            healthBar.style.width = healthPercent + '%';
        }

        // Update shield bar
        const shieldBar = document.getElementById('shieldBar');
        if (shieldBar) {
            const shieldPercent = (player.shield / player.maxShield) * 100;
            shieldBar.style.width = shieldPercent + '%';
        }

        // Update text displays
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = score.toLocaleString();

        const creditsEl = document.getElementById('credits');
        if (creditsEl) creditsEl.textContent = credits;

        const levelEl = document.getElementById('level');
        if (levelEl) levelEl.textContent = level;

        // Update weapon and ammo display
        if (player.weaponSystem) {
            const weapon = player.weaponSystem.getCurrentWeapon();

            const weaponEl = document.getElementById('weaponName');
            if (weaponEl) {
                weaponEl.textContent = languageSystem.t(weapon.name);
                weaponEl.style.color = weapon.color;
            }

            const ammoEl = document.getElementById('ammo');
            if (ammoEl) {
                if (weapon.ammo === Infinity) {
                    ammoEl.textContent = '∞';
                    ammoEl.style.color = '#00ff00';
                } else {
                    ammoEl.textContent = `${weapon.ammo}/${weapon.maxAmmo}`;
                    // Color code ammo based on amount
                    if (weapon.ammo === 0) {
                        ammoEl.style.color = '#ff0000';
                    } else if (weapon.ammo < weapon.maxAmmo * 0.25) {
                        ammoEl.style.color = '#ffaa00';
                    } else {
                        ammoEl.style.color = '#00ff00';
                    }
                }
            }
        }
    }

    showHUD() {
        const hud = document.getElementById('hud');
        if (hud) hud.style.display = 'block';

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) pauseBtn.style.display = 'block';
    }

    hideHUD() {
        const hud = document.getElementById('hud');
        if (hud) hud.style.display = 'none';

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) pauseBtn.style.display = 'none';
    }

    showPauseMenu(gameStats, playerStats, upgrades, weapons = [], unlockedWeapons = [], currentWeaponIndex = 0) {
        this.showScreen('pauseMenu');

        // Game progress stats
        const levelEl = document.getElementById('pauseLevel');
        if (levelEl) levelEl.textContent = gameStats.level;

        const scoreEl = document.getElementById('pauseScore');
        if (scoreEl) scoreEl.textContent = gameStats.score.toLocaleString();

        const creditsEl = document.getElementById('pauseCredits');
        if (creditsEl) creditsEl.textContent = gameStats.credits;

        const enemiesKilledEl = document.getElementById('pauseEnemiesKilled');
        if (enemiesKilledEl) enemiesKilledEl.textContent = gameStats.enemiesKilled;

        // Player stats
        const maxHealthEl = document.getElementById('pauseMaxHealth');
        if (maxHealthEl) maxHealthEl.textContent = playerStats.maxHealth;

        const maxShieldEl = document.getElementById('pauseMaxShield');
        if (maxShieldEl) maxShieldEl.textContent = playerStats.maxShield;

        const damageEl = document.getElementById('pauseDamage');
        if (damageEl) damageEl.textContent = (playerStats.damage / 10).toFixed(1) + languageSystem.t('x');

        const fireRateEl = document.getElementById('pauseFireRate');
        if (fireRateEl) fireRateEl.textContent = playerStats.fireRate.toFixed(1) + '/' + languageSystem.t('s');

        const speedEl = document.getElementById('pauseSpeed');
        if (speedEl) speedEl.textContent = playerStats.speed.toFixed(1);

        const ammoCapEl = document.getElementById('pauseAmmoCapacity');
        if (ammoCapEl) ammoCapEl.textContent = Math.round(playerStats.ammoMultiplier * 100) + languageSystem.t('%');

        // Upgrade levels
        const healthLevelEl = document.getElementById('pauseHealthLevel');
        if (healthLevelEl) healthLevelEl.textContent = `${upgrades.maxHealth.level}/${upgrades.maxHealth.maxLevel}`;

        const damageLevelEl = document.getElementById('pauseDamageLevel');
        if (damageLevelEl) damageLevelEl.textContent = `${upgrades.damage.level}/${upgrades.damage.maxLevel}`;

        const fireRateLevelEl = document.getElementById('pauseFireRateLevel');
        if (fireRateLevelEl) fireRateLevelEl.textContent = `${upgrades.fireRate.level}/${upgrades.fireRate.maxLevel}`;

        const speedLevelEl = document.getElementById('pauseSpeedLevel');
        if (speedLevelEl) speedLevelEl.textContent = `${upgrades.speed.level}/${upgrades.speed.maxLevel}`;

        const shieldLevelEl = document.getElementById('pauseShieldLevel');
        if (shieldLevelEl) shieldLevelEl.textContent = `${upgrades.shield.level}/${upgrades.shield.maxLevel}`;

        const ammoLevelEl = document.getElementById('pauseAmmoLevel');
        if (ammoLevelEl) ammoLevelEl.textContent = `${upgrades.ammoCrate.level}/${upgrades.ammoCrate.maxLevel}`;

        // Weapon list
        const weaponListEl = document.getElementById('pauseWeaponList');
        if (weaponListEl) {
            weaponListEl.innerHTML = '';

            weapons.forEach((weapon, index) => {
                const isUnlocked = unlockedWeapons[index];
                const isCurrent = index === currentWeaponIndex;

                const weaponDiv = document.createElement('div');
                weaponDiv.style.cssText = `
                    padding: 8px;
                    margin: 4px 0;
                    border-radius: 5px;
                    background: ${isCurrent ? 'rgba(255, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
                    border: 1px solid ${isCurrent ? '#ffff00' : (isUnlocked ? '#00ff00' : '#666666')};
                    opacity: ${isUnlocked ? '1' : '0.5'};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

                const leftSide = document.createElement('div');
                leftSide.style.cssText = 'display: flex; align-items: center; gap: 10px;';

                const keySpan = document.createElement('span');
                keySpan.style.cssText = `
                    background: ${isUnlocked ? '#333' : '#222'};
                    color: ${isUnlocked ? '#fff' : '#666'};
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 12px;
                `;
                keySpan.textContent = weapon.key;

                const nameSpan = document.createElement('span');
                nameSpan.style.cssText = `
                    color: ${isUnlocked ? weapon.color : '#666666'};
                    font-weight: ${isCurrent ? 'bold' : 'normal'};
                `;
                nameSpan.textContent = languageSystem.t(weapon.name);

                if (isCurrent) {
                    const currentBadge = document.createElement('span');
                    currentBadge.style.cssText = `
                        background: #ffff00;
                        color: #000;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-size: 10px;
                        font-weight: bold;
                    `;
                    currentBadge.textContent = languageSystem.t('EQUIPPED');
                    leftSide.appendChild(keySpan);
                    leftSide.appendChild(nameSpan);
                    leftSide.appendChild(currentBadge);
                } else {
                    leftSide.appendChild(keySpan);
                    leftSide.appendChild(nameSpan);
                }

                const ammoSpan = document.createElement('span');
                ammoSpan.style.cssText = 'font-size: 14px;';

                if (!isUnlocked) {
                    ammoSpan.textContent = '🔒 ' + languageSystem.t('LOCKED');
                    ammoSpan.style.color = '#666666';
                } else if (weapon.ammo === Infinity) {
                    ammoSpan.textContent = '∞';
                    ammoSpan.style.color = '#00ffff';
                } else {
                    const ammoPercent = weapon.ammo / weapon.maxAmmo;
                    let ammoColor = '#00ff00';
                    if (ammoPercent <= 0.25) ammoColor = '#ff0000';
                    else if (ammoPercent <= 0.5) ammoColor = '#ffaa00';

                    ammoSpan.textContent = `${weapon.ammo}/${weapon.maxAmmo}`;
                    ammoSpan.style.color = ammoColor;
                }

                weaponDiv.appendChild(leftSide);
                weaponDiv.appendChild(ammoSpan);
                weaponListEl.appendChild(weaponDiv);
            });
        }
    }
}