# ChronoLog

Novels often contain many places, characters and organisations each with their own unique names. As the plot thickens,
these can become difficult to follow.
ChronoLog aims to make this easier by generating a timeline of where people are at what times using 
[state-of-the-art natural language processing](https://spacy.io/).

## Using ChronoLog

### Using ChronoLog to view pre-processed books

ChronoLog can currently be found hosted [here](https://www.chronolog.co.uk) and contains a set of
visualisations for books that we have pre-processed. For a guide on how to produce a graph from your own text, refer to
the [Using ChronoLog to process and view your own text](#using-chronolog-to-process-and-view-your-own-text) section.

### Using ChronoLog to process and view your own text

TODO(#58)

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
the expected output matrix in `tests/matrices`. This should only be done if you are certain the changes you have made are correct.
- `regenerate_test_results.py`: This acts the same as the above command, but will regenerate the expected matrices for
all examples in the `tests/books` directory.
- `run_py_tests.sh`: This will run all of the `pytest` unit tests in the `tests` directory.

---

Created as part of the 3rd year software engineering group project at Imperial College London.