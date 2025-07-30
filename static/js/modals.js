// ===== УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ =====

// Показать модальное окно
function showModal(modalId, data = null) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Модальное окно с ID '${modalId}' не найдено`);
        return;
    }
    
    // Заполняем данными если они переданы
    if (data) {
        populateModalData(modal, data);
    }
    
    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку фона
    
    // Добавляем класс для анимации
    setTimeout(() => {
        modal.classList.add('modal-visible');
    }, 10);
    
    // Фокус на первом элементе формы
    const firstInput = modal.querySelector('input, select, textarea, button');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
    }
    
    // Добавляем обработчик для закрытия по клику вне модального окна
    modal.addEventListener('click', handleModalBackdropClick);
    
    // Добавляем обработчик для закрытия по Escape
    document.addEventListener('keydown', handleModalEscapeKey);
}

// Скрыть модальное окно
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Модальное окно с ID '${modalId}' не найдено`);
        return;
    }
    
    // Добавляем класс для анимации закрытия
    modal.classList.add('closing');
    modal.classList.remove('modal-visible');
    
    // Скрываем модальное окно после анимации
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
        document.body.style.overflow = ''; // Возвращаем прокрутку
        
        // Очищаем форму если есть
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormErrors(form);
        }
    }, 300);
    
    // Убираем обработчики
    modal.removeEventListener('click', handleModalBackdropClick);
    document.removeEventListener('keydown', handleModalEscapeKey);
}

// Обработчик клика по фону модального окна
function handleModalBackdropClick(e) {
    if (e.target === e.currentTarget) {
        hideModal(e.currentTarget.id);
    }
}

// Обработчик нажатия Escape
function handleModalEscapeKey(e) {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            hideModal(openModal.id);
        }
    }
}

// Заполнение модального окна данными
function populateModalData(modal, data) {
    if (typeof data === 'string') {
        // Если данные - это строка, устанавливаем её как заголовок
        const title = modal.querySelector('.modal-header h2, .modal-header h3');
        if (title) {
            title.textContent = data;
        }
        return;
    }
    
    if (typeof data === 'object') {
        // Заполняем поля формы данными объекта
        Object.entries(data).forEach(([key, value]) => {
            const field = modal.querySelector(`[name="${key}"], #${key}`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = value;
                } else if (field.tagName === 'SELECT') {
                    field.value = value;
                    // Если опции загружаются динамически
                    if (!field.querySelector(`option[value="${value}"]`)) {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = value;
                        option.selected = true;
                        field.appendChild(option);
                    }
                } else {
                    field.value = value;
                }
            }
        });
        
        // Заполняем текстовые элементы
        Object.entries(data).forEach(([key, value]) => {
            const element = modal.querySelector(`[data-field="${key}"]`);
            if (element) {
                element.textContent = value;
            }
        });
    }
}

// Создание динамического модального окна
function createModal(config) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = config.id || 'dynamic-modal-' + Date.now();
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Заголовок
    if (config.title) {
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('h2');
        title.textContent = config.title;
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => hideModal(modal.id);
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        modalContent.appendChild(header);
    }
    
    // Содержимое
    if (config.content) {
        const content = document.createElement('div');
        content.className = 'modal-body';
        
        if (typeof config.content === 'string') {
            content.innerHTML = config.content;
        } else {
            content.appendChild(config.content);
        }
        
        modalContent.appendChild(content);
    }
    
    // Кнопки
    if (config.buttons && config.buttons.length > 0) {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        footer.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;';
        
        config.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `btn ${button.class || 'btn-secondary'}`;
            btn.textContent = button.text;
            
            if (button.onclick) {
                btn.addEventListener('click', (e) => {
                    button.onclick(e, modal);
                });
            }
            
            footer.appendChild(btn);
        });
        
        modalContent.appendChild(footer);
    }
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    return modal;
}

// Модальное окно подтверждения
function showConfirmModal(message, onConfirm, onCancel = null) {
    const modal = createModal({
        id: 'confirm-modal',
        title: 'Подтверждение',
        content: `<p>${message}</p>`,
        buttons: [
            {
                text: 'Отмена',
                class: 'btn-secondary',
                onclick: (e, modal) => {
                    hideModal(modal.id);
                    if (onCancel) onCancel();
                }
            },
            {
                text: 'Подтвердить',
                class: 'btn-primary',
                onclick: (e, modal) => {
                    hideModal(modal.id);
                    if (onConfirm) onConfirm();
                }
            }
        ]
    });
    
    showModal(modal.id);
    return modal;
}

// Модальное окно с уведомлением
function showAlertModal(message, type = 'info') {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    const modal = createModal({
        id: 'alert-modal',
        title: `${icons[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        content: `<p>${message}</p>`,
        buttons: [
            {
                text: 'OK',
                class: 'btn-primary',
                onclick: (e, modal) => hideModal(modal.id)
            }
        ]
    });
    
    showModal(modal.id);
    return modal;
}

// Модальное окно для отчета об уроке
function showLessonReportModal(studentData = null) {
    const modal = document.getElementById('lesson-report-modal') || createLessonReportModal();
    
    if (studentData) {
        populateModalData(modal, {
            studentName: studentData.name,
            studentClass: studentData.class
        });
    }
    
    showModal(modal.id);
}

// Создание модального окна отчета об уроке
function createLessonReportModal() {
    const modalHTML = `
        <div class="modal-header">
            <h2>Добавить отчет об уроке</h2>
            <span class="close" onclick="hideModal('lesson-report-modal')">&times;</span>
        </div>
        <form id="lesson-report-form">
            <div class="form-group">
                <label>Ученик</label>
                <select name="student" required>
                    <option value="">Выберите ученика</option>
                    <option value="ivan">Иван Петров</option>
                    <option value="maria">Мария Петрова</option>
                    <option value="anna">Анна Смирнова</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Дата урока</label>
                <input type="date" name="lessonDate" required>
            </div>
            
            <div class="form-group">
                <label>Тема урока</label>
                <select name="lessonTopic">
                    <option value="">Выберите тему</option>
                    <option value="algebra">Алгебра</option>
                    <option value="geometry">Геометрия</option>
                    <option value="oge-prep">Подготовка к ОГЭ</option>
                    <option value="ege-prep">Подготовка к ЕГЭ</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Баллы за пробник (если применимо)</label>
                <input type="number" name="testScore" min="0" max="32" placeholder="например, 18">
            </div>
            
            <div class="form-group">
                <label>Отчет по уроку</label>
                <textarea name="lessonReport" rows="4" placeholder="Что изучали, как проходил урок, рекомендации..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Домашнее задание</label>
                <textarea name="homework" rows="2" placeholder="Домашнее задание на доске"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary">Сохранить отчет</button>
        </form>
    `;
    
    const modal = createModal({
        id: 'lesson-report-modal',
        content: modalHTML
    });
    
    // Устанавливаем текущую дату по умолчанию
    const dateInput = modal.querySelector('[name="lessonDate"]');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    return modal;
}

// Модальное окно администрирования ученика
function showStudentAdminModal(studentName) {
    const modal = document.getElementById('student-admin-modal') || createStudentAdminModal();
    
    // Обновляем заголовок с именем ученика
    const title = modal.querySelector('.modal-header h2');
    if (title) {
        title.textContent = `Администрирование - ${studentName}`;
    }
    
    showModal(modal.id, { studentName });
}

// Создание модального окна администрирования ученика
function createStudentAdminModal() {
    const modalHTML = `
        <div class="modal-header">
            <h2>Администрирование ученика</h2>
            <span class="close" onclick="hideModal('student-admin-modal')">&times;</span>
        </div>
        
        <div class="grid-2">
            <div class="card admin-card">
                <h4>Управление уроками</h4>
                <button class="btn btn-primary" onclick="showLessonReportModal()">Добавить отчет об уроке</button>
                <button class="btn btn-secondary">История уроков</button>
            </div>
            
            <div class="card admin-card">
                <h4>Игровые задания</h4>
                <button class="btn btn-primary" onclick="showGameTasksModal()">Выбрать категории задач</button>
                <button class="btn btn-secondary">Статистика игры</button>
            </div>
        </div>
        
        <div class="card admin-card">
            <h4>Просмотр кабинетов</h4>
            <p>Посмотрите, как видят свои кабинеты ученик и родитель:</p>
            <button class="btn btn-secondary">Просмотр ЛКУ</button>
            <button class="btn btn-secondary">Просмотр ЛКР</button>
        </div>
        
        <div class="card admin-card">
            <h4>Отчеты</h4>
            <button class="btn btn-primary">Создать месячный отчет</button>
            <button class="btn btn-secondary">Экспорт в PDF</button>
        </div>
    `;
    
    return createModal({
        id: 'student-admin-modal',
        content: modalHTML
    });
}

// Валидация форм в модальных окнах
function validateModalForm(form) {
    let isValid = true;
    const errors = [];
    
    // Очищаем предыдущие ошибки
    clearFormErrors(form);
    
    // Проверяем обязательные поля
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Это поле обязательно для заполнения');
            isValid = false;
            errors.push(`${getFieldLabel(field)} - обязательное поле`);
        }
    });
    
    // Проверяем email поля
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Введите корректный email адрес');
            isValid = false;
            errors.push(`${getFieldLabel(field)} - некорректный email`);
        }
    });
    
    // Проверяем числовые поля
    const numberFields = form.querySelectorAll('input[type="number"]');
    numberFields.forEach(field => {
        const value = parseFloat(field.value);
        const min = parseFloat(field.getAttribute('min'));
        const max = parseFloat(field.getAttribute('max'));
        
        if (field.value && isNaN(value)) {
            showFieldError(field, 'Введите корректное число');
            isValid = false;
            errors.push(`${getFieldLabel(field)} - некорректное число`);
        } else if (!isNaN(min) && value < min) {
            showFieldError(field, `Значение должно быть не менее ${min}`);
            isValid = false;
        } else if (!isNaN(max) && value > max) {
            showFieldError(field, `Значение должно быть не более ${max}`);
            isValid = false;
        }
    });
    
    return { isValid, errors };
}

// Показать ошибку для поля
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        
        // Удаляем старое сообщение об ошибке
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Добавляем новое сообщение об ошибке
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #FF6B6B;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: shakeError 0.5s ease-in-out;
        `;
        
        formGroup.appendChild(errorElement);
    }
}

// Очистить ошибки формы
function clearFormErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// Получить метку поля
function getFieldLabel(field) {
    const formGroup = field.closest('.form-group');
    const label = formGroup ? formGroup.querySelector('label') : null;
    return label ? label.textContent : field.name || 'Поле';
}

// Проверка валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Автосохранение данных формы
function enableAutoSave(form) {
    const formId = form.id || 'unnamed-form';
    const saveKey = `autosave-${formId}`;
    
    // Загружаем сохраненные данные
    const savedData = loadFromLocalStorage(saveKey);
    if (savedData) {
        Object.entries(savedData).forEach(([name, value]) => {
            const field = form.querySelector(`[name="${name}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = value;
                } else {
                    field.value = value;
                }
            }
        });
    }
    
    // Сохраняем данные при изменении
    form.addEventListener('input', debounce(() => {
        const formData = new FormData(form);
        const data = {};
        
        for (let [name, value] of formData.entries()) {
            data[name] = value;
        }
        
        saveToLocalStorage(saveKey, data);
    }, 1000));
    
    // Очищаем автосохранение при успешной отправке
    form.addEventListener('submit', () => {
        localStorage.removeItem(saveKey);
    });
}

// Многошаговые модальные окна
class MultiStepModal {
    constructor(config) {
        this.config = config;
        this.currentStep = 0;
        this.modal = null;
        this.data = {};
    }
    
    show() {
        this.modal = this.createModal();
        this.renderStep();
        showModal(this.modal.id);
    }
    
    createModal() {
        return createModal({
            id: this.config.id || 'multi-step-modal',
            title: this.config.title,
            content: '<div class="step-content"></div><div class="step-navigation"></div>'
        });
    }
    
    renderStep() {
        const step = this.config.steps[this.currentStep];
        const contentContainer = this.modal.querySelector('.step-content');
        const navigationContainer = this.modal.querySelector('.step-navigation');
        
        // Отображаем содержимое шага
        contentContainer.innerHTML = step.content;
        
        // Отображаем навигацию
        navigationContainer.innerHTML = this.createNavigation();
        
        // Обновляем заголовок
        const title = this.modal.querySelector('.modal-header h2');
        if (title) {
            title.textContent = `${this.config.title} - Шаг ${this.currentStep + 1} из ${this.config.steps.length}`;
        }
        
        // Добавляем индикатор прогресса
        this.updateProgressIndicator();
    }
    
    createNavigation() {
        let html = '<div style="display: flex; justify-content: space-between; margin-top: 20px;">';
        
        // Кнопка "Назад"
        if (this.currentStep > 0) {
            html += '<button type="button" class="btn btn-secondary" onclick="this.modal.goToPreviousStep()">Назад</button>';
        } else {
            html += '<div></div>';
        }
        
        // Кнопка "Далее" или "Завершить"
        if (this.currentStep < this.config.steps.length - 1) {
            html += '<button type="button" class="btn btn-primary" onclick="this.modal.goToNextStep()">Далее</button>';
        } else {
            html += '<button type="button" class="btn btn-primary" onclick="this.modal.finish()">Завершить</button>';
        }
        
        html += '</div>';
        return html;
    }
    
    updateProgressIndicator() {
        let existingIndicator = this.modal.querySelector('.progress-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        const indicator = document.createElement('div');
        indicator.className = 'progress-indicator';
        indicator.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 15px 0;
        `;
        
        for (let i = 0; i < this.config.steps.length; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${i <= this.currentStep ? '#5ED9D7' : 'rgba(255, 255, 255, 0.3)'};
                transition: all 0.3s ease;
            `;
            indicator.appendChild(dot);
        }
        
        const header = this.modal.querySelector('.modal-header');
        header.appendChild(indicator);
    }
    
    goToNextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            this.currentStep++;
            this.renderStep();
        }
    }
    
    goToPreviousStep() {
        this.currentStep--;
        this.renderStep();
    }
    
    validateCurrentStep() {
        const form = this.modal.querySelector('form');
        if (form) {
            const validation = validateModalForm(form);
            return validation.isValid;
        }
        return true;
    }
    
    saveCurrentStepData() {
        const form = this.modal.querySelector('form');
        if (form) {
            const formData = new FormData(form);
            for (let [name, value] of formData.entries()) {
                this.data[name] = value;
            }
        }
    }
    
    finish() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            if (this.config.onComplete) {
                this.config.onComplete(this.data);
            }
            
            hideModal(this.modal.id);
        }
    }
}

// Модальное окно загрузки файла
function showFileUploadModal(config = {}) {
    const modalHTML = `
        <div class="modal-header">
            <h2>${config.title || 'Загрузка файла'}</h2>
            <span class="close" onclick="hideModal('file-upload-modal')">&times;</span>
        </div>
        
        <div class="file-upload-area" style="
            border: 2px dashed rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
        ">
            <div class="upload-icon" style="font-size: 3rem; margin-bottom: 15px;">📁</div>
            <p>Перетащите файл сюда или <button type="button" class="btn btn-primary" onclick="this.parentNode.parentNode.querySelector('#file-input').click()">выберите файл</button></p>
            <input type="file" id="file-input" style="display: none;" accept="${config.accept || '*'}">
            <div class="file-info" style="margin-top: 15px; display: none;">
                <p class="file-name"></p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%;"></div>
                </div>
            </div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" class="btn btn-secondary" onclick="hideModal('file-upload-modal')">Отмена</button>
            <button type="button" class="btn btn-primary" id="upload-btn" disabled onclick="uploadFile()">Загрузить</button>
        </div>
    `;
    
    const modal = createModal({
        id: 'file-upload-modal',
        content: modalHTML
    });
    
    // Обработчики для drag & drop
    const uploadArea = modal.querySelector('.file-upload-area');
    const fileInput = modal.querySelector('#file-input');
    const uploadBtn = modal.querySelector('#upload-btn');
    const fileInfo = modal.querySelector('.file-info');
    const fileName = modal.querySelector('.file-name');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#5ED9D7';
        uploadArea.style.backgroundColor = 'rgba(94, 217, 215, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    function handleFileSelect(file) {
        fileName.textContent = `${file.name} (${formatFileSize(file.size)})`;
        fileInfo.style.display = 'block';
        uploadBtn.disabled = false;
        
        // Сохраняем файл для загрузки
        modal.selectedFile = file;
    }
    
    // Функция загрузки файла
    window.uploadFile = function() {
        const file = modal.selectedFile;
        if (!file) return;
        
        const progressFill = modal.querySelector('.progress-fill');
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Загрузка...';
        
        // Имитация загрузки файла
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                uploadBtn.textContent = 'Загружено!';
                uploadBtn.className = 'btn btn-success';
                
                setTimeout(() => {
                    hideModal('file-upload-modal');
                    if (config.onUpload) {
                        config.onUpload(file);
                    }
                    showNotification('Файл успешно загружен!', 'success');
                }, 1000);
            }
            
            progressFill.style.width = progress + '%';
        }, 100);
    };
    
    showModal(modal.id);
    return modal;
}

// Форматирование размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Инициализация обработчиков модальных окон
function initializeModals() {
    // Автоматическое включение автосохранения для всех форм в модальных окнах
    document.addEventListener('DOMContentLoaded', () => {
        const modalForms = document.querySelectorAll('.modal form');
        modalForms.forEach(form => {
            enableAutoSave(form);
        });
    });
    
    // Глобальный обработчик отправки форм в модальных окнах
    document.addEventListener('submit', (e) => {
        const form = e.target;
        const modal = form.closest('.modal');
        
        if (modal) {
            e.preventDefault();
            
            const validation = validateModalForm(form);
            if (validation.isValid) {
                // Обработка успешной валидации
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Сохранение...';
                    
                    // Имитация отправки
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        hideModal(modal.id);
                        showNotification('Данные успешно сохранены!', 'success');
                    }, 1500);
                }
            } else {
                // Показываем общую ошибку
                showNotification('Пожалуйста, исправьте ошибки в форме', 'error', 3000);
            }
        }
    });
}

// Глобальные функции
window.showModal = showModal;
window.hideModal = hideModal;
window.showConfirmModal = showConfirmModal;
window.showAlertModal = showAlertModal;
window.showLessonReportModal = showLessonReportModal;
window.showStudentAdminModal = showStudentAdminModal;
window.showFileUploadModal = showFileUploadModal;
window.MultiStepModal = MultiStepModal;

// Инициализация
document.addEventListener('DOMContentLoaded', initializeModals);