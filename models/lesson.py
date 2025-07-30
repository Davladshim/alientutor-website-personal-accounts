from datetime import datetime, timedelta

class Lesson:
    """Модель урока - заглушка"""
    
    def __init__(self, student_id=None, subject=None, date=None, test_score=None, notes=None):
        self.id = 1
        self.student_id = student_id or 1
        self.subject = subject or "Алгебра"
        self.date = date or datetime.now()
        self.test_score = test_score
        self.notes = notes or "Хороший урок"
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def query():
        """Заглушка для запросов к базе"""
        class QueryStub:
            def filter_by(self, **kwargs):
                return self
            
            def order_by(self, *args):
                return self
            
            def limit(self, count):
                return self
            
            def all(self):
                # Возвращаем тестовые уроки
                return [
                    Lesson(
                        subject="Квадратные уравнения",
                        date=datetime.now() - timedelta(days=3),
                        test_score=18,
                        notes="Хорошо разобрали тему, нужно больше практики с дискриминантом"
                    ),
                    Lesson(
                        subject="Системы уравнений", 
                        date=datetime.now() - timedelta(days=6),
                        test_score=22,
                        notes="Отличный прогресс! Все методы решения освоены"
                    ),
                    Lesson(
                        subject="Функции и графики",
                        date=datetime.now() - timedelta(days=9),
                        test_score=None,
                        notes="Изучили теорию, на следующем уроке - практика"
                    ),
                    Lesson(
                        subject="Пробный ОГЭ",
                        date=datetime.now() - timedelta(days=12),
                        test_score=25,
                        notes="Отличный результат! Готовность к ОГЭ - 85%"
                    )
                ]
            
            def first(self):
                return self.all()[0]
        
        return QueryStub()
    
    def __repr__(self):
        return f'<Lesson {self.subject}>'