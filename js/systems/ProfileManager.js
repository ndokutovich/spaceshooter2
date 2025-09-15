class ProfileManager {
    constructor() {
        this.currentProfile = null;
        this.profiles = this.loadProfiles();

        // Clean up any corrupted profiles on startup
        this.cleanupProfiles();

        // Don't auto-create profile - let the game handle first-time setup
        if (Object.keys(this.profiles).length > 0) {
            // Load last active profile or first available
            const lastActiveProfile = localStorage.getItem('spaceShooterActiveProfile');
            if (lastActiveProfile && this.profiles[lastActiveProfile]) {
                this.currentProfile = lastActiveProfile;
            } else {
                this.currentProfile = Object.keys(this.profiles)[0];
            }
        }
    }

    hasProfiles() {
        return Object.keys(this.profiles).length > 0;
    }

    cleanupProfiles() {
        let hasChanges = false;
        const validProfiles = {};

        for (const [id, profile] of Object.entries(this.profiles)) {
            // Only keep valid profiles
            if (profile && profile.name && profile.id) {
                validProfiles[id] = profile;
            } else {
                console.warn('Removing invalid profile:', id);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            this.profiles = validProfiles;
            this.saveProfiles();
        }
    }

    // Method to completely reset profiles (for debugging)
    resetAllProfiles() {
        localStorage.removeItem('spaceShooterProfiles');
        localStorage.removeItem('spaceShooterActiveProfile');
        this.profiles = {};
        this.currentProfile = null;
    }

    loadProfiles() {
        const saved = localStorage.getItem('spaceShooterProfiles');
        if (saved) {
            try {
                const profiles = JSON.parse(saved);
                const validProfiles = {};

                // Validate and clean up profiles
                for (const [id, profile] of Object.entries(profiles)) {
                    // Skip invalid profiles
                    if (!profile || !profile.name || !profile.id) {
                        console.warn('Skipping invalid profile:', id);
                        continue;
                    }

                    // Validate saveData - ensure it's an object or null, not a string
                    let saveData = profile.saveData || null;
                    if (saveData && typeof saveData === 'string') {
                        try {
                            saveData = JSON.parse(saveData);
                        } catch (e) {
                            console.warn('Invalid save data for profile', id, '- resetting');
                            saveData = null;
                        }
                    }

                    // Ensure all required fields exist
                    validProfiles[id] = {
                        id: profile.id || id,
                        name: profile.name || 'Unknown',
                        avatar: profile.avatar || '🚀',
                        createdAt: profile.createdAt || Date.now(),
                        lastPlayed: profile.lastPlayed || Date.now(),
                        stats: profile.stats || {
                            totalGamesPlayed: 0,
                            totalScore: 0,
                            highestLevel: 0,
                            totalCreditsEarned: 0,
                            totalEnemiesKilled: 0,
                            totalPlayTime: 0,
                            achievements: {}
                        },
                        saveData: saveData,
                        highScores: profile.highScores || [],
                        options: profile.options || {
                            controlMode: 'touch',
                            autoFire: true,
                            sfxVolume: 50,
                            musicVolume: 50,
                            language: 'en'
                        },
                        achievementProgress: profile.achievementProgress || null
                    };
                }

                return validProfiles;
            } catch (e) {
                console.error('Error loading profiles:', e);
                return {};
            }
        }
        return {};
    }

    saveProfiles() {
        localStorage.setItem('spaceShooterProfiles', JSON.stringify(this.profiles));
        localStorage.setItem('spaceShooterActiveProfile', this.currentProfile);
    }

    createProfile(name, avatar = '🚀') {
        // Generate unique ID
        const id = 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        this.profiles[id] = {
            id: id,
            name: name,
            avatar: avatar,
            createdAt: Date.now(),
            lastPlayed: Date.now(),
            stats: {
                totalGamesPlayed: 0,
                totalScore: 0,
                highestLevel: 0,
                totalCreditsEarned: 0,
                totalEnemiesKilled: 0,
                totalPlayTime: 0,
                achievements: {}
            },
            saveData: null,
            highScores: [],
            options: {
                controlMode: 'touch',
                autoFire: true,
                sfxVolume: 50,
                musicVolume: 50,
                language: 'en'
            },
            achievementProgress: null // Will be initialized by AchievementSystem
        };

        this.currentProfile = id;
        this.saveProfiles();
        return id;
    }

    deleteProfile(id) {
        if (Object.keys(this.profiles).length <= 1) {
            return false; // Can't delete last profile
        }

        delete this.profiles[id];

        // If deleted current profile, switch to another
        if (this.currentProfile === id) {
            this.currentProfile = Object.keys(this.profiles)[0];
        }

        this.saveProfiles();
        return true;
    }

    switchProfile(id) {
        if (!this.profiles[id]) {
            return false;
        }

        this.currentProfile = id;
        this.profiles[id].lastPlayed = Date.now();
        this.saveProfiles();

        // Apply profile's language setting
        if (this.profiles[id].options.language) {
            languageSystem.setLanguage(this.profiles[id].options.language);
        }

        return true;
    }

    getCurrentProfile() {
        if (!this.currentProfile || !this.profiles[this.currentProfile]) {
            return null;
        }
        return this.profiles[this.currentProfile];
    }

    updateProfileName(id, newName) {
        if (!this.profiles[id]) return false;
        this.profiles[id].name = newName;
        this.saveProfiles();
        return true;
    }

    updateProfileAvatar(id, newAvatar) {
        if (!this.profiles[id]) return false;
        this.profiles[id].avatar = newAvatar;
        this.saveProfiles();
        return true;
    }

    // Game progress methods
    saveGameProgress(saveData) {
        const profile = this.getCurrentProfile();
        if (!profile) {
            console.error('No current profile to save game progress');
            return;
        }

        // Ensure saveData is valid
        if (!saveData || typeof saveData !== 'object') {
            console.error('Invalid save data:', saveData);
            return;
        }

        profile.saveData = saveData;
        profile.lastPlayed = Date.now();
        this.saveProfiles();
    }

    loadGameProgress() {
        const profile = this.getCurrentProfile();
        if (!profile) {
            console.log('No current profile');
            return null;
        }

        // Return the save data directly (already an object)
        if (profile.saveData && typeof profile.saveData === 'object') {
            return profile.saveData;
        }

        return null;
    }

    hasGameProgress() {
        const profile = this.getCurrentProfile();
        return profile && profile.saveData !== null;
    }

    // High scores methods
    saveHighScore(score) {
        const profile = this.getCurrentProfile();
        if (!profile) return;

        profile.highScores.push(score);
        profile.highScores.sort((a, b) => b - a);
        profile.highScores = profile.highScores.slice(0, 10); // Keep top 10

        this.saveProfiles();
    }

    getHighScores() {
        const profile = this.getCurrentProfile();
        if (!profile) return [];
        return profile.highScores;
    }

    // Options methods
    saveOptions(options) {
        const profile = this.getCurrentProfile();
        if (!profile) return;

        profile.options = { ...profile.options, ...options };
        this.saveProfiles();
    }

    loadOptions() {
        const profile = this.getCurrentProfile();
        if (!profile) return null;
        return profile.options;
    }

    // Stats methods
    updateStats(updates) {
        const profile = this.getCurrentProfile();
        if (!profile) return;

        Object.keys(updates).forEach(key => {
            if (profile.stats[key] !== undefined) {
                profile.stats[key] += updates[key];
            }
        });

        this.saveProfiles();
    }

    setStatIfHigher(stat, value) {
        const profile = this.getCurrentProfile();
        if (!profile) return;

        if (profile.stats[stat] !== undefined && value > profile.stats[stat]) {
            profile.stats[stat] = value;
            this.saveProfiles();
        }
    }

    // Achievement methods
    unlockAchievement(achievementId, tier) {
        const profile = this.getCurrentProfile();
        if (!profile) return;

        if (!profile.stats.achievements[achievementId]) {
            profile.stats.achievements[achievementId] = [];
        }

        if (!profile.stats.achievements[achievementId].includes(tier)) {
            profile.stats.achievements[achievementId].push(tier);
            this.saveProfiles();
        }
    }

    getAchievements() {
        const profile = this.getCurrentProfile();
        if (!profile) return {};
        return profile.stats.achievements;
    }

    // Get achievement progress for current profile
    getAchievementProgress() {
        const profile = this.getCurrentProfile();
        if (!profile || !profile.achievementProgress) {
            return null;
        }
        return profile.achievementProgress;
    }

    // Save achievement progress for current profile
    saveAchievementProgress(progress) {
        const profile = this.getCurrentProfile();
        if (!profile) return;

        profile.achievementProgress = progress;
        this.saveProfiles();
    }

    // Get all profiles for UI
    getAllProfiles() {
        return Object.values(this.profiles)
            .filter(profile => profile && profile.name) // Filter out any invalid profiles
            .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
    }

    // Get avatar options
    static getAvatarOptions() {
        return ['🚀', '👨‍🚀', '👩‍🚀', '🛸', '🌟', '⭐', '🔥', '💫', '🌌', '🎮', '🎯', '⚡', '🦅', '🐺', '🦊'];
    }
}

// Create global instance
const profileManager = new ProfileManager();