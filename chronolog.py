import os.path
import regex as re

import backend.nlp as nlp
from argparse import RawTextHelpFormatter, ArgumentParser

DEFAULT_SPLITS = 10

# Just chapter number as roman numeral, e.g. IX
NUMERAL_PATTERN = re.compile(
    r"""M{0,3}(?:CM|CD|D?C{0,3})?(?:XC|XL|L?X{0,3})?(?:IX|IV|V?I{0,3})?\n\n$""",
    re.IGNORECASE)
# Chapter with roman numeral, e.g. Chapter IX
CHAPTER_NUMERAL_PATTERN = re.compile(
    r"""(?:Chapter M{0,3}(?:CM|CD|D?C{0,3})?(?:XC|XL|L?X{0,3})?(?:IX|IV|V?I{0,3})?)""",
    re.IGNORECASE)
# Just chapter number, e.g. 9
DIGIT_PATTERN = re.compile(r"""[0-9]+\n\n""", re.VERBOSE)
# Chapter with number, e.g. Chapter 9
CHAPTER_DIGIT_PATTERN = re.compile(r"""Chapter [0-9]+""", re.IGNORECASE)

PATTERNS_DICT = {
    "numeral": NUMERAL_PATTERN,
    "chapter_digit": CHAPTER_DIGIT_PATTERN,
    "chapter_numeral": CHAPTER_NUMERAL_PATTERN,
    "digit": DIGIT_PATTERN}


def main():
    parser = ArgumentParser(
        formatter_class=RawTextHelpFormatter,
        prog='Chronolog',
        description="""Chronolog Book Processor Version 0.0.1"""
    )
    parser.add_argument('filename', type=str)
    parser.add_argument(
        '--chapterRegex', '-c',
        required=False,
        type=str,
        metavar="CR",
        help="""Regex Options:
                - chapter_numeral   = Chapter + numeral
                - chapter_digit     = Chapter + digit
                - digit             = Digit only
                - numeral           = Numeral only
                You may provide your own alternative chapter regex in the form of a regex string.
                Please make sure your regex is well-formed to avoid undesirable results.
                Note that in any user-defined regex, there must be NO capturing groups.
                """
    )
    parser.add_argument('--quiet', '-q', required=False, action='store_true',
                        help="Suppresses updates on progress of model.")
    parser.add_argument(
        '--title',
        '-t',
        required=False,
        type=str,
        metavar="T",
        help="Provide novel title, if it is not the same as the file name. " +
        "The analysis will be stored in {title}_analysis.json if this argument is given.")
    parser.add_argument(
        '--sections',
        '-s',
        required=False,
        type=int,
        metavar="N",
        default=DEFAULT_SPLITS,
        help="Supply the number of sections you want to divide your book into. " +
        "The timeline will then be created in N similar sized sections. Default N = {}.".format(DEFAULT_SPLITS))

    args = parser.parse_args()
    with open(args.filename, 'r') as f:
        text = f.read()
    if args.chapterRegex in PATTERNS_DICT:
        pattern = PATTERNS_DICT[args.chapterRegex]
    elif args.chapterRegex:
        pattern = re.compile(args.chapterRegex)
    else:
        pattern = None

    title = args.title or os.path.split(args.filename)[-1].split(".")[0]
    sections = nlp.process_data(
        text,
        pattern,
        args.sections or DEFAULT_SPLITS,
        args.quiet)
    nlp.generate_timeline_json(sections, title, args.quiet)


if __name__ == "__main__":
    main()
