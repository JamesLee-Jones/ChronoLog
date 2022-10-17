from flask import Flask, render_template, request, url_for, flash, redirect, session, current_app, Blueprint
import os

user = Blueprint('user', __name__)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ['secretkey']

    app.register_blueprint(user)

    return app


@user.route('/', methods=('GET', 'POST'))
def book_input():
    if request.method == 'POST':
        title = request.form['title'] or 'Untitled'
        text = request.form['text']

        if not text:
            flash('Text is required!')
        else:
            session['title'] = title
            session['text'] = text
            return redirect(url_for('user.result'))

    return render_template('book_input.html')


@user.route('/result/')
def result():
    result_params = {"title": session['title'], 'text': session['text']}
    return render_template('result.html', result=result_params)


if __name__ == '__main__':
    current_app.run()
