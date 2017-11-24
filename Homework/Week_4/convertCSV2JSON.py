#
# convertCSV2JSON.py
#
# Author:   L.K. Stefelmanns
# Course:   Data processing
# Study:    Minor Programming, University of Amsterdam
#

'''
Function that takes CSV data (saved in a txt file) and converts it into JSON
data.
'''


import csv
import json


input1 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/CO2_emissions.csv', 'r')
input2 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/GDP_growth.csv', 'r')
input3 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/GDP_total.csv', 'r')
input4 = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/metadata.csv', 'r')

def convert_CSV_to_JSON(csv_input1, csv_input2, csv_input3, csv_input4):

    tmp_list1 = []
    tmp_list2 = []
    tmp_list3 = []
    tmp_list4 = []
    JSON_list = []

    for line in csv_input1:
        tmp_list1.append(line.split(','))
    for line in csv_input2:
        tmp_list2.append(line.split(','))
    for line in csv_input3:
        tmp_list3.append(line.split(','))
    for line in csv_input4:
        tmp_list4.append(line.split(','))


    for i in range(5, len(tmp_list4) - 1):

        # if tmp_list4[i][2] is '':
        #     tmp_list4[i][2] = 'Unknown'

        if (tmp_list1[i][0].strip('\"') is not '' and
           tmp_list1[i][58].strip('\"') is not '' and
           tmp_list3[i][58].strip('\"') is not '' and
           float(tmp_list3[i][58].strip('\"')) > 200000000000 and
           tmp_list4[i][2].strip('\"') is not ''):

           JSON_list.append({'country_name' : tmp_list1[i][0].strip('\"'),
                             'COtwo' : tmp_list1[i][58].strip('\"'),
                             'GDP_growth' : tmp_list2[i][58].strip('\"'),
                             'GDP_total' : tmp_list3[i][58].strip('\"'),
                             'income_category' : tmp_list4[i][2].strip('\"')})


    JSON_data = json.loads(json.dumps(JSON_list))

    return JSON_data

test_JSON = convert_CSV_to_JSON(input1, input2, input3, input4)

# source: https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Week_4/scatterplot.json', 'w') as outfile:
    json.dump(test_JSON, outfile)
