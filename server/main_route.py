from server import app 
from flask import render_template

@app.route('/')
def main_route():
    return render_template('index.html')