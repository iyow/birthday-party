// 3D生日派对漫游游戏
class BirthdayRoamingGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.player = null;
        this.coins = [];
        this.gifts = [];
        this.walls = [];
        this.trees = [];
        this.lights = [];
        
        this.score = 0;
        this.giftsFound = 0;
        this.isPlaying = false;
        this.wireframeMode = false;
        
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false
        };
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();
        this.createEnvironment();
        this.createPlayer();
        this.createCollectibles();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // 天蓝色背景
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        document.getElementById('loading').style.display = 'none';
    }

    setupControls() {
        this.controls = new THREE.PointerLockControls(this.camera, this.renderer.domElement);
        this.scene.add(this.controls.getObject());
        
        // 设置初始相机位置
        this.controls.getObject().position.set(0, 5, 10);
    }

    setupLights() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // 方向光（太阳光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // 点光源（装饰灯）
        const pointLight1 = new THREE.PointLight(0xff6b6b, 1, 30);
        pointLight1.position.set(-20, 10, -20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xffd700, 1, 30);
        pointLight2.position.set(20, 10, 20);
        this.scene.add(pointLight2);
    }

    createEnvironment() {
        // 地面
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 创建边界墙
        this.createBoundaryWalls();
        
        // 创建树木
        this.createTrees();
        
        // 创建装饰建筑
        this.createDecorations();
    }

    createBoundaryWalls() {
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const wallHeight = 20;
        const wallThickness = 2;
        
        // 四面墙
        const walls = [
            { pos: [0, wallHeight/2, -100], size: [200, wallHeight, wallThickness] },
            { pos: [0, wallHeight/2, 100], size: [200, wallHeight, wallThickness] },
            { pos: [-100, wallHeight/2, 0], size: [wallThickness, wallHeight, 200] },
            { pos: [100, wallHeight/2, 0], size: [wallThickness, wallHeight, 200] }
        ];
        
        walls.forEach(wall => {
            const geometry = new THREE.BoxGeometry(...wall.size);
            const mesh = new THREE.Mesh(geometry, wallMaterial);
            mesh.position.set(...wall.pos);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            this.walls.push(mesh);
        });
    }

    createTrees() {
        for (let i = 0; i < 15; i++) {
            const tree = this.createTree();
            const x = (Math.random() - 0.5) * 180;
            const z = (Math.random() - 0.5) * 180;
            tree.position.set(x, 0, z);
            this.scene.add(tree);
            this.trees.push(tree);
        }
    }

    createTree() {
        const tree = new THREE.Group();
        
        // 树干
        const trunkGeometry = new THREE.CylinderGeometry(1, 1.5, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 4;
        trunk.castShadow = true;
        tree.add(trunk);
        
        // 树冠
        const leavesGeometry = new THREE.SphereGeometry(4, 8, 6);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 10;
        leaves.castShadow = true;
        tree.add(leaves);
        
        return tree;
    }

    createDecorations() {
        // 创建生日蛋糕塔
        this.createCakeTower();
        
        // 创建气球
        this.createBalloons();
        
        // 创建礼物盒
        this.createGiftBoxes();
    }

    createCakeTower() {
        const cakeGroup = new THREE.Group();
        
        // 蛋糕层
        const layers = [
            { size: [8, 1, 8], color: 0xFFB6C1 },
            { size: [6, 1, 6], color: 0xFF69B4 },
            { size: [4, 1, 4], color: 0xFF1493 }
        ];
        
        layers.forEach((layer, index) => {
            const geometry = new THREE.BoxGeometry(...layer.size);
            const material = new THREE.MeshLambertMaterial({ color: layer.color });
            const cakeLayer = new THREE.Mesh(geometry, material);
            cakeLayer.position.y = index + 1;
            cakeLayer.castShadow = true;
            cakeGroup.add(cakeLayer);
        });
        
        // 蜡烛
        for (let i = 0; i < 5; i++) {
            const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
            const candleMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            candle.position.set(
                (Math.random() - 0.5) * 3,
                3.5,
                (Math.random() - 0.5) * 3
            );
            cakeGroup.add(candle);
        }
        
        cakeGroup.position.set(-30, 0, -30);
        this.scene.add(cakeGroup);
    }

    createBalloons() {
        for (let i = 0; i < 10; i++) {
            const balloon = this.createBalloon();
            const x = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            balloon.position.set(x, 15 + Math.random() * 10, z);
            this.scene.add(balloon);
        }
    }

    createBalloon() {
        const balloonGroup = new THREE.Group();
        
        // 气球主体
        const balloonGeometry = new THREE.SphereGeometry(1, 8, 6);
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
        const balloonMaterial = new THREE.MeshLambertMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)] 
        });
        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
        balloon.castShadow = true;
        balloonGroup.add(balloon);
        
        // 气球线
        const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 10);
        const stringMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const string = new THREE.Mesh(stringGeometry, stringMaterial);
        string.position.y = -5;
        balloonGroup.add(string);
        
        return balloonGroup;
    }

    createGiftBoxes() {
        for (let i = 0; i < 5; i++) {
            const giftBox = this.createGiftBox();
            const x = (Math.random() - 0.5) * 160;
            const z = (Math.random() - 0.5) * 160;
            giftBox.position.set(x, 1, z);
            giftBox.userData = { isGift: true, giftId: i };
            this.scene.add(giftBox);
            this.gifts.push(giftBox);
        }
    }

    createGiftBox() {
        const giftGroup = new THREE.Group();
        
        // 礼物盒主体
        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xFF69B4 });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        giftGroup.add(box);
        
        // 丝带
        const ribbonGeometry = new THREE.BoxGeometry(2.2, 0.2, 0.2);
        const ribbonMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        
        const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
        ribbon1.position.y = 0;
        giftGroup.add(ribbon1);
        
        const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 0.2), ribbonMaterial);
        ribbon2.position.y = 0;
        giftGroup.add(ribbon2);
        
        // 蝴蝶结
        const bowGeometry = new THREE.SphereGeometry(0.5, 6, 4);
        const bowMaterial = new THREE.MeshLambertMaterial({ color: 0xFF1493 });
        const bow = new THREE.Mesh(bowGeometry, bowMaterial);
        bow.position.y = 1.2;
        giftGroup.add(bow);
        
        return giftGroup;
    }

    createPlayer() {
        this.player = new THREE.Group();
        
        // 玩家身体
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x00CED1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        this.player.add(body);
        
        // 玩家头部
        const headGeometry = new THREE.SphereGeometry(0.4, 8, 6);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFB6C1 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.2;
        head.castShadow = true;
        this.player.add(head);
        
        this.player.position.set(0, 0, 0);
        this.scene.add(this.player);
    }

    createCollectibles() {
        // 创建金币
        for (let i = 0; i < 20; i++) {
            const coin = this.createCoin();
            const x = (Math.random() - 0.5) * 180;
            const z = (Math.random() - 0.5) * 180;
            coin.position.set(x, 1, z);
            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    createCoin() {
        const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 8);
        const coinMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFD700,
            side: THREE.DoubleSide 
        });
        const coin = new THREE.Mesh(coinGeometry, coinMaterial);
        coin.userData = { isCoin: true, value: 10 };
        coin.castShadow = true;
        return coin;
    }

    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW': this.keys.w = true; break;
                case 'KeyA': this.keys.a = true; break;
                case 'KeyS': this.keys.s = true; break;
                case 'KeyD': this.keys.d = true; break;
                case 'Space': 
                    event.preventDefault();
                    this.keys.space = true; 
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW': this.keys.w = false; break;
                case 'KeyA': this.keys.a = false; break;
                case 'KeyS': this.keys.s = false; break;
                case 'KeyD': this.keys.d = false; break;
                case 'Space': this.keys.space = false; break;
            }
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // UI按钮事件
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('reset-camera').addEventListener('click', () => {
            this.resetCamera();
        });

        document.getElementById('toggle-wireframe').addEventListener('click', () => {
            this.toggleWireframe();
        });
    }

    startGame() {
        this.isPlaying = true;
        this.controls.lock();
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('ui').style.display = 'block';
    }

    resetCamera() {
        this.controls.getObject().position.set(0, 5, 10);
        this.controls.getObject().rotation.set(0, 0, 0);
    }

    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        this.scene.traverse((child) => {
            if (child.isMesh) {
                child.material.wireframe = this.wireframeMode;
            }
        });
    }

    updatePlayer() {
        if (!this.controls.isLocked) return;

        const speed = 0.5;
        const jumpVelocity = 0.3;
        
        // 重力
        if (this.player.position.y > 0) {
            this.velocity.y -= 0.01;
        }
        
        // 跳跃
        if (this.keys.space && this.player.position.y === 0) {
            this.velocity.y = jumpVelocity;
        }
        
        // 移动
        this.direction.z = Number(this.keys.w) - Number(this.keys.s);
        this.direction.x = Number(this.keys.d) - Number(this.keys.a);
        this.direction.normalize();
        
        const moveVector = new THREE.Vector3();
        moveVector.z = this.direction.z * speed;
        moveVector.x = this.direction.x * speed;
        moveVector.applyQuaternion(this.camera.quaternion);
        moveVector.y = 0;
        
        this.controls.moveRight(-moveVector.x);
        this.controls.moveForward(-moveVector.z);
        
        // 更新玩家位置跟随相机
        const cameraPos = this.controls.getObject().position;
        this.player.position.x = cameraPos.x;
        this.player.position.z = cameraPos.z;
        this.player.position.y = Math.max(0, cameraPos.y - 2);
        
        // 应用重力
        this.controls.getObject().position.y += this.velocity.y;
        if (this.controls.getObject().position.y < 2) {
            this.controls.getObject().position.y = 2;
            this.velocity.y = 0;
        }
    }

    checkCollisions() {
        const playerPos = this.controls.getObject().position;
        
        // 检查金币收集
        this.coins.forEach((coin, index) => {
            const distance = playerPos.distanceTo(coin.position);
            if (distance < 2) {
                this.scene.remove(coin);
                this.coins.splice(index, 1);
                this.score += coin.userData.value;
                this.updateUI();
                
                // 创建收集特效
                this.createCollectEffect(coin.position);
            }
        });
        
        // 检查礼物收集
        this.gifts.forEach((gift, index) => {
            const distance = playerPos.distanceTo(gift.position);
            if (distance < 3) {
                this.scene.remove(gift);
                this.gifts.splice(index, 1);
                this.giftsFound++;
                this.score += 50;
                this.updateUI();
                
                // 创建收集特效
                this.createCollectEffect(gift.position);
                
                // 检查是否完成所有礼物
                if (this.giftsFound >= 5) {
                    this.completeGame();
                }
            }
        });
    }

    createCollectEffect(position) {
        const particleCount = 10;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.1, 4, 2);
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFFD700,
                transparent: true,
                opacity: 1 
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.3,
                (Math.random() - 0.5) * 0.2
            );
            
            particles.add(particle);
        }
        
        this.scene.add(particles);
        
        // 动画粒子
        const animateParticles = () => {
            particles.children.forEach(particle => {
                particle.position.add(particle.velocity);
                particle.velocity.y -= 0.01;
                particle.material.opacity -= 0.02;
            });
            
            if (particles.children[0].material.opacity > 0) {
                requestAnimationFrame(animateParticles);
            } else {
                this.scene.remove(particles);
            }
        };
        
        animateParticles();
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('gifts').textContent = this.giftsFound;
    }

    completeGame() {
        this.isPlaying = false;
        this.controls.unlock();
        
        // 显示完成消息
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            z-index: 1000;
            font-size: 24px;
        `;
        message.innerHTML = `
            <h2>🎉 恭喜完成！</h2>
            <p>你找到了所有 ${this.giftsFound} 个礼物！</p>
            <p>最终得分: ${this.score}</p>
            <button onclick="location.reload()" class="btn" style="margin-top: 20px;">再玩一次</button>
        `;
        document.body.appendChild(message);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isPlaying) {
            this.updatePlayer();
            this.checkCollisions();
        }
        
        // 旋转金币
        this.coins.forEach(coin => {
            coin.rotation.y += 0.05;
        });
        
        // 旋转礼物
        this.gifts.forEach(gift => {
            gift.rotation.y += 0.02;
        });
        
        // 轻微浮动气球
        this.scene.children.forEach(child => {
            if (child.children && child.children[0] && child.children[0].geometry) {
                if (child.children[0].geometry.type === 'SphereGeometry' && child.position.y > 10) {
                    child.position.y += Math.sin(Date.now() * 0.001) * 0.01;
                }
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 初始化游戏
let game;
window.addEventListener('load', () => {
    game = new BirthdayRoamingGame();
});