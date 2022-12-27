# ChronoLog

Novels often contain many places, characters and organisations each with their own unique names. As the plot thickens,
these can become difficult to follow.
ChronoLog aims to make this easier by generating a timeline of where people are at what times using
[state-of-the-art natural language processing](https://spacy.io/).

## Using ChronoLog

### Using ChronoLog to view pre-processed books

ChronoLog can currently be found hosted [here](https://www.chronolog.co.uk) and contains a set of
visualisations for books that we have pre-processed. For a guide on how to produce a graph from your own text, refer to
the [Using ChronoLog to process and visualise your own text](#using-chronolog-to-process-and-visualise-your-own-text)
section.

### Using ChronoLog to process and visualise your own text

If the book you want to visualise is not included in the [Chronolog library](https://www.chronolog.co.uk/library/), you
can process and visualise the text on your own machine.

The following guide assumes that you are using a Unix-like machine.

1. Clone the ChronoLog repository to your own machine by running the following command in the terminal:  
   `git clone https://github.com/JamesLee-Jones/ChronoLog.git`
2. Navigate to the outermost folder, nlp-timeline-gen  
   `cd nlp-timeline-gen`
3. Save the text you want to process and visualise as a `.txt` file. You can save the text in the `/texts/` folder.  
   For this guide, we will assume we want to process and analyse the text 'The Great Gatsby', saved
   at `/texts/the_great_gatsby.txt`.
4. There is a script in `nlp-timeline-gen` called `chronology.py`.  
   Run `python ./chronolog.py --help` to see detailed information about the script's usage.  
   To briefly summarise, the script takes 1 compulsory argument, `filename` (the path to the text you want to analyse)
   and
   several optional arguments:
    * `--chapterRegex CR`, which specifies how your book starts a new chapter. There are several preset chapter
      formats: `chapter_numeral`, for chapters that look like 'CHAPTER II', `chapter_digit` for chapters that look
      like "CHAPTER 2", `digit` for chapters that look like "2. ", and `numeral` for chapters that look like "II". It is
      also possible to specify your own custom chapter format, but that is beyond the scope of this tutorial.  
      For example, each chapter in 'The Great Gatsby' looks like "II", so we would specify `--chapterRegex numeral`.
      If no `--chapterRegex` argument is given, the program will default to using `--sections`.
    * `--sections N` splits the text into N roughly equal sections for analysis, in the case that the book is not
      chaptered or a chapterRegex is not readily available. This defaults to `N=10`.
    * `--narrator NARRATOR` should be supplied if the text is written in the first person. Supply the full name of the
      narrator character.
      For example, 'The Great Gatsby' is written in first person and the narrator is Nick Carraway, so we should
      specify `--narrator "Nick Carraway"`</ul>
      There are additional optional arguments for refining the analysis that can be found through the `--help` command.
5. Run the script using the appropriate arguments for your text. In our example, this
   is  
   `python ./chronolog.py --chapterRegex numeral --narrator "Nick Carraway texts/the_great_gatsby.txt`.  
Note the expected order: `python ./chronolog.py [optional arguments] [filename]`
6. Wait for the script to finish. There will be frequent updates in the terminal about the current progress of the analysis. Note that this may take several minutes, depending on the length of the text.
7. When the script terminates, the analysis is finished. You can now proceed to visualising the text.
## Guide for Developers

The following guide assumes that you are using Linux for development.

The `scripts` directory contains a number of useful commands for developers. These scripts should be run from the root
of the repository via `./scripts/<script-name>.sh` for shell scripts, and `python ./scripts/<script-name>.py` for
python scripts.

To make use of these commands, you must have created a python virtual environment by running `python3 -m venv venv` in
the root the repository and activating it with `. ./venv/bin/activate`. After this, run `./scripts/setup.sh` to install
the necessary requirements and machine learning model.

The commands that can be run in the `scripts` directory are:

- `check_json_formatting.sh`: This uses `jq` to check that the json files output by the backend are correctly formatted.
- `check_py_format.sh`: This uses `flake8` to ensure that all python source files are formatted correctly.
  This check is run in the deployment pipeline.
- `fix_py_format.sh`: This command formats all python source files to the same standard required by `check_py_format.sh`
  using `autopep8`.
- `regenerate_single_test_result.py`: This takes in a test case from the `tests/books` directory and regenerates
  the expected output matrix in `tests/matrices`. This should only be done if you are certain the changes you have made
  are correct.
- `regenerate_test_results.py`: This acts the same as the above command, but will regenerate the expected matrices for
  all examples in the `tests/books` directory.
- `run_py_tests.sh`: This will run all of the `pytest` unit tests in the `tests` directory.

---

Created as part of the 3rd year software engineering group project at Imperial College London.