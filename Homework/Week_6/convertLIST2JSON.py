# convertLIST2JSON.py
#
# Author:   L.K. Stefelmanns
# Course:   Data processing
# Study:    Minor Programming, University of Amsterdam

'''
Function that takes list of data (saved in a txt file) and converts it into JSON
data.
'''


import csv
import json


list_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/RTAs.txt', 'r')

def convert_LIST_to_JSON(list_input):

	tmp_links = []
	tmp_nodes = []

	nodes = []
	links = []

	JSON_dict = {}

	for line in list_input:
	    tmp_links.append(line.split('-'))

	j = 1
	for i in range(len(tmp_links)):
		duo = []
		for country in tmp_links[i]:
			country = country.strip('\n').strip(' ')
			if country not in tmp_nodes:
				tmp_nodes.append(country)
				nodes.append({'id' : j, 'name' : country})
				j += 1
			duo.append(country)
		tmp_links[i] = duo

	for link in tmp_links:

		link1 = None
		link2 = None

		for i in range(len(tmp_nodes)):
			if link[0] == tmp_nodes[i]:
				link1 = i + 1
			if link[1] == tmp_nodes[i]:
				link2 = i + 1

		links.append({"source_id": link1, "target_id" : link2})



	JSON_dict = {'nodes' : nodes, 'links' : links}


	return JSON_dict

JSON_dict = convert_LIST_to_JSON(list_input)

JSON_output = json.loads(json.dumps(JSON_dict))

with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Week_6/RTAs.json', 'w') as outfile:
    json.dump(JSON_output, outfile)
