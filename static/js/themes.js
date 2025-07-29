// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМ =====

// Переключение темы с обновлением иконок
function toggleTheme() {
    const body = document.body;
    const moonIcon = document.querySelector('.theme-icon.moon');
    const sunIcon = document.querySelector('.theme-icon.sun');
    
    // Добавляем класс для плавного перехода
    body.classList.add('theme-transitioning');
    
    isDark = !isDark;
    
    if (isDark) {
        body.className = 'theme-dark theme-transitioning';
        if (moonIcon) moonIcon.classList.add('active');
        if (sunIcon) sunIcon.classList.remove('active');
        saveToLocalStorage('theme', 'dark');
    } else {
        body.className = 'theme-light theme-transitioning';
        if (moonIcon) moonIcon.classList.remove('active');
        if (sunIcon) sunIcon.classList.add('active');
        saveToLocalStorage('theme', 'light');
    }
    
    // Убираем класс перехода после завершения анимации
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 1000);
    
    // Обновляем видимость фоновых элементов
    updateBackgroundElements();
    
    // Уведомление о смене темы
    const themeName = isDark ? 'Темная (Космос)' : 'Светлая (Небо)';
    showNotification(`Тема изменена на: ${themeName}`, 'success', 2000);
}

// Обновление видимости фоновых элементов в зависимости от темы
function updateBackgroundElements() {
    const stars = document.querySelectorAll('.star');
    const clouds = document.querySelectorAll('.svg-cloud');
    
    if (isDark) {
        // Показываем звезды, скрываем облака
        stars.forEach(star => {
            star.style.transition = 'opacity 1s ease';
            star.style.opacity = '1';
        });
        
        clouds.forEach(cloud => {
            cloud.style.transition = 'opacity 1s ease';
            cloud.style.opacity = '0';
        });
    } else {
        // Скрываем звезды, показываем облака
        stars.forEach(star => {
            star.style.transition = 'opacity 1s ease';
            star.style.opacity = '0';
        });
        
        clouds.forEach(cloud => {
            cloud.style.transition = 'opacity 1s ease';
            cloud.style.opacity = '1';
        });
    }
}

// Загрузка сохраненной темы при инициализации
function loadSavedTheme() {
    const savedTheme = loadFromLocalStorage('theme', 'dark');
    
    if (savedTheme === 'light' && isDark) {
        // Переключаем на светлую тему без анимации при загрузке
        toggleThemeWithoutAnimation();
    } else if (savedTheme === 'dark' && !isDark) {
        // Переключаем на темную тему без анимации при загрузке
        toggleThemeWithoutAnimation();
    }
    
    // Обновляем состояние элементов
    updateBackgroundElements();
}

// Переключение темы без анимации (для загрузки страницы)
function toggleThemeWithoutAnimation() {
    const body = document.body;
    const moonIcon = document.querySelector('.theme-icon.moon');
    const sunIcon = document.querySelector('.theme-icon.sun');
    
    isDark = !isDark;
    
    if (isDark) {
        body.className = 'theme-dark';
        if (moonIcon) moonIcon.classList.add('active');
        if (sunIcon) sunIcon.classList.remove('active');
    } else {
        body.className = 'theme-light';
        if (moonIcon) moonIcon.classList.remove('active');
        if (sunIcon) sunIcon.classList.add('active');
    }
}

// Автоматическое переключение темы в зависимости от времени суток
function autoThemeByTime() {
    const hour = new Date().getHours();
    const shouldBeDark = hour < 6 || hour > 20; // Темная тема с 20:00 до 6:00
    
    if (shouldBeDark && !isDark) {
        toggleTheme();
    } else if (!shouldBeDark && isDark) {
        toggleTheme();
    }
}

// Определение предпочтений системы
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

// Применение системной темы
function applySystemTheme() {
    const systemTheme = detectSystemTheme();
    const savedTheme = loadFromLocalStorage('theme');
    
    // Если пользователь не выбирал тему, используем системную
    if (!savedTheme) {
        if (systemTheme === 'light' && isDark) {
            toggleThemeWithoutAnimation();
        } else if (systemTheme === 'dark' && !isDark) {
            toggleThemeWithoutAnimation();
        }
        
        updateBackgroundElements();
    }
}

// Слушатель изменений системной темы
function initSystemThemeListener() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', function(e) {
            const savedTheme = loadFromLocalStorage('theme');
            
            // Автоматически переключаем только если пользователь не задал предпочтения
            if (!savedTheme) {
                if (e.matches && !isDark) {
                    toggleTheme();
                } else if (!e.matches && isDark) {
                    toggleTheme();
                }
            }
        });
    }
}

// Расширенные настройки темы
const themeSettings = {
    // Настройки звезд для темной темы
    stars: {
        count: 60,
        minSize: 4,
        maxSize: 12,
        twinkleIntensity: 0.7,
        colors: ['#D9F6F4', '#5ED9D7', '#4ECDC4', '#96CEB4']
    },
    
    // Настройки облаков для светлой темы
    clouds: {
        count: 45,
        opacity: 0.85,
        blurIntensity: 0.9,
        colors: ['white', '#F0F8FF', '#E6F3FF']
    },
    
    // Настройки переходов
    transitions: {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// Применение кастомных настроек темы
function applyThemeSettings() {
    const stars = document.querySelectorAll('.star');
    const clouds = document.querySelectorAll('.svg-cloud');
    
    if (isDark) {
        // Применяем настройки звезд
        stars.forEach((star, index) => {
            const colorIndex = index % themeSettings.stars.colors.length;
            const color = themeSettings.stars.colors[colorIndex];
            
            star.style.background = `radial-gradient(circle, ${color} 0%, ${color}50 70%, transparent 100%)`;
            star.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}50`;
        });
    } else {
        // Применяем настройки облаков
        clouds.forEach((cloud, index) => {
            const colorIndex = index % themeSettings.clouds.colors.length;
            const color = themeSettings.clouds.colors[colorIndex];
            
            const svgElements = cloud.querySelectorAll('ellipse, path');
            svgElements.forEach(element => {
                element.setAttribute('fill', color);
            });
        });
    }
}

// Анимированные переходы между темами
function createThemeTransitionEffect() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${isDark ? 'radial-gradient(circle, #151A21, #394659)' : 'radial-gradient(circle, #87CEEB, #E0F6FF)'};
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // Анимация появления
    requestAnimationFrame(() => {
        overlay.style.opacity = '0.7';
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }, 300);
    });
}

// Предустановленные темы
const predefinedThemes = {
    cosmic: {
        name: 'Космическая',
        isDark: true,
        background: 'linear-gradient(135deg, #151A21 0%, #394659 100%)',
        primaryColor: '#5ED9D7',
        secondaryColor: '#D9F6F4',
        accentColor: '#4ECDC4'
    },
    
    sky: {
        name: 'Небесная',
        isDark: false,
        background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)',
        primaryColor: '#4A90E2',
        secondaryColor: '#2C3E50',
        accentColor: '#3498DB'
    },
    
    sunset: {
        name: 'Закат',
        isDark: true,
        background: 'linear-gradient(135deg, #2C1810 0%, #8B4513 100%)',
        primaryColor: '#FF6B35',
        secondaryColor: '#FFE4C4',
        accentColor: '#FF8C42'
    },
    
    ocean: {
        name: 'Океан',
        isDark: false,
        background: 'linear-gradient(135deg, #006994 0%, #B3E5FC 100%)',
        primaryColor: '#00BCD4',
        secondaryColor: '#FFFFFF',
        accentColor: '#009688'
    }
};

// Применение предустановленной темы
function applyPredefinedTheme(themeName) {
    const theme = predefinedThemes[themeName];
    if (!theme) return;
    
    const body = document.body;
    const root = document.documentElement;
    
    // Обновляем CSS переменные
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    // Обновляем состояние темы
    isDark = theme.isDark;
    body.className = isDark ? 'theme-dark' : 'theme-light';
    
    // Сохраняем выбор
    saveToLocalStorage('selectedTheme', themeName);
    saveToLocalStorage('theme', isDark ? 'dark' : 'light');
    
    // Обновляем элементы интерфейса
    updateThemeControls();
    updateBackgroundElements();
    
    showNotification(`Применена тема: ${theme.name}`, 'success', 2000);
}

// Обновление элементов управления темой
function updateThemeControls() {
    const moonIcon = document.querySelector('.theme-icon.moon');
    const sunIcon = document.querySelector('.theme-icon.sun');
    
    if (isDark) {
        if (moonIcon) moonIcon.classList.add('active');
        if (sunIcon) sunIcon.classList.remove('active');
    } else {
        if (moonIcon) moonIcon.classList.remove('active');
        if (sunIcon) sunIcon.classList.add('active');
    }
}

// Создание расширенного селектора тем
function createAdvancedThemeSelector() {
    const selector = document.createElement('div');
    selector.className = 'advanced-theme-selector';
    selector.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 15px;
        display: none;
        flex-direction: column;
        gap: 10px;
        z-index: 1001;
        min-width: 200px;
    `;
    
    // Заголовок
    const title = document.createElement('div');
    title.textContent = 'Выбор темы';
    title.style.cssText = `
        font-weight: bold;
        color: #5ED9D7;
        margin-bottom: 10px;
        text-align: center;
    `;
    selector.appendChild(title);
    
    // Кнопки для каждой темы
    Object.entries(predefinedThemes).forEach(([key, theme]) => {
        const button = document.createElement('button');
        button.textContent = theme.name;
        button.className = 'btn btn-secondary';
        button.style.cssText = `
            margin: 2px 0;
            padding: 8px 15px;
            font-size: 0.9rem;
        `;
        
        button.addEventListener('click', () => {
            applyPredefinedTheme(key);
            hideAdvancedThemeSelector();
        });
        
        selector.appendChild(button);
    });
    
    // Кнопка автоматической темы
    const autoButton = document.createElement('button');
    autoButton.textContent = 'Авто (по времени)';
    autoButton.className = 'btn btn-primary';
    autoButton.style.cssText = `
        margin: 5px 0;
        padding: 8px 15px;
        font-size: 0.9rem;
    `;
    
    autoButton.addEventListener('click', () => {
        enableAutoTheme();
        hideAdvancedThemeSelector();
    });
    
    selector.appendChild(autoButton);
    
    document.body.appendChild(selector);
    
    return selector;
}

// Показать/скрыть расширенный селектор тем
function toggleAdvancedThemeSelector() {
    let selector = document.querySelector('.advanced-theme-selector');
    
    if (!selector) {
        selector = createAdvancedThemeSelector();
    }
    
    if (selector.style.display === 'none' || !selector.style.display) {
        selector.style.display = 'flex';
        selector.style.animation = 'slideIn 0.3s ease-out';
    } else {
        hideAdvancedThemeSelector();
    }
}

function hideAdvancedThemeSelector() {
    const selector = document.querySelector('.advanced-theme-selector');
    if (selector) {
        selector.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            selector.style.display = 'none';
        }, 300);
    }
}

// Включение автоматической смены темы
function enableAutoTheme() {
    saveToLocalStorage('autoTheme', true);
    autoThemeByTime();
    
    // Устанавливаем интервал для проверки времени каждый час
    setInterval(autoThemeByTime, 3600000);
    
    showNotification('Включена автоматическая смена темы по времени', 'success', 3000);
}

// Отключение автоматической смены темы
function disableAutoTheme() {
    saveToLocalStorage('autoTheme', false);
    showNotification('Автоматическая смена темы отключена', 'info', 2000);
}

// Инициализация системы тем
function initializeThemeSystem() {
    // Загружаем сохраненную тему
    loadSavedTheme();
    
    // Применяем системную тему если нужно
    applySystemTheme();
    
    // Инициализируем слушатель системной темы
    initSystemThemeListener();
    
    // Проверяем автоматическую тему
    const autoTheme = loadFromLocalStorage('autoTheme', false);
    if (autoTheme) {
        enableAutoTheme();
    }
    
    // Применяем настройки темы
    applyThemeSettings();
    
    // Добавляем обработчик для долгого нажатия на переключатель тем
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        let longPressTimer;
        
        themeSwitcher.addEventListener('mousedown', (e) => {
            longPressTimer = setTimeout(() => {
                toggleAdvancedThemeSelector();
            }, 1000);
        });
        
        themeSwitcher.addEventListener('mouseup', () => {
            clearTimeout(longPressTimer);
        });
        
        themeSwitcher.addEventListener('mouseleave', () => {
            clearTimeout(longPressTimer);
        });
    }
}

// Создание кастомных CSS переменных для тем
function createThemeVariables() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --theme-transition: all 1s ease;
            --theme-primary: ${isDark ? '#5ED9D7' : '#4A90E2'};
            --theme-secondary: ${isDark ? '#D9F6F4' : '#2C3E50'};
            --theme-accent: ${isDark ? '#4ECDC4' : '#3498DB'};
            --theme-background: ${isDark ? 'linear-gradient(135deg, #151A21 0%, #394659 100%)' : 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)'};
            --theme-card-bg: rgba(255, 255, 255, ${isDark ? '0.1' : '0.2'});
            --theme-border: rgba(255, 255, 255, ${isDark ? '0.2' : '0.3'});
            --theme-shadow: ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
        }
        
        .theme-transition * {
            transition: var(--theme-transition) !important;
        }
    `;
    
    document.head.appendChild(style);
}

// Анимация перехода между темами с частицами
function createParticleTransition() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9998;
        pointer-events: none;
    `;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.appendChild(canvas);
    
    const particles = [];
    const particleCount = 50;
    
    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            color: isDark ? '#5ED9D7' : '#4A90E2'
        });
    }
    
    let animationFrame;
    let duration = 0;
    const maxDuration = 2000; // 2 секунды
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Обновляем позицию
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Отражение от границ
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Затухание
            particle.opacity -= 0.01;
            
            // Рисуем частицу
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        duration += 16; // ~60fps
        
        if (duration < maxDuration && particles.some(p => p.opacity > 0)) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    }
    
    animate();
}

// Сохранение пользовательских настроек темы
function saveThemePreferences() {
    const preferences = {
        theme: isDark ? 'dark' : 'light',
        autoTheme: loadFromLocalStorage('autoTheme', false),
        selectedTheme: loadFromLocalStorage('selectedTheme', 'cosmic'),
        customSettings: {
            particleEffects: true,
            smoothTransitions: true,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }
    };
    
    saveToLocalStorage('themePreferences', preferences);
}

// Загрузка пользовательских настроек темы
function loadThemePreferences() {
    const preferences = loadFromLocalStorage('themePreferences');
    
    if (preferences) {
        // Применяем сохраненные настройки
        if (preferences.selectedTheme && predefinedThemes[preferences.selectedTheme]) {
            applyPredefinedTheme(preferences.selectedTheme);
        }
        
        if (preferences.autoTheme) {
            enableAutoTheme();
        }
        
        // Применяем кастомные настройки
        if (preferences.customSettings) {
            if (!preferences.customSettings.particleEffects) {
                // Отключаем эффекты частиц
                window.particleEffectsEnabled = false;
            }
            
            if (!preferences.customSettings.smoothTransitions) {
                // Отключаем плавные переходы
                document.documentElement.style.setProperty('--theme-transition', 'none');
            }
        }
    }
}

// Экспорт настроек темы
function exportThemeSettings() {
    const settings = loadFromLocalStorage('themePreferences');
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'theme-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Настройки темы экспортированы', 'success', 2000);
}

// Импорт настроек темы
function importThemeSettings(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            saveToLocalStorage('themePreferences', settings);
            loadThemePreferences();
            showNotification('Настройки темы импортированы', 'success', 2000);
        } catch (error) {
            showNotification('Ошибка при импорте настроек', 'error', 3000);
        }
    };
    
    reader.readAsText(file);
}

// Сброс настроек темы к умолчанию
function resetThemeSettings() {
    localStorage.removeItem('theme');
    localStorage.removeItem('themePreferences');
    localStorage.removeItem('autoTheme');
    localStorage.removeItem('selectedTheme');
    
    // Применяем тему по умолчанию
    isDark = true;
    document.body.className = 'theme-dark';
    updateThemeControls();
    updateBackgroundElements();
    
    showNotification('Настройки темы сброшены к умолчанию', 'info', 2000);
}

// Глобальные функции для доступа из HTML
window.toggleTheme = toggleTheme;
window.toggleAdvancedThemeSelector = toggleAdvancedThemeSelector;
window.applyPredefinedTheme = applyPredefinedTheme;
window.enableAutoTheme = enableAutoTheme;
window.disableAutoTheme = disableAutoTheme;
window.exportThemeSettings = exportThemeSettings;
window.importThemeSettings = importThemeSettings;
window.resetThemeSettings = resetThemeSettings;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeSystem();
    createThemeVariables();
    loadThemePreferences();
});

// Сохранение настроек при закрытии страницы
window.addEventListener('beforeunload', function() {
    saveThemePreferences();
});