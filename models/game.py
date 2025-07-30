from datetime import datetime

class GameScore:
    """Модель игровых баллов - заглушка"""
    
    def __init__(self, student_id=None, total_score=None, last_activity=None):
        self.id = 1
        self.student_id = student_id or 1
        self.total_score = total_score or 2640
        self.last_activity = last_activity or datetime.utcnow()
        self.created_at = datetime.utcnow()
    
    @staticmethod
    def query():
        """Заглушка для запросов к базе"""
        class QueryStub:
            def filter_by(self, **kwargs):
                return self
            
            def order_by(self, *args):
                return self
            
            def all(self):
                # Возвращаем тестовый рейтинг
                return [
                    GameScore(student_id=2, total_score=2850),
                    GameScore(student_id=1, total_score=2640),
                    GameScore(student_id=3, total_score=2420),
                    GameScore(student_id=4, total_score=2180),
                    GameScore(student_id=5, total_score=1950)
                ]
            
            def first(self):
                return GameScore(
                    student_id=1,
                    total_score=2640,
                    last_activity=datetime.utcnow()
                )
        
        return QueryStub()
    
    def __repr__(self):
        return f'<GameScore {self.total_score} points>'