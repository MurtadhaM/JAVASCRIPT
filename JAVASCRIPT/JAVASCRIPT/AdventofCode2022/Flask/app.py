import flask,templates,os
import Database as db









app = flask.Flask(__name__)
db = db.Database('database.db')

app.run(debug=True)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

@app.route('/')
def home():
    return  flask.render_template('index.html')

@app.route('/login' ,methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        return flask.render_template('index.html')
    elif flask.request.method == 'POST':
        username = flask.request.form['username']
        password = flask.request.form['password']
        
        creds = db.get_user(flask.request.form['username'])
        print(creds)
        if creds.username ==username and creds.password == password:
            flask.session['username'] = username
            return '<h1>Login Successful</h1>'
        else:
            return '<h1>Login Failed</h1>'



@app.route('/register' ,methods=['GET', 'POST'])
def register():
    if flask.request.method == 'GET':
        return flask.render_template('index.html')
    elif flask.request.method == 'POST':
        print(db.add_user(flask.request.form['username'],flask.request.form['password']))
    return '<h1>Register Successful</h1>'    
        
        