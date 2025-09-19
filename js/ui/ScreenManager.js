class ScreenManager {
    constructor() {
        this.currentScreen = 'platformLogo';
        this.screens = [
            'platformLogo', 'vendorLogo', 'gameLogo', 'mainMenu',
            'optionsScreen', 'recordsScreen', 'creditsScreen', 'profileScreen',
            'upgradeScreen', 'gameOver', 'victoryScreen', 'pauseMenu', 'freePlayScreen',
            'savesScreen'
        ];
        // Note: createProfileDialog is NOT a screen - it's an overlay dialog

        this.screenStarfields = {};
        this.activeStarfieldAnimation = null;
        this.initializeStarfields();
    }

    initializeStarfields() {
        // Initialize starfields for screens that need them
        const screensWithStarfields = ['platformLogo', 'vendorLogo', 'gameLogo', 'mainMenu'];

        screensWithStarfields.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                const canvas = screen.querySelector('.screen-canvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;

                    // Create starfield for this screen
                    this.screenStarfields[screenId] = {
                        canvas: canvas,
                        ctx: ctx,
                        starfield: new Starfield(canvas)
                    };
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            Object.keys(this.screenStarfields).forEach(screenId => {
                const sf = this.screenStarfields[screenId];
                if (sf) {
                    sf.canvas.width = window.innerWidth;
                    sf.canvas.height = window.innerHeight;
                    sf.starfield.resize(sf.canvas);
                }
            });
        });
    }

    startStarfieldAnimation(screenId) {
        // Stop any existing animation
        this.stopStarfieldAnimation();

        const sf = this.screenStarfields[screenId];
        if (sf) {
            const animate = () => {
                if (this.currentScreen === screenId) {
                    sf.ctx.clearRect(0, 0, sf.canvas.width, sf.canvas.height);
                    sf.starfield.update();
                    sf.starfield.draw(sf.ctx);
                    this.activeStarfieldAnimation = requestAnimationFrame(animate);
                }
            };
            animate();
        }
    }

    stopStarfieldAnimation() {
        if (this.activeStarfieldAnimation) {
            cancelAnimationFrame(this.activeStarfieldAnimation);
            this.activeStarfieldAnimation = null;
        }
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

            // Start starfield animation if this screen has one
            if (this.screenStarfields[screenId]) {
                this.startStarfieldAnimation(screenId);
            } else {
                this.stopStarfieldAnimation();
            }

            // Show/hide continue and save buttons if showing main menu
            if (screenId === 'mainMenu') {
                const continueBtn = document.getElementById('continueBtn');
                const saveGameBtn = document.getElementById('saveGameBtn');

                if (continueBtn) {
                    // Check for either old save data or new autosave
                    const saveData = profileManager.loadGameProgress();
                    const profile = profileManager.getCurrentProfile();
                    let hasPlayableData = false;
                    let displayData = null;

                    // First check for autosave (newest save system)
                    if (profile) {
                        const savesKey = `spaceShooter_saves_${profile.id}`;
                        const savesData = localStorage.getItem(savesKey);
                        if (savesData) {
                            try {
                                const saves = JSON.parse(savesData);
                                const autosave = saves.find(s => s.isAutosave);
                                if (autosave) {
                                    hasPlayableData = true;
                                    displayData = autosave;
                                }
                            } catch (e) {
                                console.error('Failed to check autosave:', e);
                            }
                        }
                    }

                    // Fall back to old save data if no autosave
                    if (!hasPlayableData && saveData) {
                        hasPlayableData = true;
                        displayData = saveData;
                    }

                    if (hasPlayableData && displayData) {
                        continueBtn.innerHTML = `<span>▶️ </span><span>${languageSystem.t('CONTINUE')}<br><span style="font-size: 14px; opacity: 0.7;">${languageSystem.t('Level')} ${displayData.level} • ${languageSystem.t('Score:').slice(0, -1)}: ${displayData.score}</span></span>`;
                        continueBtn.style.display = 'block';

                        // Also show save game button if we have playable data
                        if (saveGameBtn) {
                            saveGameBtn.style.display = 'block';
                        }
                    } else {
                        continueBtn.style.display = 'none';

                        // Hide save game button if no playable data
                        if (saveGameBtn) {
                            saveGameBtn.style.display = 'none';
                        }
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

        const weaponHUD = document.getElementById('weaponHUD');
        if (weaponHUD) weaponHUD.style.display = 'flex';
    }

    hideHUD() {
        const hud = document.getElementById('hud');
        if (hud) hud.style.display = 'none';

        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) pauseBtn.style.display = 'none';

        const weaponHUD = document.getElementById('weaponHUD');
        if (weaponHUD) weaponHUD.style.display = 'none';
    }

    initWeaponHUD(weapons) {
        const weaponHUD = document.getElementById('weaponHUD');
        if (!weaponHUD) return;

        weaponHUD.innerHTML = '';

        weapons.forEach((weapon, index) => {
            const slot = document.createElement('div');
            slot.className = 'weapon-slot locked';
            slot.id = `weapon-slot-${index}`;
            slot.onclick = () => {
                if (window.game && window.game.weaponSystem.unlockedWeapons[index]) {
                    window.game.weaponSystem.switchWeapon(index);
                    this.updateWeaponHUD(weapons, window.game.weaponSystem.unlockedWeapons, index);
                }
            };

            const keyLabel = document.createElement('div');
            keyLabel.className = 'weapon-slot-key';
            keyLabel.textContent = weapon.key;

            const icon = document.createElement('div');
            icon.className = 'weapon-slot-icon';
            icon.textContent = weapon.icon || '🔫';

            const ammo = document.createElement('div');
            ammo.className = 'weapon-slot-ammo';
            ammo.id = `weapon-ammo-${index}`;

            const name = document.createElement('div');
            name.className = 'weapon-slot-name';
            name.textContent = languageSystem.t(weapon.name);

            slot.appendChild(keyLabel);
            slot.appendChild(icon);
            slot.appendChild(ammo);
            slot.appendChild(name);
            weaponHUD.appendChild(slot);
        });
    }

    updateWeaponHUD(weapons, unlockedWeapons, currentIndex) {
        weapons.forEach((weapon, index) => {
            const slot = document.getElementById(`weapon-slot-${index}`);
            const ammoEl = document.getElementById(`weapon-ammo-${index}`);

            if (!slot || !ammoEl) return;

            // Update slot classes
            slot.className = 'weapon-slot';

            if (!unlockedWeapons[index]) {
                slot.classList.add('locked');
                ammoEl.textContent = '🔒';
            } else {
                slot.classList.add('unlocked');

                if (index === currentIndex) {
                    slot.classList.add('current');
                }

                // Update ammo display
                if (weapon.ammo === Infinity) {
                    ammoEl.textContent = '∞';
                    ammoEl.className = 'weapon-slot-ammo infinite';
                } else {
                    ammoEl.textContent = weapon.ammo;
                    ammoEl.className = 'weapon-slot-ammo';

                    const ammoPercent = weapon.ammo / weapon.maxAmmo;
                    if (weapon.ammo === 0) {
                        ammoEl.classList.add('empty');
                        slot.classList.add('no-ammo');
                    } else if (ammoPercent <= 0.25) {
                        ammoEl.classList.add('low');
                    }
                }
            }
        });
    }

    setWeaponHUDPosition(position) {
        const weaponHUD = document.getElementById('weaponHUD');
        if (!weaponHUD) return;

        if (position === 'bottom') {
            weaponHUD.className = 'weapon-hud-bottom';
        } else if (position === 'right') {
            weaponHUD.className = 'weapon-hud-right';
        } else {
            weaponHUD.className = 'weapon-hud-left';
        }
    }

    showPauseMenu(gameStats, playerStats, upgrades, weapons = [], unlockedWeapons = [], currentWeaponIndex = 0, familyStatus = null, moraleModifiers = null) {
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

        const critEl = document.getElementById('pauseCritChance');
        if (critEl) critEl.textContent = Math.round((playerStats.critChance || 0.05) * 100) + '%';

        const ammoCapEl = document.getElementById('pauseAmmoCapacity');
        if (ammoCapEl) ammoCapEl.textContent = Math.round(playerStats.ammoMultiplier * 100) + languageSystem.t('%');

        // Family stats (NEW)
        if (familyStatus && moraleModifiers) {
            // Morale progress
            const moraleEl = document.getElementById('pauseFamilyMorale');
            if (moraleEl) {
                const moralePercentages = {
                    'starving': 0,
                    'worried': 25,
                    'hopeful': 50,
                    'grateful': 75,
                    'proud': 100
                };
                const moralePercent = moralePercentages[familyStatus.morale] || 50;
                const moraleText = `${familyStatus.moraleEmoji} ${moralePercent}%`;
                moraleEl.textContent = moraleText;
                moraleEl.style.color = familyStatus.morale === 'starving' ? '#ff3333' :
                                       familyStatus.morale === 'worried' ? '#ff9933' :
                                       familyStatus.morale === 'hopeful' ? '#ffff66' :
                                       familyStatus.morale === 'grateful' ? '#66ff66' : '#66ffff';
            }

            // Hunger status
            const hungerEl = document.getElementById('pauseFamilyHunger');
            if (hungerEl) {
                const hungerPercent = Math.round(familyStatus.hunger);
                hungerEl.textContent = `${familyStatus.hungerStatus} (${hungerPercent}%)`;
                hungerEl.style.color = familyStatus.hunger < 30 ? '#ff3333' :
                                       familyStatus.hunger < 50 ? '#ff9933' : '#66ff66';
            }

            // Morale effects on stats
            const effectsEl = document.getElementById('pauseMoraleEffects');
            if (effectsEl) {
                const effects = [];

                // Damage modifier
                const damageMod = Math.round((moraleModifiers.damage - 1) * 100);
                if (damageMod !== 0) {
                    effects.push(`${languageSystem.t('Damage')}: ${damageMod > 0 ? '+' : ''}${damageMod}%`);
                }

                // Speed modifier
                const speedMod = Math.round((moraleModifiers.speed - 1) * 100);
                if (speedMod !== 0) {
                    effects.push(`${languageSystem.t('Speed')}: ${speedMod > 0 ? '+' : ''}${speedMod}%`);
                }

                // Fire rate modifier
                const fireRateMod = Math.round((moraleModifiers.fireRate - 1) * 100);
                if (fireRateMod !== 0) {
                    effects.push(`${languageSystem.t('Fire Rate')}: ${fireRateMod > 0 ? '+' : ''}${fireRateMod}%`);
                }

                // Shield regen modifier
                const shieldMod = Math.round((moraleModifiers.shieldRegen - 1) * 100);
                if (shieldMod !== 0) {
                    effects.push(`${languageSystem.t('Shield Regen')}: ${shieldMod > 0 ? '+' : ''}${shieldMod}%`);
                }

                // Credit bonus
                const creditMod = Math.round((moraleModifiers.creditBonus - 1) * 100);
                if (creditMod !== 0) {
                    effects.push(`${languageSystem.t('Credits')}: ${creditMod > 0 ? '+' : ''}${creditMod}%`);
                }

                if (effects.length > 0) {
                    effectsEl.innerHTML = effects.join('<br>');
                    effectsEl.style.color = familyStatus.morale === 'starving' || familyStatus.morale === 'worried' ? '#ff9999' : '#99ff99';
                } else {
                    effectsEl.textContent = languageSystem.t('No effects');
                    effectsEl.style.color = '#999999';
                }
            }
        }

        // Upgrade levels
        const healthLevelEl = document.getElementById('pauseHealthLevel');
        if (healthLevelEl) healthLevelEl.textContent = `${upgrades.maxHealth.level}/${upgrades.maxHealth.maxLevel}`;

        const damageLevelEl = document.getElementById('pauseDamageLevel');
        if (damageLevelEl) damageLevelEl.textContent = `${upgrades.damage.level}/${upgrades.damage.maxLevel}`;

        const fireRateLevelEl = document.getElementById('pauseFireRateLevel');
        if (fireRateLevelEl) fireRateLevelEl.textContent = `${upgrades.fireRate.level}/${upgrades.fireRate.maxLevel}`;

        const critLevelEl = document.getElementById('pauseCritLevel');
        if (critLevelEl) {
            // Handle old saves that might have 'speed' instead of 'critChance'
            const critUpgrade = upgrades.critChance || upgrades.speed || { level: 0, maxLevel: 10 };
            critLevelEl.textContent = `${critUpgrade.level}/${critUpgrade.maxLevel}`;
        }

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