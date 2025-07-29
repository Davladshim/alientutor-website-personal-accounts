from flask import Blueprint, render_template, request, jsonify, session, flash, redirect, url_for
from utils.decorators import login_required, role_required
from models.student import Student
from models.lesson import Lesson
from models.game import GameScore
from models.user import User
from app import db
from datetime import datetime, timedelta

student_bp = Blueprint('student', __name__)

@student_bp.route('/cabinet')
@login_required
@role_required('student')
def cabinet():
    """Главная страница личного кабинета ученика"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        flash('Профиль ученика не найден', 'error')
        return redirect(url_for('index'))
    
    # Получаем последние уроки
    recent_lessons = Lesson.query.filter_by(student_id=student.id)\
                                .order_by(Lesson.date.desc())\
                                .limit(5).all()
    
    # Получаем ближайшие запланированные уроки (заглушка)
    upcoming_lessons = [
        {
            'date': 'Завтра 15:00',
            'subject': 'Алгебра',
            'topic': 'Квадратные уравнения'
        },
        {
            'date': 'Четверг 15:00', 
            'subject': 'Геометрия',
            'topic': 'Треугольники'
        },
        {
            'date': 'Суббота 14:00',
            'subject': 'Подготовка к ОГЭ',
            'topic': 'Комплексное повторение'
        }
    ]
    
    # Получаем рейтинг ученика
    game_score = GameScore.query.filter_by(student_id=student.id).first()
    current_rank = get_student_rank(student.id)
    
    return render_template('student/cabinet.html',
                         student=student,
                         recent_lessons=recent_lessons,
                         upcoming_lessons=upcoming_lessons,
                         current_rank=current_rank,
                         game_score=game_score)

@student_bp.route('/performance')
@login_required
@role_required('student')
def performance():
    """Страница успеваемости ученика"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        flash('Профиль ученика не найден', 'error')
        return redirect(url_for('index'))
    
    # Получаем все уроки ученика
    lessons = Lesson.query.filter_by(student_id=student.id)\
                         .order_by(Lesson.date.desc()).all()
    
    # Вычисляем статистику
    stats = calculate_student_stats(student.id)
    
    return render_template('student/performance.html',
                         student=student,
                         lessons=lessons,
                         stats=stats)

@student_bp.route('/rating')
@login_required
@role_required('student')
def rating():
    """Страница рейтинга с выделением текущего ученика"""
    user_id = session['user_id']
    current_student = Student.query.filter_by(user_id=user_id).first()
    
    # Получаем всех учеников с их баллами
    students_with_scores = db.session.query(
        Student, GameScore, User
    ).join(GameScore, Student.id == GameScore.student_id)\
     .join(User, Student.user_id == User.id)\
     .order_by(GameScore.total_score.desc()).all()
    
    # Формируем список для отображения
    rating_list = []
    for rank, (student, score, user) in enumerate(students_with_scores, 1):
        rating_list.append({
            'rank': rank,
            'name': user.name,
            'class_level': student.class_level,
            'score': score.total_score,
            'is_current': student.id == (current_student.id if current_student else None)
        })
    
    return render_template('student/rating.html',
                         rating_list=rating_list,
                         current_student=current_student)

@student_bp.route('/schedule')
@login_required
@role_required('student')
def schedule():
    """Страница расписания ученика"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        flash('Профиль ученика не найден', 'error')
        return redirect(url_for('index'))
    
    # Получаем расписание (заглушка - в реальности интеграция с календарем)
    schedule_data = get_student_schedule(student.id)
    
    return render_template('student/schedule.html',
                         student=student,
                         schedule=schedule_data)

@student_bp.route('/materials')
@login_required
@role_required('student')
def materials():
    """Страница материалов для изучения"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        flash('Профиль ученика не найден', 'error')
        return redirect(url_for('index'))
    
    # Получаем материалы по классу ученика
    materials = get_study_materials(student.class_level)
    
    return render_template('student/materials.html',
                         student=student,
                         materials=materials)

@student_bp.route('/theory')
@login_required 
@role_required('student')
def theory():
    """Страница теоретических материалов"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        flash('Профиль ученика не найден', 'error')
        return redirect(url_for('index'))
    
    # Получаем теоретические видео и материалы
    theory_materials = get_theory_materials(student.class_level)
    
    return render_template('student/theory.html',
                         student=student,
                         theory_materials=theory_materials)

@student_bp.route('/game')
@login_required
@role_required('student')
def game():
    """Страница игровых заданий"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        flash('Профиль ученика не найден', 'error')
        return redirect(url_for('index'))
    
    # Получаем игровые задания для ученика
    game_tasks = get_student_game_tasks(student.id)
    game_score = GameScore.query.filter_by(student_id=student.id).first()
    
    return render_template('student/game.html',
                         student=student,
                         game_tasks=game_tasks,
                         game_score=game_score)

# API эндпоинты для AJAX запросов

@student_bp.route('/api/submit-game-answer', methods=['POST'])
@login_required
@role_required('student')
def submit_game_answer():
    """API для отправки ответа на игровое задание"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Ученик не найден'}), 404
    
    data = request.get_json()
    task_id = data.get('task_id')
    answer = data.get('answer')
    
    # Проверяем ответ и начисляем баллы
    result = check_game_answer(task_id, answer, student.id)
    
    return jsonify(result)

@student_bp.route('/api/get-next-task', methods=['POST'])
@login_required
@role_required('student')
def get_next_task():
    """API для получения следующего игрового задания"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Ученик не найден'}), 404
    
    # Получаем следующее задание
    next_task = get_next_game_task(student.id)
    
    return jsonify(next_task)

@student_bp.route('/api/schedule-extra-lesson', methods=['POST'])
@login_required
@role_required('student')
def schedule_extra_lesson():
    """API для записи на внеплановый урок"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Ученик не найден'}), 404
    
    data = request.get_json()
    preferred_date = data.get('date')
    preferred_time = data.get('time')
    subject = data.get('subject')
    
    # Создаем запрос на внеплановый урок (в реальности - интеграция с календарем)
    request_id = create_lesson_request(student.id, preferred_date, preferred_time, subject)
    
    return jsonify({
        'success': True,
        'message': 'Запрос на урок отправлен преподавателю',
        'request_id': request_id
    })

# Вспомогательные функции

def get_student_rank(student_id):
    """Получить позицию ученика в рейтинге"""
    # Получаем всех учеников, отсортированных по баллам
    students_ranked = db.session.query(Student, GameScore)\
        .join(GameScore, Student.id == GameScore.student_id)\
        .order_by(GameScore.total_score.desc()).all()
    
    for rank, (student, score) in enumerate(students_ranked, 1):
        if student.id == student_id:
            return rank
    
    return None

def calculate_student_stats(student_id):
    """Вычислить статистику ученика"""
    lessons = Lesson.query.filter_by(student_id=student_id).all()
    
    if not lessons:
        return {
            'total_lessons': 0,
            'average_score': 0,
            'attendance_rate': 0,
            'progress_trend': 'stable'
        }
    
    total_lessons = len(lessons)
    scores = [lesson.test_score for lesson in lessons if lesson.test_score]
    average_score = sum(scores) / len(scores) if scores else 0
    
    # Вычисляем посещаемость (заглушка)
    attendance_rate = 95  # В реальности считается из календаря
    
    # Тренд прогресса
    if len(scores) >= 3:
        recent_avg = sum(scores[-3:]) / 3
        older_avg = sum(scores[:-3]) / len(scores[:-3]) if len(scores) > 3 else recent_avg
        
        if recent_avg > older_avg + 2:
            progress_trend = 'improving'
        elif recent_avg < older_avg - 2:
            progress_trend = 'declining'  
        else:
            progress_trend = 'stable'
    else:
        progress_trend = 'stable'
    
    return {
        'total_lessons': total_lessons,
        'average_score': round(average_score, 1),
        'attendance_rate': attendance_rate,
        'progress_trend': progress_trend
    }

def get_student_schedule(student_id):
    """Получить расписание ученика"""
    # Заглушка - в реальности интеграция с календарем
    return {
        'regular_lessons': [
            {'day': 'Вторник', 'time': '15:00', 'subject': 'Алгебра'},
            {'day': 'Четверг', 'time': '15:00', 'subject': 'Геометрия'},
            {'day': 'Суббота', 'time': '14:00', 'subject': 'Подготовка к ОГЭ'}
        ],
        'upcoming_lessons': [
            {'date': '2025-07-29', 'time': '15:00', 'subject': 'Алгебра', 'topic': 'Квадратные уравнения'},
            {'date': '2025-07-31', 'time': '15:00', 'subject': 'Геометрия', 'topic': 'Треугольники'}
        ]
    }

def get_study_materials(class_level):
    """Получить материалы для изучения по классу"""
    # Заглушка материалов
    materials = {
        '9': [
            {'title': 'Формулы сокращенного умножения', 'type': 'pdf', 'url': '#'},
            {'title': 'Таблица производных', 'type': 'pdf', 'url': '#'},
            {'title': 'Шпаргалка по геометрии', 'type': 'pdf', 'url': '#'},
            {'title': 'Задачник ОГЭ 2025', 'type': 'pdf', 'url': '#'}
        ],
        '11': [
            {'title': 'Справочник формул ЕГЭ', 'type': 'pdf', 'url': '#'},
            {'title': 'Методы решения уравнений', 'type': 'pdf', 'url': '#'},
            {'title': 'Стереометрия: основные теоремы', 'type': 'pdf', 'url': '#'},
            {'title': 'Задачник ЕГЭ 2025', 'type': 'pdf', 'url': '#'}
        ]
    }
    
    return materials.get(class_level, [])

def get_theory_materials(class_level):
    """Получить теоретические материалы и видео"""
    # Заглушка теоретических материалов
    theory = {
        '9': [
            {
                'category': 'Алгебра',
                'materials': [
                    {'title': 'Квадратные уравнения', 'type': 'video', 'duration': '15:30', 'url': '#'},
                    {'title': 'Системы уравнений', 'type': 'video', 'duration': '12:45', 'url': '#'},
                    {'title': 'Функции и графики', 'type': 'video', 'duration': '20:15', 'url': '#'}
                ]
            },
            {
                'category': 'Геометрия', 
                'materials': [
                    {'title': 'Треугольники и их свойства', 'type': 'video', 'duration': '18:20', 'url': '#'},
                    {'title': 'Четырехугольники', 'type': 'video', 'duration': '16:40', 'url': '#'},
                    {'title': 'Окружность', 'type': 'video', 'duration': '22:10', 'url': '#'}
                ]
            }
        ],
        '11': [
            {
                'category': 'Алгебра',
                'materials': [
                    {'title': 'Производные и их применение', 'type': 'video', 'duration': '25:30', 'url': '#'},
                    {'title': 'Интегралы', 'type': 'video', 'duration': '30:15', 'url': '#'},
                    {'title': 'Логарифмы', 'type': 'video', 'duration': '18:45', 'url': '#'}
                ]
            },
            {
                'category': 'Стереометрия',
                'materials': [
                    {'title': 'Многогранники', 'type': 'video', 'duration': '28:20', 'url': '#'},
                    {'title': 'Тела вращения', 'type': 'video', 'duration': '32:15', 'url': '#'},
                    {'title': 'Объемы и площади', 'type': 'video', 'duration': '24:30', 'url': '#'}
                ]
            }
        ]
    }
    
    return theory.get(class_level, [])

def get_student_game_tasks(student_id):
    """Получить игровые задания для ученика"""
    # В реальности задания берутся из настроек администратора
    # и генерируются случайно из выбранных категорий
    
    student = Student.query.get(student_id)
    if not student:
        return []
    
    # Заглушка игровых заданий
    if student.class_level == '9':
        return [
            {
                'id': 1,
                'category': 'Квадратные уравнения',
                'difficulty': 'medium',
                'question': 'Решите уравнение: x² - 5x + 6 = 0',
                'options': ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 0, x = 5'],
                'correct_answer': 0,
                'points': 10
            },
            {
                'id': 2,
                'category': 'Системы уравнений',
                'difficulty': 'hard',
                'question': 'Решите систему:\nx + y = 7\nx - y = 1',
                'options': ['x = 4, y = 3', 'x = 3, y = 4', 'x = 5, y = 2', 'x = 2, y = 5'],
                'correct_answer': 0,
                'points': 15
            }
        ]
    else:  # 11 класс
        return [
            {
                'id': 3,
                'category': 'Производные',
                'difficulty': 'medium',
                'question': 'Найдите производную функции f(x) = x³ + 2x² - 5x + 1',
                'options': ['3x² + 4x - 5', '3x² + 2x - 5', 'x³ + 4x - 5', '3x² + 4x + 5'],
                'correct_answer': 0,
                'points': 12
            },
            {
                'id': 4,
                'category': 'Интегралы',
                'difficulty': 'hard',
                'question': 'Вычислите определенный интеграл ∫₀¹ (2x + 1) dx',
                'options': ['2', '3', '4', '1'],
                'correct_answer': 0,
                'points': 18
            }
        ]

def check_game_answer(task_id, answer, student_id):
    """Проверить ответ на игровое задание и начислить баллы"""
    # Получаем задание (в реальности из базы данных)
    tasks = get_student_game_tasks(student_id)
    task = next((t for t in tasks if t['id'] == task_id), None)
    
    if not task:
        return {'error': 'Задание не найдено'}
    
    is_correct = task['correct_answer'] == answer
    points_earned = task['points'] if is_correct else 0
    
    if is_correct:
        # Начисляем баллы ученику
        game_score = GameScore.query.filter_by(student_id=student_id).first()
        if not game_score:
            game_score = GameScore(student_id=student_id, total_score=0)
            db.session.add(game_score)
        
        game_score.total_score += points_earned
        game_score.last_activity = datetime.utcnow()
        db.session.commit()
        
        # Обновляем рейтинг
        new_rank = get_student_rank(student_id)
    
    return {
        'correct': is_correct,
        'points_earned': points_earned,
        'correct_answer': task['options'][task['correct_answer']] if not is_correct else None,
        'explanation': get_task_explanation(task_id) if not is_correct else None,
        'new_rank': get_student_rank(student_id) if is_correct else None
    }

def get_next_game_task(student_id):
    """Получить следующее игровое задание"""
    # В реальности учитывается история решенных задач
    # и выбираются новые задания из активных категорий
    
    all_tasks = get_student_game_tasks(student_id)
    
    # Простая логика - возвращаем случайное задание
    import random
    if all_tasks:
        task = random.choice(all_tasks)
        # Создаем новый ID чтобы избежать повторов
        task['id'] = task['id'] + random.randint(1000, 9999)
        return task
    
    return None

def get_task_explanation(task_id):
    """Получить объяснение решения задачи"""
    # Заглушка объяснений
    explanations = {
        1: "Для решения квадратного уравнения x² - 5x + 6 = 0 используем формулу дискриминанта: D = b² - 4ac = 25 - 24 = 1. Корни: x = (5 ± 1)/2 = 2 и 3.",
        2: "Складываем уравнения: (x + y) + (x - y) = 7 + 1, получаем 2x = 8, откуда x = 4. Подставляем в первое уравнение: 4 + y = 7, y = 3.",
        3: "Производная суммы равна сумме производных. (x³)' = 3x², (2x²)' = 4x, (-5x)' = -5, (1)' = 0. Итого: 3x² + 4x - 5.",
        4: "∫₀¹ (2x + 1) dx = [x² + x]₀¹ = (1² + 1) - (0² + 0) = 2."
    }
    
    return explanations.get(task_id, "Объяснение недоступно.")

def create_lesson_request(student_id, date, time, subject):
    """Создать запрос на внеплановый урок"""
    # В реальности создается запись в базе данных
    # и отправляется уведомление преподавателю
    
    request_id = f"REQ_{student_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Здесь был бы код для:
    # - Сохранения запроса в БД  
    # - Отправки уведомления преподавателю
    # - Интеграции с календарем
    
    return request_id

# Дополнительные API эндпоинты

@student_bp.route('/api/get-statistics', methods=['GET'])
@login_required
@role_required('student')
def get_statistics():
    """API для получения подробной статистики ученика"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Ученик не найден'}), 404
    
    # Получаем детальную статистику
    stats = calculate_detailed_stats(student.id)
    
    return jsonify(stats)

@student_bp.route('/api/update-preferences', methods=['POST'])
@login_required
@role_required('student')
def update_preferences():
    """API для обновления настроек ученика"""
    user_id = session['user_id']
    student = Student.query.filter_by(user_id=user_id).first()
    
    if not student:
        return jsonify({'error': 'Ученик не найден'}), 404
    
    data = request.get_json()
    
    # Обновляем настройки (в реальности сохраняется в БД)
    preferences = {
        'notifications': data.get('notifications', True),
        'game_difficulty': data.get('game_difficulty', 'medium'),
        'preferred_subjects': data.get('preferred_subjects', [])
    }
    
    # student.preferences = json.dumps(preferences)
    # db.session.commit()
    
    return jsonify({'success': True, 'message': 'Настройки обновлены'})

def calculate_detailed_stats(student_id):
    """Вычислить подробную статистику ученика"""
    lessons = Lesson.query.filter_by(student_id=student_id).all()
    game_score = GameScore.query.filter_by(student_id=student_id).first()
    
    # Статистика по урокам
    lesson_stats = {
        'total_lessons': len(lessons),
        'this_month': sum(1 for lesson in lessons if lesson.date.month == datetime.now().month),
        'subjects': {}
    }
    
    # Группируем по предметам
    for lesson in lessons:
        subject = lesson.subject or 'Неизвестно'
        if subject not in lesson_stats['subjects']:
            lesson_stats['subjects'][subject] = {'count': 0, 'avg_score': 0, 'scores': []}
        
        lesson_stats['subjects'][subject]['count'] += 1
        if lesson.test_score:
            lesson_stats['subjects'][subject]['scores'].append(lesson.test_score)
    
    # Вычисляем средние баллы по предметам
    for subject in lesson_stats['subjects']:
        scores = lesson_stats['subjects'][subject]['scores']
        lesson_stats['subjects'][subject]['avg_score'] = sum(scores) / len(scores) if scores else 0
    
    # Игровая статистика
    game_stats = {
        'total_score': game_score.total_score if game_score else 0,
        'rank': get_student_rank(student_id),
        'last_activity': game_score.last_activity.isoformat() if game_score and game_score.last_activity else None
    }
    
    return {
        'lessons': lesson_stats,
        'game': game_stats,
        'progress_chart_data': generate_progress_chart_data(student_id)
    }

def generate_progress_chart_data(student_id):
    """Генерировать данные для графика прогресса"""
    lessons = Lesson.query.filter_by(student_id=student_id)\
                         .filter(Lesson.test_score.isnot(None))\
                         .order_by(Lesson.date).all()
    
    if not lessons:
        return []
    
    chart_data = []
    for lesson in lessons:
        chart_data.append({
            'date': lesson.date.strftime('%Y-%m-%d'),
            'score': lesson.test_score,
            'subject': lesson.subject
        })
    
    return chart_data