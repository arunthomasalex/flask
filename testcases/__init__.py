import os
from datetime import timedelta
from flask import Flask
from flask_cors import CORS

from . import db, auth, testcase

def create_app(test_config = None):
    app = Flask(__name__, static_folder='static', static_url_path='/', instance_relative_config=True)
    app.config['APPLICATION_ROOT'] = 'testcase'
    CORS(app, resources={r"/api/*": { "origins": "*" }})

    app.permanent_session_lifetime = timedelta(minutes=5)

    try:
        env = os.environ['FLASK_ENV']
    except KeyError:
        env = ''

    if test_config is not None:
        app.config.from_mapping(test_config)
    else:
        app.config.from_envvar('FLASK_CONFIG')
        # app.config.from_object('config.{}Config'.format(env.capitalize()))

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(auth.bp)
    app.register_blueprint(testcase.bp)
    app.add_url_rule('/', endpoint='index')
    return app

def init_db():
    db.init_db_command()