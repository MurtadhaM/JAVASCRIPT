import flask,templates,os 







app = flask.Flask(__name__)
app.run(debug=True)

@app.route('/')
def home():
    return  flask.render_template('index.html')

