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


# csv_input1 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/KNMI_19011231.txt', 'r')
csv_input2 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/KNMI_19621231.txt', 'r')
csv_input3 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/KNMI_20161231.txt', 'r')

def convert_CSV_to_JSON(csv_input):

    tmp_list = []
    JSON_list = []

    for line in csv_input:
        tmp_list.append(line.split(','))

    title_one = str(tmp_list[0][1]).strip(' ').strip('\n')
    title_two = str(tmp_list[0][2]).strip(' ').strip('\n')
    title_thr = str(tmp_list[0][3]).strip(' ').strip('\n')
    title_fou = str(tmp_list[0][4]).strip(' ').strip('\n')

    for i in range(1, len(tmp_list)):
        JSON_list.append({"year" : tmp_list[i][1][0:4].strip(' ').strip('\n'),
						  title_one : tmp_list[i][1][4:8].strip(' ').strip('\n'),
                          title_two : tmp_list[i][2].strip(' ').strip('\n'),
                          title_thr : tmp_list[i][3].strip(' ').strip('\n'),
                          title_fou : tmp_list[i][4].strip(' ').strip('\n')})

    return JSON_list

# JSON_list1 = convert_CSV_to_JSON(csv_input1)
JSON_list2 = convert_CSV_to_JSON(csv_input2)
JSON_list3 = convert_CSV_to_JSON(csv_input3)
JSON_output = json.loads(json.dumps(JSON_list2 + JSON_list3))

# source: https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Week_5/KNMI_data.json', 'w') as outfile:
    json.dump(JSON_output, outfile)
