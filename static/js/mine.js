// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
let mouseTimeout;
let isDark = true;
let starAnimations = [];
let cloudAnimations = [];

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    createStars();
    createSVGClouds();
    initializeEventListeners();
    initializeParallax();
    
    // Начальная анимация после загрузки
    setTimeout(() => {
        if (!isMouseMoving) {
            resetParallax();
        }
    }, 100);
    
    // Инициализация уведомлений
    initializeNotifications();
    
    // Проверка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'light' && isDark) {
            toggleTheme();
        } else if (savedTheme === 'dark' && !isDark) {
            toggleTheme();
        }
    }
}

// ===== СОЗДАНИЕ ЗВЕЗД =====
function createStars() {
    const container = document.getElementById('backgroundContainer');
    if (!container) return;
    
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

// ===== СОЗДАНИЕ ОБЛАКОВ =====
function createSVGClouds() {
    const container = document.getElementById('backgroundContainer');
    if (!container) return;
    
    const cloudPositions = [];
    
    // КРУПНЫЕ облака по зонам
    const zones = [
        // ЗА ЭКРАНОМ СВЕРХУ
        { left: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95], top: [-15, -12, -18, -8, -20, -10, -16, -6, -14, -22] },
        // ВЕРХ-ЛЕВО
        { left: [0, 8, 16, 24, 32, 40, 5], top: [0, 8, 16, 24, 32, 40, 12] },
        // ВЕРХ-ПРАВО
        { left: [60, 68, 76, 84, 92, 96, 65], top: [0, 8, 16, 24, 32, 40, 12] },
        // НИЗ-ЛЕВО  
        { left: [0, 8, 16, 24, 32, 40, 5], top: [60, 68, 76, 84, 92, 96, 72] },
        // НИЗ-ПРАВО
        { left: [60, 68, 76, 84, 92, 96, 65], top: [60, 68, 76, 84, 92, 96, 72] }
    ];

    // Создаем КРУПНЫЕ облака
    zones.forEach((zone, zoneIndex) => {
        const cloudCount = zoneIndex === 0 ? 10 : 7;
        for (let i = 0; i < cloudCount; i++) {
            if (zone.left[i] !== undefined && zone.top[i] !== undefined) {
                createCloudSimple(container, zone.left[i], zone.top[i], 'large', cloudPositions);
            }
        }
    });

    // МАЛЕНЬКИЕ облачки хаотично
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

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ОБЛАКОВ =====
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
    
    // Записываем позицию
    const screenWidth = window.innerWidth || 1920;
    const screenHeight = window.innerHeight || 1080;
    
    cloudPositions.push({
        left: (left / 100) * screenWidth,
        top: (top / 100) * screenHeight,
        right: (left / 100) * screenWidth + width,
        bottom: (top / 100) * screenHeight + height
    });
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
    
    // Проверяем пересечение
    for (let existingRect of cloudPositions) {
        if (isOverlappingTooMuch(newCloudRect, existingRect)) {
            return false;
        }
    }
    
    createCloudSimple(container, leftPercent, topPercent, size, cloudPositions);
    return true;
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

function createCloud(container, leftPercent, topPercent, size, width, height, bubbleSize, bubblesCount, blurAmount) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('svg-cloud');
    
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.style.width = width + 'px';
    svg.style.height = height + 'px';
    svg.style.left = leftPercent + '%';
    svg.style.top = topPercent + '%';
    
    // Фильтр размытия
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    const filterId = `blur-${Math.random().toString(36).substr(2, 9)}`;
    filter.setAttribute('id', filterId);
    
    const gaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
    gaussianBlur.setAttribute('stdDeviation', blurAmount);
    
    filter.appendChild(gaussianBlur);
    defs.appendChild(filter);
    svg.appendChild(defs);
    
    // Создаем облако
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('filter', `url(#${filterId})`);
    
    // Основа облака
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
    
    // Пушистые "пузыри"
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

// ===== АНИМАЦИИ ЗВЕЗД И ОБЛАКОВ =====
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
            const matches = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            
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
            const matches = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            
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

// ===== ПАРАЛЛАКС ЭФФЕКТЫ =====
function initializeParallax() {
    document.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    updateParallax();
    
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
        resetParallax();
    }, 1500);
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

// ===== НАВИГАЦИЯ И ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ =====
function showPage(pageId) {
    // Скрываем все страницы
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем нужную страницу
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Обновляем активный элемент навигации
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Находим и активируем соответствующий элемент навигации
    const activeNavItem = Array.from(navItems).find(item => 
        item.getAttribute('onclick') && 
        item.getAttribute('onclick').includes(pageId)
    );
    
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

function showStudentTab(tabId) {
    // Скрываем все вкладки ученика
    const tabs = document.querySelectorAll('#student-cabinet .tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем нужную вкладку
    const targetTab = document.getElementById(`student-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Обновляем активную вкладку в навигации
    const tabNavItems = document.querySelectorAll('#student-cabinet .nav-item');
    tabNavItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeTabNavItem = Array.from(tabNavItems).find(item => 
        item.getAttribute('onclick') && 
        item.getAttribute('onclick').includes(tabId)
    );
    
    if (activeTabNavItem) {
        activeTabNavItem.classList.add('active');
    }
}

function showParentTab(tabId) {
    // Скрываем все вкладки родителя
    const tabs = document.querySelectorAll('#parent-cabinet .tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем нужную вкладку
    const targetTab = document.getElementById(`parent-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Обновляем активную вкладку в навигации
    const tabNavItems = document.querySelectorAll('#parent-cabinet .nav-item');
    tabNavItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeTabNavItem = Array.from(tabNavItems).find(item => 
        item.getAttribute('onclick') && 
        item.getAttribute('onclick').includes(tabId)
    );
    
    if (activeTabNavItem) {
        activeTabNavItem.classList.add('active');
    }
}

// ===== УВЕДОМЛЕНИЯ =====
function initializeNotifications() {
    // Автоматическое скрытие уведомлений через 5 секунд
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((notification, index) => {
        setTimeout(() => {
            hideNotification(notification.id);
        }, 5000 + (index * 1000)); // Задержка для каждого уведомления
    });
}

function hideNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }
}

function showNotification(message, type = 'success', duration = 5000) {
    const notification = document.createElement('div');
    const notificationId = 'notification-' + Date.now();
    notification.id = notificationId;
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        ${message}
        <span class="close-notification" onclick="hideNotification('${notificationId}')">&times;</span>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        hideNotification(notificationId);
    }, duration);
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function initializeEventListeners() {
    // Обработчики для кнопок
    document.addEventListener('click', handleButtonClicks);
    
    // Обработчики для форм
    document.addEventListener('submit', handleFormSubmits);
    
    // Обработчики для адаптивности
    window.addEventListener('resize', handleResize);
    
    // Предотвращение перехода по ссылкам-заглушкам
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href="#"]')) {
            e.preventDefault();
        }
    });
}

function handleButtonClicks(e) {
    // Добавляем эффект клика для всех кнопок
    if (e.target.matches('.btn') || e.target.closest('.btn')) {
        const button = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 150);
    }
    
    // Обработка специальных кнопок
    if (e.target.matches('.btn-game')) {
        handleGameButtonClick(e);
    }
}

function handleGameButtonClick(e) {
    e.preventDefault();
    showNotification('🎮 Игра скоро будет доступна!', 'warning', 3000);
    
    // Добавляем эффект "победы" для игровой кнопки
    e.target.classList.add('victory-effect');
    setTimeout(() => {
        e.target.classList.remove('victory-effect');
    }, 1000);
}

function handleFormSubmits(e) {
    // Добавляем обработку для всех форм
    if (e.target.matches('form')) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Загрузка...';
            
            // Имитация отправки формы
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset.originalText || 'Отправить';
                showNotification('Данные успешно сохранены!', 'success');
                
                // Закрываем модальное окно, если форма в модалке
                const modal = form.closest('.modal');
                if (modal) {
                    hideModal(modal.id);
                }
            }, 2000);
        }
    }
}

function handleResize() {
    // Пересоздаем фоновые элементы при изменении размера окна
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        const container = document.getElementById('backgroundContainer');
        if (container) {
            // Сохраняем текущую тему
            const currentTheme = isDark;
            
            // Очищаем контейнер
            container.innerHTML = '';
            
            // Пересоздаем элементы
            createStars();
            createSVGClouds();
            
            // Восстанавливаем анимации
            if (!isMouseMoving) {
                resetParallax();
            }
        }
    }, 500);
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ =====
function initializeInteractiveElements() {
    // Добавляем интерактивность к карточкам студентов
    const studentCards = document.querySelectorAll('.student-card');
    studentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Добавляем эффект пульсации для важных элементов
    const importantButtons = document.querySelectorAll('.btn-primary, .btn-game');
    importantButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
    });
}

// ===== СЧЕТЧИКИ И АНИМАЦИЯ ЧИСЕЛ =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// ===== ПРОГРЕСС БАРЫ =====
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.dataset.width || '75%';
        bar.style.setProperty('--progress-width', width);
        bar.classList.add('active');
    });
}

// ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ =====
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Не удалось сохранить данные в localStorage:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn('Не удалось загрузить данные из localStorage:', error);
        return defaultValue;
    }
}

// ===== УТИЛИТЫ ДЛЯ РАБОТЫ С AJAX =====
function sendAjaxRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (error) {
                    resolve(xhr.responseText);
                }
            } else {
                reject(new Error(`HTTP Error: ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network Error'));
        };
        
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ ДОПОЛНИТЕЛЬНЫХ ФУНКЦИЙ =====
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем дополнительные инициализации с задержкой
    setTimeout(() => {
        initializeInteractiveElements();
        animateCounters();
        animateProgressBars();
    }, 1000);
});

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ДОСТУПА ИЗ HTML =====
window.showPage = showPage;
window.showStudentTab = showStudentTab;
window.showParentTab = showParentTab;
window.hideNotification = hideNotification;
window.showNotification = showNotification;

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error', 10000);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showNotification('Произошла ошибка при загрузке данных.', 'error', 5000);
});

// ===== ПРОИЗВОДИТЕЛЬНОСТЬ =====
// Оптимизированные обработчики с throttling
const optimizedMouseMove = throttle(handleMouseMove, 16); // ~60fps
const optimizedResize = debounce(handleResize, 250);

// Переопределяем обработчики для лучшей производительности
document.removeEventListener('mousemove', handleMouseMove);
document.addEventListener('mousemove', optimizedMouseMove);

window.removeEventListener('resize', handleResize);
window.addEventListener('resize', optimizedResize);