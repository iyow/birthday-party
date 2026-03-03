// 接金币游戏
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-game');
const restartBtn = document.getElementById('restart-game');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

// 设置画布大小
canvas.width = 800;
canvas.height = 500;

// 游戏状态
let gameState = {
    score: 0,
    lives: 3,
    isPlaying: false,
    coins: [],
    bag: { x: canvas.width / 2 - 30, y: canvas.height - 80, width: 60, height: 60 },
    animationId: null
};

// 金币类
class Coin {
    constructor() {
        this.x = Math.random() * (canvas.width - 30);
        this.y = -30;
        this.radius = 15;
        this.speed = 3 + Math.random() * 2;
        this.rotation = 0;
        this.rotationSpeed = 0.1;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // 金币主体
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 金币中心的$
        ctx.fillStyle = '#DAA520';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('¥', 0, 0);

        ctx.restore();
    }

    isOffScreen() {
        return this.y > canvas.height + this.radius;
    }

    collidesWith(bag) {
        const coinCenter = this.y + this.radius;
        const coinLeft = this.x - this.radius;
        const coinRight = this.x + this.radius;

        return (
            coinCenter >= bag.y &&
            coinCenter <= bag.y + bag.height &&
            coinRight >= bag.x &&
            coinLeft <= bag.x + bag.width
        );
    }
}

// 绘制钱袋子
function drawBag() {
    const bag = gameState.bag;

    // 袋子主体
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(bag.x, bag.y + 20);
    ctx.lineTo(bag.x + bag.width / 2, bag.y);
    ctx.lineTo(bag.x + bag.width, bag.y + 20);
    ctx.lineTo(bag.x + bag.width, bag.y + bag.height);
    ctx.lineTo(bag.x, bag.y + bag.height);
    ctx.closePath();
    ctx.fill();

    // 袋子口
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.moveTo(bag.x, bag.y + 20);
    ctx.lineTo(bag.x + bag.width / 2, bag.y + 5);
    ctx.lineTo(bag.x + bag.width, bag.y + 20);
    ctx.closePath();
    ctx.fill();

    // 袋子上的$符号
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', bag.x + bag.width / 2, bag.y + bag.height / 2);
}

// 生成金币
function spawnCoin() {
    if (!gameState.isPlaying) return;
    gameState.coins.push(new Coin());
    setTimeout(spawnCoin, 800 + Math.random() * 1200);
}

// 更新游戏状态
function update() {
    if (!gameState.isPlaying) return;

    // 更新金币
    gameState.coins.forEach((coin, index) => {
        coin.update();

        // 检查碰撞
        if (coin.collidesWith(gameState.bag)) {
            gameState.score += 10;
            scoreDisplay.textContent = gameState.score;
            gameState.coins.splice(index, 1);
        }
        // 检查是否掉出屏幕
        else if (coin.isOffScreen()) {
            gameState.lives--;
            livesDisplay.textContent = gameState.lives;
            gameState.coins.splice(index, 1);

            if (gameState.lives <= 0) {
                endGame();
            }
        }
    });
}

// 渲染游戏
function render() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制装饰性星星
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 20; i++) {
        const x = (i * 40 + Date.now() * 0.01) % canvas.width;
        const y = (i * 30) % canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // 绘制金币
    gameState.coins.forEach(coin => coin.draw());

    // 绘制钱袋子
    drawBag();
}

// 游戏循环
function gameLoop() {
    if (!gameState.isPlaying) return;
    update();
    render();
    gameState.animationId = requestAnimationFrame(gameLoop);
}

// 开始游戏
function startGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.coins = [];
    gameState.isPlaying = true;

    scoreDisplay.textContent = gameState.score;
    livesDisplay.textContent = gameState.lives;

    startBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');

    spawnCoin();
    gameLoop();
}

// 结束游戏
function endGame() {
    gameState.isPlaying = false;
    cancelAnimationFrame(gameState.animationId);

    // 显示游戏结束画面
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = 'bold 32px Arial';
    ctx.fillText(`最终得分: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 20);

    restartBtn.classList.remove('hidden');
}

// 鼠标移动控制钱袋子
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    gameState.bag.x = mouseX - gameState.bag.width / 2;

    // 确保袋子不超出边界
    if (gameState.bag.x < 0) gameState.bag.x = 0;
    if (gameState.bag.x + gameState.bag.width > canvas.width) {
        gameState.bag.x = canvas.width - gameState.bag.width;
    }
});

// 触摸屏支持
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    gameState.bag.x = touchX - gameState.bag.width / 2;

    if (gameState.bag.x < 0) gameState.bag.x = 0;
    if (gameState.bag.x + gameState.bag.width > canvas.width) {
        gameState.bag.x = canvas.width - gameState.bag.width;
    }
});

// 初始渲染
render();

// 事件监听
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// 生日蛋糕吹蜡烛
const blowBtn = document.getElementById('blow-candles');
const wishResult = document.getElementById('wish-result');
const candles = document.querySelectorAll('.candle');

blowBtn.addEventListener('click', () => {
    // 吹灭所有蜡烛
    candles.forEach((candle, index) => {
        setTimeout(() => {
            const flame = candle.querySelector('.flame');
            flame.style.animation = 'flameExtinguish 0.5s ease-out forwards';
        }, index * 300);
    });

    // 显示愿望结果
    setTimeout(() => {
        wishResult.classList.remove('hidden');
        blowBtn.disabled = true;
        blowBtn.textContent = '愿望已发送';
        blowBtn.style.opacity = '0.6';
    }, 1500);
});

// 添加火焰熄灭动画
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes flameExtinguish {
        to {
            transform: translateX(-50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// 3D漫游游戏切换逻辑
document.addEventListener('DOMContentLoaded', function() {
    const gameSelectorBtns = document.querySelectorAll('.game-selector-btn');
    const gameTitle = document.getElementById('game-title');
    const gameInstruction = document.getElementById('game-instruction');
    const gameCanvas = document.getElementById('game-canvas');
    const cakeGameControls = document.getElementById('cake-game-controls');
    const roamingGameContainer = document.getElementById('roaming-game-container');
    
    // 游戏说明文本
    const gameInstructions = {
        coins: {
            title: '🎮 接金币游戏',
            instruction: '移动鼠标控制钱袋子接住掉落的金币！<br>不要让金币掉到地上，否则会损失生命！'
        },
        cake: {
            title: '🎂 蛋糕装饰游戏',
            instruction: '选择装饰品来装饰生日蛋糕！<br>每个装饰品都有不同的价格，尽情发挥创意吧！'
        },
        roaming: {
            title: '🎮 3D漫游游戏',
            instruction: '在3D生日派对世界中自由探索！<br>使用WASD移动，鼠标控制视角，空格跳跃，收集金币和礼物！'
        }
    };
    
    gameSelectorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const gameType = this.dataset.game;
            
            // 更新按钮状态
            gameSelectorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新游戏标题和说明
            gameTitle.textContent = gameInstructions[gameType].title;
            gameInstruction.innerHTML = gameInstructions[gameType].instruction;
            
            // 切换游戏显示
            switch(gameType) {
                case 'coins':
                    gameCanvas.style.display = 'block';
                    cakeGameControls.classList.add('hidden');
                    roamingGameContainer.classList.add('hidden');
                    break;
                case 'cake':
                    gameCanvas.style.display = 'none';
                    cakeGameControls.classList.remove('hidden');
                    roamingGameContainer.classList.add('hidden');
                    break;
                case 'roaming':
                    gameCanvas.style.display = 'none';
                    cakeGameControls.classList.add('hidden');
                    roamingGameContainer.classList.remove('hidden');
                    break;
            }
        });
    });
    
    // 3D漫游游戏按钮事件
    document.getElementById('roaming-start-btn').addEventListener('click', function() {
        // 重置游戏状态
        document.getElementById('roaming-score').textContent = '0';
        document.getElementById('roaming-gifts').textContent = '0';
        
        // 切换到3D游戏页面
        window.location.href = 'roaming-game.html';
    });
    
    document.getElementById('roaming-back-btn').addEventListener('click', function() {
        // 返回主菜单
        window.location.reload();
    });
});
