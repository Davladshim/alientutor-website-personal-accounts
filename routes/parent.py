from flask import Blueprint, render_template
from utils.decorators import login_required, role_required

parent_bp = Blueprint('parent', __name__)

@parent_bp.route('/cabinet')
@login_required
@role_required('parent')
def cabinet():
    """Личный кабинет родителя"""
    # Заглушка данных для ЛКР
    children_data = [
        {
            'name': 'Тестовый ученик',
            'class_level': '9',
            'stats': {
                'total_lessons': 12,
                'average_score': 4.5,
                'attendance_rate': 95,
                'progress_trend': 'improving'
            },
            'recent_lessons': [],
            'game_score': 2640
        }
    ]
    
    financial_info = {
        'balance': 8,
        'monthly_cost': 12000,
        'next_payment': '2024-12-01'
    }
    
    return render_template('parent/cabinet.html', 
                         children_data=children_data,
                         financial_info=financial_info)