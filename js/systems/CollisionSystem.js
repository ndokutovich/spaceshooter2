export class CollisionSystem {
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
                        enemy.health -= projectile.damage;
                        projectilesToRemove.push(pIndex);

                        if (enemy.health <= 0) {
                            enemiesToDestroy.push(eIndex);
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
                if (isDead) {
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
                const scoreBonus = powerUp.applyEffect(game.player);
                game.score += scoreBonus;
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

        asteroidsToDestroy.sort((a, b) => b - a).forEach(index => {
            game.destroyAsteroid(index);
        });

        powerUpsToCollect.sort((a, b) => b - a).forEach(index => {
            game.powerUps.splice(index, 1);
        });
    }
}