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

                // Profile system
                'PROFILES': 'PROFILES',
                'NEW PROFILE': 'NEW PROFILE',
                'CREATE NEW PROFILE': 'CREATE NEW PROFILE',
                'Name:': 'Name:',
                'Avatar:': 'Avatar:',
                'CREATE': 'CREATE',
                'Select': 'Select',
                'Edit': 'Edit',
                'Delete': 'Delete',
                'Last played': 'Last played',
                'Profile switched successfully!': 'Profile switched successfully!',
                'Profile deleted': 'Profile deleted',
                'Cannot delete the last profile': 'Cannot delete the last profile',
                'Are you sure you want to delete this profile?': 'Are you sure you want to delete this profile?',
                'Please enter a profile name': 'Please enter a profile name',
                'No Profile': 'No Profile',
                'Active': 'Active',
                'Highest Level': 'Highest Level',
                'Games Played': 'Games Played',
                'Play Time': 'Play Time',
                'ACHIEVEMENTS': 'ACHIEVEMENTS',
                'RECORDS': 'RECORDS',
                'CREDITS': 'CREDITS',
                'HIGH SCORES': 'HIGH SCORES',
                'BACK': 'BACK',

                // Options
                'Control Mode:': 'Control Mode:',
                'Mouse / Touch & Drag': 'Mouse / Touch & Drag',
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
                'Score': 'Score',
                'Weapon': 'Weapon',
                'Ammo': 'Ammo',
                'FPS': 'FPS',
                'Debt': 'Debt',

                // Pause Menu
                'PAUSED': 'PAUSED',
                'Game Progress': 'Game Progress',
                'Current Level:': 'Current Level:',
                'Enemies Killed:': 'Enemies Killed:',
                'Player Stats': 'Player Stats',
                'Max Health:': 'Max Health:',
                'Max Shield:': 'Max Shield:',
                'Damage Multi:': 'Damage Multi:',
                'Move Speed:': 'Move Speed:',
                'Ammo Capacity:': 'Ammo Capacity:',
                'Upgrades': 'Upgrades',
                'Weapon Arsenal': 'Weapon Arsenal',
                'Family Status': 'Family Status',
                'Food:': 'Food:',
                'Morale Effects:': 'Morale Effects:',
                'No effects': 'No effects',
                'Shield Regen': 'Shield Regen',
                'RESUME': 'RESUME',
                'SAVE & QUIT': 'SAVE & QUIT',
                'QUIT TO MENU': 'QUIT TO MENU',

                // Space Hub
                'Medical Debt:': 'Medical Debt:',
                'Total Sent Home:': 'Total Sent Home:',
                'SEND MONEY HOME': 'SEND MONEY HOME',
                'SAVE PROGRESS': 'SAVE PROGRESS',
                'CONTINUE TO LEVEL': 'CONTINUE TO LEVEL',

                // Family Morale States
                'Desperate': 'Desperate',
                'Worried': 'Worried',
                'Hopeful': 'Hopeful',
                'Grateful': 'Grateful',
                'Proud': 'Proud',
                'Well Fed': 'Well Fed',
                'Fed': 'Fed',
                'Hungry': 'Hungry',
                'Starving': 'Starving',

                // Upgrade Names
                'Fire Rate': 'Fire Rate',
                'Speed': 'Speed',
                'Ammo Crate': 'Ammo Crate',
                'Investment Portfolio': 'Investment Portfolio',
                'Multi-Shot': 'Multi-Shot',
                'Shield Regeneration': 'Shield Regeneration',
                'Credit Magnet': 'Credit Magnet',
                'Critical Hit': 'Critical Hit',
                'Piercing Rounds': 'Piercing Rounds',

                // Upgrade Descriptions
                '+40 HP': '+40 HP',
                '+5 damage per shot': '+5 damage per shot',
                '+0.5 shots/sec': '+0.5 shots/sec',
                '+5% crit chance': '+5% crit chance',
                '+15 shield capacity': '+15 shield capacity',
                '+20% max ammo capacity': '+20% max ammo capacity',
                '+20% credit earnings': '+20% credit earnings',
                '+10% passive income': '+10% passive income',
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
                'All weapons refilled!': 'All weapons refilled!',
                'NEW WEAPON UNLOCKED!': 'NEW WEAPON UNLOCKED!',

                // Achievement Categories
                'Combat': 'Combat',
                'Survival': 'Survival',
                'Economy': 'Economy',
                'Exploration': 'Exploration',
                'Mastery': 'Mastery',
                'Family': 'Family',
                'Progression': 'Progression',
                'Skill': 'Skill',
                'Special': 'Special',

                // Common UI
                'No high scores yet!': 'No high scores yet!',

                // Dialog/Story
                'Your family is starving! Send money home soon!': 'Your family is starving! Send money home soon!',
                'Investment Portfolio earned you': 'Investment Portfolio earned you',
                'interest': 'interest',
                'credits applied to medical debt': 'credits applied to medical debt',
                'Your family needs your support!': 'Your family needs your support!',
                'KOVAC FAMILY - MARS COLONY STATION-3': 'KOVAC FAMILY - MARS COLONY STATION-3',
                'Wife - Maria': 'Wife - Maria',
                'Keeping the family together': 'Keeping the family together',
                'Daughter - Sarah (7)': 'Daughter - Sarah (7)',
                'Needs medical treatment': 'Needs medical treatment',
                '4 Other Children': '4 Other Children',
                '5 Other Children': '5 Other Children',
                'Ages 2-11': 'Ages 2-11',
                'Ages 2-12': 'Ages 2-12',
                'Total Sent:': 'Total Sent:',

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
                'First Blood': 'First Blood',
                'Enemy Slayer': 'Enemy Slayer',
                'Hunter Killer': 'Hunter Killer',
                'Boss Slayer': 'Boss Slayer',
                'Perfect Wave': 'Perfect Wave',
                'Asteroid Miner': 'Asteroid Miner',
                'Gold Rush': 'Gold Rush',
                'Wealth Accumulator': 'Wealth Accumulator',
                'Rare Finder': 'Rare Finder',
                'Level Climber': 'Level Climber',
                'Weapon Collector': 'Weapon Collector',
                'Upgrade Expert': 'Upgrade Expert',
                'Sharpshooter': 'Sharpshooter',
                'Survivor': 'Survivor',
                'Pacifist Run': 'Pacifist Run',
                'Family Provider': 'Family Provider',
                'Speed Runner': 'Speed Runner',
                'Critical Master': 'Critical Master',
                'Deathless': 'Deathless',

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

                // Achievement stat names
                'Enemies killed': 'Enemies killed',
                'Hunters killed': 'Hunters killed',
                'Bosses killed': 'Bosses killed',
                'Perfect waves': 'Perfect waves',
                'Asteroids destroyed': 'Asteroids destroyed',
                'Credits from asteroids': 'Credits from asteroids',
                'Rare asteroids found': 'Rare asteroids found',
                'Highest level': 'Highest level',
                'Weapons unlocked': 'Weapons unlocked',
                'Upgrades purchased': 'Upgrades purchased',
                'Max hit streak': 'Max hit streak',
                'Longest survival time': 'Longest survival time',
                'Pacifist levels': 'Pacifist levels',
                'Levels with happy family': 'Levels with happy family',
                'Speed run levels': 'Speed run levels',
                'Critical hits': 'Critical hits',
                'Deathless run': 'Deathless run',

                // Achievement descriptions (exact text)
                'Destroy your first enemy': 'Destroy your first enemy',
                'Destroy enemies': 'Destroy enemies',
                'Defeat bosses': 'Defeat bosses',
                'Destroy asteroids': 'Destroy asteroids',
                'Complete waves without taking damage': 'Complete waves without taking damage',
                'Collect credits from asteroids': 'Collect credits from asteroids',
                'Total credits earned': 'Total credits earned',
                'Find rare asteroids (Gold, Crystal, Platinum)': 'Find rare asteroids (Gold, Crystal, Platinum)',
                'Unlock weapons': 'Unlock weapons',
                'Survive for extended time': 'Survive for extended time',
                'Complete level using only collision damage': 'Complete level using only collision damage',
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
                'Master': 'Master',
                'Champion': 'Champion',
                'Hero': 'Hero',
                'Legend': 'Legend',

                // Additional UI
                'Locked': 'Locked',
                'Unlocked': 'Unlocked',
                'Available': 'Available',
                'Equipped': 'Equipped',
                'Infinite': 'Infinite',

                // Damage Numbers and Combat
                'PLATINUM!': 'PLATINUM!',
                'CRYSTAL!': 'CRYSTAL!',
                'GOLD!': 'GOLD!',
                'CRITICAL!': 'CRITICAL!',
                'HUNTERS APPROACHING!': 'HUNTERS APPROACHING!',
                'BOSS APPROACHING!': 'BOSS APPROACHING!',
                'WAVE COMPLETE!': 'WAVE COMPLETE!',
                'LEVEL COMPLETE!': 'LEVEL COMPLETE!',

                // HUD Labels
                'Credits:': 'Credits:',
                'Level:': 'Level:',
                'Weapon:': 'Weapon:',
                'Ammo:': 'Ammo:',
                'FPS:': 'FPS:',

                // Family Messages
                'Thank you for the money!': 'Thank you for the money!',
                'The children ate well today!': 'The children ate well today!',
                'We paid some bills!': 'We paid some bills!',
                'Medical debt reduced!': 'Medical debt reduced!',
                'The family is grateful!': 'The family is grateful!',
                'We are so proud of you!': 'We are so proud of you!',
                'Stay safe out there!': 'Stay safe out there!',
                'We love you!': 'We love you!',
                'Come home safe!': 'Come home safe!',
                'The medicine is helping!': 'The medicine is helping!',

                // Family Story Messages
                "Dad, you're our hero!": "Dad, you're our hero!",
                "The medicine is working! Thank you!": "The medicine is working! Thank you!",
                "We're so proud of you!": "We're so proud of you!",
                "Sarah is getting better every day!": "Sarah is getting better every day!",
                "Sarah says she loves you.": "Sarah says she loves you.",
                "Stay safe out there.": "Stay safe out there.",
                "Sarah drew you a picture.": "Sarah drew you a picture.",
                "Sarah needs her medicine soon.": "Sarah needs her medicine soon.",
                "Sarah is getting worse without medicine.": "Sarah is getting worse without medicine.",
                "The landlord is threatening eviction.": "The landlord is threatening eviction.",
                "Thank you for the credits, we bought food.": "Thank you for the credits, we bought food.",
                "Sarah says she loves you.": "Sarah says she loves you.",
                "We're managing thanks to you.": "We're managing thanks to you.",
                "The doctor says there's hope.": "The doctor says there's hope.",
                "We believe in you, dad.": "We believe in you, dad.",
                "Stay safe out there.": "Stay safe out there.",
                "Sarah drew you a picture.": "Sarah drew you a picture.",
                "We're waiting for you.": "We're waiting for you.",
                "Dad, when are you coming home?": "Dad, when are you coming home?",
                "We're running low on food...": "We're running low on food...",
                "Sarah needs her medicine soon.": "Sarah needs her medicine soon.",
                "Please be careful, we need you.": "Please be careful, we need you.",
                "Dad, we're hungry...": "Dad, we're hungry...",
                "Sarah is getting worse without medicine.": "Sarah is getting worse without medicine.",
                "Please, we need help!": "Please, we need help!",
                "The landlord is threatening eviction.": "The landlord is threatening eviction.",

                // Weapon Status
                'EMPTY': 'EMPTY',
                'RELOADING': 'RELOADING',
                'READY': 'READY',
                'OVERHEATED': 'OVERHEATED',
                'COOLING': 'COOLING',

                // Boss Names
                'Scarface Jake': 'Scarface Jake',
                'Twin Vipers': 'Twin Vipers',
                'Asteroid King': 'Asteroid King',
                'Ghost Captain': 'Ghost Captain',
                'Quantum Destroyer': 'Quantum Destroyer',
                'Death Squadron': 'Death Squadron',
                'Vortex Master': 'Vortex Master',
                'Shadow Fleet': 'Shadow Fleet',
                'The Annihilator': 'The Annihilator',
                'Captain Vega': 'Captain Vega',

                // Enemy Types
                'Scout': 'Scout',
                'Fighter': 'Fighter',
                'Heavy': 'Heavy',
                'Elite': 'Elite',
                'Hunter': 'Hunter',
                'Boss': 'Boss',

                // Power-up names
                'Health Pack': 'Health Pack',
                'Shield Boost': 'Shield Boost',
                'Rapid Fire': 'Rapid Fire',
                'Double Damage': 'Double Damage',
                'Triple Shot': 'Triple Shot',
                'Invincibility': 'Invincibility',

                // Achievement popup
                'ACHIEVEMENT UNLOCKED!': 'ACHIEVEMENT UNLOCKED!',
                'TIER COMPLETE!': 'TIER COMPLETE!',
                'NEW RECORD!': 'NEW RECORD!',
                'REQUIREMENTS MET!': 'REQUIREMENTS MET!',

                // Dialog/Commands
                'Skip': 'Skip',
                'Continue': 'Continue',
                'Confirm': 'Confirm',
                'Yes': 'Yes',
                'No': 'No',
                'OK': 'OK',

                // Hunter/Boss Messages
                'ELITE HUNTERS INCOMING!': 'ELITE HUNTERS INCOMING!',
                'Hunters eliminated! Boss approaching...': 'Hunters eliminated! Boss approaching...',
                'Hunter bonus': 'Hunter bonus',
                'Hunters were defeated, awarding bonus!': 'Hunters were defeated, awarding bonus!',
                'Hunters escaped! No bonus.': 'Hunters escaped! No bonus.',

                // Weapon UI
                'EQUIPPED': 'EQUIPPED',
                'LOCKED': 'LOCKED',
                'Current': 'Current',
                'Selected': 'Selected',
                'per second': 'per second',

                // Console messages (for debugging)
                'HUNTER SPAWN': 'HUNTER SPAWN',
                'Spawning': 'Spawning',
                'hunters at level': 'hunters at level',
                'Enemies killed:': 'Enemies killed:',
                'Created hunter': 'Created hunter',
                'Total hunters array:': 'Total hunters array:',
                'Error loading options:': 'Error loading options:',
                'Failed to load save:': 'Failed to load save:',

                // Status messages
                'Loading...': 'Loading...',
                'Saving...': 'Saving...',
                'Paused': 'Paused',
                'Game Over': 'Game Over',
                'Victory': 'Victory',

                // Numbers and formatting
                'points': 'points',
                'seconds': 'seconds',
                'minutes': 'minutes',
                'hours': 'hours',
                'damage': 'damage',
                'health': 'health',
                'shield': 'shield',
                'ammo': 'ammo',

                // Misc
                'Wave': 'Wave',
                'Round': 'Round',
                'Stage': 'Stage',
                'Boss Wave': 'Boss Wave',
                'Final Boss': 'Final Boss',
                'Tutorial': 'Tutorial',
                'Training': 'Training',
                'Progress Saved!': 'Progress Saved!',
                'Tier': 'Tier',
                'Requirement:': 'Requirement:',
                'REWARDS:': 'REWARDS:',
                'Unlocked:': 'Unlocked:',
                'CLOSE': 'CLOSE',
                'of': 'of',
                'Practice': 'Practice',
                'PLAYER': 'PLAYER',
                'ACHIEVEMENT COMPLETE!': 'ACHIEVEMENT COMPLETE!',
                'Shield': 'Shield',
                'COLLISION!': 'COLLISION!',
                'Gold ore!': 'Gold ore!',
                'Energy crystal!': 'Energy crystal!',
                'Platinum ore!': 'Platinum ore!',
                'credits!': 'credits!',
                'Hunter bounty!': 'Hunter bounty!',
                'Family:': 'Family:',
                'Debt:': 'Debt:',
                'Health:': 'Health:',
                'Damage:': 'Damage:',
                'Fire Rate:': 'Fire Rate:',
                'Speed:': 'Speed:',
                'Shield:': 'Shield:',
                'Ammo Crate:': 'Ammo Crate:',
                'HUNTERS': 'HUNTERS',
                'HUNTER': 'HUNTER',
                'ACTIVE': 'ACTIVE',
                'DEFEATED': 'DEFEATED',
                'NOT SPAWNED': 'NOT SPAWNED',
                'Kills:': 'Kills:',
                'Hunters at:': 'Hunters at:',
                'Status:': 'Status:',
                'Press': 'Press',
                'to equip': 'to equip',
                'SPACE HUB - UPGRADES': 'SPACE HUB - UPGRADES',
                'FAMILY STATUS REPORT': 'FAMILY STATUS REPORT',
                'Morale:': 'Morale:',
                'Food Status:': 'Food Status:',
                'Worried about family (-10% stats)': 'Worried about family (-10% stats)',
                'Concerned (-5% stats)': 'Concerned (-5% stats)',
                'Determined': 'Determined',
                'Motivated (+5% stats)': 'Motivated (+5% stats)',
                'Inspired (+10% stats)': 'Inspired (+10% stats)',

                // Send Money Dialog
                'Send Money to Family': 'Send Money to Family',
                'You have': 'You have',
                'All': 'All',
                'Cancel': 'Cancel',
                's': 's',
                'x': 'x',
                '%': '%',
                'Credits': 'Credits',
                'Damage': 'Damage',
                'Max Health': 'Max Health',
                'Max Shield': 'Max Shield',
                'Credit Gain': 'Credit Gain',
                'Title:': 'Title:',

                // Console messages
                'All hunters defeated! Boss can now spawn.': 'All hunters defeated! Boss can now spawn.',
                'ERROR: Reached boss threshold but hunters never spawned!': 'ERROR: Reached boss threshold but hunters never spawned!',
                'CHEAT: All weapons unlocked!': 'CHEAT: All weapons unlocked!',
                'CHEAT: Replenished!': 'CHEAT: Replenished!',

                // Weapon descriptions
                'Standard infinite energy weapon': 'Standard infinite energy weapon',
                'Fires spread of energy pellets': 'Fires spread of energy pellets',
                'Rapid-fire plasma bolts': 'Rapid-fire plasma bolts',
                'Explosive projectiles': 'Explosive projectiles',
                'Fires homing missiles': 'Fires homing missiles',
                'Continuous energy beam': 'Continuous energy beam',
                'Orbital lightning attack': 'Orbital lightning attack',
                'Penetrating rail projectile': 'Penetrating rail projectile',
                'Rapid dual cannons': 'Rapid dual cannons',
                'Devastating antimatter blast': 'Devastating antimatter blast',

                // Character/Speaker names

                // Story Events - Intro
                'Narrator': 'Narrator',
                'The year is 2387. The outer rim is a lawless frontier where honest miners risk everything for their families.': 'The year is 2387. The outer rim is a lawless frontier where honest miners risk everything for their families.',
                "Jack 'Stardust' Kovac": "Jack 'Stardust' Kovac",
                'Six mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.': 'Six mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.',
                'Seven mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.': 'Seven mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.',
                "The Hope's Fortune may be old, but she'll get us through. She has to.": "The Hope's Fortune may be old, but she'll get us through. She has to.",

                // Boss Dialogs
                'Well, well... another miner thinks he owns these rocks. Time to teach you who really runs this sector!': 'Well, well... another miner thinks he owns these rocks. Time to teach you who really runs this sector!',
                'Agh! You may have won, but the Crimson Raiders will hunt you down!': 'Agh! You may have won, but the Crimson Raiders will hunt you down!',
                'Your family will thank me when you\'re space dust!': 'Your family will thank me when you\'re space dust!',

                'Two against one, miner! Your luck just ran out!': 'Two against one, miner! Your luck just ran out!',
                'Impossible! Captain Vega will hear about this!': 'Impossible! Captain Vega will hear about this!',
                'Double trouble for you, old man!': 'Double trouble for you, old man!',

                'This is MY asteroid field! Every rock here belongs to me!': 'This is MY asteroid field! Every rock here belongs to me!',
                'My fortress... destroyed... Vega will make you pay!': 'My fortress... destroyed... Vega will make you pay!',
                'I\'ll crush you like the rocks you mine!': 'I\'ll crush you like the rocks you mine!',

                'You won\'t see me coming, miner. I am the shadow in the void!': 'You won\'t see me coming, miner. I am the shadow in the void!',
                'How did you... see through my cloak...?': 'How did you... see through my cloak...?',
                'Now you see me... now you\'re dead!': 'Now you see me... now you\'re dead!',

                'Queen Cobra': 'Queen Cobra',
                'My swarm will pick your bones clean, miner scum!': 'My swarm will pick your bones clean, miner scum!',
                'My beautiful swarm... Captain Vega will avenge us!': 'My beautiful swarm... Captain Vega will avenge us!',
                'Your daughter will wonder why daddy never came home!': 'Your daughter will wonder why daddy never came home!',

                'Red Baron': 'Red Baron',
                'I\'ve destroyed a hundred mining vessels. You\'ll be 101!': 'I\'ve destroyed a hundred mining vessels. You\'ll be 101!',
                'Impossible... I was... the best...': 'Impossible... I was... the best...',
                'Your mining laser is no match for military hardware!': 'Your mining laser is no match for military hardware!',

                'So you\'re the miner who\'s been killing my crew. Time to end this personally!': 'So you\'re the miner who\'s been killing my crew. Time to end this personally!',
                'This... isn\'t over... I\'ll be back... stronger...': 'This... isn\'t over... I\'ll be back... stronger...',
                'After I\'m done with you, I\'ll visit your family personally!': 'After I\'m done with you, I\'ll visit your family personally!',

                'Crystal Warlord': 'Crystal Warlord',
                'These crystal fields are MINE! Every last shard!': 'These crystal fields are MINE! Every last shard!',
                'The crystals... they\'re calling to me... warning me about you...': 'The crystals... they\'re calling to me... warning me about you...',
                'I\'ll shatter you into a million pieces!': 'I\'ll shatter you into a million pieces!',

                'Dark Nebula': 'Dark Nebula',
                'From the shadows I strike! You\'re in my domain now!': 'From the shadows I strike! You\'re in my domain now!',
                'The darkness... it\'s consuming me...': 'The darkness... it\'s consuming me...',
                'In space, no one can hear you scream!': 'In space, no one can hear you scream!',

                'Admiral Vega': 'Admiral Vega',
                'You killed my brother! Now your family will suffer as I have suffered!': 'You killed my brother! Now your family will suffer as I have suffered!',
                'Brother... I... failed you...': 'Brother... I... failed you...',
                'I\'ve already sent ships to Mars Colony Station-3! You\'re too late!': 'I\'ve already sent ships to Mars Colony Station-3! You\'re too late!',

                // Level Events - Story Dialog Messages
                'Ship Computer': 'Ship Computer',
                'Entering Sector 1. Minimal pirate activity detected. Good hunting, Jack.': 'Entering Sector 1. Minimal pirate activity detected. Good hunting, Jack.',
                'Daddy! I drew you a picture of your ship! It\'s on the fridge! Love you!': 'Daddy! I drew you a picture of your ship! It\'s on the fridge! Love you!',
                'Half way there... Hold on Sarah, daddy\'s coming home with your medicine.': 'Half way there... Hold on Sarah, daddy\'s coming home with your medicine.',
                'Attention \'Hope\'s Fortune\'! You\'ve killed too many of my men. Prepare to die!': 'Attention \'Hope\'s Fortune\'! You\'ve killed too many of my men. Prepare to die!',
                'Vega\'s down... but something doesn\'t feel right. Better hurry home.': 'Vega\'s down... but something doesn\'t feel right. Better hurry home.',
                'Jack! Pirates are asking about you at the station! We\'re scared!': 'Jack! Pirates are asking about you at the station! We\'re scared!',
                'No... this can\'t be... my revenge...': 'No... this can\'t be... my revenge...',
                'It\'s over. The Raiders are finished. Time to go home.': 'It\'s over. The Raiders are finished. Time to go home.',
                'DADDY! You\'re coming home! The medicine worked! I love you so much!': 'DADDY! You\'re coming home! The medicine worked! I love you so much!',
                'Gold! This\'ll buy Sarah\'s medicine!': 'Gold! This\'ll buy Sarah\'s medicine!',
                'Can\'t... give up... Family needs me...': 'Can\'t... give up... Family needs me...',

                'Sarah (Transmission)': 'Sarah (Transmission)',
                'Daddy! I drew you a picture of your ship! It\'s on the fridge! Love you!': 'Daddy! I drew you a picture of your ship! It\'s on the fridge! Love you!',

                'Wife (Transmission)': 'Wife (Transmission)',
                'Jack... the medical bills came. 5000 credits. We believe in you. Stay safe.': 'Jack... the medical bills came. 5000 credits. We believe in you. Stay safe.',
                'Half way there... Hold on Sarah, daddy\'s coming home with your medicine.': 'Half way there... Hold on Sarah, daddy\'s coming home with your medicine.',

                'Captain Vega (Broadcast)': 'Captain Vega (Broadcast)',
                'Attention \'Hope\'s Fortune\'! You\'ve killed too many of my men. Prepare to die!': 'Attention \'Hope\'s Fortune\'! You\'ve killed too many of my men. Prepare to die!',
                'Vega\'s down... but something doesn\'t feel right. Better hurry home.': 'Vega\'s down... but something doesn\'t feel right. Better hurry home.',

                'Wife (Emergency)': 'Wife (Emergency)',
                'Jack! Pirates are asking about you at the station! We\'re scared!': 'Jack! Pirates are asking about you at the station! We\'re scared!',

                'Admiral Vega (All Channels)': 'Admiral Vega (All Channels)',
                'Jack Kovac! You killed my brother! Your family will pay the price!': 'Jack Kovac! You killed my brother! Your family will pay the price!',

                // Victory sequence
                'No... this can\'t be... my revenge...': 'No... this can\'t be... my revenge...',
                'It\'s over. The Raiders are finished. Time to go home.': 'It\'s over. The Raiders are finished. Time to go home.',

                'Sarah (Video Call)': 'Sarah (Video Call)',
                'DADDY! You\'re coming home! The medicine worked! I love you so much!': 'DADDY! You\'re coming home! The medicine worked! I love you so much!',
                'You did it, Jack. You saved us all. Come home, hero.': 'You did it, Jack. You saved us all. Come home, hero.',

                // Random Events
                'Gold! This\'ll buy Sarah\'s medicine!': 'Gold! This\'ll buy Sarah\'s medicine!',
                'Can\'t... give up... Family needs me...': 'Can\'t... give up... Family needs me...',
                'Warning: Multiple pirate signatures detected!': 'Warning: Multiple pirate signatures detected!',

                // Family Responses
                'We\'re so proud of you! Sarah is getting better!': 'We\'re so proud of you! Sarah is getting better!',
                'Thank you! We bought food and medicine!': 'Thank you! We bought food and medicine!',
                'Every credit helps. We love you!': 'Every credit helps. We love you!',
                'Thank you... but please be careful out there.': 'Thank you... but please be careful out there.',
                'Thank god! We were so hungry...': 'Thank god! We were so hungry...',
                'We understand... just come home safe.': 'We understand... just come home safe.',
                'Please... we need help soon...': 'Please... we need help soon...',

                // Endings
                'Doctor': 'Doctor',
                'The treatment is complete! Sarah will make a full recovery!': 'The treatment is complete! Sarah will make a full recovery!',
                'Sarah': 'Sarah',
                'Daddy\'s the best space miner in the galaxy!': 'Daddy\'s the best space miner in the galaxy!',
                'Wife': 'Wife',
                'Jack... no... what will we do without you...': 'Jack... no... what will we do without you...',


                // Additional Achievement Descriptions (non-duplicates)
                'Die without firing': 'Die without firing',
                'Support entire family': 'Support entire family',
                'Spread the wealth': 'Spread the wealth',
                'Complete the game': 'Complete the game',
                'Keep family well-fed': 'Keep family well-fed',
                'Complete the game without dying': 'Complete the game without dying',

                // UI Strings from ScreenManager and other files
                'Score:': 'Score:',
                'MAX': 'MAX',
                'UPGRADE': 'UPGRADE',
                'COMPLETE': 'COMPLETE',
                '▶ Press SPACE or click to continue': '▶ Press SPACE or click to continue',
                'ALL WEAPONS UNLOCKED!': 'ALL WEAPONS UNLOCKED!',
                'FULLY REPLENISHED!': 'FULLY REPLENISHED!',
                'Cost:': 'Cost:',
                'Level': 'Level',
                '⚠️ ELITE HUNTERS INCOMING!': '⚠️ ELITE HUNTERS INCOMING!',
                'credits': 'credits'
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

                // Profile system
                'PROFILES': 'ПРОФИЛИ',
                'NEW PROFILE': 'НОВЫЙ ПРОФИЛЬ',
                'CREATE NEW PROFILE': 'СОЗДАТЬ НОВЫЙ ПРОФИЛЬ',
                'Name:': 'Имя:',
                'Avatar:': 'Аватар:',
                'CREATE': 'СОЗДАТЬ',
                'Select': 'Выбрать',
                'Edit': 'Изменить',
                'Delete': 'Удалить',
                'Last played': 'Последняя игра',
                'Profile switched successfully!': 'Профиль успешно переключен!',
                'Profile deleted': 'Профиль удален',
                'Cannot delete the last profile': 'Нельзя удалить последний профиль',
                'Are you sure you want to delete this profile?': 'Вы уверены, что хотите удалить этот профиль?',
                'Please enter a profile name': 'Пожалуйста, введите имя профиля',
                'No Profile': 'Нет профиля',
                'Active': 'Активный',
                'Highest Level': 'Макс. уровень',
                'Games Played': 'Игр сыграно',
                'Play Time': 'Время игры',
                'ACHIEVEMENTS': 'ДОСТИЖЕНИЯ',
                'RECORDS': 'РЕКОРДЫ',
                'CREDITS': 'ТИТРЫ',
                'HIGH SCORES': 'ЛУЧШИЕ РЕЗУЛЬТАТЫ',
                'BACK': 'НАЗАД',

                // Options
                'Control Mode:': 'Режим управления:',
                'Mouse / Touch & Drag': 'Мышь / Касание и перетаскивание',
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
                'Score': 'Счёт',
                'Weapon': 'Оружие',
                'Ammo': 'Патроны',
                'FPS': 'FPS',
                'Debt': 'Долг',

                // Pause Menu
                'PAUSED': 'ПАУЗА',
                'Game Progress': 'Прогресс игры',
                'Current Level:': 'Текущий уровень:',
                'Enemies Killed:': 'Врагов уничтожено:',
                'Player Stats': 'Статистика игрока',
                'Max Health:': 'Макс. здоровье:',
                'Max Shield:': 'Макс. щит:',
                'Damage Multi:': 'Множитель урона:',
                'Move Speed:': 'Скорость движения:',
                'Ammo Capacity:': 'Ёмкость патронов:',
                'Upgrades': 'Улучшения',
                'Weapon Arsenal': 'Арсенал оружия',
                'Family Status': 'Статус семьи',
                'Food:': 'Еда:',
                'Morale Effects:': 'Эффекты морали:',
                'No effects': 'Нет эффектов',
                'Shield Regen': 'Регенерация щита',
                'RESUME': 'ПРОДОЛЖИТЬ',
                'SAVE & QUIT': 'СОХРАНИТЬ И ВЫЙТИ',
                'QUIT TO MENU': 'ВЫЙТИ В МЕНЮ',

                // Space Hub
                'Medical Debt:': 'Медицинский долг:',
                'Total Sent Home:': 'Всего отправлено домой:',
                'SEND MONEY HOME': 'ОТПРАВИТЬ ДЕНЬГИ ДОМОЙ',
                'SAVE PROGRESS': 'СОХРАНИТЬ ПРОГРЕСС',
                'CONTINUE TO LEVEL': 'ПРОДОЛЖИТЬ НА УРОВЕНЬ',

                // Family Morale States
                'Desperate': 'В отчаянии',
                'Worried': 'Обеспокоены',
                'Hopeful': 'С надеждой',
                'Grateful': 'Благодарны',
                'Proud': 'Горды',
                'Well Fed': 'Хорошо накормлены',
                'Fed': 'Сыты',
                'Hungry': 'Голодны',
                'Starving': 'Голодают',

                // Upgrade Names
                'Fire Rate': 'Скорострельность',
                'Speed': 'Скорость',
                'Ammo Crate': 'Ящик патронов',
                'Investment Portfolio': 'Инвестиционный портфель',
                'Multi-Shot': 'Мульти-выстрел',
                'Shield Regeneration': 'Регенерация щита',
                'Credit Magnet': 'Магнит кредитов',
                'Critical Hit': 'Критический удар',
                'Piercing Rounds': 'Пробивающие снаряды',

                // Upgrade Descriptions
                '+40 HP': '+40 ОЗ',
                '+5 damage per shot': '+5 урона за выстрел',
                '+0.5 shots/sec': '+0.5 выстрелов/сек',
                '+5% crit chance': '+5% шанса крита',
                '+15 shield capacity': '+15 ёмкости щита',
                '+20% max ammo capacity': '+20% макс. боезапаса',
                '+20% credit earnings': '+20% заработка кредитов',
                '+10% passive income': '+10% пассивного дохода',
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
                'All weapons refilled!': 'Все оружие перезаряжено!',
                'NEW WEAPON UNLOCKED!': 'НОВОЕ ОРУЖИЕ РАЗБЛОКИРОВАНО!',

                // Achievement Categories
                'Combat': 'Бой',
                'Survival': 'Выживание',
                'Economy': 'Экономика',
                'Exploration': 'Исследование',
                'Mastery': 'Мастерство',
                'Family': 'Семья',
                'Progression': 'Прогресс',
                'Skill': 'Навык',
                'Special': 'Особое',

                // Common UI
                'COMPLETE': 'ЗАВЕРШЕНО',
                '▶ Press SPACE or click to continue': '▶ Нажмите ПРОБЕЛ или кликните для продолжения',
                'ALL WEAPONS UNLOCKED!': 'ВСЁ ОРУЖИЕ РАЗБЛОКИРОВАНО!',
                'FULLY REPLENISHED!': 'ПОЛНОСТЬЮ ВОССТАНОВЛЕНО!',
                'Cost:': 'Стоимость:',
                'Level': 'Уровень',
                'MAX': 'МАКС',
                'UPGRADE': 'УЛУЧШИТЬ',
                'No high scores yet!': 'Пока нет рекордов!',

                // Dialog/Story
                'Your family is starving! Send money home soon!': 'Ваша семья голодает! Срочно отправьте деньги домой!',
                'Investment Portfolio earned you': 'Инвестиционный портфель принёс вам',
                'interest': 'процентов',
                'credits applied to medical debt': 'кредитов применено к медицинскому долгу',
                'Your family needs your support!': 'Вашей семье нужна ваша поддержка!',
                'KOVAC FAMILY - MARS COLONY STATION-3': 'СЕМЬЯ КОВАЧ - МАРСИАНСКАЯ КОЛОНИЯ СТАНЦИЯ-3',
                'Wife - Maria': 'Жена - Мария',
                'Keeping the family together': 'Держит семью вместе',
                'Daughter - Sarah (7)': 'Дочь - Сара (7 лет)',
                'Needs medical treatment': 'Нуждается в лечении',
                '4 Other Children': '4 других детей',
                '5 Other Children': '5 других детей',
                'Ages 2-11': 'Возраст 2-11',
                'Ages 2-12': 'Возраст 2-12',
                'Total Sent:': 'Всего отправлено:',

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
                'First Blood': 'Первая кровь',
                'Enemy Slayer': 'Истребитель врагов',
                'Hunter Killer': 'Убийца охотников',
                'Boss Slayer': 'Убийца боссов',
                'Perfect Wave': 'Идеальная волна',
                'Asteroid Miner': 'Астероидный шахтёр',
                'Gold Rush': 'Золотая лихорадка',
                'Wealth Accumulator': 'Накопитель богатства',
                'Rare Finder': 'Искатель редкостей',
                'Level Climber': 'Покоритель уровней',
                'Weapon Collector': 'Коллекционер оружия',
                'Upgrade Expert': 'Эксперт улучшений',
                'Sharpshooter': 'Снайпер',
                'Survivor': 'Выживший',
                'Pacifist Run': 'Пацифистский забег',
                'Family Provider': 'Кормилец семьи',
                'Speed Runner': 'Спидраннер',
                'Critical Master': 'Мастер критов',
                'Deathless': 'Бессмертный',

                // Achievement descriptions (exact text)
                'Destroy your first enemy': 'Уничтожьте первого врага',
                'Destroy enemies': 'Уничтожайте врагов',
                'Defeat bosses': 'Побеждайте боссов',
                'Destroy asteroids': 'Уничтожайте астероиды',
                'Complete waves without taking damage': 'Проходите волны без урона',
                'Collect credits from asteroids': 'Собирайте кредиты с астероидов',
                'Find rare asteroids (Gold, Crystal, Platinum)': 'Находите редкие астероиды (Золото, Кристалл, Платина)',
                'Unlock weapons': 'Открывайте оружие',
                'Survive for extended time': 'Выживайте продолжительное время',
                'Complete level using only collision damage': 'Пройдите уровень только тараном',

                // Achievement stat names
                'Enemies killed': 'Врагов уничтожено',
                'Hunters killed': 'Охотников убито',
                'Bosses killed': 'Боссов побеждено',
                'Perfect waves': 'Идеальных волн',
                'Asteroids destroyed': 'Астероидов уничтожено',
                'Credits from asteroids': 'Кредитов с астероидов',
                'Total credits earned': 'Всего кредитов заработано',
                'Rare asteroids found': 'Редких астероидов найдено',
                'Highest level': 'Высший уровень',
                'Weapons unlocked': 'Оружия открыто',
                'Upgrades purchased': 'Улучшений куплено',
                'Max hit streak': 'Макс. серия попаданий',
                'Longest survival time': 'Дольше всего выжил',
                'Pacifist levels': 'Пацифистских уровней',
                'Levels with happy family': 'Уровней со счастливой семьёй',
                'Speed run levels': 'Скоростных уровней',
                'Critical hits': 'Критических ударов',
                'Deathless run': 'Прохождение без смертей',

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
                'Master': 'Мастер',
                'Champion': 'Чемпион',
                'Hero': 'Герой',
                'Legend': 'Легенда',

                // Additional UI
                'Locked': 'Заблокировано',
                'Unlocked': 'Разблокировано',
                'Available': 'Доступно',
                'Equipped': 'Экипировано',
                'Infinite': 'Бесконечно',

                // Damage Numbers and Combat
                'PLATINUM!': 'ПЛАТИНА!',
                'CRYSTAL!': 'КРИСТАЛЛ!',
                'GOLD!': 'ЗОЛОТО!',
                'CRITICAL!': 'КРИТИЧЕСКИЙ!',
                'HUNTERS APPROACHING!': 'ПРИБЛИЖАЮТСЯ ОХОТНИКИ!',
                'BOSS APPROACHING!': 'ПРИБЛИЖАЕТСЯ БОСС!',
                'WAVE COMPLETE!': 'ВОЛНА ЗАВЕРШЕНА!',
                'LEVEL COMPLETE!': 'УРОВЕНЬ ПРОЙДЕН!',

                // HUD Labels
                'Credits:': 'Кредиты:',
                'Level:': 'Уровень:',
                'Weapon:': 'Оружие:',
                'Ammo:': 'Патроны:',
                'FPS:': 'FPS:',

                // Family Messages
                'Thank you for the money!': 'Спасибо за деньги!',
                'The children ate well today!': 'Дети сегодня хорошо поели!',
                'We paid some bills!': 'Мы оплатили счета!',
                'Medical debt reduced!': 'Медицинский долг уменьшен!',
                'The family is grateful!': 'Семья благодарна!',
                'We are so proud of you!': 'Мы так гордимся тобой!',
                'Stay safe out there!': 'Береги себя там!',
                'We love you!': 'Мы любим тебя!',
                'Come home safe!': 'Возвращайся домой живым!',
                'The medicine is helping!': 'Лекарство помогает!',

                // Family Story Messages
                "Dad, you're our hero!": "Папа, ты наш герой!",
                "The medicine is working! Thank you!": "Лекарство работает! Спасибо!",
                "We're so proud of you!": "Мы так гордимся тобой!",
                "Sarah is getting better every day!": "Саре становится лучше с каждым днём!",
                "Sarah says she loves you.": "Сара говорит, что любит тебя.",
                "Stay safe out there.": "Береги себя там.",
                "Sarah drew you a picture.": "Сара нарисовала тебе картинку.",
                "Sarah needs her medicine soon.": "Саре скоро понадобится лекарство.",
                "Sarah is getting worse without medicine.": "Саре становится хуже без лекарства.",
                "The landlord is threatening eviction.": "Арендодатель угрожает выселением.",
                "Thank you for the credits, we bought food.": "Спасибо за кредиты, мы купили еду.",
                "Sarah says she loves you.": "Сара говорит, что любит тебя.",
                "We're managing thanks to you.": "Мы справляемся благодаря тебе.",
                "The doctor says there's hope.": "Доктор говорит, что есть надежда.",
                "We believe in you, dad.": "Мы верим в тебя, папа.",
                "Stay safe out there.": "Береги себя там.",
                "Sarah drew you a picture.": "Сара нарисовала тебе рисунок.",
                "We're waiting for you.": "Мы ждём тебя.",
                "Dad, when are you coming home?": "Папа, когда ты вернёшься домой?",
                "We're running low on food...": "У нас заканчивается еда...",
                "Sarah needs her medicine soon.": "Саре скоро нужно лекарство.",
                "Please be careful, we need you.": "Пожалуйста, будь осторожен, ты нам нужен.",
                "Dad, we're hungry...": "Папа, мы голодные...",
                "Sarah is getting worse without medicine.": "Саре становится хуже без лекарств.",
                "Please, we need help!": "Пожалуйста, нам нужна помощь!",
                "The landlord is threatening eviction.": "Арендодатель угрожает выселением.",

                // Weapon Status
                'EMPTY': 'ПУСТО',
                'RELOADING': 'ПЕРЕЗАРЯДКА',
                'READY': 'ГОТОВО',
                'OVERHEATED': 'ПЕРЕГРЕВ',
                'COOLING': 'ОХЛАЖДЕНИЕ',

                // Boss Names
                'Scarface Jake': 'Джейк Шрам',
                'Twin Vipers': 'Близнецы-Гадюки',
                'Asteroid King': 'Король Астероидов',
                'Ghost Captain': 'Капитан-Призрак',
                'Quantum Destroyer': 'Квантовый Разрушитель',
                'Death Squadron': 'Эскадрон Смерти',
                'Vortex Master': 'Мастер Вихря',
                'Shadow Fleet': 'Теневой Флот',
                'The Annihilator': 'Аннигилятор',
                'Captain Vega': 'Капитан Вега',

                // Enemy Types
                'Scout': 'Разведчик',
                'Fighter': 'Истребитель',
                'Heavy': 'Тяжёлый',
                'Elite': 'Элитный',
                'Hunter': 'Охотник',
                'Boss': 'Босс',

                // Power-up names
                'Health Pack': 'Аптечка',
                'Shield Boost': 'Усиление щита',
                'Rapid Fire': 'Скорострел',
                'Double Damage': 'Двойной урон',
                'Triple Shot': 'Тройной выстрел',
                'Invincibility': 'Неуязвимость',

                // Achievement popup
                'ACHIEVEMENT UNLOCKED!': 'ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!',
                'TIER COMPLETE!': 'УРОВЕНЬ ЗАВЕРШЁН!',
                'NEW RECORD!': 'НОВЫЙ РЕКОРД!',
                'REQUIREMENTS MET!': 'ТРЕБОВАНИЯ ВЫПОЛНЕНЫ!',

                // Dialog/Commands
                'Skip': 'Пропустить',
                'Continue': 'Продолжить',
                'Confirm': 'Подтвердить',
                'Yes': 'Да',
                'No': 'Нет',
                'OK': 'ОК',

                // Hunter/Boss Messages
                'ELITE HUNTERS INCOMING!': 'ПРИБЛИЖАЮТСЯ ЭЛИТНЫЕ ОХОТНИКИ!',
                'Hunters eliminated! Boss approaching...': 'Охотники уничтожены! Приближается босс...',
                'Hunter bonus': 'Бонус за охотников',
                'Hunters were defeated, awarding bonus!': 'Охотники побеждены, начисляется бонус!',
                'Hunters escaped! No bonus.': 'Охотники сбежали! Без бонуса.',

                // Weapon UI
                'EQUIPPED': 'ЭКИПИРОВАНО',
                'LOCKED': 'ЗАБЛОКИРОВАНО',
                'Current': 'Текущее',
                'Selected': 'Выбрано',
                'per second': 'в секунду',

                // Console messages (for debugging)
                'HUNTER SPAWN': 'ПОЯВЛЕНИЕ ОХОТНИКОВ',
                'Spawning': 'Появляется',
                'hunters at level': 'охотников на уровне',
                'Enemies killed:': 'Врагов убито:',
                'Created hunter': 'Создан охотник',
                'Total hunters array:': 'Всего охотников в массиве:',
                'Error loading options:': 'Ошибка загрузки настроек:',
                'Failed to load save:': 'Не удалось загрузить сохранение:',

                // Status messages
                'Loading...': 'Загрузка...',
                'Saving...': 'Сохранение...',
                'Paused': 'Пауза',
                'Game Over': 'Игра окончена',
                'Victory': 'Победа',

                // Numbers and formatting
                'credits': 'кредитов',
                'points': 'очков',
                'seconds': 'секунд',
                'minutes': 'минут',
                'hours': 'часов',
                'damage': 'урон',
                'health': 'здоровье',
                'shield': 'щит',
                'ammo': 'патроны',

                // Misc
                'Wave': 'Волна',
                'Round': 'Раунд',
                'Stage': 'Этап',
                'Boss Wave': 'Волна босса',
                'Final Boss': 'Финальный босс',
                'Tutorial': 'Обучение',
                'Training': 'Тренировка',
                'Progress Saved!': 'Прогресс сохранён!',
                'Tier': 'Уровень',
                'Requirement:': 'Требование:',
                'REWARDS:': 'НАГРАДЫ:',
                'Score:': 'Счёт:',
                'Unlocked:': 'Разблокировано:',
                'CLOSE': 'ЗАКРЫТЬ',
                'of': 'из',
                'Practice': 'Практика',
                'PLAYER': 'ИГРОК',
                'ACHIEVEMENT COMPLETE!': 'ДОСТИЖЕНИЕ ВЫПОЛНЕНО!',
                'Shield': 'Щит',
                'COLLISION!': 'СТОЛКНОВЕНИЕ!',
                'Gold ore!': 'Золотая руда!',
                'Energy crystal!': 'Энергетический кристалл!',
                'Platinum ore!': 'Платиновая руда!',
                'credits!': 'кредитов!',
                'Hunter bounty!': 'Награда за охотника!',
                'Family:': 'Семья:',
                'Debt:': 'Долг:',
                'Health:': 'Здоровье:',
                'Damage:': 'Урон:',
                'Fire Rate:': 'Скорострельность:',
                'Speed:': 'Скорость:',
                'Shield:': 'Щит:',
                'Ammo Crate:': 'Ящик патронов:',
                'HUNTERS': 'ОХОТНИКИ',
                'HUNTER': 'ОХОТНИК',
                'ACTIVE': 'АКТИВЕН',
                'DEFEATED': 'ПОБЕЖДЁН',
                'NOT SPAWNED': 'НЕ ПОЯВИЛСЯ',
                'Kills:': 'Убийств:',
                'Hunters at:': 'Охотники на:',
                'Status:': 'Статус:',
                'Press': 'Нажмите',
                'to equip': 'для экипировки',
                'SPACE HUB - UPGRADES': 'КОСМИЧЕСКИЙ ПОРТ - УЛУЧШЕНИЯ',
                'FAMILY STATUS REPORT': 'ОТЧЁТ О СОСТОЯНИИ СЕМЬИ',
                'Morale:': 'Моральный дух:',
                'Food Status:': 'Статус питания:',
                'Worried about family (-10% stats)': 'Беспокойство о семье (-10% к характеристикам)',
                'Concerned (-5% stats)': 'Обеспокоен (-5% к характеристикам)',
                'Determined': 'Решительный',
                'Motivated (+5% stats)': 'Мотивирован (+5% к характеристикам)',
                'Inspired (+10% stats)': 'Воодушевлён (+10% к характеристикам)',

                // Send Money Dialog
                'Send Money to Family': 'Отправить деньги семье',
                'You have': 'У вас есть',
                'All': 'Всё',
                'Cancel': 'Отмена',
                's': 'с',
                'x': 'x',
                '%': '%',
                'Credits': 'Кредиты',
                'Damage': 'Урон',
                'Max Health': 'Макс. здоровье',
                'Max Shield': 'Макс. щит',
                'Credit Gain': 'Получение кредитов',
                'Title:': 'Титул:',

                // Console messages
                'All hunters defeated! Boss can now spawn.': 'Все охотники побеждены! Босс может появиться.',
                'ERROR: Reached boss threshold but hunters never spawned!': 'ОШИБКА: Достигнут порог босса, но охотники не появились!',
                'CHEAT: All weapons unlocked!': 'ЧИТ: Всё оружие разблокировано!',
                'CHEAT: Replenished!': 'ЧИТ: Пополнено!',

                // Weapon descriptions
                'Standard infinite energy weapon': 'Стандартное энергетическое оружие',
                'Fires spread of energy pellets': 'Выстреливает веер энергетических зарядов',
                'Rapid-fire plasma bolts': 'Скорострельные плазменные заряды',
                'Explosive projectiles': 'Взрывные снаряды',
                'Fires homing missiles': 'Выпускает самонаводящиеся ракеты',
                'Continuous energy beam': 'Непрерывный энергетический луч',
                'Orbital lightning attack': 'Орбитальная молниевая атака',
                'Penetrating rail projectile': 'Пробивающий рельсовый снаряд',
                'Rapid dual cannons': 'Скорострельные двойные пушки',
                'Devastating antimatter blast': 'Разрушительный антиматериальный взрыв',

                // Character/Speaker names

                // Story Events - Intro
                'Narrator': 'Рассказчик',
                'The year is 2387. The outer rim is a lawless frontier where honest miners risk everything for their families.': '2387 год. Внешние рубежи - беззаконная граница, где честные шахтёры рискуют всем ради своих семей.',
                "Jack 'Stardust' Kovac": "Джек 'Звёздная Пыль' Ковак",
                'Six mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.': 'Шесть ртов, которых нужно кормить на Марсианской колонии-3... а Саре нужно лекарство. Каждый кредит на счету.',
                'Seven mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.': 'Семь ртов, которых нужно кормить на Марсианской колонии-3... а Саре нужно лекарство. Каждый кредит на счету.',
                "The Hope's Fortune may be old, but she'll get us through. She has to.": "'Удача Надежды' может быть старой, но она нас выручит. Должна.",

                // Boss Dialogs
                'Well, well... another miner thinks he owns these rocks. Time to teach you who really runs this sector!': 'Ну, ну... ещё один шахтёр думает, что владеет этими камнями. Пора показать, кто тут главный в секторе!',
                'Agh! You may have won, but the Crimson Raiders will hunt you down!': 'Ах! Ты можешь и победил, но Алые Рейдеры тебя найдут!',
                'Your family will thank me when you\'re space dust!': 'Твоя семья поблагодарит меня, когда ты станешь космической пылью!',

                'Two against one, miner! Your luck just ran out!': 'Двое против одного, шахтёр! Твоя удача иссякла!',
                'Impossible! Captain Vega will hear about this!': 'Невозможно! Капитан Вега об этом узнает!',
                'Double trouble for you, old man!': 'Двойные неприятности для тебя, старик!',

                'This is MY asteroid field! Every rock here belongs to me!': 'Это МОЁ астероидное поле! Каждый камень здесь принадлежит мне!',
                'My fortress... destroyed... Vega will make you pay!': 'Моя крепость... уничтожена... Вега заставит тебя заплатить!',
                'I\'ll crush you like the rocks you mine!': 'Я раздавлю тебя, как камни, которые ты добываешь!',

                'You won\'t see me coming, miner. I am the shadow in the void!': 'Ты меня не увидишь, шахтёр. Я тень в пустоте!',
                'How did you... see through my cloak...?': 'Как ты... увидел сквозь мою маскировку...?',
                'Now you see me... now you\'re dead!': 'То ты меня видишь... то ты мёртв!',

                'Queen Cobra': 'Королева Кобра',
                'My swarm will pick your bones clean, miner scum!': 'Мой рой обглодает твои кости дочиста, шахтёрская падаль!',
                'My beautiful swarm... Captain Vega will avenge us!': 'Мой прекрасный рой... Капитан Вега отомстит за нас!',
                'Your daughter will wonder why daddy never came home!': 'Твоя дочь будет гадать, почему папочка никогда не вернулся домой!',

                'Red Baron': 'Красный Барон',
                'I\'ve destroyed a hundred mining vessels. You\'ll be 101!': 'Я уничтожил сотню добывающих кораблей. Ты будешь 101-м!',
                'Impossible... I was... the best...': 'Невозможно... Я был... лучшим...',
                'Your mining laser is no match for military hardware!': 'Твой добывающий лазер не сравнится с военным оборудованием!',

                'So you\'re the miner who\'s been killing my crew. Time to end this personally!': 'Значит, ты тот шахтёр, который убивал мою команду. Пора покончить с этим лично!',
                'This... isn\'t over... I\'ll be back... stronger...': 'Это... не конец... Я вернусь... сильнее...',
                'After I\'m done with you, I\'ll visit your family personally!': 'После того, как я покончу с тобой, я лично навещу твою семью!',

                'Crystal Warlord': 'Кристальный Военачальник',
                'These crystal fields are MINE! Every last shard!': 'Эти кристальные поля МОИ! Каждый осколок!',
                'The crystals... they\'re calling to me... warning me about you...': 'Кристаллы... они зовут меня... предупреждают обо мне...',
                'I\'ll shatter you into a million pieces!': 'Я разобью тебя на миллион осколков!',

                'Dark Nebula': 'Тёмная Туманность',
                'From the shadows I strike! You\'re in my domain now!': 'Из тени я наношу удар! Теперь ты в моих владениях!',
                'The darkness... it\'s consuming me...': 'Тьма... она поглощает меня...',
                'In space, no one can hear you scream!': 'В космосе никто не услышит твой крик!',

                'Admiral Vega': 'Адмирал Вега',
                'You killed my brother! Now your family will suffer as I have suffered!': 'Ты убил моего брата! Теперь твоя семья пострадает, как страдал я!',
                'Brother... I... failed you...': 'Брат... я... подвёл тебя...',
                'I\'ve already sent ships to Mars Colony Station-3! You\'re too late!': 'Я уже отправил корабли на Марсианскую колонию-3! Ты опоздал!',

                // Level Events - Story Dialog Messages
                'Ship Computer': 'Бортовой Компьютер',
                'Entering Sector 1. Minimal pirate activity detected. Good hunting, Jack.': 'Входим в Сектор 1. Обнаружена минимальная пиратская активность. Удачной охоты, Джек.',
                'Daddy! I drew you a picture of your ship! It\'s on the fridge! Love you!': 'Папочка! Я нарисовала твой корабль! Рисунок на холодильнике! Люблю тебя!',
                'Half way there... Hold on Sarah, daddy\'s coming home with your medicine.': 'Половина пути пройдена... Держись, Сара, папа идёт домой с твоим лекарством.',
                'Attention \'Hope\'s Fortune\'! You\'ve killed too many of my men. Prepare to die!': 'Внимание, \'Удача Надежды\'! Ты убил слишком много моих людей. Готовься к смерти!',
                'Vega\'s down... but something doesn\'t feel right. Better hurry home.': 'Вега повержен... но что-то не так. Лучше поспешить домой.',
                'Jack! Pirates are asking about you at the station! We\'re scared!': 'Джек! Пираты расспрашивают о тебе на станции! Мы напуганы!',
                'No... this can\'t be... my revenge...': 'Нет... этого не может быть... моя месть...',
                'It\'s over. The Raiders are finished. Time to go home.': 'Всё кончено. Рейдеры разгромлены. Пора домой.',
                'DADDY! You\'re coming home! The medicine worked! I love you so much!': 'ПАПОЧКА! Ты возвращаешься домой! Лекарство подействовало! Я так тебя люблю!',
                'Gold! This\'ll buy Sarah\'s medicine!': 'Золото! На это можно купить лекарство для Сары!',
                'Can\'t... give up... Family needs me...': 'Не могу... сдаться... Семья нуждается во мне...',

                'Sarah (Transmission)': 'Сара (Передача)',
                'Daddy! I drew you a picture of your ship! It\'s on the fridge! Love you!': 'Папочка! Я нарисовала твой корабль! Рисунок на холодильнике! Люблю тебя!',

                'Wife (Transmission)': 'Жена (Передача)',
                'Jack... the medical bills came. 5000 credits. We believe in you. Stay safe.': 'Джек... пришли счета за лечение. 5000 кредитов. Мы верим в тебя. Береги себя.',
                'Half way there... Hold on Sarah, daddy\'s coming home with your medicine.': 'Половина пути пройдена... Держись, Сара, папа идёт домой с твоим лекарством.',

                'Captain Vega (Broadcast)': 'Капитан Вега (Трансляция)',
                'Attention \'Hope\'s Fortune\'! You\'ve killed too many of my men. Prepare to die!': 'Внимание, \'Удача Надежды\'! Ты убил слишком много моих людей. Готовься к смерти!',
                'Vega\'s down... but something doesn\'t feel right. Better hurry home.': 'Вега повержен... но что-то не так. Лучше поспешить домой.',

                'Wife (Emergency)': 'Жена (Экстренная связь)',
                'Jack! Pirates are asking about you at the station! We\'re scared!': 'Джек! Пираты расспрашивают о тебе на станции! Мы напуганы!',

                'Admiral Vega (All Channels)': 'Адмирал Вега (Все каналы)',
                'Jack Kovac! You killed my brother! Your family will pay the price!': 'Джек Ковак! Ты убил моего брата! Твоя семья заплатит цену!',

                // Victory sequence
                'No... this can\'t be... my revenge...': 'Нет... этого не может быть... моя месть...',
                'It\'s over. The Raiders are finished. Time to go home.': 'Всё кончено. Рейдеры разгромлены. Пора домой.',

                'Sarah (Video Call)': 'Сара (Видеозвонок)',
                'DADDY! You\'re coming home! The medicine worked! I love you so much!': 'ПАПОЧКА! Ты возвращаешься домой! Лекарство подействовало! Я так тебя люблю!',
                'You did it, Jack. You saved us all. Come home, hero.': 'Ты сделал это, Джек. Ты спас нас всех. Возвращайся домой, герой.',

                // Random Events
                'Gold! This\'ll buy Sarah\'s medicine!': 'Золото! На это можно купить лекарство для Сары!',
                'Can\'t... give up... Family needs me...': 'Не могу... сдаться... Семья нуждается во мне...',
                'Warning: Multiple pirate signatures detected!': 'Предупреждение: Обнаружены множественные пиратские сигнатуры!',

                // Family Responses
                'We\'re so proud of you! Sarah is getting better!': 'Мы так гордимся тобой! Саре становится лучше!',
                'Thank you! We bought food and medicine!': 'Спасибо! Мы купили еду и лекарства!',
                'Every credit helps. We love you!': 'Каждый кредит помогает. Мы любим тебя!',
                'Thank you... but please be careful out there.': 'Спасибо... но, пожалуйста, будь осторожен там.',
                'Thank god! We were so hungry...': 'Слава богу! Мы так голодали...',
                'We understand... just come home safe.': 'Мы понимаем... просто возвращайся домой целым.',
                'Please... we need help soon...': 'Пожалуйста... нам скоро понадобится помощь...',

                // Endings
                'Doctor': 'Доктор',
                'The treatment is complete! Sarah will make a full recovery!': 'Лечение завершено! Сара полностью выздоровеет!',
                'Sarah': 'Сара',
                'Daddy\'s the best space miner in the galaxy!': 'Папочка - лучший космический шахтёр в галактике!',
                'Wife': 'Жена',
                'Jack... no... what will we do without you...': 'Джек... нет... что мы будем делать без тебя...',

                // Achievement System Names

                // Additional Achievement Descriptions (non-duplicates)
                'Die without firing': 'Умри, не выстрелив',
                'Support entire family': 'Поддерживай всю семью',
                'Spread the wealth': 'Распределяй богатство',
                'Complete the game': 'Завершить игру',
                'Keep family well-fed': 'Содержи семью сытой',
                'Complete the game without dying': 'Завершить игру не умирая',

                // UI Strings from ScreenManager and other files
                '⚠️ ELITE HUNTERS INCOMING!': '⚠️ ПРИБЛИЖАЮТСЯ ЭЛИТНЫЕ ОХОТНИКИ!'
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