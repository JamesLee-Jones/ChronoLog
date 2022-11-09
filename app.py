from flask import Flask, render_template, request, url_for, flash, redirect, session, Blueprint
import os
import nlp

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
            session['text'] = nlp.extract_characters(text)
            nlp.generate_interactions_matrix(text, title)

            return redirect(url_for('user.result'))

    return render_template('book_input.html')


@user.route('/result/')
def result():
    result_params = {"title": session['title'], 'text': session['text']}
    return render_template('result.html', result=result_params)


if __name__ == '__main__':
    create_app().run()