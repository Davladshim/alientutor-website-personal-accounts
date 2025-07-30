from datetime import datetime

class Student:
    """Модель ученика - заглушка"""
    
    def __init__(self, user_id=None, class_level=None, game_score=None):
        self.id = 1
        self.user_id = user_id or 1
        self.class_level = class_level or "9"
        self.game_score = game_score or 2640
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def query():
        """Заглушка для запросов к базе"""
        class QueryStub:
            def filter_by(self, **kwargs):
                return self
            
            def first(self):
                return Student(
                    user_id=1,
                    class_level="9",
                    game_score=2640
                )
            
            def get(self, student_id):
                return Student(
                    user_id=1,
                    class_level="9", 
                    game_score=2640
                )
        
        return QueryStub()
    
    def __repr__(self):
        return f'<Student {self.id} - {self.class_level} класс>'