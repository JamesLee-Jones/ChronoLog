import subprocess
import os
import sys

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

INPUT_DIRECTORY = 'texts/'
OUTPUT_DIRECTORY = 'timelines/'

chapter_regex = {
    "alices_adventures_in_wonderland.txt": ['-c', 'chapter_numeral', '-p', '30', '-a', 'Lewis Carroll', '-t', 'Alice\'s Adventures in Wonderland'],
    "anne_of_green_gables.txt": ['-c', 'chapter_numeral', '-a', 'L. M. Montgomery'],
    "a_christmas_carol.txt": ['-c', 'STAVE', '-a', 'Charles Dickens'],
    "dr_jekyll_and_mr_hyde.txt": ['-s', '10', '-a', 'Robert Louis Stevenson'],
    "jane_eyre.txt": ['-c', 'chapter_numeral', "-n", "Jane Eyre", '-a', 'Charlotte Bronte'],
    "little_women.txt": ['-c', 'CHAPTER ', '-a', 'Louisa May Alcott'],
    "pride_and_prejudice.txt": ['-c', 'chapter_numeral', '-a', 'Jane Austen'],
    "winnie_the_pooh.txt": ['-c', 'chapter_numeral', '-a', 'A. A. Milne']
}

if __name__ == '__main__':
    env = os.environ.copy()
    env['PYTHONPATH'] = os.pathsep.join(sys.path)
    for file in os.listdir(INPUT_DIRECTORY):
        print("Processing {}.".format(file))
        if file in chapter_regex:
            cr = chapter_regex[file]
        else:
            print("No chapter regex found for {}. Defaulting to 'CHAPTER'.".format(file))
            cr = ['-c', 'CHAPTER ']
        try:
            sb = subprocess.run(["python", ".\\chronolog.py", "-r", "texts\\" + file] + cr, env=env,
                                check=True)
        except subprocess.CalledProcessError:
            # Try macOS formatting
            try:
                sb = subprocess.run(["python", "./chronolog.py", "-r", "texts/" + file] + cr, env=env,
                                    check=True)
            except subprocess.CalledProcessError:
                print("Error occurred whilst processing {}.".format(file))
