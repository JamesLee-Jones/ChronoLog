#!/usr/bin/env bash

python -m pip install --upgrade pip
pip install -r requirements.txt
python -m spacy download en_core_web_trf
