from flask import Blueprint, render_template
from utils.decorators import login_required, role_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard')
@admin_bp.route('/')
@login_required
@role_required('admin')
def dashboard():
    """Панель администратора"""
    # Заглушка данных для админки
    students_list = [
        {'id': 1, 'name': 'Тестовый ученик', 'class_level': '9', 'lessons_count': 12},
        {'id': 2, 'name': 'Мария Петрова', 'class_level': '11', 'lessons_count': 15},
        {'id': 3, 'name': 'Анна Козлова', 'class_level': '10', 'lessons_count': 8},
    ]
    
    stats = {
        'total_students': len(students_list),
        'total_lessons': 35,
        'active_games': 3,
        'pending_reports': 2
    }
    
    return render_template('admin/dashboard.html', 
                         students_list=students_list,
                         stats=stats)