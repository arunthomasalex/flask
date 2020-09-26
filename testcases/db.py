import pymysql
from config import ( DB_HOST, DB_USERNAME, DB_PASSWORD, DB )

# from flask import current_app, g

def get_connection():
    return pymysql.connect(
        host = DB_HOST, 
        user = DB_USERNAME, 
        password = DB_PASSWORD, 
        db = DB, 
        cursorclass = pymysql.cursors.DictCursor
    )
