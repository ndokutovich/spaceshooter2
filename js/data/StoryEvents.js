/**
 * StoryEvents - All narrative content and dialog
 */
const StoryEvents = {
    // Opening narration
    intro: [
        {
            speaker: languageSystem.t("Narrator"),
            message: languageSystem.t("The year is 2387. The outer rim is a lawless frontier where honest miners risk everything for their families."),
            portrait: "📖"
        },
        {
            speaker: languageSystem.t("Jack 'Stardust' Kovac"),
            message: languageSystem.t("Seven mouths to feed back on Mars Colony Station-3... and Sarah needs her medicine. Every credit counts."),
            portrait: "👨‍🚀"
        },
        {
            speaker: languageSystem.t("Jack 'Stardust' Kovac"),
            message: languageSystem.t("The Hope's Fortune may be old, but she'll get us through. She has to."),
            portrait: "👨‍🚀"
        }
    ],

    // Boss introductions and taunts
    bosses: {
        1: {
            name: languageSystem.t("Scarface Jake"),
            portrait: "🏴‍☠️",
            intro: languageSystem.t("Well, well... another miner thinks he owns these rocks. Time to teach you who really runs this sector!"),
            defeat: languageSystem.t("Agh! You may have won, but the Crimson Raiders will hunt you down!"),
            taunt: languageSystem.t("Your family will thank me when you're space dust!")
        },
        2: {
            name: languageSystem.t("Twin Vipers"),
            portrait: "👥",
            intro: languageSystem.t("Two against one, miner! Your luck just ran out!"),
            defeat: languageSystem.t("Impossible! Captain Vega will hear about this!"),
            taunt: languageSystem.t("Double trouble for you, old man!")
        },
        3: {
            name: languageSystem.t("Asteroid King"),
            portrait: "👑",
            intro: languageSystem.t("This is MY asteroid field! Every rock here belongs to me!"),
            defeat: languageSystem.t("My fortress... destroyed... Vega will make you pay!"),
            taunt: languageSystem.t("I'll crush you like the rocks you mine!")
        },
        4: {
            name: languageSystem.t("Ghost Captain"),
            portrait: "👻",
            intro: languageSystem.t("You won't see me coming, miner. I am the shadow in the void!"),
            defeat: languageSystem.t("How did you... see through my cloak...?"),
            taunt: languageSystem.t("Now you see me... now you're dead!")
        },
        5: {
            name: languageSystem.t("Queen Cobra"),
            portrait: "🐍",
            intro: languageSystem.t("My swarm will pick your bones clean, miner scum!"),
            defeat: languageSystem.t("My beautiful swarm... Captain Vega will avenge us!"),
            taunt: languageSystem.t("Your daughter will wonder why daddy never came home!")
        },
        6: {
            name: languageSystem.t("Red Baron"),
            portrait: "🎖️",
            intro: languageSystem.t("I've destroyed a hundred mining vessels. You'll be 101!"),
            defeat: languageSystem.t("Impossible... I was... the best..."),
            taunt: languageSystem.t("Your mining laser is no match for military hardware!")
        },
        7: {
            name: languageSystem.t("Captain Vega"),
            portrait: "💀",
            intro: languageSystem.t("So you're the miner who's been killing my crew. Time to end this personally!"),
            defeat: languageSystem.t("This... isn't over... I'll be back... stronger..."),
            taunt: languageSystem.t("After I'm done with you, I'll visit your family personally!")
        },
        8: {
            name: languageSystem.t("Crystal Warlord"),
            portrait: "💎",
            intro: languageSystem.t("These crystal fields are MINE! Every last shard!"),
            defeat: languageSystem.t("The crystals... they're calling to me... warning me about you..."),
            taunt: languageSystem.t("I'll shatter you into a million pieces!")
        },
        9: {
            name: languageSystem.t("Dark Nebula"),
            portrait: "🌑",
            intro: languageSystem.t("From the shadows I strike! You're in my domain now!"),
            defeat: languageSystem.t("The darkness... it's consuming me..."),
            taunt: languageSystem.t("In space, no one can hear you scream!")
        },
        10: {
            name: languageSystem.t("Admiral Vega"),
            portrait: "⚔️",
            intro: languageSystem.t("You killed my brother! Now your family will suffer as I have suffered!"),
            defeat: languageSystem.t("Brother... I... failed you..."),
            taunt: languageSystem.t("I've already sent ships to Mars Colony Station-3! You're too late!")
        }
    },

    // Level-specific story events
    levelEvents: {
        1: {
            start: {
                speaker: languageSystem.t("Ship Computer"),
                message: languageSystem.t("Entering Sector 1. Minimal pirate activity detected. Good hunting, Jack."),
                portrait: "🖥️"
            }
        },
        3: {
            start: {
                speaker: languageSystem.t("Sarah (Transmission)"),
                message: languageSystem.t("Daddy! I drew you a picture of your ship! It's on the fridge! Love you!"),
                portrait: "👧"
            }
        },
        5: {
            start: {
                speaker: languageSystem.t("Wife (Transmission)"),
                message: languageSystem.t("Jack... the medical bills came. 5000 credits. We believe in you. Stay safe."),
                portrait: "👩"
            },
            boss_defeat: {
                speaker: languageSystem.t("Jack 'Stardust' Kovac"),
                message: languageSystem.t("Half way there... Hold on Sarah, daddy's coming home with your medicine."),
                portrait: "👨‍🚀"
            }
        },
        7: {
            start: {
                speaker: languageSystem.t("Captain Vega (Broadcast)"),
                message: languageSystem.t("Attention 'Hope's Fortune'! You've killed too many of my men. Prepare to die!"),
                portrait: "💀"
            },
            boss_defeat: {
                speaker: languageSystem.t("Jack 'Stardust' Kovac"),
                message: languageSystem.t("Vega's down... but something doesn't feel right. Better hurry home."),
                portrait: "👨‍🚀"
            }
        },
        9: {
            start: {
                speaker: languageSystem.t("Wife (Emergency)"),
                message: languageSystem.t("Jack! Pirates are asking about you at the station! We're scared!"),
                portrait: "👩"
            }
        },
        10: {
            start: {
                speaker: languageSystem.t("Admiral Vega (All Channels)"),
                message: languageSystem.t("Jack Kovac! You killed my brother! Your family will pay the price!"),
                portrait: "⚔️"
            },
            victory: [
                {
                    speaker: languageSystem.t("Admiral Vega"),
                    message: languageSystem.t("No... this can't be... my revenge..."),
                    portrait: "⚔️"
                },
                {
                    speaker: languageSystem.t("Jack 'Stardust' Kovac"),
                    message: languageSystem.t("It's over. The Raiders are finished. Time to go home."),
                    portrait: "👨‍🚀"
                },
                {
                    speaker: languageSystem.t("Sarah (Video Call)"),
                    message: languageSystem.t("DADDY! You're coming home! The medicine worked! I love you so much!"),
                    portrait: "👧"
                },
                {
                    speaker: languageSystem.t("Wife"),
                    message: languageSystem.t("You did it, Jack. You saved us all. Come home, hero."),
                    portrait: "👩"
                }
            ]
        }
    },

    // Random events during gameplay
    randomEvents: [
        {
            trigger: "gold_collected",
            speaker: languageSystem.t("Jack 'Stardust' Kovac"),
            message: languageSystem.t("Gold! This'll buy Sarah's medicine!"),
            portrait: "👨‍🚀"
        },
        {
            trigger: "low_health",
            speaker: languageSystem.t("Jack 'Stardust' Kovac"),
            message: languageSystem.t("Can't... give up... Family needs me..."),
            portrait: "👨‍🚀"
        },
        {
            trigger: "many_enemies",
            speaker: languageSystem.t("Ship Computer"),
            message: languageSystem.t("Warning: Multiple pirate signatures detected!"),
            portrait: "🖥️"
        }
    ],

    // Family welfare messages
    familyResponses: {
        sentMoney: {
            proud: languageSystem.t("We're so proud of you! Sarah is getting better!"),
            grateful: languageSystem.t("Thank you! We bought food and medicine!"),
            hopeful: languageSystem.t("Every credit helps. We love you!"),
            worried: languageSystem.t("Thank you... but please be careful out there."),
            starving: languageSystem.t("Thank god! We were so hungry...")
        },
        noMoney: {
            worried: languageSystem.t("We understand... just come home safe."),
            starving: languageSystem.t("Please... we need help soon...")
        }
    },

    // Victory conditions
    endings: {
        debtPaid: {
            speaker: languageSystem.t("Doctor"),
            message: "The treatment is complete! Sarah will make a full recovery!",
            portrait: "👨‍⚕️"
        },
        familySaved: {
            speaker: languageSystem.t("Sarah"),
            message: "Daddy's the best space miner in the galaxy!",
            portrait: "👧"
        },
        gameOver: {
            speaker: languageSystem.t("Wife"),
            message: "Jack... no... what will we do without you...",
            portrait: "👩"
        }
    }
};

/**
 * Helper function to get formatted boss dialog
 */
function getBossDialog(level, type = 'intro') {
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
function getLevelEvent(level, type = 'start') {
    const levelData = StoryEvents.levelEvents[level];
    if (!levelData || !levelData[type]) return null;

    // Handle arrays of events (like victory sequence)
    if (Array.isArray(levelData[type])) {
        return levelData[type];
    }

    return [levelData[type]];
}