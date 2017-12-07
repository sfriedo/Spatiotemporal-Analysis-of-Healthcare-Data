from hanaconnection import HanaConnection
import json
from flask import Flask, request
app = Flask(__name__)


@app.route("/patients")
def get_patients():
    state = request.args.get('state', '')
    gender = request.args.get('gender', '')
    return run_query(state, gender)


@app.route("/bmi")
def hello():
    state = request.args.get('state', '')
    year = request.args.get('year', '')
    gender = request.args.get('gender', '')

    return "Hello World!"


def run_query(state='', gender=''):
    query = '''select
        count("PatientGuid") as patients,
        "State"
        from "TUKGRP1"."PATIENT"'''
    if state:
        query += ''' WHERE "State"=UPPER(\'{}\') '''.format(state)
        if gender:
            query += ''' AND "Gender"=UPPER(\'{}\') '''.format(gender)
    elif gender:
        query += ''' WHERE "Gender"=UPPER(\'{}\') '''.format(gender)
    query += ''' GROUP BY "State" '''
    print(query)
    result = []
    with HanaConnection() as conn:
        try:
            conn.execute(query)
            result = [{'state': t[1], 'patients':t[0]}
                      for t in conn.fetchall()]
            print(result)
            result = json.dumps(result)
        except Exception as e:
            print(e)
    return result
