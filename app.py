from flask import Flask, jsonify, render_template
import sqlalchemy as sql

app=Flask(__name__)

engine=sql.create_engine('sqlite:///data/db.sqlite')

@app.route('/data')
def return_data(): 
    results=engine.execute('select * from Parks').all()
    parks_list=[]
    for each_result in results: 
        shape=eval(each_result[0])
        parks_list.append(shape)
    return jsonify(parks_list)

@app.route('/')
def home(): 
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
    
    
# import json
# from flask import Flask, jsonify
# from sqlalchemy import create_engine

# app = Flask(__name__)
# engine = create_engine('sqlite:///data/db.sqlite')

# @app.route("/")
# def index():
#     return "Welcome to my Flask app!"

# @app.route("/parks")
# def parks():
#     conn = engine.connect()
#     query = conn.execute('SELECT * FROM Parks')
#     result = [dict(row) for row in query]
#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(debug=True)
  