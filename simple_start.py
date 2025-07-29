from flask import Flask, render_template_string

app = Flask(__name__)

# ВАШ ПОЛНЫЙ ОРИГИНАЛЬНЫЙ КОД + ОБЛАКА
cosmic_html = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Космический образовательный портал</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
            transition: all 1s ease;
        }

        /* Темная космическая тема - ИДЕАЛЬНАЯ, НЕ ТРОГАЕМ */
        .theme-dark {
            background: linear-gradient(135deg, #151A21 0%, #394659 100%);
            color: #D9F6F4;
        }

        /* Светлая небесная тема - только фон оставляем */
        .theme-light {
            background: linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%);
            color: #2C3E50;
        }

        /* Контейнер для фоновых элементов */
        .background-container {
            position: fixed;
            top: -20%;
            left: 0;
            width: 100%;
            height: 140%;
            z-index: -1;
            overflow: hidden;
        }

        /* Звезды - ИДЕАЛЬНЫЕ, НЕ ТРОГАЕМ */
        .star {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, #D9F6F4 0%, rgba(217, 246, 244, 0.3) 70%, transparent 100%);
            box-shadow: 0 0 10px #D9F6F4, 0 0 20px rgba(217, 246, 244, 0.5);
            opacity: 0;
            transition: opacity 1s ease, transform 0.3s ease;
        }

        .theme-dark .star {
            opacity: 1;
        }

        /* НОВЫЕ SVG ОБЛАКА */
        .svg-cloud {
            position: absolute;
            opacity: 0;
            transition: opacity 1s ease, transform 0.3s ease;
        }

        .theme-light .svg-cloud {
            opacity: 1;
        }

        /* Контент страницы */
        .content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 0 auto;
            padding: 100px 20px;
            text-align: center;
        }

        /* ЗАГОЛОВКИ */
        h1 {
            font-size: 3rem;
            margin-bottom: 2rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .theme-dark h1 {
            color: #5ED9D7;
            text-shadow: 0 0 20px rgba(94, 217, 215, 0.5);
        }

        /* ПОДЗАГОЛОВКИ */
        h2 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .theme-dark h2 {
            color: #5ED9D7;
            text-shadow: 0 0 15px rgba(94, 217, 215, 0.4);
        }

        /* ОСНОВНОЙ ТЕКСТ */
        p {
            font-size: 1.2rem;
            line-height: 1.8;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .theme-dark p {
            color: #D9F6F4;
        }

        /* ПЕРЕКЛЮЧАТЕЛЬ ТЕМ - ПОЛЗУНОК */
        .theme-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            padding: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            user-select: none;
        }

        .theme-switcher:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.02);
        }

        .theme-icon {
            font-size: 18px;
            transition: all 0.3s ease;
            opacity: 0.6;
        }

        .theme-icon.active {
            opacity: 1;
            transform: scale(1.1);
        }

        .switch-track {
            width: 50px;
            height: 25px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            position: relative;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .switch-thumb {
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2.5px;
            left: 3px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .theme-light .switch-thumb {
            transform: translateX(26px);
            background: #FFD700;
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
        }

        .theme-dark .switch-track {
            background: rgba(21, 26, 33, 0.6);
        }

        .theme-light .switch-track {
            background: rgba(135, 206, 235, 0.6);
        }

        /* КАРТОЧКИ */
        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 3rem 0;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 25px;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .card:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .card h3 {
            color: #5ED9D7;
            font-size: 1.4rem;
            margin-bottom: 1rem;
        }

        /* КНОПКИ */
        .btn {
            display: inline-block;
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
            margin: 5px;
            user-select: none;
        }

        .btn-primary {
            background: linear-gradient(45deg, #5ED9D7, #4ECDC4);
            color: white;
            box-shadow: 0 4px 15px rgba(94, 217, 215, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(94, 217, 215, 0.5);
        }

        .btn-game {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7);
            background-size: 300% 300%;
            animation: gradientShift 3s ease infinite;
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .btn-game:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
        }
    </style>
</head>
<body class="theme-dark">    
    <!-- ПЕРЕКЛЮЧАТЕЛЬ ТЕМ -->
    <div class="theme-switcher" onclick="toggleTheme()">
        <span class="theme-icon moon active">🌑</span>
        <div class="switch-track">
            <div class="switch-thumb"></div>
        </div>
        <span class="theme-icon sun">☀️</span>
    </div>

    <div class="background-container" id="backgroundContainer">
        <!-- Звезды и облака будут добавлены через JavaScript -->
    </div>

    <div class="content">
        <h1> Космический образовательный портал</h1>
        <h2>Интерактивный мир образования</h2>
        <p>Добро пожаловать в мир знаний среди звезд! Двигайте курсором, чтобы увидеть, как звезды и облака реагируют на ваши движения с идеальной плавностью.</p>
        
        <div class="card-grid">
            <div class="card">
                <h3>🎓 Личный кабинет ученика</h3>
                <p>Расписание уроков, успеваемость, игровые задания и материалы для изучения.</p>
                <button class="btn btn-primary" onclick="alert('🚀 ЛКУ скоро будет готов!')">Войти в ЛКУ</button>
            </div>
            <div class="card">
                <h3> Личный кабинет родителя</h3>
                <p>Следите за успеваемостью ребенка, финансовая информация и отчеты.</p>
                <button class="btn btn-primary" onclick="alert('📊 ЛКР скоро будет готов!')">Войти в ЛКР</button>
            </div>
            <div class="card">
                <h3> Рейтинг игроков</h3>
                <p>Соревнуйтесь с другими учениками в решении задач и зарабатывайте баллы.</p>
                <button class="btn btn-game" onclick="alert('🎮 Игра загружается...')">Посмотреть рейтинг</button>
            </div>
            <div class="card">
                <h3> О преподавателе</h3>
                <p>Узнайте больше о преподавателе, методах обучения и достижениях.</p>
                <button class="btn btn-primary" onclick="alert(' Информация скоро!')">Подробнее</button>
            </div>
        </div>
        
        <p style="font-size: 1rem; opacity: 0.7; margin-top: 1rem;">Подвигайте мышкой, чтобы увидеть идеальные параллакс эффекты звезд и облаков!</p>
    </div>

    <script>
    let mouseX = 0;
        let mouseY = 0;
        let isMouseMoving = false;
        let mouseTimeout;
        let isDark = true;
        let starAnimations = [];
        let cloudAnimations = [];

        function animateStars() {
            const stars = document.querySelectorAll('.star.floating');
            
            stars.forEach((star, index) => {
                if (starAnimations[index]) {
                    cancelAnimationFrame(starAnimations[index]);
                }
                
                let startTime = Date.now() + Math.random() * 20000;
                const animationType = Math.floor(Math.random() * 8);
                const randomDuration = 15 + Math.random() * 25;
                const randomAmplitude = 0.04 + Math.random() * 0.06;
                const randomPhase = Math.random() * Math.PI * 2;
                
                function animate() {
                    if (!star.classList.contains('floating')) return;
                    
                    const elapsed = (Date.now() - startTime) / 1000;
                    const progress = (elapsed % randomDuration) / randomDuration;
                    
                    let offsetY = 0;
                    
                    switch(animationType) {
                        case 0:
                            offsetY = Math.sin(progress * Math.PI * 2 + randomPhase) * randomAmplitude;
                            break;
                        case 1:
                            offsetY = Math.cos(progress * Math.PI * 2 + randomPhase) * randomAmplitude;
                            break;
                        case 2:
                            offsetY = Math.sin(progress * Math.PI * 4 + randomPhase) * randomAmplitude * 0.7;
                            break;
                        case 3:
                            offsetY = Math.cos(progress * Math.PI * 4 + randomPhase) * randomAmplitude * 0.8;
                            break;
                        case 4:
                            offsetY = Math.sin(progress * Math.PI * 1.5 + randomPhase) * randomAmplitude * 1.2;
                            break;
                        case 5:
                            offsetY = Math.cos(progress * Math.PI * 3 + randomPhase) * randomAmplitude * 0.9;
                            break;
                        case 6:
                            offsetY = Math.sin(progress * Math.PI * 2.5 + randomPhase) * randomAmplitude * 1.1;
                            break;
                        case 7:
                            offsetY = Math.cos(progress * Math.PI * 1.8 + randomPhase) * randomAmplitude * 0.6;
                            break;
                    }
                    
                    const currentTransform = star.style.transform || 'translate(0px, 0px)';
                    const matches = currentTransform.match(/translate\\(([^,]+),\\s*([^)]+)\\)/);
                    
                    let currentX = 0;
                    let currentY = 0;
                    
                    if (matches) {
                        currentX = parseFloat(matches[1]);
                        currentY = parseFloat(matches[2]);
                    }
                    
                    star.style.transform = `translate(${currentX}px, ${currentY + offsetY}px)`;
                    
                    starAnimations[index] = requestAnimationFrame(animate);
                }
                
                setTimeout(() => {
                    starAnimations[index] = requestAnimationFrame(animate);
                }, Math.random() * 15000);
            });
        }

        function animateClouds() {
            const clouds = document.querySelectorAll('.svg-cloud.floating');
            
            clouds.forEach((cloud, index) => {
                if (cloudAnimations[index]) {
                    cancelAnimationFrame(cloudAnimations[index]);
                }
                
                let startTime = Date.now() + Math.random() * 10000;
                let animationType = index % 4;
                
                function animate() {
                    if (!cloud.classList.contains('floating')) return;
                    
                    const elapsed = (Date.now() - startTime) / 1000;
                    const duration = 20;
                    
                    let offsetY = 0;
                    const progress = (elapsed % duration) / duration;
                    
                    switch(animationType) {
                        case 0:
                            offsetY = Math.sin(progress * Math.PI * 2) * -0.06;
                            break;
                        case 1:
                            offsetY = Math.sin(progress * Math.PI * 2 + Math.PI) * 0.05;
                            break;
                        case 2:
                            offsetY = Math.sin(progress * Math.PI * 2) * -0.07;
                            break;
                        case 3:
                            offsetY = Math.sin(progress * Math.PI * 2 + Math.PI) * 0.055;
                            break;
                    }
                    
                    const currentTransform = cloud.style.transform || 'translate(0px, 0px)';
                    const matches = currentTransform.match(/translate\\(([^,]+),\\s*([^)]+)\\)/);
                    
                    let currentX = 0;
                    let currentY = 0;
                    
                    if (matches) {
                        currentX = parseFloat(matches[1]);
                        currentY = parseFloat(matches[2]);
                    }
                    
                    cloud.style.transform = `translate(${currentX}px, ${currentY + offsetY}px)`;
                    
                    cloudAnimations[index] = requestAnimationFrame(animate);
                }
                
                setTimeout(() => {
                    cloudAnimations[index] = requestAnimationFrame(animate);
                }, Math.random() * 8000);
            });
        }

        function createStars() {
            const container = document.getElementById('backgroundContainer');
            const starCount = 60;

            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                const size = Math.random() * 8 + 4;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                
                star.style.left = left + '%';
                star.style.top = top + '%';
                
                star.dataset.parallax = (Math.random() * 0.5 + 0.1).toFixed(2);
                star.style.animationDelay = (Math.random() * 10) + 's';
                
                container.appendChild(star);
            }
        }

        function createSVGClouds() {
            const container = document.getElementById('backgroundContainer');
            const cloudPositions = [];
            
            const zones = [
                { left: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95], top: [-15, -12, -18, -8, -20, -10, -16, -6, -14, -22] },
                { left: [0, 8, 16, 24, 32, 40, 5], top: [0, 8, 16, 24, 32, 40, 12] },
                { left: [60, 68, 76, 84, 92, 96, 65], top: [0, 8, 16, 24, 32, 40, 12] },
                { left: [0, 8, 16, 24, 32, 40, 5], top: [60, 68, 76, 84, 92, 96, 72] },
                { left: [60, 68, 76, 84, 92, 96, 65], top: [60, 68, 76, 84, 92, 96, 72] }
            ];

            zones.forEach((zone, zoneIndex) => {
                const cloudCount = zoneIndex === 0 ? 10 : 7;
                for (let i = 0; i < cloudCount; i++) {
                    if (zone.left[i] !== undefined && zone.top[i] !== undefined) {
                        createCloudSimple(container, zone.left[i], zone.top[i], 'large', cloudPositions);
                    }
                }
            });

            const smallCloudsCount = 35;
            
            for (let i = 0; i < smallCloudsCount; i++) {
                let attempts = 0;
                let placed = false;
                
                while (attempts < 20 && !placed) {
                    const randomLeft = Math.random() * 100;
                    const randomTop = Math.random() * 120 - 20;
                    
                    if (createCloudWithSoftCollisionCheck(container, randomLeft, randomTop, 'small', cloudPositions)) {
                        placed = true;
                    }
                    attempts++;
                }
                
                if (!placed) {
                    const randomLeft = Math.random() * 100;
                    const randomTop = Math.random() * 120 - 20;
                    createCloudSimple(container, randomLeft, randomTop, 'small', cloudPositions);
                }
            }
        }
        function createCloudSimple(container, leftPercent, topPercent, size, cloudPositions) {
            let width, height, bubbleSize, bubblesCount, blurAmount;
            
            if (size === 'large') {
                width = (Math.random() * 400 + 300) * 1.2;
                height = (Math.random() * 300 + 200) * 1.2;
                bubbleSize = 15 + Math.random() * 25;
                bubblesCount = Math.floor(Math.random() * 5) + 8;
                blurAmount = (6 + Math.random() * 4) * 0.9;
            } else {
                width = (Math.random() * 200 + 150) * 1.2;
                height = (Math.random() * 150 + 100) * 1.2;
                bubbleSize = 8 + Math.random() * 12;
                bubblesCount = Math.floor(Math.random() * 3) + 4;
                blurAmount = (4 + Math.random() * 3) * 1.2;
            }
            
            const left = leftPercent + Math.random() * 3 - 1.5;
            const top = topPercent + Math.random() * 3 - 1.5;
            
            createCloud(container, left, top, size, width, height, bubbleSize, bubblesCount, blurAmount);
            
            const screenWidth = window.innerWidth || 1920;
            const screenHeight = window.innerHeight || 1080;
            
            cloudPositions.push({
                left: (left / 100) * screenWidth,
                top: (top / 100) * screenHeight,
                right: (left / 100) * screenWidth + width,
                bottom: (top / 100) * screenHeight + height
            });
        }

        function isOverlappingTooMuch(rect1, rect2) {
            const overlapLeft = Math.max(rect1.left, rect2.left);
            const overlapTop = Math.max(rect1.top, rect2.top);
            const overlapRight = Math.min(rect1.right, rect2.right);
            const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
            
            if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
                const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop);
                const rect1Area = (rect1.right - rect1.left) * (rect1.bottom - rect1.top);
                const overlapRatio = overlapArea / rect1Area;
                
                return overlapRatio > 0.6;
            }
            
            return false;
        }

        function createCloudWithSoftCollisionCheck(container, leftPercent, topPercent, size, cloudPositions) {
            let width, height;
            
            if (size === 'large') {
                width = (Math.random() * 400 + 300) * 1.2;
                height = (Math.random() * 300 + 200) * 1.2;
            } else {
                width = (Math.random() * 200 + 150) * 1.2;
                height = (Math.random() * 150 + 100) * 1.2;
            }
            
            const left = leftPercent + Math.random() * 3 - 1.5;
            const top = topPercent + Math.random() * 3 - 1.5;
            
            const screenWidth = window.innerWidth || 1920;
            const screenHeight = window.innerHeight || 1080;
            
            const newCloudRect = {
                left: (left / 100) * screenWidth,
                top: (top / 100) * screenHeight,
                right: (left / 100) * screenWidth + width,
                bottom: (top / 100) * screenHeight + height
            };
            
            for (let existingRect of cloudPositions) {
                if (isOverlappingTooMuch(newCloudRect, existingRect)) {
                    return false;
                }
            }
            
            createCloudSimple(container, leftPercent, topPercent, size, cloudPositions);
            return true;
        }

        function createCloud(container, leftPercent, topPercent, size, width, height, bubbleSize, bubblesCount, blurAmount) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.classList.add('svg-cloud');
            
            svg.setAttribute('viewBox', '0 0 200 200');
            svg.style.width = width + 'px';
            svg.style.height = height + 'px';
            svg.style.left = leftPercent + '%';
            svg.style.top = topPercent + '%';
            
            const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
            const filterId = `blur-${Math.random().toString(36).substr(2, 9)}`;
            filter.setAttribute('id', filterId);
            
            const gaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
            gaussianBlur.setAttribute('stdDeviation', blurAmount);
            
            filter.appendChild(gaussianBlur);
            defs.appendChild(filter);
            svg.appendChild(defs);
            
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('filter', `url(#${filterId})`);
            
            const mainEllipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
            mainEllipse.setAttribute('cx', '100');
            mainEllipse.setAttribute('cy', '120');
            
            if (size === 'large') {
                mainEllipse.setAttribute('rx', '45');
                mainEllipse.setAttribute('ry', '25');
            } else {
                mainEllipse.setAttribute('rx', '30');
                mainEllipse.setAttribute('ry', '18');
            }
            
            mainEllipse.setAttribute('fill', 'white');
            mainEllipse.setAttribute('opacity', '0.85');
            g.appendChild(mainEllipse);
            
            for (let j = 0; j < bubblesCount; j++) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                
                const bubbleX = 70 + Math.random() * 60;
                const bubbleY = 90 + Math.random() * 40;
                
                const bumpsCount = 6 + Math.floor(Math.random() * 3);
                let pathData = '';
                
                for (let k = 0; k < bumpsCount; k++) {
                    const angle = (k / bumpsCount) * Math.PI * 2;
                    const nextAngle = ((k + 1) / bumpsCount) * Math.PI * 2;
                    
                    const radius1 = bubbleSize + Math.random() * 8 - 4;
                    const radius2 = bubbleSize + Math.random() * 8 - 4;
                    
                    const x1 = bubbleX + Math.cos(angle) * radius1;
                    const y1 = bubbleY + Math.sin(angle) * radius1;
                    const x2 = bubbleX + Math.cos(nextAngle) * radius2;
                    const y2 = bubbleY + Math.sin(nextAngle) * radius2;
                    
                    const controlRadius = bubbleSize + Math.random() * 6 + 2;
                    const cp1X = bubbleX + Math.cos(angle + 0.3) * controlRadius;
                    const cp1Y = bubbleY + Math.sin(angle + 0.3) * controlRadius;
                    const cp2X = bubbleX + Math.cos(nextAngle - 0.3) * controlRadius;
                    const cp2Y = bubbleY + Math.sin(nextAngle - 0.3) * controlRadius;
                    
                    if (k === 0) {
                        pathData = `M ${x1} ${y1}`;
                    }
                    
                    pathData += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x2} ${y2}`;
                }
                
                pathData += ' Z';
                
                path.setAttribute('d', pathData);
                path.setAttribute('fill', 'white');
                path.setAttribute('opacity', Math.random() * 0.25 + 0.65);
                
                g.appendChild(path);
            }
            
            svg.appendChild(g);
            svg.dataset.parallax = (Math.random() * 0.5 + 0.1).toFixed(2);
            
            container.appendChild(svg);
        }

        function updateParallax() {
            const stars = document.querySelectorAll('.star');
            const clouds = document.querySelectorAll('.svg-cloud');
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const deltaX = (mouseX - centerX) / centerX;
            const deltaY = (mouseY - centerY) / centerY;

            if (isMouseMoving) {
                stars.forEach((star, index) => {
                    star.classList.remove('floating');
                    if (starAnimations[index]) {
                        cancelAnimationFrame(starAnimations[index]);
                    }
                    
                    const parallax = parseFloat(star.dataset.parallax);
                    const moveX = deltaX * parallax * 50;
                    const moveY = deltaY * parallax * 50;
                    star.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });

                clouds.forEach((cloud, index) => {
                    cloud.classList.remove('floating');
                    if (cloudAnimations[index]) {
                        cancelAnimationFrame(cloudAnimations[index]);
                    }
                    
                    const parallax = parseFloat(cloud.dataset.parallax);
                    const moveX = deltaX * parallax * 50;
                    const moveY = deltaY * parallax * 50;
                    cloud.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            }
        }

        function resetParallax() {
            const stars = document.querySelectorAll('.star');
            const clouds = document.querySelectorAll('.svg-cloud');
            
            stars.forEach(star => {
                setTimeout(() => {
                    star.classList.add('floating');
                }, 300);
            });

            setTimeout(animateStars, 500);

            clouds.forEach(cloud => {
                setTimeout(() => {
                    cloud.classList.add('floating');
                }, 300);
            });

            setTimeout(animateClouds, 500);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;
            
            updateParallax();
            
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMouseMoving = false;
                resetParallax();
            }, 1500);
        });

        function toggleTheme() {
            const body = document.body;
            const moonIcon = document.querySelector('.theme-icon.moon');
            const sunIcon = document.querySelector('.theme-icon.sun');
            
            isDark = !isDark;
            
            if (isDark) {
                body.className = 'theme-dark';
                moonIcon.classList.add('active');
                sunIcon.classList.remove('active');
            } else {
                body.className = 'theme-light';
                moonIcon.classList.remove('active');
                sunIcon.classList.add('active');
            }
        }

        createStars();
        createSVGClouds();
        
        setTimeout(() => {
            if (!isMouseMoving) {
                resetParallax();
            }
        }, 100);
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(cosmic_html)

if __name__ == '__main__':
    print("ПОЛНЫЙ КОСМИЧЕСКИЙ САЙТ СО ЗВЕЗДАМИ И ОБЛАКАМИ!")
    print("Темная тема: мерцающие звезды")
    print("Светлая тема: пушистые облака")
    print("Откройте: http://localhost:8000")
    print("Переключайте темы кнопкой в правом углу!")
    app.run(debug=True, port=8000)