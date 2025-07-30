from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Импортируем db из app.py (будет создан позже)
# from app import db

# Временная заглушка для избежания ошибок импорта
db = None

class User:
    """Модель пользователя - заглушка"""
    
    def __init__(self, name=None, email=None, password_hash=None, role=None):
        self.id = 1
        self.name = name or "Тестовый пользователь"
        self.email = email or "test@example.com"
        self.password_hash = password_hash or "hashed_password"
        self.role = role or "student"
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def query():
        """Заглушка для запросов к базе"""
        class QueryStub:
            def filter_by(self, **kwargs):
                return self
            
            def first(self):
                # Возвращаем тестового пользователя
                return User(
                    name="Анна Викторовна",
                    email="admin@example.com", 
                    role="admin"
                )
            
            def get(self, user_id):
                return User(
                    name="Тестовый ученик",
                    email="student@example.com",
                    role="student"
                )
        
        return QueryStub()
    
    def __repr__(self):
        return f'<User {self.name}>'