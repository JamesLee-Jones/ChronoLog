#!/usr/bin/env bash

# stop the build if there are Python syntax errors or undefined names
flake8 --exclude venv,env . --count --select=E9,F63,F7,F82 --show-source --statistics
# exit-zero treats all errors as warnings
flake8 --exclude venv,env . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
