import uuid
import datetime
import traceback
from flask import Flask, jsonify, request, render_template, Blueprint, session
from werkzeug.security import check_password_hash, generate_password_hash
from itertools import groupby

from .auth import login_required
from .db import get_connection

bp = Blueprint('testcase', __name__)

@bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@login_required
@bp.route('/api/v1/settings', methods=['GET'])
def get_settings():
    data = []
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT name, label, value FROM settings")
            for setting in cur:
                data.append(dict(
                    key = setting['name'],
                    label = setting['label'],
                    value = setting['value']
                ))
    finally:
        conn.close()

    return jsonify(data)

@login_required
@bp.route('/api/v1/settings', methods=['PUT'])
def update_settings():
    data = []
    key = request.json['key']
    value = request.json['value']
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("UPDATE settings set value = %s where name = %s", (value, key))
        conn.commit()
        with conn.cursor() as cur:
            cur.execute("SELECT name, value FROM settings where name = %s", (key,))
            for setting in cur:
                data = dict(
                    key = setting['name'],
                    value = setting['value']
                )
                break
    finally:
        if(conn and conn.open):
            conn.close()
    return jsonify(data)

@login_required
@bp.route('/api/v1/calendar', methods=['GET'])
def get_calendar_details():
    try:
        data = {}
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, value, dated FROM calendar_details where month(dated)={} and year(dated)={} order by dated"
                        .format(request.args['month'], request.args['year']))
            for counter in cur:
                date = str(counter['dated'])
                if date not in  data:
                    data[date] = []
                data[date].append(dict(
                        id = counter['id'],
                        name = counter['name'],
                        value = counter['value']))
        return jsonify(data)
    except Exception:
        print(traceback.format_exc())
        return jsonify(dict(
            message = "Parameters not valid."
        )), 500
    finally:
        if(conn and conn.open):
            conn.close()

@login_required
@bp.route('/api/v1/calendar', methods=['POST'])
def post_calendar_details():
    try:
        conn = get_connection()
        date = request.json['date']
        datas = request.json['data']
        subdata = { 'values': [] }
        with conn.cursor() as cur:
            for data in datas:
                cur.execute("INSERT into calendar_details (name, value, dated) values (%s, %s, %s)",
                            [data['name'], data['value'], date, ])
            conn.commit()
            cur.execute("SELECT id, name, value, dated FROM calendar_details where dated=%s",
                        [date, ])
            for counter in cur:
                subdata['dated'] = str(counter['dated'])
                subdata['values'].append(dict(
                    id = counter['id'],
                    name = counter['name'],
                    value = counter['value']))
        return jsonify(dict(
            message = "Successfully inserted the datas.",
            data = subdata
        )), 201
    except Exception:
        print(traceback.format_exc())
        return jsonify(dict(
            message = "Parameters not valid."
        )), 500
    finally:
        if(conn and conn.open):
            conn.close()

@login_required
@bp.route('/api/v1/calendar', methods=['PUT'])
def put_calendar_details():
    try:
        conn = get_connection()
        datas = request.json['data']
        with conn.cursor() as cur:
            for data in datas:
                cur.execute("UPDATE calendar_details SET value = %s WHERE id = %s",
                        [data['value'], data['id'], ])
            conn.commit()
        return jsonify(dict(
            message = "Successfully updated the datas."
        )), 202
    except Exception:
        print(traceback.format_exc())
        return jsonify(dict(
            message = "Parameters not valid."
        )), 500
    finally:
        if(conn and conn.open):
            conn.close()
    return jsonify('success');  

@bp.route('/api/v1/years', methods=['GET'])
def test_case_years():
    response = []
    sql = 'SELECT distinct YEAR(dated) as year FROM testcases'
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(sql)
            for rec in cur:
                response.append(rec['year'])
    finally:
        if(conn and conn.open):
            conn.close()
    return jsonify(response)
    
@bp.route('/api/v1/suites', methods=['GET'])
def test_case_suites():
    response = []
    sql = 'SELECT distinct suite as suite FROM testcases order by suite'
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(sql)
            for rec in cur:
                response.append(rec['suite'].capitalize() )
    finally:
        if(conn and conn.open):
            conn.close()
    return jsonify(response)

@bp.route('/api/v1/testcases', methods=['GET'])
def test_cases():
    datas = []
    response = []
    try:
        sql = 'SELECT total, completed, passed, dated FROM testcases where suite = \'{}\''.format(request.args['suite'])
    except:
        sql = 'SELECT total, completed, passed, dated FROM testcases where suite = (SELECT distinct suite as suite FROM testcases order by suite LIMIT 1)'
    try:
        sql += ' and type = \'{}\''.format(request.args['type'])
    except:
        pass
    try:
        year = request.args['year']
        sql += ' and dated between DATE(\'{}-01-01 00:00:00\') AND DATE(\'{}-12-31 23:59:59\')'.format(year, year)
    except:
        month = (datetime.datetime.now().month % 12) + 1
        year = datetime.datetime.now().year - 1
        sql += ' and dated >= DATE(\'{}-{}-01 00:00:00\')'.format(year, month)
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(sql)
            for testcase in cur:
                datas.append(dict(
                    target = testcase['total'],
                    completed = testcase['completed'],
                    passed = testcase['passed'],
                    tempDated = testcase['dated'],
                    dated = testcase['dated'].strftime('%d-%m-%Y')
                ))
    finally:
        if(conn and conn.open):
            conn.close()

    def removeTempValues(data):
        del data['tempDated']
        return data

    for key, group in groupby(datas, lambda a: a['tempDated'].strftime('%m-%Y')):
        data = {}
        data['datas'] = list(map(removeTempValues, group))
        targets = (rec['target'] for rec in data['datas'])
        completeds = (rec['completed']  for rec in data['datas'])
        passeds = (rec['passed'] for rec in data['datas'])
        data['dated'] = key
        data['target'] = max(targets)
        data['completed'] = max(completeds)
        data['passed'] = max(passeds)
        response.append(data)
    return jsonify(response)

@bp.route('/api/v1/testcases', methods=['POST'])
def add_test_case():
    try:
        failed = int(request.form['failed'])
        passed = int(request.form['passed'])
        suite = request.form['suite'].lower()
        app_type = request.form['type'].lower()
        completed = failed + passed
        dated = datetime.datetime.strptime(request.form['dated'], '%Y%m%d %H:%M:%S.%f').date()
        try:
            conn = get_connection()
            target = 0
            targeted_count = 0
            field = ''
            try:
            	with conn.cursor() as cur:
                    cur.execute("SELECT id FROM testcases WHERE dated = date(%s) and suite = %s and type = %s", (dated.strftime('%Y-%m-%d'), suite, app_type))
                    testcases = cur.fetchone()
                    query = '''
                        UPDATE testcases SET completed = %s , passed = %s
                        WHERE id = %s
                    '''
                    parameters = [ completed, passed, testcases['id'] ]
            except TypeError:
                with conn.cursor() as cur:
                    query = '''
                        SELECT s.value, SUM(cd.value) AS aggregate 
                        FROM settings s 
                        INNER JOIN calendar_details cd on cd.name = s.name
                        WHERE s.name = %s AND cd.dated <= %s
                    '''
                    field = (app_type + "_" + suite).lower()
                    cur.execute(query, [field, dated.strftime('%Y-%m-%d'), ])
                    try:
                        settings = cur.fetchone()
                        target = int(settings['value'])
                        aggregate = 0 if settings['aggregate'] is None else int(settings['aggregate'])
                        targeted_count = target + aggregate
                    except TypeError:
                        pass
                    query = '''
                        INSERT INTO testcases (total, completed, passed, dated, suite, type) VALUES
                        (%s, %s, %s, %s, %s, %s)
                    '''
                    parameters = [ targeted_count, completed, passed, dated.strftime('%Y-%m-%d %H:%M:%S'), suite, app_type ]
            conn.cursor().execute(query, parameters)
            conn.cursor().execute("delete from calendar_details where dated <= %s and name = %s", [dated.strftime('%Y-%m-%d'), field, ])
            if target != targeted_count and target is not None:
                conn.cursor().execute("update settings set value = %s where name = %s", [targeted_count, field, ])
            conn.commit()
        finally:
            if(conn and conn.open):
                conn.close()
        return dict(
            success = True
        )
    except Exception:
        print(traceback.format_exc())
        return dict(
            success = False,
            message = str("")
        ), 500

@bp.route('/api/v1/auth/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    error = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute('SELECT id, password FROM user WHERE username = %s', (username,))
            user = cur.fetchone()
    finally:
        if(conn and conn.open):
            conn.close()

    if user is None:
        error = 'Incorrect username.'
    elif not check_password_hash(user['password'], password):
        error = 'Incorrect password.'

    if error is None:
        session.clear()
        session['user_id'] = user['id']
        session['token'] = uuid.uuid4()
        return jsonify({
            'success': True,
            'token': session['token']
        })
        
    return jsonify({
        'success': False,
        'message': error
    })