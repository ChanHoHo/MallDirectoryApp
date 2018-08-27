import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'membersdb.sqlite'

def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'cardnumber': row[1],
		'password': row[2],
        'name': row[3],
		'rewardpoint': row[4],
		'contactnumber': row[5],
        'membership': row[6], 
    }

    return row_dict


app = Flask(__name__)

@app.route('/api/members', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM members')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200


@app.route('/api/members/<int:member>', methods=['GET'])
def show(member):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM members WHERE id=?', (str(member),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200
		

@app.route('/api/members/<int:member>', methods=['PUT'])
def update(member):
    if not request.json:
        abort(400)

    if 'id' not in request.json:
        abort(400)

    if int(request.json['id']) != member:
        abort(400)

    update_member = (
        request.json['password'],
        request.json['contactnumber'],
        str(member),
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE members SET
            password=?,contactnumber=?
        WHERE id=?
    ''', update_member)

    db.commit()

    response = {
        'id': member,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201
	
@app.route('/api/members/login', methods=['POST'])
def login():
    if not request.json:
        abort(400)

    if 'cardnumber' not in request.json:
        abort(400)

    login_info = (
        request.json['cardnumber'],
        request.json['password'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('Select id FROM members WHERE cardnumber=? and password=?', login_info)

    row = cursor.fetchone()
    db.close()

    if row:
        return jsonify(row), 200
    else:
        return jsonify(None), 200

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)