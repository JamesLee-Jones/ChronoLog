from flask import Flask, render_template, request, url_for, flash, redirect
import os
import nlp

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("secretkey")

result_params = {}


@app.route('/', methods=('GET', 'POST'))
def book_input():
    if request.method == 'POST':
        title = request.form['title'] or 'Untitled'
        text = request.form['text']

        if not text:
            flash('Text is required!')
        else:
            result_params['title'] = title
            result_params['text'] = nlp.extract_charcaters(text)
            return redirect(url_for('result'))

    return render_template('book_input.html')


@app.route('/result/')
def result():
    return render_template('result.html', result=result_params)


if __name__ == '__main__':
    app.run()
