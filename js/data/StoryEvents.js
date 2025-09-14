/**
 * StoryEvents - All narrative content and dialog
 */
export const StoryEvents = {
    // Opening narration
    intro: [
        {
            speaker: "Narrator",
            message: "The year is 2387. The outer rim is a lawless frontier where honest miners risk everything for their families.",
            portrait: "📖"
        },
        {
            speaker: "Jack 'Stardust' Kovac",
            message: "Seven mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts.",
            portrait: "👨‍🚀"
        },
        {
            speaker: "Jack 'Stardust' Kovac",
            message: "The Hope's Fortune may be old, but she'll get us through. She has to.",
            portrait: "👨‍🚀"
        }
    ],

    // Boss introductions and taunts
    bosses: {
        1: {
            name: "Scarface Jake",
            portrait: "🏴‍☠️",
            intro: "Well, well... another miner thinks he owns these rocks. Time to teach you who really runs this sector!",
            defeat: "Agh! You may have won, but the Crimson Raiders will hunt you down!",
            taunt: "Your family will thank me when you're space dust!"
        },
        2: {
            name: "Twin Vipers",
            portrait: "👥",
            intro: "Two against one, miner! Your luck just ran out!",
            defeat: "Impossible! Captain Vega will hear about this!",
            taunt: "Double trouble for you, old man!"
        },
        3: {
            name: "Asteroid King",
            portrait: "👑",
            intro: "This is MY asteroid field! Every rock here belongs to me!",
            defeat: "My fortress... destroyed... Vega will make you pay!",
            taunt: "I'll crush you like the rocks you mine!"
        },
        4: {
            name: "Ghost Captain",
            portrait: "👻",
            intro: "You won't see me coming, miner. I am the shadow in the void!",
            defeat: "How did you... see through my cloak...?",
            taunt: "Now you see me... now you're dead!"
        },
        5: {
            name: "Queen Cobra",
            portrait: "🐍",
            intro: "My swarm will pick your bones clean, miner scum!",
            defeat: "My beautiful swarm... Captain Vega will avenge us!",
            taunt: "Your daughter will wonder why daddy never came home!"
        },
        6: {
            name: "Red Baron",
            portrait: "🎖️",
            intro: "I've destroyed a hundred mining vessels. You'll be 101!",
            defeat: "Impossible... I was... the best...",
            taunt: "Your mining laser is no match for military hardware!"
        },
        7: {
            name: "Captain Vega",
            portrait: "💀",
            intro: "So you're the miner who's been killing my crew. Time to end this personally!",
            defeat: "This... isn't over... I'll be back... stronger...",
            taunt: "After I'm done with you, I'll visit your family personally!"
        },
        8: {
            name: "Crystal Warlord",
            portrait: "💎",
            intro: "These crystal fields are MINE! Every last shard!",
            defeat: "The crystals... they're calling to me... warning me about you...",
            taunt: "I'll shatter you into a million pieces!"
        },
        9: {
            name: "Dark Nebula",
            portrait: "🌑",
            intro: "From the shadows I strike! You're in my domain now!",
            defeat: "The darkness... it's consuming me...",
            taunt: "In space, no one can hear you scream!"
        },
        10: {
            name: "Admiral Vega",
            portrait: "⚔️",
            intro: "You killed my brother! Now your family will suffer as I have suffered!",
            defeat: "Brother... I... failed you...",
            taunt: "I've already sent ships to Mars Colony Station-3! You're too late!"
        }
    },

    // Level-specific story events
    levelEvents: {
        1: {
            start: {
                speaker: "Ship Computer",
                message: "Entering Sector 1. Minimal pirate activity detected. Good hunting, Jack.",
                portrait: "🖥️"
            }
        },
        3: {
            start: {
                speaker: "Sarah (Transmission)",
                message: "Daddy! I drew you a picture of your ship! It's on the fridge! Love you!",
                portrait: "👧"
            }
        },
        5: {
            start: {
                speaker: "Wife (Transmission)",
                message: "Jack... the medical bills came. 5000 credits. We believe in you. Stay safe.",
                portrait: "👩"
            },
            boss_defeat: {
                speaker: "Jack 'Stardust' Kovac",
                message: "Half way there... Hold on Sarah, daddy's coming home with your medicine.",
                portrait: "👨‍🚀"
            }
        },
        7: {
            start: {
                speaker: "Captain Vega (Broadcast)",
                message: "Attention 'Hope's Fortune'! You've killed too many of my men. Prepare to die!",
                portrait: "💀"
            },
            boss_defeat: {
                speaker: "Jack 'Stardust' Kovac",
                message: "Vega's down... but something doesn't feel right. Better hurry home.",
                portrait: "👨‍🚀"
            }
        },
        9: {
            start: {
                speaker: "Wife (Emergency)",
                message: "Jack! Pirates are asking about you at the station! We're scared!",
                portrait: "👩"
            }
        },
        10: {
            start: {
                speaker: "Admiral Vega (All Channels)",
                message: "Jack Kovac! You killed my brother! Your family will pay the price!",
                portrait: "⚔️"
            },
            victory: [
                {
                    speaker: "Admiral Vega",
                    message: "No... this can't be... my revenge...",
                    portrait: "⚔️"
                },
                {
                    speaker: "Jack 'Stardust' Kovac",
                    message: "It's over. The Raiders are finished. Time to go home.",
                    portrait: "👨‍🚀"
                },
                {
                    speaker: "Sarah (Video Call)",
                    message: "DADDY! You're coming home! The medicine worked! I love you so much!",
                    portrait: "👧"
                },
                {
                    speaker: "Wife",
                    message: "You did it, Jack. You saved us all. Come home, hero.",
                    portrait: "👩"
                }
            ]
        }
    },

    // Random events during gameplay
    randomEvents: [
        {
            trigger: "gold_collected",
            speaker: "Jack 'Stardust' Kovac",
            message: "Gold! This'll buy Sarah's medicine!",
            portrait: "👨‍🚀"
        },
        {
            trigger: "low_health",
            speaker: "Jack 'Stardust' Kovac",
            message: "Can't... give up... Family needs me...",
            portrait: "👨‍🚀"
        },
        {
            trigger: "many_enemies",
            speaker: "Ship Computer",
            message: "Warning: Multiple pirate signatures detected!",
            portrait: "🖥️"
        }
    ],

    // Family welfare messages
    familyResponses: {
        sentMoney: {
            proud: "We're so proud of you! Sarah is getting better!",
            grateful: "Thank you! We bought food and medicine!",
            hopeful: "Every credit helps. We love you!",
            worried: "Thank you... but please be careful out there.",
            starving: "Thank god! We were so hungry..."
        },
        noMoney: {
            worried: "We understand... just come home safe.",
            starving: "Please... we need help soon..."
        }
    },

    // Victory conditions
    endings: {
        debtPaid: {
            speaker: "Doctor",
            message: "The treatment is complete! Sarah will make a full recovery!",
            portrait: "👨‍⚕️"
        },
        familySaved: {
            speaker: "Sarah",
            message: "Daddy's the best space miner in the galaxy!",
            portrait: "👧"
        },
        gameOver: {
            speaker: "Wife",
            message: "Jack... no... what will we do without you...",
            portrait: "👩"
        }
    }
};

/**
 * Helper function to get formatted boss dialog
 */
export function getBossDialog(level, type = 'intro') {
    const boss = StoryEvents.bosses[level];
    if (!boss) return null;

    return {
        speaker: boss.name,
        message: boss[type],
        portrait: boss.portrait
    };
}

/**
 * Helper function to get level event
 */
export function getLevelEvent(level, type = 'start') {
    const levelData = StoryEvents.levelEvents[level];
    if (!levelData || !levelData[type]) return null;

    // Handle arrays of events (like victory sequence)
    if (Array.isArray(levelData[type])) {
        return levelData[type];
    }

    return [levelData[type]];
}