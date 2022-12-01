import subprocess
import os
import sys

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

INPUT_DIRECTORY = 'texts/'
OUTPUT_DIRECTORY = 'timelines/'

chapter_regex = {
    "alices_adventures_in_wonderland.txt": ['-c', 'chapter_numeral'],
    "anne_of_green_gables.txt": ['-c', 'chapter_numeral'],
    "a_christmas_carol.txt": ['-c', 'STAVE'],
    "dr_jekyll_and_mr_hyde.txt": ['-s', '10'],
    "jane_eyre.txt": ['-c', 'chapter_numeral', "-n", "Jane Eyre"],
    "little_women.txt": ['-c', 'CHAPTER '],
    "pride_and_prejudice.txt": ['-c', 'chapter_numeral'],
    "winnie_the_pooh.txt": ['-c', 'chapter_numeral']
}

if __name__ == '__main__':
    env = os.environ.copy()
    env['PYTHONPATH'] = os.pathsep.join(sys.path)
    for file in os.listdir(INPUT_DIRECTORY):
        try:
            if file in chapter_regex:
                cr = chapter_regex[file]
            else:
                print("No chapter regex found for {}. Defaulting to 'CHAPTER'.".format(file))
                cr = ['-c', 'CHAPTER ']
            sb = subprocess.run(["python", ".\\chronolog.py", "texts\\" + file] + cr, env=env,
                                check=True)
        except subprocess.CalledProcessError:
            print("Error occurred whilst processing {}.".format(file))
    subprocess.run(["python", ".\\chronolog.py", "texts\\" + "little_women.txt", "-s 20", "-t little_women_sectioned"],
                   env=env)
