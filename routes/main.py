from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/rating')
def rating():
    """Страница общего рейтинга"""
    # Заглушка данных рейтинга
    rating_list = [
        {'rank': 1, 'name': 'Мария Петрова', 'class_level': '11', 'score': 2850, 'is_current': False},
        {'rank': 2, 'name': 'Тестовый ученик', 'class_level': '9', 'score': 2640, 'is_current': True},
        {'rank': 3, 'name': 'Анна Козлова', 'class_level': '10', 'score': 2420, 'is_current': False},
        {'rank': 4, 'name': 'Дмитрий Волков', 'class_level': '9', 'score': 2180, 'is_current': False},
        {'rank': 5, 'name': 'София Лебедева', 'class_level': '11', 'score': 1950, 'is_current': False},
    ]
    
    return render_template('rating.html', rating_list=rating_list)

@main_bp.route('/about')
def about():
    """Страница о преподавателе"""
    return render_template('about.html')