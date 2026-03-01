// 开场动画
function playIntroAnimation() {
    const introContainer = document.getElementById('intro-container');
    const mainContent = document.getElementById('main-content');
    const outroContainer = document.getElementById('outro-container');

    introContainer.classList.remove('hidden');

    // 创建开场粒子
    createIntroParticles();

    // 4秒后显示主内容
    setTimeout(() => {
        introContainer.style.transition = 'opacity 1s';
        introContainer.style.opacity = '0';

        setTimeout(() => {
            introContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
        }, 1000);
    }, 4000);
}

// 创建开场粒子
function createIntroParticles() {
    const container = document.querySelector('.intro-particles');

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 10 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

        container.appendChild(particle);
    }
}

// 创建落幕粒子
function createOutroParticles() {
    const container = document.querySelector('.outro-particles');

    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 15 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

        // 随机颜色
        const colors = ['#FFD700', '#FF6B6B', '#667eea', '#764ba2', '#FF69B4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;

        container.appendChild(particle);
    }
}

// 播放落幕动画
function playOutroAnimation() {
    const mainContent = document.getElementById('main-content');
    const outroContainer = document.getElementById('outro-container');

    // 淡出主内容
    mainContent.style.transition = 'opacity 1s';
    mainContent.style.opacity = '0';

    setTimeout(() => {
        mainContent.classList.add('hidden');
        outroContainer.classList.remove('hidden');
        createOutroParticles();

        // 10秒后刷新页面重新开始
        setTimeout(() => {
            location.reload();
        }, 10000);
    }, 1000);
}

// 添加落幕按钮
function addOutroButton() {
    const container = document.querySelector('.container');
    const outroBtn = document.createElement('button');
    outroBtn.textContent = '结束派对 🎉';
    outroBtn.className = 'outro-btn';
    outroBtn.style.cssText = `
        display: block;
        margin: 3rem auto;
        padding: 1rem 3rem;
        font-size: 1.2rem;
        background: linear-gradient(45deg, #FF6B6B, #FFD700);
        border: none;
        border-radius: 30px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `;

    outroBtn.addEventListener('mouseenter', () => {
        outroBtn.style.transform = 'scale(1.05)';
        outroBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
    });

    outroBtn.addEventListener('mouseleave', () => {
        outroBtn.style.transform = 'scale(1)';
        outroBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
    });

    outroBtn.addEventListener('click', playOutroAnimation);

    container.appendChild(outroBtn);
}

// 添加滚动动画
function addScrollAnimations() {
    const cards = document.querySelectorAll('.wish-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// 添加音效（使用Web Audio API）
function createSoundEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // 创建金币收集音效
    function playCoinSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // 创建游戏结束音效
    function playGameOverSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    return { playCoinSound, playGameOverSound };
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 播放开场动画
    playIntroAnimation();

    // 添加落幕按钮
    addOutroButton();

    // 添加滚动动画
    addScrollAnimations();

    // 创建音效
    const soundEffects = createSoundEffects();

    // 将音效挂载到全局，供游戏使用
    window.gameSoundEffects = soundEffects;
});
