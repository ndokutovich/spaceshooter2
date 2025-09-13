export class ScreenManager {
    constructor() {
        this.currentScreen = 'platformLogo';
        this.screens = [
            'platformLogo', 'vendorLogo', 'gameLogo', 'mainMenu',
            'optionsScreen', 'recordsScreen', 'creditsScreen',
            'upgradeScreen', 'gameOver', 'victoryScreen'
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
            this.showScreen('platformLogo');

            setTimeout(() => {
                this.hideScreen('platformLogo');
                this.showScreen('vendorLogo');

                setTimeout(() => {
                    this.hideScreen('vendorLogo');
                    this.showScreen('gameLogo');

                    const clickHandler = () => {
                        this.hideScreen('gameLogo');
                        this.showScreen('mainMenu');
                        document.removeEventListener('click', clickHandler);
                        document.removeEventListener('touchstart', clickHandler);
                        resolve();
                    };

                    document.addEventListener('click', clickHandler);
                    document.addEventListener('touchstart', clickHandler);
                }, 2000);
            }, 2000);
        });
    }

    showUpgradeScreen(credits, level, upgrades, purchaseCallback) {
        this.showScreen('upgradeScreen');
        document.getElementById('creditsDisplay').textContent = credits;
        document.getElementById('nextLevelNum').textContent = level + 1;

        const upgradeGrid = document.getElementById('upgradeGrid');
        upgradeGrid.innerHTML = '';

        upgrades.forEach(upgrade => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';

            card.innerHTML = `
                <div class="upgrade-title">${upgrade.icon} ${upgrade.name}</div>
                <div class="upgrade-info">
                    <span>Level ${upgrade.level}/${upgrade.maxLevel}</span>
                </div>
                <div style="color: #aaa; font-size: 14px; margin: 10px 0;">${upgrade.description}</div>
                <div class="upgrade-info">
                    <span>Cost: ${upgrade.cost} credits</span>
                </div>
                <button class="upgrade-button" ${upgrade.level >= upgrade.maxLevel || credits < upgrade.cost ? 'disabled' : ''}
                        data-upgrade-type="${upgrade.type}">
                    ${upgrade.level >= upgrade.maxLevel ? 'MAX' : 'UPGRADE'}
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
            list.innerHTML = '<p style="text-align: center; color: #999;">No high scores yet!</p>';
        } else {
            scores.forEach((score, index) => {
                const entry = document.createElement('div');
                entry.className = 'score-entry';
                entry.style.cssText = 'display: flex; justify-content: space-between; margin: 10px 0; font-size: 20px;';
                entry.innerHTML = `
                    <span>${index + 1}.</span>
                    <span style="flex: 1; text-align: center; color: #00ffff;">PLAYER</span>
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

        const ammoEl = document.getElementById('ammo');
        if (ammoEl) ammoEl.textContent = '∞';
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
}