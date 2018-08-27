# -*- coding: utf-8 -*-
import sqlite3
db = sqlite3.connect('membersdb.sqlite')

db.execute('''CREATE TABLE members(
    id integer PRIMARY KEY,
    cardnumber text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
	rewardpoint integer NOT NULL,
	contactnumber text NOT NULL,
	membership integer NOT NULL)''')

cursor = db.cursor()

cursor.execute('''INSERT INTO members(cardnumber,password,name,rewardpoint,contactnumber,membership)VALUES("1234","1234","Admin","999999","019-9999999","2177337600000")''')
cursor.execute('''INSERT INTO members(cardnumber,password,name,rewardpoint,contactnumber,membership)VALUES("629843599027","pariya555","Pariya Chaleepote","500","012-3456789","1568476800000")''')


db.commit()
db.close()