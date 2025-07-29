from flask import Flask, render_template, redirect, url_for, request, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# Инициализация приложения
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///education_portal.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Инициализация базы данных
db = SQLAlchemy(app)

# Импорт моделей
from models.user import User
from models.student import Student
from models.lesson import Lesson
from models.game import GameScore

# Импорт маршрутов
from routes.main import main_bp
from routes.student import student_bp
from routes.parent import parent_bp
from routes.admin import admin_bp
from routes.auth import auth_bp

# Регистрация blueprints
app.register_blueprint(main_bp)
app.register_blueprint(student_bp, url_prefix='/student')
app.register_blueprint(parent_bp, url_prefix='/parent')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(auth_bp, url_prefix='/auth')

# Декоратор для проверки ролей
from utils.decorators import login_required, role_required

@app.context_processor
def inject_user():
    """Добавляет текущего пользователя в контекст всех шаблонов"""
    current_user = None
    if 'user_id' in session:
        current_user = User.query.get(session['user_id'])
    return dict(current_user=current_user)

@app.route('/')
def index():
    """Главная страница"""
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Страница входа"""
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['user_role'] = user.role
            
            # Перенаправление в зависимости от роли
            if user.role == 'admin':
                return redirect(url_for('admin.dashboard'))
            elif user.role == 'student':
                return redirect(url_for('student.cabinet'))
            elif user.role == 'parent':
                return redirect(url_for('parent.cabinet'))
        else:
            flash('Неверный email или пароль', 'error')
    
    return render_template('auth/login.html')

@app.route('/logout')
def logout():
    """Выход из системы"""
    session.clear()
    flash('Вы успешно вышли из системы', 'success')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
@role_required('admin')  # Только админ может регистрировать новых пользователей
def register():
    """Регистрация нового пользователя"""
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        role = request.form['role']
        
        # Проверка, что пользователь с таким email не существует
        if User.query.filter_by(email=email).first():
            flash('Пользователь с таким email уже существует', 'error')
            return render_template('auth/register.html')
        
        # Создание нового пользователя
        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            role=role
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Если это ученик, создаем запись в таблице студентов
        if role == 'student':
            student = Student(
                user_id=user.id,
                class_level=request.form.get('class_level', '9'),
                game_score=0
            )
            db.session.add(student)
            db.session.commit()
        
        flash('Пользователь успешно зарегистрирован', 'success')
        return redirect(url_for('admin.dashboard'))
    
    return render_template('auth/register.html')

@app.errorhandler(404)
def not_found_error(error):
    """Обработка ошибки 404"""
    return render_template('errors/404.html'), 404

@app.errorhandler(403)
def forbidden_error(error):
    """Обработка ошибки 403"""
    return render_template('errors/403.html'), 403

@app.errorhandler(500)
def internal_error(error):
    """Обработка ошибки 500"""
    db.session.rollback()
    return render_template('errors/500.html'), 500

# Создание таблиц базы данных
@app.before_first_request
def create_tables():
    """Создание таблиц при первом запуске"""
    db.create_all()
    
    # Создание администратора по умолчанию
    admin = User.query.filter_by(role='admin').first()
    if not admin:
        admin_user = User(
            name='Анна Викторовна',
            email='admin@example.com',
            password_hash=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()
        print("Создан администратор: admin@example.com / admin123")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)