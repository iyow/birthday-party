// 生日蛋糕装饰游戏 - 灵感来自 folio-2025 的交互动画风格
// by 海绵宝宝 🧽

class BirthdayCakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        // 游戏状态
        this.gameState = {
            isPlaying: false,
            decorations: [],
            selectedDecoration: null,
            score: 0
        };
        
        // 装饰品种类
        this.decorationTypes = [
            { name: '蜡烛', emoji: '🕯️', color: '#FFD700', price: 10 },
            { name: '樱桃', emoji: '🍒', color: '#FF6B6B', price: 15 },
            { name: '星星', emoji: '⭐', color: '#FFD700', price: 20 },
            { name: '花朵', emoji: '🌸', color: '#FFB6C1', price: 25 },
            { name: '金币', emoji: '💰', color: '#FFD700', price: 30 },
            { name: '爱心', emoji: '❤️', color: '#FF6B6B', price: 35 }
        ];
        
        // 粒子系统
        this.particles = [];
        
        // 蛋糕位置
        this.cake = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2 - 30,
            width: 200,
            height: 120
        };
        
        this.init();
    }
    
    init() {
        // 绑定事件
        this.bindEvents();
        
        // 初始渲染
        this.render();
    }
    
    bindEvents() {
        // 装饰品选择
        document.addEventListener('click', (e) => {
            if (e.target.closest('.decoration-item') && !this.gameState.isPlaying) {
                const index = e.target.closest('.decoration-item').dataset.index;
                this.selectDecoration(index);
            }
        });
        
        // 开始装饰按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'start-decoration-game') {
                this.startGame();
            }
        });
        
        // 重新开始按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'reset-decoration-game') {
                this.resetGame();
            }
        });
        
        // 在蛋糕上放置装饰品
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameState.isPlaying || !this.gameState.selectedDecoration) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 检查点击是否在蛋糕范围内
            if (this.isPointInCake(x, y)) {
                this.placeDecoration(x, y);
            }
        });
        
        // 鼠标移动显示预览
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.gameState.isPlaying || !this.gameState.selectedDecoration) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.mouseX = x;
            this.mouseY = y;
        });
    }
    
    selectDecoration(index) {
        this.gameState.selectedDecoration = this.decorationTypes[index];
        
        // 高亮选中的装饰品
        document.querySelectorAll('.decoration-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.decoration-item[data-index="${index}"]`).classList.add('selected');
    }
    
    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.score = 0;
        this.gameState.decorations = [];
        this.particles = [];
        
        document.getElementById('start-decoration-game').classList.add('hidden');
        document.getElementById('reset-decoration-game').classList.remove('hidden');
        document.getElementById('score').textContent = this.gameState.score;
        
        // 开始粒子动画
        this.animate();
    }
    
    resetGame() {
        this.gameState.isPlaying = false;
        this.gameState.decorations = [];
        this.particles = [];
        this.gameState.selectedDecoration = null;
        
        document.getElementById('start-decoration-game').classList.remove('hidden');
        document.getElementById('reset-decoration-game').classList.add('hidden');
        document.getElementById('score').textContent = '0';
        
        // 清除选中状态
        document.querySelectorAll('.decoration-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        this.render();
    }
    
    isPointInCake(x, y) {
        // 简单的矩形碰撞检测
        return x > this.cake.x - this.cake.width/2 && 
               x < this.cake.x + this.cake.width/2 &&
               y > this.cake.y - this.cake.height/2 && 
               y < this.cake.y + this.cake.height/2;
    }
    
    placeDecoration(x, y) {
        if (!this.gameState.selectedDecoration) return;
        
        // 添加装饰品
        const decoration = {
            x: x,
            y: y,
            type: this.gameState.selectedDecoration,
            rotation: Math.random() * Math.PI * 2,
            scale: 0.8 + Math.random() * 0.4
        };
        
        this.gameState.decorations.push(decoration);
        this.gameState.score += decoration.type.price;
        
        // 创建粒子效果
        this.createParticles(x, y, decoration.type.color);
        
        // 更新分数显示
        document.getElementById('score').textContent = this.gameState.score;
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 3 + 1,
                color: color,
                life: 30,
                decay: 0.95
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.radius *= p.decay;
            
            if (p.life <= 0 || p.radius <= 0.5) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    drawCake() {
        const ctx = this.ctx;
        const cake = this.cake;
        
        // 蛋糕底座
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(cake.x - cake.width/2, cake.y + cake.height/2 - 20, cake.width, 20);
        
        // 蛋糕主体（三层）
        // 第三层
        ctx.fillStyle = '#F5DEB3';
        ctx.fillRect(cake.x - cake.width/2 + 10, cake.y + cake.height/2 - 60, cake.width - 20, 30);
        
        // 第二层
        ctx.fillStyle = '#FFE4B5';
        ctx.fillRect(cake.x - cake.width/2 + 20, cake.y + cake.height/2 - 90, cake.width - 40, 25);
        
        // 第一层
        ctx.fillStyle = '#FFDEAD';
        ctx.fillRect(cake.x - cake.width/2 + 30, cake.y + cake.height/2 - 110, cake.width - 60, 20);
        
        // 蛋糕顶部的奶油
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(cake.x, cake.y + cake.height/2 - 110, cake.width/2 - 30, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDecorations() {
        const ctx = this.ctx;
        
        // 绘制所有装饰品
        this.gameState.decorations.forEach(deco => {
            ctx.save();
            ctx.translate(deco.x, deco.y);
            ctx.rotate(deco.rotation);
            ctx.scale(deco.scale, deco.scale);
            
            // 绘制装饰品背景圆
            ctx.fillStyle = deco.type.color + '40'; // 半透明
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制装饰品emoji
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(deco.type.emoji, 0, 0);
            
            ctx.restore();
        });
        
        // 绘制预览装饰品
        if (this.gameState.isPlaying && this.gameState.selectedDecoration && this.mouseX && this.mouseY) {
            if (this.isPointInCake(this.mouseX, this.mouseY)) {
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.translate(this.mouseX, this.mouseY);
                
                // 预览装饰品背景圆
                ctx.fillStyle = this.gameState.selectedDecoration.color + '60';
                ctx.beginPath();
                ctx.arc(0, 0, 20, 0, Math.PI * 2);
                ctx.fill();
                
                // 预览装饰品emoji
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.gameState.selectedDecoration.emoji, 0, 0);
                
                ctx.restore();
            }
        }
    }
    
    drawParticles() {
        const ctx = this.ctx;
        
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life / 30;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    render() {
        const ctx = this.ctx;
        
        // 清空画布
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制装饰性星星
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 20; i++) {
            const x = (i * 40 + Date.now() * 0.01) % this.canvas.width;
            const y = (i * 30) % this.canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 绘制蛋糕
        this.drawCake();
        
        // 绘制装饰品
        this.drawDecorations();
        
        // 绘制粒子
        this.drawParticles();
        
        // 如果游戏未开始，显示提示
        if (!this.gameState.isPlaying) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('生日蛋糕装饰游戏', this.canvas.width / 2, this.canvas.height / 2 - 40);
            
            ctx.font = '20px Arial';
            ctx.fillText('选择装饰品并点击开始装饰按钮！', this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }
    
    animate() {
        if (!this.gameState.isPlaying) return;
        
        this.updateParticles();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

// 游戏管理器
const gameManager = {
    currentGame: 'coins', // 默认游戏
    cakeGame: null,
    
    init() {
        // 绑定游戏切换事件
        document.querySelectorAll('.game-selector-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const game = e.target.dataset.game;
                this.switchGame(game);
            });
        });
        
        // 初始化蛋糕游戏但不启动
        this.cakeGame = new BirthdayCakeGame();
        
        // 隐藏蛋糕游戏控制面板
        document.getElementById('cake-game-controls').classList.add('hidden');
    },
    
    switchGame(game) {
        this.currentGame = game;
        
        // 更新按钮状态
        document.querySelectorAll('.game-selector-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.game-selector-btn[data-game="${game}"]`).classList.add('active');
        
        if (game === 'coins') {
            this.showCoinsGame();
        } else {
            this.showCakeGame();
        }
    },
    
    showCoinsGame() {
        // 更新标题和说明
        document.getElementById('game-title').textContent = '🎮 接金币游戏';
        document.getElementById('game-instruction').innerHTML = '移动鼠标控制钱袋子接住掉落的金币！<br>不要让金币掉到地上，否则会损失生命！';
        
        // 显示原有游戏元素
        document.getElementById('start-game').classList.remove('hidden');
        document.getElementById('score').textContent = '0';
        document.getElementById('lives').textContent = '3';
        
        // 隐藏蛋糕游戏控制面板
        document.getElementById('cake-game-controls').classList.add('hidden');
        
        // 重置蛋糕游戏状态
        if (this.cakeGame) {
            this.cakeGame.resetGame();
        }
        
        // 显示原有游戏按钮
        document.getElementById('start-game').style.display = 'block';
        document.getElementById('restart-game').style.display = 'block';
    },
    
    showCakeGame() {
        // 更新标题和说明
        document.getElementById('game-title').textContent = '🎂 生日蛋糕装饰游戏';
        document.getElementById('game-instruction').innerHTML = '点击装饰品选择，然后在蛋糕上点击放置！<br>创造最美丽的生日蛋糕吧！';
        
        // 隐藏原有游戏元素
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('restart-game').style.display = 'none';
        
        // 显示蛋糕游戏控制面板
        document.getElementById('cake-game-controls').classList.remove('hidden');
        
        // 更新分数显示
        document.getElementById('lives').textContent = '∞';
        document.getElementById('score').textContent = '0';
    }
};

// 页面加载完成后初始化游戏管理器
document.addEventListener('DOMContentLoaded', () => {
    gameManager.init();
});