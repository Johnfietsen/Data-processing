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

		for j in range(5, len(tmp_lists[i]) - 1):
			GDP_growth = {}
			GDP_growth[tmp_lists[0][0].strip('\"').strip('\n')] = tmp_lists[i][0].strip('\"').strip('\n')
			GDP_growth['year'] = tmp_lists[0][j].strip('\"').strip('\n')
			GDP_growth['GDP_growth'] = tmp_lists[i][j].strip('\"').strip('\n')
			JSON_list.append(GDP_growth)

    # dumps and loads to create JSOn file
	JSON_data = json.loads(json.dumps(JSON_list))

	return JSON_data

output_JSON = convert_CSV_to_JSON(csv_input)

# source: https://stackoverflow.com/questions/12309269/how-do-i-write-json-data-to-a-file
with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Week_6/GDP_growth.json', 'w') as outfile:
    json.dump(output_JSON, outfile)
