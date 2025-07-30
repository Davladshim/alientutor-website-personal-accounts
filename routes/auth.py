from flask import Blueprint, render_template, request, session, redirect, url_for, flash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Страница входа - заглушка"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Простая заглушка авторизации
        if email == 'admin@example.com' and password == 'admin123':
            session['user_id'] = 1
            session['user_role'] = 'admin'
            flash('Добро пожаловать, администратор!', 'success')
            return redirect(url_for('admin.dashboard'))
        elif email == 'student@example.com' and password == 'student123':
            session['user_id'] = 2
            session['user_role'] = 'student'
            flash('Добро пожаловать, ученик!', 'success')
            return redirect(url_for('student.cabinet'))
        else:
            flash('Неверный email или пароль', 'error')
    
    return render_template('auth/login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """Страница регистрации - заглушка"""
    if request.method == 'POST':
        flash('Регистрация временно недоступна', 'warning')
        return redirect(url_for('auth.login'))
    
    return render_template('auth/register.html')