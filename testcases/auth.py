import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_connection

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id is None:
        g.username = None
    else:
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute('SELECT username FROM testcases.user WHERE id = %s', (user_id,))
                user = cur.fetchone()
                if user is not None:
                    g.username = user['username']
        finally:
            conn.close()

@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None
        try:
            conn = get_connection()
            if not username:
                error = 'Username is required.'
            elif not password:
                error = 'Password is required.'
            else:
                with conn.cursor() as cur:
                    cur.execute('SELECT id FROM testcases.user WHERE username = %s', (username,))
                    user = cur.fetchone()
                    if user is not None:
                        error = 'User {} is already registered.'.format(username)
            if error is None:
                with conn.cursor() as cur:
                    cur.execute('INSERT INTO testcases.user (username, password) VALUES (%s, %s)', (username, generate_password_hash(password)))
                conn.commit()
            else:
                flash(error)
                return render_template('auth/register.html')
        finally:
            conn.close()
    return redirect(url_for('auth.login'))

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute('SELECT id, password FROM testcases.user WHERE username = %s', (username,))
                user = cur.fetchone()
                if user is None:
                    error = 'Incorrect username.'
                elif not check_password_hash(user['password'], password):
                    error = 'Incorrect password.'
        finally:
            conn.close()

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))
        flash(error)
    return render_template('auth/login.html')

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.username is None:
            return redirect(url_for('auth.login'))
        return view(**kwargs)
    return wrapped_view
