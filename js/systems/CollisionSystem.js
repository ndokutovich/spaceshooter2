class CollisionSystem {
    constructor() {
        this.consecutiveHits = 0;
        this.lastHitTime = 0;
        this.hitStreakTimeout = 2000; // 2 seconds to maintain streak
    }

    checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }

    checkCircleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }

    checkCircleRectCollision(circleX, circleY, radius, rectX, rectY, rectW, rectH) {
        const dx = circleX - Math.max(rectX, Math.min(circleX, rectX + rectW));
        const dy = circleY - Math.max(rectY, Math.min(circleY, rectY + rectH));
        return (dx * dx + dy * dy) < (radius * radius);
    }

    checkCollisions(game) {
        if (!game.player) return;

        const projectilesToRemove = [];
        const enemiesToDestroy = [];
        const huntersToDestroy = [];
        const asteroidsToDestroy = [];
        const powerUpsToCollect = [];

        // Player vs enemy projectiles
        game.projectiles.forEach((projectile, pIndex) => {
            if (!projectile.isPlayer && !game.player.invulnerable) {
                if (this.checkRectCollision(
                    projectile.x - projectile.width / 2,
                    projectile.y - projectile.height / 2,
                    projectile.width,
                    projectile.height,
                    game.player.x - game.player.width / 2,
                    game.player.y - game.player.height / 2,
                    game.player.width,
                    game.player.height
                )) {
                    const isDead = game.player.takeDamage(projectile.damage);

                    // Create damage number for player taking damage
                    if (game.damageNumberSystem) {
                        game.damageNumberSystem.createDamageNumber(
                            game.player.x,
                            game.player.y - game.player.height/2,
                            projectile.damage,
                            false,
                            false  // damage TO player
                        );
                    }

                    if (isDead) {
                        game.gameOver();
                    }
                    projectilesToRemove.push(pIndex);
                }
            }
        });

        // Player projectiles vs enemies
        game.projectiles.forEach((projectile, pIndex) => {
            if (projectile.isPlayer && !projectilesToRemove.includes(pIndex)) {
                // Check enemies
                game.enemies.forEach((enemy, eIndex) => {
                    if (this.checkRectCollision(
                        projectile.x - projectile.width / 2,
                        projectile.y - projectile.height / 2,
                        projectile.width,
                        projectile.height,
                        enemy.x - enemy.width / 2,
                        enemy.y - enemy.height / 2,
                        enemy.width,
                        enemy.height
                    )) {
                        // Track hit streaks
                        const now = Date.now();
                        if (now - this.lastHitTime < this.hitStreakTimeout) {
                            this.consecutiveHits++;
                        } else {
                            this.consecutiveHits = 1;
                        }
                        this.lastHitTime = now;

                        // Track achievements for hit streaks
                        if (game.achievementSystem) {
                            game.achievementSystem.updateStat('maxHitStreak', this.consecutiveHits);
                        }

                        enemy.health -= projectile.damage;
                        projectilesToRemove.push(pIndex);

                        // Create damage number
                        if (game.damageNumberSystem) {
                            game.damageNumberSystem.createDamageNumber(
                                enemy.x,
                                enemy.y - enemy.height/2,
                                projectile.damage,
                                false, // not critical
                                true   // is player damage
                            );
                        }

                        if (enemy.health <= 0) {
                            enemiesToDestroy.push(eIndex);
                        }
                    }
                });

                // Check hunters
                game.hunters.forEach((hunter, hIndex) => {
                    if (!projectilesToRemove.includes(pIndex)) {
                        if (this.checkRectCollision(
                            projectile.x - projectile.width / 2,
                            projectile.y - projectile.height / 2,
                            projectile.width,
                            projectile.height,
                            hunter.x - hunter.width / 2,
                            hunter.y - hunter.height / 2,
                            hunter.width,
                            hunter.height
                        )) {
                            hunter.health -= projectile.damage;
                            projectilesToRemove.push(pIndex);
                            game.particleSystem.createParticle(projectile.x, projectile.y, hunter.color);

                            // Track hit streaks
                            const now = Date.now();
                            if (now - this.lastHitTime < this.hitStreakTimeout) {
                                this.consecutiveHits++;
                            } else {
                                this.consecutiveHits = 1;
                            }
                            this.lastHitTime = now;

                            // Create damage number for hunter
                            if (game.damageNumberSystem) {
                                const isCritical = Math.random() < 0.1; // 10% crit chance
                                const damage = isCritical ? projectile.damage * 2 : projectile.damage;
                                hunter.health -= (isCritical ? projectile.damage : 0); // Apply extra crit damage

                                // Track critical hits for achievements
                                if (isCritical && game.achievementSystem) {
                                    game.achievementSystem.updateStat('criticalHitsLanded', 1);
                                }

                                // Track hit streak achievements
                                if (game.achievementSystem) {
                                    game.achievementSystem.updateStat('maxHitStreak', this.consecutiveHits);
                                }

                                game.damageNumberSystem.createDamageNumber(
                                    hunter.x,
                                    hunter.y - hunter.height/2,
                                    damage,
                                    isCritical,
                                    true
                                );
                            }

                            if (hunter.health <= 0) {
                                huntersToDestroy.push(hIndex);
                            }
                        }
                    }
                });

                // Check boss
                if (game.boss && !projectilesToRemove.includes(pIndex)) {
                    if (this.checkRectCollision(
                        projectile.x - projectile.width / 2,
                        projectile.y - projectile.height / 2,
                        projectile.width,
                        projectile.height,
                        game.boss.x - game.boss.width / 2,
                        game.boss.y - game.boss.height / 2,
                        game.boss.width,
                        game.boss.height
                    )) {
                        game.boss.health -= projectile.damage;
                        projectilesToRemove.push(pIndex);
                        game.particleSystem.createParticle(projectile.x, projectile.y, '#ffff00');

                        // Track hit streaks
                        const now = Date.now();
                        if (now - this.lastHitTime < this.hitStreakTimeout) {
                            this.consecutiveHits++;
                        } else {
                            this.consecutiveHits = 1;
                        }
                        this.lastHitTime = now;

                        // Create damage number for boss
                        if (game.damageNumberSystem) {
                            const isCritical = Math.random() < 0.05; // 5% crit chance on boss
                            const damage = isCritical ? projectile.damage * 2 : projectile.damage;
                            game.boss.health -= (isCritical ? projectile.damage : 0);

                            // Track critical hits for achievements
                            if (isCritical && game.achievementSystem) {
                                game.achievementSystem.updateStat('criticalHitsLanded', 1);
                            }

                            // Track hit streak achievements
                            if (game.achievementSystem) {
                                game.achievementSystem.updateStat('maxHitStreak', this.consecutiveHits);
                            }

                            game.damageNumberSystem.createDamageNumber(
                                projectile.x,
                                projectile.y,
                                damage,
                                isCritical,
                                true
                            );
                        }
                    }
                }

                // Check asteroids
                game.asteroids.forEach((asteroid, aIndex) => {
                    if (!projectilesToRemove.includes(pIndex)) {
                        const dx = projectile.x - asteroid.x;
                        const dy = projectile.y - asteroid.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < asteroid.radius) {
                            asteroid.health -= projectile.damage;
                            projectilesToRemove.push(pIndex);

                            // Create damage number for asteroid
                            if (game.damageNumberSystem) {
                                // Different color based on asteroid type
                                let damageColor = '#ffff00'; // Default yellow
                                if (asteroid.type === 'gold') {
                                    damageColor = '#ffd700'; // Gold color
                                } else if (asteroid.type === 'crystal') {
                                    damageColor = '#ff00ff'; // Purple for crystal
                                } else if (asteroid.type === 'platinum') {
                                    damageColor = '#e5e5e5'; // Silver for platinum
                                } else if (asteroid.type === 'iron') {
                                    damageColor = '#cd853f'; // Brown for iron
                                }

                                game.damageNumberSystem.createDamageNumber(
                                    asteroid.x,
                                    asteroid.y - asteroid.radius,
                                    projectile.damage,
                                    false,
                                    true
                                );

                                // If asteroid destroyed, show bonus text for valuable ones
                                if (asteroid.health <= 0 &&
                                    (asteroid.type === 'gold' || asteroid.type === 'crystal' || asteroid.type === 'platinum')) {
                                    const bonusText = asteroid.type === 'platinum' ? languageSystem.t('PLATINUM!') :
                                                     asteroid.type === 'crystal' ? languageSystem.t('CRYSTAL!') :
                                                     asteroid.type === 'gold' ? languageSystem.t('GOLD!') : '';

                                    if (bonusText) {
                                        game.damageNumberSystem.createTextNotification(
                                            asteroid.x,
                                            asteroid.y,
                                            bonusText,
                                            damageColor
                                        );
                                    }
                                }
                            }

                            if (asteroid.health <= 0) {
                                asteroidsToDestroy.push(aIndex);
                            }
                        }
                    }
                });
            }
        });

        // Player vs enemies (collision)
        game.enemies.forEach((enemy, index) => {
            if (!game.player.invulnerable && this.checkRectCollision(
                enemy.x - enemy.width / 2,
                enemy.y - enemy.height / 2,
                enemy.width,
                enemy.height,
                game.player.x - game.player.width / 2,
                game.player.y - game.player.height / 2,
                game.player.width,
                game.player.height
            )) {
                const isDead = game.player.takeDamage(enemy.damage * 2);

                // Reset hit streak on taking damage
                this.consecutiveHits = 0;

                if (isDead) {
                    // Track death for achievements
                    if (game.achievementSystem) {
                        game.achievementSystem.updateStat('deaths', 1);
                    }
                    game.gameOver();
                }
                enemiesToDestroy.push(index);
            }
        });

        // Player vs asteroids (collision)
        game.asteroids.forEach((asteroid, index) => {
            const bounds = asteroid.getBounds();
            if (!game.player.invulnerable && this.checkRectCollision(
                bounds.x,
                bounds.y,
                bounds.width,
                bounds.height,
                game.player.x - game.player.width / 2,
                game.player.y - game.player.height / 2,
                game.player.width,
                game.player.height
            )) {
                const isDead = game.player.takeDamage(30);

                // Reset hit streak on taking damage
                this.consecutiveHits = 0;

                // Show damage number for asteroid collision
                if (game.damageNumberSystem) {
                    game.damageNumberSystem.createDamageNumber(
                        game.player.x,
                        game.player.y - game.player.height/2,
                        30,
                        false,
                        false  // damage TO player
                    );

                    // Also show warning text
                    game.damageNumberSystem.createTextNotification(
                        asteroid.x,
                        asteroid.y,
                        languageSystem.t('COLLISION!'),
                        '#ff0000'
                    );
                }

                if (isDead) {
                    game.gameOver();
                }
            }
        });

        // Player vs power-ups
        game.powerUps.forEach((powerUp, index) => {
            if (this.checkRectCollision(
                powerUp.x - 10,
                powerUp.y - 10,
                20,
                20,
                game.player.x - game.player.width / 2,
                game.player.y - game.player.height / 2,
                game.player.width,
                game.player.height
            )) {
                // Get the current health/shield before applying
                const oldHealth = game.player.health;
                const oldShield = game.player.shield;

                const scoreBonus = powerUp.applyEffect(game.player);
                game.score += scoreBonus;

                // Show healing number
                if (game.damageNumberSystem) {
                    if (powerUp.type === 'health') {
                        const healAmount = game.player.health - oldHealth;
                        if (healAmount > 0) {
                            game.damageNumberSystem.createHealNumber(
                                game.player.x,
                                game.player.y - game.player.height/2,
                                healAmount
                            );
                        }
                    } else if (powerUp.type === 'shield') {
                        const shieldAmount = game.player.shield - oldShield;
                        if (shieldAmount > 0) {
                            game.damageNumberSystem.createTextNotification(
                                game.player.x,
                                game.player.y - game.player.height/2,
                                `+${Math.floor(shieldAmount)} ${languageSystem.t('Shield')}`,
                                '#00ddff'
                            );
                        }
                    }
                }

                powerUpsToCollect.push(index);
            }
        });

        // Remove collected items (in reverse order to maintain indices)
        projectilesToRemove.sort((a, b) => b - a).forEach(index => {
            game.projectiles.splice(index, 1);
        });

        enemiesToDestroy.sort((a, b) => b - a).forEach(index => {
            game.destroyEnemy(index);
        });

        huntersToDestroy.sort((a, b) => b - a).forEach(index => {
            game.destroyHunter(index);
        });

        asteroidsToDestroy.sort((a, b) => b - a).forEach(index => {
            game.destroyAsteroid(index);
        });

        powerUpsToCollect.sort((a, b) => b - a).forEach(index => {
            game.powerUps.splice(index, 1);
        });
    }
}