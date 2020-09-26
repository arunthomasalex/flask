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
            cur.execute("SELECT name, label, value FROM testcases.settings")
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
            cur.execute("UPDATE testcases.settings set value = %s where name = %s", (value, key))
        conn.commit()
        
        with conn.cursor() as cur:
            cur.execute("SELECT name, value FROM testcases.settings where name = %s", (key,))
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
        sql = 'SELECT total, completed, passed, dated FROM testcases.testcases where suite = \'{}\''.format(request.args['suite'])
    except:
        sql = 'SELECT total, completed, passed, dated FROM testcases.testcases where suite = (SELECT distinct suite as suite FROM testcases order by suite LIMIT 1)'
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
        suite = request.form['suite']
        app_type = request.form['type']
        completed = failed + passed
        dated = datetime.datetime.strptime(request.form['dated'], '%Y%m%d %H:%M:%S.%f').date()
        try:
            conn = get_connection()
            try:
            	with conn.cursor() as cur:
                    cur.execute("SELECT id FROM testcases.testcases WHERE dated = date(%s) and suite = %s and type = %s", (dated.strftime('%Y-%m-%d'), suite, app_type))
                    testcases = cur.fetchone()
                    query = '''
                        UPDATE testcases.testcases SET completed = %s , passed = %s
                        WHERE id = %s
                    '''
                    parameters = [ completed, passed, testcases['id'] ]
            except TypeError:
                with conn.cursor() as cur:
                    cur.execute("SELECT value FROM testcases.settings WHERE name = 'targeted_test_case'")
                    try:
                        settings = cur.fetchone()
                        targeted_count = int(settings['value'])
                    except TypeError:
                        targeted_count = 0
                    query = '''
                        INSERT INTO testcases.testcases (total, completed, passed, dated, suite, type) VALUES
                        (%s, %s, %s, %s, %s, %s)
                    '''
                    parameters = [ targeted_count, completed, passed, dated.strftime('%Y-%m-%d %H:%M:%S'), suite, app_type ]
            conn.cursor().execute(query, parameters)
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
            cur.execute('SELECT id, password FROM testcases.user WHERE username = %s', (username,))
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