from flask import Flask, render_template, request, url_for, flash, redirect, session
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("secretkey")


@app.route('/', methods=('GET', 'POST'))
def book_input():
    if request.method == 'POST':
        title = request.form['title'] or 'Untitled'
        text = request.form['text']

        if not text:
            flash('Text is required!')
        else:
            session['title'] = title
            session['text'] = text
            return redirect(url_for('result'))

    return render_template('book_input.html')


@app.route('/result/')
def result():
    result_params = {'title': session.pop('title'), 'text': session.pop('text')}
    return render_template('result.html', result=result_params)


if __name__ == '__main__':
    app.run()
