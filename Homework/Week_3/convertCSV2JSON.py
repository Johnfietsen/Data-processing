# convertCSV2JSON.py
#
# Author:   L.K. Stefelmanns
# Course:   Data processing
# Study:    Minor Programming, University of Amsterdam

'''
Function that takes CSV data (saved in a txt file) and converts it into JSON
data.
'''


import csv
import json


test_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/data_processing/Week 3/sealevel_data.csv', 'r')

def convert_CSV_to_JSON(csv_input):

    tmp_list = []
    JSON_list = []

    for line in csv_input:
        tmp_list.append(line.split(','))

    title_one = str(tmp_list[0][0])
    title_two = str(tmp_list[0][1])

    for i in range(1, len(tmp_list) - 1):
        JSON_list.append({title_one.strip('\n') : tmp_list[i][0].strip('\n'),
                          title_two.strip('\n') : tmp_list[i][1].strip('\n')})

    JSON_data = json.loads(json.dumps(JSON_list))

    return JSON_data

test_JSON = convert_CSV_to_JSON(test_input)

# source: https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/data_processing/Week 3/sealevel_data.json', 'w') as outfile:
    json.dump(test_JSON, outfile)
