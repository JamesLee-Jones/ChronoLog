#!/usr/bin/env bash

pytest ./tests --doctest-modules --junitxml=./output/test-results.xml --cov=../ --cov-report=xml:output/coverage.xml
