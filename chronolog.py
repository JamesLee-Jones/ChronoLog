import os.path

import nlp
import argparse

DEFAULT_SPLITS = 10


def main():
    parser = argparse.ArgumentParser(prog='Chronolog', description="TBD")
    parser.add_argument('filename', type=str)
    parser.add_argument('--chapterRegex', '-c', required=False, type=str)
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
