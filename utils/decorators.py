from functools import wraps
from flask import session, redirect, url_for, flash

def login_required(f):
    """Декоратор для проверки авторизации - заглушка"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Временно пропускаем проверку авторизации
        # В реальном проекте здесь была бы проверка session['user_id']
        return f(*args, **kwargs)
    return decorated_function

def role_required(required_role):
    """Декоратор для проверки роли пользователя - заглушка"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Временно пропускаем проверку роли
            # В реальном проекте здесь была бы проверка session['user_role']
            return f(*args, **kwargs)
        return decorated_function
    return decorator