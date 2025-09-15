class AchievementUI {
    constructor(achievementSystem) {
        this.achievementSystem = achievementSystem;
        this.notificationQueue = [];
        this.isShowingNotification = false;
    }

    // Show achievement unlock notification
    showUnlockNotification(unlockData) {
        const { achievement, tier, tierIndex, isComplete } = unlockData;

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: -400px;
            width: 350px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid ${isComplete ? '#ffd700' : '#00ff00'};
            border-radius: 10px;
            padding: 15px;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
            transition: right 0.5s ease-in-out;
            z-index: 10000;
        `;

        // Achievement header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        `;

        // Icon
        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 32px;
            margin-right: 15px;
        `;
        icon.textContent = tier.icon;

        // Title and tier
        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = 'flex-grow: 1;';

        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            color: ${isComplete ? '#ffd700' : '#00ff00'};
        `;
        title.textContent = languageSystem.t(achievement.name);

        const tierText = document.createElement('div');
        tierText.style.cssText = `
            font-size: 12px;
            color: #aaaaaa;
            margin-top: 2px;
        `;

        if (tier.suffix) {
            tierText.textContent = `${languageSystem.t('Tier')} ${tierIndex + 1}: ${languageSystem.t(tier.suffix)}`;
        } else {
            tierText.textContent = `${languageSystem.t('Tier')} ${tierIndex + 1} ${languageSystem.t('of')} ${achievement.tiers.length}`;
        }

        titleContainer.appendChild(title);
        titleContainer.appendChild(tierText);

        header.appendChild(icon);
        header.appendChild(titleContainer);

        // Achievement description
        const description = document.createElement('div');
        description.style.cssText = `
            font-size: 14px;
            color: #dddddd;
            margin-bottom: 10px;
        `;
        description.textContent = languageSystem.t(achievement.description);

        // Requirement
        const requirement = document.createElement('div');
        requirement.style.cssText = `
            font-size: 12px;
            color: #999999;
            margin-bottom: 10px;
        `;
        // Format trackStat name for display
        const statName = achievement.trackStat.replace(/([A-Z])/g, ' $1').toLowerCase();
        const statNameKey = statName.charAt(0).toUpperCase() + statName.slice(1);
        requirement.textContent = `${languageSystem.t('Requirement:')} ${tier.required} ${languageSystem.t(statNameKey) || statName}`;

        // Rewards
        const rewardsContainer = document.createElement('div');
        rewardsContainer.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            padding: 8px;
            margin-top: 10px;
        `;

        const rewardsTitle = document.createElement('div');
        rewardsTitle.style.cssText = `
            font-size: 12px;
            color: #ffff00;
            margin-bottom: 5px;
        `;
        rewardsTitle.textContent = languageSystem.t('REWARDS:');

        const rewardsList = document.createElement('div');
        rewardsList.style.cssText = 'font-size: 12px;';

        // Format rewards
        const rewardTexts = [];
        if (tier.reward.credits) {
            rewardTexts.push(`💰 ${tier.reward.credits} ${languageSystem.t('Credits')}`);
        }
        if (tier.reward.damageBonus) {
            rewardTexts.push(`⚔️ +${(tier.reward.damageBonus * 100).toFixed(0)}% ${languageSystem.t('Damage')}`);
        }
        if (tier.reward.healthBonus) {
            rewardTexts.push(`❤️ +${tier.reward.healthBonus} ${languageSystem.t('Max Health')}`);
        }
        if (tier.reward.shieldBonus) {
            rewardTexts.push(`🛡️ +${tier.reward.shieldBonus} ${languageSystem.t('Max Shield')}`);
        }
        if (tier.reward.creditMultiplier) {
            rewardTexts.push(`💎 +${(tier.reward.creditMultiplier * 100).toFixed(0)}% ${languageSystem.t('Credit Gain')}`);
        }
        if (tier.reward.title) {
            rewardTexts.push(`🏆 ${languageSystem.t('Title:')} "${tier.reward.title}"`);
        }

        rewardsList.innerHTML = rewardTexts.join('<br>');

        rewardsContainer.appendChild(rewardsTitle);
        rewardsContainer.appendChild(rewardsList);

        // Complete indicator
        if (isComplete) {
            const complete = document.createElement('div');
            complete.style.cssText = `
                text-align: center;
                margin-top: 10px;
                font-size: 14px;
                color: #ffd700;
                font-weight: bold;
            `;
            complete.textContent = '⭐ ' + languageSystem.t('ACHIEVEMENT COMPLETE!') + ' ⭐';
            notification.appendChild(complete);
        }

        notification.appendChild(header);
        notification.appendChild(description);
        notification.appendChild(requirement);
        notification.appendChild(rewardsContainer);

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.right = '20px';
        }, 100);

        // Auto-hide after delay
        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }

    // Create achievement menu screen
    createAchievementScreen() {
        const screen = document.createElement('div');
        screen.id = 'achievementScreen';
        screen.className = 'screen';
        screen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 100%);
            display: none;
            overflow-y: auto;
            z-index: 9999;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.5);
            border-bottom: 2px solid #00ff00;
        `;

        const title = document.createElement('h1');
        title.style.cssText = `
            color: #00ff00;
            font-size: 48px;
            margin: 0;
            text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        `;
        title.textContent = languageSystem.t('ACHIEVEMENTS');

        // Score display
        const scoreInfo = this.achievementSystem.getAchievementScore();
        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.cssText = `
            color: #ffff00;
            font-size: 20px;
            margin-top: 10px;
        `;
        scoreDisplay.textContent = `${languageSystem.t('Score:')} ${scoreInfo.score} | ${languageSystem.t('Unlocked:')} ${scoreInfo.unlocked}/${scoreInfo.total} (${scoreInfo.percentage.toFixed(1)}%)`;

        header.appendChild(title);
        header.appendChild(scoreDisplay);

        // Achievement container
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        `;

        // Get achievements by category
        const grouped = this.achievementSystem.getAchievementsByCategory();

        for (const category in grouped) {
            const categorySection = document.createElement('div');
            categorySection.style.cssText = `
                margin-bottom: 30px;
            `;

            const categoryTitle = document.createElement('h2');
            categoryTitle.style.cssText = `
                color: #00ffff;
                font-size: 24px;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.3);
            `;
            categoryTitle.textContent = languageSystem.t(category);

            const achievementGrid = document.createElement('div');
            achievementGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 15px;
            `;

            grouped[category].forEach(achievement => {
                const card = this.createAchievementCard(achievement);
                achievementGrid.appendChild(card);
            });

            categorySection.appendChild(categoryTitle);
            categorySection.appendChild(achievementGrid);
            container.appendChild(categorySection);
        }

        // Close button
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff0000;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
        `;
        closeButton.textContent = languageSystem.t('CLOSE');
        closeButton.onclick = () => this.hideAchievementScreen();

        screen.appendChild(header);
        screen.appendChild(container);
        screen.appendChild(closeButton);

        document.body.appendChild(screen);
        return screen;
    }

    createAchievementCard(achievement) {
        const card = document.createElement('div');
        card.style.cssText = `
            background: ${achievement.unlocked ? 'rgba(0, 255, 0, 0.1)' : 'rgba(100, 100, 100, 0.1)'};
            border: 1px solid ${achievement.unlocked ? '#00ff00' : '#666666'};
            border-radius: 10px;
            padding: 15px;
            position: relative;
            transition: transform 0.2s;
        `;

        card.onmouseover = () => card.style.transform = 'scale(1.05)';
        card.onmouseout = () => card.style.transform = 'scale(1)';

        // Icon and title
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 32px;
            margin-right: 10px;
            ${!achievement.unlocked ? 'filter: grayscale(100%);' : ''}
        `;
        icon.textContent = achievement.icon;

        const titleSection = document.createElement('div');
        titleSection.style.cssText = 'flex-grow: 1;';

        const name = document.createElement('div');
        name.style.cssText = `
            color: ${achievement.unlocked ? '#ffffff' : '#888888'};
            font-size: 16px;
            font-weight: bold;
        `;
        name.textContent = languageSystem.t(achievement.name);

        const tier = document.createElement('div');
        tier.style.cssText = `
            color: ${achievement.unlocked ? '#ffff00' : '#666666'};
            font-size: 12px;
        `;
        tier.textContent = `${languageSystem.t('Tier')} ${achievement.currentTier}/${achievement.maxTier}`;

        titleSection.appendChild(name);
        titleSection.appendChild(tier);

        header.appendChild(icon);
        header.appendChild(titleSection);

        // Description
        const description = document.createElement('div');
        description.style.cssText = `
            color: ${achievement.unlocked ? '#dddddd' : '#666666'};
            font-size: 12px;
            margin-bottom: 10px;
        `;
        description.textContent = languageSystem.t(achievement.description);

        // Progress bar
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            height: 20px;
            position: relative;
            overflow: hidden;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            background: linear-gradient(90deg, #00ff00, #00aa00);
            height: 100%;
            width: ${Math.min(achievement.progress, 100)}%;
            transition: width 0.3s;
        `;

        const progressText = document.createElement('div');
        progressText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 10px;
        `;
        progressText.textContent = achievement.nextRequired ?
            `${achievement.currentValue}/${achievement.nextRequired}` :
            languageSystem.t('COMPLETE');

        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);

        card.appendChild(header);
        card.appendChild(description);
        card.appendChild(progressContainer);

        return card;
    }

    showAchievementScreen() {
        let screen = document.getElementById('achievementScreen');
        if (!screen) {
            screen = this.createAchievementScreen();
        }
        screen.style.display = 'block';
    }

    hideAchievementScreen() {
        const screen = document.getElementById('achievementScreen');
        if (screen) {
            screen.style.display = 'none';
        }
    }

    // Process achievement unlock queue
    processUnlockQueue() {
        if (this.isShowingNotification) return;

        const unlock = this.achievementSystem.getNextUnlock();
        if (unlock) {
            this.isShowingNotification = true;
            this.showUnlockNotification(unlock);
            setTimeout(() => {
                this.isShowingNotification = false;
                this.processUnlockQueue();
            }, 1000);
        }
    }
}