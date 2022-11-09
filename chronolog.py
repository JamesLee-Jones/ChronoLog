import os.path
import regex as re

import nlp
import argparse

DEFAULT_SPLITS = 10

NUMERAL_PATTERN = re.compile(r"""   
                                    ^M{0,3}
                                    (CM|CD|D?C{0,3})?
                                    (XC|XL|L?X{0,3})?
                                    (IX|IV|V?I{0,3})?\n\n$
                """, re.VERBOSE)
CHAPTER_NUMERAL_PATTERN = re.compile(r"""
                                    (Chapter) 
                                    ^M{0,3}
                                    (CM|CD|D?C{0,3})?
                                    (XC|XL|L?X{0,3})?
                                    (IX|IV|V?I{0,3})?$
                """, re.IGNORECASE)
DIGIT_PATTERN = re.compile(r"""
                                    [0-9]+\n\n
                """, re.VERBOSE)
CHAPTER_DIGIT_PATTERN = re.compile(r"""
                                    Chapter [0-9]+
""", re.VERBOSE, re.IGNORECASE)


def main():
    parser = argparse.ArgumentParser(prog='Chronolog', description="TBD")
    parser.add_argument('filename', type=str)
    parser.add_argument(
        '--chapterRegex', '-c',
        required=False,
        type=str,
        help="""Regex Examples:
                - Chapter + number = chap_num
                - """
    )
    parser.add_argument('--quiet', '-q', required=False, action='store_true')
    parser.add_argument('--title', '-t', required=False, type=str)
    parser.add_argument('--sections', '-s', required=False, type=int)

    args = parser.parse_args()
    with open(args.filename, 'r') as f:
        text = f.read()
    sections = nlp.process_data(text, args.chapterRegex, args.sections or DEFAULT_SPLITS)
    nlp.generate_timeline_json(sections, args.title or os.path.split(args.filname)[-1])


if __name__ == "__main__":
    main()
