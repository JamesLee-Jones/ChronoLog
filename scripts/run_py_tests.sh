#!/usr/bin/env bash

pytest ../tests --doctest-modules --junitxml=../test-results.xml --cov=../ --cov-report=xml:../coverage.xml
