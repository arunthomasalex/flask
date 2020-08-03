import imp
import click
from testcases import create_app, db

app = create_app()

def initialize_db(app):
    init_db = getattr(__import__(app), 'init_db')
    init_db()

def start_app(app, port):
    create_app = getattr(__import__(app), 'create_app')
    create_app().run(port=port)

@click.command()
@click.option('--app', help='Name of the application to run.')
@click.option('--port', default=5000, help='Specify a port for the application to run.', show_default=True)
@click.option('--initdb', is_flag=True, help='Intialize the db for specified application.')
def run_command(app, initdb, port):
    if initdb:
        initialize_db(app)
    else:
        start_app(app, port)

if __name__ == '__main__':
    app.run(port=8000, debug=True)