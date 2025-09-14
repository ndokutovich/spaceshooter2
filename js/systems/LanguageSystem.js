class LanguageSystem {
    constructor() {
        this.currentLanguage = localStorage.getItem('gameLanguage') || 'en';
        this.translations = {
            en: {
                // Main Menu
                'PLATFORM STUDIOS': 'PLATFORM STUDIOS',
                'COSMIC GAMES': 'COSMIC GAMES',
                'SPACE SHOOTER': 'SPACE SHOOTER',
                'Click to skip': 'Click to skip',
                'Click to Continue': 'Click to Continue',
                'NEW GAME': 'NEW GAME',
                'CONTINUE': 'CONTINUE',
                'OPTIONS': 'OPTIONS',
                'ACHIEVEMENTS': 'ACHIEVEMENTS',
                'RECORDS': 'RECORDS',
                'CREDITS': 'CREDITS',
                'HIGH SCORES': 'HIGH SCORES',
                'BACK': 'BACK',

                // Options
                'Control Mode:': 'Control Mode:',
                'Touch & Drag': 'Touch & Drag',
                'Virtual Joystick': 'Virtual Joystick',
                'Relative Touch': 'Relative Touch',
                'Auto Fire:': 'Auto Fire:',
                'Sound Effects:': 'Sound Effects:',
                'Music:': 'Music:',
                'Language:': 'Language:',
                'English': 'English',
                'Russian': 'Russian',
                'SAVE': 'SAVE',

                // Credits Screen
                'Game Design & Development': 'Game Design & Development',
                'Space Shooter Team': 'Space Shooter Team',
                'Programming': 'Programming',
                'Lead Developer': 'Lead Developer',
                'Art & Design': 'Art & Design',
                'Visual Artists': 'Visual Artists',
                'Sound & Music': 'Sound & Music',
                'Audio Team': 'Audio Team',

                // Game HUD
                'Health': 'Health',
                'Shield': 'Shield',
                'Score': 'Score',
                'Credits': 'Credits',
                'Level': 'Level',
                'Weapon': 'Weapon',
                'Ammo': 'Ammo',
                'FPS': 'FPS',
                'Family': 'Family',
                'Debt': 'Debt',

                // Pause Menu
                'PAUSED': 'PAUSED',
                'Game Progress': 'Game Progress',
                'Current Level:': 'Current Level:',
                'Score:': 'Score:',
                'Credits:': 'Credits:',
                'Enemies Killed:': 'Enemies Killed:',
                'Player Stats': 'Player Stats',
                'Max Health:': 'Max Health:',
                'Max Shield:': 'Max Shield:',
                'Damage Multi:': 'Damage Multi:',
                'Fire Rate:': 'Fire Rate:',
                'Move Speed:': 'Move Speed:',
                'Ammo Capacity:': 'Ammo Capacity:',
                'Upgrades': 'Upgrades',
                'Weapon Arsenal': 'Weapon Arsenal',
                'RESUME': 'RESUME',
                'SAVE & QUIT': 'SAVE & QUIT',
                'QUIT TO MENU': 'QUIT TO MENU',

                // Space Hub
                'SPACE HUB - UPGRADES': 'SPACE HUB - UPGRADES',
                'FAMILY STATUS REPORT': 'FAMILY STATUS REPORT',
                'Morale:': 'Morale:',
                'Food Status:': 'Food Status:',
                'Medical Debt:': 'Medical Debt:',
                'Total Sent Home:': 'Total Sent Home:',
                'SEND MONEY HOME': 'SEND MONEY HOME',
                'SAVE PROGRESS': 'SAVE PROGRESS',
                'CONTINUE TO LEVEL': 'CONTINUE TO LEVEL',
                'credits': 'credits',

                // Family Morale States
                'Desperate': 'Desperate',
                'Worried': 'Worried',
                'Hopeful': 'Hopeful',
                'Grateful': 'Grateful',
                'Proud': 'Proud',
                'Fed': 'Fed',
                'Hungry': 'Hungry',
                'Starving': 'Starving',

                // Upgrade Names
                'Max Health': 'Max Health',
                'Damage': 'Damage',
                'Fire Rate': 'Fire Rate',
                'Speed': 'Speed',
                'Shield': 'Shield',
                'Ammo Crate': 'Ammo Crate',
                'Investment Portfolio': 'Investment Portfolio',
                'Multi-Shot': 'Multi-Shot',
                'Shield Regeneration': 'Shield Regeneration',
                'Credit Magnet': 'Credit Magnet',
                'Critical Hit': 'Critical Hit',
                'Piercing Rounds': 'Piercing Rounds',

                // Upgrade Descriptions
                'Increases maximum health': 'Increases maximum health',
                'Increases weapon damage': 'Increases weapon damage',
                'Increases fire rate': 'Increases fire rate',
                'Increases movement speed': 'Increases movement speed',
                'Adds protective shield': 'Adds protective shield',
                'Increases ammo capacity for special weapons': 'Increases ammo capacity for special weapons',
                'Earn passive income between levels': 'Earn passive income between levels',
                'Fire multiple projectiles': 'Fire multiple projectiles',
                'Shields regenerate over time': 'Shields regenerate over time',
                'Automatically collect nearby credits': 'Automatically collect nearby credits',
                'Chance to deal double damage': 'Chance to deal double damage',
                'Bullets pass through enemies': 'Bullets pass through enemies',

                // Weapon Names
                'Pulse Laser': 'Pulse Laser',
                'Shotgun Blaster': 'Shotgun Blaster',
                'Rapid Fire': 'Rapid Fire',
                'Plasma Cannon': 'Plasma Cannon',
                'Wave Beam': 'Wave Beam',
                'Missile Launcher': 'Missile Launcher',
                'Lightning Gun': 'Lightning Gun',
                'Flamethrower': 'Flamethrower',
                'Quantum Rifle': 'Quantum Rifle',
                'BFG 9000': 'BFG 9000',

                // Game Over / Victory
                'GAME OVER': 'GAME OVER',
                'VICTORY!': 'VICTORY!',
                'You have saved the galaxy!': 'You have saved the galaxy!',
                'Level Reached:': 'Level Reached:',
                'Enemies Destroyed:': 'Enemies Destroyed:',
                'Credits Earned:': 'Credits Earned:',
                'Final Score:': 'Final Score:',
                'Total Credits:': 'Total Credits:',
                'Completion Time:': 'Completion Time:',
                'RETRY': 'RETRY',
                'MAIN MENU': 'MAIN MENU',

                // Notifications
                'Progress Saved!': 'Progress Saved!',
                'All weapons refilled!': 'All weapons refilled!',
                'NEW WEAPON UNLOCKED!': 'NEW WEAPON UNLOCKED!',
                'HUNTERS APPROACHING!': 'HUNTERS APPROACHING!',
                'BOSS APPROACHING!': 'BOSS APPROACHING!',
                'WAVE COMPLETE!': 'WAVE COMPLETE!',
                'COLLISION!': 'COLLISION!',
                'CRITICAL!': 'CRITICAL!',

                // Achievement Categories
                'Combat': 'Combat',
                'Survival': 'Survival',
                'Economy': 'Economy',
                'Exploration': 'Exploration',
                'Mastery': 'Mastery',
                'Family': 'Family',

                // Common UI
                'Cost:': 'Cost:',
                'Level': 'Level',
                'MAX': 'MAX',
                'UPGRADE': 'UPGRADE',
                'No high scores yet!': 'No high scores yet!',
                'Send Money to Family': 'Send Money to Family',
                'You have': 'You have',
                'Cancel': 'Cancel',
                'CLOSE': 'CLOSE',

                // Dialog/Story
                'Your family is starving! Send money home soon!': 'Your family is starving! Send money home soon!',
                'Investment Portfolio earned you': 'Investment Portfolio earned you',
                'interest': 'interest',
                'credits applied to medical debt': 'credits applied to medical debt',

                // Story Events
                'Commander': 'Commander',
                'Welcome to the Space Defense Force': 'Welcome to the Space Defense Force',
                'Your mission: Defend Earth from the alien invasion': 'Your mission: Defend Earth from the alien invasion',
                'Your family depends on you. Good luck!': 'Your family depends on you. Good luck!',
                'LEVEL': 'LEVEL',
                'Eliminate all enemies!': 'Eliminate all enemies!',
                'Warning: Enemy reinforcements detected!': 'Warning: Enemy reinforcements detected!',
                'Elite Hunters have entered the sector!': 'Elite Hunters have entered the sector!',
                'Massive energy signature detected...': 'Massive energy signature detected...',
                'Boss approaching! Prepare for battle!': 'Boss approaching! Prepare for battle!',
                'Excellent work, pilot!': 'Excellent work, pilot!',
                'The sector is clear. Proceed to Space Hub for upgrades.': 'The sector is clear. Proceed to Space Hub for upgrades.',
                'Outstanding performance!': 'Outstanding performance!',
                'Your family will be proud!': 'Your family will be proud!',
                'The galaxy is saved!': 'The galaxy is saved!',
                'You are a true hero!': 'You are a true hero!',
                'Your family can finally live in peace.': 'Your family can finally live in peace.',
                'Thank you for your service, Commander.': 'Thank you for your service, Commander.',

                // Achievement Names
                'Enemy Slayer': 'Enemy Slayer',
                'Hunter Killer': 'Hunter Killer',
                'Boss Buster': 'Boss Buster',
                'Asteroid Miner': 'Asteroid Miner',
                'Survivor': 'Survivor',
                'Deathless': 'Deathless',
                'Sharpshooter': 'Sharpshooter',
                'Critical Master': 'Critical Master',
                'Speed Runner': 'Speed Runner',
                'Perfectionist': 'Perfectionist',
                'Wealthy': 'Wealthy',
                'Investor': 'Investor',
                'Family Provider': 'Family Provider',
                'Debt Free': 'Debt Free',
                'Happy Family': 'Happy Family',
                'Explorer': 'Explorer',
                'Weapon Master': 'Weapon Master',
                'Upgrade Expert': 'Upgrade Expert',
                'Veteran': 'Veteran',
                'Legend': 'Legend',

                // Achievement Descriptions
                'Destroy enemy ships': 'Destroy enemy ships',
                'Defeat elite hunters': 'Defeat elite hunters',
                'Defeat boss enemies': 'Defeat boss enemies',
                'Destroy asteroids for resources': 'Destroy asteroids for resources',
                'Survive for extended periods': 'Survive for extended periods',
                'Complete levels without dying': 'Complete levels without dying',
                'Land consecutive hits': 'Land consecutive hits',
                'Land critical hits': 'Land critical hits',
                'Complete levels quickly': 'Complete levels quickly',
                'Complete levels without taking damage': 'Complete levels without taking damage',
                'Accumulate credits': 'Accumulate credits',
                'Earn from investments': 'Earn from investments',
                'Send money to family': 'Send money to family',
                'Pay off medical debt': 'Pay off medical debt',
                'Keep family happy': 'Keep family happy',
                'Reach higher levels': 'Reach higher levels',
                'Unlock all weapons': 'Unlock all weapons',
                'Purchase upgrades': 'Purchase upgrades',
                'Complete the campaign': 'Complete the campaign',
                'Master the game': 'Master the game',

                // Tier suffixes
                'Rookie': 'Rookie',
                'Veteran': 'Veteran',
                'Elite': 'Elite',
                'Master': 'Master',
                'Champion': 'Champion',
                'Hero': 'Hero',
                'Legend': 'Legend',

                // Additional UI
                'All': 'All',
                'Locked': 'Locked',
                'Unlocked': 'Unlocked',
                'Available': 'Available',
                'Equipped': 'Equipped',
                'Selected': 'Selected',
                'Infinite': 'Infinite'
            },

            ru: {
                // Main Menu
                'PLATFORM STUDIOS': 'PLATFORM STUDIOS',
                'COSMIC GAMES': 'COSMIC GAMES',
                'SPACE SHOOTER': 'КОСМИЧЕСКИЙ СТРЕЛОК',
                'Click to skip': 'Нажмите, чтобы пропустить',
                'Click to Continue': 'Нажмите, чтобы продолжить',
                'NEW GAME': 'НОВАЯ ИГРА',
                'CONTINUE': 'ПРОДОЛЖИТЬ',
                'OPTIONS': 'НАСТРОЙКИ',
                'ACHIEVEMENTS': 'ДОСТИЖЕНИЯ',
                'RECORDS': 'РЕКОРДЫ',
                'CREDITS': 'ТИТРЫ',
                'HIGH SCORES': 'ЛУЧШИЕ РЕЗУЛЬТАТЫ',
                'BACK': 'НАЗАД',

                // Options
                'Control Mode:': 'Режим управления:',
                'Touch & Drag': 'Касание и перетаскивание',
                'Virtual Joystick': 'Виртуальный джойстик',
                'Relative Touch': 'Относительное касание',
                'Auto Fire:': 'Автоматический огонь:',
                'Sound Effects:': 'Звуковые эффекты:',
                'Music:': 'Музыка:',
                'Language:': 'Язык:',
                'English': 'Английский',
                'Russian': 'Русский',
                'SAVE': 'СОХРАНИТЬ',

                // Credits Screen
                'Game Design & Development': 'Дизайн и разработка игры',
                'Space Shooter Team': 'Команда Space Shooter',
                'Programming': 'Программирование',
                'Lead Developer': 'Ведущий разработчик',
                'Art & Design': 'Арт и дизайн',
                'Visual Artists': 'Художники',
                'Sound & Music': 'Звук и музыка',
                'Audio Team': 'Звуковая команда',

                // Game HUD
                'Health': 'Здоровье',
                'Shield': 'Щит',
                'Score': 'Счёт',
                'Credits': 'Кредиты',
                'Level': 'Уровень',
                'Weapon': 'Оружие',
                'Ammo': 'Патроны',
                'FPS': 'FPS',
                'Family': 'Семья',
                'Debt': 'Долг',

                // Pause Menu
                'PAUSED': 'ПАУЗА',
                'Game Progress': 'Прогресс игры',
                'Current Level:': 'Текущий уровень:',
                'Score:': 'Счёт:',
                'Credits:': 'Кредиты:',
                'Enemies Killed:': 'Врагов уничтожено:',
                'Player Stats': 'Статистика игрока',
                'Max Health:': 'Макс. здоровье:',
                'Max Shield:': 'Макс. щит:',
                'Damage Multi:': 'Множитель урона:',
                'Fire Rate:': 'Скорострельность:',
                'Move Speed:': 'Скорость движения:',
                'Ammo Capacity:': 'Ёмкость патронов:',
                'Upgrades': 'Улучшения',
                'Weapon Arsenal': 'Арсенал оружия',
                'RESUME': 'ПРОДОЛЖИТЬ',
                'SAVE & QUIT': 'СОХРАНИТЬ И ВЫЙТИ',
                'QUIT TO MENU': 'ВЫЙТИ В МЕНЮ',

                // Space Hub
                'SPACE HUB - UPGRADES': 'КОСМИЧЕСКАЯ БАЗА - УЛУЧШЕНИЯ',
                'FAMILY STATUS REPORT': 'ОТЧЁТ О СОСТОЯНИИ СЕМЬИ',
                'Morale:': 'Моральный дух:',
                'Food Status:': 'Статус питания:',
                'Medical Debt:': 'Медицинский долг:',
                'Total Sent Home:': 'Всего отправлено домой:',
                'SEND MONEY HOME': 'ОТПРАВИТЬ ДЕНЬГИ ДОМОЙ',
                'SAVE PROGRESS': 'СОХРАНИТЬ ПРОГРЕСС',
                'CONTINUE TO LEVEL': 'ПРОДОЛЖИТЬ НА УРОВЕНЬ',
                'credits': 'кредитов',

                // Family Morale States
                'Desperate': 'В отчаянии',
                'Worried': 'Обеспокоены',
                'Hopeful': 'С надеждой',
                'Grateful': 'Благодарны',
                'Proud': 'Горды',
                'Fed': 'Сыты',
                'Hungry': 'Голодны',
                'Starving': 'Голодают',

                // Upgrade Names
                'Max Health': 'Макс. здоровье',
                'Damage': 'Урон',
                'Fire Rate': 'Скорострельность',
                'Speed': 'Скорость',
                'Shield': 'Щит',
                'Ammo Crate': 'Ящик патронов',
                'Investment Portfolio': 'Инвестиционный портфель',
                'Multi-Shot': 'Мульти-выстрел',
                'Shield Regeneration': 'Регенерация щита',
                'Credit Magnet': 'Магнит кредитов',
                'Critical Hit': 'Критический удар',
                'Piercing Rounds': 'Пробивающие снаряды',

                // Upgrade Descriptions
                'Increases maximum health': 'Увеличивает максимальное здоровье',
                'Increases weapon damage': 'Увеличивает урон от оружия',
                'Increases fire rate': 'Увеличивает скорострельность',
                'Increases movement speed': 'Увеличивает скорость движения',
                'Adds protective shield': 'Добавляет защитный щит',
                'Increases ammo capacity for special weapons': 'Увеличивает ёмкость патронов для спецоружия',
                'Earn passive income between levels': 'Получайте пассивный доход между уровнями',
                'Fire multiple projectiles': 'Выстрел несколькими снарядами',
                'Shields regenerate over time': 'Щиты восстанавливаются со временем',
                'Automatically collect nearby credits': 'Автоматически собирает ближайшие кредиты',
                'Chance to deal double damage': 'Шанс нанести двойной урон',
                'Bullets pass through enemies': 'Пули проходят сквозь врагов',

                // Weapon Names
                'Pulse Laser': 'Импульсный лазер',
                'Shotgun Blaster': 'Дробовик-бластер',
                'Rapid Fire': 'Скорострел',
                'Plasma Cannon': 'Плазменная пушка',
                'Wave Beam': 'Волновой луч',
                'Missile Launcher': 'Ракетница',
                'Lightning Gun': 'Молниевая пушка',
                'Flamethrower': 'Огнемёт',
                'Quantum Rifle': 'Квантовая винтовка',
                'BFG 9000': 'БФГ 9000',

                // Game Over / Victory
                'GAME OVER': 'ИГРА ОКОНЧЕНА',
                'VICTORY!': 'ПОБЕДА!',
                'You have saved the galaxy!': 'Вы спасли галактику!',
                'Level Reached:': 'Достигнут уровень:',
                'Enemies Destroyed:': 'Врагов уничтожено:',
                'Credits Earned:': 'Заработано кредитов:',
                'Final Score:': 'Финальный счёт:',
                'Total Credits:': 'Всего кредитов:',
                'Completion Time:': 'Время прохождения:',
                'RETRY': 'ПОВТОРИТЬ',
                'MAIN MENU': 'ГЛАВНОЕ МЕНЮ',

                // Notifications
                'Progress Saved!': 'Прогресс сохранён!',
                'All weapons refilled!': 'Все оружие перезаряжено!',
                'NEW WEAPON UNLOCKED!': 'НОВОЕ ОРУЖИЕ РАЗБЛОКИРОВАНО!',
                'HUNTERS APPROACHING!': 'ПРИБЛИЖАЮТСЯ ОХОТНИКИ!',
                'BOSS APPROACHING!': 'ПРИБЛИЖАЕТСЯ БОСС!',
                'WAVE COMPLETE!': 'ВОЛНА ЗАВЕРШЕНА!',
                'COLLISION!': 'СТОЛКНОВЕНИЕ!',
                'CRITICAL!': 'КРИТИЧЕСКИЙ!',

                // Achievement Categories
                'Combat': 'Бой',
                'Survival': 'Выживание',
                'Economy': 'Экономика',
                'Exploration': 'Исследование',
                'Mastery': 'Мастерство',
                'Family': 'Семья',

                // Common UI
                'Cost:': 'Стоимость:',
                'Level': 'Уровень',
                'MAX': 'МАКС',
                'UPGRADE': 'УЛУЧШИТЬ',
                'No high scores yet!': 'Пока нет рекордов!',
                'Send Money to Family': 'Отправить деньги семье',
                'You have': 'У вас',
                'Cancel': 'Отмена',
                'CLOSE': 'ЗАКРЫТЬ',

                // Dialog/Story
                'Your family is starving! Send money home soon!': 'Ваша семья голодает! Срочно отправьте деньги домой!',
                'Investment Portfolio earned you': 'Инвестиционный портфель принёс вам',
                'interest': 'процентов',
                'credits applied to medical debt': 'кредитов применено к медицинскому долгу',

                // Story Events
                'Commander': 'Командир',
                'Welcome to the Space Defense Force': 'Добро пожаловать в Космические силы обороны',
                'Your mission: Defend Earth from the alien invasion': 'Ваша миссия: Защитить Землю от вторжения пришельцев',
                'Your family depends on you. Good luck!': 'Ваша семья зависит от вас. Удачи!',
                'LEVEL': 'УРОВЕНЬ',
                'Eliminate all enemies!': 'Уничтожьте всех врагов!',
                'Warning: Enemy reinforcements detected!': 'Внимание: Обнаружено подкрепление противника!',
                'Elite Hunters have entered the sector!': 'Элитные охотники вошли в сектор!',
                'Massive energy signature detected...': 'Обнаружена мощная энергетическая сигнатура...',
                'Boss approaching! Prepare for battle!': 'Приближается босс! Приготовьтесь к бою!',
                'Excellent work, pilot!': 'Отличная работа, пилот!',
                'The sector is clear. Proceed to Space Hub for upgrades.': 'Сектор очищен. Направляйтесь на космическую базу для улучшений.',
                'Outstanding performance!': 'Выдающееся выступление!',
                'Your family will be proud!': 'Ваша семья будет гордиться!',
                'The galaxy is saved!': 'Галактика спасена!',
                'You are a true hero!': 'Вы настоящий герой!',
                'Your family can finally live in peace.': 'Ваша семья наконец может жить в мире.',
                'Thank you for your service, Commander.': 'Спасибо за вашу службу, Командир.',

                // Achievement Names
                'Enemy Slayer': 'Истребитель врагов',
                'Hunter Killer': 'Убийца охотников',
                'Boss Buster': 'Сокрушитель боссов',
                'Asteroid Miner': 'Астероидный шахтёр',
                'Survivor': 'Выживший',
                'Deathless': 'Бессмертный',
                'Sharpshooter': 'Снайпер',
                'Critical Master': 'Мастер критов',
                'Speed Runner': 'Спидраннер',
                'Perfectionist': 'Перфекционист',
                'Wealthy': 'Богач',
                'Investor': 'Инвестор',
                'Family Provider': 'Кормилец семьи',
                'Debt Free': 'Без долгов',
                'Happy Family': 'Счастливая семья',
                'Explorer': 'Исследователь',
                'Weapon Master': 'Мастер оружия',
                'Upgrade Expert': 'Эксперт улучшений',
                'Veteran': 'Ветеран',
                'Legend': 'Легенда',

                // Achievement Descriptions
                'Destroy enemy ships': 'Уничтожайте вражеские корабли',
                'Defeat elite hunters': 'Побеждайте элитных охотников',
                'Defeat boss enemies': 'Побеждайте боссов',
                'Destroy asteroids for resources': 'Уничтожайте астероиды для ресурсов',
                'Survive for extended periods': 'Выживайте длительное время',
                'Complete levels without dying': 'Проходите уровни без смертей',
                'Land consecutive hits': 'Наносите последовательные удары',
                'Land critical hits': 'Наносите критические удары',
                'Complete levels quickly': 'Проходите уровни быстро',
                'Complete levels without taking damage': 'Проходите уровни без урона',
                'Accumulate credits': 'Накапливайте кредиты',
                'Earn from investments': 'Зарабатывайте на инвестициях',
                'Send money to family': 'Отправляйте деньги семье',
                'Pay off medical debt': 'Погасите медицинский долг',
                'Keep family happy': 'Поддерживайте семью счастливой',
                'Reach higher levels': 'Достигайте высоких уровней',
                'Unlock all weapons': 'Разблокируйте всё оружие',
                'Purchase upgrades': 'Покупайте улучшения',
                'Complete the campaign': 'Завершите кампанию',
                'Master the game': 'Освойте игру',

                // Tier suffixes
                'Rookie': 'Новичок',
                'Veteran': 'Ветеран',
                'Elite': 'Элита',
                'Master': 'Мастер',
                'Champion': 'Чемпион',
                'Hero': 'Герой',
                'Legend': 'Легенда',

                // Additional UI
                'All': 'Все',
                'Locked': 'Заблокировано',
                'Unlocked': 'Разблокировано',
                'Available': 'Доступно',
                'Equipped': 'Экипировано',
                'Selected': 'Выбрано',
                'Infinite': 'Бесконечно'
            }
        };
    }

    // Get translated text
    t(key, params = {}) {
        let text = this.translations[this.currentLanguage][key] || this.translations['en'][key] || key;

        // Replace parameters like {count}, {name}, etc.
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    }

    // Set language and save preference
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('gameLanguage', lang);
            this.updateAllTexts();
            return true;
        }
        return false;
    }

    // Get current language
    getLanguage() {
        return this.currentLanguage;
    }

    // Update all texts in the game
    updateAllTexts() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Trigger custom event for dynamic content updates
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // Get all available languages
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'ru', name: 'Russian', nativeName: 'Русский' }
        ];
    }
}

// Create global instance
const languageSystem = new LanguageSystem();