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

# opens the 4 datasets used
csv_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/GDP_growth.csv', 'r')

def convert_CSV_to_JSON(csv_input):

	tmp_lists = []
	del_list = []
	JSON_list = []

	for line in csv_input:
		tmp_lists.append(line.split(','))

	for i in range(len(tmp_lists) - 1):
		if len(tmp_lists[i]) < 4:
			del_list.append(i)

	for i in range(len(del_list)):
		del tmp_lists[del_list[i] - i]

	for i in range(1, len(tmp_lists) - 1):
		country = {}

		for j in range(len(tmp_lists[i]) - 1):
			country[tmp_lists[0][j].strip('\"')] = tmp_lists[i][j].strip('\"')

		JSON_list.append(country)

    # dumps and loads to create JSOn file
	JSON_data = json.loads(json.dumps(JSON_list))

	return JSON_data

output_JSON = convert_CSV_to_JSON(csv_input)

# source: https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Week_6/GDP_growth.json', 'w') as outfile:
    json.dump(output_JSON, outfile)
