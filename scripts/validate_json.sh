#!/usr/bin/env bash

for FILE in `ls ./tests/books`
do
  jq . "tests/books/$FILE"
  exit_code=$?
    if [ $exit_code -ne 0 ]; then
      echo "$FILE could not be parsed."
    fi
done