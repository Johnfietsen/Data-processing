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


test_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/data_processing/Week 3/sealevel_data.txt', 'r')
test_output = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/data_processing/Week 3/sealevel_data.json', 'w')

def convert_CSV_to_JSON(csv_input):

    tmp_list = []
    JSON_list = []

    for line in csv_input:
        tmp_list.append(line.split(','))

    title_one = str(tmp_list[0][0])
    title_two = str(tmp_list[0][1])

    for i in range(1, len(tmp_list) - 1):
        JSON_list.append({title_one : tmp_list[i][0],
                          title_two : tmp_list[i][1]})

    return JSON_list

test_JSON = convert_CSV_to_JSON(test_input)

test_output = wr
