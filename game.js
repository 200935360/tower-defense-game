// 塔防游戏主程序
class TowerDefenseGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 40;
        this.cols = 20;
        this.rows = 15;
        
        // 游戏状态
        this.gold = 150;
        this.lives = 20;
        this.wave = 1;
        this.isPaused = false;
        this.isGameOver = false;
        this.waveInProgress = false;
        
        // 游戏对象
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.particles = [];
        
        // 选中的塔类型
        this.selectedTower = null;
        
        // 鼠标位置
        this.mouseX = 0;
        this.mouseY = 0;
        
        // 路径定义
        this.path = [
            {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
            {x: 3, y: 3}, {x: 3, y: 4}, {x: 3, y: 5},
            {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5},
            {x: 7, y: 4}, {x: 7, y: 3}, {x: 7, y: 2}, {x: 7, y: 1},
            {x: 8, y: 1}, {x: 9, y: 1}, {x: 10, y: 1}, {x: 11, y: 1},
            {x: 11, y: 2}, {x: 11, y: 3}, {x: 11, y: 4}, {x: 11, y: 5}, {x: 11, y: 6},
            {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6},
            {x: 14, y: 7}, {x: 14, y: 8}, {x: 14, y: 9},
            {x: 13, y: 9}, {x: 12, y: 9}, {x: 11, y: 9}, {x: 10, y: 9},
            {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12},
            {x: 11, y: 12}, {x: 12, y: 12}, {x: 13, y: 12}, {x: 14, y: 12}, {x: 15, y: 12},
            {x: 15, y: 11}, {x: 15, y: 10}, {x: 15, y: 9}, {x: 15, y: 8}, {x: 15, y: 7},
            {x: 16, y: 7}, {x: 17, y: 7}, {x: 18, y: 7}, {x: 19, y: 7}
        ];
        
        // 怪物类型配置
        this.enemyTypes = {
            werewolf: {
                name: '狼人',
                color: '#8B4513',
                borderColor: '#654321',
                size: 14,
                shape: 'triangle'
            },
            bat: {
                name: '蝙蝠',
                color: '#4B0082',
                borderColor: '#2E0854',
                size: 10,
                shape: 'diamond'
            },
            goblin: {
                name: '哥布林',
                color: '#228B22',
                borderColor: '#006400',
                size: 12,
                shape: 'circle'
            },
            skeleton: {
                name: '骷髅',
                color: '#F5F5DC',
                borderColor: '#D3D3D3',
                size: 13,
                shape: 'square'
            },
            orc: {
                name: '兽人',
                color: '#006400',
                borderColor: '#004d00',
                size: 16,
                shape: 'triangle'
            },
            demon: {
                name: '恶魔',
                color: '#8B0000',
                borderColor: '#4B0000',
                size: 15,
                shape: 'diamond'
            },
            dragon: {
                name: '巨龙',
                color: '#FF4500',
                borderColor: '#CC3700',
                size: 18,
                shape: 'circle'
            },
            ghost: {
                name: '幽灵',
                color: '#E0E0E0',
                borderColor: '#B0B0B0',
                size: 11,
                shape: 'diamond'
            },
            vampire: {
                name: '吸血鬼',
                color: '#800080',
                borderColor: '#4B0082',
                size: 14,
                shape: 'square'
            },
            boss: {
                name: '魔王',
                color: '#000000',
                borderColor: '#FF0000',
                size: 20,
                shape: 'circle'
            }
        };
        
        // 波次配置 - 每波使用不同的怪物
        this.waveConfig = {
            1: { count: 5, interval: 1500, hp: 30, speed: 1, reward: 10, enemyType: 'werewolf' },
            2: { count: 8, interval: 1400, hp: 45, speed: 1.2, reward: 12, enemyType: 'bat' },
            3: { count: 12, interval: 1300, hp: 60, speed: 1.1, reward: 14, enemyType: 'goblin' },
            4: { count: 15, interval: 1200, hp: 80, speed: 1.3, reward: 16, enemyType: 'skeleton' },
            5: { count: 20, interval: 1100, hp: 100, speed: 1.2, reward: 18, enemyType: 'orc' },
            6: { count: 25, interval: 1000, hp: 130, speed: 1.4, reward: 20, enemyType: 'demon' },
            7: { count: 30, interval: 900, hp: 160, speed: 1.3, reward: 22, enemyType: 'dragon' },
            8: { count: 35, interval: 800, hp: 200, speed: 1.5, reward: 25, enemyType: 'ghost' },
            9: { count: 40, interval: 700, hp: 250, speed: 1.4, reward: 28, enemyType: 'vampire' },
            10: { count: 1, interval: 600, hp: 3000, speed: 0.8, reward: 500, enemyType: 'boss' }
        };
        
        // 塔配置 - 重新设计
        this.towerTypes = {
            ice: {
                name: '冰塔',
                cost: 80,
                damage: 12,
                range: 130,
                fireRate: 900,
                color: '#00CED1',
                projectileColor: '#87CEEB',
                projectileSpeed: 9,
                slow: 0.6,
                slowDuration: 2500,
                description: '减速效果'
            },
            fire: {
                name: '火塔',
                cost: 120,
                damage: 35,
                range: 110,
                fireRate: 1400,
                color: '#FF4500',
                projectileColor: '#FF6347',
                projectileSpeed: 7,
                splash: 70,
                description: '溅射伤害'
            },
            lightning: {
                name: '雷塔',
                cost: 150,
                damage: 50,
                range: 150,
                fireRate: 1100,
                color: '#FFD700',
                projectileColor: '#FFFF00',
                projectileSpeed: 12,
                chain: 3,
                description: '连锁攻击'
            },
            poison: {
                name: '毒塔',
                cost: 100,
                damage: 8,
                range: 120,
                fireRate: 1000,
                color: '#32CD32',
                projectileColor: '#7CFC00',
                projectileSpeed: 8,
                poison: 5,
                poisonDuration: 3000,
                description: '持续伤害'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // 塔选择按钮
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedTower = btn.dataset.tower;
            });
        });
        
        // 开始波次按钮
        document.getElementById('startWave').addEventListener('click', () => {
            if (!this.waveInProgress && !this.isGameOver) {
                this.startWave();
            }
        });
        
        // 暂停按钮
        document.getElementById('pauseGame').addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            document.getElementById('pauseGame').textContent = this.isPaused ? '继续游戏' : '暂停游戏';
        });
        
        // 重置按钮
        document.getElementById('resetGame').addEventListener('click', () => {
            location.reload();
        });
        
        // 画布点击事件
        this.canvas.addEventListener('click', (e) => {
            if (this.isGameOver || this.isPaused) return;
            this.handleCanvasClick(e);
        });
        
        // 鼠标移动事件
        this.canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    }
    
    handleCanvasClick(e) {
        if (!this.selectedTower) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        // 检查是否可以放置塔
        if (this.canPlaceTower(col, row)) {
            const towerType = this.towerTypes[this.selectedTower];
            if (this.gold >= towerType.cost) {
                this.placeTower(col, row, this.selectedTower);
                this.gold -= towerType.cost;
                this.updateUI();
            }
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    canPlaceTower(col, row) {
        // 检查边界
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return false;
        
        // 检查是否在路径上
        for (let pathCell of this.path) {
            if (pathCell.x === col && pathCell.y === row) return false;
        }
        
        // 检查是否已有塔
        for (let tower of this.towers) {
            if (tower.col === col && tower.row === row) return false;
        }
        
        return true;
    }
    
    placeTower(col, row, type) {
        const towerConfig = this.towerTypes[type];
        this.towers.push({
            col: col,
            row: row,
            x: col * this.cellSize + this.cellSize / 2,
            y: row * this.cellSize + this.cellSize / 2,
            type: type,
            lastFire: 0,
            ...towerConfig
        });
    }
    
    startWave() {
        this.waveInProgress = true;
        const config = this.waveConfig[this.wave] || this.waveConfig[10];
        let spawned = 0;
        
        const enemyType = this.enemyTypes[config.enemyType];
        document.getElementById('waveInfo').innerHTML = `
            <strong>第 ${this.wave} 波进行中</strong><br>
            敌人: ${enemyType.name} x${config.count}
        `;
        
        const spawnInterval = setInterval(() => {
            if (this.isGameOver) {
                clearInterval(spawnInterval);
                return;
            }
            
            if (spawned >= config.count) {
                clearInterval(spawnInterval);
                return;
            }
            
            this.spawnEnemy(config);
            spawned++;
        }, config.interval);
    }
    
    spawnEnemy(config) {
        const startPos = this.path[0];
        const enemyType = this.enemyTypes[config.enemyType];
        
        this.enemies.push({
            x: startPos.x * this.cellSize + this.cellSize / 2,
            y: startPos.y * this.cellSize + this.cellSize / 2,
            pathIndex: 0,
            hp: config.hp,
            maxHp: config.hp,
            speed: config.speed,
            baseSpeed: config.speed,
            reward: config.reward,
            slowEndTime: 0,
            poisonEndTime: 0,
            poisonDamage: 0,
            id: Math.random(),
            enemyType: config.enemyType,
            ...enemyType
        });
    }
    
    update(deltaTime) {
        if (this.isPaused || this.isGameOver) return;
        
        // 更新敌人
        this.updateEnemies(deltaTime);
        
        // 更新塔
        this.updateTowers(deltaTime);
        
        // 更新 projectile
        this.updateProjectiles(deltaTime);
        
        // 更新粒子效果
        this.updateParticles(deltaTime);
        
        // 检查波次结束
        this.checkWaveEnd();
        
        // 检查游戏结束
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    updateEnemies(deltaTime) {
        const now = Date.now();
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // 处理中毒效果
            if (now < enemy.poisonEndTime) {
                enemy.hp -= enemy.poisonDamage * deltaTime / 1000;
            }
            
            // 处理减速效果
            let currentSpeed = enemy.speed;
            if (now < enemy.slowEndTime) {
                currentSpeed = enemy.baseSpeed * 0.5;
            } else {
                currentSpeed = enemy.baseSpeed;
            }
            
            // 沿着路径移动
            if (enemy.pathIndex < this.path.length - 1) {
                const target = this.path[enemy.pathIndex + 1];
                const targetX = target.x * this.cellSize + this.cellSize / 2;
                const targetY = target.y * this.cellSize + this.cellSize / 2;
                
                const dx = targetX - enemy.x;
                const dy = targetY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 2) {
                    enemy.pathIndex++;
                } else {
                    const moveDistance = currentSpeed * deltaTime / 16;
                    enemy.x += (dx / distance) * moveDistance;
                    enemy.y += (dy / distance) * moveDistance;
                }
            } else {
                // 敌人到达终点
                this.lives--;
                this.enemies.splice(i, 1);
                this.updateUI();
                this.createParticles(enemy.x, enemy.y, '#ff0000', 10);
            }
            
            // 检查敌人死亡
            if (enemy.hp <= 0) {
                this.gold += enemy.reward;
                this.enemies.splice(i, 1);
                this.updateUI();
                this.createParticles(enemy.x, enemy.y, '#ffff00', 15);
            }
        }
    }
    
    updateTowers(deltaTime) {
        const now = Date.now();
        
        for (let tower of this.towers) {
            if (now - tower.lastFire < tower.fireRate) continue;
            
            // 寻找目标
            let target = null;
            let minDistance = Infinity;
            
            for (let enemy of this.enemies) {
                const dx = enemy.x - tower.x;
                const dy = enemy.y - tower.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= tower.range && distance < minDistance) {
                    minDistance = distance;
                    target = enemy;
                }
            }
            
            if (target) {
                this.fireProjectile(tower, target);
                tower.lastFire = now;
            }
        }
    }
    
    fireProjectile(tower, target) {
        const dx = target.x - tower.x;
        const dy = target.y - tower.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.projectiles.push({
            x: tower.x,
            y: tower.y,
            vx: (dx / distance) * tower.projectileSpeed,
            vy: (dy / distance) * tower.projectileSpeed,
            damage: tower.damage,
            color: tower.projectileColor,
            target: target,
            splash: tower.splash,
            slow: tower.slow,
            slowDuration: tower.slowDuration,
            poison: tower.poison,
            poisonDuration: tower.poisonDuration,
            chain: tower.chain,
            type: tower.type
        });
    }
    
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            
            // 更新位置
            proj.x += proj.vx * deltaTime / 16;
            proj.y += proj.vy * deltaTime / 16;
            
            // 检查是否击中目标
            let hit = false;
            
            if (proj.splash) {
                // 范围伤害（火塔）
                for (let enemy of this.enemies) {
                    const dx = enemy.x - proj.x;
                    const dy = enemy.y - proj.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance <= proj.splash) {
                        enemy.hp -= proj.damage;
                        hit = true;
                    }
                }
            } else if (proj.chain) {
                // 连锁攻击（雷塔）
                let targets = [];
                for (let enemy of this.enemies) {
                    const dx = enemy.x - proj.x;
                    const dy = enemy.y - proj.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 20) {
                        targets.push(enemy);
                    }
                }
                
                // 对最近的敌人造成伤害并连锁
                if (targets.length > 0) {
                    targets.sort((a, b) => {
                        const da = Math.sqrt((a.x - proj.x) ** 2 + (a.y - proj.y) ** 2);
                        const db = Math.sqrt((b.x - proj.x) ** 2 + (b.y - proj.y) ** 2);
                        return da - db;
                    });
                    
                    for (let j = 0; j < Math.min(proj.chain, targets.length); j++) {
                        targets[j].hp -= proj.damage;
                    }
                    hit = true;
                }
            } else {
                // 单体伤害
                if (proj.target && this.enemies.includes(proj.target)) {
                    const dx = proj.target.x - proj.x;
                    const dy = proj.target.y - proj.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 15) {
                        proj.target.hp -= proj.damage;
                        
                        // 减速效果（冰塔）
                        if (proj.slow) {
                            proj.target.slowEndTime = Date.now() + proj.slowDuration;
                        }
                        
                        // 中毒效果（毒塔）
                        if (proj.poison) {
                            proj.target.poisonEndTime = Date.now() + proj.poisonDuration;
                            proj.target.poisonDamage = proj.poison;
                        }
                        
                        hit = true;
                    }
                } else {
                    // 目标已死亡，检查其他敌人
                    for (let enemy of this.enemies) {
                        const dx = enemy.x - proj.x;
                        const dy = enemy.y - proj.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 15) {
                            enemy.hp -= proj.damage;
                            
                            if (proj.slow) {
                                enemy.slowEndTime = Date.now() + proj.slowDuration;
                            }
                            
                            if (proj.poison) {
                                enemy.poisonEndTime = Date.now() + proj.poisonDuration;
                                enemy.poisonDamage = proj.poison;
                            }
                            
                            hit = true;
                            break;
                        }
                    }
                }
            }
            
            // 检查是否超出边界或击中
            if (hit || proj.x < 0 || proj.x > this.canvas.width || 
                proj.y < 0 || proj.y > this.canvas.height) {
                if (hit) {
                    this.createParticles(proj.x, proj.y, proj.color, 8);
                }
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30,
                maxLife: 30,
                color: color,
                size: 3 + Math.random() * 3
            });
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx * deltaTime / 16;
            particle.y += particle.vy * deltaTime / 16;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkWaveEnd() {
        if (this.waveInProgress && this.enemies.length === 0) {
            // 检查是否还有敌人在生成中
            setTimeout(() => {
                if (this.enemies.length === 0 && this.waveInProgress) {
                    this.waveInProgress = false;
                    this.wave++;
                    this.gold += 50; // 波次奖励
                    this.updateUI();
                    
                    const nextWave = this.waveConfig[this.wave];
                    const enemyName = nextWave ? this.enemyTypes[nextWave.enemyType].name : '未知';
                    
                    document.getElementById('waveInfo').innerHTML = `
                        <strong>第 ${this.wave - 1} 波完成!</strong><br>
                        获得奖励: 50金币<br>
                        下一波: ${enemyName}
                    `;
                }
            }, 1000);
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#2d5016';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制路径
        this.drawPath();
        
        // 绘制塔
        this.drawTowers();
        
        // 绘制敌人
        this.drawEnemies();
        
        // 绘制 projectile
        this.drawProjectiles();
        
        // 绘制粒子效果
        this.drawParticles();
        
        // 绘制放置预览
        this.drawPlacementPreview();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawPath() {
        this.ctx.fillStyle = '#8B7355';
        
        for (let i = 0; i < this.path.length; i++) {
            const cell = this.path[i];
            this.ctx.fillRect(
                cell.x * this.cellSize,
                cell.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
        }
        
        // 绘制起点和终点
        const start = this.path[0];
        const end = this.path[this.path.length - 1];
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(
            start.x * this.cellSize + 5,
            start.y * this.cellSize + 5,
            this.cellSize - 10,
            this.cellSize - 10
        );
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            end.x * this.cellSize + 5,
            end.y * this.cellSize + 5,
            this.cellSize - 10,
            this.cellSize - 10
        );
    }
    
    drawTowers() {
        for (let tower of this.towers) {
            switch(tower.type) {
                case 'ice':
                    this.drawIceTower(tower);
                    break;
                case 'fire':
                    this.drawFireTower(tower);
                    break;
                case 'lightning':
                    this.drawLightningTower(tower);
                    break;
                case 'poison':
                    this.drawPoisonTower(tower);
                    break;
            }
        }
    }
    
    drawIceTower(tower) {
        const ctx = this.ctx;
        const x = tower.x;
        const y = tower.y;
        
        // 石质底座
        ctx.fillStyle = '#5a6a7a';
        ctx.beginPath();
        ctx.moveTo(x - 16, y + 14);
        ctx.lineTo(x + 16, y + 14);
        ctx.lineTo(x + 12, y + 4);
        ctx.lineTo(x - 12, y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3a4a5a';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 塔身 - 冰蓝色渐变
        const grad = ctx.createLinearGradient(x - 10, y - 16, x + 10, y + 4);
        grad.addColorStop(0, '#B0E0E6');
        grad.addColorStop(0.5, '#00CED1');
        grad.addColorStop(1, '#4682B4');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 10, y + 4);
        ctx.lineTo(x + 10, y + 4);
        ctx.lineTo(x + 6, y - 14);
        ctx.lineTo(x - 6, y - 14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1E90FF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 冰晶顶部 - 六角形
        ctx.fillStyle = '#E0FFFF';
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2 / 6) - Math.PI / 2;
            const px = x + Math.cos(angle) * 8;
            const py = y - 16 + Math.sin(angle) * 8;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 冰晶内部光芒
        ctx.fillStyle = '#FFF';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(x, y - 16, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // 冰晶碎片装饰
        ctx.strokeStyle = '#B0E0E6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 4);
        ctx.lineTo(x - 16, y - 8);
        ctx.moveTo(x + 12, y - 4);
        ctx.lineTo(x + 16, y - 8);
        ctx.stroke();
    }
    
    drawFireTower(tower) {
        const ctx = this.ctx;
        const x = tower.x;
        const y = tower.y;
        
        // 石质底座
        ctx.fillStyle = '#6a4a3a';
        ctx.beginPath();
        ctx.moveTo(x - 16, y + 14);
        ctx.lineTo(x + 16, y + 14);
        ctx.lineTo(x + 12, y + 4);
        ctx.lineTo(x - 12, y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#4a2a1a';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 塔身 - 火红色渐变
        const grad = ctx.createLinearGradient(x - 10, y - 16, x + 10, y + 4);
        grad.addColorStop(0, '#FF6347');
        grad.addColorStop(0.5, '#FF4500');
        grad.addColorStop(1, '#8B0000');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 10, y + 4);
        ctx.lineTo(x + 10, y + 4);
        ctx.lineTo(x + 7, y - 12);
        ctx.lineTo(x - 7, y - 12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#CC3700';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 火焰口
        ctx.fillStyle = '#2a0a0a';
        ctx.beginPath();
        ctx.arc(x, y - 12, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 火焰
        const time = Date.now() / 200;
        for (let i = 0; i < 3; i++) {
            const flicker = Math.sin(time + i * 2) * 2;
            ctx.fillStyle = i === 0 ? '#FF4500' : i === 1 ? '#FF6347' : '#FFD700';
            ctx.globalAlpha = 1 - i * 0.2;
            ctx.beginPath();
            ctx.moveTo(x - 4 + i, y - 12);
            ctx.quadraticCurveTo(x - 3 + flicker, y - 22 - i * 3 + flicker, x + flicker * 0.5, y - 26 - i * 2);
            ctx.quadraticCurveTo(x + 3 + flicker, y - 22 - i * 3 + flicker, x + 4 - i, y - 12);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // 火焰光芒
        ctx.fillStyle = '#FFD700';
        ctx.globalAlpha = 0.4 + Math.sin(time) * 0.2;
        ctx.beginPath();
        ctx.arc(x, y - 18, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    drawLightningTower(tower) {
        const ctx = this.ctx;
        const x = tower.x;
        const y = tower.y;
        
        // 石质底座
        ctx.fillStyle = '#5a5a3a';
        ctx.beginPath();
        ctx.moveTo(x - 16, y + 14);
        ctx.lineTo(x + 16, y + 14);
        ctx.lineTo(x + 12, y + 4);
        ctx.lineTo(x - 12, y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3a3a1a';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 塔身 - 金色渐变
        const grad = ctx.createLinearGradient(x - 10, y - 16, x + 10, y + 4);
        grad.addColorStop(0, '#FFD700');
        grad.addColorStop(0.5, '#DAA520');
        grad.addColorStop(1, '#B8860B');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 10, y + 4);
        ctx.lineTo(x + 10, y + 4);
        ctx.lineTo(x + 4, y - 16);
        ctx.lineTo(x - 4, y - 16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 金属环装饰
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 9, y);
        ctx.lineTo(x + 9, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 7, y - 6);
        ctx.lineTo(x + 7, y - 6);
        ctx.stroke();
        
        // 顶部避雷针
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y - 16);
        ctx.lineTo(x, y - 26);
        ctx.stroke();
        
        // 避雷针顶端球
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y - 27, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 闪电效果
        const time = Date.now() / 300;
        const flash = Math.sin(time) > 0.7;
        if (flash) {
            ctx.strokeStyle = '#FFFF00';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(x, y - 27);
            ctx.lineTo(x - 4, y - 20);
            ctx.lineTo(x + 2, y - 20);
            ctx.lineTo(x - 2, y - 14);
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            // 电弧光芒
            ctx.fillStyle = '#FFFF00';
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(x, y - 27, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    drawPoisonTower(tower) {
        const ctx = this.ctx;
        const x = tower.x;
        const y = tower.y;
        
        // 石质底座
        ctx.fillStyle = '#3a5a3a';
        ctx.beginPath();
        ctx.moveTo(x - 16, y + 14);
        ctx.lineTo(x + 16, y + 14);
        ctx.lineTo(x + 12, y + 4);
        ctx.lineTo(x - 12, y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#1a3a1a';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 塔身 - 绿色渐变
        const grad = ctx.createLinearGradient(x - 10, y - 16, x + 10, y + 4);
        grad.addColorStop(0, '#7CFC00');
        grad.addColorStop(0.5, '#32CD32');
        grad.addColorStop(1, '#006400');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 10, y + 4);
        ctx.lineTo(x + 10, y + 4);
        ctx.lineTo(x + 8, y - 10);
        ctx.lineTo(x - 8, y - 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 毒液罐 - 圆形
        ctx.fillStyle = '#2E8B57';
        ctx.beginPath();
        ctx.arc(x, y - 14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 毒液罐高光
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(x - 2, y - 16, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 毒液冒泡效果
        const time = Date.now() / 500;
        ctx.fillStyle = '#7CFC00';
        for (let i = 0; i < 3; i++) {
            const bx = x + Math.sin(time + i * 2.5) * 4;
            const by = y - 20 - ((time * 3 + i * 10) % 8);
            const bs = 1.5 + Math.sin(time + i) * 0.5;
            ctx.globalAlpha = 0.6 - ((time * 3 + i * 10) % 8) / 12;
            ctx.beginPath();
            ctx.arc(bx, by, bs, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // 骷髅标记
        ctx.fillStyle = '#FFF';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y - 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#006400';
        ctx.beginPath();
        ctx.arc(x - 1.5, y - 15, 1, 0, Math.PI * 2);
        ctx.arc(x + 1.5, y - 15, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    drawEnemies() {
        for (let enemy of this.enemies) {
            const now = Date.now();
            const isSlowed = now < enemy.slowEndTime;
            const isPoisoned = now < enemy.poisonEndTime;
            
            // 根据怪物类型绘制精美形象
            this.drawEnemyByType(enemy, isSlowed);
            
            // 如果中毒，绘制绿色光环
            if (isPoisoned) {
                this.ctx.strokeStyle = '#32CD32';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(enemy.x, enemy.y, enemy.size + 4, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // 如果减速，绘制蓝色光环
            if (isSlowed) {
                this.ctx.strokeStyle = '#87CEEB';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(enemy.x, enemy.y, enemy.size + 2, 0, Math.PI * 2);
                this.ctx.stroke();
            }
            
            // 绘制血条背景
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(enemy.x - 15, enemy.y - enemy.size - 10, 30, 5);
            
            // 绘制血条
            const hpPercent = enemy.hp / enemy.maxHp;
            this.ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
            this.ctx.fillRect(enemy.x - 15, enemy.y - enemy.size - 10, 30 * hpPercent, 5);
        }
    }
    
    drawEnemyByType(enemy, isSlowed) {
        const ctx = this.ctx;
        const x = enemy.x;
        const y = enemy.y;
        const s = enemy.size;
        
        switch(enemy.enemyType) {
            case 'werewolf':
                this.drawWerewolf(ctx, x, y, s, isSlowed);
                break;
            case 'bat':
                this.drawBat(ctx, x, y, s, isSlowed);
                break;
            case 'goblin':
                this.drawGoblin(ctx, x, y, s, isSlowed);
                break;
            case 'skeleton':
                this.drawSkeleton(ctx, x, y, s, isSlowed);
                break;
            case 'orc':
                this.drawOrc(ctx, x, y, s, isSlowed);
                break;
            case 'demon':
                this.drawDemon(ctx, x, y, s, isSlowed);
                break;
            case 'dragon':
                this.drawDragon(ctx, x, y, s, isSlowed);
                break;
            case 'ghost':
                this.drawGhost(ctx, x, y, s, isSlowed);
                break;
            case 'vampire':
                this.drawVampire(ctx, x, y, s, isSlowed);
                break;
            case 'boss':
                this.drawBoss(ctx, x, y, s, isSlowed);
                break;
            default:
                // 默认圆形
                ctx.fillStyle = enemy.color;
                ctx.beginPath();
                ctx.arc(x, y, s, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = enemy.borderColor;
                ctx.lineWidth = 2;
                ctx.stroke();
        }
    }
    
    drawWerewolf(ctx, x, y, s, isSlowed) {
        // 狼人 - 狼头造型
        const color = isSlowed ? '#5BA3C6' : '#8B4513';
        
        // 头部
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.8, s, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 耳朵
        ctx.beginPath();
        ctx.moveTo(x - s * 0.6, y - s * 0.5);
        ctx.lineTo(x - s * 0.8, y - s * 1.2);
        ctx.lineTo(x - s * 0.3, y - s * 0.6);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + s * 0.6, y - s * 0.5);
        ctx.lineTo(x + s * 0.8, y - s * 1.2);
        ctx.lineTo(x + s * 0.3, y - s * 0.6);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x - s * 0.3, y - s * 0.2, s * 0.15, 0, Math.PI * 2);
        ctx.arc(x + s * 0.3, y - s * 0.2, s * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻子
        ctx.fillStyle = '#2a1a0a';
        ctx.beginPath();
        ctx.arc(x, y + s * 0.2, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#4a2a0a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.8, s, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawBat(ctx, x, y, s, isSlowed) {
        // 蝙蝠 - 展翅造型
        const color = isSlowed ? '#6B4CA6' : '#4B0082';
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.4, s * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 翅膀
        ctx.fillStyle = isSlowed ? '#5a3a7a' : '#3a0060';
        // 左翅膀
        ctx.beginPath();
        ctx.moveTo(x - s * 0.3, y);
        ctx.quadraticCurveTo(x - s * 1.2, y - s * 0.5, x - s, y + s * 0.3);
        ctx.quadraticCurveTo(x - s * 0.6, y + s * 0.2, x - s * 0.3, y);
        ctx.fill();
        
        // 右翅膀
        ctx.beginPath();
        ctx.moveTo(x + s * 0.3, y);
        ctx.quadraticCurveTo(x + s * 1.2, y - s * 0.5, x + s, y + s * 0.3);
        ctx.quadraticCurveTo(x + s * 0.6, y + s * 0.2, x + s * 0.3, y);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x - s * 0.15, y - s * 0.2, s * 0.1, 0, Math.PI * 2);
        ctx.arc(x + s * 0.15, y - s * 0.2, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#2a0040';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.4, s * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawGoblin(ctx, x, y, s, isSlowed) {
        // 哥布林 - 绿色小怪物
        const color = isSlowed ? '#5BA3A3' : '#228B22';
        
        // 头部
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // 耳朵
        ctx.fillStyle = isSlowed ? '#4a8a8a' : '#1a6a1a';
        ctx.beginPath();
        ctx.ellipse(x - s * 0.7, y - s * 0.3, s * 0.3, s * 0.5, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + s * 0.7, y - s * 0.3, s * 0.3, s * 0.5, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(x - s * 0.25, y - s * 0.1, s * 0.2, 0, Math.PI * 2);
        ctx.arc(x + s * 0.25, y - s * 0.1, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - s * 0.25, y - s * 0.1, s * 0.1, 0, Math.PI * 2);
        ctx.arc(x + s * 0.25, y - s * 0.1, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻子
        ctx.fillStyle = isSlowed ? '#3a7a7a' : '#1a5a1a';
        ctx.beginPath();
        ctx.arc(x, y + s * 0.25, s * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#0a4a0a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawSkeleton(ctx, x, y, s, isSlowed) {
        // 骷髅 - 骷髅头
        const color = isSlowed ? '#A3C3C3' : '#F5F5DC';
        
        // 头骨
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y - s * 0.1, s * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // 下颚
        ctx.beginPath();
        ctx.ellipse(x, y + s * 0.5, s * 0.5, s * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼眶
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x - s * 0.3, y - s * 0.15, s * 0.25, s * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + s * 0.3, y - s * 0.15, s * 0.25, s * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻孔
        ctx.beginPath();
        ctx.moveTo(x, y + s * 0.1);
        ctx.lineTo(x - s * 0.1, y + s * 0.25);
        ctx.lineTo(x + s * 0.1, y + s * 0.25);
        ctx.fill();
        
        // 牙齿
        ctx.fillStyle = color;
        for (let i = -2; i <= 2; i++) {
            ctx.fillRect(x + i * s * 0.15 - s * 0.05, y + s * 0.4, s * 0.1, s * 0.15);
        }
        
        // 边框
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y - s * 0.1, s * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawOrc(ctx, x, y, s, isSlowed) {
        // 兽人 - 大型绿色怪物
        const color = isSlowed ? '#4a8a4a' : '#006400';
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.9, 0, Math.PI * 2);
        ctx.fill();
        
        // 獠牙
        ctx.fillStyle = '#FFFFF0';
        ctx.beginPath();
        ctx.moveTo(x - s * 0.4, y + s * 0.2);
        ctx.lineTo(x - s * 0.5, y + s * 0.8);
        ctx.lineTo(x - s * 0.3, y + s * 0.3);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + s * 0.4, y + s * 0.2);
        ctx.lineTo(x + s * 0.5, y + s * 0.8);
        ctx.lineTo(x + s * 0.3, y + s * 0.3);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x - s * 0.3, y - s * 0.2, s * 0.18, 0, Math.PI * 2);
        ctx.arc(x + s * 0.3, y - s * 0.2, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#003a00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.9, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawDemon(ctx, x, y, s, isSlowed) {
        // 恶魔 - 红色恶魔
        const color = isSlowed ? '#8a4a4a' : '#8B0000';
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.85, 0, Math.PI * 2);
        ctx.fill();
        
        // 角
        ctx.fillStyle = '#2a0a0a';
        ctx.beginPath();
        ctx.moveTo(x - s * 0.5, y - s * 0.5);
        ctx.lineTo(x - s * 0.7, y - s * 1.3);
        ctx.lineTo(x - s * 0.2, y - s * 0.6);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + s * 0.5, y - s * 0.5);
        ctx.lineTo(x + s * 0.7, y - s * 1.3);
        ctx.lineTo(x + s * 0.2, y - s * 0.6);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(x - s * 0.25, y - s * 0.15, s * 0.15, 0, Math.PI * 2);
        ctx.arc(x + s * 0.25, y - s * 0.15, s * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#4a0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.85, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawDragon(ctx, x, y, s, isSlowed) {
        // 巨龙 - 龙头
        const color = isSlowed ? '#C67a4a' : '#FF4500';
        
        // 头部
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.9, s * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 角
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(x - s * 0.6, y - s * 0.4);
        ctx.lineTo(x - s * 0.9, y - s * 1.2);
        ctx.lineTo(x - s * 0.3, y - s * 0.5);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + s * 0.6, y - s * 0.4);
        ctx.lineTo(x + s * 0.9, y - s * 1.2);
        ctx.lineTo(x + s * 0.3, y - s * 0.5);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(x - s * 0.35, y - s * 0.1, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
        ctx.ellipse(x + s * 0.35, y - s * 0.1, s * 0.18, s * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻孔
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(x - s * 0.2, y + s * 0.3, s * 0.1, 0, Math.PI * 2);
        ctx.arc(x + s * 0.2, y + s * 0.3, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#CC3700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.9, s * 0.7, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawGhost(ctx, x, y, s, isSlowed) {
        // 幽灵 - 半透明幽灵
        ctx.globalAlpha = isSlowed ? 0.5 : 0.7;
        
        // 身体
        ctx.fillStyle = isSlowed ? '#A3C3C3' : '#E0E0E0';
        ctx.beginPath();
        ctx.arc(x, y - s * 0.3, s * 0.8, Math.PI, 0);
        ctx.lineTo(x + s * 0.8, y + s * 0.6);
        // 波浪底部
        for (let i = 0; i <= 4; i++) {
            const px = x + s * 0.8 - i * s * 0.4;
            const py = y + s * 0.6 + (i % 2 === 0 ? 0 : s * 0.3);
            ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x - s * 0.25, y - s * 0.3, s * 0.15, s * 0.2, 0, 0, Math.PI * 2);
        ctx.ellipse(x + s * 0.25, y - s * 0.3, s * 0.15, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        
        // 边框
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(x, y - s * 0.3, s * 0.8, Math.PI, 0);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    drawVampire(ctx, x, y, s, isSlowed) {
        // 吸血鬼 - 吸血鬼脸
        const color = isSlowed ? '#6a4a6a' : '#800080';
        
        // 脸部
        ctx.fillStyle = '#F5F5DC';
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.7, s * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 头发
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x, y - s * 0.5, s * 0.75, s * 0.5, 0, Math.PI, 0);
        ctx.fill();
        
        // 眼睛
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x - s * 0.25, y - s * 0.1, s * 0.15, s * 0.2, 0, 0, Math.PI * 2);
        ctx.ellipse(x + s * 0.25, y - s * 0.1, s * 0.15, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 尖牙
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(x - s * 0.2, y + s * 0.35);
        ctx.lineTo(x - s * 0.15, y + s * 0.6);
        ctx.lineTo(x - s * 0.1, y + s * 0.35);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(x + s * 0.2, y + s * 0.35);
        ctx.lineTo(x + s * 0.15, y + s * 0.6);
        ctx.lineTo(x + s * 0.1, y + s * 0.35);
        ctx.fill();
        
        // 边框
        ctx.strokeStyle = '#4a004a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.7, s * 0.85, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawBoss(ctx, x, y, s, isSlowed) {
        // 魔王 - 大BOSS
        const color = isSlowed ? '#4a4a4a' : '#1a0a0a';
        
        // 身体
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.95, 0, Math.PI * 2);
        ctx.fill();
        
        // 多个角
        ctx.fillStyle = '#8B0000';
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2 / 6) - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * s * 0.6, y + Math.sin(angle) * s * 0.6);
            ctx.lineTo(x + Math.cos(angle - 0.2) * s * 1.3, y + Math.sin(angle - 0.2) * s * 1.3);
            ctx.lineTo(x + Math.cos(angle + 0.2) * s * 1.3, y + Math.sin(angle + 0.2) * s * 1.3);
            ctx.closePath();
            ctx.fill();
        }
        
        // 眼睛
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(x - s * 0.3, y - s * 0.2, s * 0.2, 0, Math.PI * 2);
        ctx.arc(x + s * 0.3, y - s * 0.2, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 瞳孔
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(x - s * 0.3, y - s * 0.2, s * 0.1, 0, Math.PI * 2);
        ctx.arc(x + s * 0.3, y - s * 0.2, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // 嘴巴
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y + s * 0.3, s * 0.4, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // 边框
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, s * 0.95, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawProjectiles() {
        for (let proj of this.projectiles) {
            this.ctx.fillStyle = proj.color;
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawParticles() {
        for (let particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }
    
    drawPlacementPreview() {
        if (!this.selectedTower || !this.mouseX || !this.mouseY) return;
        
        const col = Math.floor(this.mouseX / this.cellSize);
        const row = Math.floor(this.mouseY / this.cellSize);
        
        const canPlace = this.canPlaceTower(col, row);
        const towerType = this.towerTypes[this.selectedTower];
        const hasEnoughGold = this.gold >= towerType.cost;
        
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        
        // 绘制预览框
        this.ctx.fillStyle = canPlace && hasEnoughGold ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)';
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        
        this.ctx.strokeStyle = canPlace && hasEnoughGold ? '#00ff00' : '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
        
        // 绘制攻击范围预览
        if (canPlace && hasEnoughGold) {
            const centerX = x + this.cellSize / 2;
            const centerY = y + this.cellSize / 2;
            
            this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, towerType.range, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    updateUI() {
        document.getElementById('gold').textContent = this.gold;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('enemies').textContent = this.enemies.length;
        
        // 更新塔按钮状态
        document.querySelectorAll('.tower-btn').forEach(btn => {
            const towerType = btn.dataset.tower;
            const cost = this.towerTypes[towerType].cost;
            
            if (this.gold < cost) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });
    }
    
    gameOver() {
        this.isGameOver = true;
        document.getElementById('gameOverTitle').textContent = this.lives <= 0 ? '游戏结束' : '恭喜通关!';
        document.getElementById('gameOverText').textContent = `你坚持了 ${this.wave - 1} 波！`;
        document.getElementById('gameOverModal').style.display = 'flex';
    }
    
    gameLoop() {
        let lastTime = 0;
        
        const loop = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.update(deltaTime);
            this.draw();
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
}

// 启动游戏
window.onload = () => {
    new TowerDefenseGame();
};
