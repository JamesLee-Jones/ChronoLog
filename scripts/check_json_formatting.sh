#!/usr/bin/env bash

return_code=0
for FILE in `ls ./tests/books/*.json`
do
  jq . "tests/books/$FILE"
  exit_code=$?
    if [ $exit_code -ne 0 ]; then
      echo "$FILE could not be parsed."
      return_code=1
    fi
done
exit $return_code

