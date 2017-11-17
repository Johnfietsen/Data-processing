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
    title_list = []

    for line in csv_input:
        tmp_list.append(line.split(','))

    for i in range(1, len(tmp_list) - 1):
        JSON_list.append({})

    for i in range(len(tmp_list[0])):
        title_list.append(str(tmp_list[0][i]).strip('\n'))

        for j in range(1, len(tmp_list) - 1):
            JSON_list[j][title_list[i]] = tmp_list[j][i].strip('\n')

    JSON_data = json.loads(json.dumps(JSON_list))

    return JSON_data

test_JSON = convert_CSV_to_JSON(test_input)

# source: https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/data_processing/Week 3/sealevel_data.json', 'w') as outfile:
    json.dump(test_JSON, outfile)
