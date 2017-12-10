from hanaconnection import HanaConnection
import json
from flask import Flask, request
app = Flask(__name__)

HEIGHT_CONSTRAINTS = (30, 120)
WEIGHT_CONSTRAINTS = (5, 400)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/patients')
def get_patients():
    state = request.args.get('state', '')
    gender = request.args.get('gender', '')
    return run_patients_query(state, gender)


@app.route('/bmi')
def hello():
    state = request.args.get('state', '')
    year = request.args.get('year', '')
    gender = request.args.get('gender', '')

    return run_bmi_query(state, gender, year)


@app.route('/visits')
def get_visits():
    state = request.args.get('state', '')
    year = request.args.get('year', '')
    gender = request.args.get('gender', '')
    return run_visits_query(state, gender, year)


@app.route('/visitsrel')
def get_visits_rel():
    state = request.args.get('state', '')
    year = request.args.get('year', '')
    gender = request.args.get('gender', '')
    return run_visits_rel_query(state, gender, year)


@app.route('/patientsrel')
def get_patients_rel():
    state = request.args.get('state', '')
    gender = request.args.get('gender', '')
    return run_patients_rel_query(state, gender)


@app.route('/smoker')
def get_smoker():
    state = request.args.get('state', '')
    year = request.args.get('year', '')
    gender = request.args.get('gender', '')
    return run_smoker_query(state, gender, year)


def run_visits_query(state='', gender='', year=''):
    query = '''SELECT count(TRANSCRIPT."TranscriptGuid"), "State"
        FROM TRANSCRIPT JOIN PATIENT
        ON TRANSCRIPT."PatientGuid" = PATIENT."PatientGuid" '''
    if state:
        query += ''' AND "State"=UPPER(\'{}\') '''.format(state)
    if gender:
        query += ''' AND "Gender"=UPPER(\'{}\') '''.format(gender)
    if year:
        query += ''' AND "VisitYear"= {} '''.format(year)
    query += 'GROUP BY "State"'
    return execute_query(query)


def run_bmi_query(state='', gender='', year=''):
    query = '''SELECT avg("BMI"), "State" FROM

        (SELECT "PatientGuid", avg(BMI) as BMI FROM TRANSCRIPT
        WHERE "Height" BETWEEN {} AND {}
        AND "Weight" BETWEEN {} AND {} '''.format(
            HEIGHT_CONSTRAINTS[0], HEIGHT_CONSTRAINTS[1],
            WEIGHT_CONSTRAINTS[0], WEIGHT_CONSTRAINTS[1])
    if year:
        query += ''' AND "VisitYear"= {} '''.format(year)
    query += ''' GROUP BY "PatientGuid") a

        JOIN PATIENT ON a."PatientGuid" = PATIENT."PatientGuid" '''
    if state:
        query += ''' AND "State"=UPPER(\'{}\') '''.format(state)
    if gender:
        query += ''' AND "Gender"=UPPER(\'{}\') '''.format(gender)
    query += 'GROUP BY "State"'
    return execute_query(query)


def run_patients_query(state='', gender=''):
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
    return execute_query(query)


def run_patients_rel_query(state='', gender=''):
    query = '''select
        count("PatientGuid")/POPULATION as patients,
        "State"
        from "TUKGRP1"."PATIENT"
        JOIN STATE_POPULATION ON STATE_POPULATION.STATE = PATIENT."State"'''
    if state:
        query += ''' AND "State"=UPPER(\'{}\') '''.format(state)
    if gender:
        query += ''' AND "Gender"=UPPER(\'{}\') '''.format(gender)
    query += ''' GROUP BY "State", POPULATION '''
    return execute_query(query)


def run_visits_rel_query(state='', gender='', year=''):
    query = '''SELECT count(TRANSCRIPT."TranscriptGuid")/POPULATION, "State"
        FROM TRANSCRIPT JOIN PATIENT
        ON TRANSCRIPT."PatientGuid" = PATIENT."PatientGuid"
        JOIN STATE_POPULATION ON STATE_POPULATION.STATE = PATIENT."State" '''
    if state:
        query += ''' AND "State"=UPPER(\'{}\') '''.format(state)
    if gender:
        query += ''' AND "Gender"=UPPER(\'{}\') '''.format(gender)
    if year:
        query += ''' AND "VisitYear"= {} '''.format(year)
    query += 'GROUP BY "State", POPULATION'
    return execute_query(query)


def run_smoker_query(state='', gender='', year=''):
    query = '''SELECT count(PATIENT."PatientGuid"), "State", "Description"
        FROM  PATIENT
        JOIN "TUKGRP1"."PATIENTSMOKINGSTATUS"
        ON PATIENTSMOKINGSTATUS."PatientGuid" = PATIENT."PatientGuid"
        JOIN "TUKGRP1"."SMOKINGSTATUS"
        ON SMOKINGSTATUS."SmokingStatusGuid" =
        PATIENTSMOKINGSTATUS."SmokingStatusGuid" '''
    if state:
        query += ''' AND "State"=UPPER(\'{}\') '''.format(state)
    if gender:
        query += ''' AND "Gender"=UPPER(\'{}\') '''.format(gender)
    if year:
        query += ''' AND "EffectiveYear"= {} '''.format(year)
    query += 'GROUP BY "State", "Description"'
    print(query)
    result = []
    with HanaConnection() as conn:
        try:
            conn.execute(query)
            result = [{'state': t[1], 'value': float(t[0]),
                       'description': t[2]}
                      for t in conn.fetchall()]
            print(result)
            result = json.dumps(result)
        except Exception as e:
            print(e)
    return result


def execute_query(query):
    print(query)
    result = []
    with HanaConnection() as conn:
        try:
            conn.execute(query)
            result = [{'state': t[1], 'value': float(t[0])}
                      for t in conn.fetchall()]
            print(result)
            result = json.dumps(result)
        except Exception as e:
            print(e)
    return result

if __name__ == '__main__':
    app.run()
