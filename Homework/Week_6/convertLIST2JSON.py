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


RTA_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/RTAs.txt', 'r')
trade_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/trade_ofGDP.csv', 'r')
GDP_input = open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Datasets/GDP_total.csv', 'r')


def convert_LIST_to_JSON(RTA_input, trade_input, GDP_input):

	tmp_links = []
	tmp_nodes = []

	tmp_trade = []
	tmp_GDP = []
	del_list = []

	nodes = []
	links = []

	JSON_dict = {}

	for line in RTA_input:
	    tmp_links.append(line.split('-'))

	for line in trade_input:
		tmp_trade.append(line.split(','))

	for line in GDP_input:
		tmp_GDP.append(line.split(','))

	for i in range(len(tmp_trade)):
		for j in range(len(tmp_trade[i])):
			tmp_trade[i][j] = tmp_trade[i][j].strip('\"')

	for i in range(len(tmp_GDP)):
		for j in range(len(tmp_GDP[i])):
			tmp_GDP[i][j] = tmp_GDP[i][j].strip('\"')

	for i in range(len(tmp_trade) - 1):
		if len(tmp_trade[i]) < 4:
			del_list.append(i)

	for i in range(len(del_list)):
		del tmp_trade[del_list[i] - i]


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

	for country in nodes:
		country['trade_ofGDP'] = 'Unknown'
		for line in tmp_trade:
			if country['name'] == line[0]:
				if line[58] == '':
					country['trade_ofGDP'] = 'Unknown'
				else:
					country['trade_ofGDP'] = float(line[58])

	for country in nodes:
		country['GDP_total'] = 10000000000
		for line in tmp_GDP:
			if country['name'] == line[0]:
				if line[58] == '':
					country['GDP_total'] = 10000000000
				else:
					country['GDP_total'] = float(line[58])


	for country in nodes:
		print(country)


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


JSON_dict = convert_LIST_to_JSON(RTA_input, trade_input, GDP_input)

JSON_output = json.loads(json.dumps(JSON_dict))

with open('C:/Users/lucst/Desktop/Minor programmeren/GitHub/Data_Processing/Homework/Week_6/RTAs.json', 'w') as outfile:
    json.dump(JSON_output, outfile)
