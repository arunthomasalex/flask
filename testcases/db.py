import pymysql

# from flask import current_app, g

def get_connection():
    return pymysql.connect(host='localhost', user='root', password='root', db='testcases', cursorclass=pymysql.cursors.DictCursor)
