#!/usr/bin/env bash

flake8 --exclude venv,env,client . --count --max-complexity=10 --max-line-length=127 --statistics
